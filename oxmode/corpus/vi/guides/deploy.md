---
title: Triển khai ứng dụng
description: Dựng image itam-lite bằng Dockerfile của ứng dụng và chạy bằng Docker Compose với cấu hình và dữ liệu lưu riêng.
---

Trong lúc phát triển, itam-lite chạy bằng `pnpm dev` và dùng cơ sở dữ liệu phát triển. Bài này đưa ứng dụng lên máy chủ Docker để vận hành độc lập. Agent dùng `Dockerfile` và Skill `nocobase-deployment` đi kèm ứng dụng. Để chọn Docker hay PM2, xem [Chọn phương thức triển khai](../core/deployment/choose-a-deployment-method.md).

<a id="1-prepare-the-server"></a>

## 1. Chuẩn bị máy chủ

Chuẩn bị máy chủ Linux đã cài Docker và plugin Docker Compose, có thể truy cập qua SSH từ máy phát triển. Chọn thư mục triển khai, URL và mật khẩu quản trị viên. Cấu hình tên miền, HTTPS và reverse proxy trên máy chủ.

<a id="2-have-the-agent-deploy"></a>

## 2. Giao agent triển khai

Mở phiên mới trong thư mục `itam-lite`, thay các giá trị trong dấu ngoặc góc rồi gửi prompt. Yêu cầu dùng cơ sở dữ liệu mới, lưu cấu hình và dữ liệu ngoài container, nhận mật khẩu qua kênh riêng, rồi kiểm tra bản ghi vẫn còn sau khi tạo lại container. Yêu cầu agent ghi rõ phần cấu hình còn thiếu:

```prompt
Deploy this app with Docker to the server <user>@<server address>, in <path>/itam-lite, at https://<domain>/itam/, with a new empty database.
Keep the configuration and data in the deployment directory so that recreating the container loses nothing. I will give you the administrator password separately; do not put it in the code or the report.
After deploying, sign in, create a device, recreate the container, and confirm the device is still there. Finally, tell me what is not configured yet, such as HTTPS.
```

Các bước agent đã làm:

| Bước | Công việc |
| --- | --- |
| Dựng | Dựng `dist/` trên máy phát triển cho nền tảng máy chủ, đóng gói thành image `itam-lite:1` bằng `Dockerfile` và chuyển lên máy chủ |
| Cấu hình | Trong thư mục triển khai, chạy lệnh từ image để tạo `config/config.yml` chứa bí mật ứng dụng và đặt mật khẩu quản trị |
| Chạy | Tạo `compose.yml`, mount cấu hình chỉ đọc tại `/app/config.yml`, mount `storage/` tại `/app/storage` và đặt `APP_BASE_PATH` thành `/itam` |
| Kiểm tra | `config check --connect` kiểm tra cấu hình và kết nối cơ sở dữ liệu. `up -d --wait` chờ kiểm tra sức khỏe đạt |

Xem đầy đủ các lệnh và tệp Compose trong [Triển khai bằng Docker](../core/tutorials/deploy-with-docker.md#manual-deployment).

<a id="3-keep-configuration-data-and-the-image-apart"></a>

## 3. Lưu riêng cấu hình, dữ liệu và image

| Thành phần | Vị trí | Cách lưu giữ |
| --- | --- | --- |
| Image | `itam-lite:1` trên máy chủ hoặc trong registry | Dùng tag riêng cho từng phiên bản. Có thể dựng lại từ mã |
| Cấu hình | `config/config.yml` trong thư mục triển khai | Chứa bí mật. Giữ bên ngoài kho mã và image, sao lưu cùng cơ sở dữ liệu và dùng lại tệp hiện có |
| Dữ liệu | Cơ sở dữ liệu SQLite và tệp tải lên trong `storage/` | Sao lưu định kỳ và trước mỗi lần nâng cấp |

Cơ sở dữ liệu mới chỉ có bảng do migration tạo, quản trị viên ban đầu và ba vai trò. Dữ liệu phát triển, gồm Alice, Ben, Cathy, thiết bị và yêu cầu, vẫn nằm trong môi trường phát triển. Khi ứng dụng đã chạy, tạo người dùng thật trong **System settings › Users** rồi gán vai trò.

<a id="4-verify"></a>

## 4. Kiểm chứng

Mở `https://<domain>/itam/`, đăng nhập bằng quản trị viên và tạo một thiết bị:

![Sổ thiết bị sau khi triển khai](https://static-docs.nocobase.com/20261030-itam-lite-deploy-docker-devices.webp)

Sau khi agent tạo lại container, xác nhận thiết bị và phiên đăng nhập vẫn còn.

Để phát hành bản mới, dựng image với tag mới, sao lưu thư mục triển khai rồi đổi image trong khi giữ cấu hình và dữ liệu. Xem [Triển khai phiên bản mới](../core/tutorials/deploy-with-docker.md#deploy-a-new-version-manually).

<a id="5-record-the-deployment"></a>

## 5. Ghi lại cách triển khai

Triển khai dùng mã đã có. Nhờ agent ghi phương thức triển khai và kết quả kiểm chứng vào README.

Hoàn tất khi URL mở được, quản trị viên đăng nhập được, thiết bị đã tạo vẫn còn sau khi tạo lại container, và `config.yml` cùng cơ sở dữ liệu nằm trong thư mục triển khai trên máy chủ, bên ngoài image và kho mã.
