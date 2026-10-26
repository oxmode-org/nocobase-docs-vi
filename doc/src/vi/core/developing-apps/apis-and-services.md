---
title: Dịch vụ nghiệp vụ và HTTP API
description: Tách HTTP route, business service và Provider, với kiểm tra dữ liệu đầu vào, phân quyền, lỗi và tài liệu API.
---

Một HTTP endpoint biến một request từ bên ngoài thành một thao tác nghiệp vụ. Hợp đồng của nó gồm dữ liệu đầu vào, quyền, kết quả và các trường hợp thất bại. Quy tắc nghiệp vụ có thể nằm trong một service để nhiều điểm vào tái sử dụng.

Hướng dẫn này dùng việc liệt kê, tạo dự án và gán công việc để giải thích các quy ước này. Bạn có thể đọc độc lập với phần hướng dẫn từng bước. Để chạy mã, hãy chuẩn bị bảng dự án và quan hệ với công việc từ [Mô hình dữ liệu và migration](data-models-and-migrations.md), cùng các endpoint công việc hiện có. Ví dụ dùng template mặc định `1.0.0-beta.78` và không thêm migration hay plugin nào. Model `tutorialTasks`/`tutorialProjects` thuộc về ví dụ dự án lịch sử riêng, không phải model `tasks` của phần bắt đầu sử dụng hiện tại. Xác nhận mốc ban đầu trong [Mô hình dữ liệu và migration](data-models-and-migrations.md) trước khi chạy.

## Chọn ranh giới endpoint và service

| Tình huống | Cách làm |
| --- | --- |
| Một thao tác đơn giản trên một collection | Cân nhắc năng lực route Repository của framework; vẫn cấu hình xác thực, phân quyền, dữ liệu đầu vào và tài liệu |
| Một thao tác liên quan đến nhiều loại bản ghi hoặc quy tắc nghiệp vụ rõ ràng | Viết một business service và để route xử lý ranh giới HTTP |
| Nhiều điểm vào cần cùng quy tắc | Tái sử dụng service và định nghĩa danh tính, policy cùng dữ liệu đầu vào đã kiểm tra mà mỗi nơi gọi cung cấp |
| Service cần dependency như cơ sở dữ liệu | Đăng ký nó trong một Provider và phân giải qua token |

Đổi dự án của một công việc cần kiểm tra cả công việc lẫn dự án đích, nên ví dụ này dùng route tùy chỉnh và một business service. Service không phải đường tắt nội bộ để vượt qua phân quyền: nơi gọi phải cung cấp policy phù hợp với thao tác.

## Hợp đồng API ví dụ

Các đường dẫn này là tương đối so với API root của ứng dụng. Với ứng dụng ở `/main/`, root đó là `/main/api`:

- `GET /tutorialProjects`: liệt kê dự án trong phạm vi được phép của thao tác, có phân trang.
- `POST /tutorialProjects`: tạo một dự án và trả về `201` với `{ data }`.
- `PATCH /tutorialTasks/{id}/project`: thay đổi liên kết dự án của công việc; `projectId: null` bỏ liên kết.

Liên kết dự án có endpoint subresource và quyền riêng. `PATCH /tutorialTasks/{id}` hiện có vẫn chỉ hoàn thành hoặc mở lại công việc và không nhận `projectId`. Phản hồi danh sách công việc có thêm `projectId`, không tự động trả về tên dự án hay để lộ chi tiết dự án.

## Tách ba trách nhiệm

**Route xử lý HTTP.** Chúng xác thực, phân quyền, kiểm tra dữ liệu đầu vào, khai báo tài liệu API và chuyển lỗi thành phản hồi phù hợp. Chỉ dữ liệu đầu vào đã kiểm tra mới đến được service.

**Service xử lý hành vi nghiệp vụ.** Chúng truy vấn và tạo dự án, và thực thi quy tắc gán. Mỗi thao tác nhận policy phân quyền của nó và gắn vào các lần đọc, ghi của Repository. Service không đọc Hono Context hay trả về đối tượng HTTP Response.

**Provider lắp ráp dependency.** Chúng đăng ký service cùng token, khai báo quyền về dự án và cho route phân giải cùng một service từ container của ứng dụng.

## Quy ước về đầu vào, phản hồi và lỗi

Kiểm tra dữ liệu đầu vào bằng `apiValidator()` và để mã nghiệp vụ chỉ đọc các giá trị đã kiểm tra. Client không được tự do đặt ID do server tạo, thời gian tạo hay các field nằm ngoài action. Chọn rõ các field trả về; dùng cùng policy quyền và bộ lọc cho các dòng và tổng số của danh sách.

| Kết quả | Hành vi trong ví dụ này |
| --- | --- |
| Truy vấn thành công | `200` với `{ data, meta }`; `meta` chứa thông tin phân trang |
| Tạo thành công | `201` với `{ data }` |
| Cập nhật thành công | `200` với `{ data }`, chỉ chứa các field kết quả của thao tác này |
| Dữ liệu đầu vào không hợp lệ | `400` với lỗi API chuẩn và chi tiết field khi có |
| Chưa xác thực hoặc action bị từ chối | Lần lượt là `401` hoặc `403`, không ghi dữ liệu nghiệp vụ |
| Công việc không tồn tại hoặc ngoài phạm vi của thao tác | `404`, không để lộ chi tiết bản ghi ngoài phạm vi |
| Dự án đích không tồn tại hoặc không hợp lệ | `400` với lỗi field dự án nhất quán; liên kết cũ được giữ nguyên |

