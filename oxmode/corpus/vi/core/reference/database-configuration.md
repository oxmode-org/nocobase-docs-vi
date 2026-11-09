---
title: Tạo ứng dụng với cơ sở dữ liệu khác
description: Tạo ứng dụng NocoBase bằng thông số kết nối có sẵn, với ví dụ SQLite, PostgreSQL, MySQL, SQL Server, Oracle và driver thương mại.
---

## Chuẩn bị thông số kết nối

Server cơ sở dữ liệu có thể chạy cục bộ, trên máy riêng hoặc trên đám mây. Chuẩn bị cơ sở dữ liệu hoặc schema rỗng dành riêng cho ứng dụng mới. Tài khoản phải kết nối được, có quyền đọc ghi và tạo hoặc sửa bảng, index cùng đối tượng khác trong phạm vi ứng dụng. Với cơ sở dữ liệu qua mạng, cho phép truy cập từ máy chạy ứng dụng. Có thể dùng server có sẵn hoặc Docker tùy môi trường.

Lấy thông tin sau từ quản trị viên hoặc nhà cung cấp đám mây.

| Thông tin | Công dụng |
| --- | --- |
| Host và cổng | Địa chỉ cơ sở dữ liệu. Với dịch vụ đám mây, dùng endpoint và cổng được cấp |
| Tên cơ sở dữ liệu, schema hoặc tên dịch vụ | Nơi lưu dữ liệu. Trường cần dùng phụ thuộc hệ cơ sở dữ liệu |
| Tên người dùng và mật khẩu | Tài khoản cấp cho ứng dụng |
| Yêu cầu TLS | Có cần mã hóa và chứng chỉ CA riêng hay không |

SQLite dùng tệp cục bộ. Xem [Hỗ trợ cơ sở dữ liệu và tương thích phiên bản](compatibility.md) để tra phiên bản, giới hạn tính năng và giấy phép driver thương mại.

Hướng dẫn này cấu hình cơ sở dữ liệu chính của ứng dụng mới. Khi khởi động, ứng dụng tạo các bảng cần thiết. Để đọc bảng nghiệp vụ đã có, xem [Kết nối cơ sở dữ liệu hiện có](../developing-apps/existing-databases.md). Nếu đang chuyển từ hệ khác, lập kế hoạch di chuyển dữ liệu riêng.

## Tạo dự án ứng dụng

Chuẩn bị Node.js 24 trở lên và pnpm 11. Trên Windows, dùng WSL. Chạy lệnh trong shell POSIX như Bash. Sau khi tạo dự án, chuyển thẳng sang mục cấu hình hệ cơ sở dữ liệu đã chọn.

```bash
PNPM_CONFIG_MINIMUM_RELEASE_AGE=0 pnpm create @nocobase/app@beta my-app --template-tag=beta
cd my-app
```

Công cụ tạo `my-app` và cài dependency. Với bản beta trong ví dụ, `PNPM_CONFIG_MINIMUM_RELEASE_AGE=0` cho phép dùng package mới phát hành riêng cho lệnh tạo này.

## Cài driver và cấu hình cơ sở dữ liệu

Trong `my-app`, chạy lệnh của hệ đã chọn. `config init --json` sinh `config.yml`, khóa bí mật và giá trị kết nối mẫu mà không cần tương tác hoặc kết nối. Điền thông số và TLS thật trước khi kiểm tra kết nối.

Mỗi ví dụ cung cấp phần `database` hoàn chỉnh. Sau khi khởi tạo, điền thông số thực tế vào phần này và giữ khóa bí mật cùng cấu hình khác. Thay `db.example.com`, cổng, `my_app`, tài khoản và mật khẩu theo dịch vụ. Dùng cổng thực tế thay vì mặc định theo ví dụ.

Giữ `config.yml` ngoài Git. Template mặc định nhận biến môi trường tiến trình `DB_PASSWORD` để ghi đè mật khẩu kết nối chính. YAML giữ nguyên chuỗi `${DB_PASSWORD}`, nên đặt biến ở môi trường tiến trình. Xem [Tham chiếu cấu hình](configuration.md) về quy tắc ghi đè.

Nếu đã có `config.yml`, cài driver cần thiết và sửa phần kết nối, giữ khóa bí mật hiện có. Chọn driver tương thích với dependency ứng dụng. Lệnh `@beta` dưới đây dành cho ứng dụng beta mới.

### SQLite

Template mặc định đã có driver SQLite. Khởi tạo trực tiếp.

```bash
mkdir -p storage
pnpm nocobase config init --dialect sqlite --json
```

```yaml
database:
  default: main
  connections:
    main:
      dialect: sqlite
      database: database.sqlite
```

