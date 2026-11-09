---
title: React Context và Provider
description: Định nghĩa tùy chọn hiển thị, tích hợp React Provider và kiểm chứng trạng thái dùng chung cùng phạm vi mount.
---

Bài này thêm tùy chọn hiển thị gọn cho trang thông báo, kết nối `contexts.ts`, component Provider và `react-providers/`. React quản lý trạng thái, nên ví dụ có thể chạy chỉ với mã Client. Xem [Component UI và tương tác](../developing-apps/pages-and-interactions.md) về Context và [Đăng ký React Provider](../framework/runtime/react-providers.md) về cách mount và thứ tự.

## Điều kiện tiên quyết và tệp

Dùng `@nocobase/app-plugin-announcements` từ [Viết plugin đầu tiên](write-your-first-plugin.md). Ví dụ chỉ cần điểm vào Client. Đường dẫn tính từ gốc plugin. Chạy lệnh từ gốc ứng dụng. Hợp nhất các tệp và khai báo, giữ trang, locale và các đóng góp hiện có.

Plugin mới có thể chọn `client.react-providers`. Với plugin đã có, bổ sung các tệp dưới đây. Giữ `react` là peer dependency tương thích và dùng cấu hình kiểm thử jsdom từ khung.

## Cùng Agent

```text
Thêm tùy chọn hiển thị gọn dùng chung qua React Context trong plugin thông báo.
Đăng ký Provider qua reactProviders và giữ route cùng locale hiện có.
Giữ tùy chọn trong bộ nhớ. Khi tải lại, trở về giá trị mặc định.
Kiểm chứng các component cùng cập nhật bằng cách render khai báo plugin Client
thật qua React, để Hook chạy trong đúng vòng đời.
```

## Định nghĩa Context

Thêm hoặc hợp nhất `client/contexts.ts`. Báo lỗi rõ khi thiếu Provider để phát hiện lỗi tích hợp.

```ts
import { createContext, useContext, type Context } from 'react';

export interface AnnouncementDisplay {
  readonly compact: boolean;
  readonly setCompact: (value: boolean) => void;
}
export const AnnouncementDisplayContext: Context<AnnouncementDisplay | undefined> =
  createContext<AnnouncementDisplay | undefined>(undefined);

export function useAnnouncementDisplay(): AnnouncementDisplay {
  const value = useContext(AnnouncementDisplayContext);
  if (!value) throw new Error('AnnouncementDisplayProvider is required.');
  return value;
}
```

## Triển khai Provider

Duy trì trạng thái trong `client/components/provider.tsx`. Các component dùng cùng instance Provider nhận chung giá trị. Ứng dụng riêng hoặc Provider lồng thêm có trạng thái riêng.

```tsx
import { useMemo, useState, type PropsWithChildren, type ReactElement } from 'react';
import { AnnouncementDisplayContext, type AnnouncementDisplay } from '../contexts.js';

export function AnnouncementDisplayProvider({ children }: PropsWithChildren): ReactElement {
  const [compact, setCompact] = useState(false);
  const value = useMemo<AnnouncementDisplay>(
    () => ({ compact, setCompact }),
    [compact],
  );
  return (
    <AnnouncementDisplayContext.Provider value={value}>
      {children}
    </AnnouncementDisplayContext.Provider>
  );
}
```

Ví dụ không dùng tài nguyên bên ngoài nên có thể bỏ Effect. Nếu thêm đăng ký nhận sự kiện trình duyệt, trả hàm dọn dẹp từ Effect và hỗ trợ kiểm tra mount lại trong chế độ phát triển. Trạng thái chỉ thuộc cây hiện tại và được đặt lại khi tải lại trang hoặc khi Provider mount lại.

## Khai báo và tích hợp đóng góp của plugin

Tập hợp React Provider trong `client/react-providers/index.ts`.

