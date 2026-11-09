---
title: Route và HTTP API của plugin
description: Thêm endpoint plugin với kiểm tra đầu vào, hợp đồng phản hồi, kiểm soát truy cập và bài kiểm thử.
---

API của plugin nhận yêu cầu, kiểm tra đầu vào và quyền truy cập, rồi gọi logic nghiệp vụ. Ví dụ xem trước thông báo bằng cách cắt khoảng trắng đầu cuối và trả văn bản cùng số ký tự. Dữ liệu chỉ dùng để tạo phản hồi xem trước.

Với truy vấn Collection thông thường hoặc thao tác ghi đơn giản, dùng [`defineRepositoryApiRoutes()`](../framework/http/repository-routes.md) và thêm khai báo vào `routes` của plugin. Ứng dụng và plugin dùng chung cơ chế này. Bài này minh họa endpoint nghiệp vụ tùy chỉnh.

## Cùng Agent

```text
Tạo plugin notice-api trong ứng dụng này với endpoint xem trước thông báo.
Endpoint chỉ xử lý văn bản từ yêu cầu hiện tại, không đọc dữ liệu nghiệp vụ
và không lưu dữ liệu, nên có thể mở công khai.
Kiểm tra độ dài, dùng phản hồi và lỗi chuẩn, viết tài liệu và kiểm thử API,
sau đó đăng ký plugin.
```

## Chuẩn bị plugin

Chạy lệnh từ gốc ứng dụng hiện có. Đường dẫn bên dưới tính từ `packages/app-plugin-notice-api/`. Nếu plugin cùng tên đã tồn tại, dùng mã hiện có làm điểm bắt đầu.

```bash
pnpm create @nocobase/plugin@beta notice-api --with server.routes --with server.service-providers
```

Thêm `zod` vào `dependencies` của plugin với phiên bản tương thích đã cài trong ứng dụng. Chạy `pnpm install` từ gốc ứng dụng. Khung đã cấu hình `hono` và hợp đồng runtime. Giữ tệp tập hợp Provider, khai báo Server và điểm vào công khai.

## Cung cấp dịch vụ xem trước

Thay nội dung `server/tokens.ts` bằng hợp đồng và token.

```ts
import {
  createServiceToken,
  type ServiceToken,
} from '@nocobase/service-provider';

export interface NoticePreview {
  readonly text: string;
  readonly length: number;
}
export interface NoticeApiService {
  preview(text: string): NoticePreview;
}
export const noticeApiServiceToken: ServiceToken<NoticeApiService> =
  createServiceToken<NoticeApiService>(
    '@nocobase/app-plugin-notice-api/service',
  );
```

Thay nội dung `server/services/notice-api.ts`.

```ts
import type { NoticePreview, NoticeApiService } from '../tokens.js';

export class DefaultNoticeApiService implements NoticeApiService {
  public preview(text: string): NoticePreview {
    const normalized = text.trim();
    return { text: normalized, length: Array.from(normalized).length };
  }
}
```

Provider do công cụ sinh đã gắn `noticeApiServiceToken` với phần triển khai này. Route dùng container hiện có. Dịch vụ xử lý văn bản độc lập với HTTP. Xem [ServiceProvider](service-provider.md). Độ dài ở đây đếm điểm mã Unicode. Để đếm cụm ký tự người dùng nhìn thấy, cần quy tắc riêng.

## Khai báo đầu vào, đầu ra và route

Tạo `server/routes/schemas.ts`.

```ts
import { z } from 'zod';
import type { NoticePreview } from '../tokens.js';

export const PreviewQuery: z.ZodObject<{ text: z.ZodString }> = z.object({
  text: z.string().trim().min(1).max(200),
});
export const PreviewSchema: z.ZodType<NoticePreview> = z.object({
  text: z.string(),
  length: z.number().int().nonnegative(),
});
```

Đầu vào được cắt khoảng trắng trước khi kiểm tra. Giới hạn 200 dùng độ dài chuỗi JavaScript. Nếu sản phẩm đếm theo cụm ký tự, khai báo quy tắc tương ứng. Schema được xuất cần kiểu tường minh để build với `isolatedDeclarations`.

Thay nội dung `server/routes/index.ts`.

