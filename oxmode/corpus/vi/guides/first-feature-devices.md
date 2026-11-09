---
title: Tính năng đầu tiên, sổ thiết bị
description: Giao agent xây sổ thiết bị theo tài liệu thiết kế, dùng thử và yêu cầu chỉnh sửa.
---

Sổ thiết bị là bước đầu tiên trong tài liệu thiết kế. Yêu cầu đã có trong [tài liệu](https://github.com/nocobase/docs-examples-v3/blob/main/apps/itam-lite/docs/design.md), nên chỉ cần chỉ rõ bước cần thực hiện.

<a id="1-make-the-request"></a>

## 1. Gửi yêu cầu

Yêu cầu agent làm bước 1 của `docs/design.md`. Ở bước này, chỉ quản trị viên dùng sổ thiết bị. Vai trò và quyền sẽ được bổ sung sau.

```prompt
Do step 1 of docs/design.md: the device register. Only administrators use it at this step; roles and permissions come later.
```

Kết quả agent xây dựng:

| Phần | Nội dung |
| --- | --- |
| Bảng | Migration tạo bảng `devices` với chỉ mục duy nhất cho mã tài sản |
| API | Liệt kê, tạo, cập nhật và xóa qua `/api/devices`. Từng thao tác có quyền riêng và được liệt kê trong tài liệu API tại `/main/api/swagger` |
| Trang | **Devices** trên thanh bên, gồm danh sách, tìm kiếm và hộp thoại tạo, sửa. Nội dung có tiếng Anh và tiếng Trung |
| Cài đặt hệ thống | Bật **Users** và **Permission management** theo quy ước ứng dụng |
| Kiểm thử | Có kiểm thử API và migration. `pnpm typecheck` và `pnpm lint` đều đạt |

<a id="2-try-it"></a>

## 2. Dùng thử

Tải lại trình duyệt, mở **Devices** rồi đăng ký vài thiết bị. Nếu mã tài sản trùng, thông báo xuất hiện cạnh ô nhập.

![Đăng ký thiết bị](https://static-docs.nocobase.com/20261030-itam-lite-devices-new-device.webp)

Sau một thời gian dùng thử, phát hiện hai vấn đề:

- Hai màn hình có cùng số sê-ri vẫn được lưu.
- Khi danh sách dài hơn, cần lọc để chỉ xem thiết bị trong kho.

<a id="3-ask-for-changes"></a>

## 3. Yêu cầu chỉnh sửa

Yêu cầu số sê-ri duy nhất khi có giá trị, liệt kê các bản ghi trùng trước khi sửa, rồi bổ sung bộ lọc trạng thái, danh mục và tìm kiếm theo số sê-ri.

```prompt
Two changes to the device register:
1. Serial numbers must be unique (they can be left empty). List any existing duplicates for me first; do not fix them automatically.
2. The list can be filtered by status and category, and search also matches serial numbers.
```

Agent kiểm tra dữ liệu trước và báo `IT-2026-0002` cùng `IT-2026-0007` đều có số sê-ri `CN0ABC123`. Sửa một bản ghi theo số sê-ri thực trên thiết bị rồi báo agent tiếp tục.

Agent thêm migration mới để tạo chỉ mục duy nhất cho số sê-ri và giữ nguyên các migration đã chạy. Nếu còn trùng, migration dừng và liệt kê thiết bị liên quan. Sau khi cập nhật:

![Thông báo số sê-ri trùng](https://static-docs.nocobase.com/20261030-itam-lite-devices-duplicate-serial.webp)

![Lọc theo trạng thái](https://static-docs.nocobase.com/20261030-itam-lite-devices-filter-by-status.webp)

Hoàn tất khi có thể tạo, sửa và xóa thiết bị, lỗi trùng mã tài sản hoặc số sê-ri xuất hiện cạnh đúng ô nhập, danh sách lọc được theo trạng thái và danh mục, và dữ liệu vẫn còn sau khi tải lại.
