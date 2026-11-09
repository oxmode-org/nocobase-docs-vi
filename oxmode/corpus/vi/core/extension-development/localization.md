---
title: Bản địa hóa phía client
description: Tổ chức tài nguyên Client, namespace và component công khai, rồi kiểm chứng hiển thị và chuyển ngôn ngữ.
---

Plugin quản lý nội dung của mình. Ứng dụng quyết định danh sách ngôn ngữ cung cấp và quản lý lựa chọn của người dùng. Bài này hướng dẫn duy trì `client/locales/`. Xem [Bản địa hóa phía server](server-localization.md) cho nội dung theo yêu cầu và thông báo nền. Client và Server khai báo tài nguyên riêng, cùng dùng tên package đầy đủ làm namespace.

## Cùng Agent

```text
Thêm bản dịch do plugin quản lý cho menu, phản hồi trên trang và thông báo lỗi.
Gắn namespace của plugin tường minh trong các component được xuất.
Hoàn thiện các tệp ngôn ngữ đã sinh rồi kiểm tra tiếng Anh, tiếng Trung và chuyển ngôn ngữ.
Giữ lựa chọn ngôn ngữ do ứng dụng quản lý.
```

## Tạo tài nguyên ngôn ngữ

Chạy từ gốc ứng dụng. Các đường dẫn bên dưới tính từ `packages/app-plugin-notice-i18n/`.

```bash
pnpm create @nocobase/plugin@beta notice-i18n --with client.components --with client.locales
```

`client.locales` tạo tài nguyên và loader nạp theo nhu cầu, rồi kết nối vào `client/plugin.ts`. Khi thêm bản địa hóa cho plugin hiện có, cung cấp cả tệp tài nguyên, loader và khai báo `locales` để runtime đăng ký và nạp bản dịch.

<h2 id="define-keys-in-english">Định nghĩa khóa bằng tiếng Anh</h2>

Thay nội dung `client/locales/en-US.ts`.

```ts
import type { LocaleResource } from '@nocobase/i18n';
const enUS = {
  layout: 'Layout: {{mode}}',
  compact: 'Compact',
  comfortable: 'Comfortable',
};
export type NoticeI18NResource = LocaleResource<typeof enUS>;
export default enUS;
```

Thay nội dung `client/locales/zh-CN.ts`.

```ts
import type { NoticeI18NResource } from './en-US.js';
const resource: NoticeI18NResource = {
  layout: '布局：{{mode}}',
  compact: '紧凑',
  comfortable: '舒适',
};
export default resource;
```

Dùng khóa ổn định theo ngữ nghĩa và nội suy giá trị động như `{{mode}}`. Dùng kiểu tài nguyên đầy đủ cho mỗi ngôn ngữ để kiểm tra thiếu khóa khi biên dịch.

Khung cũng sinh tám ngôn ngữ khác. Điền các giá trị sau vào tệp tương ứng, giữ cùng khóa và kiểu tài nguyên. Đặt tên biến theo locale, chẳng hạn `zhTW` và `jaJP`.

| Locale | `layout` | `compact` | `comfortable` |
| --- | --- | --- | --- |
| `zh-TW` | 版面配置：{{mode}} | 緊湊 | 舒適 |
| `ja-JP` | レイアウト：{{mode}} | コンパクト | ゆったり |
| `es-ES` | Diseño: {{mode}} | Compacto | Cómodo |
| `pt-BR` | Layout: {{mode}} | Compacto | Confortável |
| `fr-FR` | Disposition : {{mode}} | Compacte | Confortable |
| `de-DE` | Layout: {{mode}} | Kompakt | Komfortabel |
| `vi-VN` | Bố cục: {{mode}} | Gọn | Thoải mái |
| `id-ID` | Tata letak: {{mode}} | Ringkas | Nyaman |

Giữ import động cho mỗi ngôn ngữ trong `client/locales/index.ts` để nạp theo nhu cầu. Khi thêm khóa tiếng Anh, tài nguyên còn thiếu khóa sẽ không đạt kiểm tra kiểu. Bổ sung bản dịch và giữ loader.

## Dùng bản dịch trong component

