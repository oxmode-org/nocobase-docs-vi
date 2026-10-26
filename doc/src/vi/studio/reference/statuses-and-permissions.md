---
title: Trạng thái issue và phân quyền
description: Sáu trạng thái issue và ai được thay đổi chúng, các vai trò có sẵn được làm gì với issue, dự án, ứng dụng, cơ sở tri thức và cài đặt, và Agent làm được gì, không làm được gì.
---

## Trạng thái issue

Mỗi issue ở một trong sáu trạng thái cố định. Dự án không thể thêm, đổi tên hay bỏ trạng thái.

| Trạng thái | Ý nghĩa | Ai chuyển issue sang đây |
| --- | --- | --- |
| Backlog | Chưa bắt đầu. Agent không động đến | Con người, hoặc chọn **Later** khi tạo issue |
| In progress | Đội Agent đang làm | Con người bấm **Start**, hoặc Agent điều phối làm tiếp sau khi được trả lời |
| Blocked | Đang chờ người phụ trách issue quyết định một việc | Agent điều phối khi đặt câu hỏi, hoặc một người dừng lượt chạy |
| In review | Đã bàn giao, chờ người phụ trách issue nghiệm thu | Agent điều phối khi bàn giao |
| Done | Đã nghiệm thu | Tự động khi mọi PR liên kết với issue đã được merge, hoặc một người |
| Cancelled | Không cần nữa | Con người |

- Con người có thể chuyển issue sang bất kỳ trạng thái nào.
- Agent điều phối chỉ chuyển issue giữa In progress, Blocked và In review, và mỗi lần chuyển sang Blocked hoặc In review, nó đều nói rõ cần gì từ người phụ trách. Nó không bao giờ chuyển issue sang Done hay Cancelled.
- Agent thực thi không bao giờ thay đổi trạng thái issue.
- Khi issue chuyển sang Blocked hoặc In review, người phụ trách được thông báo.

Bắt đầu một issue sẽ đặt Agent điều phối làm người thực hiện. Chỉ người phụ trách issue, hoặc người có quyền sửa issue, mới bắt đầu được. Một issue có người thực hiện là một người hoặc không có ai phải được bắt đầu trước khi Agent làm, và nhắc đến một Agent trong bình luận không lách được điều đó.

## Vai trò có sẵn được làm gì

"Liên quan" nghĩa là gì tùy theo đối tượng. Xem ghi chú bên dưới bảng.

| Thao tác | Member | Admin và Owner |
| --- | --- | --- |
| Xem dự án và issue | Liên quan | Tất cả |
| Tạo dự án | Có | Có |
| Quản lý cài đặt của dự án | Dự án mình làm trưởng | Tất cả |
| Xóa dự án | Không | Có |
| Tạo, sửa, bình luận và đóng issue, đổi người phụ trách | Liên quan | Tất cả |
| Xóa issue | Không | Có |
| Đổi Agent | Của mình | Tất cả |
| Xem, cấu hình và triển khai ứng dụng | Ứng dụng mình tạo, và ứng dụng liên kết với dự án mình làm trưởng | Tất cả |
| Tạo và xóa ứng dụng, triển khai lên môi trường được bảo vệ | Không | Có |
| Đọc cơ sở tri thức và đề xuất thay đổi | Dự án mình xem được, và tri thức hệ thống | Tất cả |
| Sửa cơ sở tri thức và quản lý quyền của nó | Dự án mình làm trưởng | Tất cả |
| Xem cài đặt | Có, trừ API key của tổ chức, kết nối Git và cài đặt tìm kiếm cơ sở tri thức | Có |
| Thay đổi cài đặt: Agent, runtime, môi trường triển khai, kết nối Git và API key của tổ chức | Không | Có |
| Kết nối runtime cá nhân và tạo API key riêng | Có | Có |
| Mời thành viên, giao và định nghĩa vai trò | Không | Có |
| Vô hiệu hóa tài khoản và đặt lại mật khẩu cho người khác | Không | Chỉ Owner |

Issue và dự án "liên quan" là những thứ thuộc các dự án bạn tham gia, cộng với các issue bạn phụ trách, đã tạo, đang làm hoặc đang theo dõi. Vai trò tùy chỉnh có thể kết hợp các quyền này theo nhu cầu. Xem [Thành viên và vai trò](../admin/members-and-roles.md).

## Agent làm được gì

- Agent làm việc thay mặt người đã bắt đầu công việc và không bao giờ có nhiều quyền hơn người đó. Agent điều phối và mọi bước nó sắp xếp đều hành động thay người phụ trách issue. Agent trong một phiên hành động thay bạn.
- Agent thực thi được commit, push và mở PR trên nhánh của issue, nhưng không được viết lại lịch sử đã push, và nền tảng lưu trữ mã bảo vệ các nhánh được bảo vệ.
- Trong quản lý phát hành, Agent nhiều nhất chỉ được xem ứng dụng, đọc log và triển khai lên môi trường không được bảo vệ. Chúng không thể thay đổi hay xóa ứng dụng, hoặc triển khai lên môi trường được bảo vệ.
- Agent không thể ghi vào cơ sở tri thức, hay đề xuất thay đổi cho nó.

Chỉ con người mới có thể:

- Nghiệm thu issue và merge PR.
- Duyệt yêu cầu triển khai.
- Quản lý thành viên, vai trò và API key.
