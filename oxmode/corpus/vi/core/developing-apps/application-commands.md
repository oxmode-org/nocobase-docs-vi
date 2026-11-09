---
title: Viết lệnh ứng dụng
description: Viết lớp AppCommand, truy cập dịch vụ, xử lý đường dẫn và đầu ra JSON, rồi kiểm tra lệnh trong bản triển khai.
---

Đặt lệnh riêng của ứng dụng trong `cli/commands/`. Các lệnh này phù hợp để xuất dữ liệu, chẩn đoán hoặc bảo trì một lần. Ví dụ, `pnpm nocobase app statuses export` đọc danh mục trạng thái và lưu vào tệp.

Hướng dẫn dành cho người phát triển và vận hành có quyền truy cập thư mục và cấu hình ứng dụng. Để người dùng hoặc agent thực hiện thao tác nghiệp vụ qua mạng, xem [Cung cấp CLI client cho ứng dụng](cli-client.md). Với lệnh dùng chung cho nhiều ứng dụng, xem [Tích hợp lệnh plugin](plugin-commands.md).

<a id="directories-and-command-names"></a>

## Thư mục và tên lệnh

```text
cli/
├── commands/
│   └── statuses/
│       ├── export.ts       # app statuses export
│       └── _helpers.ts     # Helpers, not a command
└── plugins.ts              # Plugin command registration
```

Mỗi tệp lệnh xuất mặc định một lớp con của `AppCommand`. CLI lấy tên lệnh dưới nhóm `app` từ đường dẫn tệp. Các tệp và thư mục bắt đầu bằng `_`, cùng các thư mục tên `lib`, được bỏ qua. Chọn tên khác ngoài `dist`, `build`, `coverage` và `generated` vì quy tắc quản lý mã nguồn, định dạng hoặc kiểm tra của dự án bỏ qua các tên đó.

Lệnh ứng dụng có trong bản triển khai, nên khai báo các package cần khi chạy trong `dependencies`. Đặt công cụ sinh mã chỉ dùng ở workspace phát triển trong script dự án hoặc `devCommands` của plugin.

<a id="example-export-the-status-dictionary"></a>

## Ví dụ xuất danh mục trạng thái

Hoàn thành ví dụ độc lập `appStatuses` ở đầu bài [Tạo bảng và khởi tạo dữ liệu](data-models-and-migrations.md). Chạy migration và Seed để tạo trường `code`, `title` và các bản ghi mặc định. Có thể thêm trường mô tả tùy chọn vì lệnh vẫn xuất cùng các trường và mã mặc định.

Thêm `cli/commands/statuses/export.ts`:

```ts
// cli/commands/statuses/export.ts
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { AppCommand, CommandError, appPath } from '@nocobase/app-cli';
import { Flags, type Interfaces } from '@oclif/core';

export interface StatusExportResult {
  readonly file: string;
  readonly count: number;
  readonly written: boolean;
}

export default class ExportStatuses extends AppCommand {
  static override summary = 'Export the application status dictionary.';
  static override examples = [
    '<%= config.bin %> <%= command.id %> --dry-run --json',
    '<%= config.bin %> <%= command.id %> --output ./statuses.json --json',
  ];
  static override flags: {
    output: Interfaces.OptionFlag<string | undefined>;
    'dry-run': Interfaces.BooleanFlag<boolean>;
  } = {
    output: appPath({ description: 'Write a new JSON file at this path.' }),
    'dry-run': Flags.boolean({
      default: false,
      description: 'Read the dictionary without writing a file.',
    }),
  };

  async run(): Promise<StatusExportResult> {
    const { flags } = await this.parse(ExportStatuses);
    const { databaseManagerToken } = await import('@nocobase/db');
    const result = await this.withApp(async ({ app }) => {
      app.registerProviders();
      const database = app.container.resolve(databaseManagerToken);
      const rows = await database.repository('appStatuses').findMany({
        select: (s) => s.fields('code', 'title'),
        sort: (s) => [s.field('code').asc()],
        limit: 101,
      });
      if (rows.length > 100) {
        throw new CommandError('This example exports at most 100 statuses.', {
          code: 'EXPORT_LIMIT_EXCEEDED',
          suggestions: ['Add pagination before exporting larger dictionaries.'],
        });
      }

      const file = flags.output ?? app.paths.storage('exports/statuses.json');
      if (flags['dry-run'] || rows.length === 0) {
        return { file, count: rows.length, written: false };
      }
      try {
        await mkdir(dirname(file), { recursive: true });
      } catch (cause) {
        throw new CommandError('The output directory could not be prepared.', {
          code: 'EXPORT_WRITE_FAILED',
          cause,
        });
      }
      try {
        await writeFile(file, JSON.stringify(rows, null, 2) + '\n', {
          encoding: 'utf8',
          flag: 'wx',
        });
      } catch (cause) {
        if ((cause as NodeJS.ErrnoException).code === 'EEXIST') {
          throw new CommandError('The output file already exists.', {
            code: 'OUTPUT_EXISTS',
            exit: 2,
            suggestions: ['Choose another path with --output.'],
          });
        }
        throw new CommandError('The export file could not be written.', {
          code: 'EXPORT_WRITE_FAILED',
          cause,
        });
      }
      return { file, count: rows.length, written: true };
    });

    if (!result.written) this.setStatus('success-noop');
    this.log(result.written
      ? `Exported ${result.count} statuses to ${result.file}.`
      : `No file written: ${result.count} statuses; target ${result.file}.`);
    return result;
  }
}
```

