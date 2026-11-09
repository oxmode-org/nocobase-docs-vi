---
title: Kết nối môi trường chạy cá nhân
description: Kết nối công cụ lập trình và tài nguyên của mình để Studio thực hiện công việc thay mặt mình.
---

Môi trường chạy cá nhân dùng công cụ lập trình đã đăng nhập và gói thuê bao của người sở hữu để chạy công việc thay mặt họ. Có thể dùng môi trường này để tăng năng lực xử lý hoặc bổ sung mô hình cho các đầu việc của mình.

<a id="prepare"></a>

## Chuẩn bị

Làm theo [Chuẩn bị máy](../setup/shared-runtimes.md#prepare-a-machine) để cài dependency và đăng nhập công cụ lập trình. Dùng container hoặc máy ảo riêng, tách khỏi Studio.

<a id="add-the-runtime"></a>

## Thêm môi trường chạy

1. Mở **Agent management › Runtimes** rồi chọn **Add runtime**.
2. Giữ phạm vi sử dụng là **Personal** và chọn các công cụ lập trình đã cài.
3. Đặt số lượt chạy đồng thời phù hợp với cấu hình máy và giới hạn thuê bao.
4. Tạo lệnh cài đặt, chọn hệ điều hành rồi chuyển prompt cho agent lập trình trong môi trường đó.

Lệnh chứa thông tin xác thực dùng một lần. Tạo lệnh mới nếu thông tin xác thực hết hạn. Xem [Cài đặt trên máy](../setup/shared-runtimes.md#install-on-the-machine).

![Môi trường chạy cá nhân hiển thị chủ sở hữu, trạng thái kết nối và công cụ lập trình khả dụng](https://static-docs.nocobase.com/studio-en-guide-personal-runtime-20261031.png)

<a id="check-the-connection"></a>

## Kiểm tra kết nối

Môi trường phải hiển thị **Personal** và **Online**, còn các công cụ đã chọn hiển thị **Signed in**. Sau khi bật agent tương ứng, mục **Where it runs** sẽ liệt kê môi trường này.

<a id="eligible-work"></a>

## Công việc có thể chạy

- Các bước thực hiện thay mặt chủ sở hữu và cuộc trò chuyện Runner Agent do họ mở.
- Agent chỉ khả dụng trên một môi trường chạy cá nhân chỉ phục vụ chủ sở hữu của môi trường đó.
- Công việc dùng biến dành riêng cho môi trường chạy dùng chung phải chạy trong môi trường dùng chung.

Nếu thành viên khác yêu cầu thực hiện một bước trong đầu việc của mình và bước đó sẽ dùng môi trường cá nhân, Studio sẽ yêu cầu xác nhận. Xem [Yêu cầu dùng môi trường chạy cá nhân](../use/answer.md#personal-runtime-requests).

<a id="manage-the-runtime"></a>

## Quản lý môi trường chạy

Mở trang chi tiết để đổi tên, số lượt chạy đồng thời hoặc công cụ khả dụng. Chỉ chủ sở hữu được chỉnh sửa môi trường cá nhân. Quản trị viên có thể chuyển môi trường sang dùng chung khi cần.

Tạm dừng hoặc tiếp tục thực hiện công việc trên máy:

```bash
nocobase-runner stop
nocobase-runner start
```

Khi ngừng sử dụng, thu hồi thông tin xác thực trước khi xóa môi trường. Lịch sử thực thi vẫn được giữ. Chạy `nocobase-runner uninstall` trên máy để gỡ dịch vụ. Xem [Cấu hình môi trường chạy](../configure/runtimes.md).
