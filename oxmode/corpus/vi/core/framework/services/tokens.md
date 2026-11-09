---
title: Hợp đồng dịch vụ và token
---

Hợp đồng dịch vụ định nghĩa những thao tác bên sử dụng có thể thực hiện. Token xác định phần triển khai trong container. Xuất cả hai từ mô-đun công khai để ứng dụng, plugin và bài kiểm thử dùng chung hợp đồng.

## Điểm vào ổn định
```ts
import { createServiceToken } from '@nocobase/service-provider';

export interface TitleService {
  normalize(value: string): string;
}

export const titleServiceToken =
  createServiceToken<TitleService>('@example/orders/title-service');
```

Bên sử dụng phụ thuộc vào `TitleService`, nên phần triển khai có thể thay đổi. Xuất lại hợp đồng và token từ điểm vào client hoặc server công khai của bên cung cấp, rồi khai báo package đó trong dependency của bên sử dụng.

## Định danh token

Mỗi lời gọi `createServiceToken()` tạo một đối tượng mới. Hai token cùng tên vẫn có định danh riêng. Import đúng token đã được xuất để phân giải dịch vụ.

Việc cài nhiều bản, import sâu vào tệp nội bộ hoặc đóng gói có thể tạo nhiều bản sao trong runtime. Căn chỉnh dependency dùng chung theo khoảng phiên bản peer và kiểm tra bản cài trùng cùng các điểm xuất của package.

## Thiết kế hợp đồng

Trả dữ liệu nghiệp vụ và mô tả rõ hành vi bất đồng bộ, lỗi cùng bên sở hữu tài nguyên. Chỉ nhận đầu vào cần thiết cho nghiệp vụ để dịch vụ có thể dùng được ngoài Application, Hono Context hoặc component cụ thể.

Client và server có thể dùng chung kiểu dữ liệu. Dịch vụ trình duyệt gọi thao tác từ xa qua API Client. Giữ dependency nội bộ của server ngoài giao diện dùng chung để chúng không đi vào bản build trình duyệt.

## Thay đổi hợp đồng và dùng bản thay thế

Thêm phương thức bắt buộc hoặc đổi ý nghĩa dữ liệu trả về ảnh hưởng đến bên sử dụng. Phối hợp phiên bản và kiểm thử cùng các bên liên quan. Container từ chối đăng ký trùng token. Chọn bản thay thế ngay khi lắp ghép môi trường kiểm thử.

Xem [Container](container.md), [Dịch vụ client](integration.md#client-services) và [Dịch vụ server](integration.md#server-services).

## Giao diện và phần triển khai

- [Định danh token](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/service-provider/src/token.ts)
- [Liên kết trong container](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/service-provider/src/container.ts)
