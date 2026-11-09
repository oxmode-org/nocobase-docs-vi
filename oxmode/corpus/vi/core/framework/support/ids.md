---
title: Sinh ID
---

`@nocobase/snowflake` sinh ID số nguyên an toàn trong JavaScript, sắp xếp theo thời gian. Ứng dụng dùng chung bộ sinh qua `idGeneratorToken` từ `@nocobase/app-server/id-generator`.

## Bộ sinh ID của host

```ts
import { idGeneratorToken } from '@nocobase/app-server/id-generator';
import type { ServiceResolver } from '@nocobase/service-provider';

export function nextOrderId(container: ServiceResolver): string {
  return container.resolve(idGeneratorToken).generateString();
}
```

`generate()` trả số nguyên an toàn. `generateString()` trả biểu diễn chuỗi của số đó. Giữ kiểu dữ liệu nhất quán giữa API và cơ sở dữ liệu. Với ID bên thứ ba có thể vượt phạm vi số nguyên an toàn, giữ dạng chuỗi khi xử lý trong JavaScript.

Mã chạy độc lập có thể tạo `new SnowflakeIdGenerator({ workerId })`. Dùng lại một instance để tránh khởi động lại bộ đếm trong cùng một giây ở mỗi lời gọi.

Ứng dụng và plugin dùng chung bộ sinh của host bằng cách truyền `app.container` qua dịch vụ hoặc Provider. Cấu hình triển khai chỉ định worker. Plugin lấy bộ sinh của host thay vì tự dùng lại cùng worker ID. Mã trình duyệt yêu cầu ID bản ghi qua API nghiệp vụ để server cấp ID.

```yaml
snowflake:
  workerId: 1
```

Ví dụ cấu hình một instance. Cấp giá trị riêng cho từng instance. Kiểm thử nghiệp vụ có thể tiêm bộ sinh thay thế với dãy cố định. Khi kiểm thử thuật toán, dùng các bộ sinh độc lập để kiểm tra dãy trong cùng giây, đồng hồ lùi và giá trị biên.

## Worker và đồng hồ

Cơ chế này dùng thời gian theo giây, 5 bit worker và bộ đếm 16 bit. Đặt worker ID từ 0 đến 31 qua `snowflake.workerId` hoặc `SNOWFLAKE_WORKER_ID`. Tự cấp worker ID khác nhau cho các bộ sinh chạy đồng thời trong cùng không gian ID.

Khi hết bộ đếm trong một giây, đồng hồ lùi trước thời điểm sinh ID gần nhất hoặc số vượt phạm vi an toàn, bộ sinh báo lỗi. Dùng đồng hồ ổn định và quản lý cấp phát worker khi triển khai. Khi khởi động lại worker nhanh, tính đến khả năng dùng lại bộ đếm trong cùng giây. Duy trì ràng buộc duy nhất ở cơ sở dữ liệu.

## Phạm vi sử dụng

ID phản ánh thời gian và worker, nên có thể dự đoán một phần. Thứ tự ID giữa các worker chỉ phản ánh cách sinh ID. Để biết thứ tự commit toàn cục, cần dữ liệu từ hệ thống transaction.

Dùng cơ chế tạo giá trị bí mật riêng cho liên kết đặt lại mật khẩu, khóa phiên hoặc API token. Khóa cơ sở dữ liệu, mã nghiệp vụ và định danh ngẫu nhiên công khai có thể dùng các cơ chế khác nhau. Tiếp tục kiểm tra quyền truy cập sau khi tạo ID.

## Giao diện và phần triển khai

- [Triển khai Snowflake](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/snowflake/src/snowflake.ts)
- [Dịch vụ ID của host](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/id-generator/provider.ts)
