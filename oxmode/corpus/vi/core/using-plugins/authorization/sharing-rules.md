---
title: Quy tắc chia sẻ
description: Cấu hình chia sẻ bản ghi và giữ nguyên quyền thao tác.
---

## Năng lực

`@nocobase/app-plugin-authz-sharing-rules` bổ sung bản ghi cho chủ thể chỉ định, chẳng hạn người dùng hoặc nhóm. Dùng quy tắc chia sẻ khi bàn giao hoặc phối hợp liên nhóm. Người nhận vẫn cần quyền thực hiện thao tác tương ứng.

Ứng dụng quản lý quy tắc. Tích hợp factory phân quyền cùng với đăng ký runtime.

## Tình huống và ví dụ

Để chia sẻ khách hàng A cho nhân viên bán hàng B, trước hết cấp quyền đọc khách hàng cho B. Sau đó tạo quy tắc chọn A cho thao tác đọc. Kiểm tra riêng quyền chỉnh sửa và quyền truy cập bản ghi liên quan.

Xác nhận quyền thao tác, cấu hình phạm vi rồi kiểm tra bản ghi được phép và bị loại qua API trực tiếp. Truy vấn nghiệp vụ cần áp dụng policy phân quyền để quy tắc có hiệu lực.

**Prompt phát triển** cho Coding Agent trong thư mục ứng dụng.

```text
Dùng @nocobase/app-plugin-authz-sharing-rules để chia sẻ quyền đọc khách hàng A
cho nhân viên bán hàng B. Giữ quyền với các khách hàng khác và toàn bộ quyền chỉnh sửa.
Giữ các tiện ích phân quyền đang có. Tích hợp quản lý quy tắc cùng quyền cài đặt tương ứng.
Xác minh B đã có quyền đọc trước khi chọn bản ghi. Kiểm tra bằng danh tính thông thường
và gọi API trực tiếp cho cả bản ghi được phép lẫn bản ghi bị loại.
```

**Xong khi** B đọc được khách hàng A, còn quyền sửa và phạm vi các khách hàng khác giữ nguyên.

## Nguyên tắc và triển khai

Dùng cấu trúc tệp của ứng dụng để thực hiện các thay đổi sau.

| Phạm vi | Thay đổi mã hoặc cấu hình | Kết quả |
| --- | --- | --- |
| Mảng plugin và `server/config/authorization.ts` | Đăng ký runtime và ghép `sharingRules()` | Bật endpoint và đánh giá quy tắc |
| Trang quản lý quy tắc | Tích hợp tùy chọn, lựa chọn và thao tác ghi có kiểm tra quyền | Quản trị viên duy trì quy tắc |
| Truy vấn nghiệp vụ và kiểm thử | Áp dụng policy và thử với các chủ thể khác nhau | Quy tắc tác động tới dữ liệu trả về |

### Tích hợp

Đăng ký Client và Server cùng [Quản lý quyền](permissions.md), áp dụng migration rồi thêm factory vào `server/config/authorization.ts`.

```ts
import { sharingRules } from '@nocobase/app-plugin-authz-sharing-rules/server';

// Merge into the existing authorization configuration, retaining other extensions.
plugins: [sharingRules()]
```

Đăng ký runtime đóng góp bản dịch và migration. Factory bật quy tắc cùng endpoint HTTP.

### Cấu hình và sử dụng

Chỉ định chủ thể, tài nguyên, thao tác và lựa chọn bản ghi. Chọn ID tường minh hoặc `recordAccess` đã đăng ký. Quy tắc chia sẻ từ chối lựa chọn `all`. Để bổ sung phạm vi chung cho mọi người đã có quyền thao tác, dùng [Quyền truy cập dữ liệu mặc định](default-access.md).

`/api/authorization/sharingRules` cung cấp API liệt kê, tạo, cập nhật, xóa và hỗ trợ chọn bản ghi. Ứng dụng tự xây trang quản lý. Các thao tác yêu cầu quyền `read`, `create`, `update` hoặc `delete` tương ứng trên `settings:authorization.sharing-rules`.

Lưu quy tắc qua endpoint được bảo vệ. Mã server tin cậy có thể dùng API `sharingRules` của dịch vụ phân quyền. Lớp bọc HTTP tùy chỉnh vẫn phải kiểm tra quyền và đầu vào.

## Ràng buộc phát triển với AI và kiểm chứng

- Chọn chủ thể và bản ghi cần chia sẻ tường minh. Kiểm tra quyền riêng với bản ghi liên quan.
- Quy tắc chỉ bổ sung phạm vi bản ghi. Kiểm tra riêng quyền trang, thao tác và trường, đồng thời xác minh truy vấn server áp dụng policy.
- Kiểm thử quy tắc kết hợp, gỡ quy tắc và truy cập trực tiếp bằng danh tính có giới hạn.

### Phạm vi

Quy tắc hạn chế tiếp tục thu hẹp phạm vi sau khi gộp quyền mặc định và quyền chia sẻ. Danh tính không bị giới hạn bỏ qua các quy tắc này, nên dùng người dùng thông thường khi kiểm chứng.

Xem [Quản lý quyền](permissions.md), [Quyền truy cập dữ liệu mặc định](default-access.md), [Quy tắc chia sẻ](sharing-rules.md) và [Quy tắc hạn chế](restriction-rules.md).

Yêu cầu Agent báo thay đổi thực tế, bước đã chạy và mục chưa kiểm chứng. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md) về hướng dẫn dự án, Skill và kiểm tra chung.

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-authz-sharing-rules)
