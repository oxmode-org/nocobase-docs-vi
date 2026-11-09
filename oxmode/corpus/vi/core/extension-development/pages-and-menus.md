---
title: Trang, route và menu của plugin
description: Thêm trang, điều hướng và chế độ xem lồng nhau, cùng route mặc định và quy tắc truy cập.
---

Plugin đóng góp trang qua khai báo route. Các khai báo này cũng cung cấp menu cho ứng dụng. Bài này xây trung tâm trợ giúp có một mục ở thanh bên và hai chế độ xem, Hướng dẫn và FAQ. Khi tải lại hoặc chia sẻ URL, chế độ xem đang chọn được giữ.

[Viết plugin đầu tiên](write-your-first-plugin.md) nối một trang với API. Bài này tập trung vào tổ chức trang và điều hướng, chỉ cần năng lực Client.

`routes.ts` tham chiếu component trang. `client/plugin.ts` tập hợp route. Ứng dụng nạp chúng bằng cách đăng ký factory Client. Xem [Component và style](frontend-components.md) về triển khai component, [Tương tác UI](../developing-apps/pages-and-interactions.md) và [Yêu cầu dữ liệu và quản lý trạng thái](../developing-apps/data-requests-and-state.md) về biểu mẫu và trạng thái URL.

## Cùng Agent

Trong ứng dụng hiện có, mô tả tính năng.

```text
Tạo plugin help-center với mục Help center trong menu sau khi đăng nhập.
Thêm trang con Guide và FAQ, chọn Guide mặc định.
Giữ đúng chế độ xem khi chuyển trang, tải lại hoặc dùng lịch sử trình duyệt.
Hỗ trợ tiếng Anh và tiếng Trung. Dùng @nocobase/create-plugin, kiểm thử rồi đăng ký trong ứng dụng.
```

Các bước sau hướng dẫn triển khai thủ công.

## 1. Chuẩn bị plugin và component trang

Bắt đầu với ứng dụng đang hoạt động. Chạy mọi lệnh từ gốc ứng dụng. Đường dẫn tính từ `packages/app-plugin-help-center/`. Các lệnh dùng package đã phân phối và chạy được trong ứng dụng hiện có.

```bash
pnpm create @nocobase/plugin@beta help-center \
  --with client.routes --with client.locales

pnpm --filter @nocobase/app-plugin-help-center exec shadcn add \
  @nocobase/page-container @nocobase/page-header
```

Công cụ tạo plugin trong workspace `packages/` và khai báo dependency `workspace:*`. Trình cài component chép `PageContainer` và `PageHeader` vào `client/components/` của plugin. Với plugin đã tồn tại, chỉnh mã hiện có.

Trong `package.json` của plugin, chuyển các import runtime `react` và `react-router` từ `devDependencies` sang `peerDependencies`, giữ phiên bản đã sinh. Chuyển dependency `cn` mà trình cài component thêm sang `peerDependencies`, rồi chạy `pnpm install` từ gốc ứng dụng.

Giữ `client/plugin.ts` và `client/index.ts` do công cụ sinh. Tệp đầu kết nối route và locale. Tệp sau công khai điểm đăng ký. Xem [Tạo plugin](create-plugin.md) để chọn tùy chọn.

## 2. Khai báo trang và điều hướng

Thay nội dung `client/routes.ts`.

```ts
import {
  defineAppRoutes,
  type AppClientRouteContribution,
} from '@nocobase/app-client/plugins';

const routes: readonly AppClientRouteContribution[] = [
  defineAppRoutes([
    {
      name: 'help',
      path: '/help',
      auth: 'required',
      authz: 'skip',
      navigation: { title: 'title', order: 100 },
      breadcrumb: { title: 'title' },
      componentLoader: () => import('./pages/help/index.js'),
      children: [
        {
          name: 'helpGuide',
          path: 'guide',
          componentLoader: () => import('./pages/help/guide.js'),
        },
        {
          name: 'helpFaq',
          path: 'faq',
          componentLoader: () => import('./pages/help/faq.js'),
        },
      ],
    },
  ]),
];
export default routes;
```

