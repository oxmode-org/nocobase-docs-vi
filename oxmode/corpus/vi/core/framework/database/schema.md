---
title: Bảng và trường
description: Tạo và sửa Collection, trường, index và ràng buộc bằng CollectionBuilder, theo quy tắc đặt tên, metadata và khả năng của cơ sở dữ liệu.
---

`CollectionBuilder` chuyển định nghĩa Collection logic thành schema cơ sở dữ liệu và đồng bộ metadata mô hình cần. Ứng dụng và plugin dùng Builder trong callback [migration](migrations.md) `up({ builder })` và `down({ builder })`. Đặt các đoạn mã dưới đây vào những callback đó.

## Tạo Collection

Khai báo bảng đơn hàng bằng callback.

```ts
await builder.createCollection('orders', (c) => {
  c.increments('id');
  c.string('orderNo', { length: 64 }).notNull().unique();
  c.string('status', { length: 32 }).notNull().defaultTo('draft');
  c.decimal('amount', { precision: 12, scale: 2 }).notNull().defaultTo(0);
  c.integer('customerId').unsigned().nullable();
  c.datetimeTz('createdAt').notNull();
  c.index(['status', 'id']);
});
```

Sau khi chạy migration, `orders` có sáu trường đã khai báo, mã đơn hàng duy nhất và index theo trạng thái. Khai báo tường minh `id`, `createdAt` hoặc `updatedAt` khi cần. `increments()` tạo khóa chính tự tăng. Trường có tên `id` chỉ trở thành khóa chính khi khai báo rõ. Khi tạo đơn hàng theo ví dụ này, cung cấp `createdAt` vì trường không có giá trị mặc định.

`createCollection()` cũng nhận đối tượng định nghĩa. Ví dụ sau tạo bảng danh mục trạng thái riêng.

```ts
await builder.createCollection('orderStatuses', {
  fields: [
    { name: 'code', type: 'string', length: 32, primaryKey: true, nullable: false },
    { name: 'title', type: 'string', length: 100, nullable: false },
  ],
});
```

Đối tượng có các thuộc tính như `fields`, `indexes` và `constraints`. Đặt mảng trường trong `fields` để tạo đối số thứ hai hợp lệ. Viết định nghĩa cố định trong migration theo một trong hai dạng để các thay đổi của mô hình nghiệp vụ về sau không ảnh hưởng migration cũ. Dùng `createCollections([{ name, definition }])` với cùng các dạng định nghĩa nếu muốn tạo nhiều Collection.

## Khai báo trường và giá trị mặc định

Tùy chọn và chuỗi phương thức có thể diễn đạt cùng một quy tắc. Ví dụ, `c.string('title', { nullable: false })` tương đương `c.string('title').notNull()`. Chọn một cách viết chính trong mỗi tệp.

| Dữ liệu | Khai báo | Điểm cần lưu ý |
| --- | --- | --- |
| Văn bản ngắn | `c.string('title', { length: 120 })` | Endpoint vẫn kiểm tra nội dung rỗng và độ dài |
| Văn bản dài | `c.text('note')` | Đặt giới hạn văn bản dài theo quy tắc riêng |
| Boolean | `c.boolean('active').notNull().defaultTo(true)` | Quyết định có cho phép null hay không |
| Số nguyên | `c.integer('quantity').notNull().defaultTo(1)` | Nếu cần số dương, thêm quy tắc kiểm tra riêng |
| Số tiền chính xác | `c.decimal('amount', { precision: 12, scale: 2 })` | Giữ độ chính xác khi đọc và ghi |
| Số nguyên lớn | `c.bigInt('externalId')` | Dùng chuỗi thập phân khi vượt miền số nguyên an toàn của JavaScript |
| Ngày giờ theo lịch | `c.date('dueDate')`, `c.time('opensAt')`, `c.datetime('scheduledAt')` | Xử lý theo ngữ nghĩa ngày giờ địa phương |
| Thời điểm tuyệt đối | `c.datetimeTz('paidAt')` | Dùng ngữ nghĩa UTC |
| Dữ liệu có cấu trúc | `c.json('settings')` | Để Repository xử lý cách mã hóa theo dialect |
| Enum cố định | `c.enum('state', { values: ['draft', 'paid'] })` | Đổi thành viên bằng migration. Khả năng áp dụng ràng buộc tùy dialect |