Dùng `ApiError` và handler dùng chung thay vì một định dạng JSON lỗi tự đặt hay phản hồi `200` cho trường hợp thất bại. Chuyển các lỗi nghiệp vụ đã biết thành lỗi API cụ thể; để các exception chưa biết cho handler chuẩn thay vì coi tất cả là dữ liệu đầu vào không hợp lệ.

## Cùng Agent

Đưa chương này cho Agent làm ngữ cảnh từ thư mục ứng dụng, rồi mô tả yêu cầu dưới đây. Chi tiết về field, API và component nằm trong các bước thủ công; Agent nên theo chúng cùng với hướng dẫn của dự án.

```text
Dựa trên mô hình dữ liệu dự án hiện có, hãy cung cấp API để liệt kê, tạo dự án và đổi dự án của công việc, để các trang sau này dùng.

Phân trang danh sách dự án. Cả bản ghi lẫn tổng số chỉ được tính các dự án người dùng hiện tại được xem.
Đổi dự án của công việc cần cho phép chọn một dự án hợp lệ hoặc không chọn dự án nào.
Xem được một dự án không nhất thiết được gán công việc vào nó; hãy kiểm tra quyền với cả công việc lẫn dự án đích.
Nếu dự án không còn tồn tại hoặc không thể chọn, hãy báo là không chọn được, giữ nguyên cách gán cũ và tránh để lộ thông tin dự án không được truy cập.

Kiểm soát riêng quyền xem, tạo và gán, không tự động cấp quyền cho người dùng thông thường.
Giữ nguyên việc hoàn thành và mở lại công việc; các action đó không được cho phép gán lại dự án.
Theo hướng dẫn phát triển của dự án, làm cho các quy tắc nghiệp vụ này tái sử dụng được, và ghi cách dùng vào tài liệu API của ứng dụng.

Dùng tài khoản và dữ liệu kiểm thử thật để kiểm chứng các thao tác được phép và bị từ chối, và báo cáo kết quả.
Chưa thêm trang dự án, phê duyệt, thông báo hay job nền.
```

## Không dùng Agent

### Viết business service độc lập với HTTP

Tạo `server/providers/tutorial-project-service.ts`. Mở rộng phần hiện thực đầy đủ để sao chép:

<details>
<summary>Business service cho dự án</summary>

```ts
import { randomUUID } from 'node:crypto';
import type { DatabaseManager, RepositoryPolicy } from '@nocobase/db';

export interface ProjectView {
  id: string;
  name: string;
  createdAt: string;
}
export interface TaskProjectView {
  id: string;
  projectId: string | null;
  updatedAt: string;
}
export class ProjectUnavailableError extends Error {
  constructor() {
    super('The selected project is unavailable.');
  }
}
export class TaskUnavailableError extends Error {
  constructor() {
    super('The task is unavailable.');
  }
}
const projectView = (row: Record<string, unknown>): ProjectView => ({
  id: String(row.id),
  name: String(row.name),
  createdAt: new Date(row.createdAt as string | Date).toISOString(),
});

export class TutorialProjectService {
  constructor(private readonly database: DatabaseManager) {}

  async list(
    policy: RepositoryPolicy,
    input: { page: number; pageSize: number },
  ) {
    const projects = this.database
      .repository('tutorialProjects')
      .withPolicy(policy);
    const rows = await projects.findMany({
      select: (s) => s.fields('id', 'name', 'createdAt'),
      limit: input.pageSize,
      offset: (input.page - 1) * input.pageSize,
      sort: (s) => [s.field('createdAt').desc(), s.field('id').desc()],
    });
    return {
      data: rows.map(projectView),
      meta: { ...input, total: await projects.count() },
    };
  }

  async create(
    policy: RepositoryPolicy,
    input: { name: string },
  ): Promise<ProjectView> {
    const result = await this.database
      .repository('tutorialProjects')
      .withPolicy(policy)
      .createOne({
        select: (s) => s.fields('id', 'name', 'createdAt'),
        values: { id: randomUUID(), name: input.name, createdAt: new Date() },
      });
    return projectView(result.record);
  }

  async assignTask(
    policies: { tasks: RepositoryPolicy; projects: RepositoryPolicy },
    taskId: string,
    projectId: string | null,
  ): Promise<TaskProjectView> {
    return this.database.transaction(async (connection) => {
      const tasks = connection
        .repository('tutorialTasks')
        .withPolicy(policies.tasks);
      const task = await tasks.findOne({
        filter: { id: taskId },
        select: (s) => s.fields('id'),
      });
      if (!task) throw new TaskUnavailableError();
      if (projectId !== null) {
        const project = await connection
          .repository('tutorialProjects')
          .withPolicy(policies.projects)
          .findOne({
            filter: { id: projectId },
            select: (s) => s.fields('id'),
          });
        if (!project) throw new ProjectUnavailableError();
      }
      const result = await tasks.updateOne({
        select: (s) => s.fields('id', 'projectId', 'updatedAt'),
        filter: { id: taskId },
        values: { projectId, updatedAt: new Date() },
      });
      return {
        id: taskId,
        projectId: result.record.projectId as string | null,
        updatedAt: new Date(
          result.record.updatedAt as string | Date,
        ).toISOString(),
      };
    });
  }
}
```

</details>

`list()` dùng `withPolicy()` để giới hạn các bản ghi đọc được trước khi phân trang, sắp xếp và đếm. Thứ tự sắp xếp có `id` duy nhất, giữ cho các bản ghi trùng thời gian tạo có thứ tự ổn định. Service trả về các field được chọn rõ ràng và chuyển timestamp thành chuỗi ISO.

`create()` tạo ID và timestamp ở phía server; nơi gọi chỉ cung cấp tên. Tạo dự án không cấp quyền mới cho người tạo. Đọc dự án sau đó vẫn cần action đọc và phạm vi bản ghi đã cấu hình.

