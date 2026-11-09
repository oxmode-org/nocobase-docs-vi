---
title: Khóa API
description: Cấp quyền truy cập có giới hạn cho CI, script và tích hợp.
---

| Loại | Nơi quản lý | Danh tính và mục đích |
| --- | --- | --- |
| Khóa tổ chức | Settings › API keys | Độc lập với thành viên, dùng cho CI và tích hợp chạy lâu dài |
| Khóa cá nhân | Account settings › API keys | Hoạt động dưới danh tính chủ sở hữu, dùng cho script cá nhân |

Khóa tổ chức chỉ có các quyền đã chọn. Khóa cá nhân còn chịu giới hạn theo quyền hiện tại của chủ sở hữu. Với CI của kho mã, dùng khóa được tạo từ [Cấu hình kiểm tra](../configure/checks.md).

<a id="create-a-key"></a>

## Tạo khóa

1. Chọn **Create key**, nhập tên và mục đích.
2. Chọn cấu hình có sẵn, rồi thu hẹp phạm vi xuống dự án hoặc ứng dụng cụ thể khi cần.
3. Chọn thời hạn. Mặc định là 90 ngày.
4. Lưu giá trị ngay sau khi tạo vì hệ thống chỉ hiển thị một lần.

![Tạo khóa tổ chức có quyền giới hạn](https://static-docs.nocobase.com/studio-en-guide-api-keys-20261031.png)

**CI deploy** cho phép tải lên và triển khai đến các ứng dụng đã chọn. **CI upload** chỉ cho tải lên. **Read only** cho đọc dữ liệu được phép. Người tạo chỉ có thể cấp những quyền mình đang có.

Quản lý khóa khác và tài khoản thành viên nằm ngoài phạm vi của các khóa này. Để triển khai vào môi trường được bảo vệ, gửi yêu cầu và chờ người có thẩm quyền phê duyệt.

<a id="maintain-keys"></a>

## Quản lý khóa

- **Rotate** giữ tên và quyền, tạo giá trị mới và vô hiệu hóa ngay giá trị cũ. Cập nhật CI hoặc script cùng lúc.
- **Disable** dừng truy cập ngay. Có thể bật lại khi cần.
- **Delete** thu hồi quyền truy cập và giữ định danh của khóa trong các bản ghi cũ.

Lịch sử khóa tổ chức ghi việc tạo, đổi quyền, xoay vòng và vô hiệu hóa. Khóa do kho mã quản lý hiển thị nguồn tạo. Vô hiệu hóa khóa sẽ ảnh hưởng đến việc báo kết quả pipeline và triển khai của kho đó.

Để chặn tạo khóa cá nhân mới, gỡ quyền tạo khóa cá nhân khỏi vai trò. Vẫn có thể xem và thu hồi các khóa hiện có.
