---
title: Tạo ứng dụng
description: Dùng agent tạo ứng dụng với SQLite, đăng nhập, làm quen với quy ước dự án và tạo commit đầu tiên.
---

Trang này tạo ứng dụng ITAM `itam-lite`. Các bài tiếp theo phát triển trên cùng ứng dụng.

<a id="1-install-the-skill-that-creates-apps"></a>

## 1. Cài Skill tạo ứng dụng

```bash
npx skills@latest add nocobase/skills-v3 --skill nocobase-create-app -g
```

Khi được hỏi, chọn công cụ lập trình đang dùng. Skill này thực hiện bước tạo ứng dụng. Sau đó, dùng các Skill phát triển đi kèm dự án.

<a id="2-have-the-agent-create-the-app"></a>

## 2. Giao agent tạo ứng dụng

Tạo thư mục rỗng `itam-lite`, mở phiên agent lập trình tại đó và gửi prompt yêu cầu tạo ứng dụng bằng SQLite, khởi động rồi báo URL và tài khoản đăng nhập:

```prompt
Create a NocoBase 3 app in the current directory with SQLite as the database. Once it's running, tell me the URL and the sign-in account.
```

Agent kiểm tra phiên bản Node.js và pnpm, tạo dự án, cài dependency, sinh cấu hình rồi khởi động ứng dụng. Agent cung cấp URL, chẳng hạn `http://127.0.0.1:13000/main/`, và tài khoản. Nếu muốn tự tạo hoặc gặp lỗi, xem [Tạo ứng dụng](../getting-started/develop-your-first-app.md#create-and-start-the-application).

Đăng nhập bằng `nocobase` / `admin123` để mở trang chủ.

![Trang chủ sau khi đăng nhập](https://static-docs.nocobase.com/20261030-itam-lite-create-app-home.webp)

<a id="3-four-things-in-the-project"></a>

## 3. Bốn mục cần biết trong dự án

| Vị trí | Nội dung | Bên duy trì |
| --- | --- | --- |
| `AGENTS.md` | Quy tắc và chỉ mục agent đọc trước khi làm việc, gồm vị trí đặt mã và khả năng dùng trực tiếp từ plugin | Người và agent. Giữ nội dung ngắn |
| `.agents/rules/` | Quy ước riêng như quy tắc nghiệp vụ và cách đặt tên | Người và agent. Commit cùng mã |
| `.agents/skills/` | Skill phát triển đồng bộ từ dependency theo phiên bản đã cài | Cơ chế đồng bộ tự động |
| App foundation | Trang **System settings › App foundation** liệt kê các khả năng Core ứng dụng đang dùng | NocoBase |

Mở **App foundation** để xem mô hình dữ liệu, người dùng và tổ chức, phân quyền, thông báo, quy trình và phê duyệt. Khi xây dựng sổ thiết bị, yêu cầu cấp thiết bị, phê duyệt và quyền theo vai trò ở các bài sau, agent dùng trực tiếp những khả năng này.

![Nền tảng ứng dụng](https://static-docs.nocobase.com/20261030-itam-lite-create-app-foundation.webp)

<a id="4-first-commit"></a>

## 4. Tạo commit đầu tiên

Yêu cầu agent khởi tạo kho Git và tạo commit đầu tiên:

```prompt
Initialize a Git repository and make the first commit.
```

`.gitignore` đã loại `config.yml` chứa bí mật, cơ sở dữ liệu SQLite, `node_modules/` và `.agents/skills/`. Từ đây, agent commit sau mỗi bước.

Hoàn tất khi đăng nhập quản trị viên thấy trang chủ và `git log` hiển thị commit đầu tiên.
