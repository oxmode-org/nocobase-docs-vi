---
title: Phát hành lên production
description: Kiểm thử trên staging, chọn đầu việc và tạo tag, triển khai lên máy chủ rồi ghi nhận phiên bản trong Studio.
---

Khi dự án đã ở Studio, trang **Releases** hiển thị môi trường chứa thay đổi, các đầu việc có trong bản phát hành và phiên bản đang chạy trên production.

Studio lưu trữ môi trường xem trước và staging. Production chạy trên máy chủ của tổ chức. Đội ngũ triển khai theo hướng dẫn rồi ghi lại phiên bản trong Studio.

| Giai đoạn | Nơi chạy | Khi cập nhật |
| --- | --- | --- |
| Preview | Studio lưu trữ | Mỗi PR, đã thiết lập trong [Đưa dự án vào Studio](bring-into-studio.md) |
| Staging | Studio lưu trữ | Sau mỗi lần hợp nhất, CI dựng và triển khai |
| Release | Kho mã | Khi tạo tag khớp dòng phát hành |
| Production | Máy chủ của tổ chức | Sau khi triển khai theo hướng dẫn và ghi phiên bản trong Studio |

![Trang Releases có Preview, Staging, Release, Production và đầu việc chờ phát hành](https://static-docs.nocobase.com/20261030-studio-project-releases.webp)

<a id="1-deploy-to-staging-after-merging"></a>

## 1. Triển khai lên staging sau khi hợp nhất

Đội ngũ dùng staging để thử trước khi phát hành. Quản trị viên thêm môi trường trong **Hosted environments**. Xem [Môi trường triển khai](../studio/admin/environments.md).

Mở **Releases** của itam-lite và bấm **Deployment guide** trong cột **Staging**. Nhập `itam-lite-staging` làm ID ứng dụng, chọn môi trường staging rồi bấm **Connect CI** ở hàng cùng tên. Từ đó, CI của kho mã dựng và tải gói lên rồi triển khai staging sau mỗi lần hợp nhất.

![Triển khai staging bằng agent, CI hoặc lệnh thủ công](https://static-docs.nocobase.com/20261030-studio-staging-deploy.webp)

Sau khi kết nối, hợp nhất một PR khác để cập nhật staging. Nhờ Xu Ning thực hiện quy trình thật trên staging. Bắt đầu kiểm kê một địa điểm, nhờ hỗ trợ CNTT kiểm tra vài thiết bị, kết thúc rồi xem kết quả và danh sách sai lệch. Nếu có vấn đề, tạo đầu việc mới trong Studio.

Hoàn tất khi cột **Staging** hiển thị phiên bản đang chạy và Xu Ning đã hoàn tất một đợt kiểm kê trên đó.

<a id="2-look-at-the-issues-pending-release"></a>

## 2. Xem đầu việc chờ phát hành

**Pending release** ở cuối trang **Releases** liệt kê các đầu việc đã xong và đang chờ phát hành. Cột **Where it is** cho biết từng đầu việc đang **In staging** hay **Not deployed yet**. Kiểm tra danh sách trước khi phát hành. Ví dụ đang có kiểm kê và thanh lý thiết bị.

<a id="3-set-up-a-release-line"></a>

## 3. Thiết lập dòng phát hành

Dòng phát hành xác định mẫu tag nào được tính là bản phát hành, ví dụ `v*`. Mở **Settings › Code repositories**, chỉnh **Release lines** cho itam-lite rồi nhập `v*`. Cột **Release** yêu cầu thiết lập mục này trước khi phát hành.

<a id="4-tag-and-publish-the-release"></a>

## 4. Tạo tag và công bố bản phát hành

Trong cột **Release**, bấm **How to publish**:

1. Chọn kho itam-lite và dòng phát hành `v*`.
2. Trong **Based on staging environment**, chọn môi trường vừa thiết lập. Commit đích là commit đang chạy trên staging.
3. Có thể đổi **Suggested tag**, chẳng hạn thành `v1.1.0`.
4. Xem **Included issues** và các đầu việc ngoài bản phát hành, rồi xác nhận có cả kiểm kê và thanh lý.
5. Bấm **Copy commands** và chạy lệnh trong kho itam-lite.

![Chọn dòng phát hành và staging, kiểm tra đầu việc rồi sao chép lệnh tạo tag](https://static-docs.nocobase.com/20261030-studio-publish-pending.webp)

Sau khi tag được đẩy, Studio nhận diện và cập nhật các đầu việc tương ứng.

Hoàn tất khi kho có tag `v1.1.0`, cột **Release** hiển thị phiên bản đó và hai đầu việc không còn nằm trong **Pending release**.

<a id="5-deploy-to-your-server"></a>

## 5. Triển khai lên máy chủ

Trong cột **Production**, bấm **Deployment guide**, chọn `v1.1.0` và chọn **Docker** hoặc **Installer** theo máy chủ. Ví dụ dùng Docker như ở phần 1.

Chọn **Let your agent deploy it** để lấy prompt cho agent lập trình. Agent cần quyền SSH vào máy chủ. Agent tải gói, dựng image, chuẩn bị cấu hình, sao lưu cơ sở dữ liệu trước khi nâng cấp và kiểm tra ứng dụng truy cập được.

![Chọn phiên bản và phương thức rồi chuyển prompt triển khai cho agent](https://static-docs.nocobase.com/20261030-studio-deploy-guide.webp)

Sau khi triển khai, bấm **I have deployed it — record as v1.1.0**. Cột **Production** hiển thị phiên bản đang chạy và số phiên bản còn cách bản mới nhất.

> [!NOTE] Bản phát hành đầu tiên trong Studio
> Khi chưa ghi phiên bản production, hướng dẫn hiển thị lệnh cài mới. Vì itam-lite đã được triển khai ở phần 1, bổ sung vào prompt rằng ứng dụng đang chạy trên máy chủ, cần nâng cấp, sao lưu cơ sở dữ liệu trước và dùng lại cấu hình cùng dữ liệu hiện có.

Chỉ người phụ trách dự án được xem hướng dẫn triển khai và ghi phiên bản đã triển khai.

Hoàn tất khi production chạy `v1.1.0`, cột **Production** ghi đúng phiên bản đó và quản lý tài sản có thể bắt đầu đợt kiểm kê quý đầu tiên trên production.
