---
title: Lập lịch định kỳ
---

`ScheduleExecutor` kích hoạt công việc theo biểu thức Cron hoặc khoảng thời gian cố định. Dùng cơ chế này để dọn dẹp, tổng hợp và đồng bộ theo lịch khai báo trong mã. Nếu người vận hành cần danh sách tác vụ, nút bật tắt và lịch sử thực thi, dùng plugin scheduler.

## Khai báo lịch

Phân giải `jobExecutorServiceToken` và gọi hàm khởi động này từ Provider.

```ts
import { jobExecutorServiceToken } from '@nocobase/app-server/jobs';
import type { ServiceResolver } from '@nocobase/service-provider';

export async function startOrderSchedule(
  container: ServiceResolver,
  runDigest: (signal: AbortSignal) => Promise<void>,
) {
  const service = container.resolve(jobExecutorServiceToken);
  const executor = service.getScheduleExecutor('@example/orders');
  await executor.addJob({
    name: 'daily-digest',
    payload: {},
    options: { cron: '0 2 * * *', tz: 'Asia/Shanghai' },
    execute: async ({ signal }) => runDigest(signal),
  });
  await executor.setup();
  return executor;
}
```

Bên gọi cung cấp hàm nghiệp vụ `runDigest`. Đăng ký quy tắc trước `setup()` để handler sẵn sàng khi bắt đầu nhận tác vụ. Dùng tên ổn định để cập nhật quy tắc hiện có. Khi đổi tên, xóa riêng quy tắc cũ nếu cần.

## Thiết lập thời gian

| Thiết lập | Ý nghĩa |
| --- | --- |
| `cron` | Biểu thức Cron gồm năm hoặc sáu trường |
| `every` | Khoảng thời gian theo mili giây. Chọn một trong hai tùy chọn `every` hoặc `cron` |
| `tz` | Múi giờ của Cron, mặc định UTC |
| `startDate` / `endDate` | Mốc bắt đầu và kết thúc lịch |
| `limit` | Số lần chạy tối đa |
| `immediately` | Chạy lần đầu ngay với Cron, tùy thiết lập thời điểm bắt đầu |

Khai báo rõ múi giờ nghiệp vụ. Thời điểm thực thi thực tế phụ thuộc tải, thời gian ngừng hoạt động và số lần thử lại. Thiết kế job có thể chạy lại và xác định rõ khoảng thời gian dữ liệu cần xử lý.

## Cập nhật và tắt

`addJob()` dùng tên ổn định để tạo hoặc cập nhật quy tắc. Định nghĩa giữ nguyên thì lịch hiện tại được giữ. Đổi quy tắc có thể đổi lịch những lần chạy sắp tới và đặt lại bộ đếm giới hạn. Lập kế hoạch chuyển đổi quy tắc tương ứng.

Gọi `shutdown()` khi dừng ứng dụng. Các quy tắc lưu bền vững vẫn còn. Dùng `removeJob()` khi nghiệp vụ yêu cầu xóa quy tắc. Cấu hình mức đồng thời, thử lại và lưu giữ qua cấu hình jobs của host.

Handler cần xử lý tín hiệu hủy và cho phép chạy lại an toàn. Sự kiện cục bộ phản ánh hoạt động trong một tiến trình. Dùng plugin để có lịch sử, quyền và trang quản lý. Xem [Tác vụ nền](jobs.md).

## Giao diện và phần triển khai

- [ScheduleExecutor](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/jobs/README.md)
- [Hợp đồng dịch vụ host](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/app/app-server/src/jobs/token.ts)
