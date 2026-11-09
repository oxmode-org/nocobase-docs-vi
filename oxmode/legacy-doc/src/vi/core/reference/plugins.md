---
title: Tổng quan plugin
description: Các plugin của NocoBase 3, công dụng của chúng và có được tích hợp sẵn hay không.
---

Danh mục này bao gồm mọi plugin ứng dụng trong mã nguồn đã rà soát: 24 plugin trong repository chính, 2 trong repository thương mại và 19 plugin ví dụ. Các mục được xếp theo thứ tự chữ cái của tên package, có đường dẫn khi mã nguồn công khai.

“Tích hợp sẵn” cho biết template mặc định có kèm plugin khi tạo ứng dụng hay không. Plugin có kèm được đánh dấu “Có”; plugin cần cài riêng được đánh dấu “Không”. Hãy xem các file đăng ký plugin của ứng dụng để biết một plugin có đang được bật hay không. Xem [Quản lý plugin](../developing-apps/manage-plugins.md) về đăng ký, gỡ bỏ và cập nhật.

## Plugin trong repository chính

| Package | Công dụng | Tích hợp sẵn |
| --- | --- | --- |
| [`@nocobase/app-plugin-agent-sessions`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-agent-sessions) | Kết nối coding agent cục bộ và quản lý hội thoại trên trình duyệt, transcript và sản phẩm công việc. | Không |
| [`@nocobase/app-plugin-agents`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-agents) | Quản lý Agent, dịch vụ model, lượt chạy, hội thoại và runner. | Có |
| [`@nocobase/app-plugin-api-keys`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-api-keys) | Xác thực request API bằng API key. | Có |
| [`@nocobase/app-plugin-authentication`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-authentication) | Cung cấp đăng nhập, phiên và tích hợp xác thực. | Có |
| [`@nocobase/app-plugin-authorization`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-authorization) | Khai báo quyền nghiệp vụ, thực thi quyết định truy cập và cung cấp giao diện quản lý quyền. | Có |
| [`@nocobase/app-plugin-authz-default-access`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-authz-default-access) | Cấu hình phạm vi truy cập dữ liệu mặc định cho tài nguyên nghiệp vụ. | Có |
| [`@nocobase/app-plugin-authz-restriction-rules`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-authz-restriction-rules) | Áp dụng quy tắc để giới hạn thêm quyền truy cập dữ liệu. | Có |
| [`@nocobase/app-plugin-authz-sharing-rules`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-authz-sharing-rules) | Mở rộng việc chia sẻ bản ghi qua quy tắc. | Có |
| [`@nocobase/app-plugin-database-explorer`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-database-explorer) | Xem kết nối cơ sở dữ liệu, collection và field trong một trình duyệt chỉ đọc. | Có |
| [`@nocobase/app-plugin-demo-mode`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-demo-mode) | Cung cấp bộ dữ liệu demo lặp lại được, tài khoản khách và bảo vệ chống ghi. | Không |
| [`@nocobase/app-plugin-file`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-file) | Cung cấp kho tệp, API tải lên và nội dung, và các component tệp thuộc ứng dụng. | Có |
| [`@nocobase/app-plugin-foundation`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-foundation) | Hiển thị các năng lực Core mà ứng dụng dùng và bằng chứng khi chạy của chúng. | Có |
| [`@nocobase/app-plugin-i18n`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-i18n) | Tích hợp đa ngôn ngữ và chuyển ngôn ngữ ứng dụng. | Có |
| [`@nocobase/app-plugin-knowledge`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-knowledge) | Quản lý không gian Markdown, phiên bản, tìm kiếm, đề xuất và duyệt. | Có |
| [`@nocobase/app-plugin-mail`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-mail) | Cung cấp gửi thư, đồng bộ hộp thư có thể tiếp tục và mở rộng nhà cung cấp. | Có |
| [`@nocobase/app-plugin-notification`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-notification) | Cung cấp lưu trữ thông báo, runtime gửi và log. | Có |
| [`@nocobase/app-plugin-notification-in-app`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-notification-in-app) | Cung cấp kênh thông báo trong ứng dụng, API hộp thư có xác thực và năng lực phía client. | Có |
| [`@nocobase/app-plugin-notification-providers`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-notification-providers) | Cung cấp các kênh và nhà cung cấp thông báo có sẵn. | Có |
| [`@nocobase/app-plugin-notification-web-push`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-notification-web-push) | Quản lý đăng ký thông báo đẩy của trình duyệt và gửi thông báo Web Push. | Không |
| [`@nocobase/app-plugin-projects`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-projects) | Quản lý dự án, issue và cộng tác phát triển. | Không |
| [`@nocobase/app-plugin-releases`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-releases) | Quản lý ứng dụng, bản phát hành, môi trường và các driver triển khai cắm được. | Không |
| [`@nocobase/app-plugin-scheduler`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-scheduler) | Khai báo lịch chạy trong mã và cung cấp bản ghi thực thi cùng API bật/tắt. | Có |
| [`@nocobase/app-plugin-template-print`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-template-print) | Cung cấp Agent Skill để triển khai in theo mẫu DOCX và PDF. | Có |
| [`@nocobase/app-plugin-users`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins/app-plugin-users) | Cung cấp API và trang quản trị người dùng. | Có |

