---
title: Thông điệp thời gian thực và đăng ký topic
---

`@nocobase/realtime` báo cho các trang đã đăng ký rằng dữ liệu nghiệp vụ cần được tải lại. Ứng dụng thường dùng chung `realtimeServiceToken` từ `@nocobase/app-server/realtime`. Component dùng lại kết nối của runtime client.

## Tích hợp ứng dụng và plugin

Trong `boot()` của Provider phía server, truyền `app.container` để khai báo topic do mô-đun này quản lý.

```ts
import { realtimeServiceToken } from '@nocobase/app-server/realtime';
import type { ServiceResolver } from '@nocobase/service-provider';

export function registerOrderInbox(container: ServiceResolver) {
  const realtime = container.resolve(realtimeServiceToken);
  return realtime.defineTopic<{ changed: true }, 'user'>(
    'orders:inbox',
    { audience: 'user' },
  );
}
```

Giữ đối tượng topic và gọi `inbox.publishFor(userId, { changed: true })` sau khi thay đổi nghiệp vụ đã commit. Lấy `userId` từ danh sách người nhận đã được server cho phép. Trong quá trình tắt Provider, gọi `inbox.close()` để giải phóng topic do Provider sở hữu. Host khởi động và đóng dịch vụ cùng lớp truyền tải dùng chung.

Ứng dụng và plugin dùng cùng cách tích hợp và cần đặt tên topic riêng để tránh xung đột. Trang và component phía client đăng ký nhận từ topic đã khai báo ở server.

## Khai báo topic

Ví dụ độc lập minh họa khai báo, phát thông điệp và dọn dẹp. Trong ứng dụng, khai báo topic ở `boot()` của Provider và để host quản lý kết nối.

```ts
import { createRealtimeService } from '@nocobase/realtime/server';

const realtime = createRealtimeService({ namespace: 'orders-demo' });
const inbox = realtime.defineTopic<{ changed: true }, 'user'>(
  'orders:inbox',
  { audience: 'user' },
);
await realtime.setup();
try {
  await inbox.publishFor('user-1', { changed: true });
} finally {
  inbox.close();
  await realtime.close();
}
```

Đối tượng nhận `user` nhắm đến người dùng cụ thể. Danh tính đăng ký lấy từ cơ chế xác thực của kết nối. Server xác định đối tượng nhận theo danh tính đó. Topic `public` cho phép nhiều người cùng đăng ký và có thể yêu cầu đăng nhập với `authenticated: true`. Kiểm tra quyền riêng cho từng bản ghi nghiệp vụ khi cần.

Dùng `defineTopicFamily()` và `authorize()` để đăng ký theo phạm vi tài nguyên với cùng policy truy cập HTTP. Hệ thống kiểm tra quyền khi đăng ký và khi giao thông điệp, nên việc thu hồi quyền cũng áp dụng cho đăng ký cũ. Khai báo topic trước khi dùng. Hệ thống từ chối topic chưa khai báo.

## Tải lại dữ liệu trang

```tsx
import { useRealtimeRefresh } from '@nocobase/app-client';

export function OrderUpdates({
  refresh,
}: {
  refresh: (signal: AbortSignal) => Promise<void>;
}) {
  useRealtimeRefresh('orders:inbox', refresh, { delayMs: 100 });
  return null;
}
```

`refresh` đọc trạng thái hiện tại qua API có kiểm tra quyền và trả Promise. Hook lên lịch đọc khi đăng ký đã sẵn sàng và khi có thay đổi, gộp các cập nhật dồn dập và dọn dẹp khi unmount. Tắt ở trang không hoạt động bằng `enabled: false` hoặc topic null. Dùng chung kết nối từ runtime client.

Dùng `useRealtimeTopic()` để lấy sự kiện thô và trạng thái đăng ký. Ở cấp thấp, `watch()` chỉ chuyển sang `subscribed` sau khi nhận xác nhận. Khi kết nối lại và nhận xác nhận mới, `onReady` chạy lại. Kiểm tra trạng thái đăng ký của topic riêng với trạng thái mở WebSocket.

## Phạm vi giao thông điệp

Sự kiện chỉ báo cần tải lại trong thời gian thực. Khi kết nối lại, client đọc trạng thái hiện tại thay vì chờ phát lại sự kiện cũ. Gửi lượng thông tin vừa đủ để tải lại và giữ trạng thái chính thức trong cơ sở dữ liệu và API. Biên nhận phát chỉ xác nhận bước phát. Nếu phát lỗi sau commit, dữ liệu nghiệp vụ vẫn được giữ.

Broker mặc định `inMemory` chỉ hoạt động trong một instance dịch vụ. Với nhiều tiến trình, dùng Redis Pub/Sub và namespace chung. Broker bộ nhớ hoạt động độc lập kể cả khi dùng cùng namespace. Vẫn phát sự kiện khi tiến trình hiện tại không có người đăng ký vì instance khác có thể đang có người nghe.

Payload phải là dữ liệu JSON hữu hạn và không có tham chiếu vòng. Chuyển dữ liệu về kiểu JSON trước khi gửi, chẳng hạn chuyển `Date` sang chuỗi. Kết nối và hàm thuộc runtime cục bộ. Khi đăng nhập, đăng xuất hoặc đổi danh tính, kết nối lại và xóa cache của tài khoản trước. Xem [WebSocket](websocket.md) để tích hợp lớp truyền tải.

## Giao diện và phần triển khai

- [Hợp đồng và hook Realtime](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/realtime/README.md)
- [Tích hợp WebSocket của host](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/realtime/websocket.ts)
- [Hợp đồng dịch vụ host](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/app/app-server/src/realtime/types.ts)
