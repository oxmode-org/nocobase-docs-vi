---
title: Quyền truy cập dữ liệu mặc định
description: Cấu hình phạm vi dữ liệu mặc định và giữ nguyên quyền thao tác.
---

## Năng lực

`@nocobase/app-plugin-authz-default-access` bổ sung một phạm vi bản ghi chung cho danh tính đã có quyền thực hiện thao tác. Phạm vi mặc định được kết hợp với lựa chọn trong bộ quyền, kể cả khi bộ quyền đã có phạm vi riêng.

Ứng dụng quản lý quy tắc. Cần ghép factory phân quyền cùng với đăng ký runtime.

## Tình huống và ví dụ

Ban đầu, nhân viên hỗ trợ có thể chỉ đọc khách hàng do mình phụ trách. Thêm lựa chọn khách hàng công khai làm phạm vi mặc định cho thao tác đọc để họ đọc được cả hai nhóm. Người chưa có quyền đọc vẫn bị từ chối.

Xác nhận quyền thao tác trước, rồi cấu hình phạm vi. Kiểm tra bản ghi được phép, bản ghi bị loại và yêu cầu trực tiếp tới API. Truy vấn nghiệp vụ cần áp dụng policy phân quyền để quy tắc có hiệu lực.

**Prompt phát triển** cho Coding Agent làm việc trong thư mục ứng dụng.

```text
Dùng @nocobase/app-plugin-authz-default-access. Bổ sung khách hàng công khai
vào phạm vi mặc định cho nhân viên hỗ trợ đã có quyền đọc khách hàng. Giữ
phạm vi hiện có và các tiện ích phân quyền đã cấu hình. Tích hợp quản lý quy
tắc với quyền cài đặt tương ứng. Kiểm tra quyền đọc trước khi cấu hình bản
ghi và giữ giới hạn của người dùng thông thường. Kiểm tra bản ghi được phép
và bị loại qua API trực tiếp.
```

**Xong khi** nhân viên đọc được khách hàng mình phụ trách và khách hàng công khai, còn người chưa có quyền đọc vẫn bị từ chối.

## Nguyên tắc và triển khai

Dùng cấu trúc tệp thực tế của ứng dụng để tích hợp các phần sau.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Thay đổi giao diện và hành vi |
| --- | --- | --- |
| Mảng plugin và `server/config/authorization.ts` | Đăng ký runtime và ghép `defaultAccess()` | Bật endpoint và đánh giá quy tắc |
| Trang quản lý quy tắc của ứng dụng | Tích hợp tùy chọn, lựa chọn và thao tác ghi có bảo vệ | Quản trị viên duy trì quy tắc |
| Truy vấn nghiệp vụ và kiểm thử | Áp dụng policy và thử với các chủ thể khác nhau | Quy tắc tác động đến dữ liệu trả về |

### Tích hợp

Đăng ký Client và Server cùng [Quản lý quyền](permissions.md), áp dụng migration và thêm factory vào `server/config/authorization.ts`.

```ts
import { defaultAccess } from '@nocobase/app-plugin-authz-default-access/server';

// Merge into the existing authorization configuration, retaining other extensions.
plugins: [defaultAccess()]
```

Đăng ký runtime đóng góp bản dịch và migration. Factory cấu hình bật hành vi của quy tắc và endpoint HTTP.

### Cấu hình và dùng quy tắc

Mỗi tài nguyên có tối đa một quy tắc truy cập mặc định, với lựa chọn cho từng thao tác. Có thể chọn tất cả bản ghi, ID tường minh hoặc `recordAccess` đã đăng ký. Thao tác tổng hợp xác định phạm vi qua `scopeKey`.

`/api/authorization/defaultAccess` cung cấp danh sách, tạo, cập nhật, xóa và endpoint hỗ trợ chọn dữ liệu. Ứng dụng tự xây trang quản lý. Các thao tác yêu cầu quyền `read`, `create`, `update` hoặc `delete` tương ứng trên `settings:authorization.default-access`.

Lưu qua endpoint được bảo vệ. Mã server tin cậy có thể dùng API `defaultAccess` của dịch vụ phân quyền. Lớp bọc HTTP tùy chỉnh vẫn phải kiểm tra quyền và đầu vào.

## Ràng buộc phát triển với AI và kiểm chứng

- Giữ một quy tắc mặc định cho mỗi tài nguyên. Lựa chọn bổ sung bản ghi ngay cả khi đã có phạm vi khác.
- Áp dụng policy trong truy vấn server để quy tắc thay đổi tập bản ghi. Quyền trang, thao tác và trường tiếp tục được kiểm tra riêng.
- Dùng người dùng thông thường để kiểm tra quy tắc kết hợp, gỡ quy tắc và gọi trực tiếp.

### Phạm vi

Kiểm tra riêng quyền trang, thao tác, trường và bản ghi liên quan. Quy tắc hạn chế vẫn thu hẹp phạm vi sau khi kết hợp mặc định và chia sẻ. Danh tính không bị giới hạn bỏ qua các quy tắc này, nên kiểm thử bằng người dùng thông thường.

Xem [Quản lý quyền](permissions.md), [Quyền truy cập dữ liệu mặc định](default-access.md), [Quy tắc chia sẻ](sharing-rules.md) và [Quy tắc hạn chế](restriction-rules.md).

Yêu cầu Agent báo thay đổi thực tế, bước đã chạy và mục chưa kiểm chứng. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md) về hướng dẫn dự án, Skill và kiểm tra chung.

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-authz-default-access)
