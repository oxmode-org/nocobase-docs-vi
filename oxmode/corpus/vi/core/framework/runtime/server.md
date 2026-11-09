---
title: Runtime server
---

Runtime server quản lý cấu hình, đường dẫn tài nguyên, vòng đời dịch vụ và tích hợp HTTP/WebSocket. Ứng dụng nghiệp vụ tách khỏi host lắng nghe kết nối, nên cùng một ứng dụng có thể chạy trên server độc lập, trong lệnh hoặc trong bài kiểm thử.

## Runtime và ứng dụng

```text
server/runtime.ts + server/config/
  → runtime đã phân giải
  → createApp(runtime)
  → Application + ServiceProviders
  → app.start()
  → host HTTP / WebSocket
```

`server/runtime.ts` khai báo cách nạp cấu hình, plugin, ServiceProvider, route và tài nguyên ngôn ngữ. `createApp(runtime)` trong `server/app.ts` lắp ghép ứng dụng cùng các dịch vụ framework. `Application` quản lý `config`, `paths`, `container` và xử lý yêu cầu.

`app.start()` hoàn tất khởi động nội bộ. Host phụ trách mở cổng mạng. Hãy kiểm tra cổng riêng để xác nhận khả năng truy cập sau khi Provider chạy `ready()`. Bài kiểm thử có thể gửi yêu cầu qua giao diện `fetch` của ứng dụng mà không cần mở cổng.

## Đăng ký năng lực nghiệp vụ

| Thành phần | Điểm đăng ký |
| --- | --- |
| Các phần cấu hình | `server/config/` và điểm tổng hợp của thư mục này |
| Dịch vụ nghiệp vụ | `server/providers/` hoặc `serviceProviders` của plugin |
| Endpoint HTTP | Mảng route của ứng dụng hoặc `routes` của plugin |
| Tài nguyên cơ sở dữ liệu | `database/<connection>/` hoặc khai báo plugin |
| Plugin | `server/plugins.ts` |

Phân giải dịch vụ cơ sở dữ liệu, ghi log và tác vụ hiện có từ container của host. Plugin cần dùng chung container và dịch vụ của host để duy trì cùng kết nối, trạng thái và trách nhiệm giải phóng tài nguyên.

## Yêu cầu và trạng thái dùng chung

Container thường tồn tại trong suốt tiến trình. Danh tính và đầu vào thuộc từng yêu cầu. Giữ thông tin người dùng hiện tại trong phạm vi yêu cầu. Xác thực danh tính ở route, truyền đầu vào cần thiết vào dịch vụ và truyền kết nối transaction một cách tường minh.

Dùng `app.paths` để xác định đường dẫn theo runtime. Đặt tệp tải lên và cơ sở dữ liệu SQLite ở vị trí lưu trữ bền vững bên ngoài thư mục build có thể bị thay thế.

## Xử lý lỗi và tắt ứng dụng

Tạo, kiểm tra và giải phóng tài nguyên trong hook vòng đời bất đồng bộ. Bước dọn dẹp phải xử lý được trường hợp khởi tạo dở dang và chỉ đóng tài nguyên do thành phần đó quản lý. Chính sách khởi động của host, health check và cơ chế giám sát tiến trình cần xét cả trạng thái sẵn sàng nội bộ.

Xem [Vòng đời](lifecycle.md), [Dịch vụ server](../services/integration.md#server-services) và [Các cách triển khai](../../deployment/choose-a-deployment-method.md).

## Giao diện và phần triển khai

- [Application](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/application/index.ts)
- [Khai báo runtime server](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/templates/app-template-default/server/runtime.ts)
