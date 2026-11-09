---
title: Kết nối runtime dùng chung
description: Cài một runner trên server hoặc máy ảo của nhóm và kết nối với Studio. Các công cụ lập trình cài ở đó sẽ tham gia đội Agent và chạy issue của mọi người.
---

Runtime là máy nơi Agent làm việc. Runtime dùng chung giúp đội Agent làm việc suốt ngày đêm. Kết nối runtime cần quyền quản trị viên. Để kết nối một máy của riêng bạn, xem [Kết nối runtime cá nhân](../join/personal-runtime.md).

## Chuẩn bị máy

| Thứ cần có | Yêu cầu |
| --- | --- |
| Hệ điều hành | macOS hoặc Linux. Trên Windows, chạy trong Ubuntu trên WSL |
| Phần mềm cơ bản | Node.js 24 trở lên, và Git. Dự án dùng template ứng dụng NocoBase còn cần pnpm, có thể bật bằng corepack đi kèm Node.js: `corepack enable` |
| Công cụ lập trình | Cài và đăng nhập theo cách chính thức, ví dụ Claude Code và Codex, bằng user hệ thống chạy runner. Hãy có công cụ của hai nhà cung cấp để việc review có thể giao cho model của nhà cung cấp khác |
| CLI của nền tảng lưu trữ mã | Agent dùng để mở PR: `gh` cho GitHub, `glab` cho GitLab, `gitee` cho Gitee |
| Trình duyệt | Khi Agent thay đổi giao diện, chúng chụp màn hình trong ứng dụng đang chạy cho báo cáo bàn giao. Runtime phải chạy được Chromium. Trên Linux, cài nó cùng các dependency hệ thống, ví dụ `npx playwright install --with-deps chromium` |
| Truy cập mạng | Máy truy cập được địa chỉ của Studio, và mỗi công cụ lập trình truy cập được dịch vụ model của nó |

> [!WARNING] Runner không phải ranh giới bảo mật
> Trên máy này, Agent làm việc dưới quyền user hệ thống chạy runner và có thể đọc, ghi mọi thứ user đó truy cập được, kể cả SSH key và các thông tin xác thực khác. Hãy dùng một user hệ thống riêng, container hoặc máy ảo, và đừng chạy dưới cùng user với chính Studio.

## Thêm runtime

1. Mở **Agent management › Runtimes** và bấm **Add runtime**.
2. Ở **Usage scope**, chọn **Shared**: runtime chạy tác vụ do bất kỳ người dùng nào bắt đầu và nhận biến cùng khóa bí mật của họ.
3. Ở **Coding tools**, chọn các công cụ bạn muốn dùng trên máy này. Chỉ công việc của các công cụ đã chọn mới được gửi đến đây.
4. **Max concurrent runs** là số phần việc máy chạy cùng lúc, mặc định là 3. Đặt cho phù hợp với tài nguyên máy và hạn mức model. Với các công cụ mà gói thuê bao cho phép ít phiên hơn, đặt giới hạn riêng trong **Advanced: limits per coding tool**.
5. Bấm **Generate install command** và chọn hệ điều hành của máy.

Bạn có thể đổi công cụ và mức đồng thời sau trong chi tiết runtime.

::figure qs-add-runtime | Thêm một runtime dùng chung

## Cài đặt trên máy

Có hai cách cài. Dùng cách nào cũng được.

**Prompt.** Sao chép toàn bộ prompt trong hộp thoại vào một công cụ lập trình trên máy đó, như Claude Code. Nó kiểm tra Node.js và các công cụ lập trình, chạy lệnh đăng ký, cài runner làm dịch vụ nền, xử lý các vấn đề thường gặp như PATH, proxy và quyền của npm, và cuối cùng cho bạn biết những bước đăng nhập hay cài đặt mạng nào bạn vẫn cần tự làm.

**Thủ công.** Bằng user hệ thống sẽ chạy Agent, chạy lệnh trong hộp thoại trên máy, ví dụ:

```bash
curl -fsSL https://studio.example.com/main/api/agents/dist/installScript | sh -s -- --runner --server https://studio.example.com/main --token <one-time credential>
```

Lệnh này tải runner `nocobase-runner` và CLI `nb-studio` từ Studio của bạn, đăng ký runner và đặt nó tự khởi động sau khi đăng nhập. Nếu `nocobase-runner` đã được cài trên máy, hãy dùng lệnh `nocobase-runner register` trong hộp thoại thay thế.

