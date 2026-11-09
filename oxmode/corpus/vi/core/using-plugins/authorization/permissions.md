---
title: Quản lý quyền
description: Cấu hình bộ quyền, quyền truy cập trang, thao tác nghiệp vụ và policy dữ liệu phía server.
---

## Năng lực

`@nocobase/app-plugin-authorization` cung cấp bộ quyền, quyền truy cập trang và cài đặt, quyền thực hiện thao tác nghiệp vụ, cùng policy theo trường, bản ghi và quan hệ trong cơ sở dữ liệu.

Ứng dụng khai báo tài nguyên và xây giao diện quản lý. Plugin quyết định quyền truy cập và cung cấp policy dữ liệu.

### Cấu hình quyền truy cập

| Đối tượng | Phạm vi kiểm soát |
| --- | --- |
| Bộ quyền | Các quyền gán cho người dùng hoặc chủ thể khác |
| `page` | Quyền mở trang |
| `settings` | Quyền đọc hoặc thay đổi mục quản trị |
| `composite` | Thao tác nghiệp vụ và các thao tác dữ liệu bên dưới |
| `database.collection` | Policy của Collection đã đăng ký với cơ chế phân quyền |

Khai báo tài nguyên và thao tác tường minh. Với Collection có bảng sẵn, đăng ký Collection vào mô hình phân quyền để có thể áp dụng policy.

Bộ quyền `root` đã cấu hình có quyền không giới hạn. Giữ bộ quyền này riêng với vai trò nghiệp vụ thông thường. Quy trình tạo tài khoản hiện tại gán Member tường minh. Việc cấp quyền vẫn phụ thuộc cấu hình và luồng tạo tài khoản.

## Tình huống và ví dụ

### Xem và sửa đơn hàng

1. Khai báo năng lực xem và sửa, gồm các trường và lựa chọn bản ghi.
2. Cấp quyền xem cho nhân viên hỗ trợ và cấp quyền sửa cần thiết cho người phụ trách.
3. Dùng `authz` trên route và `useCan` cho điều hướng cùng nút thao tác. Kiểm tra lại quyền thao tác ở API.
4. Áp dụng policy bản ghi và trường qua phương thức công khai như `authz.database.policyFor(...)` hoặc `authorizeRepository(...)`.
5. Kiểm tra danh sách, chi tiết, quan hệ và lời gọi API trực tiếp với các vai trò khác nhau.

Sau khi kiểm tra quyền thao tác, áp dụng tiếp policy vào truy vấn để giữ giới hạn bản ghi và trường. Luôn thực thi quyền ở server, kể cả khi điều hướng đã ẩn trên giao diện.

**Prompt phát triển** cho Coding Agent trong thư mục ứng dụng.

```text
Dùng Authorization để bổ sung quyền xem và sửa đơn hàng. Khai báo trang và
thao tác nghiệp vụ. Dùng lại vai trò hiện có và giữ giới hạn của các vai trò đó.
Kiểm soát nút trên giao diện và thực thi policy thao tác, bản ghi và trường ở server.
Kiểm thử danh sách, chi tiết, quan hệ và API trực tiếp với người chỉ đọc, người
được sửa và người bị từ chối.
```

**Xong khi** người chỉ đọc xem được các đơn được phép và bị từ chối khi sửa. Bản ghi và trường nằm ngoài phạm vi vẫn bị chặn.

## Nguyên tắc và triển khai

Áp dụng theo cấu trúc tệp thực tế của ứng dụng.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Thay đổi giao diện và hành vi |
| --- | --- | --- |
| Cấu hình phân quyền và khai báo tài nguyên | Đăng ký Collection, thao tác và dependency của trường | Tùy chọn quản trị phản ánh năng lực nghiệp vụ |
| Dịch vụ nghiệp vụ và truy vấn Repository | Áp dụng policy mà cơ chế phân quyền trả về | Danh sách, chi tiết và thao tác ghi thực thi cùng giới hạn |
| Route trang và nút thao tác | Dùng `authz` và `useCan`, đồng thời giữ kiểm tra ở API | Giao diện phản ánh quyền của vai trò |

### Tích hợp và điểm vào

Đăng ký plugin Client và Server sau Authentication, rồi áp dụng migration và Seed. Ghép cấu hình trong `server/config/authorization.ts`. Với tích hợp server tin cậy, phân giải `authorizationToken` từ `/server`.

Plugin công khai `/api/authorization`, `AuthorizationClient` và hook như `useCan`. Ứng dụng xây trang quản lý quyền và khai báo các năng lực nghiệp vụ có thể cấp.

### Tiện ích phạm vi bản ghi

- [Quyền truy cập dữ liệu mặc định](default-access.md) thêm phạm vi bản ghi chung cho thao tác đã được cấp.
- [Quy tắc chia sẻ](sharing-rules.md) bổ sung bản ghi đã chọn cho chủ thể chỉ định.
- [Quy tắc hạn chế](restriction-rules.md) thu hẹp tập bản ghi chủ thể còn được truy cập.

Cấp quyền thao tác riêng với các tiện ích này. Nhóm mục trong giao diện quản lý chỉ phục vụ hiển thị. Xem [Quản lý plugin](../../developing-apps/manage-plugins.md) để cài đặt.

## Ràng buộc phát triển với AI và kiểm chứng

- Khai báo năng lực trước khi cấp quyền. Đưa truy vấn cơ sở dữ liệu vào mô hình phân quyền và áp dụng policy tương ứng.
- Kiểm tra quyền trang, thao tác, trường, bản ghi và quan hệ. Dùng cả kết quả quyết định quyền và policy dữ liệu khi truy vấn.
- Dùng vai trò thông thường để gọi trực tiếp API. Rà thay đổi Seed vai trò để phát hiện việc mở rộng quyền ngoài dự kiến.

Yêu cầu Agent báo thay đổi thực tế, bước đã chạy và mục chưa kiểm chứng. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md) về hướng dẫn dự án, Skill và kiểm tra chung.

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-authorization)
