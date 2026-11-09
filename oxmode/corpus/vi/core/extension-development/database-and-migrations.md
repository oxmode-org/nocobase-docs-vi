---
title: Tài nguyên cơ sở dữ liệu và migration của plugin
description: Khai báo thư mục migration và Seed của plugin, tích hợp vào kết nối mặc định và kiểm chứng build, cài đặt, nâng cấp.
---

Plugin đóng góp migration và Seed qua khai báo Server. Ứng dụng cài plugin chịu trách nhiệm thực thi. Ví dụ thêm danh mục thông báo vào `notice-data`. Ứng dụng và plugin dùng chung quy tắc mô hình, Context và thực thi. Xem [Bảng và trường](../framework/database/schema.md), [Migration](../framework/database/migrations.md) và [Dữ liệu khởi tạo](../framework/database/seeds.md).

## Tạo thư mục tài nguyên cơ sở dữ liệu

Với plugin mới, chọn năng lực cơ sở dữ liệu từ gốc ứng dụng.

```bash
pnpm create @nocobase/plugin@beta notice-data --with database
```

Với plugin hiện có, bổ sung thư mục và khai báo. Đường dẫn tính từ `packages/app-plugin-notice-data/`.

```text
server/
├── index.ts
└── plugin.ts
database/
├── migrations/
│   └── 202611040020_notice_data_create_categories.ts
└── seeds/
    └── 202611040020_notice_data_default_categories.ts
```

Trong plugin, đặt migration và Seed ngay dưới `database/` theo cấu trúc trên. Tệp `.ts.example` được sinh dưới dạng bản nháp. Viết tệp `.ts` cho tác vụ thật. Bỏ khai báo Seed nếu tính năng không cần bản ghi ban đầu.

## Khai báo đường dẫn và kết nối sở hữu tài nguyên

Khai báo tài nguyên trong `server/plugin.ts`, giữ các đóng góp khác của plugin.

```ts
import path from 'node:path';
import { defineServerPlugin, type AppServerPlugin } from '@nocobase/app-server/plugins';

const plugin: AppServerPlugin = defineServerPlugin({
  packageName: '@nocobase/app-plugin-notice-data',
  baseDir: path.resolve(import.meta.dirname, '..'),
  database: {
    migrations: './database/migrations',
    seeds: './database/seeds',
  },
});

export default plugin;
```

Công khai điểm vào từ `server/index.ts`.

```ts
export { default } from './plugin.js';
```

`baseDir` phải là đường dẫn tuyệt đối. Đường dẫn tài nguyên bắt đầu bằng `./` và nằm trong phạm vi thư mục đó. Biểu thức trỏ tới gốc plugin trong mã nguồn và tới `dist/` từ `dist/server/plugin.js`. Đưa các thư mục cơ sở dữ liệu tương ứng vào sản phẩm biên dịch.

Migration và Seed của plugin chỉ đóng góp vào kết nối mặc định của ứng dụng, do `database.default` chọn. Tên kết nối có thể khác `main`. Dùng kết nối đã được ứng dụng cấu hình. Tạo thư mục, khai báo tài nguyên, đăng ký plugin và thực thi tác vụ là các bước riêng.

<h2 id="write-migrations-and-initial-data">Viết migration và dữ liệu ban đầu</h2>

Tạo danh mục trong `database/migrations/202611040020_notice_data_create_categories.ts`.

```ts
import { defineMigration } from '@nocobase/db';

export default defineMigration({
  name: '202611040020_notice_data_create_categories',
  async up({ builder }) {
    await builder.createCollection('noticeCategories', (c) => {
      c.string('code', { length: 32 }).primary().notNull();
      c.string('title', { length: 100 }).notNull();
    });
  },
  async down({ builder }) {
    await builder.dropCollection('noticeCategories');
  },
});
```

Thêm định danh plugin vào tên tác vụ để tránh trùng với ứng dụng và plugin khác. Trên cùng kết nối, mọi nguồn được sắp theo tên. Nếu phụ thuộc schema của plugin khác, xác định phiên bản tiên quyết và thứ tự migration tường minh.

Cài danh mục mặc định bằng `database/seeds/202611040020_notice_data_default_categories.ts`.

```ts
import { defineSeed } from '@nocobase/db';

export default defineSeed({
  name: '202611040020_notice_data_default_categories',
  async run(context) {
    const categories = context.repository('noticeCategories');
    if (await categories.findOne({ filter: { code: 'general' } })) return;
    await categories.createOne({ values: { code: 'general', title: 'General' } });
  },
});
```

Ứng dụng chạy Seed sau migration, tạo `general` / `General` và giữ chỉnh sửa của quản trị viên nếu danh mục đã tồn tại. Đặt việc tạo bảng và dữ liệu mặc định trong tác vụ cơ sở dữ liệu để Provider chỉ phụ trách vòng đời dịch vụ.