`assignTask()` đọc công việc, kiểm tra dự án đích và cập nhật công việc trong một transaction. Mỗi collection dùng policy riêng. Được phép thay đổi một công việc không cấp quyền truy cập mọi dự án, và xem được một dự án trong danh sách không nhất thiết là chọn được nó cho thao tác này. Bỏ liên kết thì không cần tra cứu dự án đích nhưng vẫn cần action gán và phạm vi công việc.

`ProjectUnavailableError` và `TaskUnavailableError` là các lỗi miền nghiệp vụ được route bên dưới chuyển đổi. Lỗi quyền và lỗi không tìm thấy bản ghi của chính Repository do framework xử lý. Đừng bắt mọi exception rồi biến chúng thành thành công hay dữ liệu đầu vào không hợp lệ.

### Đăng ký service và quyền

Tạo `server/providers/tutorial-projects.ts`:

<details>
<summary>Provider và khai báo quyền</summary>

```ts
import metadata from '../../package.json' with { type: 'json' };
import type { Application } from '@nocobase/app-server/application';
import { databaseManagerToken } from '@nocobase/db';
import {
  createServiceToken,
  ServiceProvider,
} from '@nocobase/service-provider';
import { defineCompositeResource } from '@nocobase/authorization/core';
import {
  authorizationToken,
  defineDatabasePermission,
} from '@nocobase/app-plugin-authorization/server';
import { TutorialProjectService } from './tutorial-project-service.js';

export const tutorialProjectServiceToken =
  createServiceToken<TutorialProjectService>('app/tutorial-projects');
const projects = defineDatabasePermission((p) =>
  p.collection('tutorialProjects').read(['id', 'name', 'createdAt']),
);
const tasks = defineDatabasePermission((p) =>
  p
    .collection('tutorialTasks')
    .read(['id', 'projectId', 'updatedAt'])
    .update(['projectId', 'updatedAt']),
);
export const projectPermissions = defineCompositeResource(
  'tutorial.projects',
  (r) =>
    r
      .title({ key: 'projects.title', ns: metadata.name })
      .action('read', (a) =>
        a
          .title({ key: 'projects.read', ns: metadata.name })
          .grant('projects', projects),
      )
      .action('create', (a) =>
        a
          .title({ key: 'projects.create', ns: metadata.name })
          .grant('projects', projects.create(['id', 'name', 'createdAt'])),
      )
      .action('assignTask', (a) =>
        a
          .title({ key: 'projects.assignTask', ns: metadata.name })
          .grant('tasks', tasks)
          .grant('projects', projects),
      ),
);

export default class TutorialProjectsProvider extends ServiceProvider<Application> {
  public readonly name = 'app/tutorial-projects';
  public override register(): void {
    this.app.container.singleton(
      tutorialProjectServiceToken,
      () =>
        new TutorialProjectService(
          this.app.container.resolve(databaseManagerToken),
        ),
    );
  }
  public override async boot(): Promise<void> {
    const authz = this.app.container.resolve(authorizationToken);
    authz.database.collections.add({
      name: 'tutorialProjects',
      title: { key: 'projects.title', ns: metadata.name },
    });
    const resource = authz.compositeResources.define(projectPermissions);
    authz.ui.place(resource, { section: 'tutorial' });
  }
}
```

</details>

`register()` gắn service factory. Container phân giải database và khởi tạo service khi cần. `boot()` đăng ký collection dự án và ba action: xem dự án, tạo dự án và đổi dự án của công việc. Action cuối có hai phạm vi riêng `tasks` và `projects` cho công việc sửa được và dự án chọn được.

Việc đăng ký chỉ mô tả các năng lực có sẵn; nó không tạo ra việc gán vai trò nào. `TutorialTasksProvider` đã đăng ký collection công việc. Hãy giữ provider mới đứng sau nó để tái sử dụng phần quyền của hướng dẫn đã có.

Cập nhật `server/providers/index.ts`, giữ nguyên provider hiện có:

```ts
import TutorialProjectsProvider from './tutorial-projects.js';
import TutorialTasksProvider from './tutorial-tasks.js';
import type { ApplicationServiceProviderConstructor } from '@nocobase/app-server/application';

const serviceProviders: readonly ApplicationServiceProviderConstructor[] = [
  TutorialTasksProvider,
  TutorialProjectsProvider,
];

export default serviceProviders;
```

Thêm các thuộc tính này vào đối tượng locale của ứng dụng trong `client/locales/en-US.ts`:

```ts
projects: {
  title: 'Projects',
  read: 'View projects',
  create: 'Create projects',
  assignTask: 'Change task project',
},
```

Thêm các thuộc tính tương ứng trong `client/locales/zh-CN.ts`:

```ts
projects: {
  title: '项目',
  read: '查看项目',
  create: '新建项目',
  assignTask: '修改任务项目',
},
```

Đây là các mảnh thuộc tính của đối tượng. Hãy merge chúng vào các đối tượng locale hiện có; đừng thay nội dung khác hay sửa `client/locales/system/`.

### Khai báo và đăng ký route

Tạo `server/routes/tutorial-projects.ts`:

<details>
<summary>Route API cho dự án</summary>

