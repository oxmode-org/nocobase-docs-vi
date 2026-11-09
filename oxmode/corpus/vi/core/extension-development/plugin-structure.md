---
title: Cấu trúc plugin
description: Tìm vị trí plugin trong ứng dụng, cách nối thư mục và điểm vào, cũng như quan hệ giữa mã nguồn và sản phẩm build.
---

Trong ứng dụng tạo bằng create-app, plugin cục bộ nằm dưới `packages/`. Cấu trúc phụ thuộc năng lực được chọn. Mỗi plugin chỉ cần các điểm vào Client, Server hoặc CLI tương ứng với chức năng nó cung cấp.

## Vị trí plugin trong ứng dụng

Ví dụ plugin thông báo cung cấp trang và API đọc thông báo. Cây sau mô tả các tệp chính sau khi triển khai và đăng ký. Thêm `client/pages/`, `shared/` và các component trang vào khung ban đầu. Xem [Viết plugin đầu tiên](write-your-first-plugin.md).

```text
my-app/
├── client/plugins.ts                          # App registers the Client entry
├── server/plugins.ts                          # App registers the Server entry
├── packages/
│   └── app-plugin-announcements/
│       ├── client/
│       │   ├── components/                    # Page container and header components
│       │   ├── pages/announcements.tsx        # Page: requests and displays announcements
│       │   ├── locales/                       # Menu and page translations
│       │   ├── routes.ts                      # Page route and navigation
│       │   ├── plugin.ts                      # Composes Client contributions
│       │   └── index.ts                       # Public Client entry
│       ├── server/
│       │   ├── routes/index.ts                # Announcement API
│       │   ├── routes/schemas.ts              # API response schema
│       │   ├── plugin.ts                      # Composes Server contributions
│       │   └── index.ts                       # Public Server entry
│       ├── shared/announcement.ts             # Shared data type
│       ├── tests/                             # API, page and route tests
│       ├── package.json                       # Dependencies, exports and scripts
│       └── AGENTS.md                          # Plugin development guidance
├── package.json                               # References the plugin through workspace:*
└── pnpm-workspace.yaml                        # Includes the plugin directory
```

Khi mở trang, `client/pages/announcements.tsx` gửi yêu cầu, `server/routes/index.ts` trả thông báo, rồi trang hiển thị danh sách. Trang và API thuộc cùng plugin. Ví dụ đọc dữ liệu mẫu cố định nên có thể chạy chỉ với điểm vào Client và Server, không cần migration hay CLI.

`package.json` của plugin xuất điểm vào Client và Server. Ứng dụng đăng ký chúng trong hai tệp `plugins.ts` tương ứng. Dependency cho phép phân giải package. Đăng ký quyết định năng lực được nạp. Xem [Tạo plugin](create-plugin.md) để dùng công cụ sinh khung.

## Cấu trúc thư mục đầy đủ

Ví dụ `demo-full` minh họa cấu trúc theo tất cả nhóm năng lực. Công cụ sinh `client/`, `server/`, `database/`, `cli/` và `skills/` theo lựa chọn. Thêm `client/pages/` khi phát triển trang. Build tạo `dist/`. Cây chỉ lược các tên tệp ngôn ngữ bổ sung.

