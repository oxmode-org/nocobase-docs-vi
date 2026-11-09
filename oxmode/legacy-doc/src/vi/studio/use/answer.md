---
title: Trả lời câu hỏi của Agent
nav: Trả lời câu hỏi
description: Khi cần con người quyết định, Agent điều phối nêu rõ bạn cần quyết định gì. Bạn trả lời câu hỏi, xử lý lượt chạy thất bại và nhận các issue được chuyển cho mình, tất cả trên trang issue.
---

Khi đội Agent gặp điều chỉ con người mới quyết định được, nó dừng lại, tìm đến người phụ trách issue và nói chính xác bạn cần quyết định hay cung cấp gì. Khi bạn trả lời, nó tiếp tục.

## Khi nào Agent tìm đến bạn

| Tình huống | Bạn thấy gì | Bạn làm gì |
| --- | --- | --- |
| Cần bạn quyết định | Issue chuyển sang **Blocked** và được gắn nhãn **Needs your reply** trong **My issues** | Trả lời câu hỏi |
| Một lượt chạy vẫn thất bại sau khi thử lại | Một thẻ quyết định cho lượt chạy thất bại xuất hiện trên issue, gắn nhãn **Run failed** | Thử lại, giao cho người, hoặc không thử lại |
| Số lượt chạy do các Agent kích hoạt cho nhau chạm giới hạn | Trang issue hiển thị **Continue (comment-triggered runs reached their limit)** | Xác nhận để tiếp tục |
| Ai đó chuyển issue cho bạn | Được gắn nhãn **Needs you to take over** trong **My issues** | Nhận hoặc từ chối |
| Ai đó xin tiếp tục trên runtime cá nhân của bạn | Một yêu cầu trên trang issue | Xác nhận hoặc từ chối |

Bạn xử lý tất cả những việc này trên trang issue, và chúng được gom trong **Waiting for you** ở **My issues**.

## Trả lời câu hỏi trên issue bị chặn

Khi Agent điều phối gặp điều cần con người phán đoán, nó chuyển issue sang **Blocked** và nêu rõ bạn cần quyết định hay cung cấp gì trong thẻ **Needs you** ở đầu trang issue. Các trường hợp thường gặp:

- Có nhiều hướng làm, mỗi hướng có ưu nhược điểm riêng.
- Yêu cầu không đề cập một quy tắc nghiệp vụ, ví dụ kế hoạch hóa ra mâu thuẫn với một quy tắc phê duyệt có sẵn.
- Thiếu quyền, khóa bí mật hoặc tài liệu.
- Dự án chưa có CI, nên PR không có kết quả kiểm tra, và nó hỏi nên thiết lập CI trước hay đi thẳng đến nghiệm thu.

1. Mở issue và đọc thẻ **Needs you**. Muốn xem bối cảnh, bấm **View the coordinator agent’s latest explanation** để đọc đầy đủ.
2. Bấm **Reply**. Ô trả lời mở ra bên dưới phần giải thích của Agent điều phối.
3. Viết quyết định của bạn và gửi đi.

Câu trả lời của bạn đánh thức Agent điều phối, và nó tiếp tục dựa trên câu trả lời đó.

::figure req-blocked | Một issue bị chặn: đọc câu hỏi, bấm Reply và viết quyết định của bạn

> [!TIP] Câu trả lời giúp công việc chạy tiếp
> Hãy nêu quyết định trước, rồi một câu lý do, ví dụ: "Mọi đơn hàng với nhà cung cấp hạng C đều cần duyệt bất kể giá trị. Các nhà cung cấp khác giữ quy tắc theo giá trị. Nhà cung cấp hạng C có rủi ro giao hàng, nên cả đơn nhỏ cũng cần kiểm tra." Nếu chưa chắc, hãy nhờ nó đưa ra vài phương án và hệ quả của từng phương án.

## Lượt chạy thất bại

Lượt chạy của Agent có thể thất bại vì runtime mất kết nối, công cụ lập trình hết hạn mức, mạng bị ngắt, v.v. Các lỗi có thể thử lại sẽ được tự động thử lại. Khi hết số lần thử, người phụ trách nhận một thẻ **Run failed: what next?**:

::figure failed-run | Thẻ quyết định cho một lượt chạy thất bại

- **Retry**: để Agent thử lại. Phù hợp với sự cố tạm thời, như runtime vừa trực tuyến trở lại.
- **Give to a person**: đặt một thành viên làm người thực hiện để con người làm.
- **Don't retry**: bỏ lượt chạy này.

Bản ghi lượt chạy cho biết lý do thất bại. Agent điều phối cũng có thể tự chuyển một bước thất bại sang Agent phù hợp khác. Nếu cùng một bước thất bại hai lần, nó chuyển issue sang **Blocked** để hỏi bạn.

## Chạm giới hạn lượt chạy từ bình luận

Để các Agent không kích hoạt nhau qua lại mãi, bình luận từ Agent chỉ được kích hoạt một số lượt chạy nhất định cho mỗi issue trong 24 giờ, mặc định là 20, quản trị viên có thể điều chỉnh. Sau đó, bình luận của Agent không còn bắt đầu lượt chạy mới, và người phụ trách được thông báo.

Khi đã chắc issue thật sự cần tiếp tục, bấm **Continue (comment-triggered runs reached their limit)** trên trang issue. Việc bạn tự đăng một bình luận đánh thức Agent cũng đặt lại bộ đếm.

> [!NOTE] Chạm giới hạn thường là một dấu hiệu
> Hãy xem hoạt động và các lượt chạy trước. Có Agent nào đang sửa đi sửa lại cùng một vấn đề không? Nếu có, làm rõ yêu cầu hoặc điều chỉnh issue sẽ hiệu quả hơn là chỉ đơn giản cho tiếp tục.

## Nhận issue được chuyển cho bạn

Khi ai đó chuyển quyền phụ trách một issue cho bạn, nó xuất hiện dưới nhãn **Needs you to take over**. Cho đến khi bạn nhận, công việc của Agent bị tạm dừng, và mọi thứ đang chờ người phụ trách quyết định cũng chờ bạn.

- Mở issue và bấm **Take over the issue**. Bạn trở thành người phụ trách và có thể tiếp tục trả lời câu hỏi, nghiệm thu kết quả.
- Bạn cũng có thể từ chối. Issue quay về người phụ trách trước. Nếu tài khoản của người phụ trách trước đã bị vô hiệu hóa, issue vẫn ở lại với bạn và tiếp tục tạm dừng.

## Yêu cầu dùng runtime cá nhân của bạn

Runtime cá nhân chỉ chạy công việc do chủ của nó bắt đầu. Khi người khác bình luận trên issue bạn phụ trách và phần việc tiếp theo cần runtime cá nhân của bạn, trang issue hiển thị "{name} requests to continue on your personal runner", và bạn có thể **Confirm** hoặc **Reject**. Công việc chỉ chạy trên runtime cá nhân của bạn sau khi bạn xác nhận.
