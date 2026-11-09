---
title: Tích hợp dịch vụ client và server
description: Tích hợp hợp đồng dịch vụ với container client và server, xác định trách nhiệm của ứng dụng, plugin, yêu cầu và component.
---

`@nocobase/service-provider` cung cấp cùng cơ chế container, token và vòng đời cho ứng dụng và plugin. Trình duyệt và server có container riêng. Hai bên có thể dùng chung hợp đồng trong khi mỗi runtime duy trì instance riêng.

## Chọn điểm đăng ký và sử dụng

| Vị trí | Đăng ký | Sử dụng |
| --- | --- | --- |
| Client ứng dụng | ServiceProvider client được kết nối qua runtime ứng dụng | `useService()` trong React, đối số constructor trong dịch vụ thông thường |
| Client plugin | `serviceProviders` trong `client/plugin.ts` | Import token công khai và dùng container client hiện tại |
| Server ứng dụng | Tập hợp Provider kết nối qua runtime ứng dụng | Phân giải qua `app.container.resolve()` rồi truyền dependency cho mã nghiệp vụ |
| Server plugin | `serviceProviders` trong `server/plugin.ts` | Dùng container host và vòng đời do ứng dụng quản lý |

Provider của ứng dụng thường được tập hợp ở `client/service-provider.ts` và `server/providers/index.ts`. Đăng ký Provider trong tệp mà runtime hiện tại tham chiếu. Xem [Dịch vụ client](../../developing-apps/client-business-services.md), [Dịch vụ server](../../developing-apps/server-business-services.md) và [Khai báo plugin](../../extension-development/plugin-declarations.md).

<h2 id="client-services">Dịch vụ client</h2>

Dịch vụ client chứa hành vi nghiệp vụ dùng qua nhiều trang, lớp bọc yêu cầu hoặc trạng thái dùng chung. Component trình bày chúng. Dịch vụ cung cấp thao tác có thể gọi độc lập. Dữ liệu tạm của biểu mẫu thường thuộc component hoặc React Context.

### Cho phép đăng ký theo dõi trạng thái

```ts
import type { ClientApplication } from '@nocobase/app-client';
import { useService } from '@nocobase/app-client';
import { ServiceProvider, createServiceToken } from '@nocobase/service-provider';
import { useSyncExternalStore } from 'react';

export class CompactPreference {
  private value = false;
  private listeners = new Set<() => void>();
  getSnapshot = () => this.value;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  set(value: boolean) {
    if (value === this.value) return;
    this.value = value;
    for (const listener of this.listeners) listener();
  }
}
export const compactToken = createServiceToken<CompactPreference>('orders.compact');

export class CompactServiceProvider extends ServiceProvider<ClientApplication> {
  readonly name = 'orders.compact';
  register() {
    this.app.container.singleton(compactToken, () => new CompactPreference());
  }
}

export function useCompact() {
  const service = useService(compactToken);
  const value = useSyncExternalStore(service.subscribe, service.getSnapshot);
  return { value, set: (next: boolean) => service.set(next) };
}
```

Thêm `CompactServiceProvider` vào `serviceProviders` của client ứng dụng hoặc mảng đóng góp của plugin. Component gọi `useCompact()` để đọc và cập nhật tùy chọn.

`useService()` phân giải dịch vụ. `useSyncExternalStore` đăng ký cập nhật cho React và gỡ listener khi unmount. Giữ snapshot ổn định trong khi giá trị giữ nguyên. Tạo đối tượng mới mỗi lần đọc có thể làm phát sinh cập nhật thừa.

### Gọi server

Dùng HTTP client đã cấu hình qua `useApiClient()`, `apiClientToken` hoặc dependency injection qua constructor. Truyền tín hiệu hủy xuống yêu cầu để UI xử lý tải, lỗi và thử lại.

Server tự xác định quyền truy cập. Khi danh tính thay đổi, xóa trạng thái theo người dùng và cache yêu cầu cũ ở trình duyệt.

### Quyền sở hữu và kiểm thử

Ví dụ chỉ lưu trạng thái trong bộ nhớ. Provider quản lý kết nối và listener toàn cục. Component quản lý đăng ký cục bộ. Kiểm thử việc dùng chung singleton, render lại sau cập nhật và dọn dẹp listener.

Xem [API Client](../http/api-client.md) và [React Provider](../runtime/react-providers.md).

### Giao diện và phần triển khai

- [Tích hợp dịch vụ client](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-client/README.md)
- [React hook](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-client/src/hooks.ts)

<h2 id="server-services">Dịch vụ server</h2>

Dịch vụ server tập trung quy tắc nghiệp vụ để HTTP, CLI và tác vụ nền dùng chung. Điểm vào kiểm tra đầu vào và thiết lập danh tính. Truyền policy dữ liệu và ràng buộc nghiệp vụ rõ ràng qua chuỗi lời gọi.

### Tiêm tài nguyên framework

Ví dụ giả định Collection `orders` có trường `id` và `title`.

```ts
import type { DatabaseManager, RepositoryPolicy } from '@nocobase/db';

export class OrdersService {
  constructor(private readonly database: DatabaseManager) {}

  async list(policy: RepositoryPolicy) {
    return this.database.repository('orders').withPolicy(policy).findMany({
      select: (s) => s.fields('id', 'title'),
      sort: (s) => [s.field('id').asc()],
      limit: 20,
    });
  }
}
```

ServiceProvider phân giải `databaseManagerToken`, tiêm nó vào `OrdersService` và đăng ký token nghiệp vụ. Route phân giải dịch vụ và truyền policy do cơ chế phân quyền xác định. Xử lý policy như dữ liệu tin cậy do server xây dựng.

### Giữ trạng thái yêu cầu ngoài singleton

Các lời gọi đồng thời có thể ghi đè lên nhau nếu dịch vụ lưu người dùng hiện tại, transaction hoặc đầu vào yêu cầu trong thuộc tính. Hãy truyền chúng dưới dạng đối số. Chuyển HTTP Context thành ngữ cảnh nghiệp vụ gọn ở ranh giới route để dịch vụ độc lập với web framework.

### Transaction và tác động bên ngoài

Với thao tác ghi nhiều bước cần tính nguyên tử, mở transaction và lấy Repository từ kết nối của callback. Dùng kết nối này trong phạm vi callback. Email, lời gọi HTTP và thao tác gửi vào hàng đợi thường có vòng đời riêng với rollback cơ sở dữ liệu. Thực hiện sau commit, kèm cơ chế thử lại và khóa idempotency phù hợp nghiệp vụ.

Commit cơ sở dữ liệu và gửi thông báo là hai kết quả riêng. Khi cần bảo đảm giao, lưu công việc đang chờ bền vững và có quy trình khôi phục.

### Nhiều điểm vào và kiểm thử

CLI và tác vụ nền có danh tính thực thi riêng với trình duyệt. Xác định chủ thể thực thi và phạm vi dữ liệu được phép cho từng luồng.

Dùng kiểm thử đơn vị cho quy tắc, đồng thời kiểm thử trên cơ sở dữ liệu thật cho policy, transaction và thao tác đồng thời. Xem [Dịch vụ server](../../developing-apps/server-business-services.md) và [Transaction](../database/transactions.md).

### Giao diện và phần triển khai

- [Tích hợp dịch vụ cơ sở dữ liệu](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/database/index.ts)
- [Policy của Repository](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/api-reference/permissions.md)
