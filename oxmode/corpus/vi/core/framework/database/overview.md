---
title: Tổng quan cơ sở dữ liệu
---

`@nocobase/db` cung cấp mô hình logic, truy cập dữ liệu, thay đổi schema và transaction. Package dialect kết nối với từng hệ cơ sở dữ liệu. Runtime ứng dụng quản lý cấu hình, tìm tài nguyên và điều phối vòng đời.

## Chọn giao diện phù hợp

| Giao diện | Trách nhiệm |
| --- | --- |
| DatabaseManager / Connection | Kết nối có tên hoặc mặc định, giải phóng kết nối và transaction |
| CollectionBuilder | Bảng, trường, metadata quan hệ, index và thay đổi schema |
| Repository | Truy cập mô hình logic, quan hệ, codec và policy |
| Query | Truy vấn theo bảng, bổ sung dữ liệu theo tập hợp và báo cáo chuyên biệt |
| Collections / SchemaInspector | Phân giải mô hình logic và kiểm tra schema vật lý |
| Migrator / Seeder | Theo dõi lịch sử thay đổi schema và khởi tạo dữ liệu |

Mã nghiệp vụ thường bắt đầu với Repository. Trong migration, dùng Builder cho schema và Query để bổ sung dữ liệu theo tập hợp. Kiểm tra hợp đồng của từng dialect trước khi dựa vào tính năng riêng của driver.

## Dùng cơ sở dữ liệu của ứng dụng

```ts
import { databaseManagerToken } from '@nocobase/db';

// Inside a server route factory or ServiceProvider:
const database = app.container.resolve(databaseManagerToken);
const orders = database.repository('orders');
```

Dùng lại dịch vụ đã cấu hình. Script độc lập và bài kiểm thử có thể tạo manager riêng và cần giải phóng manager sau khi sử dụng. Xem [Kết nối và dialect](connections.md).

## Ranh giới tích hợp của ứng dụng và plugin

Ứng dụng cấu hình kết nối và đặt tài nguyên ở `database/<connection>/migrations/` và `seeds/`. Plugin thường cung cấp `database/migrations/` và `seeds/`, đồng thời khai báo đường dẫn trong `server/plugin.ts` để host tìm và thực thi. Cả hai dùng `defineMigration()`, `defineSeed()` và ngữ cảnh tương ứng. Cơ sở dữ liệu xử lý tài nguyên theo cùng quy tắc dù chúng nằm ở vị trí nào.

Dịch vụ nghiệp vụ dùng lại `DatabaseManager` của host và chọn kết nối có tên khi cần. Plugin dùng kết nối do host quản lý trong từng yêu cầu. Host giải phóng manager dùng chung khi tắt. Xác định rõ truy vấn và phạm vi transaction cho từng kết nối. Mọi thao tác cơ sở dữ liệu chạy ở server, còn client truy cập qua API.

Xem [Tạo bảng và khởi tạo dữ liệu](../../developing-apps/data-models-and-migrations.md), [Nhiều kết nối cơ sở dữ liệu](../../developing-apps/multiple-databases.md) và [Tài nguyên cơ sở dữ liệu của plugin](../../extension-development/database-and-migrations.md) để triển khai. Chương này giải thích cơ chế mô hình, thao tác, transaction và thực thi tài nguyên.

## Mô hình logic và vật lý

Collection kết hợp schema vật lý với metadata bổ sung. Tên logic có thể khác tên vật lý. Repository hiểu các ánh xạ logic. Query dùng tên bảng và cột vật lý. Khi bổ sung dữ liệu bằng Query, ghi rõ tên đích, kể cả tiền tố bảng nếu có, vì Query không áp dụng ánh xạ trường hay tiền tố từ Collection.

Duy trì ràng buộc vật lý song song với metadata quan hệ và tiêu đề. Các tệp trong `database/<connection>/collections/` là snapshot tự sinh. Thực hiện thay đổi schema bằng migration.

## Ví dụ trong chương

Ví dụ dùng `orders` với `id`, `orderNo`, `title`, `status`, `amount` và `customerId`. Bài [Bảng và trường](schema.md) tạo mô hình cơ sở. Bài [Quan hệ](relations.md) thêm khách hàng và khai báo hai chiều quan hệ. Các truy vấn giả định mô hình đã tồn tại, mã chạy ở server và bên gọi đã hoàn tất phân quyền.

## Phân quyền và thay đổi schema

Dịch vụ cơ sở dữ liệu cần được truyền thông tin phân quyền từ bên gọi. Gắn policy được xác định từ kết quả phân quyền vào Repository. Dùng bộ lọc người dùng để thu hẹp kết quả trong phạm vi đã được cấp quyền.

Đọc tiếp các bài về schema, truy cập dữ liệu, quan hệ, transaction và migration. Xem [Chỉ mục API cơ sở dữ liệu](../../reference/api.md) để tra chữ ký và [Tương thích](../../reference/compatibility.md) để biết điều kiện của từng dialect.

## Giao diện và phần triển khai

- [Khái niệm cơ sở dữ liệu](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/zh-CN/overview.md)
- [API cơ sở dữ liệu](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/README.md)
