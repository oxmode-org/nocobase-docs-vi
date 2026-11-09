---
title: API dữ liệu Repository
---

`defineRepositoryApiRoutes()` khai báo endpoint HTTP cho các thao tác Repository được chọn trên Collection. Client gọi `api.repository(name)`. Server phân tích đầu vào truy vấn, áp dụng policy, gọi Repository và trả kết quả chuẩn. Ứng dụng và plugin dùng chung cách khai báo này.

Import `defineRepositoryApiRoutes` từ điểm vào công khai `@nocobase/app-server/router`. Xem [Repository và thao tác dữ liệu](../database/repositories.md) để hiểu hành vi ở lớp cơ sở dữ liệu.

## Khi nào nên dùng

| Yêu cầu | Lựa chọn |
| --- | --- |
| Danh sách, chi tiết hoặc sửa một trường bằng một thao tác Repository | Endpoint Repository với policy truy cập tường minh |
| Kiểm tra trạng thái nghiệp vụ đã lưu, xử lý nhiều phạm vi quyền hoặc thực hiện tác động bên ngoài | Route tùy chỉnh và dịch vụ nghiệp vụ |
| Truy cập dữ liệu nội bộ ở server | Gọi Repository cơ sở dữ liệu trực tiếp |

Sửa tiêu đề ghi chú cá nhân phù hợp với adapter này. Gửi đơn hàng kèm kiểm tra trạng thái, cập nhật tồn kho và chạy tác vụ tiếp theo cần endpoint nghiệp vụ. Cùng một tài nguyên có thể dùng cả hai cách tùy thao tác. Xem [Route HTTP và API](../../developing-apps/apis-and-services.md).

## Khai báo và đăng ký endpoint

Ví dụ chủ đích mở danh mục công khai cho người đọc chưa đăng nhập và chỉ trả `id` cùng `title`. Ví dụ cần Collection `categories` có `id` số tự tăng và `title` dạng chuỗi. Chuẩn bị theo [Bảng và trường](../database/schema.md) và [Migration](../database/migrations.md).

Lưu khai báo thành `server/routes/public-categories.ts` trong ứng dụng hoặc mô-đun route tương đương trong plugin.

```ts
import { defineRepositoryApiRoutes } from '@nocobase/app-server/router';

export default defineRepositoryApiRoutes({
  repositories: [
    {
      name: 'publicCategories',
      collection: 'categories',
      actions: {
        findMany: { maxLimit: 50 },
        findOne: {},
        count: {},
      },
      policy: {
        read: { scope: true, fields: ['id', 'title'] },
        create: false,
        update: false,
        delete: false,
      },
    },
  ],
});
```

Trong ứng dụng, thêm giá trị xuất mặc định vào mảng route hiện có ở `server/routes/index.ts`. Trong plugin, thêm vào mảng `routes` của `defineServerPlugin()`, rồi đăng ký plugin trong ứng dụng đích. Giữ các route đã có. Khai báo được nạp trước khi có yêu cầu. Khi chạy, thành phần này phân giải `databaseManagerToken` từ container host.

Ví dụ công khai dữ liệu danh mục. Endpoint cho người dùng, đơn hàng và dữ liệu nghiệp vụ khác cần xác thực và phân quyền nghiệp vụ. Tích hợp middleware xác thực, tạo bảng và chọn Collection mở qua các bước riêng.

| Tùy chọn | Ý nghĩa |
| --- | --- |
| `name` | Tên tài nguyên công khai qua HTTP, cũng truyền vào `api.repository(name)` |
| `collection` | Tên Collection logic, mặc định lấy `name` |
| `connection` | Tên kết nối đã cấu hình. Nếu bỏ qua thì dùng kết nối mặc định |
| `actions` | Các thao tác cho phép, mỗi thao tác có đối tượng tùy chọn. Dùng `{}` để lấy mặc định của thao tác |
| `policy` | Policy Repository đầy đủ hoặc hàm tạo policy từ danh tính thực thi của yêu cầu. Bắt buộc |