```text
packages/app-plugin-demo-full/
├── client/                                     # Client (optional)
│   ├── components/                             # Plugin components
│   │   ├── plugin-component.tsx
│   │   └── provider.tsx
│   ├── contexts.ts                             # React context definitions
│   ├── index.ts                                # Public Client entry
│   ├── locales/                                # Client translations
│   │   ├── en-US.ts
│   │   ├── index.ts
│   │   ├── zh-CN.ts
│   │   └── …
│   ├── pages/                                  # Added as needed: business pages
│   ├── plugin.ts                               # Compose Client contributions
│   ├── providers/                              # Client services and lifecycle
│   │   ├── demo-full.ts
│   │   └── index.ts
│   ├── react-providers/                        # Register React Providers
│   │   └── index.ts
│   ├── routes.ts                               # Page route declarations
│   └── styles.css                              # Client styles
├── server/                                     # Server (optional)
│   ├── index.ts                                # Public Server entry
│   ├── jobs/                                   # Background jobs and executor Provider
│   │   ├── demo-full.ts
│   │   └── provider.ts
│   ├── locales/                                # Server translations
│   │   ├── en-US.ts
│   │   ├── index.ts
│   │   ├── zh-CN.ts
│   │   └── …
│   ├── plugin.ts                               # Compose Server contributions and resource paths
│   ├── providers/                              # Service registration and lifecycle
│   │   ├── demo-full.ts
│   │   └── index.ts
│   ├── routes/                                 # HTTP endpoint declarations
│   │   └── index.ts
│   ├── services/                               # Business implementations
│   │   └── demo-full.ts
│   └── tokens.ts                               # Public service interfaces and tokens
├── database/                                   # Plugin data (optional)
│   ├── README.md
│   ├── migrations/                             # Migration drafts; implement before enabling
│   │   └── 202610260001_demo_full_create_records.ts.example
│   └── seeds/                                  # Seed drafts; implement before enabling
│       └── 202610260002_demo_full_create_welcome_record.ts.example
├── cli/                                        # CLI (optional)
│   ├── index.ts                                # CLI declaration
│   └── info.ts                                 # Example command implementation
├── skills/                                     # Application agent guidance (optional)
│   └── nocobase-app-plugin-demo-full/
│       └── SKILL.md
├── tests/                                      # Tests for selected capabilities
│   ├── cli/
│   │   └── info.test.ts
│   ├── client/
│   │   ├── component.test.tsx
│   │   ├── react-provider.test.tsx
│   │   ├── routes.test.ts
│   │   └── service-provider.test.ts
│   ├── database/
│   │   └── migrations.test.ts
│   └── server/
│       ├── jobs.test.ts
│       ├── plugin.test.ts
│       ├── routes.test.ts
│       └── service-provider.test.ts
├── dist/                                       # Generated by build: compiled plugin output
├── components.json                             # shadcn configuration for Client code
├── package.json                                # Dependencies, exports and scripts
├── package.ts                                  # Foundation marker; keeps empty plugins buildable
├── tsconfig.json                               # Type checking and compilation
├── eslint.config.js                            # Lint configuration
├── vitest.config.ts                            # Test configuration
├── .gitignore                                  # Git ignore rules
├── .prettierignore                             # Formatting ignore rules
├── AGENTS.md                                   # Plugin development guidance
├── CLAUDE.md                                   # Agent guidance referencing AGENTS.md
├── README.md                                   # Plugin documentation
└── CHANGELOG.md                                # Release history
```

Mốc thời gian của migration và Seed phụ thuộc ngày tạo. Tổ chức trang nghiệp vụ ở `client/pages/` và đăng ký chúng qua `client/routes.ts`.

Cây gồm tệp do công cụ sinh, mã bổ sung khi phát triển và sản phẩm build. `client/pages/` thuộc nhóm bổ sung, còn `dist/` là sản phẩm build. Xem [Tạo plugin](create-plugin.md) để chọn các thư mục năng lực sẽ sinh.

## Cách các điểm vào kết nối

Xem [Khai báo và điểm xuất công khai của plugin](plugin-declarations.md) để biết cách khai báo đóng góp, công khai dịch vụ và gọi giữa các plugin.

| Vị trí | Trách nhiệm |
| --- | --- |
| Component, route, dịch vụ hoặc lệnh trong plugin | Triển khai tính năng |
| `client/plugin.ts` và `server/plugin.ts` của plugin | Tập hợp route, Provider, tài nguyên cơ sở dữ liệu và các đóng góp theo runtime |
| `client/index.ts` và `server/index.ts` của plugin | Xuất định nghĩa plugin. Khung thường xuất lại từ `plugin.ts` cùng thư mục |
| `cli/index.ts` của plugin | Khai báo và xuất plugin CLI trực tiếp |
| `package.json` của plugin | Khai báo các điểm vào công khai |
| `client/plugins.ts`, `server/plugins.ts` và `cli/plugins.ts` của ứng dụng | Đăng ký các điểm vào tương ứng mà plugin cung cấp |

Trang và API thông báo đi qua hai đường tích hợp.

```text
Client: pages/announcements.tsx → client/routes.ts → client/plugin.ts
        → client/index.ts → package.json ./client → App client/plugins.ts

Server: server/routes/index.ts → server/plugin.ts
        → server/index.ts → package.json ./server → App server/plugins.ts
```

`client/plugin.ts` của plugin định nghĩa phần đóng góp. `client/plugins.ts` của ứng dụng chọn plugin cần nạp. Khi thêm trang hoặc API, thường chỉ cần cập nhật mã triển khai và khai báo route trong plugin. Ứng dụng đã đăng ký điểm vào runtime sẽ nạp khai báo mới qua cùng điểm vào.

### Ba điểm vào runtime

| Điểm xuất công khai | Tệp đăng ký của ứng dụng | Cách tích hợp |
| --- | --- | --- |
| `<package>/client` | `client/plugins.ts` | Gọi factory Client, truyền cấu hình được hỗ trợ nếu cần |
| `<package>/server` | `server/plugins.ts` | Thêm định nghĩa plugin Server |
| `<package>/cli` | `cli/plugins.ts` | Thêm định nghĩa plugin CLI |

