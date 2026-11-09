---
title: Một yêu cầu được hoàn thành thế nào
description: Theo chân một yêu cầu, chấm điểm và xếp hạng nhà cung cấp, từ ý tưởng đến phát hành. Xem đội Agent đẩy nó tiến lên ra sao, con người ra các quyết định then chốt ở đâu, và họ có bằng chứng gì khi quyết định.
---

Bộ phận mua hàng có một dự án Supplier Management (quản lý nhà cung cấp) trong Studio, và ứng dụng được xây trên NocoBase Core. Zhou Hang, trưởng bộ phận mua hàng, không viết mã. Lần này bộ phận muốn xếp hạng nhà cung cấp, nên Zhou Hang nêu yêu cầu sau:

> Chấm điểm nhà cung cấp theo tỷ lệ giao hàng đúng hạn, tỷ lệ đạt chất lượng và giá, rồi xếp vào các hạng A, B và C. Đơn đặt hàng với nhà cung cấp hạng C cần trưởng phòng mua hàng duyệt trước khi gửi đi.

<ol class="flow">
<li class="human"><div class="step"><div class="step-head"><strong>Nêu yêu cầu</strong><span class="who human">Zhou Hang</span><span class="who agent">Agent của tôi</span></div><p>Giải thích quy tắc xếp hạng bằng ngôn ngữ nghiệp vụ và trả lời câu hỏi của Agent. Agent viết thành một issue kèm các kịch bản nghiệm thu.</p></div></li>
<li class="agent"><div class="step"><div class="step-head"><strong>Phân công</strong><span class="who agent">Agent điều phối</span></div><p>Nhờ một Agent giỏi thiết kế viết kế hoạch trước, rồi giao phần phát triển cho một Agent giỏi xây dựng tính năng.</p></div></li>
<li class="human"><div class="step"><div class="step-head"><strong>Trả lời</strong><span class="who human">Zhou Hang</span></div><p>Kế hoạch phát hiện một quy tắc phê duyệt có sẵn, và Zhou Hang quyết định đơn nhỏ từ nhà cung cấp hạng C có cần duyệt không.</p></div></li>
<li class="agent"><div class="step"><div class="step-head"><strong>Xây dựng</strong><span class="who agent">Agent thực thi</span></div><p>Xây trên Core trong nhánh riêng của issue, viết test và mở PR.</p></div></li>
<li class="agent"><div class="step"><div class="step-head"><strong>Kiểm tra và review</strong><span class="who sys">CI của repository</span><span class="who agent">Agent thực thi</span></div><p>CI chạy các kiểm tra và test, sau đó một model của nhà cung cấp khác review mã.</p></div></li>
<li class="human"><div class="step"><div class="step-head"><strong>Nghiệm thu</strong><span class="who human">Zhou Hang</span></div><p>Đọc báo cáo bàn giao, tiêu chí nghiệm thu và ảnh chụp màn hình, dùng thử trong preview rồi merge.</p></div></li>
<li class="human"><div class="step"><div class="step-head"><strong>Phát hành</strong><span class="who human">Trưởng dự án</span></div><p>Sau khi merge, thay đổi lên staging. Production cần con người duyệt, và có thể rollback nếu có sự cố.</p></div></li>
<li class="agent"><div class="step"><div class="step-head"><strong>Ghi nhớ</strong><span class="who agent">Agent thực thi</span></div><p>Ghi những gì học được vào bộ nhớ dự án, để Agent đọc trước lần làm việc sau.</p></div></li>
</ol>

## Nêu yêu cầu

Zhou Hang mở **My sessions** và trao đổi với Agent của riêng mình. Agent trước hết xem module nhà cung cấp hiện có, rồi hỏi hai câu: mỗi tiêu chí trong ba tiêu chí chiếm bao nhiêu phần trong điểm, và nhà cung cấp mới chưa có lịch sử đơn hàng thì xếp hạng nào? Zhou Hang chốt cả hai ngay: giao hàng đúng hạn và tỷ lệ đạt mỗi tiêu chí 40%, giá 20%, còn nhà cung cấp mới bắt đầu ở hạng B và được xếp lại theo điểm sau ba tháng.

