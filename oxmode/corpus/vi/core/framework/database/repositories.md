---
title: Repository và thao tác dữ liệu
---

Repository đọc và ghi trường logic và quan hệ của Collection, đồng thời áp dụng codec, hợp đồng truy vấn và policy đã gắn. Việc lấy Repository chỉ trả về giao diện truy cập. Tạo bảng và xác thực bên gọi là các bước riêng.

Bài này hướng dẫn truy cập trực tiếp từ server. Để gọi từ client, khai báo [API dữ liệu Repository](../http/repository-routes.md) bằng `defineRepositoryApiRoutes()`, rồi dùng `api.repository(name)` ở client.

## Ghi một bản ghi

Ví dụ dùng [mô hình đơn hàng](schema.md) và yêu cầu mã `SO-001` chưa tồn tại. Với thao tác phục vụ người dùng, trước hết gắn policy lấy từ kết quả phân quyền.

```ts
import type { DatabaseManager } from '@nocobase/db';

export async function createOrder(database: DatabaseManager) {
  const orders = database.repository('orders');
  const result = await orders.createOne({
    values: { orderNo: 'SO-001', title: 'First order', amount: '19.90' },
  });
  return result.record;
}
```

`createOne()`, `updateOne()` và `upsertOne()` trả đối tượng kết quả ghi. Đọc bản ghi qua `.record`. Dùng chuỗi thập phân chính xác để tránh sai số dấu phẩy động khi xử lý tiền.

## Hợp đồng đọc và ghi

| Phương thức | Hành vi |
| --- | --- |
| `findMany()` | Truy vấn trì hoãn. Dùng `await` để lấy mảng hoặc duyệt bất đồng bộ |
| `findOne()` | Trả một bản ghi hoặc `undefined`. Nếu cần tính duy nhất, áp dụng ràng buộc riêng |
| `count()` / `exists()` | Đếm hoặc kiểm tra tồn tại |
| `updateOne()` / `deleteOne()` | Yêu cầu đúng một bản ghi đích |
| `upsertOne()` | Chọn theo khóa duy nhất, với đầu vào tạo và cập nhật riêng |
| Tạo, cập nhật hoặc xóa hàng loạt | Trả số lượng và có thể trả bản ghi được chọn |

Chọn một cách tiêu thụ cho mỗi truy vấn. Dùng `await` hoặc duyệt đúng một lần. Cập nhật và xóa hàng loạt yêu cầu bộ lọc hoặc `all: true` tường minh. Kiểm tra hợp đồng ghi hàng loạt trước khi dùng các thao tác quan hệ lồng nhau của ghi từng bản ghi.

## Chọn trường và phân quyền

Chỉ chọn trường cần dùng. Khi bỏ phần chọn trường, Repository thường đọc tất cả trường vô hướng. Dùng `withPolicy()` với policy do server xác định để giới hạn bản ghi, trường và quan hệ, kể cả khi đọc kết quả trả về sau thao tác ghi.

Bộ lọc từ bên gọi chỉ thu hẹp kết quả trong phạm vi đã được cấp quyền. Kiểm tra trường, giới hạn và độ phức tạp của đầu vào truy vấn từ bên ngoài.

## Khi nào dùng Query

Dùng Query để bổ sung dữ liệu theo tập hợp hoặc truy vấn bảng mà Repository chưa biểu đạt được. Với Query, xử lý rõ tên vật lý và phân quyền vì phạm vi ánh xạ và policy khác với Repository. Xem [Transaction](transactions.md) và [Truy vấn quan hệ](association-queries.md).

## Giao diện và phần triển khai

- [Phương thức Repository](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/repository.md)
- [Hành vi của policy](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/permissions.md)
