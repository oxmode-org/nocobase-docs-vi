---
title: Tham chiếu cấu hình
description: Các trường cấu hình Studio, biến môi trường ghi đè, lưu trữ và email.
---

Cấu hình Studio nằm trong `config.yml` ở thư mục triển khai. Tệp được mount vào `/app/config.yml` trong container. Sao chép tệp mẫu từ image:

```bash
export STUDIO_IMAGE='<supplied-image-name-and-version>'
docker run --rm --entrypoint cat "$STUDIO_IMAGE" /app/config.example.yml > config.yml
```

Hợp nhất các mục cần dùng vào tệp mẫu lấy từ image và giữ mỗi khóa cấp cao nhất xuất hiện một lần. Thay thông tin xác thực minh họa và giới hạn quyền truy cập tệp cấu hình.

Biến môi trường chỉ ghi đè các trường mà ứng dụng hỗ trợ tường minh. Truyền biến trong `.env` của Compose qua `environment` hoặc `env_file`. `config.yml` đọc `${NAME}` dưới dạng chuỗi nguyên văn. Sau khi chỉnh sửa, chạy `docker compose up -d --force-recreate studio` để container nạp cả thay đổi trong tệp đã mount.

<a id="file-uploads-and-release-artifacts"></a>

## Tệp tải lên và gói phát hành

| Nội dung | Cấu hình | Vị trí mặc định |
| --- | --- | --- |
| Tệp đính kèm và các tệp tải lên khác | `drive.default` chọn một ổ trong `drive.disks` | `/app/storage` |
| Gói phát hành do CI hoặc agent tải lên | `releases.artifact` | `/app/storage/releases/artifacts` |

Lưu trữ cục bộ dùng được ngay. Đặt `/app/storage` trên vùng lưu trữ bền vững. Khi đổi ổ mặc định cho tệp, cấu hình lưu gói phát hành vẫn được quản lý riêng.

Lưu trữ tệp hỗ trợ `fs` và `s3`. Xem [Lưu trữ tệp và gói đầu ra](storage.md) về cấu hình driver, gói phát hành và chuyển dữ liệu.

<a id="invitation-and-password-reset-email"></a>

## Email mời và đặt lại mật khẩu

Lời mời và đặt lại mật khẩu dùng chung `mailers.default`. Khai báo dịch vụ trong `mailers` với `provider: smtp` hoặc `provider: resend`. Khôi phục mật khẩu còn cần đăng nhập bằng mật khẩu, `auth.passwordReset.enabled: true` và `APP_PUBLIC_ORIGIN` chính xác.