Dùng tên camelCase bắt đầu bằng chữ thường, chẳng hạn `salesOrders`. Tránh trùng tên, xung đột namespace plugin và tên dành riêng như `auth`, `healthz` và `swagger`. `collection` nhận tên Collection logic.

## Bật thao tác

| Thao tác | Công dụng |
| --- | --- |
| `findMany`, `findOne` | Danh sách và bản ghi riêng lẻ |
| `count`, `exists` | Đếm và kiểm tra tồn tại |
| `createOne`, `updateOne`, `deleteOne` | Thao tác ghi một bản ghi |
| `aggregate`, `groupBy` | Tổng hợp và nhóm |

Chỉ thao tác khai báo trong `actions` có route. Ví dụ chỉ cho phép đọc. Với `createMany`, `updateMany`, `deleteMany` và `upsertOne`, dùng Repository cơ sở dữ liệu trong dịch vụ server hoặc tạo endpoint riêng.

`findMany.maxLimit` đặt cả số lượng mặc định và tối đa, mặc định `100`. Yêu cầu vượt mức trả `400`. `limit: 0` trả mảng rỗng. Giới hạn này chỉ áp dụng cho `findMany`. Giới hạn riêng đầu vào và phạm vi tính toán của phép tổng hợp.

## Gọi từ client và HTTP

Trang React lấy client đã cấu hình qua `useApiClient()`, rồi truyền vào hàm hoặc dịch vụ thông thường.

```ts
import type { ApiClient } from '@nocobase/app-client';

type Category = { id: number; title: string };

export async function loadCategories(api: ApiClient) {
  return await api.repository<Category>('publicCategories').findMany({
    select: (selection) => selection.fields('id', 'title'),
    limit: 20,
  });
}
```

`publicCategories` là tên tài nguyên công khai. Collection cơ sở dữ liệu vẫn là `categories`. Lời gọi gửi yêu cầu sau. Nếu triển khai dưới đường dẫn con, yêu cầu có thêm đường dẫn cơ sở của ứng dụng.

```http
POST /api/publicCategories/findMany
Content-Type: application/json

{
  "select": {
    "kind": "select",
    "version": 1,
    "root": { "kind": "selection", "fields": ["id", "title"], "includes": [] }
  },
  "limit": 20
}
```

Mọi thao tác, kể cả đọc, dùng `POST /api/{name}/{action}`. Phản hồi thành công có dạng `{ data: result }`.

- `await findMany()` trả mảng bản ghi vì Repository từ xa lấy riêng `data`. `api.request()` thông thường trả toàn bộ body.
- Nếu `findOne()` không tìm thấy, HTTP trả `{ data: null }` và client từ xa trả `undefined`.
- `createOne()` và `updateOne()` trả kết quả ghi. Lấy bản ghi qua `.record`.
- `deleteOne()` trả kết quả xóa dạng JSON.

Client tuần tự hóa đầu vào từ trình dựng truy vấn trước khi gửi. HTTP JSON chỉ chứa dữ liệu. Duyệt bất đồng bộ `findMany()` đọc luồng NDJSON. Tiêu thụ mỗi truy vấn một lần, theo một cách duy nhất là `await` hoặc duyệt. Xem [API Client](api-client.md) và [Đầu vào và trình dựng truy vấn](../database/query-inputs.md).

## Policy, danh tính và phân quyền nghiệp vụ

`policy` phải khai báo đủ `read`, `create`, `update` và `delete`. `false` từ chối cả nhóm thao tác. `true` cho phép toàn bộ năng lực của nhóm. Đối tượng quy tắc giới hạn phạm vi, trường và quan hệ. `actions` quyết định route nào tồn tại, còn `policy` xác định quyền trên route đó.

`fields` là danh sách cho phép. Khai báo các trường cần mở tường minh, cùng quy tắc riêng cho quan hệ. Policy đọc áp dụng cả cho bản ghi trả về sau thao tác ghi. Bộ lọc do bên gọi gửi chỉ có thể thu hẹp `scope` server đã đặt. Server tự cung cấp `policy` và `scope`.

