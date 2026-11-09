---
title: Nêu yêu cầu
description: Trao đổi một yêu cầu với Agent trong một phiên và để nó biến yêu cầu thành các issue cho đội Agent, hoặc tự điền một issue.
---

Thứ bạn nêu ra là một yêu cầu: vấn đề cần giải quyết, quy tắc nghiệp vụ, và cách bạn sẽ kiểm tra kết quả. Trong Studio, một yêu cầu trở thành một hoặc nhiều issue, và khi chúng được bắt đầu, đội Agent sẽ đẩy chúng tiến lên.

## Nêu yêu cầu trong một phiên

1. Bấm **New issue** trong **My issues**, **Development › Issues** hoặc trang dự án. Trên các trang danh sách bạn cũng có thể nhấn <kbd>C</kbd>. Studio mở một phiên với Agent, kèm theo "New issue" và dự án hiện tại.
2. Mô tả yêu cầu bằng ngôn ngữ nghiệp vụ. Bạn có thể nêu nhiều việc cùng lúc và dán ảnh chụp màn hình.
3. Khi yêu cầu đã rõ, Agent biến nó thành issue ngay. Chỗ nào chưa rõ, nó hỏi bạn trước, hoặc xem mã hiện có trước khi tạo.
4. Các issue mới được liệt kê trong phiên. Bấm **Start** để giao cho đội Agent, hoặc **Not now** để để chúng trong **Backlog** làm sau.

::figure new-task-chat | Một issue mới bắt đầu bằng một phiên. Muốn điền form, bấm Fill in manually

Để xem bạn có thể trò chuyện với những Agent nào trong một phiên, đọc [My sessions](sessions.md).

## Tự điền

Để điền form thay vì trò chuyện, bấm **Fill in manually** trong phiên:

1. Nhập tiêu đề và mô tả. Mô tả hỗ trợ Markdown.
2. Kiểm tra dự án và người phụ trách. Người phụ trách là người chịu trách nhiệm về issue, mặc định là bạn.
3. Ở **When to start**, chọn một:
   - **Start now**: issue chuyển sang **In progress**, và Agent điều phối bắt đầu sắp xếp công việc ngay.
   - **Later**: issue vào **Backlog**, và bạn bấm **Start** trên trang issue khi đã sẵn sàng.
4. Bấm **Create and start** hoặc **Create**.

::figure manual-form | Form điền thủ công

> [!NOTE] Issue trong Backlog không tự bắt đầu
> Agent không động vào các issue trong **Backlog**. Khi sẵn sàng, bấm **Start** trên trang issue.

## Làm sao để yêu cầu rõ ràng

Đội Agent hiểu yêu cầu từ những gì bạn viết. Càng rõ thì càng ít phải làm lại và càng ít câu hỏi quay lại hỏi bạn giữa chừng. Nên có:

- **Mục tiêu**: vấn đề cần giải quyết, và dành cho ai.
- **Quy tắc nghiệp vụ**: số liệu tính thế nào, quy trình chạy ra sao, ai được xem gì. Khi nêu trong một phiên, hãy chốt ngay các quy tắc mà Agent hỏi.
- **Kịch bản nghiệm thu**: bạn sẽ kiểm tra thế nào khi xong, ví dụ "Sau khi đăng nhập, nhân viên mua hàng thấy hạng của từng nhà cung cấp trong danh sách nhà cung cấp."
- **Phạm vi**: yêu cầu này không bao gồm những gì.
- **Tài liệu**: các bảng tính, ảnh chụp màn hình và văn bản quy định liên quan. Với những gì đã có trong cơ sở tri thức, chỉ cần nêu tên tài liệu.

Nếu chưa chắc nên làm thế nào, hãy nói thẳng: "Chưa chắc, hãy đề xuất hướng làm trước." Agent điều phối sẽ nhờ một Agent viết hướng làm trước và quay lại hỏi bạn khi có điều cần quyết định.

## Khi yêu cầu lớn

Dù yêu cầu lớn đến đâu, chỉ cần mô tả rõ. Bạn không cần tự chia nhỏ. Agent điều phối sẽ tách thành các bước và giao từng bước cho Agent phù hợp.

Nếu muốn nghiệm thu riêng một số phần, bấm **New sub-issue** trên trang issue:

- Thao tác này cũng mở một phiên, kèm theo issue cha. Bạn có thể nhờ Agent đọc issue cha và soạn các issue con, rồi kiểm tra và điều chỉnh trước khi tạo.
- Issue con có thể chia giai đoạn: issue con ở giai đoạn sau chỉ bắt đầu khi mọi giai đoạn trước đã xong. Khi tất cả issue con đã xong, issue cha tiếp tục.
- Thêm một **Blocker** trong thuộc tính của issue: issue sẽ không bắt đầu cho đến khi issue nó phụ thuộc đã xong hoặc bị hủy.

Độ ưu tiên của issue ảnh hưởng đến hàng đợi, và runtime nhận việc của các issue khẩn cấp trước.

## Tự làm

Một thành viên cũng có thể là người thực hiện issue, và những issue như vậy không được giao cho Agent. Muốn giao cho đội Agent sau này, bấm **Hand over to the coordinator agent to start** trên trang issue.
