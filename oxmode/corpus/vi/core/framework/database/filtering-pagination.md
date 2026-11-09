---
title: Lọc, sắp xếp và phân trang
---

Repository lọc bản ghi, sắp xếp rồi phân trang. Danh sách, số lượng và bản xuất dữ liệu cần dùng cùng phạm vi phân quyền để tránh lộ tổng số hoặc tạo trang không hợp lệ.

## Truy vấn danh sách có giới hạn

```ts
import type { DatabaseManager, RepositoryPolicy } from '@nocobase/db';

export async function searchOrders(db: DatabaseManager, policy: RepositoryPolicy,
  input: { q: string; page: number; pageSize: number }) {
  const { q, page, pageSize } = input;
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(pageSize)
    || pageSize < 1 || pageSize > 100) throw new Error('Invalid pagination');
  const offset = (page - 1) * pageSize;
  if (!Number.isSafeInteger(offset)) throw new Error('Invalid offset');
  const orders = db.repository('orders').withPolicy(policy);
  const filter = q ? ((f: import('@nocobase/db').FilterBuilder) =>
    f.string('title').includes(q)) : undefined;
  const data = await orders.findMany({
    filter, select: (s) => s.fields('id', 'title', 'status'),
    sort: (s) => s.field('id').asc(), limit: pageSize, offset,
  });
  const total = await orders.count({ filter });
  return { data, total };
}
```

Ví dụ dùng lại Repository đã gắn policy và cùng một bộ lọc. Trong thực tế, giới hạn độ dài từ khóa và đánh giá chi phí khi offset lớn. Danh sách và tổng số là hai truy vấn riêng. Nếu cần cùng snapshot, chọn cơ chế cô lập phù hợp.

## Dạng đầu vào

Dùng `{ status: 'draft' }` để so sánh bằng với giá trị vô hướng. Với điều kiện phức tạp, dùng Filter Builder hoặc AST JSON. Cú pháp như `{ amount: { gte: 100 } }` cần được biểu diễn bằng toán tử của Builder hoặc AST. Nếu không có điều kiện lọc, bỏ trường filter.

Kết hợp các nút bằng `f.and([...])` và `f.or([...])`. Chuỗi, số, ngày và JSON có toán tử riêng. Với ngày, dùng toán tử xử lý đúng ngữ nghĩa múi giờ.

## Phân trang bằng cursor

Cursor là ranh giới loại trừ xác định bởi giá trị sắp xếp. Bản ghi tại ranh giới có thể đã bị xóa. Khai báo thứ tự trên trường vô hướng có metadata không cho phép null, rồi thêm đầy đủ khóa chính hoặc khóa duy nhất để phân biệt các giá trị trùng. Các khóa cursor phải khớp chính xác các trường sắp xếp cuối cùng. Chọn cursor hoặc offset cho mỗi truy vấn.

`direction: 'backward'` chọn trang gần nhất trước ranh giới và giữ nguyên thứ tự sắp xếp. Ở trang đầu, bỏ direction. Chỉ đặt direction khi có cursor. Nếu API cần `pageInfo` hoặc `nextCursor`, ứng dụng tự xây dựng phần đó.

## Tính nhất quán và chi phí

Các yêu cầu phân trang đọc dữ liệu tại từng thời điểm, nên bản ghi có thể đổi vị trí khi giá trị sắp xếp thay đổi. Dùng mức cô lập hoặc snapshot nghiệp vụ phù hợp khi cần. Giữ thứ tự ổn định và thiết kế index theo bộ lọc và thứ tự sắp xếp.

Xem [Truy vấn quan hệ](association-queries.md) để phân trang bên trong quan hệ và [Đầu vào truy vấn](query-inputs.md) để tuần tự hóa.

## Giao diện và phần triển khai

- [Lọc](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/zh-CN/repository/filter.md)
- [Phân trang](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/zh-CN/repository/pagination.md)
