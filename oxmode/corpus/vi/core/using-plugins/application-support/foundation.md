---
title: Nền tảng ứng dụng
description: Xem năng lực Core đã tích hợp, dấu hiệu sử dụng và liên hệ với các mô-đun nghiệp vụ.
---

## Năng lực

`@nocobase/app-plugin-foundation` cho biết ứng dụng tích hợp những năng lực Core nào, có dấu hiệu sử dụng gì và liên quan đến mô-đun nghiệp vụ nào.

Foundation quan sát tích hợp hiện có. Việc cài plugin và nghiệm thu trên ứng dụng chạy thật được thực hiện riêng.

### Kiểm tra năng lực

Chọn tài khoản, quyền, tệp, thông báo hoặc AI để xem cấu hình, cách sử dụng nhận diện được và package liên quan. Khi được yêu cầu, plugin đọc cấu hình, dịch vụ đã đăng ký, kết nối mặc định và thông tin migration. Kết quả được lưu đệm ngắn hạn. Chọn **Refresh** để thu thập lại.

Đã cài, đã đăng ký, đã cấu hình và đã ghi nhận sử dụng là các trạng thái riêng. Xác nhận việc sử dụng nghiệp vụ bằng dấu hiệu phù hợp. Tiện ích tùy chỉnh hoặc thương mại chưa nhận diện có thể xuất hiện riêng với trạng thái sử dụng chưa xác định.

## Tình huống và ví dụ

### Kiểm tra tích hợp Mail

1. Xem runtime Mail được nhận diện và các tài khoản đã kết nối.
2. Mở mô-đun nghiệp vụ để xác nhận đã tích hợp trang tài khoản và không gian làm việc của [Email](../notifications/mail.md).
3. Chạy thử gửi và nhận trong phạm vi kiểm soát, rồi xem dấu hiệu sử dụng có sẵn.

Kiểm chứng riêng việc gửi thư, gọi mô hình hoặc nghiệm thu tính năng. Hệ thống chỉ đếm bản ghi khi có yêu cầu tường minh. Khi thu thập thất bại, hiển thị trạng thái lỗi thay cho số 0.

**Prompt phát triển** cho Coding Agent làm việc trong thư mục ứng dụng.

```text
Dùng Foundation để quản trị viên xem dấu hiệu tích hợp các năng lực Core.
Dùng lại trang hiện có nếu có, giữ quyền truy cập chỉ dành cho danh tính không
bị giới hạn và đặt mục trong phần cài đặt. Thêm đóng góp CLI nếu bản triển khai
cần thông tin liên hệ giữa mô-đun và năng lực. Phân biệt đã cài, đã đăng ký,
đã cấu hình và đã ghi nhận sử dụng. Hiển thị lỗi thu thập riêng với giá trị 0.
Kiểm chứng API từ chối người dùng thông thường và nghiệm thu riêng các năng lực như email.
```

**Xong khi** quản trị viên xem được dữ liệu, người dùng thông thường bị từ chối, và giao diện phân biệt trạng thái chưa xác định hoặc lỗi với kết luận về nghiệp vụ.

## Nguyên tắc và triển khai

Áp dụng các thay đổi dưới đây vào cấu trúc tệp thực tế của ứng dụng.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Thay đổi giao diện và hành vi |
| --- | --- | --- |
| Tùy chọn plugin Client và Server | Cấu hình trang và điều hướng | Hiện tổng quan năng lực trong cài đặt |
| Đóng góp CLI tùy chọn và build | Sinh `foundation-modules.json` | Giữ liên hệ tĩnh của mô-đun sau triển khai |
| Kết quả kiểm chứng nghiệp vụ | Đối chiếu dấu hiệu với nghiệm thu thực tế | Xác định tích hợp hoạt động dựa trên kiểm thử nghiệp vụ |

### Tích hợp và điểm vào

Đăng ký Client và Server sau các dependency như Authentication và Authorization. `foundation()` thêm `/foundation` và mục điều hướng. Template mặc định dùng `foundation({ settingsGroup: true })`.

| Tùy chọn Client | Công dụng |
| --- | --- |
| `path` | Đổi đường dẫn trang |
| `navigation: false` | Giữ trang và ẩn mục menu |
| `routes: false` | Tự gắn `FoundationPage` công khai |
| `settingsGroup: true` | Đặt mục trong phần cài đặt |

Trang và `GET /api/foundation/overview` yêu cầu danh tính không bị giới hạn, chẳng hạn người có bộ quyền root. Đây là kiểm tra đặc quyền riêng với quyền trang thông thường.

### Mô-đun và triển khai

Mô-đun lấy từ điều hướng. Liên hệ được xác định từ các trang, API và dependency backend đã nhận diện. Ô trống trong ma trận biểu thị chưa xác định được liên hệ.

Đăng ký đóng góp `/cli` để giữ liên hệ tĩnh trong bản triển khai. Đóng góp sinh `dist/server/foundation-modules.json`. Ứng dụng hiện có cần build lại. Bước phân tích đọc mã nguồn nghiệp vụ mà không chạy mã đó.

## Ràng buộc phát triển với AI và kiểm chứng

### Ràng buộc riêng của plugin

- Giữ quyền truy cập trang và API chỉ dành cho danh tính không bị giới hạn.
- Hiển thị liên hệ chưa xác định và lỗi thu thập đúng trạng thái. Giữ thời điểm quan sát.
- Kiểm tra sản phẩm triển khai và kiểm chứng riêng hành vi email, mô hình hoặc cơ sở dữ liệu.

### Giới hạn và kiểm chứng

Kiểm tra quyền quản trị viên, trường hợp từ chối người dùng thông thường, làm mới và hiển thị lỗi thu thập. Kết nối khác, tích hợp khó nhận diện và tiện ích chưa hỗ trợ có thể nằm ngoài phạm vi quan sát. Với kết quả đáng tin cậy được giữ lại, hiện thời điểm thu thập ban đầu.

Dùng Foundation để quan sát. Cài, bật và nâng cấp qua [Quản lý plugin](../../developing-apps/manage-plugins.md). Dùng kiểm thử để xác nhận migration và hành vi nghiệp vụ. Xem thêm [Trình khám phá cơ sở dữ liệu](../data-and-files/database-explorer.md).

Yêu cầu Agent báo thay đổi thực tế, bước kiểm tra đã chạy và mục chưa xác minh. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md) về hướng dẫn dự án, Skill và kiểm tra chung.

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-foundation)
