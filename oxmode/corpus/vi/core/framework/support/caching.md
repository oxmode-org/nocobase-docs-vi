---
title: Bộ nhớ đệm
---

`@nocobase/caching` cung cấp bộ nhớ đệm theo namespace, bộ đếm và bộ lọc Bloom. Ứng dụng dùng chung instance của host qua `cachingToken` từ `@nocobase/app-server/caching`. Bộ nhớ đệm tăng tốc thao tác đọc. Dữ liệu nghiệp vụ chính thức vẫn nằm ở nguồn lưu trữ bền vững.

## Tích hợp ứng dụng và plugin

Caching Provider tạo dịch vụ dùng chung từ cấu hình ứng dụng. Provider server của ứng dụng hoặc plugin có thể gọi hàm này với `app.container`, rồi truyền cache vào dịch vụ nghiệp vụ.

```ts
import { cachingToken } from '@nocobase/app-server/caching';
import type { ServiceResolver } from '@nocobase/service-provider';

export function orderSummaryCache(container: ServiceResolver) {
  return container.resolve(cachingToken).getCache({
    namespace: '@example/orders:summary',
    defaultTtl: '30s',
  });
}
```

Đọc qua `cache.wrap(key, loader)` và xóa các khóa bị ảnh hưởng sau khi thay đổi dữ liệu đã commit. Host đóng dịch vụ Caching dùng chung. Với instance độc lập, bên tạo chịu trách nhiệm dọn dẹp.

## Đọc bộ nhớ đệm

Ví dụ độc lập này dùng driver bộ nhớ mặc định.

```ts
import { createCaching } from '@nocobase/caching';

const caching = createCaching();
const cache = caching.getCache({ namespace: 'orders:summary', defaultTtl: '30s' });
try {
  const summary = await cache.wrap('today', async () => ({ count: 3 }));
  console.log(summary.count);
  await cache.delete('today');
} finally {
  await caching.dispose();
}
```

Plugin trong ứng dụng phân giải dịch vụ Caching của host để tái sử dụng giữa các yêu cầu. `get()` trả `undefined` khi thiếu dữ liệu. `set()` ghi, `delete()` xóa và `take()` đọc rồi xóa. Khi thiếu dữ liệu, `wrap()` nạp dữ liệu và gộp các lần nạp đồng thời của cùng một khóa trong một tiến trình.

TTL dạng số tính bằng mili giây. Cấu hình cũng nhận chuỗi như `30s`. Khi ghi dữ liệu, xóa hoặc cập nhật mục cache liên quan nếu kết quả đọc cần phản ánh thay đổi ngay.

## Namespace và phân quyền

Namespace phân tách mô-đun. Với dữ liệu lọc theo tenant, người dùng hoặc phạm vi quyền, đưa các chiều đó vào khóa. Cũng có thể giới hạn cache ở dữ liệu công khai, nơi kết quả giống nhau với mọi người. Xóa mục cache bị ảnh hưởng khi quyền thay đổi.

Tùy chọn khởi tạo Provider được cố định ở lần dùng đầu tiên. Thiết lập không tương thích sẽ báo lỗi. Driver `memory` tích hợp chỉ hoạt động trong một tiến trình. Đăng ký driver tùy chỉnh bằng `registerCachingDriver()` trước khi dùng tên như `redis`.

## Năng lực khác

`getCounter()` hỗ trợ tăng nguyên tử và đặt TTL khi tạo lần đầu. `getBloomFilter()` kiểm tra khả năng một phần tử thuộc tập hợp. Kết quả dương có thể sai, nên vẫn cần tra nguồn dữ liệu chính thức.

Việc gộp của `wrap()` chỉ áp dụng trong một tiến trình. Dùng ràng buộc nghiệp vụ và transaction cơ sở dữ liệu để kiểm soát số lần thực hiện thanh toán hoặc cập nhật tồn kho. Host giải phóng Provider khi tắt. Mã độc lập tự gọi `dispose()`.

## Giao diện và phần triển khai

- [Dịch vụ Caching](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/caching/src/caching.ts)
- [Hợp đồng cache](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/caching/src/types.ts)
- [Đăng ký driver](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/caching/src/drivers.ts)
- [Hợp đồng dịch vụ host](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/app/app-server/src/caching/token.ts)
