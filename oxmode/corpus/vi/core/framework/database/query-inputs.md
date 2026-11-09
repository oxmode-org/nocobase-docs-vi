---
title: Đầu vào và trình dựng truy vấn
---

`@nocobase/repository-input` cung cấp hợp đồng truy vấn dùng chung cho client và server. Trình dựng chuyển biểu thức mã thành dữ liệu có thể tuần tự hóa. Server chịu trách nhiệm thực thi và phân quyền.

## Tạo đầu vào

```ts
import { buildFilter, buildSelect, buildSort } from '@nocobase/repository-input';

export const orderQuery = {
  filter: buildFilter((f) => f.string('status').eq('paid')),
  select: buildSelect((s) => s.fields('id', 'orderNo', 'amount')),
  sort: buildSort((s) => s.field('id').asc()),
};
const json = JSON.stringify(orderQuery);
```

`buildFilter`, `buildSelect`, `buildSort` và `buildAggregate` nhận AST hoặc callback đồng bộ rồi trả về snapshot JSON độc lập. Filter cũng nhận cú pháp viết gọn cho phép so sánh bằng với giá trị vô hướng. Bước dựng đầu vào chỉ tạo dữ liệu. Việc kết nối cơ sở dữ liệu và cấp quyền trường diễn ra riêng ở server.

## Các dạng đầu vào

| Dạng | Công dụng |
| --- | --- |
| Cú pháp so sánh bằng viết gọn | Điều kiện đơn giản với giá trị vô hướng |
| Callback trình dựng | Ghép truy vấn bằng mã dễ đọc |
| AST JSON | Lưu trữ, truyền tải và dựng động |

Chuyển callback thành dữ liệu trước khi truyền JSON. Callback bất đồng bộ, tham chiếu vòng, số không hợp lệ và hàm ở vị trí không được hỗ trợ sẽ gây lỗi. Giá trị ngày chuyển thành chuỗi ISO, còn bigint chuyển thành chuỗi thập phân. Khi tạo literal JSON cho Filter, dùng chuỗi thay cho bigint nguyên bản.

## Biến và thao tác ghi

`context` cung cấp biến cho truy vấn. Truyền transaction và quyền qua các cơ chế tương ứng. Server xác định biến nào lấy từ danh tính tin cậy và biến nào lấy từ đầu vào người dùng đã kiểm tra.

`buildCreateValues` và `buildUpdateValues` chuyển đầu vào thao tác ghi thành dữ liệu. Các helper `build*Options` của API Client tạo yêu cầu từ xa hoàn chỉnh. Dùng điểm vào công khai thay cho các điểm nội bộ `internal/*`.

## Kiểm tra ở server

Kiểm tra truy vấn đã lưu theo Collection, kiểu trường, độ sâu quan hệ, giới hạn và policy. Áp dụng quyền truy cập trên server cho cả truy vấn tạo bằng trình dựng chính thức. Giữ giá trị số chính xác bằng chuỗi khi trường BIGINT hoặc DECIMAL yêu cầu.

Trong kiểm thử, so sánh kết quả thực thi từ Builder và AST trên cơ sở dữ liệu. Kiểm tra cả hành vi truy vấn bên cạnh cấu trúc JSON. Xem [API Client](../http/api-client.md) và [Lọc và phân trang](filtering-pagination.md).

## Giao diện và phần triển khai

- [Trình dựng đầu vào dùng chung](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/repository-input/README.md)
- [Hợp đồng đầu vào Repository](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/signatures/inputs.md)
