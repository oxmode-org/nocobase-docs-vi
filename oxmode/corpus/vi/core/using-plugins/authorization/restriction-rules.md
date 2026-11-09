---
title: Quy tắc hạn chế
description: Cấu hình hạn chế bản ghi và giữ nguyên quyền thao tác.
---

## Năng lực

`@nocobase/app-plugin-authz-restriction-rules` thu hẹp phạm vi bản ghi hiện có của chủ thể chỉ định. Mỗi lựa chọn xác định tập bản ghi còn được phép truy cập. Hệ thống áp dụng tất cả quy tắc phù hợp.

Ứng dụng quản lý quy tắc. Tích hợp factory phân quyền cùng với đăng ký runtime.

## Tình huống và ví dụ

Nếu thực tập sinh có quyền đọc đơn hàng nhưng chỉ được xử lý đơn không mật, chọn các đơn không mật trong quy tắc hạn chế đọc. Đơn mật vẫn bị loại kể cả khi được chia sẻ.

Xác nhận quyền thao tác, cấu hình phạm vi rồi kiểm tra bản ghi được phép và bị loại qua API trực tiếp. Truy vấn nghiệp vụ cần áp dụng policy phân quyền để quy tắc có hiệu lực.

**Prompt phát triển** cho Coding Agent trong thư mục ứng dụng.

```text
Dùng @nocobase/app-plugin-authz-restriction-rules. Giới hạn thực tập sinh đã có
quyền đọc đơn hàng vào đơn không mật. Kiểm tra rằng chia sẻ đơn mật vẫn bị từ chối.
Giữ các tiện ích phân quyền hiện có. Tích hợp quản lý quy tắc cùng quyền cài đặt
tương ứng. Xác nhận quyền đọc trước khi chọn bản ghi. Dùng danh tính thông thường
và kiểm tra cả bản ghi được phép lẫn bản ghi bị loại qua API trực tiếp.
```

**Xong khi** thực tập sinh chỉ xem được đơn không mật, kể cả khi có đơn mật được chia sẻ.

## Nguyên tắc và triển khai

Dùng cấu trúc tệp của ứng dụng để thực hiện các thay đổi sau.

| Phạm vi | Thay đổi mã hoặc cấu hình | Kết quả |
| --- | --- | --- |
| Mảng plugin và `server/config/authorization.ts` | Đăng ký runtime và ghép `restrictionRules()` | Bật endpoint và đánh giá quy tắc |
| Trang quản lý quy tắc | Tích hợp tùy chọn, lựa chọn và thao tác ghi có kiểm tra quyền | Quản trị viên duy trì quy tắc |
| Truy vấn nghiệp vụ và kiểm thử | Áp dụng policy và thử với các chủ thể khác nhau | Quy tắc tác động tới dữ liệu trả về |

### Tích hợp

Đăng ký Client và Server cùng [Quản lý quyền](permissions.md), áp dụng migration rồi thêm factory vào `server/config/authorization.ts`.

```ts
import { restrictionRules } from '@nocobase/app-plugin-authz-restriction-rules/server';

// Merge into the existing authorization configuration, retaining other extensions.
plugins: [restrictionRules()]
```

Đăng ký runtime đóng góp bản dịch và migration. Factory bật quy tắc cùng endpoint HTTP.

### Cấu hình và sử dụng

Lựa chọn có thể gồm tất cả bản ghi, ID tường minh hoặc `recordAccess` đã đăng ký. Nếu nhiều quy tắc cùng áp dụng, hệ thống lấy phần giao. Chọn tất cả bản ghi trong một quy tắc vẫn giữ các hạn chế khác. Gỡ quy tắc có thể mở rộng quyền truy cập, nên kiểm tra lại phạm vi.

`/api/authorization/restrictionRules` cung cấp API liệt kê, tạo, cập nhật, xóa và hỗ trợ chọn bản ghi. Ứng dụng tự xây trang quản lý. Các thao tác yêu cầu quyền `read`, `create`, `update` hoặc `delete` tương ứng trên `settings:authorization.restriction-rules`.

Lưu quy tắc qua endpoint được bảo vệ. Mã server tin cậy có thể dùng API `restrictionRules` của dịch vụ phân quyền. Lớp bọc HTTP tùy chỉnh vẫn phải kiểm tra quyền và đầu vào.

## Ràng buộc phát triển với AI và kiểm chứng

- Xem mỗi lựa chọn là tập bản ghi còn được phép. Kiểm chứng phần giao khi nhiều quy tắc khớp và phạm vi mới khi gỡ quy tắc.
- Quy tắc chỉ thu hẹp phạm vi bản ghi. Kiểm tra riêng quyền trang, thao tác, trường và bản ghi liên quan. Xác minh truy vấn server áp dụng policy.
- Kiểm thử quy tắc kết hợp, gỡ quy tắc và truy cập trực tiếp bằng danh tính có giới hạn.

### Phạm vi

Quy tắc hạn chế áp dụng sau khi gộp phạm vi mặc định và chia sẻ. Danh tính không bị giới hạn bỏ qua các quy tắc này, nên dùng người dùng thông thường khi kiểm chứng.

Xem [Quản lý quyền](permissions.md), [Quyền truy cập dữ liệu mặc định](default-access.md), [Quy tắc chia sẻ](sharing-rules.md) và [Quy tắc hạn chế](restriction-rules.md).

Yêu cầu Agent báo thay đổi thực tế, bước đã chạy và mục chưa kiểm chứng. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md) về hướng dẫn dự án, Skill và kiểm tra chung.

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-authz-restriction-rules)
