---
title: ServiceProvider và vòng đời dịch vụ
description: Tìm hiểu hợp đồng, token, đăng ký và vòng đời dịch vụ ở cả Client và Server.
---

ServiceProvider kết nối dịch vụ plugin với container ứng dụng, phụ trách khởi động và dọn dẹp tài nguyên của dịch vụ. Client và Server dùng cùng cơ chế nhưng chạy trong môi trường, container và instance riêng.

Đặt hành vi nghiệp vụ trong dịch vụ. Đặt đăng ký và vòng đời tài nguyên trong Provider. Hàm thuần túy chỉ có một nơi gọi thường có thể dùng trực tiếp. Dùng ServiceProvider khi nhiều điểm vào dùng chung hành vi, cần thay phần triển khai hoặc cần quản lý vòng đời tài nguyên.

Xem [Dịch vụ client](client-services.md) và [Dịch vụ nghiệp vụ và ServiceProvider](server-services.md) để tích hợp theo runtime, và [Tác vụ nền và executor](background-jobs.md) để quản lý tài nguyên tác vụ. Bài này giải thích container và vòng đời dùng chung. Xem [React Context và Provider](react-context-and-providers.md) cho ngữ cảnh cây component.

## Cùng Agent

```text
Tổ chức ServiceProvider cho tính năng thông báo, gồm dịch vụ xem trước văn bản
dùng lại ở Server và tùy chọn bố cục dùng chung ở Client. Đăng ký từng dịch vụ
trong container tương ứng, làm rõ token và điểm vào công khai, rồi kiểm thử
việc khởi tạo khi cần và tái sử dụng instance.
```

## Chuẩn bị plugin

Ví dụ có tên `notice-services`. Chạy lệnh từ gốc ứng dụng. Các đường dẫn tính từ `packages/app-plugin-notice-services/`.

```bash
pnpm create @nocobase/plugin@beta notice-services --with server.service-providers --with client.service-providers
```

Khung kết nối Provider, tệp tổng hợp và khai báo ở cả hai phía. Giữ các kết nối đó khi triển khai dịch vụ.

## Server: hợp đồng, token, triển khai và đăng ký

Thay nội dung `server/tokens.ts`.

```ts
import {
  createServiceToken,
  type ServiceToken,
} from '@nocobase/service-provider';

export interface NoticePreview {
  readonly text: string;
  readonly length: number;
}
export interface NoticeServicesService {
  preview(text: string): NoticePreview;
}
export const noticeServicesServiceToken: ServiceToken<NoticeServicesService> =
  createServiceToken<NoticeServicesService>(
    '@nocobase/app-plugin-notice-services/service',
  );
```

Thay nội dung `server/services/notice-services.ts`.

```ts
import type { NoticePreview, NoticeServicesService } from '../tokens.js';

export class DefaultNoticeServicesService implements NoticeServicesService {
  public preview(text: string): NoticePreview {
    const normalized = text.trim();
    return { text: normalized, length: Array.from(normalized).length };
  }
}
```

Giữ mẫu đăng ký đã sinh trong `server/providers/notice-services.ts`.

```ts
import {
  ServiceProvider,
  type ServiceContainer,
} from '@nocobase/service-provider';

import { DefaultNoticeServicesService } from '../services/notice-services.js';
import { noticeServicesServiceToken } from '../tokens.js';

export interface NoticeServicesProviderApplication {
  readonly container: ServiceContainer;
}

export class NoticeServicesProvider extends ServiceProvider<NoticeServicesProviderApplication> {
  public readonly name: string = '@nocobase/app-plugin-notice-services';

  public override register(): void {
    this.app.container.singleton(
      noticeServicesServiceToken,
      () => new DefaultNoticeServicesService(),
    );
  }
}
```

`singleton` tạo giá trị ở lần phân giải đầu tiên rồi trả lại cùng instance trong một container ứng dụng. `instance(token, value)` đăng ký giá trị đã có. Factory chạy đồng bộ. Thực hiện chuẩn bị bất đồng bộ trong phương thức vòng đời.

`server/providers/index.ts` xuất các constructor Provider. `server/plugin.ts` đóng góp chúng qua `serviceProviders`. Để runtime tạo instance từ constructor, mở kết nối và chạy timer ở đúng giai đoạn.

Route và Provider khác dùng `app.container.resolve(noticeServicesServiceToken)`. Để công khai dịch vụ cho plugin khác, giữ giá trị xuất mặc định trong `server/index.ts` và thêm:

```ts
export { noticeServicesServiceToken } from './tokens.js';
export type { NoticeServicesService, NoticePreview } from './tokens.js';
```

Bên sử dụng import token gốc từ `@nocobase/app-plugin-notice-services/server`. Tạo token bằng cùng chuỗi vẫn sinh định danh mới. Khai báo runtime dùng chung `@nocobase/service-provider` làm peer dependency để các bên dùng cùng định danh.

## Dịch vụ và container riêng ở Client

Tạo `client/services/preferences.ts`.

