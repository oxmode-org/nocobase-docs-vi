---
title: Skill
description: Skill lưu cách nhóm bạn làm việc. Viết chuẩn phát triển, các điểm cần review và các bước test thành Skill, gắn chúng ở phạm vi toàn cục, dự án hoặc repository, và Agent sẽ tuân theo ở mọi lượt chạy, dù người hay Agent nào làm.
---

Một Skill là một file `SKILL.md`, có thể kèm vài file hỗ trợ, theo cùng định dạng mà Claude Code và Codex dùng. `name` ở đầu file là tên của Skill, còn `description` cho Agent biết khi nào cần đọc nó.

## Skill có sẵn

Studio có sẵn năm Skill quy định cách đội Agent làm việc:

| Skill | Quy định gì | Mặc định gắn vào |
| --- | --- | --- |
| studio-workflow | Cách Agent điều phối chia việc thành các bước, ai nhận từng bước, khi nào cần kế hoạch trước, review diễn ra thế nào, và khi nào công việc sẵn sàng bàn giao | Dự án mới |
| studio-development | Cách Agent thực thi làm một bước: thiết kế, kiểm tra, xử lý lỗi CI và bàn giao | Dự án mới |
| studio-approach | Cách viết một kế hoạch | Dự án mới |
| studio-review | Cách review một PR: xem gì, phân loại phát hiện thế nào, và điều gì chặn việc merge | Dự án mới |
| studio-comment-style | Cách viết bình luận và báo cáo bàn giao. Các mục của báo cáo bàn giao đến từ đây | Toàn cục |

Bạn có thể điều chỉnh các Skill có sẵn theo cách nhóm làm việc. Thay đổi của bạn được lưu trong Studio, và nâng cấp Studio không ghi đè chúng.

Repository khởi tạo từ template ứng dụng NocoBase còn đi kèm các chuẩn phát triển của Core, Agent đọc chúng khi làm việc trong repository.

## Tạo và sửa Skill

Trong **Agent management › Skills**:

- **New skill**: viết `SKILL.md`, và thêm file ngay hoặc sau. Bạn cũng có thể **Import** một file zip được tổ chức theo định dạng thư mục Agent Skills.
- **Edit**: bấm **Edit**, sửa, rồi bấm **Save new version**, có thể kèm ghi chú về những gì thay đổi. Mỗi lần lưu là một phiên bản mới, và bạn có thể xem, xuất các phiên bản cũ.
- **Export**: xuất một phiên bản thành file zip để dùng ở nơi khác.

Tạo Skill cần quyền quản lý Agent, thường là quản trị viên. Người tạo Skill và quản trị viên được sửa nó, còn trưởng dự án có thể gắn các Skill có sẵn vào dự án của mình. Xóa một Skill sẽ gỡ nó khỏi mọi nơi đang gắn.

## Gắn ở đâu

Khi một Skill đã được gắn, mọi lượt chạy ở đó đều mang theo nó. Có ba phạm vi:

| Phạm vi | Đặt ở đâu | Áp dụng cho |
| --- | --- | --- |
| Toàn cục | **Global attachment** trong chi tiết Skill | Mọi dự án |
| Dự án | **Project settings › Default skills**, chọn **The whole project** | Mọi lượt chạy trong dự án này |
| Repository | **Project settings › Default skills**, chọn một repository | Các lượt chạy trong repository đó |

Skill từ cả ba phạm vi cộng dồn với nhau. Khi hai Skill trùng tên, phạm vi cụ thể hơn được ưu tiên.

Bật **Attach to new projects automatically** trong chi tiết Skill, và các dự án tạo từ đó trở đi sẽ tự động có nó. Các dự án đã có vẫn giữ nguyên.

## Mẹo viết Skill

- Mỗi Skill chỉ nói về một chủ đề, và viết `description` nói rõ khi nào dùng để Agent biết khi nào cần đọc.
- Ghi lại những gì đặc thù của nhóm, như quy tắc đặt tên, các kiểm tra bắt buộc phải chạy, và các thư mục không được thay đổi. Kiến thức lập trình chung thì không cần ghi.
- Sau khi thay đổi, hãy xem hoạt động và báo cáo bàn giao của vài issue tiếp theo để chắc Agent tuân theo.