Lệnh chỉ đọc danh mục. Ví dụ xuất tối đa 100 bản ghi và báo lỗi nếu vượt giới hạn. Với dữ liệu lớn hơn, cần phân trang và chọn cách ghi tệp phù hợp. Chạy thử hoặc danh mục rỗng thì không tạo tệp. Khi tệp đích đã tồn tại, lệnh báo lỗi và giữ tệp đó.

Chạy từ thư mục gốc của ứng dụng:

```bash
pnpm nocobase app statuses export --help
pnpm nocobase app statuses export --dry-run --json
pnpm nocobase app statuses export --output ./statuses.json --json
```

Với hai bản ghi mặc định, lần chạy thử có đầu ra dạng sau. Đường dẫn thực tế tùy theo ứng dụng và cấu hình lưu trữ:

```json
{
  "schemaVersion": 1,
  "ok": true,
  "command": "app statuses export",
  "status": "success-noop",
  "result": {
    "file": "/path/to/my-app/storage/exports/statuses.json",
    "count": 2,
    "written": false
  },
  "warnings": []
}
```

Lệnh cuối tạo `statuses.json`. Chạy lại với cùng đường dẫn trả về `OUTPUT_EXISTS` và mã thoát `2`. Chọn tên tệp khác để tiếp tục.

<a id="choose-the-application-facilities-you-need"></a>

## Chọn thành phần ứng dụng cần dùng

| Nhu cầu | Điểm vào |
| --- | --- |
| Xác định vị trí tệp ứng dụng | `this.rootDir`, dùng trực tiếp mà không cần tạo ứng dụng |
| Đọc cấu hình, đường dẫn hoặc môi trường | `this.withApp(async ({ app, env }) => ...)` |
| Lấy cơ sở dữ liệu hoặc dịch vụ nghiệp vụ | Gọi `app.registerProviders()` trong callback, rồi dùng `app.container` |
| Chạy toàn bộ vòng đời khởi động | Gọi `await app.start()` trong callback |

`withApp()` tạo ứng dụng, chạy callback rồi dừng ứng dụng và hủy môi trường chạy, kể cả khi callback thất bại. Khi cần provider, đăng ký hoặc khởi động theo bảng trên. Có thể đọc `app.config` và `app.paths` trực tiếp. Chỉ chạy toàn bộ vòng đời khi cần vì bước này có thể khởi động cả trình tiêu thụ hàng đợi và tác vụ theo lịch. Xem [Dịch vụ phía máy chủ](server-business-services.md) để biết cách tổ chức dịch vụ.

Chỉ dùng đối tượng ứng dụng trong callback và trả về dữ liệu thuần. Lỗi dọn dẹp được báo dưới dạng cảnh báo để thao tác đã hoàn tất không bị hiểu nhầm là thất bại và chạy lại.

Lệnh cục bộ truy cập dịch vụ theo cấu hình ứng dụng. Với thao tác gắn với người dùng, xác minh rõ danh tính và phạm vi dữ liệu hoặc cung cấp API HTTP có bảo vệ. Xem [Xác thực, quyền và phạm vi dữ liệu](authentication-and-permissions.md).

<a id="arguments-paths-and-module-loading"></a>

## Đối số, đường dẫn và nạp mô-đun

`AppCommand` dựa trên oclif. Khai báo đối số vị trí bằng `Args` và tùy chọn bằng `Flags`. Mô tả từng đối số và dùng `summary`, `examples` để giải thích cách dùng lệnh. `pnpm nocobase commands --json` cho phép người dùng và agent tra thông tin này.

Dùng `appPath()` cho tùy chọn đường dẫn. Đường dẫn tương đối do người dùng nhập tính từ thư mục làm việc hiện tại. Đường dẫn mặc định đã khai báo tính từ thư mục gốc ứng dụng. Lệnh nhận đường dẫn tuyệt đối. Ví dụ tính mặc định bằng `app.paths.storage()` vì vùng lưu trữ của bản triển khai có thể nằm ngoài thư mục mã.

