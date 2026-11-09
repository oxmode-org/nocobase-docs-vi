---
title: Quy tắc thực thi của agent
---

<a id="the-agent-team"></a>

## Nhóm agent

| Vai trò | Nguồn | Trách nhiệm |
| --- | --- | --- |
| Agent điều phối | Tích hợp trong Studio, dùng chung cho nhóm | Phân công từng bước, đọc kết quả và quyết định bước tiếp theo. Hỏi người phụ trách hoặc gửi công việc đi nghiệm thu. Việc viết mã thuộc về agent thực thi, còn hợp nhất PR thuộc về con người |
| Agent thực thi | Công cụ lập trình đã cài và đăng nhập trong môi trường chạy | Thiết kế, phát triển, kiểm thử, rà soát hoặc điều tra lỗi CI. Báo kết quả và để agent điều phối quản lý trạng thái, phân công lại |

Mỗi cặp công cụ và mô hình là một agent thực thi. Quản trị viên mô tả thế mạnh trong **Good at**, chẳng hạn thiết kế hoặc rà soát mã. Agent điều phối dựa vào mô tả này để đánh giá năng lực. Xem [Cấu hình agent](../setup/agents.md).

Agent điều phối cũng cần mô hình. Quản trị viên chọn mô hình chính và dự phòng. Nếu lựa chọn chính không thể bắt đầu trong hai phút, lựa chọn dự phòng tiếp quản.

