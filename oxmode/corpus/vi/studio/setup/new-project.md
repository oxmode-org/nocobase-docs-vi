---
title: Tạo dự án đầu tiên
description: Tạo kho mã riêng tư và khởi tạo ứng dụng NocoBase để bắt đầu các đầu việc nghiệp vụ.
---

Trước tiên, [kết nối nền tảng Git](git.md) và [cấu hình agent](agents.md). Cần ít nhất một môi trường chạy trực tuyến đã cài Node.js 24 và pnpm 11.

Thành viên có thể tạo và trở thành người phụ trách dự án của mình. Xác nhận GitHub App có quyền truy cập **All repositories**. Xem [Kết nối GitHub](git.md#connect-github).

<a id="enter-project-details"></a>

## Nhập thông tin dự án

1. Mở **Development › Projects** và chọn **New project**.
2. Nhập tên và mô tả. Ví dụ, đặt tên **Supplier Management** và mô tả chức năng quản lý hồ sơ, chấm điểm nhà cung cấp và phê duyệt mua hàng.
3. Chọn **New repository** làm nơi lưu mã.
4. Chọn tài khoản hoặc tổ chức Git đã kết nối rồi nhập tên kho chưa được dùng. Giữ kho ở chế độ riêng tư.
5. Chọn **NocoBase app** và giữ template mặc định.
6. Chọn **Create**.

![Tạo kho mã riêng tư và khởi tạo bằng template mặc định của NocoBase](https://static-docs.nocobase.com/studio-en-setup-create-nocobase-app-20261030.png)

Studio tạo kho dưới tài khoản hoặc tổ chức đã chọn. Tên kho phải còn trống.

<a id="wait-for-initialization"></a>

## Chờ khởi tạo

Studio tạo đầu việc **Initialize project**. Agent điều phối phân công thực hiện. Agent thực thi tạo ứng dụng Core trong một môi trường chạy, cài dependency và commit mã.

Mở đầu việc để theo dõi tiến độ, phản hồi của agent và kết quả kiểm tra. Các đầu việc khác của dự án chờ khởi tạo xong.

![Dự án liệt kê đầu việc khởi tạo](https://static-docs.nocobase.com/studio-en-setup-initializing-20261030.png)

Commit đầu tiên được đẩy lên nhánh mặc định. Đầu việc khởi tạo tự hoàn tất khi các bước kiểm tra đạt hoặc khi kho chưa cấu hình bước kiểm tra.

Khởi tạo cần tải template và dependency, nên thời gian phụ thuộc vào mạng, môi trường chạy và mô hình. Nếu đầu việc cứ nằm trong hàng đợi, kiểm tra môi trường chạy có trực tuyến và agent điều phối có khả dụng không.

<a id="start-adding-tasks"></a>

## Bắt đầu thêm đầu việc

Xác nhận các mục sau:

- **Initialize project** đã ở trạng thái **Done**.
- Nhánh mặc định của kho có mã ứng dụng.
- Trang tổng quan đã bỏ lời nhắc hoàn tất khởi tạo.

Ứng dụng đã sẵn sàng. Chuẩn bị bước kiểm tra và bản xem trước, rồi mời thành viên.

![Khởi tạo hoàn tất và dự án sẵn sàng nhận đầu việc nghiệp vụ](https://static-docs.nocobase.com/studio-en-setup-project-ready-20261030.png)

<a id="next-steps"></a>

## Bước tiếp theo

[Cấu hình kiểm tra và bản xem trước](ci.md) bằng agent tự kiểm tra, GitHub Actions hoặc CI bên ngoài. Sau đó [mời thành viên](invite.md).

Quản lý tài liệu, thành viên và Skill mặc định trong [Cài đặt dự án](../project/settings.md). Điều chỉnh mô hình trong [Cấu hình agent](../configure/agents.md) và tài nguyên thực thi trong [Môi trường chạy](../configure/runtimes.md).
