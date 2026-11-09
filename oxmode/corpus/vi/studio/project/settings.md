---
title: Cài đặt dự án
description: Quản lý thành viên, kho mã, biến thực thi và Skill mặc định của dự án.
---

Người phụ trách dự án và quản trị viên có thể đổi cài đặt dự án. Mở **Members** để quản lý quyền truy cập và **Settings** để cấu hình công việc phát triển.

<a id="members-and-visibility"></a>

## Thành viên và quyền xem

Tìm thành viên hiện có rồi thêm vào dự án. Người mới cần [tham gia Studio](../setup/invite.md). Có thể gán họ vào dự án ngay trong lời mời.

- **Everyone** cho phép mọi thành viên workspace xem dự án.
- **Project members only** giới hạn quyền truy cập cho thành viên dự án và quản trị viên.
- **Project lead** chọn người phụ trách trong số thành viên dự án. Chỉ định người mới trước khi gỡ người hiện tại.

Đổi trạng thái, mức ưu tiên và ngày trong thuộc tính dự án.

![Thành viên và người phụ trách dự án](https://static-docs.nocobase.com/studio-en-guide-project-members-20261031.png)

<a id="configure-the-project"></a>

## Cấu hình dự án

| Mục | Cài đặt |
| --- | --- |
| General | Tên, mô tả và cách ghi nhận tác giả commit mặc định |
| Code repositories | Kho mã, kiểm tra, quy tắc nhánh và bản xem trước |
| Agent run variables | Biến môi trường và giá trị bí mật cho đầu việc phát triển |
| Default skills | Skill dùng trong các lượt chạy của dự án hoặc kho mã |

![Cấu hình kiểm tra, quy tắc nhánh và bản xem trước cho từng kho mã](https://static-docs.nocobase.com/studio-en-guide-project-repositories-20261031.png)

Kho đầu tiên là kho chính. Gỡ liên kết trong Studio vẫn giữ kho trên nền tảng Git. Xem [Kiểm tra và CI](../configure/checks.md) và [Skill](skills.md) để biết cách cấu hình.

<a id="connect-an-existing-repository"></a>

### Kết nối kho mã hiện có

Trong **New project**, chọn **Existing repository** rồi chọn kho có thể truy cập qua kết nối Git. Với ứng dụng hiện có, thường chọn bỏ qua khởi tạo.

Để bổ sung cấu trúc ứng dụng, chọn **NocoBase application** hoặc khởi tạo theo prompt. Agent giữ các tệp hiện có và gửi thay đổi qua nhánh và PR để người phụ trách nghiệm thu. Cũng có thể thêm kho sau. Để bắt đầu với ứng dụng trống, xem [Tạo dự án đầu tiên](../setup/new-project.md).

<a id="commit-attribution"></a>

### Ghi nhận tác giả commit

Có thể ghi danh tính thành viên hoặc ghi thêm agent là đồng tác giả. Tùy chọn cá nhân của thành viên được ưu tiên hơn mặc định dự án.

<a id="agent-run-variables"></a>

### Biến thực thi của agent

Đặt biến cho toàn dự án hoặc một kho mã. Nếu trùng tên, giá trị cấp kho ghi đè cấp dự án, còn giá trị cấp agent ghi đè cả hai.

- Giá trị được ẩn sau khi lưu. Khi hiển thị một giá trị bí mật, Studio ghi lại người xem và thời điểm.
- Với giá trị do môi trường chạy cung cấp, chạy `nocobase-runner env set NAME` trên môi trường đó.
- Giới hạn biến ở môi trường chạy dùng chung nếu công việc dùng biến này phải chạy ngoài môi trường cá nhân.

Đặt biến cho ứng dụng xem trước và kiểm thử trong [Môi trường được lưu trữ](../admin/environments.md) hoặc trong cài đặt ứng dụng.

<a id="delete-a-project"></a>

## Xóa dự án

Quản trị viên có thể xóa dự án từ menu thao tác bổ sung. Các đầu việc vẫn còn và được tách khỏi dự án. Kho Git được giữ nguyên.
