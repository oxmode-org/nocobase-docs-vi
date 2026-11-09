---
title: Trạng thái và quyền của đầu việc
description: Tra trạng thái, chuyển tiếp thường gặp và thao tác con người hoặc agent được thực hiện.
---

<a id="task-states"></a>

## Trạng thái đầu việc

<div class="states" aria-label="Từ Backlog sang In progress, có thể chuyển qua lại với In review, rồi đến Done"><span class="st-pill"><span class="si backlog"></span>Backlog</span><span class="arrow">→</span><span class="st-pill"><span class="si progress"></span>In progress</span><span class="arrow">⇄</span><span class="st-pill"><span class="si review"></span>In review</span><span class="arrow">→</span><span class="st-pill"><span class="si done"></span>Done</span></div>
<div class="states" aria-label="Có thể chuyển qua lại giữa In progress và Blocked, hoặc hủy đầu việc chưa hoàn tất"><span class="st-pill"><span class="si progress"></span>In progress</span><span class="arrow">⇄</span><span class="st-pill"><span class="si blocked"></span>Blocked</span><span class="arrow">·</span><span>Đầu việc chưa hoàn tất</span><span class="arrow">→</span><span class="st-pill"><span class="si cancel"></span>Canceled</span></div>

| Trạng thái | Ý nghĩa |
| --- | --- |
| Backlog | Chưa bắt đầu và đang chờ lệnh bắt đầu |
| In progress | Nhóm agent đang làm việc |
| Blocked | Đang chờ thông tin, quyết định hoặc khôi phục |
| In review | Đã bàn giao và đang chờ người phụ trách nghiệm thu |
| Done | Đã nghiệm thu hoặc mọi PR liên kết đã hợp nhất |
| Canceled | Công việc đã bị hủy |

Danh sách trạng thái cố định cho mọi dự án. Người có quyền sửa đầu việc có thể đổi trạng thái. Agent điều phối chuyển công việc giữa In progress, Blocked và In review. Agent thực thi giữ nguyên trạng thái.

Dùng **Start** để giao đầu việc Backlog cho agent điều phối. Việc nhắc tên agent trong bình luận vẫn cần bước bắt đầu này.

<a id="common-permissions"></a>

## Quyền thường gặp

| Thao tác | Mặc định của thành viên | Mặc định của quản trị viên |
| --- | --- | --- |
| Xem và xử lý đầu việc | Dự án có thể truy cập và đầu việc liên quan | Tất cả |
| Cài đặt và tri thức dự án | Dự án mình phụ trách | Tất cả |
| Xóa dự án hoặc đầu việc | Không có quyền | Có quyền |
| Môi trường chạy | Kết nối và duy trì môi trường cá nhân | Quản lý môi trường dùng chung |
| Kết nối Git và khóa tổ chức | Không có quyền quản lý | Có quyền quản lý |
| Mời và gán vai trò | Không có quyền | Có quyền |
| Vô hiệu hóa tài khoản hoặc đặt lại mật khẩu người khác | Không có quyền | Do chủ sở hữu quản lý |

Quyền truy cập phụ thuộc cả chế độ hiển thị của dự án và quyền nghiệp vụ. Vai trò tùy chỉnh có thể đổi quyền mặc định. Xem [Thành viên và vai trò](../admin/members-and-roles.md).

<a id="agent-permissions"></a>

## Quyền của agent

Agent bị giới hạn bởi quyền của thành viên mà nó đại diện và các thao tác Studio cung cấp cho agent. Công việc trên đầu việc thường thay mặt người phụ trách. Cuộc trò chuyện thay mặt người gửi yêu cầu.

Agent thực thi có thể commit, đẩy nhánh và mở PR. Người dùng chịu trách nhiệm nghiệm thu, hợp nhất và quản lý thành viên cùng vai trò. Agent chỉ đọc kho tri thức. Thay đổi bộ nhớ dự án được rà soát trong PR của đầu việc.

Quyền xuất bản bản xem trước còn phụ thuộc vào nguồn kiểm tra của kho mã. Nếu chọn agent tự kiểm tra, agent có thể xuất bản bản xem trước cho PR của đầu việc. Xem [Kiểm tra và CI](../configure/checks.md).
