---
title: NocoBase Core
nav: Tổng quan Core
description: Tạo một ứng dụng, khám phá cấu trúc của nó và học bằng cách xây một ứng dụng quản lý công việc.
---

Bắt đầu từ một dự án đang chạy và xây ứng dụng nghiệp vụ của riêng bạn với NocoBase Core. Làm việc cùng một coding agent hoặc làm theo hướng dẫn thủ công. Tài liệu gốc được viết bằng tiếng Trung; các bản đều dùng chung ứng dụng ví dụ và ảnh chụp màn hình bằng tiếng Anh.

## Bắt đầu sử dụng

1. [Core là gì](getting-started/what-is-core.md): hiểu mối quan hệ giữa Core, template, plugin và ứng dụng.
2. [Tạo ứng dụng](getting-started/create-app.md): tạo, cấu hình và khởi động một ứng dụng, rồi đăng nhập.
3. [Cấu trúc dự án](getting-started/project-structure.md): tìm các trang, API, migration cơ sở dữ liệu và test.
4. [Xây ứng dụng đầu tiên](tutorials/build-your-first-feature.md): xây trọn một ứng dụng quản lý công việc của nhóm cùng Agent hoặc thủ công, viết test và chọn cách triển khai.

## Phát triển ứng dụng

Tra cứu các quy ước của ứng dụng theo chủ đề; chuẩn bị dữ liệu và endpoint tương ứng khi chạy một ví dụ.

- [Tổng quan phát triển ứng dụng](developing-apps/overview.md): ứng dụng, template, plugin và đường đi từ trang đến cơ sở dữ liệu.
- [Phát triển cùng Agent](developing-apps/develop-with-an-agent.md): yêu cầu, hướng dẫn dự án và kiểm tra.
- [Mô hình dữ liệu và migration](developing-apps/data-models-and-migrations.md): trường, quan hệ, ràng buộc và dữ liệu hiện có.
- [Truy vấn và thao tác dữ liệu](developing-apps/querying-data.md): Repository, phân trang, quan hệ, transaction và Query.
- [Dịch vụ nghiệp vụ và HTTP API](developing-apps/apis-and-services.md): service, kiểm tra dữ liệu đầu vào, phân quyền và khai báo API.
- [Trang, route và điều hướng](developing-apps/pages-routes-and-navigation.md): đăng ký, menu, route con và quyền truy cập.
- [UI component và tương tác](developing-apps/pages-and-interactions.md): danh sách, form, hộp thoại và phản hồi.
- [Cấu hình ứng dụng và cài đặt hệ thống](developing-apps/configuration-and-settings.md): cấu hình khi chạy, cài đặt nghiệp vụ và quản trị.
- [Đa ngôn ngữ và theme](developing-apps/localization-and-themes.md): nội dung chữ, tài nguyên ngôn ngữ và giao diện nhất quán.
- [Quản lý plugin](developing-apps/manage-plugins.md): năng lực có sẵn, đăng ký, cập nhật, gỡ bỏ và mở rộng.
- [Kiểm thử và nghiệm thu](developing-apps/testing-and-acceptance.md): phạm vi test, dữ liệu thật, phân quyền và luồng người dùng.

## Triển khai và vận hành

- [Chọn cách triển khai](deployment/choose-a-deployment-method.md): so sánh các lựa chọn runtime và chuẩn bị cấu hình, dữ liệu và khả năng khôi phục.
- [Triển khai bằng Docker](tutorials/deploy-with-docker.md): build image và chạy container với các thư mục lưu trữ bền vững.
- [Triển khai bằng app-installer](tutorials/deploy-with-app-installer.md): quản lý cài đặt trên server, tiến trình và cập nhật ứng dụng.
- [Triển khai lên Studio](tutorials/deploy-to-studio.md): quản lý ứng dụng, môi trường và bản phát hành trong Studio.
- [Nâng cấp NocoBase Core](developing-apps/upgrade-nocobase-core.md): hợp nhất template mới hơn cùng Agent hoặc thủ công, kiểm tra tương thích và triển khai ứng dụng đã nâng cấp.
- [Phát hành phiên bản ứng dụng](deployment/publish-app-release.md): build lại và triển khai lại, với các bước cập nhật cho từng cách triển khai.
