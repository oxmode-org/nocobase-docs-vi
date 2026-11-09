---
title: Nhiều kết nối cơ sở dữ liệu
description: Khai báo kết nối có tên, tổ chức migration và Seed theo từng kết nối, rồi chọn kết nối khi chạy.
---

Ứng dụng có thể dùng nhiều kết nối cơ sở dữ liệu. Template Examples lưu dữ liệu ứng dụng ở `main` và minh họa dữ liệu phân tích riêng ở `analytics`. Ứng dụng quản lý cả hai schema. Tên kết nối xác định thư mục `database/<connection>/`. Việc cô lập mô-đun hoặc tenant cần được thiết kế riêng.

Hướng dẫn này thêm kết nối do ứng dụng quản lý vào một ứng dụng hiện có. Với cơ sở dữ liệu do hệ thống khác quản lý, xem [Kết nối cơ sở dữ liệu hiện có](existing-databases.md).

<a id="add-connection-configuration"></a>

## Thêm cấu hình kết nối

Giữ các cài đặt trong `server/config/database.ts` và thêm `analytics`. Ví dụ tối thiểu sau khai báo đầy đủ hai kết nối SQLite:

```ts
import {
  connectionEnvironment,
  defineAppDatabaseConfig,
} from '@nocobase/app-server/database';

export default defineAppDatabaseConfig(
  ({ paths }) => ({
    default: 'main',
    connections: {
      main: {
        dialect: 'sqlite',
        filename: paths.storage('database.sqlite'),
        schemaManagement: 'managed',
      },
      analytics: {
        dialect: 'sqlite',
        filename: paths.storage('analytics.sqlite'),
        schemaManagement: 'managed',
      },
    },
  }),
  { env: connectionEnvironment('main') },
);
```

Dùng hai tệp khác nhau để tránh trỏ cả hai tên kết nối vào cùng cơ sở dữ liệu. Đây là các giá trị mặc định và cấu hình triển khai có thể ghi đè. Trước khi chạy lệnh, kiểm tra từng kết nối thực tế đang trỏ tới đâu. Nếu ứng dụng hiện có dùng kết nối, driver hoặc ánh xạ môi trường khác, hợp nhất phần bổ sung vào cấu hình đang dùng.

`connectionEnvironment('main')` chỉ gắn các biến môi trường chuẩn với `main`. Để dùng biến môi trường cho kết nối khác, khai báo ánh xạ riêng cho kết nối đó. `DB_HOST` và các biến tương tự chỉ áp dụng theo ánh xạ đã khai báo. Xem [Kết nối, cấu hình và dialect](../framework/database/connections.md) và [Cấu hình ứng dụng (config.yml)](configuration-and-settings.md).

<a id="organize-resources-by-connection"></a>

## Tổ chức tài nguyên theo kết nối

```text
database/
├── main/
│   ├── migrations/
│   └── seeds/
└── analytics/
    ├── migrations/
    └── seeds/
```

Khai báo kết nối trong cấu hình trước và đặt thư mục trùng tên với kết nối đã khai báo. Mỗi kết nối có schema, bản ghi và lịch sử thực thi riêng. Khi cần truy cập `analytics`, chọn rõ tên kết nối trong lời gọi. Đổi `database.default` cũng sẽ đổi đích của mọi lời gọi đang dùng kết nối mặc định.

Tạo `database/analytics/migrations/202611040003_create_analytics_events.ts`:

```ts
import { defineMigration } from '@nocobase/db';

export default defineMigration({
  name: '202611040003_create_analytics_events',
  async up({ builder }) {
    await builder.createCollection('events', (collection) => {
      collection.string('id', { length: 64 }).primary().notNull();
      collection.string('name', { length: 120 }).notNull();
      collection.datetime('createdAt').notNull();
      collection.index('createdAt');
    });
  },
  async down({ builder }) {
    await builder.dropCollection('events');
  },
});
```

Mô hình `events` tối giản này độc lập với các tính năng phân tích đầy đủ của template Examples. Nếu cần bản ghi ban đầu, đặt Seed dưới cùng kết nối. Xem [Tạo bảng và khởi tạo dữ liệu](data-models-and-migrations.md).

<a id="apply-changes-to-an-explicit-connection"></a>

## Áp dụng thay đổi cho một kết nối cụ thể

```bash
pnpm nocobase db apply --connection analytics --dry-run
pnpm nocobase db apply --connection analytics
pnpm nocobase collections generate --connection analytics --check
```

Template Examples cấu hình `migrations.autoRun` và `seeds.autoRun` cho `analytics`. Hướng dẫn này chỉ rõ phạm vi bằng tùy chọn của từng lệnh. Trước tiên, kiểm tra cấu hình khởi động đang có hiệu lực. Chọn một trong hai tùy chọn `--all` hoặc `--connection`. Trước khi thao tác hàng loạt, xác nhận chế độ quản lý schema của từng kết nối. Xem [Tham chiếu dòng lệnh](../reference/cli.md).

<a id="select-the-connection-in-business-services"></a>

## Chọn kết nối trong dịch vụ nghiệp vụ

Truyền `DatabaseManager` lấy từ container của ứng dụng vào hàm cùng với chính sách lấy từ kết quả phân quyền cho thao tác:

```ts
import type { DatabaseManager, RepositoryPolicy } from '@nocobase/db';

export async function listAnalyticsEvents(
  database: DatabaseManager,
  policy: RepositoryPolicy,
) {
  return database.connection('analytics').repository('events')
    .withPolicy(policy)
    .findMany({
      select: (s) => s.fields('id', 'name', 'createdAt'),
      sort: (s) => [s.field('createdAt').desc(), s.field('id').desc()],
      limit: 20,
    });
}
```

`database.repository('events', 'analytics')` cũng chọn rõ kết nối. Bỏ qua tên kết nối thì Repository dùng kết nối mặc định. Điều này dễ bị bỏ sót khi nhiều kết nối có bảng trùng tên. Dùng lại manager và pool kết nối của ứng dụng giữa các yêu cầu.

<a id="cross-connection-boundaries"></a>

## Phạm vi khi làm việc qua nhiều kết nối

Một transaction chỉ bao phủ kết nối của nó. Khi cập nhật cả cơ sở dữ liệu ứng dụng và cơ sở dữ liệu phân tích, thiết kế rõ cơ chế bù trừ hoặc đồng bộ bất đồng bộ. Transaction trên `main` chỉ bảo đảm tính nguyên tử cho các thao tác thuộc kết nối đó. Để kết hợp dữ liệu xuyên kết nối, truy vấn từng kết nối rồi ghép kết quả theo quy tắc nghiệp vụ.

Kết nối phân tích cũng cần kiểm tra quyền nghiệp vụ. Xem [Transaction và tính nhất quán dữ liệu](transactions-and-consistency.md).

<a id="verify"></a>

## Kiểm tra

Xác nhận migration của `analytics` giữ nguyên `main`. Kiểm tra truy vấn chỉ rõ kết nối trả về đúng bản ghi ngay cả khi các bảng trùng tên. Thử các tình huống bị từ chối truy cập, cơ sở dữ liệu rỗng và lỗi kết nối để xác nhận ứng dụng xử lý đúng. Kiểm tra migration và kiểu dữ liệu trên dialect dùng khi triển khai. Hai tệp SQLite chỉ minh họa cách tách kết nối.