```ts
import {
  defineClientReactProviders,
  type AppClientReactProviderDefinition,
} from '@nocobase/app-client/plugins';
import { AnnouncementDisplayProvider } from '../components/provider.js';

const reactProviders: readonly AppClientReactProviderDefinition[] = defineClientReactProviders([
  {
    name: 'announcements-display',
    layer: 'extension',
    component: AnnouncementDisplayProvider,
  },
]);
export default reactProviders;
```

Dùng tên đóng góp ổn định như `announcements-display`. Chọn tên đơn giản, tránh đường dẫn package có `@` hoặc `/`. Runtime theo dõi plugin sở hữu ở metadata riêng. Chỉ khai báo thứ tự khi Provider thực sự phụ thuộc Context khác và tuân theo quy tắc framework.

Import tập hợp này trong `client/plugin.ts` rồi thêm `reactProviders` vào khai báo `defineClientPlugin()` hiện có. Giữ `packageName`, `routes`, `locales` và dịch vụ đang dùng. Giữ factory được xuất từ `client/index.ts`. Khi ứng dụng đăng ký factory trong `client/plugins.ts`, runtime gắn Provider vào cây ứng dụng.

Component đọc `compact` và `setCompact` qua `useAnnouncementDisplay()`. Trang thông báo có thể truyền `compact` xuống danh sách và gọi `setCompact()` từ điều khiển shadcn hiện có, với nhãn từ bản dịch plugin. Dùng Provider đã gắn vào cây ứng dụng để các trang chia sẻ trạng thái.

Để công khai Hook cho ứng dụng hoặc plugin khác, giữ giá trị xuất mặc định và thêm điểm xuất có tên trong `client/index.ts`.

```ts
export { useAnnouncementDisplay } from './contexts.js';
```

Bên sử dụng cần đăng ký plugin để runtime mount Provider trước khi gọi Hook. Xem [Khai báo và điểm xuất công khai của plugin](plugin-declarations.md).

## Kiểm chứng trạng thái dùng chung và tích hợp

Thay bài kiểm thử trong khung nếu nó gọi trực tiếp hàm Provider. Provider dùng Hook nên cần render qua React. Lưu dưới tên `tests/client/react-provider.test.tsx`. Các nút HTML trong ví dụ chỉ dùng để kiểm thử tương tác.

```tsx
import { fireEvent, screen } from '@testing-library/react';
import { renderWithApp } from '@nocobase/app-testing/client';
import type { ReactElement } from 'react';
import { expect, it } from 'vitest';
import plugin from '../../client/index.js';
import { useAnnouncementDisplay } from '../../client/contexts.js';

function Consumer({ id }: { id: string }): ReactElement {
  const { compact, setCompact } = useAnnouncementDisplay();
  return <button onClick={() => setCompact(!compact)}>{id}:{String(compact)}</button>;
}

it('shares display state through the registered plugin Provider', async () => {
  const view = await renderWithApp(<><Consumer id="a" /><Consumer id="b" /></>, {
    plugins: [plugin()],
  });
  fireEvent.click(screen.getByText('a:false'));
  expect(screen.getByText('a:true')).toBeDefined();
  expect(screen.getByText('b:true')).toBeDefined();
  view.unmount();
});
```

Kiểm tra thêm trường hợp thiếu đăng ký, giá trị mặc định sau khi mount lại và dọn dẹp nếu có thêm đăng ký nhận. `renderWithApp()` đã cung cấp ngữ cảnh ứng dụng và router. Dùng router của helper.

```bash
pnpm --filter @nocobase/app-plugin-announcements check
pnpm nocobase plugin register @nocobase/app-plugin-announcements --no-install --dry-run
pnpm nocobase plugin register @nocobase/app-plugin-announcements --no-install
pnpm build
```

Chạy các lệnh đăng ký khi thêm hoặc kiểm tra tích hợp, đồng thời giữ các điểm vào đã có. Bài kiểm thử xác nhận Context được kết nối và trạng thái cập nhật. Trên trang thật, kiểm tra thêm mật độ hiển thị, điều hướng và theme.
