---
title: Nghiệm thu công việc của agent
description: Dùng dữ liệu hiện có để nghiệm thu ngày cần thiết bị và gửi lại lỗi kèm bước tái hiện cùng kết quả mong đợi.
---

Chương này thêm ngày cần thiết bị vào yêu cầu cấp thiết bị, rồi minh họa cách nghiệm thu và gửi lại để sửa.

<a id="1-raise-the-request"></a>

## 1. Gửi yêu cầu

Đề nghị thêm ngày cần thiết bị dưới dạng trường tùy chọn. Ngày phải từ hôm nay trở đi, hiển thị trong danh sách và chi tiết, còn yêu cầu đã gửi giữ giá trị trống.

```prompt
Add an optional "needed by" date to device requests. It cannot be earlier than today, and it shows in the list and the details. Requests already submitted stay empty.
```

<a id="2-run-the-business-scenario-yourself"></a>

## 2. Tự chạy kịch bản nghiệp vụ

Đăng nhập bằng Alice và mở **Device requests**:

![Yêu cầu cũ hiện năm 1970, còn yêu cầu mới hiện thêm giờ](https://static-docs.nocobase.com/20261030-itam-lite-accept-needed-by-wrong.webp)

Có hai lỗi:

- Các yêu cầu cũ từ bài Yêu cầu thiết bị và phê duyệt và bài Vai trò và quyền thiếu ngày cần thiết bị nhưng vẫn hiện `Jan 1, 1970, 7:30 AM`.
- Yêu cầu mới hiện `Nov 6, 2026, 8:00 AM`, gồm cả giờ sau ngày.

Khi nghiệm thu, dùng dữ liệu hiện có và thực hiện công việc hằng ngày theo từng vai trò. Khi đã thống nhất kịch bản, có thể nhờ agent chuyển thành kiểm thử trình duyệt. Xem [Kiểm thử](../core/developing-apps/testing-and-acceptance.md#automated-verification-with-playwright).

<a id="3-send-it-back"></a>

## 3. Gửi lại để sửa

Gửi lại nếu chưa đạt tiêu chí, dữ liệu cũ hiển thị hoặc xử lý sai, hoặc quyền sai. Nêu bước tái hiện và kết quả mong đợi. Trong ví dụ, yêu cầu hiển thị “—” khi thiếu ngày, chỉ hiện ngày nếu có, sửa cả danh sách và chi tiết, rồi kiểm tra lại bằng Alice và đính kèm ảnh.

```prompt
The needed-by date displays wrongly:
1. In Alice's Device requests, old requests without a date show Jan 1, 1970, 7:30 AM; they should show "—".
2. A request with November 6 shows Nov 6, 2026, 8:00 AM; it should show only the date.
Fix both the list and the details. When fixed, check again as Alice and attach screenshots.
```

Agent thêm hàm định dạng chỉ hiện ngày và dùng “—” khi thiếu giá trị, đồng thời cho phép kiểu dữ liệu nhận null. Kiểm thử mới đạt ở ba múi giờ UTC, Los Angeles và Thượng Hải. Kiểm tra lại:

![Yêu cầu cũ hiện “—” và yêu cầu mới chỉ hiện ngày](https://static-docs.nocobase.com/20261030-itam-lite-accept-needed-by-fixed.webp)

Chọn hôm qua rồi gửi. Thông báo `Choose today or a later date.` xuất hiện cạnh trường ngày. Đăng nhập bằng Ben để xác nhận ngày của Alice hiện trong danh sách.

Hoàn tất khi yêu cầu mới chỉ hiện ngày trong danh sách và chi tiết, yêu cầu cũ hiện “—”, ngày trước hôm nay bị từ chối với lỗi cạnh trường, Ben xem được ngày và mọi kiểm thử đều đạt.
