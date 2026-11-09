---
title: Triển khai bằng PM2 (app-installer)
description: Dựng gói ứng dụng, tải lên máy chủ, cài bằng app-installer và quản lý các bản phát hành bằng PM2.
---

`app-installer` cài gói triển khai trên máy chủ, chạy ứng dụng qua PM2 và quản lý chuyển phiên bản, sao lưu và rollback. Mã nguồn nằm trên máy phát triển. Máy chủ giữ cấu hình chạy và dữ liệu nghiệp vụ bên ngoài thư mục bản phát hành.

<a id="prerequisites"></a>

## Điều kiện chuẩn bị

Ví dụ truy cập trực tiếp qua IP và HTTP dùng để kiểm tra trong mạng tin cậy. Trước khi đăng nhập quản trị qua mạng công cộng hoặc mạng thiếu tin cậy, cấu hình tên miền, HTTPS và reverse proxy.

Máy phát triển cần Node.js 24 và pnpm 11. Máy chủ cần Node.js 24 và PM2 từ 4.3 trở lên cài toàn cục. Các lệnh dùng Bash, minh họa một phiên bản ứng dụng trên Linux x64/glibc với SQLite. Với cơ sở dữ liệu khác, cài driver vào mã nguồn trước khi dựng lại và cung cấp thông số kết nối khi cài.

Ví dụ dùng ứng dụng `my-app`, đích SSH `deploy@server`, thư mục `/srv/nocobase/my-app`, tiến trình PM2 `nocobase-my-app`, cổng `13000` và đường dẫn ứng dụng `/main`. Thay bằng giá trị thực tế. Dùng thư mục, cổng và tên tiến trình riêng cho từng ứng dụng.

Chạy `@nocobase/app-installer@beta` trên máy chủ với cấu hình npm registry hiện có. Registry phải cho phép truy cập trình cài đặt. Nếu bản triển khai hiện có yêu cầu phiên bản trình cài đặt cố định, thay `@beta` bằng phiên bản đó. Máy phát triển dựng, đóng gói và tải gói lên.

<a id="use-an-agent"></a>

## Làm cùng agent

