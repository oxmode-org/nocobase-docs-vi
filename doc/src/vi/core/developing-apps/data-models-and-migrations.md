---
title: Mô hình dữ liệu và migration
description: Quản lý field, quan hệ và ràng buộc qua migration, và phân biệt thay đổi schema, dữ liệu ban đầu và các file Collection được tạo ra.
---

Mô hình dữ liệu định nghĩa ứng dụng lưu những gì và cơ sở dữ liệu phải thực thi những quy tắc nào. Ứng dụng NocoBase ghi lại thay đổi schema trong migration và truy cập dữ liệu qua Repository. `database/main/collections/` chứa các snapshot model được tạo ra, không phải định nghĩa model viết tay.

Hướng dẫn này dùng một quan hệ dự án tùy chọn trên công việc để giải thích field, quan hệ, ràng buộc và thay đổi với dữ liệu hiện có. Bạn có thể đọc thẳng các quy ước; hãy chuẩn bị ứng dụng ví dụ bên dưới khi muốn chạy mã.

## Cấu trúc, dữ liệu ban đầu và bản ghi nghiệp vụ

| Việc | Vị trí | Nguyên tắc |
| --- | --- | --- |
| Thêm field, quan hệ, index hoặc ràng buộc | `database/main/migrations/` | Thêm một migration và mô tả ảnh hưởng của nó đến dữ liệu cũ |
| Bổ sung dữ liệu lịch sử kèm một bản phát hành | Một migration | Định nghĩa phép biến đổi thay vì đoán cách gán nghiệp vụ |
| Cung cấp dữ liệu ban đầu mà ứng dụng cần | `database/main/seeds/` | Tách khỏi bản ghi hằng ngày và không ghi đè lặp lại các thay đổi của người dùng |
| Cung cấp dữ liệu minh họa tùy chọn | Một seed được đánh dấu là mẫu | Để người vận hành chủ động chọn có nạp hay không |
| Tạo hoặc thay đổi bản ghi nghiệp vụ hằng ngày | Business service và endpoint | Kiểm tra dữ liệu đầu vào và quyền, rồi dùng Repository |
| Xem các Collection đã phân giải | `database/main/collections/` | Tạo và kiểm tra bằng công cụ; không sửa tay |

Tên dự án là dữ liệu nghiệp vụ do người dùng tạo, nên ví dụ này không thêm seed dự án nào. Đừng tự động gán vai trò nghiệp vụ cho mọi người dùng đã đăng nhập chỉ để ví dụ dùng được.

## Các câu hỏi cần trả lời trước khi định nghĩa field

Hãy quyết định giá trị bắt buộc và duy nhất có phải là quy tắc nghiệp vụ không, bản ghi lịch sử có đáp ứng được quy tắc mới không, và điều gì xảy ra khi một bản ghi liên quan bị xóa. Riêng bố cục form hiện tại không quyết định được cấu trúc cơ sở dữ liệu.

Tên dự án bắt buộc không cần phải duy nhất. Cho phép công việc thuộc về dự án không đòi hỏi gán ngay mọi công việc cũ. Khóa ngoại đảm bảo tham chiếu hợp lệ, kiểm tra ở endpoint xác minh dữ liệu đầu vào như nội dung tên, và phân quyền quyết định người dùng này có được dùng dự án hay không. Các kiểm tra này không thay thế được nhau.

## Chuẩn bị ứng dụng ví dụ

Các chương về dự án dùng một ví dụ lịch sử riêng: `tutorialTasks` lưu công việc, `tutorialProjects` lưu dự án, và `completed` thể hiện trạng thái hoàn thành của công việc. [Ví dụ bắt đầu sử dụng](../tutorials/build-your-first-feature.md) hiện tại dùng `tasks` và một `status` ba giai đoạn. Hãy dùng tag lịch sử và cấu hình tương ứng dưới đây cho bài tập này; đừng áp dụng các migration này trực tiếp vào cơ sở dữ liệu của phần bắt đầu sử dụng.

<details>
<summary>Lấy và cấu hình ứng dụng ví dụ</summary>

