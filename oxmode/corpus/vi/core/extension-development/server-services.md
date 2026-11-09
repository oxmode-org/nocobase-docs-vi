---
title: Dịch vụ nghiệp vụ và ServiceProvider
description: Tổ chức phần triển khai dịch vụ, token và Provider của plugin, rồi công khai hợp đồng cho API, lệnh và plugin khác.
---

Bài này thêm dịch vụ xem trước văn bản cho plugin thông báo để HTTP, CLI và plugin khác dùng chung. `services/` chứa phần triển khai, `tokens.ts` định nghĩa hợp đồng công khai, còn `providers/` đăng ký chúng vào container của ứng dụng. Ví dụ chỉ cần phần Server, có thể chạy khi chưa cấu hình cơ sở dữ liệu hay Client.

Xem [ServiceProvider](service-provider.md) về dependency injection và vòng đời, và [Dịch vụ phía server](../developing-apps/server-business-services.md) về transaction và trạng thái yêu cầu. Bài này tập trung vào đăng ký plugin và cách dùng qua hợp đồng công khai.

## Điều kiện tiên quyết và tệp

Thêm các tệp sau vào `@nocobase/app-plugin-announcements` hiện có. Đường dẫn tính từ gốc plugin. Hợp nhất nội dung và giữ các dịch vụ cùng API đã có. Khi tạo plugin mới, có thể chọn `server.service-providers`. Giữ `@nocobase/service-provider` làm peer dependency tương thích để ứng dụng và plugin dùng cùng định danh runtime.

## Cùng Agent

```text
Tách phần xem trước thông báo thành dịch vụ Server của plugin. Trả về văn bản
đã cắt khoảng trắng đầu cuối và số điểm mã Unicode. Đăng ký singleton khởi tạo
khi cần qua token gốc và ServiceProvider. Công khai hợp đồng cho API và lệnh.
Giữ các đóng góp Server hiện có. Truyền trạng thái yêu cầu, người dùng và
transaction qua từng lời gọi. Kiểm chứng thiếu đăng ký, định danh dùng chung
và sản phẩm build khai báo kiểu.
```

## Định nghĩa hợp đồng dịch vụ

Thêm hợp đồng và token vào `server/tokens.ts`.

```ts
import { createServiceToken, type ServiceToken } from '@nocobase/service-provider';

export interface AnnouncementPreview {
  readonly text: string;
  readonly length: number;
}
export interface AnnouncementPreviewService {
  preview(text: string): AnnouncementPreview;
}
export const announcementPreviewToken: ServiceToken<AnnouncementPreviewService> =
  createServiceToken<AnnouncementPreviewService>('@nocobase/app-plugin-announcements/preview');
```

Mỗi điểm vào kiểm tra kiểu đầu vào, độ dài và quyền. Đặt ràng buộc nghiệp vụ có thể tái sử dụng trong dịch vụ. Ví dụ đếm điểm mã Unicode, khác với độ dài chuỗi JavaScript và số cụm ký tự người dùng nhìn thấy.

## Triển khai dịch vụ

Thêm `server/services/preview.ts`.

```ts
import type { AnnouncementPreview, AnnouncementPreviewService } from '../tokens.js';

export class DefaultAnnouncementPreviewService implements AnnouncementPreviewService {
  public preview(text: string): AnnouncementPreview {
    const normalized = text.trim();
    return { text: normalized, length: Array.from(normalized).length };
  }
}
```

Phần triển khai độc lập với HTTP Context, nên lệnh và job cũng có thể dùng. Khi thêm dependency cơ sở dữ liệu hoặc dịch vụ ngoài, phân giải dịch vụ hiện có của ứng dụng trong Provider và truyền qua constructor. Truyền danh tính người dùng, policy phân quyền và transaction của từng lời gọi qua tham số phương thức. Dùng container hiện có và giữ policy dữ liệu của ứng dụng.

## Đăng ký cùng plugin

Thêm `server/providers/preview.ts`.

```ts
import { ServiceProvider, type ServiceContainer } from '@nocobase/service-provider';
import { announcementPreviewToken } from '../tokens.js';
import { DefaultAnnouncementPreviewService } from '../services/preview.js';

export interface AnnouncementPreviewApplication {
  readonly container: ServiceContainer;
}
export class AnnouncementPreviewProvider extends ServiceProvider<AnnouncementPreviewApplication> {
  public readonly name: string = '@nocobase/app-plugin-announcements/preview';
  public override register(): void {
    this.app.container.singleton(announcementPreviewToken, () => new DefaultAnnouncementPreviewService());
  }
}
```