Mở agent phát triển tại thư mục mã nguồn ứng dụng. Nếu cần, [tạo ứng dụng trước](#create-the-application-and-enter-its-directory). Chuẩn bị quyền truy cập máy chủ và cung cấp thông tin xác thực qua cơ chế bảo mật bên ngoài prompt. Skill triển khai của ứng dụng hướng dẫn theo phiên bản đang dùng.

<a id="first-deployment"></a>

### Triển khai lần đầu

Thay thông tin đích trong prompt:

```text
Please build, package and upload the current application from the development machine, then run app-installer on the server for its first installation, with PM2 managing the process.

Server: <SSH user and address>
Installation directory: <absolute server path>
Application URL: <full URL including the application path>
Database: a new SQLite database, without development or sample data

Set up administrator sign-in and keep configuration and business data separate from releases.
Check sign-in and a main business operation, then restart the application to confirm the data survives.
Give me the URL, check results, and whether startup after a server reboot is configured.
```

<a id="deploy-a-new-version"></a>

### Triển khai phiên bản mới

Dùng prompt sau tại thư mục mã nguồn sau khi cập nhật và kiểm thử:

```text
Please build, package and upload the new project version from the development machine, then run app-installer on the existing server to update it.

Server: <SSH user and address>
Existing installation directory: <absolute server path>
Allowed downtime: <maintenance window>

Keep the existing URL, configuration, secrets, database and uploads. Do not initialize them again.
Review version changes and backup coverage before deploying.
Check existing data, user permissions and new features afterwards. If deployment fails, explain the recovery outcome and any effect on data.
```

Agent dựng, đóng gói và tải lên từ máy phát triển, rồi kết nối máy chủ để chạy app-installer và PM2. Chọn quy trình dùng agent hoặc chạy lệnh thủ công. Cả hai đều cần kiểm tra truy cập và dữ liệu bền vững bên dưới.

<a id="manual-deployment"></a>

## Triển khai thủ công

**Terminal máy phát triển** dùng để dựng, đóng gói và tải lên. **Terminal máy chủ** dùng để cài, triển khai bản mới, kiểm tra trạng thái, rollback và quản lý PM2. Giữ cả hai terminal và chạy mọi lệnh `@nocobase/app-installer` ở terminal máy chủ.

Mỗi khối lệnh ghi nơi thực hiện. Đặt biến mật khẩu, chạy cài đặt và xóa biến trong cùng terminal. Đường dẫn tuyệt đối dùng được từ bất kỳ thư mục nào. Dùng đường dẫn tương đối `storage/exports/dist.tar.gz` từ thư mục mã nguồn trên máy phát triển.

<a id="create-the-application-and-enter-its-directory"></a>

### Tạo ứng dụng và mở thư mục

```bash title="Development machine · parent directory of the application"
pnpm create @nocobase/app@beta my-app --template-tag=beta
cd my-app
```

Với ứng dụng hiện có, mở thư mục mã nguồn và xác nhận kiểm thử đạt trước khi dựng.

<a id="build-the-deployment-archive"></a>

### Dựng gói triển khai

```bash title="Development machine · application source directory my-app/"
pnpm build --target linux-x64 --node-version 24 --tar
```

Đầu ra `storage/exports/dist.tar.gz` chứa `dist/`, dependency production và tệp cấu hình mẫu. Dữ liệu phát triển, bí mật và tệp tải lên được quản lý riêng. Máy chủ dùng dependency đã đóng gói.

Chọn kiến trúc, libc và phiên bản chính của Node khớp máy chủ. Dùng `linux-arm64` cho ARM64/glibc và đích musl phù hợp cho hệ thống như Alpine.

<a id="prepare-the-server"></a>

### Chuẩn bị máy chủ

Đăng nhập bằng tài khoản dịch vụ sẽ chạy ứng dụng:

```bash title="Development machine · any directory"
ssh deploy@server
```

Kiểm tra môi trường chạy:

```bash title="Server · original service account, any directory"
node --version
node -p "process.platform + '-' + process.arch"
command -v pm2
```

Nếu thiếu PM2, cài toàn cục trên máy chủ:

```bash title="Server · original service account, any directory"
npm install -g pm2
```

Nhờ quản trị viên chuẩn bị thư mục mới, rỗng cho tài khoản này:

```bash title="Server · original service account, any directory"
sudo mkdir -p /srv/nocobase/my-app
sudo chown "$(id -u):$(id -g)" /srv/nocobase/my-app
```

Dùng cùng tài khoản dịch vụ để cài, truy vấn trạng thái và quản lý PM2. Chọn thư mục mới hoặc rỗng và bảo toàn thư mục của bản triển khai hiện có.

<a id="install-on-the-server"></a>

### Cài trên máy chủ

Tải gói lên từ máy phát triển rồi chuyển sang terminal máy chủ:

```bash title="Development machine · application source directory my-app/"
scp storage/exports/dist.tar.gz deploy@server:/tmp/my-app.tar.gz
```

Trên máy chủ, đặt biến mật khẩu rồi cài đặt. Thay `YOUR_SERVER_IP` bằng IP thực tế:

```bash title="Server · original service account, any directory"
read -r -s -p 'Initial admin password: ' MY_APP_ADMIN_PASSWORD
export MY_APP_ADMIN_PASSWORD
```

```bash title="Server · original service account, any directory"
npx --yes @nocobase/app-installer@beta install /srv/nocobase/my-app \
  --archive /tmp/my-app.tar.gz \
  --origin http://YOUR_SERVER_IP:13000 \
  --base-path /main \
  --host 0.0.0.0 \
  --port 13000 \
  --name nocobase-my-app \
  --dialect sqlite \
  --set app.sampleData=false \
  --set-from-env users.initialAdmin.password=MY_APP_ADMIN_PASSWORD \
  --json
```

```bash title="Server · original service account, any directory"
unset MY_APP_ADMIN_PASSWORD
```

Trình cài đặt giải nén, khởi tạo cấu hình, áp dụng migration và Seed, đăng ký tiến trình PM2 rồi khởi động ứng dụng. Mật khẩu quản trị ban đầu chỉ áp dụng khi bảng người dùng rỗng. Tài khoản hiện có giữ mật khẩu cũ.

`--set-from-env` đọc biến mật khẩu từ terminal máy chủ hiện tại. Dùng tùy chọn này để giữ mật khẩu ngoài đối số `--set`.

<a id="configure-the-access-url"></a>

### Cấu hình URL truy cập

Ví dụ nghe trực tiếp trên cổng `13000`. Cho phép cổng qua tường lửa hoặc nhóm bảo mật. `--origin` đặt giao thức, host và cổng, còn `--base-path` đặt đường dẫn. URL kết quả là `http://YOUR_SERVER_IP:13000/main/`.

Nếu dùng tên miền, HTTPS và reverse proxy cùng máy chủ, thay cờ cài lần đầu tương ứng bằng:

```text
--origin https://apps.example.com
--base-path /main
--host 127.0.0.1
--port 13000
```

Proxy phải chuyển tiếp `/main/`, giữ header Host và giao thức, chuyển tiếp cookie và hỗ trợ WebSocket. Cấu hình DNS và HTTPS riêng.

<a id="check-the-installation"></a>

### Kiểm tra cài đặt

Trong kết quả JSON, `ok: true` báo thành công, `result.started: true` cho biết kiểm tra sức khỏe khi khởi động đã đạt và `result.url` là điểm vào ứng dụng. Đăng nhập bằng `result.initialAdmin.username` và mật khẩu đã đặt.

```bash title="Server · original service account, any directory"
npx --yes @nocobase/app-installer@beta status \
  --dir /srv/nocobase/my-app --json
```

Xác nhận `result.health.ok` là `true`, `result.process.status` là `online`, `result.node.matches` là `true` và `result.pending` là `null`. Kiểm tra endpoint sức khỏe trên máy chủ:

```bash title="Server · original service account, any directory"
curl --fail http://127.0.0.1:13000/main/api/healthz
```

Sau khi nhận `ok: true`, đăng nhập qua trình duyệt và kiểm tra tải lại trang cùng quyền người dùng. Nếu đã cấu hình tên miền, dùng tên miền thực tế. Khi truy cập lỗi, truy vấn trạng thái máy chủ rồi kiểm tra DNS, proxy và kết nối mạng.

<a id="configure-startup-and-verify-persistence"></a>

### Cấu hình tự khởi động và kiểm tra dữ liệu bền vững

```bash title="Server · original service account, any directory"
pm2 startup
```

Chạy lệnh cấu hình hệ thống được in ra rồi lưu danh sách tiến trình:

```bash title="Server · original service account, any directory"
pm2 save
```

Thư mục cài đặt gồm:

```text
/srv/nocobase/my-app/
├── installer.json
├── app.env
├── config.yml
├── storage/
├── logs/
├── backups/
├── current -> releases/<release>/app
└── releases/
```

Cấu hình và dữ liệu nằm ngoài các bản phát hành. Tạo bản ghi nghiệp vụ và tải lên một tệp nếu ứng dụng hỗ trợ. Sau đó khởi động lại trên máy chủ:

```bash title="Server · original service account, any directory"
pm2 restart nocobase-my-app
```

Đăng nhập lại để xác nhận bản ghi, tệp và quyền vẫn còn, đồng thời kiểm tra tác vụ theo lịch tiếp tục chạy. Kiểm tra riêng khả năng tự khôi phục sau khi khởi động lại máy chủ vào khung bảo trì phù hợp.

<a id="deploy-a-new-version-manually"></a>

## Triển khai phiên bản mới thủ công

<a id="build-the-new-archive"></a>

### Dựng gói mới

```bash title="Development machine · application source directory my-app/"
pnpm build --target linux-x64 --node-version 24 --tar
```

Bước dựng thay `storage/exports/dist.tar.gz`. Giữ gói cũ cần dùng trước khi dựng. Đọc ghi chú thay đổi migration và cấu hình của bản đích.

<a id="review-status-and-the-deployment-plan"></a>

### Xem trạng thái và kế hoạch triển khai

Tải gói mới lên từ máy phát triển:

```bash title="Development machine · application source directory my-app/"
scp storage/exports/dist.tar.gz deploy@server:/tmp/my-app-new.tar.gz
```

Sau đó chạy trên máy chủ:

```bash title="Server · original service account, any directory"
npx --yes @nocobase/app-installer@beta status \
  --dir /srv/nocobase/my-app --json
```

```bash title="Server · original service account, any directory"
npx --yes @nocobase/app-installer@beta upgrade \
  --dir /srv/nocobase/my-app \
  --archive /tmp/my-app-new.tar.gz --json
```

Triển khai bản mới bằng `upgrade` trên máy chủ. Cấu hình hiện có được giữ lại, nên bỏ các cờ cài lần đầu như `--origin`, `--host`, `--port`, `--name` và `--set`.

Khi cần cập nhật, bước kiểm tra trước trả `CONFIRMATION_REQUIRED` cùng thông tin gián đoạn, sao lưu và ảnh hưởng migration. Bản cũ vẫn chạy tại thời điểm này. Gửi lại cùng gói có thể trả `success-noop`. Gói được dựng lại vẫn có thể là bản phát hành mới dù phiên bản ứng dụng giống nhau.

<a id="confirm-backup-coverage"></a>

### Xác nhận phạm vi sao lưu

Sau khi dừng ứng dụng, trình cài đặt sao lưu các cơ sở dữ liệu SQLite nhận diện được trong cấu hình, cùng `config.yml` và `app.env`. Sao lưu riêng tệp tải lên, cơ sở dữ liệu ngoài và lưu trữ đối tượng. `--backup-done` xác nhận sao lưu cơ sở dữ liệu ngoài đã hoàn tất. Thực hiện sao lưu và khôi phục bằng quy trình riêng.

Phiên bản trình cài đặt này kiểm tra cấu hình, migration chờ và checksum lịch sử của migration và Seed. Nếu nhận `CHECKSUM_REPAIR_REQUIRED`, đối chiếu từng thay đổi với ghi chú phiên bản. Quyền sửa checksum cần xác nhận riêng. Chỉ sau khi rà soát, thêm `--repair-checksums <token>` khớp kế hoạch trả về vào cùng lệnh. Trình cài đặt sao lưu trước khi sửa checksum và chạy migration đã duyệt. Để bước kiểm tra trước điều phối việc sửa.

<a id="confirm-and-deploy"></a>

### Xác nhận và triển khai

Sau khi rà soát kế hoạch, bản sao lưu và thời gian gián đoạn, chạy trên máy chủ:

```bash title="Server · original service account, any directory"
npx --yes @nocobase/app-installer@beta upgrade \
  --dir /srv/nocobase/my-app \
  --archive /tmp/my-app-new.tar.gz --yes --json
```

Trình cài đặt dừng ứng dụng, sao lưu, áp dụng migration, chuyển bản phát hành, khởi động và kiểm tra. Tiếp tục dùng cấu hình, bí mật và dữ liệu hiện có.

`npx --yes` ở đầu xác nhận tải trình cài đặt. `--yes` ở cuối cho phép cập nhật. Với cơ sở dữ liệu ngoài, hoàn tất sao lưu trước rồi thêm `--backup-done` vào lệnh đã chọn.

<a id="verify-the-new-version"></a>

### Kiểm tra bản mới

Chạy lại `status` cho cùng đích để xác nhận bản mới và tình trạng hoạt động. Đăng nhập ở URL hiện có, rồi kiểm tra bản ghi cũ, tệp tải lên, quyền, tính năng mới và tác vụ nền.

Ghi commit nguồn và checksum gói. Giữ gói cũ và bản sao lưu. Trình cài đặt mặc định giữ ba bản phát hành, điều chỉnh bằng `--keep`. Muốn quay về bản đã bị dọn, cần gói và phương án khôi phục tương ứng.

<a id="deployment-failures-and-rollback"></a>

## Lỗi triển khai và rollback

Giữ lỗi và log rồi chạy `status` cho cùng đích để xem bản đang chạy và `pending`. Trình cài đặt có thể đã tự khôi phục bản cũ. Mã thoát `3` nghĩa là cập nhật thất bại và đã rollback. Mã `4` nghĩa là rollback cũng thất bại và ứng dụng đang dừng. Đọc lỗi JSON và gợi ý khôi phục trước khi thao tác tiếp.

Xem trước rollback trên máy chủ:

```bash title="Server · original service account, any directory"
npx --yes @nocobase/app-installer@beta rollback \
  --dir /srv/nocobase/my-app --json
```

Sau khi rà soát ảnh hưởng đến dữ liệu:

```bash title="Server · original service account, any directory"
npx --yes @nocobase/app-installer@beta rollback \
  --dir /srv/nocobase/my-app --yes --json
```

Chạy lệnh xem trước trước rồi chỉ chạy lệnh có `--yes` sau khi rà soát. Nếu cập nhật đã chạy migration hoặc sửa checksum, rollback có thể khôi phục bản sao SQLite ban đầu và làm mất các lượt ghi nghiệp vụ sau đó. Cơ sở dữ liệu ngoài và tệp tải lên cần quy trình khôi phục riêng. Chỉ cân nhắc `--no-restore` sau khi xác nhận bản cũ tương thích với cơ sở dữ liệu hiện tại.

Sau khi bị gián đoạn, truy vấn `status` trên máy chủ rồi kiểm tra tiến trình và `pending`. Xác định trạng thái và theo hướng dẫn khôi phục trước khi thử triển khai lại.

<a id="routine-management"></a>

## Quản lý thường ngày

Chạy trên máy chủ bằng tài khoản dịch vụ ban đầu:

```bash title="Server · original service account, any directory"
# Process status
pm2 status nocobase-my-app

# Logs; press Ctrl+C to stop following
pm2 logs nocobase-my-app --lines 100

# Restart
pm2 restart nocobase-my-app

# Stop
pm2 stop nocobase-my-app

# Resume
pm2 restart nocobase-my-app
```

Để đổi origin công khai, địa chỉ lắng nghe hoặc cổng, sửa `app.env` trong thư mục cài đặt, kiểm tra cổng trống và cập nhật proxy khi cần. Khởi động lại tiến trình, truy vấn trạng thái và kiểm tra URL thực tế. Để trình cài đặt quản lý `current` và các tệp đã dựng trong bản phát hành.

<a id="troubleshooting"></a>

## Xử lý sự cố

| Triệu chứng | Bước tiếp theo |
| --- | --- |
| `PORT_IN_USE` | Chọn cổng trống cho ứng dụng và cập nhật origin. Giữ các tiến trình khác đang chạy |
| `DRIVER_MISSING` | Thêm driver cơ sở dữ liệu đích vào mã nguồn và dựng lại gói |
| `START_FAILED` | Đọc đường dẫn log trả về và thư mục `logs/` của bản cài. Kiểm tra cấu hình, cơ sở dữ liệu và lỗi khởi động |
| Trạng thái khỏe nhưng ứng dụng không truy cập được | Kiểm tra địa chỉ lắng nghe, cổng, tường lửa, DNS và proxy. Dùng URL có cả đường dẫn ứng dụng |

Giữ `error.code`, `error.message` và `error.suggestions` trong JSON để chẩn đoán. Che thông tin bí mật khi chia sẻ cấu hình.