Tiếp tục từ [giai đoạn `04-task-due-date` của app-tutorials](https://github.com/nocobase/app-tutorials/tree/04-task-due-date), dựa trên template mặc định `1.0.0-beta.78`. Repository là private và cần quyền truy cập. Nếu đã hoàn thành giai đoạn đó, hãy tiếp tục trong dự án hiện có. Nếu chưa, lấy nó vào một thư mục mới:

```bash
git clone --branch 04-task-due-date https://github.com/nocobase/app-tutorials.git team-tasks
cd team-tasks
git switch -c feat/task-projects
pnpm install --frozen-lockfile
pnpm nocobase config init --dialect sqlite
pnpm nocobase config check
```

Dùng Node.js 24 và pnpm 11. Dự án đã có không cần khởi tạo cấu hình lại; đừng nối một cơ sở dữ liệu hiện có với mã ứng dụng cũ hơn. Chạy các lệnh và tạo các file bên dưới từ thư mục gốc của ứng dụng. Chương này đã được kiểm chứng với SQLite.

</details>

## Ví dụ: dự án và công việc

Bắt đầu với một model dự án nhỏ:

- `tutorialProjects.id`: khóa chính kiểu chuỗi, nhất quán với kiểu ID công việc hiện có.
- `tutorialProjects.name`: tên bắt buộc, tối đa 120 ký tự. Các dự án khác nhau có thể trùng tên.
- `tutorialProjects.createdAt`: thời gian tạo, do mã tạo dự án cung cấp.
- `tutorialTasks.projectId`: ID dự án, có thể để trống. Một dự án có thể có nhiều công việc; một công việc thuộc nhiều nhất một dự án.

Công việc lưu ID dự án và lấy tên dự án khi đọc quan hệ. Đổi tên dự án không cần cập nhật mọi công việc, và các dự án trùng tên không bị lẫn danh tính.

Công việc hiện có không có cách gán dự án đáng tin cậy. Hãy cho phép field mới để trống, nghĩa là “chưa thuộc dự án nào”. Migration không đoán cách gán hay tạo một dự án mặc định cho mọi công việc lịch sử. Ví dụ này từ chối xóa dự án vẫn còn công việc; ứng dụng có thể chuyển hoặc bỏ liên kết các công việc đó trước khi xóa.

## Cùng Agent

Đưa chương này cho Agent làm ngữ cảnh từ thư mục ứng dụng, rồi mô tả yêu cầu dưới đây. Chi tiết về field, API và component nằm trong các bước thủ công; Agent nên theo chúng cùng với hướng dẫn của dự án.

```text
Hãy thêm dự án vào ứng dụng công việc hiện có. Ở bước này chỉ hiện thực phần lưu dữ liệu, chưa có trang hay API.

Mỗi dự án cần một tên bắt buộc và thời gian tạo.
Một dự án có thể chứa nhiều công việc. Mỗi công việc thuộc nhiều nhất một dự án, hoặc không thuộc dự án nào.
Giữ nguyên các công việc cũ và tạm thời để chúng không thuộc dự án nào.

Công việc không được tham chiếu đến dự án không tồn tại, và dự án vẫn còn công việc thì không được xóa.
Khi đọc một công việc, chúng ta cũng phải lấy được thông tin dự án của nó.
Theo hướng dẫn thay đổi dữ liệu của dự án, không xóa cơ sở dữ liệu hay viết lại các thay đổi đã áp dụng trước đó.

Dùng dữ liệu kiểm thử riêng để kiểm chứng các quy tắc này và rằng công việc cũ vẫn hoạt động.
Giải thích dữ liệu nào sẽ mất nếu hoàn tác thay đổi này, và chỉ thử hoàn tác rồi áp dụng lại trong môi trường kiểm thử.
Không thêm dự án mẫu hay thay đổi quyền người dùng ở bước này.
Cho tôi biết những gì đã thay đổi và những gì đã kiểm chứng.
```

Hãy review việc giữ nguyên dữ liệu hiện có, việc thực thi ràng buộc và việc dùng cơ sở dữ liệu thật, cũng như bảng và field mới. So sánh kết quả với phần hiện thực dưới đây.

## Không dùng Agent

### Viết một migration tự chứa

Tạo `database/main/migrations/202610240004_add_task_projects.ts`:

```ts
import { defineMigration } from '@nocobase/db';

export default defineMigration({
  name: '202610240004_add_task_projects',
  async up({ builder }) {
    await builder.createCollection('tutorialProjects', (collection) => {
      collection.string('id', {
        length: 36,
        primaryKey: true,
        nullable: false,
      });
      collection.string('name', { length: 120, nullable: false });
      collection.datetime('createdAt', { nullable: false });
    });
    await builder.alterCollection('tutorialTasks', (collection) => {
      collection.string('projectId', { length: 36, nullable: true });
      collection.foreignKey('projectId', {
        name: 'fk_tutorial_tasks_project',
        references: { collection: 'tutorialProjects', fields: ['id'] },
        onDelete: 'restrict',
      });
      collection.index('projectId', { name: 'idx_tutorial_tasks_project' });
    });
    await builder.addField('tutorialTasks', {
      name: 'project',
      type: 'belongsTo',
      target: 'tutorialProjects',
      targetKey: 'id',
      foreignKey: 'projectId',
      constraints: false,
    });
  },
  async down({ builder }) {
    await builder.dropField('tutorialTasks', 'project');
    await builder.dropConstraint('tutorialTasks', 'fk_tutorial_tasks_project');
    await builder.dropIndex('tutorialTasks', 'idx_tutorial_tasks_project');
    await builder.dropField('tutorialTasks', 'projectId');
    await builder.dropCollection('tutorialProjects');
  },
});
```

Tên file bỏ `.ts` khớp với `name` và được sắp sau các migration công việc hiện có. Khai báo bảng, field và ràng buộc trực tiếp trong migration thay vì import các định nghĩa còn thay đổi từ business service hay file model.

`up()` tạo bảng dự án trước khi mở rộng bảng công việc. `down()` gỡ các phụ thuộc theo thứ tự ngược lại, giữ lại các field và bản ghi ban đầu của công việc nhưng xóa bản ghi dự án và liên kết của công việc. Nó đảo ngược thay đổi schema; nó không phải bản sao lưu để khôi phục dữ liệu nghiệp vụ.

### Phân biệt field, quan hệ và ràng buộc

Migration mô tả ba phần của cùng một quan hệ nghiệp vụ:

- **Field `projectId`** lưu ID dự án trong bảng công việc. `nullable: true` giữ cho công việc hiện có và công việc mới chưa gán vẫn hợp lệ.
- **Quan hệ `project`** cho Repository biết cách lấy dự án của một công việc. `foreignKey` chỉ đến field có sẵn, còn `targetKey` chỉ đến khóa chính của dự án. Quan hệ không lưu thêm một bản sao tên dự án.
- **Ràng buộc khóa ngoại** đảm bảo `projectId` khác null tham chiếu đến một dự án tồn tại. `onDelete: 'restrict'` ngăn xóa dự án khi còn công việc tham chiếu đến nó.

Migration tạo và đặt tên khóa ngoại một cách rõ ràng, nên quan hệ dùng `constraints: false` để tránh tạo thêm một ràng buộc khác. Điều này không tắt khóa ngoại trong cơ sở dữ liệu. Tên rõ ràng cũng giúp `down()` gỡ đúng ràng buộc đó.

Index thông thường trên `projectId` hỗ trợ việc lọc theo dự án về sau. Nó không phải unique vì nhiều công việc có thể thuộc một dự án. Index hỗ trợ truy vấn; khóa ngoại đảm bảo tham chiếu hợp lệ.

Khai báo field không thay thế được kiểm tra ở endpoint. Ví dụ, `nullable: false` không từ chối tên để trống, và các cơ sở dữ liệu có thể xử lý độ dài chuỗi khác nhau. Endpoint vẫn phải kiểm tra tên đã cắt khoảng trắng và độ dài của nó.

### Áp dụng migration và tạo Collection

Kiểm tra cấu hình ứng dụng đang trỏ đến cơ sở dữ liệu nào, rồi chạy:

```bash
pnpm nocobase db apply --dry-run
pnpm nocobase db apply
```

Với cơ sở dữ liệu đã ở giai đoạn trước, kế hoạch phải có migration mới này. Cơ sở dữ liệu mới còn cần các migration và seed trước đó của ứng dụng và plugin. `db apply` chạy các migration đang chờ rồi đến các seed đang chờ, chứ không chỉ file vừa thêm.

Chạy lại lệnh không thực thi lại các migration đã thành công. Công việc hiện có giữ nguyên tiêu đề, trạng thái hoàn thành, người được giao và hạn hoàn thành, với `projectId` là null.

Lệnh làm mới các snapshot model trong `database/main/collections/`. Hãy xem:

```text
database/main/collections/
├── tutorialProjects/
│   ├── collection.json
│   ├── metadata.json
│   └── schema.json
└── tutorialTasks/
    ├── collection.json
    ├── metadata.json
    └── schema.json
```

Các file này cho thấy model đã phân giải từ cơ sở dữ liệu. Chúng là cache có thể tạo lại: đừng sửa tay hay import vào migration. Kiểm tra cache có khớp với cơ sở dữ liệu không:

```bash
pnpm nocobase collections generate --check
```

## Kiểm chứng với cơ sở dữ liệu thật

Tạo `tests/database/tutorial-tasks-projects.test.ts`. Test áp dụng các migration trước đó và chèn một công việc có sẵn, áp dụng migration này, kiểm tra schema và dữ liệu, rồi rollback và áp dụng lại. `describeMigration()` quản lý cơ sở dữ liệu tách biệt và việc dọn dẹp; nó không dùng cơ sở dữ liệu phát triển của bạn.

<details>
<summary>Test migration đầy đủ</summary>

```ts
import { fileURLToPath } from 'node:url';
import { expect } from 'vitest';
import { describeMigration } from '@nocobase/app-testing/server';
import metadata from '../../package.json' with { type: 'json' };

describeMigration('202610240004_add_task_projects', {
  sources: [
    {
      packageName: metadata.name,
      directory: fileURLToPath(
        new URL('../../database/main/migrations/', import.meta.url),
      ),
    },
  ],
  before: async ({ connection }) => {
    await connection.repository('tutorialTasks').createOne({
      values: {
        id: 'existing-task',
        title: 'Prepare the launch checklist',
        completed: true,
        assigneeId: 'existing-assignee',
        dueDate: '2026-11-01',
        updatedAt: new Date('2026-10-24T00:00:00Z'),
      },
    });
  },
  up: async ({ connection, expectCollection }) => {
    await expectCollection('tutorialProjects').toHaveField('name', {
      type: 'string',
      nullable: false,
    });
    await expectCollection('tutorialTasks').toHaveField('projectId', {
      type: 'string',
      nullable: true,
    });
    await expectCollection('tutorialTasks').toHaveIndex(['projectId']);
    await expectCollection('tutorialTasks').toHaveForeignKey(
      ['projectId'],
      'tutorialProjects',
      { referencedFields: ['id'], onDelete: 'restrict' },
    );
    const tasks = connection.repository('tutorialTasks');
    expect(
      await tasks.findOne({ filter: { id: 'existing-task' } }),
    ).toMatchObject({
      title: 'Prepare the launch checklist',
      completed: true,
      assigneeId: 'existing-assignee',
      dueDate: '2026-11-01',
      projectId: null,
    });
    const projects = connection.repository('tutorialProjects');
    await projects.createOne({
      values: {
        id: 'launch-project',
        name: 'Product launch',
        createdAt: new Date('2026-10-24T00:00:00Z'),
      },
    });
    await tasks.updateOne({
      filter: { id: 'existing-task' },
      values: { projectId: 'launch-project' },
    });
    expect(
      await tasks.findOne({
        filter: { id: 'existing-task' },
        select: (s) =>
          s
            .fields('id', 'projectId')
            .include('project', (p) => p.fields('id', 'name')),
      }),
    ).toMatchObject({
      project: { id: 'launch-project', name: 'Product launch' },
    });
    await expect(
      tasks.updateOne({
        filter: { id: 'existing-task' },
        values: { projectId: 'missing-project' },
      }),
    ).rejects.toThrow();
    await expect(
      projects.deleteOne({ filter: { id: 'launch-project' } }),
    ).rejects.toThrow();
    expect(
      await tasks.findOne({ filter: { id: 'existing-task' } }),
    ).toMatchObject({
      projectId: 'launch-project',
    });
  },
  down: async ({ connection, expectCollection }) => {
    await expectCollection('tutorialProjects').not.toExist();
    await expectCollection('tutorialTasks').not.toHaveField('projectId');
    const collection = await connection.collections.get('tutorialTasks');
    expect(collection?.fields.some((field) => field.name === 'project')).toBe(
      false,
    );
    expect(
      await connection
        .repository('tutorialTasks')
        .findOne({ filter: { id: 'existing-task' } }),
    ).toMatchObject({
      title: 'Prepare the launch checklist',
      completed: true,
      assigneeId: 'existing-assignee',
      dueDate: '2026-11-01',
    });
  },
});
```

</details>

Chạy test của chương này, rồi đến các test cơ sở dữ liệu và endpoint công việc hiện có:

```bash
pnpm exec vitest run --config vitest.tutorial.config.ts tests/database/tutorial-tasks-projects.test.ts
pnpm exec vitest run --config vitest.tutorial.config.ts
```

Xác nhận test xuất hiện trong kết quả. “No tests found” không phải là kiểm chứng thành công. Test kiểm tra:

- Các field công việc hiện có vẫn còn sau khi nâng cấp, với `projectId` là null.
- Index và khóa ngoại tồn tại, và Repository đọc được tên dự án liên kết với một công việc.
- ID dự án không tồn tại và việc xóa dự án đang được tham chiếu đều bị từ chối, liên kết ban đầu được giữ nguyên sau khi thất bại.
- Rollback gỡ model mới trong khi giữ lại công việc, và migration có thể áp dụng lại.

Test gọi `repository()` trực tiếp để kiểm chứng một cơ sở dữ liệu tách biệt. Endpoint production phải kiểm tra quyền của người gọi và dùng policy Repository tương ứng. Khóa ngoại chứng minh dự án tồn tại, không chứng minh người gọi được truy cập hay chọn nó.

## Phát triển model tiếp

**Giữ nguyên các migration đã merge hoặc đã phát hành.** Thêm migration khi đưa vào field mới, thay đổi ràng buộc hoặc sửa một migration trước đó. Sửa một file đã chạy không khiến `db apply` chạy lại nó. Reset cơ sở dữ liệu không chứng minh được rằng một lần nâng cấp thật giữ nguyên dữ liệu.

Nếu cuối cùng mọi công việc đều phải có dự án, trước hết hãy xác định cách gán cho công việc hiện có, bổ sung dữ liệu và kiểm chứng không còn giá trị null. Sau đó mới đặt field là bắt buộc trong một migration tiếp theo. Bổ sung dữ liệu hiện có thuộc về migration; seed không nên ghi đè lặp lại các công việc người dùng đã sửa.

Seed cung cấp các bản ghi ban đầu mà ứng dụng cần để hoạt động. Dự án trong chương này là bản ghi nghiệp vụ do người dùng tạo, nên không cần seed. Với nội dung minh họa, hãy dùng rõ ràng một seed mẫu tùy chọn để việc nạp dữ liệu ví dụ là một lựa chọn khi cài đặt.

## Đọc thêm

[Dịch vụ nghiệp vụ và HTTP API](apis-and-services.md) giải thích cách đưa thao tác dữ liệu ra cho các trang: kiểm tra dữ liệu đầu vào, kiểm tra quyền với dự án và công việc, và chuyển lỗi nghiệp vụ thành lỗi API nhất quán. [Tổng quan phát triển ứng dụng](overview.md) cho thấy các phần ghép với nhau thế nào.
