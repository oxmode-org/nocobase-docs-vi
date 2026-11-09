---
title: Kết nối CI
description: Kết nối CI của repository với Studio để mỗi PR có một preview, và các lần merge, phát hành được triển khai lên staging và production.
---

Studio không tự build mã. CI của repository lo việc build và triển khai, ví dụ GitHub Actions hoặc GitLab CI. Khi CI đã kết nối với Studio:

- Mỗi PR có một preview, để người phụ trách issue dùng thử thay đổi trước khi nghiệm thu.
- Push lên một nhánh hoặc tạo tag sẽ triển khai lên staging hoặc production, và môi trường được bảo vệ cần người duyệt đồng ý.
- Issue cho biết thay đổi của nó đã đến những môi trường nào.

Không có CI, đội Agent vẫn xây dựng và mở PR. Bạn chỉ không có preview và triển khai.

## Kiểm tra trước hai điều

- **CI truy cập được Studio.** Sau khi build, CI tải kết quả lên địa chỉ của Studio. Nếu Studio chỉ ở mạng nội bộ, CI trên cloud như GitHub-hosted Actions không truy cập được. Hãy dùng một CI runner tự host truy cập được Studio, hoặc cho Studio một địa chỉ công khai.
- **Có môi trường để triển khai.** Studio có sẵn môi trường **Preview** cho preview của PR. Quản trị viên thêm staging và production. Xem [Môi trường triển khai](../admin/environments.md).

## Thiết lập CI

Mỗi lần thiết lập kết nối một trigger cho một ứng dụng. Muốn vừa có preview cho PR vừa triển khai lên staging, hãy thiết lập hai lần.

1. Mở dự án, vào **Project settings › Deployment** và bấm **Set up CI**.
2. Chọn một **Trigger**:

   | Trigger | Triển khai gì | Môi trường mặc định |
   | --- | --- | --- |
   | Pull request | Mỗi PR thay đổi ứng dụng được triển khai thành một ứng dụng riêng và bị xóa khi PR được merge hoặc đóng | Preview |
   | Push to a branch | Build và triển khai mỗi lần push lên nhánh, mặc định là nhánh mặc định của repository | Staging (môi trường tên staging) |
   | Tag | Build và triển khai mỗi tag khớp mẫu, mặc định `v*` | Một môi trường được bảo vệ, như production |

3. **Environment** mặc định theo trigger, và bạn có thể đổi. Môi trường được bảo vệ có đánh dấu: mỗi lần triển khai từ CI sẽ thành một yêu cầu chờ người duyệt.
4. Ở **App**, nhập thư mục của ứng dụng trong repository (`.` nếu ở thư mục gốc) và app ID. Preview của PR được triển khai với tên `<app ID>-pr-<number>`.
5. Chọn cách thiết lập:
   - **Template**: sao chép file CI và lệnh lưu khóa bí mật CI, rồi tự commit file và chạy lệnh.
   - **Prompt for your agent**: cùng nội dung nhưng dưới dạng prompt cho công cụ lập trình trên máy bạn, nó sẽ commit file CI và lưu khóa bí mật.

Studio không bao giờ ghi gì vào repository của bạn. Bạn hoặc công cụ lập trình của bạn commit file CI và lưu khóa bí mật. Trên GitHub, file CI là `.github/workflows/nb-studio-<app>-<purpose>.yml` và đọc Actions secret `NB_STUDIO_API_KEY`. Trên GitLab, file CI nằm trong `.gitlab/` và được include từ `.gitlab-ci.yml` của repository.

## Khóa CI của repository

CI dùng một API key của tổ chức để tải lên và triển khai lên Studio. Key này không thuộc về ai, nên vẫn hoạt động khi người thiết lập CI rời nhóm. Tạo key cần quyền quản lý dự án, như là trưởng dự án.

- Key chỉ hiển thị một lần, khi được tạo, và Studio không lưu lại. Các lệnh trong template và prompt lưu thẳng nó vào CI secret của nền tảng lưu trữ mã mà không hiển thị trên màn hình.
- Key hết hạn sau 90 ngày. Mười bốn ngày và ba ngày trước khi hết hạn, và vào chính ngày đó, Studio nhắc trưởng dự án và quản trị viên trong hộp thư của họ, kèm lệnh để thay key.
- Bạn có thể thấy key trong **Settings › API keys**, có ghi repository quản lý nó. Tắt hoặc xóa key thì CI sẽ ngừng triển khai.

## Kiểm tra thiết lập

Sau khi CI báo cáo lần đầu, **CI status** trong **Project settings › Deployment** liệt kê các ứng dụng CI triển khai, nhóm theo môi trường, cùng lần build và triển khai mới nhất. Trước đó, nó hiển thị đang chờ báo cáo đầu tiên.

**Xong khi**: khi bạn mở một PR, preview của nó xuất hiện trên trang issue, và bạn mở được và đăng nhập bằng tài khoản quản trị viên đầu tiên.

## Preview

- Preview dùng dữ liệu mẫu, và Studio tạo tài khoản quản trị, nên không dính đến dữ liệu thật của công ty. Ai sửa được issue đều thấy tên đăng nhập và mật khẩu của quản trị viên đầu tiên trên trang issue.
- Môi trường preview chạy tối đa 20 preview cùng lúc. Một preview dừng sau 10 phút không có người truy cập, chuyển sang ngủ sau 24 giờ, và khởi động lại khi có người mở. Đổi các mặc định này trong **Releases › Deploy environments**.
- Khi PR được merge hoặc đóng, preview của nó tự động bị xóa.
- Với issue không cần preview, bật **No preview needed** trong thuộc tính của issue. Khi đó Agent gắn nhãn `no-preview` cho PR, và template CI bỏ qua preview.

Tiếp theo, [đi qua yêu cầu đầu tiên](first-request.md).
