---
title: Xây ứng dụng đầu tiên
description: Biến một yêu cầu nghiệp vụ ngắn thành ứng dụng quản lý công việc nhóm có người được giao, hạn hoàn thành và tiến độ.
---

Xây một ứng dụng quản lý công việc nhóm dùng được, với tiêu đề, mô tả, người được giao, hạn hoàn thành và tiến độ. Kết quả hỗ trợ tạo, xem, sửa, xóa, tìm kiếm, lọc và phân trang công việc.

![Công việc của nhóm với người được giao, hạn hoàn thành, tiến độ và phân trang.](/assets/core/tutorials/quickstart/task-list.png)

Chuẩn bị một dự án qua [Tạo ứng dụng](../getting-started/create-app.md). Chọn một trong hai cách dưới đây để đạt cùng một kết quả.

## Cùng Agent

Mở Agent trong thư mục ứng dụng và yêu cầu:

```text
Hãy xây cho tôi một ứng dụng quản lý công việc nhóm, nơi chúng tôi có thể giao việc cho người, đặt hạn hoàn thành và theo dõi tiến độ. Chạy nó lên để tôi dùng thử.
```

Agent làm theo `AGENTS.md` và các Skill của dự án để xây schema, API, trang, phân quyền và các kiểm tra. Hãy dùng thử kết quả: tạo một công việc, giao cho ai đó, thay đổi tiến độ, và tải lại trang để xác nhận dữ liệu được lưu. Mô tả các tinh chỉnh một cách tự nhiên, chẳng hạn “Khi tôi bấm vào tiêu đề thì mở chi tiết công việc, rồi cho tôi chọn có sửa hay không.”

Các ảnh chụp màn hình cho thấy kết quả của lần chạy này. Cùng một yêu cầu có thể cho ra layout và mã khác nhau; chi tiết hiện thực không cần trở thành một prompt dài.

![Chi tiết công việc trong một drawer.](/assets/core/tutorials/quickstart/task-detail.png)

## Không dùng Agent

Cách này giải thích phần việc đằng sau kết quả của Agent: tạo bảng, hiện thực backend và frontend, nối phân quyền, rồi kiểm chứng. Mỗi bước có kèm mã chính. Các đoạn trích thuộc về file nguồn được liên kết; đường dẫn GitHub trỏ đến một phiên bản cố định của phần hiện thực đầy đủ.

### 1. Tạo bảng công việc

Thêm một bảng nghiệp vụ, `tasks`. Tái sử dụng các năng lực có sẵn về người dùng, xác thực và phân quyền.

| Field                    | Mục đích                                                   |
| ------------------------ | ---------------------------------------------------------- |
| `id`                     | ID công việc                                               |
| `title`                  | Tiêu đề bắt buộc, đã cắt khoảng trắng, tối đa 120 ký tự    |
| `description`            | Mô tả tối đa 2.000 ký tự                                   |
| `status`                 | `todo`, `inProgress` hoặc `done`                           |
| `assigneeId`             | ID người dùng đã có, có thể để trống                       |
| `dueDate`                | Ngày theo định dạng `YYYY-MM-DD`, có thể để trống          |
| `createdAt`, `updatedAt` | Thời điểm tạo và cập nhật                                  |

