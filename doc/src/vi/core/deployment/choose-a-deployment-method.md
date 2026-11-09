---
title: Chọn cách triển khai
description: Triển khai ứng dụng production độc lập bằng Docker hoặc PM2 kết hợp app-installer.
---

Sau khi phát triển và kiểm thử, bạn có thể triển khai ứng dụng NocoBase Core lên máy chủ riêng. Docker chạy ứng dụng trong container. PM2 giám sát tiến trình Node.js, còn app-installer xử lý cài đặt và cập nhật.

Hai hướng dẫn dùng chung [ứng dụng danh mục sản phẩm mẫu](https://github.com/nocobase/docs-examples-v3/blob/b24857f529ae5bb80e97a881b846ea2fd1424242/apps/product-catalog/README.md) và có quy trình cùng Agent lẫn quy trình thủ công.

## Chọn phương thức

| Phương thức | Phù hợp khi | Hướng dẫn |
| --- | --- | --- |
| Docker | Bạn vận hành container, quản lý image và các điểm gắn lưu trữ bền vững | [Triển khai bằng Docker](https://docs.nocobase.com/core/tutorials/deploy-with-docker/) |
| PM2 (app-installer) | Bạn chạy tiến trình Node.js trên Linux và dùng app-installer để cài gói, quản lý cấu hình và cập nhật | [Triển khai bằng PM2](https://docs.nocobase.com/core/tutorials/deploy-with-app-installer/) |

Cả hai phương thức đều dùng cấu hình production riêng, cơ sở dữ liệu và nơi lưu tệp. Xác định nền tảng đích, cơ sở dữ liệu và phương án lưu trữ trước khi build. Xem điều kiện cụ thể trong hướng dẫn đã chọn.

## Chuẩn bị triển khai

- **Mã nguồn build được**. Kiểm thử đạt, dependency và lockfile đã xác định, đích build phù hợp môi trường chạy.
- **Môi trường đã xác định**. Xác nhận máy chủ, thư mục ứng dụng, cổng, URL và quyền truy cập. Cấu hình tên miền, HTTPS và reverse proxy.
- **Cấu hình runtime riêng**. Chuẩn bị cấu hình cơ sở dữ liệu, quản trị viên và dịch vụ. Lưu giữ khóa bí mật đã tạo và đặt cấu hình chứa khóa bí mật ngoài repository.
- **Dữ liệu bền vững**. Xác định vị trí cơ sở dữ liệu và kho tệp, rồi thiết lập quy trình sao lưu và khôi phục.

Kết quả build chứa trang, API, migration và dependency runtime. Cơ sở dữ liệu phát triển, tệp đã tải lên và khóa bí mật runtime phải được xử lý riêng. Cơ sở dữ liệu mới chạy migration và seed cần thiết. Ứng dụng danh mục sản phẩm mẫu khởi tạo vai trò cho danh mục. Nếu cần giữ sản phẩm, người dùng, vai trò tạo qua trang quản trị hoặc các quyền đã cấp trong môi trường phát triển, hãy lập kế hoạch chuyển dữ liệu riêng.

Có thể chạy `node dist/server/standalone.js` để kiểm tra sản phẩm build. Khi triển khai, thiết lập thêm cơ chế giám sát tiến trình, quản lý cấu hình và lưu trữ dữ liệu bền vững.

## Triển khai lần đầu và các bản phát hành tiếp theo

| Triển khai lần đầu | Phát hành tiếp theo |
| --- | --- |
| Chuẩn bị thư mục triển khai và cấu hình production | Dùng lại ứng dụng và thư mục triển khai, giữ các khóa bí mật đang dùng |
| Chạy migration và khởi tạo trên cơ sở dữ liệu mới, hoặc chuyển dữ liệu hiện có theo kế hoạch | Sao lưu dữ liệu hiện có, rà soát rồi áp dụng migration mới |
| Kiểm tra đăng nhập, hành vi nghiệp vụ, quyền và khả năng lưu dữ liệu | Kiểm tra tính năng mới cùng dữ liệu và quyền hiện có |

Với bản phát hành nghiệp vụ tiếp theo, cập nhật mã, kiểm thử, build lại và triển khai theo phương thức ban đầu. Mỗi hướng dẫn có phần phát hành phiên bản mới. Xem [Phát hành phiên bản ứng dụng](https://docs.nocobase.com/core/deployment/publish-app-release/) để so sánh hai quy trình cập nhật.

Để cập nhật framework và dependency liên quan, làm theo [Nâng cấp NocoBase Core](https://docs.nocobase.com/core/developing-apps/upgrade-nocobase-core/), kiểm tra tương thích rồi triển khai.

## Kiểm chứng và khôi phục

Sau khi triển khai, mở URL ứng dụng thực tế để kiểm tra đăng nhập, các thao tác đọc và ghi nghiệp vụ chính, quyền của người dùng thông thường và dữ liệu sau khi khởi động lại. Kiểm tra từng hành vi ngay cả khi build, upload và health check đều thành công.

Trước khi phát hành, giữ bản build trước, cấu hình tương ứng và các bản sao lưu cơ sở dữ liệu, tệp có thể phục hồi. Rollback mã chỉ đưa chương trình về bản cũ. Nếu runtime trước đó không dùng được schema mới, khôi phục dữ liệu tương thích và xử lý các lượt ghi phát sinh kể từ lúc sao lưu. Làm theo hướng dẫn của phương thức đã chọn khi cập nhật và khôi phục.
