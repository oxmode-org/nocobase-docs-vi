---
title: Thông báo
description: Gửi thông báo qua các kênh có tên và kiểm tra kết quả gửi.
---

## Năng lực

`@nocobase/app-plugin-notification` kiểm tra, lưu và đưa thông điệp vào hàng đợi. Plugin xử lý khóa chống trùng, thử lại có giới hạn và ghi kết quả gửi. [Nhà cung cấp thông báo](providers.md), [Thông báo trong ứng dụng](in-app.md) và [Web Push](web-push.md) cung cấp các cơ chế gửi cụ thể.

Runtime điều phối gửi. Ứng dụng xác định người nhận và sự kiện nghiệp vụ. Plugin kênh cung cấp phương thức truyền.

## Tình huống và ví dụ

### Gửi thông báo qua hai kênh

Sau khi thao tác đơn hàng thành công, chuẩn bị thông báo hộp thư trong ứng dụng và email. Hộp thư nhận ID người dùng, còn email nhận địa chỉ email. Mã nghiệp vụ xác định hai danh sách này riêng. Dùng định danh sự kiện nghiệp vụ ổn định làm `idempotencyKey`.

Theo dõi kết quả gửi riêng cho từng người nhận. Khi thử lại, giữ kênh và nhà cung cấp ban đầu. Phân biệt trạng thái nhà cung cấp chấp nhận với trạng thái người nhận đã nhận hoặc đã đọc.

**Prompt phát triển** cho Coding Agent trong thư mục ứng dụng.

```text
Dùng Notifications để gửi thông báo vào hộp thư và qua email sau khi duyệt đơn hàng thành công.
Dùng các kênh đã cấu hình và tạo thông điệp đầy đủ cho từng kênh. Xác định riêng ID người dùng
và địa chỉ email. Dùng định danh sự kiện nghiệp vụ làm khóa chống trùng, giữ kết quả theo
người nhận và bảo vệ trang nhật ký. Kiểm thử sự kiện trùng, lỗi một phần và từ chối truy cập
nhật ký. Hiện riêng trạng thái hàng đợi đã nhận và người dùng đã nhận thông báo.
```

**Xong khi** có thể truy vết từng lượt gửi về sự kiện, nhận diện lỗi theo kênh và người nhận, đồng thời việc gửi lại cùng sự kiện không tạo thông báo trùng ngoài dự kiến.

## Nguyên tắc và triển khai

Áp dụng theo cấu trúc tệp thực tế của ứng dụng.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Thay đổi giao diện và hành vi |
| --- | --- | --- |
| Kênh phía server và Jobs | Đăng ký loại kênh và executor | Đưa tác vụ gửi vào hàng đợi theo kênh |
| Dịch vụ nghiệp vụ đơn hàng | Gửi sau khi nghiệp vụ thành công, kèm ID sự kiện và người nhận | Truy vết thông báo về sự kiện |
| Giao diện nhật ký và phân quyền | Đọc bản ghi gửi và các trạng thái riêng | Quản trị viên xem lỗi theo người nhận |

### Tích hợp

Đăng ký plugin Server và các plugin kênh cần dùng, áp dụng migration và Seed, rồi xác nhận executor Jobs của host đang chạy. Plugin Client cung cấp điểm tích hợp nhật ký. Ứng dụng đăng ký trang để hiển thị.

Mỗi mục trong `notification.channels` có tên và `type`. Ví dụ, `system-email` có thể là tên của kênh kiểu `smtp`. Template mặc định ghép cấu hình bằng `defineMailChannelsConfig` trong `server/config/notification.ts`.

### Gửi thông điệp

Phân giải `notificationServiceToken` từ `/server` trong mã nghiệp vụ tin cậy. Ví dụ giả định plugin thông báo trong ứng dụng đã được đăng ký và đã cấu hình `inbox: { type: 'in-app' }`.

```ts
await notification.send({
  idempotencyKey: 'order:123:approved',
  source: { type: 'order', referenceId: '123' },
  messages: {
    inbox: {
      to: 'user-123',
      title: 'Order approved',
      body: 'The order is ready for processing.',
      target: { type: 'route', path: '/orders/123' },
    },
  },
});
```

`notification` là dịch vụ đã phân giải. Thay ID bằng giá trị nghiệp vụ thực tế. Mỗi khóa trong `messages` là tên kênh đã cấu hình và nhận một thông điệp đầy đủ theo hợp đồng của kênh đó.

## Ràng buộc phát triển với AI và kiểm chứng

- Theo dõi thành công nghiệp vụ và kết quả gửi riêng. Giữ định danh sự kiện ổn định khi thử lại.
- Kiểm tra payload theo từng kênh. Chuyển ID người dùng thành địa chỉ email trong mã nghiệp vụ nếu cần.
- Kiểm thử lỗi một phần và quyền truy cập nhật ký. Với thông tin xác thực dùng một lần, thiết kế quy trình riêng để xử lý lỗi gửi.

### Nhật ký và thông điệp nhạy cảm

`/api/notifications/logs` yêu cầu `page:notification.logs/access`. Bảo vệ trang nhật ký và dùng ID thông báo được trả về khi gửi để tra cứu. Kiểm soát quyền ở bất kỳ endpoint gửi thông báo nào.

Dùng `sendTransient({ channel, message })` cho thông tin xác thực dùng một lần. Lệnh thử gửi một lần, bỏ qua snapshot thông báo, Jobs, chống trùng bền vững và thử lại. Khi hết thời gian chờ, trạng thái gửi có thể chưa xác định. Luồng nghiệp vụ chịu trách nhiệm khôi phục.

Kiểm tra kết quả theo người nhận, sự kiện trùng, lỗi kênh và quyền truy cập nhật ký. Xem [Nhà cung cấp thông báo](providers.md), [Thông báo trong ứng dụng](in-app.md) và [Web Push](web-push.md).

Yêu cầu Agent báo thay đổi, bước kiểm tra đã chạy và mục chưa xác minh. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md).

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-notification)
