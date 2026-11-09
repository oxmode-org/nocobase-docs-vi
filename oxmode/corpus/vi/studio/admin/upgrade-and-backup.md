---
title: Nâng cấp và sao lưu
description: Sao lưu và khôi phục Studio, rồi cập nhật máy chủ, runner và CLI.
---

<a id="back-up"></a>

## Sao lưu

Giữ cơ sở dữ liệu, cấu hình, khóa mã hóa và tệp trong cùng bộ sao lưu. Ví dụ dùng Compose và PostgreSQL trong [Hướng dẫn triển khai](../setup/install.md).

| Nội dung | Thành phần cần giữ |
| --- | --- |
| Cơ sở dữ liệu | Tệp dump PostgreSQL hoặc bản sao lưu từ dịch vụ cơ sở dữ liệu |
| Cấu hình | `config.yml`, tệp Compose và `.env` |
| Khóa | Khóa mã hóa dùng trong `SECRETS_KEYS` và khóa riêng thông báo đẩy |
| Tệp | `storage` và các tệp, Skill, gói đầu ra trong kho lưu trữ đối tượng |

Chạy từ thư mục triển khai:

```bash
mkdir -p backup
docker compose exec -T postgres pg_dump -U studio -Fc studio   > "backup/studio-$(date +%F).dump"
```

Điều chỉnh tên người dùng và tên cơ sở dữ liệu theo cấu hình. Tạm dừng ghi trong lúc sao lưu hoặc dùng phương thức chụp nhanh giữ cơ sở dữ liệu và tệp ở cùng thời điểm. Sao lưu riêng cơ sở dữ liệu của các ứng dụng nghiệp vụ.

<a id="restore"></a>

## Khôi phục

1. Dừng Studio và lưu một bản sao dữ liệu hiện tại.
2. Khôi phục cấu hình, khóa, tệp và cơ sở dữ liệu từ cùng mốc sao lưu.
3. Khởi động image có phiên bản tương ứng với bản sao lưu.
4. Kiểm tra đăng nhập, đầu việc của dự án, tải tệp xuống và kết nối Git.

Khôi phục vào cơ sở dữ liệu trống đã chuẩn bị, chẳng hạn:

```bash
docker compose exec -T postgres pg_restore -U studio -d studio   < backup/studio-backup.dump
```

Nếu cơ sở dữ liệu đích đã có dữ liệu, làm theo quy trình thay thế của đội ngũ để khôi phục trọn bộ dữ liệu. Ví dụ cài đặt truyền `STUDIO_SECRET_KEY` vào `SECRETS_KEYS`. Giữ nguyên khóa khi khôi phục.

<a id="upgrade-studio"></a>

## Nâng cấp Studio

1. Hoàn tất sao lưu và lấy phiên bản image đích.
2. Cập nhật `STUDIO_IMAGE` trong cấu hình triển khai.
3. Kéo image về và tạo lại container Studio.

```bash
docker compose pull studio
docker compose up -d studio
docker compose ps
docker compose logs --tail=100 studio
```

Migration chạy khi khởi động. Kiểm tra tình trạng dịch vụ, đăng nhập, đầu việc và môi trường chạy. Studio là sản phẩm thương mại. [Liên hệ NocoBase](https://www.nocobase.com/contact/) để lấy image.

Trước khi quay về image cũ, kiểm tra khả năng tương thích của cơ sở dữ liệu. Nếu cần hoàn tác migration, khôi phục cơ sở dữ liệu và tệp trước khi nâng cấp rồi chạy phiên bản cũ tương ứng.

<a id="update-runners-and-the-cli"></a>

## Cập nhật runner và CLI

Runner có thể tự cập nhật. Cũng có thể chạy các lệnh sau trên máy thực thi:

```bash
nocobase-runner update
nb-studio update
```

`nb-studio update` cập nhật cả các Skill đã cài. Trang môi trường chạy chỉ rõ phiên bản thiếu tương thích và cần cập nhật.
