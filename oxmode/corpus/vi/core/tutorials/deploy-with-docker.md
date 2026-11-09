---
title: Triển khai bằng Docker
description: Tạo ứng dụng, dựng và chuyển Docker image, rồi triển khai và nâng cấp bằng Docker Compose với vùng lưu trữ bền vững.
---

<a id="prerequisites"></a>

## Điều kiện chuẩn bị

Các ví dụ HTTP qua IP trực tiếp dùng để kiểm tra trong mạng tin cậy. Trước khi đăng nhập quản trị qua mạng công cộng hoặc mạng thiếu tin cậy, cấu hình tên miền, HTTPS và reverse proxy.

Máy phát triển cần Node.js 24 trở lên, pnpm 11 và Docker. Máy chủ cần Docker và plugin Docker Compose hỗ trợ `--wait`. Các lệnh dùng Bash, minh họa triển khai một phiên bản ứng dụng trên Linux x64 với SQLite. Với cơ sở dữ liệu khác, cài driver vào ứng dụng trước khi dựng image rồi cấu hình kết nối trên máy chủ.

Kiểm tra Docker trên cả hai máy và Compose trên máy chủ:

```bash
docker version
docker context show
docker compose version
```

Ví dụ dùng `my-app` làm tên ứng dụng và dự án Compose, với cổng `13000`. Đặt tên dự án, thư mục triển khai và cổng riêng cho từng ứng dụng. Thư mục bind mount phải tồn tại trên máy chạy Docker daemon.

<a id="use-an-agent"></a>

## Làm cùng agent

