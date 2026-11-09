---
title: Nền tảng Git
description: Kết nối kho mã của nhóm và cấu hình quyền truy cập cùng cơ chế cập nhật trạng thái.
---

Quản trị viên quản lý kết nối của nhóm trong **Settings › Git**. Dự án dùng các kết nối này để truy cập kho, mở PR và đọc kết quả kiểm tra. Về cấp quyền Git cá nhân cho thành viên, xem [Đăng nhập và cài đặt cá nhân](../join/sign-in.md).

![Quản lý kết nối Git của nhóm](https://static-docs.nocobase.com/studio-en-guide-git-20261031.png)

<a id="github"></a>

## Kết nối GitHub

Kết nối GitHub hoặc GitHub Enterprise Server bằng GitHub App. Xem [Kết nối nền tảng Git](../setup/git.md) để biết các bước tạo và cài ứng dụng.

| Quyền truy cập kho | Khi nào dùng |
| --- | --- |
| All repositories | Studio cần tạo kho mã mới |
| Only select repositories | Studio chỉ cần truy cập các kho hiện có đã chọn |

Có thể nhập thủ công cấu hình của GitHub App hiện có. Dùng **Add installation** để thêm một lượt cài đặt khác của cùng GitHub App. Nếu kho mới chưa xuất hiện, kiểm tra tài khoản đã cài ứng dụng và phạm vi truy cập kho.

<a id="gitlab"></a>

## Kết nối GitLab

1. Tạo token truy cập nhóm có phạm vi `api` và vai trò Developer.
2. Thêm kết nối GitLab trong Studio bằng địa chỉ máy chủ và thông tin xác thực.
3. Sau khi lưu, kiểm tra nhóm, quyền và thời hạn.

Quyền Developer cho phép đẩy nhánh, làm việc với merge request và đọc pipeline. Để tự động tạo webhook cần quyền Maintainer. Nếu chỉ có quyền Developer, dùng truy vấn định kỳ.

<a id="webhooks-and-polling"></a>

## Webhook và truy vấn định kỳ

Bật webhook nếu nền tảng mã nguồn có thể truy cập Studio qua HTTPS. Với mạng riêng hoặc địa chỉ cục bộ, tắt webhook. Studio truy vấn PR và kết quả kiểm tra mỗi phút một lần.

Thẻ kết nối hiển thị trạng thái kết nối, số lượng kho và trạng thái webhook. Cập nhật thông tin xác thực trước khi hết hạn. Để kết nối mã hiện có, xem [Cài đặt dự án](../project/settings.md#connect-an-existing-repository).
