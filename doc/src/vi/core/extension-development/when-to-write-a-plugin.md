---
title: Khi nào nên viết plugin
description: Dùng plugin để tái sử dụng mã hoặc tổ chức tính năng thành các mô-đun dễ tích hợp và bảo trì.
---

Plugin đóng gói một tính năng thành đơn vị độc lập để ứng dụng tích hợp khi cần. Hai lý do chính để viết plugin là tái sử dụng mã và tổ chức mã theo mô-đun. Mỗi lý do đều có thể đủ để chọn plugin.

## 1. Tái sử dụng mã

Khi nhiều ứng dụng cần cùng một chức năng, đóng gói phần dùng chung thành plugin để mỗi ứng dụng có thể cài đặt và sử dụng.

Ví dụ, nhiều ứng dụng nghiệp vụ có thể dùng chung một nhà cung cấp SMS. Plugin phụ trách gửi tin, cấu hình nhà cung cấp và xử lý lỗi. Ứng dụng quản lý đơn hàng quyết định khi nào gửi thông báo đơn hàng, còn ứng dụng phê duyệt quyết định khi nào gửi lời nhắc. Cả hai dùng chung phần triển khai SMS.

Sửa lỗi và cải tiến ở một nơi, rồi nâng cấp từng ứng dụng vào thời điểm phù hợp. Plugin cung cấp giao diện công khai ổn định. Ứng dụng quyết định cách kết hợp tính năng và cấu hình cho nghiệp vụ của mình.

Trước khi triển khai chức năng dùng chung, kiểm tra các plugin hiện có theo [Quản lý plugin](../developing-apps/manage-plugins.md). Tự triển khai nếu các năng lực sẵn có chưa đáp ứng yêu cầu.

## 2. Tổ chức mã theo mô-đun

Trong một ứng dụng, gom các trang, endpoint, dịch vụ và logic dữ liệu liên quan vào một mô-đun để ranh giới tính năng rõ ràng, thuận tiện cho việc cài đặt, cấu hình, bảo trì và nâng cấp.

Ví dụ, khi tính năng đơn hàng, tồn kho và báo cáo phát triển, có thể tổ chức chúng thành các plugin riêng.

```text
my-app/
├── client/                        # Tổ hợp giao diện và điểm vào của ứng dụng
├── server/                        # Tổ hợp dịch vụ và điểm vào của ứng dụng
├── packages/
│   ├── app-plugin-orders/         # Mô-đun đơn hàng
│   ├── app-plugin-inventory/      # Mô-đun tồn kho
│   └── app-plugin-reports/        # Mô-đun báo cáo
├── package.json
└── pnpm-workspace.yaml
```

Mỗi plugin có thể duy trì phần triển khai, các điểm xuất công khai, cấu hình và kiểm thử riêng. Ứng dụng chọn plugin và cách kết hợp chúng. Thành viên trong nhóm có thể làm việc theo mô-đun với ít phụ thuộc hơn vào cách triển khai nội bộ của tính năng khác.

Các mô-đun vẫn có thể phụ thuộc lẫn nhau. Ví dụ, plugin báo cáo nên lấy dữ liệu đơn hàng qua giao diện công khai được định nghĩa rõ. Khi cần sửa nội bộ plugin đơn hàng, ranh giới này giúp nhóm biết phần nào có thể đổi và phần nào cần giữ tương thích.

## Phát triển plugin trong ứng dụng

Trước hết, [tạo ứng dụng bằng create-app](https://docs.nocobase.com/getting-started/develop-your-first-app/#create-and-start-the-application). Ứng dụng hỗ trợ monorepo. Plugin cục bộ nằm trong `packages/`, được liên kết qua dependency của pnpm workspace và được phát triển, build cùng ứng dụng.

**Có thể dùng plugin riêng trong ứng dụng hiện tại mà không cần phát hành lên npm.** Khi ứng dụng khác cần dùng, xem xét cách phân phối, quản lý phiên bản và tương thích. Bạn có thể bắt đầu bằng việc tổ chức tính năng thành plugin trong ứng dụng hiện tại, rồi chia sẻ khi tính năng ổn định.

Phạm vi tính năng quyết định kích thước plugin. Plugin có thể chỉ cung cấp một lệnh CLI, hoặc gồm trang Client, endpoint Server và logic cơ sở dữ liệu. Xem [Cấu trúc plugin](https://docs.nocobase.com/core/extension-development/plugin-structure/) để biết thư mục và điểm vào.

## Chọn cách tổ chức phù hợp

Trang đơn giản hoặc logic nghiệp vụ có thể đặt trực tiếp trong ứng dụng. Hàm, kiểu và tiện ích dùng chung qua import có thể nằm trong mô-đun thông thường hoặc package dùng chung. Cân nhắc plugin khi cần tích hợp và bảo trì tính năng như một đơn vị, hoặc chia sẻ tính năng cho nhiều ứng dụng.

Xem [Tạo plugin](https://docs.nocobase.com/core/extension-development/create-plugin/) để dựng khung bằng `@nocobase/create-plugin`. Sau khi nắm cấu trúc, xem [Viết plugin đầu tiên](https://docs.nocobase.com/core/extension-development/write-your-first-plugin/) để triển khai, đăng ký và kiểm chứng.

Khi chia sẻ cho nhiều ứng dụng có vòng đời phiên bản riêng, xem [Build và phát hành](https://docs.nocobase.com/core/extension-development/publish-plugin/).
