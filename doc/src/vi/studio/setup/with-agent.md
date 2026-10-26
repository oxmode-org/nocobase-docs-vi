---
title: Để Agent thiết lập Studio
description: Cách được khuyến nghị để thiết lập Studio. Đưa một prompt cho Agent của bạn, như Claude Code hoặc Codex, nó sẽ theo tài liệu để triển khai và cấu hình Studio, bạn chỉ can thiệp ở những chỗ cần con người. Khi xong, nó hỏi có muốn chạy thử với một issue mất vài phút không.
---

| | Chuyện gì diễn ra | Thời gian |
| --- | --- | --- |
| Thiết lập | Triển khai Studio, kết nối nền tảng lưu trữ mã, kết nối một runtime và bật Agent. Sau đó dừng lại, báo cáo và hỏi có muốn chạy thử không | Khoảng nửa giờ, có vài bước bạn tự làm |
| Chạy thử (tùy chọn) | Nếu bạn đồng ý, nó tạo một dự án thử với một issue đơn giản nhất có thể và theo dõi đội Agent đưa issue đến In review | Khoảng 5 phút |

## Bạn cần gì

| Thứ cần có | Ghi chú |
| --- | --- |
| Một server | Linux có Docker và Docker Compose, Agent của bạn truy cập được qua SSH. Xem [Cài đặt Studio](install.md) |
| Một NocoBase Pro token | Dùng để kéo image Studio. Khi cần, Agent sẽ nhờ bạn tự đăng nhập registry trên server |
| Một tài khoản nền tảng lưu trữ mã | GitHub, GitLab hoặc Gitee. Với GitLab hoặc Gitee, hãy chuẩn bị sẵn token. Xem [Kết nối Git](git.md) |
| Một runtime | Một user hệ thống riêng trên cùng server, hoặc một máy khác, có Node.js 24 và Claude Code, Codex hoặc công cụ lập trình khác đã cài và đăng nhập. Agent sẽ cài những gì còn thiếu theo [Kết nối runtime dùng chung](shared-runtimes.md) |
| Agent của bạn | Bất kỳ công cụ lập trình nào, như Claude Code hoặc Codex, để thực hiện prompt bên dưới |

## Thiết lập

Thay các phần trong dấu ngoặc nhọn bằng thông tin của bạn và đưa prompt cho Agent:

```prompt
Hãy thiết lập NocoBase Studio giúp tôi.

Tài liệu: https://docs.nocobase.com/llms.txt liệt kê bản Markdown của mọi trang trong tài liệu NocoBase. Với mỗi bước, hãy đọc trang tương ứng trong tài liệu Studio trước, làm theo các bước của trang, và đối chiếu kết quả với mục "Done when" của trang: Install Studio, Connect Git, Connect a shared runtime, Enable agents.

Môi trường:
- Server cho Studio: <cách SSH vào>
- Địa chỉ Studio: <https://studio.example.com>, hoặc http://<địa chỉ server>:13000 nếu chưa có tên miền
- Nền tảng lưu trữ mã: <GitHub, GitLab hoặc Gitee>, với các repository thuộc <tài khoản hoặc tổ chức>
- Runtime dùng chung: <cách SSH vào>, chạy runner bằng user hệ thống <tên user>, đã cài và đăng nhập sẵn <Claude Code, Codex>

Làm lần lượt:
1. Triển khai Studio, phiên bản <phiên bản>. Khi cần NocoBase Pro token, hãy nhờ tôi tự đăng nhập registry trên server, và không bao giờ để token đi qua bạn. Khi xong, cho tôi biết địa chỉ và file nào trên server chứa mật khẩu của quản trị viên đầu tiên.
2. Sau khi tôi đăng nhập Studio, tôi sẽ đưa bạn hướng dẫn cài đặt từ "Connect a local Coding Agent". Làm theo đó để cài nb-studio, đăng nhập và cài các Skill. Đăng nhập cần tôi phê duyệt trên trình duyệt, nên hãy giữ lệnh đăng nhập chạy trong lúc chờ. Từ đó trở đi, dùng nb-studio cho mọi thao tác trong Studio.
3. Kết nối nền tảng lưu trữ mã.
4. Tạo thông tin xác thực đăng ký cho runtime dùng chung, rồi cài và đăng ký runner ở đó, bổ sung những gì mục "Prepare a machine" trong tài liệu liệt kê. Xác nhận nó trực tuyến và các công cụ lập trình hiển thị đã đăng nhập.
5. Kiểm tra các Agent đã bật và viết phần "Good at" cho từng Agent dựa trên thế mạnh của nó. Chọn một lựa chọn chính và một lựa chọn dự phòng cho Agent điều phối.
6. Sau đó dừng lại và tóm tắt cho tôi: địa chỉ Studio, kết quả từng bước và xem ở đâu trên giao diện, và những gì còn lại tôi cần làm. Rồi hỏi tôi có muốn chạy thử với một issue đơn giản nhất có thể không. Nếu tôi đồng ý, làm theo prompt trong mục "Trial run" của trang "Let an agent set up Studio".

Quy tắc:
- Khi cần tôi làm gì đó trên trình duyệt, đưa bạn một token, hoặc trả lời một câu hỏi, hãy dừng lại và cho tôi biết vào đâu, làm gì.
- Không để khóa bí mật, mật khẩu và thông tin xác thực dùng một lần xuất hiện trong lịch sử lệnh, log hay câu trả lời của bạn. Những gì cần chuyển cho tôi thì ghi vào một file chỉ tôi đọc được, và cho tôi biết đường dẫn.
- Không động vào bất kỳ dịch vụ nào trên server không liên quan đến Studio.
```

