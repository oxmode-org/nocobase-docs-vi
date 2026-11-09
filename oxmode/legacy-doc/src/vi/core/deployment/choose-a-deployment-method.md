---
title: Chọn cách triển khai
description: Chọn Docker, app-installer hoặc NocoBase Studio, và chuẩn bị cho lần triển khai đầu, các bản phát hành sau và việc khôi phục dữ liệu.
---

Sau khi phát triển và kiểm thử ứng dụng, hãy triển khai nó bằng Docker, app-installer hoặc NocoBase Studio. Phần này áp dụng cho các ứng dụng NocoBase Core của chính bạn. Ba hướng dẫn đều dùng ứng dụng quản lý công việc làm ví dụ, và mỗi hướng dẫn có hai cách **Cùng Agent** và **Không dùng Agent**.

Nếu bạn đã hoàn thành [Xây ứng dụng đầu tiên](../tutorials/build-your-first-feature.md), hãy chọn một cách dưới đây để triển khai nó. Bạn không cần triển khai ba lần.

## Chọn một cách

| Cách | Phù hợp khi | Hướng dẫn |
| --- | --- | --- |
| Docker | Bạn chạy container và tự quản lý image cùng các thư mục lưu trữ bền vững | [Triển khai bằng Docker](../tutorials/deploy-with-docker.md) |
| app-installer | Bạn quản lý một server và muốn có công cụ lo việc cài đặt, tiến trình pm2 và cập nhật | [Triển khai bằng app-installer](../tutorials/deploy-with-app-installer.md) |
| NocoBase Studio | Bạn đã dùng Studio để quản lý ứng dụng, môi trường và bản phát hành | [Triển khai lên Studio](../tutorials/deploy-to-studio.md) |

Nếu bạn đã dùng Studio, hãy theo quy trình môi trường và phát hành của nó. Với server bạn tự quản lý, chọn Docker hoặc app-installer tùy cách vận hành của bạn. Xác định nền tảng đích, cơ sở dữ liệu và phương án lưu trữ trước khi build; mỗi hướng dẫn đều nêu điều kiện cần.

## Chuẩn bị triển khai

- **Mã nguồn build được**: test đạt, dependency và lockfile đã ổn định, và đích build khớp với môi trường chạy.
- **Môi trường đã xác định**: xác nhận server hoặc môi trường Studio, thư mục ứng dụng, cổng, URL truy cập và quyền. Cấu hình tên miền, HTTPS và reverse proxy cho môi trường đó.
- **Cấu hình chạy tách riêng**: chuẩn bị thiết lập cơ sở dữ liệu, quản trị viên và các dịch vụ. Giữ lại các khóa bí mật đã sinh, và không để cấu hình chứa khóa bí mật trong repository.
- **Dữ liệu bền vững**: xác định nơi lưu cơ sở dữ liệu và tệp, và thiết lập quy trình sao lưu, khôi phục.

Kết quả build gồm trang, API, migration và các dependency khi chạy. Nó không tự động gồm cơ sở dữ liệu lúc phát triển, các tệp đã tải lên hay khóa bí mật khi chạy. Một cơ sở dữ liệu mới sẽ chạy migration và các seed bắt buộc. Ví dụ bắt đầu sử dụng hiện tại khởi tạo các vai trò cho công việc nhưng không sao chép công việc, người dùng trong nhóm hay việc gán vai trò từ môi trường phát triển. Các vai trò và quyền khác tạo qua trang quản trị cũng cần chuyển dữ liệu riêng nếu muốn giữ lại.

Chạy `node dist/server/standalone.js` có thể dùng để kiểm tra một bản build. Một lần triển khai còn cần giám sát tiến trình, quản lý cấu hình và lưu trữ dữ liệu bền vững.

## Lần triển khai đầu và các bản phát hành sau

| Lần triển khai đầu | Bản phát hành sau |
| --- | --- |
| Tạo thư mục ứng dụng hoặc thư mục cài đặt và cấu hình nó | Dùng lại ứng dụng và thư mục triển khai, giữ nguyên các khóa bí mật ổn định |
| Chạy migration và khởi tạo bắt buộc trên cơ sở dữ liệu mới, hoặc chuyển dữ liệu hiện có theo kế hoạch | Sao lưu dữ liệu hiện có, review và áp dụng các migration mới |
| Kiểm tra đăng nhập, hành vi nghiệp vụ, phân quyền và độ bền dữ liệu | Kiểm tra cùng lúc hành vi mới, dữ liệu được giữ lại và các quyền hiện có |

Với các bản phát hành nghiệp vụ sau, hãy sửa mã nguồn, kiểm thử, build lại và cập nhật theo đúng cách triển khai ban đầu. Mỗi hướng dẫn có phần "Publish a new release". [Phát hành phiên bản ứng dụng](publish-app-release.md) tóm tắt khác biệt giữa ba cách cập nhật.

Để cập nhật framework và các dependency liên quan, trước hết làm theo [Nâng cấp NocoBase Core](../developing-apps/upgrade-nocobase-core.md), kiểm tra tương thích, rồi mới triển khai.

## Kiểm tra và khôi phục

Sau khi triển khai, hãy kiểm tra URL thực tế của ứng dụng, đăng nhập, các thao tác đọc ghi nghiệp vụ chính, quyền của người dùng thường và độ bền dữ liệu sau khi khởi động lại. Chỉ build thành công, upload xong hay health check đạt thì chưa chứng minh được những điều này.

Trước khi phát hành, giữ lại bản build trước, cấu hình tương ứng, và các bản sao lưu cơ sở dữ liệu và tệp có thể khôi phục. Rollback mã chương trình không tự động hoàn tác migration hay dữ liệu nghiệp vụ đã ghi. Nếu runtime cũ không dùng được schema mới, hãy khôi phục dữ liệu tương thích và tính đến các thay đổi đã ghi kể từ lần sao lưu. Làm theo hướng dẫn của cách triển khai đã chọn cho các thao tác cập nhật và khôi phục.
