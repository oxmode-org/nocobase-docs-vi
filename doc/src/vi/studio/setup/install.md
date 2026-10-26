---
title: Cài đặt Studio
description: Studio chạy trên server của chính bạn. Dùng Docker Compose để triển khai Studio cùng cơ sở dữ liệu PostgreSQL trên một server Linux, rồi đăng nhập bằng tài khoản quản trị viên đầu tiên.
---

## Bạn cần gì

| Thứ cần có | Yêu cầu |
| --- | --- |
| Một server | Linux có Docker và Docker Compose. Image hỗ trợ amd64 và arm64 |
| Một NocoBase Pro token | Để đăng nhập registry riêng `pkg-v3.nocobase.com` |
| Tên miền và HTTPS | Khi dùng thật, hãy đặt Studio sau một reverse proxy như Caddy hoặc Nginx trên tên miền của bạn. Callback từ nền tảng lưu trữ mã, thông báo đẩy trên trình duyệt và các đường dẫn trong email đều cần HTTPS và một địa chỉ ổn định |
| Truy cập mạng | Server truy cập được `pkg-v3.nocobase.com` và địa chỉ tải các layer image mà bạn nhận kèm token, và kéo được image PostgreSQL |
| Tùy chọn | Một hộp thư SMTP cho lời mời, đặt lại mật khẩu và thông báo qua email; object storage; Redis, chỉ cần khi bạn chạy nhiều hơn một instance |

## Đăng nhập registry

Dùng `nocobase` làm tên đăng nhập và token làm mật khẩu. Truyền token qua đầu vào chuẩn để nó không nằm trong lịch sử lệnh:

```bash
echo "<YOUR_TOKEN>" | docker login pkg-v3.nocobase.com -u nocobase --password-stdin
```

`Login Succeeded` nghĩa là bạn đã đăng nhập.

