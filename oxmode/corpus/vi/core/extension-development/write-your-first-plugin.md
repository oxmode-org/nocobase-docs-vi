---
title: Viết plugin đầu tiên
description: Xây plugin thông báo với API, trang, điều hướng, bài kiểm thử và đăng ký trong ứng dụng.
---

Xây plugin thông báo để người dùng mở **Announcements** từ menu, gọi API của plugin và xem kết quả. Ví dụ kết hợp Client và Server để minh họa cách thêm tính năng vào ứng dụng.

Bắt đầu với một thông báo cố định. Khi luồng hoạt động, bổ sung lưu trữ và trang quản lý nếu cần.

## Cùng Agent

Mở dự án ứng dụng hiện có trong Agent và mô tả tính năng.

```text
Tạo plugin announcements cho ứng dụng này. Thêm mục Announcements trong menu
sau khi đăng nhập. Trang gọi API của plugin và hiển thị một thông báo mẫu.
Hỗ trợ tiếng Anh và tiếng Trung cho menu và nội dung giao diện. Kiểm thử API,
điều hướng và các trạng thái trang, rồi đăng ký plugin và kiểm tra bản build.
```

Các bước dưới đây hướng dẫn triển khai thủ công và giúp duyệt kết quả của Agent.

## 1. Chuẩn bị khung

Bắt đầu với ứng dụng đã tạo bằng create-app, đã cài dependency và chạy được server phát triển. Xem [Tạo plugin](create-plugin.md) để chọn tùy chọn và [Cấu trúc plugin](plugin-structure.md) để biết vai trò từng tệp. **Chạy mọi lệnh từ gốc ứng dụng. Đường dẫn bên dưới tính từ gốc đó.**

Chọn route trang, bản dịch Client và route Server.

```bash
pnpm create @nocobase/plugin@beta announcements \
  --with client.routes --with client.locales --with server.routes
```

Nếu plugin đã tồn tại, tiếp tục chỉnh mã hiện có. Plugin nằm ở `packages/app-plugin-announcements/` và được ứng dụng tham chiếu qua `workspace:*`. Khung đã nối route và bản dịch vào định nghĩa plugin. Giữ `client/plugin.ts`, `server/plugin.ts` và hai tệp `index.ts`.

Cài vùng chứa và tiêu đề trang của NocoBase UI Library vào plugin để plugin duy trì bản sao mã nguồn.

```bash
pnpm --filter @nocobase/app-plugin-announcements exec shadcn add \
  @nocobase/page-container @nocobase/page-header
```

Rà `package.json` của plugin. Trang dùng `react` ở runtime, nên chuyển package này từ `devDependencies` sang `peerDependencies`, giữ phiên bản đã sinh. Chuyển cả dependency Client do trình cài component thêm, trong ví dụ là `cn`. Giữ `hono` phía Server trong `dependencies`. Sau đó chạy `pnpm install` để đồng bộ dependency và lockfile.

## 2. Cung cấp API thông báo

Thêm `packages/app-plugin-announcements/shared/announcement.ts` cho kiểu dữ liệu dùng chung giữa trang và API.

```ts
export interface Announcement {
  readonly id: string;
  readonly title: string;
  readonly content: string;
}
```

Thêm `packages/app-plugin-announcements/server/routes/schemas.ts` để mô tả thông báo trong tài liệu API.

```ts
import type { ApiSchema } from '@nocobase/app-server/router';

export const announcementSchema: ApiSchema = {
  type: 'object',
  required: ['id', 'title', 'content'],
  properties: {
    id: { type: 'string', description: 'Announcement ID.' },
    title: { type: 'string', description: 'Announcement title.' },
    content: { type: 'string', description: 'Announcement body.' },
  },
};
```

Thay khai báo route rỗng trong `packages/app-plugin-announcements/server/routes/index.ts`.

