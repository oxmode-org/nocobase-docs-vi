---
title: My issues
description: Bắt đầu mỗi ngày trong My issues. Các issue liên quan đến bạn, từ mọi dự án, được gom vào một danh sách, những issue đang chờ bạn quyết định nằm trên cùng.
---

Bạn không cần đi từng dự án, hay từng terminal, để biết công việc đang thế nào. Các issue liên quan đến bạn ở mọi dự án được gom vào **My issues**. Khi một Agent cần bạn trả lời câu hỏi, nghiệm thu kết quả hoặc xử lý một lượt chạy thất bại, issue sẽ lên trên cùng. Để theo dõi công việc theo từng phiên, xem [My sessions](sessions.md).

## Những issue nào xuất hiện ở đây

**My issues** liệt kê các issue bạn phụ trách và các issue bạn tự làm, mỗi issue chỉ một lần. Các issue bạn theo dõi cũng xuất hiện ở đây, dù ai phụ trách.

Con số cạnh **My issues** ở thanh bên là số việc đang chờ bạn lúc này, bao gồm cả các xác nhận đang chờ trong phiên và các quyết định nằm ngoài issue.

::figure my-tasks-list | My issues được nhóm theo việc đang đến lượt ai, và mỗi dòng cho biết bạn cần làm gì

## Nhóm theo việc đến lượt ai

Từ trên xuống:

| Nhóm | Có gì trong đó |
| --- | --- |
| Following | Các issue bạn theo dõi, ở trên cùng, kèm số cập nhật mới từ người khác. |
| Waiting for you | Các issue cần bạn quyết định ngay, issue chờ lâu nhất xếp trước. |
| In progress | Các issue mà Agent hoặc người khác đang đẩy tiến lên. |
| Waiting for others | Các issue đang nghiệm thu hoặc bị chặn, nhưng đang chờ người khác. Mỗi dòng cho biết chờ ai, ví dụ "Waiting for Li Na to accept". |
| Backlog | Các issue chưa bắt đầu. |
| Done | Các issue xong trong bảy ngày qua, mặc định thu gọn. |

Issue đã hủy không được hiển thị. Dùng bộ lọc trạng thái để tìm khi cần.

## Thế nào là đang chờ bạn

| Nhãn | Khi nào xuất hiện | Xử lý ở đâu |
| --- | --- | --- |
| Needs your acceptance | Một issue bạn phụ trách chuyển sang In review | [Nghiệm thu kết quả](accept.md) |
| Needs your reply | Một issue bạn phụ trách bị chặn vì một câu hỏi | [Trả lời câu hỏi của Agent](answer.md#trả-lời-câu-hỏi-trên-issue-bị-chặn) |
| Run failed | Lượt chạy của Agent vẫn thất bại sau khi thử lại và đang chờ bạn quyết định | [Trả lời câu hỏi của Agent](answer.md#lượt-chạy-thất-bại) |
| Needs plan approval | Một bản kế hoạch nháp cho issue này đang chờ bạn duyệt | Trang issue |
| Needs you to take over | Ai đó đã chuyển quyền phụ trách issue cho bạn | [Trả lời câu hỏi của Agent](answer.md#nhận-issue-được-chuyển-cho-bạn) |

Mỗi dòng cho biết bạn cần làm gì. Khi bạn đã xử lý một issue, nó vẫn ở nguyên chỗ cho đến khi bạn chuyển sang issue khác. Một thông báo ở cuối trang cho phép bạn **Undo** thay đổi hoặc chuyển thẳng đến issue tiếp theo đang chờ bạn.

## Các chế độ xem

Chuyển giữa bốn chế độ xem ở góc trên bên phải:

- **Split**: danh sách bên trái và chi tiết bên phải. **My issues** dùng mặc định, phù hợp để xử lý từng issue một.
- **Table**: mở rộng cây issue, phù hợp để xem các issue con.
- **Board**: mỗi cột một trạng thái. Kéo thẻ để đổi trạng thái.
- **Agent queue**: mỗi Agent một làn, cho thấy nó đang làm gì, việc gì tiếp theo và đang chờ ai. Xem [Khối lượng việc của Agent và mức dùng model](../project/usage.md).

Studio ghi nhớ chế độ xem bạn dùng lần cuối.

## Phím tắt

Trong danh sách, khi bạn không đang gõ trong một ô nhập:

| Phím | Thao tác |
| --- | --- |
| <kbd>J</kbd> / <kbd>K</kbd> hoặc các phím mũi tên | Issue tiếp theo / trước đó |
| <kbd>S</kbd> | Theo dõi hoặc bỏ theo dõi |
| <kbd>Enter</kbd> | Mở trang issue |
| <kbd>/</kbd> | Tìm kiếm |
| <kbd>Esc</kbd> | Quay lại danh sách |

## Theo dõi issue

Bấm vào ngôi sao ở góc trên bên phải của issue để theo dõi. Issue được theo dõi luôn ở đầu danh sách và hiển thị số bình luận hay thay đổi mà người khác đã thêm. Bạn có thể theo dõi cả những issue không phải mình phụ trách để nắm tình hình tại đây. Bạn có thể theo dõi tối đa 100 issue cùng lúc.

## Một ngày điển hình

1. Mở **My issues** và bắt đầu với **Waiting for you**: nghiệm thu kết quả, trả lời câu hỏi và xử lý các lượt chạy thất bại.
2. Lướt qua các cập nhật mới trong **Following**.
3. Khi có yêu cầu mới, hãy [nêu yêu cầu](raise-a-request.md) và giao cho đội Agent.

Đội Agent giữ cho mọi việc khác tiếp tục chạy trên các runtime. Khi cần bạn, issue sẽ quay lại **Waiting for you**.
