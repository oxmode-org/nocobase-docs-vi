---
title: Cấu trúc dự án
description: Xác định vị trí các trang, API, migration, bài kiểm thử và plugin trong ứng dụng.
---

## Tổng quan thư mục

Sau khi [tạo ứng dụng](../../getting-started/develop-your-first-app.md#create-and-start-the-application), bạn có thể chỉnh sửa mã nguồn trực tiếp. Cây dưới đây mô tả những vị trí thường dùng trong template mặc định. Cấu hình cục bộ, dependency đã cài và sản phẩm build xuất hiện sau từng bước thiết lập tương ứng.

```text
my-app/
├── client/              # Trang, component và logic client
├── server/              # API và dịch vụ nghiệp vụ
├── database/            # Migration và seed theo từng kết nối
├── cli/                 # Lệnh ứng dụng và plugin CLI
├── tests/               # Bài kiểm thử và tiện ích kiểm thử
├── public/              # Tài nguyên tĩnh
├── packages/            # Package cục bộ trong workspace (tùy chọn)
├── .agents/
│   ├── rules/           # Quy tắc Agent do dự án quản lý
│   └── skills/          # Skill đồng bộ từ dependency (tự sinh)
├── AGENTS.md            # Điểm vào hướng dẫn cho Agent
├── config.example.yml   # Cấu hình mẫu
├── config.yml           # Cấu hình cục bộ (sinh trong quá trình thiết lập)
├── package.json         # Script và dependency
├── pnpm-lock.yaml       # Phiên bản dependency đã phân giải
├── pnpm-workspace.yaml  # Cấu hình workspace
├── node_modules/        # Dependency đã cài (tự sinh)
├── dist/                # Sản phẩm build (tự sinh)
└── storage/             # Dữ liệu khi chạy
```

Cấu trúc thư mục phụ thuộc phiên bản template và tính năng của ứng dụng. Tạo thư mục tùy chọn như `packages/` khi có nhu cầu sử dụng.

## Vị trí của trang, API và dữ liệu

| Thay đổi | Vị trí chính | Cách kết nối với ứng dụng |
| --- | --- | --- |
| Thêm trang hoặc mục menu | `client/pages/` | Đăng ký route và điều hướng trong `client/routes.ts` |
| Tái sử dụng component hoặc logic tương tác | `client/components/`, `client/hooks/` | Import từ trang hoặc component khác |
| Đổi layout, theme hoặc chữ trên giao diện | `client/layouts/`, `client/theme/`, `client/locales/` | Sửa layout, theme hoặc tài nguyên ngôn ngữ tương ứng |
| Thêm tài nguyên tĩnh như hình ảnh | `public/` | Dùng URL tài nguyên trong trang hoặc stylesheet |
| Thêm HTTP API | `server/routes/` | Đăng ký trong `server/routes/index.ts` |
| Tách dịch vụ nghiệp vụ | Tạo `server/services/` khi cần | Gọi từ route. Dùng `server/providers/` khi cần đăng ký dịch vụ và quản lý vòng đời |
| Tạo hoặc sửa bảng | `database/main/migrations/` | Thêm migration để ứng dụng thực thi |
| Chuẩn bị dữ liệu ban đầu | `database/main/seeds/` | Thêm logic khởi tạo |
| Thêm lệnh ứng dụng | Tạo `cli/commands/` khi cần | Tuân theo quy ước thư mục lệnh CLI |

Đăng ký trang và API tại các điểm vào tương ứng để ứng dụng có thể truy cập chúng. Mã UI được cài vào `client/extensions/` thuộc ứng dụng và được dùng từ trang hoặc component qua import.

`database/` nhóm tài nguyên theo tên kết nối. Kết nối mặc định là `main`. Giữ các migration đã chạy và thêm migration mới khi cần đổi schema. Xem [Tạo bảng và khởi tạo dữ liệu](data-models-and-migrations.md).

Ví dụ, quản lý khách hàng thường cần migration cho bảng, route API, trang và các tệp đăng ký tương ứng. Xem [Phát triển tính năng đầu tiên](../../getting-started/develop-your-first-app.md#describe-your-first-business-requirement) để thấy cách chúng phối hợp.

## Cấu hình, dependency và plugin

### Tệp cấu hình

| Vị trí | Công dụng |
| --- | --- |
| `config.example.yml` | Cấu hình mẫu để commit, với thông tin xác thực minh họa |
| `config.yml` | Kết nối cơ sở dữ liệu, khóa bí mật và thiết lập riêng của môi trường hiện tại. Để tệp này ngoài Git |
| `server/config/` | Giá trị mặc định, kiểm tra hợp lệ và ánh xạ biến môi trường được định nghĩa trong mã |

Sửa `config.yml` để đổi thông tin kết nối của môi trường hiện tại. Khi thêm tùy chọn cho logic nghiệp vụ, cập nhật định nghĩa trong `server/config/`. Xem [Cấu hình ứng dụng](configuration-and-settings.md) để biết cách nạp cấu hình và các lệnh liên quan.

### Dependency và đăng ký plugin

`package.json` chứa script phát triển, kiểm thử và build, cùng các khai báo dependency. Đưa `pnpm-lock.yaml` vào quản lý phiên bản để lưu các phiên bản dependency đã phân giải.

Template cung cấp các năng lực như người dùng, xác thực, phân quyền và tệp qua plugin. Xem `package.json` để biết package đã cài và các tệp sau để biết plugin đã được kết nối:

| Tệp | Nội dung đăng ký |
| --- | --- |
| `client/plugins.ts` | Plugin client |
| `server/plugins.ts` | Plugin server |
| `cli/plugins.ts` | Plugin CLI |

Plugin có thể cung cấp một số điểm vào trong bảng. Một số package chỉ cung cấp Skill phát triển. Cài dependency, đăng ký plugin và tích hợp trang là ba bước riêng. Xem [Quản lý plugin](manage-plugins.md) và [Danh mục plugin](../reference/plugins.md).

Đặt plugin cục bộ hoặc package dùng chung trong `packages/` và cấu hình thư mục package của workspace trong `pnpm-workspace.yaml`. Có thể duy trì package UI Registry tại đó khi cần phân phối mã nguồn UI độc lập. Xem [Quy ước thư mục và tệp dự án](../reference/project-conventions.md#local-plugins-shared-packages-and-ui-assets).

## Vị trí bài kiểm thử

Các bài kiểm thử nằm trong `tests/` và được nhóm theo phần mã cần kiểm chứng.

| Thư mục | Nội dung |
| --- | --- |
| `tests/client/` | Trang, component và logic client |
| `tests/server/` | API, dịch vụ và phân quyền |
| `tests/database/` | Migration, dữ liệu khởi tạo và hành vi cơ sở dữ liệu |
| `tests/cli/` | Lệnh ứng dụng, tạo khi cần |
| `tests/project/` | Cấu hình dự án và bản build |
| `tests/fixtures/`, `tests/helpers/`, `tests/setup/` | Dữ liệu mẫu, tiện ích dùng chung và thiết lập kiểm thử |
| `tests/playwright/` | Kiểm thử tương tác trên trình duyệt, tạo khi cần |

Chạy `pnpm test` từ thư mục gốc để kiểm thử bằng Vitest. Kiểm thử trình duyệt dùng `pnpm test:e2e` và cần ứng dụng đang chạy cùng thông tin đăng nhập theo cấu hình. Xem [Kiểm thử](testing-and-acceptance.md).

Dự án hiện có có thể dùng thư mục khác. Làm theo `vitest.config.ts` và `playwright.config.ts` của dự án. Kiểm tra số bài kiểm thử thực sự chạy trong báo cáo để xác nhận tính năng đã được kiểm chứng.

## Hướng dẫn Agent đọc

`AGENTS.md` là điểm vào hướng dẫn phát triển ứng dụng. Dự án tự quản lý quy ước, còn dependency cung cấp các Skill được đồng bộ.

| Vị trí | Cách duy trì |
| --- | --- |
| `AGENTS.md`, `.agents/rules/` | Duy trì quy ước phát triển và commit cùng mã nguồn |
| `.agents/skills/` | Đồng bộ từ dependency. Chỉnh sửa ở nguồn cung cấp Skill và để bản sao đồng bộ ngoài Git |

Thêm quy ước nghiệp vụ theo [Tiếp tục phát triển ứng dụng](../../getting-started/develop-your-first-app.md#refine-and-continue-developing). Chạy `pnpm nocobase skills sync` trong thư mục ứng dụng để cập nhật Skill từ dependency. Xem [Tham chiếu CLI](../reference/cli.md#plugins-and-skills).

## Tệp tự sinh và dữ liệu khi chạy

| Vị trí | Cách quản lý |
| --- | --- |
| `node_modules/` | Cài và cập nhật qua trình quản lý package |
| `dist/` | Sinh bằng `pnpm build`. Sửa mã nguồn rồi build lại |
| `database/<connection>/collections/` | Snapshot cấu trúc cơ sở dữ liệu. Cập nhật bằng `pnpm nocobase collections generate` |
| `storage/` | Dữ liệu khi chạy có thể gồm tệp tải lên, log hoặc tệp cơ sở dữ liệu. Bảo toàn và sao lưu theo cấu hình |

Cấu hình kết nối xác định vị trí tệp SQLite, có thể ở thư mục gốc ứng dụng. Hãy bảo toàn tệp cơ sở dữ liệu và dữ liệu nghiệp vụ trong `storage/` khi dọn bộ nhớ đệm. Xem [Quy ước thư mục và tệp dự án](../reference/project-conventions.md).