```ts
import { Hono, type MiddlewareHandler } from 'hono';
import { z } from 'zod';
import { authenticationToken } from '@nocobase/app-plugin-authentication/server';
import {
  authorizationToken,
  type AuthorizationEnv,
} from '@nocobase/app-plugin-authorization/server';
import type { Application } from '@nocobase/app-server/application';
import {
  ApiError,
  apiErrorHandler,
  apiErrorResponses,
  apiErrorResponse,
  apiValidator,
  dataResponse,
  listResponse,
  defineApiRoutes,
} from '@nocobase/app-server/router';
import { describeRoute } from '@nocobase/app-server/router';
import type { RepositoryPolicy } from '@nocobase/db';
import { tutorialProjectServiceToken } from '../providers/tutorial-projects.js';
import {
  ProjectUnavailableError,
  TaskUnavailableError,
  type ProjectView,
  type TaskProjectView,
} from '../providers/tutorial-project-service.js';

const projectSchema: z.ZodType<ProjectView> = z.object({
  id: z.uuid(),
  name: z.string(),
  createdAt: z.iso.datetime(),
});
const taskProjectSchema: z.ZodType<TaskProjectView> = z.object({
  id: z.uuid(),
  projectId: z.uuid().nullable(),
  updatedAt: z.iso.datetime(),
});
const listInput = z.strictObject({
  page: z.coerce.number().int().min(1).max(1_000_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
const createInput = z.strictObject({ name: z.string().trim().min(1).max(120) });
const assignInput = z.strictObject({ projectId: z.uuid().nullable() });
type ProjectEnv = {
  Variables: AuthorizationEnv['Variables'] & {
    projectPolicy: RepositoryPolicy;
    taskPolicy: RepositoryPolicy;
  };
};

export default defineApiRoutes<Application>((app) => {
  const router = new Hono<ProjectEnv>();
  const auth = app.container.resolve(authenticationToken);
  const authz = app.container.resolve(authorizationToken);
  const service = app.container.resolve(tutorialProjectServiceToken);
  // Scope authentication to these endpoints; do not depend on another contribution.
  router.use('/tutorialProjects', auth.required(), authz.middleware());
  router.use('/tutorialTasks/:id/project', auth.required(), authz.middleware());
  router.onError((error, c) =>
    apiErrorHandler(
      error instanceof ProjectUnavailableError
        ? new ApiError({
            status: 'INVALID_ARGUMENT',
            reason: 'PROJECT_UNAVAILABLE',
            domain: 'tutorialProjects',
            message: error.message,
            fieldViolations: [
              {
                field: 'projectId',
                description: 'Choose an available project.',
              },
            ],
          })
        : error instanceof TaskUnavailableError
          ? new ApiError({
              status: 'NOT_FOUND',
              reason: 'TASK_NOT_FOUND',
              domain: 'tutorialProjects',
              message: error.message,
            })
          : error,
      c,
    ),
  );
  const permit =
    (action: 'read' | 'create' | 'assignTask'): MiddlewareHandler<ProjectEnv> =>
    async (c, next) => {
      const decision = await c.get('authz').authorize({
        resource: { type: 'composite', id: 'tutorial.projects' },
        action,
      });
      const projects = decision.conditions?.database?.tutorialProjects;
      const tasks = decision.conditions?.database?.tutorialTasks;
      if (
        decision.effect === 'deny' ||
        !projects ||
        (action === 'assignTask' && !tasks)
      ) {
        throw new ApiError({
          status: 'PERMISSION_DENIED',
          reason: 'PROJECT_ACTION_DENIED',
          domain: 'tutorialProjects',
          message: 'This project action is not allowed.',
        });
      }
      c.set('projectPolicy', projects);
      if (tasks) c.set('taskPolicy', tasks);
      await next();
    };
  router.get(
    '/tutorialProjects',
    permit('read'),
    describeRoute({
      tags: ['Tutorial projects'],
      summary: 'List projects',
      operationId: 'listTutorialProjects',
      responses: { 200: listResponse(projectSchema), ...apiErrorResponses },
    }),
    apiValidator('query', listInput),
    async (c) =>
      c.json(await service.list(c.get('projectPolicy'), c.req.valid('query'))),
  );
  router.post(
    '/tutorialProjects',
    permit('create'),
    describeRoute({
      tags: ['Tutorial projects'],
      summary: 'Create a project',
      operationId: 'createTutorialProject',
      responses: { 201: dataResponse(projectSchema), ...apiErrorResponses },
    }),
    apiValidator('json', createInput),
    async (c) =>
      c.json(
        {
          data: await service.create(
            c.get('projectPolicy'),
            c.req.valid('json'),
          ),
        },
        201,
      ),
  );
  router.patch(
    '/tutorialTasks/:id/project',
    permit('assignTask'),
    describeRoute({
      tags: ['Tutorial projects'],
      summary: 'Change a task project',
      operationId: 'assignTutorialTaskProject',
      responses: {
        200: dataResponse(taskProjectSchema),
        400: apiErrorResponse(400),
        404: apiErrorResponse(404),
        ...apiErrorResponses,
      },
    }),
    apiValidator('param', z.object({ id: z.uuid() })),
    apiValidator('json', assignInput),
    async (c) =>
      c.json({
        data: await service.assignTask(
          { tasks: c.get('taskPolicy'), projects: c.get('projectPolicy') },
          c.req.valid('param').id,
          c.req.valid('json').projectId,
        ),
      }),
  );
  return new Hono().route('/', router);
});
```

</details>

Đừng đưa `/api` hay base path của bản triển khai vào định nghĩa route; `defineApiRoutes()` và runtime sẽ thêm chúng. Middleware xác thực chỉ bao quát các đường dẫn thuộc file này. Một endpoint không được dựa vào việc một phần đóng góp route khác tình cờ đã đăng ký xác thực trước.

Mỗi endpoint xác thực và phân quyền trước khi `apiValidator()` chạy. `describeRoute()` khai báo thao tác, phản hồi và lỗi; schema đầu vào cũng xuất hiện trong tài liệu API. Phân trang có giới hạn, tên được cắt khoảng trắng và kiểm tra độ dài, còn `strictObject()` từ chối các field thừa. Endpoint liên kết không thể đồng thời sửa tiêu đề hay trạng thái hoàn thành của công việc.

