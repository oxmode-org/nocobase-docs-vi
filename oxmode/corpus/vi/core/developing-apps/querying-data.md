---
title: Truy vấn và thao tác dữ liệu
description: Dùng Repository cho bản ghi, quan hệ, phân trang, transaction và thao tác hàng loạt, rồi chọn Query khi cần.
---

Bắt đầu truy cập dữ liệu bằng Repository. Repository hiểu các trường và quan hệ của Collection, hỗ trợ đọc, tạo và sửa bản ghi nghiệp vụ. Query làm việc với bảng và tập kết quả, phù hợp cho báo cáo và tổng hợp vượt khả năng biểu đạt của Repository. Với cả hai, bên gọi cần xác định danh tính và quyền trước.

Các đoạn mã chạy trên máy chủ ứng dụng và dùng `tutorialProjects` cùng `tutorialTasks` từ [hướng dẫn thiết lập dữ liệu dự án trước đây](https://github.com/nocobase/website-v3/blob/e7f20aeea2f9e63d396cb99a4e3775902823f3cb/doc/content/core/developing-apps/data-models-and-migrations.md). Ứng dụng ví dụ dùng template mặc định `1.0.0-beta.78`. Ví dụ này có bộ dữ liệu riêng, tách khỏi ứng dụng nhập môn hiện tại dùng bảng `tasks`. Xem [mã nguồn dịch vụ dự án trước đây](https://github.com/nocobase/website-v3/blob/963e7d7570b6f4b0a4bb37ba48af54bff2f219e6/doc/content/core/developing-apps/server-business-services.md) để xem dịch vụ đầy đủ và [Route và API HTTP](apis-and-services.md) để tích hợp endpoint.

<a id="with-an-agent"></a>

## Làm cùng agent

```text
Please improve the existing project list queries so search, sorting and pagination stay consistent.

Return only projects the current user may view, and count only those projects.
Search by name and default to newest first. Keep a stable order when creation times match.
Allow at most 100 records per page; reject negative page numbers and unrestricted full-list requests.

When changing a task's project, check permissions for both the task and the target project.
If any step fails, preserve the old assignment without partial saves.
Use a real database to verify search, pagination, permission scopes and data after failure. Do not change existing user grants.
```

Prompt yêu cầu giữ kết quả tìm kiếm, sắp xếp và phân trang nhất quán. Chỉ trả về và đếm dự án mà người dùng hiện tại có quyền xem. Tìm theo tên, mặc định ưu tiên bản ghi mới nhất và dùng thứ tự ổn định khi thời điểm tạo trùng nhau. Giới hạn 100 bản ghi mỗi trang, từ chối số trang âm và yêu cầu lấy toàn bộ danh sách không giới hạn. Khi chuyển nhiệm vụ sang dự án khác, kiểm tra quyền trên cả nhiệm vụ và dự án đích. Nếu bất kỳ bước nào lỗi, giữ liên kết cũ và hoàn tác mọi thay đổi đã ghi. Kiểm tra các trường hợp này trên cơ sở dữ liệu thực và giữ nguyên quyền đã cấp.

<a id="without-an-agent"></a>

## Làm thủ công

<a id="obtain-a-repository"></a>

### Lấy Repository

Lấy đối tượng cơ sở dữ liệu một lần trong hàm tạo route, hoặc truyền vào dịch vụ nghiệp vụ qua constructor:

```ts
import { databaseManagerToken } from '@nocobase/db';

const database = app.container.resolve(databaseManagerToken);
```

`database.repository('tutorialProjects')` dùng kết nối mặc định và tên logic của Collection. Tra tên logic trong khai báo thay vì suy đoán tên bảng vật lý. Giữ dịch vụ cơ sở dữ liệu ở phía máy chủ.

Repository không tự xác định người dùng của yêu cầu hiện tại. Với yêu cầu từ bên ngoài, lấy `RepositoryPolicy` từ kết quả phân quyền, rồi dùng `withPolicy()` để gắn phạm vi bản ghi và quyền trên trường. Bộ lọc người dùng gửi chỉ có thể thu hẹp phạm vi đã được cấp quyền.

<a id="filter-sort-and-paginate"></a>

### Lọc, sắp xếp và phân trang

Hàm này nhận tham số phân trang đã kiểm tra và chính sách đọc hiện tại. Đặt hàm trong dịch vụ nghiệp vụ. Endpoint cần kiểm tra trước `page >= 1`, `1 <= pageSize <= 100` và độ dài chuỗi tìm kiếm:

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

Danh sách bản ghi và tổng số dùng chung Repository và bộ lọc. Nếu chỉ lọc danh sách, tổng số sẽ làm lộ số bản ghi ngoài phạm vi cho phép và có thể tạo ra các trang không hợp lệ. Trường sắp xếp thứ hai `id` xác định thứ tự ổn định khi thời điểm tạo trùng nhau. Thứ tự UUID độc lập với thứ tự thời gian.

Hai truy vấn phân trang có thể đọc hai ảnh chụp trạng thái cơ sở dữ liệu khác nhau. Thay đổi đồng thời có thể khiến tổng số và trang hiện tại tạm thời lệch nhau. Nếu cần, thiết kế riêng cơ chế dùng chung snapshot hoặc phân trang theo con trỏ. Giữ phân trang ở máy chủ để tránh tải toàn bộ dữ liệu về trình duyệt.

<a id="read-relations"></a>

### Đọc quan hệ

Sau khi migration khai báo `tutorialTasks.project`, đọc quan hệ bằng bộ chọn:

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

`taskPolicy` phải cho phép đọc các trường và quan hệ tương ứng. `include()` chỉ yêu cầu nạp quan hệ theo quyền đã cấp. Nếu nhiệm vụ và dự án cần phạm vi thao tác riêng, gắn chính sách và truy vấn riêng cho từng bên, như khi gán nhiệm vụ vào dự án. Quyền đọc nhiệm vụ không tự mở rộng sang mọi dự án.

Chọn rõ các trường cần trả về. Ưu tiên dùng quan hệ đã khai báo để tái sử dụng ánh xạ trường và quy tắc quan hệ.

<a id="create-update-and-delete"></a>

### Tạo, cập nhật và xóa

| Nhu cầu | Phương thức Repository | Hành vi cần xử lý |
| --- | --- | --- |
| Đọc một bản ghi | `findOne()` | Trả về bản ghi khớp đầu tiên nếu có |
| Tạo một bản ghi | `createOne()` | Trả về kết quả thao tác ghi, với bản ghi ở `result.record` |
| Cập nhật hoặc xóa một bản ghi | `updateOne()`, `deleteOne()` | Yêu cầu có đúng một bản ghi trong phạm vi |
| Tạo nhiều bản ghi | `createMany()` | Chỉ hỗ trợ tạo bản ghi trực tiếp, không hỗ trợ ghi quan hệ lồng nhau |
| Cập nhật hoặc xóa hàng loạt | `updateMany()`, `deleteMany()` | Cần chỉ rõ phạm vi. Khi lỗi vì phạm vi rỗng, xử lý nguyên nhân và tránh dùng `all: true` để bỏ qua |

Đoạn mã dịch vụ sau cập nhật trạng thái hoàn thành. `taskId` đã được kiểm tra và `updatePolicy` lấy từ kết quả phân quyền cho thao tác này:

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

Tạo `values` từ danh sách trường được phép thay vì truyền nguyên thân yêu cầu. Thao tác hàng loạt vẫn cần kiểm tra đầu vào, áp dụng chính sách, giới hạn kích thước và quyết định sẽ hoàn tác cả đợt hay chấp nhận thành công một phần. Dịch vụ cần quyết định rõ các điều kiện này trước khi gọi phương thức `Many`.

<a id="multi-step-writes-and-transactions"></a>

### Ghi nhiều bước và transaction

Để dịch vụ nghiệp vụ nhóm các thao tác cần cùng thành công hoặc cùng thất bại vào một transaction trên cùng kết nối. Xem [Transaction và tính nhất quán dữ liệu](transactions-and-consistency.md) về triển khai, rollback và ranh giới khi gửi dữ liệu ra hệ thống ngoài. Mọi thao tác đọc và ghi trong nhóm phải dùng kết nối của transaction.

<a id="when-to-use-query"></a>

## Khi nào dùng Query

| Tình huống | Công cụ nên dùng trước |
| --- | --- |
| Bản ghi Collection và quan hệ đã khai báo | Repository |
| Chính sách, mã hóa trường hoặc ghi quan hệ | Repository |
| Join báo cáo khi chưa có quan hệ, truy vấn con phức tạp, phân trang kết quả theo nhóm | Query |
| Chuyển đổi dữ liệu lịch sử theo tập hợp trong migration | Thường dùng Query của ngữ cảnh migration để migration tự chứa logic cần thiết |

Mã chạy trong ứng dụng dùng `database.query()`. Callback transaction dùng thuộc tính `connection.query`. Query bỏ qua các quan hệ và quy tắc đặt tên riêng của Collection. Bên gọi phải tự xử lý chính sách quyền, khóa lạc quan và ghi quan hệ nếu cần. Query vẫn chuyển đổi tên theo cấu hình kết nối, nên hãy kiểm tra trước khi tự ghép tên vật lý.

Điều kiện Query dùng `where(field, operator, value)` và truyền giá trị dưới dạng tham số. Dùng chữ ký này thay cho cú pháp Knex như `where(field, value)` hoặc `whereIn()`. Lệnh cập nhật và xóa yêu cầu `where`. Chỉ dùng `allowAllRows()` khi thực sự muốn áp dụng cho toàn bộ bảng.

<a id="verify-results"></a>

## Kiểm tra kết quả

Dùng cơ sở dữ liệu kiểm thử thực để xác nhận bộ lọc, thứ tự ổn định, kết quả rỗng, quan hệ và phạm vi thao tác hàng loạt. Kiểm tra phân quyền trên ứng dụng thật bằng tài khoản người dùng thông thường. Chủ động gây lỗi trong transaction rồi đọc lại cơ sở dữ liệu để xác nhận các thao tác ghi trước đó đã được hoàn tác. Kiểm thử với Repository giả lập cần được bổ sung bằng các kiểm tra trên cơ sở dữ liệu thực.

Xem [mã nguồn dịch vụ dự án trước đây](https://github.com/nocobase/website-v3/blob/963e7d7570b6f4b0a4bb37ba48af54bff2f219e6/doc/content/core/developing-apps/server-business-services.md) để tra dịch vụ đầy đủ và [Kiểm thử](testing-and-acceptance.md) để chọn dữ liệu kiểm thử phù hợp.
