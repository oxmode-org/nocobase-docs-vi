---
title: Tổng quan cài đặt
description: Triển khai Studio, chuẩn bị dự án và agent, cấu hình kiểm tra rồi mời thành viên.
---

Có thể dùng agent lập trình cục bộ như Claude Code hoặc Codex để cài đặt và cấu hình Studio. Nếu đã có lời mời, xem [Tham gia dự án](../join/index.md).

<a id="set-up-with-an-agent"></a>

## Thiết lập cùng agent

Yêu cầu agent làm theo hướng dẫn chính thức để cài NocoBase Studio và cấu hình dự án đầu tiên:

```prompt
Follow https://docs.nocobase.com/studio/setup/ to install NocoBase Studio and configure my first project.
```

Agent kiểm tra môi trường đích, hỏi thông tin còn thiếu rồi làm theo các bước dưới đây để cấu hình và kiểm chứng. Làm theo lời nhắc của agent khi cần trực tiếp đăng nhập hoặc cấp quyền.

<a id="before-you-begin"></a>

## Chuẩn bị

Hướng dẫn này dùng Docker Compose, GitHub và một môi trường chạy dùng chung. Chuẩn bị:

- **Quyền truy cập image.** Studio là sản phẩm thương mại. [Liên hệ NocoBase](https://www.nocobase.com/contact/) để lấy image và quyền truy cập.
- **Môi trường triển khai.** Chuẩn bị quyền truy cập máy chủ và URL cho Studio. Có thể thử cục bộ mà không cần tên miền.
- **Tài khoản Git.** Chuẩn bị tài khoản hoặc tổ chức GitHub có quyền tạo kho mã và cài GitHub App.
- **Công cụ lập trình và tài khoản mô hình.** Có thể tiếp tục dùng tài khoản hiện có, chẳng hạn Claude Code hoặc Codex.

Agent có thể cài đặt và cấu hình phần mềm. Dùng lại cơ sở dữ liệu, reverse proxy, vùng lưu trữ hoặc dịch vụ email hiện có nếu phù hợp. Agent sẽ hỏi thông tin còn thiếu.

Dùng container hoặc máy ảo riêng cho môi trường chạy để tách khỏi Studio. Cài công cụ lập trình và runner trong môi trường đó.

<a id="prepare-the-team-environment"></a>

## Chuẩn bị môi trường của nhóm

| Bước | Kết quả |
| --- | --- |
| 1. [Triển khai Studio](install.md) | Quản trị viên có thể đăng nhập |
| 2. [Kết nối nền tảng Git](git.md) | Studio có thể tạo kho mã và gửi thay đổi |
| 3. [Kết nối môi trường chạy](shared-runtimes.md) | Công cụ lập trình trực tuyến và sẵn sàng |
| 4. [Cấu hình agent](agents.md) | Agent điều phối có thể phân công |
| 5. [Tạo dự án đầu tiên](new-project.md) | Mã ứng dụng được khởi tạo |
| 6. [Cấu hình kiểm tra và bản xem trước](ci.md) | Chọn agent tự kiểm tra hoặc CI để kiểm chứng thay đổi |
| 7. [Mời thành viên](invite.md) | Thành viên có thể chấp nhận lời mời và tham gia dự án |

<a id="members-start-work"></a>

## Thành viên bắt đầu làm việc

Sau khi [chấp nhận lời mời và đăng nhập](../join/sign-in.md), thành viên [thực hiện yêu cầu đầu tiên](../../getting-started/collaborate-with-studio.md) bằng cách gửi yêu cầu, theo dõi phát triển và nghiệm thu. Thành viên có thể dùng môi trường chạy của nhóm trực tiếp từ Studio.

<a id="adjust-configuration"></a>

## Điều chỉnh cấu hình

| Cài đặt | Tài liệu |
| --- | --- |
| Trách nhiệm của mô hình, máy thực thi và Skill dùng chung | [Agent](../configure/agents.md), [Môi trường chạy](../configure/runtimes.md) và [Skill](../project/skills.md) |
| Nguồn kiểm tra và pipeline CI | [Kiểm tra và CI](../configure/checks.md) |
| Thông tin dự án, thành viên và Skill mặc định | [Cài đặt dự án](../project/settings.md) |
| Kết nối Git và các nền tảng mã nguồn khác | [Nền tảng mã nguồn](../configure/git.md) |
| Cơ sở dữ liệu, URL truy cập và tham số triển khai | [Tham chiếu cấu hình](../reference/config.md) |