Mọi ID dự án trong ví dụ này đều do `randomUUID()` tạo, nên được kiểm tra bằng `z.uuid()`. ID người dùng ở nơi khác trong ứng dụng không nhất thiết là UUID; đừng áp quy tắc này cho field người được giao hiện có.

Cập nhật `server/routes/index.ts`:

```ts
import projectRoutes from './tutorial-projects.js';
import taskRoutes from './tutorial-tasks.js';
import type { Application } from '@nocobase/app-server/application';
import type { AppRouteContribution } from '@nocobase/app-server/router';

const routes: readonly AppRouteContribution<Application>[] = [
  taskRoutes,
  projectRoutes,
];

export default routes;
```

Thực hiện hai thay đổi nhỏ để danh sách công việc hiện có trả về được liên kết đã lưu:

- Thêm `projectId` vào các field `.read([...])` của `taskData` trong `server/providers/tutorial-tasks.ts`. Đừng thêm nó vào các field ghi được của action tạo hay hoàn thành ban đầu.
- Thêm `projectId: z.uuid().nullable()` vào `taskSchema` trong `server/routes/tutorial-tasks.ts`, giữ cho phản hồi trong tài liệu khớp với dữ liệu. Giữ nguyên `createInput` và `updateInput`.

Thêm mục này vào cuối `permissionWorkspaceSelection.business` trong `client/pages/settings/permission-workspace.ts`, giữ nguyên mục công việc hiện có:

```ts
{
  type: 'composite',
  id: 'tutorial.projects',
  actions: ['read', 'create', 'assignTask'],
  scopeTitles: {
    tutorialTasks: { key: 'tasks.title' },
    tutorialProjects: { key: 'projects.title' },
  },
},
```

Khai báo phía server định nghĩa năng lực; cấu hình phía client này chọn các thao tác nghiệp vụ mà trình chỉnh sửa quyền hiển thị. Thiếu nó, API vẫn thực thi các quyền mà quản trị viên không cấu hình được qua trình chỉnh sửa hiện tại.

### Cấu hình vai trò và phạm vi dữ liệu

Quản trị viên có thể tạo hoặc sửa một vai trò trong System settings → Permission management. Tìm Projects trong phần nghiệp vụ công việc hiện có và chọn View projects, Create projects hoặc Change task project. Với việc gán, hãy cấu hình riêng phạm vi bản ghi công việc và dự án. Giao vai trò cho các người dùng kiểm thử cụ thể qua Users.

![Quyền nghiệp vụ dự án với View projects, Create projects và Change task project được chọn, kèm phạm vi công việc và dự án riêng](/assets/core/developing-apps/apis-and-services/project-permissions.png)

Ảnh chụp cho thấy một vai trò **Project coordinator** chưa lưu trong **Business operations → Projects**. **All Records** được chọn cho buổi minh họa cục bộ này. Hãy chọn phạm vi phù hợp với trách nhiệm của vai trò, lưu vai trò, rồi giao cho từng người dùng cụ thể.

Người dùng cần trang công việc hiện có cũng cần quyền trang đó và các action công việc liên quan. Quyền truy cập trang không cho phép gọi API, và thao tác với dự án không cấp quyền quản trị người dùng.

Các test bên dưới tạo vai trò và giao cho người dùng tách biệt qua service phân quyền thật. Quản trị viên cấu hình vai trò trong ứng dụng thực tế; đừng thêm quyền nghiệp vụ vào vai trò `member` được kế thừa.

## Đưa endpoint vào tài liệu API

Mọi route `/api` nên khai báo `describeRoute()` với `operationId` ổn định, nhóm, mục đích, phản hồi thành công và phản hồi lỗi. `apiValidator()` cung cấp schema đầu vào. Cập nhật schema phản hồi cùng lúc với thay đổi endpoint để tài liệu khớp với phản hồi thực tế.

Ứng dụng đang chạy cung cấp mô tả API tại `<APP_BASE_PATH>/api/swagger` và trang tương tác tại `<APP_BASE_PATH>/api/swagger/docs`. Đăng ký route trong `server/routes/index.ts`; khai báo trong một file chưa đăng ký sẽ không trở thành endpoint gọi được.

## Kiểm chứng hành vi của endpoint

Chạy `pnpm dev` trong ví dụ cục bộ và đăng nhập tại URL ứng dụng đầy đủ được in ra trong terminal. Mở `<APP_BASE_PATH>/api/swagger/docs` trên cùng ứng dụng, ví dụ `/main/api/swagger/docs`. Tài liệu API dùng phiên đã đăng nhập, nên không cần lưu mật khẩu quản trị viên trong bài viết hay mã.

Tìm `Tutorial projects` để thấy ba endpoint được thêm trong chương này. Mở rộng một endpoint, chọn **Try it out**, nhập tham số, rồi chọn **Execute** để gửi request.

![Nhóm API Tutorial projects liệt kê truy vấn dự án, tạo dự án và gán dự án cho công việc](/assets/core/developing-apps/apis-and-services/api-overview.png)

Kiểm chứng theo trình tự sau:

