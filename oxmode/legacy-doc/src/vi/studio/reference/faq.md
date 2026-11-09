---
title: Câu hỏi thường gặp và xử lý sự cố
nav: FAQ và xử lý sự cố
description: Các vấn đề thường gặp khi cài đặt, đăng nhập, kết nối Git, runtime, đẩy issue tiến lên, nghiệm thu và merge, preview và triển khai, và cách xử lý.
---

> [!TIP] Khi có sự cố, hãy hỏi Agent của bạn trước
> Dù là vấn đề gì, hãy giao cho Agent của bạn trước, như Claude Code hay Codex. Kể cho nó điều bạn thấy và thông báo lỗi. Nó có thể đăng nhập vào server để đọc log, kiểm tra trạng thái của Studio bằng `nb-studio`, và dùng trang này cùng phần còn lại của tài liệu để tìm nguyên nhân và sửa. Khi cần bạn làm gì đó trên trình duyệt hay cung cấp thông tin xác thực, nó sẽ dừng lại và báo cho bạn.

## Cài đặt và đăng nhập

**Địa chỉ không hiện trang đăng nhập.** Hãy thêm `/main/` vào địa chỉ, ví dụ `https://studio.example.com/main/`.

**Bạn không biết đăng nhập bằng tài khoản nào.** Tên đăng nhập là `nocobase`, và mật khẩu nằm trong `.env` ở thư mục triển khai: `grep INITIAL_ADMIN_PASSWORD .env`. Xem [Cài đặt Studio](../setup/install.md#đăng-nhập).

**Giao diện sai ngôn ngữ, hoặc trang đăng nhập có đường dẫn Sign up.** `config.yml` chưa đặt ngôn ngữ giao diện hoặc chưa tắt tự đăng ký. Đặt `i18n.defaultLocale` theo ngôn ngữ của nhóm, như `zh-CN`, và thêm `auth.emailAndPassword.disableSignUp: true`. Sau đó khởi động lại Studio.

**Kéo image thất bại.** Nếu báo unauthorized, token bị sai, hãy đăng nhập registry lại. Nếu kéo `postgres:16` bị timeout, server không truy cập được Docker Hub, hãy thiết lập registry mirror hoặc dùng một PostgreSQL có sẵn. Nếu tải các layer của image bị treo, hãy cho phép địa chỉ tải layer mà bạn nhận được cùng token. Xem [Cài đặt Studio](../setup/install.md#xử-lý-sự-cố).

**Container không khởi động hoặc liên tục khởi động lại.** Chạy `docker compose logs studio` để xem lý do. Nguyên nhân thường gặp: chưa sao chép `config.yml` ra trước, nên Docker tạo một thư mục cùng tên; thư mục `storage` không thuộc UID 1000; hoặc chưa đặt khóa mã hóa.

**`nb-studio login` đã được duyệt nhưng bạn vẫn chưa đăng nhập.** `nb-studio login` phải còn đang chạy khi bạn duyệt. Duyệt sau khi lệnh đã thoát không có tác dụng. Chạy lại `nb-studio login` và duyệt mã mới.

## Kết nối Git

**GitHub báo "Hook url is not supported because it isn't reachable over the public Internet" khi bạn tạo GitHub App.** Studio không có địa chỉ công khai nhưng webhook đang bật. Tắt **Webhook** rồi tạo lại, và Studio sẽ kiểm tra mỗi phút một lần thay thế. Xem [Kết nối Git](../setup/git.md#có-nên-bật-webhook).

**Tạo dự án báo "The repository was created, but the App could not confirm access."** GitHub App được cài chỉ với quyền truy cập một số repository. Thêm repository này vào cài đặt của bản cài GitHub App, rồi tạo dự án lại và chọn **Existing repository**.

**Agent mở PR báo không có quyền push.** Thành viên đã kết nối tài khoản Git riêng, nhưng tài khoản đó chỉ có quyền đọc repository. Hãy cấp quyền ghi cho tài khoản, hoặc ngắt kết nối tài khoản cá nhân để dùng kết nối của workspace.

## Runtime và Agent

**Runtime hiển thị offline.** Runner không liên lạc với Studio trong 150 giây sẽ hiển thị offline. Trên máy đó, chạy `nocobase-runner status` để chắc chắn nó đang chạy và truy cập được địa chỉ của Studio.

**Công cụ lập trình hiển thị Login required hoặc Not installed.** Trên máy đó, cài và đăng nhập công cụ bằng user hệ thống chạy runner, rồi bấm **Detect again** trong chi tiết runtime. Nếu đã cài mà vẫn hiển thị chưa cài, PATH của dịch vụ nền không chứa nó: trong một terminal mà `which claude` chạy được, chạy lại `nocobase-runner service install` và khởi động lại dịch vụ. Xem [Kết nối runtime dùng chung](../setup/shared-runtimes.md#xử-lý-sự-cố).

**Một model không có trong danh sách Agent.** Các model phổ biến được bật tự động khi một runtime báo cáo chúng. Thêm các model khác từ **Available models** trong **Add agent**. Nếu một model hiển thị **Needs setup** hoặc **Version too low**, hãy xử lý trên runtime theo gợi ý.

## Đẩy issue tiến lên

**Issue mãi không bắt đầu.** Xem dòng **Now** trên trang issue. Nó cho biết đang chờ gì: không có runtime online, mọi slot đều bận, một Agent chỉ có trên runtime cá nhân của người khác, một issue chặn, hoặc "Initialize project" vẫn đang chạy. Issue ở Backlog cần bạn bấm **Start** trước.

**Công việc chờ hơn 24 giờ và lượt chạy thất bại.** Không runtime nào nhận nó. Kết nối hoặc khởi động một runtime, rồi bấm thử lại trên thẻ mà người phụ trách issue nhận được.

**Agent điều phối dừng lại hỏi có thêm CI không.** Dự án chưa có CI, nên PR không có kết quả kiểm tra. Hãy kết nối CI, hoặc trả lời rằng bạn sẽ nghiệm thu mà không cần CI. Bạn cũng có thể nói trước điều đó trong mô tả issue. Xem [Kết nối CI](../setup/ci.md).

**Các Agent qua lại nhiều lần rồi tạm dừng.** Mặc định, bình luận từ Agent chỉ kích hoạt tối đa 20 lượt chạy cho mỗi issue trong 24 giờ. Trước hết xem hoạt động và các lượt chạy để biết chúng có đang sửa đi sửa lại cùng một vấn đề không. Nếu chắc chắn nên tiếp tục, bấm **Continue (comment-triggered runs reached their limit)** trên trang issue. Xem [Trả lời câu hỏi của Agent](../use/answer.md#chạm-giới-hạn-lượt-chạy-từ-bình-luận).

**Báo cáo bàn giao không có ảnh chụp màn hình, hoặc báo chụp màn hình thất bại.** Runtime không có trình duyệt. Cài Chromium và các phụ thuộc hệ thống như mô tả trong phần chuẩn bị của [Kết nối runtime dùng chung](../setup/shared-runtimes.md).

**Một công cụ lập trình hết hạn mức.** Agent điều phối lập tức giao bước đó cho một Agent phù hợp khác, ưu tiên của nhà cung cấp khác. Công cụ đó ngừng nhận việc trên runtime đó. Khi biết thời điểm hạn mức được đặt lại, nó tự hoạt động lại vào lúc đó. Khi không biết, chủ runtime hoặc quản trị viên xóa dấu đánh dấu dưới mục hạn mức trong chi tiết runtime khi hạn mức đã có lại.

## Nghiệm thu và merge

**Nút Merge bị vô hiệu.** PR có xung đột, vẫn đang là bản nháp, hoặc kiểm tra vẫn đang chạy. Agent điều phối sẽ sắp xếp để giải quyết xung đột. Hãy merge khi kiểm tra xong.

**Nút hiển thị Merge anyway.** Một kiểm tra bắt buộc đã thất bại hoặc không có kết quả kiểm tra. Khi chắc chắn có thể merge, hãy nêu lý do rồi merge. Việc merge được ghi lại trên PR và trong hoạt động của issue.

**PR được merge thẳng trên GitHub, còn issue trong Studio không đổi.** Studio kiểm tra mỗi phút một lần (hoặc biết ngay khi bật webhook). Chờ một chút, issue sẽ tự chuyển sang Done.

## Preview và triển khai

**PR không có preview.** Dự án chưa kết nối CI, hoặc CI không truy cập được địa chỉ của Studio. Xem [Kết nối CI](../setup/ci.md).

**Preview mở chậm.** Preview dừng hoặc chuyển sang ngủ sau một thời gian không có người truy cập, và phải khởi động hoặc chuẩn bị lại khi được mở. Chờ một chút.

**Triển khai lên production không có gì xảy ra.** Production được bảo vệ, nên lần triển khai trở thành một yêu cầu triển khai chờ người duyệt. Người duyệt xử lý trong **To decide** ở hộp thư.

## Thông báo

**Email mời không được gửi.** Studio chưa có kênh email, và kết quả hiển thị **Email not sent**. Sao chép đường dẫn mời và gửi cho đồng nghiệp, hoặc thiết lập email. Xem [Thông báo và thông báo đẩy](../admin/notifications.md).

**Thông báo đẩy không đến điện thoại.** Thông báo đẩy cần Studio chạy qua HTTPS và quản trị viên đã thiết lập push private key. Trên iPhone, hãy thêm Studio vào Màn hình chính trước, rồi mở từ Màn hình chính để đăng ký.
