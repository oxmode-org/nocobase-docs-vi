---
title: Theo dõi tiến độ
description: Xem bước đang chạy, các lần bàn giao và lịch sử thực thi, rồi bổ sung yêu cầu bằng bình luận.
---

Chi tiết đầu việc tập hợp công việc đang chạy, bước tiếp theo và kết quả bàn giao. Thêm bình luận khi cần làm rõ hoặc thay đổi yêu cầu.

<a id="task-details"></a>

## Chi tiết đầu việc

![Tóm tắt cho biết ai đang làm và bước tiếp theo](https://static-docs.nocobase.com/studio-en-guide-task-progress-20261031.png)

| Khu vực | Nội dung |
| --- | --- |
| Now | Trạng thái thực tế, gồm agent và môi trường đang chạy hoặc lý do chờ |
| Next | Bước tiếp theo của agent điều phối |
| Needs you | Câu hỏi hoặc yêu cầu nghiệm thu kèm thao tác |
| Delivery report | Thay đổi, kiểm chứng và tiêu chí nghiệm thu |
| Properties | Người phụ trách, bên thực thi, mức ưu tiên, nhãn và ngày |

**Activity** lưu bình luận và thay đổi trạng thái. Mặc định hiển thị hội thoại. Chọn **All** để xem bản ghi hệ thống. **Description** lưu yêu cầu, **Code & previews** tập hợp PR và kiểm tra, còn **Runs** ghi các lượt agent chạy. Đầu việc con xuất hiện khi có.

<a id="communicate-through-comments"></a>

## Trao đổi qua bình luận

- **Comment** thêm yêu cầu, trả lời câu hỏi hoặc nhắc agent bằng `@`. Thao tác đánh thức agent liên quan và bên thực thi.
- **Note** ghi thông tin mà không kích hoạt agent.
- **Reply** tiếp tục thảo luận dưới bình luận gốc.

Ví dụ, yêu cầu giữ quyền xem và nhận hàng đối với đơn hiện có sau khi tạm ngưng nhà cung cấp, đồng thời chặn đơn mới:

```prompt
After a supplier is suspended, existing orders must remain readable and allow receiving goods. Only new orders should be blocked. Please update the behavior accordingly.
```

Yêu cầu đã đổi ảnh hưởng công việc tiếp theo. Nếu chỉ muốn thảo luận, nói rõ để agent giữ nguyên mã.

<a id="ask-an-agent"></a>

## Hỏi agent

**Ask agent** mở cuộc trò chuyện riêng có ngữ cảnh đầu việc. Dùng để tìm nguyên nhân bị chặn hoặc hiểu thay đổi. Ghi kết luận vào bình luận để chia sẻ với thành viên dự án.

<a id="run-history"></a>

## Lịch sử thực thi

![Xem agent, trạng thái, thời lượng và bản ghi của từng lượt chạy](https://static-docs.nocobase.com/studio-en-guide-runs-20261031.png)

| Thao tác | Mục đích |
| --- | --- |
| View transcript | Đọc quá trình thực hiện và kết quả |
| View full prompt | Kiểm tra ngữ cảnh agent đã nhận |
| Stop | Yêu cầu dừng lượt đang chạy. Thay đổi đã thực hiện được giữ |
| Retry | Đưa lượt thất bại vào hàng đợi lần nữa |

Sau khi dừng, xem phần đã hoàn tất trước khi hướng dẫn cách tiếp tục. Xem [Lượt chạy thất bại](answer.md#run-failures).

<a id="project-wide-progress"></a>

## Tiến độ toàn dự án

Xem [Tiến độ dự án](../project/progress.md) để theo dõi đầu việc và trở ngại trong toàn dự án. Xem [Khối lượng công việc và mức sử dụng mô hình](../project/usage.md) để biết năng lực và mức sử dụng.
