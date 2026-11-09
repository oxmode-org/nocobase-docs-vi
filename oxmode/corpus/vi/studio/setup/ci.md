---
title: Cấu hình kiểm tra và bản xem trước
description: Chọn agent tự kiểm tra, GitHub Actions hoặc CI bên ngoài để kiểm chứng thay đổi và tạo bản xem trước.
---

Sau khi khởi tạo dự án, chọn cách kiểm tra thay đổi và cung cấp bản xem trước PR. Agent có thể tự kiểm tra mà không cần pipeline CI.

<a id="choose-a-check-source"></a>

## Chọn nguồn kiểm tra

Mở **Project settings › Code repositories** và chọn **Checks** của kho mã.

| Nguồn | Khi nào dùng | Cách thiết lập |
| --- | --- | --- |
| Agent self-checks | Muốn agent kiểm chứng thay đổi mà không cần pipeline CI | Chọn và lưu. Agent chạy các bước kiểm tra của dự án, báo kết quả và xuất bản bản xem trước |
| GitHub Actions | Muốn workflow GitHub chạy kiểm tra và build | Thêm tệp workflow và secret cho CI |
| External CI | Đã dùng dịch vụ CI khác | Báo kết quả kiểm tra và xuất bản bản xem trước từ pipeline hiện có |

Mỗi kho chỉ nhận kết quả từ nguồn đã chọn. Sau khi chuyển nguồn, kho chỉ nhận báo cáo từ nguồn mới.

![Chọn nguồn kiểm tra, điều kiện kích hoạt và môi trường xem trước](https://static-docs.nocobase.com/studio-en-setup-ci-options-20261030.png)

<a id="use-github-actions"></a>

## Dùng GitHub Actions

1. Chọn **GitHub Actions**, điều kiện kích hoạt **Pull request** và môi trường **Preview**.
2. Dùng `.` nếu ứng dụng nằm ở thư mục gốc của kho. Giữ ID ứng dụng được tạo.
3. Sao chép prompt cho agent lập trình cục bộ. Agent thêm workflow, lưu secret cho CI và mở PR.
4. Chờ workflow hoàn tất. Xem kết quả kiểm tra và mở bản xem trước trong tab **Code & previews** của đầu việc.

GitHub Actions phải kết nối được tới Studio. Với localhost hoặc mạng riêng, dùng runner tự lưu trữ có đường truy cập tới Studio hoặc cấu hình địa chỉ HTTPS có thể truy cập.

Xem [Kiểm tra và CI](../configure/checks.md) về thiết lập thủ công, CI bên ngoài, điều kiện kích hoạt theo nhánh hoặc tag và cách quản lý khóa.

<a id="next-steps"></a>

## Bước tiếp theo

[Mời thành viên](invite.md) vào dự án. Xem [Kiểm tra và CI](../configure/checks.md) khi cần dùng CI bên ngoài, thêm điều kiện kích hoạt hoặc quản lý khóa.
