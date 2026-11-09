---
title: Tích hợp lệnh plugin
description: Đăng ký lệnh plugin qua cli/plugins.ts và kiểm tra namespace, lệnh phát triển, hook dựng ứng dụng và hành vi khi triển khai.
---

Plugin cung cấp lệnh qua điểm vào `./cli`. Ứng dụng chọn những thành phần CLI cần nạp trong `cli/plugins.ts`. Trang này hướng dẫn đăng ký và sử dụng lệnh từ phía ứng dụng. Xem [Mở rộng CLI](../extension-development/extend-command-line.md) để triển khai và xuất lệnh từ plugin.

<a id="check-what-the-plugin-provides"></a>

## Kiểm tra những gì plugin cung cấp

Đọc tài liệu plugin, mục `exports` trong `package.json` và tệp `cli/index.ts`. Xác nhận có điểm vào `./cli` và xác định dịch vụ hoặc cấu hình mà lệnh cần. Một plugin client hoặc server có thể chỉ cung cấp tính năng cho môi trường tương ứng.

Template mặc định đăng ký Foundation và Scheduler trong `cli/plugins.ts`. Template Examples đăng ký thêm CLI Example, Agents và các thành phần khác. Giữ các mục đã đăng ký và kết nối những thành phần cần thiết để từng plugin hoạt động.

CLI, server và client có mục đích đăng ký riêng. Nếu lệnh CLI cần dịch vụ phía máy chủ, hãy kiểm tra cả `server/plugins.ts` để xác nhận dịch vụ đã được đăng ký. Xem [Quản lý plugin](manage-plugins.md) để biết cách cài đặt và đăng ký.

<a id="register-with-the-application"></a>

## Đăng ký với ứng dụng

Ví dụ dùng package cục bộ `@nocobase/app-plugin-notice-cli` được tạo trong [Mở rộng CLI](../extension-development/extend-command-line.md). Hoàn thành hướng dẫn đó và cài dependency của workspace trước để ứng dụng tìm được package. Tên này dùng cho package trong bài thực hành.

Xem trước thay đổi rồi đăng ký:

```bash
pnpm nocobase plugin register @nocobase/app-plugin-notice-cli --no-install --dry-run
pnpm nocobase plugin register @nocobase/app-plugin-notice-cli --no-install
```

`--no-install` bỏ qua bước cài dependency. Hãy cài dependency của workspace trước và cập nhật `package.json` cùng lockfile khi cần. Kiểm tra tệp `cli/plugins.ts` được sinh ra. Với template mặc định, danh sách sẽ tương tự ví dụ sau. Giữ lại các mục bổ sung đã có trong ứng dụng.

```ts
// cli/plugins.ts
import { defineCliPlugins, type AppCliPlugins } from '@nocobase/app-cli';
import foundation from '@nocobase/app-plugin-foundation/cli';
import scheduler from '@nocobase/app-plugin-scheduler/cli';
import noticeCli from '@nocobase/app-plugin-notice-cli/cli';

const cliPlugins: AppCliPlugins = defineCliPlugins([
  scheduler,
  foundation,
  noticeCli,
]);

export default cliPlugins;
```

`defineCliPlugins()` kết hợp các thành phần theo thứ tự trong mảng. Nếu đã đăng ký tự động, giữ mỗi thành phần một lần. Khi chỉnh sửa thủ công, đồng bộ câu lệnh import với mục tương ứng trong mảng.

<a id="find-and-run-commands"></a>

## Tìm và chạy lệnh

Nhóm lệnh của `@nocobase/app-plugin-notice-cli` là `notice-cli`. Gọi lệnh `preview` mà plugin khai báo như sau:

```bash
pnpm nocobase notice-cli preview --help
pnpm nocobase notice-cli preview --text " Hello " --json
pnpm nocobase notice-cli preview --text " " --json
```

