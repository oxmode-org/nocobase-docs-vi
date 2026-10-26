---
title: Truy vấn và thao tác dữ liệu
description: Dùng Repository cho bản ghi nghiệp vụ, quan hệ, phân trang, transaction và thao tác hàng loạt, và biết khi nào nên dùng Query.
---

Hãy bắt đầu truy cập dữ liệu bằng Repository. Nó hiểu các field và quan hệ của Collection, hỗ trợ đọc, tạo và thay đổi bản ghi nghiệp vụ. Query làm việc trên bảng và tập kết quả, dành cho báo cáo và phép tổng hợp mà Repository không diễn đạt được. Cả hai đều yêu cầu nơi gọi xác lập danh tính và quyền trước.

Các đoạn mã chạy trên server của ứng dụng và dùng `tutorialProjects` cùng `tutorialTasks` từ [Mô hình dữ liệu và migration](data-models-and-migrations.md). Ứng dụng ví dụ dùng template mặc định `1.0.0-beta.78`. Đây là một ví dụ dự án lịch sử riêng, không phải ứng dụng bắt đầu sử dụng hiện tại với bảng `tasks`. Đây là các đoạn trích về truy cập dữ liệu; phần route, phân quyền và đăng ký service đầy đủ nằm trong [Dịch vụ nghiệp vụ và HTTP API](apis-and-services.md).

## Cùng Agent

```text
Hãy cải thiện các truy vấn danh sách dự án hiện có để tìm kiếm, sắp xếp và phân trang luôn nhất quán.

Chỉ trả về các dự án người dùng hiện tại được xem, và chỉ đếm các dự án đó.
Tìm theo tên và mặc định mới nhất lên đầu. Giữ thứ tự ổn định khi thời gian tạo trùng nhau.
Cho phép tối đa 100 bản ghi mỗi trang; từ chối số trang âm và các request lấy toàn bộ danh sách không giới hạn.

Khi đổi dự án của một công việc, hãy kiểm tra quyền với cả công việc lẫn dự án đích.
Nếu bước nào thất bại, giữ nguyên cách gán cũ, không lưu dở dang.
Dùng cơ sở dữ liệu thật để kiểm tra tìm kiếm, phân trang, phạm vi quyền và dữ liệu sau khi thất bại. Không thay đổi các quyền đã cấp cho người dùng.
```

## Không dùng Agent

### Lấy Repository

Phân giải database một lần trong route factory, hoặc inject vào một business service qua constructor:

```ts
import { databaseManagerToken } from '@nocobase/db';

const database = app.container.resolve(databaseManagerToken);
```

`database.repository('tutorialProjects')` dùng kết nối mặc định và tên logic của Collection. Đừng đoán tên bảng vật lý hay để lộ service database cho trình duyệt.

Repository không tự suy ra người dùng của request hiện tại. Với request từ bên ngoài, hãy lấy một `RepositoryPolicy` từ phần phân quyền và gắn phạm vi bản ghi cùng quyền với field bằng `withPolicy()`. Bộ lọc do người dùng cung cấp có thể thu hẹp phạm vi đó nhưng không phải bằng chứng phân quyền.

### Lọc, sắp xếp và phân trang

Hàm này nhận các tham số phân trang đã kiểm tra và read policy hiện tại. Đặt nó trong một business service; endpoint kiểm tra trước `page >= 1`, `1 <= pageSize <= 100` và độ dài chuỗi tìm kiếm:

```ts
import type {
  DatabaseManager,
  RepositoryFilter,
  RepositoryPolicy,
} from '@nocobase/db';

export async function listProjects(
  database: DatabaseManager,
  policy: RepositoryPolicy,
  input: { page: number; pageSize: number; q?: string },
) {
  const projects = database.repository('tutorialProjects').withPolicy(policy);
  const filter: RepositoryFilter<Record<string, unknown>> = (f) =>
    f.and(input.q ? [f.string('name').includes(input.q)] : []);

  const data = await projects.findMany({
    filter,
    select: (s) => s.fields('id', 'name', 'createdAt'),
    sort: (s) => [s.field('createdAt').desc(), s.field('id').desc()],
    limit: input.pageSize,
    offset: (input.page - 1) * input.pageSize,
  });
  const total = await projects.count({ filter });
  return { data, meta: { page: input.page, pageSize: input.pageSize, total } };
}
```

Các dòng và tổng số dùng cùng Repository và bộ lọc. Chỉ lọc các dòng sẽ làm lộ số lượng ngoài phạm vi được phép và tạo ra các trang sai. Field sắp xếp thứ hai, `id`, giúp thứ tự xác định khi timestamp bằng nhau; nó không có nghĩa UUID tăng theo thời gian.

Hai truy vấn phân trang không được đảm bảo dùng chung một snapshot cơ sở dữ liệu. Thay đổi đồng thời có thể tạm thời ảnh hưởng đến tổng số và trang hiện tại. Khi cần, hãy thiết kế riêng tính nhất quán theo snapshot hoặc phân trang bằng cursor; tải toàn bộ dữ liệu rồi cắt trên trình duyệt không thay thế được phân trang phía server.

### Đọc quan hệ

Sau khi một migration khai báo `tutorialTasks.project`, hãy đọc quan hệ qua selector:

```ts
const task = await database
  .repository('tutorialTasks')
  .withPolicy(taskPolicy)
  .findOne({
    filter: { id: taskId },
    select: (s) =>
      s
        .fields('id', 'title', 'projectId')
        .include('project', (p) => p.fields('id', 'name')),
  });
```