Thay nội dung `client/components/plugin-component.tsx` do công cụ sinh.

```tsx
import { useTranslation } from '@nocobase/i18n/client';
import type { ReactElement } from 'react';

export function NoticeLabel(): ReactElement {
  const { t } = useTranslation('@nocobase/app-plugin-notice-i18n');
  return <p>{t('layout', { mode: t('comfortable') })}</p>;
}
```

Trang và cây React Provider do plugin đóng góp kế thừa namespace, nên có thể gọi `useTranslation()` mà không cần đối số. Component này cũng có thể được render từ ứng dụng hoặc plugin khác, vì vậy nó gắn namespace package tường minh.

Ứng dụng vẫn cần đăng ký factory Client trong `client/plugins.ts` để nạp tài nguyên. Ví dụ giữ điểm xuất công khai `./client/components/plugin-component` để ứng dụng có thể import `NoticeLabel`. Với component công khai khác, duy trì cả ánh xạ mã nguồn và ánh xạ `publishConfig.exports` như trong [Cấu trúc plugin](plugin-structure.md).

<span id="server-copy-has-separate-resources"></span>

Xem [Bản địa hóa phía server](server-localization.md) để khai báo tài nguyên server, dịch theo yêu cầu và gửi thông báo nền.

## Kiểm chứng cấu trúc và hiển thị

Thay nội dung `tests/client/component.test.tsx` do công cụ sinh. Render component qua React để Hook hoạt động đúng vòng đời.

```tsx
import {
  createTestI18nRuntime,
  TestI18nProvider,
} from '@nocobase/i18n/testing';
import { renderWithApp } from '@nocobase/app-testing/client';
import { act, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import plugin from '../../client/index.js';
import locales from '../../client/locales/index.js';
import { NoticeLabel } from '../../client/components/plugin-component.js';

it.each([
  ['en-US', 'Layout: Comfortable'],
  ['zh-CN', '布局：舒适'],
])('renders the plugin namespace in %s', async (locale, text) => {
  await renderWithApp(<NoticeLabel />, { plugins: [plugin()], locale });
  expect(screen.getByText(text)).toBeInTheDocument();
});

it('updates a mounted component when the language changes', async () => {
  const runtime = await createTestI18nRuntime({
    namespaces: { '@nocobase/app-plugin-notice-i18n': locales },
  });
  render(
    <TestI18nProvider runtime={runtime}>
      <NoticeLabel />
    </TestI18nProvider>,
  );
  expect(screen.getByText('Layout: Comfortable')).toBeInTheDocument();
  await act(async () => {
    await runtime.changeLanguage('zh-CN');
  });
  expect(screen.getByText('布局：舒适')).toBeInTheDocument();
});
```

```bash
pnpm --filter @nocobase/app-plugin-notice-i18n format
pnpm --filter @nocobase/app-plugin-notice-i18n check
```

```bash
pnpm nocobase plugin register @nocobase/app-plugin-notice-i18n --no-install --dry-run
pnpm nocobase plugin register @nocobase/app-plugin-notice-i18n --no-install
```

Bài kiểm thử chủ đích bỏ `namespace` mặc định khi render để phát hiện component vô tình dựa vào namespace của host. Chuyển ngôn ngữ trong ứng dụng đang chạy rồi kiểm tra component đã mount, menu, định dạng ngày và lỗi. Xem [Kiểm chứng tích hợp server](server-localization.md#verify-integration) cho yêu cầu và thông báo nền.

Các plugin của NocoBase cung cấp mười ngôn ngữ. Ứng dụng có thể chọn một tập con. Để thêm mục vào bộ chọn ngôn ngữ, cập nhật cấu hình ứng dụng. Ứng dụng có thể ghi đè cách diễn đạt theo sản phẩm trong phần ghi đè locale. Bổ sung bản dịch chung còn thiếu ở mã nguồn plugin.

Chạy kiểm tra kiểu và kiểm thử hành vi của plugin trong một ứng dụng độc lập. `pnpm i18n:check` là script của repo nguồn NocoBase. Dùng các script thực sự có trong ứng dụng hiện tại.
