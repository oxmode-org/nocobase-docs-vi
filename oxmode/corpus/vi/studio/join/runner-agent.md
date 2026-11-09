---
title: Trao đổi với Runner Agent
description: Làm rõ yêu cầu, xem mã dự án và tạo đầu việc từ cuộc trò chuyện trong Studio.
---

Runner Agent kết hợp công cụ lập trình và mô hình trên một môi trường chạy. Trong **My sessions**, có thể trao đổi trực tiếp để làm rõ yêu cầu, xem mã dự án hoặc theo dõi đầu việc.

Nhóm cần [môi trường chạy](../configure/runtimes.md) trực tuyến và [agent](../configure/agents.md) đang bật. Với môi trường chạy dùng chung, có thể bắt đầu ngay trong Studio.

<a id="start-a-conversation"></a>

## Bắt đầu cuộc trò chuyện

1. Mở **My sessions** và chọn **Runner Agent**.
2. Tạo cuộc trò chuyện và chọn agent.
3. Nếu cần xem mã, chọn dự án trước khi gửi tin nhắn đầu tiên.
4. Gửi câu hỏi.

Ví dụ, yêu cầu giải thích cách tính điểm nhà cung cấp dựa trên quy tắc hiện có và giữ nguyên mã:

```prompt
Explain how supplier scores are calculated in this project. Read the existing rules without changing any code.
```

![Cuộc trò chuyện với Runner Agent hiển thị thảo luận bên cạnh các đầu việc đã liên kết](https://static-docs.nocobase.com/studio-en-guide-runner-session-20261031.png)

Dự án được cố định sau tin nhắn đầu tiên. Mở cuộc trò chuyện mới nếu cần đổi dự án. Agent chuẩn bị mã của dự án đã chọn. Có thể gửi văn bản, ảnh và tệp đính kèm. Tin nhắn gửi trong lúc agent đang chạy được xếp hàng.

<a id="turn-a-discussion-into-a-task"></a>

## Chuyển thảo luận thành đầu việc

Ví dụ, yêu cầu tạo đầu việc cho thay đổi cách tính điểm đã thống nhất và chờ trước khi bắt đầu:

```prompt
Create a task for the scoring changes we agreed on, but do not start it yet.
```

Đầu việc mới xuất hiện trong cuộc trò chuyện. Kiểm tra yêu cầu rồi chọn **Start** để agent điều phối tổ chức thực hiện. Dùng `#task-identifier` để liên kết đầu việc hiện có.

Chỉ người tạo thấy cuộc trò chuyện. Đầu việc được chia sẻ theo quyền của dự án và cập nhật trạng thái được gửi về cuộc trò chuyện.

<a id="change-agents-or-runtimes"></a>

## Đổi agent hoặc môi trường chạy

- **Change Agent**. Hoàn tất lượt đang chạy và xử lý tin nhắn trong hàng đợi trước. Lịch sử và đầu việc đã liên kết được giữ lại.
- **Môi trường chạy ngoại tuyến**. Chờ kết nối lại hoặc chọn **Switch runtime**. Môi trường mới nhận lịch sử trò chuyện. Thay đổi chưa đẩy vẫn ở máy cũ.
- **Thiếu agent khả dụng**. Kiểm tra kết nối của môi trường chạy, trạng thái đăng nhập công cụ lập trình và agent đã được bật hay chưa.

Cuộc trò chuyện có thể xem và sửa dự án. Yêu cầu tường minh nếu cần đẩy mã hoặc tạo PR. Chuyển yêu cầu chính thức thành đầu việc để cả nhóm theo dõi và [nghiệm thu](../use/accept.md).
