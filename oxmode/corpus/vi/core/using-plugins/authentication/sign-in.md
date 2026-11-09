---
title: Xác thực
description: Cấu hình đăng nhập, phiên, đăng ký và khôi phục mật khẩu.
---

## Năng lực

`@nocobase/app-plugin-authentication` tích hợp Better Auth với ứng dụng, cung cấp danh tính, phiên, client trình duyệt và middleware server. Ứng dụng quản lý giao diện đăng nhập. Sau khi xác định danh tính bên gọi, [Quản lý quyền](../authorization/permissions.md) xác định các thao tác người đó được phép thực hiện.

## Tình huống và ví dụ

### Chỉ nhận thành viên được mời

1. Tắt tự đăng ký và giữ phương thức đăng nhập cần dùng.
2. Đồng bộ giao diện đăng ký với thiết lập đó.
3. Mời thành viên qua [Quản lý người dùng](users.md).
4. Kiểm tra trang và API dưới danh tính khách, thành viên và người dùng bị vô hiệu hóa.

Để gửi email khôi phục tích hợp sẵn, bật `auth.passwordReset.enabled`, cấu hình địa chỉ ứng dụng công khai và kênh email hệ thống đang hoạt động. Dùng `usePasswordResetCapability()` để xác định có thể hiện điểm vào khôi phục hay không. Cấu hình khôi phục riêng với đăng nhập email và mật khẩu. Ứng dụng cũng có thể cung cấp `sendResetPassword`. Khi triển khai khác origin, khai báo origin tin cậy để giữ bước kiểm tra origin.

**Prompt phát triển** cho Coding Agent trong thư mục ứng dụng.

```text
Dùng Authentication để ứng dụng chỉ nhận thành viên được mời. Giữ cấu hình
đăng nhập, phiên và tiện ích xác thực hiện có. Tắt tự đăng ký ở server rồi
đồng bộ giao diện. Nếu bật khôi phục, kiểm tra URL công khai và kênh email
trước khi hiện nút. Kiểm tra truy cập của khách, người được mời, tài khoản
bị vô hiệu hóa và người đã đăng xuất.
```

**Xong khi** server từ chối tự đăng ký trực tiếp và người được mời vẫn đăng nhập được với quyền dự kiến.

## Nguyên tắc và triển khai

Áp dụng theo cấu trúc tệp thực tế của ứng dụng.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Thay đổi giao diện và hành vi |
| --- | --- | --- |
| `client/config/auth.ts` và `server/config/auth.ts` | Giữ tiện ích tương ứng và cấu hình đăng ký, khôi phục | Điểm vào hiển thị khớp các phương thức đã bật |
| Trang xác thực của ứng dụng | Dùng trang template và điều khiển theo năng lực | Chỉ hiện thao tác đăng ký hoặc khôi phục đang khả dụng |
| Route và API được bảo vệ | Xác thực rồi phân quyền thao tác nghiệp vụ | Xử lý khách đúng cách, kể cả gọi API trực tiếp |

### Tích hợp và cấu hình

Template mặc định đăng ký cả hai runtime và lắp ghép xác thực trong `client/config/auth.ts` và `server/config/auth.ts`. Hợp nhất ví dụ vào mảng `plugins` hiện có để giữ các tiện ích đang dùng.

| Thiết lập hoặc tệp | Công dụng |
| --- | --- |
| `server/config/auth.ts` | Ghép phương thức đăng nhập và tiện ích bằng `defineAuthConfig` |
| `client/config/auth.ts` | Đăng ký tiện ích client tương ứng |
| `auth.emailAndPassword.enabled` | Bật đăng nhập bằng email và mật khẩu |
| `auth.emailAndPassword.disableSignUp` | Tắt tự đăng ký |
| `secrets.keys` / `SECRETS_KEYS` | Khóa bền vững dùng để dẫn xuất khóa xác thực |
| `auth.passwordReset` | Cấu hình khôi phục mật khẩu và kênh email |

Migration của plugin duy trì bảng xác thực. Ứng dụng quản lý trang đăng nhập, đăng ký và khôi phục. Kiểm tra route và phương thức đã bật trước khi thêm trang.

### Dùng xác thực

Từ `/client`, `useAuthentication()` trả phiên và trạng thái tải. `useAuthenticationClient()` trả client xác thực. Route được bảo vệ khai báo `auth: 'required'`.

Ở server, phân giải `authenticationToken` từ `/server` rồi bảo vệ API bằng middleware `required()` của dịch vụ. Sau đó kiểm tra quyền nghiệp vụ trên API, kể cả khi giao diện đã ẩn mục điều hướng.

## Ràng buộc phát triển với AI và kiểm chứng

- Thay đổi tiện ích client và server cùng nhau. Giữ khóa bền vững và origin tin cậy.
- Khi tắt đăng ký, thử gửi yêu cầu trực tiếp. Với khôi phục, kiểm tra email và liên kết thực tế.
- Kiểm tra khôi phục phiên, đăng xuất và tài khoản bị vô hiệu hóa. Kiểm tra quyền sau bước xác thực.

### Vấn đề thường gặp

- **Thiếu trang đăng nhập.** Kiểm tra route và trang template.
- **Phiên lỗi sau khởi động lại.** Kiểm tra khóa bền vững giữa các instance và nơi lưu phiên.
- **Đăng nhập được nhưng bị từ chối truy cập.** Kiểm tra quyền nghiệp vụ.
- **Script cần gọi API.** Dùng [API key](api-keys.md).

Xem [Quản lý plugin](../../developing-apps/manage-plugins.md) để cài đặt và áp dụng migration.

Yêu cầu Agent báo thay đổi thực tế, bước đã chạy và mục chưa kiểm chứng. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md).

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-authentication)
