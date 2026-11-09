---
title: In theo mẫu
description: Dùng Skill của plugin để triển khai mẫu DOCX và xuất PDF trong ứng dụng.
---

## Năng lực

`@nocobase/app-plugin-template-print` cung cấp Skill và tài liệu tham khảo để Agent tạo tài liệu từ mẫu Office và dữ liệu nghiệp vụ. Hướng dẫn bao gồm chèn hình ảnh, mã QR và chuyển sang PDF khi cần.

### Nội dung package

Package cung cấp hướng dẫn cho Agent. Ứng dụng tự triển khai bảng mẫu, công cụ kết xuất, endpoint tải tài liệu và giao diện. Package chỉ cần được cài làm dependency phát triển trực tiếp với phiên bản tương thích. Từ gốc ứng dụng, chạy:

```bash
pnpm nocobase skills sync
```

Xác nhận Agent đọc được `nocobase-app-plugin-template-print`. Tích hợp qua Skill vì package không có điểm vào runtime Client, Server hay CLI.

## Tình huống và ví dụ

### In đơn hàng

Giao yêu cầu cụ thể cho Agent của ứng dụng.

```text
Dùng Skill template-print để thêm nút tải đơn hàng trên trang chi tiết.
Điền thông tin đơn hàng, các dòng hàng và tổng tiền vào mẫu DOCX đã cung cấp.
Áp dụng quyền bản ghi và quyền trường của người dùng hiện tại.
Làm DOCX trước. Nếu cần PDF, mô tả và tích hợp dependency chuyển đổi trong
môi trường triển khai. Kiểm tra đơn không có dòng hàng, văn bản dài, thiếu ảnh,
truy cập bị từ chối và tệp đầu ra mở được.
```

Ứng dụng hoặc plugin nghiệp vụ quản lý mẫu, truy vấn, dependency kết xuất, API tải và giao diện. Bắt đầu từ một mẫu cố định rồi bổ sung tải mẫu lên, quản lý phiên bản hoặc xem trước khi cần.

**Xong khi** người có quyền tải được DOCX đã điền đúng dữ liệu. Nếu hỗ trợ PDF, kiểm tra tệp PDF mở được trong môi trường đích.

## Nguyên tắc và triển khai

Áp dụng theo cấu trúc tệp thực tế của ứng dụng.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Kết quả |
| --- | --- | --- |
| Dependency phát triển và đồng bộ Skill | Cài package hướng dẫn rồi đồng bộ | Coding Agent đọc được hướng dẫn qua Skill |
| Mẫu, truy vấn nghiệp vụ và API tải | Lấy dữ liệu theo quyền và kết xuất DOCX | Trả tài liệu có thể sử dụng |
| Chi tiết đơn hàng và môi trường PDF tùy chọn | Thêm nút tải, dependency chuyển đổi và xử lý lỗi | Người dùng tải đầu ra và thấy lý do khi thất bại |

### Chuẩn bị đầu ra

Ánh xạ trường và vùng lặp với dữ liệu được phép. Mở tệp sinh ra để kiểm tra ảnh, mã QR, phông chữ và ngắt trang. Nếu cần PDF, cấu hình riêng công cụ chuyển đổi và môi trường triển khai.

`app-plugin-template-print-example` là ví dụ chạy được riêng, gồm dữ liệu hóa đơn, phân quyền, một mẫu DOCX cố định và giao diện tải. Tham khảo ví dụ khi tự triển khai phần kết xuất.

## Ràng buộc phát triển với AI và kiểm chứng

- Dùng Skill làm hướng dẫn triển khai. Chọn và cấu hình công cụ kết xuất trong ứng dụng.
- Chỉ điền dữ liệu được phép và kiểm tra lại quyền bản ghi cùng quyền trường tại API tải.
- Mở đầu ra thật để xem dòng, tổng tiền, ngắt trang và hình ảnh. Với PDF, kiểm thử cùng dependency của môi trường triển khai.

### Kiểm chứng

Mở tệp đã sinh để đối chiếu giá trị, tổng tiền, vùng lặp và phân trang. Kiểm tra bản ghi và trường bị từ chối không xuất hiện trong đầu ra. Với PDF, kiểm tra chuyển đổi, phông chữ và xử lý lỗi trên môi trường triển khai.

Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing), [Tệp](../data-and-files/file-management.md) và [Quản lý quyền](../authorization/permissions.md). Yêu cầu Agent báo thay đổi thực tế, bước kiểm tra đã chạy và mục chưa kiểm chứng. Xem thêm [Kiểm thử](../../developing-apps/testing-and-acceptance.md).

[Nguồn package và hướng dẫn](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-template-print)
