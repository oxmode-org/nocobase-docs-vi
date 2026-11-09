---
title: Kiểm tra và rà soát
description: Theo dõi kết quả kiểm tra, rà soát của agent và điều kiện hợp nhất.
---

Trước khi bàn giao, agent điều phối sắp xếp kiểm chứng và rà soát mã theo các Skill của dự án. Người phụ trách đầu việc đọc báo cáo và quyết định có hợp nhất hay không.

<a id="follow-checks"></a>

## Theo dõi kết quả kiểm tra

Mở **Code & previews** trên đầu việc để xem nguồn kiểm tra, kết quả và liên kết log của từng PR. Kho mã xác định nguồn là CI của nền tảng lưu trữ mã, CI bên ngoài hoặc agent tự kiểm tra. Xem [Kiểm tra và CI](../configure/checks.md).

![Kết quả kiểm tra PR trên đầu việc](https://static-docs.nocobase.com/studio-en-guide-checks-20261031.png)

Trong **Project settings › Code repositories › Branch rules**, cấu hình:

- Có kích hoạt agent điều phối khi kiểm tra bắt buộc thất bại hay không.
- Có chuyển sang bước tiếp theo khi kiểm tra đạt hay không.
- Có khởi động việc xử lý khi PR xung đột hay không.
- Bước kiểm tra nào chỉ mang tính tham khảo, để vẫn có thể hợp nhất bình thường trong Studio.

Các bước còn lại là bắt buộc. Quy tắc bảo vệ nhánh của nền tảng mã vẫn áp dụng. Nếu tắt kích hoạt tự động, bình luận trên đầu việc để yêu cầu agent điều phối tiếp tục.

<a id="arrange-review"></a>

## Tổ chức rà soát

Quy trình mặc định ưu tiên agent rà soát phù hợp và đang khả dụng từ nhà cung cấp khác. Nếu thiếu lựa chọn phù hợp, có thể dùng mô hình cùng nhà cung cấp. Các Skill như `studio-review` xác định tiêu chí rà soát và mức độ nghiêm trọng. Xem [Skill](skills.md).

Agent điều phối chuyển vấn đề đang chặn bàn giao về cho bên thực hiện. Ghi riêng vấn đề ngoài phạm vi, kèm ảnh hưởng và bằng chứng, rồi lên lịch xử lý riêng.

<a id="decide-whether-to-merge"></a>

## Quyết định hợp nhất

| Tình trạng PR | Thao tác |
| --- | --- |
| Kiểm tra bắt buộc đạt và PR có thể hợp nhất | Người phụ trách nghiệm thu và hợp nhất |
| Kiểm tra bắt buộc thất bại hoặc thiếu kết quả | Người có quyền hợp nhất ngoại lệ có thể xác nhận tiếp tục. Studio ghi lại thao tác |
| Kiểm tra đang chờ, PR xung đột hoặc ở dạng nháp | Chờ hoặc xử lý trở ngại |
| Nền tảng lưu trữ mã từ chối hợp nhất | Đáp ứng yêu cầu của nền tảng |

Quyền hợp nhất PR thuộc về người dùng. Xem [Nghiệm thu kết quả](../use/accept.md) để biết các bước.
