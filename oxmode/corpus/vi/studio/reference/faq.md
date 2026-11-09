---
title: Xử lý sự cố
description: Chẩn đoán các vấn đề thường gặp khi cài đặt, kết nối Git, thực thi đầu việc và bàn giao.
---

Gửi cho agent lập trình cục bộ triệu chứng, đầu việc liên quan và thông báo lỗi để điều tra. Giữ mật khẩu và token ngoài prompt. Agent đã kết nối Studio có thể truy vấn trạng thái bằng `nb-studio`.

<a id="installation-and-sign-in"></a>

## Cài đặt và đăng nhập

| Vấn đề | Mục cần kiểm tra |
| --- | --- |
| Không thấy trang đăng nhập | Dùng `https://studio.example.com/main/`, kiểm tra tình trạng container và reverse proxy |
| Tài khoản ban đầu không đăng nhập được | Kiểm tra tên người dùng và mật khẩu quản trị ban đầu. Để đặt lại mật khẩu cho tài khoản hiện có, dùng quy trình khôi phục |
| Container liên tục khởi động lại | Đọc `docker compose logs --tail=100 studio` rồi kiểm tra cấu hình, kết nối cơ sở dữ liệu và quyền vùng lưu trữ |
| Đã cấp quyền nhưng CLI chưa đăng nhập | Giữ lệnh đăng nhập chạy. Nếu mã hết hạn, thử lại với mã mới |

Xem [Triển khai Studio](../setup/install.md) và [Thông báo và thông báo đẩy](../admin/notifications.md) về khôi phục mật khẩu.

<a id="git-connections"></a>

## Kết nối Git

Nếu GitHub từ chối URL webhook riêng tư, tắt webhook và dùng truy vấn định kỳ. Nếu không truy cập được kho vừa tạo, kiểm tra phạm vi cài đặt của GitHub App. Cấp quyền truy cập rồi kết nối dưới dạng [kho mã hiện có](../project/settings.md#connect-an-existing-repository).

Để tài khoản Git cá nhân có thể đẩy thay đổi cho PR, cấp quyền ghi hoặc dùng kết nối của workspace theo chính sách của nhóm. Xem [Nền tảng Git](../configure/git.md).

<a id="runtimes-and-tasks"></a>

## Môi trường chạy và đầu việc

| Triệu chứng | Bước tiếp theo |
| --- | --- |
| Môi trường chạy ngoại tuyến | Chạy `nocobase-runner status` trên máy rồi kiểm tra dịch vụ và mạng |
| Thiếu công cụ hoặc công cụ đã đăng xuất | Cài và đăng nhập bằng tài khoản hệ điều hành chạy dịch vụ rồi kiểm tra lại |
| Công cụ chạy trong terminal nhưng dịch vụ không tìm thấy | Chạy `nocobase-runner service install` từ terminal có thể chạy công cụ |
| Đầu việc chưa bắt đầu | Kiểm tra trạng thái, đầu việc tiền nhiệm, bước khởi tạo và lý do chờ |
| Công việc tạm dừng sau nhiều lượt chạy | Xem giới hạn lượt chạy của đầu việc và các lỗi lặp lại trước khi tiếp tục |
| Công cụ hết hạn mức | Chờ hạn mức phục hồi hoặc dùng mô hình khác. Sau khi phục hồi, xóa dấu chưa rõ thời điểm đặt lại |

Dùng **Start** cho đầu việc trong Backlog. Đầu việc có thể chờ khi các môi trường dùng chung đang bận. Xem [Theo dõi tiến độ](../use/follow-progress.md).

<a id="checks-previews-and-merging"></a>

## Kiểm tra, xem trước và hợp nhất

Khi thiếu kết quả, kiểm tra nguồn đã chọn cho kho mã. Studio chỉ lấy kết quả từ một nguồn, gồm CI của nền tảng mã, CI bên ngoài hoặc agent tự kiểm tra. Xem [Kiểm tra và CI](../configure/checks.md).

Nếu thiếu bản xem trước, kiểm tra bản ghi build, kết nối CI tới Studio, các biến bắt buộc và nhãn `no-preview`. Bản xem trước đã dừng hoặc ngủ sâu sẽ khởi động lại khi truy cập.

Xử lý xung đột, trạng thái nháp hoặc bước kiểm tra đang chờ trước khi hợp nhất. Để bỏ qua kiểm tra thất bại hoặc thiếu kết quả, cần có quyền tương ứng và vẫn phải tuân theo quy tắc bảo vệ của nền tảng mã.

Nếu đầu việc chưa cập nhật sau khi hợp nhất PR, chờ đồng bộ rồi kiểm tra mọi PR liên kết đã được hợp nhất chưa.

<a id="email-and-delivery"></a>

## Email và bàn giao

Nếu gửi email mời thất bại, sao chép liên kết mời. Kiểm tra riêng cấu hình người gửi của lời mời và đặt lại mật khẩu trong [Thông báo và thông báo đẩy](../admin/notifications.md).

Triển khai vào môi trường kiểm thử được bảo vệ phải chờ phê duyệt. Sau khi triển khai production, người phụ trách dự án cần [ghi nhận phiên bản](../project/release.md#record-the-production-version) để Studio cập nhật dấu bàn giao.
