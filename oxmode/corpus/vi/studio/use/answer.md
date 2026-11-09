---
title: Trả lời câu hỏi
description: Xác nhận quy tắc nghiệp vụ, xử lý lỗi thực thi, tiếp nhận đầu việc và xác nhận sử dụng môi trường chạy cá nhân.
---

Khi cần quyết định nghiệp vụ hoặc thiếu thông tin, agent điều phối giải thích câu hỏi. Mở đầu việc từ **My issues › Waiting for you**.

<a id="answer-a-blocking-question"></a>

## Trả lời câu hỏi đang chặn

1. Đọc **Needs you**. Để xem bối cảnh, chọn **View the Lead Agent’s latest explanation**.
2. Chọn **Reply** rồi trả lời trong luồng thảo luận tương ứng.
3. Gửi câu trả lời để agent điều phối tiếp tục sắp xếp công việc.

![Đầu việc bị chặn nêu quyết định cần người phụ trách đưa ra](https://static-docs.nocobase.com/studio-en-guide-answer-20261031.png)

Ví dụ, xác nhận mọi đơn từ nhà cung cấp hạng C cần quản lý mua hàng duyệt, bất kể giá trị. Các nhà cung cấp khác vẫn áp dụng ngưỡng giá trị:

```prompt
All tier C supplier orders need purchasing manager approval, regardless of value. Other suppliers should still follow the amount threshold.
```

Nếu chưa chắc, hỏi về các lựa chọn và ảnh hưởng. Bổ sung thông tin xác thực qua biến dự án hoặc trang cấu hình liên quan để giữ bí mật ngoài bình luận.

<a id="run-failures"></a>

## Lượt chạy thất bại

Đọc bản ghi thực thi để xác định nguyên nhân. Lỗi mạng, hết hạn mức và môi trường chạy ngoại tuyến cần cách xử lý riêng.

Khi hết số lần tự thử lại, thẻ quyết định cho phép thử lại, giao cho bên khác hoặc dừng thử lại. Khôi phục dịch vụ cần thiết trước khi chạy lại. Agent điều phối cũng có thể chọn agent khác phù hợp.

<a id="comment-run-limit"></a>

## Giới hạn lượt chạy do bình luận

Mặc định, bình luận của agent có thể kích hoạt tối đa 20 lượt chạy cho mỗi đầu việc trong 24 giờ. Quản trị viên có thể đổi giới hạn. Khi chạm ngưỡng, Studio dừng kích hoạt tự động và báo cho người phụ trách.

Kiểm tra xem agent có đang lặp lại việc sửa cùng một vấn đề hay không. Nếu cần tiếp tục, dùng thao tác tiếp tục của đầu việc hoặc cung cấp chỉ dẫn mới.

<a id="accept-an-ownership-handoff"></a>

## Tiếp nhận trách nhiệm

Công việc của agent tạm dừng trong khi người nhận quyết định:

- **Accept**. Trở thành người phụ trách và tiếp tục trả lời câu hỏi hoặc nghiệm thu.
- **Decline**. Trả lại trách nhiệm cho người phụ trách trước. Nếu tài khoản đó đã bị vô hiệu hóa, người nhận vẫn giữ đầu việc đang tạm dừng.

<a id="personal-runtime-requests"></a>

## Yêu cầu dùng môi trường chạy cá nhân

Nếu người khác yêu cầu thực hiện công việc trên đầu việc của mình và công việc sẽ dùng môi trường chạy cá nhân của mình, Studio yêu cầu xác nhận. Chấp nhận thì công việc mới có thể dùng môi trường đó. Nếu từ chối, yêu cầu này sẽ không chạy.

Xem [Kết nối môi trường chạy cá nhân](../join/personal-runtime.md).