`database` là đường dẫn tệp. `database.sqlite` nằm dưới `storage/` của ứng dụng. Cũng có thể dùng đường dẫn tuyệt đối. Lệnh trên tạo thư mục `storage/` của ví dụ. Nếu đổi vị trí tệp, tạo thư mục cha trước khi kiểm tra và cấp quyền ghi cho tài khoản chạy ứng dụng. Giữ tệp dữ liệu qua các lần triển khai.

### PostgreSQL

Chuẩn bị cơ sở dữ liệu và tài khoản có quyền dùng schema đích.

```bash
pnpm add @nocobase/db-postgres@beta
pnpm nocobase config init --dialect postgres --json
```

```yaml
database:
  default: main
  connections:
    main:
      dialect: postgres
      host: db.example.com
      port: 5432
      database: my_app
      schema: public
      username: app_user
      password: "replace-with-your-password"
      ssl: true
```

`database` là tên cơ sở dữ liệu. Dùng `public` cho `schema` hoặc schema đã được quản trị viên tạo và cấp quyền. Ví dụ bật TLS. Nếu dịch vụ không dùng TLS, đặt `ssl: false`. Với CA riêng, đổi `ssl` thành đối tượng và điền nội dung PEM vào `ssl.ca`.

### MySQL và MariaDB

MySQL và MariaDB dùng chung driver và dialect `mysql`.

```bash
pnpm add @nocobase/db-mysql@beta
pnpm nocobase config init --dialect mysql --json
```

```yaml
database:
  default: main
  connections:
    main:
      dialect: mysql
      host: db.example.com
      port: 3306
      database: my_app
      username: app_user
      password: "replace-with-your-password"
      charset: utf8mb4
      ssl: true
```

Tạo cơ sở dữ liệu trước với bộ ký tự ứng dụng cần. Ví dụ dùng `utf8mb4` và bật TLS. Nếu dịch vụ không dùng TLS, đặt `ssl: false`. Với CA riêng, điền nội dung PEM vào `ssl.ca`. MariaDB vẫn dùng `dialect: mysql`.

### Microsoft SQL Server

Chuẩn bị cơ sở dữ liệu và tài khoản SQL có quyền kết nối, đọc ghi và quản lý schema.

```bash
pnpm add @nocobase/db-mssql@beta
pnpm nocobase config init --dialect mssql --json
```

```yaml
database:
  default: main
  connections:
    main:
      dialect: mssql
      host: db.example.com
      port: 1433
      database: my_app
      username: app_user
      password: "replace-with-your-password"
      encrypt: true
      trustServerCertificate: false
```

`database` là tên cơ sở dữ liệu. Với instance có tên, cung cấp host và cổng TCP truy cập được. Ví dụ mã hóa kết nối và xác minh chứng chỉ server. Nếu server thử cục bộ dùng chứng chỉ tự ký, có thể đặt `trustServerCertificate: true` khi cần bỏ xác minh chứng chỉ. Trong production, dùng chứng chỉ xác minh được.

### Oracle Database

Chuẩn bị tên dịch vụ Oracle và tài khoản ứng dụng có quyền schema cùng hạn mức tablespace phù hợp.

```bash
pnpm add @nocobase/db-oracle@beta
pnpm nocobase config init --dialect oracle --json
```

```yaml
database:
  default: main
  connections:
    main:
      dialect: oracle
      host: db.example.com
      port: 1521
      serviceName: APPPDB
      username: app_user
      password: "replace-with-your-password"
```

Đặt `serviceName` theo tên dịch vụ do quản trị viên cấp, chẳng hạn dịch vụ của PDB đích. Thay `APPPDB` bằng giá trị thực tế. Đối tượng ứng dụng nằm trong schema của tài khoản. Cấu hình theo tên dịch vụ Oracle thay vì SID hoặc trường `database` của MySQL.

### Dameng

