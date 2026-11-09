---
title: Chuẩn bị môi trường phát triển
description: Cài Node.js 24, pnpm 11.7 và Git. Trên Windows, thiết lập WSL trước.
---

Cần Node.js 24 trở lên, pnpm 11.7 trở lên và Git. Chạy các lệnh trong terminal kiểu Unix.

<a id="windows-users-install-wsl-first"></a>

## Cài WSL trước nếu dùng Windows

Mở PowerShell với quyền quản trị viên và chạy lệnh sau. Khởi động lại khi được yêu cầu, rồi mở **Ubuntu**. Từ đó, đặt công cụ và thư mục ứng dụng trong WSL, đồng thời chạy lệnh tại đó. Xem [hướng dẫn cài WSL của Microsoft](https://learn.microsoft.com/en-us/windows/wsl/install).

```powershell
wsl --install
```

<a id="install-nodejs-and-pnpm"></a>

## Cài Node.js và pnpm

Cài nvm theo [hướng dẫn của nvm](https://github.com/nvm-sh/nvm#installing-and-updating), rồi chạy:

```bash
nvm install 24
```

Nếu dùng fnm, cài theo [hướng dẫn của fnm](https://github.com/Schniz/fnm#installation), rồi chạy:

```bash
fnm install 24
```

Sau đó cài pnpm:

```bash
npm install -g pnpm@11
```

Mở terminal mới sau khi cài xong.

<a id="install-git"></a>

## Cài Git

Trên macOS, chạy `git --version` và làm theo lời nhắc để cài bộ công cụ dòng lệnh cho nhà phát triển. Trên Linux và WSL, dùng trình quản lý package, ví dụ `sudo apt install git`. Sau đó đặt tên và email:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Hoàn tất khi `node --version` hiện `v24` trở lên, `pnpm --version` hiện 11.7 trở lên và `git config user.name` hiện đúng tên đã đặt.
