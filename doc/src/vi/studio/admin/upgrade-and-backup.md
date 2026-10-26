---
title: Nâng cấp và sao lưu
description: Sao lưu cơ sở dữ liệu, cấu hình và tệp của Studio, nâng cấp lên phiên bản mới và rollback khi có sự cố, và cách runtime cùng CLI được cập nhật.
---

## Sao lưu

Toàn bộ dữ liệu của Studio nằm trong thư mục triển khai. Sao lưu bốn thứ:

| Thứ cần sao lưu | Ghi chú |
| --- | --- |
| Cơ sở dữ liệu | Dữ liệu PostgreSQL. Xuất bằng `pg_dump -Fc`, hoặc sao chép thư mục `postgres` khi Studio đã dừng |
| `.env` | Khóa mã hóa `STUDIO_SECRET_KEY` và các giá trị khác. Mất file này, các thông tin xác thực Git và API key đã lưu không thể giải mã |
| `config.yml` | Cấu hình của Studio, kể cả push private key nếu được lưu ở đó |
| Thư mục `storage` | Tệp đã tải lên, log, file của Skill, v.v. |

Ví dụ, để xuất cơ sở dữ liệu mỗi ngày:

```bash
cd studio
docker compose exec -T postgres pg_dump -U studio -Fc studio > backup/studio-$(date +%F).dump
```

Bản sao lưu chứa khóa mã hóa, nên hãy cất giữ như cách bạn cất giữ mật khẩu.

Cơ sở dữ liệu của các ứng dụng nghiệp vụ bạn triển khai cần sao lưu riêng. Xem [Môi trường triển khai](environments.md).

## Khôi phục từ bản sao lưu

1. Dừng Studio: `docker compose stop studio`.
2. Đặt lại `.env`, `config.yml` và thư mục `storage`.
3. Khôi phục cơ sở dữ liệu, ví dụ:

   ```bash
   docker compose exec -T postgres pg_restore -U studio -d studio --clean --if-exists < backup/studio-2026-10-25.dump
   ```

4. Khởi động Studio bằng `docker compose start studio`, và kiểm tra rằng bạn đăng nhập được và các dự án, issue đều còn đủ.

Khóa mã hóa trong `.env` phải giống lúc tạo bản sao lưu. Nếu không, các thông tin xác thực đã lưu không thể giải mã và mọi người phải đăng nhập lại.

## Nâng cấp

1. Sao lưu trước.
2. Đổi phiên bản image trong `docker-compose.yml` sang bản mới.
3. Kéo image và khởi động lại:

   ```bash
   docker compose pull
   docker compose up -d
   ```

4. Chờ đến khi `docker compose ps` hiển thị `healthy`, rồi đăng nhập để kiểm tra.

Migration cơ sở dữ liệu tự chạy khi khởi động. Các phiên bản hiện có được liệt kê ở [trang phiên bản image](https://pkg-v3.nocobase.com/-/images/nocobase/studio).

> [!WARNING] Rollback cùng với cơ sở dữ liệu
> Phiên bản mới nâng cấp cơ sở dữ liệu khi khởi động, nên phiên bản cũ có thể không đọc được nếu bạn chỉ đổi phiên bản image về như cũ. Để rollback, trước hết khôi phục bản sao lưu cơ sở dữ liệu từ trước khi nâng cấp, rồi mới khởi động phiên bản cũ.

## Cập nhật runtime và CLI

Nâng cấp Studio trước, runtime và CLI sẽ theo sau:

- **Runner** tự cập nhật lên phiên bản Studio cung cấp mỗi khi không có Agent nào đang chạy. Để cập nhật ngay, chạy `nocobase-runner update` trên máy. Runner quá cũ, không dùng được giao thức hiện tại, được đánh dấu cần nâng cấp trong **Agent management › Runtimes**.
- **nb-studio**: chạy `nb-studio update` để cập nhật lên phiên bản Studio cung cấp, cùng các Skill đã cài. `nb-studio` cũng báo cho bạn khi Studio có phiên bản mới hơn.
