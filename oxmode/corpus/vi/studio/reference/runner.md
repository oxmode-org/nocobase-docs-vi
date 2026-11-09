---
title: Lệnh nocobase-runner
description: Đăng ký và bảo trì runner, xem log, quản lý công cụ, biến, bản cập nhật và thư mục làm việc.
---

`nocobase-runner` nhận công việc từ Studio và chạy công cụ lập trình trong môi trường thực thi. Dùng [nb-studio](cli.md) để quản lý dự án và đầu việc. Dùng các lệnh dưới đây để bảo trì runner.

Chạy lệnh trên máy runner bằng tài khoản hệ điều hành chạy dịch vụ. Dùng `nocobase-runner --help` hoặc thêm `--help` sau tên lệnh để tra tùy chọn theo phiên bản. Hầu hết các lệnh hỗ trợ `--json` để xuất dữ liệu có cấu trúc. Các lệnh xuất theo luồng như `logs` dùng đầu ra dạng văn bản.

<a id="install-and-register"></a>

## Cài đặt và đăng ký

Khi cài lần đầu, tạo lệnh cài đặt trong **Agent management › Runtimes**. Xem [Kết nối môi trường chạy](../setup/shared-runtimes.md). Dùng container hoặc máy ảo riêng để cô lập. Công cụ lập trình chạy với quyền của tài khoản hệ điều hành dùng cho runner.

Để kết nối runner hiện có với Studio khác hoặc kết nối lại sau khi bị thu hồi quyền, dùng thông tin xác thực dùng một lần mới:

```bash
nocobase-runner register --server https://studio.example.com/main --token '<registration-token>'
```

| Tùy chọn | Mục đích |
| --- | --- |
| `--server` | URL Studio gồm đường dẫn ứng dụng, chẳng hạn `/main` |
| `--token` | Thông tin xác thực dùng một lần từ **Add runtime** |
| `--name` | Tên runner, mặc định là tên máy |
| `--force` | Thay thế đăng ký đang hoạt động với cùng Studio. Với đăng ký đã bị thu hồi, chỉ cần thông tin xác thực mới |

Khởi động runner sau khi đăng ký. Nếu runner đang chạy, dừng rồi khởi động lại để nạp kết nối mới. Một runner có thể kết nối với nhiều Studio. Cấu hình số lượt chạy đồng thời và giới hạn công cụ trong cài đặt môi trường chạy của từng Studio.

<a id="start-stop-and-check-status"></a>

## Khởi động, dừng và kiểm tra trạng thái

```bash
nocobase-runner start
nocobase-runner status
nocobase-runner stop
```

`start` mặc định chạy nền. `start --foreground` chạy trong terminal hiện tại. `status` hiển thị các Studio đã kết nối, tiến trình, lượt chạy và cấu hình chạy đồng thời của từng kết nối. Xác nhận môi trường chạy hiện **Online** trong Studio.

`stop` làm gián đoạn công việc đang chạy và báo cho Studio để lập lịch lại. Mặc định lệnh chờ tối đa 30 giây. Dùng `stop --timeout 60` nếu cần thêm thời gian.

<a id="view-logs"></a>

## Xem log

| Lệnh | Mục đích |
| --- | --- |
| `nocobase-runner logs` | Hiển thị 100 dòng cuối của log runner |
| `nocobase-runner logs --lines 200` | Chọn số dòng |
| `nocobase-runner logs --follow` | Theo dõi dòng log mới |
| `nocobase-runner logs --run '<run-id>'` | Hiển thị log của một lượt chạy. Lấy ID từ `status` |

Log mặc định nằm ở `~/.nocobase-runner/logs/runner.log`.

<a id="configure-tools-and-models"></a>

## Cấu hình công cụ và mô hình

Mặc định runner cung cấp Node.js và pnpm riêng cho agent. Để dùng các phiên bản trong `PATH` của máy:

```bash
nocobase-runner config set agent-tools system
```

Dùng `config set agent-tools runner` để khôi phục mặc định. Thay đổi áp dụng cho công việc mới. Cài đặt và đăng nhập các công cụ như Claude Code hoặc Codex bằng quy trình riêng.

Runner thường phát hiện mô hình thông qua công cụ lập trình. Để chỉnh danh sách được báo về Studio, thay `codex` và ID mô hình dưới đây bằng công cụ và mô hình đang dùng:

| Lệnh | Mục đích |
| --- | --- |
| `nocobase-runner config models codex show` | Xem thiết lập ghi đè thủ công và danh sách dự phòng tích hợp |
| `nocobase-runner config models codex add '<model-id>'` | Thêm mô hình vào danh sách |
| `nocobase-runner config models codex remove '<model-id>'` | Ngừng báo mô hình |
| `nocobase-runner config models codex reset` | Xóa các thiết lập ghi đè thủ công của công cụ này |

Thay đổi được báo về trong tín hiệu định kỳ tiếp theo. Tài khoản công cụ lập trình vẫn cần quyền truy cập mô hình đã thêm.

<a id="environment-variables"></a>

## Biến môi trường

Lưu biến trên runner để cung cấp cho công việc yêu cầu biến đó:

```bash
nocobase-runner env set API_BASE_URL https://api.example.com --server https://studio.example.com/main
nocobase-runner env list --server https://studio.example.com/main
nocobase-runner env unset API_BASE_URL --server https://studio.example.com/main
```

Nếu bỏ `--server`, lệnh áp dụng cho mọi đăng ký. Giá trị được giữ trên máy, còn Studio chỉ nhận tên biến. `env list` cũng ẩn giá trị. Biến mới hoặc đã sửa có hiệu lực từ tín hiệu định kỳ tiếp theo và áp dụng cho các lượt chạy sau đó.