Lệnh thứ hai trả về `result: { text: "Hello", length: 5 }`. Lệnh thứ ba trả về `INVALID_TEXT` với mã thoát `2`. Dùng `pnpm nocobase commands --json` để liệt kê lệnh và `--help` để tra đối số của từng lệnh. Xem [Viết lệnh ứng dụng](application-commands.md) để biết quy ước chung về đầu ra và lỗi.

Template Examples có sẵn một lệnh khác:

```bash
pnpm nocobase cli-example greet world --json
```

Lệnh này thuộc `@nocobase/app-plugin-cli-example` và trả về lời chào cùng tên đối tượng được chào. Để dùng lệnh trong template mặc định, cần đăng ký plugin ví dụ trước.

Tên nhóm lệnh thường lấy từ tên package sau khi bỏ scope npm và tiền tố `app-plugin-`. Hai nhóm trùng tên sẽ xung đột bất kể thứ tự đăng ký. Hãy xử lý tên plugin bị trùng và giữ lại các lệnh ứng dụng không liên quan.

<a id="development-commands-and-build-hooks"></a>

## Lệnh phát triển và hook dựng ứng dụng

| Thành phần | Công dụng trong ứng dụng | Trong bản triển khai |
| --- | --- | --- |
| `commands` | Chẩn đoán và bảo trì khi chạy | Có trong bản triển khai |
| `devCommands` | Kiểm tra mã nguồn và sinh tệp | Chỉ đăng ký trong môi trường phát triển |
| `buildHooks` | Tác vụ trong lúc dựng ứng dụng | Chạy khi dựng |
| `devHooks` | Tác vụ trước khi khởi động môi trường phát triển | Chạy khi phát triển |

Các giai đoạn dựng gồm `beforeBuild`, `afterClientBuild`, `afterServerBuild` và `afterBuild`. Giai đoạn phát triển là `beforeDev`. CLI của ứng dụng thu thập các hook đã đăng ký để chạy qua `pnpm build` và `pnpm dev` của dự án.

`command` của hook nhận chương trình thực thi và mảng đối số. Xem [Mở rộng CLI](../extension-development/extend-command-line.md#development-commands-and-hooks) để biết cách khai báo. Tệp hỗ trợ `preview-acceptance.ts` trong Examples phục vụ kiểm tra nghiệm thu của ứng dụng mẫu. Quy trình đăng ký plugin thông thường chỉ cần các thành phần CLI đã khai báo.

<a id="verify-and-remove"></a>

## Kiểm tra và gỡ đăng ký

Xác nhận trợ giúp có liệt kê nhóm lệnh, đầu vào hợp lệ cho kết quả mong đợi và đầu vào sai trả về mã lỗi ổn định. Sau khi dựng, kiểm tra điểm vào CLI của bản triển khai:

```bash
pnpm build
node dist/cli/index.js notice-cli preview --text Hello --json
node dist/cli/index.js commands --json
```

Danh mục lệnh của bản triển khai phải có các mục từ `commands` và loại trừ các mục từ `devCommands`. Nếu lệnh dùng dịch vụ hoặc cơ sở dữ liệu, hãy kiểm tra khả năng truy cập thực tế bằng cấu hình cô lập. Ví dụ xem trước văn bản chỉ xác nhận việc đăng ký và đầu ra.

Để chỉ ngừng cung cấp phần CLI, xóa câu lệnh import và mục tương ứng khỏi mảng trong `cli/plugins.ts`, rồi dựng lại ứng dụng. Trước khi gỡ toàn bộ plugin, kiểm tra các môi trường chạy khác, dependency và tài nguyên cơ sở dữ liệu theo hướng dẫn [Quản lý plugin](manage-plugins.md).

Tham khảo [Đăng ký CLI trong Examples](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/templates/app-template-examples/cli/plugins.ts) và [Khai báo CLI Example](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/examples/app-plugin-cli-example/cli/index.ts).
