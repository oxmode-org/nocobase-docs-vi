---
title: Triển khai bằng Docker
description: Build image của ứng dụng và giữ lại cấu hình cùng dữ liệu bằng Docker Compose.
---

Hướng dẫn này dùng ứng dụng quản lý công việc làm ví dụ minh họa và cũng áp dụng cho các ứng dụng NocoBase Core của riêng bạn. Xác nhận môi trường đích qua [Chọn cách triển khai](../deployment/choose-a-deployment-method.md). Với dự án của bạn, hãy thay tên ứng dụng, đường dẫn và các bước nghiệm thu nghiệp vụ trong ví dụ.

Dùng `Dockerfile` riêng của ứng dụng, với các thư mục lưu trữ lâu dài tách riêng cho cấu hình, SQLite và tệp tải lên. Hãy chắc chắn ứng dụng đã qua kiểm thử; xem [Xây ứng dụng đầu tiên](build-your-first-feature.md) cho ví dụ ứng dụng công việc. Hướng dẫn này dùng Linux x64, một instance SQLite và runtime Node.js 24 Debian của template.

## Điều kiện cần

```bash
docker version
docker compose version
docker context show
```

Các lệnh dùng Bash. Server cần plugin Compose hỗ trợ `--wait`. Đường dẫn nguồn của bind mount phải tồn tại trên server Docker, không chỉ trên máy gửi lệnh đến một Docker context từ xa. Hãy chọn một tên project, thư mục và cổng host chưa dùng riêng cho hướng dẫn này.

## Cùng Agent

Từ thư mục mã nguồn của ứng dụng, thay server, thư mục và URL bên dưới bằng đích thực tế của bạn:

```text
Hãy triển khai ứng dụng công việc hiện tại bằng Docker lần đầu.

Server: <server Docker của tôi>
Nền tảng server: linux/amd64
Thư mục triển khai: <đường dẫn tuyệt đối trên server>/tasks-docker
Cơ sở dữ liệu: một cơ sở dữ liệu SQLite mới, không có dữ liệu phát triển hay công việc mẫu
Cổng lắng nghe cục bộ trên server: 127.0.0.1:13000
URL cho người dùng: https://tasks.example.com/tasks/

Làm theo hướng dẫn triển khai Docker của dự án và chỉ thao tác trên ứng dụng của hướng dẫn này.
Giữ cấu hình, mật khẩu và dữ liệu nghiệp vụ tách khỏi image để chúng còn nguyên khi tạo lại container.
Thiết lập đăng nhập quản trị viên và giữ lại các khóa bí mật của ứng dụng mà không để lộ trong mã hay báo cáo.
Nếu thiếu cấu hình hoặc lưu trữ bắt buộc, hãy giải thích vấn đề thay vì lặng lẽ khởi động với dữ liệu trống.

Kiểm tra đăng nhập, các thao tác với công việc và quyền của người đọc, rồi tạo lại container của ứng dụng này và xác nhận dữ liệu cùng quyền ban đầu vẫn còn.
Báo cáo URL, kết quả kiểm tra và các phần thiết lập chưa xong như tên miền hay HTTPS.
```

Cấu hình DNS, HTTPS và reverse proxy riêng. Để diễn tập cục bộ, thay origin bằng `http://127.0.0.1:13000`.

## Không dùng Agent

### 1. Build image trên máy phát triển

```bash
pnpm build --target linux-x64 --node-version 24

docker build --platform linux/amd64 \
  --build-arg DIST=prebuilt \
  -t tasks-app:1 .
```

Docker đọc `dist/`, không phải `dist.tar.gz`. Thêm `--tar` vào lệnh build ứng dụng nếu bạn cũng cần một gói nén cho cách triển khai khác. `linux-x64` tương ứng với Docker `linux/amd64`, dùng glibc. Đích ARM64 cần cả `linux-arm64` và `linux/arm64`. Phiên bản chính của Node phải khớp với Dockerfile.

Giữ lại `Dockerfile.dockerignore`: nó loại trừ cấu hình cục bộ, cơ sở dữ liệu và dependency phát triển. Bước prebuilt kiểm tra nền tảng, phiên bản chính của Node và khả năng di chuyển. Hãy sửa các tham số build không khớp thay vì bỏ qua các kiểm tra đó.

Chuyển image qua registry của bạn, hoặc xuất ra file:

