---
title: Dịch vụ phía client của plugin
description: Đăng ký dịch vụ Client, chia sẻ qua token và kết nối cơ chế đăng ký thay đổi với React.
---

Plugin có thể phát thông báo thay đổi khi nhiều trang cần tải lại danh sách thông báo. Dịch vụ báo rằng dữ liệu đã lưu. Các trang tải dữ liệu và hiển thị phản hồi. Ví dụ giữ số phiên bản thay đổi trong một instance ứng dụng trên trình duyệt. Thao tác lưu, cache yêu cầu và đồng bộ giữa các trình duyệt cần phần triển khai riêng.

Xem [Dịch vụ client của ứng dụng](../developing-apps/client-business-services.md) để tổ chức dịch vụ cấp ứng dụng và [Container dịch vụ](../framework/services/container.md) về cơ chế dùng chung. Bài này tập trung vào đăng ký plugin, hợp đồng công khai và đăng ký nhận thay đổi trong React.

## Điều kiện tiên quyết và tệp

Thêm dịch vụ Client vào `@nocobase/app-plugin-announcements` hiện có. Có thể thực hiện độc lập với các bài Context và cơ sở dữ liệu. Đường dẫn tính từ gốc plugin. Với plugin mới, chọn `client.service-providers`. Với plugin hiện có, hợp nhất các tệp và khai báo sau. Giữ peer dependency tương thích cho `@nocobase/service-provider`, React và runtime Client.

## Cùng Agent

```text
Thêm dịch vụ Client báo thay đổi cho plugin thông báo. Dùng chung một instance
qua token gốc. Chỉ báo cho các trang sau khi lưu thành công. Cung cấp Hook
useSyncExternalStore với snapshot ổn định, hủy đăng ký khi unmount và giải phóng
listener do dịch vụ sở hữu khi tắt ứng dụng. Giữ các đóng góp Client hiện có
và kiểm thử đăng ký thực tế.
```

## Định nghĩa dịch vụ và token

Thêm `client/services/changes.ts` để tổ chức phần triển khai. Đăng ký dịch vụ qua Provider ở bước sau. Ví dụ nhỏ này đặt hợp đồng, token và phần triển khai cùng tệp. Plugin lớn có thể tách riêng.

```ts
import { createServiceToken, type ServiceToken } from '@nocobase/service-provider';

export interface AnnouncementChanges {
  getSnapshot(): number;
  subscribe(listener: () => void): () => void;
  notifySaved(): void;
}
export const announcementChangesToken: ServiceToken<AnnouncementChanges> =
  createServiceToken<AnnouncementChanges>('@nocobase/app-plugin-announcements/changes');

export class DefaultAnnouncementChanges implements AnnouncementChanges {
  private revision: number = 0;
  private readonly listeners: Set<() => void> = new Set();

  public readonly getSnapshot = (): number => this.revision;
  public readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  public notifySaved(): void {
    this.revision += 1;
    for (const listener of this.listeners) listener();
  }
  public dispose(): void {
    this.listeners.clear();
  }
}
```

`getSnapshot()` trả cùng giá trị cho tới khi có thông báo, để React nhận biết thay đổi. `subscribe()` trả hàm hủy đăng ký. Chỉ Provider sở hữu dịch vụ gọi `dispose()`. Hàm này nằm ngoài hợp đồng của bên sử dụng.

## Đăng ký và giải phóng qua Provider

Thêm hoặc hợp nhất `client/providers/announcements.ts`.

```ts
import type { ClientApplication } from '@nocobase/app-client';
import { ServiceProvider } from '@nocobase/service-provider';
import {
  DefaultAnnouncementChanges,
  announcementChangesToken,
} from '../services/changes.js';

export class AnnouncementChangesProvider extends ServiceProvider<ClientApplication> {
  public readonly name: string = '@nocobase/app-plugin-announcements/changes';
  private changes: DefaultAnnouncementChanges | undefined;
  public override register(): void {
    this.app.container.singleton(announcementChangesToken, () => {
      this.changes = new DefaultAnnouncementChanges();
      return this.changes;
    });
  }
  public override async shutdown(): Promise<void> {
    this.changes?.dispose();
    this.changes = undefined;
  }
}
```

Tham chiếu nội bộ chỉ giữ instance do Provider này tạo. Khi tắt, Provider chỉ dọn instance đã được tạo và để ứng dụng quản lý API Client dùng chung cùng tài nguyên của plugin khác.

