---
title: Tổng quan phát triển ứng dụng
description: Tìm hiểu các phần của ứng dụng NocoBase, cách xây dựng tính năng nghiệp vụ, vị trí đặt mã và cách phát triển cùng Agent.
---

NocoBase Core và các plugin cung cấp nền tảng cơ sở dữ liệu, server, client, xác thực và phân quyền. Người phát triển có thể dùng các năng lực sẵn có để tập trung vào tính năng nghiệp vụ. Bạn có thể tự viết mã hoặc giao yêu cầu cho Agent phát triển tính năng.

## Một ứng dụng gồm những gì?

| Thành phần | Vai trò |
| --- | --- |
| Client | Xây dựng trang, biểu mẫu, danh sách và tương tác |
| Server | Cung cấp API và xử lý logic nghiệp vụ |
| Cơ sở dữ liệu | Định nghĩa cấu trúc và lưu dữ liệu nghiệp vụ |
| Plugin | Cung cấp các năng lực như xác thực, phân quyền, quản lý tệp và thông báo |
| Cấu hình | Quản lý kết nối cơ sở dữ liệu, tham số dịch vụ và các thiết lập khác |

Mỗi tính năng kết hợp những thành phần cần thiết cho yêu cầu của mình.

## Xây dựng một tính năng nghiệp vụ

Khi tạo khách hàng trong CRM, người dùng nhập thông tin, client gọi API, server áp dụng quy tắc nghiệp vụ và lưu vào cơ sở dữ liệu, sau đó trang được cập nhật.

- **Client** xây dựng biểu mẫu và danh sách khách hàng.
- **Server** triển khai API tạo khách hàng, kiểm tra quyền và áp dụng quy tắc nghiệp vụ.
- **Cơ sở dữ liệu** định nghĩa cấu trúc dữ liệu khách hàng.
- **Plugin** cung cấp cơ chế xác thực và phân quyền để ứng dụng tái sử dụng.

<h3 id="phân-quyền-áp-dụng-xuyên-suốt-đường-đi">Phân quyền khi lưu dữ liệu</h3>

Server kiểm tra quyền trước khi ghi dữ liệu. Xem [Xác thực, phân quyền và phạm vi dữ liệu](https://docs.nocobase.com/core/developing-apps/authentication-and-permissions/) để biết cách áp dụng cho API của ứng dụng.

## Đặt mã ở đâu?

Ứng dụng NocoBase phân chia mã theo trách nhiệm.

```tree
my-app/
├── client/       # Trang, component và route
├── server/       # API và dịch vụ nghiệp vụ
├── database/     # Migration và dữ liệu ban đầu
├── tests/        # Kiểm thử
└── config.yml    # Cấu hình ứng dụng
```

Đặt mã của tính năng vào thư mục phù hợp. Kết nối trang, API hoặc dịch vụ mới với ứng dụng qua điểm đăng ký tương ứng. Xem [Cấu trúc dự án](https://docs.nocobase.com/core/developing-apps/project-structure/).

## Phát triển cùng Agent

Một quy trình điển hình bắt đầu bằng việc mô tả yêu cầu, sau đó lập kế hoạch, triển khai tính năng, kiểm thử và kiểm chứng. Con người nghiệm thu kết quả.

Agent có thể dựa vào quy tắc dự án, tài liệu và Skill để phát triển tính năng trên nền các năng lực NocoBase sẵn có. Người phát triển chịu trách nhiệm làm rõ yêu cầu, xem xét các quyết định thiết kế quan trọng và nghiệm thu kết quả.
