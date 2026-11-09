---
title: Kiểm thử
description: Kiểm thử thành phần, API, lệnh và cơ sở dữ liệu, rồi xác minh giao diện và luồng hoàn chỉnh bằng Playwright, agent và thao tác thủ công.
---

<a id="what-to-test-in-an-application"></a>

## Cần kiểm thử gì trong ứng dụng

Sau khi triển khai tính năng, kiểm tra cách nó hoạt động khi dùng bình thường, khi quyền bị giới hạn và khi thao tác thất bại. Với quản lý sản phẩm, kiểm tra tạo và xuất bản, chặn người chỉ đọc sửa dữ liệu và cho phép thử lại sau khi lưu thất bại.

| Phạm vi | Nội dung kiểm tra | Ví dụ quản lý sản phẩm |
| --- | --- | --- |
| client | Tương tác thành phần, nội dung yêu cầu và phản hồi trạng thái trong môi trường kiểm thử | Gửi đúng tên và giá, giữ đầu vào nếu lỗi |
| server | API, quy tắc nghiệp vụ, danh tính và quyền | Lưu sản phẩm mới ở dạng nháp, chặn tài khoản chỉ đọc xuất bản |
| cli | Thực thi lệnh, đầu ra và xử lý lỗi | Xuất sản phẩm đã xuất bản, từ chối ghi đè tệp |
| database | Thao tác dữ liệu, ràng buộc, transaction, migration và Seed | Hoàn tác thao tác ghi lỗi, áp dụng và rollback migration |
| UI | Hành vi trang và luồng hoàn chỉnh trong trình duyệt thật | Đăng nhập, tạo nháp, xuất bản rồi tải lại để kiểm tra |

Dùng Vitest và app-testing cho bốn nhóm đầu. Kiểm tra UI bằng script Playwright, agent tự thao tác hoặc kiểm tra thủ công. Kiểm thử thành phần xác nhận cách biểu mẫu xử lý yêu cầu, kiểm thử máy chủ xác nhận quyền và thao tác ghi, còn kiểm thử UI xác nhận người dùng hoàn thành được luồng trên ứng dụng đang chạy.

<a id="testing-tools-and-helpers"></a>

## Công cụ và hàm hỗ trợ

### Vitest