| Trường | Công dụng |
| --- | --- |
| `name` | Tên route ổn định và duy nhất trong plugin, độc lập với tiêu đề hiển thị |
| `path` | URL trang. Trang con dùng đường dẫn tương đối như `guide` |
| `componentLoader` | Nạp theo nhu cầu mô-đun có giá trị xuất mặc định là component React |
| `navigation` | Thêm mục thanh bên. `title` là khóa dịch của plugin. `order` thấp hơn đứng trước |
| `breadcrumb` | Thêm cấp vào breadcrumb độc lập với `navigation` |
| `children` | Các trang con hiển thị tại `<Outlet />` của trang cha |

Khai báo `/help` tính từ gốc ứng dụng. Với tiền tố mặc định `/main`, URL trên trình duyệt là `/main/help`. Các trang con chỉ là chế độ xem bên trong trung tâm trợ giúp, nên không khai báo `navigation` hay cấp breadcrumb riêng.

`auth: 'required'` yêu cầu đăng nhập. `authz: 'skip'` cho phép trang trợ giúp mở sau đăng nhập mà không cần quyền trang bổ sung. Trang con kế thừa policy. Với trang nghiệp vụ, khai báo tài nguyên và thao tác, ví dụ `authz: { resource: { type: 'page', id: 'orders' }, action: 'access' }`, rồi cấu hình quyền trong ứng dụng. Các kiểm tra của trang cha vẫn áp dụng cho trang con. Kiểm tra quyền API riêng trên server.

## 3. Triển khai trang cha và trang con

Tạo `client/pages/help/index.tsx`.

```tsx
import { useTranslation } from '@nocobase/i18n/client';
import type { ReactElement } from 'react';
import {
  matchPath,
  Navigate,
  NavLink,
  Outlet,
  useLocation,
  useResolvedPath,
} from 'react-router';

import { PageContainer } from '#components/page-container';
import { PageHeader } from '#components/page-header';

export default function HelpPage(): ReactElement {
  const { t } = useTranslation();
  const location = useLocation();
  const parentPath = useResolvedPath('.');
  const isParentEntry = matchPath(
    { path: parentPath.pathname, end: true },
    location.pathname,
  );

  if (isParentEntry) {
    return (
      <Navigate to={{ pathname: 'guide', search: location.search }} replace />
    );
  }

  return (
    <PageContainer>
      <PageHeader title={t('title')} />
      <nav aria-label={t('sections')} className='flex gap-4 border-b pb-3'>
        <NavLink
          to={{ pathname: 'guide', search: location.search }}
          className='text-muted-foreground aria-[current=page]:font-medium aria-[current=page]:text-foreground'
        >
          {t('guide.title')}
        </NavLink>
        <NavLink
          to={{ pathname: 'faq', search: location.search }}
          className='text-muted-foreground aria-[current=page]:font-medium aria-[current=page]:text-foreground'
        >
          {t('faq.title')}
        </NavLink>
      </nav>
      <Outlet />
    </PageContainer>
  );
}
```

Trang cha cung cấp vùng chứa, tiêu đề và điều hướng dùng chung. `Outlet` xác định nơi hiện nội dung con. `NavLink` xác định mục đang chọn từ URL, nên dùng trực tiếp thay cho state `activeTab`. Đây là liên kết điều hướng với hành vi bàn phím chuẩn.

Chỉ URL cha chính xác `/help` chuyển tới `guide`. `replace` thay mục lịch sử để nút Back bỏ qua URL mặc định. `search` giữ tham số truy vấn. Mở trực tiếp `/help/faq` giữ FAQ. Xử lý mặc định trong component cha vì API khai báo route chưa có trường `index`.

Hai trang con dùng cùng policy. Nếu yêu cầu quyền khác nhau, chờ nạp xong quyền rồi chọn trang mặc định đầu tiên có thể truy cập. Nếu không có trang nào, hiện thông báo để tránh chuyển hướng lặp.

Tạo `client/pages/help/guide.tsx`.

```tsx
import { useTranslation } from '@nocobase/i18n/client';
import type { ReactElement } from 'react';

export default function GuidePage(): ReactElement {
  const { t } = useTranslation();
  return (
    <section className='space-y-2'>
      <h2 className='text-lg font-semibold'>{t('guide.title')}</h2>
      <p className='text-sm text-muted-foreground'>{t('guide.content')}</p>
    </section>
  );
}
```

Tạo `client/pages/help/faq.tsx`.

