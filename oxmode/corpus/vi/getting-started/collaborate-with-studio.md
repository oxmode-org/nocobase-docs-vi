---
title: Cộng tác bằng Studio
description: Gửi yêu cầu trong Studio, theo dõi bàn giao và rà soát của agent, nghiệm thu rồi phát hành.
---

Studio tập hợp yêu cầu, quá trình thực thi của agent và kết quả bàn giao trong dự án và đầu việc để cả nhóm cùng phát triển.

<a id="why-use-studio"></a>

## Vì sao dùng Studio

<a id="from-personal-conversations-to-shared-tasks"></a>

### Từ cuộc trò chuyện cá nhân sang đầu việc chung

Khi yêu cầu và kết quả nằm trong cuộc trò chuyện cá nhân, đồng nghiệp phải nhờ người khác cập nhật tiến độ. Đầu việc Studio tập hợp yêu cầu, người phụ trách, thay đổi mã và kết quả kiểm tra. Người làm nghiệp vụ và nhà phát triển có thể làm rõ quy tắc, theo dõi tiến độ và nghiệm thu cùng một nơi.

<a id="let-agents-coordinate-development-and-checks"></a>

### Để agent điều phối phát triển và kiểm tra

Agent điều phối phân công thiết kế, phát triển, kiểm thử và rà soát độc lập cho các agent thực thi, rồi tổ chức sửa khi cần. Bàn giao và kết quả lưu trong đầu việc để cả nhóm theo dõi trực tiếp. Các đầu việc có thể tiến hành song song trên nhánh riêng. Xem [Quy tắc thực thi của agent](../studio/reference/agent-execution.md).

<a id="keep-decisions-acceptance-and-project-knowledge-with-people"></a>

### Con người quyết định, nghiệm thu và duy trì tri thức dự án

Con người quyết định quy tắc nghiệp vụ, nghiệm thu và hợp nhất PR. Kho tri thức giữ tài liệu nghiệp vụ. Bộ nhớ dự án lưu quy tắc và quyết định thiết kế đã thống nhất để dùng cho yêu cầu sau hoặc bàn giao cho người hay agent khác.

<a id="connect-to-studio"></a>

## Kết nối Studio

<a id="join-an-existing-team"></a>

### Tham gia nhóm hiện có

[Chấp nhận lời mời và đăng nhập](../studio/join/sign-in.md), rồi mở dự án mà quản trị viên chuẩn bị. Có thể bắt đầu ngay trong Studio.

<a id="prepare-the-team-environment-and-project"></a>

### Chuẩn bị môi trường nhóm và dự án

Studio thuộc phiên bản thương mại. Quản trị viên làm theo [Cài đặt và cấu hình](../studio/setup/index.md) để xin quyền truy cập, triển khai dịch vụ, kết nối Git và agent, chuẩn bị dự án và mời thành viên.

Ví dụ sau thêm trang nhà cung cấp. Trước khi bắt đầu, kiểm tra:

- Đầu việc **Initialize project** đã hoàn tất.
- Agent điều phối đã được cấu hình và có ít nhất một môi trường chạy đang trực tuyến.
- Kho mã có [nguồn kiểm tra](../studio/setup/ci.md). Chuẩn bị môi trường xem trước hoặc kiểm thử nếu cần dùng thử ứng dụng.

<a id="submit-a-request-and-confirm-the-plan"></a>

## Gửi yêu cầu và xác nhận kế hoạch

Chọn **New issue** trong dự án rồi mô tả mục tiêu và cách kiểm tra. Ví dụ:

```prompt
Add a supplier page with name, contact person, phone, and partnership status. Buyers should be able to add, edit, and view suppliers.

I want to add a supplier, change its status to suspended, and filter the list by status.
```

Agent làm rõ quy tắc còn thiếu và tạo đầu việc. Rà soát rồi chọn **Start**. Có thể chọn **Fill in manually** để tạo trực tiếp.

