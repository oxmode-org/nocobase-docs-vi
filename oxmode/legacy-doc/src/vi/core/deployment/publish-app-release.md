---
title: Phát hành phiên bản ứng dụng
description: Build lại sau khi thay đổi mã, rồi cập nhật ứng dụng hiện có bằng chính cách triển khai ban đầu.
---

Phát hành một phiên bản ứng dụng mới nghĩa là build lại mã đã cập nhật và triển khai lên ứng dụng hiện có. Giữ nguyên cơ sở dữ liệu, cấu hình khi chạy và nơi lưu trữ tệp. URL của ứng dụng thường không đổi.

## Cùng Agent

Cho Agent biết ứng dụng chạy ở đâu và được triển khai thế nào. Ví dụ:

```text
Hãy triển khai phiên bản mới của ứng dụng hiện tại lên server hiện có bằng Docker.
Thư mục triển khai là /srv/nocobase/tasks. Giữ nguyên dữ liệu và cấu hình hiện có, sao lưu trước khi cập nhật, và kiểm tra ứng dụng sau đó.
```

Với app-installer, hãy cung cấp server và thư mục cài đặt. Với Studio, hãy chỉ rõ ứng dụng và môi trường đích.

## Không dùng Agent

Hoàn tất thay đổi mã và kiểm thử, rồi build lại và phát hành bằng cách triển khai ban đầu. Khác biệt chính:

| Cách triển khai | Cách cập nhật |
| --- | --- |
| [Docker](../tutorials/deploy-with-docker.md#phát-hành-bản-mới) | Build image với tag mới, cập nhật tham chiếu image trong Compose, và tạo lại container trong khi giữ nguyên cấu hình và các mount lưu trữ ban đầu. |
| [app-installer](../tutorials/deploy-with-app-installer.md#phát-hành-bản-mới) | Build một gói triển khai mới và chạy `upgrade` trên thư mục cài đặt hiện có. Với triển khai từ xa từ máy phát triển, tiếp tục dùng `deploy --ssh`. |
| [Studio](../tutorials/deploy-to-studio.md#phát-hành-bản-mới) | Tải lên hoặc build một bản phát hành mới trong cùng ứng dụng, rồi triển khai lên môi trường hiện có. |

Xem phần “Phát hành bản mới” trong từng hướng dẫn triển khai để biết các lệnh.

Nếu cấu trúc cơ sở dữ liệu thay đổi, hãy đưa migration mới vào cùng mã và giữ lại các migration đã áp dụng trước đó. Sao lưu cơ sở dữ liệu và tệp, và giữ lại gói hoặc image trước đó trước khi cập nhật. Chuyển về mã cũ không nhất thiết khôi phục được cơ sở dữ liệu.

Sau khi cập nhật, kiểm tra rằng ứng dụng truy cập được, dữ liệu và quyền hiện có được giữ nguyên, và tính năng mới hoạt động. Để nâng cấp các dependency của framework, trước hết làm theo [Nâng cấp NocoBase Core](../developing-apps/upgrade-nocobase-core.md), rồi triển khai theo cùng quy trình.
