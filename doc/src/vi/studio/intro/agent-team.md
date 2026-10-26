---
title: Cách đội Agent làm việc
description: Agent điều phối phân công thiết kế, phát triển, kiểm thử và review theo thế mạnh của từng Agent, và giữ cho nhiều issue cùng tiến triển. Công việc chỉ đến tay con người để nghiệm thu sau khi đã qua kiểm tra và review.
---

Khi Claude Code, Codex và các công cụ lập trình khác đã kết nối với Studio, chúng tạo thành một đội Agent. Khi một yêu cầu đã trở thành issue và issue được bắt đầu, đội này đẩy nó tiến lên. Agent điều phối quyết định ai làm từng bước, các Agent thực thi làm phần thiết kế, phát triển, kiểm thử và review, còn những gì cần con người quyết định được chuyển cho người phụ trách issue.

## Ai có trong đội Agent

| | Là gì | Làm gì |
| --- | --- | --- |
| Agent điều phối | Có sẵn trong Studio, một cho cả nhóm | Quyết định ai làm từng bước của mỗi issue, đọc phản hồi và chọn bước tiếp theo. Tìm đến người phụ trách issue khi cần con người quyết định, và bàn giao công việc đã xong cho người phụ trách nghiệm thu. Nó không viết mã và không merge gì cả. |
| Agent thực thi | Một công cụ lập trình đã cài và đăng nhập trên một runtime. Mỗi cặp công cụ lập trình với model là một Agent, như Claude · Opus 5.5 hoặc Codex · GPT-5.5 | Làm bước mà Agent điều phối giao: viết kế hoạch, xây dựng, viết test, review, hoặc tìm nguyên nhân CI lỗi. Trả lời kết quả trên issue, và không bao giờ đổi trạng thái issue hay chuyển việc cho người khác. |

Mỗi Agent thực thi có một mô tả **Good at** (thế mạnh), như "thiết kế hướng làm và review mã" hoặc "phát triển tính năng và sửa lỗi". Đây là căn cứ duy nhất Agent điều phối dùng khi phân công, và quản trị viên viết nó khi bật Agent. Xem [Bật Agent](../setup/agents.md).

Agent điều phối cũng cần một model để chạy. Quản trị viên chọn một lựa chọn chính và một lựa chọn dự phòng cho nó. Nếu lựa chọn chính không khởi động được trong hai phút, lựa chọn dự phòng sẽ thay thế.

Trong **My sessions**, bạn có thể trao đổi một yêu cầu với Agent của riêng bạn, và nó sẽ biến yêu cầu thành các issue. Khi issue được bắt đầu, đội Agent sẽ tiếp nhận từ đó. Xem [My sessions](../use/sessions.md).

## Agent điều phối phân công thế nào

Agent điều phối thức dậy khi một issue được bắt đầu, khi một Agent thực thi trả lời, khi có người bình luận, và khi kiểm tra của một PR đạt hoặc lỗi. Nó đọc những gì mới, quyết định bước tiếp theo, rồi làm một trong ba việc:

- Giao một bước cho một Agent thực thi.
- Khi cần con người quyết định, chuyển issue sang **Blocked** và nêu rõ người phụ trách issue cần quyết định gì.
- Khi PR đã qua review và các kiểm tra, chuyển issue sang **In review** và đính kèm báo cáo bàn giao.

Để giao một bước, Agent điều phối đăng một bình luận trên issue, nhắc đến Agent được giao và nói rõ cần làm gì, cần đọc gì, khi nào bước đó được xem là xong, và vì sao chọn Agent đó. Phản hồi của Agent thực thi lại đánh thức Agent điều phối.

::figure req-dispatch | Agent điều phối giao một bước, nói rõ làm gì, đọc gì và khi nào xem là xong

Agent điều phối tuân theo các nguyên tắc phân công có sẵn:

- **Chọn Agent theo thế mạnh.** Thiết kế hướng làm và các cuộc điều tra khó giao cho Agent giỏi suy luận và thiết kế, phát triển thông thường cho Agent giỏi xây dựng, thay đổi nhỏ và test bổ sung cho Agent giỏi thay đổi nhỏ, còn review cho Agent giỏi review.
- **Lên kế hoạch trước, xây dựng sau.** Khi một thay đổi trải qua nhiều module, đụng đến dữ liệu và migration, xử lý đồng thời hoặc phân quyền, hoặc issue không nói cách làm, một Agent giỏi thiết kế sẽ viết một kế hoạch ngắn trước. Khi kế hoạch đã chốt, nó xác định phạm vi xây dựng, và làm vượt phạm vi cần Agent điều phối đồng ý.
- **Để nhà cung cấp khác review.** Mã được giao cho một Agent của nhà cung cấp khác review. Nếu không có Agent nào như vậy trực tuyến, một model khác của cùng nhà cung cấp sẽ review. Model đã viết mã không bao giờ tự review mã của mình. Các phát hiện khi review được trả về cho Agent đã viết mã, và bản sửa lại được review lần nữa.
- **Con người chỉ thấy sau khi kiểm tra và review đạt.** Issue chỉ chuyển sang **In review** khi PR của nó đã qua review và mọi kiểm tra.

