---
title: Nghiệm thu kết quả
description: Kiểm tra báo cáo bàn giao và kết quả thực tế, rồi hợp nhất hoặc yêu cầu chỉnh sửa.
---

Khi đầu việc ở **In review**, người phụ trách kiểm tra kết quả bàn giao. Agent cung cấp báo cáo, hồ sơ kiểm chứng và ảnh liên quan. Con người quyết định có nghiệm thu hay không.

<a id="read-the-delivery-report"></a>

## Đọc báo cáo bàn giao

Mở đầu việc từ **My issues › Waiting for you**. Đọc **Needs you** rồi kiểm tra báo cáo.

![Các thao tác nghiệm thu nằm trên báo cáo bàn giao](https://static-docs.nocobase.com/studio-en-guide-accept-20261031.png)

| Nội dung | Mục cần kiểm tra |
| --- | --- |
| Trạng thái ban đầu và phương án đã thống nhất | Có khớp yêu cầu và quy tắc đã xác nhận không? |
| Thay đổi | Đợt bàn giao này gồm những gì? |
| Kiểm chứng | Kiểm thử, môi trường kiểm tra và kết quả rà soát độc lập |
| Vấn đề còn lại | Phần chưa hoàn tất và ảnh hưởng |
| Tiêu chí nghiệm thu | Kết quả quan sát được và bằng chứng đi kèm |

Mở ảnh đính kèm để xem chi tiết. Yêu cầu bổ sung bằng chứng còn thiếu trước khi quyết định.

<a id="inspect-changes-and-previews"></a>

## Xem thay đổi và bản xem trước

**View changes** mở PR trên nền tảng lưu trữ mã. **Code & previews** tập hợp PR, kết quả kiểm tra và đường dẫn xem trước.

Nếu dự án có bản xem trước PR, chạy các kịch bản nghiệm thu tại đó. Nguồn kiểm tra đã chọn phải dựng và xuất bản bản xem trước trước. Xem [Bản xem trước PR](../release/previews.md).

Bản xem trước không dùng có thể tạm ngủ và khởi động lại khi mở. Hệ thống xóa bản xem trước khi PR được hợp nhất hoặc đóng.

<a id="accept"></a>

## Chấp nhận kết quả

Với đầu việc có PR, chọn **Merge**. Kiểm tra nhánh đích, phương thức hợp nhất và tiêu đề commit trước khi xác nhận. Nếu có commit mới trong lúc xác nhận, kiểm tra rồi xác nhận lại. Đầu việc hoàn tất khi mọi PR liên kết đã hợp nhất.

Với công việc không có PR, chẳng hạn nghiên cứu hoặc sắp xếp tài liệu, chọn **Accept**. Quyền nghiệm thu và hợp nhất thuộc về người phụ trách.

Studio ưu tiên dùng danh tính Git cá nhân đã kết nối để hợp nhất, rồi dùng kết nối workspace nếu thiếu. Quyền trên nền tảng mã và quy tắc bảo vệ nhánh vẫn áp dụng.

<a id="when-checks-do-not-pass"></a>

## Khi kiểm tra chưa đạt

Xung đột, kiểm tra đang chờ, PR nháp hoặc quy tắc của nền tảng mã có thể chặn hợp nhất.

Khi kiểm tra thiếu hoặc thất bại, Studio có thể cung cấp **Merge anyway**. Có thể ghi lý do. Studio lưu quyết định ngoại lệ trên PR và đầu việc. Chỉ người dùng có thể thực hiện ngoại lệ, trong phạm vi quy tắc bảo vệ của nền tảng mã.

<a id="request-changes"></a>

## Yêu cầu chỉnh sửa

1. Chọn **Send back**.
2. Mô tả hành vi thực tế và hành vi mong đợi.
3. Đưa đầu việc về **In progress**.

Ví dụ, báo nhà cung cấp bị tạm ngưng vẫn nhận được đơn mới. Yêu cầu chặn đơn mới và tiếp tục cho xem, nhận hàng trên các đơn hiện có:

```prompt
Suspended suppliers can still receive new orders. Block new orders while keeping existing orders readable and allowing goods to be received.
```

Agent điều phối tổ chức sửa rồi gửi kết quả lại để nghiệm thu.

<a id="already-merged-on-the-code-host"></a>

## Đã hợp nhất trên nền tảng mã

Studio nhận thông tin hợp nhất qua webhook hoặc truy vấn định kỳ. Khi cần ghi nhận thủ công, dùng **Mark as merged**. Theo dõi các bước bàn giao tiếp theo trong [Tổng quan phát hành](../release/overview.md).
