---
title: Kiểm tra và review
description: Trước khi con người nghiệm thu, mã phải qua các kiểm tra CI của repository rồi được một model của nhà cung cấp khác review. Trưởng dự án quyết định kiểm tra nào là bắt buộc và khi nào kết quả kiểm tra đánh thức Agent điều phối.
---

Bạn không cần review từng dòng thay đổi của Agent. Trước khi công việc đến tay bạn để nghiệm thu, Studio cho nó đi qua hai cửa: các kiểm tra CI của repository và một lượt review mã bởi model khác. Chỉ khi qua cả hai, issue mới chuyển sang **In review**.

## Kiểm tra

Các kiểm tra chạy trong CI riêng của repository, như GitHub Actions hoặc GitLab CI: lint, kiểm tra kiểu, test, build, v.v. Studio đọc kết quả kiểm tra của mỗi PR và hiển thị trong mục **Code and deployments** của issue.

- **Một kiểm tra lỗi hoặc xuất hiện xung đột**: Studio đánh thức Agent điều phối để sắp xếp sửa. Bước đầu tiên thường gặp là nhờ một Agent đọc log lỗi và xác định lỗi do thay đổi gây ra hay chỉ là ngẫu nhiên.
- **Kiểm tra vẫn lỗi sau ba commit liên tiếp**: Studio ngừng đánh thức Agent vì việc đó và thông báo cho người phụ trách issue.
- **Mọi kiểm tra bắt buộc đều đạt**: Studio đánh thức Agent điều phối để sắp xếp review hoặc bàn giao.

Nếu dự án chưa có CI, PR sẽ không có kết quả kiểm tra. Trước khi bàn giao, Agent điều phối hỏi người phụ trách issue có nghiệm thu không cần CI không. Bạn cũng có thể nói trước điều này trong mô tả issue. Để thiết lập CI, xem [Kết nối CI](../setup/ci.md).

### Kiểm tra bắt buộc và kiểm tra tham khảo

Trong **Project settings › Branch rules**, bạn có thể đặt một số kiểm tra thành kiểm tra tham khảo bằng cách nhập mỗi dòng một tên kiểm tra:

- **Kiểm tra tham khảo**: khi lỗi chỉ hiển thị như một ghi chú. Nó không đánh thức Agent hay chặn việc merge trong Studio. Dùng cho các kiểm tra không ổn định hoặc chỉ mang tính tư vấn, như benchmark hiệu năng.
- **Kiểm tra bắt buộc**: mọi kiểm tra còn lại. Khi lỗi sẽ đánh thức Agent điều phối và chặn việc merge bình thường trong Studio.

Các kiểm tra và review mà chính nền tảng lưu trữ mã yêu cầu, như quy tắc bảo vệ nhánh của GitHub, vẫn được áp dụng. Nếu nền tảng lưu trữ mã không cho merge, bạn cũng không merge được trong Studio.

### Khi nào Agent điều phối thức dậy

**Project settings › Branch rules** có ba công tắc:

| Công tắc | Khi bật |
| --- | --- |
| Wake when checks fail | Một kiểm tra bắt buộc lỗi, và Agent điều phối sắp xếp sửa |
| Wake when all checks pass | Mọi kiểm tra bắt buộc đạt, và Agent điều phối chuyển sang review hoặc bàn giao |
| Wake when the PR has a conflict | PR xung đột với nhánh đích, và Agent điều phối sắp xếp sửa |

Thường nên để bật. Khi tắt một công tắc, trong tình huống đó con người phải bình luận trên issue thì Agent điều phối mới tiếp tục.

## Review

Khi các kiểm tra đạt, Agent điều phối giao mã cho một Agent khác review:

- Ưu tiên Agent của nhà cung cấp khác, ví dụ Codex review mã do Claude viết. Nếu không có Agent nào như vậy trực tuyến, một model khác của cùng nhà cung cấp sẽ review. Model đã viết mã không bao giờ tự review mã của mình.
- Review tuân theo Skill có sẵn `studio-review`: nó xem xét lỗi, bảo mật, thiết kế có đơn giản không, các test và chi phí CI của chúng, phân loại các phát hiện, và cho biết phát hiện nào chặn việc merge.
- Các phát hiện khi review được trả về cho Agent đã viết mã, và bản sửa được review lại.
- Review là bước chỉ đọc trên một bản sao riêng, nên có thể chạy song song với công việc khác.

Để review tuân theo chuẩn riêng của nhóm, hãy sửa Skill `studio-review` hoặc gắn Skill review của nhóm vào dự án. Xem [Skill](skills.md).

## Kiểm tra lúc merge

Khi người phụ trách issue bấm **Merge**, Studio kiểm tra PR và kết quả của nó với nền tảng lưu trữ mã thêm một lần:

| Tình huống | Có merge được không |
| --- | --- |
| PR có xung đột, là bản nháp, hoặc kiểm tra vẫn đang chạy | Không. Hãy xử lý trước |
| Một kiểm tra bắt buộc lỗi, hoặc không có kết quả kiểm tra | Bạn có thể chọn **Merge anyway** và ghi lý do. Studio đăng một bình luận về lần merge cưỡng bức trên PR và ghi lại trong hoạt động của issue |
| Quy tắc của nền tảng lưu trữ mã không cho phép | Không. Hãy làm theo yêu cầu của nền tảng lưu trữ mã |

Agent không thể merge PR, càng không thể merge cưỡng bức.

> [!NOTE] Bảo vệ nhánh mặc định trên nền tảng lưu trữ mã
> Studio không bảo vệ nhánh thay bạn. Hãy bật quy tắc bảo vệ cho nhánh mặc định trên GitHub, GitLab hoặc Gitee, ví dụ yêu cầu kiểm tra phải đạt trước khi merge, để cùng một cửa kiểm soát cũng áp dụng khi có người merge trực tiếp trên nền tảng lưu trữ mã.
