---
title: Tác vụ nền và thực thi theo lịch
description: Khai báo và gửi tác vụ nền, cấu hình lịch, thử lại và khôi phục, rồi chọn backend thực thi.
---

Dùng `JobExecutor` để tạo báo cáo trong nền trong khi điểm vào nghiệp vụ xác nhận đã nhận yêu cầu. Dùng `ScheduleExecutor` để kích hoạt công việc theo khoảng thời gian cố định hoặc vào một giờ nhất định mỗi ngày. Mã nghiệp vụ chịu trách nhiệm tạo báo cáo, xử lý chạy lặp và lưu kết quả.

[Ví dụ báo cáo đơn hàng](https://github.com/nocobase/docs-examples-v3/tree/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks) tạo tệp CSV thật từ dữ liệu đơn hàng cố định. Đây là ứng dụng máy chủ độc lập, chạy qua lệnh và không cần trang giao diện, cơ sở dữ liệu hay plugin thương mại. Xem [Mã nguồn và thiết lập ví dụ](#example-source-and-setup).

<a id="choose-an-execution-model"></a>

## Chọn mô hình thực thi

| Nhu cầu | Cách thực hiện |
| --- | --- |
| Yêu cầu hiện tại phải nhận kết quả nghiệp vụ | Gọi trực tiếp dịch vụ nghiệp vụ |
| Gửi công việc một lần và để hoàn tất sau | `Job` và `JobExecutor` |
| Mã ứng dụng khai báo dọn dẹp, tổng hợp hoặc đồng bộ định kỳ | `ScheduleExecutor` |
| Quản trị viên cần bật quy tắc và xem lịch sử thực thi | [Plugin tác vụ theo lịch](../using-plugins/automation/scheduler.md) |

Lấy dịch vụ sẵn có qua `jobExecutorServiceToken` từ `@nocobase/app-server/jobs`. Tác vụ thông thường và lịch chạy dùng cấu hình `jobs`. Nếu cần gửi trễ hoặc ưu tiên thông điệp, xem [Hàng đợi](../framework/background/queues.md) về cấu hình riêng.

<a id="define-and-submit-background-jobs"></a>

## Khai báo và gửi tác vụ nền

<a id="define-the-job-and-its-parameters"></a>

### Khai báo tác vụ và tham số

Khai báo tác vụ trong `server/jobs/report-job.ts`. `jobs/` là quy ước tổ chức mã của ứng dụng. Hãy đăng ký tường minh các tác vụ cần nạp:

```ts
import { Job, type JobExecutionContext } from '@nocobase/jobs';

export interface ReportPayload {
  readonly reportId: string;
  readonly stepMs: number;
  readonly failure: 'none' | 'first' | 'always';
}

export type GenerateReport = (
  payload: ReportPayload,
  context: JobExecutionContext,
) => Promise<void>;

export function createReportJob(generateReport: GenerateReport) {
  return class ReportJob extends Job<ReportPayload> {
    static readonly jobName: string = 'reports.generate';

    async execute(context: JobExecutionContext): Promise<void> {
      context.signal.throwIfAborted();
      await generateReport(this.payload, context);
    }
  };
}
```

`reportId` xác định một báo cáo nghiệp vụ. `stepMs` và `failure` chỉ phục vụ minh họa tác vụ chậm và lỗi. Trình tạo xử lý ba đơn hàng cố định, báo tiến độ sau mỗi đơn rồi ghi tệp.

Payload chỉ chứa dữ liệu JSON. Chuyển ngày giờ thành chuỗi ISO và giữ hàm, kết nối, đối tượng yêu cầu cùng đối tượng `Date` bên ngoài payload. Bước gửi chụp lại payload và mỗi lần chạy tạo một đối tượng tác vụ mới. Lưu số lần thử và tiến độ khôi phục bên ngoài các trường của đối tượng.

`createReportJob()` là hàm tạo riêng của ví dụ, dùng closure để gắn dependency nghiệp vụ. Constructor tác vụ vẫn chỉ nhận payload. Giữ `jobName` ổn định, bỏ khoảng trắng và dấu hai chấm khỏi tên, rồi đăng ký lớp tương ứng trong mọi tiến trình tiêu thụ.

[Khai báo tác vụ](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/server/jobs/report-job.ts) · [Trình tạo báo cáo](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/server/reports/generate.ts)

<a id="register-and-start-in-a-provider"></a>

### Đăng ký và khởi động trong Provider

Trong `server/providers/reports.ts`, `register()` gắn dịch vụ báo cáo với `reportJobsToken`:

```ts
override register(): void {
  this.app.container.singleton(reportJobsToken, () => new ReportJobs());
}
```

`start()` tạo lớp tác vụ và khởi động trình thực thi. Đoạn sau minh họa khởi động. Xem Provider đầy đủ để tra import, khai báo trường và dọn dẹp khi lỗi:

```ts
const executors = this.app.container.resolve(jobExecutorServiceToken);
const reports = this.app.container.resolve(reportJobsToken);
const config = this.app.config.get<ReportsConfig>('reports')!;
const ReportJob = createReportJob((payload, context) =>
  generateReport(this.app.paths.storage('reports'), payload, context),
);

this.jobs = executors.getJobExecutor('app.reports');
this.schedules = executors.getScheduleExecutor('app.reports.schedule');
this.unsubscribe = this.jobs.subscribe((event) => reports.record(event));

this.jobs.registerJob(ReportJob);
await this.jobs.setup({ consume: config.consume });
reports.attach(this.jobs, ReportJob, this.schedules);
if (config.schedule) await reports.schedule(config.schedule);
await this.schedules.setup({ consume: config.consume });
```

Cấu hình `reports` mặc định dùng `consume: true`. Đăng ký tác vụ thông thường trước `setup()` rồi mới nhận lượt gửi để worker xử lý được tác vụ còn lại từ lần chạy trước. Tiến trình chỉ gửi có thể dùng `setup({ consume: false })`. Lần `setup()` đầu xác định chế độ tiêu thụ cho cả vòng đời. [Bài kiểm thử tiến trình chỉ gửi](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/tests/reports.test.ts) trong `pnpm test` cho thấy một tiến trình tiêu thụ mới xử lý công việc sau khi bên gửi dừng.

`app.reports` là phạm vi nghiệp vụ của trình thực thi. Giữ namespace ứng dụng, phạm vi và tên loại tác vụ ổn định để bản nâng cấp tìm được công việc hiện có.

Với template mặc định, thêm `ReportsProvider` vào mảng hiện có trong `server/providers/index.ts` và bổ sung cấu hình `reports` mà Provider đọc. Dùng dịch vụ Jobs của template và giữ các Provider hiện có, gồm `SubmissionProvider`. Template beta.85 đã đăng ký dọn biên nhận hết hạn hằng giờ. Xem [Dịch vụ phía máy chủ](server-business-services.md) về Provider.

[Provider đầy đủ](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/server/providers/reports.ts) · [Điểm vào ứng dụng ví dụ](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/server/app.ts)

<a id="submit-a-job-and-observe-progress"></a>

### Gửi tác vụ và theo dõi tiến độ

Trong `server/reports/service.ts`, `ReportJobs.enqueue()` chuẩn bị và kiểm tra payload rồi gửi qua `addJob()`:

```ts
const payload: ReportPayload = {
  reportId,
  stepMs: 30,
  failure: 'none',
  ...options,
};
validatePayload(payload);
if (!this.jobs || !this.ReportJob)
  throw new Error('Report jobs are not ready.');
return this.jobs.addJob(new this.ReportJob(payload));
```

Provider cung cấp `this.jobs` và `this.ReportJob` qua `attach()` sau khi khởi động. Lệnh sau đó lấy dịch vụ:

```ts
const reports = app.container.resolve(reportJobsToken);
const receipt = await reports.enqueue('order-summary');
console.log('Accepted:', receipt.jobId);
```

Mỗi lần gọi `addJob()` nhận ID mới. Nếu cần chống gửi trùng theo `reportId`, thực hiện ở lớp nghiệp vụ.

Biên nhận chứa `jobId`, `jobName` và `enqueuedAt`, xác nhận backend đã tiếp nhận. Điểm vào HTTP có thể trả `202` cùng ID, sau khi tự kiểm tra xác thực, quyền và đầu vào. Khi chạy tác vụ của người dùng, xác định bên thực hiện từ nguồn tin cậy và áp dụng phạm vi quyền tường minh. Các lệnh ví dụ chạy với tư cách người vận hành cục bộ qua CLI.

Chạy `pnpm demo manual`. Lệnh in ID đã nhận và nội dung CSV sau khi hoàn tất. Tệp nằm ở `storage/reports/order-summary.csv` dưới thư mục lệnh in ra:

```csv
orderId,customer,total
ORD-1001,Cedar Books,120
ORD-1002,Harbor Supply,75
ORD-1003,Maple Market,210
```

[Dịch vụ gửi tác vụ](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/server/reports/service.ts) · [Điểm vào lệnh](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/scripts/demo.ts)

Trình tạo báo tiến độ từ 0 đến 100 qua ngữ cảnh thực thi. Sau mỗi đơn hàng, nó gọi:

```ts
await context.reportProgress((index + 1) * 30);
```

Tiến độ lên `100` sau khi xuất bản tệp. Provider đăng ký theo dõi trước khi bắt đầu tiêu thụ:

```ts
this.unsubscribe = this.jobs.subscribe((event) => reports.record(event));
```

`JobStart`, `JobProgress`, `JobEnd` và `JobError` mô tả các lần thực thi của đối tượng hiện tại. Dùng `jobId` để đối chiếu tác vụ và `attempt` để phân biệt lần bắt đầu. Sau `JobError`, lần thử tiếp theo có thể chạy lại tiến độ từ đầu.

`pnpm demo manual` in các sự kiện sau:

```text
JobStart attempt=1
JobProgress attempt=1 progress=30
JobProgress attempt=1 progress=60
JobProgress attempt=1 progress=90
JobProgress attempt=1 progress=100
JobEnd attempt=1
```

Ví dụ giữ sự kiện trong mảng giới hạn trong bộ nhớ để in qua CLI. Khởi động lại sẽ xóa mảng. Khi cần trạng thái giữa nhiều phiên bản hoặc lịch sử thực thi, lưu bản ghi nghiệp vụ bền vững cùng kết quả.

[Báo tiến độ](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/server/reports/generate.ts) · [Ghi sự kiện](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/server/reports/service.ts)

<a id="configure-scheduled-execution"></a>

## Cấu hình lịch chạy

<a id="run-at-a-fixed-interval"></a>

### Chạy theo khoảng thời gian cố định

`ScheduleExecutor.addJob()` đăng ký trình xử lý và quy tắc dưới tên ổn định. Đây là `ReportJobs.schedule()` trong `server/reports/service.ts`. `scheduleName` là `order-summary` và `ScheduleJobOption` được import từ `@nocobase/jobs`.

```ts
async schedule(options: ScheduleJobOption) {
  if (!this.schedules) throw new Error('Report schedules are not ready.');
  return this.schedules.addJob({
    name: scheduleName,
    options,
    payload: {},
    execute: async ({ scheduledAt, signal }) => {
      signal.throwIfAborted();
      await this.enqueue(`scheduled-${scheduledAt.getTime()}`);
    },
  });
}
```

Provider khai báo quy tắc trước `setup()` của trình thực thi lịch. Khi khởi động, quy tắc được ghi trước khi bắt đầu tiêu thụ. `scheduledAt` là thời điểm dự kiến kích hoạt, còn thực thi có thể bắt đầu muộn hơn. Ví dụ đưa thời điểm này vào ID để các lần gửi lại cho cùng thời điểm cho cùng kết quả nghiệp vụ.

Truyền `every` theo mili giây để đặt khoảng thời gian:

```ts
await reports.schedule({ every: 200, limit: 2 });
```

Chạy `pnpm demo interval`. Quy tắc kích hoạt hai lần, tạo hai báo cáo và in `Completed reports: 2`. `limit` giới hạn số lần kích hoạt theo lịch. Số lần thử của tác vụ thông thường có cấu hình riêng.

Trình xử lý lịch thành công nghĩa là báo cáo đã được gửi. Bước tạo báo cáo vẫn có thể thất bại. Lệnh chỉ đếm báo cáo sau khi tác vụ hoàn tất. Tác vụ định kỳ ngắn có thể gọi thẳng dịch vụ nghiệp vụ từ trình xử lý lịch.

[Mã nguồn quy tắc và trình xử lý](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/server/reports/service.ts)

<a id="run-with-cron-and-a-timezone"></a>

### Chạy theo Cron và múi giờ

Để tạo báo cáo hằng ngày lúc 02:00 theo múi giờ đã chọn:

```ts
await reports.schedule({ cron: '0 2 * * *', tz: 'Asia/Shanghai' });
```

Dùng tên múi giờ IANA của nghiệp vụ. Bỏ qua múi giờ thì dùng UTC. Cron nhận năm hoặc sáu trường và dùng riêng với `every`.

Chạy `pnpm demo cron` để quy tắc rút ngắn `{ cron: '*/1 * * * * *', tz: 'UTC', limit: 2 }` chạy hai lần. `pnpm demo rules` đăng ký quy tắc hằng ngày rồi in thời điểm kế tiếp mà không cần chờ đến hôm sau.

[Hai ví dụ Cron](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/scripts/demo.ts)

<a id="update-and-remove-rules"></a>

### Cập nhật và xóa quy tắc

Gọi lại `addJob()` với cùng tên để cập nhật. Khai báo giữ nguyên thì lịch đã lập được giữ. Khi đổi tên, di chuyển hoặc xóa quy tắc cũ tường minh.

`ReportJobs` tra và xóa quy tắc bằng API công khai của trình thực thi, với cùng `scheduleName`:

```ts
async getSchedule() {
  if (!this.schedules) throw new Error('Report schedules are not ready.');
  return this.schedules.getJob(scheduleName);
}

async removeSchedule() {
  if (!this.schedules) throw new Error('Report schedules are not ready.');
  return this.schedules.removeJob(scheduleName);
}
```

Dịch vụ gọi `getJob('order-summary')` và `removeJob('order-summary')`. Chạy `pnpm demo rules` để tạo quy tắc theo khoảng thời gian, đổi sang Cron hằng ngày, in `nextRunAt` rồi xóa. Biên nhận xóa ghi `Job removed` và lần tra sau trả `undefined`.

`removeJob()` xóa quy tắc và lượt kích hoạt đang chờ, đồng thời giữ trình xử lý đã đăng ký trong tiến trình. Khi thoát ứng dụng, gọi `shutdown()` để giữ lịch cho lần khởi động sau. Đăng ký lại trình xử lý khi khởi động vì quy tắc đã lưu chỉ chứa dữ liệu lịch.

[Phương thức quản lý quy tắc](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/server/reports/service.ts)

<a id="handle-failures-and-repeated-execution"></a>

## Xử lý lỗi và thực thi lặp

`attempts` lấy từ cấu hình `jobs` mà trình thực thi chọn. Mặc định là `1`, tính cả lượt đầu tiên. Ví dụ đặt trong `server/config.ts`:

```ts
import type { AppJobsConfig } from '@nocobase/app-server/jobs';

export const jobs: AppJobsConfig = {
  default: 'memory',
  memory: { adapter: 'memory', concurrency: 1, attempts: 3 },
};
```

Cấu hình cho tối đa ba lượt thử khi gặp lỗi thông thường. `concurrency` áp dụng cho từng worker. Với template mặc định, thêm các giá trị vào `server/config/jobs.ts` hiện có hoặc cấu hình triển khai.

Tạo lỗi ở lần đầu bằng tùy chọn minh họa:

```ts
await reports.enqueue('order-summary', { failure: 'first', stepMs: 30 });
```

Trình tạo đọc `context.attempt` và ném lỗi sau khi xử lý đơn đầu trong lượt 1. Với `failure: 'always'`, mọi lượt đều ném lỗi.

- `pnpm demo retry` thất bại ở 30% trong lượt 1. Lượt 2 tạo lại báo cáo và hoàn tất.
- `pnpm demo failure` thất bại ở mọi lượt, tạo ba sự kiện `JobError` và không có CSV. Lệnh thoát thành công sau khi xác nhận đúng lỗi dự kiến.

`context.attempt` đếm số lần bắt đầu thực thi, kể cả khi khôi phục. Ngân sách thử lại theo dõi riêng số lỗi thông thường.

[Cấu hình thử lại](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/server/config.ts) · [Tùy chọn tạo lỗi](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/server/reports/generate.ts)

Thử lại, khôi phục và gửi lặp đều có thể lặp tác động nghiệp vụ. Thiết kế thao tác có tính lũy đẳng để tạo lại cùng báo cáo vẫn chỉ còn một kết quả. Ví dụ ghi xong tệp tạm rồi tạo CSV đích một cách nguyên tử bằng liên kết cứng. Tệp đã có cùng `reportId` được giữ nguyên.

Xem mã xuất bản tệp bên dưới. Thao tác ghi cơ sở dữ liệu, trừ tồn kho và gọi hệ thống ngoài cần transaction, ràng buộc duy nhất hoặc khóa lũy đẳng phù hợp. Một ID báo cáo xác định một snapshot dữ liệu. Dùng ID mới nếu phạm vi dữ liệu thay đổi.

Chạy `pnpm demo repeat`. Hai lượt gửi nhận ID tác vụ khác nhau và giữ một CSV nguyên vẹn. Ghi dữ liệu nghiệp vụ và gửi tác vụ dùng transaction riêng. Khi công việc cần được bảo đảm không thất lạc, lưu bản ghi chờ gửi bền vững và triển khai logic khôi phục. Xem [Dịch vụ phía máy chủ](server-business-services.md).

[Logic xuất bản tệp đầy đủ](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/server/reports/generate.ts)

<a id="shut-down-executors-and-recover-jobs"></a>

## Dừng trình thực thi và khôi phục tác vụ

Dừng kích hoạt định kỳ trước, ngừng nhận lượt gửi rồi dừng trình thực thi thông thường. Giữ đăng ký sự kiện đến khi dừng xong để nhận sự kiện gián đoạn cuối:

```ts
override async shutdown(): Promise<void> {
  try {
    await this.schedules?.shutdown();
  } finally {
    this.app.container.resolve(reportJobsToken).stopAccepting();
    try {
      await this.jobs?.shutdown();
    } finally {
      this.unsubscribe?.();
    }
  }
}
```

`shutdown()` hủy tín hiệu của tác vụ đang chạy và chờ trình xử lý thoát. Mã nghiệp vụ cần hợp tác bằng cách chia công việc dài thành đợt, kiểm tra `signal` và truyền nó cho thao tác hỗ trợ hủy.

Với công việc dở dang, gọi `signal.throwIfAborted()` sau khi tín hiệu bị hủy, hoặc ném `JobInterruptedError` khi tín hiệu đã hủy. Tác vụ có thể được giữ để khôi phục mà vẫn giữ ngân sách lỗi thông thường. Nếu trình xử lý trả thành công, tác vụ hoàn tất. Chỉ khai báo gián đoạn khi tác động nghiệp vụ vẫn chưa hoàn tất.

Ví dụ mô phỏng công việc chậm bằng độ trễ có thể hủy. Nó chuyển `AbortError` từ bộ định giờ Node thành `signal.reason` để trình thực thi phân loại đúng là gián đoạn.

Chạy `pnpm demo recovery`. Sau sự kiện tiến độ đầu tiên, lệnh dừng ứng dụng và tạo ứng dụng mới với cùng thư mục lưu trữ. Đầu ra gồm:

```text
Interrupted during shutdown; reopening the same storage.
JobEnd, attempt 2
```

Cùng ID tạo báo cáo ở lần thử 2 và bắt đầu lại tiến độ. Ví dụ kiểm chứng khôi phục sau khi dừng có kiểm soát. Trường hợp tiến trình bị buộc dừng hoặc máy gặp sự cố cần kiểm chứng riêng.

[Logic dừng](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/server/providers/reports.ts) · [Xử lý hủy](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/server/reports/generate.ts)

<a id="configure-the-execution-backend"></a>

## Cấu hình backend thực thi

<a id="single-process-memory"></a>

### Bộ nhớ trong một tiến trình

Jobs core có sẵn backend bộ nhớ. Khi chưa chọn cấu hình và thiếu `jobs.default`, framework dùng backend này. Đặt `jobs.default: memory` để chỉ rõ lựa chọn triển khai.

Backend đọc trạng thái lúc khởi động, cập nhật trong bộ nhớ khi chạy và ghi xuống `storage/jobs/` khi dừng có kiểm soát. Buộc thoát có thể mất công việc mới hoặc phát lại việc cũ khi khởi động. Dùng backend này trong một tiến trình và giữ mỗi tệp trạng thái cho một tiến trình ghi.

Mỗi ví dụ tạo thư mục lưu trữ cô lập. Chỉ ví dụ khôi phục mở lại thư mục đó sau khi dừng. [Cấu hình và đường dẫn](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/server/app.ts)

<a id="commercial-redis-plugin-and-multiple-instances"></a>

### Plugin Redis thương mại và nhiều phiên bản ứng dụng

> [!NOTE]
> Backend thực thi Redis do plugin thương mại `@nocobase/app-plugin-jobs-redis` cung cấp. Tác vụ cơ bản, lịch chạy và ví dụ bộ nhớ có thể dùng backend tích hợp.

Trước khi dùng Redis, lấy quyền truy cập plugin, cài và đăng ký plugin Server trên mọi tiến trình gửi và tiêu thụ. Sau đó khai báo và chọn cấu hình Jobs với `adapter: redis`. Cấu hình kết nối và thời gian lưu theo hướng dẫn của phiên bản plugin đã cài.

Cần đăng ký backend Redis qua plugin ngoài việc đặt `jobs.default: redis` hoặc địa chỉ kết nối. Nếu chọn triển khai chưa đăng ký, framework ném `JobsBackendNotRegisteredError` và dừng thay vì chuyển sang bộ nhớ. Khi nâng cấp ứng dụng cũ, giữ `adapter: redis` cùng kết nối, namespace và phạm vi hiện có.

Kiểm tra tiêu thụ trên nhiều phiên bản ứng dụng và khôi phục lỗi trên triển khai Redis thực tế. Các tác động nghiệp vụ vẫn cần tính lũy đẳng. Xem [Hướng dẫn mã nguồn Jobs tại phiên bản này](https://github.com/nocobase/nocobase/blob/d04061ee252afbcc2f42cf1d69ab8888e72d604a/packages/libs/jobs/README.md) về quy ước tích hợp backend.

<a id="example-source-and-setup"></a>

## Mã nguồn và thiết lập ví dụ

[Ví dụ đầy đủ và ghi chú kiểm chứng](https://github.com/nocobase/docs-examples-v3/tree/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks). Dùng Node.js 24 và pnpm 11.7.0. Lockfile ghim App Server `3.0.0-beta.5`, Jobs `1.0.0-beta.5` và ServiceProvider `0.0.2-beta.2`.

```bash
git clone https://github.com/nocobase/docs-examples-v3.git
cd docs-examples-v3
git checkout 3cfe5c53612d783d038a7b2a46c7b05fda1e1c26
cd apps/background-tasks
pnpm install --frozen-lockfile
pnpm demo manual
```

Chạy mọi lệnh `pnpm demo` và kiểm chứng trong `apps/background-tasks`. Dùng lệnh ở từng mục để thử tình huống tương ứng. Mỗi lệnh in thư mục kết quả cô lập và dừng ứng dụng trước khi thoát. Có thể chạy trực tiếp qua CLI.

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm format:check
```

Ví dụ dùng NocoBase Application thật và cần hệ thống tệp đích hỗ trợ liên kết cứng. `pnpm build` biên dịch TypeScript. [README của ví dụ](https://github.com/nocobase/docs-examples-v3/blob/3cfe5c53612d783d038a7b2a46c7b05fda1e1c26/apps/background-tasks/README.md) chỉ mã nguồn, lệnh và bước kiểm chứng tương ứng với mỗi cách dùng.
