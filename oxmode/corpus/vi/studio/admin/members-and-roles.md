---
title: Thành viên và vai trò
description: Quản lý tài khoản, vai trò và quyền truy cập của nhóm.
---

Quản lý tài khoản trong **Settings › Members** và quyền trong **Settings › Roles**. Công việc của agent cũng bị giới hạn bởi quyền của người yêu cầu và các thao tác agent được phép thực hiện.

![Tài khoản, vai trò và trạng thái thành viên](https://static-docs.nocobase.com/studio-en-guide-members-20261031.png)

<a id="manage-members"></a>

## Quản lý thành viên

Tìm theo tên, tên người dùng hoặc email và lọc theo trạng thái hoạt động hoặc vô hiệu hóa. Thành viên mới tham gia qua [lời mời](../setup/invite.md). Đặt vai trò mặc định cho họ trong **Settings › General**.

| Thao tác | Vai trò được phép theo mặc định |
| --- | --- |
| Xem tài khoản và vai trò | Thành viên, quản trị viên và chủ sở hữu |
| Mời thành viên, gán và tạo vai trò | Quản trị viên và chủ sở hữu |
| Sửa tài khoản người khác, vô hiệu hóa tài khoản và đặt lại mật khẩu | Chủ sở hữu |

Vô hiệu hóa tài khoản sẽ chặn việc sử dụng tiếp và giữ lịch sử công việc. Bật lại khi cần. Thành viên đổi mật khẩu của mình trong **Account settings › Account & security**.

Chỉ chủ sở hữu được cấp hoặc gỡ vai trò chủ sở hữu. Hệ thống giữ ít nhất một chủ sở hữu. Quản trị viên hệ thống ban đầu có toàn quyền và được quản lý ngoài phần chỉnh vai trò này.

<a id="built-in-roles"></a>

## Vai trò tích hợp

- **Member** có thể gửi yêu cầu, xử lý đầu việc liên quan, quản lý dự án mình phụ trách và kết nối môi trường chạy cá nhân.
- **Admin** có thể quản lý cài đặt nghiệp vụ, môi trường chạy dùng chung, agent, kết nối Git, khóa tổ chức và vai trò.
- **Owner** có quyền của Admin và quyền quản trị tài khoản.

Chế độ hiển thị của dự án xác định thành viên thường truy cập được dự án nào. Xem [Trạng thái và quyền của đầu việc](../reference/statuses-and-permissions.md) về quyền nghiệp vụ.

<a id="custom-roles"></a>

## Vai trò tùy chỉnh

Tạo vai trò hoặc sao chép vai trò hiện có rồi điều chỉnh quyền trên trang, cài đặt và thao tác nghiệp vụ.

![Xem và duy trì vai trò của nhóm](https://static-docs.nocobase.com/studio-en-guide-roles-20261031.png)

Với từng thao tác nghiệp vụ, có thể chặn truy cập, cho phép với bản ghi liên quan hoặc cho phép với mọi bản ghi. Trình chỉnh sửa giải thích thế nào là bản ghi liên quan trong từng thao tác, chẳng hạn dự án do thành viên phụ trách. Quyền trang kiểm soát điểm truy cập, còn quyền nghiệp vụ kiểm soát thao tác.

Gỡ các thành viên đang được gán và bỏ tham chiếu trong cấu hình vai trò mặc định trước khi xóa vai trò. Người quản lý vai trò có thể cấp quyền rộng, nên chỉ giao khả năng này cho thành viên phụ trách quản lý truy cập.
