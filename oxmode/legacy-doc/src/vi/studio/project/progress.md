---
title: Tiến độ dự án
description: Dashboard trả lời ba câu hỏi: việc bàn giao đang thế nào, các Agent làm việc ra sao, và có gì đang kẹt. Trang tổng quan của mỗi dự án cho thấy tiến độ, các bước thiết lập còn lại, và các thay đổi chưa phát hành.
---

Bạn không cần hỏi từng issue để biết dự án đang thế nào. Trưởng dự án xem ở hai chỗ: **Dashboard** cho cả nhóm, và **Overview** của một dự án cho riêng dự án đó.

## Dashboard

**Dashboard** trả lời ba câu hỏi: việc bàn giao đang thế nào, các Agent làm việc ra sao, và có gì đang kẹt. Chọn một khoảng thời gian, mọi số liệu đều được so sánh với kỳ trước và vẽ biểu đồ trong kỳ hiện tại.

Dashboard chỉ tính các dự án và issue bạn có quyền xem.

### Số liệu chính

| Số liệu | Cách tính |
| --- | --- |
| Issues completed | Số issue hoàn thành trong kỳ |
| Median cycle time | Thời gian trung vị từ khi issue bắt đầu đến khi xong |
| Completed by agents | Tỷ lệ issue hoàn thành trong kỳ có Agent tham gia làm |
| Cost per issue | Mức sử dụng Agent trong kỳ tính theo giá model hiện tại, chia cho số issue hoàn thành |
| Run success rate | Tỷ lệ lượt chạy đã kết thúc mà hoàn thành thành công |
| Rework rate | Tỷ lệ issue có Agent làm bị trả lại để sửa hoặc bị mở lại sau khi đã xong |
| Runs per issue | Số lượt chạy trung bình cho mỗi issue Agent hoàn thành |
| Human intervention | Tỷ lệ lượt chạy mà Agent chuyển issue sang **Blocked** để hỏi người phụ trách |
| Median queue wait | Thời gian trung vị từ khi công việc vào hàng đợi đến khi một runtime nhận |

Di chuột lên một số liệu để xem cách tính.

Hãy đọc một số số liệu cùng nhau. Rework rate cao cho thấy yêu cầu chưa đủ rõ, hoặc mô tả **Good at** hay Skill của Agent cần điều chỉnh. Human intervention cao cho thấy yêu cầu thiếu quy tắc nghiệp vụ. Thời gian chờ trong hàng đợi dài nghĩa là bạn không đủ runtime. Xem [Khối lượng việc của Agent và mức dùng model](usage.md).

### Hiệu suất Agent

Số lượt chạy vào hàng đợi mỗi ngày, theo kết quả: hoàn thành, thất bại, đã hủy và đang chạy, để bạn thấy đội Agent làm việc thế nào.

### Cần chú ý

Chỉ những gì đang kẹt hoặc quá hạn lúc này: issue bị chặn, issue quá hạn, issue chờ nghiệm thu quá lâu, và các lượt chạy thất bại trong 24 giờ qua. Khi mọi thứ ổn, mục này trống.

### Theo dự án

Mọi dự án bạn thấy được: đã xong bao nhiêu đến nay, và bàn giao bao nhiêu trong kỳ.

## Tổng quan dự án

Mở một dự án, **Overview** của nó có:

- **Số liệu chính và phân bổ trạng thái**: tổng số issue, đang làm, đang nghiệm thu và đã xong.
- **Next steps**: các bước thiết lập dự án còn cần, như thêm repository, hoàn tất khởi tạo hoặc kết nối CI cho preview. Khi đã xong hết, mục này biến mất.
- **Releases**: phiên bản đang chạy ở mỗi môi trường. Xem [Duyệt phát hành và rollback](release.md).
- **Merged, not released**: các issue đã xong nhưng thay đổi chưa lên production.
