---
title: Tùy chọn cấu hình
description: config.yml và các biến môi trường của Studio: địa chỉ công khai, khóa mã hóa, quản trị viên đầu tiên, cơ sở dữ liệu, ngôn ngữ và đăng nhập, email và thông báo đẩy, chạy nhiều instance, quản lý phát hành và log.
---

Cấu hình của Studio nằm trong `config.yml` ở thư mục triển khai, được mount vào `/app/config.yml` trong container. Sao chép file mẫu ra từ image:

```bash
docker run --rm --entrypoint cat pkg-v3.nocobase.com/nocobase/studio:<version> /app/config.example.yml > config.yml
```

Một số thiết lập cũng có thể lấy từ biến môi trường, và biến môi trường được ưu tiên. Hãy để mật khẩu và khóa trong biến môi trường, trong file `.env` có quyền 600, thay vì trong `config.yml`. Khởi động lại Studio sau khi đổi cấu hình: `docker compose up -d`.

## Biến môi trường

| Biến | Thiết lập gì |
| --- | --- |
| `APP_PUBLIC_ORIGIN` | Địa chỉ trình duyệt dùng để truy cập Studio, không kèm đường dẫn, như `https://studio.example.com`. Callback từ nền tảng lưu trữ mã, đường dẫn trong email và thông báo đẩy đều dùng nó |
| `SECRETS_KEYS` | Khóa mã hóa, dạng `1:<key>`. Tạo bằng `openssl rand -hex 32`. Các thông tin xác thực và API key đã mã hóa phụ thuộc vào nó, và phiên đăng nhập được suy ra từ nó |
| `INITIAL_ADMIN_USERNAME`, `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD` | Quản trị viên đầu tiên, chỉ được tạo ở lần khởi động đầu khi chưa có tài khoản nào. Đổi chúng về sau không thay đổi tài khoản đã có |
| `DB_DIALECT`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, `DB_SSL` | Kết nối cơ sở dữ liệu |
| `WEB_PUSH_PRIVATE_KEY` | Push private key. Xem [Thông báo và thông báo đẩy](../admin/notifications.md) |
| `SMTP_PASSWORD` | Mật khẩu SMTP cho kênh email |
| `API_BODY_LIMIT`, `API_TIMEOUT` | Kích thước body tối đa và thời gian chờ xử lý cho các request API |

Studio chạy dưới `/main`, như `https://studio.example.com/main/`. Khi thêm runtime hoặc đăng nhập `nb-studio`, hãy dùng địa chỉ đầy đủ có `/main` này.

> [!WARNING] Khóa mã hóa
> Đừng đổi `SECRETS_KEYS` sau khi triển khai. Nếu đổi, mọi người bị đăng xuất, và nếu làm mất, các thông tin xác thực đã lưu không thể giải mã. Để thay khóa, đặt khóa mới lên đầu với số phiên bản cao hơn (`2:<new key>,1:<old key>`), mã hóa lại, rồi mới bỏ khóa cũ.

## Các thiết lập chính trong config.yml

| Thiết lập | Thiết lập gì |
| --- | --- |
| `i18n.defaultLocale` | Ngôn ngữ giao diện. Đặt theo ngôn ngữ của nhóm, như `zh-CN`. Nếu không đặt, giao diện là tiếng Anh |
| `auth.emailAndPassword.disableSignUp` | Đặt `true` để tắt tự đăng ký, để thành viên chỉ tham gia qua lời mời. File mẫu không có sẵn, nên bạn tự thêm |
| `auth.passwordReset` | Đặt lại mật khẩu. Cần một kênh email, với `emailChannel` trỏ đến kênh đó |
| `notification.channels` | Các kênh nhắc nhở: trong ứng dụng (`inbox`), email (`system-email`, qua SMTP hoặc Resend), và các kênh khác. Xem [Thông báo và thông báo đẩy](../admin/notifications.md) |
| `push` | Thông báo đẩy: `privateKey` và `contact` |
| `database` | Kết nối cơ sở dữ liệu, bị biến môi trường ghi đè |
| `users.initialAdmin` | Quản trị viên đầu tiên, bị biến môi trường ghi đè |
| `secrets.keys` | Khóa mã hóa, bị biến môi trường `SECRETS_KEYS` ghi đè |
| `logging` | Mức log, và giữ log bao nhiêu ngày, bao nhiêu dung lượng |
| `studio.git.apiBaseUrls` | Địa chỉ API của GitHub Enterprise hoặc GitLab tự host, khi chúng không ở vị trí mặc định |
| `studio.agents.queuedExpiryHours` | Công việc trong hàng đợi chờ runtime bao nhiêu giờ trước khi thất bại, mặc định 24. Đặt 0 để chờ mãi |
| `agents.runs.retentionDays` | Các lượt chạy đã kết thúc giữ transcript và prompt bao nhiêu ngày, mặc định 14 |
| `drive` | Lưu trữ tệp, mặc định là thư mục `storage` cục bộ. Bạn có thể chuyển sang object storage tương thích S3 |

## Chạy nhiều instance

Một instance Studio không cần Redis. Khi chạy nhiều instance, hãy chuyển cả `realtime` (tin nhắn trực tiếp) và `jobs` (tác vụ định kỳ) sang Redis, với mọi instance dùng chung một namespace. Bật persistence trong Redis và đặt `maxmemory-policy noeviction`, nếu không tác vụ định kỳ có thể bị mất.

## Quản lý phát hành

| Thiết lập | Thiết lập gì |
| --- | --- |
| `releases.docker` | Bật chế độ Docker: `enabled: true`, cùng địa chỉ vào và các cổng cho ứng dụng Docker. Xem [Môi trường triển khai](../admin/environments.md) |
| `releases.host.launchPrefix` | Chạy preview bằng một user hệ thống khác không đọc được cấu hình của Studio |
| `studio.releases.previewPublicUrl` | Một tên miền riêng cho preview, như `https://studio-preview.example.com/{appId}/`, thay vì dùng chung địa chỉ của Studio |
| `studio.releases.previewEnvironment` | Đặt `false` để không tạo môi trường preview khi cài đặt |

Khi dùng thật, hãy cho preview tên miền riêng và chạy bằng một user hệ thống khác. Preview chạy mã chưa được merge và không nên đọc được cấu hình và khóa bí mật của Studio.
