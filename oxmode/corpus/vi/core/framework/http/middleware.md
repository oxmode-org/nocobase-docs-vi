---
title: Middleware
---

Middleware xử lý những hành vi dùng chung giữa các yêu cầu, như đọc danh tính, áp dụng giới hạn và đặt header phản hồi. Khai báo rõ đường dẫn và thứ tự chạy. Tổ chức luồng nghiệp vụ trong dịch vụ.

## Khai báo và tích hợp

```ts
import { defineHttpMiddleware } from '@nocobase/app-server/router';

export const responseHeaders = defineHttpMiddleware({
  name: 'example.response-headers',
  register(router) {
    router.use('/api/*', async (context, next) => {
      await next();
      context.header('X-Content-Type-Options', 'nosniff');
    });
  },
});
```

Gọi `app.addHttpMiddleware(responseHeaders)` khi lắp ghép ứng dụng, trước khi khởi động và đăng ký route. Plugin có thể bổ sung middleware trong các giai đoạn còn cho phép thay đổi khai báo.

Callback đăng ký nhận Router gốc của ứng dụng. Vì vậy `/api/*` tính từ gốc ứng dụng. Host điều chỉnh đường dẫn cơ sở bên ngoài. Logic riêng của một mô-đun route có thể gọi `use()` trên Hono Router của mô-đun đó.

## Thứ tự thực thi

Mã trước `await next()` chạy khi yêu cầu đi vào. Mã sau lệnh này chạy sau khi các handler phía sau xử lý xong. Để từ chối yêu cầu, trả phản hồi hoặc ném lỗi API ngay tại middleware.

Thiết lập danh tính trước khi kiểm tra các quyền phụ thuộc danh tính đó. Đọc body một lần, đặc biệt với tệp tải lên dạng stream. Chia sẻ dữ liệu đã phân tích qua hợp đồng ngữ cảnh rõ ràng.

## Giới hạn và lỗi

Dùng cấu hình `api` cho các giới hạn chung về kích thước body, thời gian chờ và tần suất yêu cầu. Giới hạn theo tiến trình có bộ đếm riêng ở mỗi tiến trình. Địa chỉ client phía sau proxy phụ thuộc cách triển khai host.

Khi gặp lỗi chưa xác định, giữ trạng thái lỗi để bên gọi nhận biết. Ghi mã định danh yêu cầu, thời lượng và kết quả. Loại cookie, header xác thực và nội dung nhạy cảm khỏi log.

Kiểm thử đường dẫn khớp, trường hợp từ chối ngay tại middleware, lỗi và thứ tự middleware. Xem [Kiểm tra dữ liệu](validation.md) và [Tham chiếu cấu hình](../../reference/configuration.md).

## Giao diện và phần triển khai

- [Khai báo middleware](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/router/routes.ts)
- [Vòng đời định tuyến](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/application/index.ts)
- [Giới hạn API](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/router/api-limits.ts)
