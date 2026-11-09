---
title: Cung cấp CLI client cho ứng dụng
description: Tạo CLI độc lập bằng app-cli-client, kết nối API nghiệp vụ và kiểm tra gói phân phối.
---

Ứng dụng có thể cung cấp CLI độc lập như `nocobase-examples`. Người dùng đăng nhập từ máy của mình và thực hiện thao tác nghiệp vụ trên máy chủ mà không cần mã nguồn hay cấu hình cơ sở dữ liệu. Agent có thể dùng cùng giao diện.

`@nocobase/app-cli-client` xử lý đăng nhập, tìm lệnh và gọi HTTP. Manifest lệnh của máy chủ xác định các lệnh nghiệp vụ khả dụng. Logic nghiệp vụ chạy trên máy chủ.

<a id="when-to-provide-one"></a>

## Khi nào cần CLI độc lập

| Tình huống | Điểm vào |
| --- | --- |
| Xuất dữ liệu hoặc bảo trì trong môi trường ứng dụng | [Lệnh ứng dụng](application-commands.md), ví dụ `pnpm nocobase app statuses export` |
| Dùng lệnh bảo trì cục bộ hoặc lệnh phát triển của plugin | [Lệnh plugin](plugin-commands.md), ví dụ `pnpm nocobase notice-cli preview` |
| Cho người dùng, quy trình tự động hoặc agent truy cập ứng dụng đang chạy qua mạng | CLI độc lập, ví dụ `nocobase-examples user options` |

CLI độc lập lấy danh sách lệnh từ mô tả API nghiệp vụ. Tệp mới trong `cli/commands/` chỉ khai báo lệnh cục bộ của ứng dụng.

<a id="prepare-the-server"></a>

## Chuẩn bị máy chủ

Hướng dẫn dùng cấu hình có sẵn của template Examples và lệnh `user options`. Cần một ứng dụng Examples đang chạy, cơ sở dữ liệu đã khởi tạo và tài khoản có quyền đọc các tùy chọn quản lý người dùng.

Ngoài tên trong `package.json`, máy chủ cần các thành phần tích hợp sau:

- **Tài liệu API và manifest lệnh.** Khai báo route công khai như `describeRoute()` mô tả đầu vào, phản hồi và yêu cầu về danh tính. CLI đọc manifest của ứng dụng tại `/api/cli/manifest` theo mặc định.
- **Danh tính bên gọi.** Examples dùng plugin Agents để kết nối cơ chế xác định bên gọi với dịch vụ CLI, cùng các thành phần xác thực, người dùng và phân quyền. Với ứng dụng tùy chỉnh, kiểm tra và bổ sung tích hợp còn thiếu trong template mặc định.
- **Đăng nhập qua trình duyệt.** Examples cấu hình xác thực thiết bị, phiên dùng bearer token và trang xác nhận `/device`, đồng thời cho phép client ID `nocobase-cli`. Khi đổi ID, cập nhật cả client và danh sách cho phép của máy chủ.

Xem [Cấu hình xác thực của Examples](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/templates/app-template-examples/server/config/auth.ts) và [Tích hợp danh tính CLI của Agents](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/plugins/app-plugin-agents/server/cli/surface.ts). Manifest quyết định lệnh nào hiện ra. Với mỗi yêu cầu, API nghiệp vụ vẫn phải kiểm tra quyền và phạm vi dữ liệu tại endpoint.

<a id="configure-the-client-name"></a>

## Đặt tên client

Examples đã có cấu hình sau trong `package.json`. Với ứng dụng riêng, thêm `cli` vào đối tượng `nocobase` hiện có, giữ các trường khác và thêm phiên bản `@nocobase/app-cli-client` tương thích vào `devDependencies`.

```json
{
  "nocobase": {
    "cli": {
      "bin": "nocobase-examples",
      "displayName": "NocoBase Examples",
      "auth": {
        "clientId": "nocobase-cli"
      }
    }
  }
}
```

`bin` là tên lệnh người dùng gõ. `displayName` xuất hiện trong trợ giúp và thông báo. Máy chủ phải chấp nhận `auth.clientId` khi xác thực thiết bị. Chọn tên riêng cho ứng dụng và dành hai tên `nocobase`, `nocobase-runner` cho hệ thống.

