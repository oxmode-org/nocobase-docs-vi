---
title: Kết nối môi trường chạy
description: Kết nối môi trường chạy dùng chung để công cụ lập trình có thể thực hiện đầu việc của nhóm.
---

Môi trường chạy là máy nơi agent thực hiện công việc. Quản trị viên kết nối một môi trường chạy dùng chung cho nhóm. Có thể bắt đầu với một máy.

<a id="prepare-a-machine"></a>

## Chuẩn bị máy

- Dùng macOS hoặc Linux. Trên Windows, dùng WSL.
- Cài Node.js 24 trở lên, pnpm 11 (`npm install -g pnpm@11`), Git và GitHub CLI (`gh`).
- Cài ít nhất một công cụ lập trình và đăng nhập bằng tài khoản hệ điều hành chạy dịch vụ.
- Đảm bảo máy truy cập được Studio, GitHub, dịch vụ mô hình và kho package.
- Cài Chromium và các dependency hệ thống cho những đầu việc cần kiểm chứng giao diện ứng dụng.

Xác nhận công cụ lập trình có thể phản hồi trong terminal.

> [!NOTE] Dùng môi trường riêng
> Cài công cụ lập trình và runner trong container hoặc máy ảo riêng, tách khỏi Studio. Agent có thể đọc, ghi tệp trong phạm vi quyền của tài khoản chạy dịch vụ và có thể thực thi lệnh.

<a id="add-a-shared-runtime"></a>

## Thêm môi trường chạy dùng chung

1. Mở **Agent management › Runtimes** rồi chọn **Add runtime**.
2. Chọn **Shared**.
3. Chọn các công cụ lập trình đã cài trên máy.
4. Đặt số lượt chạy đồng thời tối đa là 1 khi thiết lập lần đầu.
5. Tạo lệnh cài đặt rồi chọn hệ điều hành.

<a id="install-on-the-machine"></a>

## Cài đặt trên máy

Sao chép prompt cài đặt cho agent lập trình cục bộ, hoặc tự chạy lệnh cài đặt bằng tài khoản hệ điều hành đã đăng nhập các công cụ lập trình.

Lệnh tải `nocobase-runner` và `nb-studio` từ Studio đang dùng, đăng ký môi trường chạy rồi cài dịch vụ chạy nền. Lệnh chứa thông tin xác thực dùng một lần và có thời hạn ngắn. Tạo lệnh mới nếu hết hạn và giữ toàn bộ lệnh trong phạm vi người cài đặt.

![Cài runner bằng lệnh được tạo, với thông tin xác thực đã ẩn](https://static-docs.nocobase.com/studio-en-setup-runtime-install-20261030.png)

<a id="confirm-the-runtime-is-online"></a>

## Xác nhận môi trường chạy đã trực tuyến

Quay lại danh sách môi trường chạy và chờ trạng thái **Online**. Mở chi tiết và xác nhận các công cụ đã chọn hiện **Signed in**. Cài đặt hoặc đăng nhập công cụ còn thiếu, rồi chạy lại bước phát hiện công cụ.

![Môi trường chạy dùng chung đã trực tuyến và các công cụ lập trình đã đăng nhập](https://static-docs.nocobase.com/studio-en-setup-runtime-online-20261030.png)

Tiếp theo, [cấu hình agent](agents.md). Xem [Cấu hình môi trường chạy](../configure/runtimes.md) về xử lý sự cố, nâng cấp và vô hiệu hóa môi trường.
