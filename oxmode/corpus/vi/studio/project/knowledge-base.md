---
title: Kho tri thức
description: Chia sẻ yêu cầu, quy tắc nghiệp vụ và tài liệu tham khảo với thành viên và agent.
---

Kho tri thức lưu nội dung do thành viên viết hoặc tải lên. Agent đọc nội dung trong phạm vi quyền của người dùng. Kinh nghiệm rút ra khi phát triển được lưu trong [Bộ nhớ dự án](project-memory.md).

<a id="choose-a-knowledge-space"></a>

## Chọn không gian tri thức

| Không gian | Mục đích | Người duy trì |
| --- | --- | --- |
| Tri thức hệ thống | Chính sách, thuật ngữ và bối cảnh dùng chung giữa các dự án | Quản trị viên |
| Tri thức dự án | Yêu cầu, quy tắc nghiệp vụ và tệp đính kèm của dự án | Người phụ trách dự án và thành viên được cấp quyền |

Mở tab **Knowledge** của dự án. Công việc trong dự án có thể tham chiếu tri thức của dự án và phần tri thức hệ thống mà người dùng có quyền truy cập.

![Tổ chức tài liệu nghiệp vụ trong kho tri thức dự án](https://static-docs.nocobase.com/studio-en-guide-knowledge-20261031.png)

<a id="add-and-maintain-material"></a>

## Thêm và duy trì tài liệu

1. Chọn không gian hoặc thư mục.
2. Tạo bài viết Markdown hoặc tải tệp lên.
3. Rà soát nội dung đã lưu và đánh dấu đã xác minh khi phù hợp.

Studio có thể trích xuất văn bản từ PDF, Word, Excel, PowerPoint, CSV, văn bản thuần, Markdown và JSON để đọc và tìm kiếm. Ảnh được giữ dưới dạng tệp gốc và không qua OCR. Có thể tải xuống các tệp gốc. Thư mục hỗ trợ tối đa bốn cấp.

Mỗi lần lưu tạo một phiên bản. Đưa tài liệu lỗi thời vào kho lưu trữ để loại khỏi kết quả tìm kiếm và khôi phục khi cần.

<a id="save-task-attachments"></a>

## Lưu tệp đính kèm của đầu việc

Agent có thể đề xuất lưu tệp đính kèm vào kho tri thức. Người tải tệp lên hoặc người phụ trách đầu việc có thể chọn đích nếu có quyền chỉnh sửa tại đó. Tệp chỉ hữu ích cho đầu việc hiện tại có thể giữ nguyên trong đầu việc.

<a id="control-access"></a>

## Kiểm soát truy cập

Thiết lập quyền cho không gian, thư mục, bài viết và tệp. Mặc định, các mục kế thừa quyền từ mục cha. Có thể cấp quyền cho thành viên, vai trò hoặc thành viên dự án.

Thành viên có quyền chỉnh sửa có thể cập nhật nội dung trực tiếp. Nếu thiếu quyền, gửi yêu cầu qua bình luận đầu việc. Quyền quản lý cho phép chỉnh quy tắc truy cập. Agent chỉ đọc nội dung mà người yêu cầu có quyền truy cập.
