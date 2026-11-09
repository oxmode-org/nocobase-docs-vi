---
title: Bản địa hóa phía máy chủ
description: Nạp tài nguyên ngôn ngữ, chọn locale theo yêu cầu hoặc người nhận, ghi đè nội dung plugin và trả lỗi đã dịch.
---

Email, thông báo và bản xuất do máy chủ tạo dùng `server/locales/`. Tài nguyên này được nạp riêng với `client/locales/`. Khóa đã dùng trên trang vẫn cần khai báo phía máy chủ.

Ví dụ thông báo báo cáo đã sẵn sàng dùng ngôn ngữ yêu cầu cho phản hồi HTTP và ngôn ngữ người nhận cho nội dung tạo trong tác vụ nền. Chạy [ứng dụng ví dụ](https://github.com/nocobase/docs-examples-v3/tree/44cc65d121ea8cebf26fee77c924119cc57f4aad/apps/server-localization) bằng các lệnh ở mục [Mã nguồn và thiết lập ví dụ](#example-source-and-setup). Ví dụ chỉ tạo nội dung, không truy cập báo cáo thật hay gửi email.

<a id="add-and-load-locale-resources"></a>

## Thêm và nạp tài nguyên ngôn ngữ

<a id="define-wording-and-interpolation-parameters"></a>

### Khai báo nội dung và tham số nội suy

Thêm `reports` vào đối tượng hiện có trong `server/locales/en-US.ts`, giữ các khóa khác và khai báo xuất kiểu. Phần ghi đè plugin sẽ được thêm sau:

```ts
import type { LocaleResource } from '@nocobase/i18n';

const enUS = {
  reports: {
    ready: 'Report {{name}} is ready.',
    subject: 'Your report: {{name}}',
    notReady: 'Report {{name}} is not ready yet.',
  },
};
export type AppServerResource = LocaleResource<typeof enUS>;
export default enUS;
```

Thêm các khóa tương ứng trong `server/locales/zh-CN.ts`:

```ts
import type { AppServerResource } from './en-US.js';

const zhCN = {
  reports: {
    ready: '报表 {{name}} 已准备好。',
    subject: '你的报表：{{name}}',
    notReady: '报表 {{name}} 尚未准备好。',
  },
} satisfies AppServerResource;
export default zhCN;
```

`LocaleResource` kiểm tra cấu trúc khóa và cho phép chuỗi khác nhau theo bản dịch. Giữ nguyên tên tham số nội suy `{{name}}` ở mọi ngôn ngữ. Truyền tên báo cáo làm giá trị của tham số. Kiểm tra chuỗi sau khi render để xác nhận nội suy đúng.

[Xem tài nguyên ngôn ngữ](https://github.com/nocobase/docs-examples-v3/tree/44cc65d121ea8cebf26fee77c924119cc57f4aad/apps/server-localization/server/locales). Chạy `pnpm demo request zh-CN` để chèn `Q3` vào thông báo tiếng Trung, hoặc `pnpm demo request en-US "Sales summary"` để nhận `Report Sales summary is ready.`.

<a id="register-languages-and-set-the-default"></a>

### Đăng ký ngôn ngữ và đặt mặc định

`server/locales/index.ts` trong template Default đã khai báo các trình nạp:

```ts
import type { LocaleLoaders } from "@nocobase/i18n";
const locales: LocaleLoaders = {
  "en-US": () => import("./en-US.js"),
  "zh-CN": () => import("./zh-CN.js"),
};
export default locales;
```

`server/runtime.ts` kết nối điểm vào này qua `locales`. Với mỗi ngôn ngữ mới, thêm cả tệp tài nguyên và trình nạp. Khai báo ngôn ngữ ở ứng dụng kể cả khi plugin đã có bản dịch. Duy trì danh sách tài nguyên client và server riêng.

Đặt ngôn ngữ mặc định trong `config.yml`, ví dụ:

```yaml
i18n:
  defaultLocale: en-US
```

Cũng có thể dùng `APP_DEFAULT_LOCALE`. Xem [Cấu hình ứng dụng](configuration-and-settings.md). Mặc định dùng làm dự phòng khi không tìm được ngôn ngữ phù hợp. Lựa chọn đã lưu được ưu tiên.

[Điểm vào của ứng dụng ví dụ](https://github.com/nocobase/docs-examples-v3/tree/44cc65d121ea8cebf26fee77c924119cc57f4aad/apps/server-localization/server/app.ts) đặt `i18n.defaultLocale` thành tiếng Anh và đăng ký `I18nProvider` cùng tài nguyên thật. Chạy `pnpm demo request fr-FR` sẽ nhận tiếng Anh vì ứng dụng chưa khai báo tiếng Pháp. `pnpm demo request ja-JP` cũng dùng tiếng Anh vì tài nguyên tiếng Nhật chỉ được khai báo ở plugin.

<a id="translate-http-responses"></a>

## Dịch phản hồi HTTP

<a id="use-the-current-request-language"></a>

### Dùng ngôn ngữ của yêu cầu hiện tại

Trong `server/app.ts`, template Default gắn middleware phiên trước `i18nHttpMiddleware`. Middleware i18n xác định ngôn ngữ của yêu cầu và chờ nạp tài nguyên. Route dùng `getRequestTranslator(c)` để lấy hàm dịch và `getRequestLocale(c)` để lấy ngôn ngữ đã xác định.

Đây là bản độc lập của endpoint xem trước trong [report-messages.ts](https://github.com/nocobase/docs-examples-v3/tree/44cc65d121ea8cebf26fee77c924119cc57f4aad/apps/server-localization/server/routes/report-messages.ts). Lưu dưới `server/routes/` và đăng ký trong `server/routes/index.ts` theo [Route và API HTTP](apis-and-services.md):

```ts
import { Hono } from 'hono';
import { z } from 'zod';
import {
  apiErrorHandler, apiErrorResponses, apiValidator,
  dataResponse, defineApiRoutes, describeRoute,
} from '@nocobase/app-server/router';
import {
  getRequestLocale, getRequestTranslator,
} from '@nocobase/i18n/server';

export default defineApiRoutes(() => {
  const router = new Hono();
  router.onError(apiErrorHandler);
  router.get(
    '/report-message-preview',
    describeRoute({
      operationId: 'previewReportMessage',
      summary: 'Preview report wording',
      security: [],
      responses: {
        200: dataResponse(z.object({
          locale: z.string(), message: z.string(),
        })),
        ...apiErrorResponses,
      },
    }),
    apiValidator('query', z.strictObject({
      name: z.string().trim().min(1).max(80),
    })),
    (c) => c.json({
      data: {
        locale: getRequestLocale(c),
        message: getRequestTranslator(c)(
          'reports.ready', { name: c.req.valid('query').name },
        ),
      },
    }),
  );
  return router;
});
```

Trong ứng dụng hiện có, gọi `<APP_BASE_PATH>/api/report-message-preview?name=Q3` với `Accept-Language: zh-CN`. Nếu phiên chưa ghi đè ngôn ngữ, phản hồi là:

```json
{
  "data": {
    "locale": "zh-CN",
    "message": "报表 Q3 已准备好。"
  }
}
```

`pnpm demo request zh-CN` gửi yêu cầu này qua `Application.fetch` mà không mở cổng. Endpoint công khai chỉ xem trước nội dung. `security: []` mô tả API. Thêm xác thực và phân quyền dữ liệu trước khi sửa ví dụ để truy cập báo cáo thật.

<a id="session-language-request-header-and-default"></a>

### Ngôn ngữ phiên, header yêu cầu và giá trị mặc định

Ưu tiên ngôn ngữ đã lưu trong phiên. Khi phiên chưa có lựa chọn, middleware dò các giá trị `Accept-Language` theo thứ tự ưu tiên và dùng mặc định nếu không có ngôn ngữ được hỗ trợ. Nếu phiên đã lưu một ngôn ngữ không được hỗ trợ, middleware dùng cơ chế dự phòng của phiên.

Chạy `pnpm demo session zh-CN`. [Script minh họa](https://github.com/nocobase/docs-examples-v3/tree/44cc65d121ea8cebf26fee77c924119cc57f4aad/apps/server-localization/scripts/demo.ts) lưu tiếng Anh vào phiên thật qua endpoint ví dụ, sau đó gọi endpoint xem trước với cookie phiên và header tiếng Trung. Kết quả vẫn là `locale: "en-US"` và `Report Q3 is ready.`. Yêu cầu mới không kèm cookie đó dùng tiếng Trung.

Endpoint `/demo-locale` minh họa thứ tự ưu tiên và chỉ giữ lựa chọn trong tiến trình hiện tại. Ứng dụng hiện có nên giữ điểm vào chọn ngôn ngữ đang dùng. Xem [Bản địa hóa phía client](localization.md).

<a id="render-background-messages-in-the-recipients-language"></a>

## Tạo nội dung tác vụ nền theo ngôn ngữ người nhận

<a id="inject-the-runtime-and-bind-the-translator"></a>

### Tiêm môi trường i18n và gắn hàm dịch

Tác vụ nền chạy ngoài ngữ cảnh yêu cầu HTTP. Nhận tùy chọn của người nhận từ bên gọi, tiêm môi trường i18n qua `i18nToken` và tạo nội dung theo ngôn ngữ đó. [report-message.ts](https://github.com/nocobase/docs-examples-v3/tree/44cc65d121ea8cebf26fee77c924119cc57f4aad/apps/server-localization/server/services/report-message.ts) khai báo dịch vụ:

```ts
import metadata from "../../package.json" with { type: "json" };
import type { I18nRuntime } from "@nocobase/i18n";
import { createServiceToken } from "@nocobase/service-provider";

export class ReportMessageService {
  constructor(private readonly i18n: I18nRuntime) {}

  async render(recipientLocale: string, name: string) {
    const locale = this.i18n.resolveLocale(recipientLocale);
    await this.i18n.ensureLocaleLoaded(locale);
    const t = this.i18n.getFixedT(metadata.name, locale);
    return {
      locale,
      subject: t("reports.subject", { name }),
      message: t("reports.ready", { name }),
    };
  }
}
export const reportMessageToken =
  createServiceToken<ReportMessageService>("report-message");
```

`resolveLocale()` chọn ngôn ngữ được hỗ trợ từ tùy chọn. `ensureLocaleLoaded()` nạp tài nguyên. `getFixedT()` gắn hàm dịch với namespace và ngôn ngữ. Giữ thứ tự này vì nếu tài nguyên chưa nạp, kết quả có thể âm thầm dùng bản mặc định hoặc trả về khóa. Namespace là tên trong `package.json` của ứng dụng.

[ReportMessageProvider](https://github.com/nocobase/docs-examples-v3/tree/44cc65d121ea8cebf26fee77c924119cc57f4aad/apps/server-localization/server/providers/report-message.ts) tiêm môi trường i18n:

```ts
import type { Application } from "@nocobase/app-server/application";
import { i18nToken } from "@nocobase/app-server/i18n";
import { ServiceProvider } from "@nocobase/service-provider";
import {
  ReportMessageService,
  reportMessageToken,
} from "../services/report-message.js";

export default class ReportMessageProvider extends ServiceProvider<Application> {
  readonly name = "report-message";
  override register() {
    this.app.container.singleton(
      reportMessageToken,
      (container) => new ReportMessageService(container.resolve(i18nToken)),
    );
  }
}
```

Thêm Provider vào `server/providers/index.ts` của ứng dụng hiện có và giữ các Provider khác. Tổ chức mã trong `server/services/` rồi đăng ký dịch vụ qua Provider. [Điểm vào ứng dụng ví dụ](https://github.com/nocobase/docs-examples-v3/tree/44cc65d121ea8cebf26fee77c924119cc57f4aad/apps/server-localization/server/app.ts) đã đăng ký sẵn Provider.

Chạy `pnpm demo background zh-CN`. Lệnh lấy dịch vụ từ container và tạo đầu ra sau ngoài ngữ cảnh HTTP:

```json
{
  "locale": "zh-CN",
  "subject": "你的报表：Q3",
  "message": "报表 Q3 已准备好。"
}
```

<a id="render-different-languages-concurrently"></a>

### Tạo nội dung nhiều ngôn ngữ đồng thời

Sau khi ứng dụng khởi động, tác vụ nền hoặc lệnh có thể dùng chung dịch vụ cho nhiều người nhận đồng thời. Lời gọi sau dựa trên [script minh họa](https://github.com/nocobase/docs-examples-v3/tree/44cc65d121ea8cebf26fee77c924119cc57f4aad/apps/server-localization/scripts/demo.ts):

```ts
import { reportMessageToken } from './server/services/report-message.js';

// app has completed app.start().
const service = app.container.resolve(reportMessageToken);
const messages = await Promise.all([
  service.render('en-US', 'Q3'),
  service.render('zh-CN', 'Q3'),
  service.render('fr-FR', 'Q3'),
]);
```

Chạy `pnpm demo concurrent`. Ba thông báo lần lượt là `Report Q3 is ready.`, `报表 Q3 已准备好。` và `Report Q3 is ready.`, với ngôn ngữ tương ứng `en-US`, `zh-CN` và `en-US`.

Mỗi lời gọi gắn riêng ngôn ngữ của người nhận và giữ nguyên ngôn ngữ trên môi trường i18n dùng chung. Nhờ vậy, tác vụ và yêu cầu HTTP chạy đồng thời vẫn dùng đúng ngôn ngữ. Lấy tùy chọn của từng người nhận từ dữ liệu nghiệp vụ.

<a id="override-a-plugins-server-wording"></a>

## Ghi đè nội dung phía máy chủ của plugin

Dùng tên package đầy đủ của plugin dưới khóa `overrides` trong đối tượng tài nguyên của ứng dụng. Ví dụ, thêm mục sau vào tài nguyên tiếng Anh:

```ts
// Inside the default export of server/locales/en-US.ts:
overrides: {
  '@example/report-delivery': {
    delivery: {
      ready: 'Your report {{name}} is available in the customer portal.',
    },
  },
},
```

Ở cùng vị trí trong tài nguyên tiếng Trung, thêm `ready: '报表 {{name}} 已可在客户门户中查看。'`. Ứng dụng áp dụng phần ghi đè sau khi nạp tài nguyên plugin. Các khóa khác tiếp tục dùng nội dung gốc. Duy trì phần ghi đè trong ứng dụng để giữ nguyên package đã cài.

Chỉ rõ namespace plugin trong trình xử lý yêu cầu. Hono cần giá trị này tường minh:

```ts
const t = getRequestTranslator(c, '@example/report-delivery');
return c.json({ data: {
  locale: getRequestLocale(c),
  message: t('delivery.ready', { name: c.req.valid('query').name }),
  channel: t('delivery.channel'),
} });
```

Chạy `pnpm demo override zh-CN`. Thông báo thành `报表 Q3 已可在客户门户中查看。`, còn `delivery.channel` vẫn dùng giá trị `客户门户` từ plugin.

Xem cách [tài nguyên plugin ví dụ](https://github.com/nocobase/docs-examples-v3/tree/44cc65d121ea8cebf26fee77c924119cc57f4aad/apps/server-localization/server/report-delivery.ts), [phần ghi đè của ứng dụng](https://github.com/nocobase/docs-examples-v3/tree/44cc65d121ea8cebf26fee77c924119cc57f4aad/apps/server-localization/server/locales) và [trình xử lý yêu cầu](https://github.com/nocobase/docs-examples-v3/tree/44cc65d121ea8cebf26fee77c924119cc57f4aad/apps/server-localization/server/routes/report-messages.ts) phối hợp với nhau. `@example/report-delivery` là plugin tài nguyên nhúng. Khi áp dụng, dùng tên package và khóa thật của plugin. Xem [Bản địa hóa phía máy chủ cho plugin](../extension-development/server-localization.md) để biết cách khai báo.

<a id="return-user-facing-error-messages"></a>

## Trả thông báo lỗi cho người dùng

Giữ ổn định `reason`, `domain` và mã trạng thái HTTP. Giữ mô tả tiếng Anh cho nhà phát triển trong `message`. Nếu máy chủ cung cấp nội dung hiển thị, đặt ngôn ngữ đã xác định và bản dịch vào `localizedMessage`.

Đoạn mã sau lấy từ [trình xử lý báo cáo chưa sẵn sàng](https://github.com/nocobase/docs-examples-v3/tree/44cc65d121ea8cebf26fee77c924119cc57f4aad/apps/server-localization/server/routes/report-messages.ts), dùng cùng bộ kiểm tra truy vấn và `apiErrorHandler` với phần xem trước:

```ts
import { ApiError } from '@nocobase/app-server/router';
import {
  getRequestLocale, getRequestTranslator,
} from '@nocobase/i18n/server';

// Inside the validated /report-not-ready handler:
throw new ApiError({
  status: 'FAILED_PRECONDITION',
  reason: 'REPORT_NOT_READY',
  domain: 'reports',
  message: 'The requested report is not ready.',
  localizedMessage: {
    locale: getRequestLocale(c)!,
    message: getRequestTranslator(c)(
      'reports.notReady', { name: c.req.valid('query').name },
    ),
  },
});
```

Chạy `pnpm demo error zh-CN` để tạo tình huống báo cáo chưa sẵn sàng. Lệnh trả HTTP 400, `reason: "REPORT_NOT_READY"`, `domain: "reports"` và `localizedMessage` sau:

```json
{
  "locale": "zh-CN",
  "message": "报表 Q3 尚未准备好。"
}
```

Yêu cầu tiếng Anh chỉ đổi ngôn ngữ hiển thị. Mã xử lý tiếp tục phân nhánh theo định danh ổn định. Client cũng có thể tự dịch theo định danh lỗi. Xem [Kiểm tra yêu cầu và xử lý lỗi](request-validation-and-errors.md).

<a id="verify-translation-and-fallback"></a>

## Kiểm tra bản dịch và ngôn ngữ dự phòng

Trong ứng dụng theo template đầy đủ, `pnpm nocobase locales check` đối chiếu danh sách ngôn ngữ khai báo ở client và server. Kiểm tra trình nạp, khóa dịch và kết quả nội suy riêng. `pnpm typecheck` kiểm tra cấu trúc khóa qua kiểu tài nguyên. Trong ví dụ tối giản, dùng `pnpm typecheck` và `pnpm test` vì ví dụ không cài CLI của template.

Kiểm tra khi chạy cần dùng tài nguyên và middleware thật. [Bộ kiểm thử ví dụ](https://github.com/nocobase/docs-examples-v3/tree/44cc65d121ea8cebf26fee77c924119cc57f4aad/apps/server-localization/tests/localization.test.ts) bao phủ nội suy tiếng Anh và Trung, ưu tiên header, cô lập phiên, ngôn ngữ dự phòng, ghi đè plugin và xử lý đồng thời yêu cầu cùng tác vụ nền. Bộ kiểm thử cũng xác nhận lỗi rõ ràng khi thiếu middleware, xử lý đầu vào sai và định danh lỗi nghiệp vụ ổn định giữa các ngôn ngữ.

Ngôn ngữ không hỗ trợ được chuyển về mặc định của ứng dụng. Khi thiếu khóa dịch, môi trường thử tài nguyên mặc định và tiếng Anh, rồi có thể trả về khóa nếu cả hai đều thiếu. Bài kiểm thử cô lập dùng tài nguyên chưa đầy đủ để tái hiện tình huống này. Ứng dụng thực tế nên cung cấp đủ khóa cho từng ngôn ngữ.

<a id="example-source-and-setup"></a>

## Mã nguồn và thiết lập ví dụ

[Mã nguồn đầy đủ và README](https://github.com/nocobase/docs-examples-v3/tree/44cc65d121ea8cebf26fee77c924119cc57f4aad/apps/server-localization) ghi yêu cầu phiên bản, vị trí mã tương ứng với cách dùng và đầu ra dự kiến. Ví dụ dùng Node.js 24, pnpm 11.7.0, App Server `3.0.0-beta.5` và I18n `2.0.0-beta.1`, khớp dependency của template Default `1.0.0-beta.85`.

```sh
git clone https://github.com/nocobase/docs-examples-v3.git
cd docs-examples-v3
git checkout 44cc65d121ea8cebf26fee77c924119cc57f4aad
cd apps/server-localization
pnpm install --frozen-lockfile
pnpm demo request zh-CN
pnpm test
```

Ví dụ tối giản ghép trực tiếp NocoBase Application và các Provider. Lệnh gửi yêu cầu hoặc gọi dịch vụ trong cùng tiến trình rồi dừng ứng dụng khi hoàn tất. Có thể chạy trực tiếp mà không cần trình duyệt, cơ sở dữ liệu hay dịch vụ thư. Khi áp dụng vào ứng dụng hiện có, giữ môi trường chạy, cấu hình và middleware của ứng dụng, rồi hợp nhất tài nguyên ngôn ngữ, route và đăng ký Provider.
