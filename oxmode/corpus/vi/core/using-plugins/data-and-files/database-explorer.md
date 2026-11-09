---
title: Trình khám phá cơ sở dữ liệu
description: Kiểm tra kết nối ứng dụng, định nghĩa Collection và schema vật lý.
---

## Năng lực

`@nocobase/app-plugin-database-explorer` cho phép xem kết nối đã cấu hình, Collection, trường và schema vật lý để phát triển và chẩn đoán. Plugin cung cấp API truy vấn và client để ứng dụng xây giao diện chỉ đọc.

## Tình huống và ví dụ

### Kiểm tra bảng đơn hàng

1. Chọn kết nối mà đơn hàng sử dụng.
2. Kiểm tra trường, quan hệ và cảnh báo của Collection.
3. Mở schema vật lý để xem cột và index.
4. Thay đổi cấu trúc qua [migration](../../framework/database/migrations.md).

Dùng `pageToken` để đọc trang tiếp theo. `DatabaseExplorerClient.allCollections()` duyệt các trang phục vụ tìm kiếm phía ứng dụng và trả `truncated` nếu chạm giới hạn duyệt.

**Prompt phát triển** cho Coding Agent trong thư mục ứng dụng.

```text
Dùng Database Explorer để thêm trang xem schema cho quản trị viên. Dùng lại
DatabaseExplorerClient và DATABASE_EXPLORER_ACCESS để xem kết nối, Collection
và nạp schema vật lý khi cần. Hỗ trợ phân trang và báo khi kết quả bị cắt bớt.
Giữ giao diện chỉ đọc. Kiểm tra truy cập bị từ chối, kết nối không khả dụng
và Collection không tồn tại.
```

**Xong khi** quản trị viên có quyền xem được schema logic và vật lý, còn người thiếu quyền bị từ chối khi gọi API.

## Nguyên tắc và triển khai

Áp dụng theo cấu trúc tệp của ứng dụng.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Kết quả |
| --- | --- | --- |
| Route Client và trang khám phá | Ghép yêu cầu kết nối, Collection và schema vật lý | Xem schema theo nhu cầu |
| Quyền trang | Dùng lại `DATABASE_EXPLORER_ACCESS` | Điều hướng và API áp dụng cùng quyền |
| Phân trang và trạng thái lỗi | Xử lý `pageToken`, `truncated` và lỗi | Hiển thị rõ kết quả một phần hoặc thu thập thất bại |

### Tích hợp

Đăng ký cả hai runtime sau Authentication và Authorization. Plugin cung cấp API. Ứng dụng dùng `DatabaseExplorerClient` để xây trang. Có thể tích hợp mà không cần migration bảng nghiệp vụ.

Trang và API cùng dùng `page:database-explorer/access`. Dùng `DATABASE_EXPLORER_ACCESS` được xuất sẵn ở client.

### Duyệt cấu trúc

| Truy vấn | Endpoint |
| --- | --- |
| Kết nối | `GET /api/databaseExplorer/connections` |
| Collection | `GET /api/databaseExplorer/connections/:connection/collections` |
| Định nghĩa và trường | `GET /api/databaseExplorer/connections/:connection/collections/:collection` |
| Cột, index và ràng buộc vật lý | Thêm `/physicalSchema` vào endpoint Collection |

Tóm tắt kết nối chỉ hiện tên, dialect và chế độ quản lý. Lấy định nghĩa và schema vật lý bằng hai yêu cầu riêng.

## Ràng buộc phát triển với AI và kiểm chứng

- Giữ trình duyệt schema ở chế độ chỉ đọc. Thay đổi cấu trúc qua migration.
- Giữ host, mật khẩu và đường dẫn tệp cơ sở dữ liệu ngoài dữ liệu tóm tắt.
- Kiểm tra tìm kiếm qua nhiều trang, giới hạn duyệt và truy cập bị từ chối. Hiện trạng thái khi chỉ đọc được một phần Collection.

### Phạm vi

Khi đọc Collection lần đầu trên kết nối do framework quản lý, framework cơ sở dữ liệu có thể khởi tạo bảng metadata nội bộ và bảng phiên bản cache. Các bảng và bản ghi nghiệp vụ được giữ. Kết nối ngoài dùng metadata từ thư mục.

Kiểm tra truy cập được phép và bị từ chối, kết nối không khả dụng, Collection không tồn tại và phân trang. Xem tài liệu API của ứng dụng đang chạy để biết hợp đồng lỗi.

Xem [Kết nối cơ sở dữ liệu](../../framework/database/connections.md), [Quản lý quyền](../authorization/permissions.md) và [Quản lý plugin](../../developing-apps/manage-plugins.md).

Yêu cầu Agent báo thay đổi thực tế, bước đã chạy và mục chưa kiểm chứng. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md).

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-database-explorer)
