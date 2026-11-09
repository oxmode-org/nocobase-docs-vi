---
title: Cấu hình ứng dụng (config.yml)
description: Chỉnh config.yml, tìm hiểu cấu hình client và server, rồi thêm mục cấu hình có ghi đè, kiểm tra và trường công khai.
---

`config.yml` chứa cấu hình của môi trường hiện tại, như tiêu đề ứng dụng, kết nối cơ sở dữ liệu, locale mặc định và mức log. `client/config/` và `server/config/` khai báo các giá trị mặc định và những cấu hình cần khởi tạo bằng mã.

Trước tiên, hướng dẫn sửa cài đặt hiện có, sau đó thêm `reports.pageSize` để minh họa từ khai báo và ghi đè đến cách dùng trong nghiệp vụ và trên client. Ví dụ dùng template Examples và chạy độc lập với bài hướng dẫn dự án và nhiệm vụ. Trang quản trị và cài đặt nghiệp vụ do quản trị viên quản lý thuộc về các mô-đun tương ứng.

<a id="where-configuration-lives"></a>

## Vị trí lưu cấu hình

| Vị trí | Trách nhiệm |
| --- | --- |
| `config.example.yml` | Tệp mẫu trong kho mã nguồn, giúp xác định giá trị cần cung cấp cho môi trường mới |
| `config.yml` | Giá trị ghi đè cho môi trường hiện tại, có thể chứa thông tin xác thực và cần để ngoài Git |
| `client/config/` | Mặc định và cấu hình bằng mã của client, chẳng hạn plugin xác thực |
| `server/config/` | Mặc định, ánh xạ biến môi trường, kiểm tra và trường công khai của server |
| `config/index.ts` mỗi phía | Kết hợp các mục bằng `defaultAppConfigs()` cho môi trường chạy |
| `server/config.ts` | Tạo dịch vụ cấu hình, chọn và nạp tệp |

`server/config.ts` là trình nạp, còn `server/config/` chứa định nghĩa các mục. Template đã nối các điểm vào cấu hình trong `server/runtime.ts` và `client/runtime.ts`. Thông thường chỉ cần duy trì từng mục và `index.ts` tương ứng.