Driver Dameng cần giấy phép thương mại NocoBase Pro và quyền registry Pro. Cấu hình xác thực registry trước. Driver đang thử nghiệm, nên kiểm chứng trên phiên bản đích. Xem [Driver thương mại](compatibility.md#commercial-database-drivers) để đăng nhập registry.

```bash
pnpm add @nocobase/db-dameng@beta
pnpm nocobase config init --dialect dameng --json
```

```yaml
database:
  default: main
  connections:
    main:
      dialect: dameng
      host: db.example.com
      port: 5236
      schema: APP_USER
      username: APP_USER
      password: "replace-with-your-password"
```

Đặt `schema` theo tên đã cấp và giữ nguyên chữ hoa, chữ thường. Ví dụ dùng `APP_USER` cho cả tài khoản và schema. Cấu hình khởi tạo dùng trường `schema` cho giá trị này.

### KingbaseES

Xác nhận server dùng chế độ tương thích PostgreSQL `DB_MODE=pg`, rồi chuẩn bị cơ sở dữ liệu và schema. Cần giấy phép NocoBase Pro và xác thực registry Pro. Xem [Driver thương mại](compatibility.md#commercial-database-drivers).

```bash
pnpm add @nocobase/db-kingbase@beta
pnpm nocobase config init --dialect kingbase --json
```

```yaml
database:
  default: main
  connections:
    main:
      dialect: kingbase
      host: db.example.com
      port: 54321
      database: my_app
      schema: public
      username: app_user
      password: "replace-with-your-password"
      ssl: true
```

Đặt `schema` đã được cấp quyền. TLS theo cấu hình PostgreSQL. Ví dụ bật TLS. Nếu không dùng, đặt `ssl: false`. Với CA riêng, điền nội dung PEM vào `ssl.ca`. Trong chế độ tương thích PostgreSQL, vẫn cài driver KingbaseES và dùng `dialect: kingbase`.

### OceanBase

Dùng tenant OceanBase CE tương thích MySQL và chuẩn bị cơ sở dữ liệu cùng tài khoản trong tenant. Cần giấy phép NocoBase Pro và xác thực registry Pro. Xem [Driver thương mại](compatibility.md#commercial-database-drivers).

```bash
pnpm add @nocobase/db-oceanbase@beta
pnpm nocobase config init --dialect oceanbase --json
```

```yaml
database:
  default: main
  connections:
    main:
      dialect: oceanbase
      host: db.example.com
      port: 2881
      database: my_app
      username: app_user
      password: "replace-with-your-password"
      charset: utf8mb4
      ssl: true
```

Dùng host và cổng kết nối thật. Qua proxy, dùng endpoint của proxy. Nhập đầy đủ tên người dùng do quản trị viên cấp, kể cả phần tenant nếu cần. Chọn TLS theo dịch vụ. Ví dụ bật TLS. Dùng `ssl: false` nếu dịch vụ không dùng TLS hoặc `ssl.ca` cho CA riêng. Xem [Hỗ trợ cơ sở dữ liệu và tương thích phiên bản](compatibility.md) về khác biệt như mặc định TEXT.

## Kiểm tra kết nối và khởi động

Lưu `config.yml`, kiểm tra kết nối rồi khởi động khi bước kiểm tra đạt.

```bash
pnpm nocobase config check --connect
pnpm dev
```

`--connect` kiểm tra mọi kết nối, gồm SQLite. Khi thành công, terminal báo kết nối `main`. Nếu lỗi, làm theo hướng dẫn rồi kiểm tra lại. Sau bước này, xác minh migration và chức năng khi khởi động.

Lần khởi động đầu chạy migration đang chờ và khởi tạo dữ liệu bắt buộc. Khi terminal in URL `Local:`, mở địa chỉ đầy đủ gồm đường dẫn ứng dụng, chẳng hạn `/main/`. Làm theo [hướng dẫn đăng nhập](../../getting-started/develop-your-first-app.md#create-and-start-the-application). Khi mở được trang chủ và terminal không báo lỗi khởi tạo, ứng dụng đã chạy. Giữ terminal mở.

## Lỗi kết nối thường gặp

| Triệu chứng | Kiểm tra |
| --- | --- |
| Thiếu driver | Cài package tương ứng trong dự án. Với driver thương mại, kiểm tra giấy phép và xác thực registry. Build lại gói triển khai |
| Hết thời gian hoặc từ chối kết nối | Từ máy ứng dụng, kiểm tra host, cổng, địa chỉ lắng nghe, tường lửa và danh sách địa chỉ được phép |
| Sai tên đăng nhập hoặc mật khẩu | Kiểm tra thông tin xác thực và địa chỉ nguồn được phép. Với OceanBase, kiểm tra thêm tenant và tên đầy đủ |
| Thiếu cơ sở dữ liệu, schema hoặc dịch vụ | Xác nhận cơ sở dữ liệu tồn tại và đã cấp quyền schema. Với Oracle, kiểm tra `serviceName` |
| Lỗi TLS hoặc chứng chỉ | Kiểm tra yêu cầu mã hóa, hostname và CA tin cậy qua trường phù hợp |
| Kết nối đạt nhưng migration khi khởi động lỗi | Xem lỗi migration đầu tiên và quyền tạo hoặc sửa bảng, index. Với Oracle, kiểm tra hạn mức tablespace |
| Sửa tệp nhưng vẫn vào cơ sở dữ liệu cũ | Kiểm tra ghi đè từ `DB_DIALECT`, `DB_HOST`, `DB_PORT`, `DB_DATABASE` hoặc biến khác |
| SQLite không mở được tệp | Kiểm tra đường dẫn, thư mục chứa và quyền ghi của tài khoản ứng dụng |

Nếu ứng dụng đã khởi tạo cơ sở dữ liệu khác, bảo toàn dữ liệu và khóa bí mật rồi lập kế hoạch di chuyển. `config init` chỉ tạo cấu hình, còn dữ liệu cần chuyển theo quy trình riêng.
