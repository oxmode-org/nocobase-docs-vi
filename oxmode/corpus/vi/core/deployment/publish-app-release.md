---
title: Phát hành phiên bản ứng dụng
description: Build lại sau khi sửa mã và cập nhật ứng dụng hiện có bằng phương thức triển khai ban đầu.
---

Để phát hành phiên bản mới, build lại mã đã kiểm chứng rồi cập nhật ứng dụng production hiện có qua Docker hoặc PM2 kết hợp app-installer. Giữ cơ sở dữ liệu production, cấu hình runtime và kho tệp. URL ứng dụng thường giữ nguyên.

## Cùng Agent

Cho Agent biết ứng dụng đang chạy ở đâu và được triển khai theo cách nào. Ví dụ:

```text
Hãy triển khai phiên bản mới của ứng dụng hiện tại lên máy chủ đang dùng bằng Docker.
Thư mục triển khai là /srv/nocobase/shop. Giữ dữ liệu và cấu hình hiện có, sao lưu trước khi cập nhật và kiểm tra ứng dụng sau đó.
```

Với PM2 (app-installer), cung cấp máy chủ và thư mục cài đặt hiện có để app-installer cập nhật ứng dụng.

## Thực hiện thủ công

Hoàn tất sửa mã và kiểm thử, xác nhận commit hoặc phiên bản cần phát hành, rồi build lại và phát hành theo phương thức triển khai ban đầu.

| Phương thức | Cách cập nhật |
| --- | --- |
| [Docker](../tutorials/deploy-with-docker.md#deploy-a-new-version-manually) | Build image với tag mới, sửa tham chiếu image trong Compose và tạo lại container với cấu hình cùng điểm gắn lưu trữ ban đầu. |
| [PM2 (app-installer)](../tutorials/deploy-with-app-installer.md#deploy-a-new-version-manually) | Build, đóng gói và tải lên từ máy phát triển, rồi chạy `upgrade` của app-installer trên server với thư mục cài đặt hiện có. |

Xem phần triển khai phiên bản mới trong từng hướng dẫn để biết lệnh cụ thể.

Nếu cấu trúc cơ sở dữ liệu thay đổi, đưa migration mới vào bản phát hành và giữ các migration đã áp dụng. Sao lưu cơ sở dữ liệu và tệp, đồng thời giữ gói hoặc image trước đó. Nếu quay về mã cũ, kiểm tra riêng cơ sở dữ liệu và khôi phục từ bản sao lưu phù hợp khi cần.

Sau khi cập nhật, kiểm tra ứng dụng truy cập được, dữ liệu và quyền hiện có được giữ, và tính năng mới hoạt động. Để nâng cấp dependency của framework, làm theo [Nâng cấp NocoBase Core](../developing-apps/upgrade-nocobase-core.md) rồi triển khai theo cùng quy trình.
