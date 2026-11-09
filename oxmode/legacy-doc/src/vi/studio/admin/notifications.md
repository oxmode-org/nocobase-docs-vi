---
title: Thông báo và thông báo đẩy
description: Thiết lập email và thông báo đẩy, những thứ mà email mời, đặt lại mật khẩu và nhắc nhở khi bạn không mở trang đều phụ thuộc vào. Nhắc nhở trong ứng dụng không cần thiết lập.
---

Studio nhắc mọi người theo ba cách:

| Nhắc nhở | Cần thiết lập | Dùng cho |
| --- | --- | --- |
| Nhắc nhở trong ứng dụng | Không | Hộp thư, con số trên **My issues**, âm thanh nhắc và thông báo trên máy tính |
| Email | Một kênh email | Lời mời và đặt lại mật khẩu |
| Thông báo đẩy | HTTPS và một push key | Nhắc nhở trên điện thoại hoặc máy tính ngay cả khi không mở Studio |

Về cách thành viên bật âm thanh nhắc, thông báo trên máy tính và đăng ký thông báo đẩy trên điện thoại, xem [Hộp thư và nhắc nhở](../use/inbox.md).

## Email

Thêm một kênh email tên `system-email` trong `notification.channels` của `config.yml`. Với SMTP:

```yaml
notification:
  channels:
    inbox:
      type: in-app
    system-email:
      type: smtp
      host: smtp.example.com
      port: 587
      auth:
        user: notifications@example.com
        pass: <SMTP password>
      from: notifications@example.com
```

Bạn cũng có thể dùng Resend: `type: resend` cùng `apiKey` và `from`. Để mật khẩu không nằm trong file, hãy cung cấp qua một biến môi trường như `SMTP_PASSWORD`.

Khởi động lại Studio khi đã thiết lập xong:

- Lời mời giờ sẽ gửi email. Khi không có email, kết quả mời hiển thị **Email not sent**, và bạn có thể sao chép đường dẫn mời để tự gửi.
- Đặt lại mật khẩu: đảm bảo `auth.passwordReset` đã bật trong `config.yml` với `emailChannel` trỏ đến `system-email`, để **Forgot password?** hoạt động trên trang đăng nhập.

## Thông báo đẩy

Thông báo đẩy cần:

- Studio chạy qua HTTPS, với `APP_PUBLIC_ORIGIN` đặt thành địa chỉ công khai. Một địa chỉ `http://` trong mạng nội bộ sẽ không hoạt động.
- Một push private key giữ nguyên vĩnh viễn: private key P-256 32 byte dạng base64url hoặc 64 ký tự hex, đặt trong `push.privateKey` của `config.yml` hoặc biến môi trường `WEB_PUSH_PRIVATE_KEY`. Ghi một địa chỉ liên hệ vào `push.contact`, như `mailto:admin@example.com`.

Không có private key, thành viên không thể đăng ký thông báo đẩy.

> [!WARNING] Giữ push key vĩnh viễn
> Nếu bạn đổi push private key, mọi thiết bị đã đăng ký phải đăng ký lại. Hãy cất nó ở nơi an toàn cùng với `SECRETS_KEYS`, sao lưu chung, và không bao giờ commit vào repository.

## Các kênh khác

`notification.channels` cũng hỗ trợ các kênh như bot nhóm Feishu và DingTalk (`feishu-webhook` và `dingtalk-webhook`). Nhắc nhở của Studio hiện chỉ dùng trong ứng dụng, email và thông báo đẩy.
