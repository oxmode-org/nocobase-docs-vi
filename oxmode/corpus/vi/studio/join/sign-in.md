---
title: Đăng nhập và cài đặt cá nhân
description: Chấp nhận lời mời, đăng nhập và quản lý hồ sơ, thông báo cùng danh tính Git.
---

<a id="accept-an-invitation"></a>

## Chấp nhận lời mời

Mở email hoặc liên kết mời do quản trị viên gửi. Lời mời có hiệu lực bảy ngày.

1. Kiểm tra địa chỉ email, rồi nhập tên và mật khẩu dài ít nhất tám ký tự.
2. Chọn **Create account and join**.
3. Mở dự án được giao từ **My issues**.

Nếu email đã có tài khoản, đăng nhập bằng tài khoản đó. Nếu trình duyệt đang dùng tài khoản khác, đăng xuất trước. Nhờ quản trị viên gửi lại lời mời đã hết hạn hoặc bị thu hồi.

<a id="sign-in"></a>

## Đăng nhập

Mở địa chỉ quản trị viên cung cấp, chẳng hạn `https://studio.example.com/main/`. Nhập tên người dùng hoặc email và mật khẩu.

Nếu quên mật khẩu, chọn **Forgot password?** và làm theo hướng dẫn trong email. Nếu thiếu tùy chọn này hoặc không nhận được email, nhờ quản trị viên kiểm tra [email đặt lại mật khẩu](../admin/notifications.md). Chủ sở hữu có quyền cũng có thể đặt lại mật khẩu.

<a id="personal-settings"></a>

## Cài đặt cá nhân

Mở menu ảnh đại diện rồi chọn **Account settings**.

| Trang | Cài đặt |
| --- | --- |
| Profile | Tên hiển thị và tên người dùng. Liên hệ chủ sở hữu để đổi email |
| Account and security | Đổi mật khẩu. Thao tác này đăng xuất các thiết bị khác |
| Preferences | Ngôn ngữ, chủ đề, mật độ hiển thị, âm thanh, thông báo trên máy tính và ghi nhận tác giả commit |
| API keys | Tạo khóa để gọi Studio dưới danh tính của mình |
| Git | Kết nối tài khoản cá nhân trên nền tảng lưu trữ mã |

![Đặt tùy chọn giao diện, thông báo và ghi nhận tác giả commit](https://static-docs.nocobase.com/studio-en-guide-preferences-20261031.png)

Tùy chọn giao diện đi theo tài khoản. Đăng ký thông báo đẩy theo từng thiết bị và cần HTTPS. Trên iPhone, mở Studio từ màn hình chính. Xem [Thông báo và thông báo đẩy](../admin/notifications.md).

Mặc định, việc ghi nhận tác giả commit theo cài đặt dự án. Có thể chọn ghi agent là đồng tác giả.

<a id="connect-your-own-git-account"></a>

## Kết nối tài khoản Git cá nhân

Trong **Account settings › Git**, kết nối GitHub hoặc nền tảng đã cấu hình khác rồi làm theo các bước cấp quyền.

Agent dùng danh tính của người dùng để đẩy mã và mở PR. Khi hợp nhất trong Studio, hệ thống cũng dùng danh tính đó. Nếu chưa kết nối tài khoản cá nhân, Studio dùng kết nối của workspace. Tài khoản cần có quyền truy cập kho mã.

![Kết nối Git cá nhân cung cấp danh tính để thay đổi mã và hợp nhất](https://static-docs.nocobase.com/studio-en-guide-personal-git-20261031.png)

Nếu không cấp quyền được qua trình duyệt, **Other methods** cung cấp mã thiết bị hoặc token cá nhân. Quản trị viên quản lý các tùy chọn này trong [Nền tảng mã nguồn](../configure/git.md). Token được mã hóa và chỉ hiển thị một lần.

Tiếp tục với [yêu cầu đầu tiên](../../getting-started/collaborate-with-studio.md).
