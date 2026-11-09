---
title: Tổng quan framework
description: Tìm hiểu các cơ chế dùng chung, phạm vi runtime và vai trò của các package nền tảng NocoBase.
---

Chương này trình bày cơ chế dùng chung của ứng dụng và plugin, cùng vai trò, cách sử dụng và ranh giới runtime của các package `@nocobase/*` nền tảng. Để xem quy trình triển khai tính năng, bắt đầu từ [Phát triển ứng dụng](../developing-apps/overview.md) hoặc [Phát triển plugin](../extension-development/when-to-write-a-plugin.md).

## Runtime và cơ chế dùng chung

Ứng dụng kết hợp runtime client, server và CLI. Plugin bổ sung năng lực qua các điểm vào công khai. Cả hai dùng chung hợp đồng dịch vụ, với vị trí đăng ký riêng.

| Câu hỏi | Đọc thêm |
| --- | --- |
| Ứng dụng khởi động thế nào và plugin tham gia ra sao? | [Runtime client](runtime/client.md), [Runtime server](runtime/server.md), [Runtime CLI](runtime/cli.md), [Nạp plugin](runtime/plugins.md), [Khởi động và vòng đời](runtime/lifecycle.md) |
| Đăng ký, chia sẻ và giải phóng dịch vụ nghiệp vụ thế nào? | [Container dịch vụ](services/container.md), [Hợp đồng và Token](services/tokens.md), [ServiceProvider](../extension-development/service-provider.md), [Tích hợp client và server](services/integration.md) |
| React Context được gắn vào cây trang thế nào? | [React Provider](runtime/react-providers.md) |
| Khai báo và gọi HTTP API thế nào? | [Route và ngữ cảnh yêu cầu](http/routes.md), [Middleware](http/middleware.md), [Kiểm tra dữ liệu và phản hồi](http/validation.md), [Repository API](http/repository-routes.md), [API Client](http/api-client.md) |

Cả hai phía đều dùng container và dependency injection. Trình duyệt và server có container, instance và vòng đời riêng. Dùng chung định nghĩa Token chỉ thống nhất cách định danh. Các lời gọi giữa hai runtime vẫn đi qua API.

## Package nền tảng

Mục lục tổ chức theo chức năng. Mỗi bài giải thích cơ chế của package và cách host tích hợp package đó. Các package chính gồm:

| Package | Vai trò | Đọc thêm |
| --- | --- | --- |
| `@nocobase/service-provider` | Container, Token, dependency injection và vòng đời Provider | [Container dịch vụ](services/container.md) |
| `@nocobase/db` | Kết nối, mô hình, truy vấn, transaction và thay đổi schema | [Cơ sở dữ liệu](database/overview.md) |
| `@nocobase/caching` | Cache theo namespace, bộ đếm và Bloom filter | [Bộ nhớ đệm](support/caching.md) |
| `@nocobase/drive` | Thao tác tệp và driver lưu trữ | [Lưu trữ tệp và driver](file-storage.md) |
| `@nocobase/jobs` | Thực thi tác vụ nền và lịch định kỳ | [Tác vụ nền](background/jobs.md), [Lập lịch](background/scheduling.md) |
| `@nocobase/queue` | Tạo, tiêu thụ và kiểm soát việc chuyển thông điệp | [Hàng đợi thông điệp](background/queues.md) |
| `@nocobase/realtime` | Topic, phát thông điệp và đăng ký nhận theo thời gian thực | [Giao tiếp thời gian thực](realtime/topics.md) |
| `@nocobase/logging` | Log có cấu trúc, đích ghi và luân chuyển log | [Ghi log](support/logging.md) |
| `@nocobase/snowflake` | Sinh ID dựa trên thời gian, worker và số thứ tự | [Sinh ID](support/ids.md) |

Chương cơ sở dữ liệu bao gồm kết nối, dialect, mô hình, đọc ghi, quan hệ, transaction, migration và seed. Xem [Tạo bảng và khởi tạo dữ liệu](../developing-apps/data-models-and-migrations.md) để biết cách tổ chức tệp ứng dụng, hoặc [Tài nguyên cơ sở dữ liệu và migration](../extension-development/database-and-migrations.md) để khai báo tài nguyên plugin.

## Dùng package trong ứng dụng và plugin

Package nền tảng định nghĩa năng lực. Runtime ứng dụng tích hợp cấu hình và instance vào host. Phần lớn dịch vụ server được lấy từ `app.container` qua Token công khai. Token cơ sở dữ liệu đến từ `@nocobase/db`. Token của host cho cache, lưu trữ, tác vụ và các dịch vụ khác đến từ các điểm vào `@nocobase/app-server/*` tương ứng.

Ứng dụng và plugin nên tái sử dụng instance của host. Dịch vụ nghiệp vụ có thể nhận dependency qua constructor. Provider phân giải và lắp ghép các dependency đó. Plugin quản lý executor, lượt đăng ký nhận và topic do mình đăng ký. Host đóng các instance dùng chung như kết nối cơ sở dữ liệu và dịch vụ hàng đợi. Xem từng hướng dẫn để xác định bên quản lý tài nguyên và [Tích hợp client và server](services/integration.md) để biết vị trí đăng ký.

Script độc lập và bài kiểm thử có thể tạo instance riêng và chịu trách nhiệm cấu hình, khởi động, dọn dẹp. Các ví dụ độc lập minh họa vòng đời này. Trong ứng dụng, tái sử dụng instance thay vì tạo lại theo từng yêu cầu.

## Quan hệ với các tính năng plugin

Package lưu trữ cung cấp disk và thao tác tệp. Plugin tệp bổ sung bản ghi, tải lên và quyền truy cập. Package jobs thực thi và lập lịch. Plugin scheduler bổ sung trang quản lý và lịch sử thực thi. Realtime chuyển thay đổi đến bên nhận. Plugin thông báo có thể lưu thông báo lâu dài và cung cấp hộp thư cá nhân.

Xem [Sử dụng plugin](../using-plugins/overview.md) để tích hợp tính năng sẵn có. Các cơ chế cấp thấp được mô tả trong chương này. Tra cứu các điểm vào công khai và chỉ mục tham số trong [Tham chiếu API](../reference/api.md).
