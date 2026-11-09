---
title: Triển khai bằng app-installer
description: Cài đặt một gói nén lên server với pm2 giám sát, cấu hình và dữ liệu được lưu giữ lâu dài.
---

Hướng dẫn này dùng ứng dụng quản lý công việc làm ví dụ minh họa và cũng áp dụng cho các ứng dụng NocoBase Core của riêng bạn. Xác nhận môi trường đích qua [Chọn cách triển khai](../deployment/choose-a-deployment-method.md). Với dự án của bạn, hãy thay tên ứng dụng, đường dẫn và các bước nghiệm thu nghiệp vụ trong ví dụ.

`@nocobase/app-installer` giải nén một gói phát hành, chuẩn bị cấu hình, áp dụng migration, khởi động pm2 và kiểm tra health. Nó cũng quản lý các lần cập nhật ứng dụng về sau.

Hãy chắc chắn ứng dụng đã qua kiểm thử; xem [Xây ứng dụng đầu tiên](build-your-first-feature.md) cho ví dụ ứng dụng công việc. Hướng dẫn này dùng một instance, SQLite, Linux x64/glibc, Node.js 24 và base path `/tasks`. Các loại cơ sở dữ liệu khác cần driver tương ứng trong ứng dụng nguồn và một bản build mới.

## Điều kiện cần

Mã nguồn và pnpm chỉ cần ở máy phát triển. Server cần Node.js 24, pm2 4.3 trở lên có sẵn toàn cục, `tar` và một thư mục cài đặt trống, ghi được, thuộc sở hữu của một tài khoản dịch vụ cố định. Các lệnh dưới đây dùng Bash.

```bash
node --version
node -p "process.platform + '-' + process.arch"
command -v pm2
command -v tar
```

Nếu cần, người quản lý server cài pm2 bằng `npm install -g pm2`. Dùng cùng tài khoản dịch vụ đó cho các thao tác về sau. Ví dụ này dùng `/srv/nocobase/tasks`; để diễn tập cục bộ, dùng `$HOME/tasks` và điều chỉnh mọi tham số thư mục.

Ứng dụng lắng nghe trên `127.0.0.1:13000`. Một reverse proxy cấu hình riêng cung cấp `https://tasks.example.com/tasks/`, giữ nguyên base path và nâng cấp WebSocket. Để diễn tập cục bộ, dùng origin `http://127.0.0.1:13000`. Xác nhận cổng đang trống. Máy chạy `npx` cần truy cập được registry; một máy đích offline có thể nhận installer và gói qua SSH từ máy phát triển.

## Cùng Agent

```text
Hãy dùng app-installer để triển khai ứng dụng công việc hiện tại lên server này lần đầu.

Server: <alias SSH của server>
Thư mục cài đặt: /srv/nocobase/tasks, dùng thư mục và cơ sở dữ liệu SQLite mới
Môi trường server: Linux x64/glibc, Node.js 24
Ứng dụng lắng nghe trên: 127.0.0.1:13000
URL cho người dùng: https://tasks.example.com/tasks/

Làm theo hướng dẫn triển khai của dự án, kiểm tra máy đích và các điều kiện cần, rồi chuẩn bị và cài đặt ứng dụng.
Chỉ thao tác trên ứng dụng của hướng dẫn này, không nhập dữ liệu phát triển hay thêm công việc mẫu.
Thiết lập đăng nhập quản trị viên, đọc mật khẩu tôi cung cấp một cách an toàn, và giữ mật khẩu cùng khóa bí mật ngoài đầu ra và mã.

Kiểm tra đăng nhập, các thao tác với công việc và quyền chỉ đọc của thành viên.
Khởi động lại ứng dụng này và kiểm tra các công việc đã tạo cùng quyền vẫn còn.
Báo cáo URL, kết quả kiểm tra và các phần thiết lập môi trường tôi vẫn cần tự xử lý.
```

Thay các chỗ giữ chỗ bằng đích thực tế đã được cho phép. Server không cần Agent, mã nguồn hay dependency phát triển.

## Không dùng Agent

### 1. Build trên máy phát triển

```bash
pnpm build --target linux-x64 --node-version 24 --tar
sha256sum storage/exports/dist.tar.gz
```

Gói nén bao gồm các dependency production. Nền tảng, libc và phiên bản chính của Node phải khớp với server. Đừng chạy `pnpm install` trên server cho kiểu cài đặt từ gói nén này.

### 2. Chọn cài đặt tại chỗ hoặc triển khai qua SSH

**A. Chạy installer trên server.** Sao chép gói nén từ máy phát triển:

```bash
scp storage/exports/dist.tar.gz deploy@server:/tmp/tasks.tar.gz
```

Sau đó, bằng tài khoản dịch vụ trên server:

```bash
read -r -s -p 'Initial admin password: ' TASK_INITIAL_PASSWORD
export TASK_INITIAL_PASSWORD

npx --yes @nocobase/app-installer@beta install /srv/nocobase/tasks \
  --archive /tmp/tasks.tar.gz \
  --origin https://tasks.example.com \
  --base-path /tasks --host 127.0.0.1 --port 13000 \
  --name nocobase-tasks \
  --set app.sampleData=false \
  --set-from-env users.initialAdmin.password=TASK_INITIAL_PASSWORD \
  --json

unset TASK_INITIAL_PASSWORD
```

**B. Triển khai qua SSH từ máy phát triển.** Cấu hình đăng nhập bằng key và xác minh host key qua một kênh tin cậy. Kiểm tra PATH của tài khoản ở chế độ không tương tác:

```bash
ssh deploy@server 'node --version && command -v pm2 && command -v tar'
```

Sau đó chạy tại máy cục bộ:

```bash
read -r -s -p 'Initial admin password: ' TASK_INITIAL_PASSWORD
export TASK_INITIAL_PASSWORD

npx --yes @nocobase/app-installer@beta deploy \
  --ssh deploy@server --dir /srv/nocobase/tasks \
  --archive storage/exports/dist.tar.gz \
  --origin https://tasks.example.com \
  --base-path /tasks --host 127.0.0.1 --port 13000 \
  --name nocobase-tasks \
  --set app.sampleData=false \
  --set-from-env users.initialAdmin.password=TASK_INITIAL_PASSWORD \
  --json

unset TASK_INITIAL_PASSWORD
```

`--archive` là đường dẫn trên máy phát triển; `--dir` là đường dẫn tuyệt đối trên server. Dùng `--ssh-port`, `--ssh-identity` hoặc `--ssh-config` khi cần, kể cả ở các lệnh tiếp theo. Công cụ sẽ chuyển installer và gói nén; server vẫn cần Node.js, pm2 và tar.

Cả hai cách cài đặt lần đầu đều cần một thư mục mới hoặc trống. Origin không bao gồm `/tasks`; base path là tham số riêng. `--set-from-env` đọc mật khẩu trên máy đang chạy installer và chuyển qua SSH đã mã hóa khi cần. Thông tin đăng nhập ban đầu chỉ có tác dụng với bảng người dùng còn trống. `npx --yes` ở đầu lệnh chỉ chấp nhận việc tải công cụ, không phải các kế hoạch cập nhật hay rollback về sau.

### 3. Kiểm tra cài đặt và truy cập

Kết quả JSON mong đợi có `ok: true`, `status: "success"` và `result.started: true`. Dùng URL ứng dụng được trả về, tên đăng nhập ban đầu và mật khẩu bạn đã cấu hình. Mật khẩu tùy chỉnh sẽ cho `result.initialAdmin.defaultPassword: false`.

```bash
npx --yes @nocobase/app-installer@beta status \
  --dir /srv/nocobase/tasks --json
curl --fail http://127.0.0.1:13000/tasks/api/healthz
```

Để xem trạng thái từ xa, thêm `--ssh deploy@server`. Kiểm tra health là true, trạng thái tiến trình là `online`, Node khớp, và không có thao tác nào đang chờ. Khi proxy đã sẵn sàng, hãy kiểm tra cả `https://tasks.example.com/tasks/api/healthz` và đăng nhập qua URL công khai thực tế. Health cục bộ trên server không kiểm chứng DNS, TLS hay proxy. `result.remote.publicHealth: false` nghĩa là máy khởi tạo không truy cập được endpoint công khai đã cấu hình.

Installer giữ `installer.json`, `app.env`, `config.yml`, `storage/`, log và bản sao lưu bên ngoài thư mục `releases/` có phiên bản. `current` trỏ đến bản phát hành đang chạy. Đừng tự ghi đè bản phát hành đã cài hay symlink. Ví dụ bắt đầu sử dụng hiện tại khởi tạo các vai trò cho công việc qua seed bắt buộc. Công việc phát triển, người dùng của nhóm và việc gán vai trò không được sao chép theo gói nén; hãy cấu hình hoặc chuyển chúng riêng.

### 4. Kiểm tra giám sát tiến trình và dữ liệu lâu dài

Tạo và hoàn thành một công việc, làm mới trang, và thử với một người dùng chỉ đọc. Chỉ khởi động lại ứng dụng này bằng `pm2 restart nocobase-tasks`, dùng cùng tài khoản dịch vụ, rồi kiểm tra bản ghi và trạng thái đó vẫn còn. Làm theo `nextCommands` trong kết quả cài đặt để cấu hình tự khôi phục khi khởi động máy bằng `pm2 startup` và lệnh hệ thống mà nó in ra. Khởi động lại tiến trình và khôi phục sau khi khởi động lại máy là hai kiểm tra riêng.

## Phát hành bản mới

Xem [Phát hành phiên bản ứng dụng](../deployment/publish-app-release.md) để có cái nhìn tổng quan về quy trình cập nhật. Giữ lại các gói cũ và các phiên bản mã nguồn. Build một gói nén mới, rồi xem trạng thái và kế hoạch cập nhật.

