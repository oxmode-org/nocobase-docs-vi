---
title: Cài đặt dự án
description: Chế độ hiển thị, thành viên và trưởng dự án, các repository, biến và khóa bí mật Agent nhận khi chạy, cách ghi công commit, và các Skill mặc định của một dự án.
---

Trưởng dự án quản lý cài đặt của dự án. Người tạo dự án mặc định là trưởng dự án, và quản trị viên quản lý được mọi dự án.

Trang dự án có sáu mục ở trên cùng: **Overview**, **Issues**, **Knowledge**, **Members**, **Releases** và **Settings**. Về cơ sở tri thức, xem [Cơ sở tri thức](knowledge-base.md). Về phát hành, xem [Duyệt phát hành và rollback](release.md). Về trang tổng quan, xem [Tiến độ dự án](progress.md).

## Chế độ hiển thị, trưởng dự án và thành viên

- **Visibility**: với **Everyone**, mọi thành viên trong workspace đều thấy dự án. Với **Members only**, chỉ thành viên dự án và quản trị viên thấy dự án cùng các issue của nó.
- **Lead**: trong **Members**, bấm **Set as lead** cho một thành viên. Trưởng dự án phải là thành viên dự án. Muốn bỏ trưởng dự án hiện tại, hãy chọn trưởng dự án mới trước.
- **Members**: trong **Members**, tìm theo tên để thêm người, hoặc gỡ họ ra. Để mời đồng nghiệp chưa tham gia Studio, xem [Mời thành viên](../setup/invite.md). Bạn có thể chọn dự án này ngay trong lời mời.
- **Trạng thái, độ ưu tiên và ngày**: đặt trong thuộc tính của dự án. Danh sách dự án sắp xếp và lọc theo các trường này. Trạng thái dự án là Planned, In progress, Paused, Completed hoặc Cancelled.

## Cài đặt

**Settings** có sáu mục:

| Mục | Tác dụng |
| --- | --- |
| General | Tên và mô tả dự án, và cách ghi công các commit của Agent |
| Code repositories | Các repository dự án dùng. Repository đầu tiên là repository chính, nơi công việc bắt đầu. Bạn có thể thêm, sắp xếp lại và gỡ bỏ |
| Deployment | Cách CI của repository build preview và triển khai lên Studio. Xem [Kết nối CI](../setup/ci.md) |
| Branch rules | Agent làm việc trên nhánh nào, PR nào được liên kết với issue, và khi nào kết quả kiểm tra đánh thức Agent điều phối. Xem [Kiểm tra và review](checks-and-review.md) |
| Agent run variables | Biến và khóa bí mật Agent nhận khi làm việc trong dự án này. Xem bên dưới |
| Default skills | Các Skill mà mọi lượt chạy mặc định mang theo, cho dự án hoặc cho một repository. Xem [Skill](skills.md) |

### Repository mã nguồn

Một dự án có thể có nhiều repository, ví dụ ứng dụng và các plugin của nó để riêng. Repository đầu tiên là repository chính, nơi issue mặc định bắt đầu. Gỡ một repository chỉ có nghĩa là issue không làm việc trong đó nữa. Bản thân repository không bị động đến.

Trong dự án không có repository, Agent chỉ làm được các issue không liên quan đến mã. Mục **Next steps** trên trang tổng quan dự án sẽ nhắc bạn **Add a code repository**.

### Ghi công commit

Agent commit mã dưới tên người đã bắt đầu công việc. Mỗi người có thể chọn trong **Account settings › Preferences** có ghi thêm Agent làm đồng tác giả trong commit của mình không. Thiết lập ở đây là mặc định cho những ai chưa chọn.

### Biến cho lượt chạy của Agent

Đặt ở đây các biến môi trường Agent cần khi chạy, như địa chỉ API dùng để test hoặc key của một dịch vụ bên thứ ba:

- Đặt cho cả dự án hoặc chỉ cho một repository. Biến của repository ghi đè biến cùng tên của dự án, và biến riêng của Agent ghi đè cả hai.
- Sau khi lưu, giá trị không hiển thị lại, và được che trong bản ghi lượt chạy. Nếu thật sự cần xem, bấm **Reveal values**. Mỗi lần xem được ghi vào nhật ký truy cập kèm tên bạn và thời điểm.
- **From the runtime**: giá trị không được lưu ở đây. Thay vào đó, runtime nhận việc cung cấp nó từ chính máy của mình, nơi nó được đặt bằng `nocobase-runner env set NAME`. Trên runtime không cung cấp biến này, lượt chạy thất bại trước khi bắt đầu.
- Với khóa bí mật có rủi ro cao, chọn **Shared runtimes only**. Khi đó các lượt chạy dùng biến này chỉ do runtime dùng chung thực hiện và không bao giờ được gửi đến runtime cá nhân của thành viên.

Các biến mà ứng dụng đã triển khai đọc, kể cả preview, không đặt ở đây. Hãy đặt theo từng môi trường hoặc từng ứng dụng trong quản lý phát hành.

## Xóa dự án

Bạn có thể xóa dự án từ **More project actions**, cần quyền quản trị viên. Dự án, thành viên và các liên kết repository của nó bị xóa. Các issue của dự án được giữ lại và không còn thuộc dự án nào. Repository trên nền tảng lưu trữ mã không bị ảnh hưởng.