### Các bước bạn tự làm

Agent dừng lại ở mỗi bước sau và cho bạn biết cần làm gì. Làm xong, bảo Agent tiếp tục:

| Khi nào | Bạn làm gì |
| --- | --- |
| Trước khi kéo image | Đăng nhập registry trên server: chạy lệnh `docker login` mà Agent đưa, và nhập NocoBase Pro token khi được hỏi |
| Sau khi triển khai | Đăng nhập Studio bằng tài khoản quản trị viên đầu tiên và đổi mật khẩu. Trong menu tài khoản ở góc trên bên phải, bấm **Use Studio in your agent**, rồi đưa cho Agent hướng dẫn cài đặt từ **Connect a local Coding Agent** |
| Khi Agent đăng nhập nb-studio | Mở địa chỉ nó đưa trên trình duyệt, kiểm tra mã và bấm **Approve** |
| Khi kết nối GitHub | Tạo một GitHub App trong **Settings › Integrations › Git**: chọn tài khoản ở **Owner of the app**, tắt **Webhook** nếu Studio không có địa chỉ công khai, xác nhận trên GitHub, và chọn **All repositories** khi cài. Với GitLab hoặc Gitee, bạn chỉ cần cung cấp token |

### Khi thiết lập xong

Mọi mục dưới đây đều phải xong trong bản tóm tắt cuối của Agent, và bạn có thể tự kiểm tra từng mục trong Studio:

| Đã xong | Kiểm tra ở đâu |
| --- | --- |
| Bạn đăng nhập được Studio, giao diện dùng ngôn ngữ của nhóm, và trang đăng nhập không có liên kết **Sign up** | Trang đăng nhập |
| Nền tảng lưu trữ mã đã kết nối | **Settings › Integrations › Git** |
| Runtime dùng chung đang trực tuyến, và các công cụ lập trình hiển thị **Signed in** | **Agent management › Runtimes** |
| Ít nhất hai Agent đã bật, mỗi Agent có mô tả **Good at** | **Agent management › Agents** |
| Agent điều phối có lựa chọn chính và lựa chọn dự phòng | Phần Agent điều phối ở đầu **Agent management › Agents** |

Vậy là Studio đã được thiết lập. Khi Agent hỏi về việc chạy thử, bạn có thể để nó làm, hoặc bỏ qua và đi thẳng đến [Tạo dự án](new-project.md) và [Mời thành viên](invite.md).

## Chạy thử

Nếu bạn đồng ý chạy thử, Agent làm theo prompt bên dưới. Bạn cũng có thể đưa prompt này cho cùng Agent đó bất cứ lúc nào sau này:

```prompt
Trong NocoBase Studio (<địa chỉ>), hãy chạy thử quy trình của đội Agent với một issue đơn giản nhất có thể. nb-studio đã đăng nhập sẵn.

1. Tạo một dự án tên "Studio trial run" với repository mới tên <tên repository>. Chọn tùy chọn repository trống, không chọn template ứng dụng NocoBase.
2. Tạo một issue trong dự án này và bắt đầu nó, với mô tả: "Tạo hello.md ở thư mục gốc của repository với một dòng: Repository này dùng để chạy thử NocoBase Studio. Repository này không có CI, nên đừng chờ kết quả kiểm tra. Khi review đạt, hãy bàn giao cho tôi nghiệm thu."
3. Theo dõi issue cho đến khi nó đến In review. Khi Agent điều phối đặt câu hỏi, hãy chuyển lại cho tôi.
4. Cho tôi biết địa chỉ của issue và PR, và mỗi bước mất bao lâu.

Tôi sẽ tự nghiệm thu và merge trong Studio. Đừng merge PR thay tôi.
```

Vài phút sau, issue đến **In review**. Trong vài phút đó, đội Agent làm tất cả những việc sau: Agent điều phối giao bước cho một Agent giỏi thay đổi nhỏ, Agent này sửa file và mở PR. Sau đó Agent điều phối nhờ một model khác review PR, và khi review đạt, nó đính kèm báo cáo bàn giao và chuyển issue cho bạn nghiệm thu.

Mở issue, đọc báo cáo bàn giao và merge. Dự án thử không có kết quả kiểm tra, nên nút sẽ hiển thị **Merge anyway**. Khi đã merge, issue chuyển sang **Done**, và toàn bộ quy trình đã chạy trọn vẹn từ đầu đến cuối.

Sau đó bạn có thể xóa dự án thử. Với một hệ thống nghiệp vụ thật, hãy tạo dự án từ template ứng dụng NocoBase như hướng dẫn trong [Tạo dự án](new-project.md).

## Khi Agent bị kẹt

Xem nó dừng ở bước nào và đọc trang tương ứng, hoặc đưa thẳng trang đó cho Agent:

| Bước | Trang |
| --- | --- |
| Triển khai | [Cài đặt Studio](install.md) |
| Kết nối nền tảng lưu trữ mã | [Kết nối Git](git.md) |
| Kết nối runtime | [Kết nối runtime dùng chung](shared-runtimes.md) |
| Agent và Agent điều phối | [Bật Agent](agents.md) |
| Tạo và khởi tạo dự án | [Tạo dự án](new-project.md) |
| Preview và triển khai | [Kết nối CI](ci.md) |
| Yêu cầu thật đầu tiên | [Đi qua yêu cầu đầu tiên](first-request.md) |
