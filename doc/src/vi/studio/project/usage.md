---
title: Khối lượng việc của Agent và mức dùng model
nav: Khối lượng việc và mức dùng
description: Xem mỗi Agent đang làm issue nào, việc gì tiếp theo và đang chờ ai, cùng số token mỗi model đã dùng và chi phí tương ứng.
---

Để xem đội Agent đang làm gì, có đủ năng lực không, và tốn bao nhiêu, hãy xem ở hai chỗ: **Agent queue** cho khối lượng việc, và **Agent management › Usage** cho mức dùng và chi phí.

## Hàng đợi Agent

Ở góc trên bên phải của **Development › Issues**, chuyển sang **Agent queue** để xem toàn bộ đội Agent đang làm gì. Mỗi Agent có một làn riêng:

| Khu vực | Có gì trong đó |
| --- | --- |
| Now | Công việc đang chạy trên một runtime, đã chạy bao lâu, và việc gần nhất nó làm |
| Up next | Các issue trong hàng đợi và lý do đang chờ, như "No runtime online", "All slots busy" hoặc "Blocked by PUR-12" |
| Waiting for reply | Những việc đang chờ con người, như lượt chạy thất bại, câu hỏi và issue đang nghiệm thu, và đang chờ ai. Việc nào đến lượt bạn được làm nổi bật, và **Handle** đưa bạn thẳng đến đó |
| Assigned, idle | Các issue đã giao cho Agent nhưng không có gì diễn ra, và lý do, ví dụ "In Backlog, won't start on its own" |

Dòng trên cùng tóm tắt những gì đang chạy, đang chờ trong hàng đợi và đang chờ bạn, cùng mức bận của các runtime. Chọn **Only mine** để chỉ hiển thị các issue bạn phụ trách, đã tạo hoặc đang theo dõi.

::figure agent-queue | Hàng đợi Agent: mỗi Agent một làn, việc đến lượt bạn được làm nổi bật

Nếu bạn thường thấy "All slots busy" hoặc hàng đợi dài, bạn không đủ runtime. Hãy tăng số lượt chạy đồng thời tối đa của một runtime hoặc kết nối thêm runtime. Xem [Kết nối runtime dùng chung](../setup/shared-runtimes.md). Nếu một Agent lúc nào cũng rảnh, có thể mô tả **Good at** của nó quá hẹp nên Agent điều phối không nghĩ đến nó. Xem [Bật Agent](../setup/agents.md).

## Mức sử dụng

**Agent management › Usage** liệt kê số token mà các lượt chạy của Agent đã dùng và chi phí ước tính theo giá model của bạn:

- Chọn khoảng ngày, như 7 ngày qua, tháng này hoặc tháng trước.
- Nhóm theo Agent, ai đã đánh thức nó, đối tượng (issue hoặc phiên), model, công cụ lập trình hoặc ngày, hoặc chỉ xem một Agent hay một người.
- Mỗi dòng hiển thị số lượt chạy, thời lượng, token đầu vào và đầu ra, lượt đọc và ghi cache, và chi phí ước tính.
- **Daily trend** vẽ biểu đồ chi phí hoặc token theo ngày.

**Cost per issue** trên dashboard dùng cùng mức giá. Các lần gọi model nằm ngoài lượt chạy của Agent, như lập chỉ mục và tìm kiếm cơ sở tri thức, được liệt kê riêng trong **Other model use**.

## Giá model

Chi phí được ước tính từ giá model bạn đặt. Trên trang mức sử dụng, bấm **Set prices**:

- Mỗi công cụ lập trình liệt kê các model mà lượt chạy của nó đã báo cáo. Nhập giá đầu vào và đầu ra cho mỗi triệu token của từng model, hoặc định giá một nhóm model bằng một quy tắc.
- Với các công cụ lập trình trả phí theo tháng, như Claude Code đăng nhập bằng tài khoản thuê bao, bật **Subscription (not billed)**, và các lượt chạy của chúng không bị tính phí.
- Model chưa có giá sẽ hiển thị "—" ở cột chi phí trong báo cáo.

Đặt giá cần quyền quản lý giá model, thường là quản trị viên.
