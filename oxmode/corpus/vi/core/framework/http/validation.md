---
title: Kiểm tra yêu cầu và phản hồi
---

Kiểm tra dữ liệu bên ngoài trước khi chạy logic nghiệp vụ và dùng cấu trúc phản hồi ổn định. Kiểu TypeScript giúp kiểm tra mã trong quá trình phát triển. Đầu vào từ bên ngoài cần kiểm tra riêng ở runtime.

## Kiểm tra đầu vào

```ts
import { Hono } from 'hono';
import { z } from 'zod';
import { apiValidator, defineApiRoutes } from '@nocobase/app-server/router';

const input = z.object({ title: z.string().trim().min(1).max(120) });
export default defineApiRoutes(() => {
  const router = new Hono();
  router.post('/example/normalize', apiValidator('json', input), (context) => {
    const value = context.req.valid('json');
    return context.json({ data: { title: value.title } });
  });
  return router;
});
```

Ví dụ chuẩn hóa văn bản và chỉ trả kết quả. `apiValidator()` nhận bộ kiểm tra tương thích Standard Schema. `context.req.valid()` trả đầu vào đã kiểm tra. Chọn đích kiểm tra phù hợp cho tham số route, query và biểu mẫu.

Khai báo khoảng giá trị, độ dài, các trường được phép và ràng buộc trạng thái nghiệp vụ. Xác thực danh tính, phân quyền và kiểm tra tính nhất quán là những bước riêng. Lấy người dùng hiện tại từ ngữ cảnh xác thực đã thiết lập thay vì tin `ownerId` do bên gọi gửi.

## Thành công và lỗi

API tùy chỉnh có thể trả nhất quán `{ data, meta }` và mô tả cách phân trang. `ApiClient.request()` trả toàn bộ body đã phân tích, bao gồm cả `data`.

```ts
import { ApiError } from '@nocobase/app-server/router';

throw new ApiError({
  status: 'NOT_FOUND',
  reason: 'ORDER_NOT_FOUND',
  domain: 'orders',
  message: 'The requested order was not found.',
});
```

Framework chuyển `ApiError` thành phản hồi chuẩn chứa `error`. `status` xác định loại phản hồi HTTP. `domain` và `reason` là mã ổn định để chương trình xử lý. Dùng các mã này khi phân nhánh, dành `message` cho thông tin hướng tới người phát triển. Cung cấp thông báo đã dịch cho người dùng và báo lỗi từng trường qua `fieldViolations` khi cần.

## Luồng dữ liệu và gián đoạn

Khi phản hồi đã bắt đầu truyền theo luồng, giao thức của luồng phải quy định cách báo hoàn tất hoặc báo lỗi. Giải phóng tài nguyên khi yêu cầu bị hủy. Sau phản hồi hết thời gian chờ, thao tác đã commit hoặc yêu cầu bên ngoài vẫn có thể đã hoàn tất.

Kiểm thử đầu vào hợp lệ, giá trị rỗng, giới hạn độ dài, sai kiểu, truy cập trái phép và thiếu bản ghi. Xem [Kiểm tra yêu cầu và xử lý lỗi](../../developing-apps/request-validation-and-errors.md) để theo dõi ví dụ nghiệp vụ hoàn chỉnh.

## Giao diện và phần triển khai

- [Hợp đồng lỗi API](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/router/api-error.ts)
- [Kiểm tra dữ liệu và OpenAPI](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/router/openapi/index.ts)