Các kiểu khác gồm `char`, `float`, `double`, `blob`, `uuid` và `native`. `char` cần độ dài. `native` cần tên kiểu của hệ cơ sở dữ liệu và có tính di động hạn chế. Xem đầy đủ [kiểu và tùy chọn trường](https://github.com/nocobase/nocobase/blob/d04061ee252afbcc2f42cf1d69ab8888e72d604a/packages/libs/db/src/collection/types.ts).

Giá trị mặc định điền trường bị bỏ qua khi thêm bản ghi. Muốn cập nhật bản ghi hiện có khi đổi mặc định, khai báo bước bổ sung dữ liệu trong migration. Áp dụng kiểm tra đầu vào và quyền truy cập ở endpoint cùng với ràng buộc khác null và duy nhất ở cơ sở dữ liệu.

## Định nghĩa khóa, index và ràng buộc

`primary()`, `unique()` và `index()` nhận tên một trường hoặc mảng tên. Ví dụ, `c.unique(['customerId', 'orderNo'])` bảo đảm cặp giá trị là duy nhất. Bảng nối có thể dùng `c.primary(['orderId', 'tagId'])` để tạo khóa chính ghép.

Dùng `addIndex()` và `addConstraint()` trên Collection đã có. Ví dụ yêu cầu `customers.id` tương thích với `orders.customerId` và mọi ID khách hàng khác null đang lưu đều tham chiếu hợp lệ.

```ts
await builder.addIndex('orders', {
  name: 'idx_orders_customer',
  fields: ['customerId'],
});
await builder.addConstraint('orders', {
  type: 'foreignKey',
  name: 'fk_orders_customer',
  fields: ['customerId'],
  references: { collection: 'customers', fields: ['id'] },
  onDelete: 'restrict',
});
```

Index hỗ trợ truy vấn. Khóa ngoại bảo đảm tham chiếu hợp lệ. `onDelete: 'restrict'` từ chối xóa khách hàng mà đơn hàng vẫn tham chiếu. Đảo thao tác bằng đúng tên đã khai báo qua `dropConstraint('orders', 'fk_orders_customer')` và `dropIndex('orders', 'idx_orders_customer')`. Tên index và ràng buộc tường minh được giữ nguyên chữ hoa và chữ thường.

Xem [Quan hệ và liên kết](relations.md) để biết metadata quan hệ và index tự động. Tránh tạo index hoặc ràng buộc trùng cho cùng khóa ngoại.

## Thay đổi schema hiện có

Giữ nguyên migration đã merge hoặc phát hành. Thêm migration mới với thao tác cấu trúc tường minh.

```ts
await builder.alterCollection('orders', (c) => {
  c.text('note').nullable();
});
```

Bổ sung dữ liệu cho `note` theo quy tắc nghiệp vụ rõ ràng và xác minh đã xử lý hết giá trị null trước khi siết ràng buộc. Xem [Bổ sung và chuyển đổi dữ liệu cũ](migrations.md#backfill-and-transform-historical-data).

```ts
await builder.alterField('orders', 'note', { type: 'text', nullable: false });
```

Khi sửa trường, giữ rõ kiểu, độ dài hoặc độ chính xác theo trường hợp và kiểm chứng trên cơ sở dữ liệu đích.

Dùng `addField(collection, field)` để thêm một trường. `dropField()` xóa trường và `dropCollection()` xóa Collection, đồng thời làm mất dữ liệu tương ứng. `renameCollection(oldName, newName)` hỗ trợ Collection dạng bảng và có thể từ chối khi còn quan hệ, khóa ngoại hoặc view phụ thuộc. Xử lý phụ thuộc trước rồi dùng thao tác đổi tên để giữ dữ liệu.

## Tên logic và metadata

Builder nhận tên logic như `orderItems` và `customerId`. Cấu hình đặt tên, bao gồm `underscored` và `tablePrefix`, quyết định tên vật lý. Để Builder áp dụng cấu hình thay vì ghép tiền tố hoặc truyền ánh xạ `tableName` hay `columnName`.

Schema vật lý và metadata bổ sung cùng xác định mô hình. Builder đồng bộ hai phần. Đổi schema bằng migration và dùng tệp tự sinh trong `database/<connection>/collections/` để đối chiếu. Xem [Tạo bảng và khởi tạo dữ liệu](../../developing-apps/data-models-and-migrations.md) để kiểm tra cache. Với schema do hệ thống khác quản lý, dùng [kết nối ngoài](../../developing-apps/existing-databases.md). Chế độ này từ chối DDL của Builder.

## Xem trước thay đổi và khả năng cơ sở dữ liệu

Bản xem trước của Builder liệt kê từng thao tác cùng cảnh báo theo dialect.

```ts
const result = await builder.addField(
  'orders',
  { name: 'note', type: 'text', nullable: true },
  { dryRun: true, previewSql: true },
);
console.log(result.sql, result.warnings, result.impact);
```

`dryRun: true` bỏ qua thay đổi schema và đồng bộ metadata. `previewSql: true` trả SQL khi adapter hỗ trợ. Kết hợp với `dryRun: true` nếu chỉ muốn xem trước. `warnings` mô tả giới hạn khả năng, còn `impact` mô tả ảnh hưởng tiềm ẩn với dữ liệu. Kiểm chứng thực thi trên cơ sở dữ liệu đích. `db apply --dry-run` có phạm vi khác và chỉ liệt kê tệp tác vụ đang chờ.

Khi thực thi, `strict: true` chuyển cảnh báo khả năng thành lỗi. Xác nhận thao tác xóa qua quy trình riêng. `ifNotExists` và `ifExists` bỏ qua thao tác tạo hoặc xóa được hỗ trợ theo trạng thái tồn tại. Nếu cấu trúc đối tượng hiện có cần sửa, khai báo thao tác riêng. Trình chạy migration quản lý transaction của tác vụ. Tùy chọn `transaction` của Builder hiện chưa quản lý transaction và `builder.transaction()` chưa mở transaction cơ sở dữ liệu. Xem [Thứ tự thực thi, lịch sử và transaction](migrations.md#execution-order-history-and-transactions).

[Xem phần triển khai Builder](https://github.com/nocobase/nocobase/blob/d04061ee252afbcc2f42cf1d69ab8888e72d604a/packages/libs/db/src/collection/builder/builder.ts).
