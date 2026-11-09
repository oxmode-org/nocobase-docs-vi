---
title: Tham chiếu cấu hình
description: Thứ tự ưu tiên giữa tệp và môi trường, các mục thường dùng, giá trị trình duyệt có thể đọc và lệnh kiểm tra.
---

Ứng dụng và các mô-đun tích hợp cùng định nghĩa cấu hình. Trang này liệt kê các trường thường dùng trong template mặc định. Để xem đầy đủ metadata của ứng dụng đã cài, chạy `pnpm nocobase config variables --json`. Xem [Cấu hình ứng dụng (config.yml)](../developing-apps/configuration-and-settings.md) để biết quy trình phát triển.

<a id="files-and-precedence"></a>

## Tệp và thứ tự ưu tiên

Template mặc định hợp nhất giá trị theo thứ tự sau, trong đó nguồn đứng sau có ưu tiên cao hơn:

```text
Code defaults in server/config/
    → config.yml
    → explicitly mapped environment variables
```

Đối tượng thuần được hợp nhất đệ quy. Mảng và giá trị vô hướng được thay thế toàn bộ. Biến môi trường phải có ánh xạ khai báo trước để ghi đè giá trị. YAML đọc `${NAME}` như một chuỗi nguyên văn.

| Vị trí | Công dụng |
| --- | --- |
| `server/config/` | Giá trị mặc định, ánh xạ biến môi trường và bộ kiểm tra của từng mục |
| `config.example.yml` | Tệp mẫu dùng để khởi tạo, có thể đưa vào Git |
| `config.yml` | Cấu hình riêng của môi trường, có thể chứa bí mật và phải để ngoài Git |
| `APP_CONFIG_FILE` | Chọn tệp cấu hình khác. Đường dẫn tương đối tính từ thư mục gốc của ứng dụng |
| `dist/variables.json` | Metadata cấu hình được sinh cho bản triển khai. Tệp này không chứa bản sao các giá trị bí mật |

Trong ứng dụng chưa khởi tạo, chạy `pnpm nocobase config init --dialect sqlite` để tạo cấu hình cục bộ và khóa từ tệp mẫu. Khi nâng cấp, giữ lại khóa hiện có và làm theo quy trình nâng cấp.

<a id="common-configuration-fields"></a>

## Các trường cấu hình thường dùng

| Trường hoặc mục | Ý nghĩa |
| --- | --- |
| `server.host` / `server.port` | Địa chỉ và cổng lắng nghe. Mặc định trong mã template là `127.0.0.1` / `13000` |
| `server.startLog` | In địa chỉ khi khởi động. Lệnh phát triển có thông báo riêng |
| `app.publicOrigin` | Giao thức và tên máy chủ công khai dùng cho liên kết tuyệt đối và callback |
| `app.sampleData` | Nạp dữ liệu mẫu trong lần thiết lập đầu tiên |
| `database.default` | Tên kết nối mặc định, là `main` trong template |
| `database.connections.<name>` | Dialect, tùy chọn kết nối và chế độ quản lý schema |
| `api.bodyLimit` / `api.timeout` / `api.rateLimit` | Giới hạn thân yêu cầu HTTP, thời gian chờ và tần suất yêu cầu |
| `secrets.keys` | Khóa chính có phiên bản dùng để bảo vệ dữ liệu nhạy cảm. Giữ khóa qua các lần nâng cấp |
| `session` / `auth` | Cài đặt phiên và xác thực do mô-đun tương ứng quản lý |
| `users.initialAdmin` | Tên người dùng, email và mật khẩu quản trị viên khi khởi tạo cơ sở dữ liệu người dùng rỗng. Các tài khoản hiện có được giữ nguyên |
| `i18n.defaultLocale` | Locale mặc định. Ngôn ngữ khả dụng còn phụ thuộc tài nguyên đã nạp |
| `logging` | Mức log, đích xuất và luân phiên tệp log |
| `client.app.title` | Tiêu đề ứng dụng trên trình duyệt |
| `client.app.defaultColorScheme` | `light`, `dark` hoặc `system`. Tùy chọn đã lưu của người dùng có ưu tiên cao hơn |
| `client.app.defaultTheme` | ID preset giao diện. ID này phải tồn tại trong nguồn giao diện |
| `jobs` / `queue` / `caching` / `drive` | Adapter cho tác vụ nền, hàng đợi, bộ nhớ đệm và lưu trữ |
| `mail` / `notification` / `scheduler` / `knowledge` | Cài đặt plugin hoặc tích hợp, tùy phiên bản đã cài và cách đăng ký |

Tra template hiện tại và các khai báo trong package để biết giá trị mặc định, trường được hỗ trợ và các mục do plugin cung cấp.