```tsx
import { useTranslation } from '@nocobase/i18n/client';
import type { ReactElement } from 'react';

export default function FaqPage(): ReactElement {
  const { t } = useTranslation();
  return (
    <section className='space-y-2'>
      <h2 className='text-lg font-semibold'>{t('faq.title')}</h2>
      <p className='text-sm text-muted-foreground'>{t('faq.content')}</p>
    </section>
  );
}
```

Nội dung con dùng vùng chứa và tiêu đề trang của cha. Cấu trúc thư mục phản ánh cây route.

## 4. Thêm nội dung tiếng Anh và tiếng Trung

Thay `client/locales/en-US.ts`.

```ts
import type { LocaleResource } from '@nocobase/i18n';

const enUS = {
  title: 'Help center',
  sections: 'Help topics',
  guide: {
    title: 'Guide',
    content: 'Choose a menu item to start using the application.',
  },
  faq: {
    title: 'FAQ',
    content: 'Contact your administrator if you need help with access.',
  },
};
export type HelpCenterResource = LocaleResource<typeof enUS>;
export default enUS;
```

Thay `client/locales/zh-CN.ts`.

```ts
import type { HelpCenterResource } from './en-US.js';

const zhCN: HelpCenterResource = {
  title: '帮助中心',
  sections: '帮助主题',
  guide: { title: '使用指南', content: '从菜单中选择功能，开始使用应用。' },
  faq: { title: '常见问题', content: '如果遇到权限问题，请联系管理员。' },
};
export default zhCN;
```

Ví dụ hỗ trợ tiếng Anh và tiếng Trung. Thay `client/locales/index.ts`.

```ts
import type { LocaleLoaders } from '@nocobase/i18n';

const locales: LocaleLoaders = {
  'en-US': () => import('./en-US.js'),
  'zh-CN': () => import('./zh-CN.js'),
};
export default locales;
```

Xóa tệp ngôn ngữ chưa dịch trong thư mục này nếu ví dụ chưa hỗ trợ các ngôn ngữ đó. Khi hỗ trợ thêm, điền bản dịch rồi thêm loader. Các tệp dùng chung kiểu tài nguyên nên đối tượng rỗng sẽ lỗi kiểu.

Trang nạp qua route plugin kế thừa namespace cho `useTranslation()`. Tiêu đề menu và breadcrumb dùng cùng tài nguyên plugin. Các tệp locale của ứng dụng có thể giữ nguyên.

<h2 id="5-test-navigation">5. Kiểm thử điều hướng</h2>

`tests/client/routes.test.ts` do công cụ sinh kiểm tra danh sách route rỗng. Thay bằng `tests/client/routes.test.tsx`.

```tsx
import { renderWithApp } from '@nocobase/app-testing/client';
import type { AppClientRouteDefinition } from '@nocobase/app-client/plugins';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import { describe, expect, it } from 'vitest';

import helpCenter from '../../client/index.js';
import routes from '../../client/routes.js';

async function renderRoute(
  definition: AppClientRouteDefinition,
): Promise<ReactElement> {
  const Component = definition.componentLoader
    ? (await definition.componentLoader()).default
    : undefined;
  const children = await Promise.all(
    (definition.children ?? []).map(renderRoute),
  );
  return (
    <Route
      key={definition.name}
      path={definition.path}
      element={Component ? <Component /> : undefined}
    >
      {children}
    </Route>
  );
}

function LocationProbe(): ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output data-testid='location'>
        {location.pathname}
        {location.search}
      </output>
      <button onClick={() => void navigate(-1)}>Back</button>
    </>
  );
}

async function openPage(route: string, locale = 'zh-CN'): Promise<void> {
  const children = await Promise.all(
    routes.flatMap((contribution) => contribution.routes).map(renderRoute),
  );
  await renderWithApp(
    <>
      <Routes>{children}</Routes>
      <LocationProbe />
    </>,
    {
      plugins: [helpCenter()],
      namespace: '@nocobase/app-plugin-help-center',
      locale,
      route,
    },
  );
}

describe('help center navigation', () => {
  it.each(['/help', '/help/'])(
    'redirects only the parent %s and preserves query and history',
    async (parent) => {
      await openPage(`${parent}?from=menu`);
      expect(
        await screen.findByRole('heading', { name: '使用指南' }),
      ).toBeInTheDocument();
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/help/guide?from=menu',
      );
      fireEvent.click(screen.getByRole('link', { name: '常见问题' }));
      expect(
        await screen.findByRole('heading', { name: '常见问题' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '常见问题' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/help/faq?from=menu',
      );
      fireEvent.click(screen.getByRole('button', { name: 'Back' }));
      await waitFor(() =>
        expect(screen.getByTestId('location')).toHaveTextContent(
          '/help/guide?from=menu',
        ),
      );
      fireEvent.click(screen.getByRole('button', { name: 'Back' }));
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/help/guide?from=menu',
      );
    },
  );

  it('keeps a direct child URL and renders English', async () => {
    await openPage('/help/faq?from=link', 'en-US');
    expect(
      await screen.findByRole('heading', { name: 'FAQ' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Help center' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent(
      '/help/faq?from=link',
    );
    expect(
      screen.queryByRole('heading', { name: 'Guide' }),
    ).not.toBeInTheDocument();
  });
});
```

