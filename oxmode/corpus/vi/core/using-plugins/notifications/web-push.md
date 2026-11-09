---
title: Web Push
description: Cấu hình đăng ký trình duyệt, tùy chọn thiết bị và gửi thông báo Web Push.
---

## Năng lực

`@nocobase/app-plugin-notification-web-push` gửi thông báo đến thiết bị trình duyệt và cung cấp cấu hình VAPID, đăng ký, Service Worker cùng giao diện tùy chọn có thể dùng lại. [Thông báo](notification.md) phụ trách điều phối gửi và thử lại.

Ứng dụng cung cấp trang cài đặt, manifest cài đặt và sự kiện nghiệp vụ kích hoạt thông báo.

## Tình huống và ví dụ

### Nhắc xử lý đơn hàng

Tra thiết bị qua `webPushServiceToken.subscriptions.forUser(userId)` rồi gửi thông điệp:

```ts
messages: {
  webPush: {
    to: [{ id: deviceId, userId }],
    title: 'Order needs attention',
    body: 'Open the order for details.',
    url: '/main/orders/123',
    dedupeKey: 'order:123:pending',
  },
}
```

Đây là một phần của `notification.send()`. Dùng ID thiết bị và người dùng thật. URL Web Push cần bao gồm tiền tố công khai của ứng dụng và nằm trong phạm vi đường dẫn đó. Đích route trong hộp thư được Router thêm tiền tố riêng.

**Prompt phát triển** cho Coding Agent trong thư mục ứng dụng.

```text
Dùng Web Push để thêm tùy chọn thiết bị sau đăng nhập và nhắc xử lý đơn hàng.
Dùng lại PushPreferences. Lưu bền vững khóa VAPID và khóa mã hóa. Phục vụ
worker dưới tiền tố ứng dụng. Tra thiết bị theo người dùng, thêm tiền tố
vào URL đích và xử lý lỗi hủy đăng ký khi đăng xuất. Kiểm tra đăng ký,
tạm dừng, hết hạn, từ chối và việc hiện thông báo trên thiết bị thử.
Báo môi trường chưa thể kiểm chứng.
```

**Xong khi** thiết bị thử đã đăng ký hiển thị lời nhắc và mở đúng đơn hàng, còn thiết bị tạm dừng ngừng nhận thông báo.

## Nguyên tắc và triển khai

Áp dụng theo cấu trúc tệp thực tế của ứng dụng.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Kết quả |
| --- | --- | --- |
| Cấu hình Push và kênh thông báo | Ghép `pushConfig`, khóa bền vững và kênh `web-push` | Bật đăng ký trình duyệt |
| Cài đặt cá nhân và đăng xuất | Tích hợp `PushPreferences` và `unsubscribeDevice` | Quản lý thiết bị và liên kết tài khoản |
| Thông báo đơn hàng | Dùng thông tin tóm tắt thiết bị và URL nội bộ có tiền tố | Thông báo hệ thống mở đúng đơn hàng |

### Tích hợp

1. Đăng ký plugin Server sau Authentication, Authorization và Notifications, đăng ký Client rồi áp dụng migration.
2. Ghép `pushConfig` từ `/server` vào phần cấu hình `push` của ứng dụng.
3. Đặt bền vững `push.privateKey` hoặc `WEB_PUSH_PRIVATE_KEY`, `push.contact` hoặc `WEB_PUSH_CONTACT`, cùng `SECRETS_KEYS` để mã hóa đăng ký.
4. Cấu hình `notification.channels.webPush: { type: 'web-push' }`.
5. Gắn `PushPreferences` từ `/client` trong trang có xác thực, với ngữ cảnh API, ngôn ngữ, toast và truy vấn của host.

Dùng HTTPS ở production. Có thể phát triển trên localhost. Khi tạo lại khóa VAPID, trình duyệt phải đăng ký lại. Worker được phục vụ tại `/push-worker.js` dưới đường dẫn gắn ứng dụng.

### Tùy chọn thiết bị

Người dùng có thể đăng ký, tạm dừng, tiếp tục, gửi thử và gỡ thiết bị. Ứng dụng cung cấp manifest cài đặt. Trên iOS hoặc iPadOS, người dùng cần cài ứng dụng vào màn hình chính.

`/api/webPush` cung cấp `/key`, `/subscriptions` và `/subscriptions/:id/test`. Phản hồi tóm tắt các thiết bị thuộc người dùng, giữ endpoint và khóa đăng ký ở server. Tích hợp `unsubscribeDevice(api, base, userId)` vào luồng đăng xuất và xử lý lỗi trước khi hoàn tất đăng xuất.

## Ràng buộc phát triển với AI và kiểm chứng

- Dùng lại khóa VAPID qua các lần khởi động. Giữ endpoint đăng ký và khóa mã hóa ngoài phản hồi API thiết bị.
- Dùng URL nội bộ có tiền tố. `dedupeKey` thay thế thông báo đang hiển thị có cùng tag. Xử lý chống trùng sự kiện ở luồng nghiệp vụ.
- Kiểm tra thiếu quyền, thiết bị tạm dừng hoặc hết hạn và việc hiển thị thật. Xác nhận trên trình duyệt riêng với trạng thái hàng đợi.

### Kiểm chứng và phạm vi

Kiểm tra trường hợp chưa cấp quyền, chưa đăng ký hoặc tạm dừng, thiết bị hết hạn và thông báo đến trình duyệt thật. HTTP 404 hoặc 410 khiến hệ thống gỡ đăng ký không hợp lệ. Kết quả khác theo quy tắc thử lại của Notifications.

Payload quá lớn bị từ chối. Nếu cần cache ngoại tuyến hoặc điều phối lời nhắc khi ứng dụng đang mở, ứng dụng triển khai riêng.

Xem [Thông báo](notification.md), [Thông báo trong ứng dụng](in-app.md) và [Quản lý plugin](../../developing-apps/manage-plugins.md).

Yêu cầu Agent báo thay đổi, bước kiểm tra đã chạy và mục chưa xác minh. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md).

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-notification-web-push)
