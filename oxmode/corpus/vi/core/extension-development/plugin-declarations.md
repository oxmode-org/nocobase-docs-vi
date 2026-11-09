---
title: Khai báo và điểm xuất công khai của plugin
description: Khai báo đóng góp Client, Server và CLI, công khai điểm vào và tích hợp với ứng dụng hoặc plugin khác.
---

Trang, API, dịch vụ và lệnh của plugin đi vào ứng dụng qua các khai báo đóng góp. Component, kiểu và dịch vụ mà ứng dụng hoặc plugin khác dùng trực tiếp cũng cần điểm xuất công khai trong package.

[Cấu trúc plugin](plugin-structure.md) giải thích vai trò từng tệp. Bài này nối các điểm vào runtime, khai báo đóng góp và điểm xuất với bên sử dụng. Xem [Viết plugin đầu tiên](write-your-first-plugin.md) để triển khai một trang và API từ đầu.

Ví dụ dùng `@nocobase/app-plugin-announcements`, có route và tài nguyên ngôn ngữ phía client, route và ServiceProvider phía server, cùng điểm vào CLI tùy chọn. Khi tạo mới, chọn các năng lực sau.

```bash
pnpm create @nocobase/plugin@beta announcements \
  --with client.routes --with client.locales \
  --with server.routes --with server.service-providers --with cli
```

Với plugin đã có, giữ phần triển khai rồi bổ sung mô-đun cần thiết. Đường dẫn tệp plugin tính từ `packages/app-plugin-announcements/`. Tệp đăng ký của ứng dụng tính từ gốc ứng dụng.

<h2 id="runtime-entries">Điểm vào runtime</h2>

Một package có thể cung cấp tối đa ba điểm vào, được đăng ký riêng.

| Runtime | Đường dẫn công khai | Giá trị xuất mặc định | Tệp đăng ký của ứng dụng |
| --- | --- | --- | --- |
| Client | `@nocobase/app-plugin-announcements/client` | Factory do `defineClientPlugin()` trả về | `client/plugins.ts` |
| Server | `@nocobase/app-plugin-announcements/server` | Đối tượng khai báo do `defineServerPlugin()` trả về | `server/plugins.ts` |
| CLI | `@nocobase/app-plugin-announcements/cli` | Đối tượng khai báo do `defineCliPlugin()` trả về | `cli/plugins.ts` |

Gọi factory Client khi đăng ký, chẳng hạn `announcements()`. Đưa trực tiếp đối tượng Server và CLI đã import vào khai báo. Các điểm vào lần lượt thuộc `defineClientPlugins()`, `defineServerPlugins()` và `defineCliPlugins()` của ứng dụng.

Khai báo Client và Server thường nằm trong `plugin.ts`, được xuất lại qua `index.ts` cùng thư mục.

```ts
export { default } from './plugin.js';
```

Khai báo CLI đặt trực tiếp ở `cli/index.ts`. Khi plugin cục bộ đã phân giải được dưới dạng dependency workspace, xem trước rồi áp dụng đăng ký từ gốc ứng dụng.

```bash
pnpm nocobase plugin register @nocobase/app-plugin-announcements --no-install --dry-run
pnpm nocobase plugin register @nocobase/app-plugin-announcements --no-install
```

Kiểm tra các tệp đăng ký runtime mà lệnh sửa và giữ plugin hiện có. Cài dependency cho phép import package. Đăng ký runtime nạp tính năng đã khai báo. Xem [Quản lý plugin](../developing-apps/manage-plugins.md).

Chỉ thêm điểm vào mà tính năng yêu cầu. Package chỉ cung cấp component có thể dùng qua import thông thường. Package chỉ cung cấp Skill có thể không có điểm vào runtime. Tài nguyên cơ sở dữ liệu cần điểm vào Server để khai báo.

## Khai báo đóng góp

### Client

`client/plugin.ts` kết hợp route trang thông báo và tài nguyên ngôn ngữ.

