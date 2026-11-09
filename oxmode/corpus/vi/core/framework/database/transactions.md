---
title: Transaction
---

Transaction commit hoặc rollback cùng lúc các thao tác trên một kết nối. Dịch vụ nghiệp vụ xác định phạm vi transaction. Các thao tác Repository, Query và Builder phải dùng kết nối được truyền vào callback.

## Truyền kết nối

```ts
import type { DatabaseManager } from '@nocobase/db';

export async function markPaid(db: DatabaseManager, orderNo: string,
  notify: (orderNo: string) => Promise<void>) {
  return db.transaction(async (connection) => {
    const result = await connection.repository('orders').updateOne({
      filter: { orderNo }, values: { status: 'paid' },
    });
    connection.afterCommit(() => notify(orderNo));
    return result.record;
  });
}
```

Ví dụ minh họa cách gửi thông báo sau commit. Trong luồng nghiệp vụ thực tế, kiểm tra quyền và trạng thái đơn hàng, đồng thời áp dụng ràng buộc xử lý đồng thời trong phạm vi transaction.

Lấy Repository từ kết nối của callback để thao tác tham gia transaction. Repository lấy từ manager bên ngoài và các handle lấy trước đó có phạm vi riêng. Chỉ dùng kết nối của callback cho công việc hoàn tất trước khi callback kết thúc.

## Callback sau commit và rollback

Dùng `afterCommit()` để vô hiệu hóa cache hoặc lập lịch. Khi rollback, các callback này bị hủy. Transaction lồng nhau thành công chuyển callback commit lên transaction ngoài. Nếu transaction lồng rollback, callback commit của nó bị hủy.

Promise của transaction đợi callback sau commit. Khi callback lỗi, dữ liệu đã commit vẫn được giữ và Promise của transaction vẫn hoàn tất. Kết nối chuyển lỗi tới `onTransactionCallbackError` hoặc ghi cảnh báo nếu chưa cấu hình handler. Khi cần bảo đảm giao, lưu công việc đang chờ trong kho bền vững để có thể khôi phục.

`afterRollback()` ghi nhận hoặc dọn dẹp sau rollback. Khi gọi `afterCommit()` ngoài transaction, callback bắt đầu ngay và bên gọi tiếp tục mà không đợi nó hoàn tất.

## Thao tác đồng thời và dialect

Dùng ràng buộc duy nhất, cập nhật có điều kiện, phiên bản hoặc khóa để xử lý tranh chấp nghiệp vụ. Kiểm chứng savepoint, DDL trong transaction và mức cô lập trên từng dialect.

Để mở transaction cơ sở dữ liệu, dùng manager hoặc connection. `builder.transaction()` hiện không mở transaction cơ sở dữ liệu. Transaction của một kết nối chỉ bao phủ thao tác trên kết nối đó. Hệ thống email, HTTP và các kết nối khác có vòng đời riêng.

Kiểm thử commit thành công, lỗi sau khi đã ghi, lỗi callback và thay đổi đồng thời. Đọc lại dữ liệu sau lỗi để xác nhận rollback.

Xem [Transaction và tính nhất quán dữ liệu](../../developing-apps/transactions-and-consistency.md) để áp dụng và kiểm chứng trong ứng dụng.

## Giao diện và phần triển khai

- [Truyền transaction](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/zh-CN/database/transactions.md)
- [API transaction](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/transactions.md)
