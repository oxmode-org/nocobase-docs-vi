---
title: Môi trường chạy
description: Quản lý năng lực thực thi, công cụ khả dụng, số lượt chạy đồng thời và thư mục làm việc.
---

Môi trường chạy cung cấp công cụ lập trình, quyền truy cập mô hình đã đăng nhập và tài nguyên thực thi. Dùng container hoặc máy ảo riêng, tách khỏi Studio. Để cài đặt, xem [Kết nối môi trường chạy](../setup/shared-runtimes.md).

![Trạng thái kết nối, phạm vi và năng lực của môi trường chạy](https://static-docs.nocobase.com/studio-en-guide-runtimes-20261031.png)

Để đăng ký runner, xem log, cập nhật hoặc gỡ cài đặt, xem [Lệnh nocobase-runner](../reference/runner.md).

<a id="choose-the-scope"></a>

## Chọn phạm vi

| Phạm vi | Công việc có thể chạy | Người kết nối |
| --- | --- | --- |
| Shared | Đầu việc của mọi thành viên | Quản trị viên |
| Personal | Công việc được yêu cầu thay mặt chủ sở hữu môi trường chạy | Thành viên |

Xem [Môi trường chạy cá nhân](../join/personal-runtime.md) để thiết lập cho thành viên. Biến dành riêng cho môi trường chạy dùng chung chỉ được gửi đến môi trường thuộc phạm vi đó.

<a id="adjust-tools-and-concurrency"></a>

## Điều chỉnh công cụ và số lượt chạy đồng thời

Mở chi tiết môi trường chạy để đổi tên, bật hoặc tắt công cụ lập trình và đặt số lượt chạy đồng thời tối đa. Tính đến tài nguyên máy, mức tiêu thụ tài nguyên khi build dự án và hạn mức mô hình. Bắt đầu với một lượt chạy tại một thời điểm khi kết nối môi trường mới.

Nếu công cụ cần đăng nhập, đăng nhập trên máy bằng tài khoản hệ điều hành chạy dịch vụ rồi kiểm tra lại. Nếu công cụ chưa được nhận diện là đã cài, kiểm tra cả bản cài và biến `PATH` của dịch vụ chạy nền.

<a id="inspect-and-maintain"></a>

## Kiểm tra và bảo trì

Trên máy thực thi, kiểm tra trạng thái, dừng hoặc khởi động dịch vụ. Lệnh dừng sẽ làm gián đoạn công việc đang chạy.

```bash
nocobase-runner status
nocobase-runner stop
nocobase-runner start
```

Nếu công cụ chạy được trong terminal nhưng dịch vụ không tìm thấy, cài lại dịch vụ từ chính terminal đó:

```bash
nocobase-runner service install
```

Runner có thể tự cập nhật. Để cập nhật thủ công, chạy `nocobase-runner update`. Kiểm tra thư mục làm việc và lịch sử thực thi để tìm nguyên nhân chiếm dung lượng hoặc xác định thay đổi chưa đẩy lên kho mã. Lưu các thay đổi cần giữ trước khi dọn thư mục.

<a id="remove-a-runtime"></a>

## Gỡ môi trường chạy

Thu hồi thông tin xác thực trước khi xóa môi trường. Studio vẫn giữ lịch sử thực thi. Trên máy, chạy `nocobase-runner uninstall` để gỡ dịch vụ chạy nền và chương trình runner. Đăng ký máy thay thế bằng thông tin xác thực mới.
