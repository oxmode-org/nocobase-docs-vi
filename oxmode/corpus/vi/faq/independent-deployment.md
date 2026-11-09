---
title: Có thể tự triển khai và vận hành ứng dụng độc lập không?
---

Có. Ứng dụng nghiệp vụ xây trên Core có thể triển khai lên máy chủ riêng và chạy độc lập sau khi phát hành. Yêu cầu nghiệp vụ hằng ngày đi thẳng tới ứng dụng. Mã và dữ liệu thuộc về tổ chức. Nếu dùng Studio để phát triển, ứng dụng production vẫn chạy trên hạ tầng riêng.

Ứng dụng cần cấu hình chạy, cơ sở dữ liệu và các dịch vụ ngoài mà tính năng sử dụng. Chẳng hạn, tính năng gọi mô hình cần cấu hình và quyền truy cập dịch vụ đó trên production.

Trên production, chọn Docker hoặc cài gói triển khai bằng app-installer rồi quản lý tiến trình với PM2. Xem [Chọn phương thức triển khai](../core/deployment/choose-a-deployment-method.md). Gói build và dữ liệu được quản lý riêng. Lập kế hoạch cho cấu hình production, chuyển dữ liệu phát triển hoặc tệp tải lên nếu cần, cấp bí mật và sao lưu.

Khi đổi tính năng nghiệp vụ, kiểm thử, dựng lại và cập nhật bản triển khai. Xem [Phát hành phiên bản ứng dụng mới](../core/deployment/publish-app-release.md).
