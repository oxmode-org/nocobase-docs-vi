---
title: Truy vấn quan hệ
---

Truy vấn quan hệ đọc bản ghi liên quan qua metadata khai báo. Mỗi quan hệ cần có metadata và quyền đọc dữ liệu được chọn.

## Chọn trường ở gốc và trong quan hệ

Ví dụ dùng [quan hệ khách hàng và đơn hàng](relations.md).

```ts
const customers = await db.repository('customers').findMany({
  select: (s) => s.fields('id', 'name').include('orders', (orders) =>
    orders.fields('id', 'title', 'amount')
      .filter({ status: 'draft' })
      .sort((s) => s.field('id').asc())
      .limit(10)),
  sort: (s) => s.field('id').asc(),
  limit: 20,
});
```

Truy vấn gốc trả tối đa 20 khách hàng, mỗi khách hàng có tối đa 10 đơn hàng nháp. Bộ lọc trong quan hệ chỉ thay đổi các đơn hàng được trả về. Để lọc tập khách hàng theo đơn hàng liên quan, đặt điều kiện quan hệ ở truy vấn gốc.

## Cấu trúc kết quả

| Quan hệ | Khi không khớp | Khi có kết quả |
| --- | --- | --- |
| belongsTo / hasOne | `null` | Đối tượng |
| hasMany / belongsToMany | `[]` | Mảng |

Nếu bỏ select, Repository đọc trường vô hướng và chỉ mở rộng quan hệ được yêu cầu. Gọi `fields()` rỗng để loại toàn bộ trường vô hướng ở gốc. Bỏ `fields` để giữ lựa chọn mặc định. Include cùng một quan hệ nhiều lần sẽ báo lỗi.

## Điều kiện và thống kê trong quan hệ

Quan hệ nhiều bản ghi hỗ trợ sắp xếp, giới hạn và cursor riêng. Quan hệ một bản ghi không hỗ trợ phân trang hoặc tổng hợp. Builder quan hệ bất biến, nên hãy trả về kết quả của chuỗi lời gọi để các thay đổi có hiệu lực.

`combine()` trả các nhánh bản ghi, số lượng và tổng độc lập. Muốn giới hạn nhánh thống kê, cấu hình ở nhánh đó. Giới hạn của nhánh bản ghi chỉ áp dụng cho chính nhánh đó.

## Chi phí và quyền truy cập

Quan hệ được nạp theo lô cho từng nhánh. Tùy truy vấn, cơ sở dữ liệu có thể đọc nhiều hàng hơn giới hạn trả về của mỗi bản ghi cha. Đánh giá số truy vấn, bộ nhớ và kích thước payload với quan hệ sâu hoặc lớn.

Chọn trường và gắn policy tường minh. Áp dụng quy tắc truy cập của dữ liệu đích cho từng quan hệ. Nếu nhiều nhánh cần cùng snapshot, chọn cơ chế transaction phù hợp. Xem [Transaction](transactions.md) và [Tổng hợp](aggregation.md).

## Giao diện và phần triển khai

- [Chọn trường và quan hệ](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/zh-CN/repository/select.md)
- [Phân trang trong quan hệ](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/zh-CN/repository/pagination.md)
