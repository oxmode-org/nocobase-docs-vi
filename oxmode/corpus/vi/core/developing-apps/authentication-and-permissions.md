---
title: Xác thực, quyền và phạm vi dữ liệu
description: Xác thực endpoint, khai báo thao tác nghiệp vụ và kiểm soát quyền trên bản ghi và trường qua chính sách Repository.
---

Trong ví dụ Customer Access, nhân viên kinh doanh quản lý khách hàng của mình và đổi khách hàng gắn với đơn hàng. Nhân viên chỉ đọc chỉ xem được bản ghi. Ứng dụng dùng xác thực, phân quyền và lưu trữ cơ sở dữ liệu thật, cùng thành phần shadcn và trang quản trị người dùng, vai trò của template mặc định. Xem [Mã nguồn và thiết lập](#example-source-and-setup).

<a id="responsibilities-of-authentication-operation-permissions-and-data-scopes"></a>

## Trách nhiệm của xác thực, quyền thao tác và phạm vi dữ liệu

Xác thực xác định danh tính bên gọi. Quyền thao tác quyết định bên gọi có được thực hiện hành động nghiệp vụ hay không. Chính sách dữ liệu xác định bản ghi và trường mà hành động có thể truy cập.

| Bước kiểm tra | Tích hợp trong ví dụ | Kết quả khi bị từ chối |
| --- | --- | --- |
| Xác thực | `required()` từ `authenticationToken` | Yêu cầu chưa xác thực nhận `401` |
| Quyền thao tác | `authorize()` trên ngữ cảnh phân quyền của yêu cầu | Thiếu quyền hành động trả `403` |
| Quyền trên bản ghi và trường | Gắn `RepositoryPolicy` từ quyết định phân quyền vào Repository | Bản ghi ngoài phạm vi bị chặn. Trường ngoài khai báo bị chặn đọc hoặc ghi |

Quyền vào trang và việc hiển thị nút giúp người dùng tìm tính năng khả dụng. Endpoint vẫn phải tự thực thi các bước kiểm tra khi nhận yêu cầu trực tiếp.

<a id="authenticate-endpoints"></a>

## Xác thực endpoint

<a id="require-sign-in-and-read-the-current-user"></a>

### Yêu cầu đăng nhập và đọc người dùng hiện tại

Template mặc định đã đăng ký xác thực. Lấy `authenticationToken` trong route, gắn `auth.required()` vào các đường dẫn nghiệp vụ và đọc phiên đã xác minh bằng `c.get('auth')`. Khi tạo khách hàng, ví dụ lấy `ownerId` từ phiên để máy chủ quyết định chủ sở hữu.

```ts
import { authenticationToken } from '@nocobase/app-plugin-authentication';

const auth = app.container.resolve(authenticationToken);
// Inside a request handler after required():
const ownerId = c.get('auth')!.user.id;
```

Yêu cầu ẩn danh `GET /api/customers` nhận `401`. Bên gọi đã đăng nhập vẫn cần quyền xem khách hàng. Ví dụ dùng trang đăng nhập và phiên chuẩn của ứng dụng. Đặt phương thức đăng nhập và cấu hình phiên trong `server/config/auth.ts`, tách khỏi endpoint nghiệp vụ.

Xem [route nghiệp vụ][routes] và [cấu hình xác thực][auth-config].

<a id="mount-authentication-and-authorization-middleware"></a>

### Gắn middleware xác thực và phân quyền

Hàm tạo route nhận đối tượng ứng dụng. Sau xác thực, `authz.middleware()` tạo ngữ cảnh phân quyền riêng cho yêu cầu. `AuthEnv & AuthorizationEnv` định kiểu biến ngữ cảnh của Hono.

```ts
import { Hono } from 'hono';
import type { AuthEnv } from '@nocobase/app-plugin-authentication';
import {
  authorizationToken,
  type AuthorizationEnv,
} from '@nocobase/app-plugin-authorization/server';

const router = new Hono<AuthEnv & AuthorizationEnv>();
const authz = app.container.resolve(authorizationToken);
for (const path of ['/customers', '/customers/*', '/orders', '/orders/*']) {
  router.use(path, auth.required(), authz.middleware());
}
```

Route đầy đủ còn giới hạn kích thước thân yêu cầu, kiểm tra đầu vào và khai báo tài liệu API. Middleware chỉ bao phủ đường dẫn của mô-đun này để các endpoint khác như đăng nhập hoạt động bình thường. Tạo ngữ cảnh mới cho mỗi yêu cầu và giữ người dùng, quyết định phân quyền trong ngữ cảnh đó. Thuộc tính `security` của `describeRoute()` chỉ mô tả endpoint. Middleware thực hiện xác thực.

Xem [route và đăng ký][routes] cùng [Route và API HTTP](apis-and-services.md) để biết loại route và cách đăng ký.

<a id="declare-business-operations"></a>

## Khai báo thao tác nghiệp vụ

<a id="define-database-capabilities-and-field-access"></a>

### Khai báo quyền cơ sở dữ liệu và quyền trên trường

`defineDatabasePermission()` khai báo khả năng truy cập cơ sở dữ liệu mà hành động cần. `defineCompositeResource()` kết hợp các khả năng đó thành thao tác nghiệp vụ có thể cấp cho người dùng. Sau khi khai báo, đăng ký tài nguyên và cấp quyền riêng.

```ts
import { defineDatabasePermission } from '@nocobase/app-plugin-authorization/server';
import { defineCompositeResource } from '@nocobase/authorization/core';

const customers = defineDatabasePermission((p) =>
  p.collection('accessCustomers')
    .read(['id', 'name', 'email', 'notes', 'ownerId']),
);

// Excerpt from accessResource, omitting titles and other actions.
const resource = defineCompositeResource('customerAccess', (r) =>
  r.action('editCustomer', (a) =>
    a.grant('customers', customers.update(['name', 'email', 'notes'])),
  ),
);
```

`read()` giới hạn trường đầu ra. `create()` và `update()` giới hạn trường đầu vào. Khai báo đọc loại `internalNote`, còn cập nhật loại `ownerId`. Sửa nội dung yêu cầu vẫn không cho phép nhân viên đọc ghi chú nội bộ hay đổi chủ sở hữu.

Nhà phát triển xác định quyền trên trường. Trong trình chỉnh sửa quyền, quản trị viên chọn thao tác nghiệp vụ và phạm vi bản ghi. Ứng dụng còn khai báo `viewCustomers`, `createCustomer`, `viewOrders` và `assignCustomer` thành các hành động cấp quyền độc lập.

Xem [khai báo quyền đầy đủ][permissions]. Đăng nhập bằng tài khoản kinh doanh chỉ đọc để thấy danh sách Customers chỉ có thao tác xem.

![Nhân viên chỉ đọc thấy khách hàng của mình và các thao tác xem](/assets/core/developing-apps/authentication-and-permissions/customers-readonly.png)

<a id="combine-permissions-across-collections"></a>

### Kết hợp quyền trên nhiều Collection

Đổi khách hàng của đơn yêu cầu quyền sửa đơn và quyền chọn khách hàng. `assignCustomer` khai báo cả hai trong cùng một thao tác:

```ts
const orders = defineDatabasePermission((p) =>
  p.collection('accessOrders').read(['id', 'number', 'customerId', 'ownerId']),
);

// Within the same customerAccess resource:
.action('assignCustomer', (a) =>
  a.grant('orders', orders.update(['customerId']))
    .grant('customers', customers),
)
```

`orders` và `customers` là khóa phạm vi trong cấu hình vai trò. Chính sách trong `conditions.database` dùng tên Collection `accessOrders` và `accessCustomers` làm khóa. Khi đổi khách hàng, dùng phạm vi khách hàng từ quyết định `assignCustomer`.

Chọn **Change customer** trong menu hàng của đơn. Các tùy chọn phân trang đến từ `/api/orders/customerOptions` và endpoint kiểm tra `assignCustomer`.

Xem [khai báo quyền][permissions] và [trang chọn khách hàng][assignment].

<a id="register-operations-and-the-permission-editor-entry"></a>

### Đăng ký thao tác và mục trong trình chỉnh sửa quyền

Đăng ký các Collection, tài nguyên và mục workspace trong `boot()` của Provider, rồi thêm Provider vào `server/providers/index.ts`. `CustomerAccessProvider` cũng đăng ký dịch vụ nghiệp vụ và chiến lược bản ghi thuộc sở hữu.

```ts
const authz = this.app.container.resolve(authorizationToken);
authz.database.collections.add({ name: 'accessCustomers', title: title('customers') });
authz.database.collections.add({ name: 'accessOrders', title: title('orders') });
const resource = authz.compositeResources.define(accessResource);
authz.ui.sections.add({
  name: 'customer-access', title: title('title'), parent: 'business',
});
authz.ui.place(resource, { section: 'customer-access' });
```

`title()` là hàm dịch của ứng dụng. Để đưa bảng vào cơ chế phân quyền, đăng ký Collection tường minh.

Chọn các thao tác trong mảng `business` ở `client/pages/settings/permission-workspace.ts`:

```ts
{
  type: 'composite',
  id: 'customerAccess',
  actions: ['viewCustomers', 'createCustomer', 'editCustomer', 'viewOrders', 'assignCustomer'],
  scopeTitles: {
    accessCustomers: { key: 'access.customers' },
    accessOrders: { key: 'access.orders' },
  },
  hiddenActionScopes: { createCustomer: ['customers'] },
}
```

Endpoint kiểm soát trường tạo và chủ sở hữu, nên trình chỉnh sửa bỏ bộ chọn phạm vi cho bản ghi mới. `hiddenActionScopes` chỉ đổi cách hiển thị và giữ nguyên quyền đã lưu. Đăng ký `settingsRoutes` có sẵn của template trong `client/routes.ts` để mở trang quản trị người dùng và vai trò.

Trình chỉnh sửa vai trò cần hiện năm hành động Customer Access, với phạm vi đơn hàng và khách hàng riêng trong Change customer. Xem [Provider][provider], [cấu hình trình chỉnh sửa quyền][workspace] và [đăng ký trang][client-routes].

<a id="check-operation-permissions-in-endpoints"></a>

## Kiểm tra quyền thao tác tại endpoint

<a id="obtain-an-authorization-decision"></a>

### Lấy quyết định phân quyền

Dùng ngữ cảnh `authz` của yêu cầu để kiểm tra thao tác nghiệp vụ cụ thể:

```ts
const decision = await c.get('authz').authorize({
  resource: { type: 'composite', id: 'customerAccess' },
  action: 'assignCustomer',
});
const database = decision.conditions?.database;
```

`authorize()` trả quyết định đầy đủ gồm `permit`, `deny` hoặc `conditional` kèm điều kiện. Với quyết định có điều kiện, thực thi chính sách cơ sở dữ liệu tương ứng. Sau khi xác thực và đọc quyết định, áp dụng cả các điều kiện đi kèm. Dùng `can()` để kiểm tra tính năng khả dụng, còn chính sách cơ sở dữ liệu lấy từ `authorize()`.

Người chỉ có quyền xem khách hàng nhận `403` khi gửi trực tiếp yêu cầu đổi liên kết. Xem [authorizeAccess()][authorize].

<a id="reject-denied-decisions-and-missing-policies"></a>

### Từ chối khi thiếu quyền hoặc chính sách

`authorizeAccess()` kiểm tra các Collection mà hành động cần. Với thao tác gán, bước kiểm tra tương đương:

```ts
if (
  decision.effect === 'deny' ||
  !database?.accessOrders?.read ||
  !database?.accessCustomers?.read
) {
  throw new ApiError({
    status: 'PERMISSION_DENIED',
    reason: 'CUSTOMER_ACCESS_DENIED',
    domain: 'customer-access',
    message: 'This operation is not allowed.',
  });
}
```

Import `ApiError` từ `@nocobase/app-server/router`. Sau khi kiểm tra, truyền riêng chính sách đơn hàng và khách hàng cho dịch vụ. Repository tiếp tục thực thi quyền đọc, ghi và phạm vi thực tế. Nếu thiếu chính sách bắt buộc, từ chối yêu cầu.

Các route kiểm tra quyền thao tác trước khi kiểm tra đầu vào. Thao tác ghi còn tích hợp cơ chế gửi lũy đẳng của template. Mỗi yêu cầu, kể cả gửi lại sau khi quyền bị thu hồi, phải qua phân quyền hiện tại. Xem [route đầy đủ][routes] và [Kiểm tra yêu cầu và xử lý lỗi](request-validation-and-errors.md).

<a id="apply-policies-to-database-access"></a>

## Áp dụng chính sách khi truy cập dữ liệu

<a id="scope-query-results-and-totals"></a>

### Giới hạn kết quả và tổng số

Ví dụ khai báo chiến lược bản ghi thuộc sở hữu bằng `defineRecordAccess()`. Chiến lược đối chiếu `ownerId` với danh tính đã xác minh:

```ts
import { defineRecordAccess } from '@nocobase/authorization/core';
import { buildFilter } from '@nocobase/repository-input';

const ownedRecords = defineRecordAccess('customerAccess.owned', (r) =>
  r.title(title('owned'))
    .collections('accessCustomers', 'accessOrders')
    .resolver(({ principal }) =>
      principal.type === 'user'
        ? buildFilter((f) => f.string('ownerId').eq(principal.id))
        : false,
    ),
);
// Register in Provider.boot():
authz.recordAccess.define(ownedRecords);
```

Khi vai trò chọn chiến lược này, hệ thống phân quyền chuyển nó thành chính sách Repository. Gắn cùng chính sách và cùng bộ lọc tìm kiếm vào truy vấn danh sách và truy vấn đếm:

```ts
const repository = connection.repository('accessCustomers').withPolicy(policy);
const filter = (f) => f.string('name').includes(q, { mode: 'insensitive' });
const data = await repository.findMany({ filter, limit: pageSize, offset: (page - 1) * pageSize });
const total = await repository.count({ filter });
```

Xem kiểu và sắp xếp trong [dịch vụ danh sách][service] và [khai báo quyền bản ghi][permissions]. Alice và Bob có dữ liệu riêng nên mỗi người chỉ thấy khách hàng của mình. Tổng số cũng chỉ đếm trong phạm vi đó. Lọc tại máy chủ trước khi trả dữ liệu.

![Nhân viên xem khách hàng của mình với tìm kiếm và phân trang](/assets/core/developing-apps/authentication-and-permissions/customers.png)

<a id="restrict-fields-on-create-and-update"></a>

### Giới hạn trường khi tạo và cập nhật

Endpoint tạo chỉ nhận `name`, `email` và `notes`. Dịch vụ sinh ID và đặt `ownerId` từ người dùng đã xác thực:

```ts
const result = await transaction.repository('accessCustomers')
  .withPolicy(policy)
  .createOne({ values: { ...values, id: randomUUID(), ownerId } });
```

Chọn **New customer** trong Customers, nhập tên và email rồi lưu. Bản ghi mới cần xuất hiện trong danh sách của người dùng hiện tại.

![Tạo khách hàng với chủ sở hữu do máy chủ xác định](/assets/core/developing-apps/authentication-and-permissions/customer-create.png)

Cập nhật áp dụng chính sách cho cả tra cứu và ghi:

```ts
await this.get(policy, id, transaction);
const result = await transaction.repository('accessCustomers')
  .withPolicy(policy)
  .updateOne({ filter: { id }, values: { ...values } });
```

`values` là đầu vào nghiệp vụ đã kiểm tra. Schema nghiêm ngặt từ chối trường thừa như `ownerId` và `internalNote`. Repository kiểm tra độc lập các trường được ghi. Giữ ghi chú nội bộ ở máy chủ.

Chọn **Edit customer**, đổi ghi chú rồi lưu. Tải lại để xác nhận thay đổi còn. Biểu mẫu đọc bản ghi hiện tại qua hành động `editCustomer` để kiểm tra quyền sửa ở thời điểm mở.

Xem [dịch vụ tạo và cập nhật][service] và [biểu mẫu khách hàng][customer-form].

![Biểu mẫu chỉ cho sửa tên, email và ghi chú](/assets/core/developing-apps/authentication-and-permissions/customer-edit.png)

<a id="check-access-to-associated-records"></a>

### Kiểm tra quyền với bản ghi liên kết

Dịch vụ gán kiểm tra đơn và khách hàng đích trong cùng transaction trước khi ghi `customerId`:

```ts
const orders = transaction.repository('accessOrders').withPolicy(policies.orders);
await this.getOrder(policies.orders, id, transaction);
const customer = await transaction.repository('accessCustomers')
  .withPolicy(policies.customers)
  .findOne({ filter: { id: customerId } });
if (!customer) {
  throw new ApiError({
    status: 'INVALID_ARGUMENT', reason: 'CUSTOMER_UNAVAILABLE',
    domain: 'customer-access', message: 'The selected customer is unavailable.',
  });
}
await orders.updateOne({ filter: { id }, values: { customerId } });
```

Ví dụ đổi ID liên kết qua thao tác nghiệp vụ được bảo vệ. `executeIdempotentMutation()` của route cung cấp transaction và mọi lần đọc ghi của dịch vụ dùng kết nối đó. Gắn lại chính sách mỗi khi lấy Repository trong transaction.

Đơn thiếu hoặc ngoài phạm vi đều trả `404`. Khách hàng thiếu hoặc không thể chọn đều trả `400 CUSTOMER_UNAVAILABLE` và giữ liên kết cũ. Danh sách tùy chọn hỗ trợ việc chọn, còn máy chủ kiểm tra lại đích khi lưu.

Xem [dịch vụ gán][service], [tích hợp transaction][routes] và [Dịch vụ phía máy chủ](server-business-services.md) về tái sử dụng dịch vụ và transaction qua nhiều Collection.

![Đổi khách hàng của đơn kiểm tra quyền trên cả hai bản ghi](/assets/core/developing-apps/authentication-and-permissions/order-customer.png)

<a id="configure-roles-and-page-access"></a>

## Cấu hình vai trò và quyền vào trang

<a id="assign-operations-and-record-scopes"></a>

### Cấp thao tác và phạm vi bản ghi

Lần khởi tạo đầu tạo hai vai trò có thể sửa. **Sales representative** có đủ năm thao tác. **Read-only sales** chỉ xem khách hàng và đơn hàng. Cả hai mặc định dùng **Records I own**. Quản trị viên gán vai trò cho từng người.

Với tài khoản quản trị, mở **System settings → Permission management → Roles and permissions**, sửa thao tác và phạm vi nghiệp vụ rồi gán vai trò qua **Users**. Kiểm tra cả phạm vi đơn và khách hàng cho Change customer. Giữ các quyền này trong vai trò riêng thay vì cấp cho `member`, vốn áp dụng cho mọi tài khoản đã đăng nhập.

Khởi tạo dùng `definePermissionSet()` với khai báo tài nguyên dùng chung. Ví dụ quyền xem khách hàng chọn phạm vi như sau:

```ts
import { definePermissionSet } from '@nocobase/authorization/permission-sets';
import { selection } from '@nocobase/authorization/core';

const role = definePermissionSet('customer-reader')
  .title(title('reader'))
  .grant(accessResource.reference().grant({
    viewCustomers: { customers: selection.recordAccess('customerAccess.owned') },
  }))
  .build();
```

[Seed vai trò][roles] còn có quyền vào trang, thao tác khác và bước ghi dữ liệu. Seed khởi tạo cấu hình một lần. Thay đổi của quản trị viên được giữ sau khi khởi động lại. Để sửa vai trò trong cơ sở dữ liệu hiện có, dùng trang quản trị.

![Trình chỉnh sửa vai trò cấu hình riêng thao tác và phạm vi bản ghi](/assets/core/developing-apps/authentication-and-permissions/permissions.png)

<a id="separate-page-access-from-endpoint-access"></a>

### Tách quyền vào trang khỏi quyền gọi endpoint

Route khách hàng khai báo quyền trang riêng và route con kế thừa quyền đó:

```ts
{
  name: 'accessCustomers',
  path: '/customers',
  auth: 'required',
  authz: { resource: { type: 'page', id: 'customerAccess.customers' }, action: 'access' },
  componentLoader: () => import('./pages/access/list.js'),
}
```

Các nút dùng `useCan()` để kiểm tra hành động nghiệp vụ. Chúng chỉ khả dụng khi bước kiểm tra thành công:

```tsx
import { useCan } from '@nocobase/app-plugin-authorization/client';

const { can } = useCan({
  resource: { type: 'composite', id: 'customerAccess' },
  action: 'createCustomer',
});
```

Nếu chỉ có quyền vào trang, API vẫn trả `403`. Nếu chỉ có quyền thao tác, API cho truy cập trong phạm vi nhưng trang vẫn yêu cầu quyền riêng. Quyền có thể đến từ nhiều vai trò. Khi thu hồi, kiểm tra mọi nguồn cấp quyền.

Xem [đăng ký trang][client-routes], [điều khiển danh sách][list] và [Trang, route và điều hướng](pages-routes-and-navigation.md).

<a id="verify-with-ordinary-users"></a>

## Kiểm chứng bằng người dùng thông thường

<a id="test-anonymous-denied-and-out-of-scope-requests"></a>

### Thử yêu cầu ẩn danh, bị từ chối và ngoài phạm vi

Dùng tài khoản thường để kiểm tra đúng giới hạn. Chuẩn bị khách hàng và đơn riêng cho Alice và Bob. Gán Sales representative cho Alice và Read-only sales cho Bob.

| Thao tác | Kết quả dự kiến |
| --- | --- |
| Gọi API khách hàng ẩn danh | `401` |
| Thiếu vai trò nghiệp vụ hoặc chỉ có quyền trang | API khách hàng trả `403` |
| Người chỉ đọc liệt kê bản ghi | Chỉ thấy bản ghi của mình và tổng tương ứng |
| Người chỉ đọc gọi trực tiếp thao tác tạo, sửa hoặc gán lại | `403` |
| Nhân viên đọc hoặc sửa khách hàng của người khác | Cùng mã `404` như bản ghi không tồn tại |

[Kiểm thử endpoint][tests] dùng đăng nhập, phân quyền thật và SQLite cô lập. Một kiểm tra cô lập khác xác nhận từ chối khi quyết định thiếu chính sách bắt buộc.

<a id="test-field-limits-reassignment-and-revocation"></a>

### Kiểm tra giới hạn trường, gán lại và thu hồi quyền

- Phản hồi khách hàng phải loại `internalNote`. Gửi `ownerId` hoặc `internalNote` phải thất bại và giữ nguyên giá trị đã lưu.
- Gán khách hàng được phép phải thành công và xuất hiện khi đọc lại. Đích ngoài phạm vi hoặc không tồn tại phải trả cùng lỗi và giữ liên kết cũ.
- Lần lượt xóa phạm vi đơn và khách hàng khỏi hành động gán. Mỗi Collection đều phải có quyền riêng.
- Thu hồi hành động và gửi yêu cầu mới. Kiểm tra cả phiên cũ và lượt gửi lại lũy đẳng đều bị từ chối.

Xem lệnh trong README cho [kiểm thử endpoint][tests] và [kiểm thử trình duyệt][browser-tests].

<a id="example-source-and-setup"></a>

## Mã nguồn và thiết lập

[Ứng dụng Customer Access đầy đủ][source] dùng template mặc định `1.0.0-beta.85`, Node.js 24 và pnpm 11.7.0. Lockfile cố định dependency, gồm xác thực `2.0.0-beta.16`, phân quyền `1.0.0-beta.33` và cơ sở dữ liệu `1.0.0-beta.24`.

```bash
git clone https://github.com/nocobase/docs-examples-v3.git
cd docs-examples-v3
git checkout 5c9b1dcae021f4e4ae94416e783e3e84a71a1781
cd apps/customer-access
pnpm install --frozen-lockfile
pnpm nocobase config init --dialect sqlite
pnpm nocobase config check
pnpm dev
```

Trước khi khởi động lần đầu, cấu hình quản trị viên trong `users.initialAdmin` ở `config.yml` cục bộ. SQLite giúp chạy ví dụ độc lập. Cơ chế xác thực và phân quyền có thể dùng với cơ sở dữ liệu khác, nhưng ví dụ này mới được kiểm chứng trên SQLite. Mở URL đầy đủ in lúc khởi động, gồm đường dẫn gắn ứng dụng.

Sau khi quản trị viên tạo người dùng thường và gán vai trò qua Users, thêm dữ liệu giả cho người đó từ thư mục ứng dụng:

```bash
pnpm nocobase app sample-customers --email alice@example.test --dry-run
pnpm nocobase app sample-customers --email alice@example.test
```

Thay email bằng email của người dùng hiện có. Lệnh chỉ thêm khách hàng và một đơn hàng. Tài khoản và vai trò được quản lý trong Users. Dữ liệu được lưu bền vững và chạy lại giữ một bản cho mỗi bản ghi mẫu đã đặt tên. Chạy cho người dùng thứ hai để so sánh phạm vi truy cập.

Xem [README][readme] về cấu hình, vị trí mã cho từng cách dùng, lệnh kiểm thử và phạm vi đã kiểm chứng.

[source]: https://github.com/nocobase/docs-examples-v3/tree/5c9b1dcae021f4e4ae94416e783e3e84a71a1781/apps/customer-access
[routes]: https://github.com/nocobase/docs-examples-v3/blob/5c9b1dcae021f4e4ae94416e783e3e84a71a1781/apps/customer-access/server/routes/customer-access.ts
[auth-config]: https://github.com/nocobase/docs-examples-v3/blob/5c9b1dcae021f4e4ae94416e783e3e84a71a1781/apps/customer-access/server/config/auth.ts
[permissions]: https://github.com/nocobase/docs-examples-v3/blob/5c9b1dcae021f4e4ae94416e783e3e84a71a1781/apps/customer-access/server/access/permissions.ts
[authorize]: https://github.com/nocobase/docs-examples-v3/blob/5c9b1dcae021f4e4ae94416e783e3e84a71a1781/apps/customer-access/server/access/authorize.ts
[provider]: https://github.com/nocobase/docs-examples-v3/blob/5c9b1dcae021f4e4ae94416e783e3e84a71a1781/apps/customer-access/server/providers/customer-access.ts
[service]: https://github.com/nocobase/docs-examples-v3/blob/5c9b1dcae021f4e4ae94416e783e3e84a71a1781/apps/customer-access/server/providers/customer-access-service.ts
[workspace]: https://github.com/nocobase/docs-examples-v3/blob/5c9b1dcae021f4e4ae94416e783e3e84a71a1781/apps/customer-access/client/pages/settings/permission-workspace.ts
[client-routes]: https://github.com/nocobase/docs-examples-v3/blob/5c9b1dcae021f4e4ae94416e783e3e84a71a1781/apps/customer-access/client/routes.ts
[assignment]: https://github.com/nocobase/docs-examples-v3/blob/5c9b1dcae021f4e4ae94416e783e3e84a71a1781/apps/customer-access/client/pages/access/assignment.tsx
[customer-form]: https://github.com/nocobase/docs-examples-v3/blob/5c9b1dcae021f4e4ae94416e783e3e84a71a1781/apps/customer-access/client/pages/access/customer-form.tsx
[roles]: https://github.com/nocobase/docs-examples-v3/blob/5c9b1dcae021f4e4ae94416e783e3e84a71a1781/apps/customer-access/database/main/seeds/202610310001_customer_access_roles.ts
[list]: https://github.com/nocobase/docs-examples-v3/blob/5c9b1dcae021f4e4ae94416e783e3e84a71a1781/apps/customer-access/client/pages/access/list.tsx
[tests]: https://github.com/nocobase/docs-examples-v3/blob/5c9b1dcae021f4e4ae94416e783e3e84a71a1781/apps/customer-access/tests/server/customer-access.test.ts
[browser-tests]: https://github.com/nocobase/docs-examples-v3/blob/5c9b1dcae021f4e4ae94416e783e3e84a71a1781/apps/customer-access/tests/playwright/customer-access.test.ts
[readme]: https://github.com/nocobase/docs-examples-v3/blob/5c9b1dcae021f4e4ae94416e783e3e84a71a1781/apps/customer-access/README.md
