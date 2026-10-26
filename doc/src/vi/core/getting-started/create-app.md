---
title: Tạo ứng dụng
description: Tạo, cấu hình và khởi động một ứng dụng NocoBase 3 cùng coding agent hoặc bằng lệnh thủ công.
---

Tạo một ứng dụng NocoBase sẽ cho bạn một dự án mã nguồn để tiếp tục phát triển. Hãy nhờ coding agent tạo hoặc tự chạy lệnh; cả hai cách đều dùng cùng một công cụ tạo ứng dụng.

Hướng dẫn này dùng template mặc định và SQLite. SQLite không cần dịch vụ cơ sở dữ liệu riêng và tiện cho lần chạy cục bộ đầu tiên.

## Điều kiện cần

Kiểm tra rằng đã cài Node.js 24 trở lên và pnpm 11:

```bash
node --version
pnpm --version
```

Trên Windows, hãy dùng WSL. Các lệnh bên dưới giả định một shell POSIX như Bash. Chọn một trong hai cách tạo. Cách dùng Agent cần một coding agent có hỗ trợ Skill.

## Cùng Agent

### 1. Cài Skill tạo ứng dụng

```bash
npx skills@latest add nocobase/skills-v3 --skill nocobase-create-app -g
```

Chọn Agent của bạn khi được hỏi, rồi mở một phiên mới để nó nạp Skill. `nocobase/skills-v3` cung cấp các Skill cho NocoBase 3.

### 2. Mở Agent trong một thư mục trống

```bash
mkdir my-app
cd my-app
```

Mở coding agent trong thư mục đó và gửi:

```text
Hãy tạo một ứng dụng NocoBase 3 để phát triển cục bộ trong thư mục trống này.
Dùng template mặc định và SQLite, theo hướng dẫn tạo ứng dụng.
Hoàn tất cài đặt và kiểm tra, khởi động ứng dụng, rồi cho tôi biết cần mở URL nào và đăng nhập lần đầu thế nào.
```

Agent gọi công cụ tạo ứng dụng, cài dependency, khởi tạo cấu hình và khởi động ứng dụng. Sau đó nó cung cấp URL truy cập và thông tin đăng nhập.

### 3. Mở ứng dụng

Làm theo phần [Mở ứng dụng và đăng nhập](#mở-ứng-dụng-và-đăng-nhập) bên dưới với URL mà Agent cung cấp.

Dự án được tạo có `AGENTS.md` và `.agents/skills/`. Để phát triển tiếp, hãy mở phiên Agent trong thư mục ứng dụng này để nó nạp hướng dẫn riêng của dự án và các Skill khớp phiên bản.

## Không dùng Agent

Tạo thủ công không cần Skill cho Agent. Từ thư mục cha nơi bạn để các dự án, chạy:

```bash
PNPM_CONFIG_MINIMUM_RELEASE_AGE=0 pnpm create @nocobase/app@beta my-app --template-tag=beta
```

Lệnh này tạo `my-app` và cài dependency. `@beta` chọn kênh beta của công cụ tạo ứng dụng NocoBase 3; `--template-tag=beta` chọn kênh beta của template. Biến môi trường cho phép dùng các dependency mới phát hành, chỉ trong lệnh này.

> Dùng một thư mục mới hoặc trống. Tên thư mục phải bắt đầu bằng chữ thường hoặc chữ số và chỉ chứa chữ thường, chữ số, dấu chấm, gạch ngang hoặc gạch dưới. Lệnh không chấp nhận `.` làm tên dự án; nếu bạn đang ở trong một thư mục `my-app` trống, hãy quay về thư mục cha trước khi chạy.

### 1. Khởi tạo cấu hình

```bash
cd my-app
pnpm nocobase config init --dialect sqlite
```

Lệnh này sinh `config.yml` từ `config.example.yml` và khởi tạo các khóa bí mật bắt buộc. Cấu hình cục bộ được Git bỏ qua.

### 2. Kiểm tra cấu hình

```bash
pnpm nocobase config check
```

Xử lý các vấn đề được báo rồi kiểm tra lại. Chỉ khởi động ứng dụng sau khi kiểm tra đạt.

### 3. Khởi động ứng dụng

```bash
pnpm dev
```

Giữ terminal chạy. Khi sẵn sàng, server in ra URL `Local:` đầy đủ.

## Mở ứng dụng và đăng nhập

Dùng URL `Local:` đầy đủ, kể cả base path của ứng dụng, như `/main/`. Cổng có thể tăng lên nếu đang bị chiếm. Đừng suy ra địa chỉ từ cổng mặc định, và đừng dùng cổng Vite của frontend làm địa chỉ truy cập ứng dụng.

![Trang đăng nhập tiếng Anh của ứng dụng](/assets/core/tutorials/getting-started/login.png)

Nếu bạn không đổi cấu hình quản trị viên ban đầu, giá trị mặc định cục bộ là:

- Tên đăng nhập: `nocobase`
- Mật khẩu: `admin123`

Tài khoản này lấy từ `users.initialAdmin` trong `config.yml`. Nếu khác, hãy dùng cấu hình thực tế của bạn, và đổi mật khẩu mặc định sau khi đăng nhập.

![Trang chủ của ứng dụng vừa tạo](/assets/core/tutorials/getting-started/home.png)

Trang chủ giới thiệu các năng lực có sẵn và có những yêu cầu mẫu bạn có thể giao cho Agent. Giờ bạn đã có cả mã nguồn ứng dụng lẫn một ứng dụng đang chạy.

Các ảnh chụp này lấy từ ví dụ cũ [00-create-app](https://github.com/nocobase/app-tutorials/tree/00-create-app), sinh từ template mặc định `1.0.0-beta.78`; phiên bản bạn cài có thể trông khác. [Xây ứng dụng đầu tiên](../tutorials/build-your-first-feature.md) dùng template `1.0.0-beta.81` phát hành trên npmjs.org làm mốc và không cần checkout tag cũ này.

## Xử lý sự cố

### Agent không tìm thấy Skill tạo ứng dụng

Kiểm tra rằng bạn đã chọn đúng Agent khi cài và đã mở phiên mới sau đó. Việc tạo ứng dụng dùng Skill toàn cục `nocobase-create-app`; các bước phát triển sau đó theo hướng dẫn riêng của ứng dụng.

### Ứng dụng đã có nhưng thiếu Skill

Chạy lệnh này trong ứng dụng, rồi mở phiên Agent mới tại đó:

```bash
pnpm nocobase skills sync
```

### Khởi động báo thiếu cấu hình

Xác nhận terminal đang ở thư mục ứng dụng, rồi chạy `pnpm nocobase config init --dialect sqlite` và sau đó `pnpm nocobase config check`. Hãy tìm nguyên nhân lỗi trong cấu hình hiện có thay vì xóa cấu hình hoặc reset cơ sở dữ liệu để thử lại.

## Bước tiếp theo

Đọc [Cấu trúc dự án](project-structure.md) để biết mã ứng dụng, cấu hình và hướng dẫn cho Agent nằm ở đâu.
