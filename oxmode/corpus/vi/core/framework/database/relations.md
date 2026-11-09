---
title: Quan hệ và liên kết
description: Khai báo belongsTo, hasOne, hasMany và belongsToMany với trường khóa ngoại, index và ràng buộc tường minh.
---

Quan hệ cho phép Repository đọc và ghi bản ghi liên quan qua mô hình logic. Chạy các ví dụ trong callback `up({ builder })` của migration. Dùng `orders` từ [Bảng và trường](schema.md), với `id` tự tăng và `customerId` kiểu số nguyên có thể null.

## Trường quan hệ và ràng buộc cơ sở dữ liệu

Trong đơn hàng, `customerId` là trường vật lý lưu ID khách hàng. `customer` là trường quan hệ cho Repository biết cách đọc khách hàng đó. Khóa ngoại trong cơ sở dữ liệu bảo đảm ID khác null tham chiếu khách hàng có thật. Quyền đọc khách hàng được kiểm tra riêng.

Mỗi quan hệ cần khai báo đầy đủ các khóa. Repository dùng chính những khóa này để ghép dữ liệu.

| Quan hệ | Tùy chọn bắt buộc |
| --- | --- |
| `belongsTo` | `foreignKey`, `targetKey` |
| `hasOne`, `hasMany` | `sourceKey`, `foreignKey` |
| `belongsToMany` | `sourceKey`, `targetKey`, `through`, `foreignKey`, `otherKey` |

Dùng tên trường logic và kiểu khóa tương thích, kể cả thuộc tính unsigned theo dialect. Kiểm tra các bản ghi hiện có có đáp ứng ràng buộc trước khi tạo quan hệ.

## Quan hệ nhiều-một

Tạo khách hàng rồi thêm quan hệ cho đơn hàng. Tại bước này, `customerId` của các đơn hàng hiện có nên là null. Nếu đã lưu ID từ trước, nhập các khách hàng tương ứng rồi kiểm tra tham chiếu.

```ts
await builder.createCollection('customers', (c) => {
  c.increments('id');
  c.string('name', { length: 120 }).notNull();
});
await builder.alterCollection('orders', (c) => {
  c.belongsTo('customer', 'customers')
    .foreignKey('customerId')
    .targetKey('id')
    .constraints(true)
    .onDelete('restrict');
});
```

`foreignKey('customerId')` dùng lại trường trên đơn hàng. `targetKey('id')` trỏ đến khóa chính của khách hàng. Repository có thể đọc khách hàng qua `include('customer', ...)`. Xem [Truy vấn quan hệ](association-queries.md).

`belongsTo` cũng có thể tạo cột khóa ngoại cục bộ khi khai báo `foreignKeyType`. Ví dụ, dùng `c.belongsTo('customer', 'customers', { foreignKeyType: 'integer', unsigned: true })` rồi chỉ định cả hai khóa. Khi trường vô hướng đã tồn tại, có thể bỏ tùy chọn này. Khai báo trường vô hướng riêng để thể hiện rõ kiểu, giá trị mặc định và khả năng nhận null.

## Quan hệ một-một và một-nhiều

Danh sách đơn hàng của khách hàng là quan hệ ngược. Khóa ngoại vẫn nằm trên đơn hàng.

```ts
await builder.alterCollection('customers', (c) => {
  c.hasMany('orders', 'orders')
    .sourceKey('id')
    .foreignKey('customerId');
});
```

`hasMany` thêm metadata quan hệ và dùng khóa ngoại đã có. Nếu mỗi khách hàng có tối đa một hồ sơ, dùng `hasOne` và đặt ràng buộc duy nhất cho ID khách hàng trên hồ sơ.

```ts
await builder.createCollection('customerProfiles', (c) => {
  c.increments('id');
  c.integer('customerId').unsigned().notNull().unique();
  c.text('notes');
  c.belongsTo('customer', 'customers', { index: false })
    .foreignKey('customerId').targetKey('id')
    .constraints(true).onDelete('cascade');
});
await builder.alterCollection('customers', (c) => {
  c.hasOne('profile', 'customerProfiles')
    .sourceKey('id').foreignKey('customerId');
});
```