![Dùng cuộc trò chuyện để xác định mục tiêu và quy tắc nghiệp vụ](https://static-docs.nocobase.com/studio-en-guide-new-task-20261031.png)

Đầu việc chuyển sang **In progress**. Agent điều phối sắp xếp thiết kế, phát triển và rà soát.

Trước khi bắt đầu, xác nhận trạng thái nhà cung cấp được phép, người mua được truy cập nhà cung cấp nào và việc tạm ngưng có chỉ đổi trạng thái hợp tác hay không. Báo agent các quy tắc còn bỏ ngỏ và ghi quy tắc đã thống nhất vào đầu việc. Đính kèm chính sách mua hàng hoặc định nghĩa trường vào đầu việc hay [Kho tri thức](../studio/project/knowledge-base.md) để phục vụ thiết kế và rà soát.

<a id="follow-development-checks-and-review"></a>

## Theo dõi phát triển, kiểm tra và rà soát

Đầu trang hiển thị agent, môi trường chạy và bước tiếp theo. **Activity** giữ nội dung bàn giao, phản hồi và kết quả rà soát. **Runs** cung cấp chi tiết thực thi.

![Chi tiết đầu việc hiển thị bước hiện tại và bước tiếp theo](https://static-docs.nocobase.com/studio-en-guide-task-progress-20261031.png)

Agent điều phối sắp xếp thiết kế và triển khai theo thay đổi. Agent thực thi sửa mã trên nhánh đầu việc và tạo PR. Các lượt kiểm tra và rà soát được liên kết với đầu việc. Nếu kiểm tra lỗi hoặc rà soát phát hiện vấn đề, công việc quay lại bước sửa và kiểm tra lại trước nghiệm thu.

Chẳng hạn, nếu lọc theo trạng thái nhà cung cấp vẫn trả các trạng thái khác, cần sửa và xác minh trước khi bàn giao. Đọc các kiểm tra đã thực hiện và mục chưa xác minh trong báo cáo để biết hành vi nào đã đạt. Xem [Kiểm tra và rà soát](../studio/project/checks-and-review.md).

<a id="answer-questions-and-accept-the-result"></a>

## Trả lời câu hỏi và nghiệm thu kết quả

Khi cần quyết định nghiệp vụ, đầu việc chuyển sang **Blocked** và xuất hiện dưới **Waiting for you** trong **My issues**. Trả lời thẻ **Needs you** bằng quy tắc hoặc thông tin còn thiếu. Agent điều phối tiếp tục dựa trên câu trả lời.

Nếu thiếu bước kiểm tra hoặc môi trường xem trước, nhờ quản trị viên làm theo [Kiểm tra và CI](../studio/configure/checks.md).

Khi đầu việc ở **In review**:

1. Đọc báo cáo bàn giao, gồm thay đổi, kết quả kiểm chứng và vấn đề còn lại.
2. Chọn **View changes** để xem PR. Nếu có bản xem trước, thử các kịch bản nghiệm thu.
3. Chọn **Merge** khi kết quả đạt yêu cầu. Xác nhận nhánh đích và cách hợp nhất.
4. Nếu cần sửa thêm, chọn **Send back** rồi mô tả vấn đề và kết quả mong đợi.

![Đối chiếu báo cáo bàn giao với tiêu chí nghiệm thu](https://static-docs.nocobase.com/studio-en-guide-accept-20261031.png)

Phát triển hoàn tất khi đầu việc là **Done** và thay đổi đã vào nhánh mặc định. Theo dõi kiểm thử và phát hành trong [Phát hành](../studio/release/overview.md).

<a id="release-changes-and-retain-project-knowledge"></a>

## Phát hành thay đổi và lưu tri thức dự án

Sau khi hợp nhất, triển khai theo quy trình của nhóm. Nếu dự án tự động triển khai, CI có thể đưa mã đã hợp nhất lên môi trường kiểm thử. Chủ dự án xác nhận các đầu việc có trong bản phát hành và ghi phiên bản production vào Studio sau khi triển khai. Xem [Quản lý phát hành](../studio/release/overview.md).

Lưu quy tắc mua hàng và quyết định thiết kế đã thống nhất vào [Bộ nhớ dự án](../studio/project/project-memory.md), rồi rà soát và hợp nhất cùng mã. Giữ chính sách gốc trong kho tri thức để agent dùng lại khi sửa tính năng nhà cung cấp.

Sau bài này, dùng [Đầu việc của tôi](../studio/use/my-tasks.md) để ra quyết định và nghiệm thu. Xem [Lộ trình học](learning-path.md) về thiết lập nhóm, quản lý dự án và tài liệu tham chiếu.
