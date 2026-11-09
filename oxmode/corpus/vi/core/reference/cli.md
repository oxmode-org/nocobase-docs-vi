---
title: Tham chiếu dòng lệnh
description: Điểm vào CLI, khác biệt giữa mã nguồn và bản triển khai, cấu hình, cơ sở dữ liệu, plugin và đầu ra JSON.
---

Trang này trình bày lệnh `nocobase` của ứng dụng. Để tạo ứng dụng, tạo plugin hoặc cài bản phát hành production, xem [Tạo ứng dụng](../../getting-started/develop-your-first-app.md#create-and-start-the-application), [Tạo plugin](../extension-development/create-plugin.md) và [Triển khai bằng PM2](../tutorials/deploy-with-app-installer.md).

<a id="entry-points"></a>

## Điểm vào CLI

Chạy lệnh từ dependency đã cài cục bộ, tại thư mục gốc của mã nguồn ứng dụng:

```bash
pnpm nocobase commands
pnpm nocobase config check --no-connect
pnpm nocobase plugin register --help
```

Bản dựng để triển khai có CLI riêng. Chạy từ thư mục gốc của ứng dụng đã triển khai:

```bash
node dist/cli/index.js commands
node dist/cli/index.js config check --no-connect
```

Bản dựng triển khai chỉ giữ lại các lệnh cần cho môi trường chạy. Các thao tác phát triển như `dev`, tích hợp plugin vào mã nguồn và dựng ứng dụng chạy từ mã nguồn. Với bản cài bằng app-installer, dùng điểm vào trong thư mục bản phát hành theo hướng dẫn triển khai.

<a id="command-index"></a>

## Danh mục lệnh

“Mã nguồn” chỉ workspace phát triển. “Cả hai” bao gồm workspace phát triển và bản triển khai. Plugin có thể bổ sung lệnh. Xem đầu ra của `commands` trên ứng dụng đang dùng để biết danh mục hiện tại.

| Lệnh | Môi trường | Công dụng và tùy chọn thường dùng |
| --- | --- | --- |
| `dev` / `build` / `start` | Mã nguồn | Phát triển, dựng và khởi chạy bản dựng. Mỗi lệnh xử lý tùy chọn riêng |
| `info` / `commands` | Cả hai | Xem thông tin ứng dụng hoặc cây lệnh. `commands --json` liệt kê đối số và khả năng thực thi |
| `config init` | Cả hai | Khởi tạo cấu hình cục bộ với `--dialect` và `--config`. Cài driver cơ sở dữ liệu riêng |
| `config set` | Cả hai | Ghi `key=value`. `--from-env` đọc giá trị từ biến môi trường |
| `config check` | Cả hai | Kiểm tra cấu hình. Dùng `--no-connect` để kiểm tra ngoại tuyến và `--strict` để coi cảnh báo là lỗi |
| `config env` / `config variables` | Cả hai | Liệt kê ánh xạ biến môi trường hoặc metadata triển khai. `variables --out` ghi tệp manifest |
| `db apply` | Cả hai | Áp dụng migration và dữ liệu seed đang chờ. Hỗ trợ `--dry-run` |
| `db rollback` / `db redo` | Cả hai | Hoàn tác đợt migration gần nhất hoặc hoàn tác rồi áp dụng lại. Cả hai thay đổi cơ sở dữ liệu |
| `db reset` | Cả hai | Đặt lại các bảng do ứng dụng quản lý và xóa dữ liệu trong đó |
| `db repair` | Cả hai | Sửa checksum của migration. Dùng migration riêng để thay đổi schema |
| `db unlock` | Cả hai | Gỡ khóa migration bị bỏ lại. Trước tiên xác nhận không có tiến trình migration đang chạy |
| `db sample` | Chỉ phát triển | Nạp dữ liệu mẫu. Bản triển khai từ chối chạy lệnh này kể cả khi danh mục có liệt kê |
| `collections generate` | Cả hai | Sinh tệp cho Collection. `--check` chỉ đối chiếu |
| `collections doctor` | Cả hai | Chẩn đoán chênh lệch giữa Collection và cơ sở dữ liệu. `--fix` áp dụng thay đổi |
| `locales check` | Cả hai | Kiểm tra tài nguyên bản địa hóa |
| `secrets status` / `secrets rotate` | Cả hai | Kiểm tra trạng thái hoặc luân chuyển khóa của dữ liệu đã mã hóa. `rotate --dry-run` xem trước, `--batch-size` đặt kích thước đợt |
| `plugin inspect` | Mã nguồn | Xem điểm vào của plugin và thông tin tích hợp |
| `plugin register` | Mã nguồn | Cài hoặc đăng ký plugin. Dùng `--dry-run` để xem trước |
| `plugin unregister` | Mã nguồn | Hủy đăng ký plugin và giữ lại dữ liệu nghiệp vụ của plugin |
| `plugin update` | Mã nguồn | Nâng cấp plugin được chỉ định hoặc toàn bộ plugin đã đăng ký nếu bỏ qua tên, sau đó đồng bộ Skills |
| `package remove` | Mã nguồn | Gỡ dependency cùng phần tích hợp liên quan. Hỗ trợ `--dry-run` |
| `skills sync` | Mã nguồn | Đồng bộ Skills từ dependency. Hỗ trợ lọc theo package hoặc plugin và chạy thử bằng `--dry-run` |
| `dist check` / `dist retarget` | Mã nguồn | Kiểm tra hoặc đổi nền tảng đích của bản dựng triển khai |
| `cli build` / `cli link` | Mã nguồn | Đóng gói CLI nghiệp vụ để phân phối hoặc tạo liên kết lệnh cục bộ |

<a id="development-and-builds"></a>

## Phát triển và dựng ứng dụng

Các script mặc định của ứng dụng cung cấp những lệnh tắt sau:

```bash
pnpm dev
pnpm test
pnpm lint
pnpm typecheck
pnpm build
pnpm start
```

Tệp `package.json` của ứng dụng khai báo các script có thể chạy. Để đóng gói bản triển khai cho một nền tảng đích cụ thể, chạy:

```bash
pnpm build --target linux-x64 --node-version 24 --tar
```

Chọn `--target` khớp với máy chủ, chẳng hạn `linux-x64` hoặc `linux-arm64-musl`. `--node-version` chọn phiên bản chính của Node trên máy đích. `--tar` ghi tệp `storage/exports/dist.tar.gz`. Các dependency cơ sở dữ liệu có mã native cần tương thích với hệ điều hành đích.

<a id="configuration-commands"></a>

## Lệnh cấu hình

```bash
pnpm nocobase config init --dialect sqlite
pnpm nocobase config set server.port=13000 client.app.title="My App"
pnpm nocobase config env
pnpm nocobase config variables --json
pnpm nocobase config check --no-connect --strict
```

Mặc định, `config init` giữ cấu hình hiện có. Dùng `--force` để thay thế. `config set` chấp nhận đường dẫn phân tách bằng dấu chấm và giá trị vô hướng YAML. Với đối tượng hoặc mảng phức tạp, sửa trực tiếp tệp cấu hình. Lệnh từ chối các mục không được định nghĩa. Biến môi trường có thể ghi đè giá trị cấu hình khi ứng dụng chạy.

Mặc định, `config check` thử kết nối với các cơ sở dữ liệu ngoài SQLite. `--no-connect` chỉ kiểm tra cấu hình, còn `--connect` kiểm tra cả kết nối SQLite. Bước kiểm tra kết nối không chạy migration. Xem [Tham chiếu cấu hình](configuration.md) để tra các trường và cách nhập giá trị bí mật.

<a id="database-commands"></a>

## Lệnh cơ sở dữ liệu

Các lệnh có hỗ trợ chọn kết nối nhận một trong hai tùy chọn `--connection <name>` hoặc `--all`. Nếu bỏ qua cả hai, lệnh dùng kết nối mặc định.

Xem kế hoạch trước khi áp dụng migration:

```bash
pnpm nocobase db apply --connection main --dry-run
pnpm nocobase db apply --connection main
```

Dùng `--help` để tra tùy chọn xem trước và xác nhận của từng lệnh `rollback`, `redo`, `reset` và `repair`. `--force` xác nhận rõ ràng thao tác. Khi checksum của migration đã áp dụng thay đổi, hãy tìm nguyên nhân trước và chỉ cân nhắc sửa checksum nếu phần chỉnh sửa giữ nguyên ý nghĩa của schema đã triển khai. Xem [Migration cơ sở dữ liệu](../framework/database/migrations.md).

<a id="plugins-and-skills"></a>

## Plugin và Skills

Nếu ứng dụng đã có thư mục `packages/app-plugin-announcements/`, xem trước các thay đổi khi đăng ký:

```bash
pnpm nocobase plugin register @nocobase/app-plugin-announcements --dry-run
pnpm nocobase skills sync --dry-run
```

Tên plugin lấy từ `package.json` của plugin. Chỉ dùng `--no-install` hoặc `--no-skills` với các lệnh hỗ trợ. Kiểm tra các tệp đăng ký Client, Server và CLI để biết những điểm vào nào đã được tích hợp. Xem [Quản lý plugin](../developing-apps/manage-plugins.md).

Nội dung hướng dẫn đã đồng bộ trong `.agents/skills/` có thể được tạo lại. Duy trì bản Skill phân phối cùng plugin trong thư mục nguồn `skills/` của plugin.

<a id="application-and-plugin-business-commands"></a>

## Lệnh nghiệp vụ của ứng dụng và plugin

Tệp ứng dụng `cli/commands/orders/sync.ts` tương ứng với lệnh sau:

```bash
pnpm nocobase app orders sync --help
```

Plugin khai báo lệnh qua điểm vào CLI. Thông thường, namespace lấy tên package sau khi bỏ scope và tiền tố `app-plugin-`. Nếu trùng namespace, quá trình đăng ký báo lỗi. Bản triển khai gọi các lệnh nghiệp vụ đã đóng gói. Các tệp nguồn bổ sung sau khi dựng sẽ không được tự động nạp.

Xem [Viết lệnh ứng dụng](../developing-apps/application-commands.md) để biết cách viết và kiểm tra, [Tích hợp lệnh plugin](../developing-apps/plugin-commands.md) để đăng ký vào ứng dụng và [Mở rộng CLI](../extension-development/extend-command-line.md) để triển khai lệnh trong plugin.

`cli link` hỗ trợ phát triển client độc lập trên máy cục bộ. `cli build` đóng gói client đó để gọi các thao tác nghiệp vụ từ xa. Client dùng API HTTP của ứng dụng đang chạy. Xem [Cung cấp CLI client cho ứng dụng](../developing-apps/cli-client.md) để biết cách tích hợp.

<a id="json-and-automation"></a>

## JSON và tự động hóa

```bash
pnpm nocobase commands --json
pnpm nocobase config check --no-connect --json
```

Ví dụ dưới đây minh họa các trường chính của phản hồi thành công. Mỗi lệnh định nghĩa nội dung `result` riêng:

```json
{
  "schemaVersion": 1,
  "ok": true,
  "command": "config check",
  "status": "success",
  "result": {},
  "warnings": []
}
```

Khi tự động hóa, kiểm tra mã thoát, `ok` và `status` trước khi đọc `result`. Lệnh thất bại thường trả về mã thoát khác 0. `success-noop` nghĩa là không cần thay đổi. `partial-success` nghĩa là vẫn còn việc cần xử lý. Khi đó, đọc `warnings` và các vấn đề lệnh báo cáo. `commands --json` cho biết lệnh nào hỗ trợ JSON, chạy thử hoặc xác nhận bằng force. Các lệnh chuyển tiếp như `dev`, `build` và `start` hỗ trợ JSON tùy lệnh. `NOCOBASE_CONTENT_TYPE=json` cũng chỉ có hiệu lực ở nơi hỗ trợ.

<a id="verification-scope"></a>

## Phạm vi kiểm chứng

Tài liệu gốc ghi nhận kiểm chứng ngày 27/10/2026 với template mặc định beta.83, `@nocobase/app-cli` 1.0.0-beta.29, Node 24.21.0 và pnpm 11.7.0. Các mục đã kiểm tra gồm danh mục lệnh ở mã nguồn và bản triển khai, kiểm tra cấu hình ngoại tuyến, metadata biến, trợ giúp về tùy chọn và bản xem trước khi đăng ký plugin thông báo cục bộ. Các thao tác thay đổi trạng thái như đặt lại dữ liệu, rollback và luân chuyển khóa nằm ngoài phạm vi kiểm chứng của trang. Xem [Mã nguồn app-cli](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-cli).
