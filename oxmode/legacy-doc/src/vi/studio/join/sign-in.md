---
title: Đăng nhập và cài đặt cá nhân
description: Tạo tài khoản từ lời mời và đăng nhập vào Studio. Sau đó dùng Account settings để đổi hồ sơ, mật khẩu, tùy chọn, và kết nối tài khoản Git của riêng bạn.
---

## Nhận lời mời

Khi quản trị viên mời bạn, bạn nhận được một email mời. Nếu Studio chưa cấu hình email, quản trị viên sẽ gửi trực tiếp đường dẫn mời cho bạn. Đường dẫn có hiệu lực trong 7 ngày.

1. Mở đường dẫn mời. Trang cho biết ai đã mời bạn, và địa chỉ email của bạn đã được điền sẵn.
2. Nhập tên và mật khẩu có ít nhất 8 ký tự.
3. Bấm **Create account and join**.

Bạn vào thẳng **My issues** ở trạng thái đã đăng nhập. Nếu quản trị viên đã chọn dự án khi mời, bạn đã là thành viên của các dự án đó.

- Nếu địa chỉ email đã có tài khoản, bấm **Go to sign in** và tiếp tục với tài khoản đó.
- Nếu trình duyệt đang đăng nhập một tài khoản khác, hãy đăng xuất trước rồi mới nhận lời mời.
- Nếu đường dẫn đã hết hạn hoặc bị thu hồi, trang sẽ báo. Hãy nhờ người mời gửi lời mời mới.

## Đăng nhập

Quản trị viên cho bạn địa chỉ Studio, có dạng `https://studio.example.com/main/`. Trên trang đăng nhập, dùng tên đăng nhập hoặc email cùng mật khẩu của bạn.

Nếu trang đăng nhập có **Forgot password?**, hãy nhập email và làm theo đường dẫn nhận được để đặt mật khẩu mới. Nếu không có, nghĩa là Studio chưa cấu hình email. Hãy nhờ một Owner đặt lại mật khẩu cho bạn trong **Settings › Members**.

## Cài đặt tài khoản

Bấm vào ảnh đại diện ở góc trên bên phải để mở menu tài khoản:

- **Account settings**: hồ sơ, mật khẩu, tùy chọn, API key và tài khoản Git của bạn.
- **Use Studio in your agent**: đưa cho Agent của bạn hướng dẫn cài đặt để nó làm việc với Studio từ dòng lệnh. Xem [Dùng Studio từ coding agent trên máy bạn](local-agent.md).
- **Language** và **Theme**: đổi ngôn ngữ giao diện và chế độ màu ngay tại đó.
- **Sign out**: đăng xuất.

**Account settings** có năm trang:

| Trang | Bạn có thể làm gì |
| --- | --- |
| Profile | Đổi tên hiển thị và tên đăng nhập. Tên hiển thị xuất hiện trên issue và bình luận. Email chỉ đọc; muốn đổi, hãy nhờ một Owner |
| Account and security | Đổi mật khẩu. Lưu mật khẩu mới sẽ đăng xuất bạn trên các thiết bị khác |
| Preferences | Ngôn ngữ giao diện, chế độ màu và mật độ hiển thị; âm thanh nhắc và thông báo trên máy tính; thông báo đẩy cho thiết bị này; và cách các Agent của bạn ký các commit chúng tạo ra |
| API keys | Tạo key riêng để script và CI gọi Studio dưới danh nghĩa bạn. Xem [API key](../admin/api-keys.md) |
| Git | Kết nối tài khoản trên nền tảng lưu trữ mã của bạn. Xem phần tiếp theo |

Tùy chọn được lưu cùng tài khoản, nên chúng theo bạn sang mọi trình duyệt. Thông báo đẩy được đăng ký theo từng thiết bị và cần Studio chạy qua HTTPS. Trên iPhone, hãy thêm Studio vào Màn hình chính trước, rồi mở từ đó để đăng ký. Xem [Thông báo và thông báo đẩy](../admin/notifications.md).

**Commit attribution** (ghi công commit) mặc định theo cài đặt của dự án. Agent của bạn luôn commit dưới tên bạn, và bạn chọn có ghi thêm Agent làm đồng tác giả hay không.

## Kết nối tài khoản Git của bạn

Mở **Account settings › Git** và bấm **Connect GitHub**, hoặc nút tương ứng cho GitLab hay Gitee. Đăng nhập trên nền tảng lưu trữ mã và đồng ý cấp quyền, khi quay lại Studio sẽ hiển thị tài khoản đã kết nối.

Sau khi kết nối, Agent của bạn push mã và mở PR dưới tên bạn, và các lần merge bạn làm trong Studio cũng mang tên bạn, nên nền tảng lưu trữ mã cho thấy đó là công việc của ai. Trước khi kết nối, Studio dùng kết nối Git của workspace, ví dụ GitHub App mà nhóm đã cài. Chúng tôi khuyên mọi người trong nhóm đều kết nối tài khoản riêng.

Nếu cấp quyền qua trình duyệt không tiện, bấm **Other ways**:

- **Connect with a code**: mở trang của nền tảng lưu trữ mã, đăng nhập, rồi nhập mã mà Studio hiển thị.
- **Use a personal token**: dán một token bạn đã tạo trên nền tảng lưu trữ mã. Studio kiểm tra, mã hóa nó và không bao giờ hiển thị lại.

Quản trị viên quyết định những cách nào được dùng trong **Settings › Integrations › Git**. Nếu trang báo **Personal accounts can’t be connected yet**, hãy nhờ quản trị viên cho phép tài khoản cá nhân. Khi token hết hạn, Studio quay về dùng kết nối của workspace, bạn chỉ cần kết nối lại.

## Bước tiếp theo

- [Nêu yêu cầu](../use/raise-a-request.md): giao việc cho đội Agent.
- [My sessions](../use/sessions.md): trao đổi yêu cầu với Agent của bạn trước.
- [My issues](../use/my-tasks.md): bắt đầu mỗi ngày tại đây, những gì đang chờ bạn nằm trên cùng.