Ghi chú cá nhân có thể dùng policy theo danh tính. Ví dụ cần Collection `notes` có `id`, `title` và định danh người dùng dạng chuỗi `ownerId`.

```ts
import {
  defineRepositoryApiRoutes,
  type DefineRepositoryApiRoutesOptions,
} from '@nocobase/app-server/router';

type Principal = { userId: string };
type ResolvePrincipal = NonNullable<
  DefineRepositoryApiRoutesOptions<Principal>['principal']
>;

export function createNoteRoutes(resolvePrincipal: ResolvePrincipal) {
  return defineRepositoryApiRoutes<Principal>({
    principal: resolvePrincipal,
    repositories: [
      {
        name: 'myNotes',
        collection: 'notes',
        actions: { findMany: {}, createOne: {}, updateOne: {} },
        policy: ({ userId }) => ({
          read: { scope: { ownerId: userId }, fields: ['id', 'title'] },
          create: {
            scope: { ownerId: userId },
            fields: ['title'],
            defaults: { ownerId: userId },
          },
          update: { scope: { ownerId: userId }, fields: ['title'] },
          delete: false,
        }),
      },
    ],
  });
}
```

Gọi `createNoteRoutes(resolvePrincipal)` rồi đăng ký khai báo trả về. Cơ chế xác thực ứng dụng cung cấp `resolvePrincipal` để lấy `userId` từ phiên hoặc ngữ cảnh danh tính đã xác minh. Thực hiện kiểm tra đăng nhập trước khi xây dựng danh tính. Body và header chưa xác minh là đầu vào không tin cậy.

Policy động yêu cầu trình phân giải `principal`. Nếu nó trả `null` hoặc `undefined`, yêu cầu bị từ chối với `403`. Ví dụ chỉ cho người dùng đọc và ghi ghi chú của mình. Khi tạo, server cấp `ownerId` và chỉ nhận `title` từ bên gọi.

Với vai trò do quản trị viên cấu hình, thao tác nghiệp vụ và phạm vi dữ liệu, tích hợp `authz.database.authorizeRepository()` từ plugin phân quyền. Hàm ánh xạ thao tác HTTP sang thao tác nghiệp vụ và lấy phần giao giữa policy yêu cầu và policy route. Phần giao chỉ có thể giữ hoặc thu hẹp quyền. Chạy xác thực trước và bao phủ mọi thao tác cần bảo vệ. Xem ví dụ tích hợp plugin ở cuối bài.

## Kiểm tra dữ liệu, lỗi và tài liệu API

Adapter yêu cầu JSON, giới hạn body ở 1 MiB và kiểm tra tùy chọn cho từng thao tác. Repository kiểm tra trường, AST truy vấn và cấu trúc ghi. Triển khai tường minh giới hạn văn bản theo nghiệp vụ, kiểm tra trạng thái và ràng buộc nhiều bản ghi. Với thao tác phức tạp, dùng handler tùy chỉnh.

Lỗi dùng cấu trúc chuẩn `{ error: ... }`. Đầu vào sai thường trả `400`, policy từ chối trả `403`, thiếu bản ghi trả `404`, và xung đột phiên bản hoặc số bản ghi đích của thao tác một bản ghi trả `409`. Nội dung khác JSON trả `415`, còn body quá lớn trả `413`. Xem `status` và `reason` để xử lý. Đọc thêm [Kiểm tra yêu cầu và phản hồi](validation.md).

Endpoint Repository đã bật sinh mô tả OpenAPI từ Collection và thao tác. `computedFields` tùy chọn chỉ mô tả các trường chỉ đọc bổ sung. Phần triển khai tự tính và đưa trường vào phản hồi nếu cần. Tiếp tục kiểm tra quyền trên từng yêu cầu.

## Giao diện và phần triển khai

- [Khai báo và triển khai route Repository](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/router/repository-routes.ts)
- [Kiểm thử hợp đồng route Repository](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/tests/repository-routes.test.ts)
- [Client Repository từ xa](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/api-client/README.md)
- [Tích hợp plugin phân quyền](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-authorization/skills/nocobase-app-plugin-authorization/references/repository-routes.md)
