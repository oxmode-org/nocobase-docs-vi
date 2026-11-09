---
title: Phê duyệt (thương mại)
description: Kết nối quyết định phê duyệt của con người với vòng đời bản ghi, người tham gia, chính sách và kết quả.
---

## Năng lực

`@nocobase/app-plugin-approval` tích hợp quyết định của con người vào vòng đời bản ghi và quản lý người tham gia, nhiệm vụ, bằng chứng cùng snapshot nội dung. Có thể dùng cho nghỉ phép, mua hàng hoặc hợp đồng. Xác nhận quyền truy cập package và giấy phép thương mại trước khi cài.

Plugin điều phối phê duyệt và cung cấp mô hình đọc. Ứng dụng ghép trang, API, phân quyền và tác vụ định kỳ.

## Tình huống và ví dụ

### Yêu cầu mua hàng

Khi gửi, bản nháp chuyển sang quản lý xem xét. Quản lý có thể duyệt, từ chối hoặc trả về bản nháp. Quyết định cuối và bước chuyển trạng thái nghiệp vụ cùng nằm trong một transaction. Chỉnh nội dung được trả về qua thao tác nghiệp vụ có kiểm tra quyền trước khi gửi lại.

Dùng `runViewsFor`, `upcomingStagesFor` và `previewRoute` để xem tiến độ và thao tác đủ điều kiện. Có thể dùng mã nguồn `approval-ui` từ UI Library để hiển thị tiến độ, dòng thời gian, xem trước và nút thao tác.

API kiểm tra lại danh tính, quyền nghiệp vụ, điều kiện thực hiện nhiệm vụ và phiên bản nội dung. Khi nội dung thay đổi, có thể cần duyệt lại.

**Prompt phát triển** cho Coding Agent trong thư mục ứng dụng.

```text
Dùng plugin Approval đã được cấp phép để quản lý duyệt yêu cầu mua hàng.
Giữ vòng đời bản ghi nghiệp vụ. Định nghĩa nháp, đang duyệt, trả về và kết thúc,
cùng người đủ điều kiện duyệt. Dùng mô hình đọc công khai và giao diện phê duyệt
cho tiến độ và thao tác. Kiểm tra lại điều kiện và phiên bản nội dung trong API.
Commit quyết định cuối cùng với trạng thái nghiệp vụ và tích hợp lượt rà soát
qua Jobs của host. Kiểm tra thiếu người duyệt, thao tác trùng, trả về, xung đột
và lỗi transaction.
```

**Xong khi** có thể gửi, duyệt hoặc trả lại yêu cầu mua hàng. Thao tác không đủ điều kiện bị từ chối. Lỗi transaction giữ quyết định cuối và trạng thái nghiệp vụ nhất quán.

## Nguyên tắc và triển khai

Áp dụng theo cấu trúc tệp thực tế của ứng dụng.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Kết quả |
| --- | --- | --- |
| Vòng đời nghiệp vụ, cấu hình phê duyệt và lưu trữ có transaction | Ghép các giai đoạn, người duyệt và kết quả | Trạng thái mua hàng nhất quán với quyết định |
| API nghiệp vụ và trang chi tiết | Tích hợp mô hình đọc, tiến độ và thao tác có kiểm tra quyền | Người gửi và người duyệt thấy thao tác phù hợp |
| Jobs và xử lý tiếp theo | Tích hợp lượt rà soát, dọn dữ liệu và trạng thái thực thi | Theo dõi tác vụ theo lịch và lỗi nghiệp vụ |

### Điều kiện tiên quyết

Điểm vào Server cung cấp migration và API điều phối. Client cung cấp tài nguyên ngôn ngữ và helper mô hình đọc. Ứng dụng tự xây trung tâm phê duyệt, endpoint nghiệp vụ và giao diện quy trình nếu cần.

Ứng dụng cung cấp:

- Collection nghiệp vụ, vòng đời và lưu trữ có transaction.
- Xác thực, quyền nghiệp vụ và danh bạ người dùng.
- Định nghĩa phê duyệt, API và trang.
- Kiểm tra định kỳ, thông báo và tác động nghiệp vụ.

Định nghĩa giai đoạn qua API công khai như `defineApproval`, `stagesFor` và `approvalState`. Đăng ký vòng đời với LifecycleRuntime của host và cấu hình phê duyệt với `ApprovalService`. Dùng bản ghi nghiệp vụ làm định danh quy trình.

### Cấu hình quyết định

Định nghĩa trạng thái nháp, xem xét, sửa lại và kết thúc, rồi khai báo người tham gia, chính sách quyết định và thao tác được phép. Chính sách có thể yêu cầu một người, tất cả, bất kỳ ai, tuần tự, đủ ngưỡng hoặc tổng hợp tùy chỉnh. Chuyển nhiệm vụ và thêm người ký cần phạm vi người nhận đủ điều kiện.

| Câu hỏi | Cấu hình |
| --- | --- |
| Ai duyệt? | Xác định người tham gia, điều kiện và cách xử lý khi giai đoạn không có người duyệt |
| Khi nào được duyệt? | Chính sách quyết định và bước chuyển theo kết quả |
| Có thể trả về hoặc chuyển giao? | Thao tác tường minh, đích trả về và phạm vi người nhận |
| Nội dung có thể đổi? | Trường đóng băng, hash nội dung và kiểm tra phiên bản |
| Sau phê duyệt làm gì? | Trạng thái và tác động nghiệp vụ |

## Ràng buộc phát triển với AI và kiểm chứng

- Dùng bản ghi nghiệp vụ làm định danh quy trình để trạng thái phê duyệt và trạng thái nghiệp vụ gắn với nhau.
- Kiểm tra lại người dùng, bản ghi, điều kiện thực hiện nhiệm vụ và phiên bản nội dung tại API.
- Dùng dữ liệu cô lập để thử thao tác trùng, đồng thời và lỗi transaction cuối. Khôi phục xử lý bên ngoài qua trạng thái thử lại của nghiệp vụ để giữ nguyên quyết định của người duyệt.

### Tác vụ theo lịch và kiểm chứng

Tích hợp Jobs của host qua `createLifecycleJobs`. Trong callback rà soát, gọi `ApprovalService.sweep()` và `runtime.prune()`.

Kiểm tra trường hợp không có người được giao, quy tắc quyết định, thao tác trùng, trả về, xung đột nội dung và lỗi transaction. Mô hình hóa lỗi và thử lại của bước thực thi bên ngoài trong trạng thái nghiệp vụ.

Xem [Quản lý quyền](../authorization/permissions.md), [Tác vụ nền](../../framework/background/jobs.md), [Transaction](../../framework/database/transactions.md) và [Quản lý plugin](../../developing-apps/manage-plugins.md).

Hướng dẫn dựa trên điểm xuất công khai và ví dụ của plugin thương mại. Quyền truy cập và sử dụng package phụ thuộc giấy phép.

Yêu cầu Agent báo thay đổi thực tế, bước kiểm tra đã chạy và mục chưa kiểm chứng. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md).