### Cùng Agent

```text
Hãy phát hành ứng dụng công việc mới đã được kiểm chứng lên môi trường hướng dẫn hiện có.

Server: <alias SSH của server>
Thư mục cài đặt hiện có: /srv/nocobase/tasks
Tiếp tục dùng app-installer và giữ nguyên cơ sở dữ liệu, cấu hình, khóa bí mật đăng nhập và tệp đã tải lên.

Trước khi cập nhật, kiểm tra phiên bản và các công việc hiện tại, chuẩn bị bản sao lưu và giữ lại phiên bản trước.
Giải thích các thay đổi dữ liệu, thời gian gián đoạn dự kiến và cách khôi phục nếu cập nhật thất bại.
Nếu các thay đổi dữ liệu đã áp dụng trước đó bị viết lại, hãy điều tra trước khi thử sửa hay bỏ qua kiểm tra.
Đừng coi lần cập nhật là một lần cài đặt mới hay xóa dữ liệu hiện có.

Kiểm tra người được giao, trạng thái hoàn thành và quyền của người đọc cũ vẫn còn, và tính năng mới hoạt động.
Khởi động lại và kiểm tra lần nữa. Chỉ thao tác trên ứng dụng của hướng dẫn này và báo cáo kết quả thực tế.
```

### Không dùng Agent

Build và sao chép gói nén mới như trên. Trên server, xem kế hoạch mà không thêm cờ xác nhận của installer:

```bash
npx --yes @nocobase/app-installer@beta upgrade \
  --dir /srv/nocobase/tasks --archive /tmp/tasks-new.tar.gz --json
```

Từ máy phát triển, dùng `deploy --ssh` với thư mục hiện có và gói nén cục bộ mới. Đừng lặp lại các tùy chọn của lần cài đầu như origin, cổng hay `--set`. Installer nhận ra `installer.json` đã có; một gói giống hệt sẽ trả về `success-noop`.

Một lần cập nhật đang chờ sẽ trả về `CONFIRMATION_REQUIRED` kèm chi tiết về thời gian gián đoạn, sao lưu và migration, trong khi ứng dụng cũ vẫn chạy. Xem kỹ trước khi thêm `--yes` của chính installer:

```bash
npx --yes @nocobase/app-installer@beta upgrade \
  --dir /srv/nocobase/tasks --archive /tmp/tasks-new.tar.gz --yes --json
```

Installer đã diễn tập, `0.1.0-beta.9`, báo một migration mới cho hạn hoàn thành và không có sửa checksum nào. Thay đổi migration/checksum ngoài dự kiến cần được điều tra, không phải reset cơ sở dữ liệu. Installer dừng ứng dụng, sao lưu SQLite và cấu hình, chạy migration, chuyển bản phát hành và kiểm tra health. Tệp tải lên và cơ sở dữ liệu bên ngoài cần sao lưu riêng; `--backup-done` chỉ xác nhận đã có bản sao lưu chứ không tạo bản sao lưu.

Sau đó kiểm tra trạng thái và cả dữ liệu cũ lẫn mới. Hạn hoàn thành của bản ghi cũ vẫn để trống; hạn hoàn thành mới được giữ qua các lần làm mới và thay đổi trạng thái hoàn thành. Quyền của người đọc và dữ liệu sau khi khởi động lại phải được giữ nguyên. Ghi lại commit nguồn và digest của gói; riêng phiên bản ứng dụng không xác định được một bản build lại.

### Thất bại và rollback

Giữ lại thông báo lỗi và kiểm tra trạng thái, log, bản phát hành hiện tại và các thao tác đang chờ trước khi thử lại. Xem kế hoạch rollback bằng:

```bash
npx --yes @nocobase/app-installer@beta rollback --dir /srv/nocobase/tasks --json
```

Chỉ xác nhận sau khi đã xem xét việc mất dữ liệu và cách khôi phục. Trong trường hợp migration SQLite đã diễn tập, rollback khôi phục bản sao lưu cơ sở dữ liệu từ trước khi cập nhật và có thể làm mất các dữ liệu ghi sau đó. Cơ sở dữ liệu bên ngoài và tệp tải lên có quy trình khôi phục riêng.

## Phạm vi kiểm chứng

Buổi diễn tập ban đầu với template `.77` dùng installer `0.1.0-beta.9`: cài đặt tại chỗ, chuyển thực tế qua một endpoint SSH cục bộ tách biệt, đăng nhập bằng mật khẩu tùy chỉnh, từ chối mật khẩu mặc định, quyền với công việc, dữ liệu còn nguyên sau khởi động lại, xung đột cổng, triển khai lặp lại và một lần cập nhật hạn hoàn thành vẫn giữ dữ liệu/cấu hình hiện có. Mạng giữa các host, thiết lập TLS/proxy công khai, khôi phục khi khởi động máy và rollback chưa được thực hiện. Ví dụ npm `.81` hiện tại chưa được triển khai lại qua các cách này trong lần rà soát tài liệu này.
