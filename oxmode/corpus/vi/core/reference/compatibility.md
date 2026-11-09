---
title: Hỗ trợ cơ sở dữ liệu và tương thích phiên bản
description: Tra cơ sở dữ liệu, driver, thiết lập kết nối, phiên bản kiểm thử và yêu cầu khi nâng cấp hoặc triển khai.
---

<h2 id="supported-databases">Cơ sở dữ liệu được hỗ trợ</h2>

NocoBase cung cấp tám dialect. Giá trị `dialect` trong cấu hình kết nối chọn driver. MariaDB dùng chung dialect `mysql` với MySQL.

### Driver mã nguồn mở

| Cơ sở dữ liệu | Package driver | `dialect` |
| --- | --- | --- |
| SQLite | `@nocobase/db-sqlite` | `sqlite` |
| PostgreSQL | `@nocobase/db-postgres` | `postgres` |
| MySQL, MariaDB | `@nocobase/db-mysql` | `mysql` |
| Microsoft SQL Server | `@nocobase/db-mssql` | `mssql` |
| Oracle Database | `@nocobase/db-oracle` | `oracle` |

Template mặc định dùng SQLite để phát triển cục bộ. Với hệ khác, chuẩn bị server, cơ sở dữ liệu và tài khoản có thể truy cập, rồi cài driver tương ứng.

<h3 id="commercial-database-drivers">Driver thương mại</h3>

| Cơ sở dữ liệu | Package driver | `dialect` | Yêu cầu |
| --- | --- | --- | --- |
| Dameng | `@nocobase/db-dameng` | `dameng` | Driver thử nghiệm. Kiểm chứng trên phiên bản đích |
| KingbaseES | `@nocobase/db-kingbase` | `kingbase` | Chế độ tương thích PostgreSQL, `DB_MODE=pg` |
| OceanBase CE | `@nocobase/db-oceanbase` | `oceanbase` | Tenant tương thích MySQL |

Ba driver này thuộc NocoBase Pro và cần giấy phép phù hợp. Lấy URL registry riêng, thông tin tài khoản và token đọc có quyền tải `nbr_…` từ bên cấp phép. Thay URL trong lệnh sau và nhập token ở trường mật khẩu khi được hỏi.

```bash
pnpm login --registry="<nocobase-pro-registry-url>" --scope=@nocobase
```

Lệnh ánh xạ scope `@nocobase` tới registry Pro trong cấu hình cấp người dùng. Registry cũng chuyển tiếp package công khai của NocoBase. Dependency khác tiếp tục dùng registry hiện có. Giữ token ngoài tài liệu, đối số dòng lệnh và Git.

## Cấu hình cơ sở dữ liệu ứng dụng

Xem [Tạo ứng dụng với cơ sở dữ liệu khác](database-configuration.md) để lấy ví dụ từng hệ. Có thể dùng kết nối từ server cục bộ, server riêng hoặc cơ sở dữ liệu đám mây.

### Cài driver và khởi tạo cấu hình