`app-plugin-template-print` hiện chỉ cung cấp Skill, không có điểm vào runtime Client, Server hay CLI, nên không thuộc các mảng đăng ký plugin. `agents` và `knowledge` là dependency của template mặc định nhưng không được đăng ký mặc định.

## Plugin trong repository thương mại

Các plugin thương mại này không có trong template mặc định. Việc sử dụng tuân theo giấy phép áp dụng cho bạn.

| Package | Công dụng |
| --- | --- |
| `@nocobase/app-plugin-approval` | Gắn các tác vụ phê duyệt của con người với vòng đời bản ghi, kèm chính sách và kết quả. |
| `@nocobase/app-plugin-task-center` | Lập chỉ mục tác vụ cá nhân từ nhiều nguồn nghiệp vụ, kèm API truy vấn và giao diện tái sử dụng được. |

## Plugin ví dụ

Plugin ví dụ minh họa các mẫu tích hợp và mở rộng, nằm trong `packages/examples/` của mỗi repository. Chúng không có trong template mặc định và dùng làm tham khảo khi triển khai.

| Plugin ví dụ | Minh họa |
| --- | --- |
| `@nocobase/app-plugin-approval-example` (repository thương mại) | Trung tâm phê duyệt và kiểm chứng kịch bản phê duyệt. |
| [`@nocobase/app-plugin-authorization-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-authorization-example) | Tài nguyên nghiệp vụ, vai trò, phạm vi dữ liệu, chia sẻ và giới hạn. |
| [`@nocobase/app-plugin-cli-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-cli-example) | Mở rộng CLI của ứng dụng. |
| [`@nocobase/app-plugin-database-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-database-example) | Viết migration và seed cho cơ sở dữ liệu. |
| [`@nocobase/app-plugin-file-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-file-example) | Collection tệp đính kèm, API tải lên và trang tệp. |
| [`@nocobase/app-plugin-jobs-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-jobs-example) | Lịch chạy định kỳ và job nền chạy một lần. |
| [`@nocobase/app-plugin-lifecycle-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-lifecycle-example) | Vòng đời bản ghi cho phiếu hỗ trợ và báo cáo chi phí. |
| [`@nocobase/app-plugin-mail-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-mail-example) | Minh họa đồng bộ hộp thư và gửi thư với nhà cung cấp thư giả lập. |
| [`@nocobase/app-plugin-notification-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-notification-example) | Giao việc và thông báo trong ứng dụng. |
| [`@nocobase/app-plugin-office-flows-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-office-flows-example) | Yêu cầu sử dụng dữ liệu và phân phối tài liệu nhiều cấp. |
| `@nocobase/app-plugin-pro-example` (repository thương mại) | Chạy thử quy trình build, đóng gói và phát hành plugin thương mại. |
| [`@nocobase/app-plugin-queue-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-queue-example) | Gửi và nhận tin nhắn hàng đợi. |
| [`@nocobase/app-plugin-realtime-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-realtime-example) | Cập nhật thời gian thực cho công việc cộng tác, thông báo cá nhân và xuất dữ liệu nền. |
| [`@nocobase/app-plugin-registry-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-registry-example) | Giao diện runtime của plugin và UI component thuộc ứng dụng. |
| [`@nocobase/app-plugin-repository-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-repository-example) | API Repository quan hệ cho CRM và đơn hàng. |
| [`@nocobase/app-plugin-routes-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-routes-example) | API phía server và route client tải lười. |
| [`@nocobase/app-plugin-service-provider-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-service-provider-example) | Đăng ký service và quản lý vòng đời của chúng. |
| [`@nocobase/app-plugin-skills-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-skills-example) | Cung cấp Agent Skill cho một plugin. |
| [`@nocobase/app-plugin-template-print-example`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/examples/app-plugin-template-print-example) | In DOCX và PDF từ dữ liệu hóa đơn được phép truy cập. |

## Dialect cơ sở dữ liệu

`@nocobase/db` hỗ trợ tích hợp cơ sở dữ liệu qua tám package dialect sau: năm trong repository chính và ba trong repository thương mại. Tên package có đường dẫn đến mã nguồn khi mã nguồn công khai.

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

Các package dialect thương mại được phân phối qua Pro registry; quyền truy cập mã nguồn và sử dụng tùy theo quyền lợi áp dụng. Trong phiên bản đã rà soát, `db-dameng` được đánh dấu thử nghiệm và hợp đồng tích hợp của nó vẫn cần được kiểm chứng với phiên bản server Dameng đã chọn.

## Mốc mã nguồn

Rà soát ngày 2026-10-25 dựa trên [nocobase `db419f1d4`](https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins) và mã nguồn plugin thương mại. Trạng thái trong template mặc định lấy từ cùng phiên bản đó của repository chính. Tính sẵn có và việc đăng ký plugin có thể khác trong một phiên bản đã phát hành.