```bash
# Máy phát triển
docker save -o tasks-app-1.tar tasks-app:1
scp tasks-app-1.tar deploy@server:/tmp/tasks-app-1.tar
```

Trên server:

```bash
docker load -i /tmp/tasks-app-1.tar
```

Nếu cần, so sánh `docker image inspect tasks-app:1 --format '{{.Id}}'` trước và sau khi chuyển. Gói image không phải bản sao lưu dữ liệu. Các lệnh còn lại chạy trên server Docker; diễn tập cục bộ thì không cần chuyển.

### 2. Chuẩn bị lưu trữ lâu dài và cấu hình

```bash
mkdir -p "$HOME/tasks-docker/config" "$HOME/tasks-docker/storage"
cd "$HOME/tasks-docker"
```

Dùng thư mục mới cho lần cài đặt này. Container của template chạy bằng UID 1000 (`node`), user này phải ghi được vào các mount. Nếu cần, quản trị viên chỉ điều chỉnh quyền sở hữu của các thư mục này, ví dụ `sudo chown 1000:1000 config storage`.

Tạo cấu hình qua CLI của image:

```bash
docker run --rm \
  --mount "type=bind,src=$PWD/config,dst=/config" \
  tasks-app:1 \
  node dist/cli/index.js config init --dialect sqlite --config /config/config.yml
```

Đặt mật khẩu quản trị viên trước lần khởi động đầu:

```bash
read -r -s -p 'Initial admin password: ' TASK_INITIAL_PASSWORD
export TASK_INITIAL_PASSWORD

docker run --rm \
  -e TASK_INITIAL_PASSWORD \
  -e APP_CONFIG_FILE=/config/config.yml \
  --mount "type=bind,src=$PWD/config,dst=/config" \
  tasks-app:1 \
  node dist/cli/index.js config set \
  --from-env users.initialAdmin.password=TASK_INITIAL_PASSWORD

unset TASK_INITIAL_PASSWORD
```

Giữ lại cấu hình đã tạo và các khóa bí mật cố định bằng bản sao lưu có giới hạn quyền truy cập. Đừng tạo lại khi khởi động lại. Thiết lập quản trị viên ban đầu chỉ có tác dụng khi bảng người dùng còn trống.

### 3. Tạo compose.yml

```yaml
services:
  app:
    image: tasks-app:1
    init: true
    restart: unless-stopped
    ports:
      - '127.0.0.1:13000:13000'
    environment:
      APP_BASE_PATH: /tasks
      APP_PUBLIC_ORIGIN: https://tasks.example.com
      APP_SAMPLE_DATA: 'false'
    volumes:
      - type: bind
        source: ./config/config.yml
        target: /app/config.yml
        read_only: true
        bind:
          create_host_path: false
      - type: bind
        source: ./storage
        target: /app/storage
        bind:
          create_host_path: false
```

Origin không bao gồm base path. Container lắng nghe trên `0.0.0.0:13000`, còn host chỉ công bố trên loopback. Reverse proxy xử lý HTTPS công khai, chuyển tiếp đường dẫn và nâng cấp WebSocket. Để diễn tập qua loopback, đặt origin HTTP tương ứng và mở `http://127.0.0.1:13000/tasks/`.

`create_host_path: false` sẽ báo lỗi khi thiếu nguồn mount thay vì lặng lẽ tạo một thư mục trống sai. Cấu hình ở chế độ chỉ đọc trong container đang chạy; SQLite, tệp tải lên và các nội dung lâu dài khác dùng vùng lưu trữ ghi được.

### 4. Kiểm tra và khởi động

```bash
docker compose -p tasks-app config --quiet

docker compose -p tasks-app run --rm --no-deps app \
  node dist/cli/index.js config check --connect

docker compose -p tasks-app up -d --wait --wait-timeout 180

docker compose -p tasks-app ps
docker compose -p tasks-app logs --tail=80 app
curl --fail http://127.0.0.1:13000/tasks/api/healthz
```

`--wait` chờ health check của image. Khi hết thời gian chờ, hãy xem trạng thái và log thay vì tạo container lặp lại. Kiểm tra cấu hình diễn ra trước khi khởi động; migration thực tế và khởi tạo bắt buộc diễn ra khi ứng dụng khởi động.

