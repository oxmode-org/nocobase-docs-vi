---
title: Yêu cầu dữ liệu và trạng thái
description: Dùng API Client, hook danh sách và useSubmission để đồng bộ truy vấn, xử lý phản hồi đến sai thứ tự và khôi phục lượt gửi.
---

Ví dụ Customer Directory minh họa tìm kiếm, phân trang, xem chi tiết và chỉnh sửa. URL lưu điều kiện truy vấn, máy chủ trả bản ghi và biểu mẫu giữ giá trị chưa lưu. Ví dụ dùng cơ sở dữ liệu thật, phân quyền ứng dụng và biên nhận thao tác ghi. Các điều khiển minh họa tạo yêu cầu chậm, từ chối ghi hoặc mất phản hồi. Xem [Mã nguồn và thiết lập](#example-source-and-setup) ở cuối bài.

Bài này dùng template mặc định `1.0.0-beta.85`. `@nocobase/app-client` xuất `useApiClient` và `useSubmission`. Template sinh `useListData`, `useListLocation` và `useTableUrlState` trong `client/hooks/` để ứng dụng có thể tùy chỉnh. Giao diện theo quy ước shadcn và dùng `DataTable`, hộp thoại và ngăn trượt theo route. Xem [Thành phần giao diện và tương tác](pages-and-interactions.md).

<a id="use-the-applications-api-client"></a>

## Dùng API Client của ứng dụng

<a id="get-the-client-and-call-business-endpoints"></a>

### Lấy client và gọi endpoint nghiệp vụ

Gọi `useApiClient()` trong thành phần hoặc hook và truyền client cho hàm thông thường. Client đã dùng địa chỉ API và cấu hình phiên của ứng dụng. Các trang có thể gọi trực tiếp qua đối tượng này.

Yêu cầu tối giản sau đọc chi tiết khách hàng. Trang chi tiết của ví dụ dùng `useListData` để quản lý vòng đời yêu cầu:

```ts
import { useApiClient } from '@nocobase/app-client';
import type { Customer } from './api.js';

const api = useApiClient(); // Inside a component or hook
const response = await api.request<{ data: Customer }>({
  path: `customerRecord/${encodeURIComponent(id)}`,
  signal,
});
const customer = response.data;
```

`path` tương đối với gốc API, bỏ `/api` và `/main`. `request<T>()` trả toàn bộ thân phản hồi. `data` do endpoint nghiệp vụ định nghĩa. Tham số kiểu mô tả dữ liệu dự kiến. Việc xác thực phản hồi lúc chạy là bước riêng. Lấy `id` từ tham số route và `signal` từ `AbortController` của yêu cầu.

Trong **Customer directory**, bấm **Alpine Goods**. Ngăn trượt đọc bản ghi đã lưu qua `GET customerRecord/:id`. Endpoint này được khai báo trên máy chủ của ví dụ.

![Chi tiết khách hàng do API trả về](/assets/core/developing-apps/data-requests-and-state/detail.png)

Xem [trang chi tiết](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/pages/customers/detail.tsx), [endpoint nghiệp vụ](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/server/routes/customers.ts) và [API Client](../framework/http/api-client.md) để tra tùy chọn chung.

<a id="call-repository-data-endpoints"></a>

### Gọi endpoint dữ liệu Repository

Sau khi server đăng ký endpoint dữ liệu Repository, dùng `api.repository<Customer>('customers')` để gọi theo giao thức đó. Ví dụ cập nhật nằm trong `client/pages/customers/api.ts`:

```ts
const result = await api.repository<Customer>('customers').updateOne({
  filter: { id },
  values,
  idempotencyKey: key,
  signal,
});
return result.record;
```

Repository client xử lý phản hồi và đặt bản ghi trong `result.record`. Với `request()`, ví dụ trước đọc `response.data`. `values` chứa các trường cần lưu, còn `key` và `signal` lấy từ `useSubmission`. Endpoint ghi chuẩn yêu cầu khóa thao tác và provider biên nhận lượt gửi đã được template đăng ký.

Bấm **Edit customer** trong ngăn chi tiết, đổi thông tin liên hệ và lưu. Yêu cầu thực là `POST customers/updateOne`. Tạo và xóa dùng `createOne` và `deleteOne`, mỗi lượt gửi nghiệp vụ có khóa riêng. Máy chủ vẫn chịu trách nhiệm xác thực, phân quyền, giới hạn trường và kiểm tra đầu vào.

![Hộp thoại chỉnh sửa khách hàng](/assets/core/developing-apps/data-requests-and-state/edit.png)

Xem [hàm yêu cầu và ghi dữ liệu](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/pages/customers/api.ts) và [Endpoint dữ liệu Repository](../framework/http/repository-routes.md).

<a id="read-lists-and-synchronize-query-conditions"></a>

## Đọc danh sách và đồng bộ điều kiện truy vấn

<a id="read-and-refresh-with-uselistdata"></a>

### Đọc và tải lại bằng useListData

`useListData` nhận đường dẫn yêu cầu và cung cấp kết quả, lỗi cùng thao tác tải lại. Đây là lời gọi chính trong `useCustomerList`. `query` chứa tìm kiếm, trạng thái, phân trang và sắp xếp hiện tại:

```ts
import { useListData } from '#hooks/use-list-data';
import type { CustomerList } from './api.js';

const request = useListData<CustomerList>(`customerList?${query}`, { active });
// request.data: { data: Customer[], meta: { total: number } } | undefined
// request.loading / request.error / request.reload()
```

Mở danh sách để gọi `GET customerList`. **Refresh** chạy lại truy vấn hiện tại. Bản ghi đến từ cơ sở dữ liệu và dữ liệu đã lưu còn sau khi tải lại trang. `reload()` chỉ tác động lên đối tượng hook hiện tại. Các trang khác cần cơ chế cập nhật riêng.

![Danh bạ khách hàng có phân trang](/assets/core/developing-apps/data-requests-and-state/list.png)

Xem [hook danh sách](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/pages/customers/use-customer-list.ts) và [useListData](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/hooks/use-list-data.ts).

<a id="put-search-pagination-and-sorting-in-the-url"></a>

### Đưa tìm kiếm, phân trang và sắp xếp vào URL

`useListLocation()` cung cấp tham số của danh sách. `readTableUrlState()` đọc trang, kích thước trang và sắp xếp. `useTableUrlState()` ghi thao tác trên bảng vào URL. Ví dụ cho phép bốn trường sắp xếp mà máy chủ hỗ trợ và kích thước trang 5, 10 hoặc 20.

Nội dung ô tìm kiếm chỉ nằm trong trạng thái cục bộ đến khi bấm **Search** hoặc Enter. Khi đổi tìm kiếm hoặc trạng thái, sao chép tham số hiện có và xóa `page` để về trang đầu, giữ sắp xếp và kích thước trang:

```ts
setParams((old) => {
  const next = new URLSearchParams(old);
  if (value) next.set('q', value);
  else next.delete('q');
  next.delete('page');
  return next;
}, { replace: true });
```

Tìm `Al`, chọn **Active**, rồi đổi kích thước trang và sắp xếp. Địa chỉ dạng sau khôi phục truy vấn sau khi tải lại. Nối đường dẫn này vào đường dẫn gắn ứng dụng thực tế.

```text
/customers?q=Al&status=active&pageSize=5&sort=name&order=desc
```

![Khách hàng được lọc theo tìm kiếm và trạng thái, với sắp xếp trong URL](/assets/core/developing-apps/data-requests-and-state/query.png)

Xem [tham số URL và danh sách](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/pages/customers/use-customer-list.ts) và [trạng thái URL của bảng](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/hooks/use-table-url-state.ts).

<a id="pause-covered-routes-and-restore-the-list-on-return"></a>

### Tạm dừng danh sách bị che và khôi phục khi quay lại

Khi route con xem chi tiết hoặc chỉnh sửa che danh sách, `useListLocation()` giữ tham số danh sách và trả `active: false`. Truyền giá trị này vào `useListData` để tạm dừng yêu cầu nền đến khi đóng route con. Kiểm tra cả `active` khi hiển thị trạng thái tải vì `loading: true` có thể xuất hiện khi yêu cầu đang tạm dừng.

Ví dụ dùng liên kết tương đối kèm chuỗi truy vấn để vào route chi tiết rồi mở trình chỉnh sửa:

```tsx
<RecordLink to={`${customer.id}${search}`}>{customer.name}</RecordLink>
// Inside the detail page
<Link to={`edit${search}`}>...</Link>
```

Mở **Alpine Goods** từ danh sách đã lọc, sửa, lưu và đóng ngăn chi tiết. Tìm kiếm, trạng thái, kích thước trang và sắp xếp cần được giữ. Xem ngăn chi tiết ở [Lấy client và gọi endpoint nghiệp vụ](#get-the-client-and-call-business-endpoints) và lớp chỉnh sửa ở [Gọi endpoint dữ liệu Repository](#call-repository-data-endpoints).

Các hook này phụ thuộc ngữ cảnh định tuyến của template. Trang ngoài cây route đó cần tự lấy tham số và trạng thái hoạt động từ router của mình. Xem [trang danh sách và Outlet](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/pages/customers/index.tsx) và [useListLocation](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/hooks/use-list-location.ts).

<a id="handle-request-states-and-errors"></a>

## Xử lý trạng thái và lỗi yêu cầu

<a id="loading-empty-results-and-refreshing"></a>

### Đang tải, kết quả rỗng và tải lại

Trang chuyển trạng thái yêu cầu thành `listState` của `DataTable` để phân biệt lần đọc đầu với kết quả rỗng:

| Điều kiện | Hành vi ví dụ |
| --- | --- |
| Lần đọc đầu, chưa có kết quả | Hiện trạng thái đang tải |
| Đọc thành công và không có bản ghi khớp | Hiện No results và thao tác xóa bộ lọc |
| Tải lại cùng truy vấn đã có dữ liệu | Giữ các hàng và hiện trạng thái đang tải lại |
| Điều kiện truy vấn thay đổi | Mặc định chờ kết quả mới và ẩn hàng của truy vấn trước |

Mở **Request demonstrations** và chọn **Slow response (1.6 seconds)** để xem trạng thái tải. Khi có bản ghi, bấm **Refresh** để thấy các hàng vẫn hiện khi đang tải lại.

![Đang tải yêu cầu danh sách chậm](/assets/core/developing-apps/data-requests-and-state/loading.png)

![Các hàng vẫn hiện khi tải lại cùng truy vấn](/assets/core/developing-apps/data-requests-and-state/refreshing.png)

Tìm `NoSuchCustomer` để nhận phản hồi thành công với 0 bản ghi khớp:

![Tìm kiếm thành công với kết quả rỗng](/assets/core/developing-apps/data-requests-and-state/empty.png)

Xem [ánh xạ trạng thái danh sách](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/pages/customers/index.tsx). Điều khiển minh họa yêu cầu `CUSTOMER_DEMO_FAULTS=1` khi khởi động.

<a id="cancel-old-requests-and-ignore-out-of-order-results"></a>

### Hủy yêu cầu cũ và bỏ qua phản hồi đến sai thứ tự

`useListData` hủy lượt đọc cũ khi đường dẫn đổi hoặc thành phần bị gỡ. Hook cũng xác nhận phản hồi thuộc lượt yêu cầu hiện tại. `reload()` vô hiệu hóa yêu cầu trước một cách đồng bộ rồi bắt đầu đọc lại. Kết hợp cả hủy và kiểm tra lượt yêu cầu để phản hồi cũ đến muộn không ghi đè kết quả mới.

Chọn **Out-of-order responses**, tìm `A` rồi ngay lập tức tìm `Al`. Ví dụ trì hoãn lượt đầu 1,8 giây và lượt sau 0,15 giây. Danh sách phải giữ kết quả `Al` như trong [mục đồng bộ URL](#put-search-pagination-and-sorting-in-the-url). Kiểm thử trang kiểm soát thời điểm cả hai phản hồi hoàn tất và xác nhận hàng cũ không xuất hiện.

Xem [vòng đời yêu cầu](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/hooks/use-list-data.ts) và [kiểm thử phản hồi đến sai thứ tự](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/tests/client/customers.test.tsx). Nếu máy chủ đã ghi, hủy yêu cầu trình duyệt vẫn giữ thao tác ghi đó.

<a id="request-failures-retries-and-permission-changes"></a>

### Yêu cầu lỗi, thử lại và thay đổi quyền

Chọn **Read failure** để máy chủ trả lỗi 503 minh họa. **Retry** chuyển lượt đọc về chế độ bình thường. Nếu tải lại cùng truy vấn thất bại, hook giữ kết quả hiện có kèm lỗi. Nếu nhận 401, 403 hoặc 404, hook xóa kết quả cũ và trang báo phiên kết thúc, thiếu quyền hoặc bản ghi không còn khả dụng.

![Lỗi đọc có thao tác thử lại](/assets/core/developing-apps/data-requests-and-state/read-error.png)

Ánh xạ `ApiClientError.status`, `reason` và `domain` sang thông điệp đã dịch. Xử lý riêng lỗi mạng. Dùng thông điệp phù hợp với người dùng thay cho nội dung kỹ thuật trong `error.message`. Ghi `requestId` khi cần chẩn đoán.

Ví dụ phân quyền dùng **Users** và **Permission management** tích hợp. Gán **Customer viewer** cho tài khoản thường và mở danh sách bằng tài khoản đó. Trong phiên quản trị viên, giữ quyền vào trang nhưng thu hồi thao tác xem khách hàng. Sau đó bấm **Refresh** trong phiên người dùng. Bản ghi cũ phải biến mất và đọc trực tiếp API phải trả 403. Người chỉnh sửa dùng **Customer editor**. Gán từng vai trò theo nhu cầu.

![Xóa dữ liệu cũ sau khi quyền xem khách hàng bị thu hồi](/assets/core/developing-apps/data-requests-and-state/permission.png)

Xem [ánh xạ lỗi](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/pages/customers/api.ts), [phân quyền phía máy chủ](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/server/routes/customers.ts) và [kiểm thử quyền trên trình duyệt](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/tests/playwright/customers.test.ts). Quyền vào trang và quyền thao tác dữ liệu được cấp riêng. Luôn kiểm tra quyền tại endpoint.

<a id="submit-changes-and-update-pages"></a>

## Gửi thay đổi và cập nhật trang

<a id="manage-submissions-and-duplicate-attempts-with-usesubmission"></a>

### Quản lý lượt gửi và ngăn gửi trùng bằng useSubmission

Dùng một `useSubmission` cho mỗi biểu mẫu và đưa mọi điểm gửi qua cùng `run()`. Bộ điều khiển khóa đồng bộ, chụp lại đầu vào và tạo khóa thao tác. Bấm nút hoặc Enter nhiều lần trong lúc lưu chỉ chạy một lượt gửi. Dùng `submitting` để hiện trạng thái bận và khóa các trường đang gửi.

Đoạn mã sau giữ logic gửi chính của trình chỉnh sửa. Xem mã đầy đủ để tra biểu mẫu, hiển thị lỗi và điều khiển minh họa:

```ts
import { useSubmission } from '@nocobase/app-client';

const submission = useSubmission({
  scope: `${session?.user.id}:customers:${id ?? 'new'}`,
});
const saved = await submission.run(
  { id, ...values },
  async (key, signal, input) => {
    const { id: recordId, ...fields } = input;
    return saveCustomer(api, fields, recordId, key, signal);
  },
);
```

`scope` phân biệt danh tính, thao tác và đối tượng biểu mẫu khi khôi phục lượt gửi chưa có kết quả. Mỗi biểu mẫu độc lập cần scope riêng. Ví dụ chỉ mở một trình chỉnh sửa route tương ứng trên mỗi tab. Phía máy chủ, thao tác ghi Repository chuẩn và biên nhận commit trong cùng transaction. Thử lại với cùng khóa và đầu vào có thể nhận lại kết quả ban đầu.

Trong hộp thoại tạo hoặc sửa, mở **Submission demonstrations** và chọn **Slow submission (1.6 seconds)**. Thử gửi nhiều lần trong lúc lưu. Trang phải tiếp tục báo đang lưu và cơ sở dữ liệu chỉ nhận một lượt ghi tương ứng.

![Các trường và nút lưu bị khóa khi lượt gửi chậm](/assets/core/developing-apps/data-requests-and-state/submitting.png)

Xem [trình chỉnh sửa và bộ điều khiển gửi](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/pages/customers/edit.tsx) và [provider biên nhận của template](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/server/providers/submission.ts). API nghiệp vụ tùy chỉnh có tác dụng phụ phải tham gia transaction của biên nhận để có cùng bảo đảm.

<a id="preserve-failed-drafts-and-retry-unknown-outcomes"></a>

### Giữ bản nháp khi lỗi và thử lại khi chưa rõ kết quả

Nhập khách hàng mới, chọn **Reject before saving** rồi lưu. Endpoint từ chối tường minh trước khi ghi. Các trường giữ giá trị. Chuyển lại **Normal submission** để chỉnh và gửi tiếp.

![Giữ bản nháp khi thao tác ghi bị từ chối](/assets/core/developing-apps/data-requests-and-state/draft.png)

Với **Lose response after saving**, ví dụ commit dữ liệu và biên nhận, rồi trả 503 để mô phỏng client không nhận kết quả đáng tin cậy. `submitting` kết thúc nhưng `pending` vẫn đúng. Giữ các giá trị ban đầu và bấm **Retry original submission** để lấy lại kết quả với khóa và đầu vào cũ. Dùng lại đúng lượt gửi để tránh tạo trùng.

![Kết quả chưa rõ và thao tác khôi phục lượt gửi ban đầu](/assets/core/developing-apps/data-requests-and-state/uncertain.png)

`pending` cho biết thao tác còn chưa có kết quả xác định. Lỗi mạng, hết thời gian chờ hoặc lỗi máy chủ mơ hồ có thể xảy ra cả khi dữ liệu đã lưu. Sau khi tải lại trang, bộ điều khiển có thể lấy khóa và giá trị băm của đầu vào từ bộ nhớ phiên của tab. Người dùng phải nhập lại bản nháp với đúng giá trị gốc. Ví dụ từ chối khởi động thao tác mới với dữ liệu khác.

Xem [biểu mẫu và phản hồi khôi phục](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/pages/customers/edit.tsx) và [kiểm thử mất phản hồi sau khi commit](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/tests/server/customers.test.ts). Xem [Thành phần giao diện và tương tác](pages-and-interactions.md) để xác nhận trước khi bỏ thay đổi chưa lưu. Đóng hộp thoại vẫn giữ các thao tác đã ghi.

<a id="update-details-and-refresh-the-list-after-saving"></a>

### Cập nhật chi tiết và tải lại danh sách sau khi lưu

Khi nhận kết quả lưu thành công, trình chỉnh sửa gọi thao tác tải lại của cha qua ngữ cảnh Outlet rồi đóng. Trang chi tiết cung cấp một thao tác tải lại chính nó và danh sách nền:

```tsx
<Outlet context={{
  reload: () => {
    request.reload(); // Current details
    parent.reload();  // Customer list
  },
}} />
```

Đổi thông tin liên hệ trong ngăn chi tiết rồi lưu. Trình chỉnh sửa đóng và ngăn chi tiết đọc dữ liệu mới nhất. Đóng ngăn để danh sách tiếp tục với truy vấn đã giữ. Tạo, xóa hoặc đổi trường sắp xếp có thể đổi vị trí và tổng số, nên đọc lại cả truy vấn.

![Chi tiết khách hàng được tải lại sau khi lưu](/assets/core/developing-apps/data-requests-and-state/saved-detail.png)

Xử lý lưu và tải lại riêng. Nếu ghi thành công nhưng lượt đọc sau thất bại, hiện lỗi đọc và cho tải lại. Giữ kết quả lưu đã xác nhận. Xem [thao tác tải lại của cha](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/pages/customers/detail.tsx) và [xử lý khi lưu xong](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/pages/customers/edit.tsx).

<a id="correct-pagination-after-deletion-and-retain-query-conditions"></a>

### Sửa phân trang sau khi xóa và giữ điều kiện truy vấn

Sau khi xóa, tải lại truy vấn hiện tại và truyền tổng số từ lượt đọc thành công đó vào `useTableUrlState`. Dùng tổng số cũ trong khi đang tải có thể chọn nhầm trang.

```ts
const table = useTableUrlState({
  ...tableOptions,
  active,
  revision: request.revision,
  rowCount: !request.loading && !request.error
    ? request.data?.meta.total
    : undefined,
});
```

Tạo sáu khách hàng có cùng tiền tố tên, tìm tiền tố đó, đặt năm hàng mỗi trang rồi xóa bản ghi duy nhất ở trang hai. Danh sách phải về trang một và giữ tìm kiếm, trạng thái cùng sắp xếp. Kiểm thử tự động tự tạo và dọn sáu bản ghi riêng.

![Xác nhận xóa bản ghi trên trang hiện tại](/assets/core/developing-apps/data-requests-and-state/delete.png)

![Quay lại trang hợp lệ và giữ truy vấn](/assets/core/developing-apps/data-requests-and-state/corrected-page.png)

Xem [thao tác xóa](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/pages/customers/delete.tsx) và [tổng số và hiệu chỉnh trang](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/client/pages/customers/use-customer-list.ts).

<a id="verify-interactions-and-data-results"></a>

## Kiểm tra tương tác và kết quả dữ liệu

<a id="verify-reads-submissions-and-return-flows"></a>

### Kiểm tra đọc, gửi và quay lại

Thử tìm kiếm, phân trang, mở chi tiết, sửa, lưu rồi quay lại. Sau đó dùng điều khiển minh họa để kiểm tra các tình huống lỗi:

- Tìm `A` rồi `Al` liên tiếp. Chỉ kết quả `Al` được giữ.
- Yêu cầu đọc thất bại có thể thử lại. Lỗi tải lại thông thường giữ dữ liệu truy vấn hiện tại. Lỗi 403 xóa bản ghi cũ.
- Lượt ghi bị từ chối giữ bản nháp. Khôi phục lượt gửi mất phản hồi chỉ giữ một bản ghi khách hàng.
- Quay lại sau khi lưu giữ điều kiện truy vấn. Xóa hàng cuối của trang cuối đưa danh sách về trang hợp lệ.
- Người chỉ xem không có nút ghi và yêu cầu ghi trực tiếp bị từ chối. Thu hồi quyền xem khiến lượt đọc trả 403.

Dùng ảnh để đối chiếu trạng thái giao diện. Xác nhận chống ghi trùng, phân quyền và dữ liệu lưu qua phản hồi API và kết quả cơ sở dữ liệu. Kiểm thử trình duyệt còn kiểm tra rời trình chỉnh sửa khi còn thay đổi và hiển thị trên màn hình hẹp.

<a id="run-tests-and-build"></a>

### Chạy kiểm thử và dựng

Chạy từ thư mục ứng dụng ví dụ:

```bash
pnpm exec vitest run tests/client/customers.test.tsx tests/client/list-recovery.test.tsx tests/client/table-url-state.test.tsx tests/server/customers.test.ts tests/server/authorization-assignment-safety.test.ts tests/database/customers.test.ts
pnpm typecheck
pnpm build
```

Kiểm thử trang dùng hook thật và chỉ thay lớp mạng. Kiểm thử máy chủ dùng cơ sở dữ liệu cô lập để chạy route, phân quyền, thao tác ghi và biên nhận thật. Kiểm thử migration xác nhận tạo và rollback. Kiểm thử trình duyệt kết nối với ví dụ đang chạy. Đặt `APP_URL`, `E2E_USERNAME` và `E2E_PASSWORD` theo [README](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/README.md), rồi chạy:

```bash
pnpm exec playwright test tests/playwright/customers.test.ts
```

<a id="example-source-and-setup"></a>

## Mã nguồn và thiết lập ví dụ

<a id="complete-example-application"></a>

### Ứng dụng ví dụ đầy đủ

[Mã nguồn Customer Directory](https://github.com/nocobase/docs-examples-v3/tree/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory) gồm route danh sách, chi tiết và chỉnh sửa, API thật, migration, dữ liệu mẫu và kiểm thử. [README](https://github.com/nocobase/docs-examples-v3/blob/0db1a6aade41a18757f5a709aacd2df695fcf7f8/apps/customer-directory/README.md) chỉ điểm vào, tệp triển khai và kết quả dự kiến cho từng cách dùng.

Ví dụ chỉ quản lý tên, thông tin liên hệ, email và trạng thái. Phản hồi chậm, từ chối tường minh và mất phản hồi là các tình huống minh họa có kiểm soát. Đọc, ghi, quyết định phân quyền và biên nhận dùng cơ chế thật của ứng dụng.

<a id="requirements-and-startup"></a>

### Yêu cầu và khởi động

Dùng Node.js 24 trở lên. `packageManager` chỉ định pnpm `11.7.0` và lockfile cố định phiên bản dependency. Các lệnh dưới dùng SQLite để khởi động nhanh. API Client và các hook có thể dùng với dialect khác.

```bash
git clone https://github.com/nocobase/docs-examples-v3.git
cd docs-examples-v3
git checkout 0db1a6aade41a18757f5a709aacd2df695fcf7f8
cd apps/customer-directory
pnpm install --frozen-lockfile
pnpm nocobase config init --dialect sqlite
pnpm nocobase config check
APP_SAMPLE_DATA=true CUSTOMER_DEMO_FAULTS=1 pnpm dev
```

Cấu hình ban đầu tạo `config.yml`. Đăng nhập theo `users.initialAdmin` trong tệp. Mở địa chỉ in lúc khởi động, nối `/customers` vào đường dẫn gắn ứng dụng hoặc chọn **Customer directory** trong menu. `APP_SAMPLE_DATA=true` nạp khách hàng giả bằng tiếng Anh. Dữ liệu đã ghi còn khi khởi động lại. Gán **Customer viewer** hoặc **Customer editor** cho tài khoản thường qua **Users**.

Để truy cập từ LAN, cấu hình `APP_SERVER_HOST` và `APP_PUBLIC_ORIGIN` theo README. Tắt công tắc mô phỏng lỗi để chỉ giữ hành vi đọc và ghi thông thường.
