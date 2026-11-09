---
title: Nạp và mở rộng plugin
---

Plugin khai báo các thành phần đóng góp qua điểm vào công khai. Ứng dụng đích tích hợp từng thành phần một cách tường minh. Cài dependency, đăng ký runtime và tích hợp nghiệp vụ là ba bước riêng.

## Đăng ký độc lập theo runtime

| Runtime | Điểm vào plugin | Điểm đăng ký trong ứng dụng |
| --- | --- | --- |
| Client | `package/client` | `client/plugins.ts` |
| Server | `package/server` | `server/plugins.ts` |
| CLI | `package/cli` | `cli/plugins.ts` |

Các điểm vào là tùy chọn. Package chỉ chứa Skill có thể không cần điểm vào nào. Đăng ký phía client chỉ có hiệu lực ở client. Đăng ký phía server cũng không tự cài các component của trang.

## Phân giải khai báo

`defineClientPlugin()`, `defineServerPlugin()` và `defineCliPlugin()` mô tả các thành phần plugin cung cấp. Ứng dụng import các factory rồi thêm kết quả của chúng vào khai báo của từng runtime. Khi phân giải khai báo, runtime đăng ký dịch vụ, tạo route, nạp tài nguyên hoặc gắn React Provider ở giai đoạn phù hợp.

Giữ thao tác truy vấn dữ liệu nghiệp vụ, khởi chạy tác vụ và mở kết nối ngoài quá trình import. Tùy chọn plugin mô tả thiết lập ổn định dùng để lắp ghép ứng dụng. Đặt thông tin xác thực triển khai trong cấu hình server.

## Dependency và ranh giới mở rộng

Xuất giao diện và token dịch vụ qua điểm vào công khai để plugin khác sử dụng. Nếu thiếu dependency, hãy báo lỗi rõ ràng khi lắp ghép hoặc khởi động. Dùng giao diện công khai để truy cập package khác.

Cơ chế ghi đè component của route phía client thay loader của trang và giữ nguyên đường dẫn, định danh cùng metadata truy cập do plugin quản lý. Tài nguyên Registry phân phối độc lập cung cấp mã nguồn UI có thể chỉnh sửa. Đăng ký plugin runtime vẫn là một bước riêng.

## Kiểm chứng tích hợp

Kiểm tra đăng ký runtime thực tế, thực thi tài nguyên cơ sở dữ liệu, quyền truy cập route và hành vi của ứng dụng sau build. `plugin inspect` đọc khai báo tĩnh. Hãy chạy luồng nghiệp vụ để xác nhận chức năng. Snapshot đăng ký liệt kê các plugin đã khai báo. Xác định năng lực thực tế qua các luồng sử dụng.

Xem [Quản lý plugin](../../developing-apps/manage-plugins.md) và [Phân phối mã nguồn UI](../../extension-development/frontend-components.md#optionally-distribute-ui-source-assets).

## Giao diện và phần triển khai

- [Lắp ghép plugin client](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-client/README.md)
- [Hợp đồng plugin server](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/plugins/index.ts)
- [Thành phần CLI](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-cli/README.md)