```ts
import {
  defineApiRoutes,
  describeRoute,
  listResponse,
  type AppApiRouteContribution,
} from '@nocobase/app-server/router';
import { Hono } from 'hono';

import type { Announcement } from '../../shared/announcement.js';
import { announcementSchema } from './schemas.js';

const announcements: Announcement[] = [
  { id: 'welcome', title: 'Welcome', content: 'Your first plugin is ready.' },
];

export const apiRoutes: AppApiRouteContribution<unknown> = defineApiRoutes(
  () => {
    const router = new Hono();
    router.get(
      '/announcements',
      describeRoute({
        operationId: 'announcementsList',
        summary: 'List public announcements',
        tags: ['Announcements'],
        security: [],
        responses: { 200: listResponse(announcementSchema) },
      }),
      (context) =>
        context.json({
          data: announcements,
          meta: { total: announcements.length },
        }),
    );
    return router;
  },
);

const routes: readonly AppApiRouteContribution<unknown>[] = [apiRoutes];
export default routes;
```

`defineApiRoutes()` đóng góp route vào API của ứng dụng. Khai báo `/announcements` và để ứng dụng thêm tiền tố API. `describeRoute()` khai báo tài liệu endpoint. `listResponse()` mô tả phản hồi `{ data, meta }`.

Endpoint chủ đích phục vụ thông báo mẫu công khai và khai báo `security: []`. Người đọc có thể gọi mà không cần thông tin xác thực. Nếu sau này phục vụ thông báo nội bộ, thêm xác thực và phân quyền trên server, đồng thời giữ yêu cầu đăng nhập ở trang. Nội dung thông báo do Server trả về.

## 3. Xây trang

Thêm `packages/app-plugin-announcements/client/pages/announcements.tsx`.

```tsx
import { useApiClient } from '@nocobase/app-client';
import { useTranslation } from '@nocobase/i18n/client';
import { useEffect, useState, type ReactElement } from 'react';

import { PageContainer } from '#components/page-container';
import { PageHeader } from '#components/page-header';
import type { Announcement } from '../../shared/announcement.js';

export default function AnnouncementsPage(): ReactElement {
  const api = useApiClient();
  const { t } = useTranslation();
  const [items, setItems] = useState<Announcement[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    void api.request<{ data: Announcement[] }>({ path: 'announcements' }).then(
      ({ data }) => {
        if (active) setItems(data);
      },
      () => {
        if (active) setFailed(true);
      },
    );
    return () => {
      active = false;
    };
  }, [api]);

  return (
    <PageContainer>
      <PageHeader title={t('title')} />
      {failed ? (
        <p role='alert'>{t('error')}</p>
      ) : items === null ? (
        <p role='status'>{t('loading')}</p>
      ) : items.length === 0 ? (
        <p>{t('empty')}</p>
      ) : (
        <ul className='space-y-4'>
          {items.map((item) => (
            <li key={item.id} className='rounded-lg border p-4'>
              <h2 className='font-semibold'>{item.title}</h2>
              <p className='mt-2 text-sm text-muted-foreground'>
                {item.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
}
```

`useApiClient()` dùng cấu hình API của ứng dụng hiện tại. `path` tính tương đối từ gốc API, nên chỉ ghi đường dẫn endpoint. Trang xử lý trạng thái tải, lỗi, danh sách rỗng và danh sách có dữ liệu. Khi unmount, trang bỏ qua kết quả yêu cầu đang chờ.

`PageContainer` và `PageHeader` được cài vào plugin. `package.json` của plugin phân giải alias `#components/*` tới các tệp trong package.

## 4. Thêm điều hướng và bản dịch

Thay `packages/app-plugin-announcements/client/routes.ts`.

```ts
import {
  defineAppRoutes,
  type AppClientRouteContribution,
} from '@nocobase/app-client/plugins';

const routes: readonly AppClientRouteContribution[] = [
  defineAppRoutes([
    {
      name: 'announcements',
      path: '/announcements',
      auth: 'required',
      authz: 'skip',
      navigation: { title: 'title' },
      componentLoader: () => import('./pages/announcements.js'),
    },
  ]),
];
export default routes;
```

