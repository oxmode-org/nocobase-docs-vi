---
title: API Client
---

API Client tập trung cấu hình địa chỉ HTTP, thông tin xác thực và cách định dạng yêu cầu. Component dùng client đã cấu hình trong runtime để gọi server.

## Lấy và gọi client

Dùng `useApiClient()` trong component hoặc hook React. Với dịch vụ thông thường, truyền client vào dưới dạng dependency hoặc phân giải `apiClientToken`. Ví dụ giả định server có endpoint `/orders` trả `{ data: [...] }`.

```ts
import type { ApiClient } from '@nocobase/app-client';

type Order = { id: string; title: string };
export async function loadOrders(api: ApiClient, signal?: AbortSignal) {
  const response = await api.request<{ data: Order[] }>({
    method: 'GET',
    path: '/orders',
    query: { limit: 20 },
    signal,
  });
  return response.data;
}
```

`path` là đường dẫn tương đối so với địa chỉ API đã cấu hình. Mặc định là GET và `credentials: include`. Cookie khác origin và CORS vẫn tuân theo chính sách trình duyệt.

## Hợp đồng yêu cầu và phản hồi

| Nhu cầu | Giao diện |
| --- | --- |
| Tham số query | `query`, dùng giá trị vô hướng hoặc mảng được hỗ trợ |
| Body JSON | `json` |
| FormData và body khác | `body`, dùng riêng với `json` |
| Hủy yêu cầu | `signal` |
| Phản hồi đã phân tích đầy đủ | `request<T>()` |
| Luồng byte | `stream()` |
| Giao thức Repository | `repository(name)` |

Tham số kiểu mô tả phản hồi dự kiến. Kiểm chứng dữ liệu runtime riêng nếu cần. Xử lý `ApiClientError` theo nhóm bị từ chối, thiếu quyền, hủy và lỗi có thể thử lại.

## Repository từ xa

Repository từ xa cung cấp trình dựng truy vấn và chỉ truy cập những tài nguyên, action mà server mở tường minh. Chúng chạy riêng với Repository cơ sở dữ liệu. Server chịu trách nhiệm phân quyền. Giữ dịch vụ cơ sở dữ liệu, thông tin xác thực và mô-đun kết nối nội bộ ở server.

Server khai báo endpoint với `defineRepositoryApiRoutes()`. Client gọi `api.repository(name)`. Tên này xác định tài nguyên được mở và có thể khác tên Collection. Cả thao tác đọc cũng dùng POST. Repository từ xa lấy riêng `data` từ phản hồi. Xem ví dụ đầy đủ trong [Repository Data API](repository-routes.md).

## Trạng thái và thử lại

Ứng dụng tự quản lý trạng thái yêu cầu ở trang. Dùng tín hiệu hủy, mã nhận diện yêu cầu hoặc thư viện quản lý trạng thái để kết quả cũ không ghi đè tìm kiếm mới. Chỉ thử lại thao tác ghi khi đã biết cơ chế idempotency. Sau khi hết thời gian chờ, thao tác có thể vẫn đã chạy.

Script độc lập có thể dùng trực tiếp `@nocobase/api-client` và gọi `createApiClient({ baseURL })`. `@nocobase/app-client` cũng xuất lại các kiểu và điểm vào ứng dụng. Xem [Tham chiếu API](../../reference/api.md).

## Giao diện và phần triển khai

- [API Client](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/api-client/README.md)
- [Hook phía client](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-client/src/hooks.ts)