Bài kiểm thử nạp component từ khai báo route thực tế và kiểm tra điều hướng mặc định, query, lựa chọn trang con, lịch sử và nội dung tiếng Anh. `renderWithApp` đã cấp router và bản địa hóa. Dùng trực tiếp router của helper. Sau khi đăng ký, kiểm tra thêm menu ứng dụng và cơ chế yêu cầu đăng nhập.

```bash
pnpm --filter @nocobase/app-plugin-help-center format
pnpm --filter @nocobase/app-plugin-help-center check
```

## 6. Đăng ký trong ứng dụng

Từ gốc ứng dụng, xem trước và áp dụng đăng ký rồi khởi động hoặc khởi động lại server phát triển.

```bash
pnpm nocobase plugin register @nocobase/app-plugin-help-center --no-install --dry-run
pnpm nocobase plugin register @nocobase/app-plugin-help-center --no-install
pnpm dev
```

Plugin đã là dependency workspace cục bộ nên dùng `--no-install` để bỏ qua cài đặt. Ví dụ chỉ có điểm vào Client, nên đăng ký cập nhật `client/plugins.ts` của ứng dụng.

Sau khi đăng nhập, kiểm tra các thao tác sau. Đường dẫn dùng tiền tố mặc định `/main`. Điều chỉnh theo môi trường triển khai.

| Thao tác | Kết quả mong đợi |
| --- | --- |
| Bấm **Help center** ở thanh bên | Mở `/main/help/guide` và hiển thị **Guide** |
| Mở `/main/help?from=menu` | Chuyển tới `/main/help/guide?from=menu` |
| Bấm **FAQ** | Mở `/main/help/faq` và đánh dấu liên kết hiện tại |
| Mở trực tiếp hoặc tải lại `/main/help/faq` | Giữ chế độ xem **FAQ** |
| Dùng Back và Forward | Nội dung khớp URL hiện tại |
| Chuyển giữa tiếng Anh và tiếng Trung | Menu, breadcrumb, tiêu đề và nội dung cùng đổi |
| Mở trang trợ giúp khi chưa đăng nhập | Bắt đầu luồng đăng nhập của ứng dụng |

Cuối cùng, chạy `pnpm build` ở gốc ứng dụng để kiểm tra plugin build cùng ứng dụng.

## Tổ chức thêm trang

**Nội dung mở từ trang khác**, như chi tiết hoặc trang con nội bộ, có thể bỏ `navigation`. Route chi tiết có thể dùng tham số `:id`. Với mục menu cố định, chọn đường dẫn không cần tham số.

**Trang cha có nội dung riêng** có thể khai báo `componentLoader`, `navigation` và `children` cùng lúc. Component phải render `Outlet`. Thêm `navigation` vào trang con nếu cần hiện ở thanh bên.

**Nhóm menu** khai báo `navigation` và `children` mà không cần `componentLoader`. Ví dụ chuyển toàn bộ route `help` vào `children` của nhóm sau.

```ts
{
  name: 'support',
  navigation: { title: 'support' },
  children: [
    // Move the complete help route here, including its children.
  ],
}
```

Thêm khóa `support` vào hai tài nguyên với giá trị `Support` và `支持`. Nếu nhóm không khai báo `path`, `/help` giữ nguyên. Nếu nhóm có `path`, đường dẫn đó thành tiền tố cho các route con.

Thêm mục menu qua khai báo route để ứng dụng tự ghép thanh bên.