`navigation` thêm mục menu. `componentLoader` nạp trang theo nhu cầu. Route tính từ gốc ứng dụng. Với đường dẫn cơ sở mặc định `/main`, URL trình duyệt là `/main/announcements`.

`auth: 'required'` yêu cầu đăng nhập để mở trang. `authz: 'skip'` cho phép trang mẫu mở mà không cần quyền trang bổ sung. Phần triển khai Server quyết định quyền truy cập API thông báo.

Menu và nội dung giao diện lấy từ tài nguyên dịch của plugin. Cập nhật `packages/app-plugin-announcements/client/locales/en-US.ts`.

```ts
import type { LocaleResource } from '@nocobase/i18n';

const enUS = {
  title: 'Announcements',
  loading: 'Loading announcements…',
  empty: 'No announcements yet.',
  error: 'Could not load announcements. Please refresh to try again.',
};
export type AnnouncementsResource = LocaleResource<typeof enUS>;
export default enUS;
```

Cập nhật `packages/app-plugin-announcements/client/locales/zh-CN.ts`.

```ts
import type { AnnouncementsResource } from './en-US.js';

const zhCN: AnnouncementsResource = {
  title: '公告栏',
  loading: '正在加载公告…',
  empty: '暂无公告。',
  error: '公告加载失败，请刷新页面重试。',
};
export default zhCN;
```

Ví dụ hỗ trợ tiếng Anh và tiếng Trung. Thay `packages/app-plugin-announcements/client/locales/index.ts` như sau và bỏ tệp của các ngôn ngữ chưa được hỗ trợ. Khi hỗ trợ thêm ngôn ngữ, cung cấp bản dịch đầy đủ và loader.

```ts
import type { LocaleLoaders } from '@nocobase/i18n';

const locales: LocaleLoaders = {
  'en-US': () => import('./en-US.js'),
  'zh-CN': () => import('./zh-CN.js'),
};
export default locales;
```

## 5. Kiểm thử API và trang

Bài kiểm thử route do công cụ sinh giả định danh sách route còn rỗng. Thay các assertion ban đầu bằng bài kiểm thử hành vi đã triển khai.

Thay `packages/app-plugin-announcements/tests/server/routes.test.ts` để kiểm tra đọc công khai, nội dung phản hồi, tài liệu API và việc endpoint chỉ cho đọc.

```ts
import {
  findUndeclaredApiRoutes,
  findApiDocumentSchemaProblems,
  generateApiDocument,
} from '@nocobase/app-server/router';
import { describe, expect, it } from 'vitest';

import { apiRoutes } from '../../server/routes/index.js';

describe('announcements API', () => {
  it('returns public announcements without credentials', async () => {
    const router = await apiRoutes.createRouter(undefined);
    const response = await router.request('/announcements');
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      data: [
        {
          id: 'welcome',
          title: 'Welcome',
          content: 'Your first plugin is ready.',
        },
      ],
      meta: { total: 1 },
    });
    expect(findUndeclaredApiRoutes(router)).toEqual([]);
    const document = await generateApiDocument(router, {
      info: { title: 'Announcements', version: '1' },
    });
    expect(findApiDocumentSchemaProblems(document)).toEqual([]);
    expect(
      (await router.request('/announcements', { method: 'POST' })).status,
    ).toBe(404);
  });
});
```

Thay `packages/app-plugin-announcements/tests/client/routes.test.ts` để kiểm tra khai báo trang và điều hướng.

```ts
import { describe, expect, it } from 'vitest';

import routes from '../../client/routes.js';

describe('announcements navigation', () => {
  it('declares the page and menu', () => {
    expect(routes).toMatchObject([
      {
        parent: 'app',
        routes: [
          {
            name: 'announcements',
            path: '/announcements',
            auth: 'required',
            authz: 'skip',
            navigation: { title: 'title' },
          },
        ],
      },
    ]);
  });
});
```

Thêm `packages/app-plugin-announcements/tests/client/page.test.tsx` để kiểm tra yêu cầu từ API Client thật, nội dung hiển thị, kết quả rỗng và lỗi.