**Windows.** Chạy `wsl --install` trong PowerShell trước và khởi động lại Windows. Sau đó mở Ubuntu và chạy lệnh dành cho Linux. Node.js và các công cụ lập trình đều cài bên trong Ubuntu trên WSL. Nếu WSL không truy cập được internet, hãy bật chế độ mạng mirrored của WSL.

Prompt và lệnh mang một thông tin xác thực dùng một lần, chỉ dùng được một lần. Hộp thoại cho biết khi nào nó hết hạn, thường trong vài phút. Nếu hết hạn, hãy tạo cái mới. Chỉ đưa prompt cho công cụ lập trình trên máy đó và không bao giờ chuyển cho người khác.

## Kiểm tra kết nối

Trong vài giây, runtime xuất hiện trong danh sách với trạng thái **Online** kèm số lượt chạy đang diễn ra, như "Online 0/3", cùng trạng thái của từng công cụ lập trình bạn đã chọn:

| Trạng thái | Ý nghĩa | Cần làm gì |
| --- | --- | --- |
| Signed in | Sẵn sàng nhận việc | Không cần gì |
| Login required | Đã cài nhưng chưa đăng nhập | Trên máy, đăng nhập công cụ bằng user hệ thống chạy runner, rồi bấm **Detect again** trong chi tiết |
| Not installed | Không tìm thấy công cụ | Cài nó. Nếu đã cài mà vẫn báo chưa cài, xem phần Xử lý sự cố bên dưới |

**Xong khi**: runtime trực tuyến và các công cụ lập trình bạn muốn hiển thị **Signed in**. Lúc này **Agent management › Agents** sẽ liệt kê Agent cho các model phổ biến, và bạn có thể thêm model khác bằng **Add agent**. Tiếp theo, [bật Agent](agents.md).

## Quản lý runtime

Bấm vào một runtime trong danh sách để mở chi tiết:

- **General**: tên, số lượt chạy đồng thời tối đa và phạm vi sử dụng.
- **Tools**: mỗi công cụ lập trình có đang bật không, trạng thái, hạn mức, và được chạy bao nhiêu lượt cùng lúc. Công việc của công cụ đang tắt sẽ không được gửi đến đây.
- **Local policy**: những công việc mà chủ máy cho phép máy nhận, được đặt trên chính máy đó. Studio chỉ hiển thị.
- **Variables from this machine**: các biến mà máy có thể cung cấp cho lượt chạy. Chỉ tên được hiển thị, còn giá trị ở lại trên máy. Đặt bằng `nocobase-runner env set NAME`.
- **Workspaces** và **Runs**: các thư mục issue trên máy này và các lượt chạy nó đã thực hiện.

Runner tự nâng cấp khi không có Agent nào đang chạy. Để nâng cấp ngay, chạy `nocobase-runner update` trên máy.

Khi ngừng dùng một runtime, hãy thu hồi thông tin xác thực của nó trước. Runner dừng ở yêu cầu tiếp theo, và công việc nó đang giữ quay lại hàng đợi. Sau khi thu hồi, bạn có thể xóa nó, và lịch sử lượt chạy được giữ lại. Muốn kết nối lại thì thêm lại từ đầu.

## Xử lý sự cố

**Runtime hiển thị ngoại tuyến.** Runner không liên lạc với Studio trong 150 giây sẽ hiển thị ngoại tuyến, và công việc của nó quay lại hàng đợi để runtime khác nhận. Chạy `nocobase-runner status` trên máy để chắc chắn runner đang chạy và máy truy cập được địa chỉ Studio.

**Công cụ đã cài nhưng vẫn báo chưa cài.** PATH của dịch vụ nền không có công cụ đó. Trong một terminal mà `which claude` hoặc `which codex` chạy được, chạy lại `nocobase-runner service install`, rồi khởi động lại dịch vụ.

**Tải runner bị lỗi.** Nếu cần proxy, hãy cấu hình cho cả việc tải và dịch vụ nền. Nếu npm thiếu quyền cài toàn cục, hãy dùng một thư mục cài đặt thuộc user của bạn hoặc một trình quản lý phiên bản Node, thay vì `sudo npm install`.
