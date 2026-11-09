---
title: Lệnh nb-studio
description: nb-studio là dòng lệnh của Studio, làm ra chủ yếu cho Agent của bạn, như Claude Code hay Codex. Khi đã cài, chúng có thể tra cứu dự án, tạo issue, theo dõi tiến độ và cấu hình Studio cho bạn. Script và CI cũng dùng nó.
---

CLI không có sẵn lệnh nghiệp vụ nào. Sau khi bạn đăng nhập, nó hỏi Studio xem bạn được dùng những lệnh nào, nên các lệnh luôn khớp với phiên bản Studio và quyền của bạn.

## Cài đặt và đăng nhập

Cách dễ nhất: trong menu tài khoản ở góc trên bên phải của Studio, bấm **Use Studio in your agent** và đưa hướng dẫn thiết lập trong **Connect a local Coding Agent** cho Agent của bạn. Nó sẽ cài `nb-studio`, nhờ bạn duyệt đăng nhập trên trình duyệt, và cài Skill. Xem [Dùng Studio từ coding agent trên máy bạn](../join/local-agent.md).

Để tự cài, bạn cần Node.js 24 trở lên:

```bash
curl -fsSL https://studio.example.com/main/api/agents/dist/installScript | sh -s -- --token <download credential>
nb-studio login --server https://studio.example.com/main
```

Thông tin xác thực để tải nằm trong hướng dẫn thiết lập đó và có hiệu lực 30 phút. `nb-studio login` hiển thị một mã và mở trang duyệt. Kiểm tra mã rồi bấm **Approve**. Một lần đăng nhập kéo dài 7 ngày và tự gia hạn miễn là bạn còn dùng.

| Lệnh | Tác dụng |
| --- | --- |
| `nb-studio login --server <address>` | Đăng nhập. Trên máy không có trình duyệt, thêm `--no-browser` và mở địa chỉ ở nơi khác để duyệt |
| `nb-studio login --server <address> --api-key-stdin` | Đăng nhập bằng API key của bạn, đọc từ đầu vào chuẩn |
| `nb-studio whoami` | Cho biết bạn đang đăng nhập với tư cách ai, server nào và quyền của bạn |
| `nb-studio skills install` | Cài Skill `nb-studio-cli` cho Claude Code và Codex |
| `nb-studio docs` | Liệt kê các lệnh hiện có và cách dùng |
| `nb-studio update` | Cập nhật lên phiên bản Studio cung cấp, cùng Skill |
| `nb-studio logout` | Đăng xuất |

Khi dùng nhiều Studio, mỗi server là một profile: `nb-studio profile list` và `nb-studio profile use <name>`. Trong CI, bỏ qua đăng nhập và dùng các biến môi trường `NB_STUDIO_SERVER` và `NB_STUDIO_API_KEY`.

## Tìm lệnh

- `nb-studio docs` liệt kê các lệnh hiện có, và `nb-studio <command> --help` hiển thị tùy chọn của một lệnh.
- Thêm `--json` để có đầu ra máy đọc được, phù hợp cho script và Agent.
- Khi bạn thiếu quyền, lệnh sẽ nói nó cần quyền nào thay vì báo lệnh không tồn tại. `nb-studio whoami --missing` liệt kê các lệnh bạn thiếu quyền.

## Các nhóm lệnh chính

| Nhóm | Bao gồm |
| --- | --- |
| `issue`, `comment`, `attachment` | Issue: tìm, xem, tạo, cập nhật trạng thái, bình luận, tệp đính kèm |
| `project`, `label` | Dự án, việc khởi tạo và thành viên của dự án, và nhãn |
| `project-manager` | Cài đặt của Agent điều phối, và giao một issue cho Agent điều phối để bắt đầu |
| `agent`, `runtime`, `skill`, `variable` | Agent, runtime và thông tin xác thực đăng ký, Skill, biến và khóa bí mật |
| `run`, `report` | Lượt chạy, số liệu dashboard và mức sử dụng |
| `kb`, `memory` | Cơ sở tri thức và bộ nhớ dự án |
| `git`, `pr`, `commit` | Kết nối Git, repository, ủy quyền cá nhân và PR |
| `preview`, `app`, `deploy`, `env`, `release`, `build`, `registry` | Preview, ứng dụng, triển khai và yêu cầu triển khai, môi trường triển khai, bản phát hành, CI và registry |
| `inbox`, `follow-up` | Hộp thư và các issue đang theo dõi |
| `session`, `conversation` | Phiên |
| `user`, `access`, `api-key` | Tài khoản và lời mời, vai trò và API key |

## Những việc chỉ trang web làm được

Không có lệnh cho các việc sau. Khi một Agent gặp một trong số đó, Skill `nb-studio-cli` sẽ cho nó biết chỗ nào trên trang web để nhờ bạn làm:

| Việc | Ở đâu |
| --- | --- |
| Duyệt `nb-studio login` | Trang duyệt mà lệnh mở ra |
| Đăng nhập, đặt lại mật khẩu và nhận lời mời | Trang đăng nhập và đường dẫn mời |
| Thêm kết nối GitHub App | **Settings › Integrations › Git** |
| Đổi mật khẩu của chính bạn | **Account settings › Account and security** |
| Ngôn ngữ, giao diện và âm thanh nhắc | **Account settings › Preferences** |

Ngoài ra, chỉ con người mới nghiệm thu issue, merge PR và duyệt yêu cầu triển khai. Lượt chạy của Agent không làm được những việc này.
