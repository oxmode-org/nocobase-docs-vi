---
title: Tác vụ nền và executor của plugin
description: Định nghĩa tác vụ tóm tắt thông báo, lấy executor từ ứng dụng, đăng ký và gửi job, rồi giải phóng tài nguyên.
---

Bài này kết nối `server/jobs/`, Provider và dịch vụ Jobs của ứng dụng để tóm tắt thông báo bất đồng bộ. Ví dụ lấy 80 điểm mã Unicode đầu tiên và ghi log. Chỉ cần điểm vào Server và các dịch vụ Jobs, Logging. Để lưu kết quả lâu dài, thay callback ghi log bằng dịch vụ nghiệp vụ.

Xem [Tác vụ nền và executor](../framework/background/jobs.md) về hợp đồng và backend dùng chung, và [Lập lịch](../framework/background/scheduling.md) về quy tắc định kỳ. Đăng ký tác vụ qua Provider. Ứng dụng chọn backend.

## Điều kiện tiên quyết và tệp

Dùng điểm vào Server hiện có của `@nocobase/app-plugin-announcements`. Ứng dụng phải cung cấp `jobExecutorServiceToken` và `loggingToken` như template mặc định. Có thể làm ví dụ độc lập với mã Client, cơ sở dữ liệu và dịch vụ xem trước ở bài trước.

Plugin mới có thể chọn `server.jobs`. Với plugin hiện có, thêm tệp và khai báo sau, giữ đóng góp Server đang dùng. Kiểm tra phiên bản tương thích và nhóm dependency theo khung cho `@nocobase/jobs`, `@nocobase/app-server` và `@nocobase/service-provider`. Đường dẫn tính từ gốc plugin.

## Cùng Agent

```text
Thêm tác vụ nền ghi log 80 điểm mã Unicode đầu tiên của thông báo.
Lấy executor theo phạm vi package từ dịch vụ Jobs của host. Đăng ký lớp job
trước khi bắt đầu tiêu thụ. Công khai enqueue và từ chối gửi trước khi sẵn sàng
hoặc sau khi tắt. Dùng payload văn bản JSON. Đợi executor do plugin sở hữu tắt
xong và để host quản lý Jobs cùng Logging. Kiểm chứng thực thi bằng bộ nhớ,
thử lại, hủy và dọn dẹp khi khởi động lỗi.
```

## Định nghĩa job

Thêm `server/jobs/summary.ts`.

```ts
import { Job, type JobClass, type JobExecutionContext } from '@nocobase/jobs';

export interface SummaryPayload { readonly text: string; }
export type WriteSummary = (summary: string, signal: AbortSignal) => Promise<void>;

export function createSummaryJob(writeSummary: WriteSummary): JobClass<SummaryPayload> {
  return class SummaryJob extends Job<SummaryPayload> {
    public static readonly jobName: string = '@nocobase/app-plugin-announcements/summary';
    public async execute(context: JobExecutionContext): Promise<void> {
      context.signal.throwIfAborted();
      const summary = Array.from(this.payload.text.trim()).slice(0, 80).join('');
      await writeSummary(summary, context.signal);
      await context.reportProgress(100);
    }
  };
}
```

Constructor của job chỉ nhận payload JSON có thể lưu. Gắn dependency nghiệp vụ qua closure của factory. Giữ tên loại tác vụ ổn định khi đổi tên tệp hoặc lớp để mọi tiến trình tiêu thụ nhận ra công việc đang chờ.

Ví dụ truyền văn bản ngắn. Với bản ghi nghiệp vụ, thường truyền ID rồi để dịch vụ thực thi đọc lại dữ liệu và kiểm tra quyền cùng phiên bản. Truyền tín hiệu hủy tới thao tác chạy lâu. Thiết kế thao tác ghi idempotent vì thử lại có thể chạy cùng thao tác nhiều lần.

## Đăng ký executor và dịch vụ gửi tác vụ

Thêm hoặc hợp nhất `server/jobs/provider.ts`.

