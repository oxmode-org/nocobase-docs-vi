---
title: Tham chiếu API
description: Tra điểm vào công khai và hợp đồng thường dùng cho dịch vụ, HTTP, cấu hình và cơ sở dữ liệu trong NocoBase 3.
---

Bài này liệt kê API công khai thường dùng, giá trị trả về và ràng buộc theo tình huống. Tra khai báo kiểu trong package đã cài để xem đầy đủ tham số, overload và kiểu hỗ trợ. Xem [Phát triển ứng dụng](../developing-apps/overview.md) và [Framework](../framework/overview.md) về quy trình, hoặc [Cơ sở dữ liệu](../framework/database/overview.md) để học schema, truy vấn và transaction.

## Điểm import công khai

| Điểm vào | Điểm xuất thường dùng | Công dụng |
| --- | --- | --- |
| `@nocobase/app-client` | `createApp`, `defineClientPlugin`, `defineAppRoutes`, `useService`, `useApiClient` | Lắp ghép client, route, dịch vụ và yêu cầu |
| `@nocobase/app-server` | `defineServerPlugin`, `defineServerPlugins` | Khai báo plugin Server |
| `@nocobase/app-server/router` | `defineApiRoutes`, `defineRepositoryApiRoutes`, `defineRootRoutes`, `defineHttpMiddleware`, `apiValidator`, `ApiError` | Endpoint HTTP, kiểm tra đầu vào và lỗi |
| `@nocobase/app-server/config` | `defineAppConfig`, `defaultAppConfigs`, `envString`, `envInteger`, `envBoolean` | Cấu hình server và ánh xạ biến môi trường |
| `@nocobase/service-provider` | `ServiceProvider`, `ServiceContainer`, `createServiceToken` | Container và vòng đời dịch vụ client/server |
| `@nocobase/api-client` | `createApiClient`, `ApiClientError` | HTTP client độc lập |
| `@nocobase/db` | `createDatabaseManager`, `databaseManagerToken` | Quản lý cơ sở dữ liệu và dịch vụ cơ sở dữ liệu của ứng dụng |

Đường dẫn nguồn có thể khác điểm xuất npm. Dùng điểm vào công khai được khai báo trong `package.json`. Xem [Danh mục package Core và công cụ](packages.md).

## Container dịch vụ và dependency injection

Client và server dùng cùng cơ chế container, với instance riêng theo runtime.

| API | Công dụng và giá trị trả về |
| --- | --- |
| `createServiceToken<T>(name)` | Tạo định danh dịch vụ có kiểu |
| `container.instance(token, value)` | Đăng ký instance có sẵn, trả `void` |
| `container.singleton(token, factory)` | Đăng ký factory đồng bộ. Container tạo và lưu instance ở lần phân giải đầu tiên |
| `container.resolve(token)` | Trả dịch vụ. Ném lỗi khi thiếu đăng ký hoặc có vòng phụ thuộc |
| `container.has(token)` | Kiểm tra đăng ký |
| `container.resolveIfCreated(token)` | Đọc instance đã tạo hoặc trả `undefined` |
| `ServiceProvider.register()` | Đăng ký dịch vụ đồng bộ |
| `boot()`, `start()`, `ready()`, `shutdown()` | Hook vòng đời bất đồng bộ của Provider |

```ts
import { createServiceToken, ServiceContainer } from '@nocobase/service-provider';

interface GreetingService {
  greet(name: string): string;
}

const greetingToken = createServiceToken<GreetingService>('example.greeting');
const services = new ServiceContainer();
services.singleton(greetingToken, () => ({
  greet: (name) => `Hello, ${name}`,
}));

const message = services.resolve(greetingToken).greet('NocoBase');
// Hello, NocoBase
```

Mỗi container chỉ gắn một lần cho mỗi token. Token mới cùng tên vẫn có định danh riêng. Bên sử dụng import token do Provider xuất. Factory singleton chạy đồng bộ. Thực hiện khởi tạo bất đồng bộ trong hook vòng đời.

Trong ứng dụng, dùng container sẵn có của runtime. Component React phân giải dịch vụ bằng `useService(token)`. Mã server thường gọi `app.container.resolve(token)`. React Provider cung cấp Context cho cây component, còn ServiceProvider đăng ký dịch vụ. Xem [ServiceProvider](../extension-development/service-provider.md) về đăng ký và thứ tự thực thi.

## Yêu cầu từ client

