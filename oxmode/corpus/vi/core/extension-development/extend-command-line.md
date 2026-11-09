---
title: Mở rộng dòng lệnh của plugin
description: Đăng ký lệnh plugin với đối số, đầu ra JSON, xử lý lỗi và hook build.
---

Plugin có thể bổ sung lệnh chẩn đoán, sinh sản phẩm và bảo trì một lần. Ví dụ thêm `notice-cli preview`, kiểm tra văn bản rồi trả kết quả xem trước. Phép xử lý chỉ cần dữ liệu đầu vào của lệnh, nên có thể chạy độc lập với ứng dụng và cơ sở dữ liệu.

## Cùng Agent

```text
Tạo plugin notice-cli với lệnh preview nhận --text.
Kiểm tra văn bản sau khi cắt khoảng trắng còn nội dung và nằm trong giới hạn.
Trả văn bản đã chuẩn hóa cùng số ký tự. Hỗ trợ --json và mã lỗi ổn định.
Giữ lệnh info do công cụ sinh, kiểm thử thành công và lỗi, rồi đăng ký trong ứng dụng.
```

## Tạo năng lực CLI

Chạy từ gốc ứng dụng. Các đường dẫn tính từ `packages/app-plugin-notice-cli/`.

```bash
pnpm create @nocobase/plugin@beta notice-cli --with cli
```

Khung cung cấp `cli/index.ts`, lệnh `info`, điểm xuất `./cli` và cấu hình phát triển cùng build. Plugin chỉ có CLI dùng riêng điểm vào này.

## Viết lệnh

Tạo `cli/preview.ts`.

```ts
import { AppCommand, CommandError } from '@nocobase/app-cli';
import { Flags, type Interfaces } from '@oclif/core';

export interface NoticePreview { readonly text: string; readonly length: number; }

export default class PreviewNotice extends AppCommand {
  static override summary = 'Preview notice text without saving it.';
  static override flags: { text: Interfaces.OptionFlag<string> } = {
    text: Flags.string({ description: 'Text to preview.', required: true }),
  };
  public async run(): Promise<NoticePreview> {
    const { flags } = await this.parse(PreviewNotice);
    if (!flags.text.trim() || flags.text.trim().length > 200) {
      throw new CommandError(
        'Text must contain between 1 and 200 UTF-16 code units.',
        { code: 'INVALID_TEXT', exit: 2 },
      );
    }
    const text = flags.text.trim();
    const result: NoticePreview = { text, length: Array.from(text).length };
    this.log(`${result.text} (${result.length})`);
    return result;
  }
}
```

`AppCommand` cung cấp môi trường phân tích đối số và hợp đồng đầu ra, bao gồm `--json` sẵn có. Khi thành công, trả dữ liệu thuần. Khi lỗi, ném `CommandError`. Để runtime đặt mã thoát và định dạng JSON.

Giới hạn đầu vào dùng độ dài chuỗi JavaScript. Số ký tự trả về đếm điểm mã Unicode. Xử lý văn bản thuần túy có thể chạy trực tiếp. Dùng `withApp()` khi lệnh cần cấu hình hoặc dịch vụ ứng dụng.

| Nhu cầu | Cách dùng |
| --- | --- |
| Xác định vị trí tệp ứng dụng | `this.rootDir` |
| Đọc cấu hình hoặc dùng dịch vụ | `this.withApp(async ({ app }) => ...)`. Đăng ký Provider trước khi phân giải dịch vụ |
| Chạy đủ vòng đời | Gọi `await app.start()` trong `withApp()` |

`withApp()` dọn dẹp cả khi thành công lẫn khi lỗi. Khởi động đầy đủ có thể chạy tác vụ nền. Khi chỉ đọc một giá trị cấu hình, dùng phần vòng đời cần thiết.

## Khai báo lệnh

Giữ `info` và thêm `preview` trong `cli/index.ts`.

```ts
import { defineCliPlugin, type AppCliPlugin } from '@nocobase/app-cli';
import PluginInfo from './info.ts';
import PreviewNotice from './preview.ts';

const cliPlugin: AppCliPlugin = defineCliPlugin({
  packageName: '@nocobase/app-plugin-notice-cli',
  commands: { info: PluginInfo, preview: PreviewNotice },
});
export default cliPlugin;
```