Tích hợp những điểm vào plugin thực sự cung cấp. Chọn riêng `client.components` tạo điểm xuất component công khai. Ứng dụng import trực tiếp vì lựa chọn này không sinh `client/index.ts` hay `client/plugin.ts`. Chọn `database` sinh điểm vào Server khai báo tài nguyên cơ sở dữ liệu.

Công cụ sinh điểm vào. `pnpm nocobase plugin register` nối điểm vào runtime với ứng dụng. Xem [Viết plugin đầu tiên](write-your-first-plugin.md).

## Tệp chính

<h3 id="packagejson-metadata-dependencies-and-public-exports">Metadata, dependency và điểm xuất trong package.json</h3>

Plugin có `package.json` riêng với tệp ở gốc ứng dụng.

| Trường | Vai trò |
| --- | --- |
| `name`, `version` | Định danh package và phiên bản |
| `private` | Mặc định `true` cho plugin cục bộ dùng trong ứng dụng |
| `exports` | Đường dẫn import công khai. Khung dùng mã nguồn khi phát triển cục bộ |
| `publishConfig.exports` | Ánh xạ sản phẩm biên dịch, cũng dùng khi build ứng dụng thu thập package cục bộ |
| `files` | Nội dung đóng gói như `dist/` và `skills/` nếu đã chọn |
| `scripts` | Lệnh kiểm tra, kiểm thử và build plugin |

Ứng dụng tham chiếu plugin cục bộ qua `workspace:*` trong `dependencies`. Dependency cho phép phân giải package. Đăng ký runtime quyết định phần được nạp.

Khai báo dependency trong package trực tiếp sử dụng chúng. Dependency runtime Server thông thường nằm ở `dependencies`. Runtime cần dùng chung định danh với host và dependency runtime Client nằm ở `peerDependencies`. Công cụ kiểm thử và build nằm ở `devDependencies`. Khai báo đầy đủ kể cả khi ứng dụng cũng cài cùng package.

Các trường xuất Client và Server của plugin thông báo:

```json
{
  "exports": {
    "./client": {
      "types": "./client/index.ts",
      "import": "./client/index.ts"
    },
    "./server": {
      "types": "./server/index.ts",
      "import": "./server/index.ts"
    }
  },
  "publishConfig": {
    "exports": {
      "./client": {
        "types": "./dist/client/index.d.ts",
        "import": "./dist/client/index.js"
      },
      "./server": {
        "types": "./dist/server/index.d.ts",
        "import": "./dist/server/index.js"
      }
    }
  }
}
```

Ứng dụng dùng `@nocobase/app-plugin-announcements/client` và `@nocobase/app-plugin-announcements/server` qua điểm xuất công khai. Giữ ánh xạ nguồn và sản phẩm biên dịch nhất quán khi thêm component, dịch vụ hoặc kiểu công khai.

### Tài nguyên cơ sở dữ liệu

`database/migrations/` chứa migration. `database/seeds/` chứa Seed. Tệp `.ts.example` là bản nháp. Hoàn thiện trước khi bỏ hậu tố `.example`. Giữ tên tệp khớp tên tác vụ được xuất.

`server/plugin.ts` khai báo các thư mục qua cấu hình `database`. Đường dẫn tài nguyên tính tương đối từ `baseDir` tuyệt đối của plugin.

| Mã được nạp | `baseDir` trỏ đến | Tài nguyên cơ sở dữ liệu |
| --- | --- | --- |
| Nguồn `server/plugin.ts` | Gốc plugin | `database/migrations/`, `database/seeds/` |
| Mã biên dịch `dist/server/plugin.js` | `dist/` của plugin | `dist/database/migrations/`, `dist/database/seeds/` |

Giữ cách tính đường dẫn và script build đã sinh. Plugin có năng lực cơ sở dữ liệu tạo `.manifest.json` sau biên dịch. Giữ manifest cùng migration và Seed đã biên dịch. Build chuẩn bị tài nguyên để trình chạy sử dụng sau.

<h3 id="ui-components-and-source-ownership">Component UI và quyền sở hữu mã nguồn</h3>

`client/components/` chứa component do plugin duy trì. Thêm trang nghiệp vụ ở `client/pages/` và nối qua `client/routes.ts`. Công khai component qua điểm xuất package.

Plugin có mã Client dùng `components.json` và `client/styles.css` để cấu hình vị trí tệp shadcn, alias trong package và điểm vào stylesheet. Ứng dụng và plugin đều có thể cài component hoặc block từ NocoBase UI Library. Bên cài duy trì bản sao nguồn đã cài. Nếu dùng component qua điểm xuất công khai của plugin, plugin tiếp tục duy trì phần triển khai.

