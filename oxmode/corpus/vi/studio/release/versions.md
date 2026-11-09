---
title: Phiên bản và bản phát hành
description: Xác định phiên bản bàn giao bằng tag Git và kiểm tra đầu việc cùng gói triển khai tương ứng.
---

Studio nhận diện phiên bản từ tag Git và xác định các đầu việc có trong từng phiên bản. Dòng phát hành quy định chuỗi tag. Gói đầu ra chứa tệp hoặc image dùng để triển khai.

![Các phiên bản, đầu việc đi kèm và gói triển khai](https://static-docs.nocobase.com/studio-en-guide-versions-20261031.png)

<a id="configure-release-lines"></a>

## Cấu hình dòng phát hành

Chỉnh **Release lines** trong **Project settings › Code repositories**. Chọn tiền tố được gợi ý từ các tag hiện có hoặc nhập mẫu kết thúc bằng `*`, chẳng hạn `v*` hoặc `release-beta/*`.

Một kho mã có thể có nhiều dòng phát hành không chồng lấn. Bật ẩn tiền tố để hiển thị `release-beta/1.2.0` thành `1.2.0`. Nếu kho chưa có tag, tạo tag phiên bản đầu tiên.

<a id="publish-a-version"></a>

## Công bố phiên bản

1. Chọn dự án trong **Releases** rồi mở **How to publish**.
2. Chọn dòng phát hành, nhánh và commit đích. Dùng commit của ứng dụng kiểm thử đang chạy hoặc nhập SHA đầy đủ.
3. Rà soát các đầu việc được đưa vào phiên bản và các đầu việc đang chờ nằm ngoài commit đó.
4. Xác nhận tag, rồi sao chép và chạy các lệnh được tạo để tạo và đẩy tag lên kho mã.

Studio phát hiện phiên bản mới qua webhook và truy vấn định kỳ. Khi đổi dòng phát hành, Studio tính lại quan hệ giữa phiên bản và đầu việc, đồng thời giữ các gói đầu ra và lịch sử triển khai.

<a id="artifacts"></a>

## Gói đầu ra

Gói đầu ra có thể là tệp nén ứng dụng hoặc image. Ứng dụng NocoBase tạo tệp nén triển khai bằng `pnpm build --tar`. CI hoặc agent lập trình dựng image rồi đẩy lên registry.

Từ danh sách phiên bản, có thể kiểm tra gói đầu ra, tải tệp nén hoặc mở các thao tác triển khai. Xem [Kiểm tra và CI](../configure/checks.md) về dựng và tải gói lên, [Môi trường được lưu trữ](../admin/environments.md) về kiểm thử và [Bàn giao lên production](../project/release.md) về triển khai production.
