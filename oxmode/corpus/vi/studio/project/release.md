---
title: Bàn giao lên production
description: Triển khai trên hạ tầng của đội ngũ và ghi nhận phiên bản đang chạy trên production.
---

Chọn dự án trong **Releases** rồi mở **Deployment guide** từ thẻ production. Người phụ trách dự án có thể chọn phiên bản và lấy lệnh triển khai hoặc prompt dành cho agent lập trình.

![Lấy hướng dẫn triển khai production và ghi nhận phiên bản đã bàn giao](https://static-docs.nocobase.com/studio-en-guide-production-guide-20261031.png)

<a id="prepare-and-deploy"></a>

## Chuẩn bị và triển khai

Xác nhận phiên bản có gói đầu ra khả dụng. Hướng dẫn cung cấp các bước cài mới hoặc nâng cấp dựa trên phiên bản đã ghi nhận.

| Phương thức | Điều kiện trên máy đích | Cách triển khai |
| --- | --- | --- |
| Docker | Docker và Compose | Dựng image từ gói đầu ra hoặc kéo image từ registry, rồi khởi động ứng dụng |
| Installer | Node.js 24 và PM2 | Cài đặt hoặc nâng cấp bằng `@nocobase/app-installer` |

Dựng và triển khai image production trên hạ tầng của đội ngũ. Đội ngũ quản lý cấu hình, cơ sở dữ liệu và thông tin bí mật của production. Sao lưu cơ sở dữ liệu trước khi nâng cấp, rồi kiểm tra đăng nhập và các luồng nghiệp vụ chính.

Để tự động hóa, chuyển hướng dẫn cho agent lập trình có quyền truy cập máy chủ đích. Bước triển khai production diễn ra trên hạ tầng của đội ngũ.

<a id="record-the-production-version"></a>

## Ghi nhận phiên bản production

Sau khi kiểm chứng triển khai, ghi nhận phiên bản ở cuối hướng dẫn hoặc dùng thao tác ghi production của phiên bản. Studio xác định những đầu việc đã hoàn tất hiện có trên production.

Bản ghi xác nhận kết quả triển khai do đội ngũ thực hiện.

<a id="roll-back"></a>

## Khôi phục phiên bản trước

Khôi phục image trước hoặc dùng chức năng rollback của trình cài đặt trên hạ tầng production. Nếu lần nâng cấp đã chạy migration, khôi phục bản sao lưu tương ứng khi cần. Kiểm tra ứng dụng rồi ghi phiên bản đã khôi phục trong Studio.
