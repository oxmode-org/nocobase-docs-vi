---
title: Triển khai Studio
description: Triển khai Studio mới bằng Docker Compose, lưu dữ liệu bền vững và đăng nhập bằng tài khoản quản trị.
---

Studio là sản phẩm thương mại. [Liên hệ NocoBase](https://www.nocobase.com/contact/) để lấy image, xem phiên bản khả dụng và xin quyền truy cập.

Hướng dẫn này triển khai một bản Studio với PostgreSQL. Có thể dùng cơ sở dữ liệu hiện có theo [tham chiếu cấu hình](../reference/config.md).

<a id="prepare-the-environment"></a>

## Chuẩn bị môi trường

- Máy chủ có Docker và Docker Compose. Image hỗ trợ Linux amd64 và arm64.
- Image Studio được cung cấp. Với tệp image ngoại tuyến, chạy `docker load -i <archive>`.
- Địa chỉ ổn định. Dùng tên miền và HTTPS cho cả nhóm. Khi thử cục bộ, có thể dùng `http://localhost:13000`.

Công cụ lập trình chạy trong [môi trường riêng](shared-runtimes.md) được kết nối sau. Một bản Studio chạy độc lập có thể hoạt động mà không cần Redis. Trước khi mời nhóm, chuẩn bị lưu trữ tệp và gói đầu ra, email mời và email đặt lại mật khẩu.

<a id="prepare-configuration"></a>

## Chuẩn bị cấu hình

Lấy image theo hướng dẫn bàn giao. Đặt `STUDIO_IMAGE` thành tên đầy đủ có phiên bản cụ thể:

```bash
export STUDIO_IMAGE='<supplied-image-name-and-version>'
mkdir studio
cd studio
mkdir storage
sudo chown 1000:1000 storage

docker run --rm --entrypoint cat "$STUDIO_IMAGE" \
  /app/config.example.yml > config.yml
```

Container Studio chạy với UID 1000 và cần quyền ghi vào `storage`.

Chỉnh các mục tương ứng trong `config.yml` để tắt tự đăng ký. Giữ phần còn lại của template và tránh trùng khóa YAML. Giao diện mặc định dùng tiếng Anh.

```yaml
auth:
  passwordReset:
    enabled: false
  emailAndPassword:
    enabled: true
    autoSignIn: false
    disableSignUp: true
```

Tạo `.env` với các giá trị ngẫu nhiên cho khóa mã hóa, mật khẩu quản trị và mật khẩu cơ sở dữ liệu:

```bash
umask 077
cat > .env <<EOF
STUDIO_IMAGE=${STUDIO_IMAGE}
STUDIO_SECRET_KEY=$(openssl rand -hex 32)
INITIAL_ADMIN_USERNAME=admin
INITIAL_ADMIN_EMAIL=admin@example.com
INITIAL_ADMIN_PASSWORD=$(openssl rand -hex 18)
DB_PASSWORD=$(openssl rand -hex 24)
APP_PUBLIC_ORIGIN=http://localhost:13000
EOF
```

Thay email quản trị bằng địa chỉ của mình. `APP_PUBLIC_ORIGIN` chứa giao thức, host và cổng công khai, bỏ phần `/main`.

> [!NOTE] Giữ khóa mã hóa
> `STUDIO_SECRET_KEY` mã hóa thông tin xác thực lưu trong Studio. Giữ khóa khi khởi động lại hoặc nâng cấp và sao lưu cùng cơ sở dữ liệu. Cần khóa này để giải mã thông tin đã lưu.

<a id="file-and-artifact-uploads"></a>

## Tải tệp và gói đầu ra lên

Có thể dùng lưu trữ cục bộ ngay. Tệp Compose bên dưới giữ dữ liệu trong `/app/storage`. Để dùng lưu trữ đối tượng, hợp nhất phần sau vào `config.yml`. Ví dụ dùng Amazon S3:

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

releases:
  artifact:
    disk: s3
    prefix: releases/artifacts
```

Thay bucket, vùng và thông tin xác thực, rồi đặt bucket ở chế độ riêng tư. `drive.default` lưu tệp đính kèm và các tệp tải lên khác. Cấu hình riêng `releases.artifact` cho gói đầu ra do CI hoặc agent tải lên.

Giữ mount `storage` kể cả khi dùng lưu trữ đối tượng. Xem [Lưu trữ tệp và gói đầu ra](../reference/storage.md) về tệp cục bộ và dịch vụ tương thích S3.

<a id="invitation-and-password-reset-email"></a>

## Email mời và đặt lại mật khẩu

Cấu hình email trước khi mời thành viên. Lời mời và đặt lại mật khẩu dùng chung một cấu hình SMTP. Hợp nhất phần sau vào các mục tương ứng trong `config.yml`:

```yaml
mailers:
  default: system
  system:
    provider: smtp
    host: smtp.example.com
    port: 587
    secure: false
    auth:
      user: notifications@example.com
    from: "Studio <notifications@example.com>"

auth:
  passwordReset:
    enabled: true
```

Giữ các mục như `users.initialAdmin` và `auth.emailAndPassword`. Thay host, cổng, tài khoản SMTP và địa chỉ người gửi bằng các giá trị mà nhà cung cấp email cho phép.

Thêm mật khẩu vào `.env`:

```dotenv
MAILERS_SYSTEM_PASSWORD=<smtp-password>
```

Thêm mục sau vào `services.studio.environment` của tệp Compose bên dưới:

```yaml
MAILERS_SYSTEM_PASSWORD: ${MAILERS_SYSTEM_PASSWORD:?set MAILERS_SYSTEM_PASSWORD in .env}
```

Compose phải truyền biến vào container. `config.yml` đọc `${NAME}` như chuỗi nguyên văn. Đặt `APP_PUBLIC_ORIGIN` thành địa chỉ thành viên truy cập được vì liên kết trong email dùng địa chỉ này.

Khi thử cục bộ chưa có email, giữ `auth.passwordReset.enabled: false` và chia sẻ liên kết mời thủ công. Xem [Thông báo và thông báo đẩy](../admin/notifications.md#invitation-email) về Resend và cách kiểm tra gửi thư.

<a id="start-the-services"></a>

## Khởi động dịch vụ

Tạo `docker-compose.yml` trong cùng thư mục:

```yaml
services:
  studio:
    image: ${STUDIO_IMAGE:?set STUDIO_IMAGE in .env}
    init: true
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "127.0.0.1:13000:13000"
    environment:
      APP_CONFIG_FILE: /app/config.yml
      APP_PUBLIC_ORIGIN: ${APP_PUBLIC_ORIGIN}
      APP_BASE_PATH: /main
      APP_SAMPLE_DATA: "false"
      SECRETS_KEYS: 1:${STUDIO_SECRET_KEY:?set STUDIO_SECRET_KEY in .env}
      INITIAL_ADMIN_USERNAME: ${INITIAL_ADMIN_USERNAME}
      INITIAL_ADMIN_EMAIL: ${INITIAL_ADMIN_EMAIL}
      INITIAL_ADMIN_PASSWORD: ${INITIAL_ADMIN_PASSWORD:?set INITIAL_ADMIN_PASSWORD in .env}
      DB_DIALECT: postgres
      DB_HOST: postgres
      DB_PORT: 5432
      DB_DATABASE: studio
      DB_USERNAME: studio
      DB_PASSWORD: ${DB_PASSWORD:?set DB_PASSWORD in .env}
    volumes:
      - ./config.yml:/app/config.yml:ro
      - ./storage:/app/storage

  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_DB: studio
      POSTGRES_USER: studio
      POSTGRES_PASSWORD: ${DB_PASSWORD:?set DB_PASSWORD in .env}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U studio -d studio"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  postgres-data:
```

Cấu hình này chỉ mở cổng 13000 trên máy cục bộ. Với máy chủ từ xa, cấu hình HTTPS như bên dưới hoặc dùng chuyển tiếp cổng SSH để kiểm tra ban đầu.

```bash
docker compose config --quiet
docker compose up -d
docker compose ps
curl -fsS http://localhost:13000/main/api/healthz
```

Lần khởi động đầu tạo bảng và tài khoản quản trị. Chờ Studio chuyển sang `healthy` và endpoint kiểm tra sức khỏe trả `"ok": true`.

<a id="configure-the-public-address"></a>

## Cấu hình địa chỉ công khai

Có thể bỏ qua khi thử cục bộ. Để dùng cho cả nhóm, trỏ tên miền về máy chủ và cấu hình reverse proxy HTTPS có hỗ trợ WebSocket.

Ví dụ với Caddy trên cùng máy chủ:

```text
studio.example.com {
    reverse_proxy 127.0.0.1:13000
}
```

Đặt `APP_PUBLIC_ORIGIN=https://studio.example.com` trong `.env` rồi tạo lại container:

```bash
docker compose up -d
```

<a id="sign-in"></a>

## Đăng nhập

Mở `https://studio.example.com/main/`, hoặc `http://localhost:13000/main/` khi thử cục bộ. Dùng `INITIAL_ADMIN_USERNAME` và `INITIAL_ADMIN_PASSWORD` từ `.env`.

![Đăng nhập bằng tài khoản quản trị ban đầu](https://static-docs.nocobase.com/studio-en-setup-login-20261030.png)

Cấu hình quản trị ban đầu chỉ áp dụng trong lần cài đặt đầu tiên. Để đổi mật khẩu về sau, dùng **Account settings › Account and security**.

Hoàn tất khi quản trị viên đăng nhập được, danh sách dự án trống và trang đăng nhập đã ẩn liên kết đăng ký. Dùng URL đầy đủ gồm `/main` khi kết nối runner và CLI.

![Danh sách dự án trống sau lần đăng nhập đầu tiên](https://static-docs.nocobase.com/studio-en-setup-empty-projects-20261030.png)

Trước khi mời nhóm, xác nhận có thể:

- Tải tệp kiểm thử lên, tải lại trang rồi tải tệp xuống.
- Nhận email mời tại hộp thư kiểm thử do mình quản lý và mở liên kết.
- Đặt lại mật khẩu tài khoản kiểm thử hiện có và đăng nhập bằng mật khẩu mới.

Kiểm tra tải gói đầu ra và khởi động bản xem trước sau khi [cấu hình kiểm tra và bản xem trước](ci.md).

Tiếp theo, [kết nối nền tảng mã nguồn](git.md).

<a id="troubleshooting"></a>

## Xử lý sự cố

| Triệu chứng | Mục cần kiểm tra |
| --- | --- |
| Bị từ chối truy cập image | Kiểm tra phiên bản và quyền được cấp. Liên hệ NocoBase nếu cần |
| Tải image hết thời gian chờ | Kiểm tra proxy của Docker và khả năng truy cập địa chỉ tải được cung cấp |
| Container liên tục khởi động lại | Chạy `docker compose logs --tail=100 studio` và xem lỗi cơ sở dữ liệu, cấu hình |
| Không đọc được tệp cấu hình | Xác nhận `config.yml` là tệp sao chép từ image. Nếu Docker đã tạo một thư mục cùng tên, sửa lại đường dẫn mount |
| Vùng lưu trữ không ghi được | Xác nhận UID 1000 có quyền ghi vào `storage` |
| Trang hoặc callback đăng nhập bị lỗi | Kiểm tra `/main/`, `APP_PUBLIC_ORIGIN` và reverse proxy |

Xem [Nâng cấp và sao lưu](../admin/upgrade-and-backup.md) về bảo trì.
