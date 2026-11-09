---
title: Quy ước thư mục và tệp
description: Tra điểm vào của ứng dụng, plugin và tài nguyên mã nguồn UI, cùng thư mục tùy chọn, tệp tự sinh và bên duy trì.
---

Đọc [Cấu trúc dự án](../developing-apps/project-structure.md) để nắm tổng quan. Bài tham chiếu này giải thích trách nhiệm và quy tắc bảo trì của từng đường dẫn. Tên tệp minh họa quy ước. Chọn thư mục tùy theo template và tính năng.

## Thư mục ứng dụng

```tree
my-app/
├── .agents/
│   ├── rules/                    # Project-owned rules
│   └── skills/                   # Synchronized dependency Skills (generated)
├── cli/
│   ├── commands/                 # App commands (optional)
│   └── plugins.ts                # CLI plugin registration
├── client/
│   ├── pages/                    # Business pages
│   ├── layouts/                  # Page layouts
│   ├── components/               # UI components
│   ├── hooks/                    # Shared interaction and state logic
│   ├── locales/                  # Translations
│   ├── theme/                    # Theme and styles
│   ├── routes.ts                 # Routes, menus and navigation
│   ├── plugins.ts                # Client plugin registration
│   └── runtime.ts                # Client assembly
├── database/
│   └── main/
│       ├── migrations/           # Schema and metadata changes
│       ├── seeds/                # Initial data
│       ├── metadata/             # External-connection metadata (optional)
│       └── collections/          # Resolved model snapshots (generated)
├── packages/                     # Workspace packages (optional)
├── public/                       # Static assets
├── server/
│   ├── routes/                   # HTTP routes and index.ts registration
│   ├── services/                 # Business implementations (optional)
│   ├── providers/                # Service registration and lifecycle
│   ├── config/                   # Defaults, validation and environment mappings
│   ├── plugins.ts                # Server plugin registration
│   └── runtime.ts                # Server assembly
├── tests/                        # Tests, fixtures and helpers
├── storage/                      # Runtime data (generated)
├── dist/                         # Build output (generated)
├── node_modules/                 # Installed dependencies (generated)
├── AGENTS.md                     # Project guidance entry
├── config.example.yml            # Configuration example
├── config.yml                    # Local/deployment configuration
├── components.json               # shadcn configuration
├── package.json                  # Scripts, dependencies and app metadata
├── pnpm-lock.yaml                # Resolved dependency versions
└── pnpm-workspace.yaml           # Workspace package directories
```

Tạo thư mục dịch vụ, lệnh, package cục bộ và metadata cơ sở dữ liệu ngoài khi cần. Layout, theme và điểm vào runtime thuộc mã nguồn ứng dụng. Giữ tùy chỉnh nghiệp vụ trong các tệp đó khi nâng cấp.

## Triển khai và đăng ký

| Nội dung | Nơi triển khai | Nơi tích hợp |
| --- | --- | --- |
| Trang | `client/pages/` | `client/routes.ts` |
| Component và Hook | `client/components/`, `client/hooks/` | Import từ trang, layout hoặc component |
| HTTP API | `server/routes/` | `server/routes/index.ts` và khai báo route của runtime |
| Dịch vụ nghiệp vụ | Thư mục `services/` tùy chọn ở client hoặc server | ServiceProvider và tệp tổng hợp Provider của mỗi phía |
| Cấu hình runtime | `server/config/<section>.ts` | `server/config/index.ts` |
| Lệnh ứng dụng | `cli/commands/` | Nạp theo đường dẫn tệp dưới namespace `app` |
| Plugin | Package đã cài hoặc `packages/app-plugin-<name>/` | Đăng ký các điểm vào được cung cấp trong `client/plugins.ts`, `server/plugins.ts` và `cli/plugins.ts` |

`runtime.ts` lắp ghép runtime. Nếu template đã kết nối điểm tổng hợp, khi thêm mã nghiệp vụ thường chỉ cần cập nhật điểm đó. Cài dependency và đăng ký plugin là các bước riêng. Xem [Quản lý plugin](../developing-apps/manage-plugins.md).

## Tài nguyên cơ sở dữ liệu

Ứng dụng tổ chức tài nguyên theo kết nối trong `database/<connection>/`. Đặt tệp dưới thư mục của kết nối thực sự sử dụng.