```ts
import { jobExecutorServiceToken } from '@nocobase/app-server/jobs';
import { loggingToken } from '@nocobase/app-server/logging';
import type { JobClass, JobExecutor, JobReceipt } from '@nocobase/jobs';
import { createServiceToken, ServiceProvider, type ServiceContainer, type ServiceToken } from '@nocobase/service-provider';
import { createSummaryJob, type SummaryPayload } from './summary.js';

export interface AnnouncementSummaryJobs {
  enqueue(text: string): Promise<JobReceipt>;
}
export const announcementSummaryJobsToken: ServiceToken<AnnouncementSummaryJobs> =
  createServiceToken<AnnouncementSummaryJobs>('@nocobase/app-plugin-announcements/summary-jobs');

export interface AnnouncementJobsApplication { readonly container: ServiceContainer; }
export class AnnouncementJobsProvider extends ServiceProvider<AnnouncementJobsApplication> {
  public readonly name: string = '@nocobase/app-plugin-announcements/jobs';
  private executor: JobExecutor | undefined;
  private SummaryJob: JobClass<SummaryPayload> | undefined;
  private accepting: boolean = false;

  public override register(): void {
    this.app.container.singleton(announcementSummaryJobsToken, () => ({
      enqueue: async (text: string): Promise<JobReceipt> => {
        if (!this.accepting || !this.executor || !this.SummaryJob) {
          throw new Error('Announcement jobs are not ready.');
        }
        if (!text.trim() || text.length > 2000) throw new Error('Invalid announcement text.');
        return this.executor.addJob(new this.SummaryJob({ text }));
      },
    }));
  }
  public override async start(): Promise<void> {
    const logger = this.app.container.resolve(loggingToken).getLogger('announcements');
    const service = this.app.container.resolve(jobExecutorServiceToken);
    this.SummaryJob = createSummaryJob(async (summary, signal) => {
      signal.throwIfAborted();
      logger.info({ summary }, 'Announcement summary generated');
    });
    this.executor = service.getJobExecutor('@nocobase/app-plugin-announcements');
    this.executor.registerJob(this.SummaryJob);
    await this.executor.setup();
    this.accepting = true;
  }
  public override async shutdown(): Promise<void> {
    this.accepting = false;
    const executor = this.executor;
    this.executor = undefined;
    this.SummaryJob = undefined;
    await executor?.shutdown();
  }
}
```

Provider công khai thao tác gửi trong `register()`. Trong `start()`, Provider phân giải dịch vụ host, đăng ký lớp job và khởi động executor. Đăng ký mọi lớp mà tiến trình tiêu thụ cần trước `setup()`. Lưu tham chiếu executor trước khi khởi động để bước dọn dẹp tìm được nó nếu khởi động lỗi. Chỉ nhận tác vụ mới sau khi setup thành công.

Khi tắt, ngừng nhận tác vụ mới rồi đợi `shutdown()` của executor do Provider sở hữu. Host chịu trách nhiệm đóng dịch vụ Jobs và Logging dùng chung. Callback ví dụ ghi log. Trong production, thay bằng hành vi nghiệp vụ hỗ trợ thử lại, hủy và idempotency.

## Tích hợp Provider phía server

Import `AnnouncementJobsProvider` trong `server/plugin.ts` hiện có rồi thêm vào `serviceProviders`. Nếu đã có mảng Provider nghiệp vụ, dùng trường sau và giữ route, locale, tài nguyên cơ sở dữ liệu cùng các trường khác.

```ts
serviceProviders: [...serviceProviders, AnnouncementJobsProvider],
```

Nếu `server/providers/index.ts` đã tập hợp Jobs Provider, dùng mảng đó để mỗi Provider chỉ được đăng ký một lần. Thư mục `jobs/` chỉ tổ chức mã nguồn. Đăng ký lớp tác vụ qua executor vì khai báo cũ `queue.jobs` không tìm các tác vụ này.

Để ứng dụng hoặc plugin khác gửi tác vụ, giữ giá trị xuất mặc định trong `server/index.ts` và thêm:

```ts
export { announcementSummaryJobsToken } from './jobs/provider.js';
export type { AnnouncementSummaryJobs } from './jobs/provider.js';
```

Sau khi ứng dụng đăng ký điểm vào Server, điểm vào nghiệp vụ kiểm tra danh tính, quyền và đầu vào rồi gọi `app.container.resolve(announcementSummaryJobsToken).enqueue(text)`. Gửi sau khi ứng dụng đã khởi động, từ handler hoặc dịch vụ nghiệp vụ. Với CLI, khởi động ứng dụng bên trong `withApp()` trước khi gửi và đợi phần công việc cần thiết.

Biên nhận xác nhận backend đã nhận tác vụ. HTTP có thể trả biên nhận, còn kết quả tóm tắt cần được xác nhận riêng. Lưu bản ghi tác vụ nếu cần truy vấn trạng thái. Ví dụ ném ngoại lệ dịch vụ. Chuyển ngoại lệ sang hợp đồng lỗi tương ứng của HTTP hoặc CLI trước khi trả cho bên gọi.

