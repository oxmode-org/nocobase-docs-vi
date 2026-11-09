---
title: Dùng agent lập trình cục bộ
description: Dùng nb-studio từ Claude Code hoặc Codex để đọc dự án, tạo đầu việc và theo dõi kết quả.
---

`nb-studio` cho phép quản lý Studio từ Claude Code, Codex hoặc agent lập trình cục bộ khác. Agent dùng CLI để đọc đầu việc và tài liệu, tạo yêu cầu và thêm bình luận. Môi trường chạy của Studio có thể thực hiện công việc phát triển.

<a id="install-and-sign-in"></a>

## Cài đặt và đăng nhập

1. Mở menu ảnh đại diện trong Studio và chọn **Use Studio in your agent**.
2. Sao chép hướng dẫn thiết lập sang agent lập trình.
3. Sau khi agent cài CLI, mở URL đăng nhập agent cung cấp và cấp quyền trong trình duyệt.
4. Agent kiểm tra danh tính rồi cài Skill của CLI.

![Sao chép hướng dẫn thiết lập Studio sang agent lập trình cục bộ](https://static-docs.nocobase.com/studio-en-guide-local-agent-20261031.png)

Cần Node.js 24 trở lên và npm. Package lấy từ bản Studio đang dùng và khớp phiên bản của bản đó. Liên kết tải xuống hết hạn sau 30 phút. Tạo liên kết mới nếu cần.

`nb-studio` dùng quyền của tài khoản đã đăng nhập. Giữ lệnh đăng nhập chạy đến khi cấp quyền xong trong trình duyệt.

<a id="ask-for-work"></a>

## Giao việc cho agent

Yêu cầu liệt kê các đầu việc đang chờ mình theo mức khẩn cấp:

```prompt
List the Studio tasks waiting for me, ordered by urgency.
```

Yêu cầu đọc tài liệu và tạo đầu việc, rồi giữ chúng ở trạng thái chưa bắt đầu:

```prompt
Read docs/supplier-rating.md and create tasks in Supplier Management for its requirements. Do not start them yet.
```

Yêu cầu tìm lý do đầu việc đang bị chặn và nêu thông tin cần bổ sung:

```prompt
Find out what is blocking PUR-23 and tell me what information I need to provide.
```

Cũng có thể gửi URL đầu việc Studio cho agent.

<a id="check-the-connection"></a>

## Kiểm tra kết nối

```bash
nb-studio whoami
nb-studio docs
```

`whoami` hiển thị danh tính hiện tại. `docs` liệt kê các lệnh trên máy chủ đang kết nối. Xem [Lệnh nb-studio](../reference/cli.md).

Để trò chuyện trong trình duyệt Studio, dùng [Runner Agent](runner-agent.md) hoặc [kết nối máy tính](connect-computer.md).
