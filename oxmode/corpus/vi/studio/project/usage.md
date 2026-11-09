---
title: Khối lượng công việc và mức sử dụng
description: Theo dõi hàng đợi của agent, năng lực môi trường chạy và chi phí mô hình ước tính.
---

<a id="view-workload"></a>

## Xem khối lượng công việc

Mở **Issues** rồi chuyển sang **Agent queue**. Mỗi agent có một cột hiển thị công việc đang chạy, đang xếp hàng, đang chờ trả lời và đầu việc đã được giao nhưng chưa chạy. Mỗi mục đang chờ hiển thị lý do. Có thể mở trực tiếp các mục cần mình trả lời từ hàng đợi.

![Xem công việc đang chạy, đang xếp hàng và đang chờ theo agent](https://static-docs.nocobase.com/studio-en-guide-agent-queue-20261031.png)

Nếu thường xuyên phải chờ tài nguyên, cân nhắc tăng số lượt chạy đồng thời hoặc bổ sung [Môi trường chạy](../configure/runtimes.md). Nếu một agent hiếm khi được giao việc, xem lại mô tả năng lực và các mô hình khả dụng.

<a id="view-usage"></a>

## Xem mức sử dụng

Mở **Usage**, chọn khoảng ngày rồi nhóm theo agent, người yêu cầu, đối tượng, mô hình, công cụ lập trình hoặc ngày. Báo cáo gồm số lượt chạy, thời lượng, token đầu vào và đầu ra, mức sử dụng bộ nhớ đệm và chi phí ước tính.

![Xu hướng sử dụng mô hình và chi phí](https://static-docs.nocobase.com/studio-en-guide-usage-20261031.png)

Xu hướng theo ngày cho thấy thay đổi về chi phí hoặc token. Lời gọi ngoài lượt chạy của agent, chẳng hạn lập chỉ mục kho tri thức, xuất hiện trong nhóm sử dụng mô hình khác.

<a id="set-prices"></a>

## Đặt giá

Thành viên có quyền định giá mô hình có thể mở cài đặt giá. Nhập giá đầu vào, đầu ra và bộ nhớ đệm theo mỗi triệu token, hoặc áp dụng quy tắc giá cho nhiều mô hình.

Đánh dấu công cụ lập trình trả phí theo gói là thuê bao không tính phí theo lượt dùng. Mô hình chưa có giá hiển thị **—** ở cột chi phí. Đây là số liệu ước tính của nhóm. Chi phí thực tế theo hóa đơn của nhà cung cấp.
