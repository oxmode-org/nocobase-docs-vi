---
title: Môi trường triển khai
description: Môi trường triển khai quyết định ứng dụng được triển khai ở đâu, mọi người truy cập thế nào và ai được triển khai. Môi trường preview chứa preview của mỗi PR, staging để nhóm dùng thử, và mỗi lần triển khai lên môi trường production được bảo vệ đều cần người duyệt đồng ý.
---

Quản trị viên quản lý các môi trường triển khai trong **Releases › Deploy environments**. Mỗi môi trường có tập ứng dụng riêng, nên thay đổi một môi trường không ảnh hưởng đến ứng dụng ở môi trường khác.

| Môi trường | Từ đâu ra | Dùng để làm gì |
| --- | --- | --- |
| Preview | Tự tạo khi cài Studio | Preview của mỗi PR, để tự dùng thử thay đổi trước khi nghiệm thu |
| Staging | Quản trị viên thêm | Tự động triển khai sau khi merge, để nhóm dùng thử trước khi phát hành |
| Production | Quản trị viên thêm. Studio không bao giờ tự tạo | Hệ thống nghiệp vụ đang dùng thật. Mỗi lần triển khai đều cần duyệt |

## Hai chế độ chạy

Khi thêm môi trường, hãy chọn chế độ chạy trước. Bạn không thể đổi sau đó:

| Chế độ chạy | Ứng dụng chạy ở đâu | Phù hợp cho |
| --- | --- | --- |
| In process | Trên server của Studio, không cần Docker. Ứng dụng khởi động ở lần truy cập đầu và dừng khi không ai dùng | Preview |
| Docker | Trong Docker trên server của Studio, mỗi ứng dụng một container, tách biệt với nhau | Staging và production |

Ở chế độ Docker, một lần triển khai kéo image theo digest của phiên bản và khởi động container mới trước, chỉ chuyển lưu lượng sang khi nó qua health check. Nếu phiên bản mới mãi không healthy, container cũ tiếp tục phục vụ và lần triển khai thất bại. Rollback triển khai image cũ theo cùng cách.

Trước khi dùng chế độ Docker, hãy bật nó trong `config.yml` của Studio (`releases.docker.enabled`), và đảm bảo user chạy Studio truy cập được Docker.

## Thêm môi trường

1. Mở **Releases › Deploy environments**, bấm **Add environment** và chọn chế độ chạy.
2. Nhập tên và ID môi trường, như "Staging" và `staging`. ID môi trường xuất hiện trong địa chỉ và không đổi được sau khi tạo.
3. **Public URL pattern**: nơi mọi người mở một ứng dụng trong môi trường này, với `{appId}` đại diện cho ứng dụng, như `https://apps.example.com/{appId}/`.
4. Với Docker, chọn **Registry** mà CI đẩy image lên, hoặc thêm một registry với địa chỉ và thông tin xác thực để kéo image.
5. Đặt các chính sách mô tả ở phần tiếp theo.
6. Trước khi lưu, bấm **Test connection** để chắc chắn kết nối được.

Trong phần ứng dụng, bạn có thể đặt môi trường chứa tối đa bao nhiêu ứng dụng, và một ứng dụng không dùng chờ bao lâu trước khi dừng và trước khi chuyển sang ngủ. Ứng dụng đã dừng giải phóng bộ nhớ và khởi động lại ở lần truy cập tiếp theo. Ứng dụng đang ngủ còn bị xóa các file đã giải nén, giữ lại cấu hình và dữ liệu, nên lần truy cập tiếp theo sẽ mất thời gian chuẩn bị lâu hơn.

## Môi trường được bảo vệ và người duyệt

Bật **Protected**, và mọi lần triển khai lên môi trường, dù do người, Agent hay CI khởi tạo, kể cả rollback, đều trở thành một yêu cầu triển khai chờ người duyệt. Để duyệt, người duyệt gõ lại app ID một lần nữa.

Người duyệt có thể là:

- Trưởng dự án: trưởng của dự án sở hữu repository của ứng dụng đang được triển khai.
- Quản trị viên: Owner và Admin.
- Những người cụ thể.

Chỉ cần một người duyệt đồng ý là đủ, và không ai được duyệt yêu cầu của chính mình. Nếu không chọn người duyệt, quản trị viên sẽ quyết định. Về việc người duyệt làm, xem [Duyệt phát hành và rollback](../project/release.md).

> [!WARNING] Sao lưu production trước
> Studio không sao lưu cơ sở dữ liệu của ứng dụng trước khi triển khai. Hãy tự sao lưu cơ sở dữ liệu production định kỳ.

## Môi trường preview

Môi trường preview được tự tạo khi cài Studio. Nó chạy ở chế độ in process và không được bảo vệ. Mặc định nó chạy tối đa 20 preview cùng lúc, và một preview dừng sau 10 phút không có người truy cập và chuyển sang ngủ sau 24 giờ.

- Preview nạp dữ liệu mẫu và tạo một quản trị viên đầu tiên ở lần triển khai đầu. Nó không bao giờ chứa dữ liệu thật của công ty.
- Khi PR được merge hoặc đóng, preview của nó tự động bị xóa.
- Khi preview thiếu một biến, khu vực preview trên trang issue liệt kê những gì còn thiếu. Ai có quyền quản lý môi trường đều có thể đặt biến cho cả môi trường preview, và mọi preview dùng nó từ đó trở đi.

Khi dùng thật, hãy cho preview một tên miền riêng thay vì dùng chung địa chỉ của Studio, và chạy preview bằng một user hệ thống khác không đọc được cấu hình của Studio. Xem [Tùy chọn cấu hình](../reference/config.md).

## Biến môi trường

Các biến mà ứng dụng đã triển khai đọc có thể đặt trên một môi trường, cho mọi ứng dụng trong đó, hoặc trên một ứng dụng. Biến riêng của ứng dụng được ưu tiên. Khóa bí mật được mã hóa và không bao giờ hiển thị lại.
