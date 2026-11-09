---
title: Hàng đợi thông điệp
---

`@nocobase/queue` cung cấp cơ chế gửi và tiêu thụ thông điệp. Bắt đầu với [Jobs](jobs.md) cho phần lớn công việc nền. Dùng hàng đợi trực tiếp khi cần kênh, trì hoãn, ưu tiên, xử lý theo lô hoặc giới hạn tần suất.

## Dịch vụ của host

Phân giải `queueServiceToken` từ `@nocobase/app-server/queue` để dùng chung kết nối và vòng đời. `producer(name)` và `consumer(name)` cùng trỏ tới một hàng đợi. Kênh phân biệt mục đích của từng thông điệp.

```ts
import { queueServiceToken } from '@nocobase/app-server/queue';
import { withChannel } from '@nocobase/queue';
import type { ServiceResolver } from '@nocobase/service-provider';

export function consumeOrderRefresh(
  container: ServiceResolver,
  refresh: (message: unknown, signal: AbortSignal) => Promise<void>,
) {
  const queue = container.resolve(queueServiceToken);
  return queue.consumer('orders').consume(
    withChannel('refresh', async (_channel, message, signal) => {
      await refresh(message, signal);
    }),
  );
}

export async function requestOrderRefresh(container: ServiceResolver, orderId: string) {
  const queue = container.resolve(queueServiceToken);
  return queue.producer('orders').publish('refresh', { orderId });
}
```

Lớp nghiệp vụ cung cấp `refresh` và kiểm tra payload. Đăng ký consumer trong `boot()` của Provider. Queue Provider của host bắt đầu tiêu thụ trong `start()`. Gửi thông điệp sau khi khởi động hoàn tất. Giữ hàm hủy đăng ký trả về từ `consume()` và đợi nó hoàn tất trước khi giải phóng dependency nghiệp vụ.

Ứng dụng và plugin có thể truyền `app.container` cho cả hai hàm. Đặt tên hàng đợi theo mô-đun nghiệp vụ hoặc plugin sở hữu nó và dùng cùng quy ước ở bên gửi và bên nhận. Ứng dụng cấu hình kết nối, adapter và namespace. Khi tắt, plugin hủy đăng ký consumer của mình, còn dịch vụ Queue dùng chung tiếp tục do host quản lý.

Dùng Jobs cho lớp job, tiến độ và quy tắc định kỳ. Dùng [Giao tiếp thời gian thực](../realtime/topics.md) để trang đăng ký nhận cập nhật. Hàng đợi phân công thông điệp cho worker. Cơ chế phát cho nhiều trang thuộc lớp Realtime.

## Hành vi giao thông điệp

Các handler trong cùng tiến trình chạy đồng thời khi tiến trình nhận một thông điệp. Bất kỳ lỗi nào cũng có thể khiến toàn bộ thông điệp được thử lại, kể cả handler đã thành công. Các tiến trình khác nhau cạnh tranh để nhận thông điệp.

`withChannel()` lọc theo kênh. Kiểm tra payload riêng trong handler. Biên nhận `publish()` xác nhận hàng đợi đã nhận thông điệp. Theo dõi kết quả xử lý qua cơ chế riêng. ID job tùy chỉnh chống trùng trong thời gian job còn trong hàng đợi. Giữ khóa idempotency nghiệp vụ nếu cần chống trùng lâu hơn.

## Cấu hình và độ bền

Adapter hàng đợi có tên `inMemory` và `redis`. Jobs gọi adapter bộ nhớ là `memory`. Cấu hình bao gồm mặc định, kết nối, namespace, mức đồng thời, số lần thử lại, thời gian chờ tăng dần và giới hạn tần suất. Hàng đợi gắn cấu hình ở lần phân giải đầu tiên. Các lần phân giải sau dùng lại cấu hình đó.

Bộ nhớ phù hợp cho phát triển cục bộ. Lưu trạng thái khi tắt đúng quy trình chỉ hỗ trợ trường hợp tắt có kiểm soát. Redis cần cấu hình lưu bền vững và giới hạn tài nguyên phù hợp. Hệ thống kiểm tra toàn bộ đầu vào trước khi gửi lô, nhưng lỗi mạng hoặc server vẫn có thể khiến chỉ một phần lô được gửi.

Xử lý tín hiệu hủy. Gọi và đợi hủy đăng ký từ bên ngoài handler để tránh handler tự chờ chính mình hoàn tất. Lưu kết quả nghiệp vụ vào nơi lưu trữ chính thức để có thể giao lại và khôi phục an toàn.

## Giao diện và phần triển khai

- [API và hành vi hàng đợi](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/queue/README.md)
- [Hợp đồng dịch vụ host](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/app/app-server/src/queue/token.ts)