## Backend, thử lại và giao tác vụ

Host quản lý cấu hình `jobs`. Backend bộ nhớ mặc định phù hợp cho phát triển một tiến trình. Việc lưu khi tắt đúng quy trình chỉ hỗ trợ trường hợp tắt có kiểm soát. Triển khai nhiều tiến trình cần backend dùng chung và cùng phần triển khai job đã đăng ký ở mọi consumer. Đặt cấu hình backend tại ứng dụng để các plugin dùng chung.

Thử lại có thể lặp tác động bên ngoài. Ví dụ chấp nhận log trùng. Nếu cần lưu bản tóm tắt, dùng ID nghiệp vụ, phiên bản hoặc ràng buộc duy nhất để tránh kết quả trùng. Commit dữ liệu và enqueue diễn ra riêng. Xem [Tác vụ nền và thực thi theo lịch](../developing-apps/background-tasks.md) về giao tác vụ đáng tin cậy. Nếu cần kích hoạt định kỳ, dùng [Lập lịch](../framework/background/scheduling.md).

Mã job đi vào sản phẩm plugin qua bản build Server. Giữ `jobName` và phạm vi executor khi còn công việc đang chờ phụ thuộc vào chúng. Xác định cách xử lý payload phiên bản trước khi nâng cấp.

## Kiểm chứng thực thi và dọn dẹp

Giữ môi trường kiểm thử Node của khung và dùng executor bộ nhớ thật. Tệp `tests/server/jobs.test.ts` sau lưu trạng thái trong thư mục tạm và theo dõi callback ghi log. Khai báo `@nocobase/logging` được import trực tiếp làm dependency phát triển tương thích.

```ts
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { jobExecutorServiceToken } from '@nocobase/app-server/jobs';
import { loggingToken } from '@nocobase/app-server/logging';
import { createJobExecutorService } from '@nocobase/jobs';
import { createLogging } from '@nocobase/logging';
import { ServiceContainer } from '@nocobase/service-provider';
import { expect, it, vi } from 'vitest';
import { AnnouncementJobsProvider, announcementSummaryJobsToken } from '../../server/jobs/provider.js';

it('runs accepted jobs and stops accepting after shutdown', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'announcement-jobs-'));
  const jobs = createJobExecutorService(undefined, { appName: 'test', storagePath: directory });
  const logging = createLogging();
  const log = vi.spyOn(logging.getLogger('announcements'), 'info').mockImplementation(() => {});
  const container = new ServiceContainer();
  container.instance(jobExecutorServiceToken, jobs);
  container.instance(loggingToken, logging);
  const provider = new AnnouncementJobsProvider({ container });
  provider.register();
  const submit = container.resolve(announcementSummaryJobsToken);
  try {
    await expect(submit.enqueue('Hello')).rejects.toThrow('not ready');
    await provider.start();
    const receipt = await submit.enqueue('  Hello 👋  ');
    expect(receipt.jobName).toBe('@nocobase/app-plugin-announcements/summary');
    await vi.waitFor(() => expect(log).toHaveBeenCalledWith(
      { summary: 'Hello 👋' }, 'Announcement summary generated',
    ));
    await provider.shutdown();
    await expect(submit.enqueue('Hello')).rejects.toThrow('not ready');
  } finally {
    try { await provider.shutdown(); } finally {
      try { await jobs.shutdown(); } finally {
        await logging.close();
        await rm(directory, { recursive: true, force: true });
      }
    }
  }
});
```

Kiểm tra thêm đầu vào sai, thử lại sau lỗi nghiệp vụ, tín hiệu hủy, setup lỗi và thứ tự tắt toàn ứng dụng. Sau khi thay ghi log bằng dịch vụ nghiệp vụ, xác minh cùng ID nghiệp vụ được xử lý nhiều lần mà vẫn chỉ có kết quả đúng. Kiểm thử riêng Redis, nhiều tiến trình và khôi phục khi triển khai nếu dùng các cơ chế đó.

```bash
pnpm --filter @nocobase/app-plugin-announcements check
pnpm nocobase plugin register @nocobase/app-plugin-announcements --no-install --dry-run
pnpm nocobase plugin register @nocobase/app-plugin-announcements --no-install
pnpm build
```

Cuối cùng, gửi văn bản từ điểm vào có phân quyền trong ứng dụng đích. Kiểm tra biên nhận và log. Khi tắt, xác minh mọi tác vụ đã ngừng truy cập tài nguyên trước khi tài nguyên được giải phóng.