```ts
import {
  createServiceToken,
  type ServiceToken,
} from '@nocobase/service-provider';

export interface NoticePreferences {
  isCompact(): boolean;
  setCompact(value: boolean): void;
}
export const noticePreferencesToken: ServiceToken<NoticePreferences> =
  createServiceToken<NoticePreferences>(
    '@nocobase/app-plugin-notice-services/preferences',
  );

export class DefaultNoticePreferences implements NoticePreferences {
  private compact = false;
  public isCompact(): boolean {
    return this.compact;
  }
  public setCompact(value: boolean): void {
    this.compact = value;
  }
}
```

Thay nội dung `client/providers/notice-services.ts`.

```ts
import type { ClientApplication } from '@nocobase/app-client';
import { ServiceProvider } from '@nocobase/service-provider';
import {
  DefaultNoticePreferences,
  noticePreferencesToken,
} from '../services/preferences.js';

export class NoticeServicesServiceProvider extends ServiceProvider<ClientApplication> {
  public readonly name: string = '@nocobase/app-plugin-notice-services';
  public override register(): void {
    this.app.container.singleton(
      noticePreferencesToken,
      () => new DefaultNoticePreferences(),
    );
  }
}
```

Giữ đăng ký trong `client/providers/index.ts` và `client/plugin.ts`. Trong component React hiện có, gọi `useService(noticePreferencesToken)` từ `@nocobase/app-client`. Hàm thông thường có thể nhận dịch vụ qua đối số để tránh phụ thuộc biến container toàn cục.

Tùy chọn chỉ thuộc instance ứng dụng trình duyệt hiện tại và trở về mặc định khi tải lại. Để UI render lại khi gọi `setCompact()`, dùng state, cơ chế đăng ký theo dõi hoặc React Provider. ServiceProvider quản lý dịch vụ. React Provider cấp Context cho cây component. Để lưu tùy chọn lâu dài, dùng API nối client với server.

## Trách nhiệm theo vòng đời

| Giai đoạn | Việc phù hợp |
| --- | --- |
| `register()` | Đăng ký đồng bộ instance và factory tạo khi cần. Để thao tác mạng hoặc cơ sở dữ liệu ở giai đoạn sau |
| `boot()` | Kiểm tra dependency và chuẩn bị bất đồng bộ |
| `start()` | Khởi chạy đăng ký nhận, kết nối, consumer hoặc timer do Provider sở hữu |
| `ready()` | Hoàn tất chuẩn bị nội bộ sau khi mọi Provider đã khởi chạy |
| `shutdown()` | Dừng và đợi dọn xong tài nguyên do Provider sở hữu |

Tất cả Provider hoàn tất một giai đoạn trước khi chuyển sang giai đoạn kế. Khi tắt, runtime chạy theo thứ tự ngược. Factory route server chạy sau `boot()` và trước `start()`. Factory có thể phân giải dịch vụ trong khi công việc nền chưa bắt đầu. Kiểm tra cổng HTTP bên ngoài riêng với `ready()`.

Dọn dẹp phải xử lý được khởi động dở dang và dịch vụ chưa được tạo. Dùng `resolveIfCreated()` để chỉ lấy instance đã có khi cần đóng. Provider chỉ giải phóng tài nguyên mình sở hữu. Ứng dụng quản lý cơ sở dữ liệu và logger dùng chung. Ví dụ này chỉ cần hook đăng ký vì không có tài nguyên bên ngoài.

## Kiểm thử đăng ký dịch vụ

Thay nội dung `tests/server/service-provider.test.ts` do công cụ sinh.

```ts
import { ServiceContainer } from '@nocobase/service-provider';
import { describe, expect, it } from 'vitest';
import { NoticeServicesProvider } from '../../server/providers/notice-services.js';
import { noticeServicesServiceToken } from '../../server/tokens.js';

describe('notice service', () => {
  it('registers a lazy singleton and normalizes text', () => {
    const container = new ServiceContainer();
    new NoticeServicesProvider({ container }).register();
    expect(container.resolveIfCreated(noticeServicesServiceToken)).toBeUndefined();
    const service = container.resolve(noticeServicesServiceToken);
    expect(service.preview('  欢迎 👋  ')).toEqual({
      text: '欢迎 👋',
      length: 4,
    });
    expect(container.resolve(noticeServicesServiceToken)).toBe(service);
  });
});
```

```bash
pnpm --filter @nocobase/app-plugin-notice-services format
pnpm --filter @nocobase/app-plugin-notice-services check
```

```bash
pnpm nocobase plugin register @nocobase/app-plugin-notice-services --no-install --dry-run
pnpm nocobase plugin register @nocobase/app-plugin-notice-services --no-install
```

Chạy thử một bên sử dụng Server và một trang Client trong ứng dụng, rồi chạy `pnpm build` của ứng dụng. Kiểm thử container xác nhận đăng ký dịch vụ. Kiểm tra riêng luồng tích hợp. Bài kiểm thử client có thể đăng ký plugin thật với `renderWithApp()`. Xem [Kiểm thử và kiểm chứng](testing-and-verification.md).
