---
title: Theo dõi tiến độ
description: Đọc trang issue để biết ai đang làm và việc gì tiếp theo, bổ sung yêu cầu bằng bình luận, và tự nhận issue khi cần.
---

Trong khi đội Agent làm một issue, bạn không cần túc trực hay hỏi liên tục. Mở trang issue để xem nó đang ở đâu và việc gì tiếp theo, và khi có điều cần bổ sung, hãy nói ngay trên issue.

## Trang issue

Trang issue trông như nhau dù bạn mở từ danh sách, bảng hay một đường dẫn.

::figure req-now | Tóm tắt issue: Now, Up next, thuộc tính và các PR liên kết

**Dòng trên cùng** hiển thị vị trí của issue trong danh sách, key của nó (bấm để sao chép đường dẫn) và dự án. Bên phải là trạng thái, ngôi sao theo dõi, **Ask agent** và các thao tác khác.

**Phần tóm tắt**:

- **Now**: Studio ghi điều mà issue thực sự đang chờ, ví dụ "Codex · GPT-6.1 Sol working · 8 min · server-01", "Waiting for a runtime", "Waiting for the PR's checks" hoặc "Waiting for Zhou Hang to accept". Studio tạo dòng này từ dữ kiện thực tế, không phải từ những gì người hay Agent viết.
- **Up next**: bước tiếp theo mà Agent điều phối đã lên kế hoạch.
- **Needs you**: xuất hiện khi issue bị chặn hoặc đang nghiệm thu và chờ bạn quyết định. Nó cho biết bạn cần làm gì, kèm các nút để làm ngay tại đó. Xem [Trả lời câu hỏi của Agent](answer.md) và [Nghiệm thu kết quả](accept.md).
- **Delivery report**: báo cáo bàn giao do Agent điều phối nộp khi bàn giao công việc để nghiệm thu, được giữ cho đến khi lần bàn giao sau thay thế.

**Thuộc tính**: độ ưu tiên, người phụ trách và người thực hiện, cùng nhãn, dự án, ngày bắt đầu và hạn chót, thông báo và nhiều thứ khác trong **More properties**.

**Các tab**:

| Tab | Có gì trong đó |
| --- | --- |
| Activity | Bình luận, các lần giao việc và thay đổi trạng thái. Mặc định hiển thị **Conversation only**. Chuyển sang **All** để xem cả các bản ghi hệ thống. |
| Description | Mô tả issue. |
| Sub-issues | Các issue con và trạng thái của chúng. |
| Code and deployments | Các PR liên kết, kết quả kiểm tra và thay đổi. |
| Runs | Mọi lượt chạy Agent đã thực hiện trên issue này. |

## Trao đổi với Agent bằng bình luận

Viết vào ô ở cuối issue. Có hai loại mục:

- **Comment**: mọi người đều thấy. Nó đánh thức các Agent bạn nhắc đến, Agent có bình luận mà bạn trả lời, và người thực hiện issue, thường là Agent điều phối. Nếu lúc đó có Agent đang chạy, bình luận được chuyển thẳng đến nó.
- **Note**: ghi chú chỉ dành cho con người. Không đánh thức Agent nào.

::figure composer | Comment đánh thức Agent, Note chỉ dành cho con người

Một vài cách dùng thường gặp:

- Bổ sung hoặc thay đổi yêu cầu: chỉ cần viết một bình luận, Agent điều phối sẽ điều chỉnh kế hoạch.
- Hỏi một Agent cụ thể một câu cụ thể: nhắc đến nó trong bình luận. Nó chỉ trả lời điều bạn hỏi và không đổi trạng thái issue.
- Trả lời một bình luận: trả lời ngay dưới bình luận đó để cuộc thảo luận nằm trong một luồng.

## Ask agent

**Ask agent** ở góc trên bên phải trang issue mở bảng Agent và bắt đầu một phiên về issue này. Phù hợp cho những câu hỏi như "Issue này đang kẹt ở đâu?" hay "PR này thay đổi gì?" Agent trong phiên làm việc bằng danh tính và quyền của bạn và chỉ làm điều bạn yêu cầu. Xem [My sessions](sessions.md).

## Các lượt chạy

Tab **Runs** liệt kê mọi lượt chạy trên issue: Agent nào, trên runtime nào, lần thử thứ mấy, kết quả và mức sử dụng.

::figure runs | Runs: xem transcript và prompt, hoặc dừng một lượt chạy đang diễn ra

- **View transcript**: bản ghi đầy đủ những gì Agent đã làm trong lượt chạy này.
- **View full prompt**: mọi thứ Agent nhận được lần này, giúp bạn hiểu vì sao nó làm như vậy.
- **Stop**: dừng một lượt chạy đang diễn ra và giữ các thay đổi đã thực hiện. Issue chuyển sang **Blocked**, và công việc của Agent tạm dừng cho đến khi bạn nói trong bình luận cách tiếp tục.
- **Retry**: đưa một lượt chạy thất bại vào hàng đợi lại.

## Tự nhận issue

Để tự làm, hãy đặt mình làm người thực hiện. Công việc của Agent đang trong hàng đợi bị rút lại, và các lượt chạy đang diễn ra được yêu cầu dừng. Muốn giao lại cho đội Agent sau này, bấm **Hand over to the coordinator agent to start**.

## Xem toàn bộ dự án

Để xem tổng thể dự án đang thế nào, có gì đang kẹt và tốn bao nhiêu, đọc [Tiến độ dự án](../project/progress.md) và [Khối lượng việc của Agent và mức dùng model](../project/usage.md).