```ts
import {
  defineClientPlugin,
  type AppClientPluginFactory,
} from '@nocobase/app-client/plugins';
import locales from './locales/index.js';
import routes from './routes.js';

const announcements: AppClientPluginFactory = defineClientPlugin({
  packageName: '@nocobase/app-plugin-announcements',
  routes,
  locales,
});

export default announcements;
```

`routes` đến từ khai báo route của plugin. `locales` là tập loader ngôn ngữ. Có thể tiếp tục nạp component trang và từng tệp ngôn ngữ theo nhu cầu. Để thêm trang, bổ sung khai báo route vào plugin đã đăng ký.

Plugin client cũng có thể khai báo `serviceProviders` để đăng ký dịch vụ và `reactProviders` để gắn React Provider. Xem [Trang, route và menu](pages-and-menus.md) và [Component và style](frontend-components.md).

<h3 id="server">Server</h3>

`server/plugin.ts` kết hợp đóng góp API và dịch vụ.

```ts
import path from 'node:path';
import {
  defineServerPlugin,
  type AppServerPlugin,
} from '@nocobase/app-server/plugins';
import serviceProviders from './providers/index.js';
import routes from './routes/index.js';

const announcements: AppServerPlugin = defineServerPlugin({
  packageName: '@nocobase/app-plugin-announcements',
  baseDir: path.resolve(import.meta.dirname, '..'),
  serviceProviders,
  routes,
});

export default announcements;
```

`serviceProviders` chứa constructor của Provider. `routes` chứa khai báo route. Để container và vòng đời ứng dụng tạo Provider, kết nối cơ sở dữ liệu và khởi chạy job ở đúng giai đoạn.

Plugin server cũng có thể khai báo tài nguyên ngôn ngữ và cơ sở dữ liệu sau khi đã tạo tệp tương ứng.

| Trường | Khai báo | Tích hợp |
| --- | --- | --- |
| `locales` | Import tập loader từ `server/locales/index.ts` | Cung cấp tài nguyên ngôn ngữ của plugin cho ứng dụng |
| `database` | `{ migrations: './database/migrations', seeds: './database/seeds' }` | Cung cấp thư mục migration và Seed |

Đường dẫn cơ sở dữ liệu tính từ `baseDir` tuyệt đối. Biểu thức trên trỏ tới gốc plugin trong mã nguồn và `dist/` sau biên dịch. Đặt tài nguyên cơ sở dữ liệu đã biên dịch ở đó. Giữ script build và manifest tài nguyên của khung. Khai báo thư mục để đăng ký tài nguyên, sau đó dùng trình chạy migration để thực thi. Xem [Tài nguyên cơ sở dữ liệu và migration](database-and-migrations.md).

Đăng ký executor tác vụ nền qua ServiceProvider sở hữu nó. Tệp dưới `server/jobs/` cần được Provider kết nối tường minh. Xem [Route và HTTP API](server-apis.md) và [ServiceProvider và vòng đời dịch vụ](service-provider.md).

### CLI

Năng lực `cli` sinh `cli/info.ts`. `cli/index.ts` khai báo tệp này làm lệnh plugin.

```ts
import { defineCliPlugin, type AppCliPlugin } from '@nocobase/app-cli';
import PluginInfo from './info.ts';

const announcements: AppCliPlugin = defineCliPlugin({
  packageName: '@nocobase/app-plugin-announcements',
  commands: { info: PluginInfo },
});

export default announcements;
```

Sau khi đăng ký điểm vào, chạy `pnpm nocobase announcements info`. Mô-đun lệnh xuất lớp lệnh. Thực hiện nghiệp vụ khi lệnh chạy và chỉ khởi động năng lực ứng dụng cần dùng. Xem [Mở rộng dòng lệnh](extend-command-line.md) về lệnh phát triển, hook build và kiểm thử lệnh.

## Cấu hình plugin