Kiểm tra có `ok: true`, base path đúng như mong đợi và không có lỗi migration hay cơ sở dữ liệu. Đăng nhập bằng tên đăng nhập mặc định `nocobase` và mật khẩu bạn vừa cấu hình. Ví dụ bắt đầu sử dụng hiện tại khởi tạo các vai trò cho công việc qua seed bắt buộc; người dùng của nhóm phát triển, việc gán vai trò và các công việc không được sao chép theo image. Hãy kiểm tra cả URL công khai thực tế: health của container không kiểm chứng tên miền, HTTPS hay proxy của bạn.

### 5. Kiểm tra dữ liệu còn nguyên sau khi tạo lại

Tạo và hoàn thành một công việc, làm mới trang, rồi chỉ tạo lại project này:

```bash
docker compose -p tasks-app up -d --force-recreate --wait --wait-timeout 180
```

Kiểm tra công việc và trạng thái đó vẫn còn, mật khẩu vẫn dùng được và một người đọc thông thường không ghi được. Để dừng buổi diễn tập, chạy `docker compose -p tasks-app down` từ thư mục này, giữ lại cấu hình và lưu trữ trên host. Khởi động lại bằng `up`; đừng chạy lại bước khởi tạo cấu hình.

## Phát hành bản mới

Build một tag image mới, như `tasks-app:2`, và chuyển lên server. Xem [Phát hành phiên bản ứng dụng](../deployment/publish-app-release.md) để có cái nhìn tổng quan. Sao lưu cơ sở dữ liệu, tệp và cấu hình, rồi chỉ đổi tham chiếu image trong khi giữ nguyên các mount và khóa bí mật.

Kiểm tra image mới với bản cài đặt hiện có:

```bash
docker compose -p tasks-app run --rm --no-deps app \
  node dist/cli/index.js config check --connect

docker compose -p tasks-app run --rm --no-deps app \
  node dist/cli/index.js db apply --dry-run --json

docker compose -p tasks-app run --rm --no-deps app \
  node dist/cli/index.js db repair --dry-run --json
```

Các kiểm tra này không khởi động thêm dịch vụ ứng dụng nào. Xem lại các migration đang chờ và checksum lịch sử, xác nhận bản sao lưu rồi chạy `docker compose -p tasks-app up -d --wait --wait-timeout 180`. Khi khởi động, các migration mới được áp dụng. Kiểm tra bản ghi cũ, vai trò và tính năng mới. Chuyển về image cũ thay đổi mã nhưng không hoàn tác migration hay dữ liệu đã ghi vào cơ sở dữ liệu.

Với Agent, hãy cung cấp thư mục hiện có, tên project Compose và tag mới, yêu cầu các bước xem xét và kiểm tra giữ nguyên dữ liệu như trên. Đừng khởi tạo cấu hình mới.

Cũng tạo lại container sau khi thay đổi cấu hình. Một công cụ có thể thay file cấu hình theo kiểu atomic, khiến mount một file cũ vẫn trỏ đến inode trước đó. Tạo lại container sẽ mount lại file. Thay đổi biến môi trường trong Compose cũng cần tạo lại; `docker restart` không áp dụng được môi trường mới.

## Xử lý sự cố và phạm vi kiểm chứng

| Triệu chứng | Kiểm tra |
| --- | --- |
| Thiếu nguồn bind | Đúng thư mục trên server; cấu hình đã được tạo và có thư mục lưu trữ |
| `EACCES` | UID 1000 đọc được cấu hình và ghi được vào lưu trữ |
| Cổng host đang bị dùng | Chọn cổng host khác và cập nhật origin nếu truy cập trực tiếp |
| Unhealthy hoặc hết thời gian chờ | Log của project, cơ sở dữ liệu, migration và base path |

Buổi diễn tập `.77` ban đầu đã bao gồm image prebuilt, save/load trên cùng host, mật khẩu tùy chỉnh, chờ health của Compose, quyền với công việc, từ chối khi thiếu mount và tạo lại mà vẫn giữ dữ liệu/cấu hình. Việc chuyển giữa các server, thiết lập HTTPS/proxy công khai, triển khai qua nhiều phiên bản và rollback chưa được thực hiện. Kiểm chứng bản build không thay thế được các kiểm tra riêng cho từng môi trường đó.

Bằng chứng triển khai và ảnh chụp màn hình ở trên đến từ buổi diễn tập trước đó; lần rà soát tài liệu này không triển khai lại ví dụ npm `1.0.0-beta.81` hiện tại.