`@nocobase/app-plugin-notice-cli` tạo topic `notice-cli`, nên lệnh là `pnpm nocobase notice-cli preview`. Package cùng tên ngắn ở scope npm khác nhau vẫn tạo cùng topic. Chọn tên ngắn riêng để tránh xung đột. Các tên tích hợp như `build` được dành riêng.

| Đầu ra | Cách ghi | Với `--json` |
| --- | --- | --- |
| Kết quả cho người đọc | `this.log(...)` | Ẩn |
| Kết quả cho chương trình | `return result` | Nằm trong trường `result` của một tài liệu JSON |
| Tiến độ | `this.logToStderr(...)` | Vẫn ghi vào stderr |
| Cảnh báo | `this.warn(...)` | Nằm trong danh sách cảnh báo |
| Thất bại | Ném `CommandError` | `ok: false`, `error.code` ổn định và mã thoát khác 0 |

## Kiểm thử lệnh

Tạo `tests/cli/preview.test.ts`.

```ts
import { bindAppCommand, runAppCommand } from '@nocobase/app-testing/cli';
import { describe, expect, it } from 'vitest';
import cliPlugin from '../../cli/index.ts';
import PreviewNotice from '../../cli/preview.ts';

const Preview = bindAppCommand(PreviewNotice, {
  id: `${cliPlugin.topic}:preview`,
  rootDir: import.meta.dirname,
});
describe('preview command', () => {
  it('returns one JSON result', async () => {
    const run = await runAppCommand(Preview, ['--text', ' Hello ', '--json']);
    expect(run.json()).toMatchObject({
      ok: true,
      command: 'notice-cli preview',
      result: { text: 'Hello', length: 5 },
    });
    expect(run.exitCode).toBeUndefined();
  });
  it('reports invalid text with a nonzero exit', async () => {
    const run = await runAppCommand(Preview, ['--text', ' ', '--json']);
    expect(run.json()).toMatchObject({
      ok: false,
      error: { code: 'INVALID_TEXT' },
    });
    expect(run.exitCode).toBe(2);
  });
});
```

Nếu `tests/cli/info.test.ts` do công cụ sinh kiểm tra cả bảng lệnh chỉ chứa `info`, đổi assertion thành `expect(cliPlugin.commands.info).toBe(PluginInfo)`. Giữ các bài kiểm thử đầu ra hiện có.

```bash
pnpm --filter @nocobase/app-plugin-notice-cli format
pnpm --filter @nocobase/app-plugin-notice-cli check
```

```bash
pnpm nocobase plugin register @nocobase/app-plugin-notice-cli --no-install --dry-run
pnpm nocobase plugin register @nocobase/app-plugin-notice-cli --no-install
```

```bash
pnpm nocobase notice-cli preview --text " Hello "
pnpm nocobase notice-cli preview --text " Hello " --json
pnpm nocobase notice-cli preview --text " " --json
```

Hai lệnh đầu trả `Hello` và độ dài 5. Lệnh cuối trả `INVALID_TEXT` và thoát với mã 2. Sau khi chạy `pnpm build` của ứng dụng, dùng `node dist/cli/index.js notice-cli preview --text Hello --json` để kiểm tra lệnh trong bản triển khai.

<h2 id="development-commands-and-hooks">Lệnh phát triển và hook</h2>

Đặt lệnh cần dùng sau triển khai trong `commands`. Đặt lệnh biên dịch hoặc sinh tệp chỉ dành cho mã nguồn trong `devCommands`. Bản triển khai chỉ mang theo nhóm lệnh runtime.

Dùng `buildHooks` hoặc `devHooks` khi ứng dụng cần bước sinh tệp. Các giai đoạn build gồm `beforeBuild`, `afterClientBuild`, `afterServerBuild` và `afterBuild`. Phát triển có `beforeDev`. `command` của hook là mảng chương trình thực thi và đối số. Đặt chuỗi xử lý, pipe hoặc chuyển hướng trong script riêng nếu cần. Lỗi hook dừng quy trình, nên hook phù hợp cho sản phẩm bắt buộc.

Xem [Tích hợp lệnh plugin](../developing-apps/plugin-commands.md) để thiết lập và kiểm chứng phía ứng dụng. Lệnh chỉ thuộc một ứng dụng có thể đặt trực tiếp trong `cli/commands/`. Xem [Viết lệnh ứng dụng](../developing-apps/application-commands.md).
