---
title: Email
description: Kết nối hộp thư cá nhân, đồng bộ thư và xây dựng luồng làm việc với email.
---

## Năng lực

`@nocobase/app-plugin-mail` quản lý các hộp thư do người dùng kết nối, từ cấp quyền, đồng bộ, đọc, soạn và gửi thư đến bản nháp, tệp đính kèm và lịch sử gửi. Dùng Mail để đọc hộp thư cá nhân hoặc gửi qua tài khoản đã kết nối. Email thông báo hệ thống đi qua [Nhà cung cấp thông báo](providers.md).

Ứng dụng gắn trang tài khoản cá nhân và trang làm việc với thư.

## Tình huống và ví dụ

### Trao đổi với khách hàng

1. Kết nối tài khoản và chọn ngày bắt đầu đồng bộ.
2. Đợi thư liên quan được đồng bộ.
3. Gọi `MailClient.listMessages({ participant: 'alice@example.com' })`. Dùng `participant: '@example.com'` để khớp chính xác tên miền.
4. Hiển thị kết quả và cho người dùng chọn danh tính được phép gửi khi soạn thư.

`participant` khớp địa chỉ thực tế trong From, To và Cc. Khớp tên miền chỉ lấy đúng miền đó, bỏ qua miền con. Truy vấn vẫn tuân theo quyền hộp thư và chỉ xét thư đã đồng bộ. Dùng `q` riêng để tìm gần đúng theo từ khóa.

**Prompt phát triển** cho Coding Agent trong thư mục ứng dụng.

```text
Dùng Mail để hiển thị thư trao đổi với khách hàng trong hộp thư của người dùng hiện tại.
Ghép cấu hình Mail, tích hợp trang kết nối tài khoản cá nhân và trang làm việc,
giữ các bước kiểm tra quyền. Truy vấn thư đã đồng bộ theo địa chỉ chính xác của
khách hàng và xử lý trạng thái tải cùng lỗi. Cho phép chọn danh tính gửi và liên
kết bản ghi nghiệp vụ với đúng ID lượt gửi. Dùng hộp thư thử để kiểm tra đồng bộ,
gửi, nhận và cách ly hộp thư. Nếu kết quả gửi chưa rõ, tra lượt gửi cụ thể trước
khi thử lại.
```

**Xong khi** trang chi tiết khách hàng hiển thị thư đã đồng bộ của người dùng, bản ghi nghiệp vụ liên kết đúng lượt gửi và hộp thư của người khác vẫn được bảo vệ.

## Nguyên tắc và triển khai

Áp dụng theo cấu trúc tệp thực tế của ứng dụng.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Kết quả |
| --- | --- | --- |
| Cấu hình Mail và điểm tổng hợp của ứng dụng | Ghép `mailConfig` và các nhà cung cấp có tên | Cấp quyền và đồng bộ qua dịch vụ đã cấu hình |
| Route Client và trang hộp thư | Ghép `MailAccountsPage` và `MailWorkspacePage` | Người dùng kết nối hộp thư cá nhân và mở trang làm việc |
| Chi tiết khách hàng và callback gửi | Truy vấn `participant` và giữ ID lượt gửi | Hiển thị thư được phép và truy vết kết quả gửi |

### Cấu hình

Đăng ký cả hai runtime và áp dụng migration. Ghép cấu hình Mail tường minh vì đăng ký plugin chỉ nối điểm vào runtime.

```ts
// server/config/mail.ts
import { mailConfig } from '@nocobase/app-plugin-mail/server';
export default mailConfig;
```

Thêm factory dưới khóa `mail` trong `defaultAppConfigs()` và cập nhật kiểu cấu hình. Khai báo từng nhà cung cấp trong `mail.providers`. Gmail, Microsoft 365 và IMAP/SMTP tích hợp sẵn vẫn cần cấu hình ở dịch vụ ngoài.

Giữ thông tin xác thực trong cấu hình riêng phía server. Cấu hình callback OAuth cho nhà cung cấp và đặt `mail.oauthReturnUrl` tới trang tài khoản cá nhân. Giá trị mặc định là gốc ứng dụng.

### Ghép giao diện

Ứng dụng tự đăng ký các trang Mail. Điểm vào `/client` cung cấp:

- `MailAccountsPage` để quản lý kết nối cá nhân.
- `MailWorkspacePage` với `accountsHref` trỏ tới trang quản lý tài khoản.
- `MailClient` và `mailClientToken` để gọi `/api/mail`.
- `/client/components` cho trình soạn, danh sách, hội thoại, nhãn và chữ ký.

Trang tài khoản cá nhân cần xác thực và `page:mail.workspace/access`. Mỗi người dùng cấp quyền cho hộp thư của mình qua trang này.

## Ràng buộc phát triển với AI và kiểm chứng

- Giữ kiểm tra quyền hộp thư và cấp quyền cá nhân kể cả khi có trang tổng quan quản trị.
- Tách khớp địa chỉ hoặc tên miền chính xác khỏi tìm gần đúng bằng `q`. Hiển thị kết quả trong phạm vi thư đã đồng bộ.
- Kiểm tra đường dẫn trả về OAuth, ranh giới đồng bộ và trạng thái gửi. Tra lượt gửi cụ thể trước khi thử lại kết quả chưa xác định.

### Kiểm chứng và mở rộng

Kiểm tra callback, đồng bộ, đọc, gửi, bản nháp và tệp đính kèm. Phân biệt đã gửi yêu cầu, lỗi và kết quả chưa xác định. Liên kết bản ghi nghiệp vụ với đúng ID lượt gửi mà trình soạn trả về.

Tích hợp server dùng `mailServiceToken`. Đăng ký nhà cung cấp tùy chỉnh qua `mailProviderRegistryToken`. Chỉ hiển thị tính năng nhà cung cấp hỗ trợ. Khi nâng cấp dữ liệu hiện có, rà yêu cầu migration. Index người tham gia và migration vị trí IMAP có thể cần cửa sổ bảo trì ngoại tuyến.

Xem [Nhà cung cấp thông báo](providers.md), [Xác thực](../authentication/sign-in.md) và [Quản lý plugin](../../developing-apps/manage-plugins.md).

Yêu cầu Agent báo thay đổi, bước kiểm tra đã chạy và mục chưa xác minh. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md).

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-mail)
