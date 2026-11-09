---
title: Container dịch vụ
---

Container dịch vụ tách bên sử dụng khỏi khâu khởi tạo. Bên sử dụng phụ thuộc vào giao diện và token. Khi lắp ghép ứng dụng, ứng dụng chọn phần triển khai cụ thể. Client và server cùng dùng cơ chế này, mỗi bên có instance riêng.

## Đăng ký và phân giải
```ts
import { ServiceContainer, createServiceToken } from '@nocobase/service-provider';

interface Titles { normalize(value: string): string }
const titlesToken = createServiceToken<Titles>('example.titles');
const container = new ServiceContainer();
container.singleton(titlesToken, () => ({ normalize: (value) => value.trim() }));

const titles = container.resolve(titlesToken);
console.log(titles.normalize('  Order  ')); // Order
```

Ví dụ độc lập này tạo container riêng. Trong mã ứng dụng, dùng `app.container` đã có và chia sẻ trong phạm vi runtime.

| Phương thức | Hành vi |
| --- | --- |
| `instance(token, value)` | Liên kết giá trị có sẵn với token |
| `singleton(token, factory)` | Tạo đồng bộ ở lần phân giải đầu tiên rồi dùng lại instance |
| `resolve(token)` | Phân giải dịch vụ. Báo lỗi khi thiếu dependency hoặc có vòng phụ thuộc |
| `has(token)` | Kiểm tra liên kết mà không tạo instance |
| `resolveIfCreated(token)` | Trả về instance đã tạo hoặc `undefined` |

## Cung cấp dependency

Factory singleton nhận một resolver. Phân giải dependency tại đây và truyền vào constructor của lớp nghiệp vụ. Nhờ vậy, bài kiểm thử có thể truyền đối tượng thay thế trực tiếp.

Factory chạy đồng bộ. Mở kết nối và chuẩn bị tài nguyên bất đồng bộ trong hook vòng đời ServiceProvider. Đăng ký instance dịch vụ qua container và chờ phần khởi tạo trong hook.

## Phạm vi và xử lý lỗi

Singleton có phạm vi một container. Truyền rõ danh tính, transaction và tín hiệu hủy qua từng lời gọi để giữ trạng thái theo yêu cầu.

Container báo lỗi khi đăng ký trùng hoặc phát hiện vòng phụ thuộc. Khi factory thất bại, container giữ trạng thái lỗi. Nếu cần khôi phục kết nối, triển khai cơ chế khôi phục trong dịch vụ.

Xem [ServiceProvider](../../extension-development/service-provider.md) để đăng ký và [Hợp đồng dịch vụ và token](tokens.md) để chia sẻ định danh giữa các package.

## Giao diện và phần triển khai

- [Container](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/service-provider/src/container.ts)
