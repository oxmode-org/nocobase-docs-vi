---
title: Lệnh nb-studio
description: Cài CLI của Studio và tra các lệnh do máy chủ cung cấp.
---

`nb-studio` cho phép agent lập trình cục bộ, script và CI gọi Studio. Các lệnh nghiệp vụ do máy chủ đang kết nối cung cấp, tùy phiên bản và danh tính bên gọi.

Để đăng ký runner, xem log, cập nhật hoặc gỡ cài đặt, xem [Lệnh nocobase-runner](../reference/runner.md).

<a id="install-and-sign-in"></a>

## Cài đặt và đăng nhập

Mở **Use Studio in your agent** từ menu tài khoản rồi chuyển hướng dẫn thiết lập cho agent lập trình cục bộ. Xem [Dùng agent cục bộ](../join/local-agent.md). Cần Node.js 24 trở lên.

Sau khi cài, đăng nhập bằng địa chỉ có `/main`:

```bash
nb-studio login --server https://studio.example.com/main
nb-studio whoami
nb-studio skills install
```

Giữ lệnh đăng nhập chạy trong khi kiểm tra và duyệt mã trong trình duyệt. Trên máy không có trình duyệt, thêm `--no-browser` rồi mở URL cấp quyền trên thiết bị khác.

<a id="discover-commands"></a>

## Tra lệnh

```bash
nb-studio docs
nb-studio issue --help
nb-studio whoami --missing
```

Dùng `docs` để xem các lệnh hiện có và `--help` để tra đối số. `whoami --missing` nhóm các lệnh chưa dùng được theo quyền còn thiếu. Thêm `--json` để lấy đầu ra có cấu trúc.

| Nhóm | Mục đích |
| --- | --- |
| `issue`, `comment`, `attachment` | Đầu việc, thảo luận và tệp đính kèm |
| `project`, `label` | Dự án, thành viên dự án và nhãn |
| `project-manager`, `agent`, `runtime` | Phân công, agent và môi trường chạy |
| `skill`, `variable`, `run` | Skill, biến và lịch sử thực thi |
| `kb`, `memory` | Kho tri thức và bộ nhớ dự án |
| `git`, `pr`, `commit` | Kho mã, PR và kiểm tra |
| `quality` | Kế hoạch chất lượng đã bật và công việc tiếp theo |
| `app`, `deploy`, `env`, `release`, `build` | Ứng dụng, môi trường, gói đầu ra và bàn giao |
| `session`, `conversation` | Phiên cục bộ và cuộc trò chuyện Runner |
| `user`, `access`, `api-key` | Thao tác quản trị được cấp quyền |

<a id="use-multiple-servers"></a>

## Dùng nhiều máy chủ

```bash
nb-studio profile list
nb-studio profile use <profile-name>
nb-studio logout
```

Script và CI có thể dùng `NB_STUDIO_SERVER` và `NB_STUDIO_API_KEY` để xác thực trực tiếp. Lưu khóa trong trình quản lý secret của CI. Xem [Khóa API](../admin/api-keys.md).

<a id="update"></a>

## Cập nhật CLI

```bash
nb-studio update --check
nb-studio update
```

Bản cập nhật đến từ Studio đang kết nối và đồng thời đồng bộ các Skill đã cài. Phê duyệt đăng nhập CLI và cấp quyền nền tảng Git vẫn thực hiện trên trang web tương ứng. Quyền nghiệm thu và hợp nhất PR dành cho người dùng.
