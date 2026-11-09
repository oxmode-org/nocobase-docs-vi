---
title: Bật Agent
description: Khi runtime đã báo cáo các công cụ lập trình và model, hãy kiểm tra thế mạnh của từng Agent, bật những Agent bạn cần, và chọn lựa chọn chính cùng lựa chọn dự phòng cho Agent điều phối.
---

Runtime báo cáo các công cụ lập trình và model đã cài và đăng nhập trên đó, và mỗi cặp công cụ lập trình với model là một Agent, như Claude · Opus 5.5 hoặc Codex · GPT-6.1 Sol. Khi được bật, Agent tham gia đội Agent. Agent điều phối giao việc theo phần **Good at** (thế mạnh) của từng Agent, nên mô tả này được viết tốt đến đâu quyết định việc phân công tốt đến đó.

Bật Agent và thiết lập Agent điều phối cần quyền quản lý Agent, thường là quản trị viên.

## Kiểm tra các Agent được bật tự động

Mở **Agent management › Agents**. Khi một runtime báo cáo, các cặp công cụ lập trình với model phổ biến được thêm vào danh sách và tự động bật, kèm sẵn một mô tả **Good at** gợi ý.

Xem qua từng mô tả **Good at** và chỉnh lại cho đúng cách nhóm thực sự dùng Agent đó: bấm **Edit**, sửa và lưu. Nói rõ nó phù hợp với việc gì và không phù hợp với việc gì, ví dụ:

| Agent | Good at (ví dụ) |
| --- | --- |
| Claude · Opus 5.5 | Thiết kế hướng làm, điều tra vấn đề khó và review mã |
| Codex · GPT-6.1 Sol | Phát triển tính năng thông thường, thay đổi nhiều module và refactor |
| Codex · GPT-6 Luna | Thay đổi nhỏ, bổ sung test và tìm nguyên nhân CI lỗi. Nhanh và rẻ |

**Edit** cũng cho phép đặt mức độ suy luận (reasoning effort). Agent điều phối không thể đổi mức này khi giao việc, nên hãy đặt theo loại việc mà Agent này thường làm.

::figure qs-agents | Danh sách Agent: thế mạnh của từng Agent và chúng chạy trên runtime nào

## Thêm model khác

Các model không có trong danh sách phổ biến phải thêm thủ công:

1. Bấm **Add agent**. **Available models** liệt kê mọi model mà các runtime đã báo cáo, nhóm theo công cụ lập trình. Model trong danh sách phổ biến được đánh dấu **Enabled automatically when reported**, còn những model bạn đã thêm được đánh dấu **Added**.
2. Chọn các model bạn muốn và viết thế mạnh của từng model.
3. Bấm **Add**. Chúng được bật ngay.

Nếu một model hiển thị **Needs setup** hoặc **Version too low**, hãy thiết lập hoặc nâng cấp công cụ lập trình đó trên runtime theo gợi ý, rồi phát hiện lại.

Một Agent chỉ có trên runtime cá nhân được đánh dấu **Personal runners only**. Agent điều phối chỉ giao việc cho nó trong các issue do chủ của runtime đó bắt đầu.

Hãy bật Agent của ít nhất hai nhà cung cấp. Khi review, Agent điều phối giao mã cho một Agent của nhà cung cấp khác. Nếu chỉ có một nhà cung cấp, nó dùng một model khác của cùng nhà cung cấp.

## Thiết lập Agent điều phối

Agent điều phối có sẵn trong Studio. Chỉ có một, và nó sắp xếp issue của mọi dự án. Nó cần một Agent đã bật để chạy. Phía trên danh sách Agent, bấm **Settings** trong phần Agent điều phối:

1. Ở **First choice**, chọn một Agent giỏi suy luận, như Claude · Opus 5.5.
2. Chọn một Agent khác làm **Fallback** (dự phòng). Nếu lựa chọn chính chờ trong hàng đợi lâu hơn **Fallback delay** (mặc định 120 giây), một Agent dự phòng đang rảnh sẽ thay thế. Nếu không runtime nào chạy được lựa chọn chính, Agent dự phòng được dùng ngay.
3. Lưu.

::figure qs-coordinator | Cài đặt của Agent điều phối

Tạm thời để các cài đặt khác ở mặc định:

| Cài đặt | Mặc định | Tác dụng |
| --- | --- | --- |
| Allocation principles | Có sẵn | Cách Agent điều phối giao việc và đẩy công việc tiến lên. Bạn có thể sửa hoặc bấm **Restore built-in**. Xem [Cách đội Agent làm việc](../intro/agent-team.md) |
| Comment run limit | 20 lượt cho mỗi issue trong 24 giờ | Số lượt chạy các Agent có thể kích hoạt cho nhau. Vượt giới hạn, issue tạm dừng và người phụ trách được thông báo |
| Delegated step queue timeout | 600 giây | Khi không runtime nào nhận một bước Agent điều phối đã giao, bước đó bị rút lại và Agent điều phối sắp xếp lại |

**Xong khi**: danh sách Agent có ít nhất hai Agent đã bật, **Where it runs** hiển thị runtime của bạn, và phần Agent điều phối có lựa chọn chính cùng lựa chọn dự phòng.

Tiếp theo, [tạo dự án](new-project.md).

## Tắt Agent

- Để ngừng dùng một Agent, tắt **Enabled** trong **Edit**. Agent đã tắt mặc định bị ẩn. Chọn **Show disabled** để xem, và bật lại khi cần.
- Nếu không runtime nào báo cáo một Agent trong 14 ngày, nó hiển thị là không có runtime, và Agent điều phối ngừng giao việc cho nó.
