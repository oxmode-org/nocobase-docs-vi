---
title: Tệp
description: Tích hợp tải tệp lên, metadata, quyền truy cập nội dung và xem trước.
---

## Năng lực

`@nocobase/app-plugin-file` cung cấp Repository tệp, helper khai báo route tải lên và dịch vụ client dùng cơ sở dữ liệu cùng Drive của ứng dụng. Có thể dùng cho ảnh đại diện, tệp đính kèm hoặc thư viện tài liệu.

Ứng dụng cung cấp bảng tệp, liên kết nghiệp vụ, ổ lưu trữ và UI. Plugin cung cấp thao tác tệp có thể dùng lại.

## Tình huống và ví dụ

### Tệp đính kèm đơn hàng

Tạo Collection tệp đính kèm, khai báo thao tác tải lên và truy vấn rồi nối vào trang chi tiết đơn hàng. Giữ liên kết nghiệp vụ với đơn hàng. Cài mã nguồn `component-ui` của UI Library để có component tải lên, danh sách, ảnh thu nhỏ và xem trước có thể chỉnh sửa.

DOCX, XLSX và PPTX có thể hiển thị cục bộ trong trình duyệt. Cơ chế xem trước dự phòng cho Office cũ và OpenDocument cần URL truy cập được qua Internet. Nếu tệp riêng tư cần phiên của ứng dụng, dùng cơ chế xem trước tương thích với quyền truy cập đó.

**Prompt phát triển** cho Coding Agent trong thư mục ứng dụng.

```text
Dùng Files để thêm tệp đính kèm riêng tư cho đơn hàng, gồm tải lên, danh sách
và xem trước. Tạo Collection bằng migration, cấu hình ổ Drive, khai báo thao
tác và policy. Bảo vệ metadata và nội dung tệp theo quyền đơn hàng. Tạo đường
dẫn riêng có xác thực để tải nội dung. Xác định quy trình dọn metadata và đối
tượng lưu trữ. Kiểm tra tải lên bị từ chối, tải xuống trái quyền và lỗi xem trước.
```

**Xong khi** người có quyền tải lên và đọc được tệp đính kèm, còn người thiếu quyền bị từ chối khi truy vấn metadata hoặc tải nội dung.

## Nguyên tắc và triển khai

Áp dụng theo cấu trúc tệp thực tế của ứng dụng.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Kết quả |
| --- | --- | --- |
| Migration và cấu hình Drive | Định nghĩa trường đính kèm và nơi lưu trữ | Lưu metadata và thông tin quản lý lưu trữ |
| Route tệp và liên kết đơn hàng | Khai báo thao tác, policy và đường dẫn riêng tư có bảo vệ | Áp dụng quyền nghiệp vụ cho danh sách và tải xuống |
| Giao diện chi tiết đơn hàng | Tích hợp tải lên, danh sách, xem trước và báo lỗi | Hiển thị tệp đính kèm và phản hồi thao tác |

### Điều kiện tiên quyết

Sau khi đăng ký cả hai runtime, ứng dụng cần:

1. Cấu hình ổ Drive theo [Lưu trữ tệp](../../framework/file-storage.md).
2. Tạo Collection tệp nghiệp vụ bằng migration.
3. Khai báo tên tài nguyên, Collection, ổ, đường dẫn nội dung, thao tác và `policy` bằng `defineFileRepositoryApiRoutes()` từ `/server`.

Ứng dụng phụ trách tạo bảng và trang quản lý. Trường bắt buộc gồm `id`, `disk`, `key`, `filename`, `ext`, `mimeType`, `size`, `createdAt` và `updatedAt`. Phản hồi tính `contentUrl` từ thông tin lưu trữ.

### Tải lên và truy cập

Với tài nguyên `attachments` do ứng dụng khai báo:

| Năng lực | Endpoint đã khai báo |
| --- | --- |
| Tải lên một tệp | `POST /api/attachments/uploadOne` |
| Tải lên nhiều tệp | `POST /api/attachments/uploadMany` |
| Truy vấn metadata | Thao tác Repository đã khai báo, chẳng hạn `POST /api/attachments/findMany` |
| Đọc nội dung | `accessPath` đã cấu hình, chẳng hạn `/uploads/attachments/<uuid>.<ext>` |

Chỉ thao tác trong `actions` được mở. Tải lên áp dụng `policy.create`. `create: false` từ chối tải lên. Khi cần thêm giá trị nghiệp vụ, xác định chúng ở server qua mặc định của policy hoặc cách xử lý tương đương.

Phân giải `clientFileRepositoryManagerToken` từ `/client`, rồi gọi `manager.repository('attachments')`. Phía server dùng `serverFileRepositoryManagerToken` từ `/server`.

## Ràng buộc phát triển với AI và kiểm chứng

- Kiểm tra quyền của route nội dung riêng với quyền truy vấn metadata. `accessPath` mặc định nằm ngoài policy của Repository.
- Chỉ nhận trường tải lên đã khai báo. Xác định chủ sở hữu nghiệp vụ ở server và kiểm chứng ID đơn hàng được gửi lên.
- Kiểm tra giới hạn kích thước, metadata và đối tượng sau lỗi, tải xuống riêng tư và quy tắc xóa. Dọn đối tượng lưu trữ riêng với `deleteOne`.

### Phạm vi nội dung và xóa

Route nội dung `accessPath` do helper sinh mở công khai và nằm ngoài `policy` của Repository. Với tệp riêng tư, ứng dụng phải cung cấp đường dẫn nội dung có xác thực và kiểm tra quyền truy cập tệp.

`stream` trả nội dung trực tiếp. `redirect` cần kho lưu trữ hỗ trợ URL công khai hoặc URL ký sẵn. Đổi ổ mặc định chỉ ảnh hưởng lựa chọn ổ cho dữ liệu mới. `deleteOne` xóa metadata. Xóa đối tượng vật lý qua quy trình riêng.

Kiểm tra giới hạn tải lên, trường hợp từ chối ghi, tính nhất quán giữa metadata và đối tượng, quyền đọc nội dung và phương án xem trước dự phòng. Xem [API dữ liệu Repository](../../framework/http/repository-routes.md) và [Quản lý plugin](../../developing-apps/manage-plugins.md).

Yêu cầu Agent báo thay đổi thực tế, bước đã chạy và mục chưa kiểm chứng. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md).

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-file)
