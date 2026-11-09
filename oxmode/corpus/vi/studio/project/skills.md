---
title: Skill
description: Áp dụng chung các cách làm về thiết kế, phát triển, rà soát và bàn giao cho các lượt chạy của agent.
---

Mỗi Skill có tệp `SKILL.md` và có thể kèm tệp tham chiếu hoặc script. Trường `name` xác định Skill, `description` giải thích khi nào dùng, còn phần nội dung mô tả cách thực hiện.

<a id="built-in-skills"></a>

## Skill tích hợp

| Skill | Mục đích |
| --- | --- |
| studio-workflow | Phân công, các bước thực hiện và điều kiện bàn giao |
| studio-development | Triển khai, kiểm chứng và xử lý lỗi |
| studio-approach | Đề xuất thiết kế |
| studio-review | Rà soát mã và phân loại mức độ nghiêm trọng |
| studio-comment-style | Bình luận và báo cáo bàn giao |

Bốn Skill đầu được gắn mặc định vào dự án mới. Skill về cách viết bình luận được gắn toàn cục. Có thể sửa Skill tích hợp, và các thay đổi đã lưu được giữ khi nâng cấp. Template ứng dụng NocoBase cũng có hướng dẫn phát triển Core.

![Duy trì Skill của nhóm và các phiên bản](https://static-docs.nocobase.com/studio-en-guide-skills-20261031.png)

<a id="create-and-update"></a>

## Tạo và cập nhật

Mở **Skills**, chọn **New skill**, viết `SKILL.md` rồi thêm tệp hỗ trợ. Cũng có thể nhập gói ZIP theo định dạng Agent Skills.

Lưu chỉnh sửa thành phiên bản mới. Có thể xem phiên bản trước và xuất dưới dạng ZIP. Tạo Skill cần quyền quản lý agent. Người tạo và quản trị viên có thể chỉnh sửa Skill. Người phụ trách dự án có thể gắn Skill hiện có vào dự án của mình.

<a id="set-the-scope"></a>

## Đặt phạm vi

| Phạm vi | Nơi cấu hình | Áp dụng cho |
| --- | --- | --- |
| Toàn cục | Tùy chọn gắn toàn cục trong chi tiết Skill | Mọi dự án |
| Dự án | Project settings › Default skills | Các lượt chạy trong dự án |
| Kho mã | Chọn kho mã trong Default skills | Các lượt chạy trong kho đó |

Các phạm vi được áp dụng cùng nhau. Với Skill trùng tên, phạm vi cụ thể hơn được ưu tiên. Tùy chọn tự động gắn vào dự án mới chỉ áp dụng cho dự án được tạo sau đó.

Ghi quy tắc riêng của nhóm, chẳng hạn kiểm thử bắt buộc, tiêu chí rà soát và bằng chứng bàn giao. Giữ mỗi Skill tập trung vào một loại công việc. Sau khi sửa, xem các lượt chạy và báo cáo tiếp theo để kiểm tra cách agent áp dụng.
