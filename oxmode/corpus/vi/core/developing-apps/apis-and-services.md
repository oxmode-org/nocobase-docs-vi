---
title: Route và API HTTP
description: Đăng ký route web phía máy chủ, API tùy chỉnh và endpoint Repository, rồi kiểm tra phân quyền và tài liệu API.
---

Ứng dụng có thể trả trực tiếp HTML, chuyển hướng và tệp, đồng thời cung cấp API JSON cho các trang và client khác. Product Catalog minh họa các cách dùng này. Xem [Mã nguồn và thiết lập](#example-source-and-setup).

<a id="choose-a-route-type"></a>

## Chọn loại route

<a id="web-routes-and-api-routes"></a>

### Route web và route API

| Nhu cầu | Khai báo | Đường dẫn ví dụ |
| --- | --- | --- |
| HTML, chuyển hướng, tải tệp hoặc callback giao thức | `defineRootRoutes()` | `/catalog` |
| Truy vấn tùy chỉnh, tạo bản ghi và thao tác nghiệp vụ | `defineApiRoutes()` | `/api/products` |
| Thao tác Repository chuẩn trên một Collection qua HTTP | `defineRepositoryApiRoutes()` | `/api/publicCategories/findMany` |

Root trong `defineRootRoutes()` là gốc ứng dụng, có thể khác gốc tên miền. Route web tự chọn nội dung và mã trạng thái. Route API dùng quy ước kiểm tra đầu vào, phản hồi JSON và lỗi, đồng thời xuất hiện trong tài liệu API. Cấu hình quyền truy cập riêng cho từng endpoint.

Danh mục công khai chỉ hiện sản phẩm đã xuất bản. Danh mục phân loại cho phép đọc ẩn danh. API quản lý sản phẩm và tải CSV yêu cầu xác thực và quyền tương ứng.

<a id="server-routes-and-client-page-routes"></a>

### Route máy chủ và route trang client

Route web xử lý yêu cầu HTTP trên máy chủ và trả HTML hoặc phản hồi khác. Route React tổ chức trang, bố cục và điều hướng phía client. Thêm mục thanh bên qua khai báo client theo [Trang, route và điều hướng](pages-routes-and-navigation.md).

Với danh sách, biểu mẫu và ngăn trượt, thường dùng route client gọi API. Dùng route web cho HTML độc lập, chuyển hướng địa chỉ cũ và tải tệp.

<a id="declare-and-register-routes"></a>

## Khai báo và đăng ký route

<a id="route-files-and-the-registration-entry"></a>

### Tệp route và điểm vào đăng ký

Khai báo trong `server/routes/` rồi thêm vào `server/routes/index.ts`:

```ts
import type { Application } from '@nocobase/app-server/application';
import type { AppRouteContribution } from '@nocobase/app-server/router';
import catalogWeb from './catalog-web.js';
import products from './products.js';
import categories from './categories.js';

const routes: readonly AppRouteContribution<Application>[] = [
  catalogWeb,
  products,
  categories,
];
export default routes;
```

Thêm vào mảng hiện có và giữ các route khác. `server/runtime.ts` của template mặc định đã nối điểm vào này. Hàm tạo route chạy lúc khởi động. Trình xử lý chạy theo từng yêu cầu.

Sau khi khởi động, mở `/catalog` dưới địa chỉ ứng dụng. Xem [Đăng ký route](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/routes/index.ts).

<a id="application-base-path-and-api-prefix"></a>

### Đường dẫn cơ sở và tiền tố API

Khai báo đường dẫn trình xử lý tương đối với gốc ứng dụng hoặc gốc API. Ví dụ ứng dụng gắn tại `/shop`:

| Khai báo | Đường dẫn trong mã | Đường dẫn yêu cầu |
| --- | --- | --- |
| `defineRootRoutes()` | `/catalog` | `/shop/catalog` |
| `defineApiRoutes()` | `/products` | `/shop/api/products` |
| Repository `publicCategories`, hành động `findMany` | Adapter sinh | `/shop/api/publicCategories/findMany` |

Dùng địa chỉ in khi khởi động. Với liên kết trong HTML sinh ra, dùng `app.publicBasePath` để hỗ trợ các đích gắn khác nhau. API Client đã có URL cơ sở, nên đường dẫn như `/products` tính tương đối với URL đó.

<a id="write-web-routes"></a>

## Viết route web

<a id="return-an-html-page"></a>

### Trả trang HTML

`defineRootRoutes()` nhận hàm tạo trả router Hono. `c.html()` trả HTML. Template từ `hono/html` escape chuỗi thông thường được nội suy. Dùng nội suy đã escape khi đưa dữ liệu ngoài vào HTML.

Đây là phần chính của trình xử lý trong `server/routes/catalog-web.ts`. Xem mã đầy đủ để tra điều hướng và kiểu hiển thị:

```ts
import { Hono } from 'hono';
import { html } from 'hono/html';
import type { Application } from '@nocobase/app-server/application';
import { defineRootRoutes } from '@nocobase/app-server/router';
import { catalogServiceToken } from '../providers/catalog.js';
import { publicProductPolicy } from '../providers/catalog-service.js';

export default defineRootRoutes<Application>((app) => {
  const router = new Hono();
  const service = app.container.resolve(catalogServiceToken);

  router.get('/catalog', async (c) => {
    const { data } = await service.list(publicProductPolicy, {
      q: '', page: 1, pageSize: 50,
    });
    return c.html(html`<ul>${data.map((product) =>
      html`<li>${product.name}</li>`,
    )}</ul>`);
  });
  return router;
});
```

`publicProductPolicy` của ví dụ chỉ cho đọc các trường đã chọn của sản phẩm có `published: true` và từ chối ghi. Máy chủ xác định phạm vi công khai độc lập với bộ lọc do trình duyệt gửi.

Mở `<điểm vào ứng dụng>/catalog`. Dữ liệu ban đầu hiện **Canvas Backpack** và **Desk Lamp**, còn **Travel Mug** chưa xuất bản bị ẩn. Trang hiện tối đa 50 sản phẩm.

![Danh mục do máy chủ render, gồm hai sản phẩm đã xuất bản và các liên kết ứng dụng, API và tải CSV](/assets/core/developing-apps/apis-and-services/catalog-web.png)

Xem [route web](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/routes/catalog-web.ts) và [chính sách đọc công khai và dịch vụ truy vấn](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/providers/catalog-service.ts).

<a id="redirect-to-another-address"></a>

### Chuyển hướng đến địa chỉ khác

Dùng `c.redirect()` trong cùng router web:

```ts
router.get('/old-catalog', (c) => c.redirect('/catalog', 302));
```

Yêu cầu `/shop/old-catalog` trả `302` cùng `Location: /shop/catalog` để trình duyệt đi theo. Môi trường chạy của ví dụ thêm đường dẫn cơ sở vào đích nội bộ bắt đầu bằng `/` và giữ nguyên URL ngoài tuyệt đối. Kiểm tra đích trước khi dùng dữ liệu người dùng làm địa chỉ chuyển hướng.

Chạy `curl -i "$APP_URL/old-catalog"` để xem mã và `Location`. `APP_URL` gồm đường dẫn cơ sở và bỏ dấu gạch chéo cuối. Xem [triển khai route web](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/routes/catalog-web.ts).

<a id="return-files-and-downloads"></a>

### Trả tệp để tải xuống

Route tải tệp cũng có thể là route web. Trình xử lý sau chạy sau middleware xác thực và phân quyền. `productPolicy()` cung cấp phạm vi được phép của yêu cầu hiện tại:

```ts
router.get('/catalog/export.csv', async (c) => {
  const policy = await productPolicy(c, 'view');
  const records = await service.repository(policy).findMany({
    limit: 500,
    sort: (s) => s.field('name').asc(),
  });
  // The example handles quotes, newlines and spreadsheet formula prefixes.
  const csv = toCsv(records);
  c.header('Content-Type', 'text/csv; charset=utf-8');
  c.header('Content-Disposition', 'attachment; filename="products.csv"');
  c.header('Cache-Control', 'private, no-store');
  return c.body(csv);
});
```

`toCsv` là [hàm chuyển đổi CSV của ví dụ](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/routes/catalog-web.ts). `Content-Type` mô tả nội dung. `Content-Disposition: attachment` yêu cầu tải tệp.

Đăng nhập với quyền xem sản phẩm và chọn **Download CSV** trên danh mục. `products.csv` chứa tối đa 500 sản phẩm tài khoản được xem, kể cả bản nháp nếu được phép. Phạm vi xuất của quản trị viên có thể rộng hơn danh mục công khai. Khách ẩn danh nhận `401`, còn người đã đăng nhập thiếu quyền xem nhận `403`.

Ví dụ tạo tệp nhỏ trong bộ nhớ. Với tệp lớn, đọc theo đợt hoặc truyền theo luồng để giới hạn bộ nhớ.

<a id="write-custom-apis"></a>

## Viết API tùy chỉnh

Các trình xử lý sau nằm trong hàm tạo `defineApiRoutes()` ở `server/routes/products.ts`. Hàm lấy dịch vụ xác thực, phân quyền và sản phẩm, rồi đăng ký xử lý lỗi. `service` là dịch vụ sản phẩm và `productPolicy(c, action)` trả chính sách cơ sở dữ liệu cho thao tác hiện tại. Xem [API sản phẩm](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/routes/products.ts) để tra tích hợp đầy đủ.

Đây là khung tích hợp. Mã nguồn đầy đủ có xác thực, trình xử lý và import của các hàm hỗ trợ:

```ts
import { Hono } from 'hono';
import type { Application } from '@nocobase/app-server/application';
import { defineApiRoutes } from '@nocobase/app-server/router';
import { catalogServiceToken } from '../providers/catalog.js';
import {
  catalogErrorHandler, type CatalogEnv,
} from './catalog-access.js';

export default defineApiRoutes<Application>((app) => {
  const router = new Hono<CatalogEnv>();
  const service = app.container.resolve(catalogServiceToken);
  router.onError(catalogErrorHandler);
  // Register path-scoped authentication and the handlers below here.
  return new Hono().route('/', router);
});
```

<a id="read-query-parameters-and-return-a-list"></a>

### Đọc tham số truy vấn và trả danh sách

Kiểm tra bằng `apiValidator('query', schema)` và đọc giá trị đã chuyển kiểu qua `c.req.valid('query')`:

```ts
const Query = z.strictObject({
  q: z.string().max(100).default(''),
  page: z.coerce.number().int().min(1).max(10000).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
});

router.get('/products',
  describeRoute({
    tags: ['Products'], summary: 'List products', operationId: 'listProducts',
    responses: { 200: listResponse(Product), ...apiErrorResponses },
  }),
  apiValidator('query', Query),
  async (c) => c.json(await service.list(
    await productPolicy(c, 'view'), c.req.valid('query'),
  )),
);
```

Sau khi đăng nhập, chạy `GET /products?q=Desk&page=1&pageSize=10` trong tài liệu API. Kết quả có **Desk Lamp** cùng `data`, `meta.page`, `meta.pageSize` và `meta.total`. Dùng cùng chính sách và bộ lọc cho hàng và tổng số để tránh lộ số lượng ngoài phạm vi. `pageSize=51` trả `400`.

Xem [trình xử lý danh sách](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/routes/products.ts) và [truy vấn phân trang](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/providers/catalog-service.ts).

<a id="read-path-parameters-and-return-a-record"></a>

### Đọc tham số đường dẫn và trả bản ghi

Hono khai báo tham số bằng `:id`, còn OpenAPI hiển thị `{id}`:

```ts
router.get('/products/:id',
  describeRoute({
    tags: ['Products'], summary: 'Get a product', operationId: 'getProduct',
    responses: { 200: dataResponse(Product), ...apiErrorResponses },
  }),
  apiValidator('param', z.object({ id: z.uuid() })),
  async (c) => c.json({ data: await service.get(
    await productPolicy(c, 'view'), c.req.valid('param').id,
  ) }),
);
```

Lấy ID sản phẩm từ danh sách và gọi `GET /products/{id}`. Kết quả là `{ data: product }`. Ví dụ tạo UUID và dùng `z.uuid()`. Ứng dụng khác có thể dùng định danh khác. UUID sai trả `400`. ID hợp lệ nhưng thiếu hoặc ngoài phạm vi đọc đều trả `404`. Xem [trình xử lý chi tiết](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/routes/products.ts).

<a id="validate-a-request-body-and-create-a-record"></a>

### Kiểm tra thân yêu cầu và tạo bản ghi

Thao tác tạo nhận tên và giá tính bằng cent. Máy chủ quản lý trạng thái xuất bản:

```ts
const Values = z.strictObject({
  name: z.string().trim().min(1).max(100),
  priceCents: z.number().int().min(0).max(100000000),
});
```

Route truyền schema vào `apiValidator('json', Values)` rồi đọc `c.req.valid('json')`. Chạy `POST /products` trong tài liệu API với:

```json
{ "name": "Travel Notebook", "priceCents": 1200 }
```

Thêm header `Idempotency-Key` dạng `<dấu thời gian mili giây 13 chữ số>.<UUID v4>`. Tạo khóa mới từ thư mục ứng dụng:

```bash
node -e 'console.log(`${Date.now()}.${require("node:crypto").randomUUID()}`)'
```

Thành công trả `201` với `id`, `name`, `priceCents` và `published: false` trong `data`. Trường `published` thừa, tên rỗng hoặc giá âm trả `400` và giữ nguyên dữ liệu. `strictObject()` từ chối trường ngoài khai báo. Trình xử lý chịu trách nhiệm chọn trường thực sự trả về.

Ví dụ dùng `executeIdempotentMutation()` để commit thao tác tạo và biên nhận trong cùng transaction. Khi mất phản hồi, thử lại với khóa và đầu vào cũ. Phát lại thành công có `Idempotency-Replayed: true` và chỉ giữ một sản phẩm. Dùng khóa mới khi chủ ý tạo bản ghi mới. Với POST tùy chỉnh, tích hợp transaction biên nhận cùng header.

Xem [trình xử lý tạo và tích hợp biên nhận](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/routes/products.ts) và [Kiểm tra đầu vào và xử lý phản hồi](../framework/http/validation.md).

<a id="call-a-business-service"></a>

### Gọi dịch vụ nghiệp vụ

Đặt quy tắc trong `server/providers/`, đăng ký dịch vụ qua Provider rồi lấy một lần trong hàm tạo route:

```ts
const service = app.container.resolve(catalogServiceToken);
```

Lời gọi chính trong `POST /products/{id}/publish` là:

```ts
const policy = await productPolicy(c, 'publish');
const id = c.req.valid('param').id;
// Inside executeIdempotentMutation's execute(transaction) callback:
return service.publish(policy, id, transaction);
```

Route xử lý đầu vào HTTP, danh tính, quyền và phản hồi. Dịch vụ kiểm tra sản phẩm tồn tại và còn là bản nháp rồi cập nhật qua chính sách và kết nối transaction đã nhận. Việc đọc ngữ cảnh Hono và chọn mã HTTP thuộc về route.

Xuất bản sản phẩm vừa tạo bằng khóa mới và thân rỗng `{}`. Phản hồi `200` có `published: true`. Tải lại danh mục công khai để thấy sản phẩm. Dùng lại khóa cũ trả kết quả ban đầu. Xuất bản lại bằng khóa mới trả `409 PRODUCT_ALREADY_PUBLISHED`. Cập nhật có điều kiện ngăn hai lượt đồng thời cùng xử lý sản phẩm như bản nháp.

Xem [Provider và token](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/providers/catalog.ts), [dịch vụ sản phẩm](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/providers/catalog-service.ts), [route xuất bản](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/routes/products.ts), [ServiceProvider](../extension-development/service-provider.md) và [Transaction và tính nhất quán](transactions-and-consistency.md).

<a id="use-repository-data-apis"></a>

## Dùng API dữ liệu Repository

<a id="configure-collections-and-exposed-operations"></a>

### Cấu hình Collection và thao tác công khai

`defineRepositoryApiRoutes()` phù hợp với thao tác chuẩn trên một Collection. Chuẩn bị `catalogCategories` qua migration rồi khai báo:

```ts
import { defineRepositoryApiRoutes } from '@nocobase/app-server/router';

export default defineRepositoryApiRoutes({
  repositories: [{
    name: 'publicCategories',
    collection: 'catalogCategories',
    actions: { findMany: { maxLimit: 50 }, findOne: {}, count: {} },
    policy: {
      read: { scope: true, fields: ['id', 'title'] },
      create: false, update: false, delete: false,
    },
  }],
});
```

`name` là tên tài nguyên HTTP, còn `collection` là tên Collection cơ sở dữ liệu. Chỉ thao tác trong `actions` được đăng ký. Ví dụ này chỉ khai báo đọc. Đọc cũng dùng POST, như `POST /api/publicCategories/findMany`.

Xem [API phân loại](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/routes/categories.ts) và [migration](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/database/main/migrations/202610310001_create_catalog.ts).

<a id="restrict-records-and-fields"></a>

### Giới hạn bản ghi và trường

`actions` quyết định thao tác nào tồn tại. `policy` quy định bản ghi, trường và quyền ghi mà mỗi thao tác cho phép. Cấu hình cả hai.

Chính sách trên cho đọc ẩn danh mọi phân loại và chỉ trả `id` cùng `title`. Giữ `internalNote` ở máy chủ và chỉ cho bộ lọc client thu hẹp phạm vi. `findMany.maxLimit: 50` giới hạn kích thước kết quả. `limit: 51` trả `400`.

Với quyền phụ thuộc danh tính hoặc vai trò, tích hợp xác định danh tính đã xác thực và chính sách động. Xem [API dữ liệu Repository](../framework/http/repository-routes.md) để tra tùy chọn và tích hợp plugin phân quyền.

<a id="call-with-api-client-and-http"></a>

### Gọi bằng API Client và HTTP

Lấy client bằng `useApiClient()` trong trang React rồi truyền vào hàm thường:

```ts
import type { ApiClient } from '@nocobase/app-client';

type Category = { id: string; title: string };
export async function loadCategories(api: ApiClient) {
  return api.repository<Category>('publicCategories').findMany({ limit: 20 });
}
```

Repository từ xa lấy mảng phân loại ra khỏi `{ data }`. Phản hồi HTTP thô giữ lớp bọc:

```bash
curl "$APP_URL/api/publicCategories/findMany" \
  -H 'Content-Type: application/json' \
  -d '{"limit":20}'
```

```json
{ "data": [
  { "id": "office", "title": "Office" },
  { "id": "travel", "title": "Travel" }
] }
```

Để có thứ tự ổn định, khai báo sắp xếp tường minh. `count()` của cùng client trả số, còn `findOne()` trả bản ghi hoặc `undefined`. Xem [loadCategories](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/client/catalog-api.ts) về hàm bọc. [Kiểm thử endpoint](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/tests/server/catalog.test.ts) cũng gọi route đã đăng ký bằng API Client thật. Xem [Yêu cầu dữ liệu và trạng thái](data-requests-and-state.md).

<a id="protect-routes-and-handle-errors"></a>

## Bảo vệ route và xử lý lỗi

<a id="add-authentication-and-business-authorization"></a>

### Thêm xác thực và phân quyền nghiệp vụ

Mỗi mô-đun tự bảo vệ đường dẫn của mình. Gắn middleware vào đường dẫn cần bảo vệ để tránh phụ thuộc thứ tự đăng ký hoặc vô tình chặn route công khai bằng wildcard toàn cục.

```ts
const auth = app.container.resolve(authenticationToken);
const authz = app.container.resolve(authorizationToken);
for (const path of ['/products', '/products/*']) {
  router.use(path, auth.required({ scopedKeys: false }), authz.middleware());
}
```

Xác thực xác định bên gọi. Phân quyền kiểm tra `view`, `create` hoặc `publish`, rồi chính sách cơ sở dữ liệu giới hạn bản ghi và trường. Tải tệp cũng yêu cầu xác thực và chính sách `view`. Thao tác quản lý của ví dụ chỉ dùng phiên đăng nhập.

Cài đặt tạo **Catalog viewer** và **Catalog editor**. Quản trị viên gán vai trò cho từng người qua **Users** và sửa thao tác, phạm vi trong **Permission management**. Kiểm tra quyền thao tác phía máy chủ riêng với quyền trang.

Xem [quyền nghiệp vụ](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/catalog-resource.ts), [phân quyền yêu cầu](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/routes/catalog-access.ts) và [vai trò ban đầu](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/database/main/seeds/202610310001_catalog_roles.ts).

<a id="handle-invalid-input-and-business-errors"></a>

### Xử lý đầu vào sai và lỗi nghiệp vụ

Dùng `ApiError` và `apiErrorHandler()` để thống nhất JSON lỗi. Ví dụ chuyển lỗi dịch vụ thành lỗi API chuẩn:

```ts
new ApiError({
  status: 'NOT_FOUND',
  reason: 'PRODUCT_NOT_FOUND',
  domain: 'catalog',
  message: 'Product not found.',
});
```

| Tình huống | Phản hồi |
| --- | --- |
| Gọi API sản phẩm hoặc tải tệp ẩn danh | `401` |
| Đã đăng nhập nhưng thiếu quyền thao tác | `403` |
| Đầu vào sai | `400`, kèm thông tin trường nếu lỗi kiểm tra |
| Thiếu sản phẩm hoặc ngoài phạm vi | `404 PRODUCT_NOT_FOUND` |
| Xuất bản sản phẩm đã xuất bản bằng khóa mới | `409 PRODUCT_ALREADY_PUBLISHED` |

Bên gọi phân nhánh theo mã trạng thái và `reason`. Xem [trình xử lý lỗi](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/routes/catalog-access.ts). Route web chọn định dạng phù hợp. Ví dụ dùng JSON chuẩn cho lỗi tải tệp, còn trang HTML có thể trả trang lỗi riêng.

<a id="avoid-path-conflicts"></a>

### Tránh xung đột đường dẫn

Mỗi cặp phương thức và đường dẫn cần một trình xử lý. Framework báo route API trùng lúc khởi động. Giữ route web tách khỏi `/api`, đường dẫn tài nguyên tĩnh và route trang client. Hạn chế route bắt mọi đường dẫn để tránh chặn điểm vào khác.

Ví dụ dùng `/catalog` cho HTML, `/api/products` cho API nghiệp vụ và dành `/` cho client. Kiểm tra kết quả đăng ký qua tài liệu API và [kiểm thử endpoint](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/tests/server/catalog.test.ts).

<a id="generate-and-use-api-documentation"></a>

## Sinh và dùng tài liệu API

<a id="describe-inputs-responses-and-errors"></a>

### Mô tả đầu vào, phản hồi và lỗi

API tùy chỉnh dùng `describeRoute()` cho `operationId` ổn định, tag, mục đích và phản hồi. Schema của `apiValidator()` cung cấp mô tả đầu vào. `dataResponse()` và `listResponse()` mô tả phản hồi bản ghi và danh sách. Truy vấn và kiểm tra lúc chạy vẫn do mã thực thi.

Endpoint Repository sinh mô tả từ Collection và thao tác bật. Kiểm tra route web trực tiếp bằng trình duyệt hoặc HTTP. Khi đổi trường phản hồi, cập nhật cả kết quả và schema. Xem [khai báo API](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/server/routes/products.ts).

<a id="send-requests-from-the-interactive-documentation"></a>

### Gửi yêu cầu từ tài liệu tương tác

Đăng nhập rồi mở `<điểm vào ứng dụng>/api/swagger/docs#/Products`. Tài liệu JSON ở `<điểm vào ứng dụng>/api/swagger`. Cả hai cần phiên hoặc thông tin xác thực có quyền.

Mở thao tác dưới **Products**, bấm **Try it out**, nhập tham số và thân rồi bấm **Execute**. Tạo và xuất bản còn cần `Idempotency-Key` như trên. Sao chép ID từ phản hồi tạo để gọi chi tiết và xuất bản.

![Nhóm Products trong tài liệu API tương tác có liệt kê, tạo, chi tiết và xuất bản](/assets/core/developing-apps/apis-and-services/catalog-api.png)

<a id="verify-routes-and-apis"></a>

## Kiểm chứng route và API

<a id="check-responses-and-saved-data"></a>

### Kiểm tra phản hồi và dữ liệu đã lưu

Với dữ liệu ban đầu:

1. Mở `/catalog` ẩn danh và xác nhận chỉ có sản phẩm đã xuất bản. Mở `/old-catalog` và xác nhận chuyển hướng giữ đường dẫn cơ sở.
2. Gọi `findMany` của phân loại ẩn danh. Xác nhận có tiêu đề và không lộ `internalNote`.
3. Đăng nhập với quyền quản lý và tạo sản phẩm từ tài liệu API. Mong đợi `201`, đọc được chi tiết và chưa thấy sản phẩm trong danh mục công khai.
4. Xuất bản. Mong đợi `200` và thấy sản phẩm sau khi tải lại. Phát lại cùng thao tác trả kết quả cũ. Lượt xuất bản mới trả `409`.
5. Tải CSV và kiểm tra tên tệp, nội dung và phạm vi bản ghi được phép.

<a id="verify-access-limits-and-failure-cases"></a>

### Kiểm tra giới hạn truy cập và lỗi

Dùng cả tài khoản thường. Tài khoản thiếu vai trò bị từ chối API sản phẩm và tải tệp. Quyền xem cho đọc và tải, còn tạo và xuất bản cần quyền riêng. Phạm vi sản phẩm phải áp dụng đồng nhất cho danh sách, tổng số, chi tiết và tệp tải.

Xác nhận đầu vào sai giữ nguyên dữ liệu, chi tiết ngoài phạm vi không lộ sản phẩm và thu hồi quyền chặn yêu cầu tiếp theo. Chạy kiểm tra tự động:

```bash
pnpm exec vitest run tests/server/catalog.test.ts tests/database/catalog.test.ts tests/server/authorization-assignment-safety.test.ts
```

Bộ kiểm thử khởi động ứng dụng thật với cơ sở dữ liệu cô lập và đăng nhập thật. Phạm vi gồm các ranh giới trên, rollback và áp dụng lại migration, phát lại biên nhận và tài liệu API. Xem [README ví dụ](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/README.md) về kiểm tra trình duyệt và ảnh.

<a id="example-source-and-setup"></a>

## Mã nguồn và thiết lập

[Mã nguồn Product Catalog đầy đủ](https://github.com/nocobase/docs-examples-v3/tree/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog) gồm ba loại route, dịch vụ sản phẩm, migration, dữ liệu mẫu tiếng Anh, quyền và kiểm thử.

Ví dụ dùng template mặc định `1.0.0-beta.85`, Node.js 24 trở lên và pnpm 11.7.0. Lockfile cố định dependency. Xem [README](https://github.com/nocobase/docs-examples-v3/blob/0639e6a2a6cba857bf967757083e9f8d7aa6b9fe/apps/product-catalog/README.md) để tra cấu hình và triển khai tương ứng với từng cách dùng.

```bash
git clone https://github.com/nocobase/docs-examples-v3.git
cd docs-examples-v3
git checkout 0639e6a2a6cba857bf967757083e9f8d7aa6b9fe
cd apps/product-catalog
pnpm install --frozen-lockfile
pnpm nocobase config init --dialect sqlite
pnpm nocobase config check
APP_SAMPLE_DATA=true pnpm dev
```

Ví dụ dùng SQLite để thiết lập. Trước lần khởi động đầu tiên, cấu hình quản trị viên trong `users.initialAdmin` của `config.yml` cục bộ. Đăng nhập theo địa chỉ đầy đủ in khi khởi động. `APP_SAMPLE_DATA=true` nạp sản phẩm và phân loại mẫu ở lần cài đầu. Các lần sau giữ dữ liệu đã sửa. Nếu đã bỏ qua dữ liệu mẫu lúc cài, dùng `pnpm nocobase db sample` trong môi trường phát triển để nạp.

Nối `/catalog` vào địa chỉ ứng dụng để mở trang công khai, hoặc `/api/swagger/docs` để thao tác API. Sản phẩm đã lưu còn sau khi tải lại trang và khởi động lại máy chủ.
