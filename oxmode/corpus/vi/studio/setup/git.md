---
title: Kết nối nền tảng Git
description: Kết nối GitHub để Studio có thể tạo kho mã, gửi thay đổi và mở PR.
---

Kết nối nền tảng Git để Studio có thể tạo kho mã và agent có thể đẩy mã, mở PR.

Hướng dẫn dùng GitHub làm ví dụ. Với GitLab và các lựa chọn khác, xem [Cấu hình nền tảng mã nguồn](../configure/git.md).

<a id="connect-github"></a>

## Kết nối GitHub

1. Mở **Settings › Integrations › Git**, chọn **Add connection** rồi chọn **GitHub**.
2. Chọn tài khoản hoặc tổ chức. Nếu chọn tổ chức, nhập tên tổ chức.
3. Bật **Webhook** để nhận cập nhật về PR và kết quả kiểm tra sớm. Khi thử cục bộ hoặc triển khai trong mạng riêng mà nền tảng Git không thể kết nối tới Studio, tắt tùy chọn này. Studio sẽ truy vấn cập nhật định kỳ.
4. Chọn **Create on GitHub**, đặt tên cho GitHub App rồi xác nhận.
5. Cài GitHub App trên tài khoản hoặc tổ chức đích. Trong **Repository access**, chọn **All repositories** để ứng dụng có thể truy cập kho sẽ tạo ở bước tiếp theo.
6. Quay lại Studio.

![Ví dụ thử cục bộ, kết nối tổ chức GitHub với Webhook đang tắt](https://static-docs.nocobase.com/studio-en-setup-github-connection-20261030.png)

**All repositories** bao gồm các kho hiện có và các kho sẽ tạo sau này. Rà soát các quyền GitHub hiển thị. Việc tạo GitHub App và cài vào tổ chức cần quyền tương ứng.

<a id="check-the-connection"></a>

## Kiểm tra kết nối

Thẻ kết nối phải hiện **Connected** và số kho mã có thể truy cập.

![GitHub App đã kết nối với tổ chức](https://static-docs.nocobase.com/studio-en-setup-github-connected-20261030.png)

Tiếp theo, [kết nối môi trường chạy](shared-runtimes.md).

Xem [Nền tảng mã nguồn](../configure/git.md) để dùng GitHub App hiện có, giới hạn quyền vào các kho đã chọn, cấu hình webhook hoặc dùng nền tảng Git khác.