::figure req-checks | Sau khi một kiểm tra lỗi được sửa, một model của nhà cung cấp khác review mã

Quản trị viên có thể thay đổi các nguyên tắc phân công, ví dụ thêm cách chia việc mà nhóm bạn ưa thích, hoặc khôi phục nguyên tắc có sẵn. Xem [Bật Agent](../setup/agents.md).

## Bao nhiêu issue chạy cùng lúc

- **Mỗi issue làm việc độc lập.** Mỗi issue có nhánh riêng, mặc định là `agent/<issue key>`, và thư mục làm việc riêng, nên các issue không cản trở nhau.
- **Trong một issue, mỗi lúc chỉ một bước được sửa mã.** Các bước không sửa mã, như review và tìm nguyên nhân CI lỗi, chạy trên một bản sao chỉ đọc riêng và có thể chạy song song với phát triển.
- **Nhiều máy hơn, nhiều issue cùng lúc hơn.** Mỗi runtime mặc định chạy ba phần việc cùng lúc, và bạn có thể điều chỉnh theo tài nguyên máy và hạn mức model. Issue khẩn cấp được nhận trước.
- **Issue có thứ tự thì chờ đến lượt.** Một issue phải chờ một issue chặn, hoặc chờ tất cả issue con, sẽ chưa bắt đầu cho đến khi chúng xong, sau đó tự chạy tiếp.
- **Công việc chạy suốt ngày đêm.** Runtime nào đang trực tuyến cũng nhận việc trong hàng đợi. Không ai phải túc trực.

::figure agent-queue | Hàng đợi Agent: mỗi Agent đang làm gì, việc gì tiếp theo, và đang chờ ai

Có hai loại runtime. Runtime dùng chung do quản trị viên kết nối và chạy issue của mọi người. Runtime cá nhân do chính thành viên kết nối và chỉ chạy việc do chủ của nó bắt đầu. Một Agent chỉ có trên runtime cá nhân thì chỉ làm việc cho chủ của runtime đó.

## Khi nào công việc đến tay con người

Agent điều phối chuyển issue cho người phụ trách trong những trường hợp sau, và mỗi trường hợp đều hiện trên cùng trong **My issues** của người phụ trách:

- **Cần con người quyết định.** Phải cân nhắc giữa các hướng làm, thiếu quyền hoặc khóa bí mật, hoặc một câu hỏi nghiệp vụ mà issue để ngỏ sẽ chuyển issue sang **Blocked**.
- **Công việc bị kẹt.** Không có Agent phù hợp nào trực tuyến, hoặc một bước vẫn lỗi sau khi đã đổi Agent. Issue chuyển sang **Blocked** kèm ghi chú về những gì cần để tiếp tục.
- **Sẵn sàng nghiệm thu.** PR đã qua review và các kiểm tra, issue chuyển sang **In review** kèm báo cáo bàn giao.

Agent điều phối không bao giờ đánh dấu issue là **Done** hay **Cancelled**, và không bao giờ merge PR. Con người nghiệm thu và merge.

## Khi có sự cố

| Chuyện gì xảy ra | Đội Agent xử lý thế nào |
| --- | --- |
| Một kiểm tra lỗi, hoặc PR bị xung đột | Agent điều phối được đánh thức để sắp xếp sửa. Nếu kiểm tra vẫn lỗi sau ba commit liên tiếp, người phụ trách issue được thông báo. |
| Cùng một bước lỗi hai lần | Bước đó được giao cho Agent phù hợp tiếp theo. Nếu vẫn lỗi, issue chuyển sang **Blocked**. |
| Một công cụ lập trình hết hạn mức | Bước đó được giao ngay cho một Agent phù hợp khác, ưu tiên của nhà cung cấp khác. |
| Một runtime mất kết nối | Công việc của nó quay lại hàng đợi để runtime khác nhận. |
| Công việc chờ hơn 24 giờ mà không runtime nào nhận | Lượt chạy thất bại và người phụ trách issue được thông báo, có thể chạy lại, giao cho người khác hoặc hủy. |
| Các Agent qua lại quá nhiều lần | Mặc định, bình luận của Agent có thể kích hoạt tối đa 20 lượt chạy cho mỗi issue trong 24 giờ. Vượt quá mức đó issue tạm dừng và người phụ trách được thông báo để quyết định có tiếp tục không. |

## Agent được làm gì và không được làm gì

- Agent làm việc thay mặt người đã bắt đầu công việc, và không bao giờ có nhiều quyền hơn người đó.
- Agent thực thi có thể commit và push lên nhánh của issue và mở PR. Chúng không thể viết lại lịch sử đã push, và nền tảng lưu trữ mã bảo vệ các nhánh được bảo vệ.
- Chỉ con người mới được merge PR, duyệt triển khai lên môi trường được bảo vệ, và quản lý thành viên.

Trong khi Agent làm việc, con người có thể can thiệp bất cứ lúc nào: bình luận trên issue để bổ sung yêu cầu, dừng một lượt chạy, hoặc tự nhận issue. Xem [Theo dõi tiến độ](../use/follow-progress.md).
