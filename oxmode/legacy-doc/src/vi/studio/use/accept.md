---
title: Nghiệm thu kết quả
description: Khi một issue đã được bàn giao, người phụ trách xác nhận kết quả. Đọc báo cáo bàn giao và ảnh chụp màn hình, dùng thử trong preview nếu cần, và merge nếu đạt hoặc trả lại nếu chưa đạt.
---

Nghiệm thu là quyết định quan trọng nhất mà con người đưa ra. Thứ đội Agent bàn giao cho bạn không chỉ là một PR. Báo cáo bàn giao cho biết trước đây thế nào, những gì thay đổi, đã kiểm tra ra sao và còn gì đang mở, kèm tiêu chí nghiệm thu và ảnh chụp màn hình, cùng một preview để bạn tự dùng thử khi CI đã kết nối. Ngay cả chuyên gia nghiệp vụ không đọc mã cũng có thể quyết định dựa vào đó.

## Khi nào cần nghiệm thu

Agent điều phối chỉ chuyển issue sang **In review** và bàn giao cho bạn sau khi PR của nó đã qua kiểm tra và review. Nếu dự án chưa có CI, nó hỏi trước xem bạn có muốn nghiệm thu không cần CI không. Khi issue đang ở In review:

- Nó xuất hiện trong **Waiting for you** ở **My issues**, gắn nhãn **Needs your acceptance**.
- Thẻ **Needs you** ở đầu trang issue cho biết bạn được nhờ xác nhận gì.
- Bên dưới là báo cáo bàn giao mà Agent điều phối đã nộp.

Chỉ con người mới nghiệm thu được. Cả Agent điều phối lẫn Agent thực thi đều không thể đánh dấu issue là xong hay merge PR.

## Đọc báo cáo bàn giao

Báo cáo bàn giao là căn cứ chính để nghiệm thu. Agent điều phối theo một cấu trúc có sẵn:

| Mục | Nội dung |
| --- | --- |
| How it was before | Trước đây thế nào và vấn đề nằm ở đâu |
| Agreed approach | Hướng làm lần này và phạm vi dừng ở đâu |
| What changed | Các thay đổi, diễn đạt bằng ngôn ngữ nghiệp vụ |
| How it was checked | Agent đã chạy những test nào, kiểm tra ở đâu, và kết luận của review |
| Open issues | Những gì chưa giải quyết lần này hoặc có rủi ro, mỗi mục kèm đề xuất |
| Details | Chi tiết kỹ thuật như PR, commit và migration dữ liệu |
| Acceptance criteria | Các mục bạn có thể kiểm tra, kèm ảnh chụp màn hình tương ứng |

Cạnh báo cáo là các ảnh chụp màn hình mà Agent xây dựng đã đính kèm. Bấm vào một ảnh để phóng to và lật xem các ảnh còn lại.

::figure req-accept | Một issue đang nghiệm thu: thẻ Needs you chứa các nút, báo cáo bàn giao ở bên dưới

Tiêu chí nghiệm thu để đối chiếu, không phải để đánh dấu từng mục. Bạn đưa ra đánh giá tổng thể: nghiệm thu hoặc trả lại.

## Xem các thay đổi

- Bấm **View changes** để mở PR trên nền tảng lưu trữ mã.
- Tab **Code and deployments** liệt kê mọi PR liên kết với issue, kèm kết quả kiểm tra và xung đột (nếu có) của từng PR.

Bạn có thể nghiệm thu mà không đọc mã: hãy tập trung vào việc tiêu chí nghiệm thu và ảnh chụp màn hình trong báo cáo bàn giao có đáp ứng nhu cầu của bạn không. Nếu có thắc mắc, hãy bình luận trên issue hoặc dùng **Ask agent**.

## Dùng thử trong preview

Khi dự án đã kết nối CI, mỗi PR có một preview. Mở nó từ trang issue, đăng nhập bằng tài khoản quản trị viên đầu tiên, và tự đi qua các tiêu chí nghiệm thu.

::figure req-preview | Preview của PR, nơi bạn tự dùng thử thay đổi

- Ai sửa được issue đều thấy tên đăng nhập và mật khẩu quản trị viên đầu tiên của preview trên trang issue.
- Preview dùng dữ liệu mẫu, không bao giờ dùng dữ liệu thật của công ty.
- Preview dừng và chuyển sang ngủ sau một thời gian không có người truy cập, và khởi động lại khi bạn mở. Hãy chờ một chút.
- Khi PR được merge hoặc đóng, preview của nó tự động bị xóa.

Dự án không có CI thì không có preview. Xem [Kết nối CI](../setup/ci.md).

## Nghiệm thu

**Issue có PR**: bấm **Merge**. Hộp xác nhận trước tiên kiểm tra PR và kết quả kiểm tra với nền tảng lưu trữ mã, rồi hiển thị:

- Tiêu đề merge commit và cách merge, như "Squash and merge into main". GitHub và Gitee dùng squash merge, còn GitLab theo cài đặt của project.
- Trạng thái của issue sau khi merge.

::figure merge-dialog | Xác nhận trước khi merge

Khi bạn xác nhận, Studio merge đúng phiên bản bạn đã xác nhận. Nếu PR có commit mới trong lúc đó, nó sẽ hỏi bạn xác nhận lại. Khi mọi PR liên kết với issue đã được merge, issue tự chuyển sang **Done**.

**Issue không có PR**, như nghiên cứu hoặc viết tài liệu: bấm **Accept**, và issue chuyển sang **Done**.

> [!NOTE] Lần merge mang tên ai
> Nếu bạn đã kết nối tài khoản riêng trong **Account settings › Git**, lần merge mang tên bạn. Nếu không, nó dùng kết nối Git của workspace.

## Khi kiểm tra chưa đạt

**Merge** không khả dụng trong các trường hợp sau, bạn cần xử lý trước: PR có xung đột, kiểm tra vẫn đang chạy, PR là bản nháp, hoặc quy tắc riêng của nền tảng lưu trữ mã không cho phép merge.

Khi một kiểm tra bắt buộc thất bại, hoặc không có kết quả kiểm tra (ví dụ khi dự án chưa có CI), nút trong hộp xác nhận hiển thị **Merge anyway**, và bạn có thể ghi lý do. Studio đăng một bình luận về lần merge cưỡng bức trên PR và ghi lại trong hoạt động của issue. Quy tắc riêng của nền tảng lưu trữ mã vẫn được áp dụng. Agent không bao giờ được merge cưỡng bức.

## Trả lại

Khi kết quả không như mong đợi:

1. Bấm **Send back for changes**.
2. Nói rõ cần thay đổi gì, càng cụ thể càng tốt, ví dụ "Sau khi gộp, giữ lại thời điểm tạo sớm nhất. Hiện tại nó đang giữ thời điểm muộn nhất."
3. Bấm **Send and return to In progress**.

Issue quay lại **In progress**, và Agent điều phối sắp xếp thay đổi dựa trên phản hồi của bạn, rồi bàn giao lại cho bạn nghiệm thu.

## Đã merge trên nền tảng lưu trữ mã

Nếu ai đó merge PR trực tiếp trên GitHub hoặc GitLab, Studio nhận biết qua webhook hoặc việc hỏi định kỳ, và issue vẫn tự hoàn thành như bình thường. Khi thật sự cần, bạn cũng có thể bấm **Mark as merged** trong Studio để ghi nhận là đã merge.