1. Gọi `POST /tutorialProjects` với `{ "name": "Product launch" }`. Mong đợi `201` và ghi lại `data.id`.
2. Gọi `GET /tutorialProjects?page=1&pageSize=20`. Kiểm tra dự án và `meta.page`, `meta.pageSize`, `meta.total`.
3. Lấy một ID công việc từ danh sách công việc hiện có và gọi endpoint liên kết với ID dự án mới làm `projectId`.
4. Truy vấn lại danh sách công việc và xác nhận `projectId` được lưu. Gửi null để bỏ liên kết.
5. Dùng một UUID hợp lệ không ứng với dự án nào. Mong đợi `400`, `error.reason: PROJECT_UNAVAILABLE` và một lỗi vi phạm field cho `projectId`, với liên kết trước đó không đổi.
6. Đăng nhập bằng một người dùng thông thường chỉ có quyền hoàn thành công việc. Họ hoàn thành được công việc, nhưng endpoint liên kết trả về `403`.

![Một request gán dự án cho công việc thành công trả về 200 với id công việc, projectId và updatedAt trong data](/assets/core/developing-apps/apis-and-services/assign-project-success.png)

Sau khi gán, kiểm tra trạng thái `200` trong **Server response** và `projectId` được trả về, rồi truy vấn danh sách công việc để xác nhận đã lưu. Ảnh chụp dùng ID của ví dụ cục bộ; khi làm theo, hãy dùng ID từ bản ghi của chính bạn.

![Một dự án không khả dụng trả về 400 với PROJECT_UNAVAILABLE và lỗi vi phạm field cho projectId](/assets/core/developing-apps/apis-and-services/project-unavailable.png)

Một dự án không tồn tại trả về `PROJECT_UNAVAILABLE` với `fieldViolations` chỉ ra `projectId`. Đọc lại công việc để xác nhận liên kết dự án trước đó không đổi.

Các trường hợp lỗi được phân biệt rõ: request ẩn danh trả về `401`; thiếu quyền thao tác trả về `403`; thao tác được phép nhưng công việc không tồn tại hoặc ngoài phạm vi trả về `404`; dự án được tham chiếu trong body không tồn tại hoặc không chọn được trả về cùng một lỗi field `400`. Phản hồi giống nhau cho bản ghi không tồn tại và bản ghi ngoài phạm vi giúp tránh tiết lộ sự tồn tại của bản ghi bị ẩn.

## Thêm test endpoint thật

Tạo `tests/server/tutorial-tasks-project-api.test.ts`. Nó dùng cấu hình test hiện có, đăng nhập và quyền thật, và một cơ sở dữ liệu tách biệt. Service xác thực và cơ sở dữ liệu không bị thay thế.

<details>
<summary>Test API đầy đủ</summary>