```ts
import type { ServiceContainer } from '@nocobase/service-provider';
export interface NoticeRoutesApplication {
  readonly container: ServiceContainer;
}
import {
  apiErrorHandler,
  apiErrorResponse,
  apiValidator,
  dataResponse,
  defineApiRoutes,
  describeRoute,
  type AppApiRouteContribution,
} from '@nocobase/app-server/router';
import { Hono } from 'hono';

import { noticeApiServiceToken } from '../tokens.js';
import { PreviewQuery, PreviewSchema } from './schemas.js';

export const apiRoutes: AppApiRouteContribution<NoticeRoutesApplication> =
  defineApiRoutes((app) => {
    const service = app.container.resolve(noticeApiServiceToken);
    const router = new Hono();
    router.onError(apiErrorHandler);
    router.get(
      '/noticeApi/preview',
      describeRoute({
        tags: ['NoticeApi'],
        summary: 'Preview notice text',
        operationId: 'noticeApiPreviewText',
        security: [],
        responses: {
          200: dataResponse(PreviewSchema),
          500: apiErrorResponse(500),
        },
      }),
      apiValidator('query', PreviewQuery),
      (context) => {
        const { text } = context.req.valid('query');
        return context.json({ data: service.preview(text) });
      },
    );
    return router;
  });
const routes: readonly AppApiRouteContribution<NoticeRoutesApplication>[] = [
  apiRoutes,
];
export default routes;
```

`NoticeRoutesApplication` chỉ khai báo năng lực container mà route dùng. Ứng dụng thật đáp ứng giao diện này. Bài kiểm thử có thể cung cấp fixture nhỏ đủ thuộc tính.

| Thành phần | Công dụng |
| --- | --- |
| `defineApiRoutes()` | Cho ứng dụng gắn route dưới tiền tố API |
| `describeRoute()` | Thêm khai báo OpenAPI, gồm mô tả truy cập công khai của ví dụ |
| `apiValidator()` | Kiểm tra đầu vào, trả 400 chuẩn khi lỗi. Handler đọc qua `req.valid()` |
| `dataResponse()` | Mô tả cấu trúc `{ data }` trong tài liệu. Handler tạo phản hồi thực tế |
| `apiErrorHandler` | Dùng lỗi chuẩn kể cả khi kiểm thử router độc lập |

Đường dẫn khai báo là `/noticeApi/preview`. Với tiền tố triển khai mặc định `/main`, mở `/main/api/noticeApi/preview?text=Hello`. Client dùng `useApiClient()` gọi với `path: 'noticeApi/preview'` để dùng địa chỉ server đã cấu hình.

## Tập hợp đóng góp và tích hợp ứng dụng

Mảng xuất từ `server/routes/index.ts` đi vào ứng dụng qua `routes` trong `server/plugin.ts`. `serviceProviders` đăng ký các dịch vụ plugin. Ứng dụng import điểm vào Server công khai, cung cấp tiền tố API và môi trường yêu cầu. Khi thêm route, bổ sung vào khai báo tổng hợp và giữ các đóng góp hiện có.

Ví dụ giữ trọn dịch vụ xem trước để có thể chạy độc lập. Xem [Dịch vụ nghiệp vụ và ServiceProvider](server-services.md) về token công khai và dùng chung qua nhiều điểm vào, cùng [Kiểm tra yêu cầu và xử lý lỗi](../developing-apps/request-validation-and-errors.md) về quy tắc chung. Với công việc bất đồng bộ, handler gọi [dịch vụ gửi tác vụ nền](background-jobs.md) sau khi ứng dụng khởi động. Factory tạo route chỉ chuẩn bị handler.

## Xác định ranh giới truy cập

Xem [Xác thực, phân quyền và phạm vi dữ liệu](../developing-apps/authentication-and-permissions.md) để tích hợp cơ chế xác thực, vai trò và policy dữ liệu hiện có.

Ví dụ cố ý cho phép xem trước ẩn danh vì chỉ xử lý văn bản đầu vào, không đọc bản ghi người dùng hay nghiệp vụ và không đổi trạng thái. `security: []` mô tả yêu cầu xác thực trong tài liệu API. Middleware server thực thi kiểm soát truy cập.

