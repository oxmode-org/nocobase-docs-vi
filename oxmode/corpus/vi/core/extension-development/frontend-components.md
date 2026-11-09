---
title: Component và style của plugin
description: Tổ chức component, tích hợp style và theme của host, công khai component và phân phối mã nguồn UI khi cần.
---

Ứng dụng và plugin có thể tự tổ chức component frontend. **Dùng shadcn cho các thành phần UI cơ bản.** Khi lắp ghép giao diện theo mô-đun, tra component và block trong [NocoBase UI Library](https://ui.nocobase.com/) trước.

NocoBase UI Library phân phối mã nguồn qua shadcn UI Registry để Agent lấy, sửa và lắp ghép component hoặc block. Trang thư viện có ví dụ và hướng dẫn cài đặt. Dùng Registry khi cần phân phối mã nguồn có thể chỉnh sửa. Nếu chỉ dùng nội bộ hoặc công khai component qua điểm xuất package, dùng import thông thường.

Bài này tiếp tục ví dụ thông báo từ [Viết plugin đầu tiên](write-your-first-plugin.md). Tạo component danh sách và nối vào trang. Nếu cần, đóng gói nó thành tài nguyên mã nguồn độc lập rồi cài vào dự án khác bằng đường dẫn cục bộ. Dùng dịch vụ lưu trữ tĩnh hiện có nếu cần phân phối qua URL.

## Cùng Agent

Với plugin thông báo hiện có, mô tả yêu cầu.

```prompt
Tách danh sách thông báo của plugin thành một component độc lập.
Dùng các thành phần cơ bản của shadcn và tham khảo component, block trong
NocoBase UI Library tại https://ui.nocobase.com/ trước khi triển khai.
Truyền dữ liệu thông báo và nội dung hiển thị khi danh sách rỗng qua props.
Giữ việc tải dữ liệu và xử lý lỗi trong trang. Bảo toàn route, điều hướng
và bản dịch. Kiểm tra danh sách có dữ liệu, danh sách rỗng và build plugin.
```

Chạy lệnh từ gốc ứng dụng, trừ khi có chỉ dẫn khác. Đường dẫn phát triển component tính từ `packages/app-plugin-announcements/`. Phần phân phối ghi rõ đường dẫn trong package Registry độc lập.

## Tổ chức component

Bắt đầu với plugin thông báo đang chạy. Xem [Viết plugin đầu tiên](write-your-first-plugin.md) về trang, API, bản dịch và đăng ký. Thêm `client/components/announcement-list.tsx`.

```tree
packages/app-plugin-announcements/
├── client/
│   ├── components/
│   │   ├── ui/                      # shadcn primitives
│   │   └── announcement-list.tsx    # Announcement list
│   ├── pages/
│   │   └── announcements.tsx        # Load data and compose components
│   ├── locales/                     # Page translations
│   └── styles.css                   # shadcn stylesheet configuration
├── components.json                 # shadcn configuration
└── package.json                     # Dependencies, aliases and public entries
```

Có thể thêm thư mục nghiệp vụ, tách Hook hoặc đổi ranh giới component theo nhu cầu. Giữ import và cấu hình build đồng bộ.

## Dùng shadcn và NocoBase UI Library

Cài Card của shadcn.

```bash
pnpm --filter @nocobase/app-plugin-announcements exec shadcn add card
```

Công cụ tạo `components.json`, điểm vào stylesheet và alias cục bộ cho plugin có mã Client. Lệnh chạy trong plugin đã chọn và ghi vào `client/components/ui/`. Nếu tệp đã có, xem diff và giữ tùy chỉnh của dự án.

Với vùng chứa, tiêu đề trang và component nghiệp vụ, tra [NocoBase UI Library](https://ui.nocobase.com/) trước. Bài plugin đầu tiên cài các mục sau.

```bash
pnpm --filter @nocobase/app-plugin-announcements exec shadcn add \
  @nocobase/page-container @nocobase/page-header
```

Bỏ qua bước cài nếu các tệp đã có. Mục `@nocobase` trong `components.json` trỏ đến điểm phân phối nguồn của thư viện. Nếu plugin cũ thiếu mục này, hợp nhất đoạn dưới vào `registries` hiện có.

```json
{
  "registries": {
    "@nocobase": "https://ui.nocobase.com/r/{name}.json"
  }
}
```

Rà `package.json` sau khi cài. Đặt dependency runtime Client trong `peerDependencies` theo quy ước plugin, giữ khoảng phiên bản phù hợp và chạy `pnpm install`. Dependency server vẫn được import trực tiếp cần giữ đúng nhóm. Xem [Cấu trúc plugin](plugin-structure.md#ui-components-and-source-ownership).

## Viết và sử dụng component

<h3 id="implement-the-announcement-list">Triển khai danh sách thông báo</h3>

Thêm `client/components/announcement-list.tsx`.

```tsx
import type { ReactElement } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '#components/ui/card';

export interface AnnouncementListItem {
  readonly id: string;
  readonly title: string;
  readonly content: string;
}

export interface AnnouncementListProps {
  readonly items: readonly AnnouncementListItem[];
  readonly emptyMessage: string;
}

export function AnnouncementList({
  items,
  emptyMessage,
}: AnnouncementListProps): ReactElement {
  if (items.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <ul className='grid gap-4'>
      {items.map((item) => (
        <li key={item.id}>
          <Card>
            <CardHeader>
              <CardTitle><h2>{item.title}</h2></CardTitle>
            </CardHeader>
            <CardContent>
              <p className='whitespace-pre-wrap text-muted-foreground'>
                {item.content}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
```

Component nhận dữ liệu và văn bản qua Props, nên có thể ghép trong trang hoặc cài riêng dưới dạng mã nguồn. Giao diện dữ liệu chỉ mô tả trường component dùng, độc lập với tệp `shared/` nội bộ của plugin. Trang vẫn có thể truyền `Announcement[]` đang có.

Build plugin sinh khai báo kiểu, nên ví dụ ghi rõ kiểu Props và giá trị trả về. Sau khi cài Card, rà `client/components/ui/card.tsx`. Thêm `: React.ReactElement` nếu thiếu kiểu trả về ở `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent` và `CardFooter`, giữ nguyên tham số và phần triển khai. Thiếu chú thích kiểu có thể gây `TS9007` với `isolatedDeclarations`. Kiểm tra yêu cầu sinh khai báo cho các thành phần mới khác.

### Nối vào trang

Thêm import vào `client/pages/announcements.tsx`.

```tsx
import { AnnouncementList } from '#components/announcement-list';
```

Giữ `useApiClient()`, `useTranslation()` và logic yêu cầu. Thay phần `return` bằng:

```tsx
return (
  <PageContainer>
    <PageHeader title={t('title')} />
    {failed ? (
      <p role='alert'>{t('error')}</p>
    ) : items === null ? (
      <p role='status'>{t('loading')}</p>
    ) : (
      <AnnouncementList items={items} emptyMessage={t('empty')} />
    )}
  </PageContainer>
);
```

Trang quản lý yêu cầu, trạng thái và bản dịch. Danh sách phụ trách trình bày. Component khác có thể dùng dịch vụ hoặc Hook phía client khi phù hợp. Xem [Dịch vụ client](client-services.md) và [ServiceProvider](service-provider.md).

## Tích hợp style và theme

### Tách cấu hình sinh component khỏi style runtime

`components.json` của plugin trỏ `tailwind.css` tới `client/styles.css` để shadcn sinh component. Tệp này import Tailwind, animation và style shadcn. Token theme do ứng dụng host cung cấp. `client/index.ts` do công cụ sinh chỉ xuất factory plugin.

Ứng dụng mặc định import `client/styles.css` của chính nó từ `client/index.tsx`. Stylesheet đó nạp theme và sinh utility. Component plugin dùng class ngữ nghĩa như `bg-card` và `text-muted-foreground`. Bản build Client của ứng dụng tạo CSS cuối cùng. Bản build TypeScript của plugin tạo JavaScript và khai báo kiểu.

Muốn đưa quy tắc CSS tùy chỉnh vào trang, nối một tài nguyên runtime riêng. Giữ stylesheet dùng để sinh component, gồm điểm vào Tailwind, ở phạm vi công cụ sinh.

### Đưa component plugin vào phạm vi quét của host

Template mặc định nạp cấu hình quét qua `@config "../tailwind.config.mjs"` trong stylesheet ứng dụng. Ở mốc Core `7fb8311` dùng để kiểm chứng bài này, cấu hình phân giải đường dẫn thật của `@nocobase/app-plugin-*` và quét cả `client/` nguồn lẫn `dist/client/` đã phát hành, kể cả liên kết pnpm.

Với scope riêng như `@my-company`, thêm package tường minh vào cấu hình quét của ứng dụng nhận, giữ mục đã có và bao phủ nguồn cục bộ lẫn thư mục biên dịch đã cài. Kiểm tra đường dẫn sau khi phân giải liên kết vì quy tắc mặc định chỉ bao phủ scope `@nocobase`.

Viết chuỗi utility đầy đủ. Với biến thể, dùng bảng ánh xạ chứa tên class hoàn chỉnh để trình build tìm được. Sau khi kiểm tra workspace, build thử ứng dụng cài package đã phát hành.

### Dùng token theme của host và giới hạn CSS tùy chỉnh

Dùng class ngữ nghĩa như `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground` và `border-border`. Màu sắc, bo góc và phông chữ đến từ theme host. Danh sách đã dùng `text-muted-foreground`. Ứng dụng quản lý preset và chế độ màu. Xem [Theme và style](../developing-apps/themes-and-styles.md).

Giới hạn CSS tùy chỉnh bằng class hoặc thuộc tính riêng của plugin. Nếu nội dung Portal nằm ngoài gốc trang, đặt class phạm vi trực tiếp lên overlay. Dùng theme Provider hiện có của host.

Duy trì CSS runtime riêng và ghi rõ mô-đun Client của plugin hay stylesheet ứng dụng import nó. Khi phân phối, kiểm tra bước sao chép tài nguyên, điểm xuất, danh sách tệp package và loader của bundler bên nhận. `tsc` không tự sao chép CSS. Ghi rõ import cần thiết. Danh sách ví dụ chỉ dùng utility đã có.

<h2 id="expose-components">Công khai component</h2>

Component nội bộ dùng import trong plugin. Để ứng dụng import từ package, thêm điểm vào công khai và giữ ánh xạ nguồn cùng `publishConfig.exports` đồng bộ. Xem [Điểm xuất công khai](plugin-declarations.md#public-exports). Đăng ký route, bản dịch và dịch vụ của plugin riêng với import component.

Ghi Props, kiểu công khai, style và điều kiện runtime. Nếu component phụ thuộc dịch vụ hoặc bản dịch, chỉ rõ điểm vào cần đăng ký. Component được xuất nên gắn namespace dịch tường minh. Xem [Bản địa hóa phía client](localization.md), [React Context và Provider](react-context-and-providers.md) và [Đăng ký React Provider](../framework/runtime/react-providers.md).

<h2 id="optionally-distribute-ui-source-assets">Phân phối mã nguồn UI khi cần</h2>

Để Agent đưa danh sách vào dự án đích rồi đổi bố cục, thêm thao tác hoặc ghép với block khác, phân phối qua shadcn UI Registry. Plugin có thể đồng thời cung cấp package runtime và tài nguyên Registry có mã nguồn chỉnh sửa được.

**Tài nguyên Registry là mô-đun nguồn độc lập.** Ví dụ thêm `announcements-ui/` dưới `packages/`, cạnh `app-plugin-announcements/`, với manifest và cấu hình build riêng. Cài đầu ra bằng đường dẫn cục bộ hoặc đăng lên trang tĩnh nếu cần URL. Dự án nhận tự tích hợp mã nguồn. Một Registry có thể phục vụ nhiều plugin hoặc tình huống nghiệp vụ.

### Chuẩn bị tài nguyên cùng Agent

```prompt
Đóng gói danh sách thông báo dưới dạng tài nguyên mã nguồn phân phối qua
shadcn UI Registry. Duy trì package độc lập packages/announcements-ui/ bên
cạnh package plugin. Chỉ dùng điểm vào công khai hoặc đầu vào được truyền
khi cần dữ liệu từ plugin, tránh import mã nguồn qua đường dẫn tương đối
hoặc alias nội bộ. Khai báo các tệp và dependency. Giải thích cách truyền
dữ liệu, đổi bố cục và kết nối API thông báo. Cài bản build cục bộ qua
đường dẫn tệp vào một ứng dụng hoặc plugin khác rồi kiểm tra. Chỉ cần đăng
lên trang tĩnh sẵn có khi cần phân phối qua URL.
```

### Tổ chức mã nguồn

Tạo thư mục nguồn của package Registry từ gốc ứng dụng.

```bash
mkdir -p packages/announcements-ui/registry/components
```

Lưu [phần triển khai danh sách](#implement-the-announcement-list) thành `packages/announcements-ui/registry/components/announcement-list.tsx`. Component nhận dữ liệu và văn bản nên có thể phân phối độc lập.

```tree
my-app/
├── packages/
│   ├── app-plugin-announcements/    # Plugin package
│   │   ├── client/                 # Plugin's own frontend implementation
│   │   ├── server/                 # Plugin backend capabilities
│   │   └── package.json
│   └── announcements-ui/           # Independent UI Registry package
│       ├── registry/
│       │   └── components/
│       │       └── announcement-list.tsx
│       ├── registry.json           # Distribution manifest
│       ├── package.json            # Independent build tools and scripts
│       └── public/
│           └── r/                  # Generated Registry JSON
└── pnpm-workspace.yaml             # Workspace package configuration
```

Xác nhận `pnpm-workspace.yaml` bao gồm `packages/*` và giữ cấu hình hiện có. Tài nguyên trong cùng workspace vẫn cần dùng giao diện công khai thay vì import tương đối vào plugin bên cạnh.

Thêm `packages/announcements-ui/package.json`.

```json
{
  "name": "announcements-ui",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "shadcn build registry.json --output public/r",
    "check": "pnpm build"
  },
  "devDependencies": {
    "shadcn": "4.18.0"
  }
}
```

Ví dụ cố định phiên bản công cụ build đã kiểm chứng. `check` dùng build để kiểm tra manifest và tệp nguồn, đồng thời đưa package vào bước kiểm tra workspace. Kiểm tra kiểu và render trong dự án nhận. Manifest package quản lý công cụ Registry. Khai báo các package npm và mục Registry mà bên nhận cần trong manifest tài nguyên bên dưới. Registry chạy như package công cụ riêng.

Duy trì nguồn phân phối trong package độc lập. Component gốc và bản cài trong dự án khác có thể tùy chỉnh riêng. Khi lấy bản mới, so sánh rồi hợp nhất thay đổi hoặc duyệt diff trước khi cài lại.

### Khai báo tài nguyên và dependency

Thêm `packages/announcements-ui/registry.json`.

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "announcements-ui",
  "homepage": "https://example.com",
  "items": [
    {
      "name": "announcement-list",
      "type": "registry:component",
      "title": "Announcement List",
      "description": "An editable announcement list with data and empty-state text supplied by its page.",
      "registryDependencies": ["card"],
      "files": [
        {
          "path": "registry/components/announcement-list.tsx",
          "type": "registry:component",
          "target": "client/components/announcement-list.tsx"
        }
      ],
      "docs": "Render AnnouncementList with items and emptyMessage. Keep data loading in the consuming page. This item does not register routes or install the announcements backend."
    }
  ]
}
```

Thay `homepage` minh họa bằng URL dự án hoặc repository thật. Công cụ build yêu cầu metadata này ở manifest gốc. Địa chỉ cài đặt phụ thuộc đường dẫn hoặc URL truyền vào lệnh add. Khi cài cục bộ, lệnh đọc thẳng JSON đã build. Xem [Manifest shadcn Registry](https://ui.shadcn.com/docs/registry/registry-json#homepage).

- `path` xác định nguồn tính từ gốc package Registry. Ví dụ đọc `packages/announcements-ui/registry/components/announcement-list.tsx`.
- `target` xác định nơi ghi trong ứng dụng hoặc plugin nhận. Ví dụ cài vào `client/components/announcement-list.tsx` của dự án đó.

Cấu trúc `registry/` bên phát hành có thể khác `client/` bên nhận. `target` chỉ xác định đích cài. Nguồn Registry vẫn nằm trong package độc lập.

`registryDependencies` khai báo mục Registry cần cài, như `card`. Đưa package npm được import trực tiếp vào `dependencies` với phiên bản tương thích. Component này chỉ import trực tiếp React, đã có trong ứng dụng đích. Với block nhiều tệp, dùng `registry:block` và liệt kê từng tệp cùng đích. Xem [shadcn Registry Item](https://ui.shadcn.com/docs/registry/registry-item-json).

### Xác định ranh giới dependency

Mỗi import phải hoạt động trong dự án nhận.

- Dùng điểm vào công khai cho component, Hook, dịch vụ, kiểu và bản dịch của plugin. Khai báo dependency tương thích và điều kiện đăng ký, hoặc để trang nhận truyền Props, callback hay adapter.
- Khai báo thành phần shadcn trong `registryDependencies` và dùng alias mà dự án nhận phân giải được, như `#components/ui/card`.
- Các tệp phân phối cùng tài nguyên có thể import tương đối nếu mọi tệp đều nằm trong manifest và giữ đúng vị trí tương đối khi cài.

Danh sách nhận dữ liệu và văn bản qua Props. Có thể cài danh sách độc lập. Trang lấy thông báo thật vẫn cần plugin Server tương ứng.

### Build tài nguyên

Từ gốc ứng dụng, cài dependency workspace rồi chỉ build package Registry.

```bash
pnpm install
pnpm --filter announcements-ui build
```

Bộ lọc chọn `announcements-ui` theo tên trong `package.json` và chạy script build tại package. Kết quả nhúng mã nguồn vào `packages/announcements-ui/public/r/announcement-list.json`. Có thể build và phát hành JSON độc lập với plugin. Xem [shadcn CLI](https://ui.shadcn.com/docs/cli#build).

Khi phát triển cục bộ, truyền JSON đã sinh trực tiếp vào `shadcn add`. Chọn tệp mục có `files[].content`. Thư mục nguồn và `registry.json` chỉ phục vụ bước build.

<h3 id="install-and-modify-it-in-the-target-project">Cài và sửa trong dự án đích</h3>

Từ gốc ứng dụng hiện tại, cài tài nguyên trong cùng workspace vào ứng dụng.

```bash
pnpm exec shadcn add ./packages/announcements-ui/public/r/announcement-list.json
```

Để cài vào ứng dụng khác trên cùng máy, chạy từ gốc ứng dụng nhận và truyền đường dẫn tương đối từ thư mục đó. Ví dụ hai ứng dụng nằm cạnh nhau, với bên phát hành tên `my-app`.

```bash
pnpm exec shadcn add ../my-app/packages/announcements-ui/public/r/announcement-list.json
```

Để đưa nguồn vào plugin của ứng dụng đích, dùng bộ lọc package và đường dẫn tuyệt đối. Bộ lọc đổi thư mục làm việc nên đường dẫn tuyệt đối giữ đúng đích. Thay tên package và đường dẫn theo dự án.

```bash
pnpm --filter @my-company/app-plugin-dashboard exec shadcn add \
  /absolute/path/to/my-app/packages/announcements-ui/public/r/announcement-list.json
```

Chọn nơi cài theo bên sẽ duy trì nguồn. Cài bằng đường dẫn cục bộ vẫn xử lý `registryDependencies`. Thành phần hoặc package chưa có có thể cần tải qua mạng. Rà diff nếu tệp đã có. Kiểm tra tệp đã cài, dependency và khai báo kiểu, rồi import `AnnouncementList` vào trang đích và truyền dữ liệu cùng thông báo rỗng. Xem [shadcn CLI](https://ui.shadcn.com/docs/cli#add).

Agent có thể sửa bản nguồn đã cài, chẳng hạn đổi danh sách thành lưới responsive hoặc thêm thao tác. Ứng dụng duy trì nguồn cài vào ứng dụng. Plugin duy trì nguồn cài vào plugin. Để lấy bản mới, so sánh thay đổi và giữ tùy chỉnh của dự án. Nâng cấp package plugin là quy trình riêng.

### Phát hành qua website hiện có khi cần

Nếu máy khác cần tải qua URL, đưa nội dung `packages/announcements-ui/public/r/` lên `/r/` của trang tĩnh hoặc dịch vụ hiện có. Xác nhận URL trả JSON có `files[].content`. Xem [Bắt đầu với shadcn Registry](https://ui.shadcn.com/docs/registry/getting-started).

Nếu đã có URL tài nguyên, dùng URL đó thay đường dẫn cục bộ.

```bash
pnpm exec shadcn add https://example.com/r/announcement-list.json
```

<h3 id="write-agent-usage-instructions">Viết hướng dẫn sử dụng cho Agent</h3>

Ghi cách tích hợp trong Skill được duy trì của plugin. Xem [Skill của plugin](write-plugin-skills.md). Mô tả cách build và tìm tài nguyên cục bộ hoặc cung cấp URL, cùng tình huống, đầu vào, điều kiện, điểm tùy chỉnh và cách kiểm chứng. Ví dụ hướng dẫn cài cục bộ:

```markdown
## Lắp ghép danh sách thông báo

Dùng tài nguyên announcement-list khi ứng dụng cần danh sách có mã nguồn chỉnh sửa.
Từ gốc ứng dụng nguồn, chạy `pnpm --filter announcements-ui build`.

Tìm đường dẫn tuyệt đối của packages/announcements-ui/public/r/announcement-list.json.
Từ gốc ứng dụng nhận, chạy
`pnpm exec shadcn add /absolute/path/to/my-app/packages/announcements-ui/public/r/announcement-list.json`.
Nếu cài vào plugin, chạy
`pnpm --filter <plugin-package> exec shadcn add <absolute-item-path>`.
Nếu đã phát hành, có thể dùng URL thay đường dẫn cục bộ.

Render AnnouncementList với các mục có id, title và content, đồng thời truyền
emptyMessage đã dịch. Trang phụ trách lấy dữ liệu, trạng thái tải và lỗi.
Để dùng API thông báo, trước tiên cài và đăng ký plugin Server cung cấp API.

Sửa nguồn đã cài để đổi bố cục hoặc thêm tương tác. Kiểm chứng danh sách có dữ liệu,
danh sách rỗng, trạng thái tải, lỗi yêu cầu và bản dịch. Chạy kiểm tra kiểu và build
của dự án nhận.
```

Skill mô tả tài nguyên và API đang có. Dùng `docs` của Registry cho ghi chú cài đặt ngắn. Đặt quy trình nghiệp vụ và ví dụ lắp ghép đầy đủ trong Skill hoặc tài liệu được tham chiếu.

## Kiểm thử và kiểm chứng

Trong plugin gốc, kiểm tra tiêu đề, nội dung và thông báo khi danh sách rỗng. Trang vẫn xử lý tải, lỗi và chuyển ngôn ngữ. Giữ các bài kiểm thử đang dùng và cập nhật vị trí cho component đã tách. Xem [Kiểm thử và kiểm chứng](testing-and-verification.md).

Kiểm tra giao diện sáng tối, preset theme, màn hình hẹp, focus bàn phím và Portal trong ứng dụng thật. Xác nhận style không ảnh hưởng trang khác. Với scope riêng hoặc package đã cài, kiểm tra phạm vi quét của host và CSS sau build.

Chạy kiểm tra plugin và build ứng dụng từ gốc ứng dụng.

```bash
pnpm --filter @nocobase/app-plugin-announcements typecheck
pnpm --filter @nocobase/app-plugin-announcements test
pnpm --filter @nocobase/app-plugin-announcements build
pnpm build
```

Nếu phân phối tài nguyên nguồn, cài, render và build trong dự án đích. Kiểm tra import, component, dependency và style, rồi để Agent thực hiện tùy chỉnh được mô tả. Tài nguyên dùng trong plugin cũng cần đạt bước build khai báo kiểu. Kiểm chứng tích hợp riêng với bước tạo JSON Registry.

Xem [Build và phát hành plugin](publish-plugin.md) về phát hành package. Có thể phát hành tài nguyên độc lập hoặc cùng phiên bản plugin. Ghi rõ mức tương thích giữa hai bên.
