---
title: Kết nối cơ sở dữ liệu hiện có
description: Kết nối schema do hệ thống khác quản lý, bổ sung metadata và quan hệ, rồi kiểm tra ánh xạ tên và quyền truy cập.
---

Khi schema thuộc quyền quản lý của hệ thống khác như CRM hoặc ERP, dùng `schemaManagement: 'external'`. Framework đọc cấu trúc hiện có và bổ sung metadata do ứng dụng quản lý. Kết nối này nằm ngoài phạm vi chạy migration, Seed và lệnh DDL từ Builder.

`external` xác định bên quản lý schema. Quyền đọc và ghi bản ghi vẫn phụ thuộc thông tin xác thực cơ sở dữ liệu và phân quyền của ứng dụng. Hướng dẫn này dùng cấu trúc `externalCrm` trong template Examples.

<a id="confirm-the-existing-schema"></a>

## Xác nhận schema hiện có

Xác nhận bảng, cột, khóa chính và ý nghĩa nghiệp vụ với bên quản lý cơ sở dữ liệu. Ví dụ giả định đã có các bảng và cột vật lý sau:

- `crm_customers` gồm `id`, `display_name` và `email`.
- `crm_orders` gồm `id`, `order_no` và `customer_id`. Cột `customer_id` tham chiếu ID khách hàng.

Các bảng này cần tồn tại trước khi nạp metadata. Trong template Examples, `ExternalCrmProvider` chỉ chuẩn bị cơ sở dữ liệu SQLite cục bộ để minh họa. Với hệ thống ngoài thực tế, schema do bên quản lý hệ thống đó tạo.

<a id="configure-the-external-connection"></a>

## Cấu hình kết nối ngoài

Thêm mục sau vào `connections` trong hàm tạo cấu hình ở `server/config/database.ts` và giữ các kết nối hiện có:

```ts
externalCrm: {
  dialect: 'sqlite',
  filename: paths.storage('external-crm.sqlite'),
  schemaManagement: 'external',
  naming: { underscored: true, tablePrefix: 'crm_' },
},
```

`paths` lấy từ hàm tạo cấu hình hiện có. Ví dụ cục bộ dùng SQLite. Khi kết nối hệ thống thực tế, cài dialect tương ứng và dùng thông số kết nối của hệ thống đó. Lưu thông tin xác thực trong cấu hình môi trường ứng dụng và giữ các giá trị này ngoài kho mã nguồn.

`tablePrefix: 'crm_'` và `underscored: true` ánh xạ bảng `crm_orders` thành Collection `orders` và cột `customer_id` thành trường `customerId`. Metadata và Repository dùng tên logic này. Kiểm tra ánh xạ trước khi viết truy vấn.

<a id="add-metadata"></a>

## Thêm metadata

Môi trường chạy của ứng dụng mặc định đọc metadata của kết nối ngoài từ `database/<connection>/metadata/`. Vì vậy, ví dụ dùng luôn vị trí mặc định. Script `@nocobase/db` chạy độc lập cần khai báo rõ nơi lưu metadata. Xem [Kết nối, cấu hình và dialect](../framework/database/connections.md).

Tạo `database/externalCrm/metadata/customers.json`:

```json
{
  "version": 1,
  "name": "customers",
  "title": "CRM customers",
  "fields": {
    "displayName": {
      "title": "Display name"
    },
    "email": {
      "title": "Email address"
    }
  }
}
```

Tạo `database/externalCrm/metadata/orders.json`:

```json
{
  "version": 1,
  "name": "orders",
  "title": "CRM orders",
  "fields": {
    "orderNo": {
      "title": "Order number"
    }
  },
  "relations": {
    "customer": {
      "type": "belongsTo",
      "target": "customers",
      "foreignKey": "customerId",
      "targetKey": "id",
      "title": "Customer"
    }
  }
}
```

Tiêu đề và mô tả bổ sung thông tin ngoài schema. Quan hệ `customer` mô tả liên kết giữa các trường có sẵn. Khai báo này giữ nguyên cột, khóa ngoại và các bản ghi lịch sử. Dùng tên logic của schema cho `foreignKey` và `targetKey`.

Đưa các tệp JSON viết tay này vào kho mã nguồn. Duy trì cấu hình trong các tệp nguồn, còn `collections/<collection>/metadata.json` là đầu ra được tạo lại từ schema và metadata nguồn.

<a id="refresh-collection-information"></a>

## Làm mới thông tin Collection

```bash
pnpm nocobase collections generate --connection externalCrm
pnpm nocobase collections generate --connection externalCrm --check
```

Các tệp sinh trong `database/externalCrm/collections/` kết hợp schema vật lý và metadata. Sau khi thay đổi, sinh lại tệp và kiểm tra tên logic, trường và quan hệ. Nạp lại ứng dụng đang chạy để cập nhật thông tin mà bộ nhớ đệm có thể vẫn giữ từ lần nạp trước.

Kiểm tra lại khi bên quản lý cơ sở dữ liệu ngoài thay đổi schema. Nếu thiếu trường, phối hợp với bên đó để xử lý. Migration ứng dụng chỉ dành cho kết nối do ứng dụng quản lý.

<a id="query-from-a-business-service"></a>

## Truy vấn từ dịch vụ nghiệp vụ

Hàm sau cần chính sách lấy từ kết quả phân quyền, cho phép đọc các trường đơn hàng đã chọn và các trường trong quan hệ khách hàng:

```ts
import type { DatabaseManager, RepositoryPolicy } from '@nocobase/db';

export async function listCrmOrders(
  database: DatabaseManager,
  policy: RepositoryPolicy,
) {
  return database.connection('externalCrm').repository('orders')
    .withPolicy(policy)
    .findMany({
      select: (s) => s.fields('id', 'orderNo')
        .include('customer', (customer) => customer.fields('id', 'displayName')),
      sort: (s) => [s.field('id').asc()],
      limit: 20,
    });
}
```

Để chỉ cho phép đọc, giới hạn cả quyền của tài khoản cơ sở dữ liệu và các thao tác mà ứng dụng cung cấp. Quyền đọc quan hệ vẫn do chính sách quyết định khi dùng `include()`. Nếu đơn hàng và khách hàng cần các phạm vi nghiệp vụ riêng, truy vấn bằng các chính sách riêng. Xem [Truy vấn và thao tác dữ liệu](querying-data.md).

Để cung cấp API HTTP, làm theo [Route và API HTTP](apis-and-services.md) và khai báo rõ `connection: 'externalCrm'`, các thao tác và chính sách trong Repository API. Endpoint chỉ khả dụng sau khi được khai báo.

<a id="verify"></a>

## Kiểm tra

Xác nhận ánh xạ tên vật lý và tên logic, rồi truy vấn các trường và quan hệ thực tế. Kiểm thử trường hợp thiếu quan hệ hoặc bản ghi bị xóa từ hệ thống ngoài. Dùng thông tin xác thực thực tế để kiểm tra giới hạn ghi theo thiết kế. Xác nhận Builder từ chối DDL và kết nối này nằm ngoài phạm vi migration và Seed của ứng dụng. Tôn trọng quyền quản lý schema cả khi truy cập qua client cấp thấp.

SQLite chỉ dùng để minh họa quy trình. Trước khi triển khai, kiểm tra kiểu dữ liệu, khóa chính, quyền truy cập và thay đổi schema trên cơ sở dữ liệu đích. Xem [Nhiều kết nối cơ sở dữ liệu](multiple-databases.md) để biết phạm vi transaction.