Làm việc trong thư mục do bước [Tạo ứng dụng](../../getting-started/develop-your-first-app.md#create-and-start-the-application) sinh ra. Ví dụ dùng PostgreSQL khi ứng dụng chưa có `config.yml`. Chuẩn bị server, cơ sở dữ liệu và tài khoản rồi chạy:

```bash
pnpm add @nocobase/db-postgres@beta
pnpm nocobase config init --dialect postgres --json
```

Lệnh tạo `config.yml` và khóa bí mật mà chưa kết nối. Điền host, cổng, tên cơ sở dữ liệu, tên người dùng, mật khẩu và TLS trước khi kết nối. Với hệ khác, thay tên package và `--dialect`. Cài driver và chuẩn bị server hoặc tài khoản là các bước riêng. Xem [Ví dụ cấu hình](database-configuration.md).

Giữ `config.yml` ngoài Git vì có thể chứa thông tin bí mật. Có thể dùng [lệnh cấu hình](cli.md) để đặt thông số. Sau đó kiểm tra kết nối:

```bash
pnpm nocobase config check
```

Khi đạt, terminal báo kết nối. Khi lỗi, lệnh báo thiết lập liên quan và cách xử lý. Mặc định lệnh thử kết nối các hệ ngoài SQLite. Thêm `--connect` để kiểm tra cả SQLite hoặc `--no-connect` để chỉ kiểm tra cấu hình. Chạy migration ở bước riêng.

Nếu đã có `config.yml`, sửa thiết lập cần thiết và giữ khóa bí mật hiện có. Khi đổi dialect, lập kế hoạch chuyển dữ liệu riêng.

### Thông số theo hệ cơ sở dữ liệu

Kết nối nằm trong `database.connections.<name>`. `database.default` chọn kết nối mặc định, là `main` trong template mặc định. Trường kết nối mạng thường gồm `host`, `port`, `database`, `username` và `password`.

| Cơ sở dữ liệu | Chi tiết cấu hình |
| --- | --- |
| SQLite | Cấu hình sinh ra dùng `database` làm đường dẫn tệp. Muốn dùng `filename` hoặc `DB_FILENAME`, bỏ `database` và kiểm tra ghi đè `DB_DATABASE`. Nếu cả hai có mặt, `database` được ưu tiên. Đường dẫn tương đối tính dưới `storage/` |
| PostgreSQL, KingbaseES | Đặt `schema` và `ssl` khi cần |
| MySQL, MariaDB, OceanBase | Dùng `database` cho tên cơ sở dữ liệu và `username` cho người dùng |
| Microsoft SQL Server | Đặt `encrypt` và `trustServerCertificate` theo cấu hình chứng chỉ server |
| Oracle | Dùng `serviceName` để chọn dịch vụ |
| Dameng | Dùng `schema` để chọn schema. Khởi tạo không sinh trường `database` |

Biến môi trường có thể ghi đè thiết lập tệp. Xem [Tham chiếu cấu hình](configuration.md) để biết thứ tự ưu tiên, [Nhiều kết nối cơ sở dữ liệu](../developing-apps/multiple-databases.md) để thêm kết nối và [Kết nối cơ sở dữ liệu có sẵn](../developing-apps/existing-databases.md) để hạn chế thay đổi schema do framework thực hiện.

## Phiên bản và giới hạn tính năng

Bảng ghi phiên bản được cấu hình làm đích kiểm thử tích hợp driver. Để chọn phiên bản triển khai, đối chiếu thêm các tính năng ứng dụng dùng.

| Cơ sở dữ liệu | Đích kiểm thử tích hợp |
| --- | --- |
| PostgreSQL | 16 |
| MySQL | 8.4 |
| MariaDB | 10.11 |
| Microsoft SQL Server | 2022 |
| Oracle Database | Oracle Free 23 |

- **MySQL và MariaDB.** Bộ lọc JSON dùng `JSON_OVERLAPS`, cần MySQL 8.0.17 trở lên hoặc MariaDB 10.9 trở lên. Cú pháp biểu thức của mặc định TEXT cần MySQL 8.0.13 trở lên hoặc MariaDB 10.2.1 trở lên. [Ghi chú driver MySQL](https://github.com/nocobase/nocobase/blob/09646a97a60ce0758b3635454cb483cb3f1a57c3/packages/libs/db-mysql/README.md)
- **OceanBase.** Repository điền mặc định trường TEXT khi tạo bản ghi. Khi chèn SQL trực tiếp, cấp giá trị trường.
- **SQLite.** Mô-đun native phải khớp phiên bản Node.js, hệ điều hành và kiến trúc CPU.

KingbaseES và OceanBase cần chế độ nêu trong [Cơ sở dữ liệu được hỗ trợ](#supported-databases). Kiểm chứng truy vấn, migration và transaction trên hệ đích.

## Phiên bản runtime và package

| Thành phần | Yêu cầu hoặc nơi kiểm tra |
| --- | --- |
| Node.js | 24 trở lên |
| pnpm | Dùng phiên bản trong `packageManager` của `package.json` ứng dụng |
| Template ứng dụng | Kiểm tra `nocobase.defaultTemplateVersion` trong `package.json` |
| Core, driver và plugin | Dùng phiên bản thỏa khoảng dependency và `peerDependencies` của từng package, giữ lockfile |

Package NocoBase có số phiên bản riêng. Tra phiên bản sản phẩm ở template thay vì suy ra từ số major của package. Kiểm tra môi trường và package đã cài:

```bash
node --version
pnpm --version
pnpm list @nocobase/app-client @nocobase/app-server @nocobase/app-cli @nocobase/db --depth 0
```

## Nâng cấp và triển khai khác nền tảng

Trước khi nâng cấp, sao lưu cơ sở dữ liệu, cấu hình runtime và khóa bí mật. Giữ lockfile. Làm theo [Nâng cấp NocoBase Core](../developing-apps/upgrade-nocobase-core.md) để cập nhật template và dependency. Kiểm chứng migration, truy vấn, transaction và quyền trong môi trường cô lập. Chuẩn bị phục hồi dữ liệu riêng khi cần quay về mã cũ.

Khi đổi hệ điều hành hoặc kiến trúc CPU, build lại cho nền tảng đích để có dependency native phù hợp. Cài driver trong dependency production và build lại gói triển khai sau khi thêm driver. Xem [Tham chiếu CLI](cli.md) và [Chọn cách triển khai](../deployment/choose-a-deployment-method.md).