Thêm constructor `AnnouncementChangesProvider` vào mảng trong `client/providers/index.ts`. Kiểm tra `client/plugin.ts` đóng góp mảng đó qua `serviceProviders`. Giữ các Provider khác, để runtime tạo instance và chỉ đăng ký một phần triển khai cho mỗi token. Xem [ServiceProvider](service-provider.md) về đăng ký và vòng đời.

## Đăng ký nhận từ React

Thêm `client/hooks/use-announcement-revision.ts`.

```ts
import { useSyncExternalStore } from 'react';
import { useService } from '@nocobase/app-client';
import { announcementChangesToken } from '../services/changes.js';

export function useAnnouncementRevision(): number {
  const changes = useService(announcementChangesToken);
  return useSyncExternalStore(changes.subscribe, changes.getSnapshot, changes.getSnapshot);
}
```

`useService()` phân giải instance. `useSyncExternalStore()` đăng ký nhận và tự hủy khi component unmount. Khi số phiên bản thay đổi, trang có thể dùng logic tải lại hiện có và giữ cơ chế hủy cũng như xử lý phản hồi cũ. Xem [Yêu cầu dữ liệu và quản lý trạng thái](../developing-apps/data-requests-and-state.md).

Tại điểm lưu, phân giải `announcementChangesToken` từ cùng container và gọi `notifySaved()` sau khi thao tác lưu thật thành công. Đặt lời gọi trên nhánh thành công thay vì trong `finally`. Xác nhận dữ liệu qua kết quả lưu. Dùng API nghiệp vụ có phân quyền hiện có để ghi. Muốn cập nhật trình duyệt hoặc tiến trình khác, bổ sung cơ chế thông báo phía server.

## Công khai hợp đồng và tích hợp vào ứng dụng

Giữ giá trị xuất mặc định của plugin trong `client/index.ts` và thêm:

```ts
export { announcementChangesToken } from './services/changes.js';
export type { AnnouncementChanges } from './services/changes.js';
export { useAnnouncementRevision } from './hooks/use-announcement-revision.js';
```

Bên sử dụng import token gốc hoặc Hook từ điểm vào công khai và đăng ký factory trong `client/plugins.ts` của ứng dụng. Dùng token gốc để giữ đúng định danh. Hook dùng dịch vụ do factory đã đăng ký. Xem [Điểm xuất công khai](plugin-declarations.md#public-exports) về đường dẫn package và ánh xạ mã biên dịch.

## Kiểm chứng hành vi

Đặt bài kiểm thử hành vi trong `tests/client/service-provider.test.tsx`. Cập nhật assertion từ khung và giữ các bài kiểm thử hợp lệ khác.

```tsx
import { act, screen } from '@testing-library/react';
import { renderWithApp } from '@nocobase/app-testing/client';
import type { ReactElement } from 'react';
import { expect, it, vi } from 'vitest';
import plugin from '../../client/index.js';
import { announcementChangesToken } from '../../client/services/changes.js';
import { useAnnouncementRevision } from '../../client/hooks/use-announcement-revision.js';

function Revision({ id }: { id: string }): ReactElement {
  return <output data-testid={id}>{useAnnouncementRevision()}</output>;
}
it('shares revisions and releases listeners', async () => {
  const view = await renderWithApp(<><Revision id="a" /><Revision id="b" /></>, {
    plugins: [plugin()],
  });
  const changes = view.app.container.resolve(announcementChangesToken);
  act(() => changes.notifySaved());
  expect(screen.getByTestId('a').textContent).toBe('1');
  expect(screen.getByTestId('b').textContent).toBe('1');
  const listener = vi.fn();
  const stop = changes.subscribe(listener);
  stop();
  act(() => changes.notifySaved());
  expect(listener).not.toHaveBeenCalled();
  changes.subscribe(listener);
  view.unmount();
  await view.app.shutdown();
  changes.notifySaved();
  expect(listener).not.toHaveBeenCalled();
});
```

Kiểm chứng thành công, lỗi và hủy tại điểm lưu thực tế. Chỉ thao tác ghi thành công làm đổi số phiên bản. Hai bên sử dụng nhận cùng thông báo. Component đã unmount ngừng cập nhật. Khi tắt ứng dụng, Provider giải phóng listener do mình sở hữu.

```bash
pnpm --filter @nocobase/app-plugin-announcements check
pnpm nocobase plugin register @nocobase/app-plugin-announcements --no-install --dry-run
pnpm nocobase plugin register @nocobase/app-plugin-announcements --no-install
pnpm build
```

Tùy chọn hiển thị do Context quản lý và trạng thái dịch vụ có bên sở hữu riêng. Đọc số phiên bản trực tiếp từ dịch vụ.
