---
title: Chuyển từ NocoBase 2
description: Những điều người đã dùng NocoBase 2 muốn biết nhất: cách tiếp cận thay đổi ra sao, trình quản lý plugin và các màn hình cấu hình đi đâu, và mỗi tính năng của NocoBase 2 tương ứng với gì trong bản 3.
---

## Khác biệt trong một câu

Trong NocoBase 2, bảng, trang, phân quyền và workflow tồn tại dưới dạng **cấu hình** lưu trong cơ sở dữ liệu, và nền tảng đọc cấu hình đó để hiển thị giao diện. Trong NocoBase 3, tất cả đều là **mã nguồn**, nằm trong repository của chính bạn, do Agent viết. NocoBase cung cấp runtime, plugin và các thư viện nền tảng dưới dạng gói npm.

Khi thay đổi là mã nguồn, bạn có thể quản lý chúng như mã nguồn: phát triển trên nhánh, review, kiểm thử, phát hành theo phiên bản và rollback khi có sự cố. Khi nền tảng thiếu một năng lực, Agent có thể viết trực tiếp, nên bạn không còn bị giới hạn bởi các màn hình cấu hình.

## Trước đây làm thế nào, bây giờ làm thế nào

| Trong NocoBase 2 | Trong NocoBase 3 |
| --- | --- |
| Bật plugin trong trình quản lý plugin | Đăng ký plugin trong danh sách plugin của ứng dụng, thường do Agent làm bằng `pnpm nocobase plugin register`. Xem [Quản lý plugin](../core/developing-apps/manage-plugins.md) |
| Cấu hình trên trang cài đặt của plugin | Ba chỗ: cài đặt triển khai (cơ sở dữ liệu, lưu trữ, nhà cung cấp mail) nằm trong `config.yml`; quy tắc nghiệp vụ được Agent viết vào mã; những gì quản trị viên điều chỉnh hằng ngày (người dùng, vai trò, phạm vi dữ liệu, người phê duyệt, ngưỡng số tiền) nằm trong **System settings** của ứng dụng |
| Kéo thả trang và block trên giao diện | Mô tả trang cho Agent, và nó viết trang thành mã bằng các component của thư viện UI |
| Cấu hình quy trình trên canvas workflow | Quy trình được viết bằng mã (record lifecycle). Quản trị viên xem sơ đồ luồng, chỉnh tham số workflow và kiểm tra lịch sử thực thi trong **Workflow management**. |
| Tạo bảng và thêm trường trong quản lý nguồn dữ liệu | Agent viết file migration, và `pnpm nocobase db apply` chạy chúng |
| Thay đổi có hiệu lực ngay khi lưu | Thay đổi là mã nguồn, và có hiệu lực sau khi phát triển, kiểm tra và triển khai |
| AI employee | Agent nghiệp vụ, kết nối qua plugin Agents, dùng cùng vai trò và phân quyền như con người |

### Plugin còn có giao diện không?

Có, nhưng ở dạng khác. Plugin mang năng lực phía server, Skill và lệnh vào ứng dụng, và một vài plugin có trang riêng (ví dụ **App foundation**). Phần lớn giao diện đến dưới dạng UI component mà Agent đặt vào các trang của bạn. Các lối vào quản trị được gom trong **System settings** của ứng dụng, và Agent mặc định dựng chúng khi bàn giao ứng dụng.

Để xem ứng dụng dùng những plugin nào, mở **System settings › App foundation**. Trang này liệt kê các năng lực Core mà ứng dụng thực sự dùng và các gói cung cấp chúng.

## Mỗi tính năng của NocoBase 2 tương ứng với gì trong bản 3

