---
title: Phát triển ứng dụng đầu tiên
description: Tạo và chạy ứng dụng NocoBase, phát triển chức năng quản lý khách hàng cùng agent, kiểm tra quyền rồi tiếp tục hoàn thiện.
---

Tạo ứng dụng NocoBase trong thư mục rỗng, rồi cùng agent thêm chức năng quản lý khách hàng. Lưu khách hàng, nhân viên kinh doanh phụ trách và ngày theo dõi, với quyền theo vai trò. Khi hoàn tất, có thể đăng nhập, dùng tính năng và tiếp tục phát triển.

<a id="prepare-the-environment"></a>

## Chuẩn bị môi trường

- Node.js 24 trở lên và pnpm 11.
- Trên Windows, dùng WSL. Chạy lệnh dưới đây trong shell POSIX như Bash.

Các bước dùng SQLite và không cần máy chủ cơ sở dữ liệu riêng. Để dùng hệ khác, xem [Tạo ứng dụng với cơ sở dữ liệu khác](../core/reference/database-configuration.md).

Chọn để agent tạo ứng dụng hoặc tự chạy lệnh.

<a id="create-and-start-the-application"></a>

## Tạo và khởi động ứng dụng

<a id="create-with-an-agent"></a>

### Tạo cùng agent

Cài Skill tạo ứng dụng và chọn agent khi được hỏi:

```bash
npx skills@latest add nocobase/skills-v3 --skill nocobase-create-app -g
```

Nếu agent đang mở, tạo phiên mới để agent đọc Skill vừa cài. Mở agent trong thư mục rỗng như `my-app`, rồi gửi prompt sau để yêu cầu tạo và chạy ứng dụng:

```prompt
Create a NocoBase 3 application for local development in this empty directory, using the default template and SQLite.
Start it and tell me the URL and the initial sign-in details.
```

Agent tạo ứng dụng, sinh cấu hình, khởi động rồi cung cấp URL và thông tin đăng nhập ban đầu.

<a id="run-the-commands-yourself"></a>

### Tự chạy lệnh

Chạy ở nơi muốn lưu ứng dụng. Công cụ tạo thư mục `my-app` mới và cài dependency:

```bash
PNPM_CONFIG_MINIMUM_RELEASE_AGE=0 pnpm create @nocobase/app@beta my-app --template-tag=beta
```

NocoBase 3 đang ở giai đoạn beta. `PNPM_CONFIG_MINIMUM_RELEASE_AGE=0` cho phép pnpm cài phiên bản mới phát hành chỉ trong lần chạy lệnh này.

Vào thư mục, tạo cấu hình, kiểm tra rồi khởi động:

```bash
cd my-app
pnpm nocobase config init --dialect sqlite
pnpm nocobase config check
pnpm dev
```

- `config init` sinh `config.yml` cục bộ và bí mật ứng dụng. SQLite dùng ngay mà không cần cài máy chủ riêng. Giữ `config.yml` ngoài Git.
- `config check` nạp cấu hình như lúc khởi động và đề xuất cách sửa nếu phát hiện vấn đề.
- `pnpm dev` chạy máy chủ phát triển và in URL `Local:` khi sẵn sàng. Giữ terminal mở để ứng dụng tiếp tục chạy.

<a id="sign-in"></a>

### Đăng nhập

Mở URL và đăng nhập bằng quản trị viên mặc định `nocobase` với mật khẩu `admin123`.

- **Nếu dùng agent**, mở URL agent cung cấp.
- **Nếu tự chạy lệnh**, mở URL `Local:` được in trong terminal.

Giữ nguyên đường dẫn ứng dụng trong URL, chẳng hạn `/main/`.

Sau khi đăng nhập, trang chủ liệt kê khả năng tích hợp sẵn và ví dụ yêu cầu để gửi cho agent:

![Trang chủ ứng dụng mới tạo, trước khi bổ sung tính năng nghiệp vụ](/assets/core/tutorials/getting-started/home.png)

Ảnh chụp từ ứng dụng ví dụ dùng template mặc định `1.0.0-beta.78`. Giao diện có thể khác tùy phiên bản đã cài.

<a id="describe-your-first-business-requirement"></a>

## Mô tả yêu cầu nghiệp vụ đầu tiên

Mở agent tại thư mục gốc của ứng dụng vừa tạo rồi gửi prompt sau:

```prompt
Build customer management with a name, contact details, notes, sales owner and next follow-up date. Customer statuses are Lead, Following up and Won.
Support creating, viewing, editing and deleting customers, searching by name and filtering by status.
Sales managers can manage all customers. Sales reps can only view their own customers and update their status. Read-only users can view all customers but cannot make changes.
```

