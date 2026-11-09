---
title: Cơ sở tri thức
description: Tích hợp không gian, phiên bản tài liệu, tìm kiếm, phân quyền và duyệt thay đổi.
---

## Năng lực

`@nocobase/app-plugin-knowledge` cung cấp không gian, thư mục, bài viết Markdown, tệp, phiên bản, tìm kiếm và đề xuất thay đổi. Các chức năng quản lý tri thức cơ bản có thể chạy độc lập với Agents và lập chỉ mục ngữ nghĩa. Ứng dụng xác định bên sở hữu và quyền truy cập từng không gian.

## Tình huống và ví dụ

### Duyệt thay đổi tài liệu của nhóm

1. Cấu hình không gian của nhóm cùng quyền đọc, đề xuất và sửa.
2. Thành viên đề xuất cập nhật bài viết. Người biên tập xem nội dung thay đổi và phiên bản gốc.
3. Chấp nhận hoặc từ chối đề xuất. Khi chấp nhận, hệ thống tạo phiên bản mới.
4. Kiểm tra lịch sử, tìm kiếm và việc cách ly người dùng thiếu quyền.

`knowledge.proposals: false` tắt luồng đề xuất và giữ lịch sử. Chỉnh sửa trực tiếp vẫn kiểm tra quyền. Chủ thể thực thi thay mặt người dùng chỉ có thể gửi đề xuất trong phạm vi được cấp, không thể sửa trực tiếp hoặc quyết định đề xuất.

**Prompt phát triển** cho Coding Agent trong thư mục ứng dụng.

```text
Dùng Knowledge để thêm không gian nhóm và quy trình duyệt thay đổi tài liệu.
Gắn KnowledgeAccessResolver để xác định không gian nhóm được phép thấy và các
quyền read, propose, edit, manage. Dùng lại trang hoặc chế độ xem để thành viên
gửi đề xuất và người biên tập duyệt theo phiên bản gốc. Bắt đầu với tìm kiếm
văn bản. Kiểm thử cách ly nhóm, xung đột chỉnh sửa, chấp nhận đề xuất và lỗi
trích xuất nội dung.
```

**Xong khi** thành viên gửi được đề xuất, chấp nhận tạo phiên bản mới và nhóm khác bị từ chối khi đọc trực tiếp hoặc tìm kiếm.

## Nguyên tắc và triển khai

Áp dụng theo cấu trúc tệp thực tế của ứng dụng.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Kết quả |
| --- | --- | --- |
| Trình phân giải quyền Server | Gắn `knowledgeAccessToken` và phân giải quyền không gian, nút | Người dùng thấy các không gian nhóm được phép |
| Route Client hoặc trang nghiệp vụ | Đăng ký trang hoặc nhúng `KnowledgeView` | Có tài liệu, thư mục, phiên bản và đề xuất |
| Cấu hình chỉ mục tùy chọn và Jobs | Ghép cấu hình lập chỉ mục và quyền quản trị riêng | Có thêm tìm kiếm ngữ nghĩa và vẫn giữ tìm kiếm văn bản |

### Không gian và quyền

Đăng ký cả hai runtime rồi áp dụng migration. Gắn `KnowledgeAccessResolver` qua `knowledgeAccessToken` từ `/server/tokens` để định nghĩa không gian hợp lệ, cách kế thừa và quyền đọc. Cấu hình resolver trước khi cung cấp không gian.

Không gian dùng `scope` và `scopeId`. Ứng dụng chỉ liệt kê các không gian người dùng được phép truy cập.

| Cấp quyền | Năng lực |
| --- | --- |
| `read` | Đọc tài liệu và tệp được phép |
| `propose` | Gửi thay đổi để duyệt |
| `edit` | Sửa nội dung và quyết định đề xuất đủ điều kiện |
| `manage` | Quản lý quyền không gian và nút |

Nút có thể kế thừa hoặc dùng quyền tùy chỉnh. Khi mở trang, tiếp tục kiểm tra quyền trên từng không gian.

### Trang và nội dung

`knowledge()` mặc định đăng ký `/knowledge` và nhận `path` cùng `space`. Để nhúng vào trang nghiệp vụ, dùng `knowledge({ routes: false })` rồi ghép `KnowledgePage` hoặc `KnowledgeView` từ `/client/pages`.

Người dùng có thể quản lý thư mục và Markdown, xem phiên bản và khôi phục nội dung. Yêu cầu cập nhật kèm phiên bản dự kiến. Khi xung đột, đối chiếu với nội dung mới nhất.

Tải tệp lên cần thêm Files và Drive. Hệ thống trích xuất văn bản từ định dạng được hỗ trợ và hiển thị trạng thái xử lý. Ảnh và tài liệu scan cần OCR riêng để có văn bản tìm kiếm được.

### Tìm kiếm và lập chỉ mục ngữ nghĩa

Tìm kiếm cơ bản khớp nội dung tài liệu hiện tại và văn bản đã trích xuất. Có thể bật thêm tìm kiếm ngữ nghĩa. Knowledge quản lý chỉ mục toàn cục riêng. Agents có thể cung cấp cổng Embedding, còn các Collection vector của Agents được quản lý riêng.

Ghép `defineKnowledgeConfig()` từ `/config`, cấu hình instance chỉ mục, quyền truy cập mô hình và Jobs của host, rồi tích hợp nút quản lý chỉ mục. Quản trị chỉ mục dùng quyền `settings:kb.indexing` riêng. Tìm kiếm văn bản vẫn hoạt động khi chỉ mục chưa sẵn sàng hoặc đang dựng lại.

Kiểm tra cách ly, xung đột phiên bản, lỗi trích xuất, duyệt đề xuất và ranh giới tìm kiếm. Xem [Agent](agents.md), [Tệp](../data-and-files/file-management.md) và [Quản lý plugin](../../developing-apps/manage-plugins.md).

## Ràng buộc phát triển với AI và kiểm chứng

- Áp dụng quyền trên danh sách không gian, tài liệu và tìm kiếm. Kiểm tra quyền không gian sau khi cho phép truy cập trang.
- Gửi phiên bản dự kiến và giải quyết xung đột dựa trên nội dung mới nhất.
- Kiểm tra điều kiện đề xuất, tìm kiếm qua nhiều không gian và lỗi trích xuất. Hiển thị đúng trạng thái với nội dung scan chưa được hỗ trợ.

Yêu cầu Agent báo thay đổi thực tế, bước kiểm tra đã chạy và mục chưa kiểm chứng. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md).

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-knowledge)
