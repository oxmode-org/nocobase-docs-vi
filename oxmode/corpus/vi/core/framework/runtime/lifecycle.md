---
title: Khởi động và vòng đời ứng dụng
---

Các giai đoạn vòng đời tách riêng việc khai báo dịch vụ, khởi tạo bất đồng bộ, khởi chạy các thành phần tiêu thụ và giải phóng tài nguyên. Ứng dụng và plugin tuân theo cùng thứ tự để xác định khi nào dependency đã sẵn sàng.

## Thứ tự các giai đoạn

```text
Server: validate → register → locales → boot → routes → start → ready
Client: register → boot → render configuration → validation → start → ready
Shutdown: reverse Provider order
```

Mỗi giai đoạn chạy qua tất cả Provider trước khi chuyển sang giai đoạn tiếp theo. Sau khi sẵn sàng, server còn xử lý dữ liệu mẫu của template. Bước này có vòng đời riêng với transaction của yêu cầu nghiệp vụ.

| Hook | Việc nên làm |
| --- | --- |
| `register()` | Đăng ký instance hoặc factory đồng bộ khởi tạo khi cần |
| `boot()` | Phân giải dependency, chuẩn bị bất đồng bộ, đăng ký handler |
| `start()` | Khởi chạy listener, đăng ký nhận hoặc thành phần tiêu thụ |
| `ready()` | Hoàn tất chuẩn bị nội bộ sau khi mọi Provider đã chạy |
| `shutdown()` | Dừng và đợi tài nguyên do Provider quản lý giải phóng xong |

Factory tạo route server chạy sau `boot()` và trước `start()`. Factory có thể phân giải dịch vụ. Ở giai đoạn này, các thành phần tiêu thụ chưa bắt đầu chạy. Host trên trình duyệt chỉ render React sau khi ứng dụng khởi động thành công.

## Dependency và quyền sở hữu tài nguyên

Đăng ký factory trước rồi phân giải dependency tại đúng giai đoạn. Khai báo thứ tự khởi động cần thiết ở điểm tổng hợp. Tên tệp có thể thay đổi độc lập với thứ tự này.

Khi dọn dẹp, dùng `resolveIfCreated()` để chỉ lấy dịch vụ đã tồn tại. Bên sở hữu đóng tài nguyên dùng chung như kết nối cơ sở dữ liệu. Bên sử dụng chỉ giải phóng đăng ký nhận, handler và handle của mình.

## Xử lý lỗi và kiểm chứng

Bước dọn dẹp phải xử lý được cả trường hợp khởi tạo dở dang và trường hợp được gọi lặp lại. Báo lỗi dọn dẹp để host xác định quá trình tắt đã hoàn tất hay chưa. Kiểm chứng khởi động bình thường, thiếu dependency, lỗi khi khởi tạo và tắt ứng dụng trong khi còn công việc đang chạy.

`ready()` cho biết trạng thái sẵn sàng nội bộ. Dùng health check riêng cho listener, proxy và cơ sở dữ liệu. Xem [ví dụ ServiceProvider đầy đủ](../../extension-development/service-provider.md).

## Giao diện và phần triển khai

- [Bộ đăng ký Provider](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/service-provider/src/registry.ts)
- [Vòng đời server](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/application/index.ts)
- [Vòng đời client](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-client/README.md)
