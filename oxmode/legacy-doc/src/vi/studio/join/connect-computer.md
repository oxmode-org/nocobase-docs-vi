---
title: Kết nối máy tính của bạn
status: cần viết lại
description: Kết nối máy tính của bạn với Studio để trao đổi với công cụ lập trình trên máy mình ngay trong My sessions.
---

Trang này được dịch từ bản tiếng Trung của tài liệu gốc (bản tiếng Anh chính thức chưa có nội dung). Bản gốc vẫn đang được viết lại.

## Kết nối

Trước khi dùng "Agent của tôi" (my agent), hãy kết nối máy tính với Studio:

1. Mở **My sessions**, bấm **Connect your computer**.
2. Sao chép lệnh cấu hình trên trang và giao cho công cụ lập trình trên máy này (như Claude Code, Codex) thực hiện. Nó sẽ cài dòng lệnh `nb-studio`, nhờ bạn xác nhận đăng nhập trên trình duyệt, và chạy `nb-studio acp service install` để máy tự giữ kết nối sau khi khởi động.
3. Quay lại Studio và xác nhận máy này đang hiển thị trực tuyến.

::figure connect-computer | Giao lệnh cấu hình cho công cụ lập trình trên máy này thực hiện

- Hỗ trợ Codex, Claude Code, Gemini CLI, GitHub Copilot, Cursor, OpenCode và các công cụ lập trình khác; máy có thể chạy macOS, Linux hoặc Windows.
- Mặc định Agent được truy cập toàn bộ thư mục người dùng; bạn có thể giới hạn lại các thư mục cụ thể trong **My computers**. Quyền của Agent trong các thư mục này giống như khi bạn dùng nó trong terminal của mình.
- Đường dẫn cài đặt trong lệnh cấu hình có hiệu lực trong 30 phút; hết hạn thì tạo lại là được.

## Dự kiến bổ sung

- Kết nối: sao chép lệnh cấu hình và giao cho công cụ lập trình trên máy thực hiện
- Các thư mục được phép truy cập: **My computers**
- Kết nối tạm thời và giữ trực tuyến
- Ngắt kết nối và gỡ máy
