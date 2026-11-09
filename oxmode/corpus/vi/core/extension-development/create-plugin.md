---
title: Tạo plugin
description: Dùng @nocobase/create-plugin trong ứng dụng hiện có để tạo khung plugin cục bộ, chọn năng lực và kết nối workspace, cùng Agent hoặc thủ công.
---

Trước hết, [tạo ứng dụng](../../getting-started/develop-your-first-app.md#create-and-start-the-application) và cài dependency. Plugin được tạo dưới `packages/`, rồi được phát triển và build cùng ứng dụng.

Yêu cầu Agent tạo plugin hoặc tự chạy `pnpm create @nocobase/plugin@beta`. Cả hai cách dùng `@nocobase/create-plugin`.

## Cùng Agent

Hướng dẫn phát triển plugin đi kèm `@nocobase/app-skills` của ứng dụng và được đồng bộ vào `.agents/skills/nocobase-app-plugin-development/SKILL.md`. Nếu thiếu, kiểm tra Skill có trong package đã cài hay không. Nếu có, chạy `pnpm nocobase skills sync`. Nếu chưa có, [nâng cấp NocoBase Core](../developing-apps/upgrade-nocobase-core.md) lên bản tương thích để các package framework được nâng cấp cùng nhau.

Mở Agent trong thư mục ứng dụng và mô tả tên cùng mục đích plugin. Ví dụ:

```text
Tạo plugin demo-tools để mở rộng công cụ dòng lệnh của ứng dụng này.
Bắt đầu từ khung cơ bản và kiểm tra xem plugin có build thành công không.
```

Agent dùng `@nocobase/create-plugin` để tạo plugin, chọn năng lực, xử lý dependency và kiểm tra kết quả. Thay tên và mục đích trong ví dụ bằng yêu cầu của bạn.

## Thực hiện thủ công

Chạy lệnh từ thư mục gốc ứng dụng với phiên bản Node.js và pnpm mà ứng dụng yêu cầu. Công cụ sinh khung và App CLI phải hỗ trợ workspace của ứng dụng. `@beta` chọn kênh beta của công cụ. Ví dụ `demo-tools` chỉ chọn `cli` và có thể thực hiện khi chưa chạy cơ sở dữ liệu hoặc web server.

### Công cụ tạo và cập nhật gì?

| Việc | Nội dung được tạo hoặc cập nhật |
| --- | --- |
| Nền tảng package | Manifest, hướng dẫn phát triển, cấu hình TypeScript, lint và build |
| Mã theo năng lực | Thư mục, khai báo, ví dụ hoặc bản nháp và bài kiểm thử tương ứng với `--with` |
| Điểm vào công khai | Điểm xuất Client, Server, CLI hoặc component theo nhu cầu, cùng ánh xạ mã nguồn và mã biên dịch |
| Dependency | Nhóm dependency theo năng lực đã chọn và phiên bản xác định từ package đang cài trong ứng dụng |
| Tích hợp workspace | Package dưới `packages/`, cấu hình workspace cần thiết và dependency cục bộ của ứng dụng |
| Cài đặt | Mặc định cài dependency và cập nhật lockfile. Dùng `--no-install` để hoãn |

Sau khi tạo, triển khai tính năng, hoàn thiện kiểm thử và đăng ký các điểm vào runtime. Các trang nghiệp vụ, endpoint, quy tắc phân quyền, phát hành plugin và chạy migration được thực hiện ở các bước sau.

### Chọn năng lực plugin

```bash
pnpm create @nocobase/plugin@beta <name> --with <capability>
```

`--with` chọn **phần mã cần sinh**. Để chỉ tạo nền tảng package, dùng `--empty`. Nếu cần nhiều năng lực, lặp lại `--with` cho từng năng lực.

#### Năng lực Client

| Giá trị `--with` | Nội dung sinh ra | Phần cần triển khai |
| --- | --- | --- |
| `client.routes` | Khung khai báo route ở `client/routes.ts` và kiểm thử | Component trang, đường dẫn, điều hướng và điều kiện truy cập |
| `client.components` | Ví dụ `client/components/plugin-component.tsx`, điểm xuất công khai và kiểm thử | UI, props và tương tác của component tái sử dụng |
| `client.service-providers` | Khung ServiceProvider dưới `client/providers/` và kiểm thử | Đăng ký dịch vụ và xử lý vòng đời trên trình duyệt |
| `client.react-providers` | `client/contexts.ts`, component Provider, khai báo dưới `client/react-providers/` và kiểm thử | Dữ liệu Context, state và cách ghép cây component |
| `client.locales` | Tệp ngôn ngữ và điểm tổng hợp trong `client/locales/` | Nội dung dịch và cách dùng trong component |

ServiceProvider quản lý dịch vụ và vòng đời của ứng dụng. React Provider cấp Context cho cây component. Chọn mỗi loại theo nhu cầu. Mã Client cũng có `components.json` và `client/styles.css` cho cấu hình shadcn và stylesheet. Cài hoặc triển khai component UI cần thiết.

#### Năng lực Server

| Giá trị `--with` | Nội dung sinh ra | Phần cần triển khai |
| --- | --- | --- |
| `server.service-providers` | `server/services/`, `server/providers/`, `server/tokens.ts` và kiểm thử | Hợp đồng dịch vụ, logic nghiệp vụ và đăng ký dịch vụ |
| `server.routes` | Khung khai báo route ở `server/routes/index.ts` và kiểm thử | Phương thức API hoặc Root Route, đường dẫn, kiểm tra dữ liệu, xác thực, phân quyền và phản hồi |
| `server.jobs` | Job ví dụ, Provider quản lý executor dưới `server/jobs/` và kiểm thử | Logic job, nơi gửi job, thử lại và idempotency |
| `server.locales` | Tệp ngôn ngữ và điểm tổng hợp trong `server/locales/` | Nội dung dịch sử dụng ở server |

`server.routes` tạo khai báo để bạn tự triển khai endpoint, kể cả CRUD. Thêm `server.service-providers` nếu tính năng cần dịch vụ nghiệp vụ riêng. `server.jobs` đã có Provider quản lý executor. Ứng dụng cấu hình backend của job, còn plugin quyết định khi nào gửi.

#### Cơ sở dữ liệu, CLI và Skill

| Giá trị `--with` | Nội dung sinh ra | Phần cần triển khai |
| --- | --- | --- |
| `database` | Bản nháp `.ts.example` trong `database/migrations/` và `database/seeds/`, khai báo tài nguyên Server và kiểm thử. Build tạo manifest tác vụ cơ sở dữ liệu | Schema, migration và Seed. Hoàn thiện rồi đổi sang `.ts` để trình chạy nhận tác vụ |
| `cli` | `cli/index.ts`, lệnh mẫu `info`, điểm xuất `./cli` và kiểm thử | Lệnh, tùy chọn, kết quả và xử lý lỗi |
| `skills` | Bản nháp `skills/<plugin-skill-name>/SKILL.md`, được phân phối cùng package | Điều kiện kích hoạt, năng lực công khai, điều kiện tiên quyết và kiểm chứng cho Agent sử dụng plugin |

`skills` dành cho Agent của ứng dụng sử dụng plugin. `AGENTS.md` ở gốc plugin dành cho người và Agent duy trì mã nguồn. Tệp này thuộc nền tảng package. Hoàn thiện Skill theo phần triển khai thực tế trước khi đồng bộ vào ứng dụng.

#### Cách xác định điểm vào runtime

Công cụ xác định điểm vào từ năng lực cụ thể.

| Năng lực đã chọn | Điểm vào được tạo |
| --- | --- |
| Bất kỳ mục nào trong `client.routes`, `client.service-providers`, `client.react-providers`, `client.locales` | `client/index.ts`, `client/plugin.ts` và điểm xuất `./client` |
| Bất kỳ `server.*` nào hoặc `database` | `server/index.ts`, `server/plugin.ts` và điểm xuất `./server` |
| `cli` | `cli/index.ts` và điểm xuất `./cli` |
| Chỉ `client.components` | Điểm xuất công khai của component |
| Chỉ `skills` hoặc `--empty` | Chỉ sinh nội dung tương ứng, không có điểm vào runtime |

Sinh điểm vào và đăng ký vào ứng dụng là hai bước. Import component công khai từ package. Đăng ký điểm vào tương ứng khi plugin cung cấp đóng góp Client, Server hoặc CLI.

#### Các tổ hợp thường gặp

Chọn năng lực theo yêu cầu. Các ví dụ dưới đây độc lập với nhau.

Chỉ component tái sử dụng.

```bash
pnpm create @nocobase/plugin@beta feature-card --with client.components
```

Mô-đun nghiệp vụ có trang, dịch vụ, endpoint và dữ liệu do plugin quản lý.

```bash
pnpm create @nocobase/plugin@beta orders \
  --with client.routes \
  --with server.service-providers \
  --with server.routes \
  --with database
```

Lệnh công cụ cùng hướng dẫn tích hợp cho Agent.

```bash
pnpm create @nocobase/plugin@beta audit-tools --with cli --with skills
```

Chỉ nền tảng package.

```bash
pnpm create @nocobase/plugin@beta shared-tools --empty
```

`--empty` chỉ tạo phần nền tảng. Chọn riêng `--empty` hoặc `--with`. `--with all` chọn toàn bộ năng lực mà phiên bản công cụ hỗ trợ, hữu ích để khám phá khung đầy đủ. Khi phát triển, chọn rõ các năng lực cần dùng.

### 1. Xem trước kế hoạch tạo

```bash
pnpm create @nocobase/plugin@beta demo-tools --with cli --dry-run --json
```

Dry run chỉ báo kế hoạch. `pnpm create` vẫn có thể tải và lưu đệm công cụ sinh khung. JSON dự kiến có `ok: true` và `status: "success-noop"`. Kiểm tra các trường sau.

| Trường | Kết quả mong đợi |
| --- | --- |
| `result.project` | `kind` là `application`, `root` là gốc ứng dụng hiện tại |
| `result.plugin` | Tên package `@nocobase/app-plugin-demo-tools`, đích là `packages/app-plugin-demo-tools/` trong ứng dụng |
| `result.requestedCapabilities`, `result.capabilities` | Năng lực yêu cầu và lựa chọn đã chuẩn hóa |
| `result.derivedStructure` | Có sinh điểm vào plugin Client hoặc Server hay không. Cả hai là `false` trong ví dụ |
| `result.files` | Đường dẫn và lý do sinh, gồm `cli/index.ts`, `cli/info.ts` và kiểm thử |
| `result.projectEdits` | Thay đổi dự kiến trong ứng dụng, như `package.json` và `pnpm-workspace.yaml` nếu cần |
| `result.dependencies` | Dependency của plugin được phân giải từ package cài trong ứng dụng |
| `result.nextSteps` | Đề xuất cài đặt, kiểm tra và đăng ký theo năng lực |

Công cụ nhận diện ứng dụng qua `nocobase.templateKind: "app"` trong `package.json`. Nó đọc cấu hình workspace và dependency đã cài, rồi kiểm tra đường dẫn, tên và phiên bản trước khi ghi. Cài xong dependency ứng dụng trước khi chạy.

### 2. Tạo plugin và kết nối workspace

```bash
pnpm create @nocobase/plugin@beta demo-tools --with cli
```

Công cụ thực hiện các bước sau.

- Tạo `packages/app-plugin-demo-tools/` với manifest, phần triển khai CLI, kiểm thử và cấu hình phát triển. Plugin cục bộ mặc định có `private: true`.
- Giữ thiết lập pnpm workspace hiện có và thêm `packages/*` nếu cần để bao gồm plugin.
- Thêm `"@nocobase/app-plugin-demo-tools": "workspace:*"` vào `dependencies` của ứng dụng.
- Phân giải phiên bản dependency ngoài từ ứng dụng đã cài, giữ tham chiếu workspace cho package cục bộ thật, cài dependency và cập nhật lockfile.

`workspace:*` giúp ứng dụng dùng plugin cục bộ. Dependency ngoài dùng phiên bản phù hợp với các package đã cài trong ứng dụng để tránh lỗi phân giải và không tương thích.

### 3. Kiểm tra khung đã tạo

```bash
pnpm --filter @nocobase/app-plugin-demo-tools check
```

Sau khi kiểm tra đạt, khung plugin có sẵn dưới dạng dependency cục bộ. Xem [Cấu trúc plugin](plugin-structure.md) để biết vai trò từng tệp.

Cài dependency giúp phân giải package. Đăng ký runtime quyết định năng lực ứng dụng nạp. Sau khi triển khai, dùng `pnpm nocobase plugin register <full-package-name> --no-install` để đăng ký các điểm vào Client, Server hoặc CLI mà plugin thực sự cung cấp. Xem [Viết plugin đầu tiên](write-your-first-plugin.md) để triển khai, đăng ký và kiểm chứng.

<h3 id="names-and-common-options">Tên và tùy chọn thường dùng</h3>

Tên ngắn `demo-tools` mặc định tạo `@nocobase/app-plugin-demo-tools`. Dùng tên đầy đủ để giữ scope tổ chức.

```bash
pnpm create @nocobase/plugin@beta @my-company/app-plugin-audit-tools --with cli
```

Thư mục vẫn là `packages/app-plugin-audit-tools/`. Khi đăng ký, dùng tên package đầy đủ. Phần tên năng lực bắt đầu bằng chữ thường và chỉ dùng chữ thường, chữ số và dấu gạch nối đơn. Công cụ từ chối thư mục có sẵn và tên package xung đột. Có thể dùng plugin cục bộ ngay trong ứng dụng. Nếu sau này phát hành, kiểm tra `private`, tên package, điểm xuất, tính tương thích và nội dung đóng gói.

| Tùy chọn | Công dụng |
| --- | --- |
| `--dir <directory>` | Chọn ứng dụng hiện có, chẳng hạn `--dir ./my-app` từ thư mục cha |
| `--dry-run --json` | Xem tệp, chỉnh sửa ứng dụng và phiên bản dependency dự kiến để người hoặc Agent duyệt |
| `--json` | Trả kết quả có cấu trúc. Log cài đặt ghi vào stderr |
| `--no-install` | Tạo tệp và hoãn cài dependency. Chạy `pnpm install` từ gốc ứng dụng trước khi đăng ký |
| `--display-name <name>`, `--description <text>` | Đặt tên hiển thị và mô tả. Dùng dấu nháy nếu giá trị có khoảng trắng |
| `--help`, `-h` | Liệt kê năng lực và tùy chọn được phiên bản này hỗ trợ |
| `--version` | Hiện phiên bản công cụ sinh khung |

#### Đầu ra JSON

Dùng `--json` khi tạo hoặc cùng `--dry-run` cho Agent và script. Thành công trả `ok: true` và `result`. Thất bại trả mã thoát khác 0, cùng `error.code`, `error.message` và `error.suggestions`. Log cài đặt ghi vào stderr để stdout chỉ chứa một tài liệu JSON.

Dùng `--dry-run` để xem kế hoạch. Dùng `--no-install` khi muốn ghi tệp plugin và ứng dụng ngay, nhưng cài dependency sau.

### Lỗi thường gặp

| Triệu chứng | Cách xử lý |
| --- | --- |
| Không tìm thấy ứng dụng | Chạy từ ứng dụng tạo bằng create-app hoặc chọn qua `--dir`. Kiểm tra dependency đã cài và phiên bản công cụ có hỗ trợ workspace ứng dụng |
| Lỗi tìm `packages/plugins` | Có thể pnpm lấy công cụ cũ chỉ hỗ trợ repo nguồn. Kiểm tra bằng `pnpm create @nocobase/plugin@beta --version`, xem bộ nhớ đệm và thiết lập độ tuổi bản phát hành, rồi chạy lại dry run với bản hỗ trợ workspace ứng dụng. Giữ cấu trúc ứng dụng dưới `packages/`. Hướng dẫn được kiểm chứng với `@nocobase/create-plugin@0.1.0-beta.26` |
| Dependency thiếu hoặc không tương thích | Hoàn tất cài dependency ứng dụng, xử lý phiên bản được báo rồi xem trước lại |
| Thư mục, tên package hoặc dependency ứng dụng đã tồn tại | Kiểm tra phần triển khai hiện có hoặc chọn tên khác để giữ plugin cũ |
| Quy tắc workspace loại trừ thư mục đích | Rà các quy tắc loại trừ trong `pnpm-workspace.yaml`, chỉnh theo dự án rồi xem trước lại |
| Đã sinh tệp nhưng cài đặt lỗi | Giữ tệp đã sinh, xử lý lỗi và chạy lại `pnpm install` từ gốc ứng dụng |
| Cần thêm năng lực vào plugin hiện có | Dùng [Cấu trúc plugin](plugin-structure.md) để mở rộng mã, khai báo, điểm xuất, dependency và kiểm thử, rồi kiểm tra đăng ký ứng dụng |
| Chọn route hoặc database nhưng tính năng chưa chạy | Hoàn thiện trang, endpoint hoặc migration từ khung, sau đó tích hợp và kiểm chứng |
| Đã cài package nhưng thiếu lệnh | Kiểm tra điểm xuất `./cli`, đăng ký trong `cli/plugins.ts` và gọi lệnh từ gốc ứng dụng |

Xem [Cấu trúc plugin](plugin-structure.md) về vai trò từng tệp, rồi [Viết plugin đầu tiên](write-your-first-plugin.md) để triển khai và tích hợp. Xem [Quản lý plugin](../developing-apps/manage-plugins.md) để cài đặt, cập nhật và gỡ.
