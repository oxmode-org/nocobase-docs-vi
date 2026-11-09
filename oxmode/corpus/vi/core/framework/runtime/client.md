---
title: Runtime client
---

Runtime client kết hợp cấu hình, dịch vụ, plugin, route và phần mở rộng React thành ứng dụng chạy trên trình duyệt. Ứng dụng và plugin cùng đóng góp vào runtime. Ứng dụng quyết định layout và component cuối cùng.

## Lắp ghép và render

```text
client/runtime.ts
  → resolveAppRuntime()
  → ClientApplication
  → app.start()
  → AppClientRoot
  → React Providers + routes
```

`client/runtime.ts` tập hợp các thành phần từ ứng dụng và plugin trong `client/plugins.ts`. `resolveAppRuntime()` phân giải khai báo và cấu hình công khai trong HTML. `ClientApplication` quản lý cấu hình, container dịch vụ và vòng đời của mình. Host render `AppClientRoot` sau khi `app.start()` thành công.

Import tĩnh các khai báo cần khi khởi động. Nạp theo nhu cầu đối với component trang, SDK lớn và chuỗi bản địa hóa. Trong các mô-đun khai báo, để việc mở kết nối hoặc truy cập DOM diễn ra sau bước import.

## Tài nguyên ứng dụng

| Tài nguyên | Trách nhiệm |
| --- | --- |
| `app.config` | Cấu hình công khai đã hợp nhất cho trình duyệt |
| `app.services` / `app.container` | Đăng ký và phân giải dịch vụ ứng dụng |
| `apiClientToken` | HTTP client |
| `realtimeClientToken` | Kết nối thời gian thực và đăng ký nhận theo topic |
| Khai báo route | Đường dẫn, loader, xác thực và ràng buộc truy cập |
| `reactProviders` | Các lớp Context bao quanh cây trang |

Các tài nguyên này thuộc một instance ứng dụng trên trình duyệt. Cửa sổ, server và ứng dụng khác có container riêng.

## Điểm mở rộng

Thêm trang qua `client/routes.ts`, thêm dịch vụ qua ServiceProvider phía client và thêm Context cho cây trang qua khai báo React Provider. Nếu template đã kết nối các tệp tổng hợp vào runtime, chỉ cần cập nhật tệp liên quan.

`AppClientRoot` cung cấp router trình duyệt. Bài kiểm thử cần router riêng có thể bọc `AppClientProviders` hoặc dùng công cụ render trong `@nocobase/app-testing/client`. Tránh lồng nhiều `BrowserRouter`.

## Trạng thái và giải phóng tài nguyên

Để React render lại khi giá trị của dịch vụ thay đổi, dùng state, Context hoặc cơ chế đăng ký nhận. Khi giải phóng tài nguyên, host unmount React root và gọi `app.shutdown()` để giải phóng tài nguyên do Provider sở hữu.

Xem [Dịch vụ client](../services/integration.md#client-services), [React Provider](react-providers.md) và [Trang, route và điều hướng](../../developing-apps/pages-routes-and-navigation.md).

## Giao diện và phần triển khai

- [Runtime client](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-client/README.md)
- [Khai báo runtime mặc định](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/templates/app-template-default/client/runtime.ts)
