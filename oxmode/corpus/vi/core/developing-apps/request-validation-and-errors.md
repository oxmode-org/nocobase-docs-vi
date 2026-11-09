---
title: Kiểm tra yêu cầu và xử lý lỗi
description: Kiểm tra đầu vào, phân biệt lỗi trường với lỗi nghiệp vụ và ngoại lệ, rồi xác minh phản hồi cùng dữ liệu đã lưu.
---

API đơn hàng mẫu hỗ trợ liệt kê, tạo và sửa đơn. Yêu cầu được kiểm tra trước khi dịch vụ xác minh khách hàng khả dụng và đơn có thể sửa. Phản hồi lỗi dùng cấu trúc chuẩn để client xác định trường có vấn đề hoặc giải thích giới hạn nghiệp vụ. Xem [mã nguồn và cách chạy](#example-source-and-running) ở cuối bài.

Ví dụ dùng `@nocobase/app-server` `3.0.0-beta.4` và Zod `4.6.5`. Script dòng lệnh gửi yêu cầu HTTP thật và chạy độc lập với trang quản trị. Lệnh `pnpm request` là tiện ích của ví dụ, đăng nhập bằng tài khoản mẫu. Cài đặt và thiết lập trước khi chạy.

<a id="add-request-validation-to-a-route"></a>

## Thêm kiểm tra yêu cầu vào route

Import `apiValidator()` từ `@nocobase/app-server/router` và đặt schema trước trình xử lý. Đọc giá trị tương ứng bằng `c.req.valid('query' | 'param' | 'json')` trong trình xử lý. Giá trị đã được chuyển kiểu, áp dụng mặc định và kiểm tra.

Đặt đoạn này trong hàm tạo `defineApiRoutes()` ở `server/routes/orders.ts`. Router đã gắn middleware xác thực và ngữ cảnh phân quyền. `requireOrderAction()` kiểm tra quyền thao tác, `service` lấy từ container ứng dụng và schema được import từ `schemas.ts` trong cùng thư mục.

```ts
import {
  apiValidator,
  apiErrorResponse,
  apiErrorResponses,
  dataResponse,
  describeRoute,
} from '@nocobase/app-server/router';

router.post(
  '/orders',
  requireOrderAction('create'),
  describeRoute({
    tags: ['Orders'],
    summary: 'Create an order',
    operationId: 'ordersCreateOrder',
    responses: {
      '201': dataResponse(Order),
      '400': apiErrorResponse(400, 'The customer is unavailable (CUSTOMER_UNAVAILABLE).'),
      ...apiErrorResponses,
    },
  }),
  apiValidator('json', CreateOrderInput),
  async (c) => c.json({
    data: await service.create(c.get('orderPolicies'), c.req.valid('json')),
  }, 201),
);
```

Xác thực và phân quyền thao tác chạy trước kiểm tra đầu vào. Mọi bước đều chạy trước khi ghi. Kiểm tra đăng nhập, quyền và sự tồn tại trong cơ sở dữ liệu bằng cơ chế riêng ngoài `apiValidator()`. Xem [Xác thực, quyền và phạm vi dữ liệu](authentication-and-permissions.md).

Đăng ký khai báo route trong `server/routes/index.ts` để môi trường chạy nạp:

```ts
import orders from './orders.js';
export default [orders];
```

Giữ các khai báo route hiện có. Khai báo `/orders` và để runtime thêm `/api` cùng tiền tố triển khai. Xem [Route và API HTTP](apis-and-services.md).

```sh
pnpm request POST orders '{"customerId":"11111111-1111-4111-8111-111111111111","reference":"  SO-2000  ","items":[{"name":"Keyboard","quantity":2}]}'
```

Thao tác tạo trả HTTP `201` với `{ data }`. `data.reference` được bỏ khoảng trắng thừa thành `SO-2000`, còn `data.id` do máy chủ tạo. Giữ ID để sửa sau. Gửi lại yêu cầu sẽ tạo đơn khác.

Xem [route và middleware phân quyền](https://github.com/nocobase/docs-examples-v3/blob/12e46abf29509039d988bab437de0aad8931f93e/apps/request-validation/server/routes/orders.ts) và [đăng ký route](https://github.com/nocobase/docs-examples-v3/blob/12e46abf29509039d988bab437de0aad8931f93e/apps/request-validation/server/routes/index.ts).

<a id="define-input-rules"></a>

## Khai báo quy tắc đầu vào

<a id="query-conversion-and-defaults"></a>

### Chuyển kiểu truy vấn và đặt mặc định

Tham số truy vấn đến dưới dạng chuỗi. Dùng `z.coerce.number()` để chuyển thành số rồi giới hạn khoảng số nguyên. Giá trị mặc định áp dụng khi thiếu tham số.

```ts
import { z } from 'zod';

export const ListOrdersQuery = z.object({
  page: z.coerce.number().int().min(1).max(1_000_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
```

Route danh sách dùng `apiValidator('query', ListOrdersQuery)`. Dịch vụ nhận `c.req.valid('query')`, trong đó `page` và `pageSize` là số.

```sh
pnpm request GET 'orders?page=1&pageSize=1'
pnpm request GET 'orders?page=0'
```

Lệnh đầu trả một đơn, với `meta.page: 1`, `meta.pageSize: 1` và `meta.total`. Lệnh sau trả `400 INVALID_INPUT` ở trường `page`. Bỏ tham số phân trang thì dùng trang 1 với 20 bản ghi mỗi trang.

<a id="path-parameter-formats"></a>

### Định dạng tham số đường dẫn

```ts
export const OrderParams = z.object({ id: z.uuid() });
```

Route chi tiết và cập nhật dùng `apiValidator('param', OrderParams)` rồi đọc `c.req.valid('param').id`.

```sh
pnpm request GET orders/not-a-uuid
pnpm request GET orders/99999999-9999-4999-8999-999999999999
```

Lệnh đầu sai định dạng và trả `400 INVALID_INPUT`. Lệnh thứ hai dùng UUID hợp lệ nhưng không trỏ tới đơn nào trong ví dụ, nên trả `404 ORDER_NOT_FOUND`. Ví dụ quy định UUID cho đơn hàng và khách hàng. Định danh khác như người dùng ứng dụng có thể theo quy ước riêng.

<a id="required-nullable-and-extra-body-fields"></a>

### Trường bắt buộc, giá trị null và trường thừa trong thân yêu cầu

Dùng `z.strictObject()` để chỉ rõ trường JSON được ghi. Khi client gửi toàn bộ đối tượng biểu mẫu, server vẫn phải bảo vệ các trường như `id` và `status`. Schema truy vấn và đường dẫn dùng `z.object()` vì ví dụ chấp nhận tham số thừa ở hai vị trí đó.

```ts
const OrderItemInput = z.strictObject({
  name: z.string().trim().min(1).max(120),
  quantity: z.number().int().min(1).max(1000),
});
export const CreateOrderInput = z.strictObject({
  customerId: z.uuid(),
  reference: z.string().trim().min(1).max(120),
  items: z.array(OrderItemInput).min(1).max(20),
  note: z.string().trim().max(500).nullable().optional(),
});
export const UpdateOrderInput = CreateOrderInput.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: 'Provide at least one field to update.' },
);
```

Tạo đơn yêu cầu `customerId`, `reference` và `items`. Cập nhật chỉ nhận các trường cần đổi và từ chối đối tượng rỗng. `quantity` phải là số JSON. Tên mặt hàng và mã tham chiếu được bỏ khoảng trắng đầu cuối, nên giá trị toàn khoảng trắng không hợp lệ.

Khi cập nhật, bỏ qua `note` sẽ giữ ghi chú, `note: null` sẽ xóa và chuỗi rỗng được lưu nguyên. `optional()` cho phép bỏ trường. `nullable()` cho phép truyền `null` tường minh.

```sh
pnpm request PATCH orders/22222222-2222-4222-8222-222222222222 '{"reference":"SO-1001-A"}'
pnpm request PATCH orders/22222222-2222-4222-8222-222222222222 '{"note":null}'
pnpm request PATCH orders/22222222-2222-4222-8222-222222222222 '{"status":"confirmed"}'
```

Hai lệnh đầu thành công, lần lượt giữ rồi xóa ghi chú. Lệnh thứ ba chứa trường bị cấm và trả `400 INVALID_INPUT`, giữ nguyên trạng thái đơn. Tiện ích gửi `Content-Type: application/json`. Đặt header tương ứng nếu dùng công cụ khác.

Xem [schema đầu vào và phản hồi](https://github.com/nocobase/docs-examples-v3/blob/12e46abf29509039d988bab437de0aad8931f93e/apps/request-validation/server/routes/schemas.ts).

<a id="recognize-validation-failures"></a>

## Nhận diện lỗi kiểm tra đầu vào

<a id="standard-errors-and-field-paths"></a>

### Lỗi chuẩn và đường dẫn trường

Gửi mặt hàng với số lượng `0`:

```sh
pnpm request PATCH orders/22222222-2222-4222-8222-222222222222 '{"items":[{"name":"Keyboard","quantity":0}]}'
```

Các trường phản hồi liên quan ở dưới. Ví dụ lược mô tả kỹ thuật và ID yêu cầu:

```json
{
  "error": {
    "code": 400,
    "status": "INVALID_ARGUMENT",
    "reason": "INVALID_INPUT",
    "domain": "app",
    "fieldViolations": [
      { "field": "items.0.quantity", "reason": "too_small" }
    ]
  }
}
```

`code` là mã HTTP dạng số, `status` là nhóm lỗi chuẩn, `reason` xác định lỗi và `domain` xác định nơi định nghĩa mã lỗi. Mỗi vi phạm trường còn có `description`. `reason` tùy chọn ở cấp trường lấy từ bộ kiểm tra, chẳng hạn `too_small` của Zod.

Đường dẫn trường dùng dấu chấm, kể cả chỉ mục mảng như `items.0.quantity`. Trường thừa và đối tượng cập nhật rỗng có thể tạo lỗi cấp đối tượng với `field` là chuỗi rỗng. Hiển thị các lỗi đó ở cấp biểu mẫu.

<a id="json-parsing-failures"></a>

### Lỗi phân tích JSON

JSON sai cú pháp bị từ chối trước bước kiểm tra schema. Ví dụ, `pnpm demo` gửi thân thô `{` tới endpoint tạo. Với các phiên bản đã ghim, phản hồi là `400`, `status: INVALID_ARGUMENT` và `reason: HTTP_400`.

Dùng `reason` để phân loại lỗi 400 và kiểm tra `fieldViolations` trước khi đọc. Tiện ích thông thường dùng `JSON.stringify()`. Script minh họa dựng riêng yêu cầu sai cú pháp.

Xem [kịch bản HTTP](https://github.com/nocobase/docs-examples-v3/blob/12e46abf29509039d988bab437de0aad8931f93e/apps/request-validation/scripts/demo.ts) và [kiểm thử phân tích và kiểm tra đầu vào](https://github.com/nocobase/docs-examples-v3/blob/12e46abf29509039d988bab437de0aad8931f93e/apps/request-validation/tests/orders.test.ts).

<a id="handle-business-errors-and-unexpected-exceptions"></a>

## Xử lý lỗi nghiệp vụ và ngoại lệ bất ngờ

<a id="missing-resources-and-invalid-references"></a>

### Thiếu tài nguyên và tham chiếu không hợp lệ

UUID hợp lệ vẫn cần được tra cứu. Đơn không tồn tại theo URL trả `404 NOT_FOUND`. Khách hàng được tham chiếu trong thân yêu cầu nhưng không khả dụng trả `400 INVALID_ARGUMENT` kèm vi phạm `customerId`.

Nhánh sau của `toOrderApiError()` chuyển đổi lỗi khách hàng:

```ts
if (error instanceof CustomerUnavailableError) {
  return new ApiError({
    status: 'INVALID_ARGUMENT',
    reason: 'CUSTOMER_UNAVAILABLE',
    domain: 'orders',
    message: error.message,
    fieldViolations: [{
      field: 'customerId',
      reason: 'CUSTOMER_UNAVAILABLE',
      description: 'Choose an available customer.',
    }],
    cause: error,
  });
}
```

```sh
pnpm request PATCH orders/22222222-2222-4222-8222-222222222222 '{"customerId":"99999999-9999-4999-8999-999999999999","note":"Must not be saved"}'
```

Yêu cầu trả `400 CUSTOMER_UNAVAILABLE`, giữ nguyên khách hàng và ghi chú ban đầu. Dịch vụ truy vấn khách hàng theo chính sách Repository của thao tác trước khi ghi đơn. Từ chối quyền thao tác trả 403 trước khi kiểm tra định dạng và sự tồn tại. Giữ phân loại này khi trả lỗi.

<a id="operations-prohibited-by-business-state"></a>

### Thao tác bị cấm do trạng thái nghiệp vụ

Đơn đã xác nhận bị khóa chỉnh sửa. Điều kiện nghiệp vụ chưa đáp ứng được biểu diễn bằng `FAILED_PRECONDITION`, ánh xạ tới HTTP 400:

```ts
if (error instanceof OrderLockedError) {
  return new ApiError({
    status: 'FAILED_PRECONDITION',
    reason: 'ORDER_LOCKED',
    domain: 'orders',
    message: error.message,
    cause: error,
  });
}
```

```sh
pnpm request PATCH orders/33333333-3333-4333-8333-333333333333 '{"note":null}'
```

Phản hồi là `400 ORDER_LOCKED` và ghi chú của đơn đã xác nhận giữ nguyên. Xung đột phiên bản đồng thời dùng `ABORTED` (409). Tạo trùng dùng `ALREADY_EXISTS` (409). Phân loại theo nguyên nhân cụ thể. Seed tạo sẵn đơn đã xác nhận để minh họa.

<a id="reuse-repository-error-handling"></a>

### Dùng lại cơ chế xử lý lỗi Repository

Framework ánh xạ các lỗi Repository đã biết. Để chúng truyền lên. `WRITE_FORBIDDEN` trả 403, `RECORD_NOT_FOUND` trả 404 và `VERSION_CONFLICT` trả 409. Mã Repository trở thành `reason`, với `domain` là `app`.

Router độc lập không cần chuyển đổi lỗi nghiệp vụ có thể gắn:

```ts
import { Hono } from 'hono';
import { apiErrorHandler } from '@nocobase/app-server/router';

const router = new Hono();
router.onError(apiErrorHandler);
```

Kiểm thử ví dụ truyền chính sách cấm cập nhật cho Repository thật. Route trả `403 WRITE_FORBIDDEN` và bản ghi giữ nguyên. Bài kiểm thử Hono độc lập cập nhật bản ghi thiếu và nhận `404 RECORD_NOT_FOUND`. Chạy bằng:

```sh
pnpm test -t 'Repository errors'
```

<a id="translate-custom-business-exceptions"></a>

### Chuyển đổi ngoại lệ nghiệp vụ riêng

Dịch vụ ném `OrderMissingError`, `CustomerUnavailableError` và `OrderLockedError`. Route chuyển chúng thành lỗi HTTP để dịch vụ độc lập với ngữ cảnh Hono.

```ts
router.onError((error, c) => apiErrorHandler(toOrderApiError(error), c));
```

`toOrderApiError()` chỉ xử lý ba ngoại lệ trên và giữ nguyên lỗi khác. `apiErrorHandler()` dựng phản hồi lỗi đã biết và ném lại ngoại lệ lạ cho lớp ứng dụng ngoài. Ứng dụng đầy đủ trả `500 INTERNAL / INTERNAL_ERROR` và giữ stack cùng nguyên nhân nội bộ phía máy chủ. Trả mã trạng thái theo loại lỗi thực tế.

Cơ chế trả 500 này thuộc ứng dụng đầy đủ. Ví dụ tiêm lỗi cập nhật vào ứng dụng để kiểm chứng bằng `pnpm test -t 'unexpected failures'`. Việc chủ động gây lỗi chỉ nằm trong kiểm thử.

Xem [dịch vụ nghiệp vụ](https://github.com/nocobase/docs-examples-v3/blob/12e46abf29509039d988bab437de0aad8931f93e/apps/request-validation/server/orders/service.ts), [chuyển đổi lỗi nghiệp vụ](https://github.com/nocobase/docs-examples-v3/blob/12e46abf29509039d988bab437de0aad8931f93e/apps/request-validation/server/routes/errors.ts) và [kiểm thử lỗi Repository và ngoại lệ bất ngờ](https://github.com/nocobase/docs-examples-v3/blob/12e46abf29509039d988bab437de0aad8931f93e/apps/request-validation/tests/orders.test.ts).

<a id="declare-success-and-error-responses"></a>

## Khai báo phản hồi thành công và lỗi

`responses` trong `describeRoute()` mô tả tài liệu API. Danh sách dùng `listResponse(Order, OrderListMeta)`, còn kết quả đơn lẻ dùng `dataResponse(Order)`. Ví dụ route cập nhật khai báo:

```ts
responses: {
  '200': dataResponse(Order),
  '400': apiErrorResponse(
    400,
    'The customer is unavailable (CUSTOMER_UNAVAILABLE), or the order is confirmed (ORDER_LOCKED).',
  ),
  '404': apiErrorResponse(404),
  ...apiErrorResponses,
}
```

Route có `apiValidator()` tự có khai báo 400 cho đầu vào sai. Khai báo 400 tường minh ở trên bổ sung mô tả lỗi nghiệp vụ. `apiErrorResponses` chỉ chứa 401, 403 và 500 cho route kiểm tra cả xác thực lẫn quyền. Endpoint công khai cần khai báo lỗi theo hành vi thực tế.

Chạy `pnpm request GET swagger` để tìm các thao tác như `ordersListOrders`, `ordersCreateOrder` và `ordersUpdateOrder`. Danh sách có tham số phân trang và khai báo lỗi kiểm tra sinh tự động. Thao tác cập nhật còn mô tả khách hàng không khả dụng và đơn đã xác nhận.

Các hàm này tạo mô tả tài liệu. Trình xử lý vẫn phải trả đúng mã HTTP, kiểm tra đầu ra lúc chạy khi cần và loại trường nhạy cảm. `toOrderView()` chọn rõ trường công khai, còn hàng và tổng số dùng cùng chính sách. Khai báo schema là `z.ZodType<OrderView>` giúp khớp kiểu với kết quả dịch vụ. Kiểm tra phản hồi thực tế riêng.

Xem [khai báo phản hồi route](https://github.com/nocobase/docs-examples-v3/blob/12e46abf29509039d988bab437de0aad8931f93e/apps/request-validation/server/routes/orders.ts) và [schema phản hồi](https://github.com/nocobase/docs-examples-v3/blob/12e46abf29509039d988bab437de0aad8931f93e/apps/request-validation/server/routes/schemas.ts).

<a id="read-error-details-and-identify-a-request"></a>

## Đọc chi tiết lỗi và xác định yêu cầu

`ApiClientError.status` là mã HTTP dạng số. Đọc trực tiếp `reason`, `domain` và `requestId`. Lỗi trường nằm trong `payload.error.fieldViolations`. Kiểm tra cấu trúc trước khi đọc. Tiện ích tóm tắt lỗi dùng:

```ts
import { ApiClientError } from '@nocobase/api-client';
import { z } from 'zod';

const ErrorDetails = z.object({
  error: z.object({
    fieldViolations: z.array(z.object({
      field: z.string(),
      description: z.string(),
      reason: z.string().optional(),
    })).optional(),
  }),
});

export function errorSummary(error: unknown) {
  if (!(error instanceof ApiClientError)) throw error;
  const details = ErrorDetails.safeParse(error.payload);
  return {
    status: error.status,
    reason: error.reason,
    domain: error.domain,
    requestId: error.requestId,
    fields: details.success
      ? (details.data.error.fieldViolations ?? []).map(({ field, reason }) => ({ field, reason }))
      : [],
  };
}
```

Chạy `pnpm demo`. Số lượng sai in `status: 400`, `reason: INVALID_INPUT` và `items.0.quantity` trong `fields`. Lỗi mạng thiếu phản hồi máy chủ. Tiện ích ném lại các lỗi ngoài `ApiClientError`.

Ánh xạ `domain` và `reason` sang thông báo đã dịch. Dành `message` và `description` kỹ thuật cho chẩn đoán. Xem [Yêu cầu dữ liệu và quản lý trạng thái](data-requests-and-state.md) về phản hồi biểu mẫu và trạng thái yêu cầu.

Khi điều tra, giữ `requestId` và đối chiếu log máy chủ. Ứng dụng đầy đủ trả cùng ID trong header `x-request-id` và thân lỗi. API Client ưu tiên header. Ví dụ bật log yêu cầu trong `storage/logs/`.

Xem [tóm tắt lỗi](https://github.com/nocobase/docs-examples-v3/blob/12e46abf29509039d988bab437de0aad8931f93e/apps/request-validation/scripts/client-errors.ts) và [yêu cầu client](https://github.com/nocobase/docs-examples-v3/blob/12e46abf29509039d988bab437de0aad8931f93e/apps/request-validation/scripts/demo.ts).

<a id="verify-data-behavior-after-failures"></a>

## Kiểm chứng dữ liệu sau khi lỗi

```sh
pnpm demo
pnpm test
```

Kịch bản HTTP kiểm tra yêu cầu hợp lệ, phân trang ngoài khoảng, ID sai, lỗi trường lồng, trường thừa, khách hàng không khả dụng, đơn thiếu và sửa đơn đã xác nhận. Script đọc lại đơn sau khi bị từ chối. Kiểm thử tích hợp còn đối chiếu bản ghi trước và sau lỗi để xác nhận:

- Yêu cầu chưa đăng nhập trả 401. Người chỉ đọc nhận 403 kể cả khi trường sai hoặc ID không tồn tại.
- Cập nhật rỗng, chuỗi toàn khoảng trắng, giá trị quá dài và kiểu JSON sai đều không tạo hay sửa đơn.
- Ghi chú được giữ khi bỏ trường và được lưu thành null khi truyền tường minh.
- Lỗi Repository giữ phân loại chuẩn. Ngoại lệ lạ trả 500 và giữ chi tiết nội bộ phía máy chủ.
- Đầu vào và khai báo lỗi OpenAPI khớp hành vi endpoint.

Phản hồi lỗi HTTP có thể xuất hiện sau khi công việc đã commit. Ví dụ kiểm tra đầu vào và quy tắc nghiệp vụ trước khi ghi, rồi dùng transaction cơ sở dữ liệu. Với thao tác ghi nhiều bước, đặt ranh giới transaction bao trọn các bước cần cùng thành công. Xem [Transaction](../framework/database/transactions.md).

Kiểm thử dùng cơ sở dữ liệu cô lập và giữ nguyên dữ liệu của kịch bản CLI. Các tình huống Repository từ chối và ngoại lệ bất ngờ được tiêm riêng trong kiểm thử. Xem [bộ kiểm thử ví dụ](https://github.com/nocobase/docs-examples-v3/blob/12e46abf29509039d988bab437de0aad8931f93e/apps/request-validation/tests/orders.test.ts).

<a id="example-source-and-running"></a>

## Mã nguồn và cách chạy

[Mã nguồn request-validation](https://github.com/nocobase/docs-examples-v3/tree/12e46abf29509039d988bab437de0aad8931f93e/apps/request-validation) dùng Node.js 24 và pnpm 11.7.0. Lockfile ghim dependency. Đây là ứng dụng máy chủ độc lập với dự án lịch sử ở chương khác.

```sh
git clone https://github.com/nocobase/docs-examples-v3.git
cd docs-examples-v3
git checkout 12e46abf29509039d988bab437de0aad8931f93e
cd apps/request-validation
pnpm install --frozen-lockfile
pnpm setup
pnpm start
```

Bước thiết lập tạo cấu hình cục bộ, tài khoản và dữ liệu mẫu. Mở terminal khác trong cùng thư mục rồi chạy `pnpm demo` hoặc các lệnh `pnpm request` ở trên. Tiện ích đọc tài khoản từ `storage/demo.json`. Chọn tài khoản chỉ đọc bằng `DEMO_ROLE=reader pnpm request ...`.

Máy chủ nghe cổng 13220 với tiền tố `/main/api`. Khi dùng host khác, đặt cùng `APP_PUBLIC_ORIGIN` cho lệnh thiết lập, khởi động và gửi yêu cầu. Ví dụ được kiểm chứng với SQLite. Cơ chế kiểm tra và xử lý lỗi độc lập với dialect. Kiểm chứng riêng nếu chạy ví dụ với cơ sở dữ liệu khác.

Xem [README](https://github.com/nocobase/docs-examples-v3/blob/12e46abf29509039d988bab437de0aad8931f93e/apps/request-validation/README.md) về cấu hình, dữ liệu kiểm thử, cách kiểm tra và phạm vi kiểm chứng.
