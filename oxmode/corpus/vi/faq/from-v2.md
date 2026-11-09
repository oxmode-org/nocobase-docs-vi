---
title: NocoBase 2 và NocoBase 3
---

<a id="products-and-development-approaches"></a>

## Sản phẩm và cách phát triển

Trong NocoBase 2, bảng, trang, quyền và quy trình tồn tại dưới dạng **cấu hình** trong cơ sở dữ liệu. Nền tảng đọc cấu hình để dựng giao diện. Trong NocoBase 3, các phần đó là **mã nguồn** do agent viết trong kho của đội ngũ. NocoBase cung cấp môi trường chạy, plugin và thư viện nền tảng qua các package npm.

Khi thay đổi nằm trong mã nguồn, đội ngũ có thể phát triển trên nhánh riêng, rà soát, kiểm thử, phát hành theo phiên bản và quay về bản trước khi gặp sự cố. Nếu thiếu tính năng, agent có thể bổ sung trực tiếp vào mã ứng dụng.

| Trong NocoBase 2 | Trong NocoBase 3 |
| --- | --- |
| Bật plugin trong trình quản lý plugin | Đăng ký plugin trong danh sách plugin của ứng dụng, thường do agent thực hiện bằng `pnpm nocobase plugin register`. Xem [Quản lý plugin](../core/developing-apps/manage-plugins.md) |
| Cấu hình trên trang cài đặt của plugin | Cấu hình triển khai như cơ sở dữ liệu, lưu trữ và dịch vụ email nằm trong `config.yml`. Agent viết quy tắc nghiệp vụ trong mã. Quản trị viên điều chỉnh người dùng, vai trò, phạm vi dữ liệu, người phê duyệt và ngưỡng giá trị trong **System settings** |
| Kéo thả trang và khối trên giao diện | Mô tả trang cho agent để agent viết mã bằng các thành phần của thư viện giao diện |
| Cấu hình quy trình trên giao diện sơ đồ | Khai báo vòng đời bản ghi bằng mã. Quản trị viên xem sơ đồ, chỉnh tham số và xem lịch sử thực thi trong **Workflow management** |
| Tạo bảng và thêm trường trong quản lý nguồn dữ liệu | Agent viết migration. Chạy bằng `pnpm nocobase db apply` |
| Thay đổi có hiệu lực ngay khi lưu | Thay đổi đi qua các bước phát triển, kiểm chứng và triển khai |
| Nhân viên AI | Agent nghiệp vụ kết nối qua plugin Agents, dùng cùng cơ chế vai trò và quyền như người dùng |

<a id="do-plugins-still-have-a-ui"></a>

### Plugin còn có giao diện không?

Có. Plugin cung cấp chức năng phía máy chủ, Skill và lệnh cho ứng dụng. Một số plugin có trang riêng như **App foundation**. Phần lớn giao diện đến từ các thành phần mà agent ghép vào trang. Các mục quản trị tập trung trong **System settings** và mặc định được agent xây khi bàn giao ứng dụng.

Mở **System settings › App foundation** để xem các khả năng Core ứng dụng đang dùng và package cung cấp chúng.

<a id="feature-mapping"></a>

## Đối chiếu tính năng

| NocoBase 2 | NocoBase 3 | Ghi chú |
| --- | --- | --- |
| Người dùng, vai trò và quyền | Plugin xác thực, người dùng và phân quyền, cùng ba plugin về phạm vi dữ liệu mặc định, quy tắc chia sẻ và quy tắc hạn chế | Bật trong template mặc định, có các trang **User management**, **Roles and permissions** và **Default data scopes** |
| Nguồn dữ liệu và Collection | Thư viện cơ sở dữ liệu và migration. Kết nối cơ sở dữ liệu ngoài bằng kết nối thứ hai | Hỗ trợ SQLite, PostgreSQL, MySQL, SQL Server và Oracle. Dameng, KingbaseES và OceanBase thuộc phiên bản thương mại |
| Quản lý tệp | Plugin tệp và thư viện lưu trữ | Lưu trữ cục bộ, tương thích S3 và Alibaba Cloud OSS |
| Quy trình | Thư viện vòng đời bản ghi và plugin tác vụ theo lịch | Viết cấu trúc quy trình bằng mã |
| Phê duyệt | Plugin phê duyệt <span class="tag pro">Thương mại</span> | Nhiều cấp, yêu cầu tất cả hoặc bất kỳ người nào duyệt, thêm người duyệt, chuyển giao và gửi lại |
| Thông báo và tin nhắn trong ứng dụng | Plugin thông báo, tin nhắn trong ứng dụng và kênh thông báo | Tin nhắn trong ứng dụng, email qua SMTP hoặc Resend, bot nhóm Feishu và DingTalk |
| Quản lý email | Plugin email | Kết nối hộp thư cá nhân để gửi, nhận và đồng bộ |
| Nhân viên AI và kho tri thức AI | Plugin Agents và plugin kho tri thức | Có sẵn trong template mặc định. Đăng ký khi cần |
| Bản địa hóa và chủ đề | Plugin bản địa hóa và chủ đề trong template | |
| Khóa API | Plugin khóa API | Bật trong template mặc định |
| In theo mẫu | Bộ Skill in theo mẫu | Agent dùng hướng dẫn để triển khai trong ứng dụng |
| Biểu đồ, nhập xuất dữ liệu và các khối khác | Agent triển khai trong ứng dụng | Thư viện giao diện cung cấp thành phần như bảng dữ liệu và dashboard |
| Nhật ký kiểm toán | Chưa khả dụng | Mục kiểm toán trong **App foundation** hiện báo chưa phát hiện nhà cung cấp |
| LDAP, SAML, DingTalk, WeCom, Feishu, Slack và các cách đăng nhập khác | Plugin xác thực | Plugin xây trên Better Auth. Kết nối danh tính doanh nghiệp và đăng nhập mạng xã hội qua cấu hình |

Xem [Quản lý plugin](../core/developing-apps/manage-plugins.md) để kiểm tra, đăng ký, cập nhật hoặc gỡ plugin.

<a id="migrating-existing-applications"></a>

## Chuyển ứng dụng hiện có

NocoBase 2 lưu định nghĩa nghiệp vụ dưới dạng cấu hình trong cơ sở dữ liệu, còn NocoBase 3 lưu dưới dạng mã. Để chuyển sang bản 3, xây dựng lại ứng dụng trên bản 3 rồi nhập dữ liệu nghiệp vụ.

> [!PENDING] Lộ trình chuyển đổi sẽ được bổ sung
> Mục này sẽ được cập nhật khi NocoBase xác nhận phương thức, công cụ chuyển đổi chính thức và kế hoạch bảo trì NocoBase 2.
