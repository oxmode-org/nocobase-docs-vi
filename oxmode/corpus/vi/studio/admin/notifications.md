---
title: Thông báo và thông báo đẩy
description: Cấu hình email mời, khôi phục mật khẩu và thông báo đẩy trên thiết bị.
---

Studio nhắc người dùng theo ba cách:

| Hình thức | Cần thiết lập | Mục đích |
| --- | --- | --- |
| Lời nhắc trong ứng dụng | Dùng ngay | Hộp thư, số đếm trên **My issues**, âm thanh nhắc và thông báo trên máy tính |
| Email | Dịch vụ trong `mailers` | Gửi lời mời và đặt lại mật khẩu |
| Thông báo đẩy | HTTPS và khóa thông báo đẩy | Nhắc trên điện thoại hoặc máy tính ngay cả khi đã đóng Studio |

Xem [Hộp thư và lời nhắc](../use/inbox.md) để biết cách bật âm thanh, thông báo trên máy tính và đăng ký nhận thông báo đẩy trên điện thoại.

<a id="invitation-email"></a>

## Email mời

Lời mời và đặt lại mật khẩu dùng chung dịch vụ mặc định trong `mailers`. Hợp nhất ví dụ SMTP sau vào các mục tương ứng trong `config.yml`:

```yaml
mailers:
  default: system
  system:
    provider: smtp
    host: smtp.example.com
    port: 587
    secure: false
    auth:
      user: notifications@example.com
    from: "Studio <notifications@example.com>"
```

Cung cấp mật khẩu qua `MAILERS_SYSTEM_PASSWORD` như bên dưới. Xác thực địa chỉ người gửi với nhà cung cấp email và dùng cổng cùng thiết lập TLS theo yêu cầu của họ.

Với Resend, đặt `provider: resend` và `from` trong `mailers.system`. Bỏ các trường SMTP và truyền khóa API qua `MAILERS_SYSTEM_API_KEY` trong cả `.env` và Compose.

Lời mời dùng `mailers.default`. Để chọn dịch vụ khác đã cấu hình, đặt tên dịch vụ vào `users.invitations.mailer`. Nếu chưa cấu hình email, quản trị viên có thể sao chép và chia sẻ liên kết mời. Xem [Mời thành viên](../setup/invite.md).

<a id="password-reset-email"></a>

## Email đặt lại mật khẩu

Đặt lại mật khẩu cũng dùng `mailers.default`. Bật đăng nhập bằng mật khẩu và khôi phục mật khẩu:

```yaml
auth:
  emailAndPassword:
    enabled: true
    autoSignIn: false
    disableSignUp: true
  passwordReset:
    enabled: true
```

Đặt `APP_PUBLIC_ORIGIN`, chẳng hạn `https://studio.example.com`, để liên kết trong email mở đúng Studio. Để dùng dịch vụ khác đã cấu hình cho việc khôi phục, đặt tên dịch vụ vào `auth.email.mailer`.

<a id="pass-secrets-and-apply-configuration"></a>

## Truyền giá trị bí mật và áp dụng cấu hình

Thêm vào `.env` của bản triển khai:

```dotenv
MAILERS_SYSTEM_PASSWORD=<smtp-password>
```

Thêm các mục sau dưới `services.studio.environment` trong `docker-compose.yml`:

```yaml
MAILERS_SYSTEM_PASSWORD: ${MAILERS_SYSTEM_PASSWORD:?set MAILERS_SYSTEM_PASSWORD in .env}
```

Để truyền biến từ `.env` vào container, khai báo biến trong Compose. `config.yml` giữ `${NAME}` dưới dạng chuỗi nguyên văn.

Tạo lại container Studio sau khi thay đổi:

```bash
docker compose up -d --force-recreate studio
```

<a id="verify-delivery"></a>

## Kiểm chứng việc gửi email

1. Gửi lời mời tới hộp thư kiểm thử do mình quản lý và chưa đăng ký. Xác nhận thư đến và liên kết mở đúng Studio.
2. Đăng xuất rồi yêu cầu đặt lại mật khẩu cho một tài khoản hiện có.
3. Đặt mật khẩu mới qua liên kết trong email và xác nhận đăng nhập được.

Sau khi gửi yêu cầu, kiểm tra thư đã tới hộp thư đích. Khi gặp lỗi, kiểm tra quyền của người gửi, kết nối SMTP, thư rác và log Studio. Giữ mật khẩu và liên kết đặt lại bên ngoài log công khai.

<a id="push-notifications"></a>

## Thông báo đẩy

Để dùng thông báo đẩy, cần:

- Studio chạy qua HTTPS và `APP_PUBLIC_ORIGIN` trỏ tới địa chỉ công khai. Địa chỉ `http://` trong mạng nội bộ không đáp ứng yêu cầu này.
- Khóa riêng P-256 cố định dài 32 byte, mã hóa dưới dạng base64url hoặc 64 ký tự hệ 16. Đặt `push.privateKey` hoặc `WEB_PUSH_PRIVATE_KEY`. Đặt địa chỉ liên hệ trong `push.contact`, chẳng hạn `mailto:admin@example.com`.

Thành viên chỉ đăng ký nhận thông báo đẩy được sau khi đã cấu hình khóa riêng.

> [!WARNING] Giữ nguyên khóa thông báo đẩy
> Nếu đổi khóa riêng, mọi thiết bị đã đăng ký đều phải đăng ký lại. Lưu khóa ở nơi an toàn cùng `SECRETS_KEYS`, sao lưu chúng cùng nhau và giữ bên ngoài kho mã.

![Tùy chọn thông báo của thành viên](https://static-docs.nocobase.com/studio-en-guide-preferences-20261031.png)
