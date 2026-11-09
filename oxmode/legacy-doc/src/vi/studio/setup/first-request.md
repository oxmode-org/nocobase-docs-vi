---
title: Đi qua yêu cầu đầu tiên
description: Nêu một yêu cầu nhỏ và xem đội Agent lên kế hoạch, xây dựng và review nó. Trả lời câu hỏi, nghiệm thu và merge, rồi xác nhận toàn bộ quy trình chạy trọn vẹn từ đầu đến cuối.
---

Khi Studio, kết nối Git, runtime, Agent và dự án đều đã thiết lập, hãy đưa một yêu cầu nhỏ đi qua toàn bộ quy trình. Trong quá trình đó, bạn sẽ thấy đội Agent đẩy một issue tiến lên ra sao và xác nhận mọi phần đã được kết nối trước khi mời đồng nghiệp.

## Trước khi bắt đầu

- Issue "Initialize project" của dự án đã xong. Xem [Tạo dự án](new-project.md).
- Ít nhất hai Agent đã bật, và Agent điều phối đã có lựa chọn chính. Xem [Bật Agent](agents.md).
- Có một runtime đang trực tuyến.

## 1. Nêu yêu cầu

1. Mở dự án và bấm **New issue**. Một phiên với Agent mở ra ở bên phải, kèm theo dự án hiện tại làm bối cảnh.
2. Mô tả một yêu cầu nhỏ bằng ngôn ngữ nghiệp vụ, cùng cách bạn sẽ kiểm tra. Ví dụ:

   ```text
   Thêm bảng Suppliers vào ứng dụng với tên, người liên hệ, số điện thoại và trạng thái (đang hoạt động hoặc tạm dừng), và thêm trang Suppliers vào thanh điều hướng, nơi có thể thêm, sửa và xem nhà cung cấp.
   Nghiệm thu: sau khi đăng nhập, mở trang Suppliers từ thanh điều hướng, thêm một nhà cung cấp và thấy nó trong danh sách.
   ```

3. Gửi đi. Nếu yêu cầu đã rõ, Agent biến nó thành issue ngay. Nếu có gì chưa rõ, nó hỏi bạn trước.
4. Khi issue đã được tạo, bấm **Start 1 issue** trong phiên, hoặc mở issue và bấm **Start**.

Để bỏ qua phiên trò chuyện, bấm **Fill in manually** và tự nhập tiêu đề cùng mô tả.

**Xong khi**: issue ở trạng thái **In progress** và người thực hiện là Agent điều phối.

## 2. Xem đội Agent làm việc

Mở issue. Dòng **Now** ở đầu trang luôn cho biết Agent nào đang làm, đã bao lâu và trên runtime nào, bên dưới là việc gì tiếp theo.

**Activity** hiển thị mọi lần giao việc của Agent điều phối: ai nhận bước, làm gì, đọc gì, khi nào xem là xong, và vì sao chọn Agent đó. Yêu cầu này thêm một bảng, nên Agent điều phối trước tiên nhờ một Agent giỏi thiết kế viết kế hoạch ngắn, rồi giao phần phát triển cho một Agent giỏi xây dựng. Agent xây dựng viết mã và test, chụp màn hình trong ứng dụng đang chạy, và mở PR từ nhánh `agent/<issue key>`. Cuối cùng, Agent điều phối nhờ một model khác review mã. Các phát hiện khi review được trả về để sửa, và bản sửa được review lại.

Một yêu cầu nhỏ như thế này mất khoảng nửa giờ từ lúc bắt đầu đến khi sẵn sàng nghiệm thu.

::figure req-now | Đầu trang issue: ai đang làm và việc gì tiếp theo

**Runs** có bản ghi đầy đủ của mọi lượt chạy, hữu ích khi bạn cần tìm hiểu kỹ một vấn đề.

## 3. Trả lời câu hỏi

Khi có điều chưa rõ trong yêu cầu, như phải chọn giữa hai hướng làm, Agent điều phối chuyển issue sang **Blocked** và nêu rõ bạn cần quyết định gì. Nó hiện trên cùng trong **My issues**. Mở ra, bấm **Reply** trong thẻ **Needs you** và viết quyết định của bạn. Agent điều phối tiếp tục từ câu trả lời của bạn.

Nếu yêu cầu được viết rõ ràng, bước này có thể không bao giờ xuất hiện.

Nếu CI chưa được kết nối, bước này sẽ xuất hiện: PR không có kết quả kiểm tra, nên Agent điều phối hỏi nên thiết lập CI trước hay nghiệm thu không cần CI, dựa trên báo cáo bàn giao và ảnh chụp màn hình. Để chạy thử, bạn có thể trả lời "Lần này không dùng CI. Tôi sẽ nghiệm thu dựa trên báo cáo bàn giao và ảnh chụp màn hình rồi tự merge", và nó sẽ chuyển issue cho bạn nghiệm thu. Trước khi dùng thật, nhớ [kết nối CI](ci.md).

## 4. Nghiệm thu kết quả

Khi PR đã qua review và các kiểm tra, issue chuyển sang **In review** và xuất hiện trong mục **Waiting for you** ở **My issues**.

1. Mở issue. Thẻ **Needs you** cho biết bạn được nhờ nghiệm thu gì, bên dưới là báo cáo bàn giao: trước đây thế nào, những gì thay đổi, đã kiểm tra ra sao, các vấn đề còn mở kèm đề xuất, và cuối cùng là tiêu chí nghiệm thu cùng ảnh chụp màn hình.
2. Bấm **View changes** để xem PR.
3. Nếu CI đã kết nối, mở preview từ trang issue, đăng nhập bằng tài khoản quản trị viên đầu tiên và dùng thử theo tiêu chí nghiệm thu.
4. Nếu đúng như mong đợi, bấm **Merge**. Hộp xác nhận cho biết cách merge (ví dụ squash vào `main`), tiêu đề commit, và việc issue sẽ chuyển sang **Done**. Xác nhận. Khi không có kết quả kiểm tra, nút hiển thị **Merge anyway**, và bạn có thể ghi lý do. Studio ghi lại lần merge trên PR và trong hoạt động của issue.
5. Nếu có gì chưa ổn, bấm **Send back for changes** và nói cần sửa gì. Agent điều phối sắp xếp sửa và bàn giao lại cho bạn.

::figure req-accept | Khi nghiệm thu, bạn đọc báo cáo bàn giao, tiêu chí nghiệm thu và ảnh chụp màn hình

**Xong khi**: issue ở trạng thái **Done** và thay đổi đã có trên nhánh mặc định của repository. Nếu CI đã kết nối, thay đổi được triển khai lên staging, và issue cho biết nó đã đến những môi trường nào.

## Xử lý sự cố

**Issue mãi không bắt đầu.** Xem dòng **Now** trên trang issue. Nó cho biết đang chờ gì: không có runtime trực tuyến, mọi slot đều bận, hoặc Agent chỉ có trên runtime cá nhân của người khác. Nếu không runtime nào nhận việc trong 24 giờ, lượt chạy thất bại, và bạn được thông báo để chạy lại.

**"Initialize project" chưa xong.** Các issue mới trong dự án chờ cho đến khi nó xong.

**Agent báo không chụp được màn hình.** Runtime không có trình duyệt. Xem phần chuẩn bị trong [Kết nối runtime dùng chung](shared-runtimes.md).

Khi mọi thứ đã chạy, hãy [mời thành viên](invite.md).