Với endpoint nội bộ, import `authenticationToken` gốc từ `@nocobase/app-plugin-authentication`, gắn `app.container.resolve(authenticationToken).required()` trên đường dẫn cần bảo vệ và bỏ `security: []`. Khai báo runtime cần dùng chung định danh, chẳng hạn plugin xác thực, làm peer dependency tương thích. Với thao tác nhạy cảm, đặt thêm quyền tài nguyên và quyền thao tác tường minh. Thực hiện theo thứ tự xác thực, phân quyền, kiểm tra đầu vào rồi chạy logic nghiệp vụ. Bảo vệ API ở server kể cả khi trang đã yêu cầu đăng nhập.

Với lỗi nghiệp vụ, ném `ApiError` kèm trạng thái như `NOT_FOUND`, `reason` ổn định và `domain` của plugin. Để bộ xử lý lỗi tạo JSON chuẩn. Giữ stack và thông tin xác thực ở phía server. Kiểm thử riêng người chưa đăng nhập, người bị từ chối và người có quyền cho thao tác được bảo vệ.

## Kiểm thử và đăng ký

Thay assertion route rỗng trong `tests/server/routes.test.ts`.

```ts
import {
  findUndeclaredApiRoutes,
  generateApiDocument,
} from '@nocobase/app-server/router';
import { ServiceContainer } from '@nocobase/service-provider';
import { describe, expect, it } from 'vitest';
import { apiRoutes } from '../../server/routes/index.js';
import { NoticeApiProvider } from '../../server/providers/notice-api.js';

async function createRouter() {
  const container = new ServiceContainer();
  new NoticeApiProvider({ container }).register();
  return apiRoutes.createRouter({ container });
}
describe('notice preview API', () => {
  it('previews public text without persisting it', async () => {
    const router = await createRouter();
    const response = await router.request(
      '/noticeApi/preview?text=%20Hello%20',
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      data: { text: 'Hello', length: 5 },
    });
    expect(findUndeclaredApiRoutes(router)).toEqual([]);
    const document = await generateApiDocument(router, {
      info: { title: 'Notice Tools', version: '1' },
    });
    expect(document.paths?.['/api/noticeApi/preview']?.get).toBeDefined();
  });
  it.each(['', '?text=', `?text=${'a'.repeat(201)}`])(
    'rejects invalid input %s',
    async (query) => {
      const router = await createRouter();
      const response = await router.request(`/noticeApi/preview${query}`);
      expect(response.status).toBe(400);
      expect(await response.json()).toMatchObject({
        error: { reason: 'INVALID_INPUT' },
      });
    },
  );
});
```

Thay `tests/server/service-provider.test.ts` do công cụ sinh để kiểm tra hành vi xem trước. Giữ các bài kiểm thử khác còn đúng với plugin.

```ts
import { ServiceContainer } from '@nocobase/service-provider';
import { describe, expect, it } from 'vitest';
import { NoticeApiProvider } from '../../server/providers/notice-api.js';
import { noticeApiServiceToken } from '../../server/tokens.js';

describe('notice service', () => {
  it('registers a lazy singleton and normalizes text', () => {
    const container = new ServiceContainer();
    new NoticeApiProvider({ container }).register();
    expect(container.resolveIfCreated(noticeApiServiceToken)).toBeUndefined();
    const service = container.resolve(noticeApiServiceToken);
    expect(service.preview('  欢迎 👋  ')).toEqual({
      text: '欢迎 👋',
      length: 4,
    });
    expect(container.resolve(noticeApiServiceToken)).toBe(service);
  });
});
```

```bash
pnpm --filter @nocobase/app-plugin-notice-api format
pnpm --filter @nocobase/app-plugin-notice-api check
```

```bash
pnpm nocobase plugin register @nocobase/app-plugin-notice-api --no-install --dry-run
pnpm nocobase plugin register @nocobase/app-plugin-notice-api --no-install
```

Khởi động hoặc khởi động lại ứng dụng. URL ở trên phải trả `{"data":{"text":"Hello","length":5}}`. Thiếu đầu vào, chuỗi rỗng hoặc quá dài trả 400. Sau khi đăng nhập, mở `/main/api/swagger/docs` để kiểm tra khai báo. Điều chỉnh tiền tố theo cách triển khai.

Chạy `pnpm build` của ứng dụng. Kiểm tra tiền tố triển khai, middleware toàn ứng dụng và đăng nhập thật trong ứng dụng đích. Xem [Kiểm thử và kiểm chứng](testing-and-verification.md).