Vitest tìm và chạy bài kiểm thử. Dùng `test`, `expect` và `vi.fn()` để khai báo ca, kiểm tra kết quả, ghi nhận hoặc giả lập lời gọi. Vitest cũng có chế độ theo dõi và báo cáo độ bao phủ. Xem [tài liệu Vitest](https://vitest.dev/guide/).

Import và gọi trực tiếp các hàm độc lập. Với trang, plugin, cơ sở dữ liệu hoặc lệnh cần môi trường ứng dụng, dùng app-testing để chuẩn bị. Một bài Vitest có thể kết hợp assertion của Vitest và hàm hỗ trợ app-testing.

### Playwright

Playwright mở ứng dụng đang chạy trong trình duyệt thật để đăng nhập, điền biểu mẫu, bấm nút và tải lại. Công cụ phù hợp với luồng qua nhiều trang, API, phiên và cơ sở dữ liệu.

Playwright có trình chạy riêng. Trong ví dụ, `pnpm test` chạy Vitest và `pnpm test:e2e` chạy Playwright. Chạy riêng hai lệnh.

### app-testing

`@nocobase/app-testing` cung cấp bộ hàm hỗ trợ kiểm thử ứng dụng:

| Điểm import | Hàm chính | Phạm vi |
| --- | --- | --- |
| `@nocobase/app-testing/client` | `renderWithApp()`, `answerApi()` | Render thành phần trong client, kiểm soát phản hồi API và xác minh tương tác |
| `@nocobase/app-testing/server` | `createAppTest()` | Chạy ứng dụng máy chủ với cơ sở dữ liệu cô lập để kiểm tra API, quyền và lưu dữ liệu |
| `@nocobase/app-testing/server` | `createDatabaseTest()`, `describeMigration()` | Kiểm thử riêng thao tác dữ liệu, schema và rollback migration |
| `@nocobase/app-testing/cli` | `createTestAppConfig()`, `bindTestAppCommand()`, `runAppCommand()` | Chuẩn bị cấu hình, chạy lệnh và đọc kết quả cùng đầu ra |

Các hàm giảm phần lặp khi thiết lập ứng dụng, cấp cơ sở dữ liệu và dọn dẹp. Bài kiểm thử vẫn cần assertion cụ thể cho kết quả nghiệp vụ, chẳng hạn xuất bản được phép hoặc người chỉ đọc bị từ chối.

<a id="organizing-and-running-tests"></a>

## Tổ chức và chạy kiểm thử

<a id="test-directories-and-configuration"></a>

### Thư mục và cấu hình

Sắp xếp tệp theo phạm vi dưới `tests/`:

```text
tests/
├── database/     # Database tests
├── server/       # Server tests
├── client/       # Page interaction tests
├── cli/          # Application command tests
└── playwright/   # Browser tests
```

`vitest.config.ts` cấu hình bốn nhóm đầu. Project `client` chạy kiểm thử trang, còn `node` chạy kiểm thử server, lệnh và cơ sở dữ liệu. `playwright.config.ts` cấu hình riêng kiểm thử trình duyệt.

<a id="running-tests-and-reading-results"></a>

### Chạy và đọc kết quả

Chạy từ thư mục gốc. Template mặc định định nghĩa các lệnh trong `package.json`. Với dự án hiện có, dùng script của dự án:

```bash
# Run Vitest tests
pnpm test

# Watch for file changes and rerun tests
pnpm test:watch

# Generate a coverage report
pnpm test:coverage

# Run browser tests; start the test application first
pnpm test:e2e
```

Xem số tệp, số ca và lỗi trong terminal. Thông báo lỗi chỉ assertion, giá trị dự kiến và giá trị thực tế. Xác nhận các ca liên quan thực sự đã chạy.

Sau khi sửa, chạy kiểm thử phần bị ảnh hưởng rồi kiểm tra trang, API hoặc lệnh dùng phần đó. Thay đổi xác thực, dịch vụ chung hoặc cấu trúc dữ liệu còn cần kiểm tra các luồng chính. Khi sửa lỗi, thêm bài tái hiện để phát hiện hồi quy.

<a id="writing-tests-with-vitest"></a>

## Viết kiểm thử bằng Vitest

Các mục sau dùng cùng ứng dụng quản lý sản phẩm. Xem [Mã nguồn và thiết lập ví dụ](#example-source-and-setup). Đoạn mã minh họa phần chính. Tệp được liên kết chứa thiết lập dữ liệu và hàm hỗ trợ đầy đủ.

Mỗi ca chuẩn bị môi trường hoặc dữ liệu, thực hiện thao tác rồi kiểm tra kết quả. Chọn phạm vi theo hành vi cần xác minh. Dùng Vitest trực tiếp cho hàm độc lập và app-testing khi cần dịch vụ, trang hoặc cơ sở dữ liệu.

<a id="database-data-and-migrations"></a>

### Cơ sở dữ liệu và migration

Kiểm tra thao tác dữ liệu, ràng buộc, transaction, migration và Seed. Nếu chưa cần cả ứng dụng, chỉ nạp migration và dữ liệu cần thiết để giảm phụ thuộc.

**Chuẩn bị cơ sở dữ liệu và kiểm tra thao tác**

Import `createDatabaseTest()` từ `@nocobase/app-testing/server`, khai báo nguồn qua `migrations` và dùng `connection` trong ngữ cảnh kiểm thử. Các hàm đến từ `@nocobase/db-testing` và được xuất lại qua điểm vào server.

Mặc định `isolation: 'schema'` đặt lại schema kiểm thử cho mỗi ca, chạy migration và Seed được cung cấp rồi dọn kết nối và cơ sở dữ liệu. Truyền nguồn Seed qua `seeds` khi cần. Dùng `createAppTest()` nếu ca cần dịch vụ plugin hoặc ứng dụng đầy đủ.

Đọc lại sau khi ghi để xác nhận trường và số lượng bản ghi. Với ràng buộc, kiểm tra ghi sai bị từ chối và bản ghi cũ giữ nguyên. Với transaction, tạo lỗi giữa chuỗi thao tác rồi đọc lại để xác nhận không còn dữ liệu ghi dở.

**Kiểm tra migration và Seed**

Dùng `describeMigration()` để chỉ nguồn và kiểm tra kết quả trong callback `up` và `down`. Hàm áp dụng, rollback rồi áp dụng lại migration, nên assertion trong `up` chạy hai lần. Kiểm tra rõ schema, trường và thay đổi dữ liệu.

Kiểm tra Seed ở lần đầu và khi chạy lại, chẳng hạn để xác nhận dữ liệu không trùng và chỉnh sửa của người dùng được giữ. Nếu khởi tạo cần xác thực, phân quyền hoặc dịch vụ plugin khác, nạp cả ứng dụng trong kiểm thử server.

**Chọn cơ sở dữ liệu kiểm thử**

`NOCOBASE_TEST_DB_DIALECT` chọn dialect và mặc định là SQLite. Trước khi đổi, cài driver tương thích và cấu hình dịch vụ cùng thông số kết nối kiểm thử. Tài khoản cần quyền tạo và dọn cơ sở dữ liệu hoặc schema cô lập. Sau khi chuẩn bị PostgreSQL kiểm thử, có thể chạy:

```bash
NOCOBASE_TEST_DB_DIALECT=postgres pnpm test --project node tests/database/catalog-data.test.ts
```

Lệnh minh họa chọn dialect. Ví dụ sản phẩm được kiểm chứng trên SQLite. Các bài server và CLI dùng cơ sở dữ liệu cô lập của bộ công cụ cũng áp dụng lựa chọn này. Xem [thiết lập cơ sở dữ liệu kiểm thử](https://github.com/nocobase/nocobase/blob/6cc8acf0c9062e99c759ed0a9ca1d038c4145705/packages/app/app-skills/skills/nocobase-app-development/references/testing/database/repository.md).

**Ví dụ transaction và migration sản phẩm**

Bài kiểm thử cơ sở dữ liệu chỉ nạp migration sản phẩm:

```ts
import path from 'node:path';
import { createDatabaseTest } from '@nocobase/app-testing/server';
import metadata from '../../package.json' with { type: 'json' };

const test = createDatabaseTest({
  migrations: [{
    packageName: metadata.name,
    directory: path.resolve(import.meta.dirname, '../../database/main/migrations'),
  }],
});
```

Bài sau ném lỗi sau khi ghi trong transaction. Tổng số cuối phải bằng 0:

```ts
test('rolls back every product write when the transaction fails', async ({
  connection,
}) => {
  await expect(
    connection.transaction(async (transaction) => {
      await transaction
        .repository('catalogProducts')
        .createOne({
          values: {
            id: 'rollback',
            name: 'Uncommitted',
            priceCents: 100,
            published: false,
          },
        });
      throw new Error('Simulated downstream failure');
    }),
  ).rejects.toThrow('Simulated downstream failure');
  expect(await connection.repository('catalogProducts').count()).toBe(0);
});
```

Bài migration kiểm tra trường tồn tại rồi xác nhận các bảng đã bị xóa sau rollback:

```ts
describeMigration('202610310001_create_catalog', {
  sources: [
    {
      packageName: 'testing-acceptance',
      directory: path.resolve(
        import.meta.dirname,
        '../../database/main/migrations',
      ),
    },
  ],
  up: async ({ expectCollection }) => {
    await expectCollection('catalogProducts').toHaveField('published', {
      nullable: false,
    });
  },
  down: async ({ expectCollection }) => {
    await expectCollection('catalogProducts').not.toExist();
    await expectCollection('catalogCategories').not.toExist();
  },
});
```

```bash
pnpm test --project node tests/database/catalog.test.ts tests/database/catalog-data.test.ts
```

[Kiểm thử thao tác dữ liệu](https://github.com/nocobase/docs-examples-v3/blob/3e886903c7965530dd6ca50c7840d6ae991f2799/apps/testing-acceptance/tests/database/catalog-data.test.ts) · [Kiểm thử migration](https://github.com/nocobase/docs-examples-v3/blob/3e886903c7965530dd6ca50c7840d6ae991f2799/apps/testing-acceptance/tests/database/catalog.test.ts). Kiểm tra Seed trong bộ server bằng cách chạy Seed mẫu, sửa tên sản phẩm rồi chạy lại để xác nhận dữ liệu không tăng và tên vẫn giữ. Mặc định ứng dụng không nạp sản phẩm lúc khởi động.

<a id="server-apis-and-business-rules"></a>

### API và quy tắc nghiệp vụ phía máy chủ

Kiểm thử server xác minh phản hồi API, quy tắc nghiệp vụ, xác thực, quyền và lưu dữ liệu. Gọi trực tiếp hàm tính toán độc lập. Nạp ứng dụng thật nếu hành vi phụ thuộc plugin hoặc dịch vụ ứng dụng.

**Tạo ứng dụng kiểm thử**

Import `createAppTest()` từ `@nocobase/app-testing/server`. Truyền hàm tạo server qua `createServer` và thiết lập riêng qua `config`. Hàm trả `test` của Vitest với ngữ cảnh:

| Ngữ cảnh | Công dụng |
| --- | --- |
| `request` | Gửi yêu cầu đến API |
| `testApp` | Truy cập ứng dụng kiểm thử, gồm route web qua `fetch` |
| `app` | Truy cập ứng dụng và container dịch vụ |
| `connection` | Truy vấn cơ sở dữ liệu kiểm thử để xem kết quả |

Yêu cầu chạy trong tiến trình. Mặc định các ca trong cùng tệp dùng chung ứng dụng và cơ sở dữ liệu. Đặt `scope: 'test'` để cô lập từng ca. `connections` mặc định cô lập `main`. Nếu ứng dụng quản lý nhiều kết nối, liệt kê tất cả vì kết nối bị bỏ qua giữ cấu hình ứng dụng. Khi phạm vi kết thúc, bộ công cụ đóng ứng dụng và dọn cơ sở dữ liệu kiểm thử.

**Xác minh phản hồi, kết quả và quyền**

Chuẩn bị dữ liệu, gửi yêu cầu thật và kiểm tra mã trạng thái, nội dung cùng dữ liệu đã lưu. Kiểm tra cả đầu vào sai, bản ghi thiếu và xung đột trạng thái. Với API hỗ trợ thử lại, xác nhận không ghi trùng.

Dùng danh tính chưa đăng nhập, đã đăng nhập nhưng thiếu quyền và có quyền. Tạo phiên qua xác thực thật. Với quyền theo phạm vi bản ghi, kiểm tra nhất quán giữa danh sách, tổng số, chi tiết và tệp xuất. Kiểm tra từ chối trực tiếp ở API.

Các ca dùng chung cơ sở dữ liệu nên tự tạo bản ghi và chạy độc lập với thứ tự.

**Ví dụ tạo sản phẩm và kiểm soát truy cập**

Ví dụ nạp ứng dụng thật với cấu hình xác thực riêng cho kiểm thử:

```ts
import { createAppTest } from '@nocobase/app-testing/server';
import { DEFAULT_ADMIN_CREDENTIALS, signIn } from '@nocobase/app-plugin-authentication/testing';
import { expect } from 'vitest';
import { createStandaloneServer } from '../../server/standalone.js';

const test = createAppTest({
  createServer: createStandaloneServer,
  server: { basePath: '/shop' },
  config: {
    app: { publicOrigin: 'http://localhost' },
    auth: {
      secret: 'catalog-test-secret-at-least-32-characters',
      trustedOrigins: ['http://localhost'],
      emailAndPassword: { disableSignUp: false },
    },
  },
});
```

Các ca tạo sản phẩm, lặp yêu cầu với cùng khóa rồi truy vấn cơ sở dữ liệu để xác nhận chỉ ghi một lần. Người dùng thường chỉ đọc sau khi được cấp quyền tường minh. Tạo và xuất bản vẫn trả `403`. Đoạn trích gộp tạo và thử lại để minh họa ngữ cảnh kiểm thử và đăng nhập. `post()` dựng yêu cầu JSON, còn `key()` sinh khóa thao tác:

```ts
test('creates a draft without duplicating retries', async ({ testApp, connection, request }) => {
  expect((await request('/products')).status).toBe(401);
  const admin = await signIn(testApp, DEFAULT_ADMIN_CREDENTIALS);
  const values = { name: 'Catalog test lamp', priceCents: 3500 };
  const operation = key();
  const created = await admin.fetch('/products', post(values, operation));
  expect(created.status).toBe(201);
  const { data } = await created.json();
  expect(data).toMatchObject({ ...values, published: false });
  const repeated = await admin.fetch('/products', post(values, operation));
  expect(repeated.headers.get('Idempotency-Replayed')).toBe('true');
  expect(await connection.repository('catalogProducts').count({
    filter: { name: values.name },
  })).toBe(1);
});
```

```bash
pnpm test --project node tests/server/catalog.test.ts
```

[Xem kiểm thử đầy đủ, thiết lập phiên và assertion quyền](https://github.com/nocobase/docs-examples-v3/blob/3e886903c7965530dd6ca50c7840d6ae991f2799/apps/testing-acceptance/tests/server/catalog.test.ts).

<a id="client-component-interactions-and-state"></a>

### Tương tác và trạng thái thành phần phía client

Kiểm thử client xác nhận thành phần gửi đúng yêu cầu và hiển thị trạng thái mong đợi sau tương tác. Dùng cho ô nhập, nút, hiển thị dữ liệu, báo lỗi và thử lại.

**Render thành phần ứng dụng**

Import `renderWithApp()` từ `@nocobase/app-testing/client` để render thành phần thật với dịch vụ, định tuyến và bản dịch. Cấu hình bản dịch bằng `namespace`, `namespaces` và `locale`. Giữ ngữ cảnh thật cho thành phần phụ thuộc vào ứng dụng.

`renderWithApp()` đóng ứng dụng client khi ca kết thúc. Testing Library tìm phần tử, `userEvent` mô phỏng nhập và bấm, còn `expect()` của Vitest kiểm tra kết quả.

**Kiểm soát yêu cầu và kiểm tra phản hồi UI**

Dùng `fetch: answerApi(handler)` để kiểm soát phản hồi. Trình xử lý đọc `method`, `path` và `json`, rồi trả `Response` với mã và thân đã chọn. Bọc bằng `vi.fn()` để xem nội dung và số lượt gọi.

Kiểm tra khi chờ, thành công và thất bại. Trong lúc chờ, thao tác trùng bị chặn. Thành công cập nhật dữ liệu và phản hồi. Thất bại báo lỗi, giữ đầu vào và cho thử lại. Chờ giao diện cập nhật bất đồng bộ trước khi assertion và giải phóng phản hồi bị trì hoãn trước khi ca kết thúc.

Phản hồi giả kiểm tra cách trang xử lý kết quả. Dùng kiểm thử server để xác nhận lưu dữ liệu và quyền, rồi dùng Playwright cho luồng hoàn chỉnh trong trình duyệt.

**Ví dụ gửi biểu mẫu sản phẩm và phản hồi**

Bài biểu mẫu dùng thành phần thật với phản hồi được kiểm soát. Mỗi ca cung cấp `respond`. `metadata` và `locales` lấy từ ứng dụng:

```tsx
import { answerApi, renderWithApp } from '@nocobase/app-testing/client';

const requests = vi.fn((call: ApiCall) =>
  call.method === 'POST' && call.path === 'products'
    ? respond()
    : new Response(null, { status: 404 }),
);
await renderWithApp(<ProductForm onCreated={onCreated} />, {
  namespace: metadata.name,
  namespaces: { [metadata.name]: locales },
  locale: 'en-US',
  fetch: answerApi(requests),
});
```

Ca thành công kiểm tra tên, giá trong yêu cầu, ô nhập được xóa và số lần callback. Ca lỗi kiểm tra giữ đầu vào và thử lại. Ca chậm kiểm tra nút bị khóa khi lưu. Chạy:

```bash
pnpm test --project client tests/client/product-form.test.tsx
```

[Xem kiểm thử và hàm hỗ trợ đầy đủ](https://github.com/nocobase/docs-examples-v3/blob/3e886903c7965530dd6ca50c7840d6ae991f2799/apps/testing-acceptance/tests/client/product-form.test.tsx).

![Trang sau khi tạo sản phẩm nháp](/assets/core/testing-acceptance/testing-products-draft.png)

![Lưu thất bại giữ đầu vào và cho thử lại](/assets/core/testing-acceptance/testing-products-failure.png)

![Nút bị khóa khi yêu cầu đang chờ](/assets/core/testing-acceptance/testing-products-pending.png)

<a id="cli-application-commands"></a>

### Lệnh ứng dụng CLI

Kiểm thử CLI xác minh đối số, mã thoát, đầu ra chuẩn, lỗi và thay đổi dữ liệu hoặc tệp. Đọc lại tệp xuất để kiểm tra tác động thực tế.

**Chuẩn bị môi trường lệnh**

Import hàm từ `@nocobase/app-testing/cli` và chọn theo nhu cầu của lệnh:

| Dependency của lệnh | Thiết lập |
| --- | --- |
| Chỉ đối số hoặc tệp | Gắn thư mục ứng dụng tạm và ID bằng `bindAppCommand()`, rồi chạy `runAppCommand()` |
| Dịch vụ hoặc cơ sở dữ liệu | Tạo cấu hình cô lập bằng `createTestAppConfig()`, chuẩn bị dữ liệu, gắn lớp lệnh thật bằng `bindTestAppCommand()` rồi chạy |

Dọn tệp tạm và giải phóng cấu hình bằng `config.dispose()`. Ví dụ xuất sản phẩm dùng cách thứ hai. Xem [ví dụ lệnh chỉ thao tác tệp](https://github.com/nocobase/nocobase/blob/6cc8acf0c9062e99c759ed0a9ca1d038c4145705/packages/app/app-skills/skills/nocobase-app-development/references/testing/cli/files.md).

**Chạy lệnh và kiểm tra kết quả**

Chạy `runAppCommand(Command, args)`. Kết quả gồm `exitCode`, `stdout` và `stderr`. Thành công có thể để `exitCode` là `undefined`, nên chuẩn hóa bằng `exitCode ?? 0`. Với JSON, dùng `json()` để đọc kết quả có cấu trúc. Kiểm tra thêm nội dung tệp hoặc truy vấn dữ liệu. Với chạy thử, xác nhận không có thao tác ghi.

Với đối số sai, đích đã có hoặc lỗi thực thi, kiểm tra mã thoát, nội dung lỗi và dữ liệu cũ. Lỗi được xử lý ở chế độ JSON có thể vắng trong `run.error`, nên kiểm tra cả mã thoát và phản hồi.

Việc thu đầu ra tác động đến toàn tiến trình. Chạy các ca tuần tự. `withApp()` đóng ứng dụng khi lệnh xong. Cấu hình do kiểm thử tạo vẫn cần `config.dispose()` trong `finally`.

**Ví dụ xuất sản phẩm đã xuất bản**

Lệnh xuất từ cơ sở dữ liệu thật. Bài kiểm thử chuẩn bị một sản phẩm đã xuất bản và một bản nháp rồi gắn lệnh thật. `config` lấy từ `createTestAppConfig()`, còn `createApp` và `runtime` lấy từ điểm vào ứng dụng:

```ts
const Command = bindTestAppCommand(ExportProducts, {
  rootDir, config, id: 'app:products:export', createApp,
  loadRuntime: () => resolveStandaloneAppRuntime(runtime, {
    rootDir,
    configPath: config.path,
    consoleLogStream: 'stderr',
    env: { APP_STORAGE_DIR: path.join(config.directory, 'storage') },
  }),
});
```

`consoleLogStream: 'stderr'` tách log khỏi JSON. Cấu hình và đường dẫn lưu trữ tạm được giữ đồng bộ. Kết quả báo xuất một bản ghi và tệp loại bản nháp:

```ts
const run = await runAppCommand(Command, ['--output', file, '--json']);
expect(run.exitCode ?? 0).toBe(0);
expect(run.json()).toMatchObject({
  ok: true, result: { count: 1, written: true },
});
```

Kiểm tra thêm chạy thử không tạo tệp và đích đã có trả lỗi, giữ nguyên nội dung. Giải phóng cấu hình trong `finally`.

```bash
pnpm test --project node tests/cli/export.test.ts
```

[Kiểm thử lệnh đầy đủ](https://github.com/nocobase/docs-examples-v3/blob/3e886903c7965530dd6ca50c7840d6ae991f2799/apps/testing-acceptance/tests/cli/export.test.ts) · [Triển khai lệnh xuất](https://github.com/nocobase/docs-examples-v3/blob/3e886903c7965530dd6ca50c7840d6ae991f2799/apps/testing-acceptance/cli/commands/products/export.ts).

Trước khi xuất thủ công, dừng tiến trình ứng dụng đang dùng cùng vùng lưu trữ. Ví dụ chạy một tiến trình và yêu cầu thư mục đầu ra tồn tại. Lệnh từ chối xuất quá 500 sản phẩm công khai.

```bash
pnpm nocobase app products export --output ./products.json --dry-run --json
pnpm nocobase app products export --output ./products.json --json
```

<a id="ui-testing"></a>

## Kiểm thử giao diện

Mở ứng dụng thật để kiểm tra hành vi kết hợp giữa trang, API, phiên và dữ liệu. Chuẩn bị ứng dụng truy cập được, tài khoản có vai trò cần thiết, dữ liệu dễ phân biệt và cách dọn dẹp sau kiểm tra.

| Phương pháp | Khi dùng | Bằng chứng |
| --- | --- | --- |
| Playwright | Kiểm tra lặp và hồi quy luồng ổn định | Ca kiểm thử, báo cáo và trace |
| Agent tự kiểm tra | Kiểm tra UI đã sửa trong lúc phát triển, khắc phục và kiểm tra lại | Thao tác, quan sát, vấn đề và kết quả kiểm tra lại |
| Kiểm tra thủ công | Đối chiếu luồng, thuật ngữ và khả năng sử dụng với công việc thật | Kịch bản, kết quả dự kiến và thực tế, phản hồi người dùng |

Cả ba cần bao phủ luồng chính, khác biệt theo vai trò và trạng thái lỗi liên quan. Tải lại hoặc mở lại trang để kiểm tra dữ liệu còn. Dùng thêm kiểm thử quyền API để xác nhận máy chủ từ chối yêu cầu trái phép.

<a id="automated-verification-with-playwright"></a>

### Kiểm chứng tự động bằng Playwright

Kiểm tra hành trình hoàn chỉnh trong trình duyệt thật, qua trang, API, phiên và cơ sở dữ liệu. Dùng cho đăng nhập, gửi, điều hướng, tải lại và luồng nhiều trang.

**Chuẩn bị ứng dụng, tài khoản và dữ liệu**

Khởi động ứng dụng kiểm thử riêng, cấu hình địa chỉ và chuẩn bị các mức quyền khác nhau. Tạo phiên qua đăng nhập thật, dùng dữ liệu dễ phân biệt và quyết định dọn hay giữ bản ghi để các lần chạy độc lập.

Kiểm thử trình duyệt cần dịch vụ đang chạy riêng với môi trường yêu cầu nội tiến trình của kiểm thử server. Cài trình duyệt qua Playwright, ví dụ `pnpm exec playwright install chromium`.

**Tương tác với trang và xác nhận kết quả**

Ưu tiên tìm phần tử theo vai trò, nhãn hoặc tên hỗ trợ tiếp cận. Dùng `fill()`, `click()` rồi assertion Playwright để chờ trạng thái dự kiến.

Kiểm tra luồng thường và tình huống lỗi liên quan. Phản hồi mạng kiểm soát được giúp tái hiện lỗi hoặc độ trễ để kiểm tra thông báo, thử lại và gửi trùng. Ghi rõ ca nào dùng phản hồi mô phỏng và ca nào dùng API thật.

**Xem lỗi và báo cáo**

Bắt đầu từ tên ca, vị trí assertion và kết quả thực tế. Khi cần điều tra thêm, bật báo cáo HTML và giữ trace của ca lỗi:

```bash
pnpm test:e2e --reporter=html --trace=retain-on-failure
```

Cấu hình địa chỉ và tài khoản theo dự án. Báo cáo nằm ở `playwright-report/`. Trace giúp xem trạng thái trang và yêu cầu mạng quanh từng thao tác. Xem [Playwright reporters](https://playwright.dev/docs/test-reporters) và [Trace Viewer](https://playwright.dev/docs/trace-viewer-intro).

**Ví dụ tạo và xuất bản sản phẩm**

Khởi động theo [Mã nguồn và thiết lập ví dụ](#example-source-and-setup). `pnpm run setup` tạo tài khoản chỉnh sửa và chỉ đọc rồi lưu thông tin đăng nhập trong `storage/demo.json`. Đặt `APP_URL` thành địa chỉ đầy đủ, gồm đường dẫn cơ sở:

```bash
pnpm exec playwright install chromium
APP_URL='http://<host>:13320/main' pnpm test:e2e tests/playwright/products.test.ts
```

Kiểm thử đọc thông tin đăng nhập cục bộ và tạo phiên thật. Ca tạo tên sản phẩm duy nhất, tải lại để xác nhận bản nháp, rồi xuất bản và tải lại:

```ts
await page.getByLabel('Product name', { exact: true }).fill(name);
await page.getByLabel('Price in cents', { exact: true }).fill('2400');
await page.getByRole('button', { name: 'Create draft', exact: true }).click();
await expect(page.getByText('Draft created.', { exact: true })).toBeVisible();
await page.reload();
const row = page.getByRole('row').filter({ hasText: name });
await expect(row).toContainText('Draft');
await row.getByRole('button', { name: 'Publish', exact: true }).click();
await expect(row).toContainText('Published');
await page.reload();
await expect(row).toContainText('Published');
```

![Sản phẩm vẫn ở trạng thái Published sau khi tải lại](/assets/core/testing-acceptance/testing-products-published.png)

Tài khoản chỉ đọc thiếu điều khiển tạo và xuất bản. Yêu cầu trực tiếp đến API tạo trả `403`. Một ca khác tiêm lỗi và độ trễ để kiểm tra giữ đầu vào, thử lại và chờ. Xem [kiểm thử client](#client-component-interactions-and-state) về trạng thái trang.

![Tài khoản chỉ đọc xem được sản phẩm và chỉ có thao tác xem](/assets/core/testing-acceptance/testing-products-viewer.png)

Các sản phẩm tạo trong kiểm thử được giữ để kiểm tra. Chạy trên ứng dụng kiểm thử riêng. [Xem bộ kiểm thử trình duyệt](https://github.com/nocobase/docs-examples-v3/blob/3e886903c7965530dd6ca50c7840d6ae991f2799/apps/testing-acceptance/tests/playwright/products.test.ts).

<a id="autonomous-agent-verification"></a>

### Agent tự kiểm tra

Trong lúc phát triển, agent chọn thao tác theo thay đổi và trạng thái trang, quan sát kết quả, sửa vấn đề rồi làm lại. Agent có thể dùng công cụ tự động hóa trình duyệt trực tiếp và chuyển luồng ổn định sang Playwright khi cần.

**Chủ động kiểm tra khi phát triển**

[Quy trình frontend](https://github.com/nocobase/nocobase/blob/139e754fd526313ec36b8a31c5f99ee45a06467f/packages/app/app-skills/skills/nocobase-app-development/references/frontend/ui-workflow.md) của Skill phát triển ứng dụng NocoBase yêu cầu kiểm tra phần tử đã đổi và tương tác bị ảnh hưởng nếu thay đổi nhìn thấy khi chạy. Trang mới còn cần kiểm tra thao tác thật, lưu và tải lại, quyền, trạng thái rỗng và lỗi liên quan.

Nếu có công cụ trình duyệt và phiên đăng nhập, xác minh trang là một phần của việc hoàn thành phát triển. Agent chọn phạm vi dựa trên thay đổi. Công cụ điều khiển trình duyệt đến từ môi trường agent.

**Tương tác, chẩn đoán và kiểm tra lại**

Nếu đổi biểu mẫu tạo sản phẩm, mở trang, điền và gửi, xem phản hồi và danh sách rồi tải lại để kiểm tra dữ liệu còn. Nếu đổi quyền, kiểm tra điều khiển bằng tài khoản chỉ đọc. Nếu đổi gửi biểu mẫu, thử chờ, lỗi và gửi lại theo [ví dụ client](#client-component-interactions-and-state).

Khi nút không phản hồi, dữ liệu chưa cập nhật hoặc trang lỗi, xem trạng thái trang, lỗi console, yêu cầu mạng và log máy chủ. Sửa rồi lặp đúng bước tái hiện và kiểm tra tương tác liên quan. Dùng kết quả thực tế để xác nhận gửi, lưu dữ liệu và quyền.

**Ghi nhận kiểm chứng thực tế**

Khi bàn giao, liệt kê trang, vai trò, thao tác, kết quả quan sát và lần kiểm tra lại sau sửa. Kèm ảnh trạng thái liên quan khi cần.

Nếu thiếu trình duyệt, khởi động lỗi hoặc chưa có phiên, ghi rõ trở ngại và các mục chưa xác minh. Thêm ca hồi quy cho vấn đề cần tiếp tục bảo vệ.

<a id="manual-verification"></a>

### Kiểm tra thủ công

Nhà phát triển, người kiểm thử hoặc người dùng nghiệp vụ thao tác trực tiếp để đánh giá luồng, điều khiển và thông báo. Dùng kết quả agent làm đầu vào và kiểm tra độc lập các kịch bản quan trọng.

**Đi qua luồng theo vai trò**

Chuẩn bị phiên bản, môi trường, tài khoản và dữ liệu. Dùng cả vai trò nghiệp vụ thực tế. Xác định điều kiện, thao tác và kết quả dự kiến cho từng kịch bản, rồi thực hiện đúng trình tự, gồm chuyển trang và bàn giao giữa vai trò.

| Vai trò và điều kiện | Thao tác | Kết quả dự kiến |
| --- | --- | --- |
| Người chỉnh sửa đã đăng nhập | Tạo sản phẩm và tải lại | Sản phẩm còn và ở dạng nháp |
| Người chỉnh sửa có sản phẩm nháp | Xuất bản rồi mở danh mục công khai | Trạng thái đã xuất bản và sản phẩm xuất hiện trong danh mục |
| Tài khoản chỉ đọc đã đăng nhập | Mở trang và xem sản phẩm | Thấy sản phẩm và chỉ có điều khiển xem |

Đối chiếu phản hồi UI với dữ liệu. Dùng tài khoản khác nhau để xác nhận bản ghi hiển thị đúng trách nhiệm. Ghi thao tác, kết quả dự kiến, quan sát và đạt hay không cho từng ca. Khi báo lỗi, thêm phiên bản, vai trò, dữ liệu liên quan, bước tái hiện và ảnh hoặc chi tiết lỗi khi cần.

**Kiểm tra khả năng sử dụng và xử lý lỗi**

| Tình huống | Nội dung kiểm tra |
| --- | --- |
| Thiếu trường bắt buộc hoặc đầu vào sai | Thông báo có chỉ rõ lỗi và cách sửa không? |
| Hủy, quay lại hoặc mở lại trang | Trạng thái có đúng và dữ liệu chưa lưu được xử lý phù hợp không? |
| Bấm lặp hoặc yêu cầu chậm | Có phản hồi đang chờ và chặn gửi hay tạo bản ghi trùng không? |
| Thử lại sau lỗi | Đầu vào có còn, lỗi có dễ hiểu và có thể tiếp tục không? |
| Kích thước màn hình cần hỗ trợ hoặc thao tác bàn phím | Nội dung có đầy đủ, thứ tự tiêu điểm và điều khiển có dùng được không? |

Tái hiện lỗi và độ trễ trong môi trường kiểm soát, chẳng hạn chỉnh điều kiện mạng bằng công cụ trình duyệt, rồi khôi phục thiết lập. Các ca tự động của ví dụ kiểm soát lỗi và độ trễ. Xem [kiểm thử client](#client-component-interactions-and-state) và [kiểm thử Playwright](#automated-verification-with-playwright).

Nhờ người dùng thực tế đối chiếu thuật ngữ, thứ tự thao tác và thông báo với công việc hằng ngày. Bổ sung phát hiện vào kịch bản. Tự động hóa kiểm tra ổn định cần chạy định kỳ.

Sau khi sửa, kiểm tra lại lỗi gốc, luồng thường liên quan và các vai trò bị ảnh hưởng. Khi phiên bản, cấu hình, cơ sở dữ liệu hoặc trình duyệt thay đổi, kiểm tra lại các kịch bản chính trên môi trường đích và cập nhật hồ sơ.

<a id="example-source-and-setup"></a>

## Mã nguồn và thiết lập ví dụ

[Ứng dụng quản lý sản phẩm mẫu](https://github.com/nocobase/docs-examples-v3/tree/3e886903c7965530dd6ca50c7840d6ae991f2799/apps/testing-acceptance) nằm trong `nocobase/docs-examples-v3`. Liên kết trên trang ghim cùng commit. Dùng Node.js 24 và pnpm 11.7.0:

```bash
git clone https://github.com/nocobase/docs-examples-v3.git
cd docs-examples-v3
git checkout 3e886903c7965530dd6ca50c7840d6ae991f2799
cd apps/testing-acceptance
pnpm install --frozen-lockfile
pnpm run setup
pnpm dev
```

Mở URL đầy đủ in khi chạy lệnh phát triển rồi vào **Products**. Dùng tài khoản chỉnh sửa hoặc chỉ đọc trong `storage/demo.json`. `setup` giữ cấu hình và tài khoản hiện có. Dữ liệu được giữ khi chạy lại. Để thông tin đăng nhập, cấu hình và cơ sở dữ liệu đã sinh ngoài Git.

Với tài khoản chỉnh sửa, nhập **Product name** và **Price in cents**, bấm **Create draft** rồi **Publish** trên hàng. Trang hiện 50 sản phẩm đầu. Danh mục công khai chỉ hiện sản phẩm đã xuất bản, HTTP CSV xuất theo quyền dữ liệu của tài khoản hiện tại và CLI JSON chỉ xuất sản phẩm công khai. Dữ liệu còn sau khi tải lại và khởi động lại.

[README](https://github.com/nocobase/docs-examples-v3/blob/3e886903c7965530dd6ca50c7840d6ae991f2799/apps/testing-acceptance/README.md) hướng dẫn truy cập LAN, dựng để triển khai, lệnh kiểm thử và vị trí mã cùng kết quả kiểm chứng. Ví dụ đã thử trên SQLite. Cơ sở dữ liệu khác, engine trình duyệt khác và chế độ nhiều tiến trình cần kiểm chứng riêng. README cũng ghi phiên bản dependency, kết quả chạy và cách chụp ảnh.