Tập trung mô tả nghiệp vụ, gồm thông tin cần lưu, thao tác khả dụng và người có quyền thực hiện. Agent làm theo Skill của dự án để xử lý người dùng, quyền, bản dịch, kiểm thử và báo cáo hoàn thành.

<a id="confirm-the-design"></a>

## Xác nhận thiết kế

Trước khi triển khai, agent trình thiết kế để xác nhận, gồm cấu trúc trang, tương tác chính và các quyết định cần anh chốt. Trả lời các câu hỏi và xác nhận thiết kế để agent bắt đầu phát triển.

<a id="check-features-and-permissions"></a>

## Kiểm tra tính năng và quyền

Khi phát triển xong, agent chạy kiểm thử, kiểm tra ứng dụng trong trình duyệt và chụp ảnh. Báo cáo nêu công việc đã làm và các mục chưa xác minh. Nếu cần đăng nhập để kiểm tra, agent yêu cầu người dùng tự đăng nhập.

Mở URL agent cung cấp. **Customers** xuất hiện ở thanh bên. Có thể tạo khách hàng, gán người phụ trách và ngày theo dõi, cập nhật trạng thái, tìm kiếm và lọc:

![Danh sách khách hàng có trạng thái, người phụ trách, ngày theo dõi và phân trang](/assets/core/tutorials/crm/customer-list-en.png)

Ảnh lấy từ ứng dụng ví dụ. Cùng một yêu cầu có thể tạo bố cục khác nhau ở mỗi lần triển khai.

Agent cũng bật quản lý người dùng và quyền. Thử quyền của nhân viên kinh doanh:

1. Thêm người dùng trong **System settings → Users** và gán vai trò kinh doanh trong **Permission sets**. Ứng dụng ví dụ gọi vai trò này là `Sales rep`.
2. Tạo khách hàng và chọn người dùng này làm người phụ trách.
3. Đăng nhập bằng tài khoản đó. Danh sách chỉ hiện khách hàng của người dùng này. Người dùng có thể đổi trạng thái, còn sửa chi tiết và xóa cần quyền khác.

Kiểm tra thêm bằng tài khoản quản lý kinh doanh và chỉ đọc. Quản lý phải quản lý được mọi khách hàng. Tài khoản chỉ đọc xem được mọi khách hàng và bị chặn khi tạo, sửa hoặc xóa. Hoàn thành các mục còn thiếu trong báo cáo trước khi thêm tính năng.

<a id="refine-and-continue-developing"></a>

## Hoàn thiện và tiếp tục phát triển

Nếu kết quả sai hoặc cần thay đổi, nói với agent anh đã làm gì, điều gì xảy ra và kết quả mong đợi:

```prompt
I signed in with an account assigned only the sales rep role, but I can still see customers owned by other people.
Sales reps should only see their own customers.
```

Có thể yêu cầu đổi tương tác, chẳng hạn bấm tên để mở chi tiết khách hàng rồi mới quyết định có sửa hay không.

Tiếp theo, thêm bản ghi theo dõi khách hàng trong phiên agent ở thư mục gốc:

```prompt
Add follow-up records to customers. After each contact, a sales rep records the date, method (phone, visit, or email), and notes.
Show follow-up records in the customer details, newest first.
Sales reps can only add follow-ups for their own customers. Sales managers can view all records. Read-only users can only view them.
Existing customers don't need historical follow-up records added.
```

Xác nhận thiết kế rồi kiểm tra bằng tài khoản nhân viên, quản lý và chỉ đọc. Chia yêu cầu lớn thành tính năng có thể dùng độc lập như theo dõi, cơ hội, báo giá và báo cáo bán hàng. Kiểm tra từng phần trước khi tiếp tục.

Yêu cầu agent lưu quy ước lâu dài, chẳng hạn “Từ giờ dùng múi giờ của công ty cho mọi ngày tháng và lưu quy tắc này vào quy ước dự án.” Các quy tắc nằm trong `.agents/rules/` và được `AGENTS.md` lập chỉ mục cho phiên sau.

Xem [mã nguồn CRM mẫu](https://github.com/nocobase/docs-examples-v3/tree/8ad953049469ab6b1e703be2a1b07f80f28ed592/apps/crm) và [README](https://github.com/nocobase/docs-examples-v3/blob/8ad953049469ab6b1e703be2a1b07f80f28ed592/apps/crm/README.MD). Tra [Cấu trúc dự án](../core/developing-apps/project-structure.md) để tìm mã hoặc [Lộ trình học](learning-path.md) về phát triển, triển khai và cộng tác.
