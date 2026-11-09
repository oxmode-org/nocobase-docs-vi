---
title: API key
description: Cấp và thu hồi API key, đồng thời giới hạn quyền của tích hợp.
---

## Năng lực

`@nocobase/app-plugin-api-keys` xác thực script và tích hợp qua `x-api-key`. Yêu cầu thực thi dưới danh tính chủ khóa. Nếu khóa có phạm vi riêng, yêu cầu còn chịu giới hạn của phạm vi đó.

Plugin cung cấp cơ chế xác thực và API quản lý khóa. Ứng dụng phụ trách giao diện quản lý khóa cá nhân và thực thi phạm vi nghiệp vụ.

## Tình huống và ví dụ

### Script báo cáo chỉ đọc

1. Ứng dụng khai báo nhóm quyền báo cáo và phạm vi bản ghi.
2. Người dùng đã đăng nhập chọn quyền đọc có sẵn và thời hạn, sau đó lưu giá trị bí mật được trả về.
3. Script gửi giá trị đó qua `x-api-key`.
4. Kiểm tra đọc được bản ghi có quyền, từ chối ghi và đọc ngoài phạm vi, rồi từ chối khóa sau khi thu hồi.

Quyền hiệu lực là phần giao giữa quyền hiện tại của chủ khóa và phạm vi của khóa. Endpoint phải bật hỗ trợ khóa có phạm vi trong cơ chế xác thực, đồng thời áp dụng kiểm tra quyền hoặc phạm vi tương ứng. Endpoint chưa tích hợp sẽ từ chối loại khóa này.

**Prompt phát triển** cho Coding Agent làm việc trong thư mục ứng dụng.

```text
Dùng API Keys để cấp khóa chỉ đọc có thời hạn cho script báo cáo. Giữ cấu hình
xác thực. Khai báo thao tác báo cáo và phạm vi bản ghi, rồi tích hợp tạo, xoay
vòng và thu hồi khóa cá nhân. Chỉ hiện giá trị bí mật khi cấp hoặc xoay vòng.
Giữ giá trị đó ngoài mã nguồn và log. Kiểm tra đọc được phép, đọc ngoài phạm vi,
ghi dữ liệu, giá trị bí mật cũ và khóa đã thu hồi.
```

**Xong khi** script chỉ đọc bản ghi báo cáo được phép, còn thao tác ghi và yêu cầu dùng khóa mất hiệu lực đều bị từ chối.

## Nguyên tắc và triển khai

Áp dụng theo cấu trúc tệp thực tế của ứng dụng.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Thay đổi giao diện và hành vi |
| --- | --- | --- |
| Cấu hình xác thực và mảng plugin | Ghép `apiKey()`, `apiKeyClient()` và migration | Bật xác thực bằng khóa và endpoint quản lý |
| Trang cài đặt cá nhân | Tích hợp phạm vi, thời hạn, xoay vòng và thu hồi | Người dùng quản lý khóa của mình. Giá trị bí mật chỉ hiển thị khi cấp |
| API báo cáo | Bật khóa có phạm vi và áp dụng policy dữ liệu | Script chỉ có phần giao giữa quyền người dùng và phạm vi khóa |

### Tích hợp

Đăng ký cả hai runtime và áp dụng migration. Thêm `apiKey()` từ `/server` vào cấu hình xác thực server và `apiKeyClient()` từ `/client` vào cấu hình xác thực client. Kiểm tra thiết lập sẵn có trong template mặc định trước.

Đăng ký Server cung cấp migration tạo bảng. Thêm `apiKey()` để bật endpoint khóa của Better Auth và áp dụng migration để có bảng cần thiết. Ứng dụng tự xây trang quản lý bằng client xác thực hoặc `/api/apiKeys`.

### Cấp và dùng khóa

Dùng phiên đã đăng nhập để quản lý khóa cá nhân. API key chỉ dùng để xác thực tích hợp.

| Endpoint | Công dụng |
| --- | --- |
| `GET /api/apiKeys/scopeOptions` | Nhóm, preset và thiết lập thời hạn có sẵn |
| `POST /api/apiKeys` | Tạo khóa và trả giá trị bí mật một lần |
| `GET /api/apiKeys` | Liệt kê khóa thuộc người dùng cùng phạm vi, bỏ giá trị bí mật |
| `POST /api/apiKeys/:keyId/rotate` | Đổi giá trị bí mật và vô hiệu hóa ngay giá trị cũ |
| `DELETE /api/apiKeys/:keyId` | Thu hồi khóa |

Với ứng dụng gắn tại `/main`:

```bash
curl -H 'x-api-key: <your-key>' https://app.example.com/main/api/swagger
```

Thay khóa và địa chỉ ứng dụng. Quyền truy cập tài liệu API và quyền gọi từng endpoint được kiểm tra riêng.

## Ràng buộc phát triển với AI và kiểm chứng

- Yêu cầu phiên đã đăng nhập tại các endpoint quản lý khóa.
- Áp dụng quyền thao tác và phạm vi bản ghi trên API báo cáo sau bước xác thực khóa.
- Xác minh giá trị cũ mất hiệu lực ngay khi xoay vòng. Kiểm tra yêu cầu sau khi chủ khóa mất quyền, khóa hết hạn hoặc bị thu hồi.

### Phạm vi

Khóa không có phạm vi riêng kế thừa quyền hiện tại của chủ khóa, kể cả quyền ghi. Khi chủ khóa mất quyền hoặc bị vô hiệu hóa, khóa chịu tác động tương ứng. `apiKeys.maxScopedKeyDays` giới hạn thời hạn của khóa có phạm vi. Cập nhật giá trị bí mật của tích hợp sau khi xoay vòng.

Xem [Xác thực](sign-in.md), [Quản lý quyền](../authorization/permissions.md) và [Quản lý plugin](../../developing-apps/manage-plugins.md).

Yêu cầu Agent báo thay đổi thực tế, bước đã chạy và mục chưa kiểm chứng. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md) về hướng dẫn dự án, Skill và kiểm tra chung.

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-api-keys)
