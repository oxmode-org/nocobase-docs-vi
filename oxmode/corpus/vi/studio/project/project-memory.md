---
title: Bộ nhớ dự án
description: Chia sẻ quy tắc đã xác nhận, ràng buộc và bài học giữa các agent, đồng thời duy trì chúng cùng mã nguồn.
---

Bộ nhớ dự án nằm trong kho mã. Agent đọc bộ nhớ ở các đầu việc sau để nhóm dùng lại kiến thức khi đổi thành viên hoặc mô hình.

<a id="what-belongs-in-memory"></a>

## Nội dung phù hợp với bộ nhớ

| Loại | Nội dung | Ví dụ |
| --- | --- | --- |
| Phản hồi | Cách làm đã xác nhận và điều chỉnh | Mọi đơn hàng từ nhà cung cấp hạng C đều cần phê duyệt |
| Dự án | Quyết định và ràng buộc khó suy ra từ mã | Đánh số migration theo thứ tự hợp nhất |
| Tham chiếu | Vị trí tài nguyên ngoài kho mã | Tra trọng số trong bảng chấm điểm ở kho tri thức |

Dùng bộ nhớ cho thông tin bổ sung ngoài mã, README và AGENTS.md. Giữ tiến độ đầu việc, log tạm, bí mật và thông tin cá nhân bên ngoài bộ nhớ.

<a id="read-memory"></a>

## Đọc bộ nhớ

Mở **Project memory** rồi chọn dự án và kho mã, hoặc dùng tab **Memory** của dự án. Lọc theo loại hoặc tìm kiếm, rồi mở mục để xem nội dung và commit nguồn.

![Đọc bộ nhớ dùng chung của dự án](https://static-docs.nocobase.com/studio-en-guide-memory-20261031.png)

<a id="update-memory"></a>

## Cập nhật bộ nhớ

Agent ghi mỗi mục thành một tệp trong `.nb-studio/memory/`. Thay đổi được rà soát và hợp nhất cùng PR của đầu việc. Các đầu việc sau đọc các mục này từ kho mã.

Nêu quy tắc lâu dài trong đầu việc để agent cân nhắc lưu. Khi mục bộ nhớ mâu thuẫn với mã hiện tại, agent cập nhật hoặc xóa mục đó trong PR. Mỗi kho mã duy trì bộ nhớ riêng.

Dùng ngôn ngữ theo quy ước của kho mã, mặc định là tiếng Anh. Giữ khoảng 50 mục mỗi kho, mỗi mục dưới 4 KB. Lưu tài liệu nghiệp vụ do thành viên duy trì trong [Kho tri thức](knowledge-base.md) và quy trình phát triển trong [Skill](skills.md).
