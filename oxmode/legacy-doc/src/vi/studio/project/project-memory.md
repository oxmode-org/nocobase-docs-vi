---
title: Bộ nhớ dự án
description: Bộ nhớ dự án chứa những gì Agent tự học được. Khi con người sửa một Agent, khi nó gặp cạm bẫy, hay khi một điều gì đó được xác nhận trong dự án, Agent ghi lại và đọc trước lần làm việc sau, để cùng một lỗi không lặp lại. Một Agent khác cũng có thể dùng lại.
---

Nó hoạt động giống auto memory của Claude Code: Agent tự viết, tự đọc, và không ai phải duy trì. Khác biệt là bộ nhớ dự án nằm trong repository và được dùng chung bởi mọi Agent trong nhóm.

## Agent ghi nhớ những gì

Chỉ những gì các issue sau sẽ cần mà mã nguồn không cho biết. Phần lớn issue không thêm gì cả:

| Loại | Ví dụ |
| --- | --- |
| Feedback (phản hồi) | Hướng làm đã được con người sửa hoặc xác nhận, và các cạm bẫy, như "Mọi đơn hàng với nhà cung cấp hạng C đều cần trưởng phòng mua hàng duyệt, bất kể giá trị" |
| Project (dự án) | Các quyết định, ràng buộc và bối cảnh mà mã và lịch sử commit không thể hiện, như "Đánh số migration theo thứ tự merge" |
| Reference (tham chiếu) | Tài liệu bên ngoài repository nằm ở đâu, như "Trọng số chấm điểm theo Purchase Approval Policy trong cơ sở tri thức" |

Agent không ghi lại những gì có thể suy ra từ mã, cấu trúc thư mục hoặc lịch sử commit, những gì `AGENTS.md` hay README của repository đã nói, hoặc tiến độ chỉ có ý nghĩa với issue hiện tại.

> [!WARNING] Không đưa thông tin nhạy cảm vào bộ nhớ
> Bộ nhớ được đưa vào repository. Không bao giờ ghi khóa bí mật, token, mật khẩu, chuỗi kết nối hay thông tin liên lạc cá nhân vào đó, dù repository công khai hay riêng tư. Bộ nhớ trong repository công khai cũng là công khai.

## Nằm ở đâu và được review thế nào

Bộ nhớ là một tập file trong thư mục `.nb-studio/memory/` của repository, mỗi file một mục ghi nhớ. Agent ghi bộ nhớ trên nhánh của issue và commit cùng PR, và Agent review kiểm tra nó cùng với mã. Khi bạn nghiệm thu và merge, nó lên nhánh mặc định, và các issue sau có thể đọc.

Bộ nhớ được viết bằng ngôn ngữ mà quy ước riêng của repository quy định, ví dụ trong `AGENTS.md`, và bằng tiếng Anh nếu repository không quy định.

Khi dự án có nhiều repository, bộ nhớ của mỗi repository chỉ áp dụng cho repository đó và được lưu riêng.

## Xem bộ nhớ

**Development › Project memory** liệt kê bộ nhớ của từng dự án, còn mục **Memory** của một dự án chỉ hiển thị của dự án đó. Bạn có thể tìm kiếm và lọc theo feedback, project hoặc reference, và mỗi mục cho biết nó đến từ nhánh và commit nào.

Bộ nhớ được viết cho Agent, nên bạn không cần đọc hay dọn dẹp. Hãy xem qua khi bạn tò mò đội Agent đã học được gì từ dự án.

## Nhờ Agent ghi nhớ điều gì đó

Để Agent ghi nhớ một quy tắc, hãy nói với Agent trên issue, và nó sẽ quyết định có ghi lại hay không. Những tài liệu mà cả con người và Agent cần tham khảo lâu dài nên đặt trong [cơ sở tri thức](knowledge-base.md).

## Khi bộ nhớ đã cũ

Bộ nhớ ghi lại những gì đúng tại thời điểm đó. Trước khi dựa vào một mục ghi nhớ, Agent đối chiếu nó với mã hiện tại. Khi có mâu thuẫn, mã được ưu tiên, và Agent cập nhật hoặc xóa mục ghi nhớ trong PR hiện tại.

Hãy giữ mỗi repository khoảng 50 mục ghi nhớ, mỗi mục không quá 4 KB. Vượt quá mức đó, Studio sẽ gợi ý dọn dẹp, mà không làm chậm issue hiện tại.
