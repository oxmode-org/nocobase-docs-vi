---
title: Tác vụ nền và executor
---

Dùng `@nocobase/jobs` cho công việc cần tiếp tục sau khi yêu cầu HTTP kết thúc. Phân giải `jobExecutorServiceToken` từ `@nocobase/app-server/jobs` để lấy executor theo phạm vi plugin hoặc nghiệp vụ.

## Định nghĩa job

Đặt tác vụ trong thư mục server, chẳng hạn `server/jobs/count-orders-job.ts`.

```ts
import { Job, type JobExecutionContext } from '@nocobase/jobs';

export class CountOrdersJob extends Job<{ orderIds: string[] }> {
  static readonly jobName: string = 'orders.count';

  async execute(context: JobExecutionContext): Promise<void> {
    context.signal.throwIfAborted();
    for (let index = 0; index < this.payload.orderIds.length; index += 1) {
      context.signal.throwIfAborted();
      await context.reportProgress(
        ((index + 1) / this.payload.orderIds.length) * 100,
      );
    }
  }
}
```

Payload là giá trị JSON được lưu lại. Mỗi lượt thử tạo một instance mới. Truyền ID bản ghi và tham số cần thiết dưới dạng JSON. Giữ kết nối, container và hàm trong tiến trình thực thi. Biểu diễn ngày bằng chuỗi ISO. Chuyển `bigint` và giá trị thiếu sang biểu diễn JSON phù hợp trước khi gửi.

## Đăng ký và gửi tác vụ

Truyền `app.container` của host ứng dụng hoặc plugin vào mã khởi động. Phân giải dịch vụ dùng chung qua token công khai.

```ts
import { jobExecutorServiceToken } from '@nocobase/app-server/jobs';
import type { ServiceResolver } from '@nocobase/service-provider';
import { CountOrdersJob } from './count-orders-job.js';

export async function startOrderJobs(container: ServiceResolver) {
  const service = container.resolve(jobExecutorServiceToken);
  const executor = service.getJobExecutor('@example/orders');
  executor.registerJob(CountOrdersJob);
  await executor.setup();
  const receipt = await executor.addJob(
    new CountOrdersJob({ orderIds: ['order-1', 'order-2'] }),
  );
  return { executor, receipt };
}
```

Mỗi tiến trình tiêu thụ đăng ký các lớp tác vụ trước `setup()`. Worker từ xa tự đăng ký. Tiến trình chỉ gửi có thể gọi `setup({ consume: false })`. Trong ứng dụng, khởi tạo executor ở bước khởi động Provider, gửi từ route hoặc dịch vụ nghiệp vụ và đợi `shutdown()` khi dọn dẹp.

Biên nhận xác nhận tác vụ đã được nhận. Kiểm tra trạng thái riêng để biết kết quả. Namespace ứng dụng, phạm vi executor và `jobName` ổn định định danh công việc được lưu. Giữ các tên này khi vẫn còn tác vụ đang chờ phụ thuộc vào chúng.

## Trách nhiệm của ứng dụng và plugin

Ứng dụng cung cấp cấu hình và adapter của Jobs. Plugin dùng phạm vi package ổn định và đăng ký job của mình. Ví dụ khởi tạo rồi gửi một tác vụ để minh họa luồng. Khi tích hợp thực tế, giữ lại executor và gửi theo sự kiện nghiệp vụ. Plugin đóng executor do mình tạo. Host quản lý dịch vụ Jobs dùng chung.

Ghi dữ liệu nghiệp vụ và gửi job là hai thao tác riêng. Để bảo toàn công việc khi xảy ra lỗi, lưu bản ghi chờ hoặc outbox bền vững và xử lý theo cơ chế idempotent. Xem [Tác vụ nền của ứng dụng](../../developing-apps/background-tasks.md) và [Ví dụ Provider của plugin](../../extension-development/background-jobs.md).

## Lưu trữ, lỗi và tắt

Bộ nhớ phù hợp cho phát triển. Dùng Redis khi các tiến trình tiêu thụ chạy phân tán. Nếu tiến trình bộ nhớ gặp sự cố, công việc đang chờ có thể mất. Độ bền Redis phụ thuộc cấu hình lưu dữ liệu và loại bỏ khóa.

Thử lại có thể lặp thao tác nghiệp vụ. Thiết kế lời gọi bên ngoài và thao tác ghi cơ sở dữ liệu theo cơ chế idempotent. `reportProgress()` báo tiến độ. Lưu kết quả nghiệp vụ và lịch sử tác vụ bền vững bằng cơ chế riêng. Theo dõi tín hiệu hủy `signal` và hoàn tất dọn dẹp trước khi đóng tài nguyên phụ thuộc.

Xem [Lập lịch](scheduling.md) cho công việc định kỳ và [Hàng đợi](queues.md) để điều khiển kênh, bên gửi và bên tiêu thụ ở cấp thấp hơn.

## Giao diện và phần triển khai

- [Hợp đồng và thực thi job](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/jobs/README.md)
- [Dịch vụ Jobs của host](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/jobs/index.ts)
- [Hợp đồng dịch vụ host](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/app/app-server/src/jobs/token.ts)