Alias như `#components/*` nằm trong `package.json` của plugin và độc lập với alias nội bộ của ứng dụng. Giữ vị trí tệp, import và cấu hình build đồng bộ khi thêm hoặc cài component.

Có thể viết và tổ chức component theo nhu cầu với các thành phần cơ bản của shadcn. Khi ghép UI theo mô-đun, tra component và block ở [NocoBase UI Library](https://ui.nocobase.com/). Thư viện phân phối mã nguồn qua shadcn UI Registry. Dùng cùng cơ chế khi phát hành tài nguyên riêng. Xem [Component và style](frontend-components.md) và [Phân phối mã nguồn UI](frontend-components.md#optionally-distribute-ui-source-assets) để viết, build và cài thử Registry.

Duy trì tài nguyên nguồn trong package Registry độc lập, nằm cạnh các plugin dưới `packages/`. Tích hợp năng lực plugin qua điểm vào công khai hoặc đầu vào do bên sử dụng cấp. Sau khi cài, ứng dụng hoặc plugin nhận tài nguyên tự duy trì bản sao nguồn của mình.

### Hai loại hướng dẫn Agent

| Tệp | Người dùng | Mục đích |
| --- | --- | --- |
| `AGENTS.md` ở gốc plugin | Người phát triển và Agent bảo trì mã plugin | Quy ước phát triển nội bộ |
| `CLAUDE.md` ở gốc plugin | Claude Code làm việc trong plugin | Tham chiếu cùng `AGENTS.md` |
| `skills/*/SKILL.md` trong plugin | Agent của ứng dụng sử dụng plugin | Giải thích năng lực, tích hợp và kiểm chứng |
| `.agents/skills/` trong ứng dụng | Agent phát triển ứng dụng | Chứa bản hướng dẫn đã đồng bộ |

Hướng dẫn phát triển plugin thuộc phần khung cơ bản. `skills/` chỉ được sinh khi chọn năng lực này. Hoàn thiện nguồn Skill trong plugin rồi đồng bộ vào ứng dụng.

Xem [Hướng dẫn phát triển plugin](plugin-development-guidance.md) và [Skill của plugin](write-plugin-skills.md).

### Kiểm thử và cấu hình phát triển

`tests/` chia bài kiểm thử theo năng lực. `tsconfig.json`, `eslint.config.js` và `vitest.config.ts` nếu được sinh lần lượt cấu hình kiểm tra kiểu và biên dịch, lint và thực thi kiểm thử. Khi thêm năng lực, cập nhật cùng lúc phần triển khai, khai báo, điểm xuất, dependency và kiểm thử. Xem [Viết plugin đầu tiên](write-your-first-plugin.md) để biết lệnh.

## Mã nguồn, build plugin và build ứng dụng

| Vị trí | Nội dung |
| --- | --- |
| `packages/app-plugin-announcements/client/`, `packages/app-plugin-announcements/server/` | Mã Client và Server của plugin |
| `packages/app-plugin-announcements/dist/` | JavaScript và khai báo kiểu đã biên dịch của plugin |
| `dist/` ở gốc ứng dụng | Sản phẩm build ứng dụng, gồm mã ứng dụng và dependency runtime |

Build riêng plugin từ gốc ứng dụng.

```bash
pnpm --filter @nocobase/app-plugin-announcements build
```

Khi phát triển, ứng dụng dùng plugin cục bộ qua dependency workspace và điểm xuất mã nguồn. Để chuẩn bị bàn giao, chạy ở gốc ứng dụng.

```bash
pnpm build
```

Build ứng dụng build các package cục bộ theo thứ tự phụ thuộc rồi thu thập các package cần bàn giao dưới `dist/vendor/`, dùng ánh xạ điểm xuất đã biên dịch và đường dẫn dependency cục bộ. **Có thể bàn giao plugin cục bộ cùng ứng dụng mà không cần phát hành lên npm trước.**

Chỉnh mã nguồn rồi build lại để cập nhật sản phẩm sinh tự động. Sau khi plugin build thành công, kiểm tra cách dùng thực tế trong ứng dụng và toàn bộ bản build ứng dụng.

## Bước tiếp theo

Xem [Viết plugin đầu tiên](write-your-first-plugin.md) để triển khai API và trang thông báo, kiểm thử, đăng ký và kiểm chứng trong ứng dụng. Xem [Tạo plugin](create-plugin.md) để chọn năng lực và [Quản lý plugin](../developing-apps/manage-plugins.md) để cài, cập nhật và gỡ.

Khi chia sẻ giữa nhiều ứng dụng quản lý phiên bản độc lập, xem [Build và phát hành](publish-plugin.md). Plugin chỉ dùng nội bộ có thể tiếp tục bàn giao cùng ứng dụng.
