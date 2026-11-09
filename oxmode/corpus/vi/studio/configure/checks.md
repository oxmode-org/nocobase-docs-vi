---
title: Kiểm tra và CI
description: Chọn nguồn kiểm tra, cấu hình kiểm chứng, bản xem trước PR và triển khai kiểm thử.
---

Mở **Project settings › Code repositories** rồi chọn **Checks** trên thẻ kho mã. Mỗi kho có một nguồn kiểm tra. Studio chỉ dùng kết quả từ nguồn đã chọn.

| Nguồn | Bên chạy kiểm tra | Bên xuất bản bản xem trước |
| --- | --- | --- |
| CI của nền tảng mã | GitHub Actions, GitLab CI hoặc pipeline của nền tảng | Cùng pipeline |
| CI bên ngoài | Jenkins hoặc dịch vụ CI hiện có | Pipeline bên ngoài |
| Agent tự kiểm tra | Agent dùng script và hướng dẫn của dự án | Agent đang thực hiện đầu việc |

![Chọn nguồn kiểm tra và cấu hình bản xem trước cho kho mã](https://static-docs.nocobase.com/studio-en-guide-ci-20261031.png)

<a id="agent-self-check"></a>

## Agent tự kiểm tra

Chọn nguồn rồi lưu. Với nguồn này, agent chạy các bước kiểm tra của dự án, báo từng kết quả bằng `nb-studio check report`, rồi dựng và xuất bản bản xem trước PR. Có thể thiết lập trực tiếp mà không cần tệp CI.

Agent thực hiện đầu việc cũng báo các kết quả này. Khi cần pipeline độc lập, dùng CI của nền tảng mã hoặc CI bên ngoài.

<a id="code-host-ci"></a>

## CI của nền tảng mã

Với GitHub Actions:

1. Chọn nguồn, điều kiện kích hoạt và môi trường đích.
2. Nhập thư mục ứng dụng (`.` nếu ở thư mục gốc của kho) và App ID.
3. Sao chép prompt cho agent có quyền truy cập kho mã.
4. Giao agent thêm tệp CI, cấu hình secret rồi kiểm tra pipeline sau khi gửi thay đổi.

| Điều kiện kích hoạt | Mục đích |
| --- | --- |
| Pull request | Tạo bản xem trước PR |
| Branch push | Cập nhật môi trường kiểm thử |
| Tag | Đưa một phiên bản vào môi trường kiểm thử |

Tạo cấu hình lần lượt cho từng điều kiện cần dùng. Mở phần hướng dẫn thủ công để xem lệnh và tệp CI. GitHub dùng secret Actions `NB_STUDIO_API_KEY`.

CI phải kết nối được tới Studio. Nếu Studio dùng địa chỉ cục bộ, cấu hình HTTPS mà CI có thể truy cập hoặc dùng runner CI tự lưu trữ. Cấu hình đích kiểm thử trong [Môi trường được lưu trữ](../admin/environments.md).

<a id="external-ci"></a>

## CI bên ngoài

Chọn Jenkins hoặc hệ thống CI khác rồi tạo khóa CI cho kho mã. Lưu URL Studio và khóa dưới dạng biến pipeline, sau đó dùng các script được tạo. Các script báo bước kiểm tra đang chờ, kết quả và liên kết log, đồng thời có thể xuất bản bản xem trước.

Khóa chỉ hiển thị lúc tạo. Giữ khóa ngoài kho mã. Khóa CI thuộc tổ chức và mặc định hết hạn sau 90 ngày. Người phụ trách và quản trị viên nhận lời nhắc hết hạn. Cập nhật pipeline khi thay khóa.

<a id="verify-the-connection"></a>

## Kiểm chứng kết nối

Gửi một PR rồi xem bản ghi build của kho. Tab **Code & previews** của đầu việc cần hiển thị kết quả và liên kết xem trước. Mở bản xem trước để kiểm tra ứng dụng hoạt động.

**Not reported yet** cho biết nguồn đã chọn chưa báo kết quả. Nếu thiếu biến bắt buộc, đặt biến trên môi trường hoặc ứng dụng theo chỉ dẫn. Đầu việc có thể bật **No preview needed** để bỏ qua bản xem trước. Mẫu CI được tạo sẽ bỏ qua bước này khi PR có nhãn `no-preview`.

Xem [Kiểm tra và rà soát](../project/checks-and-review.md) để biết kết quả ảnh hưởng thế nào đến tiến độ đầu việc.