Mở agent phát triển trong thư mục mã nguồn ứng dụng. Nếu chưa có ứng dụng, [tạo và mở thư mục ứng dụng](#create-the-application-and-enter-its-directory). Chọn một trong hai quy trình, dùng agent hoặc chạy lệnh thủ công.

Cấp cho agent quyền truy cập máy chủ đích và chạy Docker. Nếu dùng registry, đăng nhập registry trước. Cung cấp mật khẩu và thông tin xác thực qua cơ chế bảo mật bên ngoài prompt. `AGENTS.md` và Skill `nocobase-deployment` chứa hướng dẫn theo phiên bản ứng dụng.

<a id="first-deployment"></a>

### Triển khai lần đầu

Thay máy chủ, thư mục và URL bằng giá trị của môi trường thực tế. Dùng cơ sở dữ liệu SQLite mới hoặc nêu yêu cầu kết nối cơ sở dữ liệu ngoài. Chọn registry hoặc chuyển image qua tệp.

```text
Please deploy the current application to my server with Docker. This is its first deployment.

Server: <SSH user and address>
Deployment directory: <absolute path on the server>
Application URL: <full URL including the application path>
Database: a new SQLite database, without development or sample data
Image transfer: export the image to a file and transfer it over SSH

Set up administrator sign-in and keep configuration and business data on the server so they survive container recreation.
After deployment, check sign-in and a main business operation, then recreate the container to confirm the data survives. Give me the URL and the check results.
```

Nếu dùng registry, yêu cầu đẩy và kéo image qua địa chỉ registry đã chọn. Nếu dùng tên miền và HTTPS, mô tả cấu hình proxy hiện có hoặc phần cần thiết lập. Agent có thể kiểm tra kiến trúc máy chủ, cổng trống và môi trường Docker.

Đối chiếu kết quả theo [kiểm tra truy cập và dữ liệu bền vững](#verify-access-and-data-persistence). Nếu agent thiếu quyền truy cập máy chủ, dùng cấu hình và lệnh agent chuẩn bị để thực hiện trên máy chủ.

<a id="deploy-a-new-version"></a>

### Triển khai phiên bản mới

Dùng prompt này từ thư mục mã nguồn sau khi cập nhật và kiểm thử. Nêu thời gian cho phép gián đoạn. Các bước kiểm tra, sao lưu và chuyển phiên bản dùng môi trường triển khai hiện có.

```text
Please deploy the current project version to my server, replacing the version already running.

Server: <SSH user and address>
Existing deployment directory: <absolute path on the server>
Compose project name: <existing project name>
New image tag: <for example, my-app:2>
Allowed downtime: <maintenance window>

Keep the existing image transfer method, URL, configuration, secrets and business data. Do not initialize them again.
Review the version changes and complete a backup before deploying the new version. Afterwards, check existing data, user permissions and new features, and give me the results. If deployment fails, explain whether recovery is possible and how it would affect the data.
```

Xác nhận agent đã hoàn tất [rà soát và sao lưu](#review-version-changes-and-back-up) rồi kiểm tra [phiên bản mới](#start-and-verify-the-new-version). Khi rollback, kiểm tra tương thích cơ sở dữ liệu. Đổi về image cũ chỉ thay mã.

<a id="manual-deployment"></a>

## Triển khai thủ công

<a id="create-the-application-and-enter-its-directory"></a>

### Tạo ứng dụng và mở thư mục

Trên máy phát triển:

```bash
pnpm create @nocobase/app@beta my-app --template-tag=beta
cd my-app
```

Nếu đã có ứng dụng, mở thư mục mã nguồn hiện có. Trước khi dựng, chạy kiểm thử và giữ `Dockerfile`, `Dockerfile.dockerignore`, `config.example.yml` cùng lockfile. Nếu dự án cũ thiếu tệp Docker, lấy từ template tương thích.

<a id="build-the-docker-image"></a>

### Dựng Docker image

Từ thư mục gốc ứng dụng:

```bash
docker build --platform linux/amd64 -t my-app:1 .
```

Dockerfile cài dependency và dựng ứng dụng. Với máy chủ ARM64, chọn `linux/arm64`.

Image chứa mã và dependency production. Giữ `Dockerfile.dockerignore` cạnh Dockerfile để loại cấu hình, cơ sở dữ liệu và tệp tải lên cục bộ. Chuẩn bị cấu hình chạy riêng trên máy chủ.

<a id="transfer-the-image-through-a-registry-or-file"></a>

### Chuyển image qua registry hoặc tệp

Chọn một cách. Nếu dựng và chạy trên cùng máy chủ Docker, chuyển sang bước tiếp theo.

**Qua image registry**

Thay `registry.example.com/team` bằng registry thực tế. Trên máy phát triển:

```bash
docker tag my-app:1 registry.example.com/team/my-app:1
docker login registry.example.com
docker push registry.example.com/team/my-app:1
```

Trên máy chủ:

```bash
docker login registry.example.com
docker pull registry.example.com/team/my-app:1
docker tag registry.example.com/team/my-app:1 my-app:1
```

Lệnh cuối thêm tag cục bộ `my-app:1` để dùng trong các lệnh còn lại. Cũng có thể dùng tên registry đầy đủ trong lệnh và Compose.

**Qua tệp image**

Trên máy phát triển, thay `deploy@server` bằng người dùng SSH và địa chỉ máy chủ:

```bash
docker save -o my-app-1.tar my-app:1
scp my-app-1.tar deploy@server:/tmp/my-app-1.tar
```

Trên máy chủ:

```bash
docker load -i /tmp/my-app-1.tar
```

`docker save` xuất image. Sao lưu dữ liệu nghiệp vụ theo quy trình riêng.

<a id="create-the-server-deployment-directory"></a>

### Tạo thư mục triển khai trên máy chủ

Chạy các lệnh còn lại trên máy chủ. Dùng thư mục mới cho lần triển khai đầu:

```bash
mkdir -p "$HOME/my-app-deploy/storage"
cd "$HOME/my-app-deploy"
sudo chown 1000:1000 . storage
```

Container của template chạy bằng người dùng `node`, UID `1000`. Người dùng này cần ghi được vào thư mục triển khai để khởi tạo cấu hình và vào `storage/` khi ứng dụng chạy. Lệnh chỉ đổi chủ sở hữu của hai thư mục mới, không đệ quy vào tệp khác.

<a id="initialize-configuration-and-set-the-administrator-password"></a>

### Khởi tạo cấu hình và đặt mật khẩu quản trị

Dùng CLI trong image để tạo `config.yml` ở thư mục hiện tại:

```bash
docker run --rm \
  --mount "type=bind,src=$PWD,dst=/config" \
  my-app:1 \
  node dist/cli/index.js config init \
  --dialect sqlite \
  --config /config/config.yml
```

Đặt mật khẩu quản trị ban đầu:

```bash
read -r -s -p 'Initial admin password: ' MY_APP_ADMIN_PASSWORD
export MY_APP_ADMIN_PASSWORD

docker run --rm \
  -e MY_APP_ADMIN_PASSWORD \
  -e APP_CONFIG_FILE=/config/config.yml \
  --mount "type=bind,src=$PWD,dst=/config" \
  my-app:1 \
  node dist/cli/index.js config set \
  --from-env users.initialAdmin.password=MY_APP_ADMIN_PASSWORD

unset MY_APP_ADMIN_PASSWORD
```

Tên quản trị mặc định là `nocobase`. Cài đặt quản trị ban đầu chỉ áp dụng khi bảng người dùng rỗng. Mật khẩu tài khoản hiện có được giữ nguyên.

Giữ `config.yml` đã tạo. Sao lưu bí mật ứng dụng cùng cơ sở dữ liệu và giới hạn quyền truy cập bản sao lưu. Khi khởi động lại hoặc nâng cấp, dùng cấu hình hiện có. Image chạy cung cấp lệnh quản trị qua `node dist/cli/index.js`.

<a id="create-the-docker-compose-file"></a>

### Tạo tệp Docker Compose

Tạo `docker-compose.yml` trong thư mục triển khai. Vì thư mục thuộc người dùng container, dùng `sudo tee` để ghi:

```bash
sudo tee docker-compose.yml > /dev/null <<'YAML'
services:
  app:
    image: my-app:1
    init: true
    restart: unless-stopped
    ports:
      - '13000:13000'
    environment:
      APP_BASE_PATH: /main
      APP_PUBLIC_ORIGIN: http://YOUR_SERVER_IP:13000
      APP_SAMPLE_DATA: 'false'
    volumes:
      - type: bind
        source: ./config.yml
        target: /app/config.yml
        read_only: true
        bind:
          create_host_path: false
      - type: bind
        source: ./storage
        target: /app/storage
        bind:
          create_host_path: false
YAML
```

Chạy `sudo vi docker-compose.yml` và thay `YOUR_SERVER_IP` bằng IP thực tế. Thư mục hiện gồm:

```text
my-app-deploy/
├── docker-compose.yml
├── config.yml
└── storage/
```

Cấu hình được mount chỉ đọc. Cơ sở dữ liệu và tệp tải lên nằm trong `storage/` có quyền ghi. `create_host_path: false` báo lỗi nếu thiếu tệp cấu hình hoặc thư mục lưu trữ, tránh tạo nhầm thư mục rỗng. `APP_SAMPLE_DATA: 'false'` tắt dữ liệu mẫu tùy chọn lúc cài đặt ban đầu.

`APP_PUBLIC_ORIGIN` gồm giao thức, host và cổng bên ngoài, bỏ đường dẫn ứng dụng. `APP_BASE_PATH` đặt đường dẫn. Ví dụ mở trực tiếp cổng `13000`, nên cho phép cổng qua tường lửa hoặc nhóm bảo mật.

Với tên miền HTTPS, đặt origin thực, chẳng hạn `https://apps.example.com`. Cấu hình reverse proxy chuyển tiếp `/main/`, giữ header Host và giao thức, chuyển tiếp cookie và hỗ trợ WebSocket. Nếu proxy cùng máy, có thể giới hạn ánh xạ cổng thành `127.0.0.1:13000:13000` để chỉ proxy cục bộ truy cập.

<a id="check-configuration-and-start-the-application"></a>

### Kiểm tra cấu hình và khởi động ứng dụng

Từ thư mục triển khai:

```bash
docker compose -p my-app config --quiet

docker compose -p my-app run --rm --no-deps app \
  node dist/cli/index.js config check --connect

docker compose -p my-app up -d --wait --wait-timeout 180
```

Hai lệnh đầu kiểm tra Compose, cấu hình ứng dụng và kết nối cơ sở dữ liệu. Mặc định, khởi động ứng dụng sẽ chạy migration và Seed ban đầu. Nếu ứng dụng tắt tự động chạy migration hoặc Seed, áp dụng trước theo quy trình triển khai của ứng dụng.

Kiểm tra trạng thái và log:

```bash
docker compose -p my-app ps
docker compose -p my-app logs --tail=100 app
```

`--wait` chờ kiểm tra sức khỏe của image thành công. Nếu hết thời gian chờ hoặc báo không khỏe, xem log kết nối, quyền tệp và migration.

<a id="verify-access-and-data-persistence"></a>

### Kiểm tra truy cập và dữ liệu bền vững

Thay IP máy chủ rồi kiểm tra endpoint sức khỏe:

```bash
curl --fail http://YOUR_SERVER_IP:13000/main/api/healthz
```

Xác nhận `ok: true`, mở `http://YOUR_SERVER_IP:13000/main/` và đăng nhập bằng `nocobase` với mật khẩu đã đặt. Nếu dùng reverse proxy, kiểm tra qua tên miền thực tế.

Kiểm tra tải lại trang, quyền quản trị và người dùng thường, cùng một thao tác nghiệp vụ như tạo rồi đọc bản ghi. Nếu ứng dụng lưu tệp, kiểm tra tải lên và tải xuống. Sau đó tạo lại container:

```bash
docker compose -p my-app up -d \
  --force-recreate \
  --wait \
  --wait-timeout 180
```

Đăng nhập lại và xác nhận bản ghi, tệp và quyền vẫn còn. Nếu ứng dụng có tác vụ theo lịch, xác nhận chúng tiếp tục chạy. Thực hiện các bước nghiệp vụ này sau khi endpoint sức khỏe đạt.

<a id="deploy-a-new-version-manually"></a>

## Triển khai phiên bản mới thủ công

<a id="build-and-transfer-the-new-image"></a>

### Dựng và chuyển image mới

Sau khi cập nhật và kiểm tra mã trên máy phát triển, dựng tag mới từ thư mục mã nguồn:

```bash
docker build --platform linux/amd64 -t my-app:2 .
```

Làm theo [các bước chuyển image](#transfer-the-image-through-a-registry-or-file), đổi tag `1` thành `2` và tên tệp `my-app-1.tar` thành `my-app-2.tar`. Nếu dùng registry, thêm tag cục bộ `my-app:2`.

<a id="review-version-changes-and-back-up"></a>

### Rà soát thay đổi và sao lưu

Đọc ghi chú migration, cấu hình và nâng cấp của bản mới. Giữ thư mục triển khai, cấu hình, bí mật và dữ liệu hiện có để dùng lại khi nâng cấp.

Ví dụ sao lưu khi dịch vụ đã dừng áp dụng cho SQLite khi cơ sở dữ liệu và tệp đều nằm trong `storage/`. Cơ sở dữ liệu ngoài và lưu trữ đối tượng cần quy trình sao lưu riêng, đồng bộ với cấu hình và tệp tại cùng mốc khôi phục.

Trên máy chủ:

```bash
cd "$HOME/my-app-deploy"
docker compose -p my-app stop

mkdir -p "$HOME/my-app-backups"
chmod 700 "$HOME/my-app-backups"

sudo tar -czf \
  "$HOME/my-app-backups/my-app-$(date +%Y%m%d-%H%M%S).tar.gz" \
  config.yml storage docker-compose.yml
```

Xác nhận sao lưu thành công và kiểm tra gói có cấu hình, dữ liệu lưu trữ và tệp Compose. Giữ image cũ và xác nhận cách khôi phục trước khi tiếp tục.

<a id="update-the-image-tag-and-check-migrations"></a>

### Đổi tag image và kiểm tra migration

Chạy `sudo vi docker-compose.yml`, đổi `image: my-app:1` thành `image: my-app:2` và giữ đường dẫn mount. Nếu bản mới cần cấu hình bổ sung, cập nhật `config.yml` hiện có và giữ quyền đọc cho người dùng container.

Kiểm tra bằng image mới:

```bash
docker compose -p my-app config --quiet

docker compose -p my-app run --rm --no-deps app \
  node dist/cli/index.js config check --connect

docker compose -p my-app run --rm --no-deps app \
  node dist/cli/index.js db apply --dry-run --json

docker compose -p my-app run --rm --no-deps app \
  node dist/cli/index.js db repair --dry-run --json
```

Lệnh cơ sở dữ liệu dùng kết nối mặc định. Với nhiều kết nối, kiểm tra thêm mọi kết nối bị ảnh hưởng. Rà soát migration và Seed đang chờ. Nếu checksum migration lịch sử thay đổi, theo ghi chú nâng cấp bản đích trước khi quyết định có chạy sửa checksum thật hay không.

<a id="start-and-verify-the-new-version"></a>

### Khởi động và kiểm tra bản mới

```bash
docker compose -p my-app up -d --wait --wait-timeout 180

docker compose -p my-app ps
docker compose -p my-app logs --tail=100 app
```

Cấu hình mặc định áp dụng migration mới khi khởi động. Đăng nhập tại URL hiện có và kiểm tra bản ghi cũ, tệp, quyền, tính năng mới và tác vụ nền. Giữ bản sao lưu và image cũ đến khi xác nhận bản mới sử dụng được.

<a id="handle-data-when-rolling-back"></a>

### Xử lý dữ liệu khi rollback

Đổi tag về image cũ chỉ thay mã. Migration và thao tác ghi sau nâng cấp vẫn còn trong cơ sở dữ liệu. Kiểm tra phiên bản cũ có tương thích với cơ sở dữ liệu hiện tại trước khi chỉ đổi image.

Nếu cần khôi phục, dừng ứng dụng rồi khôi phục cơ sở dữ liệu, tệp, cấu hình và phiên bản image cũ tương ứng. Bản sao trước triển khai thiếu các lượt ghi phát sinh sau thời điểm sao lưu. Tính đến phần dữ liệu đó khi chọn cách khôi phục.

<a id="stop-and-start-the-application"></a>

## Dừng và khởi động ứng dụng

Từ thư mục triển khai ban đầu:

```bash
cd "$HOME/my-app-deploy"

# Stop and remove the containers; keep host configuration and data.
docker compose -p my-app down

# Start again with the same configuration and data.
docker compose -p my-app up -d --wait --wait-timeout 180
```

Sau khi sửa tệp cấu hình hoặc biến môi trường Compose, tạo lại container để nạp cấu hình và mount:

```bash
docker compose -p my-app up -d --force-recreate --wait --wait-timeout 180
```

Dùng lệnh tạo lại để áp dụng biến môi trường mới. Khi công cụ cấu hình thay thế cả tệp, mount một tệp của container hiện có có thể vẫn trỏ tới tệp cũ.

<a id="troubleshooting"></a>

## Xử lý sự cố

| Triệu chứng | Mục cần kiểm tra |
| --- | --- |
| Thiếu tệp cấu hình hoặc thư mục mount | Kiểm tra thư mục triển khai trên máy chủ, tạo `config.yml` và `storage/` |
| `permission denied` / `EACCES` | UID 1000 cần đọc cấu hình, ghi storage và ghi thư mục triển khai trong lúc khởi tạo |
| Cổng host đã được dùng | Đổi cổng bên trái trong `ports`. Nếu truy cập trực tiếp cổng mới, cập nhật `APP_PUBLIC_ORIGIN` |
| Container không khỏe hoặc hết thời gian chờ | Kiểm tra `ps`, `logs`, kết nối cơ sở dữ liệu, migration, quyền tệp và đường dẫn ứng dụng |
| Container khỏe nhưng máy khác không vào được | Kiểm tra IP máy chủ, ánh xạ cổng, tường lửa và nhóm bảo mật. Với tên miền, kiểm tra proxy, DNS và HTTPS |
| Chuyển hướng sai sau khi đăng nhập | Đặt `APP_PUBLIC_ORIGIN` và `APP_BASE_PATH` khớp URL thực rồi tạo lại container |
