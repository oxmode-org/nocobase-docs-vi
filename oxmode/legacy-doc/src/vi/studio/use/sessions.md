---
title: My sessions
description: My issues theo dõi công việc theo từng issue, còn My sessions theo dõi theo từng phiên. Một phiên bắt đầu như một cuộc trò chuyện, trong đó bạn và Agent làm rõ một việc, và Agent biến nó thành các issue cho đội Agent. Phiên giữ các issue đó cùng tiến độ của chúng, để bạn quay lại hỏi tình hình.
---

::figure sessions-list | My sessions: thanh dưới mỗi phiên có một đoạn cho mỗi issue, tô màu theo trạng thái

Mỗi phiên trong danh sách hiển thị dự án của nó và số issue. Mỗi đoạn của thanh là một issue: xanh lá là đã xong, tím là đang nghiệm thu, xanh dương là đang làm, vàng cam là bị chặn, và xám là backlog. Các phiên có issue đang chờ bạn được đánh dấu.

Chỉ bạn thấy được các phiên của mình. Agent trong phiên thao tác trong Studio bằng danh tính và quyền của bạn, ví dụ khi nó tạo issue hoặc đăng bình luận, và không làm được gì mà bạn không làm được.

## Bạn trò chuyện với ai

Bảng phiên có hai chế độ:

| | My sessions | Runner Agent |
| --- | --- | --- |
| Ai | Agent của riêng bạn, như Claude Code hoặc Codex | Một Agent trong đội Agent, chạy trên một runtime |
| Thấy được gì | Mã, công cụ và cấu hình trong các thư mục bạn cho phép | Các repository trên runtime |
| Thiết lập | [Kết nối máy tính của bạn](../join/connect-computer.md), một lần | Không cần |
| Phù hợp cho | Thảo luận yêu cầu bên cạnh mã nguồn bạn có và biến nó thành issue | Đặt câu hỏi, tra cứu và biến yêu cầu thành issue |

Phiên ở cả hai chế độ đều được liệt kê trong **My sessions**.

## Bắt đầu một phiên

1. Trong **My sessions**, bấm **New session**.
2. Chọn chế độ. Với **My sessions**, chọn Agent của bạn và một thư mục làm việc. Với **Runner Agent**, chọn một Agent trong đội. Ở chế độ nào bạn cũng có thể đặt dự án mà phiên thuộc về.
3. Nói điều bạn muốn làm. Bạn có thể nêu nhiều việc cùng lúc và dán ảnh chụp màn hình.

Khi thảo luận yêu cầu, hãy chọn model mạnh nhất để yêu cầu được hiểu đúng.

Trên trang issue hoặc trang dự án, bấm **Ask agent** để mở một phiên với trang hiện tại làm bối cảnh.

## Biến cuộc thảo luận thành issue

Khi mọi thứ đã rõ, hãy nhờ Agent biến cuộc thảo luận thành issue, ví dụ "Tạo issue cho ba việc này trong dự án Supplier Management."

::figure req-session | Phiên liệt kê các issue nó đã tạo, sẵn sàng để bắt đầu

- Issue tạo trong một phiên luôn gắn với phiên đó, và phiên hiển thị trạng thái cùng tiến độ mới nhất của chúng.
- Bấm **Start** để giao cho đội Agent, hoặc **Not now** để để chúng trong **Backlog**.
- Nhắc đến một issue có sẵn bằng `#` trong ô nhập để Agent đọc, bình luận hoặc thay đổi nó theo yêu cầu của bạn.
- Từ trang issue, bạn cũng có thể quay lại phiên đã tạo ra nó.

## Theo dõi các phiên

- Lọc danh sách phiên theo **Needs you** hoặc **In progress**. Một phiên được đánh dấu khi Agent xin quyền hoặc chờ bạn xác nhận.
- Khi các issue từ một phiên đạt một mốc với đội Agent, như một lượt chạy kết thúc, issue bị chặn, sẵn sàng review, thất bại hay đóng, hoặc một PR được mở, một thẻ sẽ quay lại phiên, và Agent tóm tắt rồi gợi ý bước tiếp theo.
- Lưu trữ các phiên không còn cần, và khôi phục bất cứ lúc nào.