![Thế mạnh, môi trường chạy khả dụng và mô hình chính, dự phòng của agent điều phối](https://static-docs.nocobase.com/studio-en-agent-team-20261030.png)

**Where it runs** liệt kê môi trường chạy khả dụng của từng agent. Quản trị viên kết nối môi trường dùng chung cho nhóm. Môi trường cá nhân chỉ phục vụ chủ sở hữu. Agent chỉ có trên môi trường đó cũng chỉ phục vụ thành viên này. Xem [Agent và môi trường chạy](concepts.md#agents-and-runtimes).

Thành viên có thể thảo luận yêu cầu trong **My sessions** trước khi tạo đầu việc. Xem [Phiên làm việc của tôi](../use/sessions.md).

<a id="work-assignment"></a>

## Phân công công việc

Khi đầu việc bắt đầu, agent điều phối giao bước đầu tiên. Agent này đánh giá lại tiến độ khi agent thực thi phản hồi, thành viên bình luận hoặc kết quả kiểm tra PR thay đổi.

Thiết kế, phát triển, kiểm thử và xử lý sự cố được giao cho agent phù hợp. Ưu tiên mô hình từ nhà cung cấp khác để rà soát. Nếu không có lựa chọn như vậy đang trực tuyến, một mô hình khác của cùng nhà cung cấp có thể rà soát. Dùng mô hình khác với mô hình đã viết mã.

Mỗi lần bàn giao xuất hiện trong bình luận của đầu việc, ghi agent được giao, mục tiêu, tài liệu tham chiếu, tiêu chí hoàn tất và lý do phân công. Agent điều phối đọc phản hồi để chuyển đầu việc sang bước tiếp theo.

![Bàn giao bước thiết kế kèm tài liệu nghiệp vụ và yêu cầu kiểm chứng](https://static-docs.nocobase.com/studio-en-req-dispatch-20261030.png)

Quản trị viên có thể điều chỉnh hoặc khôi phục quy tắc phân công mặc định trong [Cài đặt agent](../setup/agents.md).

<a id="task-workflow"></a>

## Quy trình đầu việc

Skill quy định cách thực hiện và điều kiện hoàn tất của mỗi giai đoạn. Agent điều phối lập các bước theo các yêu cầu này. Agent thực thi làm theo các bước đã giao.

| Giai đoạn | Cách thực hiện | Skill tích hợp |
| --- | --- | --- |
| Thiết kế | Viết kế hoạch ngắn cho thay đổi liên quan đến nhiều mô-đun, migration, xử lý đồng thời, phân quyền hoặc khi chưa rõ cách làm. Thay đổi đã rõ có thể vào thẳng bước phát triển | `studio-workflow`, `studio-approach` |
| Phát triển và kiểm chứng | Triển khai theo kế hoạch đã thống nhất và kiểm tra kết quả. Nếu cần làm ngoài kế hoạch, thống nhất với agent điều phối trước | `studio-development` |
| Kiểm tra và rà soát | Chạy các bước kiểm tra và yêu cầu rà soát độc lập. Chuyển lỗi cần sửa lại cho bên phát triển rồi rà soát lần nữa | `studio-development`, `studio-review` |
| Bàn giao để nghiệm thu | Khi kiểm tra và rà soát đều đạt, chuẩn bị báo cáo rồi gửi cho người phụ trách | `studio-workflow`, `studio-comment-style` |

![Codex sửa lỗi kiểm tra và Claude hoàn tất rà soát độc lập](https://static-docs.nocobase.com/studio-en-review-thread-20261030.png)

Khi cần quyết định, agent điều phối đặt đầu việc ở **Blocked** và giải thích câu hỏi. Khi sẵn sàng bàn giao, agent điều phối đặt đầu việc ở **In review** và đính kèm báo cáo. Việc đổi trạng thái thuộc về agent điều phối ở các bước này.

Nhóm có thể sửa Skill tích hợp hoặc thêm Skill riêng. Skill có thể áp dụng toàn cục, theo dự án hoặc kho mã. Xem [Skill](../project/skills.md).

<a id="parallel-tasks"></a>

## Đầu việc song song

Môi trường chạy tiếp nhận công việc đang xếp hàng. Nhiều đầu việc có thể tiến hành cùng lúc, mỗi đầu việc có nhánh và thư mục làm việc riêng.

| Cơ chế | Hành vi |
| --- | --- |
| Cô lập đầu việc | Thay đổi nằm trong thư mục làm việc riêng. Tên nhánh mặc định là `agent/<task-identifier>` |
| Xử lý đồng thời trong một đầu việc | Mỗi lúc chỉ một bước ghi mã. Bước chỉ đọc như rà soát và điều tra CI dùng bản sao riêng, có thể chạy cùng lúc với phát triển |
| Năng lực | Mặc định mỗi môi trường chạy ba công việc đồng thời. Điều chỉnh theo tài nguyên và hạn mức mô hình hoặc thêm môi trường chạy. Đầu việc khẩn được ưu tiên |
| Phụ thuộc | Đầu việc chờ các đầu việc tiền nhiệm hoặc đầu việc con bắt buộc, rồi tự tiếp tục |
| Thực thi liên tục | Môi trường trực tuyến tiếp tục nhận công việc đang xếp hàng mà không cần người giám sát |

![Hàng đợi agent hiển thị công việc đang chạy và năng lực còn trống](https://static-docs.nocobase.com/studio-en-agent-queue-20261030.png)

<a id="human-involvement"></a>

## Khi cần con người tham gia

Những mục sau xuất hiện đầu tiên trong **My issues** của người phụ trách:

| Tình huống | Trạng thái | Việc người phụ trách cần làm |
| --- | --- | --- |
| Cần xác nhận quy tắc hoặc lựa chọn nghiệp vụ, hoặc còn thiếu quyền truy cập | Blocked | Trả lời câu hỏi hoặc cung cấp thông tin hay quyền cần thiết |
| Agent phù hợp đang ngoại tuyến hoặc một bước vẫn lỗi sau khi giao lại | Blocked | Gỡ trở ngại hoặc điều chỉnh phân công |
| Kiểm tra và rà soát PR đã đạt | In review | Đọc báo cáo bàn giao rồi nghiệm thu |

Người dùng chịu trách nhiệm nghiệm thu, hợp nhất PR và chuyển đầu việc sang **Done** hoặc **Canceled**.

- Agent làm việc thay mặt người yêu cầu trong phạm vi quyền của người đó.
- Agent thực thi có thể commit, đẩy và mở PR trên nhánh đầu việc. Giữ nguyên lịch sử đã đẩy. Nền tảng mã nguồn kiểm soát các nhánh được bảo vệ.
- Chỉ con người được hợp nhất PR, phê duyệt triển khai vào môi trường được bảo vệ và quản lý thành viên.

Thành viên có thể bổ sung yêu cầu, dừng lượt chạy hoặc tiếp quản đầu việc bất cứ lúc nào. Xem [Theo dõi tiến độ](../use/follow-progress.md).

<a id="failure-handling"></a>

## Xử lý lỗi

| Tình huống | Cách xử lý |
| --- | --- |
| Kiểm tra thất bại hoặc PR xung đột | Giao sửa lỗi. Báo người phụ trách sau ba commit liên tiếp không đạt |
| Cùng một bước lỗi hai lần | Thử agent phù hợp khác. Nếu vẫn lỗi, chuyển đầu việc sang Blocked |
| Công cụ lập trình hết hạn mức | Đổi agent ngay, ưu tiên nhà cung cấp khác |
| Môi trường chạy chuyển sang ngoại tuyến | Trả công việc về hàng đợi để môi trường khác tiếp nhận |
| Công việc chưa được nhận sau 24 giờ | Đánh dấu lượt chạy thất bại và báo người phụ trách để thử lại, giao lại hoặc hủy |
| Các agent liên tục chuyển việc qua lại | Mặc định, mỗi đầu việc cho tối đa 20 lượt chạy do bình luận của agent kích hoạt trong 24 giờ. Khi chạm giới hạn, tạm dừng và hỏi người phụ trách có tiếp tục không |
