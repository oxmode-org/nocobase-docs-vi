---
title: Tạo bảng và khởi tạo dữ liệu
description: Tạo danh mục trạng thái, nạp giá trị mặc định và duy trì thay đổi bằng migration mới cùng kiểm thử cơ sở dữ liệu.
---

Trong ứng dụng NocoBase hiện có, dùng Migration để tạo danh mục trạng thái và Seed để nạp dữ liệu mặc định. Ví dụ `appStatuses` lưu mã ổn định và tiêu đề có thể sửa. Một bản nâng cấp sau sẽ thêm mô tả. Nếu chưa có ứng dụng, [tạo ứng dụng trước](../../getting-started/develop-your-first-app.md#create-and-start-the-application) hoặc chạy [ví dụ đầy đủ](#example-source-and-running) bên dưới.

<a id="directory-and-file-conventions"></a>

## Quy ước thư mục và tệp

Đặt các tệp sau dưới thư mục gốc của ứng dụng. Ví dụ dùng kết nối do ứng dụng quản lý có tên `main` đã được cấu hình:

```text
database/
└── main/
    ├── migrations/
    │   ├── 202611040001_create_app_statuses.ts
    │   └── 202611040003_add_app_status_description.ts
    ├── seeds/
    │   └── 202611040002_default_app_statuses.ts
    └── collections/  # Generated cache
```

Tên thư mục xác định kết nối đã khai báo. Để dùng kết nối khác, đổi cả tên thư mục lẫn đối số `--connection`. Xem [Nhiều kết nối cơ sở dữ liệu](multiple-databases.md). Giữ `database/tsconfig.json` của template để kiểm tra kiểu của các tệp cơ sở dữ liệu cùng mã máy chủ.

Xuất mặc định từng định nghĩa tác vụ. `name` phải khớp tên tệp bỏ phần mở rộng và duy nhất trong cùng loại tác vụ trên kết nối. Migration quản lý schema và nâng cấp dữ liệu. Seed nạp giá trị mặc định. Dịch vụ nghiệp vụ xử lý các lần sửa trạng thái thường ngày.

<a id="create-the-table"></a>

## Tạo bảng

Tạo `database/main/migrations/202611040001_create_app_statuses.ts`:

```ts
import { defineMigration } from '@nocobase/db';

export default defineMigration({
  name: '202611040001_create_app_statuses',
  async up({ builder }) {
    await builder.createCollection('appStatuses', (collection) => {
      collection.string('code', { length: 32 }).primary().notNull();
      collection.string('title', { length: 100 }).notNull();
    });
  },
  async down({ builder }) {
    await builder.dropCollection('appStatuses');
  },
});
```

Sau khi chạy, `code` là mã trạng thái duy nhất và `title` là tên hiển thị bắt buộc. Khi đổi tên trạng thái, `code` giữ nguyên định danh. `down()` xóa toàn bộ danh mục và các bản ghi, nên chỉ dùng khi có thể chấp nhận mất dữ liệu đó.

Ví dụ dùng `builder` trong ngữ cảnh Migration. Xem [Bảng và trường](../framework/database/schema.md) về trường, chỉ mục và ràng buộc, cùng [Migration](../framework/database/migrations.md) để tra các tùy chọn khai báo. [Xem mã migration](https://github.com/nocobase/docs-examples-v3/blob/96410dc943d7ac65737b50f110c129da1588fa94/apps/database-basics/database/main/migrations/202611040001_create_app_statuses.ts).

<a id="initialize-default-records"></a>

## Khởi tạo bản ghi mặc định

Tạo `database/main/seeds/202611040002_default_app_statuses.ts`:

```ts
import { defineSeed } from '@nocobase/db';

export default defineSeed({
  name: '202611040002_default_app_statuses',
  async run(context) {
    const statuses = context.repository('appStatuses');
    for (const values of [
      { code: 'draft', title: 'Draft' },
      { code: 'published', title: 'Published' },
    ]) {
      if (await statuses.findOne({ filter: { code: values.code } })) continue;
      await statuses.createOne({ values });
    }
  },
});
```

Lần cài đặt đầu tiên tạo `draft` với tiêu đề `Draft` và `published` với tiêu đề `Published`. Nếu quản trị viên đã đổi tiêu đề của `draft` thành `Writing`, Seed giữ tiêu đề đó và chỉ bổ sung trạng thái còn thiếu. Khóa chính ngăn trùng mã. Nếu thao tác đọc và chèn gặp xung đột do thực thi đồng thời, để tác vụ báo lỗi.

`context.repository()` dùng kết nối và transaction của Seed. Giữ các thao tác của Seed trên Repository này và dùng Migration để tạo bảng. Xem [Dữ liệu Seed](../framework/database/seeds.md) về cập nhật giá trị mặc định, cấu hình và dữ liệu mẫu tùy chọn. [Xem mã Seed](https://github.com/nocobase/docs-examples-v3/blob/96410dc943d7ac65737b50f110c129da1588fa94/apps/database-basics/database/main/seeds/202611040002_default_app_statuses.ts).

<a id="apply-changes-and-inspect-the-result"></a>

## Áp dụng thay đổi và kiểm tra kết quả

Xác nhận cấu hình ứng dụng trỏ đến đúng cơ sở dữ liệu, rồi chạy từ thư mục gốc của ứng dụng:

```bash
pnpm nocobase config check
pnpm nocobase db apply --connection main --dry-run
pnpm nocobase db apply --connection main
pnpm nocobase collections generate --connection main --check
```

`--dry-run` liệt kê kế hoạch mà không chạy tác vụ. Khi chạy thật, CLI áp dụng toàn bộ migration đang chờ trên kết nối trước khi chạy Seed. Kết nối mặc định còn dùng tài nguyên của các plugin đã đăng ký, nên đầu ra có thể liệt kê thêm tệp.

Sau lần chạy đầu tiên, danh mục có hai bản ghi mặc định. Nếu migration nâng cấp đã có sẵn, cả hai có `description: null`. Chạy lại `db apply` sẽ bỏ qua các tác vụ đã thành công theo lịch sử và tránh tạo bản ghi trùng.

Mặc định, `db apply` làm mới `database/main/collections/` khi migration thay đổi schema. `collection.json`, `metadata.json`, `schema.json` và manifest kết nối là các tệp đệm có thể tạo lại. Duy trì thay đổi trong tệp nguồn. `collections generate --check` cần xác nhận các tệp khớp cơ sở dữ liệu. Nếu migration thành công nhưng bước làm mới lỗi, chạy riêng `pnpm nocobase collections generate --connection main`.

Kết nối mặc định thường chạy các tác vụ cơ sở dữ liệu lúc khởi động. Các lệnh thủ công cho phép xem và áp dụng kế hoạch sớm hơn. Xem [Nhiều kết nối cơ sở dữ liệu](multiple-databases.md) về cài đặt khởi động và cách các kết nối khác tự động chạy tác vụ.

<a id="add-a-migration-and-preserve-existing-data"></a>

## Thêm migration và bảo toàn dữ liệu hiện có

Khi danh mục đã được sử dụng, giữ nguyên migration đầu tiên và thêm mô tả trong tệp mới `database/main/migrations/202611040003_add_app_status_description.ts`:

```ts
import { defineMigration } from '@nocobase/db';

export default defineMigration({
  name: '202611040003_add_app_status_description',
  async up({ builder }) {
    await builder.alterCollection('appStatuses', (collection) => {
      collection.text('description').nullable();
    });
  },
  async down({ builder }) {
    await builder.dropField('appStatuses', 'description');
  },
});
```

Chạy lại lệnh `db apply` ở trên. Mã và tiêu đề hiện có được giữ lại, với `description: null`. Rollback migration này sẽ xóa mô tả và giữ các bản ghi trạng thái ban đầu. Trước khi đặt mô tả thành bắt buộc, xác định cách điền dữ liệu cho các hàng hiện có và tạo migration mới. Xem [Điền bổ sung và chuyển đổi dữ liệu lịch sử](../framework/database/migrations.md#backfill-and-transform-historical-data).

Giữ dữ liệu hiện có và đưa chỉnh sửa vào migration mới. Tệp đã chạy sẽ được bỏ qua theo lịch sử thực thi kể cả khi nội dung thay đổi. Xem [Migration](../framework/database/migrations.md#rollback-and-irreversible-changes) về checksum, rollback theo đợt và lịch sử Seed. [Xem mã migration nâng cấp](https://github.com/nocobase/docs-examples-v3/blob/96410dc943d7ac65737b50f110c129da1588fa94/apps/database-basics/database/main/migrations/202611040003_add_app_status_description.ts).

<a id="verify-installation-and-upgrades"></a>

## Kiểm tra cài đặt và nâng cấp

Tệp [`tests/database/app-statuses.test.ts`](https://github.com/nocobase/docs-examples-v3/blob/96410dc943d7ac65737b50f110c129da1588fa94/apps/database-basics/tests/database/app-statuses.test.ts) của ví dụ đầy đủ dùng các cơ sở dữ liệu thực được cô lập. Chạy từ thư mục gốc của ứng dụng ví dụ:

```bash
pnpm exec vitest run --project node tests/database/app-statuses.test.ts
```

Kiểm thử bao gồm tạo schema, từ chối mã trùng, nạp dữ liệu mặc định, bỏ qua tác vụ theo lịch sử và bảo toàn tiêu đề đã tùy chỉnh. Bài kiểm thử nâng cấp chèn bản ghi cũ trước khi thêm mô tả, rồi xác nhận bản ghi được giữ lại khi áp dụng, rollback và áp dụng lại migration.

Bài kiểm thử lỗi chạy Seed thật rồi chủ động phát sinh ngoại lệ. Sau đó, bài kiểm thử xác nhận bản ghi và mục lịch sử thành công đã được rollback, bỏ điều kiện gây lỗi và thử lại. Một bài kiểm thử khác dùng bảng lịch sử riêng để chạy lại cùng Seed. Bài đó xác nhận chạy Seed nhiều lần vẫn cho cùng kết quả nghiệp vụ, kể cả khi cơ chế lịch sử cho phép Seed chạy lại.

Các kiểm thử chạy trên cơ sở dữ liệu riêng và giữ nguyên cơ sở dữ liệu phát triển. Xem [Kiểm thử cơ sở dữ liệu](testing-and-acceptance.md#database-data-and-migrations) về `describeMigration()`, `createDatabaseTest()` và cách cấu hình dialect khác để kiểm thử.

<a id="example-source-and-running"></a>

## Mã nguồn và cách chạy ví dụ

[Ứng dụng Database basics](https://github.com/nocobase/docs-examples-v3/tree/96410dc943d7ac65737b50f110c129da1588fa94/apps/database-basics) minh họa danh mục trạng thái qua các lệnh cơ sở dữ liệu và kiểm thử cô lập. Có thể chạy ví dụ trực tiếp từ CLI. Dùng Node.js 24 và pnpm 11. Xem [README tại commit của ví dụ](https://github.com/nocobase/docs-examples-v3/blob/96410dc943d7ac65737b50f110c129da1588fa94/apps/database-basics/README.MD) để biết dependency và cấu hình.

```bash
git clone https://github.com/nocobase/docs-examples-v3.git
cd docs-examples-v3
git checkout 96410dc943d7ac65737b50f110c129da1588fa94
cd apps/database-basics
pnpm install --frozen-lockfile
pnpm exec vitest run --project node tests/database/app-statuses.test.ts
```

Kiểm thử tự dùng cấu hình cơ sở dữ liệu riêng. Để áp dụng migration qua CLI của ứng dụng, sau khi cài đặt hãy chạy `pnpm nocobase config init` và cấu hình cơ sở dữ liệu trước khi dùng các lệnh phía trên. Nếu ứng dụng đã cấu hình, dùng luôn cấu hình hiện có. Kiểm thử mặc định dùng SQLite. Với cơ sở dữ liệu khác, cài driver và cấu hình kết nối kiểm thử tương ứng. Ứng dụng nghiệp vụ có thể tiếp tục dùng dialect hiện tại.
