---
title: Cấu trúc dự án
description: Tìm các trang, API, migration, test và plugin trong ứng dụng của bạn.
---

Sau khi [Tạo ứng dụng](create-app.md), bạn có một ứng dụng độc lập. Phần lớn việc phát triển nghiệp vụ diễn ra trong `client/`, `server/`, `database/` và `tests/`.

## Tổng quan thư mục

Tổng quan này gồm cả các thư mục được sinh ra khi cài đặt, phát triển hoặc build. File cụ thể tùy vào phiên bản template của bạn.

```text
my-app/
├── .agents/             # Quy tắc và Skill cho Agent
├── cli/                 # Lệnh của ứng dụng
├── client/              # Trang và giao diện
├── database/            # Migration và seed
├── dist/                # Kết quả build (tự sinh)
├── node_modules/        # Dependency đã cài (tự sinh)
├── public/              # Tài nguyên tĩnh
├── server/              # API và service
├── storage/             # Dữ liệu khi chạy (tự sinh)
├── tests/               # Test của ứng dụng
├── AGENTS.md            # Điểm vào hướng dẫn cho Agent
├── config.example.yml   # Cấu hình mẫu
├── config.yml           # Cấu hình cục bộ
└── package.json         # Script và dependency
```

## Mã nghiệp vụ đặt ở đâu

| Thư mục | Bạn viết gì |
| --- | --- |
| `client/pages/` | Các trang, đăng ký trong `client/routes.ts` cùng điều hướng và phân quyền |
| `client/components/`, `client/hooks/` | Component và hook dùng lại |
| `client/locales/` | Nội dung chữ của ứng dụng bằng tiếng Anh và tiếng Trung |
| `server/routes/` | Endpoint API, đăng ký qua `index.ts` |
| `server/providers/` | Service nghiệp vụ |
| `server/config/` | Định nghĩa cấu hình ứng dụng |
| `database/main/migrations/` | Thay đổi schema cho kết nối cơ sở dữ liệu mặc định |
| `database/main/seeds/` | Dữ liệu khởi tạo bắt buộc |
| `cli/commands/` | Lệnh riêng của ứng dụng, khi cần |

Thêm một migration mới khi thay đổi schema. Thư mục `database/main/collections/` được sinh ra là ảnh chụp schema; đừng sửa nó. Layout và theme nằm trong `client/layouts/` và `client/theme/`.

## Plugin cài sẵn

Template khai báo các năng lực dùng chung trong `package.json`. Bảng dưới bỏ tiền tố chung `@nocobase/app-plugin-`. Ví dụ, `users` nghĩa là `@nocobase/app-plugin-users`. Danh sách này phản ánh template sinh ra trong hướng dẫn; hãy kiểm tra manifest của bạn để thấy khác biệt.

| Gói | Mục đích |
| --- | --- |
| `agents` | Agent, nhà cung cấp model, hội thoại và lượt chạy |
| `api-keys` | Xác thực bằng API key |
| `authentication` | Đăng nhập và xác thực |
| `authorization` | Phân quyền và quản lý quyền |
| `authz-default-access` | Phạm vi truy cập dữ liệu mặc định |
| `authz-restriction-rules` | Hạn chế truy cập dữ liệu |
| `authz-sharing-rules` | Quy tắc chia sẻ dữ liệu |
| `database-explorer` | Xem cơ sở dữ liệu ở chế độ chỉ đọc |
| `file` | Lưu trữ, tải lên và truy cập tệp |
| `foundation` | Các năng lực Core đã cài và thông tin runtime |
| `i18n` | Chuyển ngôn ngữ giao diện |
| `knowledge` | Không gian tài liệu, tìm kiếm và phiên bản |
| `mail` | Gửi mail và đồng bộ hộp thư |
| `notification` | Lưu trữ, gửi và ghi log thông báo |
| `notification-in-app` | Thông báo trong ứng dụng và hộp thư đến |
| `notification-providers` | Các nhà cung cấp kênh gửi thông báo có sẵn |
| `scheduler` | Tác vụ định kỳ |
| `template-print` | Skill phát triển tính năng in theo mẫu |
| `users` | API và trang quản lý người dùng |

**Đã cài không có nghĩa là đã đăng ký.** Dependency nằm trong `package.json`; `client/plugins.ts`, `server/plugins.ts` và `cli/plugins.ts` đăng ký phần đóng góp tương ứng. Một plugin có thể không cung cấp đủ cả ba điểm vào. Ứng dụng tham chiếu không đăng ký `agents`, `knowledge` hay `template-print` trong các danh sách này. `template-print` là dependency phát triển cung cấp hướng dẫn cho Agent, không phải một trang in được bật tự động.

## Test

Ví dụ bắt đầu sử dụng hiện tại dùng template mặc định `1.0.0-beta.81`. Tổ chức test theo phần mã mà chúng kiểm tra:

```text
tests/
├── client/              # Trang, component và logic phía client
├── server/              # API, service và phân quyền
├── database/            # Migration và seed
├── cli/                 # Lệnh (tùy chọn)
├── project/             # Cấu hình dự án và build
├── fixtures/            # Dữ liệu test và ứng dụng fixture
├── helpers/             # Hàm hỗ trợ test dùng chung
├── setup/               # Thiết lập môi trường test
└── playwright/          # Test trên trình duyệt (tùy chọn)
```

Chạy `pnpm test` cho test Vitest, và chạy riêng `pnpm test:e2e` cho test trình duyệt. Các dự án cũ hơn có thể vẫn dùng `tests/components/` và `tests/logic/`; hãy theo template đã cài và cấu hình của nó. Ưu tiên service thật và cơ sở dữ liệu tách biệt, chỉ dùng mock khi cần thiết. Xem chi tiết ở [Kiểm thử và nghiệm thu](../developing-apps/testing-and-acceptance.md).

## Cấu hình và hướng dẫn cho Agent

`config.example.yml` mô tả các cấu hình có thể dùng. Bước khởi tạo sinh `config.yml` với thiết lập cơ sở dữ liệu cục bộ và khóa bí mật; không đưa file này vào Git. `package.json` chứa script và dependency.

`AGENTS.md` là điểm vào cho Agent. Quy tắc của ứng dụng nằm trong `.agents/rules/`. Các dependency đồng bộ `.agents/skills/`; đừng sửa những file được sinh ra này. `node_modules/`, `storage/` và `dist/` lần lượt chứa dependency, dữ liệu khi chạy và kết quả build.

## Bước tiếp theo

Làm theo [Xây ứng dụng đầu tiên](../tutorials/build-your-first-feature.md) để thêm bảng công việc, API, trang và test.
