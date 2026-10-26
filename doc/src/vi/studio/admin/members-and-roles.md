---
title: Thành viên và vai trò
description: Quản lý tài khoản và vai trò của nhóm: mời người, sửa hồ sơ, vô hiệu hóa tài khoản và đặt lại mật khẩu, và dùng vai trò có sẵn hoặc tùy chỉnh để quyết định mỗi người được làm gì.
---

Bạn quản lý thành viên trong **Settings › Members** và vai trò trong **Settings › Roles**. Agent làm việc thay mặt người đã bắt đầu công việc và không bao giờ có nhiều quyền hơn người đó, nên vai trò của một thành viên cũng quyết định các Agent làm việc cho họ được làm gì.

## Thành viên

**Settings › Members** liệt kê mọi tài khoản cùng vai trò của họ. Bạn có thể lọc theo trạng thái và tìm theo tên, tên đăng nhập hoặc email.

- **Mời**: bấm **Invite members**. Xem [Mời thành viên](../setup/invite.md). Mọi người tham gia Studio qua lời mời, và tự đăng ký đã tắt.
- **Vai trò**: giao hoặc thu hồi vai trò của một người. Thành viên mới nhận **Default role for new members** đặt trong **Settings › General** khi tham gia lần đầu.
- **Vô hiệu hóa và kích hoạt**: khi ai đó rời nhóm, hãy vô hiệu hóa tài khoản của họ. Tài khoản không bị xóa, và công việc họ đã bắt đầu cùng các bản ghi được giữ lại. Bạn có thể kích hoạt lại khi cần. Tài khoản đã vô hiệu hóa không được giao vai trò.
- **Sửa hồ sơ và đặt lại mật khẩu**: đổi tên, tên đăng nhập và email của người khác, hoặc đặt lại mật khẩu cho họ. Mật khẩu của chính bạn thì đổi trong **Account settings › Account and security**.

Ai được làm gì:

| Thao tác | Ai |
| --- | --- |
| Xem tài khoản và vai trò | Mọi thành viên |
| Mời thành viên | Admin và Owner |
| Giao vai trò và định nghĩa vai trò | Admin và Owner |
| Vô hiệu hóa tài khoản, sửa hồ sơ người khác và đặt lại mật khẩu cho người khác | Owner |

Chỉ Owner mới được thay đổi tài khoản của một Owner, và chỉ Owner mới được giao hoặc thu hồi vai trò Owner. Owner cuối cùng không thể tự bỏ vai trò Owner của mình.

## Vai trò có sẵn

| Vai trò | Cho phép |
| --- | --- |
| Member | Mọi trang. Nêu yêu cầu và làm các issue liên quan đến mình. Quản lý cài đặt và cơ sở tri thức trong các dự án mình làm trưởng. Kết nối runtime cá nhân và tạo API key riêng. Xem mọi cài đặt |
| Admin | Mọi trang, mọi thao tác nghiệp vụ và mọi cài đặt: kết nối runtime dùng chung, bật Agent, quản lý môi trường triển khai, kết nối Git và API key của tổ chức, giao và định nghĩa vai trò |
| Owner | Mọi việc Admin làm được, cộng thêm quản lý tài khoản: vô hiệu hóa tài khoản, sửa hồ sơ và đặt lại mật khẩu |

Quản trị viên đầu tiên được tạo khi cài Studio cũng là một Owner, và là quản trị viên hệ thống. Quản trị viên hệ thống có mọi quyền, và vai trò của tài khoản này không được quản lý ở đây.

## Vai trò tùy chỉnh

Khi các vai trò có sẵn không phù hợp, bấm **New role** trong **Settings › Roles**, hoặc dùng **Duplicate as new role** trên một vai trò có sẵn rồi điều chỉnh.

Trình chỉnh sửa vai trò có ba nhóm:

| Nhóm | Bao gồm |
| --- | --- |
| Pages | Vai trò được mở những trang nào |
| Settings | Vai trò được xem hoặc quản lý những cài đặt nào, như kết nối Git, API key, vai trò và tài khoản |
| Business operations | Vai trò được làm gì với issue, dự án, ứng dụng và cơ sở tri thức, mỗi thứ ở một trong ba mức: **None**, **Related** hoặc **All** |

**Related** nghĩa là gì tùy theo từng thao tác, và trình chỉnh sửa giải thích rõ. Ví dụ:

- Sửa cơ sở tri thức: không gian tri thức của các dự án tôi làm trưởng. Tri thức hệ thống cần **All**.
- Triển khai ứng dụng: các ứng dụng tôi tạo, và các ứng dụng liên kết với dự án tôi làm trưởng.

Vai trò Owner có mọi quyền và không sửa được. Vai trò có sẵn không xóa được. Một vai trò vẫn còn người đang giữ, hoặc đang là vai trò mặc định cho thành viên mới, phải được thay đổi trước khi xóa.

> [!NOTE] Không có giới hạn trên cho quyền mà một vai trò có thể cấp
> Ai định nghĩa được vai trò đều có thể đưa bất kỳ quyền nào vào một vai trò, kể cả vai trò của chính mình. Chỉ cấp "Give and take roles" và "Create, edit and delete roles" cho người bạn tin tưởng.
