---
title: Kết nối máy tính
description: Dùng công cụ lập trình trên máy tính của mình qua My Agent trong Studio.
---

Kết nối máy tính để trao đổi với các công cụ lập trình trên máy qua **My Agent** trong Studio. Công cụ làm việc trong các thư mục cục bộ được cấp phép.

Để quản lý Studio từ terminal, dùng [nb-studio](local-agent.md). Để máy tiếp nhận đầu việc phát triển trong hàng đợi, [kết nối môi trường chạy](personal-runtime.md).

<a id="connect"></a>

## Kết nối

1. Cài và đăng nhập vào công cụ lập trình trên máy, chẳng hạn Claude Code hoặc Codex.
2. Mở **My sessions** trong Studio rồi chọn **My Agent**.
3. Chọn **Connect your computer** và chuyển hướng dẫn thiết lập cho agent lập trình trên máy đó.
4. Hoàn tất đăng nhập qua trình duyệt tại địa chỉ agent cung cấp.
5. Quay lại **My computers** để kiểm tra kết nối và công cụ khả dụng.

![Kết nối máy tính để dùng công cụ lập trình qua My Agent](https://static-docs.nocobase.com/studio-en-guide-connect-computer-20261031.png)

Quá trình thiết lập cài `nb-studio` và dịch vụ kết nối chạy nền. Cần Node.js 24 trở lên. Hỗ trợ macOS, Linux và Windows. Liên kết tải xuống hết hạn sau 30 phút. Tạo liên kết mới nếu cần.

<a id="choose-allowed-folders"></a>

## Chọn thư mục được phép

Đặt các thư mục được phép trong **My computers**. Mặc định là toàn bộ thư mục cá nhân. Có thể thu hẹp xuống các thư mục làm việc cụ thể. Khi mở phiên, chọn thư mục và công cụ cần dùng.

Agent có quyền của người dùng hệ điều hành đang chạy nó. Dùng tài khoản hệ điều hành hoặc máy ảo riêng nếu cần cô lập dự án.

<a id="handle-disconnections"></a>

## Xử lý khi mất kết nối

Máy đang ngủ hoặc đã tắt sẽ dừng xử lý phiên. Khôi phục mạng và dịch vụ chạy nền, rồi kiểm tra trạng thái phiên. Khi đóng trình duyệt, công việc trên máy tính vẫn tiếp tục.

Khi ngừng dùng một máy, xóa máy khỏi **My computers** và nhờ agent cục bộ gỡ dịch vụ chạy nền. Lịch sử phiên hiện có vẫn xem được.
