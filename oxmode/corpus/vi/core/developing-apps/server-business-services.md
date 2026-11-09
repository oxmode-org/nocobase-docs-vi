---
title: Dịch vụ phía máy chủ
description: Đăng ký dịch vụ dùng chung cho HTTP, CLI và tác vụ nền, rồi quản lý chính sách, transaction và vòng đời.
---

<a id="service-responsibilities"></a>

## Trách nhiệm của dịch vụ

Dịch vụ là lớp hoặc đối tượng đóng gói logic dùng lại. Có thể triển khai bằng lớp thông thường. Ví dụ, dịch vụ đơn hàng chia sẻ quy tắc xác nhận đơn và trừ tồn kho giữa endpoint HTTP, lệnh ứng dụng và tác vụ nền. Truy vấn hoặc tính toán đơn giản có thể dùng hàm thường.

Dịch vụ nhận đầu vào, xử lý nghiệp vụ và trả kết quả. Điểm vào xử lý xác thực, kiểm tra đầu vào và định dạng phản hồi. Provider tạo dịch vụ, cung cấp dependency và quản lý tài nguyên. Trong ví dụ, dịch vụ nhận chính sách quyền của người dùng qua đối số, độc lập với ngữ cảnh HTTP.

`order-services` là ứng dụng đơn hàng không có giao diện. Khi xác nhận, dịch vụ trừ tồn kho rồi ghi log sau khi commit. Ví dụ dùng xác thực, phân quyền, transaction và trình thực thi tác vụ thật. Xem [Mã nguồn và cách chạy](#example-source-and-running-the-app).

<a id="define-a-service"></a>

## Định nghĩa dịch vụ

<a id="service-interface-and-implementation"></a>

### Giao diện và triển khai dịch vụ

Khai báo các khả năng bên gọi cần trong `server/orders/service.ts` rồi triển khai trong `DefaultOrderService`:

```ts
export interface OrderService {
  get(policy: RepositoryPolicy, orderId: string): Promise<OrderView>;
  confirm(policies: ConfirmationPolicies, orderId: string): Promise<OrderView>;
}
```

`get()` đọc đơn hàng được phép truy cập. `confirm()` xác nhận đơn và trừ tồn kho. `RepositoryPolicy` là chính sách truy cập cơ sở dữ liệu. `ConfirmationPolicies` có chính sách riêng cho đơn hàng và sản phẩm. Cả hai phương thức trả `OrderView`, chỉ gồm ID, chủ sở hữu, sản phẩm, số lượng và trạng thái. Xem [mã nguồn dịch vụ](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/server/orders/service.ts) để tra đầy đủ kiểu và triển khai.

Ví dụ đặt mã trong `server/orders/`. Có thể dùng `server/services/`. Import và danh sách Provider xác định mã nào được nạp.

<a id="inject-dependencies-and-pass-arguments"></a>

### Tiêm dependency và truyền đối số

Tiêm cơ sở dữ liệu và hàm xử lý sau commit qua constructor. Truyền ID đơn và chính sách của lượt gọi vào phương thức. Đoạn sau minh họa constructor và phương thức đọc. Mã đầy đủ có thêm hàm chuyển đổi trường `view()`:

```ts
export class DefaultOrderService implements OrderService {
  constructor(
    private readonly database: DatabaseManager,
    private readonly onConfirmed: (order: OrderView) => void | Promise<void>,
  ) {}

  async get(policy: RepositoryPolicy, orderId: string): Promise<OrderView> {
    const row = await this.database
      .repository('orders')
      .withPolicy(policy)
      .findOne({ filter: { id: orderId } });
    if (!row) throw new OrderError('ORDER_UNAVAILABLE');
    return view(row);
  }
  // confirm() and view() are included in the complete source.
}
```

Một đối tượng có thể xử lý yêu cầu của nhiều người, mỗi lượt dùng chính sách riêng. Trong ví dụ, Alice đọc được đơn của mình, còn chính sách của cô loại đơn của Bob khỏi kết quả. [Kiểm thử tích hợp dịch vụ](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/tests/orders.test.ts) xác nhận hành vi này.

<a id="register-the-service"></a>

## Đăng ký dịch vụ

<a id="define-a-service-token"></a>

### Khai báo Token dịch vụ

Token là định danh có kiểu để container tra dịch vụ. Khai báo và xuất trong `server/providers/orders.ts`:

```ts
import { createServiceToken } from '@nocobase/service-provider';
import type { OrderService } from '../orders/service.js';

export const orderServiceToken = createServiceToken<OrderService>(
  'order-services/orders',
);
```

Các bên gọi import cùng Token. Container so khớp theo định danh đối tượng. Gọi lại `createServiceToken()` tạo định danh mới dù tên giống nhau.

<a id="register-the-service-in-a-provider"></a>

### Đăng ký dịch vụ trong Provider

Trong cùng tệp, gắn Token với hàm tạo ở `register()`. Đoạn sau dùng `orderServiceToken` ở trên. Xem [OrdersProvider](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/server/providers/orders.ts) để xem toàn bộ tệp, gồm khởi tạo phân quyền trong `boot()`.

```ts
import type { Application } from '@nocobase/app-server/application';
import { loggingToken } from '@nocobase/app-server/logging';
import { databaseManagerToken } from '@nocobase/db';
import { ServiceProvider } from '@nocobase/service-provider';
import { DefaultOrderService } from '../orders/service.js';

export default class OrdersProvider extends ServiceProvider<Application> {
  readonly name = 'order-services/orders';
  override register(): void {
    this.app.container.singleton(
      orderServiceToken,
      (resolver) =>
        new DefaultOrderService(
          resolver.resolve(databaseManagerToken),
          (order) =>
            resolver
              .resolve(loggingToken)
              .getLogger('orders')
              .info({ orderId: order.id }, 'Order confirmed'),
        ),
    );
  }
}
```

`singleton()` đăng ký hàm tạo đồng bộ. Hàm chạy ở lần tra đầu tiên, rồi container dùng lại đối tượng đó. Hàm tạo dùng `resolver.resolve()` để lấy cơ sở dữ liệu và dịch vụ ghi log rồi truyền vào dịch vụ đơn hàng. Dịch vụ gọi hàm ghi log sau khi transaction commit.

Đặt khởi tạo bất đồng bộ trong phương thức vòng đời Provider để hàm tạo trả về đối tượng trực tiếp. Xem [Container dịch vụ và tiêm dependency](../framework/services/container.md) về các cách đăng ký khác.

<a id="connect-the-provider-to-the-application"></a>

### Kết nối Provider với ứng dụng

```ts
// server/providers/index.ts
import OrdersProvider from './orders.js';
import OrderJobsProvider from './order-jobs.js';

export default [OrdersProvider, OrderJobsProvider];
```

[server/runtime.ts](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/server/runtime.ts) truyền mảng này vào `defineAppRuntime({ serviceProviders, ... })` để ứng dụng nạp khi lắp ghép. Sau khi tạo tệp Provider, thêm nó vào danh sách đăng ký.

Trong ứng dụng dùng template Default, thêm Provider vào danh sách hiện có và giữ `SubmissionProvider` cùng cấu hình khác. Danh sách trong ví dụ dành cho máy chủ độc lập.

<a id="call-the-service"></a>

## Gọi dịch vụ

Sau khi ứng dụng đăng ký Provider, lấy dịch vụ từ container. Trong `server/routes/orders.ts`, import cùng Token và dùng `app` từ callback `defineApiRoutes()`:

```ts
import { orderServiceToken } from '../providers/orders.js';

// Inside the defineApiRoutes() callback.
const service = app.container.resolve(orderServiceToken);
```

Các lượt `resolve()` trong cùng container trả cùng đối tượng dịch vụ. Lệnh và tiến trình worker riêng tạo ứng dụng và đối tượng dịch vụ riêng.

Thiếu Token, đăng ký trùng hoặc dependency vòng sẽ phát sinh lỗi. Nếu hàm tạo singleton thất bại, các lần tra tiếp tục ném lại lỗi đó.

<a id="from-an-http-endpoint"></a>

### Từ endpoint HTTP

Xác thực, phân quyền và kiểm tra đầu vào trước khi gọi dịch vụ. Đây là phần xử lý của [endpoint xác nhận](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/server/routes/orders.ts). Tệp đầy đủ còn khai báo `auth.required()`, `authz.middleware()`, `apiValidator()` và tài liệu API:

```ts
const policies = await authorizeOrder(c.get('authz'), 'confirm');
return c.json({
  data: await service.confirm(policies, c.req.valid('param').id),
});
```

Chạy `pnpm demo` với ứng dụng ví dụ đang chạy. Lệnh đăng nhập tài khoản thường và gọi `POST /main/api/orders/:id/confirm`. Xác nhận đơn thuộc sở hữu trả `200` và `data.status: "confirmed"`. Người chỉ đọc nhận `403`. Truy cập đơn của người khác nhận `404`. Xem [script minh họa](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/scripts/demo.ts) để tra yêu cầu và phản hồi, và [Route và API HTTP](apis-and-services.md) để khai báo route.

<a id="from-an-application-command"></a>

### Từ lệnh ứng dụng

Dùng `AppCommand.withApp()` và khởi động rõ các giai đoạn vòng đời lệnh cần. Đây là lời gọi chính trong [lệnh xác nhận](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/cli/commands/orders/confirm.ts). Xem mã đầy đủ để tra ánh xạ lỗi:

```ts
const result = await this.withApp(async ({ app }) => {
  await app.start();
  return confirmFromCommand(app, args.actorId, args.orderId);
});
```

`withApp()` tạo ứng dụng và dọn dẹp khi xong. Lệnh chủ động khởi động Provider khi cần. Ví dụ khai báo quyền nghiệp vụ trong `boot()` nên gọi `app.start()` trước. Hàm `confirmFromCommand()` kiểm tra người dùng được chọn, lấy chính sách rồi gọi dịch vụ:

```ts
const policies = await authorizeOrder(
  await actorContext(app, actorId),
  'confirm',
);
return app.container.resolve(orderServiceToken).confirm(policies, orderId);
```

Chạy `pnpm confirm <actorId> <orderId> --json` trong thư mục ví dụ. Khi thành công, kết quả có `ok: true` và `result.status: "confirmed"`. Lấy ID từ `storage/demo.json` được tạo khi thiết lập. Người vận hành cục bộ chọn tài khoản hiện có. [Adapter lệnh](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/cli/confirm.ts) kiểm tra tài khoản và lấy quyết định phân quyền mới để áp dụng đúng phạm vi người đó. Xem [Lệnh ứng dụng](application-commands.md).

<a id="from-a-background-job"></a>

### Từ tác vụ nền

Payload tác vụ chỉ chứa dữ liệu JSON. Giữ kết nối, đối tượng dịch vụ và ngữ cảnh yêu cầu bên ngoài payload. Trình thực thi tạo lại đối tượng tác vụ từ payload. Provider có thể cung cấp dependency qua closure:

```ts
import { Job } from '@nocobase/jobs';
import type { Application } from '@nocobase/app-server/application';
import type { OrderService } from './service.js';
import { authorizeOrder } from './permissions.js';
import { actorContext } from './actor.js';
export function createConfirmOrderJob(app: Application, service: OrderService) {
  return class ConfirmOrderJob extends Job<{
    orderId: string;
    actorId: string;
  }> {
    static readonly jobName = 'orders.confirm';
    async execute(): Promise<void> {
      const context = await actorContext(app, this.payload.actorId);
      const policies = await authorizeOrder(context, 'confirm');
      await service.confirm(policies, this.payload.orderId);
    }
  };
}
```

[Provider tác vụ](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/server/providers/order-jobs.ts) lấy dịch vụ trong `start()` và truyền cho hàm tạo:

```ts
const ConfirmOrderJob = createConfirmOrderJob(
  this.app,
  this.app.container.resolve(orderServiceToken),
);
this.executor = this.app.container
  .resolve(jobExecutorServiceToken)
  .getJobExecutor('order-services');
this.executor.registerJob(ConfirmOrderJob);
await this.executor.setup();
```

Đăng ký lớp tác vụ trước khi khởi động trình thực thi. Xem tệp đầy đủ để tra import và điểm gửi tác vụ. Tệp import `jobExecutorServiceToken` từ `@nocobase/app-server/jobs`. Xem [job.ts](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/server/orders/job.ts) để tra triển khai.

Endpoint gửi tác vụ chỉ lấy `actorId` từ ngữ cảnh đã xác thực. Khi chạy, tác vụ kiểm tra lại tài khoản và quyền. Ví dụ gán vai trò trực tiếp. Nếu nghiệp vụ dựa trên thành viên nhóm, xác định tư cách thành viên từ nguồn tin cậy ở cả điểm vào ngoài HTTP.

`pnpm demo` cũng gọi `POST /main/api/orders/:id/confirmAsync`, nhận `202` kèm `jobId`, rồi truy vấn định kỳ đến khi đơn thành `confirmed`. Mã 202 chỉ xác nhận đã tiếp nhận. Xem [Tác vụ nền và thực thi theo lịch](background-tasks.md) để cấu hình trình thực thi.

<a id="manage-the-lifecycle"></a>

## Quản lý vòng đời

<a id="initialization-and-startup"></a>

### Khởi tạo và khởi động

| Giai đoạn | Cách dùng trong ví dụ |
| --- | --- |
| `register()` | Gắn hàm tạo dịch vụ đơn hàng |
| `boot()` | Khai báo thao tác nghiệp vụ và phạm vi bản ghi |
| `start()` | Đăng ký lớp Job, khởi động trình thực thi và cung cấp điểm gửi |
| `ready()` | Thực hiện công việc cần tất cả Provider đã khởi động. Ví dụ dùng hành vi mặc định |
| `shutdown()` | Đóng trình thực thi do Provider dùng |

Framework chạy từng giai đoạn qua các Provider. Khi `boot()` bắt đầu, mọi Provider đã đăng ký nhưng một số có thể chưa khởi tạo xong. Khi dừng, framework duyệt Provider theo thứ tự ngược. Xem [ServiceProvider](../extension-development/service-provider.md).

<a id="isolate-request-state-and-release-resources"></a>

### Cô lập trạng thái yêu cầu và giải phóng tài nguyên

Singleton có thể dùng chung dependency cấp ứng dụng. Truyền người dùng, chính sách, đầu vào và kết nối transaction qua đối số để chúng thuộc riêng từng lượt gọi. Nhờ vậy, Alice và Bob giữ phạm vi riêng khi dùng cùng dịch vụ.

[Provider tác vụ](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/server/providers/order-jobs.ts) giữ trình thực thi và chờ nó dừng:

```ts
override async shutdown(): Promise<void> {
  await this.executor?.shutdown();
}
```

Khi máy chủ HTTP dừng hoặc lệnh kết thúc, Provider chờ trình thực thi đóng. Chỉ giải phóng tài nguyên do Provider hiện tại quản lý. Provider cơ sở dữ liệu của ứng dụng chịu trách nhiệm đóng cơ sở dữ liệu.

<a id="handle-permissions-transactions-and-errors"></a>

## Xử lý quyền, transaction và lỗi

<a id="pass-permission-policies"></a>

### Truyền chính sách quyền

Ví dụ khai báo `orders.read` và `orders.confirm`. Xác nhận cần quyền đọc, cập nhật đơn và đọc, cập nhật tồn kho, với chính sách riêng cho từng Collection. [authorizeOrder()](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/server/orders/permissions.ts) lấy chính sách từ quyết định phân quyền tin cậy. Dịch vụ gắn từng chính sách vào Repository bằng `withPolicy()`:

```ts
// Inside the service's transaction callback.
const orders = connection.repository('orders').withPolicy(policies.orders);
const products = connection.repository('products').withPolicy(policies.products);
```

Phạm vi bản ghi `orders.owned` lọc `ownerId` theo người dùng hiện tại. Alice và Bob thao tác trên đơn của mình. Robin chỉ có quyền đọc. [Hàm thiết lập](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/scripts/fixtures.ts) tạo vai trò và dữ liệu mẫu, rồi chỉ cấp quyền nghiệp vụ cho người dùng phù hợp.

Chỉ lấy `RepositoryPolicy` từ hệ thống phân quyền. Dùng chính sách sản phẩm riêng. Gắn lại chính sách khi lấy Repository mới, kể cả trong callback transaction. Xem [Xác thực, quyền và phạm vi dữ liệu](authentication-and-permissions.md).

<a id="manage-transactions-and-post-commit-work"></a>

### Quản lý transaction và xử lý sau commit

Đưa các thao tác phải cùng thành công hoặc cùng rollback vào một transaction trong phương thức dịch vụ. Đoạn sau minh họa ranh giới trong `DefaultOrderService.confirm()`. Xem [mã nguồn dịch vụ](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/server/orders/service.ts) để tra cách đọc đơn, kiểm tra trạng thái và cập nhật tồn kho.

```ts
return this.database.transaction(async (connection) => {
  const orders = connection.repository('orders').withPolicy(policies.orders);
  const products = connection.repository('products').withPolicy(policies.products);

  // ... Read the order, check its state and update it together with stock.
  const result = { ...order, status: 'confirmed' };
  connection.afterCommit(() => this.onConfirmed(result));
  return result;
});
```

Đọc đơn, cập nhật trạng thái và trừ tồn kho đều dùng kết nối của callback transaction. Thiếu tồn kho sẽ ném lỗi và hoàn tác cả thay đổi trạng thái trước đó. Chỉ dùng Repository lấy từ kết nối transaction trong callback.

Ví dụ cập nhật có điều kiện để xác nhận đơn vẫn là `draft` và tồn kho còn khớp giá trị vừa đọc. Nhờ vậy, các lần ghi đồng thời tránh ghi đè nhau. Đơn đã xác nhận trả về ngay và giữ nguyên tồn kho. Sau xung đột, đọc lại trạng thái trước khi quyết định thử lại. Xem [Transaction và tính nhất quán dữ liệu](transactions-and-consistency.md).

Đơn 99 sản phẩm vẫn là `draft` sau khi xác nhận thất bại và tồn kho giữ nguyên. [Kiểm thử tích hợp](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/tests/orders.test.ts) cũng xác nhận nhiều lượt xác nhận chồng lấn chỉ trừ tồn kho một lần.

Callback `afterCommit()` chạy sau khi transaction ngoài cùng commit và bị bỏ khi rollback. Với callback đăng ký trong transaction, `transaction()` trả về sau khi chúng hoàn tất. Ví dụ dùng nó để gọi hàm ghi log được tiêm, tạo dòng `Order confirmed`.

Nếu callback lỗi, dữ liệu đã commit vẫn giữ nguyên và Promise của transaction vẫn hoàn tất. Lỗi đi tới `onTransactionCallbackError` hoặc thành cảnh báo khi chưa cấu hình trình xử lý. Kết nối transaction đã kết thúc, nên lần ghi sau cần kết nối gốc hoặc transaction mới. Xem [Cơ chế transaction](../framework/database/transactions.md).

Chạy `pnpm test -t post-commit` để tái hiện callback ném lỗi. Đơn vẫn được commit và xác nhận lại không chạy lại callback. Để bảo đảm gửi tin cậy, lưu công việc đang chờ gửi cùng thay đổi nghiệp vụ và thiết kế cơ chế thử lại, khôi phục.

<a id="return-results-and-handle-business-errors"></a>

### Trả kết quả và xử lý lỗi nghiệp vụ

Dịch vụ trả `OrderView` khi thành công và ném lỗi nghiệp vụ khi thất bại. Điểm vào HTTP quyết định mã trạng thái. `OrderError` cung cấp mã lỗi ổn định cho bên gọi:

```ts
export class OrderError extends Error {
  constructor(
    public readonly code:
      'ORDER_UNAVAILABLE' | 'OUT_OF_STOCK' | 'ORDER_CONFLICT',
  ) {
    super(code);
  }
}
```

Điểm vào HTTP ánh xạ `ORDER_UNAVAILABLE` sang 404, còn thiếu tồn kho hoặc xung đột trạng thái sang 409. Lệnh chuyển chúng thành `CommandError`. Tác vụ để trình thực thi ghi nhận thất bại. Các ngoại lệ Repository khác tiếp tục truyền lên. Xem [định nghĩa lỗi](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/server/orders/service.ts) và [ánh xạ HTTP](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/server/routes/orders.ts).

<a id="example-source-and-running-the-app"></a>

## Mã nguồn và cách chạy

<a id="install-and-start"></a>

### Cài đặt và khởi động

[Ví dụ đầy đủ và README](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/README.md) chỉ vị trí mã và hướng dẫn từng bước. Dùng Node.js 24 và pnpm 11.7.0. Dependency đã khóa phiên bản, gồm `@nocobase/app-server` `3.0.0-beta.4`, `@nocobase/db` `1.0.0-beta.23` và `@nocobase/service-provider` `0.0.2-beta.2`.

```sh
git clone https://github.com/nocobase/docs-examples-v3.git
cd docs-examples-v3
git checkout 89d899c436563335529aba9b75fbc12b5dc0db34
cd apps/order-services
pnpm install --frozen-lockfile
pnpm setup
pnpm start
```

`pnpm setup` sinh cấu hình cục bộ, tài khoản thường và đơn mẫu. Thông tin đăng nhập và ID đơn lưu trong `storage/demo.json`, ngoài Git. Cấu hình và dữ liệu mẫu hiện có được giữ lại. Địa chỉ API mặc định là `http://localhost:13210/main/api`. Khi đổi host, đặt cùng `APP_PUBLIC_ORIGIN` cho máy chủ và script.

Ví dụ đã kiểm chứng cục bộ với SQLite và adapter tác vụ trong bộ nhớ. Cơ sở dữ liệu khác, trình thực thi Redis và gửi dữ liệu ra ngoài cần kiểm chứng riêng.

<a id="run-and-verify"></a>

### Chạy và kiểm tra

Từ terminal thứ hai trong `apps/order-services`, chạy phần minh họa HTTP và tác vụ nền:

```sh
pnpm demo
```

Script đăng nhập người dùng mẫu rồi in phản hồi khi xác nhận thành công, xác nhận lại, thiếu tồn kho, thiếu quyền và chạy nền. Truy vấn cuối phải cho thấy đơn của tác vụ nền ở trạng thái `confirmed`. Lần xác nhận thành công đầu tiên ghi `Order confirmed`. Khi xác nhận lại, tồn kho và log này giữ nguyên.

Dùng adapter trong bộ nhớ trong một tiến trình. Dừng máy chủ HTTP trước, rồi thay đối số bên dưới bằng `buyer.id` và `orders.cli` từ `storage/demo.json`:

```sh
pnpm confirm <actorId> <orderId> --json
```

Thành công trả `ok: true` và `result.status: "confirmed"`. Dùng `reader.id` và `orders.reader` sẽ bị từ chối với mã thoát khác 0.

Chạy kiểm tra tĩnh, kiểm thử tích hợp và biên dịch:

```sh
pnpm typecheck
pnpm test
pnpm build
```

[Kiểm thử tích hợp](https://github.com/nocobase/docs-examples-v3/blob/89d899c436563335529aba9b75fbc12b5dc0db34/apps/order-services/tests/orders.test.ts) dùng ứng dụng thật với cơ sở dữ liệu cô lập. Chúng kiểm tra xác nhận lặp và đồng thời, rollback, cô lập dữ liệu theo người dùng, chạy qua lệnh và tác vụ, và từ chối nếu người dùng của tác vụ mất quyền hoặc bị vô hiệu hóa. Kiểm thử lỗi sau commit phát cảnh báo và xác nhận đơn vẫn được commit, callback chỉ chạy một lần.

`pnpm build` biên dịch ví dụ máy chủ. Quan sát hành vi qua endpoint, lệnh và log. Ví dụ chỉ có các điểm vào phía máy chủ.