Truyền giá trị nhạy cảm qua đầu vào chuẩn. Ví dụ, nếu trình quản lý thông tin xác thực đã cấp `SERVICE_API_KEY` cho shell hiện tại:

```bash
printf '%s' "$SERVICE_API_KEY" | nocobase-runner env set SERVICE_API_KEY --server https://studio.example.com/main
```

Để truyền biến shell hiện có, thêm `--pass-env NAME` vào `start` hoặc `service install`. Lặp lại tùy chọn cho từng biến.

| Biến môi trường của runner | Mục đích |
| --- | --- |
| `NOCOBASE_RUNNER_HOME` | Trạng thái, đăng ký, bộ nhớ đệm và log. Mặc định là `~/.nocobase-runner` |
| `NOCOBASE_RUNNER_WORK_ROOT` | Thư mục làm việc của agent. Mặc định là `~/.nocobase-runner-work`, hoặc đường dẫn HOME tùy chỉnh nối thêm `-work` |

Dùng hai thư mục tách biệt cho trạng thái và công việc. Giữ cùng cấu hình đường dẫn khi cài dịch vụ và khi chạy các lệnh bảo trì sau đó.

<a id="background-service"></a>

## Dịch vụ chạy nền

```bash
nocobase-runner service install --dry-run
nocobase-runner service install
nocobase-runner service uninstall
```

`service install` cài và khởi động dịch vụ theo người dùng, dùng launchd trên macOS hoặc systemd trên Linux. `--dry-run` xem trước các thao tác. Dùng `--label` để đặt tên dịch vụ riêng. Trên Windows, chạy các lệnh Linux trong WSL.

Khi cài, dịch vụ ghi nhận `PATH`, proxy, CA và giá trị các biến `--pass-env` từ shell hiện tại. Nếu công cụ chạy được trong terminal nhưng dịch vụ không tìm thấy, hoặc các biến đã đổi, chạy lại `service install` từ terminal có cấu hình đúng.

`service uninstall` dừng và gỡ định nghĩa dịch vụ. Chương trình runner và dữ liệu được giữ lại.

<a id="update-and-clean-up"></a>

## Cập nhật và dọn dẹp

```bash
nocobase-runner update --check
nocobase-runner update
```

Bản cập nhật dùng phiên bản do Studio đang kết nối cung cấp và khởi động lại runner, có thể làm gián đoạn công việc đang chạy. Nếu kết nối nhiều Studio, chọn nguồn bằng `--server`. Runner được cài qua script mặc định bật tự cập nhật. Dùng `update --auto off` để tắt hoặc `update --auto on` để bật, rồi khởi động lại runner.

Kiểm tra thư mục làm việc và xem trước kế hoạch dọn dẹp:

```bash
nocobase-runner gc
nocobase-runner gc --ended --apply
```

`gc` mặc định chỉ xem trước. `--apply` xóa thư mục. Lọc bằng `--ended` cho công việc Studio xem là đã kết thúc, `--older-than 14d` theo thời gian không hoạt động hoặc `--subject '<task-key>'` theo đầu việc. Khi kết hợp, thư mục phải khớp mọi bộ lọc.

> [!WARNING] Dọn dẹp sẽ xóa thư mục làm việc
> Thư mục của công việc đã kết thúc bị xóa kể cả khi có tệp chưa commit hoặc commit chưa đẩy. Thư mục khác có thay đổi chưa đẩy cần `--force`. Thư mục đang được sử dụng được giữ lại. Xem trước và đẩy các thay đổi cần giữ trước khi dọn.

Điều chỉnh dọn dẹp tự động bằng `nocobase-runner config set <key> <value>`:

| Cài đặt | Mặc định | Mục đích |
| --- | --- | --- |
| `min-free-disk` | `5G` | Dung lượng trống cần giữ. Nhận dung lượng như `20G`, tỷ lệ như `10%` hoặc `off`. Nếu sau khi dọn vẫn thiếu dung lượng, công việc mới sẽ chờ |
| `artifact-ttl` | `24h` | Thời gian thư mục không hoạt động trước khi xóa các tệp có thể tạo lại. Nhận `30m`, `2d` hoặc `off` |
| `artifact-patterns` | `node_modules,.next,.turbo` | Các tên thư mục cần xóa, phân tách bằng dấu phẩy. `default` khôi phục mặc định |

Dọn tệp có thể tạo lại giữ nguyên bản checkout mã và chỉ xóa thư mục khớp mẫu. Có thể áp dụng các thiết lập dung lượng và dọn dẹp mà không cần khởi động lại.

<a id="unregister-and-uninstall"></a>

## Hủy đăng ký và gỡ cài đặt

Để ngắt kết nối với một Studio:

```bash
nocobase-runner stop
nocobase-runner unregister --server https://studio.example.com/main
```

`unregister` xóa bản ghi kết nối và thông tin xác thực cục bộ. Môi trường chạy vẫn còn trong Studio. Nếu còn kết nối khác, chạy `start` để tiếp tục công việc. Thu hồi thông tin xác thực rồi xóa môi trường không dùng trong Studio.

Xem trước phạm vi gỡ runner trước khi thực hiện:

```bash
nocobase-runner uninstall --dry-run
nocobase-runner uninstall
```

`uninstall` dừng runner, gỡ dịch vụ và chương trình do script cài đặt tạo. Đăng ký, bộ nhớ đệm, log và thư mục làm việc được giữ lại. Thêm `--purge` để xóa cả dữ liệu đó và thư mục làm việc của agent. Dùng `uninstall --purge --dry-run` để xem trước toàn bộ phạm vi.
