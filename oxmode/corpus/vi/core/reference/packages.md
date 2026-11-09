---
title: Danh mục package Core và công cụ
description: Tra runtime, thư viện, dialect cơ sở dữ liệu và công cụ phát triển NocoBase Core theo chức năng.
---

Dùng danh mục để tìm package và mã nguồn công khai theo năng lực cần dùng. Manifest và lockfile của ứng dụng xác định dependency thực tế. Xem [Danh mục plugin](plugins.md) và [Tham chiếu API](api.md) để tra plugin và giao diện thường dùng.

## Cách dùng danh mục

- Ưu tiên runtime và dịch vụ đã được template ứng dụng tích hợp.
- Import từ gốc package hoặc đường dẫn con công khai trong `package.json`.
- Dùng thư viện server ở phía server và điểm vào tương thích trình duyệt ở client.
- Plugin cung cấp phần mở rộng runtime. UI Registry cung cấp mã nguồn chỉnh sửa được và cài vào dự án nhận. Quản lý dependency và cập nhật của hai nhóm riêng.

## Runtime ứng dụng

| Package | Công dụng |
| --- | --- |
| [`@nocobase/app-client`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-client) | Ứng dụng client, route, dịch vụ và phần mở rộng React |
| [`@nocobase/app-server`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server) | Ứng dụng server, HTTP, cấu hình và tích hợp tài nguyên |
| [`@nocobase/app-cli`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-cli) | Lệnh ứng dụng cùng công cụ phát triển và build |
| [`@nocobase/app-websocket`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-websocket) | Hợp đồng WebSocket và adapter cho Node server |

## Thư viện Core

| Package | Công dụng |
| --- | --- |
| [`@nocobase/api-client`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/api-client) | Yêu cầu HTTP, phản hồi dạng luồng và Repository từ xa |
| [`@nocobase/authorization`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/authorization) | Phân quyền, bộ quyền và phạm vi dữ liệu |
| [`@nocobase/caching`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/caching) | Giao diện và adapter bộ nhớ đệm |
| [`@nocobase/config`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/config) | Nguồn cấu hình, bộ phân tích cú pháp và cơ chế hợp nhất |
| [`@nocobase/db`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db) | Mô hình dữ liệu, truy vấn, migration, transaction và phần mở rộng cơ sở dữ liệu |
| [`@nocobase/drive`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/drive) | Lưu trữ tệp và driver lưu trữ |
| [`@nocobase/i18n`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/i18n) | Runtime bản địa hóa client và server |
| [`@nocobase/jobs`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/jobs) | Tác vụ nền và lập lịch định kỳ |
| [`@nocobase/lifecycle`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/lifecycle) | Trạng thái bản ghi, bước chuyển và tác động sau commit |
| [`@nocobase/logging`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/logging) | Giao diện, định dạng và đích ghi log |
| [`@nocobase/mailer`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/mailer) | Gửi email qua SMTP, Resend và cơ chế liên quan |
| [`@nocobase/queue`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/queue) | Hàng đợi, bên gửi và bên tiêu thụ |
| [`@nocobase/realtime`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/realtime) | Thông điệp thời gian thực, đăng ký nhận ở client và phân quyền topic ở server |
| [`@nocobase/repository-input`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/repository-input) | Hợp đồng và trình dựng đầu vào truy vấn dùng chung cho trình duyệt và server |
| [`@nocobase/secrets`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/secrets) | Khóa có phiên bản và mã hóa dữ liệu nhạy cảm |
| [`@nocobase/service-provider`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/service-provider) | Container dịch vụ, token, dependency injection và vòng đời |
| [`@nocobase/session`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/session) | Phiên và lưu trữ phiên |
| [`@nocobase/snowflake`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/snowflake) | Sinh ID Snowflake |
| [`@nocobase/document-extractor`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/document-extractor) | Trích xuất văn bản tài liệu trong môi trường cô lập |
| [`@nocobase/markdown-mermaid`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/markdown-mermaid) | Sơ đồ Mermaid trong React Markdown |

