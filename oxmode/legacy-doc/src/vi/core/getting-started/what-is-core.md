---
title: Core là gì
description: Tìm hiểu cách NocoBase Core cung cấp các năng lực dùng chung để bạn và Agent của bạn tập trung vào ứng dụng nghiệp vụ.
---

NocoBase Core là nền tảng để phát triển và vận hành ứng dụng nghiệp vụ. Nó cung cấp một application framework và các năng lực dùng chung như xác thực, người dùng, phân quyền, tệp và thông báo.

Quản lý công việc, mua hàng hay quản lý khách hàng đều cần tài khoản, dữ liệu, phân quyền và giao diện người dùng. Core cung cấp những phần nền này để bạn và coding agent tập trung vào nghiệp vụ: lưu gì, ai được thao tác, và mỗi thao tác cần làm gì.

Tạo ứng dụng sẽ sinh ra một dự án ứng dụng độc lập. Core cung cấp năng lực qua các dependency; các trang, API, cấu trúc dữ liệu và quy tắc nghiệp vụ của bạn nằm trong mã nguồn của ứng dụng.

## Core cung cấp những gì

- **Template ứng dụng và runtime:** bắt đầu với một dự án chạy được, gồm mã phía client, mã phía server và cấu hình khi chạy.
- **Năng lực dùng chung:** kết hợp các plugin và thư viện cho xác thực, người dùng, phân quyền, truy cập dữ liệu, lưu trữ tệp và thông báo.
- **UI Library:** dùng lại bảng, form, hộp thoại và các block nghiệp vụ. Component đã cài vào mã nguồn có thể được điều chỉnh theo ứng dụng.
- **Công cụ phát triển và Skill:** các lệnh CLI xử lý cấu hình, migration, plugin và build. Skill cung cấp cho Agent hướng dẫn khớp với các dependency đã cài.

Template xác định điểm xuất phát. Plugin và thư viện cung cấp năng lực. Ứng dụng của bạn kết hợp chúng thành chức năng nghiệp vụ. Năng lực cụ thể có được tùy thuộc vào những gói đã cài và đã đăng ký.

## Bạn phát triển những gì

Hướng dẫn này xây một ứng dụng quản lý công việc theo từng bước. Core cung cấp cơ chế; ứng dụng định nghĩa mô hình công việc và các quy tắc.

| Tình huống | Core cung cấp | Ứng dụng của bạn hiện thực |
| --- | --- | --- |
| Đăng nhập | Tài khoản, xác thực và phiên đăng nhập | Ai được dùng ứng dụng quản lý công việc |
| Lưu công việc | Truy cập dữ liệu và migration | Tiêu đề, trạng thái hoàn thành, người được giao và API |
| Hiển thị công việc | Bảng, form và hộp thoại | Danh sách, luồng tạo mới, bộ lọc và phân trang |
| Kiểm soát truy cập | Mô hình phân quyền và kiểm tra phía server | Ai được xem, tạo hoặc hoàn thành công việc, và được truy cập những bản ghi nào |

Khi ai đó bấm **Complete**, ứng dụng dùng năng lực xác thực và phân quyền của Core để kiểm tra yêu cầu, cập nhật công việc theo quy tắc nghiệp vụ, rồi hiển thị kết quả.

Hãy xây các tính năng này trực tiếp trong ứng dụng. Chỉ cân nhắc một plugin phát hành riêng khi bạn cần dùng lại một năng lực ở nhiều ứng dụng.

## Phát triển và bảo trì

**Cùng Agent.** Mô tả yêu cầu nghiệp vụ, người dùng và tiêu chí nghiệm thu. Agent đọc hướng dẫn dự án và Skill, rồi hiện thực mô hình dữ liệu, API, trang và test. Dùng thử kết quả và tinh chỉnh yêu cầu.

**Không dùng Agent.** Viết mã trực tiếp với cùng framework, component, API và CLI. Hai cách có thể cùng tồn tại trong một dự án. Các chương sau đều có hai hướng riêng: cùng Agent và không dùng Agent.

**Bạn quản lý mã nguồn.** Giữ ứng dụng trong repository của bạn, review thay đổi, chạy test và phát hành. Triển khai lên server của chính bạn. Để nâng cấp NocoBase, hợp nhất các thay đổi từ template mới hơn với phần tùy biến nghiệp vụ của bạn và kiểm tra tương thích bằng test.

Sau khi triển khai, quản trị viên có thể thay đổi người dùng, vai trò và quyền truy cập bản ghi qua các trang quản lý được bật trong ứng dụng. Thay đổi về trang, cấu trúc dữ liệu hay logic nghiệp vụ được bàn giao qua mã nguồn, kiểm tra và triển khai lại.

Core có thể chạy độc lập. Studio tổ chức việc phát triển, review và phát hành của nhóm; Solution là các ứng dụng nghiệp vụ có sẵn xây trên Core. Bạn không cần Studio để làm theo hướng dẫn này.

## Tạo ứng dụng của bạn

Bắt đầu với [Tạo ứng dụng](create-app.md), rồi dùng [Cấu trúc dự án](project-structure.md) để định hướng trong mã nguồn.

Tiếp tục với [Xây ứng dụng đầu tiên](../tutorials/build-your-first-feature.md) để xây trọn một ứng dụng quản lý công việc cho nhóm, kiểm tra và triển khai nó.