Các tùy chọn như `envPrefix`, `stateDir` và `skills` có thể bỏ qua. Xem [Tham chiếu cấu hình CLI](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/app/app-cli/README.md#the-applications-own-cli-cli-build-and-cli-link) để tra đầy đủ các trường. Trước tiên hãy kiểm tra kết nối và các lời gọi nghiệp vụ.

<a id="link-and-use-the-client-locally"></a>

## Liên kết và dùng client cục bộ

Chạy từ thư mục gốc của ứng dụng Examples:

```bash
pnpm nocobase cli link
pnpm exec nocobase-examples --help
```

`cli link` tạo điểm vào trong `node_modules/.bin` của dự án để phát triển cục bộ. Khởi động máy chủ và cấu hình đăng nhập cùng manifest lệnh ở các bước riêng.

Khi máy chủ đã chạy, thay URL ví dụ bên dưới bằng địa chỉ thực tế, gồm cả đường dẫn cơ sở nếu bản triển khai có dùng:

```bash
pnpm exec nocobase-examples login --server https://your-app.example.com
pnpm exec nocobase-examples whoami
pnpm exec nocobase-examples docs
pnpm exec nocobase-examples user options --help
pnpm exec nocobase-examples user options --json
```

`login` hiển thị mã xác thực, mở trang xác nhận trên trình duyệt rồi lưu hồ sơ đăng nhập của máy chủ. Dùng `whoami` để kiểm tra danh tính đang dùng, `docs` để tìm lệnh nghiệp vụ và `--help` của từng lệnh để tra đối số.

`user options` là endpoint chỉ đọc có sẵn của plugin người dùng. Endpoint trả về phạm vi vai trò và các vai trò có thể gán khi quản lý người dùng. Các lệnh khả dụng phụ thuộc phiên bản máy chủ và manifest dành cho bên gọi. Quyền gọi lệnh do máy chủ kiểm tra. Dùng `--profile` để tách môi trường và xem `login --help` để tra tùy chọn tự động hóa và các cách đăng nhập khác.

<a id="expose-your-own-business-commands"></a>

## Cung cấp lệnh nghiệp vụ riêng

Trước tiên, triển khai, đăng ký và kiểm tra API HTTP theo [Route và API HTTP](apis-and-services.md). CLI dùng lại mô tả API đó, nên chỉ cần duy trì logic nghiệp vụ tại endpoint.

Plugin người dùng dùng cú pháp spread để đưa `cliRoute({ command: 'user options' })` vào metadata `describeRoute()` của route `/options`. Có thể lấy metadata như dưới đây rồi thêm `...cliMetadata` vào khai báo sẵn có:

```ts
import { cliRoute } from '@nocobase/app-server/router';

// Merge into the existing describeRoute({ ... }) metadata.
const cliMetadata = cliRoute({ command: 'user options' });
```

Giữ logic kiểm tra đầu vào, khai báo phản hồi, xác thực và xử lý nghiệp vụ trong route. Xem [Route đầy đủ của plugin người dùng](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/plugins/app-plugin-users/server/routes/index.ts).

`cliRoute()` cho phép tùy chỉnh tên, đối số vị trí, cờ và ví dụ. Nếu bỏ qua tùy chỉnh, tên có thể lấy từ mô tả API. `cliRoute(false)` loại route khỏi manifest CLI và endpoint HTTP vẫn hoạt động. Xem [Quy ước khai báo route CLI](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/app/app-server/src/router/cli/types.ts) để tra mọi tùy chọn.

Sau khi đổi API, kiểm tra trợ giúp, đối số, kết quả và cách CLI báo lỗi. Kiểm tra phân quyền phía máy chủ bằng các tài khoản có quyền khác nhau.

<a id="build-and-distribute"></a>

## Đóng gói và phân phối

Khi lời gọi cục bộ đã hoạt động, chạy từ thư mục gốc của ứng dụng:

```bash
pnpm nocobase cli build --help
pnpm nocobase cli build --universal --json
```

`--universal` tạo gói nén yêu cầu người dùng có sẵn Node.js 24 trở lên. Nếu bỏ qua `--targets`, quá trình dựng chỉ tạo gói phổ dụng đó. Để đóng gói kèm môi trường chạy, chọn nền tảng được hỗ trợ từ `--help`.

Đầu ra mặc định nằm trong `storage/runners/dist/` của ứng dụng, phân theo kênh, sản phẩm và phiên bản, gồm các gói nén và manifest. Đọc đường dẫn chính xác từ kết quả dựng. Sau khi `cli build` đóng gói client, phân phối qua trang tải xuống hoặc quy trình phát hành hiện có.

Trước khi bàn giao, giải nén vào thư mục riêng và dùng `bin/nocobase-examples` trong gói để thử trợ giúp, đăng nhập, `whoami` và một lệnh nghiệp vụ có quyền thực thi trên ứng dụng đích. Kiểm tra gói CLI riêng với bản triển khai ứng dụng do `pnpm build` tạo.

<a id="troubleshooting"></a>

## Xử lý sự cố

| Triệu chứng | Mục cần kiểm tra |
| --- | --- |
| `pnpm exec` không tìm thấy lệnh | `nocobase.cli.bin`, các dependency đã cài và kết quả `cli link` |
| Không hoàn tất được đăng nhập | Địa chỉ máy chủ, xác thực thiết bị, client ID và trang xác nhận |
| Đăng nhập xong nhưng thiếu manifest lệnh | `/api/cli/manifest` và tích hợp danh tính bên gọi |
| Thiếu một lệnh nghiệp vụ | Phiên bản máy chủ, tài liệu API, thiết lập loại khỏi CLI và bộ lọc theo danh tính |
| Lệnh có trong danh mục nhưng bị từ chối | Quyền tài khoản, phạm vi dữ liệu và kiểm tra đầu vào tại endpoint |

Xem [Tham chiếu dòng lệnh](../reference/cli.md) để tra các điểm vào cục bộ và từ xa.