Agent viết các quy tắc này vào mô tả issue và các kịch bản nghiệm thu, rồi thêm issue vào dự án Supplier Management. Zhou Hang bấm **Start 1 issue**, và issue chuyển sang **In progress**.

::figure req-session | Zhou Hang trao đổi yêu cầu với Agent của mình, Agent tạo issue khi các quy tắc đã chốt

Zhou Hang là người phụ trách issue, và Agent điều phối là người thực hiện. Phiên trò chuyện giữ issue và tiến độ của nó, nên Zhou Hang có thể quay lại bất cứ lúc nào để hỏi tình hình.

Zhou Hang cũng có thể bỏ qua cuộc trò chuyện và bấm **New issue** để điền trực tiếp một issue. Xem [Nêu yêu cầu](../use/raise-a-request.md).

## Phân công

Agent điều phối đọc mô tả issue, quy định Purchase Approval Policy (chính sách phê duyệt mua hàng) trong cơ sở tri thức, và các Skill của dự án. Thay đổi này đụng đến cấu trúc dữ liệu và phê duyệt, nên thay vì đi thẳng vào phát triển, nó nhờ một Agent giỏi thiết kế viết một kế hoạch ngắn trước.

::figure req-dispatch | Agent điều phối giao một bước, nói rõ làm gì, đọc gì và khi nào xem là xong

Agent điều phối phân công theo thế mạnh của từng Agent và không tự viết mã. Mỗi lúc chỉ một bước được sửa mã, còn review và điều tra chạy song song ở chế độ chỉ đọc.

## Trả lời

Khi viết kế hoạch, Agent phát hiện Purchase Approval Policy đã có một quy tắc: đơn hàng trên ¥50.000 cần trưởng phòng mua hàng duyệt. Yêu cầu không nói đơn nhỏ từ nhà cung cấp hạng C có cần duyệt không, và đó là quyết định nghiệp vụ.

Agent điều phối chuyển issue sang **Blocked** và nêu rõ trong thẻ **Needs you** những gì Zhou Hang cần quyết định. Zhou Hang thấy nó trong mục **Waiting for you** ở **My issues** và bấm **Reply**: mọi đơn hàng với nhà cung cấp hạng C đều cần duyệt bất kể giá trị, còn các nhà cung cấp khác giữ quy tắc theo giá trị. Khi đã có câu trả lời, Agent điều phối giao phần phát triển cho một Agent giỏi xây dựng tính năng.

::figure req-blocked | Các quyết định cần con người được chuyển cho người phụ trách issue trong thẻ Needs you

## Xây dựng

Agent thực thi làm việc trên một runtime, trong thư mục làm việc riêng của issue, trên nhánh mặc định tên `agent/PUR-23`. Nó dùng nguyên các khối xây dựng về dữ liệu, phân quyền và phê duyệt của Core, chỉ xây phần chấm điểm và xếp hạng nhà cung cấp, và viết test cho các kịch bản nghiệm thu. Sau khi commit, nó mở PR, và Studio tự động liên kết PR với issue.

Đầu trang issue luôn cho thấy công việc đang ở đâu: Agent nào đang làm, đã bao lâu, trên máy nào, và việc gì tiếp theo.

::figure req-now | Đầu trang issue: ai đang làm và việc gì tiếp theo

## Kiểm tra và review

CI của repository chạy các kiểm tra lint, kiểu, test và build. Khi một kiểm tra lỗi, Studio đánh thức Agent điều phối để sắp xếp sửa. Nếu kiểm tra vẫn lỗi sau ba lần sửa liên tiếp, người phụ trách issue được thông báo.

Khi các kiểm tra đạt, Agent điều phối nhờ một Agent của nhà cung cấp khác review mã. Nếu không có Agent nào như vậy trực tuyến, nó dùng một model khác của cùng nhà cung cấp. Model đã viết mã không bao giờ tự review mã của mình.