| NocoBase 2 | NocoBase 3 | Ghi chú |
| --- | --- | --- |
| Người dùng, vai trò và phân quyền | Các plugin xác thực, người dùng và phân quyền, cùng ba plugin cho phạm vi dữ liệu mặc định, quy tắc chia sẻ và quy tắc hạn chế | Bật sẵn trong template mặc định, có sẵn các trang **User management**, **Roles and permissions** và **Default data scopes** |
| Nguồn dữ liệu và collection | Thư viện nền tảng cơ sở dữ liệu và migration; cơ sở dữ liệu bên ngoài được kết nối như một kết nối thứ hai | Hỗ trợ SQLite, PostgreSQL, MySQL, SQL Server và Oracle; Dameng, KingbaseES và OceanBase có trong các phiên bản thương mại |
| Trình quản lý tệp | Plugin tệp và thư viện nền tảng lưu trữ | Lưu trữ cục bộ, lưu trữ tương thích S3 và Alibaba Cloud OSS |
| Workflow | Record lifecycle (một thư viện nền tảng) và plugin tác vụ định kỳ | Cấu trúc quy trình được viết bằng mã, không có trình thiết kế kéo thả |
| Phê duyệt | Plugin phê duyệt <span class="tag pro">Thương mại</span> | Nhiều cấp, tất cả phải duyệt, một người duyệt là đủ, thêm người duyệt, chuyển giao và trả lại |
| Thông báo và tin nhắn trong ứng dụng | Các plugin thông báo, tin nhắn trong ứng dụng và kênh thông báo | Tin nhắn trong ứng dụng; email (SMTP, Resend); bot nhóm Feishu và DingTalk |
| Quản lý email | Plugin mail | Liên kết hộp thư cá nhân, rồi gửi, nhận và đồng bộ email |
| AI employee và cơ sở tri thức AI | Plugin Agents và plugin cơ sở tri thức | Đã cài trong template mặc định; đăng ký khi cần |
| Đa ngôn ngữ và theme | Plugin đa ngôn ngữ; theme nằm trong template | |
| API key | Plugin API keys | Bật sẵn trong template mặc định |
| In theo mẫu | Gói Skill in theo mẫu | Chỉ là hướng dẫn cho Agent. Agent hiện thực nó trong ứng dụng |
| Biểu đồ, nhập xuất và các block khác | Agent hiện thực trong ứng dụng | Thư viện UI cung cấp các component như bảng dữ liệu và dashboard |
| Nhật ký kiểm toán | Chưa có | Mục kiểm toán trong **App foundation** cho thấy chưa phát hiện nhà cung cấp nào |
| LDAP, SAML, DingTalk, WeCom, Feishu, Slack và các cách đăng nhập khác | Plugin xác thực | Đều được hỗ trợ. Plugin xác thực xây trên Better Auth, và định danh doanh nghiệp cùng đăng nhập mạng xã hội được kết nối qua cấu hình |

Xem [Quản lý plugin](../core/developing-apps/manage-plugins.md) để kiểm tra, đăng ký, cập nhật hoặc gỡ các plugin mà ứng dụng dùng.

## Ứng dụng NocoBase 2 có chuyển sang bản 3 được không?

Hai bản có cấu trúc khác nhau: trong bản 2, định nghĩa nghiệp vụ là cấu hình trong cơ sở dữ liệu, còn trong bản 3 chúng là mã nguồn, nên không thể nâng cấp ứng dụng tại chỗ. Chuyển sang bản 3 nghĩa là xây lại ứng dụng trên bản 3 rồi nhập dữ liệu nghiệp vụ vào.

> [!PENDING] Lộ trình chuyển đổi sẽ được bổ sung
> Phần này sẽ được viết khi phương pháp, công cụ chuyển đổi chính thức và kế hoạch bảo trì NocoBase 2 được xác nhận.

## Tiếp theo

- [Core là gì](../core/getting-started/what-is-core.md): nắm bức tranh tổng thể về NocoBase 3
- [Quản lý plugin](../core/developing-apps/manage-plugins.md): plugin mang gì vào ứng dụng, và các lối vào quản trị nằm ở đâu
