---
title: Quản lý người dùng
description: Tích hợp quản trị tài khoản, lời mời, gán vai trò và tùy chọn cá nhân.
---

## Năng lực

`@nocobase/app-plugin-users` cung cấp quản trị tài khoản, lời mời và tùy chọn cá nhân. [Xác thực](sign-in.md) quản lý danh tính, mật khẩu và phiên. [Quản lý quyền](../authorization/permissions.md) cùng ứng dụng xác định vai trò và thao tác được phép.

Plugin cung cấp trang chấp nhận lời mời. Ứng dụng tích hợp trang quản lý và phạm vi vai trò nghiệp vụ.

## Tình huống và ví dụ

### Mời thành viên

1. Nhập email và chọn vai trò có thể gán trên trang quản lý người dùng.
2. Kiểm tra kết quả từng lời mời. Người mời có quyền có thể sao chép `inviteUrl` được trả về.
3. Người dùng mới nhập tên và mật khẩu. Người đã có tài khoản đăng nhập bằng email nhận lời mời trước khi chấp nhận.
4. Dùng tài khoản đó để kiểm tra vai trò và quyền truy cập nghiệp vụ.

Gửi email cần kênh thư đã cấu hình. Khi gửi thất bại, kiểm tra phản hồi để biết lời mời có còn hiệu lực trước khi chia sẻ liên kết. Gia hạn lời mời vô hiệu hóa token cũ. Email mời dùng cơ chế gửi thông báo của hệ thống. [Hộp thư cá nhân](../notifications/mail.md) là tính năng riêng.

**Prompt phát triển** cho Coding Agent trong thư mục ứng dụng.

```text
Dùng plugin Users để thêm quản lý thành viên và lời mời vào ứng dụng hiện có.
Dùng lại UsersClient cùng cơ chế xác thực và phân quyền. Thêm danh sách người
dùng, lời mời và bộ chọn vai trò được phép gán. Hiện kết quả từng lời mời.
Giữ tài khoản và quyền đã cấp. Kiểm tra thành viên thông thường bị từ chối
khi quản lý tài khoản và tài khoản được mời có thể chấp nhận lời mời.
```

**Xong khi** người được mời tham gia với vai trò dự kiến và thành viên thông thường bị từ chối khi gọi API quản lý.

## Nguyên tắc và triển khai

Áp dụng theo cấu trúc tệp thực tế của ứng dụng.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Thay đổi giao diện và hành vi |
| --- | --- | --- |
| Route client và trang thành viên | Tích hợp `UsersClient`, danh sách, lời mời và tùy chọn vai trò | Trang quản trị dùng trang chấp nhận lời mời của plugin cho người nhận |
| Cấu hình phạm vi vai trò phía server | Tích hợp phạm vi vai trò nghiệp vụ và quyền quản lý | Vai trò có thể gán phản ánh quy tắc server |
| Tài nguyên ngôn ngữ và kiểm thử | Thêm nội dung kết quả và bước kiểm chứng | Hiện lỗi và kiểm tra được hành vi tài khoản hiện có |

### Tích hợp và điểm vào

Đăng ký plugin Client và Server sau Authentication và Authorization rồi áp dụng migration của ứng dụng. Xem [Quản lý plugin](../../developing-apps/manage-plugins.md).

Plugin chỉ đăng ký trang `/invite/:token`. Ứng dụng xây trang quản lý bằng `UsersClient` từ `@nocobase/app-plugin-users/client/user-client`. Đường dẫn trang và API tính từ gốc ứng dụng. Nếu ứng dụng gắn ở `/main`, URL lời mời là `/main/invite/:token`.

### Quản lý tài khoản

| Tác vụ | Năng lực có sẵn |
| --- | --- |
| Tìm người dùng | Tìm có phân trang theo tên, tên đăng nhập, email, trạng thái và vai trò |
| Sửa tài khoản | Tạo, chỉnh sửa, bật và vô hiệu hóa |
| Quản lý truy cập | Gán vai trò, đặt lại mật khẩu và thu hồi phiên |
| Mời thành viên | Tạo, gửi lại, thu hồi và chấp nhận lời mời |
| Lưu tùy chọn | Lưu giá trị do ứng dụng định nghĩa như theme và ngôn ngữ |

API `/api/users` yêu cầu đăng nhập và thao tác `user` tương ứng. Khi tạo, cần cả `create` và `assign-role`. Kiểm tra quyền trong API kể cả khi người dùng mở được trang.

Đọc danh sách vai trò có thể gán qua `UsersClient`. Tích hợp server dùng `userManagementServiceToken` và `userRoleScopeRegistryToken` từ `/server/tokens`. Token thứ hai kết nối phạm vi vai trò riêng của ứng dụng.

## Ràng buộc phát triển với AI và kiểm chứng

- Dựng bộ chọn từ vai trò có thể gán và giữ kiểm tra `create` cùng `assign-role` ở server.
- Giữ kết quả theo từng địa chỉ. Phân biệt tạo lời mời với gửi email thất bại trước khi thử lại.
- Kiểm thử người được mời mới và đã có tài khoản, liên kết cũ mất hiệu lực và phiên của tài khoản đã vô hiệu hóa.

### Tùy chọn và phạm vi

`useUserPreference(key, { defaultValue })` từ `/client/preferences` lưu giá trị như `theme.mode`. Ứng dụng triển khai hành vi ứng với giá trị đó.

Vô hiệu hóa tài khoản, thu hồi phiên và xóa là các thao tác riêng. Xóa cần xác nhận tường minh. Hệ thống giữ danh tính đã vô hiệu hóa để truy vết lịch sử, đồng thời giữ email và tên đăng nhập đã dành. Phạm vi vai trò của ứng dụng xử lý dọn dẹp nghiệp vụ. Kiểm tra từ chối quản lý bằng tài khoản thường, chấp nhận lời mời và hành vi phiên sau vô hiệu hóa hoặc thu hồi.

Xem [Xác thực](sign-in.md), [API key](api-keys.md) và [Quản lý quyền](../authorization/permissions.md).

Yêu cầu Agent báo thay đổi thực tế, bước đã chạy và mục chưa kiểm chứng. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md).

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-users)
