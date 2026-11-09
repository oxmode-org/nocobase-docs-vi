---
title: Phiên làm việc của tôi
description: Tập hợp thảo luận yêu cầu, đầu việc liên kết và các cuộc trao đổi tiếp theo.
---

**My sessions** lưu các cuộc trao đổi với agent và các đầu việc liên kết. Quay lại cùng cuộc trò chuyện để bổ sung yêu cầu hoặc hỏi về kết quả.

![Lịch sử trò chuyện hiển thị ngữ cảnh cạnh đầu việc đã liên kết và trạng thái của chúng](https://static-docs.nocobase.com/studio-en-guide-runner-session-20261031.png)

<a id="choose-an-agent-connection"></a>

## Chọn cách kết nối agent

| Chế độ | Nơi thực thi | Chuẩn bị |
| --- | --- | --- |
| Runner Agent | Môi trường chạy dùng chung hoặc cá nhân | Môi trường trực tuyến và agent khả dụng |
| My Agent | Máy tính đã kết nối và các thư mục được phép | [Kết nối máy tính](../join/connect-computer.md) |

Chỉ người tạo thấy cuộc trò chuyện. Agent hoạt động theo danh tính và quyền của người đó. Đầu việc liên kết được chia sẻ theo quyền dự án.

<a id="start-a-conversation"></a>

## Bắt đầu cuộc trò chuyện

1. Chọn chế độ rồi chọn **New session**.
2. Chọn agent. Với My Agent, chọn thêm máy tính và thư mục làm việc.
3. Nếu cần mã nguồn, chọn dự án trước tin nhắn đầu tiên.
4. Mô tả yêu cầu rồi thêm ảnh, tệp đính kèm hoặc tham chiếu `#task-identifier`.

**Ask agent** trên trang dự án hoặc đầu việc tự đưa ngữ cảnh trang vào phiên. Xem [Trao đổi với Runner Agent](../join/runner-agent.md) về cách cố định dự án, xếp hàng tin nhắn và đổi môi trường chạy.

<a id="create-tasks-from-the-discussion"></a>

## Tạo đầu việc từ cuộc thảo luận

Ví dụ, yêu cầu tạo ba đầu việc trong Supplier Management cho các thay đổi đã thống nhất. Mỗi đầu việc cần có tiêu chí nghiệm thu và chờ trước khi bắt đầu:

```prompt
Create three tasks in Supplier Management for the changes we agreed on. Include acceptance criteria for each, but do not start them yet.
```

Đầu việc mới xuất hiện trong cuộc trò chuyện. Rà soát và bắt đầu, hoặc giữ trong Backlog. Thuộc tính của đầu việc có liên kết quay về các cuộc trò chuyện liên quan.

<a id="follow-conversations"></a>

## Theo dõi cuộc trò chuyện

- Danh sách hiển thị số đầu việc liên kết và một đoạn tiến độ cho từng đầu việc.
- Lọc theo **Needs me** hoặc **In progress** để tập trung vào công việc đang xử lý.
- Thông tin bắt đầu, trở ngại, yêu cầu nghiệm thu và hoàn tất được gửi về cuộc trò chuyện.
- Đưa cuộc trò chuyện không còn hoạt động vào kho lưu trữ và khôi phục khi cần.

Theo mặc định, hệ thống xóa cuộc trò chuyện Runner Agent sau 30 ngày trong kho lưu trữ. Lưu quyết định dài hạn trong đầu việc, [kho tri thức](../project/knowledge-base.md) hoặc [bộ nhớ dự án](../project/project-memory.md).