`hasOne` mô tả quan hệ trong mô hình. `unique()` bảo đảm cơ sở dữ liệu từ chối ID khách hàng trùng. Ràng buộc duy nhất đã cung cấp index, nên đặt `index: false` để tránh thêm index mặc định trùng. Trong ví dụ này, xóa khách hàng sẽ xóa hồ sơ tương ứng theo quy tắc nghiệp vụ đã chọn.

## Quan hệ nhiều-nhiều và bảng nối

Một đơn hàng có thể có nhiều thẻ và một thẻ có thể gắn với nhiều đơn hàng. Tạo bảng thẻ và bảng nối trước khi khai báo quan hệ.

```ts
await builder.createCollection('tags', (c) => {
  c.increments('id');
  c.string('name', { length: 64 }).notNull().unique();
});
await builder.createCollection('orderTags', (c) => {
  c.integer('orderId').unsigned().notNull();
  c.integer('tagId').unsigned().notNull();
  c.primary(['orderId', 'tagId']);
  c.foreignKey('orderId', {
    references: { collection: 'orders', fields: ['id'] },
    onDelete: 'cascade',
  });
  c.foreignKey('tagId', {
    references: { collection: 'tags', fields: ['id'] },
    onDelete: 'cascade',
  });
});
await builder.alterCollection('orders', (c) => {
  c.belongsToMany('tags', 'tags')
    .sourceKey('id').targetKey('id')
    .through('orderTags').foreignKey('orderId').otherKey('tagId');
});
```

`foreignKey` là trường trên bảng nối trỏ tới đơn hàng. `otherKey` trỏ tới thẻ. Khóa chính ghép ngăn trùng cặp đơn hàng và thẻ. Tạo `orderTags` và khai báo các trường bổ sung, chẳng hạn thứ tự, tường minh trước khi dùng quan hệ.

Khi xóa đơn hàng hoặc thẻ, ví dụ này xóa các dòng nối tương ứng và giữ bản ghi nghiệp vụ ở phía bên kia. Xem [Truy vấn và thao tác quan hệ](association-queries.md).

## Index và quy tắc xóa, cập nhật

Mặc định, `belongsTo` thêm index cho khóa ngoại. Dùng `index: false` khi đã có index đặt tên, nhất là khi thêm quan hệ riêng qua `addField()`.

Chỉ `constraints: true` hoặc `.constraints(true)` tạo khóa ngoại tự động. Nếu đã tạo qua `foreignKey()` hoặc `addConstraint()`, đặt `constraints: false` ở quan hệ để dùng ràng buộc đã có. Ràng buộc hiện có vẫn được giữ. Với `hasOne`, `hasMany` và `belongsToMany`, tự khai báo ràng buộc trên bảng còn lại.

`onDelete` và `onUpdate` nhận `restrict`, `cascade`, `set null`, `set default` và `no action` tùy khả năng của hệ cơ sở dữ liệu. `set null` cần trường cho phép null. `set default` cần giá trị mặc định thỏa tham chiếu. Đặt quy tắc xóa tường minh để có hành vi nhất quán giữa các hệ.

Khi rollback, gỡ quan hệ, ràng buộc, index và các trường đã thêm theo thứ tự phụ thuộc trước khi xóa Collection được tham chiếu. Khi gỡ quan hệ dùng lại trường vô hướng, xử lý riêng trường, index và ràng buộc đã khai báo tường minh. Kiểm thử schema thực tế, tham chiếu sai, liên kết trùng và bản ghi sau khi xóa, bên cạnh khả năng đọc quan hệ qua Repository.

Xem [Hợp đồng khóa quan hệ](https://github.com/nocobase/nocobase/blob/d04061ee252afbcc2f42cf1d69ab8888e72d604a/packages/libs/db/src/collection/relation-contract.ts) và [Trình biên dịch schema](https://github.com/nocobase/nocobase/blob/d04061ee252afbcc2f42cf1d69ab8888e72d604a/packages/libs/db/src/collection/compiler/compiler.ts).
