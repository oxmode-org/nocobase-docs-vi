---
title: Giao yêu cầu cho nhóm agent
description: Theo dõi đầu việc kiểm kê thiết bị trong Studio từ lúc nêu yêu cầu đến khi kiểm tra, nghiệm thu và hợp nhất.
---

Quản lý tài sản cần kiểm kê thiết bị mỗi quý. Hiện họ xuất bảng tính rồi đánh dấu từng thiết bị bằng tay, nên dễ bỏ sót. Bài này giao yêu cầu cho nhóm agent và theo dõi từ lúc nêu yêu cầu đến khi hợp nhất thay đổi.

Studio quản lý mỗi yêu cầu dưới dạng một đầu việc. Hai trạng thái cần người quyết định là Blocked để trả lời và In review để nghiệm thu. Agent điều phối xử lý các bước còn lại. Xem [Trạng thái và quyền của đầu việc](../studio/reference/statuses-and-permissions.md).

![Bảng đầu việc có một cột cho mỗi trạng thái](https://static-docs.nocobase.com/20261028201236304.png)

<a id="1-raise-the-request-and-turn-it-into-an-issue"></a>

## 1. Nêu yêu cầu và tạo đầu việc

Trong **My sessions**, chọn **New session**, chọn agent lập trình và thư mục itam-lite cục bộ, rồi chọn dự án itam-lite. Hãy [kết nối máy tính](../studio/join/connect-computer.md) trước:

![Tạo phiên mới](https://static-docs.nocobase.com/20261030155023637.png)

Yêu cầu chức năng để quản lý tài sản mở đợt kiểm kê và chọn phạm vi. Hỗ trợ CNTT kiểm tra thiết bị có mặt hay không, vị trí và người được giao, rồi ghi nhận thực tế nếu có chênh lệch. Khi kết thúc, báo cáo tổng số thiết bị đã kiểm, số khớp và chi tiết từng sai lệch. Nhờ agent hỏi lại điểm chưa rõ trước khi tạo đầu việc.

```prompt
The asset manager does a device stocktake every quarter. Here's what I want:
- The asset manager starts a stocktake and chooses which devices it covers.
- IT support checks each device: is it there, is the location right, is the assignee right. If not, record what's actually the case.
- When the stocktake ends, it produces a result: how many devices were counted, how many were fine, and every discrepancy listed one by one.
Ask me about anything unclear before creating the issue.
```

Agent đặt câu hỏi. Các quyết định trong ví dụ gồm chọn phạm vi theo vị trí, vẫn cho gửi yêu cầu thiết bị khi đang kiểm kê và chỉ người có vai trò phù hợp được xem đợt kiểm kê. Agent ghi các quy tắc này vào mô tả và kịch bản nghiệm thu, rồi tạo `ITAM-12 Device stocktake`.

<!-- TODO screenshot (English interface, browser width 1440): discussing the device stocktake in My sessions; after the agent asks and you answer, the session lists the created ITAM-12 issue and the Start button -->

Hoàn tất khi dự án itam-lite có đầu việc **Device stocktake** với các quy tắc đã quyết định và kịch bản nghiệm thu trong mô tả.

<a id="2-start"></a>

## 2. Bắt đầu

Bấm **Start** trong phiên. Đầu việc chuyển sang In progress. Agent điều phối giao một agent lập kế hoạch gồm hai bảng mới cho đợt kiểm kê và chi tiết, hai trạng thái và quyền cho hai vai trò. Sau đó, agent khác phát triển trên nhánh `agent/ITAM-12`, viết kiểm thử, chụp ảnh và mở PR.

**Now** và **Up next** ở đầu trang cho biết ai đang làm và bước tiếp theo. **Activity** ghi từng lần bàn giao. Để bổ sung yêu cầu, bình luận trên đầu việc. Xem [Theo dõi tiến độ](../studio/use/follow-progress.md).

<!-- TODO screenshot (English interface, browser width 1440): the top of the ITAM-12 issue page, with Now showing the developing agent at work and Up next saying that after development it goes to another vendor for review -->

Hoàn tất khi đầu việc ở In progress và agent điều phối là bên thực thi.

<a id="3-answer-questions"></a>

## 3. Trả lời câu hỏi

Khi lập kế hoạch, agent cần người quyết định liệu có tự cập nhật sổ thiết bị khi kiểm kê phát hiện sai lệch. Đầu việc chuyển sang Blocked và được đánh dấu **Needs your reply** trong **My issues**.

![Thẻ Needs you trên đầu việc bị chặn nêu quyết định cần đưa ra](https://static-docs.nocobase.com/20261028203035957.png)

Mở đầu việc và bấm **Reply**. Yêu cầu liệt kê các sai lệch khi kết thúc đợt kiểm kê. Chỉ cập nhật sổ đối với từng sai lệch đã được quản lý tài sản xác nhận.

```text
Don't update the register automatically. When the stocktake ends, list the discrepancies, and the asset manager confirms them one by one. Only confirmed ones update the register.
```

Xem [Trả lời câu hỏi của agent](../studio/use/answer.md).

Hoàn tất khi đầu việc trở lại In progress.

<a id="4-checks-and-review"></a>

## 4. Kiểm tra và rà soát

Sau khi PR mở, CI chạy trước rồi agent từ nhà cung cấp khác rà soát. Agent phát triển sửa vấn đề và PR được rà soát lại. Đầu việc chuyển sang nghiệm thu sau khi các bước đạt. Xem [Kiểm tra và rà soát](../studio/project/checks-and-review.md).

<a id="5-accept-and-merge"></a>

## 5. Nghiệm thu và hợp nhất

Đầu việc chuyển sang In review và được đánh dấu **Needs your acceptance** trong **My issues**. Đọc báo cáo và ảnh rồi mở bản xem trước từ trang đầu việc bằng tài khoản quản trị viên ban đầu. Thử vai trò quản lý tài sản để bắt đầu kiểm kê theo vị trí. Chuyển sang hỗ trợ CNTT, kiểm tra vài thiết bị và cố tình ghi một vị trí khác. Kết thúc đợt kiểm kê và xác nhận kết quả liệt kê sai lệch đó, còn sổ thiết bị vẫn giữ nguyên. Xem [Nghiệm thu kết quả](../studio/use/accept.md).

![Báo cáo bàn giao và ảnh do agent phát triển đính kèm](https://static-docs.nocobase.com/20261028203712314.png)

![Trang đầu việc hiển thị tài khoản quản trị viên ban đầu cho bản xem trước PR](https://static-docs.nocobase.com/20261028204209835.png)

Nếu đạt yêu cầu, bấm **Merge**. Nếu cần chỉnh sửa, chọn **Send back for changes** và nêu nội dung cần sửa.

![Nút Merge trong thẻ Needs you của đầu việc đang nghiệm thu](https://static-docs.nocobase.com/20261028201509073.png)

Bấm ngôi sao ở góc trên bên phải để theo dõi đầu việc quan trọng. Đầu việc đó xuất hiện trên cùng trong **My issues**.

![Theo dõi một đầu việc](https://static-docs.nocobase.com/20261029152227386.png)

Hoàn tất khi đầu việc ở Done và chức năng kiểm kê đã vào nhánh mặc định của itam-lite.
