---
title: API key
description: Các key mà CI, script và các hệ thống khác dùng để gọi Studio. Key của tổ chức không thuộc về ai và chỉ có các quyền được chọn cho nó. Key cá nhân hoạt động dưới danh nghĩa bạn.
---

Ở mọi nơi không có người bấm qua trình duyệt, như CI triển khai ứng dụng, một script tạo issue hàng loạt, hay một hệ thống khác đọc báo cáo, API key là cách chúng gọi Studio. Có hai loại:

| | API key của tổ chức | API key cá nhân |
| --- | --- | --- |
| Quản lý ở đâu | **Settings › API keys** | **Account settings › API keys** |
| Hoạt động dưới danh nghĩa | Chính nó. Nó không thuộc về ai, nên vẫn hoạt động khi người tạo rời đi | Bạn |
| Làm được gì | Chỉ những gì được chọn cho nó | Những gì bạn làm được, thu hẹp theo phạm vi được chọn. Khi bạn mất một quyền, key cũng mất quyền đó |
| Ai được tạo | Admin và Owner | Mọi thành viên, trừ khi tổ chức đã tắt key cá nhân |
| Phù hợp cho | CI và các tích hợp chạy lâu dài | Script của riêng bạn |

## Tạo key của tổ chức

1. Mở **Settings › API keys** và tạo key mới.
2. Nhập tên và mô tả, như "GitHub Actions deployment".
3. Chọn quyền. Bạn có thể **Start from a preset** rồi điều chỉnh:
   - **CI deployment**: tải lên bản phát hành và triển khai, có thể giới hạn cho vài ứng dụng.
   - Một preset CI chỉ tải lên bản phát hành mà không triển khai, cho CI không được tự triển khai.
   - **Read only**: đọc mọi thứ bạn đọc được.
4. Chọn thời điểm hết hạn, mặc định 90 ngày, hoặc **Never**.
5. Sao chép key khi đã tạo. Nó chỉ hiển thị một lần này và không xem lại được.

Quyền được nhóm theo lĩnh vực, như dự án, issue, Agent, runtime, ứng dụng, môi trường triển khai, cơ sở tri thức và báo cáo, mỗi lĩnh vực có các mức như đọc, ghi và quản lý, và một số có thể giới hạn cho các dự án hay ứng dụng cụ thể. Bạn chỉ cấp được các quyền mà chính bạn có, các mức bạn không có sẽ bị làm mờ.

## Những gì key không làm được

Dù quyền rộng đến đâu:

- Key không thể tạo, xoay vòng hay thu hồi key. Chỉ người đã đăng nhập mới quản lý được key.
- Key không thể thay đổi hay xóa ứng dụng, hoặc triển khai thẳng lên môi trường được bảo vệ. Chúng chỉ có thể yêu cầu triển khai để người duyệt duyệt.
- Các endpoint đằng sau hộp thư, thông báo, kết nối với nền tảng lưu trữ mã và quản lý tài khoản không chấp nhận key.

Ở mọi nơi key đã làm gì đó, tên của nó xuất hiện tại đó, được đánh dấu là API key.

## Xoay vòng, tắt và xóa

- **Rotate**: key mới giữ nguyên tên, quyền và thời hạn, còn key cũ ngừng hoạt động ngay. Hãy đưa giá trị mới vào cài đặt secret của CI.
- **Disable**: key ngừng hoạt động ngay, và bạn có thể bật lại khi cần.
- **Delete**: thu hồi key. Những gì nó đã làm vẫn hiển thị tên của nó.

Mỗi key của tổ chức có **History**: ai đã tạo, đổi tên, đổi quyền, xoay vòng, tắt hoặc xóa nó, và vào lúc nào.

## Key CI của repository

Khi bạn thiết lập CI cho một repository, Studio tạo một key của tổ chức tên "<repository> CI", đánh dấu "Managed by <repository>", với quyền giới hạn trong các ứng dụng của repository đó. Về nhắc nhở hết hạn và cách xoay vòng, xem [Kết nối CI](../setup/ci.md). Nếu bạn tắt hoặc xóa nó ở đây, CI sẽ ngừng triển khai, và trưởng dự án được thông báo.

## Tắt key cá nhân

Nếu không muốn thành viên tự tạo key, hãy bỏ "Create API keys of one’s own" khỏi các vai trò liên quan trong **Settings › Roles**. Các key đã có vẫn xem và thu hồi được.
