---
title: Thông báo trong ứng dụng
description: Gửi thông báo trong ứng dụng và tích hợp hộp thư, số chưa đọc cùng cơ chế làm mới.
---

## Năng lực

`@nocobase/app-plugin-notification-in-app` cung cấp kênh `in-app` và hộp thư riêng của từng người dùng, gồm số thông báo chưa đọc, đánh dấu đã đọc hoặc chưa đọc, đánh dấu tất cả đã đọc và xóa.

Plugin lưu hộp thư và nhận thông báo gửi đến. Ứng dụng tổ chức điều hướng và các trang.

## Tình huống và ví dụ

### Hộp thư ở phần đầu trang

Trong `QueryClientProvider` của ứng dụng, dùng `useInboxUnreadCount()`, `useInboxItems()`, `useInboxActions()` và `useInboxRefresh()`. Xử lý trường hợp cập nhật thất bại. Sự kiện thời gian thực, kết nối lại và cửa sổ nhận focus đều kích hoạt làm mới. Dùng kết quả HTTP làm nguồn chính thức.

Đích như `{ type: 'route', path: '/orders/123' }` dùng đường dẫn tương đối với ứng dụng. Router thêm tiền tố triển khai. Liên kết ngoài dùng `{ type: 'url', url: 'https://example.com/...' }`.

**Prompt phát triển** cho Coding Agent trong thư mục ứng dụng.

```text
Dùng In-app Notifications để thêm số chưa đọc và hộp thư ở đầu trang.
Dùng lại component hoặc hook công khai để phân trang, đánh dấu đã đọc, làm mới
theo sự kiện và xử lý lỗi. Gửi thông báo đơn hàng tới ID người dùng thật
và dùng đích route tương đối với ứng dụng. Kiểm tra hai người dùng chỉ thấy
hộp thư của mình, số chưa đọc cập nhật, làm mới khi kết nối lại và từ chối
truy cập sau đăng xuất.
```

**Xong khi** chỉ người nhận thấy thông báo, còn việc đánh dấu đã đọc cập nhật bộ đếm và được giữ khi mở lại.

## Nguyên tắc và triển khai

Áp dụng theo cấu trúc tệp thực tế của ứng dụng.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Kết quả |
| --- | --- | --- |
| Cấu hình kênh thông báo | Cấu hình kênh hộp thư `in-app` | Thông báo nghiệp vụ được lưu vào hộp thư |
| Đầu trang và trang hộp thư | Tích hợp component hoặc hook trong ngữ cảnh truy vấn hiện có | Hiện số chưa đọc, thông báo và thao tác đọc |
| Thông báo nghiệp vụ và liên kết | Đặt người nhận và đích tương đối với ứng dụng | Bấm thông báo sẽ mở đúng trang |

### Tích hợp

Để gửi thông báo, đăng ký plugin Server sau Notifications, áp dụng migration và cấu hình:

```yaml
notification:
  channels:
    inbox:
      type: in-app
```

Plugin Client nạp tài nguyên ngôn ngữ. Ứng dụng tự ghép `NotificationInAppProvider` và `NotificationInAppInbox` từ `/client` hoặc dựng giao diện riêng bằng hook từ `/client/inbox`.

### Gửi và đọc

Gửi `messages.inbox` qua [Thông báo](notification.md) với `to`, `title` và `body`. Chỉ định ID người dùng thật hoặc mảng ID có ít nhất một phần tử.

| Thao tác | Endpoint |
| --- | --- |
| Liệt kê | `GET /api/notificationInApp/messages` |
| Đếm chưa đọc | `GET /api/notificationInApp/messages/unreadCount` |
| Đánh dấu tất cả đã đọc | `POST /api/notificationInApp/messages/markAllRead` |
| Đánh dấu một thông báo | `POST /api/notificationInApp/messages/:id/markRead` hoặc `/markUnread` |
| Xóa một thông báo | `DELETE /api/notificationInApp/messages/:id` |

Mọi yêu cầu dùng danh tính đã đăng nhập. Nếu ID thuộc thông báo của người dùng khác, API trả kết quả không tìm thấy. Dùng `pageToken` để phân trang và `unreadOnly=true` nếu chỉ cần thông báo chưa đọc.

## Ràng buộc phát triển với AI và kiểm chứng

- Xác định hộp thư từ danh tính đã xác thực. Giữ truy vấn trong phạm vi người dùng hiện tại.
- Dùng sự kiện thời gian thực để kích hoạt làm mới và kết quả HTTP làm nguồn chính thức. Khôi phục trạng thái đọc đúng khi cập nhật thất bại.
- Kiểm tra phân trang, làm mới nhiều lần, truy cập chéo người dùng và đăng xuất. Để Router tự thêm `/main` cho route nội bộ.

### Phạm vi

Hộp thư và API vẫn có thể hoạt động khi thiếu plugin Notifications phía Server. Đăng ký plugin đó nếu cần kênh gửi. Để hiện thông báo trên hệ điều hành, dùng [Web Push](web-push.md).

Kiểm tra cách ly người dùng, số chưa đọc, phân trang và quyền truy cập sau đăng xuất. Mỗi người nhận có kết quả gửi và thử lại riêng. ID người dùng không tồn tại sẽ không qua bước kiểm tra người nhận.

Yêu cầu Agent báo thay đổi, bước kiểm tra đã chạy và mục chưa xác minh. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md).

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-notification-in-app)
