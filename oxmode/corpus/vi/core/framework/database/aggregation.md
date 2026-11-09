---
title: Tổng hợp và thống kê
---

Cơ sở dữ liệu thực hiện phép đếm, tính tổng, trung bình và cực trị. Thống kê cũng có thể tiết lộ dữ liệu. Áp dụng cùng phạm vi phân quyền với bản ghi chi tiết.

## Tổng hợp ở gốc và theo nhóm

```ts
const totals = await db.repository('orders').aggregate({
  filter: { status: 'paid' },
  aggregate: (a) => ({ count: a.count(), total: a.sum('amount') }),
});

const byStatus = await db.repository('orders').groupBy({
  by: ['status'],
  aggregate: (a) => ({ count: a.count(), total: a.sum('amount') }),
  having: (f) => f.number('count').gte(2),
  sort: (s) => s.field('status').asc(),
});
```

`aggregate()` trả đối tượng ánh xạ bí danh sang giá trị. `groupBy()` trả trường nhóm và các bí danh. Lọc bản ghi nguồn trước, nhóm chúng, rồi áp dụng `having` lên kết quả đã nhóm.

## Giá trị số và tập rỗng

| Phép tính | Ngữ nghĩa |
| --- | --- |
| `count()` | Đếm dòng. Tập rỗng trả số 0 |
| `count(field)` | Bỏ qua giá trị SQL NULL |
| `sum()` / `avg()` | Chuỗi giữ độ chính xác cho trường integer hoặc DECIMAL, số cho trường dấu phẩy động |
| `min()` / `max()` | Giữ kiểu kết quả logic của trường |
| Sum, avg, min hoặc max trên tập rỗng | `null` |

Giữ độ chính xác cho tiền và số nguyên lớn khi chuyển kiểu. Tách định dạng hiển thị khỏi tính toán và quy định bước làm tròn.

## Ràng buộc nhóm

`by` phải có ít nhất một trường và không được lặp trường. Bí danh phép tổng hợp phải khác tên trường nhóm. `having` và `sort` chỉ dùng trường nhóm hoặc bí danh.

`groupBy()` của Repository hiện hỗ trợ tập tùy chọn riêng, chưa có `select`, `limit`, `offset` hoặc `cursor`. Với báo cáo phức tạp, cân nhắc Query hoặc bảng tổng hợp riêng và duy trì phân quyền.

## Thống kê quan hệ và kiểm thử

Nhánh Select của quan hệ nhiều bản ghi hỗ trợ count, sum và combine. Trang bản ghi và nhánh tổng có thể dùng tùy chọn riêng. Khai báo rõ phạm vi cần đếm.

Kiểm thử tập rỗng, NULL, số thập phân chính xác, nhóm theo trạng thái và bản ghi ngoài phạm vi truy cập. Xem [Truy vấn quan hệ](association-queries.md) và [Đầu vào truy vấn](query-inputs.md).

## Giao diện và phần triển khai

- [Aggregate](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/zh-CN/repository/methods/aggregate.md)
- [GroupBy](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/zh-CN/repository/methods/group-by.md)