Khai báo field và index trong [database/main/migrations/202610250101_create_tasks.ts](https://github.com/nocobase/app-tutorials/blob/da050f4dd4d9ddc36c8585489bd002c6e01ad76f/database/main/migrations/202610250101_create_tasks.ts):

<details>
<summary>Mở rộng migration đầy đủ</summary>

```ts
import { defineMigration } from '@nocobase/db';

export default defineMigration({
  name: '202610250101_create_tasks',
  async up({ builder }) {
    await builder.createCollection('tasks', (c) => {
      c.string('id', { length: 36, primaryKey: true, nullable: false });
      c.string('title', { length: 120, nullable: false });
      c.text('description', { nullable: false, defaultValue: '' });
      c.string('status', { length: 16, nullable: false, defaultValue: 'todo' });
      c.string('assigneeId', { length: 255, nullable: true });
      c.string('dueDate', { length: 10, nullable: true });
      c.datetime('createdAt', { nullable: false });
      c.datetime('updatedAt', { nullable: false });
      c.index(['assigneeId', 'status']);
      c.index('dueDate');
      c.index('updatedAt');
    });
  },
  async down({ builder }) {
    await builder.dropCollection('tasks');
  },
});
```

</details>

Migration sở hữu schema; backend kiểm tra dữ liệu nghiệp vụ đầu vào. Phân giải người được giao qua service người dùng thay vì truy cập bảng nội bộ của plugin xác thực. Áp dụng migration cũng tạo ra các file Collection:

```bash
pnpm nocobase db apply --dry-run
pnpm nocobase db apply
pnpm nocobase collections doctor
```

Xem `database/main/collections/tasks/`; đừng sửa các file được tạo ra. Công việc mẫu là dữ liệu khi chạy, tách biệt với các seed khởi tạo bắt buộc.

### 2. Hiện thực backend

Tách riêng schema đầu vào, business service và HTTP route. Sau khi xác thực và phân quyền, route kiểm tra dữ liệu đầu vào và gọi service.

**Kiểm tra dữ liệu đầu vào.** [server/tasks/schemas.ts](https://github.com/nocobase/app-tutorials/blob/da050f4dd4d9ddc36c8585489bd002c6e01ad76f/server/tasks/schemas.ts) tách riêng đầu vào cho tạo, sửa và cập nhật tiến độ, để việc sửa chi tiết không vô tình ghi đè trạng thái:

<details>
<summary>Mở rộng phần kiểm tra dữ liệu đầu vào</summary>

```ts
export const taskStatus = z.enum(['todo', 'inProgress', 'done']);
export const taskDetails = z.strictObject({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).default(''),
  assigneeId: z.string().min(1).max(255).nullable().default(null),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((value) => {
      const date = new Date(`${value}T00:00:00Z`);
      return (
        !Number.isNaN(date.valueOf()) &&
        date.toISOString().slice(0, 10) === value
      );
    })
    .nullable()
    .default(null),
});
export const createTask = taskDetails.extend({
  status: taskStatus.default('todo'),
});
export const editTask = taskDetails.extend({
  expectedUpdatedAt: z.iso.datetime(),
});
export const progressTask = z.strictObject({
  status: taskStatus,
  expectedUpdatedAt: z.iso.datetime(),
});
```

</details>

**Lưu công việc.** [server/tasks/service.ts](https://github.com/nocobase/app-tutorials/blob/da050f4dd4d9ddc36c8585489bd002c6e01ad76f/server/tasks/service.ts) dùng một Repository gắn policy phân quyền. Đây là `TaskService.create`; `validateOwner` dùng service người dùng để từ chối người được giao không tồn tại hoặc đã bị vô hiệu hóa:

```ts
async create(policy: RepositoryPolicy, input: TaskInput) {
  await this.validateOwner(input.assigneeId);
  const now = new Date();
  const result = await this.db
    .repository('tasks')
    .withPolicy(policy)
    .createOne({
      values: { ...input, id: randomUUID(), createdAt: now, updatedAt: now },
    });
  return rowSchema.parse(result.record);
}
```

Service cũng xử lý danh sách, chi tiết, sửa, cập nhật tiến độ và xóa. Lọc, sắp xếp, phân trang và đếm đều diễn ra trong cơ sở dữ liệu. Cập nhật và xóa kiểm tra `expectedUpdatedAt` và trả về `409` khi bản ghi đã thay đổi, tránh ghi đè âm thầm.

**Đăng ký endpoint.** [server/routes/tasks.ts](https://github.com/nocobase/app-tutorials/blob/da050f4dd4d9ddc36c8585489bd002c6e01ad76f/server/routes/tasks.ts) cài middleware xác thực và phân quyền bên trong subrouter công việc. `gate` của nó phân giải policy của action trước khi kiểm tra dữ liệu đầu vào. Endpoint tạo là:

```ts
tasks.post(
  '/',
  gate('create'),
  describeRoute({
    tags: ['Tasks'],
    operationId: 'createTask',
    summary: 'Create a task',
    responses: { '201': dataResponse(taskSchema), ...errors },
  }),
  apiValidator('json', createTask),
  async (c) => {
    const row = await service.create(c.get('taskPolicy'), c.req.valid('json'));
    return c.json(
      { data: (await service.present([row], c.get('authz')))[0] },
      201,
    );
  },
);
```

`describeRoute` khai báo tài liệu API; `apiValidator` kiểm tra request. Thành công dùng `{ data }`, còn lỗi dùng `ApiError` chuẩn. Đăng ký phần đóng góp và service provider qua các điểm vào sẵn có của ứng dụng:

`server/routes/index.ts`

```ts
import { taskRoutes } from './tasks.js';
import type { Application } from '@nocobase/app-server/application';
import type { AppRouteContribution } from '@nocobase/app-server/router';

const routes: readonly AppRouteContribution<Application>[] = [taskRoutes];

export default routes;
```

`server/providers/index.ts`

```ts
import TasksProvider from './tasks.js';
import type { ApplicationServiceProviderConstructor } from '@nocobase/app-server/application';

const serviceProviders: readonly ApplicationServiceProviderConstructor[] = [
  TasksProvider,
];

export default serviceProviders;
```

Xem [server/providers/tasks.ts](https://github.com/nocobase/app-tutorials/blob/da050f4dd4d9ddc36c8585489bd002c6e01ad76f/server/providers/tasks.ts) về việc đăng ký service. Sau khi đăng nhập, hãy xem các thao tác Tasks tại endpoint `/api/swagger` của ứng dụng.

### 3. Hiện thực frontend

Thêm danh sách công việc, drawer chi tiết và hộp thoại tạo/sửa, dùng các component layout, bảng, form và phản hồi của template.

**Trang và điều hướng.** Đăng ký route trong [client/routes.ts](https://github.com/nocobase/app-tutorials/blob/da050f4dd4d9ddc36c8585489bd002c6e01ad76f/client/routes.ts); `navigation` thêm mục ở thanh bên. Chi tiết và hộp thoại có URL riêng, giữ nguyên điều kiện của danh sách khi mở, làm mới và đóng:

<details>
<summary>Mở rộng đoạn trích route công việc</summary>

```ts
{
  name: 'tasks',
  path: '/tasks',
  auth: 'required',
  authz: { resource: { type: 'page', id: 'tasks' }, action: 'access' },
  navigation: { title: 'tasks.title', icon: ListTodo, order: 10 },
  componentLoader: () => import('./pages/tasks/index.js'),
  children: [
    { name: 'taskCreate', path: 'new', componentLoader: () => import('./pages/tasks/form.js') },
    { name: 'taskEdit', path: 'edit/:taskId', componentLoader: () => import('./pages/tasks/form.js') },
    {
      name: 'taskDetail', path: ':taskId',
      componentLoader: () => import('./pages/tasks/detail.js'),
      children: [{ name: 'taskDetailEdit', path: 'edit', componentLoader: () => import('./pages/tasks/form.js') }],
    },
  ],
}
```

</details>

**Danh sách.** [client/pages/tasks/index.tsx](https://github.com/nocobase/app-tutorials/blob/da050f4dd4d9ddc36c8585489bd002c6e01ad76f/client/pages/tasks/index.tsx) lưu tìm kiếm, trạng thái, sắp xếp và phân trang trong URL, lấy dữ liệu qua `useApiClient`, và cung cấp cho `DataTable`. Cấu hình chính:

```tsx
<DataTable
  columns={columns}
  data={result.data}
  getRowId={(row) => row.id}
  manualPagination
  rowCount={result.meta.total}
  paginationState={pagination}
  pageSizeOptions={[10, 20, 50]}
  manualSorting
  sortingState={sorting}
  loading={loading}
/>
```

Trong file đầy đủ, `onPaginationChange` và `onSortingChange` cập nhật URL và kích hoạt truy vấn mới. Nó cũng phân biệt ứng dụng chưa có dữ liệu, không có kết quả khớp, đang tải và thất bại. Tiêu đề dùng `RecordLink` để mở chi tiết.

**Form và lưu.** [client/pages/tasks/form.tsx](https://github.com/nocobase/app-tutorials/blob/da050f4dd4d9ddc36c8585489bd002c6e01ad76f/client/pages/tasks/form.tsx) tải lại công việc khi mở hộp thoại sửa. Request lưu gồm trạng thái ban đầu khi tạo, hoặc chi tiết kèm phiên bản khi sửa:

```ts
const values = {
  title: fields.title.trim(),
  description: fields.description.trim(),
  assigneeId: fields.assignee?.id ?? null,
  dueDate: fields.dueDate,
  ...(creating ? { status: fields.status } : { expectedUpdatedAt: version }),
};
const { data } = await api.request<{ data: Task }>({
  path: creating ? 'tasks' : `tasks/${taskId}`,
  method: creating ? 'POST' : 'PATCH',
  json: values,
});
```

Form kiểm tra khi gửi và gắn lỗi với field. Nó giữ bản nháp khi thất bại và chặn gửi trùng hay đóng trong lúc lưu. Khi thành công, nó cập nhật giao diện từ công việc được trả về rồi mới làm mới danh sách. Làm mới thất bại được báo riêng, tách khỏi việc lưu đã thành công.

![Hộp thoại tạo với mô tả, người được giao và hạn hoàn thành.](/assets/core/tutorials/quickstart/task-create.png)

Phần chọn người được giao nằm trong [client/pages/tasks/assignee-picker.tsx](https://github.com/nocobase/app-tutorials/blob/da050f4dd4d9ddc36c8585489bd002c6e01ad76f/client/pages/tasks/assignee-picker.tsx); ngày dùng `Calendar` cùng `Popover`. Xem [client/pages/tasks/detail.tsx](https://github.com/nocobase/app-tutorials/blob/da050f4dd4d9ddc36c8585489bd002c6e01ad76f/client/pages/tasks/detail.tsx) cho phần chi tiết và [client/pages/tasks/task-actions.tsx](https://github.com/nocobase/app-tutorials/blob/da050f4dd4d9ddc36c8585489bd002c6e01ad76f/client/pages/tasks/task-actions.tsx) cho sửa, cập nhật tiến độ và xóa. Hộp xác nhận xóa nêu tên công việc và giải thích rằng không thể hoàn tác.

**Nội dung tiếng Anh và tiếng Trung.** Giữ nội dung trong [client/locales/tasks.ts](https://github.com/nocobase/app-tutorials/blob/da050f4dd4d9ddc36c8585489bd002c6e01ad76f/client/locales/tasks.ts) và thêm vào cả hai resource locale. Component dùng translation key:

```ts
// client/locales/en-US.ts
import { tasksEn } from './tasks.js';
const enUS = { ...systemEnUS, tasks: tasksEn };

// client/locales/zh-CN.ts
import { tasksZh } from './tasks.js';
const zhCN: AppResource = { ...systemZhCN, tasks: tasksZh };
```

### 4. Nối phân quyền

Phân quyền truy cập trang tách riêng với thao tác dữ liệu. Ẩn một nút chỉ là trình bày; backend vẫn phải kiểm tra từng request và phạm vi bản ghi của nó.

[server/tasks/permissions.ts](https://github.com/nocobase/app-tutorials/blob/da050f4dd4d9ddc36c8585489bd002c6e01ad76f/server/tasks/permissions.ts) khai báo năm action và một phạm vi bản ghi “được giao cho tôi”:

<details>
<summary>Mở rộng phần khai báo quyền</summary>

```ts
import {
  defineCompositeResource,
  defineRecordAccess,
} from '@nocobase/authorization/core';
import { defineDatabasePermission } from '@nocobase/app-plugin-authorization/server';
import { buildFilter } from '@nocobase/repository-input';
import metadata from '../../package.json' with { type: 'json' };
import type { TaskRow } from './schemas.js';
export const label = (key: string) => ({
  ns: metadata.name,
  key: `tasks.${key}`,
});
const fields = [
  'id',
  'title',
  'description',
  'status',
  'assigneeId',
  'dueDate',
  'createdAt',
  'updatedAt',
] as const;
const data = defineDatabasePermission((p) =>
  p.collection<TaskRow>('tasks').title(label('title')).read(fields),
);
export const assignedTasks = defineRecordAccess('tasks.assigned', (access) =>
  access
    .title(label('assignedScope'))
    .collections('tasks')
    .resolver(({ principal }) =>
      principal.type === 'user'
        ? buildFilter((f) => f.string('assigneeId').eq(principal.id))
        : false,
    ),
);
export const taskPermissions = defineCompositeResource('tasks', (r) =>
  r
    .title(label('title'))
    .action('read', (a) =>
      a.title(label('readPermission')).grant('tasks', data),
    )
    .action('create', (a) =>
      a.title(label('createPermission')).grant('tasks', data.create(fields)),
    )
    .action('edit', (a) =>
      a
        .title(label('editPermission'))
        .grant(
          'tasks',
          data.update([
            'title',
            'description',
            'assigneeId',
            'dueDate',
            'updatedAt',
          ]),
        ),
    )
    .action('progress', (a) =>
      a
        .title(label('progressPermission'))
        .grant('tasks', data.update(['status', 'updatedAt'])),
    )
    .action('delete', (a) =>
      a.title(label('deletePermission')).grant('tasks', data.delete()),
    ),
);
export type TaskAction = 'read' | 'create' | 'edit' | 'progress' | 'delete';
```

</details>

Route lấy policy qua phương thức service này; mọi thao tác đọc và ghi đều dùng `withPolicy(policy)`:

```ts
async policy(
  authz: AuthorizationContext,
  action: TaskAction,
): Promise<RepositoryPolicy> {
  const decision = await authz.authorize({
    resource: { type: 'composite', id: 'tasks' },
    action,
  });
  const policy = decision.conditions?.database?.tasks;
  if (decision.effect === 'deny' || !policy)
    throw taskError('PERMISSION_DENIED', 'TASK_ACTION_DENIED');
  return policy;
}
```

Một seed chạy một lần khởi tạo ba vai trò mà quản trị viên có thể sửa. Nó cung cấp cấu hình ban đầu mà không ghi đè các thay đổi sau này của quản trị viên:

| Vai trò      | Quyền ban đầu                                                       |
| ------------ | ------------------------------------------------------------------- |
| Task manager | Xem, tạo, sửa, cập nhật tiến độ và xóa mọi công việc                |
| Task member  | Xem và cập nhật tiến độ các công việc được giao cho mình            |
| Task reader  | Xem mọi công việc, không được ghi                                   |

<details>
<summary>Mở rộng phần khởi tạo vai trò</summary>

```ts
const taskRoles = [
  {
    key: 'task-manager',
    title: 'managerRole',
    actions: ['read', 'create', 'edit', 'progress', 'delete'],
    scope: 'allRecords',
  },
  {
    key: 'task-member',
    title: 'memberRole',
    actions: ['read', 'progress'],
    scope: 'tasks.assigned',
  },
  {
    key: 'task-reader',
    title: 'readerRole',
    actions: ['read'],
    scope: 'allRecords',
  },
].map(({ key, title, actions, scope }) =>
  definePermissionSet(key)
    .title({ ns: metadata.name, key: `tasks.${title}` })
    .grant({
      resource: { type: 'page', id: 'tasks' },
      actions: [{ action: 'access' }],
    })
    .grant({
      resource: { type: 'composite', id: 'tasks' },
      actions: actions.map((action) => ({
        action,
        policy: { type: 'composite', scopes: { tasks: scope } },
      })),
    })
    .build(),
);
// Inside the transactional seed run callback:
for (const role of taskRoles) {
  const existing = await query
    .selectFrom('authorizationPermissionSets')
    .select('id')
    .where('key', '=', role.key)
    .executeTakeFirst();
  if (existing) continue;
  const now = new Date();
  await query
    .insertInto('authorizationPermissionSets')
    .values({
      id: role.key,
      key: role.key,
      title: encodeAuthorizationTitle(role.title),
      grants: JSON.stringify(role.grants),
      createdAt: now,
      updatedAt: now,
    })
    .execute();
}
```

</details>

Seed đầy đủ là [database/main/seeds/202610250102_task_roles.ts](https://github.com/nocobase/app-tutorials/blob/da050f4dd4d9ddc36c8585489bd002c6e01ad76f/database/main/seeds/202610250102_task_roles.ts). Đăng ký phần đóng góp cài đặt hệ thống đã chuẩn bị sẵn trong `client/routes.ts` và đưa các action công việc vào trình chỉnh sửa quyền:

```ts
// client/routes.ts
import systemSettingsRoutes from './pages/settings/routes.js';
const routes = [appRoutes, systemSettingsRoutes];

// client/pages/settings/permission-workspace.ts: business entry
{
  type: 'composite',
  id: 'tasks',
  actions: ['read', 'create', 'edit', 'progress', 'delete'],
  hiddenActionScopes: { create: ['tasks'] },
}
```

Giao vai trò cho từng người cụ thể trong System settings → Users. Đừng cấp vai trò nghiệp vụ cho mọi người dùng đã đăng nhập hay mở rộng vai trò `member` của nền tảng. Sửa các action và phạm vi bản ghi trong Permission management.

![Các vai trò công việc trong cài đặt hệ thống.](/assets/core/tutorials/quickstart/roles.png)

### 5. Viết test

Sau khi hiện thực tính năng, thêm các test tự động của nó trong `tests/`. Tái sử dụng cấu hình test và helper của dự án, và kiểm chứng hành vi nghiệp vụ bằng ứng dụng thật và cơ sở dữ liệu kiểm thử. Ví dụ hiện thực các test sau. Xem [thư mục tests](https://github.com/nocobase/app-tutorials/tree/da050f4dd4d9ddc36c8585489bd002c6e01ad76f/tests) để có mã đầy đủ:

```bash
tests/
├── database/
│   └── tasks-migration.test.ts                  # Tạo, rollback và áp dụng lại bảng công việc
├── server/
│   ├── tasks.test.ts                            # CRUD, kiểm tra dữ liệu, bộ lọc, phân trang và phân quyền
│   └── authorization-assignment-safety.test.ts  # Ngăn tự động cấp vai trò nghiệp vụ cho mọi người dùng
├── client/
│   ├── tasks.test.tsx                           # Kiểm tra form, phản hồi khi lưu và giới hạn chỉ đọc
│   ├── client-routes.test.ts                    # Đăng ký route trang và quyền truy cập
│   └── page-permission-titles.test.ts           # Nhãn quyền tiếng Anh và tiếng Trung
└── playwright/
    └── tasks.test.ts                            # Thao tác công việc, bộ lọc, phân trang và luồng theo vai trò
```

Khi đã viết xong test, chạy test cơ sở dữ liệu, server và client từ thư mục ứng dụng. Không cần khởi động ứng dụng trước:

```bash
pnpm test
```

Test trình duyệt dùng `pnpm test:e2e`. Hãy khởi động một ứng dụng kiểm thử riêng trước và cung cấp URL cùng thông tin đăng nhập của nó:

Cài Chromium trước lần chạy đầu tiên:

```bash
pnpm exec playwright install chromium
```

Thay URL ứng dụng và thông tin đăng nhập quản trị viên kiểm thử dưới đây. Test sẽ tạo người dùng và công việc, nên hãy dùng một ứng dụng kiểm thử riêng:

```bash
TUTORIAL_ORIGIN=http://127.0.0.1:13000 \
TUTORIAL_USERNAME='your-test-admin' TUTORIAL_PASSWORD='your-test-password' \
pnpm test:e2e
```

### 6. Tải về và chạy ví dụ hoàn chỉnh

Tải ví dụ hoàn chỉnh về để so sánh các file đầy đủ. Repository hiện là private và cần quyền truy cập GitHub. Dùng một thư mục mới thay vì ghi đè dự án của bạn.

```bash
git clone --branch fix/v3-quickstart-npm https://github.com/nocobase/app-tutorials.git team-tasks
cd team-tasks
git checkout da050f4dd4d9ddc36c8585489bd002c6e01ad76f
```

Ví dụ này dùng các package phát hành trên npmjs.org và template mặc định `1.0.0-beta.81`. Khi đã cài Node.js 24 và pnpm 11.7, hãy cài dependency trực tiếp. `.npmrc` của repository chọn npmjs.org, và lockfile cố định các phiên bản đã kiểm chứng.

```bash
pnpm install --frozen-lockfile
pnpm nocobase config init
pnpm nocobase config check
pnpm dev
```

Mở điểm vào `Local:` của ứng dụng được in ra trong terminal. Đăng nhập bằng quản trị viên ban đầu đã cấu hình cho ứng dụng đó, thêm đồng đội và giao vai trò công việc trong Users, rồi tạo các công việc của bạn. Cấu hình khi chạy, cơ sở dữ liệu và dữ liệu mẫu trong ảnh chụp không được phân phối cùng repository mã nguồn.

## Triển khai ứng dụng

Khi ứng dụng đã được xây và qua test, hãy triển khai cho nhóm của bạn. Tiếp tục với [Chọn cách triển khai](../deployment/choose-a-deployment-method.md) để chọn Docker, app-installer hoặc NocoBase Studio cho môi trường của bạn. Mỗi hướng dẫn đều có cách làm cùng Agent và không dùng Agent.

Sau khi triển khai, hãy kiểm tra đăng nhập, các thao tác với công việc và quyền theo vai trò, và xác nhận dữ liệu vẫn còn sau khi khởi động lại.