Xem [Email mời](../admin/notifications.md#invitation-email) để tra ví dụ cấu hình và cách kiểm tra thư đến.

<a id="environment-variables"></a>

## Biến môi trường

| Biến | Giá trị thiết lập |
| --- | --- |
| `APP_PUBLIC_ORIGIN` | Địa chỉ trình duyệt dùng để truy cập Studio, bỏ phần đường dẫn, chẳng hạn `https://studio.example.com`. Callback của nền tảng mã, liên kết trong email và thông báo đẩy đều dùng địa chỉ này |
| `SECRETS_KEYS` | Khóa mã hóa dạng `1:<key>`. Tạo bằng `openssl rand -hex 32`. Thông tin xác thực đã mã hóa và khóa API phụ thuộc khóa này. Phiên đăng nhập cũng được dẫn xuất từ khóa |
| `INITIAL_ADMIN_USERNAME`, `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD` | Quản trị viên ban đầu, chỉ được tạo trong lần khởi động đầu khi chưa có tài khoản. Tài khoản hiện có giữ nguyên khi các biến đổi giá trị |
| `DB_DIALECT`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, `DB_SSL` | Kết nối cơ sở dữ liệu |
| `WEB_PUSH_PRIVATE_KEY` | Khóa riêng thông báo đẩy. Xem [Thông báo và thông báo đẩy](../admin/notifications.md) |
| `MAILERS_DEFAULT` | Tên dịch vụ mặc định, chẳng hạn `system` |
| `MAILERS_SYSTEM_PROVIDER` | Giá trị `smtp` hoặc `resend` cho `mailers.system.provider` |
| `MAILERS_SYSTEM_HOST`, `MAILERS_SYSTEM_PORT`, `MAILERS_SYSTEM_SECURE` | Host SMTP, cổng dạng số nguyên và cờ TLS (`true` hoặc `false`) |
| `MAILERS_SYSTEM_USER`, `MAILERS_SYSTEM_PASSWORD` | Tên người dùng và mật khẩu SMTP |
| `MAILERS_SYSTEM_API_KEY` | Khóa API Resend |
| `MAILERS_SYSTEM_FROM`, `MAILERS_SYSTEM_REPLY_TO` | Địa chỉ người gửi và địa chỉ nhận phản hồi |
| `MAILERS_SYSTEM_ENABLED` | Bật hoặc tắt dịch vụ (`true` hoặc `false`) |
| `API_BODY_LIMIT`, `API_TIMEOUT` | Kích thước thân yêu cầu tối đa và thời gian chờ xử lý yêu cầu API |

Studio được phục vụ dưới `/main`, chẳng hạn `https://studio.example.com/main/`. Khi thêm môi trường chạy hoặc đăng nhập bằng `nb-studio`, dùng địa chỉ đầy đủ gồm `/main`.

> [!WARNING] Khóa mã hóa
> Giữ nguyên `SECRETS_KEYS` sau khi triển khai. Đổi khóa sẽ đăng xuất mọi người. Nếu mất khóa, không thể giải mã thông tin xác thực đã lưu. Để thay khóa, đặt khóa mới có số phiên bản cao hơn lên trước (`2:<new key>,1:<old key>`), mã hóa lại rồi mới bỏ khóa cũ.

<a id="main-configyml-settings"></a>

## Cài đặt chính trong config.yml

| Cài đặt | Giá trị thiết lập |
| --- | --- |
| `i18n.defaultLocale` | Ngôn ngữ giao diện. Mặc định là tiếng Anh. Đặt trường này khi dùng ngôn ngữ khác |
| `auth.emailAndPassword.disableSignUp` | Đặt `true` để tắt tự đăng ký và chỉ cho thành viên tham gia qua lời mời. Thêm trường này vào tệp vì template chưa khai báo |
| `mailers` | Các dịch vụ SMTP hoặc Resend đặt tên. `default` chọn cấu hình gửi dùng chung |
| `auth.passwordReset.enabled` | Bật khôi phục mật khẩu. Cần đăng nhập bằng mật khẩu, dịch vụ gửi thư đã cấu hình và địa chỉ công khai |
| `auth.email.mailer` | Tên dịch vụ gửi thư đặt lại mật khẩu. Mặc định là `mailers.default` |
| `users.invitations.mailer` | Tên dịch vụ gửi lời mời. Mặc định là `mailers.default` |
| `notification.channels` | Kênh trong ứng dụng dùng `type: in-app`. Kênh email dùng `type: email` và có thể chọn tên `mailer`. Nếu bỏ tên, kênh dùng `mailers.default`. Khai báo từng kênh ngoài cấu hình dịch vụ gửi thư |
| `push` | Cấu hình thông báo đẩy gồm `privateKey` và `contact` |
| `database` | Kết nối cơ sở dữ liệu, có thể bị biến môi trường ghi đè |
| `users.initialAdmin` | Quản trị viên ban đầu, có thể bị biến môi trường ghi đè |
| `secrets.keys` | Khóa mã hóa, có thể bị `SECRETS_KEYS` ghi đè |
| `logging` | Mức log, số ngày lưu và dung lượng log giữ lại |
| `studio.git.apiBaseUrls` | Địa chỉ API của GitHub Enterprise hoặc GitLab tự lưu trữ khi khác địa chỉ mặc định |
| `studio.agents.queuedExpiryHours` | Số giờ công việc chờ môi trường chạy trước khi thất bại. Mặc định là 24. Đặt 0 để chờ vô thời hạn |
| `agents.runs.retentionDays` | Số ngày giữ bản ghi hội thoại và prompt của lượt chạy đã kết thúc. Mặc định là 14 |
| `drive` | Lưu trữ tệp, mặc định là thư mục `storage` cục bộ. Cũng hỗ trợ lưu trữ đối tượng tương thích S3 |
| `releases.artifact` | Lưu trữ gói phát hành, cấu hình riêng với ổ tệp mặc định |
| `studio.testing.enabled` | Hiện menu quản lý chất lượng. Cũng có thể dùng `STUDIO_TESTING_ENABLED=true` |

<a id="run-multiple-instances"></a>

## Chạy nhiều bản Studio

Một bản Studio chạy độc lập có thể hoạt động mà không cần Redis. Khi chạy nhiều bản, chuyển cả `realtime` (tin nhắn trực tiếp) và `jobs` (tác vụ theo lịch) sang Redis. Mọi bản Studio phải dùng cùng namespace. Bật lưu trữ bền vững trong Redis và đặt `maxmemory-policy noeviction` để tránh mất tác vụ theo lịch.

<a id="release-management"></a>

## Quản lý phát hành

| Cài đặt | Giá trị thiết lập |
| --- | --- |
| `releases.docker` | Bật chế độ Docker bằng `enabled: true`, đồng thời đặt địa chỉ truy cập và cổng cho các ứng dụng Docker. Xem [Môi trường triển khai](../admin/environments.md) |
| `releases.host.launchPrefix` | Chạy bản xem trước bằng tài khoản hệ điều hành riêng, không có quyền đọc cấu hình Studio |
| `studio.releases.previewPublicUrl` | Dùng tên miền riêng cho bản xem trước, chẳng hạn `https://studio-preview.example.com/{appId}/` |
| `studio.releases.previewEnvironment` | Đặt `false` để bỏ qua việc tạo môi trường xem trước khi cài đặt |

Khi dùng cho cả nhóm, dành tên miền riêng cho bản xem trước và chạy chúng bằng tài khoản hệ điều hành riêng. Bản xem trước chạy mã chưa được hợp nhất, nên giới hạn quyền đọc cấu hình và bí mật của Studio.