## Dialect cơ sở dữ liệu

| Package | Công dụng |
| --- | --- |
| [`@nocobase/db-sqlite`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db-sqlite) | SQLite |
| [`@nocobase/db-postgres`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db-postgres) | PostgreSQL |
| [`@nocobase/db-mysql`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db-mysql) | MySQL và MariaDB |
| [`@nocobase/db-mssql`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db-mssql) | Microsoft SQL Server |
| [`@nocobase/db-oracle`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db-oracle) | Oracle Database |

Dialect thương mại gồm `@nocobase/db-dameng`, `@nocobase/db-kingbase` và `@nocobase/db-oceanbase`. Xem [Hỗ trợ cơ sở dữ liệu và tương thích phiên bản](compatibility.md) để tra chế độ kết nối và phiên bản.

## Package Agent và lệnh từ xa

| Package | Công dụng |
| --- | --- |
| [`@nocobase/acp-bridge`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/acp-bridge) | Kết nối Coding Agent cục bộ qua ACP |
| [`@nocobase/agent-protocol`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/agent-protocol) | Giao thức liên lạc giữa ứng dụng, Runner và CLI từ xa |
| [`@nocobase/agent-runner`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/app/agent-runner) | Kết nối ứng dụng, nhận và thực thi các lượt chạy Agent |
| [`@nocobase/app-cli-client`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-cli-client) | Đăng nhập ứng dụng và gọi lệnh nghiệp vụ từ xa đã công khai |
| [`@nocobase/cli-envelope`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/cli-envelope) | Hợp đồng đầu ra JSON của CLI và kiểm tra phiên bản Node |

## Công cụ phát triển và kiểm thử

| Package | Công dụng |
| --- | --- |
| [`@nocobase/app-skills`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-skills) | Skill phát triển, nâng cấp, triển khai ứng dụng và phát triển plugin |
| [`@nocobase/app-testing`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/tools/app-testing) | Tiện ích kiểm thử ứng dụng và plugin |
| [`@nocobase/db-testing`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db-testing) | Môi trường cơ sở dữ liệu cô lập và tiện ích kiểm thử dùng chung |
| [`@nocobase/db-testkit`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db-testkit) | Hợp đồng kiểm thử tích hợp dùng chung cho các dialect |
| [`@nocobase/dev-config`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/tools/dev-config) | Cấu hình dùng chung cho TypeScript, ESLint, Vitest, Vite và công cụ liên quan |
| [`@nocobase/create-app`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/tools/create-app) | Tạo khung ứng dụng |
| [`@nocobase/create-plugin`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/tools/create-plugin) | Tạo khung plugin |

## Công cụ triển khai và lưu trữ ứng dụng

| Package | Công dụng |
| --- | --- |
| [`@nocobase/app-installer`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/tools/app-installer) | Cài đặt, nâng cấp và rollback ứng dụng từ gói triển khai |
| [`@nocobase/app-host`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-host) | Lưu trữ và vận hành runtime ứng dụng |
| [`@nocobase/app-host-docker`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-host-docker) | Backend lưu trữ Docker cho App Host |

## Cài đặt và phiên bản

Dùng lockfile để tái tạo dependency của dự án. Khi nâng cấp, đối chiếu template, runtime, peer dependency của plugin và dialect cùng nhau. Mỗi package có số phiên bản riêng. Dùng mốc sản phẩm hoặc template để xác định NocoBase 2 hay 3.

Tạo ứng dụng bằng `pnpm create @nocobase/app@beta` và tạo plugin bằng `pnpm create @nocobase/plugin@beta`. Package triển khai hai công cụ là `@nocobase/create-app` và `@nocobase/create-plugin`. Xem [Tham chiếu dòng lệnh](cli.md) cho các lệnh trong ứng dụng.

## Phạm vi kiểm chứng

Tên package, vị trí và công dụng được đối chiếu ngày 27/10/2026 tại [mốc Core `015404ecd0db`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages). Khi dùng phiên bản khác, tra điểm vào công khai và khai báo kiểu thực tế trong package đã cài.
