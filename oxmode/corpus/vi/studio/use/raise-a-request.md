---
title: Gửi yêu cầu
description: Tạo đầu việc qua trò chuyện hoặc biểu mẫu, với quy tắc, phạm vi và tiêu chí nghiệm thu rõ ràng.
---

Mô tả vấn đề, quy tắc nghiệp vụ và cách kiểm tra kết quả. Studio lưu yêu cầu thành đầu việc. Sau khi bắt đầu, agent điều phối tổ chức thực hiện.

<a id="start-with-a-conversation"></a>

## Bắt đầu bằng cuộc trò chuyện

1. Chọn **New issue** trong My issues, danh sách đầu việc hoặc dự án. Trong danh sách cũng có thể nhấn <kbd>C</kbd>.
2. Mô tả yêu cầu rồi đính kèm ảnh hoặc tài liệu liên quan.
3. Trả lời câu hỏi và rà soát các đầu việc agent tạo.
4. Chọn **Start** để giao nhóm agent thực hiện hoặc **Not now** để giữ trong Backlog.

![Cuộc trò chuyện tạo đầu việc có ngữ cảnh dự án hiện tại](https://static-docs.nocobase.com/studio-en-guide-new-task-20261031.png)

Ví dụ, yêu cầu hiện điểm và hạng nhà cung cấp trong danh sách, cho người mua lọc theo hạng và chặn đơn mới với nhà cung cấp đang bị tạm ngưng:

```prompt
Show each supplier’s score and tier in the supplier list. Buyers should be able to filter by tier. Suspended suppliers must not receive new orders.
```

Có thể tạo đầu việc từ cuộc thảo luận hiện có. Xem [Phiên làm việc của tôi](sessions.md).

<a id="fill-in-a-task-directly"></a>

## Nhập trực tiếp đầu việc

Chọn **Fill in manually** trong cuộc trò chuyện tạo đầu việc:

1. Nhập tiêu đề và mô tả. Kiểm tra dự án và người phụ trách.
2. Chọn bắt đầu ngay hoặc để sau.
3. Chọn **Create and start** hoặc **Create**.

![Nhập tiêu đề, yêu cầu và chọn thời điểm bắt đầu](https://static-docs.nocobase.com/studio-en-guide-manual-task-20261031.png)

Người phụ trách xác nhận quy tắc nghiệp vụ và nghiệm thu. Đầu việc trong Backlog chờ đến khi chọn **Start**.

<a id="write-a-clear-request"></a>

## Viết yêu cầu rõ ràng

| Nội dung | Ví dụ |
| --- | --- |
| Mục tiêu | Giúp người mua nhận biết nhà cung cấp rủi ro cao |
| Quy tắc nghiệp vụ | Mọi đơn hàng hạng C cần phê duyệt, bất kể giá trị |
| Kịch bản nghiệm thu | Một đơn hạng C giá trị nhỏ vẫn vào bước phê duyệt |
| Phạm vi | Áp dụng cho đơn mới và giữ lịch sử phê duyệt của đơn cũ |
| Tham chiếu | Dùng bảng chấm điểm nhà cung cấp trong kho tri thức |

Khi chưa rõ cách làm, nhờ agent so sánh các phương án và ảnh hưởng trước.

<a id="larger-requests"></a>

## Yêu cầu lớn

Agent điều phối sắp xếp thiết kế, phát triển và rà soát. Tách phần có thể nghiệm thu độc lập thành đầu việc con.

- Tạo đầu việc con từ trang đầu việc hoặc nhờ agent soạn dựa trên yêu cầu cha.
- Đầu việc con ở giai đoạn sau chờ giai đoạn trước hoàn tất.
- Thêm đầu việc tiền nhiệm trong thuộc tính để chờ đến khi phần phụ thuộc hoàn tất hoặc bị hủy.

Mức ưu tiên ảnh hưởng thứ tự chạy của công việc trong hàng đợi. Có thể bổ sung yêu cầu trong [chi tiết đầu việc](follow-progress.md).