Plugin cung cấp hợp đồng cấu hình. Ứng dụng chọn giá trị và kết nối vào runtime. Với cấu hình Server tái sử dụng, xuất factory và kiểu cấu hình qua điểm vào công khai. Ứng dụng gọi factory trong `server/config/<module>.ts` và thêm kết quả vào `defaultAppConfigs()` ở `server/config/index.ts`. Factory quản lý mặc định, ánh xạ biến môi trường, kiểm tra hợp lệ và trường công khai. Ứng dụng ghi đè giá trị theo môi trường qua `config.yml` và các nguồn được hỗ trợ.

Ví dụ, plugin xác thực xuất `defineAuthConfig()` để ứng dụng tạo phần `auth`. Plugin mới có thể dùng cùng cách, ghi rõ tên phần cấu hình và bước tích hợp. Đăng ký phần cấu hình riêng với đóng góp trong `defineServerPlugin()` để runtime nạp đúng.

Factory Client có thể nhận tùy chọn do plugin định nghĩa. Ghi tùy chọn factory riêng với cấu hình Server và giá trị công khai trên trình duyệt. Giữ khóa bí mật ở server. Xem [Cấu hình ứng dụng](../developing-apps/configuration-and-settings.md).

<h2 id="public-exports">Điểm xuất công khai</h2>

### Ánh xạ điểm vào sang đường dẫn package

`index.ts` chọn các định danh được xuất. `exports` trong `package.json` chọn đường dẫn mà bên sử dụng có thể import. Hợp nhất đoạn sau vào manifest, giữ các điểm xuất, dependency và thiết lập build hiện có.

```json
{
  "exports": {
    "./client": { "types": "./client/index.ts", "import": "./client/index.ts" },
    "./server": { "types": "./server/index.ts", "import": "./server/index.ts" },
    "./cli": { "types": "./cli/index.ts", "import": "./cli/index.ts" }
  },
  "publishConfig": {
    "exports": {
      "./client": { "types": "./dist/client/index.d.ts", "import": "./dist/client/index.js" },
      "./server": { "types": "./dist/server/index.d.ts", "import": "./dist/server/index.js" },
      "./cli": { "types": "./dist/cli/index.d.ts", "import": "./dist/cli/index.js" }
    }
  }
}
```

Khi phát triển, workspace dùng điểm vào mã nguồn. Package đã phát hành và package cục bộ do bản build ứng dụng thu thập dùng ánh xạ đã biên dịch tương ứng. Khi thêm điểm xuất, đưa mã nguồn vào biên dịch và kiểm tra tệp `.js` cùng `.d.ts` đã khai báo.

Điểm vào Client xuất mã tương thích trình duyệt. Điểm vào Server có thể dùng Node.js. Đặt kiểu dữ liệu dùng chung trong mô-đun riêng và công khai đường dẫn con khi cần. Tách điểm vào để dependency server không đi vào bản build trình duyệt.

### Công khai dịch vụ

Dùng dịch vụ xem trước thông báo từ [Dịch vụ nghiệp vụ và ServiceProvider](server-services.md). Định nghĩa `AnnouncementPreviewService`, `AnnouncementPreview`, token gốc và Provider theo bài đó, rồi đưa Provider vào khai báo Server. Dịch vụ trả `{ text, length }`.

Giữ giá trị xuất mặc định ở `server/index.ts` và bổ sung các điểm xuất sau.

```ts
export { default } from './plugin.js';
export { announcementPreviewToken } from './tokens.js';
export type { AnnouncementPreview, AnnouncementPreviewService } from './tokens.js';
```

Bên sử dụng import token và kiểu từ `@nocobase/app-plugin-announcements/server`. Dùng giá trị xuất mặc định để đăng ký plugin và điểm xuất có tên để gọi dịch vụ. Provider và phần triển khai có thể giữ nội bộ. Ứng dụng vẫn cần đăng ký plugin Server để token phân giải được.