::figure req-checks | Sau khi một kiểm tra lỗi được sửa, một model của nhà cung cấp khác review mã

## Nghiệm thu

Khi PR đã qua kiểm tra và review, Agent điều phối chuyển issue sang **In review** và đính kèm báo cáo bàn giao: trước đây thế nào, hướng làm đã thống nhất, những gì thay đổi, đã kiểm tra ra sao, các vấn đề còn mở kèm đề xuất, và cuối cùng là tiêu chí nghiệm thu. Agent xây dựng đã đính kèm một ảnh chụp màn hình cho mỗi kịch bản nghiệm thu.

::figure req-accept | Khi nghiệm thu, bạn đọc báo cáo bàn giao, tiêu chí nghiệm thu và ảnh chụp màn hình

CI của dự án này triển khai một preview cho mỗi PR. Zhou Hang mở preview từ trang issue, đăng nhập bằng tài khoản quản trị đầu tiên, đặt một đơn ¥10.000 với nhà cung cấp hạng C, và xác nhận đơn được chuyển cho trưởng phòng mua hàng duyệt.

::figure req-preview | Preview của PR, nơi bạn tự dùng thử thay đổi

Mọi thứ đúng như mong đợi, nên Zhou Hang bấm **Merge**, và issue chuyển sang **Done**. Nếu có gì chưa ổn, Zhou Hang sẽ bấm **Send back for changes** và nói lý do, rồi Agent điều phối sắp xếp sửa và bàn giao lại.

## Phát hành

Sau khi merge, CI của repository triển khai thay đổi lên staging, và issue cho biết thay đổi đã đến những môi trường nào.

Production được bảo vệ. Khi phát hành phiên bản mới, một yêu cầu triển khai đến hộp thư của người duyệt, kèm phiên bản cần triển khai, commit tạo ra nó và log CI. Trong dự án này người duyệt là trưởng dự án, và phiên bản chỉ lên production sau khi được duyệt. Nếu có sự cố, bạn có thể rollback về phiên bản trước.

Các issue đã xong nhưng chưa phát hành được liệt kê trong mục **Merged, not released** của dự án.

> [!NOTE] Preview và triển khai cần CI
> PR chỉ có preview, và các lần merge, phát hành chỉ được triển khai lên từng môi trường, sau khi CI của repository đã kết nối với Studio. Xem [Kết nối CI](../setup/ci.md).

## Ghi nhớ

Issue giữ lại phần thảo luận, các quyết định, mã, test và mọi lượt chạy, còn mã nằm trong repository. Agent thực thi cũng ghi những gì học được vào bộ nhớ dự án, như quy tắc Zhou Hang đã xác nhận: mọi đơn hàng với nhà cung cấp hạng C đều cần trưởng phòng mua hàng duyệt, bất kể giá trị. Bộ nhớ dự án nằm trong repository và được review, merge cùng PR.

Lần sau khi Zhou Hang muốn điều chỉnh điều khoản thanh toán theo hạng, Agent đọc bộ nhớ dự án trước khi bắt đầu và dựa trên cơ sở tri thức cùng các test hiện có. Zhou Hang không phải giải thích lại bối cảnh, và nếu người khác tiếp quản, hay một Agent khác làm việc, họ có thể tiếp tục từ chỗ người trước dừng lại.

## Zhou Hang đã làm gì

Zhou Hang nói rõ cần gì bằng ngôn ngữ nghiệp vụ, chốt quy tắc chấm điểm với Agent của mình, trả lời một câu hỏi trước khi phát triển, dùng thử thay đổi trong preview, rồi merge. Đội Agent viết kế hoạch, mã và test, và lo phần sửa lỗi lẫn review. Trong khi Agent làm việc, Zhou Hang có thể bổ sung yêu cầu bất cứ lúc nào bằng cách bình luận trên issue. Xem [Theo dõi tiến độ](../use/follow-progress.md).
