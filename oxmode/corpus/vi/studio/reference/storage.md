---
title: Lưu trữ tệp và gói đầu ra
description: Cấu hình lưu trữ cục bộ, dịch vụ tương thích S3 và nơi lưu gói phát hành.
---

`drive.disks` khai báo các vị trí lưu trữ. `drive.default` chọn ổ lưu trữ cho tệp tải lên. Có thể đặt tên ổ tùy ý. `driver` xác định cách Studio kết nối.

| Driver | Công dụng |
| --- | --- |
| `fs` | Hệ thống tệp cục bộ |
| `s3` | Amazon S3 hoặc dịch vụ tương thích S3 |

Hợp nhất cấu hình cần dùng vào `config.yml` và thay bucket, vùng cùng thông tin xác thực trong ví dụ. Áp dụng thay đổi bằng `docker compose up -d --force-recreate studio`.

<a id="local-files-fs"></a>

## Tệp cục bộ (fs)

Studio mặc định lưu trữ cục bộ. Khi triển khai Docker, mount `/app/storage` vào thư mục lưu trữ bền vững.

```yaml
drive:
  default: local
  disks:
    local:
      driver: fs
      location: /app/storage
      visibility: private
```

`location` là thư mục bên trong container mà tiến trình Studio cần có quyền ghi. Với cách triển khai khác, dùng thư mục lưu trữ bền vững tương ứng.

<a id="s3"></a>

## Lưu trữ S3

Ví dụ này dùng Amazon S3. Với dịch vụ tương thích S3, thêm `endpoint` và `forcePathStyle` theo yêu cầu của dịch vụ đó.

```yaml
drive:
  default: s3
  disks:
    s3:
      driver: s3
      bucket: example-studio-files
      region: us-east-1
      supportsACL: false
      visibility: private
      credentials:
        accessKeyId: replace-with-access-key-id
        secretAccessKey: replace-with-access-key-secret
```

| Cài đặt | Ý nghĩa |
| --- | --- |
| `bucket`, `region` | Tên bucket và vùng |
| `endpoint` | URL dịch vụ tương thích S3. Có thể bỏ qua với Amazon S3 |
| `forcePathStyle` | Truy cập bucket theo kiểu đường dẫn nếu dịch vụ yêu cầu |
| `supportsACL` | Cho biết có hỗ trợ ACL đối tượng hay không. Đặt `false` nếu bucket đã tắt ACL |
| `credentials` | Khóa truy cập. Dùng `{}` để áp dụng chuỗi tìm thông tin xác thực mặc định của AWS SDK |

Đặt bucket ở chế độ riêng tư trong chính sách của dịch vụ lưu trữ. `visibility: private` chỉ cấu hình cách Studio lưu tệp.

<a id="release-artifacts"></a>

## Gói phát hành

Tệp tải lên và gói build dùng cấu hình riêng. Chọn nơi lưu gói độc lập với `drive.default`. Mặc định, gói được lưu trong `/app/storage/releases/artifacts`.

Để lưu gói vào ổ S3 ở trên:

```yaml
releases:
  artifact:
    disk: s3
    prefix: releases/artifacts
```

`disk` là tên một mục trong `drive.disks`. `prefix` là tiền tố tùy chọn của khóa đối tượng. Ổ lưu gói phải ở chế độ riêng tư. Khi tham chiếu ổ theo tên, dùng ổ có driver `fs` hoặc `s3`.

Studio và Host chạy bản xem trước phải truy cập được kho lưu gói. Khi ổ lưu tệp tạo liên kết tải trực tiếp, trình duyệt cũng phải truy cập được địa chỉ đó.

Gói mặc định giới hạn ở 256 MiB. Có thể điều chỉnh bằng `releases.maxArtifactSizeMB`. Reverse proxy và `API_BODY_LIMIT` cũng giới hạn kích thước tệp tải lên.

<a id="change-storage-and-verify-access"></a>

## Đổi nơi lưu trữ và kiểm tra truy cập

Sao chép các tệp hiện có và giữ nguyên khóa trước khi đổi ổ. Khi thêm tiền tố, di chuyển các gói cũ riêng nếu cần. Giữ thư mục `storage` của Studio trên vùng lưu trữ bền vững kể cả khi dùng kho đối tượng.

1. Tải tệp kiểm thử lên một đầu việc hoặc kho tri thức, tải lại trang rồi tải tệp xuống.
2. Chạy build và xác nhận tải gói lên thành công.
3. Mở bản xem trước PR và xác nhận ứng dụng đọc được gói rồi khởi động.
