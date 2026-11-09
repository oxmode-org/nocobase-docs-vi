---
title: Tổng quan phát hành
description: Theo dõi bản xem trước PR, triển khai kiểm thử, phiên bản và bản ghi production.
---

**Releases** tập hợp tiến độ bàn giao theo dự án. Chọn một dự án để xem bản xem trước, ứng dụng staging, phiên bản và các lượt triển khai production đã ghi nhận.

![Theo dõi bản xem trước, kiểm thử và bàn giao phiên bản của dự án](https://static-docs.nocobase.com/studio-en-guide-releases-20261031.png)

| Giai đoạn | Nội dung hiển thị | Bước tiếp theo |
| --- | --- | --- |
| Preview | Ứng dụng cô lập của PR và trạng thái build | Kiểm chứng thay đổi |
| Staging | Commit hoặc phiên bản đang chạy trong ứng dụng kiểm thử | Kiểm tra thay đổi đã hợp nhất |
| Release | Phiên bản được xác định bằng tag Git và các gói đầu ra tương ứng | Chọn phiên bản cần bàn giao |
| Production | Phiên bản do đội ngũ ghi nhận | Cập nhật bản ghi sau khi triển khai trên hạ tầng của mình |

Studio có thể lưu trữ bản xem trước và ứng dụng kiểm thử. Đội ngũ tự triển khai production bằng image hoặc trình cài đặt, sau đó ghi nhận phiên bản trong Studio.

<a id="review-pending-work"></a>

## Rà soát công việc đang chờ phát hành

**Pending release** liệt kê đầu việc đã hoàn tất và chưa lên production, đồng thời cho biết đầu việc nào đang được kiểm thử. Kiểm tra phiên bản gồm những đầu việc nào trước khi phát hành và triển khai.

Dấu kiểm thử và production trên đầu việc được tính từ quan hệ giữa các commit. Dấu production dựa trên phiên bản do người phụ trách dự án ghi nhận. Nếu ghi nhận phiên bản cũ hơn, Studio bỏ dấu production khỏi các thay đổi vắng mặt trong phiên bản đó.

<a id="continue-delivery"></a>

## Tiếp tục bàn giao

- Kiểm chứng trước khi hợp nhất với [Bản xem trước PR](previews.md).
- Quản lý ứng dụng kiểm thử trong [Môi trường được lưu trữ](../admin/environments.md).
- Chuẩn bị phiên bản và gói đầu ra theo [Phiên bản và bản phát hành](versions.md).
- Triển khai và ghi nhận production theo [Bàn giao lên production](../project/release.md).

Người phụ trách dự án nhận lời nhắc về công việc đang chờ. Lỗi triển khai và yêu cầu phê duyệt cho môi trường kiểm thử được bảo vệ xuất hiện trong [Hộp thư](../use/inbox.md).