`config.example.yml` minh họa các cài đặt thường dùng. Ứng dụng và các mô-đun tích hợp cùng định nghĩa cấu hình. Tra [Tham chiếu cấu hình](../reference/configuration.md) và tài liệu mô-đun để biết đầy đủ tùy chọn. Với ứng dụng mới, `pnpm nocobase config init --dialect sqlite` khởi tạo cấu hình và khóa cục bộ. Với ứng dụng hiện có, sửa cấu hình đang dùng theo nhu cầu. Xem [Tạo ứng dụng](../../getting-started/develop-your-first-app.md#create-and-start-the-application).

<a id="change-existing-configuration"></a>

## Sửa cấu hình hiện có

Trong ứng dụng đã khởi tạo, hợp nhất các giá trị sau vào `config.yml`, giữ lại cấu hình cơ sở dữ liệu, khóa và các cài đặt khác. Cập nhật mục hiện có để mỗi khóa cấp cao nhất chỉ xuất hiện một lần:

```yaml
client:
  app:
    title: My Reports

i18n:
  defaultLocale: zh-CN

logging:
  level: info
```

Examples đặt tiêu đề mặc định là `NocoBase` trong `client/config/app.ts` rồi ghi đè thành `NocoBase Examples` trong tệp cấu hình. Đổi thành `My Reports` để ServiceProvider phía client đặt tiêu đề tab đó khi khởi động. Tên và phiên bản ứng dụng ở thanh bên lấy từ thông tin công khai riêng.

`i18n.defaultLocale` chọn ngôn ngữ mặc định trong số ngôn ngữ có tài nguyên. Tùy chọn đã lưu của người dùng hoặc trình duyệt có thể được ưu tiên. Xem [Bản địa hóa](localization.md). `logging.level` chọn mức log. Xem [Ghi log](../framework/support/logging.md) để tra hành vi đầy đủ.

<a id="override-precedence"></a>

### Thứ tự ưu tiên

Phía server, thứ tự từ thấp đến cao là mặc định trong mã, tệp cấu hình rồi biến môi trường có ánh xạ khai báo rõ. Cấu hình gửi tới trình duyệt ghi đè mặc định trong mã client. Môi trường chạy cũng tính các giá trị do host quản lý như đường dẫn cơ sở và URL API.

Đối tượng thuần được hợp nhất đệ quy. Mảng và giá trị vô hướng được thay thế. Biến môi trường chỉ được phân tích và đưa vào đường dẫn cấu hình theo ánh xạ đã khai báo. YAML đọc `${NAME}` nguyên văn. Hãy dùng biến đã khai báo hoặc bổ sung ánh xạ cho trường cần cấu hình.

Ví dụ, `APP_SERVER_PORT` ánh xạ tới `server.port`. Khi được đặt, biến này ghi đè giá trị trong tệp. Kiểm tra môi trường khởi động để xác định giá trị thực tế.

<a id="client-configuration"></a>

## Cấu hình client

Examples có ba mục trong `client/config/`:

| Tệp | Nội dung |
| --- | --- |
| `app.ts` | Mặc định phía client, chẳng hạn tiêu đề |
| `api.ts` | URL mặc định của API Client, tính theo đường dẫn cơ sở ứng dụng |
| `auth.ts` | Plugin xác thực client cho tên người dùng, API key và xác thực thiết bị |

Có thể khai báo tiêu đề mặc định như sau:

```ts
// client/config/app.ts
import { defineAppConfig, type AppConfigFactory } from '@nocobase/app-client';

const app: AppConfigFactory<{ title: string }> = defineAppConfig(() => ({
  title: 'NocoBase',
}));

export default app;
```

`client/config/index.ts` đã truyền `app`, `api` và `auth` vào `defaultAppConfigs({ ... })`. Import và đăng ký mục bổ sung tại đây, đồng thời cập nhật kiểu trả về nếu đã khai báo tường minh.

`defineAppConfig()` phía client nhận một hàm tạo. Giữ đối tượng plugin đã khởi tạo và callback trong TypeScript. Với giá trị có thể tuần tự hóa và thay đổi theo môi trường, ghi đè trong mục `client` của `config.yml`.

Đọc tiêu đề trong ServiceProvider phía client:

```ts
// Inside a client ServiceProvider:
const title = this.app.config.get<string>('app.title', 'NocoBase');
```

Trang và hook lấy cùng dịch vụ qua `useClientApplication().config`. Đường dẫn tra cứu là `app.title`, bỏ tiền tố `client.` dùng trong tệp. Host quản lý URL API cho đường dẫn gắn ứng dụng. Để gọi dịch vụ ngoài độc lập, cấu hình kết nối riêng.

<a id="server-configuration"></a>

## Cấu hình server

`server/config/` tổ chức cấu hình framework và plugin. `server.ts`, `api.ts`, `database.ts` và `logging.ts` cấu hình các thành phần chạy, còn `auth.ts`, `users.ts`, `notification.ts` và `knowledge.ts` cấu hình mô-đun tích hợp. Tra tùy chọn riêng trong tài liệu từng mô-đun.

Ưu tiên hàm tạo riêng của mô-đun nếu có, như `defineApiConfig()`, `defineAppDatabaseConfig()` hoặc `defineAuthConfig()`, để giữ mặc định, ánh xạ và bộ kiểm tra của mô-đun. Dùng `defineAppConfig()` từ `@nocobase/app-server/config` cho mục riêng của ứng dụng.

`defineAppConfig()` phía server hỗ trợ:

| Trường | Công dụng |
| --- | --- |
| `defaults` | Giá trị mặc định hoặc hàm tính mặc định từ thông tin môi trường chạy như đường dẫn |
| `env` | Ánh xạ biến môi trường tới trường tương đối trong mục, kèm kiểu và mô tả |
| `validate` | Kiểm tra giá trị sau khi hợp nhất và báo lỗi từng trường qua `context.error()` |
| `public` | Đường dẫn tới các trường cuối có thể gửi tới trình duyệt |

Hai hàm tạo cùng tên có chữ ký riêng. Dạng đối tượng với `env`, `validate` và `public` thuộc về server.

Đăng ký mục mới trong `server/config/index.ts` và đọc bằng `app.config.get()`. Khóa đăng ký quyết định tên mục. Sau khi tạo tệp, đăng ký mục, rồi kết nối khóa cấu hình với mã nghiệp vụ cần dùng nó. Xem [Tham chiếu cấu hình](../reference/configuration.md) để tra tùy chọn có sẵn.

<a id="publish-configuration-to-the-client"></a>

## Công khai cấu hình cho client

Trình duyệt đọc hai nhóm cấu hình:

| Nguồn | Cách đọc trên client |
| --- | --- |
| Mặc định trong mã client và mục `client` của tệp | `config.get('app.title')` và đường dẫn tương tự |
| Trường server khai báo trong `public` và thông tin môi trường chạy công khai | `config.public.get(...)` |

Môi trường chạy công khai locale mặc định, tên hiển thị và phiên bản package ứng dụng. Dùng đối tượng `config` của client:

```ts
// config is the client application's configuration service.
const title = config.get<string>('app.title', 'NocoBase');
const defaultLocale = config.public.get('i18n.defaultLocale');
```

Mục server của ứng dụng khai báo rõ các đường dẫn tới trường cuối được công khai. Trong ví dụ dưới đây, `public: ['pageSize']` chỉ công khai `reports.pageSize`. Trường giữ nguyên đường dẫn phía server và được đọc qua `config.public.get()`.

Mục `client` và trường công khai đều đến trình duyệt. Giữ mật khẩu cơ sở dữ liệu, bí mật phiên và thông tin xác thực thư trong cấu hình chỉ dành cho server. Khai báo kiểu giúp TypeScript kiểm tra đường dẫn. Để công khai trường, vẫn cần khai báo `public` trên server.

<a id="add-your-own-configuration"></a>

## Thêm cấu hình riêng

Thêm kích thước trang báo cáo mặc định trong khoảng từ `1` đến `100`. Ví dụ cấu hình chạy độc lập. Hành vi chỉ đổi sau khi mã báo cáo hiện có dùng giá trị này để phân trang.

<a id="define-and-register"></a>

### Khai báo và đăng ký

Thêm `server/config/reports.ts`:

```ts
// server/config/reports.ts
import {
  defineAppConfig,
  envInteger,
  type AppConfigFactory,
} from '@nocobase/app-server/config';

export interface ReportsConfig {
  pageSize: number;
}

const reports: AppConfigFactory<ReportsConfig> = defineAppConfig({
  defaults: { pageSize: 20 },
  env: {
    REPORTS_PAGE_SIZE: envInteger('pageSize', {
      description: 'Default report page size, from 1 to 100.',
    }),
  },
  public: ['pageSize'],
  validate(value, context) {
    const size = value.pageSize;
    if (
      typeof size !== 'number' ||
      !Number.isInteger(size) ||
      size < 1 ||
      size > 100
    ) {
      context.error('pageSize', 'Must be an integer from 1 to 100.');
    }
  },
});

export default reports;
```

Sửa ba chỗ trong `server/config/index.ts` và giữ các mục khác:

1. Thêm `import reports from './reports.js';`.
2. Thêm `reports: ReturnType<typeof reports>` vào kiểu trả về tường minh.
3. Thêm `reports` vào đối tượng truyền cho `defaultAppConfigs({ ... })`.

Khóa đăng ký `reports` cho đường dẫn `reports.pageSize` và biến môi trường `REPORTS_PAGE_SIZE`. Bộ kiểm tra xác minh giá trị cuối dù lấy từ nguồn nào. Giữ bộ kiểm tra ở chế độ chỉ đọc và tránh gọi mạng.

Ghi mục này và mặc định `20` trong `config.example.yml`. Môi trường hiện tại có thể ghi đè qua `config.yml`:

```yaml
reports:
  pageSize: 30
```

<a id="connect-a-business-consumer"></a>

### Kết nối dịch vụ nghiệp vụ

Thêm hàm sau để ưu tiên kích thước được yêu cầu tường minh, sau đó dùng mặc định của ứng dụng:

```ts
// server/services/report-options.ts
import type { AppConfigAccessor } from '@nocobase/app-server/config';

export function resolveReportPageSize(
  config: AppConfigAccessor,
  requested?: number,
): number {
  const size = requested ?? config.get<number>('reports.pageSize');
  if (
    typeof size !== 'number' ||
    !Number.isInteger(size) ||
    size < 1 ||
    size > 100
  ) {
    throw new Error('Report page size must be an integer from 1 to 100.');
  }
  return size;
}
```

Trong dịch vụ báo cáo, dùng `resolveReportPageSize(app.config, requestedPageSize)` để lấy `limit` cho truy vấn. Hàm báo lỗi thông thường khi đầu vào hoặc tích hợp sai. Lớp HTTP vẫn phải kiểm tra tham số yêu cầu và chuyển lỗi sang định dạng phản hồi của dự án. Xem [Kiểm tra yêu cầu và xử lý lỗi](request-validation-and-errors.md). Kiểm tra cấu hình và kiểm tra yêu cầu là hai bước riêng.

<a id="read-the-published-value-on-the-client"></a>

### Đọc giá trị công khai trên client

Mở rộng kiểu cấu hình công khai trong tệp khai báo thuộc dự án TypeScript phía client:

```ts
// client/types/public-config.d.ts
import '@nocobase/app-client';

declare module '@nocobase/app-client' {
  interface PublicAppConfig {
    reports: { pageSize?: number };
  }
}
```

Trang có thể đọc mặc định công khai bằng hook:

```ts
// client/hooks/use-report-page-size.ts
import { useClientApplication } from '@nocobase/app-client';

export function useReportPageSize(): number | undefined {
  return useClientApplication().config.public.get('reports.pageSize');
}
```

Dùng giá trị này để khởi tạo trạng thái phân trang. Lựa chọn sau đó của người dùng thuộc trạng thái của trang. Nếu nhận `undefined`, kiểm tra mục đã đăng ký trên server, có khai báo `public` và trang hiện tại đã được tải lại. Giữ giá trị này ở cấu hình server.

<a id="check-configuration-and-apply-changes"></a>

## Kiểm tra cấu hình và áp dụng thay đổi

Xem khai báo và kiểm tra cấu hình hiện tại sau khi chỉnh sửa:

```bash
pnpm nocobase config env
pnpm nocobase config variables --json
pnpm nocobase config check --no-connect
```

`config env` liệt kê ánh xạ biến môi trường. `config variables` báo kiểu, mô tả và metadata khác. `config check --no-connect` kiểm tra ngoại tuyến. Theo mặc định, `config check` còn thử kết nối cơ sở dữ liệu ngoài SQLite. Kiểm tra riêng khả năng truy cập cơ sở dữ liệu và dịch vụ ngoài.

Sau khi đăng ký `reports` và xác nhận cấu hình hiện có hợp lệ, kiểm tra ghi đè và từ chối giá trị sai trong môi trường phát triển. Cú pháp biến tạm bên dưới dùng cho shell POSIX:

```bash
pnpm nocobase config set reports.pageSize=30
REPORTS_PAGE_SIZE=40 pnpm nocobase config check --no-connect --json
REPORTS_PAGE_SIZE=0 pnpm nocobase config check --no-connect --json
```

Lệnh đầu ghi `30` vào tệp. Lệnh thứ hai cần thành công với giá trị thực tế `40` cho riêng tiến trình đó, còn tệp vẫn là `30`. Lệnh thứ ba cần thoát với mã khác 0 và chỉ rõ `reports.pageSize` không hợp lệ. `config set` sửa tệp. Để tiến trình ứng dụng riêng đọc thay đổi, nạp lại theo quy trình của nó.

Kiểm tra thêm giá trị mặc định `20` khi không ghi đè, giá trị công khai khớp trên client, trường nội bộ không xuất hiện và kích thước trang gửi tường minh được kiểm tra. Chạy kiểm thử cấu hình cô lập trước khi kiểm tra trang và truy vấn thực tế trong ứng dụng phát triển.

Cách áp dụng thay đổi tùy thành phần sử dụng:

- **Sửa `config.yml` hoặc biến khi khởi động.** Kiểm tra cấu hình, khởi động lại ứng dụng và tải lại trang client. Chỉ nạp lại từng phần nếu mô-đun hỗ trợ.
- **Sửa TypeScript trong `client/config/` hoặc `server/config/`.** Nạp lại theo quy trình phát triển. Trên production, dựng và phát hành mã mới.
- **Giá trị chỉ dùng khi khởi tạo.** Ví dụ, `users.initialAdmin` được đọc khi khởi tạo bảng người dùng rỗng. Các tài khoản hiện có giữ nguyên.
- **Giá trị mặc định có tùy chọn người dùng.** Chủ đề đã lưu có thể được ưu tiên. Kiểm tra bằng phiên chưa lưu tùy chọn.

Khả năng nạp lại cấu hình phụ thuộc cách từng kết nối cơ sở dữ liệu, trình tiêu thụ và dịch vụ xử lý thay đổi. Xem [Tham chiếu dòng lệnh](../reference/cli.md) và [Tham chiếu cấu hình](../reference/configuration.md) để tra thao tác và tùy chọn đầy đủ.

Nguồn template đã được đối chiếu gồm [cấu hình mẫu](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/templates/app-template-examples/config.example.yml), [điểm vào cấu hình client](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/templates/app-template-examples/client/config/index.ts) và [điểm vào cấu hình server](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/templates/app-template-examples/server/config/index.ts).
