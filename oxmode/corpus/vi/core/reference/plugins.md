---
title: Danh mục plugin
description: Tra công dụng của plugin NocoBase 3 và kiểm tra plugin nào có sẵn trong template mặc định.
---

Danh mục gồm 24 plugin ứng dụng trong repository chính và 2 plugin trong repository thương mại tại mốc mã nguồn được kiểm tra. Bảng sắp theo tên package và dẫn tới mã nguồn nếu công khai.

Cột **Có sẵn** cho biết template mặc định có đưa plugin vào khi tạo ứng dụng hay không. Kiểm tra các tệp đăng ký để biết plugin thực sự được bật. Xem [Quản lý plugin](../developing-apps/manage-plugins.md) để đăng ký, cập nhật và gỡ.

## Plugin trong repository chính

| Package | Công dụng | Có sẵn |
| --- | --- | --- |
| [`@nocobase/app-plugin-agent-sessions`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-agent-sessions) | Kết nối coding agent cục bộ và quản lý hội thoại, bản ghi cùng sản phẩm công việc trên trình duyệt. | Không |
| [`@nocobase/app-plugin-agents`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-agents) | Cấu hình API mô hình hoặc kết nối Agent trên máy để hội thoại, gọi công cụ và thực thi tác vụ. | Có |
| [`@nocobase/app-plugin-api-keys`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-api-keys) | Xác thực yêu cầu API bằng API key. | Có |
| [`@nocobase/app-plugin-authentication`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-authentication) | Cung cấp đăng nhập, phiên và tích hợp xác thực. | Có |
| [`@nocobase/app-plugin-authorization`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-authorization) | Khai báo quyền nghiệp vụ, thực thi quyết định truy cập và cung cấp giao diện quản lý quyền. | Có |
| [`@nocobase/app-plugin-authz-default-access`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-authz-default-access) | Cấu hình phạm vi truy cập mặc định cho tài nguyên nghiệp vụ. | Có |
| [`@nocobase/app-plugin-authz-restriction-rules`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-authz-restriction-rules) | Áp dụng quy tắc thu hẹp phạm vi truy cập dữ liệu. | Có |
| [`@nocobase/app-plugin-authz-sharing-rules`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-authz-sharing-rules) | Mở rộng phạm vi chia sẻ bản ghi theo quy tắc. | Có |
| [`@nocobase/app-plugin-database-explorer`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-database-explorer) | Xem kết nối, Collection và trường cơ sở dữ liệu ở chế độ chỉ đọc. | Có |
| [`@nocobase/app-plugin-demo-mode`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-demo-mode) | Cung cấp bộ dữ liệu demo có thể tạo lại, tài khoản khách và bảo vệ thao tác ghi. | Không |
| [`@nocobase/app-plugin-file`](https://github.com/nocobase/nocobase/tree/d9a625d93b4098c7e2cc664ed01f187178e145d4/packages/plugins/app-plugin-file) | Cung cấp Repository tệp, API tải lên và nội dung. Mã giao diện tệp có thể chỉnh sửa đến từ NocoBase UI Library. | Có |
| [`@nocobase/app-plugin-foundation`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-foundation) | Hiển thị năng lực Core ứng dụng dùng và dấu hiệu sử dụng khi chạy. | Có |
| [`@nocobase/app-plugin-i18n`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-i18n) | Tích hợp bản địa hóa và chuyển ngôn ngữ ứng dụng. | Có |
| [`@nocobase/app-plugin-knowledge`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-knowledge) | Quản lý không gian Markdown, phiên bản, tìm kiếm, đề xuất và duyệt thay đổi. | Có |
| [`@nocobase/app-plugin-mail`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-mail) | Gửi email, đồng bộ hộp thư có thể tiếp tục sau gián đoạn và mở rộng nhà cung cấp. | Có |
| [`@nocobase/app-plugin-notification`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-notification) | Lưu thông báo, điều phối gửi và ghi nhật ký. | Có |
| [`@nocobase/app-plugin-notification-in-app`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-notification-in-app) | Cung cấp kênh thông báo trong ứng dụng, API hộp thư có xác thực và năng lực phía client. | Có |
| [`@nocobase/app-plugin-notification-providers`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-notification-providers) | Cung cấp loại kênh và nhà cung cấp thông báo tích hợp. | Có |
| [`@nocobase/app-plugin-notification-web-push`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-notification-web-push) | Quản lý đăng ký trình duyệt và gửi Web Push. | Không |
| [`@nocobase/app-plugin-projects`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-projects) | Quản lý dự án, issue và cộng tác phát triển. | Không |
| [`@nocobase/app-plugin-releases`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-releases) | Quản lý ứng dụng, bản phát hành, môi trường và driver triển khai có thể thay thế. | Không |
| [`@nocobase/app-plugin-scheduler`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-scheduler) | Khai báo lịch bằng mã, cung cấp bản ghi thực thi và API bật tắt. | Có |
| [`@nocobase/app-plugin-template-print`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-template-print) | Cung cấp Skill cho Agent để triển khai in theo mẫu DOCX và PDF. | Có |
| [`@nocobase/app-plugin-users`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-users) | Cung cấp API và trang quản trị người dùng. | Có |

`app-plugin-template-print` hiện phân phối Skill. Tích hợp qua đồng bộ Skill vì package không có điểm vào runtime Client, Server hoặc CLI. Template mặc định có dependency `agents` và `knowledge`. Đăng ký tường minh để nạp chúng.

## Plugin trong repository thương mại

Các plugin thương mại sau cần cài riêng. Việc sử dụng phụ thuộc giấy phép áp dụng.

| Package | Công dụng |
| --- | --- |
| `@nocobase/app-plugin-approval` | Gắn tác vụ phê duyệt của con người với vòng đời bản ghi, chính sách và kết quả. |
| `@nocobase/app-plugin-task-center` | Lập chỉ mục tác vụ cá nhân từ nhiều nguồn nghiệp vụ, cung cấp API truy vấn và UI dùng lại. |

## Dialect cơ sở dữ liệu

Dialect là adapter cơ sở dữ liệu. Xem [Hỗ trợ cơ sở dữ liệu và tương thích phiên bản](compatibility.md) để tra chế độ kết nối, phiên bản kiểm thử và khác biệt cấu hình. Xem [Danh mục package Core và công cụ](packages.md) để tra thư viện khác.

`@nocobase/db` tích hợp qua tám package dialect, gồm năm package trong repository chính và ba package thương mại.

| Package dialect | Cơ sở dữ liệu | Repository |
| --- | --- | --- |
| `@nocobase/db-dameng` | Dameng (DM) | Thương mại |
| `@nocobase/db-kingbase` | KingbaseES (chế độ tương thích PostgreSQL) | Thương mại |
| [`@nocobase/db-mssql`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/libs/db-mssql) | Microsoft SQL Server | Chính |
| [`@nocobase/db-mysql`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/libs/db-mysql) | MySQL | Chính |
| `@nocobase/db-oceanbase` | OceanBase CE (tenant tương thích MySQL) | Thương mại |
| [`@nocobase/db-oracle`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/libs/db-oracle) | Oracle Database | Chính |
| [`@nocobase/db-postgres`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/libs/db-postgres) | PostgreSQL | Chính |
| [`@nocobase/db-sqlite`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/libs/db-sqlite) | SQLite | Chính |

Dialect thương mại được phân phối qua registry Pro. Quyền truy cập mã nguồn và sử dụng phụ thuộc giấy phép. Tại mốc đã kiểm tra, `db-dameng` đang thử nghiệm. Kiểm chứng hợp đồng tích hợp trên phiên bản Dameng đích trước khi dùng.

## Mốc mã nguồn

Danh mục được đối chiếu ngày 25/10/2026 với [nocobase `db419f1d4`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins) và mã nguồn plugin thương mại. Trạng thái có sẵn trong template dùng cùng mốc của repository chính. Tính khả dụng và đăng ký có thể thay đổi theo bản phát hành.

Quyền sở hữu mã giao diện tệp được kiểm tra thêm tại [`d9a625d93b40`](https://github.com/nocobase/nocobase/tree/d9a625d93b4098c7e2cc664ed01f187178e145d4). Phần còn lại dùng mốc nêu trên.