Đặt thông báo giả lập tùy chọn trong Seed riêng có `sample: true`. Host điều khiển qua trạng thái cài mới và `app.sampleData`. Nếu dữ liệu mẫu cần dịch vụ từ plugin khác, đăng ký trình sinh qua `sampleDataToken` trong `boot()` của Provider để nó chạy khi ứng dụng đã sẵn sàng. Thêm định danh plugin vào tên dịch vụ. Xem [Dữ liệu mẫu tùy chọn](../framework/database/seeds.md#required-data-and-optional-samples) để biết điều kiện chạy.

Giữ nguyên migration và Seed đã merge hoặc phát hành. Thêm tệp mới khi cần thay đổi. Đặt thay đổi schema và bổ sung dữ liệu cũ trong migration để bảo toàn bản ghi người dùng.

## Đăng ký plugin và áp dụng thay đổi

Khi plugin cục bộ đã phân giải được dưới dạng dependency workspace, xem trước và đăng ký từ gốc ứng dụng.

```bash
pnpm nocobase plugin register @nocobase/app-plugin-notice-data --no-install --dry-run
pnpm nocobase plugin register @nocobase/app-plugin-notice-data --no-install
pnpm nocobase db apply --dry-run
pnpm nocobase db apply
```

`--no-install` bỏ qua bước cài. Cấu hình dependency workspace vẫn cần có. Kiểm tra điểm vào Server nằm trong `server/plugins.ts`. Xem [Khai báo và điểm xuất công khai](plugin-declarations.md#runtime-entries).

Kế hoạch cơ sở dữ liệu phải liệt kê migration và Seed trên cùng các tác vụ đang chờ khác của ứng dụng và plugin. Sau lần chạy đầu, `noticeCategories` phải phân giải được và chứa danh mục mặc định. Lần chạy lại bỏ qua tác vụ đã thành công. Kiểm tra toàn bộ phạm vi trước khi chạy vì `db apply` xử lý cả tác vụ của những nguồn khác.

Triển khai riêng API nghiệp vụ, quyền và menu cần dùng. Xem [Repository](../framework/database/repositories.md) về truy cập dữ liệu và [Route và HTTP API](server-apis.md) về tích hợp.

## Kiểm chứng cài đặt và nâng cấp

Dùng nguồn migration thật trong `tests/database/categories.test.ts` của plugin.

```ts
import { fileURLToPath } from 'node:url';
import { describeMigration } from '@nocobase/app-testing/server';
import metadata from '../../package.json' with { type: 'json' };

describeMigration('202611040020_notice_data_create_categories', {
  sources: [{
    packageName: metadata.name,
    directory: fileURLToPath(new URL('../../database/migrations/', import.meta.url)),
  }],
  up: async ({ expectCollection }) => {
    await expectCollection('noticeCategories').toHaveField('code', {
      type: 'string', nullable: false,
    });
  },
  down: async ({ expectCollection }) => {
    await expectCollection('noticeCategories').not.toExist();
  },
});
```

`describeMigration()` áp dụng migration, kiểm tra schema và metadata, rollback rồi áp dụng lại. Thêm assertion nghiệp vụ để xác nhận mã danh mục trùng bị từ chối. Với Seed, kiểm tra cài mới, bảo toàn tên hiện có và thử lại. Khi tài nguyên phụ thuộc Collection của plugin khác, cung cấp nguồn migration tiên quyết hoặc fixture ứng dụng đầy đủ.

Chạy từ gốc ứng dụng.

```bash
pnpm --filter @nocobase/app-plugin-notice-data exec vitest run tests/database/categories.test.ts
```

Với migration nâng cấp, chuẩn bị bản ghi từ phiên bản cũ rồi kiểm tra dữ liệu và ràng buộc mới. Xem [Kiểm thử cơ sở dữ liệu](../developing-apps/testing-and-acceptance.md#database-data-and-migrations).

<h2 id="build-and-deliver-database-resources">Build và bàn giao tài nguyên cơ sở dữ liệu</h2>

Giữ bước biên dịch và `nocobase-db-manifests` do khung tạo để sinh manifest cho migration và Seed đã biên dịch. Mỗi plugin sinh manifest của mình. Ứng dụng dùng manifest đã được đóng gói với dependency. Xem [Checksum và sản phẩm biên dịch](../framework/database/migrations.md#checksums-and-compiled-artifacts).

Từ gốc ứng dụng, kiểm tra plugin rồi build ứng dụng.

```bash
pnpm --filter @nocobase/app-plugin-notice-data check
pnpm build
```

Kiểm tra gói phát hành có `dist/database/migrations/`, `dist/database/seeds/` nếu dùng và `.manifest.json` trong từng thư mục. Trong ứng dụng cô lập, kiểm chứng cài từ đầu và nâng cấp bằng sản phẩm đã biên dịch để xác nhận `baseDir` phân giải đúng tài nguyên. Kiểm tra nội dung gói riêng với kiểm thử mã nguồn workspace.

Khi hủy đăng ký plugin, schema và dữ liệu được giữ. Rollback theo batch của ứng dụng và có thể ảnh hưởng plugin khác. Gỡ plugin theo quy trình riêng với `db rollback`. Xem [Build và phát hành](publish-plugin.md).

Xem [Kiểu khai báo tài nguyên](https://github.com/nocobase/nocobase/blob/d04061ee252afbcc2f42cf1d69ab8888e72d604a/packages/app/app-server/src/plugins/types.ts), [Khai báo do khung sinh](https://github.com/nocobase/nocobase/blob/d04061ee252afbcc2f42cf1d69ab8888e72d604a/packages/tools/create-plugin/template/server/plugin.ts) và [Bài kiểm thử của khung](https://github.com/nocobase/nocobase/blob/d04061ee252afbcc2f42cf1d69ab8888e72d604a/packages/tools/create-plugin/template/tests/database/migrations.test.ts).