Các phiên bản hiện có được liệt kê ở [trang phiên bản image](https://pkg-v3.nocobase.com/-/images/nocobase/studio), không cần đăng nhập. Trên production, hãy ghim một phiên bản cụ thể như `1.0.0-beta.61` để việc triển khai ổn định và lặp lại được. Các tag `latest` và `beta` thay đổi theo mỗi bản phát hành mới. Các bước bên dưới dùng `<version>` thay cho phiên bản.

## Triển khai

1. Tạo thư mục triển khai và sao chép template cấu hình ra khỏi image. Studio cần file này để khởi động, thiếu nó sẽ thoát ngay.

   ```bash
   mkdir studio && cd studio
   mkdir storage && sudo chown 1000:1000 storage   # container chạy với UID 1000 và phải ghi được vào đây
   docker run --rm --entrypoint cat pkg-v3.nocobase.com/nocobase/studio:<version> /app/config.example.yml > config.yml
   ```

2. Sửa `config.yml` ở hai chỗ. Giao diện là tiếng Anh nếu bạn không đặt ngôn ngữ khác. Nếu nhóm làm việc bằng ngôn ngữ khác, đặt ở đầu file, ví dụ `zh-CN` cho tiếng Trung:

   ```yaml
   i18n:
     defaultLocale: zh-CN
   ```

   Trong `auth`, thêm `disableSignUp: true` vào `emailAndPassword`. Thiết lập này tắt tự đăng ký, nên thành viên chỉ tham gia khi quản trị viên mời:

   ```yaml
   auth:
     emailAndPassword:
       enabled: true
       autoSignIn: false
       disableSignUp: true
   ```

   Nếu để bật đăng ký, bất kỳ ai vào được trang đăng nhập cũng có thể tạo tài khoản.

3. Tạo `.env`, chứa khóa mã hóa, mật khẩu của quản trị viên đầu tiên và mật khẩu cơ sở dữ liệu. Thay địa chỉ bằng tên miền của bạn:

   ```bash
   cat > .env <<EOF
   STUDIO_SECRET_KEY=$(openssl rand -hex 32)
   INITIAL_ADMIN_PASSWORD=$(openssl rand -base64 18 | tr -d '/+=')
   DB_PASSWORD=$(openssl rand -hex 16)
   APP_PUBLIC_ORIGIN=https://studio.example.com
   EOF
   chmod 600 .env
   ```

4. Tạo `docker-compose.yml`:

   ```yaml
   services:
     studio:
       image: pkg-v3.nocobase.com/nocobase/studio:<version>
       restart: unless-stopped
       depends_on:
         postgres:
           condition: service_healthy
       ports:
         - "13000:13000"
       environment:
         # Địa chỉ công khai, dùng cho callback đăng nhập và đường dẫn trong email
         APP_PUBLIC_ORIGIN: ${APP_PUBLIC_ORIGIN:-http://localhost:13000}
         # Khóa mã hóa. Không bao giờ đổi sau khi triển khai
         SECRETS_KEYS: 1:${STUDIO_SECRET_KEY:?set STUDIO_SECRET_KEY in .env}
         # Quản trị viên được tạo ở lần khởi động đầu tiên
         INITIAL_ADMIN_USERNAME: nocobase
         INITIAL_ADMIN_EMAIL: ${INITIAL_ADMIN_EMAIL:-admin@nocobase.com}
         INITIAL_ADMIN_PASSWORD: ${INITIAL_ADMIN_PASSWORD:?set INITIAL_ADMIN_PASSWORD in .env}
         DB_DIALECT: postgres
         DB_HOST: postgres
         DB_PORT: 5432
         DB_DATABASE: studio
         DB_USERNAME: studio
         DB_PASSWORD: ${DB_PASSWORD:?set DB_PASSWORD in .env}
       volumes:
         - ./config.yml:/app/config.yml:ro
         - ./storage:/app/storage

     postgres:
       image: postgres:16
       restart: unless-stopped
       environment:
         POSTGRES_DB: studio
         POSTGRES_USER: studio
         POSTGRES_PASSWORD: ${DB_PASSWORD:?set DB_PASSWORD in .env}
       volumes:
         - ./postgres:/var/lib/postgresql/data
       healthcheck:
         test: ["CMD-SHELL", "pg_isready -U studio -d studio"]
         interval: 5s
         timeout: 5s
         retries: 10
   ```

5. Khởi động:

   ```bash
   docker compose up -d
   docker compose ps
   ```

   Studio đã chạy khi `studio` hiển thị `healthy`, thường trong vòng một phút. Ở lần khởi động đầu, nó tự tạo các bảng và dữ liệu ban đầu.

> [!WARNING] Giữ an toàn khóa mã hóa
> `STUDIO_SECRET_KEY` trong `.env` mã hóa các thông tin xác thực Git đã lưu, API key và các khóa bí mật khác. Không bao giờ đổi nó sau khi triển khai: nếu đổi, mọi người sẽ bị đăng xuất, còn nếu mất, các thông tin xác thực đó không thể giải mã lại. Hãy sao lưu `.env` cùng dữ liệu và cất giữ như cách bạn cất giữ mật khẩu.

## Đăng nhập

Mở `https://studio.example.com/main/`. Nếu chưa thiết lập tên miền, mở `http://<địa chỉ server>:13000/main/`.

- Tên đăng nhập: `nocobase`
- Mật khẩu: `INITIAL_ADMIN_PASSWORD` trong `.env`. Chạy `grep INITIAL_ADMIN_PASSWORD .env` để xem

Khi đã vào, mở **Account settings › Account and security** từ menu tài khoản ở góc trên bên phải và đổi mật khẩu.

Đừng bỏ `/main` khỏi địa chỉ. Khi thêm runtime hoặc đăng nhập `nb-studio` sau này, địa chỉ Studio bạn dùng là địa chỉ đầy đủ có `/main` này.

**Xong khi**: bạn đăng nhập được bằng tài khoản quản trị viên đầu tiên, giao diện dùng ngôn ngữ của nhóm, và trang đăng nhập không có liên kết **Sign up**. Tiếp theo, [kết nối Git](git.md).

## Thiết lập HTTPS

Trỏ một reverse proxy đến cổng 13000 của Studio, và chuyển tiếp cả WebSocket. Với Caddy, thêm vào `Caddyfile`:

```text
studio.example.com {
    reverse_proxy 127.0.0.1:13000
}
```

Nếu reverse proxy chạy trên cùng server với Studio, đổi cổng trong `docker-compose.yml` thành `"127.0.0.1:13000:13000"` để chỉ proxy truy cập được. Đảm bảo `APP_PUBLIC_ORIGIN` trong `.env` là địa chỉ HTTPS công khai, rồi chạy lại `docker compose up -d`.

## Để Agent triển khai

Bạn cũng có thể đưa prompt bên dưới cho Claude Code hoặc Codex để nó đăng nhập server và triển khai. Thay địa chỉ server, tên miền và phiên bản, và đưa token riêng cho nó:

```prompt
Đăng nhập vào <địa chỉ server> qua SSH và dùng Docker Compose để triển khai NocoBase Studio cùng PostgreSQL tại https://studio.example.com/main/.

- Image: pkg-v3.nocobase.com/nocobase/studio:<version>. Trước tiên đăng nhập registry bằng NocoBase Pro token tôi đưa, tên đăng nhập nocobase, truyền token qua đầu vào chuẩn.
- Sao chép file cấu hình từ /app/config.example.yml trong image và mount vào /app/config.yml. Nếu nhóm làm việc bằng ngôn ngữ khác tiếng Anh, đặt i18n.defaultLocale thành <ngôn ngữ giao diện, như zh-CN>. Đặt disableSignUp: true trong auth.emailAndPassword.
- Mount thư mục dữ liệu /app/storage ra host, thuộc sở hữu UID 1000.
- Sinh ngẫu nhiên khóa mã hóa, mật khẩu quản trị viên đầu tiên và mật khẩu cơ sở dữ liệu, ghi vào file .env với quyền 600. Không để chúng xuất hiện trong lịch sử lệnh và log.
- Kiểm tra trước các container, mạng Docker và reverse proxy hiện có trên server, và không ảnh hưởng đến dịch vụ khác. Nếu đã có reverse proxy, hãy dùng nó. Nếu chưa, dùng Caddy cho HTTPS, và chuyển tiếp cả WebSocket.

Khi xong, xác nhận container studio ở trạng thái healthy, https://studio.example.com/main/ mở được, đăng nhập được bằng nocobase, ngôn ngữ giao diện đúng, trang đăng nhập không có liên kết đăng ký, và dữ liệu còn nguyên sau khi khởi động lại container. Cho tôi biết thư mục triển khai ở đâu và mật khẩu quản trị viên cùng khóa mã hóa được lưu ở đâu.
```

## Nâng cấp và sao lưu

Để nâng cấp, hãy sao lưu trước, đổi phiên bản trong `docker-compose.yml` sang bản mới, rồi chạy:

```bash
docker compose pull
docker compose up -d
```

Migration cơ sở dữ liệu tự chạy khi khởi động. Để rollback, trước hết khôi phục bản sao lưu cơ sở dữ liệu từ trước khi nâng cấp, rồi đổi phiên bản về như cũ. Nâng cấp Studio trước, các runner sẽ tự nâng cấp khi rảnh.

Sao lưu cơ sở dữ liệu PostgreSQL (ví dụ bằng `pg_dump -Fc`, hoặc sao chép thư mục `postgres` khi Studio đã dừng), `config.yml`, `.env` và thư mục `storage`. Xem [Nâng cấp và sao lưu](../admin/upgrade-and-backup.md).

## Xử lý sự cố

**`docker login` hoặc `docker pull` báo unauthorized.** Token sai, hoặc không được cấp phép cho image này. Đảm bảo bạn đã sao chép đủ token, không có khoảng trắng thừa, rồi đăng nhập lại.

**`docker pull` trả về 403 và báo phiên bản được phát hành sau thời hạn cập nhật của giấy phép.** Hãy dùng một phiên bản nằm trong thời hạn, hoặc gia hạn rồi kéo lại.

**Kéo `postgres:16` bị timeout.** Server không truy cập được Docker Hub. Hãy cấu hình registry mirror cho Docker, hoặc dùng một PostgreSQL có sẵn: bỏ service `postgres` và `depends_on` khỏi `docker-compose.yml`, rồi trỏ `DB_HOST` và các thiết lập khác đến cơ sở dữ liệu của bạn.

**Tải layer image bị treo hoặc timeout.** Tường lửa hoặc proxy đang chặn địa chỉ tải layer image mà bạn nhận kèm token. Nếu Docker cần proxy, hãy cấu hình cho chính dịch vụ Docker. Đặt `HTTP_PROXY` trong terminal không có tác dụng với `docker pull`.

**Địa chỉ không hiện trang đăng nhập.** Hãy thêm `/main/` vào địa chỉ.

**Container không khởi động hoặc liên tục khởi động lại.** Chạy `docker compose logs studio` để xem lý do. Nguyên nhân thường gặp: chưa sao chép `config.yml` ra trước, nên Docker tạo một thư mục cùng tên (xóa nó và làm lại bước 1), hoặc thư mục `storage` không thuộc sở hữu UID 1000.
