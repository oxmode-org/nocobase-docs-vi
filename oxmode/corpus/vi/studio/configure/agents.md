---
title: Cấu hình agent
description: Cấu hình mô hình khả dụng, trách nhiệm và agent điều phối.
---

Quản trị viên cấu hình đội ngũ trong **Agents**. Mỗi cặp công cụ lập trình và mô hình do môi trường chạy báo về có thể trở thành một agent. Để thiết lập ban đầu, xem [Cấu hình agent cho nhóm](../setup/agents.md).

![Trách nhiệm, môi trường chạy và mức suy luận của agent](https://static-docs.nocobase.com/studio-en-guide-agents-20261031.png)

<a id="define-responsibilities"></a>

## Xác định trách nhiệm

Chọn **Edit**, mô tả thế mạnh của agent và đặt mức suy luận. Agent điều phối dùng mô tả để phân công và giữ mức suy luận đã cấu hình.

| Công việc | Ví dụ mô tả |
| --- | --- |
| Thiết kế và rà soát | Đề xuất thiết kế, điều tra vấn đề khó và rà soát mã |
| Phát triển tính năng | Triển khai thường ngày, thay đổi qua nhiều mô-đun và tái cấu trúc mã |
| Thay đổi nhỏ | Sửa lỗi nhỏ, bổ sung kiểm thử và phân tích lỗi CI |

**Where it runs** liệt kê những môi trường cung cấp mô hình. Nếu agent chỉ khả dụng trên một môi trường chạy cá nhân, agent đó chỉ làm việc cho chủ sở hữu môi trường.

<a id="add-or-disable-agents"></a>

## Thêm hoặc tắt agent

Chọn **Add Agent**, chọn mô hình do môi trường chạy báo về rồi mô tả năng lực. Xử lý cảnh báo thiết lập hoặc phiên bản trên môi trường chạy, sau đó kiểm tra lại công cụ.

Tắt agent trong trang chỉnh sửa để ngừng giao công việc mới. Hiển thị danh sách agent đã tắt nếu muốn bật lại. Nếu thiếu mô hình, kiểm tra trạng thái đăng nhập của công cụ và kết nối của môi trường chạy.

<a id="configure-the-lead-agent"></a>

## Cấu hình agent điều phối

Mọi dự án dùng chung một agent điều phối. Mở **Settings** của agent điều phối ở đầu trang để đặt lựa chọn chính, lựa chọn dự phòng, nguyên tắc phân công và giới hạn lượt chạy trên mỗi đầu việc.

![Chọn agent điều phối và lựa chọn dự phòng](https://static-docs.nocobase.com/studio-en-guide-coordinator-20261031.png)

Lựa chọn dự phòng đang rảnh có thể tiếp nhận việc sau thời gian chờ đã cấu hình, mặc định là 120 giây. Nếu không có môi trường nào chạy được lựa chọn chính, Studio thử lựa chọn dự phòng ngay.

Nguyên tắc phân công xác định agent nào nhận việc. [Skill](../project/skills.md) của dự án quy định cách phát triển, rà soát và bàn giao. Xem [Cách nhóm agent làm việc](../reference/agent-execution.md).