`taskPolicy` phải cho phép đọc các field và quan hệ tương ứng; `include()` không phải là phân quyền. Nếu công việc và dự án cần phạm vi thao tác riêng, hãy gắn và truy vấn từng policy riêng, như khi gán dự án. Đọc được một công việc không có nghĩa là truy cập được mọi dự án.

Chọn rõ các field trả về. Ưu tiên quan hệ đã khai báo thay vì join viết tay làm trùng lặp ánh xạ field và quy tắc quan hệ.

### Tạo, cập nhật và xóa

| Nhu cầu | Phương thức Repository | Hành vi cần lưu ý |
| --- | --- | --- |
| Đọc một bản ghi | `findOne()` | Trả về bản ghi khớp đầu tiên, có thể không có bản ghi nào |
| Tạo một bản ghi | `createOne()` | Trả về kết quả thay đổi; bản ghi nằm ở `result.record` |
| Cập nhật hoặc xóa một bản ghi | `updateOne()`, `deleteOne()` | Yêu cầu đúng một bản ghi trong phạm vi |
| Tạo nhiều bản ghi | `createMany()` | Không hỗ trợ ghi quan hệ lồng nhau |
| Cập nhật hoặc xóa hàng loạt | `updateMany()`, `deleteMany()` | Yêu cầu phạm vi rõ ràng; đừng dùng `all: true` để vượt qua lỗi phạm vi trống |

Đoạn trích service này cập nhật trạng thái hoàn thành. `taskId` đã được kiểm tra và `updatePolicy` đến từ phần phân quyền cho action đó:

```ts
const result = await database
  .repository('tutorialTasks')
  .withPolicy(updatePolicy)
  .updateOne({
    filter: { id: taskId },
    values: { completed: true, updatedAt: new Date() },
    select: (s) => s.fields('id', 'completed', 'updatedAt'),
  });
const savedTask = result.record;
```

Tạo `values` từ một danh sách field được phép rõ ràng thay vì truyền toàn bộ body của request. Thao tác hàng loạt vẫn cần dữ liệu đầu vào đã kiểm tra, policy, giới hạn kích thước và quyết định giữa tất cả hoặc không gì cả với thành công một phần. Một phương thức kết thúc bằng `Many` không quyết định thay bạn những điều đó.

### Gom thao tác vào một transaction

Dùng transaction cho các thao tác phải cùng thành công hoặc cùng thất bại, và lấy mọi thao tác từ `connection` của callback:

```ts
await database.transaction(async (connection) => {
  const tasks = connection.repository('tutorialTasks').withPolicy(taskPolicy);
  const projects = connection
    .repository('tutorialProjects')
    .withPolicy(projectPolicy);

  const task = await tasks.findOne({ filter: { id: taskId } });
  if (!task) throw new Error('Task unavailable.');
  const project = await projects.findOne({ filter: { id: projectId } });
  if (!project) throw new Error('Project unavailable.');

  await tasks.updateOne({
    filter: { id: taskId },
    values: { projectId, updatedAt: new Date() },
  });
});
```

Ví dụ này minh họa cấu trúc của transaction. Service production dùng các lỗi nghiệp vụ phân biệt được, được route chuyển thành lỗi API; xem [Dịch vụ nghiệp vụ và HTTP API](apis-and-services.md). Gọi `database.repository()` bên ngoài sẽ chạy ngoài transaction này. Bắt lỗi rồi trả về bình thường có thể commit phần việc dở dang.

Transaction không tự động ngăn ghi đè đồng thời. Nếu không chấp nhận được việc lần ghi thành công cuối cùng thắng, hãy thêm cơ chế kiểm soát đồng thời như điều kiện phiên bản. Kích hoạt các tác động bên ngoài như thông báo sau khi commit. `connection.afterCommit()` hữu ích cho ranh giới đó, nhưng thất bại khi ấy không hoàn tác được dữ liệu đã commit và không đảm bảo tin nhắn bên ngoài được gửi đến.

## Khi nào dùng Query

| Tình huống | Bắt đầu với |
| --- | --- |
| Bản ghi Collection và quan hệ đã khai báo | Repository |
| Policy, mã hóa field hoặc ghi quan hệ | Repository |
| Join cho báo cáo không qua quan hệ, subquery phức tạp, phân trang kết quả đã nhóm | Query |
| Chuyển đổi dữ liệu lịch sử theo tập hợp trong migration | Thường là Query của migration context, để migration tự chứa |

Mã khi chạy dùng `database.query()`; callback của transaction dùng thuộc tính `connection.query`. Query không đọc quan hệ hay ghi đè tên của Collection và không áp dụng policy quyền tự động, optimistic locking hay ghi quan hệ. Nó vẫn dùng chuyển đổi tên ở cấp kết nối, nên đừng cho rằng tên vật lý ghép tay luôn hoạt động.

Điều kiện của Query dùng `where(field, operator, value)` và tham số hóa giá trị. Đây không phải API của Knex: đừng sao chép `where(field, value)` hay `whereIn()`. Cập nhật và xóa cần `where`; chỉ dùng `allowAllRows()` cho thao tác trên toàn bảng có chủ đích rõ ràng.

## Kiểm tra kết quả

Dùng cơ sở dữ liệu kiểm thử thật cho bộ lọc, thứ tự ổn định, kết quả trống, quan hệ và phạm vi thao tác hàng loạt; dùng ứng dụng thật và người dùng thông thường cho phân quyền. Gây ra một lỗi trong transaction và đọc lại cơ sở dữ liệu để xác nhận các lần ghi trước đó cũng đã được rollback. Mock một Repository không xác lập được hành vi của nó.

Xem [Dịch vụ nghiệp vụ và HTTP API](apis-and-services.md) cho service dự án đầy đủ và [Kiểm thử và nghiệm thu](testing-and-acceptance.md) về cách chọn fixture.
