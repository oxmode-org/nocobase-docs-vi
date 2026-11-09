---
title: Duyệt phát hành và rollback
description: Duyệt phát hành là một trong những quyết định then chốt của con người. Sau khi merge, CI triển khai mã lên staging, và mỗi lần triển khai lên môi trường được bảo vệ như production cần người duyệt đồng ý. Nếu có sự cố, bạn có thể rollback về phiên bản trước.
---

Quản trị viên thiết lập các môi trường triển khai và quyết định ai duyệt trong [Môi trường triển khai](../admin/environments.md). Để kết nối CI, xem [Kết nối CI](../setup/ci.md).

## Một lần phát hành diễn ra thế nào

Lấy ví dụ dự án Supplier Management, đã kết nối CI:

1. Khi một issue được nghiệm thu và PR của nó được merge, CI triển khai nhánh mặc định lên staging, và issue hiển thị "Staging ✓ b64c3bd".
2. Tạo một tag phiên bản như `v1.4.0`, và CI build phiên bản đó rồi triển khai lên production.
3. Production được bảo vệ, nên lần triển khai trở thành một yêu cầu triển khai trong hộp thư của người duyệt.
4. Khi người duyệt đồng ý, nó lên production, và issue hiển thị "Production ✓ 1.4.0".

**Releases** trên trang tổng quan dự án cho biết phiên bản nào đang chạy ở mỗi môi trường, commit tạo ra nó, ai triển khai, ai duyệt, và các yêu cầu còn đang chờ duyệt.

## Người duyệt làm gì

Yêu cầu triển khai xuất hiện trong **To decide** ở hộp thư của người duyệt, kèm:

- Ứng dụng và môi trường.
- Phiên bản cần triển khai và commit tạo ra nó.
- Tag hoặc nhánh mà CI dùng để build, và log CI.
- Ai khởi tạo: một người, một Agent, hay CI.

Mở yêu cầu và kiểm tra. Để duyệt, gõ lại app ID một lần nữa để xác nhận, và việc triển khai bắt đầu ngay. Nó triển khai đúng phiên bản trong yêu cầu, và một phiên bản mới hơn xuất hiện sau đó sẽ không thay thế. Nếu không đồng ý, hãy từ chối yêu cầu.

Không ai được duyệt yêu cầu do chính mình khởi tạo. Agent không thể duyệt triển khai hay triển khai thẳng lên môi trường được bảo vệ.

> [!WARNING] Sao lưu trước khi triển khai
> Studio không sao lưu cơ sở dữ liệu của ứng dụng trước khi triển khai. Hãy tự sao lưu cơ sở dữ liệu production định kỳ, ví dụ chạy `pg_dump` theo lịch hoặc dùng tính năng sao lưu của dịch vụ cơ sở dữ liệu.

## Rollback

Nếu phát hiện sự cố sau khi triển khai, mở ứng dụng trong **Releases › Apps**, chọn một lần triển khai thành công trước đó trong lịch sử, và rollback về phiên bản đó. Trên môi trường được bảo vệ, rollback cũng trở thành một yêu cầu triển khai cho người duyệt.

Sau khi rollback, Studio kiểm tra xem thay đổi của từng issue còn đang chạy không:

- Các issue có thay đổi không còn trong phiên bản đang triển khai sẽ bị rút dấu triển khai, ví dụ "Withdrawn with 1.3.0".
- Với các issue đã xong nhưng thay đổi đã bị rollback, người thực hiện rollback nhận được gợi ý mở lại chúng, có thể làm theo hoặc bỏ qua.

Trạng thái issue không tự thay đổi. Con người quyết định có mở lại hay không.

## Đã merge, chưa phát hành

**Merged, not released** trên trang tổng quan dự án liệt kê các issue đã xong nhưng thay đổi chưa lên production. Trưởng dự án được thông báo mỗi khi một issue như vậy hoàn thành. Khi chuẩn bị phát hành phiên bản mới, hãy xem ở đây để biết lần phát hành này sẽ gồm những gì.