Ví dụ, hợp nhất các giá trị sau vào cấu hình hiện có của ứng dụng phát triển cục bộ đã khởi tạo:

```yaml
server:
  host: 127.0.0.1
  port: 13000

client:
  app:
    title: My App
    defaultColorScheme: system
```

Giữ lại cấu hình cơ sở dữ liệu và khóa. Để cho phép truy cập qua LAN, có thể lắng nghe trên `0.0.0.0` rồi truy cập bằng IP thực tế của máy. Môi trường phát triển có thể dùng cổng frontend riêng. Mở URL do `pnpm dev` in ra.

<a id="database-configuration"></a>

## Cấu hình cơ sở dữ liệu

Khai báo các kết nối trong `database.connections.<name>` và chọn kết nối mặc định bằng `database.default`. SQLite dùng `filename`. Các dialect khác thường dùng `host`, `port`, `database`, `username` và `password`. Xem [Hỗ trợ cơ sở dữ liệu và tương thích phiên bản](compatibility.md) để tra các trường riêng theo dialect.

`schemaManagement: managed` cho phép framework quản lý schema. `external` giới hạn việc framework thay đổi schema của cơ sở dữ liệu ngoài. Quyền đọc và ghi dữ liệu nghiệp vụ vẫn do quyền tài khoản và chính sách phân quyền quyết định.

SQLite cũng chấp nhận `database` làm tên trường chứa đường dẫn tệp theo template. Nếu có cả `database` và `filename`, `database` được ưu tiên. Khi đổi vị trí tệp, dùng nhất quán một tên trường để tránh giá trị `database` cũ ghi đè `DB_FILENAME`.

Ánh xạ `DB_*` mặc định chỉ áp dụng cho `main`. Với kết nối bổ sung, khai báo ánh xạ bằng `connectionEnvironment(name, prefix)` từ `@nocobase/app-server/database` và giữ lại ánh xạ mặc định. Nếu cần chuyển dữ liệu hiện có sang dialect hoặc địa chỉ mới, thực hiện việc chuyển dữ liệu riêng.

<a id="environment-variables"></a>

## Biến môi trường

Bảng sau lấy ánh xạ từ metadata của ứng dụng đã kiểm tra. Ánh xạ xác thực, thư và thông báo phụ thuộc mô-đun tương ứng. Tra đầu ra lệnh hiện tại để biết kiểu, mô tả và dấu hiệu nhận biết trường nhạy cảm.

| Biến | Trường |
| --- | --- |
| `APP_SERVER_HOST` / `APP_SERVER_PORT` / `APP_SERVER_START_LOG` | `server.host` / `server.port` / `server.startLog` |
| `APP_PUBLIC_ORIGIN` / `APP_SAMPLE_DATA` | `app.publicOrigin` / `app.sampleData` |
| `DB_DIALECT` / `DB_HOST` / `DB_PORT` | `database.connections.main.dialect` / `.host` / `.port` |
| `DB_DATABASE` / `DB_FILENAME` | `database.connections.main.database` / `.filename` |
| `DB_USERNAME` / `DB_PASSWORD` / `DB_SSL` | `database.connections.main.username` / `.password` / `.ssl` |
| `API_BODY_LIMIT` / `API_TIMEOUT` | `api.bodyLimit` / `api.timeout` |
| `SECRETS_KEYS` | `secrets.keys` |
| `AUTH_SECRET` / `SESSION_SECRET` | `auth.secret` / `session.secret` |
| `INITIAL_ADMIN_USERNAME` / `INITIAL_ADMIN_EMAIL` / `INITIAL_ADMIN_PASSWORD` | `users.initialAdmin.username` / `.email` / `.password` |
| `APP_DEFAULT_LOCALE` | `i18n.defaultLocale` |
| `SNOWFLAKE_WORKER_ID` | `snowflake.workerId` |
| `APP_VITE_DEV_URL` | `spa.viteDevUrl` |
| `MAIL_JOBS` / `MAIL_SYNC_BATCH_SIZE` / `MAIL_AUTOMATIC_SYNC_INTERVAL_MS` | `mail.jobs` / `.syncBatchSize` / `.automaticSyncIntervalMs` |
| `MAIL_OAUTH_CALLBACK_URL` / `MAIL_OAUTH_RETURN_URL` | `mail.oauthCallbackUrl` / `.oauthReturnUrl` |
| `MAIL_PUSH_WEBHOOK_URL` / `MAIL_PUSH_WEBHOOK_SECRET` | `mail.pushWebhookUrl` / `.pushWebhookSecret` |
| `RESEND_API_KEY` / `SMTP_PASSWORD` | `notification.channels.system-email.apiKey` / `.auth.pass` |
| `SCHEDULER_JOBS` | `scheduler.jobs` |

Môi trường chạy còn đọc ba biến sau:

| Biến | Công dụng |
| --- | --- |
| `APP_BASE_PATH` | Đường dẫn cơ sở để gắn ứng dụng |
| `APP_CONFIG_FILE` | Vị trí tệp cấu hình |
| `NOCOBASE_STRICT_STARTUP` | Buộc tiến trình thoát khi khởi động thất bại để trình quản lý tiến trình phát hiện lỗi |

`SECRETS_KEYS` chứa các mục `version:key` phân tách bằng dấu phẩy, với khóa hiện hành đứng đầu. Giữ các khóa còn cần để giải mã dữ liệu cũ và làm theo quy trình luân chuyển khóa. Thay khóa cũng có thể làm mất hiệu lực các phiên hiện có. Mỗi mô-đun có quy tắc riêng để chọn khóa khai báo trực tiếp hoặc khóa được dẫn xuất. Ví dụ, mô-đun phiên ưu tiên `session.secret` và thử dẫn xuất khóa từ Secrets khi thiếu trường này. Kiểm tra quy tắc cấu hình và yêu cầu luân chuyển khóa của mô-đun trước khi thay đổi giá trị.

<a id="browser-visible-configuration"></a>

## Cấu hình trình duyệt có thể đọc

Mục `client` được nhúng vào trang ứng dụng và trình duyệt có thể đọc được. Các mục khác phía máy chủ chỉ công khai các đường dẫn đến trường cuối được liệt kê trong tùy chọn `public` của `defineAppConfig()`. Giữ mật khẩu cơ sở dữ liệu, khóa ký và thông tin xác thực thư bên ngoài `client` và các đường dẫn công khai.

Để thêm mục cấu hình thông báo, tạo `server/config/announcements.ts`:

```ts
import { defineAppConfig, envInteger } from '@nocobase/app-server/config';

export default defineAppConfig({
  defaults: { pageSize: 20 },
  env: {
    ANNOUNCEMENTS_PAGE_SIZE: envInteger('pageSize', {
      description: 'Default number of announcements per page.',
    }),
  },
  public: ['pageSize'],
  validate(value, context) {
    if (!Number.isInteger(value.pageSize) || value.pageSize < 1 || value.pageSize > 100) {
      context.error('pageSize', 'Expected an integer between 1 and 100.');
    }
  },
});
```

Import và thêm `announcements` vào lời gọi `defaultAppConfigs({ ... })` hiện có trong `server/config/index.ts`, rồi cập nhật kiểu trả về đã khai báo tường minh. Khóa trong tệp là `announcements.pageSize` và biến ghi đè là `ANNOUNCEMENTS_PAGE_SIZE`. `public: ['pageSize']` chỉ công khai trường này.

Bộ kiểm tra chạy khi khởi động, nạp lại cấu hình và gọi `config check`. Kiểm tra giá trị thực tế và tránh gửi yêu cầu mạng hoặc ghi dữ liệu trong quá trình kiểm tra. Để áp dụng cấu hình vừa nạp, các dịch vụ đang chạy cần tự xử lý thay đổi.

<a id="editing-and-checking"></a>

## Chỉnh sửa và kiểm tra

```bash
pnpm nocobase config set server.port=13000
pnpm nocobase config env
pnpm nocobase config variables --json
pnpm nocobase config check --no-connect
```

Đọc giá trị nhạy cảm từ biến môi trường hiện có rồi ghi vào cấu hình cục bộ:

```bash
pnpm nocobase config set --from-env database.connections.main.password=MAIN_DB_PASSWORD
```

Trước tiên, thiết lập `MAIN_DB_PASSWORD` bằng cơ chế quản lý môi trường đang dùng. Lệnh ghi giá trị hiện tại của biến vào tệp. Nếu môi trường cũng có `DB_PASSWORD`, giá trị của biến đó sẽ ghi đè giá trị trong tệp.

Thông thường, `config check` kiểm tra cấu hình và thử kết nối với các cơ sở dữ liệu ngoài SQLite. Dùng `--no-connect` để kiểm tra ngoại tuyến và `--strict` để coi cảnh báo là lỗi. Khi báo lỗi, gửi tên trường, thông báo đã che dữ liệu nhạy cảm và phiên bản package. Xem [Tham chiếu dòng lệnh](cli.md).

<a id="verification-scope"></a>

## Phạm vi kiểm chứng

Tài liệu gốc đối chiếu định nghĩa với [mã nguồn cấu hình Core tại `015404ecd0db`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/config). Metadata biến và kiểm tra ngoại tuyến dùng template mặc định beta.83, `@nocobase/app-cli` 1.0.0-beta.29 và `@nocobase/config` 0.1.0-beta.3. Plugin bổ sung có thể khai báo thêm mục cấu hình và ánh xạ.
