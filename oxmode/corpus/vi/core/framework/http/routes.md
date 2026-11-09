---
title: Route và ngữ cảnh yêu cầu
---

Endpoint HTTP được tích hợp qua các khai báo route. Factory phân giải dịch vụ khi khởi động. Handler đọc đầu vào và danh tính của từng yêu cầu.

## Phạm vi API và phạm vi gốc

```ts
import { Hono } from 'hono';
import { defineApiRoutes } from '@nocobase/app-server/router';

export default defineApiRoutes(() => {
  const router = new Hono();
  router.get('/example/ping', (context) => context.json({ data: { ok: true } }));
  return router;
});
```

Thêm khai báo vào mảng trong `server/routes/index.ts` hoặc `routes` của plugin. Khi ứng dụng chạy ở gốc, endpoint phản hồi tại `/api/example/ping`. Đây là ví dụ công khai chỉ kiểm tra khả năng phản hồi.

`defineApiRoutes()` gắn route dưới tiền tố API. `defineRootRoutes()` gắn route ở gốc ứng dụng để xử lý các giao thức khác. Khi ứng dụng chạy ở đường dẫn con, host thêm đường dẫn cơ sở. Trong plugin, khai báo đường dẫn tương đối theo ứng dụng để hỗ trợ các cách triển khai khác nhau.

## Ngữ cảnh theo từng yêu cầu

Hono Context cung cấp `req.param()`, `req.query()`, quyền đọc body và các phương thức tạo phản hồi. Giá trị đường dẫn và query ban đầu là chuỗi. Kiểm tra đầu vào bên ngoài ở runtime ngay cả khi mã đã khai báo kiểu.

Phân giải dịch vụ từ container `app` nhận trong factory. Cơ chế xác thực điền danh tính yêu cầu theo hợp đồng riêng. Kiểm tra hợp đồng đó trước khi đọc trường như `user` từ yêu cầu Hono.

## Phân quyền và mở endpoint

Tích hợp xác thực và policy dữ liệu tường minh. Menu ẩn trên frontend chỉ ảnh hưởng giao diện. [`defineRepositoryApiRoutes()`](repository-routes.md) cho phép công khai từng Collection có tên với action và policy đầy đủ. Ứng dụng vẫn khai báo schema riêng và chỉ mở những tài nguyên đã chọn. Xem [Repository Data API](repository-routes.md) để khai báo, đăng ký, đặt policy và gọi từ client.

Route trùng phương thức và đường dẫn làm bước kiểm tra khởi động thất bại. Dùng helper OpenAPI như `describeRoute` từ `@nocobase/app-server/router` để dùng cùng bộ đăng ký metadata với runtime.

Xem [Kiểm tra dữ liệu và phản hồi](validation.md), [API Client](api-client.md) và [API server của plugin](../../extension-development/server-apis.md).

## Giao diện và phần triển khai

- [Khai báo route](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/router/routes.ts)
- [Repository route](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/README.md)
