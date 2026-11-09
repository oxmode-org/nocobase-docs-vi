---
title: Đưa dự án vào Studio
description: Kết nối kho mã itam-lite với NocoBase Studio để nhóm agent tiếp tục phát triển.
---

Sau khi có phiên bản đầu, hệ thống bước vào giai đoạn phát triển liên tục:

1. Cải tiến tính năng đã có và sửa lỗi.
2. Bổ sung mô-đun mới vào hệ thống.

Khi một người xử lý nhiều đầu việc song song, họ phải chuyển qua lại giữa nhiều phiên agent. Agent tạo kết quả càng nhanh thì người phụ trách càng phải theo dõi nhiều. Khi nhiều người cùng phát triển, bối cảnh yêu cầu, tài liệu nghiệp vụ và kinh nghiệm dễ nằm rải rác. Đổi người hoặc agent có thể làm thất lạc nhiều thông tin. NocoBase Studio giúp quản trị quá trình phát triển chung giữa con người và agent.

![My issues trong Studio ưu tiên các việc đang chờ người dùng](https://static-docs.nocobase.com/20261028173135810.png)

> [!NOTE] Phiên bản có Studio
> Studio có trong phiên bản Professional và Enterprise. Xem [Bảng giá](https://www.nocobase.com/pricing/). Cài đặt cần token NocoBase Pro.

<a id="1-have-an-agent-set-up-studio"></a>

## 1. Giao agent thiết lập Studio

Làm theo [Tổng quan cài đặt](../studio/setup/index.md) để agent lập trình cục bộ triển khai và cấu hình Studio. Kho itam-lite đã có và sẽ được kết nối ở bước sau. Làm theo lời nhắc của agent khi cần trực tiếp đăng nhập hoặc cấp quyền.

Hoàn tất khi đăng nhập được Studio, môi trường chạy trực tuyến và có agent khả dụng.

<a id="2-create-a-project-linked-to-itam-lite"></a>

## 2. Tạo dự án liên kết với itam-lite

Trong thư mục itam-lite, yêu cầu agent dùng `nb-studio` để tạo dự án liên kết với kho hiện tại, bỏ bước khởi tạo và trả địa chỉ dự án:

```prompt
Use nb-studio to create a project called itam-lite in Studio, linked to the current repository, with no initialization. Tell me the project address when you're done.
```

Xem [Tạo dự án](../studio/setup/new-project.md) để biết các tùy chọn khác.

Hoàn tất khi mở được trang dự án và **Project settings › Code repositories** hiển thị itam-lite.

<a id="3-connect-ci-for-pr-previews-optional"></a>

## 3. Kết nối CI để xem trước PR (tùy chọn)

Sau khi kết nối, mỗi PR có bản xem trước để mở từ trang đầu việc và dùng khi nghiệm thu.

Mở **Settings › Code repositories** của dự án. Tại hàng **Checks** của itam-lite, bấm **Edit**:

![Kho mã trong cài đặt dự án, nơi có thể chỉnh hàng Checks](https://static-docs.nocobase.com/20261030-studio-code-repositories.webp)

Bấm **Show prompt** và chuyển prompt cho agent lập trình. Agent commit tệp CI, lưu secret và mở PR. Xem [Kết nối CI](../studio/setup/ci.md).

![Thiết lập kiểm tra bằng cách chọn điều kiện kích hoạt và ứng dụng rồi giao prompt cho agent](https://static-docs.nocobase.com/20261030-studio-checks-dialog.webp)

Hoàn tất khi đã hợp nhất PR, hàng **Checks** hiển thị đã kết nối và các PR tạo sau đó có thể mở bản xem trước từ trang đầu việc.
