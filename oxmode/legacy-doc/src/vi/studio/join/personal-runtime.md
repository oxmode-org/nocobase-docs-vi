---
title: Kết nối runtime cá nhân
description: Kết nối một máy của riêng bạn với Studio làm runtime cá nhân. Nó dùng các công cụ lập trình và gói thuê bao bạn đã đăng nhập trên máy đó, và chỉ chạy công việc được làm thay mặt bạn.
---

Quản trị viên kết nối các runtime dùng chung, chạy việc cho mọi người trong nhóm. Thành viên tự kết nối runtime cá nhân, và một runtime cá nhân chỉ chạy công việc được làm thay mặt bạn: mọi bước Agent điều phối sắp xếp trong các issue bạn phụ trách, và các cuộc trò chuyện của bạn với Agent của nhóm trong **My sessions**.

Những lý do thường gặp để kết nối:

- Runtime dùng chung đang bận, và bạn muốn issue của mình chạy nhanh hơn.
- Bạn đã đăng nhập một công cụ lập trình hoặc model mà nhóm chưa có, và muốn dùng thử trên issue của mình trước.
- Bạn muốn chạy issue của mình bằng gói thuê bao và hạn mức của riêng bạn.

Trò chuyện với Agent của riêng bạn trong **My sessions** là một kiểu kết nối khác. Xem [Kết nối máy tính của bạn](connect-computer.md).

## Bạn cần gì

Giống như runtime dùng chung: macOS hoặc Linux (trên Windows thì Ubuntu trên WSL), Node.js 24 trở lên và Git, các công cụ lập trình bạn muốn dùng đã cài và đăng nhập, cùng CLI của nền tảng lưu trữ mã và Chromium. Chi tiết xem [Kết nối runtime dùng chung](../setup/shared-runtimes.md#chuẩn-bị-máy).

> [!WARNING] Runner không phải ranh giới bảo mật
> Trên máy này, Agent làm việc dưới quyền user hệ thống chạy runner và có thể đọc, ghi mọi thứ user đó truy cập được, kể cả SSH key và các thông tin xác thực khác. Với runtime cá nhân cũng hãy dùng một user hệ thống riêng, container hoặc máy ảo, thay vì tài khoản bạn dùng hằng ngày.

## Thêm runtime

1. Mở **Agent management › Runtimes** và bấm **Add runtime**. Hộp thoại cho biết runtime sẽ là cá nhân.
2. Chọn các công cụ lập trình bạn muốn dùng trên máy này, và đặt số lượt chạy đồng thời tối đa phù hợp với máy và hạn mức của bạn.
3. Bấm **Generate install command** và chọn hệ điều hành của máy.
4. Đưa **Prompt** cho một công cụ lập trình trên máy đó để nó cài đặt, hoặc chuyển sang **Manual** và tự chạy lệnh.

Lệnh này mang một thông tin xác thực dùng một lần, chỉ dùng được một lần và hết hạn trong vài phút. Nếu hết hạn, hãy tạo lệnh mới. Chi tiết cài đặt và xử lý sự cố xem [Kết nối runtime dùng chung](../setup/shared-runtimes.md#cài-đặt-trên-máy).

## Kiểm tra kết nối

Trong vài giây, máy xuất hiện trong danh sách runtime với nhãn **Personal** và **Online**, và các công cụ lập trình bạn đã chọn hiển thị **Signed in**. Mở chi tiết để thấy bạn là chủ.

Nếu nhóm đã bật Agent cho các model mà máy này báo cáo, mục **Where it runs** trong **Agent management › Agents** cũng tính cả máy của bạn, ví dụ "1 shared · 1 personal".

**Xong khi**: runtime hiển thị **Personal** và **Online**, và các công cụ lập trình bạn muốn hiển thị **Signed in**.

## Công việc nào chạy ở đây

- **Issue bạn phụ trách**: mọi bước Agent điều phối sắp xếp, dù là thiết kế, phát triển, kiểm thử hay review, đều được làm thay mặt người phụ trách issue, nên có thể chạy trên runtime cá nhân của bạn.
- **Phiên của bạn**: các cuộc trò chuyện của bạn với Agent của nhóm trong **My sessions**.
- **Agent chỉ có trên runtime cá nhân**: ví dụ một model chỉ đăng nhập trên máy bạn. Agent điều phối chỉ dùng nó trong các issue bạn phụ trách. Khi issue của người khác đang chờ một Agent như vậy, dòng **Now** trên trang issue cho biết chỉ có runtime cá nhân của người khác đang trực tuyến.
- **Công việc cần khóa bí mật**: các biến được đánh dấu **Shared runtimes only** trong dự án không bao giờ được gửi đến runtime cá nhân, nên công việc dùng chúng chỉ chạy trên runtime dùng chung. Các biến khác được gửi đến runtime nào nhận việc. Xem [Cài đặt dự án](../project/settings.md#biến-cho-lượt-chạy-của-agent).

Khi người khác bình luận trên issue bạn phụ trách và phần việc tiếp theo cần runtime cá nhân của bạn, Studio hỏi bạn trước. Trang issue hiển thị yêu cầu tiếp tục trên runner cá nhân của bạn. Bấm **Confirm** để cho công việc tiếp tục trên runtime của bạn, hoặc **Reject** để dừng. Xem [Trả lời câu hỏi của Agent](../use/answer.md#yêu-cầu-dùng-runtime-cá-nhân-của-bạn).

## Quản lý

- **Thay đổi**: trong chi tiết runtime, đổi tên và số lượt chạy đồng thời tối đa, bật hoặc tắt công cụ lập trình, và đặt mỗi công cụ được chạy bao nhiêu lượt cùng lúc. Chỉ chủ runtime được thay đổi.
- **Tạm dừng**: chạy `nocobase-runner stop` trên máy, và `nocobase-runner start` để chạy lại. Runner không liên lạc với Studio trong 150 giây sẽ hiển thị ngoại tuyến, và công việc nó đang giữ quay lại hàng đợi.
- **Biến từ máy này**: những giá trị bạn chỉ muốn giữ trên máy này. Đặt bằng `nocobase-runner env set NAME`, và Studio chỉ hiển thị tên của chúng.
- **Chia sẻ cho nhóm**: để nó chạy việc của mọi người, hãy nhờ quản trị viên đổi phạm vi sử dụng sang **Shared** trong chi tiết. Sau đó công việc của người khác cũng chạy trên máy này, với biến và khóa bí mật của họ, và có thể đọc những gì có trên máy, nên hãy chắc chắn điều đó chấp nhận được trước.
- **Ngừng sử dụng**: thu hồi thông tin xác thực của nó trong chi tiết trước, rồi xóa. Lịch sử lượt chạy được giữ lại. Trên máy, chạy `nocobase-runner uninstall` để gỡ runner và dịch vụ nền của nó.
