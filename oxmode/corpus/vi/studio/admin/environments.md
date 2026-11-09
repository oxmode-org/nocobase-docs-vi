---
title: Môi trường được lưu trữ
description: Cấu hình chế độ chạy, biến và chính sách vòng đời cho ứng dụng xem trước và kiểm thử.
---

Quản trị viên thêm và duy trì môi trường trong **Hosted environments**. Mỗi môi trường phục vụ xem trước hoặc kiểm thử và có ứng dụng, biến và chính sách vận hành riêng.

![Chế độ chạy và chính sách cho bản xem trước và kiểm thử](https://static-docs.nocobase.com/studio-en-guide-environments-20261031.png)

<a id="add-an-environment"></a>

## Thêm môi trường

1. Chọn **Add environment** rồi nhập tên và ID, chẳng hạn **Staging** và `staging`.
2. Chọn mục đích và chế độ chạy.
3. Đặt mẫu URL công khai, chẳng hạn `https://apps.example.com/{appId}/`. Chuẩn bị DNS và chứng chỉ nếu dùng tên miền phụ.
4. Đặt số lượng ứng dụng tối đa, chính sách dừng và ngủ sâu theo nhu cầu. Kiểm tra kết nối rồi lưu.

Chế độ mặc định chạy ứng dụng dưới dạng tiến trình con và dùng gói đầu ra dạng tệp nén. Khi bật lưu trữ bằng Docker, ứng dụng kiểm thử có thể chạy trong container riêng. Chế độ này cần image và quyền kéo từ registry. Xem [Tham chiếu cấu hình](../reference/config.md).

Triển khai production trên hạ tầng riêng của đội ngũ.

<a id="deliver-test-applications"></a>

## Bàn giao ứng dụng kiểm thử

Thêm ứng dụng kiểm thử từ trang phát hành của dự án hoặc để CI tạo ứng dụng khi báo kết quả lần đầu. Hộp thoại triển khai cung cấp prompt cho agent, cách thiết lập CI và lệnh thủ công.

Dùng CI kích hoạt khi đẩy nhánh để kiểm thử liên tục. Xem [Kiểm tra và CI](../configure/checks.md). Trang chi tiết ứng dụng hiển thị lịch sử triển khai, log và các thao tác dừng, đánh thức, xóa.

<a id="configure-variables"></a>

## Cấu hình biến

Giá trị cấp môi trường áp dụng cho mọi ứng dụng trong môi trường đó. Giá trị riêng của ứng dụng được ưu tiên. Nếu thiếu biến bắt buộc, hệ thống dừng triển khai và liệt kê các biến cần đặt. Sau khi đổi giá trị, áp dụng thay đổi rồi khởi động lại ứng dụng.

Giá trị bí mật được mã hóa và ẩn sau khi lưu. Biến ứng dụng được cấu hình riêng với [Biến thực thi của agent](../project/settings.md#agent-run-variables).

<a id="protected-environments-and-approvals"></a>

## Môi trường được bảo vệ và phê duyệt

Bật bảo vệ và chỉ định người phê duyệt khi cần duyệt việc đưa bản dựng vào kiểm thử. Thao tác triển khai và rollback tạo yêu cầu. Người phê duyệt kiểm tra ứng dụng và gói đầu ra trong hộp thư trước khi duyệt. Khóa API có thể gửi yêu cầu. Việc triển khai vào môi trường được bảo vệ cần người phê duyệt.

<a id="roll-back"></a>

## Khôi phục lần triển khai trước

Chọn một lần triển khai trước trong lịch sử ứng dụng hoặc dùng `nb-studio app rollback`. Môi trường được bảo vệ vẫn cần phê duyệt.

Rollback chỉ khôi phục bản ứng dụng. Sao lưu dữ liệu kiểm thử trước khi triển khai nếu cần giữ dữ liệu. Studio tính lại dấu triển khai của đầu việc và giữ nguyên trạng thái đầu việc.
