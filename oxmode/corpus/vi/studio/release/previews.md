---
title: Bản xem trước PR
description: Mở ứng dụng của một PR và kiểm chứng thay đổi trước khi hợp nhất.
---

Bản xem trước PR là ứng dụng cô lập chạy một commit cụ thể. Trước tiên, [cấu hình kiểm tra và bản xem trước](../configure/checks.md) cho kho mã. Nếu nguồn kiểm tra là CI, CI xuất bản bản xem trước. Nếu nguồn là agent tự kiểm tra, agent thực hiện công việc sẽ xuất bản.

<a id="open-a-preview"></a>

## Mở bản xem trước

Dùng tab **Code & previews** của đầu việc để xem URL, commit và trạng thái build. **Releases › Previews** liệt kê mọi bản xem trước của dự án đã chọn.

![Bản xem trước PR và trạng thái build](https://static-docs.nocobase.com/studio-en-guide-previews-20261031.png)

Khi có commit mới, bản xem trước cập nhật sau khi build mới hoàn tất. Trước khi nghiệm thu, xác nhận bản xem trước khớp với thay đổi sắp được hợp nhất.

Lần triển khai đầu nạp dữ liệu mẫu. Chỉ người có quyền chỉnh sửa đầu việc liên kết mới thấy thông tin đăng nhập quản trị viên ban đầu. Nếu thiếu biến bắt buộc, đặt biến trên môi trường xem trước hoặc ứng dụng cụ thể theo chỉ dẫn.

<a id="skip-a-preview"></a>

## Bỏ qua bản xem trước

Bật **No preview needed** trong thuộc tính đầu việc. Agent thêm nhãn `no-preview` vào PR và mẫu CI được tạo sẽ bỏ qua bước xem trước khi có nhãn đó. Bản xem trước hiện có vẫn được giữ.

<a id="lifecycle"></a>

## Vòng đời

Có thể đổi chính sách mặc định sau trong [Môi trường được lưu trữ](../admin/environments.md).

| Điều kiện | Hành vi |
| --- | --- |
| Không có lượt truy cập trong 10 phút | Dừng tiến trình và khởi động lại ở lần truy cập tiếp theo |
| Không có lượt truy cập trong 24 giờ | Chuyển sang trạng thái ngủ sâu và xóa tệp đã giải nén, đồng thời giữ cấu hình và dữ liệu |
| PR được hợp nhất, đóng hoặc bản xem trước bị hủy | Xóa bản xem trước cùng dữ liệu |

Giới hạn mặc định là 20 bản xem trước. Ứng dụng đang ngủ sâu mất nhiều thời gian chuẩn bị hơn ở lần truy cập tiếp theo.

Bản xem trước chạy dưới dạng tiến trình con do Studio khởi động. Khi dùng cho cả nhóm, cấu hình tên miền xem trước riêng và tài khoản hệ điều hành có quyền giới hạn. Xem [Tham chiếu cấu hình](../reference/config.md).