Gọi `useApiClient()` trong component React để lấy client đã cấu hình. Mã độc lập có thể khai báo dependency trực tiếp vào `@nocobase/api-client` rồi gọi `createApiClient({ baseURL })`. Client ứng dụng cũng xuất lại giao diện và kiểu liên quan.

| API | Giá trị trả về hoặc ràng buộc |
| --- | --- |
| `api.request<T>(options)` | `Promise<T>` chứa toàn bộ body đã phân tích |
| `api.stream(options)` | `Promise<ReadableStream<Uint8Array>>` |
| `api.repository(name)` | Client từ xa cho endpoint Repository tương ứng trên server |
| `ApiClientError` | Lỗi HTTP có cấu trúc, gồm thông tin trạng thái |

Tùy chọn gồm `path`, `method`, `query`, `headers`, `signal` và `credentials`. Dùng `json` cho body JSON hoặc `body` cho loại khác. Phương thức mặc định là `GET`, còn `credentials` mặc định là `include`.

```ts
import type { ApiClient } from '@nocobase/app-client';

type Announcement = { id: string; title: string };

export async function loadAnnouncements(api: ApiClient) {
  const response = await api.request<{ data: Announcement[] }>({
    path: '/announcements',
    method: 'GET',
    query: { limit: 20 },
  });
  return response.data;
}
```

Ví dụ giả định ứng dụng có endpoint thông báo trả `{ data: [...] }`. `request()` giữ cấu trúc bao ngoài. Tham số kiểu TypeScript mô tả kiểu dự kiến. Kiểm tra dữ liệu phản hồi ở runtime nếu cần. Để dùng `repository()` từ xa, khai báo endpoint tương ứng. Server vẫn phụ trách xác thực, kiểm tra đầu vào và phân quyền dữ liệu.

## HTTP phía server

| API | Công dụng |
| --- | --- |
| `defineApiRoutes(createRouter)` | Khai báo route Hono dưới tiền tố API |
| [`defineRepositoryApiRoutes({ repositories, principal? })`](../framework/http/repository-routes.md) | Khai báo endpoint dữ liệu Repository với Collection, thao tác và policy tường minh |
| `defineRootRoutes(createRouter)` | Khai báo route dưới gốc ứng dụng |
| `defineHttpMiddleware({ name, register })` | Đăng ký middleware HTTP có tên |
| `apiValidator(target, schema)` | Kiểm tra đầu vào yêu cầu |
| `ApiError` | Ném lỗi API mà framework nhận diện |

Factory route nhận ứng dụng và trả Hono Router. Đăng ký khai báo qua điểm mở rộng của ứng dụng hoặc plugin. Tiền tố API thường là `/api`, đặt dưới đường dẫn cơ sở của ứng dụng nếu có.

Import helper mô tả OpenAPI từ `@nocobase/app-server/router` để dùng cùng bộ đăng ký metadata. Ứng dụng cung cấp giao diện tại `/api/swagger` và tài liệu tại `/api/swagger/docs` khi có quyền. Template mặc định kiểm tra danh tính và quyền trước khi cho truy cập.

Xem [Route HTTP và API](../developing-apps/apis-and-services.md) và [API server của plugin](../extension-development/server-apis.md) để xem ví dụ đầy đủ.

## Cấu hình

| API | Công dụng |
| --- | --- |
| `defineAppConfig({ defaults, env, validate, public })` | Định nghĩa phần cấu hình server và quy tắc |
| `defaultAppConfigs({ section: factory })` | Ghép các phần cấu hình |
| `config.get<T>(key)` | Đọc giá trị theo đường dẫn, có thể trả `undefined` |
| `config.reload()` | Nạp lại cấu hình. Bên gọi xử lý cách dịch vụ tiếp nhận giá trị mới |

`public` khai báo các đường dẫn lá mà trình duyệt được đọc, tính tương đối từ phần cấu hình. Công khai trường tường minh ở server. Xem [Tham chiếu cấu hình](configuration.md) về thứ tự ưu tiên, ví dụ và biến môi trường.

## Quản lý cơ sở dữ liệu

Trong ứng dụng, phân giải `databaseManagerToken` hiện có. Công cụ độc lập và bài kiểm thử tự tạo rồi giải phóng DatabaseManager.