Lệnh trợ giúp cũng nạp các mô-đun lệnh. Giới hạn import cấp mô-đun ở `@nocobase/app-cli`, `@oclif/core` và mô-đun tích hợp của Node. Nạp động các dependency nặng hơn trong `run()` và chỉ kết nối cơ sở dữ liệu hoặc bắt đầu công việc từ đó.

<a id="output-errors-and-logs"></a>

## Đầu ra, lỗi và log

`AppCommand` cung cấp sẵn `--json`. Trả về dữ liệu thuần có kiểu khi thành công và ném `CommandError` khi thất bại.

| Mục đích | API | Khi dùng `--json` |
| --- | --- | --- |
| Kết quả để người đọc | `this.log(text)` | Ẩn |
| Kết quả để chương trình đọc | `return result` | Nằm trong `result` |
| Tiến độ | `this.logToStderr(text)` | Vẫn ghi vào stderr |
| Cảnh báo | `this.warn(text)` | Nằm trong `warnings` |
| Thất bại | `throw new CommandError(...)` | `ok: false`, có `error.code` và mã thoát khác 0 |

Dùng mã lỗi chữ hoa ổn định, `suggestions` chỉ rõ cách xử lý và `details` dưới dạng dữ liệu thuần. Mã thoát mặc định khi lỗi là `1`. Dùng `2` khi cách gọi không hợp lệ. Khi gợi ý một lệnh khác của framework, `this.cliCommand(['db', 'apply'])` tạo cú pháp đúng cho mã nguồn hoặc bản triển khai.

Trạng thái mặc định là `success`. Dùng `success-noop` cho chế độ xem trước hoặc khi không có việc cần làm. Dùng `partial-success` khi còn việc dang dở và mô tả phần đó. Giữ thông tin xác thực và nội dung xuất đầy đủ bên ngoài kết quả.

Tránh `console.log()`, ghi JSON thủ công, `process.exit()`, `this.exit()`, `this.logJson()` và `this.error()` vì chúng làm sai định dạng đầu ra hoặc quy tắc thoát. `CommandError` ẩn `cause` theo mặc định. Đặt `NOCOBASE_CLI_DEBUG=1` để xem chuỗi nguyên nhân đã che thông tin nhạy cảm trên stderr. Dùng dịch vụ ghi log của ứng dụng để lưu nhật ký vận hành. Xem [Ghi log](../framework/support/logging.md).

<a id="testing-and-delivery"></a>

## Kiểm thử và bàn giao

Đặt kiểm thử lệnh trong `tests/cli/`. `@nocobase/app-testing/cli` xuất `bindAppCommand()` và `runAppCommand()`. Gắn lệnh với thư mục kiểm thử cô lập và ID như `app:statuses:export`, rồi chạy để xem kết quả, JSON, stdout, stderr và mã thoát. Truyền `loadRuntime` và `createApp` để thay thế dịch vụ khi kiểm thử.

Để kiểm tra với ứng dụng và cơ sở dữ liệu thực, dùng `createTestAppConfig()` và `bindTestAppCommand()` từ cùng điểm vào. Làm theo [ví dụ kiểm thử lệnh cơ sở dữ liệu](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/app/app-skills/skills/nocobase-app-development/references/testing/cli/command.md) để chuẩn bị migration và Seed, rồi gọi `config.dispose()`. Nếu dùng trình nạp môi trường chạy tùy chỉnh, trình nạp phải tự gắn cấu hình kiểm thử và cô lập vùng lưu trữ.

Kiểm tra xuất thành công và nội dung tệp, chạy thử không sinh tệp, danh mục rỗng trả về `success-noop`, tệp đã có được bảo toàn khi báo `OUTPUT_EXISTS` và tài nguyên được dọn sau lỗi đọc hoặc ghi. Chạy tuần tự các bài kiểm thử thu đầu ra của tiến trình.

```bash
pnpm lint
pnpm typecheck
pnpm nocobase commands --json
pnpm build
node dist/cli/index.js app statuses export --help
node dist/cli/index.js app statuses export --dry-run --json
```

Chạy bộ kiểm thử CLI của dự án trước các bước trên. Chạy thử trên bản triển khai vẫn đọc cơ sở dữ liệu do cấu hình triển khai chọn, nên dùng môi trường đã chuẩn bị để kiểm tra. Sau khi xem trợ giúp, chạy thử để xác nhận lệnh truy cập được cơ sở dữ liệu.

Hướng dẫn dựa trên [Tham chiếu viết lệnh ứng dụng](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/app/app-skills/skills/nocobase-app-development/references/commands.md). Xem [Môi trường chạy CLI](../framework/runtime/cli.md) về cơ chế dùng chung và [Tham chiếu dòng lệnh](../reference/cli.md) về lệnh có sẵn.
