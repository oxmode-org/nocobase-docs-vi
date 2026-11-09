---
title: Runtime dòng lệnh
---

`@nocobase/app-cli` tập hợp lệnh của framework, lệnh nghiệp vụ của ứng dụng và lệnh plugin trong một cây lệnh. Runtime dựa vào metadata của ứng dụng để chọn điểm vào từ mã nguồn hoặc từ bản triển khai.

## Xác định ứng dụng

Điểm vào từ mã nguồn tìm `package.json` của ứng dụng bằng cách duyệt từ thư mục làm việc lên các thư mục cha. `nocobase.templateKind` nhận diện mã nguồn. `nocobase.buildTarget` nhận diện sản phẩm triển khai. Dùng `NOCOBASE_APP_ROOT` để chọn ứng dụng mà vẫn giữ thư mục làm việc hiện tại.

Trong bản triển khai, `dist/cli/index.js` tự cung cấp vị trí và có thể chạy trực tiếp bằng Node.js. Dùng điểm vào của đúng bản phát hành để lấy đúng phiên bản lệnh.

```bash
pnpm nocobase commands --json
node dist/cli/index.js commands --json
```

## Không gian tên lệnh nghiệp vụ

| Nguồn | Khai báo | Ví dụ |
| --- | --- | --- |
| Ứng dụng | `cli/commands/orders/sync.ts` | `nocobase app orders sync` |
| Plugin | Thành phần CLI trong `cli/plugins.ts` | `nocobase orders info` |
| Công cụ phát triển | `devCommands` và hook của plugin | Chỉ giữ trong môi trường mã nguồn |

Tên topic của plugin thường bỏ scope và tiền tố `app-plugin-`. Hai package có cùng topic sẽ xung đột. Giải quyết bằng cách đặt topic riêng cho mỗi package.

## Khởi động các dịch vụ cần dùng

Lệnh kế thừa `AppCommand` có thể gọi `withApp()` để tạo, sử dụng và dọn dẹp ứng dụng. Đọc cấu hình và chạy migration thường chỉ cần một phần dịch vụ nền. Gọi `app.start()` khi hành vi nghiệp vụ cần toàn bộ vòng đời ứng dụng.

Khi import mô-đun, chỉ khai báo lệnh để thao tác xem trợ giúp hoặc liệt kê lệnh không tự kết nối cơ sở dữ liệu. Thu thập hook phát triển qua CLI đã đăng ký để runtime xử lý đúng vòng đời.

## Đầu ra và triển khai

Dữ liệu lệnh trả về nằm trong trường `result` của phản hồi JSON. Ghi tiến độ vào stderr. Bên gọi kiểm tra mã thoát, `ok`, `status` và cảnh báo. Build lại sau khi thêm lệnh để đưa lệnh mới vào bản triển khai.

Xem [Viết lệnh ứng dụng](../../developing-apps/application-commands.md) và [Tích hợp lệnh plugin](../../developing-apps/plugin-commands.md) để viết và đăng ký lệnh. Xem [Mở rộng CLI](../../extension-development/extend-command-line.md) để khai báo lệnh plugin và [Tham chiếu CLI](../../reference/cli.md) để tra tùy chọn có sẵn. Nếu cần HTTP client độc lập, xem [Cung cấp CLI client cho ứng dụng](../../developing-apps/cli-client.md).

## Giao diện và phần triển khai

- [Runtime CLI](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-cli/README.md)