| API | Giá trị trả về hoặc công dụng |
| --- | --- |
| `createDatabaseManager(config)` | Tạo manager |
| `db.connection(name?)` | Lấy kết nối theo tên hoặc lấy kết nối mặc định |
| `db.connect(name?)` | Kết nối bất đồng bộ và trả kết nối |
| `db.builder(name?)` | Lấy CollectionBuilder |
| `db.query(name?)` | Lấy QueryAdapter |
| `db.collections(name?)` | Lấy giao diện khám phá và chẩn đoán Collection |
| `db.repository(collection, connection?)` | Lấy Repository cho Collection logic |
| `db.transaction(callback, name?)` | Chạy callback trên kết nối transaction và trả kết quả |
| `db.destroy()` | Giải phóng tài nguyên cơ sở dữ liệu của manager |

`db.builder()` là phương thức. `connection.builder` là thuộc tính. Package chỉ xuất kiểu `CollectionBuilder`. Lấy instance từ cơ sở dữ liệu.

## Giá trị trả về của Repository

| Phương thức | Giá trị trả về hoặc hành vi |
| --- | --- |
| `findMany(options?)` | `RepositoryQuery` chạy theo nhu cầu. Dùng `await` để lấy mảng hoặc duyệt bản ghi bất đồng bộ |
| `findOne(options)` | Một bản ghi hoặc `undefined`. Kiểm tra tính duy nhất riêng nếu cần |
| `count(options?)`, `exists(options?)` | Số lượng hoặc trạng thái tồn tại |
| `createOne({ values, ... })` | Kết quả ghi một bản ghi. Đọc qua `.record` |
| `updateOne({ filter, values, ... })` | Kết quả ghi một bản ghi. Từ chối nếu thiếu đích hoặc có nhiều đích |
| `upsertOne({ filter, create, update, ... })` | Kết quả ghi một bản ghi. Yêu cầu bộ lọc xác định duy nhất |
| `deleteOne({ filter, ... })` | Kết quả xóa. Đặt `select` nếu cần trả bản ghi |
| `createMany`, `updateMany`, `deleteMany` | Kết quả hàng loạt với số lượng và bản ghi trả về nếu được yêu cầu |

Tiêu thụ mỗi truy vấn `findMany()` một lần bằng `await` hoặc duyệt bất đồng bộ. Cập nhật và xóa hàng loạt cần bộ lọc hoặc `all: true` tường minh.

`context` cấp biến truy vấn. Để thao tác trong transaction, lấy Repository từ kết nối của callback. Repository lấy từ kết nối bên ngoài có phạm vi riêng. Dùng manager hoặc connection để mở transaction vì `transaction()` của Builder hiện chưa mở transaction cơ sở dữ liệu.

Xác thực danh tính ở lớp HTTP, tạo policy từ kết quả phân quyền rồi áp dụng `withPolicy()` cho quyền bản ghi và trường. Bộ lọc người dùng chỉ thu hẹp kết quả được phép. Xem [Truy vấn và thao tác dữ liệu](../developing-apps/querying-data.md).

## Khai báo đầy đủ và các chương cơ sở dữ liệu

- [Mục lục API cơ sở dữ liệu](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/README.md)
- [Danh mục điểm xuất công khai](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/exports.md)
- [DatabaseManager](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/database-manager.md)
- [Hợp đồng kết nối và dialect](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/connection.md)
- [Migration và Seed](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/migration-and-seed.md)
- [Collection, trường, quan hệ và metadata](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/collection-and-schema.md)
- [Query](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/query.md)
- [Repository](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/repository.md)
- [Policy phân quyền](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/permissions.md)
- [Transaction](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/transactions.md)
- [Sự kiện cơ sở dữ liệu](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/events.md)
- [Công cụ kiểm thử](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/testing.md)

Các liên kết ghim mốc Core `015404ecd0db` ngày 26/10/2026, gồm chữ ký đầy đủ, ranh giới điểm xuất và giới hạn đã biết. [Danh mục package](packages.md) dẫn tới mã nguồn client, HTTP và cấu hình cùng mốc. Đối chiếu thêm lockfile và kiểu đã cài vì mỗi package có phiên bản riêng.

Ví dụ dịch vụ, yêu cầu và cấu hình đã qua kiểm tra kiểu và thực thi. Kiểm thử SQLite trong bộ nhớ xác nhận giá trị trả về khi ghi một bản ghi, truy vấn và rollback transaction bằng dependency của template mặc định beta.83. Bước này chỉ dùng SQLite cục bộ trong bộ nhớ.