[Dịch vụ client](client-services.md) cũng dùng token, Provider và điểm vào công khai riêng. Hai container độc lập. Xem [Công khai component](frontend-components.md#expose-components) về điểm xuất và điều kiện stylesheet, và [Tài nguyên mã nguồn UI](frontend-components.md#optionally-distribute-ui-source-assets) để phân phối mã có thể chỉnh sửa.

## Phối hợp giữa các plugin

### Khai báo dependency và hoàn tất đăng ký

Giả sử plugin báo cáo cần dịch vụ xem trước thông báo. Khai báo dependency lên plugin thông báo trước. Dùng peer dependency tương thích nếu ứng dụng cung cấp plugin và hai bên cần dùng chung định danh dịch vụ. Trong workspace cục bộ, manifest của bên sử dụng có thể chứa:

```json
{
  "peerDependencies": {
    "@nocobase/app-plugin-announcements": "workspace:^"
  }
}
```

`workspace:^` trỏ tới package trong cùng workspace. Ngoài workspace hoặc khi phát hành, dùng khoảng phiên bản thật do công cụ package tạo. Giữ peer dependency runtime dùng chung như `@nocobase/service-provider` theo khung. Khai báo dependency runtime thông thường và công cụ phát triển đúng nhóm.

Ứng dụng phải cài phiên bản tương thích và đăng ký plugin Server thông báo, cùng các điểm vào runtime mà bên sử dụng yêu cầu. Dependency npm chỉ cung cấp package. Đăng ký dịch vụ qua `server/plugins.ts` của ứng dụng. Nếu bên sử dụng chỉ xuất một hàm để ứng dụng gọi trực tiếp, hàm có thể dùng qua điểm xuất thông thường.

### Gọi dịch vụ công khai

Trong `server/services/announcement-preview.ts` của bên sử dụng, phân giải dịch vụ qua token công khai.

```ts
import { announcementPreviewToken, type AnnouncementPreview } from '@nocobase/app-plugin-announcements/server';
import type { ServiceContainer } from '@nocobase/service-provider';

export function previewAnnouncement(
  container: ServiceContainer,
  text: string,
): AnnouncementPreview {
  return container.resolve(announcementPreviewToken).preview(text);
}
```

Ứng dụng hoặc route của bên sử dụng truyền `app.container` hiện tại vào hàm. Plugin thông báo có thể đổi phần triển khai nội bộ nếu giữ đường dẫn công khai, token gốc và ngữ nghĩa giao diện.

Gọi sau khi đăng ký hoàn tất. Provider của bên sử dụng đăng ký factory trong `register()`, rồi phân giải dependency trong factory hoặc giai đoạn vòng đời sau. Dependency khởi tạo bất đồng bộ còn cần đúng giai đoạn và đúng thứ tự khai báo ứng dụng. Khai báo thứ tự Provider tường minh vì dependency package chỉ xác định quan hệ giữa package. Xem [Khởi động và vòng đời ứng dụng](../framework/runtime/lifecycle.md).

Import token gốc qua điểm vào công khai để chia sẻ định danh. Xem [Hợp đồng dịch vụ và token](../framework/services/tokens.md).

### Kiểm chứng điểm vào công khai

Import điểm vào công khai trong bài kiểm thử plugin. Xác nhận dịch vụ đã đăng ký hoạt động và báo lỗi rõ khi thiếu đăng ký. Kiểm tra trang, API và lệnh thật trong ứng dụng đích, rồi build plugin và ứng dụng.

```bash
pnpm --filter @nocobase/app-plugin-announcements typecheck
pnpm --filter @nocobase/app-plugin-announcements test
pnpm --filter @nocobase/app-plugin-announcements build
pnpm nocobase announcements info --json
pnpm build
```

Kiểm tra đường dẫn công khai, khai báo kiểu và tài nguyên trong sản phẩm biên dịch, cùng với import từ mã nguồn. Đăng ký thành công hoặc lệnh `info` chỉ xác nhận điểm vào tương ứng. Chạy các bài kiểm thử nghiệp vụ riêng. Xem [Kiểm thử và kiểm chứng](testing-and-verification.md) và [Build và phát hành](publish-plugin.md).