```ts
import { permissionWorkspaceCatalog } from '../../client/pages/settings/permission-workspace.js';
import type { AuthorizationOptionsResponse } from '@nocobase/app-plugin-authorization/client';
import { randomUUID } from 'node:crypto';
import { expect } from 'vitest';
import { createAppTest } from '@nocobase/app-testing/server';
import {
  signIn,
  DEFAULT_ADMIN_CREDENTIALS,
} from '@nocobase/app-plugin-authentication/testing';
import { userAdministrationServiceToken } from '@nocobase/app-plugin-authentication/server';
import { authorizationToken } from '@nocobase/app-plugin-authorization/server';
import { selection } from '@nocobase/authorization/core';
import { databaseManagerToken } from '@nocobase/db';
import { projectPermissions } from '../../server/providers/tutorial-projects.js';
import { taskPermissions } from '../../server/providers/tutorial-tasks.js';
import { createStandaloneServer } from '../../server/standalone.js';

const test = createAppTest({
  createServer: createStandaloneServer,
  connections: ['main'],
  config: {
    app: { publicOrigin: 'http://localhost' },
    auth: {
      secret: 'project-api-test-secret-at-least-32-characters',
      advanced: { disableOriginCheck: false, disableCSRFCheck: false },
    },
    users: { initialAdmin: DEFAULT_ADMIN_CREDENTIALS },
    logging: { enabled: false },
  },
});
const json = (method: string, value: unknown) => ({
  method,
  headers: { 'content-type': 'application/json', origin: 'http://localhost' },
  body: JSON.stringify(value),
});

// Every case uses the real application, authentication and authorization services.
test('rejects anonymous and ungranted callers before validating their input', async ({
  testApp,
  request,
}) => {
  for (const [path, init] of [
    ['/tutorialProjects', undefined],
    ['/tutorialProjects', json('POST', { name: '' })],
    ['/tutorialTasks/not-an-id/project', json('PATCH', {})],
  ] as const)
    expect((await request(path, init)).status).toBe(401);
  const users = testApp.application.container.resolve(
    userAdministrationServiceToken,
  );
  const credentials = {
    email: 'ungranted-project@example.test',
    password: 'project-test-password',
  };
  await users.create({ name: 'No project grants', ...credentials });
  const member = await signIn(testApp, credentials);
  expect((await member.fetch('/tutorialProjects')).status).toBe(403);
  expect(
    (await member.fetch('/tutorialProjects', json('POST', { name: '' })))
      .status,
  ).toBe(403);
  expect(
    (await member.fetch('/tutorialTasks/not-an-id/project', json('PATCH', {})))
      .status,
  ).toBe(403);
});

test('creates validated projects and returns stable paged DTOs', async ({
  testApp,
}) => {
  const admin = await signIn(testApp, DEFAULT_ADMIN_CREDENTIALS);
  const db = testApp.application.container.resolve(databaseManagerToken);
  const before = await db.repository('tutorialProjects').count();
  for (const input of [
    { name: '' },
    { name: '   ' },
    { name: 'x'.repeat(121) },
    { name: 'Injected', id: randomUUID() },
  ]) {
    const response = await admin.fetch(
      '/tutorialProjects',
      json('POST', input),
    );
    expect(response.status).toBe(400);
  }
  expect(await db.repository('tutorialProjects').count()).toBe(before);
  const response = await admin.fetch(
    '/tutorialProjects',
    json('POST', { name: '  Product launch  ' }),
  );
  expect(response.status).toBe(201);
  const { data } = (await response.json()) as {
    data: { id: string; name: string; createdAt: string };
  };
  expect(data.name).toBe('Product launch');
  expect(Object.keys(data).sort()).toEqual(['createdAt', 'id', 'name']);
  expect(new Date(data.createdAt).toISOString()).toBe(data.createdAt);
  expect(
    await db
      .repository('tutorialProjects')
      .findOne({ filter: { id: data.id } }),
  ).toMatchObject({ name: data.name });
  const page = await admin.fetch('/tutorialProjects?page=1&pageSize=1');
  expect(await page.json()).toMatchObject({
    data: [data],
    meta: { page: 1, pageSize: 1, total: before + 1 },
  });
  for (const query of ['page=0', 'pageSize=101', 'pageSize=abc'])
    expect((await admin.fetch(`/tutorialProjects?${query}`)).status).toBe(400);
});

test('changes and clears a task project without changing other task fields', async ({
  testApp,
}) => {
  const admin = await signIn(testApp, DEFAULT_ADMIN_CREDENTIALS);
  const created = await admin.fetch(
    '/tutorialProjects',
    json('POST', { name: 'Assignment project' }),
  );
  const projectId = ((await created.json()) as { data: { id: string } }).data
    .id;
  const task = await admin.fetch(
    '/tutorialTasks',
    json('POST', { title: 'Prepare materials', dueDate: '2026-11-01' }),
  );
  const taskId = ((await task.json()) as { data: { id: string } }).data.id;
  const db = testApp.application.container.resolve(databaseManagerToken);
  const path = `/tutorialTasks/${taskId}/project`;
  for (const id of [projectId, null]) {
    const response = await admin.fetch(path, json('PATCH', { projectId: id }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      data: { id: taskId, projectId: id },
    });
    const listing = await admin.fetch('/tutorialTasks?q=Prepare%20materials');
    expect(await listing.json()).toMatchObject({
      data: [expect.objectContaining({ id: taskId, projectId: id })],
    });
    expect(
      await db.repository('tutorialTasks').findOne({ filter: { id: taskId } }),
    ).toMatchObject({
      title: 'Prepare materials',
      completed: false,
      dueDate: '2026-11-01',
      projectId: id,
    });
  }
  const missing = await admin.fetch(
    path,
    json('PATCH', { projectId: randomUUID() }),
  );
  expect(missing.status).toBe(400);
  expect(await missing.json()).toMatchObject({
    error: {
      reason: 'PROJECT_UNAVAILABLE',
      fieldViolations: [{ field: 'projectId' }],
    },
  });
  expect(
    (
      await admin.fetch(
        `/tutorialTasks/${randomUUID()}/project`,
        json('PATCH', { projectId }),
      )
    ).status,
  ).toBe(404);
  for (const input of [
    {},
    { projectId: 'invalid' },
    { projectId, completed: true },
  ])
    expect((await admin.fetch(path, json('PATCH', input))).status).toBe(400);
  expect(
    await db.repository('tutorialTasks').findOne({ filter: { id: taskId } }),
  ).toMatchObject({ projectId: null, completed: false });
});

test('applies separate task and project scopes without borrowing broader read grants', async ({
  testApp,
}) => {
  const users = testApp.application.container.resolve(
    userAdministrationServiceToken,
  );
  const credentials = {
    email: 'scoped-project@example.test',
    password: 'project-test-password',
  };
  const user = await users.create({ name: 'Project operator', ...credentials });
  const member = await signIn(testApp, credentials);
  const db = testApp.application.container.resolve(databaseManagerToken);
  const projectIds = [randomUUID(), randomUUID()];
  const taskIds = [randomUUID(), randomUUID()];
  for (const id of projectIds)
    await db
      .repository('tutorialProjects')
      .createOne({ values: { id, name: id, createdAt: new Date() } });
  for (const id of taskIds)
    await db.repository('tutorialTasks').createOne({
      values: {
        id,
        title: 'Scoped task',
        completed: false,
        updatedAt: new Date(),
      },
    });
  const authz = testApp.application.container.resolve(authorizationToken);
  await authz.permissionSets.create({
    key: 'project-operator',
    grants: [
      projectPermissions.reference().grant({
        read: { projects: selection.records(projectIds) },
        assignTask: {
          projects: selection.records([projectIds[0]]),
          tasks: selection.records([taskIds[0]]),
        },
      }),
    ],
  });
  await authz.permissionSets.assign({
    id: 'project-operator-user',
    permissionSet: 'project-operator',
    subject: { type: 'user', id: user.id },
  });
  const list = await member.fetch('/tutorialProjects?pageSize=1');
  const body = (await list.json()) as {
    data: unknown[];
    meta: { total: number };
  };
  expect(list.status).toBe(200);
  expect(body.data).toHaveLength(1);
  expect(body.meta.total).toBe(2);
  expect(
    (
      await member.fetch(
        '/tutorialProjects',
        json('POST', { name: 'Forbidden' }),
      )
    ).status,
  ).toBe(403);
  const assign = (taskId: string, projectId: string) =>
    member.fetch(
      `/tutorialTasks/${taskId}/project`,
      json('PATCH', { projectId }),
    );
  expect((await assign(taskIds[0], projectIds[0])).status).toBe(200);
  const hidden = await assign(taskIds[0], projectIds[1]);
  expect(hidden.status).toBe(400);
  expect(await hidden.json()).toMatchObject({
    error: {
      reason: 'PROJECT_UNAVAILABLE',
      fieldViolations: [{ field: 'projectId' }],
    },
  });
  expect((await assign(taskIds[1], projectIds[0])).status).toBe(404);
  expect(
    await db
      .repository('tutorialTasks')
      .findOne({ filter: { id: taskIds[0] } }),
  ).toMatchObject({ projectId: projectIds[0] });
  expect(
    await db
      .repository('tutorialTasks')
      .findOne({ filter: { id: taskIds[1] } }),
  ).toMatchObject({ projectId: null });
  await authz.permissionSets.delete('project-operator');
  expect((await assign(taskIds[0], projectIds[0])).status).toBe(403);
});

test('does not let task completion grants change a project assignment', async ({
  testApp,
}) => {
  const users = testApp.application.container.resolve(
    userAdministrationServiceToken,
  );
  const credentials = {
    email: 'task-completer@example.test',
    password: 'project-test-password',
  };
  const user = await users.create({ name: 'Task completer', ...credentials });
  const member = await signIn(testApp, credentials);
  const authz = testApp.application.container.resolve(authorizationToken);
  await authz.permissionSets.create({
    key: 'task-completer',
    grants: [
      taskPermissions.reference().grant({ update: { tasks: 'allRecords' } }),
    ],
  });
  await authz.permissionSets.assign({
    id: 'task-completer-user',
    permissionSet: 'task-completer',
    subject: { type: 'user', id: user.id },
  });
  const id = randomUUID();
  const db = testApp.application.container.resolve(databaseManagerToken);
  await db.repository('tutorialTasks').createOne({
    values: {
      id,
      title: 'Complete only',
      completed: false,
      updatedAt: new Date(),
    },
  });
  expect(
    (
      await member.fetch(
        `/tutorialTasks/${id}`,
        json('PATCH', { completed: true }),
      )
    ).status,
  ).toBe(200);
  expect(
    (
      await member.fetch(
        `/tutorialTasks/${id}/project`,
        json('PATCH', { projectId: null }),
      )
    ).status,
  ).toBe(403);
  expect(
    (
      await member.fetch(
        `/tutorialTasks/${id}`,
        json('PATCH', { projectId: randomUUID() }),
      )
    ).status,
  ).toBe(400);
});

test('publishes all endpoints and input schemas in the authenticated API document', async ({
  testApp,
}) => {
  const admin = await signIn(testApp, DEFAULT_ADMIN_CREDENTIALS);
  const response = await admin.fetch('/swagger');
  expect(response.status).toBe(200);
  const document = (await response.json()) as {
    paths: Record<
      string,
      Record<string, { operationId: string; requestBody?: unknown }>
    >;
  };
  const projectPath = Object.keys(document.paths).find((p) =>
    p.endsWith('/tutorialProjects'),
  )!;
  const taskPath = Object.keys(document.paths).find((p) =>
    p.endsWith('/tutorialTasks/{id}/project'),
  )!;
  expect(document.paths[projectPath].get.operationId).toBe(
    'listTutorialProjects',
  );
  expect(document.paths[projectPath].post.operationId).toBe(
    'createTutorialProject',
  );
  expect(document.paths[projectPath].post.requestBody).toBeDefined();
  expect(document.paths[taskPath].patch.operationId).toBe(
    'assignTutorialTaskProject',
  );
  expect(document.paths[taskPath].patch.requestBody).toBeDefined();
});

test('exposes project actions in the actual permission editor catalog', async ({
  testApp,
}) => {
  const admin = await signIn(testApp, DEFAULT_ADMIN_CREDENTIALS);
  const response = await admin.fetch('/authorization/permissionSets/options');
  expect(response.status).toBe(200);
  const { data } = (await response.json()) as {
    data: AuthorizationOptionsResponse;
  };
  const catalog = permissionWorkspaceCatalog(data, [], []);
  const project = catalog.sections
    .flatMap((section) => section.subsections)
    .flatMap((section) => section.resources ?? [])
    .find((resource) => resource.id === 'tutorial.projects');
  expect(project?.actions.map((action) => action.name)).toEqual([
    'read',
    'create',
    'assignTask',
  ]);
});
```

