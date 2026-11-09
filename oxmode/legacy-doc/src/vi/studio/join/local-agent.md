---
title: Dùng Studio từ coding agent trên máy bạn
nav: Từ coding agent trên máy bạn
status: cần viết lại
description: Cài dòng lệnh nb-studio để Claude Code, Codex trong terminal của bạn giúp tra cứu dự án, tạo issue và phân tích vấn đề.
---

Trang này được dịch từ bản tiếng Trung của tài liệu gốc (bản tiếng Anh chính thức chưa có nội dung). Bản gốc vẫn đang được viết lại.

`nb-studio` là dòng lệnh của Studio. Sau khi cài và đăng nhập, Claude Code, Codex và các công cụ khác bạn dùng trong terminal có thể thao tác Studio dưới danh nghĩa của bạn: tra cứu issue, tạo issue, viết bình luận, đọc cơ sở tri thức.

Khác biệt với "Agent của tôi" trong [My sessions](../use/sessions.md): "Agent của tôi" là trò chuyện với Agent trên máy bạn ngay trong trang Studio; còn `nb-studio` thì bạn ở lại terminal, để Agent thao tác Studio qua dòng lệnh. Có thể dùng cả hai cùng lúc, và khi kết nối máy tính thì `nb-studio` cũng được cài sẵn.

## Cài đặt và đăng nhập

1. Ở góc trên bên phải Studio, bấm vào ảnh đại diện và chọn mục quản lý Studio bằng coding agent cục bộ.
2. Sao chép lệnh cấu hình được tạo trên trang và giao cho công cụ lập trình bạn hay dùng (như Claude Code, Codex).
3. Agent sẽ làm theo lệnh để:
   - kiểm tra Node.js 24 trở lên và npm, nếu thiếu thì hỏi ý bạn trước khi cài;
   - tải và cài `nb-studio` từ Studio của bạn;
   - chạy `nb-studio login --server <địa chỉ Studio>`, báo cho bạn địa chỉ đăng nhập và mã xác minh, rồi chờ bạn xác nhận trên trình duyệt;
   - chạy `nb-studio whoami` để xác nhận danh tính, và `nb-studio docs` để biết các lệnh có thể dùng;
   - chạy `nb-studio skills install` để cài cho công cụ lập trình các Skill dùng `nb-studio`.

Đường dẫn cài đặt trong lệnh cấu hình có hiệu lực trong 30 phút. `nb-studio` chỉ được cài từ chính Studio của bạn, nên phiên bản luôn khớp với Studio.

> [!NOTE] Quyền giống hệt bạn
> `nb-studio` làm việc dưới danh nghĩa của bạn, các lệnh dùng được tùy vào quyền của bạn trong Studio. Đăng nhập cần bạn xác nhận trên trình duyệt.

## Có thể nhờ nó làm gì

Sau khi cài, chỉ cần nói bằng ngôn ngữ tự nhiên với công cụ lập trình điều bạn muốn, nó sẽ gọi `nb-studio` để làm. Vài ví dụ:

```text
https://studio.example.com/main/issues/PUR-23
Phân tích giúp tôi issue này đang kẹt ở đâu và nên xử lý thế nào. Chỉ phân tích, không thay đổi gì.
```

```text
Xem trong Studio tôi có những issue nào đang chờ tôi xử lý, liệt kê theo mức độ khẩn cấp.
```

```text
Đọc docs/supplier-rating.md, tách các yêu cầu trong đó thành issue và tạo trong dự án "Quản lý nhà cung cấp", khoan bắt đầu làm.
```

```text
Tìm trong cơ sở tri thức quy định về phê duyệt mua hàng, cho tôi biết nhà cung cấp hạng C đặt hàng thì cần ai duyệt.
```

## Các lệnh thường dùng

Thường bạn không cần tự gõ lệnh, nhưng biết vài lệnh sẽ giúp hiểu Agent đang làm gì:

| Lệnh | Tác dụng |
| --- | --- |
| `nb-studio whoami` | Danh tính và quyền của phiên đăng nhập hiện tại |
| `nb-studio docs` | Mô tả các lệnh có thể dùng |
| `nb-studio <lệnh> --help` | Cách dùng chi tiết của một lệnh |
| `nb-studio issue get <issue>` | Đọc một issue |
| `nb-studio issue progress <issue>` | Issue đang chờ gì |
| `nb-studio issue comment add <issue>` | Bình luận trên một issue |
| `nb-studio follow-up list` | Các issue bạn phụ trách và theo dõi, và mỗi issue đang chờ gì |
| `nb-studio kb read <tài liệu>` | Đọc một tài liệu trong cơ sở tri thức |

Danh sách đầy đủ xem ở [Lệnh nb-studio](../reference/cli.md).