Thêm constructor `AnnouncementPreviewProvider` vào mảng trong `server/providers/index.ts`. Kiểm tra `server/plugin.ts` đóng góp mảng qua `serviceProviders`. Giữ các Provider hiện có và để runtime tạo instance từ constructor.

Phép tính thuần túy này có thể chạy ngay sau đăng ký. Với tài nguyên cần khởi tạo bất đồng bộ, dùng các phương thức vòng đời. Chỉ giải phóng lượt đăng ký hoặc kết nối do plugin tạo, kể cả khi khởi động dở dang. Xem [Khởi động và vòng đời ứng dụng](../framework/runtime/lifecycle.md) về giai đoạn và thứ tự dependency.

## Công khai và sử dụng dịch vụ

Giữ giá trị xuất mặc định trong `server/index.ts` và thêm token công khai cùng các kiểu.

```ts
export { announcementPreviewToken } from './tokens.js';
export type { AnnouncementPreview, AnnouncementPreviewService } from './tokens.js';
```

Sau khi đăng ký trong `server/plugins.ts` của ứng dụng, API hoặc plugin khác import token gốc từ `@nocobase/app-plugin-announcements/server` và gọi qua container hiện tại. Dùng điểm xuất công khai để chia sẻ đúng token thay vì tạo token mới cùng tên hoặc import tệp nội bộ `server/services/preview.ts`.

Sau khi kiểm tra đầu vào của route, gọi `app.container.resolve(announcementPreviewToken).preview(text)` và trả kết quả theo hợp đồng HTTP. Xem [Route và HTTP API](server-apis.md) về khai báo và bảo vệ endpoint.

CLI phân giải cùng token trong `this.withApp(async ({ app }) => ...)` rồi trả kết quả. Ứng dụng phải đăng ký điểm vào Server để có dịch vụ. Phép xem trước thuần túy chỉ cần đăng ký. Với dịch vụ phụ thuộc tài nguyên đang chạy, khởi động qua `app.start()` theo hợp đồng. Xem [Mở rộng dòng lệnh](extend-command-line.md) về đối số và lỗi.

Bên sử dụng lấy giao diện từ điểm vào công khai. Lớp triển khai và Provider có thể giữ nội bộ. Xem [Khai báo và điểm xuất công khai](plugin-declarations.md) về dependency package, đăng ký runtime và thứ tự gọi.

## Kiểm chứng hợp đồng công khai và tích hợp

Đặt đoạn sau trong `tests/server/service-provider.test.ts`, hợp nhất hoặc thay assertion liên quan.

```ts
import { ServiceContainer } from '@nocobase/service-provider';
import { expect, it } from 'vitest';
import { announcementPreviewToken } from '../../server/index.js';
import { AnnouncementPreviewProvider } from '../../server/providers/preview.js';

it('registers one lazy service behind the public Token', () => {
  const container = new ServiceContainer();
  expect(() => container.resolve(announcementPreviewToken)).toThrow();
  new AnnouncementPreviewProvider({ container }).register();
  expect(container.resolveIfCreated(announcementPreviewToken)).toBeUndefined();
  const service = container.resolve(announcementPreviewToken);
  expect(service.preview('  欢迎 👋  ')).toEqual({ text: '欢迎 👋', length: 4 });
  expect(container.resolve(announcementPreviewToken)).toBe(service);
});
```

Bài kiểm thử xác nhận token công khai, khởi tạo khi cần và định danh dùng chung. Kiểm tra thêm khai báo Server thật có Provider, rồi gọi điểm vào HTTP hoặc CLI trong ứng dụng đích. Với cơ sở dữ liệu, phân quyền và transaction, dùng bài kiểm thử ứng dụng thật để xác nhận tích hợp.

```bash
pnpm --filter @nocobase/app-plugin-announcements check
pnpm nocobase plugin register @nocobase/app-plugin-announcements --no-install --dry-run
pnpm nocobase plugin register @nocobase/app-plugin-announcements --no-install
pnpm build
```

Dịch vụ Client và Server chạy trong container riêng. Trình duyệt gọi dịch vụ này qua API. Phần triển khai Server vẫn ở phía server.
