---
title: Cơ sở tri thức
description: Cơ sở tri thức chứa tài liệu nghiệp vụ. Đưa bối cảnh yêu cầu, quy định và quy tắc nghiệp vụ vào đó, Agent sẽ đọc khi làm việc, nên bạn không phải giải thích lại bối cảnh khi đổi người, đổi Agent hay có yêu cầu mới.
---

Cơ sở tri thức chỉ chứa những gì con người viết và tải lên, Agent đọc nhưng không ghi vào. Những gì Agent học được khi làm việc được ghi vào [bộ nhớ dự án](project-memory.md), còn cách làm việc được ghi vào [Skill](skills.md).

## Tri thức hệ thống và tri thức dự án

| | Chứa gì | Ai quản lý |
| --- | --- | --- |
| Tri thức hệ thống (system knowledge) | Tài liệu dùng chung giữa các dự án, như chính sách phê duyệt mua hàng của công ty và các quy ước kỹ thuật chung | Quản trị viên |
| Tri thức dự án (project knowledge) | Mỗi dự án một không gian, cho tài liệu nghiệp vụ của dự án đó | Trưởng dự án |

Tri thức dự án bao gồm cả tri thức hệ thống: trong một dự án, con người và Agent thấy cả hai.

**Development › Knowledge** gom mọi không gian bạn truy cập được, còn mục **Knowledge** của một dự án chỉ hiển thị của dự án đó. Tìm kiếm bao trùm mọi không gian bạn truy cập được, và mỗi kết quả cho biết nó thuộc dự án và thư mục nào.

## Thêm vào cơ sở tri thức

Chọn không gian hoặc thư mục trước, rồi tạo:

- **Articles** (bài viết): viết ngay trong Studio, bằng Markdown.
- **Files** (tệp): tải lên quy định, bảng tính, tài liệu, v.v. Nội dung chữ được trích xuất từ các file PDF, Word, Excel, PowerPoint, CSV, văn bản thuần, Markdown và JSON để tìm kiếm và để Agent đọc. Chữ trong hình ảnh không được nhận dạng. File gốc được giữ lại và có thể tải về.
- **Folders** (thư mục): tối đa bốn cấp.

Mỗi lần lưu là một phiên bản mới, và bạn có thể xem lại các phiên bản trước. Bài viết đã được đọc và xác nhận có thể đánh dấu là đã kiểm chứng. Lưu trữ những gì không còn dùng: nội dung đã lưu trữ không xuất hiện trong tìm kiếm, và bạn có thể khôi phục khi cần.

> [!TIP] Điều gì đáng ghi lại
> Thông tin nghiệp vụ mà Agent không thấy được trong mã: quy tắc nghiệp vụ và lý do đằng sau, ý nghĩa của các thuật ngữ, cách xử lý ngoại lệ, và các quyết định quan trọng đã đưa ra.

## Tệp từ issue

Khi bạn đính kèm một tệp vào yêu cầu, như bảng chấm điểm nhà cung cấp, Agent có thể đề xuất lưu nó vào cơ sở tri thức sau khi dùng. Một thẻ xuất hiện trên issue hỏi có lưu tệp vào cơ sở tri thức không. Bạn có thể lưu vào tri thức dự án hoặc tri thức hệ thống, hoặc bấm **No thanks**.

Chỉ người đã tải tệp lên hoặc người phụ trách issue mới lưu được, và chỉ khi có quyền sửa trên không gian sẽ lưu vào.

## Ai được đọc và sửa gì

Mỗi không gian, thư mục, bài viết và tệp đều có thể có quyền riêng, ở bốn mức:

| Quyền | Cho phép |
| --- | --- |
| Read | Xem và tìm kiếm |
| Propose | Đề xuất thay đổi, người có quyền quản lý sẽ chấp nhận hoặc từ chối trong hộp thư của họ |
| Edit | Sửa trực tiếp |
| Manage | Quyết định ai được đọc và sửa |

Bạn có thể cấp quyền cho một người, một vai trò, các thành viên dự án, hoặc trưởng dự án. Mặc định, thư mục hoặc tài liệu kế thừa quyền của cấp trên và bổ sung quyền riêng. Nó cũng có thể chỉ dùng quyền riêng của mình, ví dụ để bảng giá chỉ hiển thị cho trưởng phòng mua hàng.

Trưởng dự án quản lý không gian tri thức của dự án mình, còn quản trị viên quản lý mọi không gian. Mặc định, thành viên được đọc và đề xuất, và được sửa trong các dự án mình làm trưởng.

## Agent dùng cơ sở tri thức thế nào

- Khi làm một issue, Agent nhận các tri thức liên quan dưới dạng tệp đặt cạnh thư mục làm việc và đọc những gì cần.
- Trong một phiên, Agent tìm kiếm trong cơ sở tri thức và cho biết đang trích dẫn phần nào.
- Agent chỉ đọc được những gì người bắt đầu công việc đọc được, theo cùng các quyền đó.