</details>

Chạy các test mới và bộ test hồi quy công việc hiện có:

```bash
pnpm exec vitest run --config vitest.tutorial.config.ts tests/server/tutorial-tasks-project-api.test.ts
pnpm exec vitest run --config vitest.tutorial.config.ts
pnpm exec vitest run tests/logic/authorization-assignment-safety.test.ts
pnpm typecheck
```

Các test kiểm tra nhiều hơn mã `200`: dữ liệu đầu vào không hợp lệ không ghi dữ liệu, dự án không khả dụng giữ nguyên liên kết trước đó, phạm vi công việc và dự án được thực thi độc lập, việc thu hồi quyền chặn các request tiếp theo, và tài liệu API chứa các thao tác cùng định nghĩa đầu vào mới. Ví dụ này đã được kiểm chứng với SQLite.

## Phạm vi của chương này

Transaction gom các thao tác cơ sở dữ liệu của lần này để chúng cùng thành công hoặc cùng thất bại. Nó không hiện thực kiểm tra phiên bản và không hứa hẹn một snapshot chung giữa các truy vấn danh sách riêng rẽ. Nếu hai người lần lượt đổi dự án của cùng một công việc, lần ghi thành công sau sẽ thay thế lần trước. Hãy thêm và kiểm chứng điều kiện tiên quyết về phiên bản khi nghiệp vụ cần chống xung đột.

Tiếp tục với [UI component và tương tác](pages-and-interactions.md) để nối các API này với danh sách dự án, hộp thoại tạo và form gán công việc, bao gồm trạng thái tải, lỗi field và phản hồi khi gửi.