```tsx
import { answerApi, renderWithApp } from '@nocobase/app-testing/client';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import announcements from '../../client/index.js';
import AnnouncementsPage from '../../client/pages/announcements.js';

const options = {
  plugins: [announcements()],
  namespace: '@nocobase/app-plugin-announcements',
  locale: 'zh-CN',
};

describe('announcements page', () => {
  it('requests the API and displays announcements', async () => {
    await renderWithApp(<AnnouncementsPage />, {
      ...options,
      fetch: answerApi((call) => {
        expect(call).toMatchObject({ method: 'GET', path: 'announcements' });
        return {
          data: [{ id: 'one', title: 'Test announcement', content: 'Hello!' }],
          meta: { total: 1 },
        };
      }),
    });
    expect(await screen.findByText('Test announcement')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '公告栏' })).toBeInTheDocument();
  });

  it('shows an empty state', async () => {
    await renderWithApp(<AnnouncementsPage />, {
      ...options,
      fetch: answerApi(() => ({ data: [], meta: { total: 0 } })),
    });
    expect(await screen.findByText('暂无公告。')).toBeInTheDocument();
  });

  it('shows an API failure', async () => {
    await renderWithApp(<AnnouncementsPage />, {
      ...options,
      fetch: answerApi(() => new Response(null, { status: 500 })),
    });
    expect(await screen.findByRole('alert')).toHaveTextContent('公告加载失败');
  });
});
```

Giữ các bài kiểm thử khác, định dạng thay đổi rồi chạy kiểm tra plugin.

```bash
pnpm --filter @nocobase/app-plugin-announcements format
pnpm --filter @nocobase/app-plugin-announcements check
```

<h2 id="6-register-in-the-app-and-view-the-result">6. Đăng ký trong ứng dụng và xem kết quả</h2>

Cài dependency và đăng ký điểm vào runtime là hai bước. Xem trước kế hoạch rồi đăng ký plugin.

```bash
pnpm nocobase plugin register @nocobase/app-plugin-announcements --no-install --dry-run
pnpm nocobase plugin register @nocobase/app-plugin-announcements --no-install
```

Plugin đã được cài dưới dạng dependency workspace, nên `--no-install` bỏ qua cài đặt lại. Lệnh thêm đăng ký vào `client/plugins.ts` và `server/plugins.ts` của ứng dụng, giữ các plugin hiện có.

Khởi động hoặc khởi động lại server phát triển.

```bash
pnpm dev
```

Mở URL mà server phát triển in ra, đăng nhập rồi chọn **Announcements**. Với đường dẫn cơ sở mặc định `/main`, kiểm tra các kết quả sau.

| Vị trí hoặc thao tác | Kết quả mong đợi |
| --- | --- |
| `/main/announcements` | Hiển thị `Welcome` và `Your first plugin is ready.` |
| `/main/api/announcements` | Trả JSON có `data` và `meta.total`, kể cả khi chưa đăng nhập |
| Chuyển giữa tiếng Anh và tiếng Trung | Menu và nội dung giao diện đổi. Nội dung thông báo vẫn theo dữ liệu Server trả về |

Cuối cùng, kiểm tra bản build đầy đủ ở terminal khác.

```bash
pnpm build
```

Plugin quản lý trang, API và bản dịch. Ứng dụng nạp chúng qua các điểm vào công khai. Có thể build và bàn giao plugin cục bộ cùng ứng dụng. Khi cần migration, quản lý thông báo hoặc phân quyền, xem [Cấu trúc plugin](plugin-structure.md) để xác định thư mục và điểm vào.

Để chia sẻ giữa các ứng dụng quản lý phiên bản độc lập, xem [Build và phát hành](publish-plugin.md). Với nhiều trang và điều hướng, xem [Trang, route và menu](pages-and-menus.md). Xem [Khai báo và điểm xuất công khai](plugin-declarations.md) để kết nối khai báo runtime, điểm xuất package và lời gọi dịch vụ giữa plugin.