- `migrations/` chứa lịch sử thay đổi có thể thực thi. Giữ migration đã chạy và thêm migration mới cho thay đổi sau.
- `seeds/` chứa dữ liệu khởi tạo. Tách dữ liệu bắt buộc khỏi dữ liệu mẫu.
- `metadata/` có thể lưu tiêu đề, mô tả và quan hệ của cơ sở dữ liệu ngoài trong mã nguồn.
- `collections/` chứa snapshot tự sinh để kiểm tra. Dùng `pnpm nocobase collections generate` để tạo lại. Đặt thay đổi schema trong migration.

Plugin đóng góp `database/migrations/` và `database/seeds/` qua khai báo. Xem [Tài nguyên cơ sở dữ liệu và migration của plugin](../extension-development/database-and-migrations.md) để biết đường dẫn và kết nối sở hữu.

<h2 id="local-plugins-shared-packages-and-ui-assets">Plugin cục bộ, package dùng chung và tài nguyên UI</h2>

```tree
packages/
├── app-plugin-orders/            # Runtime plugin
│   ├── client/
│   │   ├── components/
│   │   ├── react-providers/      # React context integration
│   │   ├── providers/            # Client ServiceProviders
│   │   ├── plugin.ts
│   │   └── index.ts              # Public Client entry
│   ├── server/
│   │   ├── services/
│   │   ├── providers/            # Server ServiceProviders
│   │   ├── tokens.ts             # Public service contracts
│   │   ├── plugin.ts
│   │   └── index.ts              # Public Server entry
│   ├── cli/
│   ├── database/
│   ├── skills/
│   ├── tests/
│   ├── AGENTS.md
│   └── package.json
├── orders-ui/                    # Independent UI Registry package
│   ├── registry/
│   ├── registry.json
│   ├── public/r/                 # Built item JSON (generated)
│   └── package.json
└── shared-domain/                # Internal shared code (optional)
    └── package.json
```

Plugin cung cấp Client, Server, CLI, cơ sở dữ liệu và Skill theo nhu cầu. Chọn thư mục phù hợp với đóng góp thực tế. Xem [Cấu trúc plugin](../extension-development/plugin-structure.md).

Ứng dụng và plugin có thể tự tổ chức component frontend. Dùng shadcn cho thành phần cơ bản và tra NocoBase UI Library khi lắp ghép giao diện theo mô-đun. Nếu phân phối mã có thể chỉnh sửa cho Agent, duy trì tài nguyên trong package Registry độc lập. Khi các tệp được phân phối cùng nhau, giữ vị trí tương đối để import tiếp tục phân giải sau khi cài. Dùng điểm vào package công khai hoặc dữ liệu do bên sử dụng truyền để kết nối năng lực plugin.

## Bên duy trì hướng dẫn Agent

| Đường dẫn | Người dùng và bên duy trì |
| --- | --- |
| `AGENTS.md` và `.agents/rules/` của ứng dụng | Dành cho Agent bảo trì ứng dụng. Ứng dụng duy trì nội dung |
| `AGENTS.md` của plugin | Dành cho Agent bảo trì nguồn plugin. Plugin duy trì nội dung |
| `skills/<name>/SKILL.md` của plugin | Dành cho Agent sử dụng plugin trong ứng dụng. Phân phối cùng plugin |
| `.agents/skills/` của ứng dụng | Bản sao đồng bộ từ dependency. Cập nhật package nguồn rồi đồng bộ lại |

`pnpm nocobase skills sync` làm mới hướng dẫn do dependency cung cấp. Xem [Skill của plugin](../extension-development/write-plugin-skills.md).

## Tệp tự sinh và cấu hình

- `dist/` chứa sản phẩm build có thể tạo lại. Chỉnh mã nguồn rồi build lại.
- `node_modules/` chứa dependency. Cập nhật bằng trình quản lý package và lockfile.
- `storage/` có thể chứa cơ sở dữ liệu, tệp tải lên và dữ liệu nghiệp vụ khác. Bảo toàn theo cấu hình lưu trữ.
- `config.example.yml` là cấu hình mẫu được commit với thông tin xác thực minh họa.
- `config.yml` là cấu hình riêng từng môi trường. Giữ khóa và mật khẩu thật ngoài Git.
- `pnpm-lock.yaml` được commit để tái tạo bản cài.

Bài tham chiếu dựa trên template và khai báo plugin ở Core `015404ecd0db` cùng ứng dụng mặc định beta.83 đã kiểm chứng. Xem [Tham chiếu cấu hình](configuration.md) và [Danh mục package Core](packages.md).
