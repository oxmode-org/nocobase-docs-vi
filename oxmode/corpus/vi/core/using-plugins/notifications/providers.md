---
title: Nhà cung cấp thông báo
description: Cấu hình các kênh thông báo SMTP, Resend, Feishu và DingTalk.
---

## Năng lực

`@nocobase/app-plugin-notification-providers` bổ sung SMTP, Resend, Feishu và DingTalk cho [Thông báo](notification.md). Plugin chỉ cung cấp điểm vào Server. Cấu hình kênh ở server. Tính năng hộp thư cá nhân thuộc plugin Email.

### Loại kênh

| `type` | Công dụng | Thông điệp |
| --- | --- | --- |
| `smtp` | Email SMTP | Người nhận, tiêu đề và nội dung văn bản hoặc HTML |
| `resend` | Email Resend | Người nhận, tiêu đề và nội dung văn bản hoặc HTML |
| `feishu-webhook` | Bot Feishu | Văn bản và URL đích HTTP(S) đầy đủ nếu cần |
| `dingtalk-webhook` | Bot DingTalk | Văn bản và URL đích HTTP(S) đầy đủ nếu cần |

Nhiều kênh có thể dùng cùng một loại và có thông tin xác thực riêng. Ưu tiên `type`. Nếu vẫn khai báo bí danh cũ `provider`, đặt hai giá trị giống nhau.

## Tình huống và ví dụ

### Tách email nghiệp vụ khỏi cảnh báo vận hành

Cấu hình `system-email` và `ops-feishu`, rồi truyền thông điệp đầy đủ theo các tên đó trong `notification.send()`.

Kênh email nhận một địa chỉ hoặc mảng địa chỉ. Mã nghiệp vụ chuyển ID người dùng thành địa chỉ trước khi gửi. Với webhook, bỏ `to` vì cấu hình chọn đích. Feishu và DingTalk yêu cầu host webhook HTTPS chính thức và từ chối chuyển hướng.

**Prompt phát triển** cho Coding Agent trong thư mục ứng dụng.

```text
Dùng Notification Providers để tách email nghiệp vụ khỏi cảnh báo Feishu.
Cấu hình system-email và ops-feishu bằng thông tin xác thực riêng ở server
và ánh xạ biến môi trường tường minh. Truyền người nhận email. Để cấu hình
webhook chọn đích bot và bỏ to. Kiểm tra gửi thành công và lỗi bằng người
nhận thử cùng nhóm thử. Giữ phạm vi ở thông báo hệ thống.
```

**Xong khi** email thử và cảnh báo tới đúng hai đích riêng, đồng thời lỗi xác thực hiển thị trong nhật ký.

## Nguyên tắc và triển khai

Áp dụng theo cấu trúc tệp thực tế của ứng dụng.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Thay đổi giao diện và hành vi |
| --- | --- | --- |
| Plugin Server và cấu hình thông báo | Đăng ký nhà cung cấp và các kênh có tên | Bật phương thức gửi ở server |
| Factory cấu hình và biến môi trường riêng | Ánh xạ thông tin xác thực SMTP hoặc webhook tường minh | Biến môi trường đi tới đúng đường dẫn cấu hình |
| Tạo thông điệp nghiệp vụ | Dựng payload email hoặc bot theo kênh | Mỗi thông điệp tới đúng đích |

### Cấu hình kênh

Đăng ký sau plugin thông báo phía Server và thêm các kênh có tên.

```yaml
notification:
  channels:
    system-email:
      type: smtp
      host: smtp.example.com
      port: 587
      from: notifications@example.com
```

Ví dụ minh họa cấu trúc. Cấp thông tin xác thực thật qua cấu hình riêng phía server. Dùng ánh xạ biến môi trường vì YAML giữ nguyên chuỗi dạng `${...}`. `defineMailChannelsConfig` của template ánh xạ `SMTP_PASSWORD` tới `channels.system-email.auth.pass`. Với tên kênh hoặc đường dẫn khác, khai báo ánh xạ tương ứng.

## Ràng buộc phát triển với AI và kiểm chứng

- Phân biệt tên kênh với loại kênh. Ánh xạ biến môi trường tường minh để điền thông tin xác thực.
- Giữ kiểm tra host webhook chính thức và quy tắc từ chối chuyển hướng.
- Kiểm tra lỗi xác thực, định dạng người nhận và nhật ký bằng đích thử có kiểm soát.

### Kiểm chứng và mở rộng

Gửi qua luồng nghiệp vụ hoặc lời gọi server tin cậy rồi xem [nhật ký thông báo](notification.md) để xác nhận kết quả gửi.

Dùng `ChannelInstance` và `registry.registerChannelType()` cho phương thức gửi bổ sung. [Thông báo trong ứng dụng](in-app.md) và [Web Push](web-push.md) đến từ plugin riêng. Dùng [Email](mail.md) để kết nối hộp thư cá nhân.

Yêu cầu Agent báo thay đổi, bước kiểm tra đã chạy và mục chưa xác minh. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md).

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-notification-providers)
