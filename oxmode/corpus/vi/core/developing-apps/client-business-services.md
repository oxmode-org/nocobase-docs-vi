---
title: Dịch vụ phía client
description: Đăng ký và sử dụng dịch vụ client, tiêm API Client, theo dõi trạng thái dùng chung và dọn dẹp tài nguyên.
---

Dịch vụ client chia sẻ thao tác, điều phối thay đổi trạng thái và quản lý tài nguyên cấp ứng dụng giữa các thành phần và trang. Dịch vụ có thể đóng gói thao tác nghiệp vụ hoặc cung cấp tính năng chung như bộ nhớ đệm và thông báo. ServiceProvider đăng ký dịch vụ trong container của ứng dụng.

Ví dụ danh mục sản phẩm tách thao tác đổi tên thành dịch vụ. Biểu mẫu gọi dịch vụ, danh sách tải lại sau thông báo thay đổi và hai bộ đếm theo dõi cùng trạng thái. Ví dụ dùng template mặc định `1.0.0-beta.85` cùng các thành phần shadcn. [Lấy mã nguồn và chạy ví dụ](#example-source-and-setup).

<a id="when-a-client-service-helps"></a>

## Khi nào cần dịch vụ client

Dùng hàm thông thường cho tính toán hoặc định dạng độc lập. Dùng trạng thái thành phần hoặc hook tùy chỉnh cho bản nháp biểu mẫu và trạng thái đang tải. React Context chia sẻ dữ liệu trong cây thành phần. Dùng dịch vụ client khi nhiều trang cùng gọi thao tác, cần phối hợp thay đổi hoặc chia sẻ tài nguyên có vòng đời riêng.

Máy chủ vẫn chịu trách nhiệm thực thi quy tắc nghiệp vụ, quyền truy cập, phạm vi dữ liệu, transaction và kiểm tra đầu vào cuối cùng. Với lời gọi API cơ bản, xem [Yêu cầu dữ liệu và quản lý trạng thái](data-requests-and-state.md).

<a id="implement-and-register-a-service"></a>

## Viết và đăng ký dịch vụ

<a id="encapsulate-operations-and-change-notifications"></a>

### Đóng gói thao tác và thông báo thay đổi

Trong `client/services/products.ts`, nhận API Client qua constructor. `rename()` nhận ID sản phẩm, tên và tùy chọn yêu cầu. Sau khi API thành công, hàm tăng bộ đếm và thông báo cho các bên đã đăng ký:

```ts
import type { ApiClient } from '@nocobase/app-client';

export interface Product {
  id: string;
  name: string;
  sku: string;
}
export type DemoMode = 'normal' | 'slow' | 'fail';
export interface RenameOptions {
  signal?: AbortSignal;
  mode?: DemoMode;
}

export class ProductsService {
  private revision = 0;
  private disposed = false;
  private readonly listeners = new Set<() => void>();
  constructor(private readonly api: ApiClient) {}
  getSnapshot = (): number => this.revision;
  subscribe = (listener: () => void): (() => void) => {
    if (this.disposed) throw new Error('ProductsService has been disposed.');
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  async rename(
    id: string,
    name: string,
    options: RenameOptions = {},
  ): Promise<Product> {
    if (this.disposed) throw new Error('ProductsService has been disposed.');
    const response = await this.api.request<{ data: Product }>({
      method: 'PATCH',
      path: `clientServiceProducts/${encodeURIComponent(id)}`,
      json: { name },
      signal: options.signal,
      // This header controls this example's HTTP response, not a framework feature.
      headers: { 'x-demo-mode': options.mode ?? 'normal' },
    });
    if (!this.disposed) {
      this.revision += 1;
      for (const listener of this.listeners) listener();
    }
    return response.data;
  }
  dispose(): void {
    this.disposed = true;
    this.listeners.clear();
  }
}
```

`getSnapshot()` trả bộ đếm, `subscribe()` trả hàm hủy đăng ký và `dispose()` xóa các hàm lắng nghe rồi ngừng gửi thông báo. Ứng dụng tự định nghĩa các phương thức này.

`revision` đếm phản hồi ghi thành công mà dịch vụ nhận được. Giá trị này độc lập với phiên bản bản ghi và bộ nhớ đệm danh sách. Yêu cầu thất bại hoặc bị hủy trả lỗi về bên gọi và giữ nguyên bộ đếm. Callback đăng ký chỉ nên đánh dấu dữ liệu cần tải lại và xử lý lỗi trong lần tải bất đồng bộ.

Đường dẫn yêu cầu tương đối với URL cơ sở của API ứng dụng, nên bỏ đường dẫn triển khai và tiền tố `/api`. Header `x-demo-mode` là quy ước của ví dụ để tạo phản hồi chậm hoặc lỗi. Ví dụ cung cấp endpoint tương ứng trên máy chủ để client gọi.

[Xem dịch vụ](https://github.com/nocobase/docs-examples-v3/blob/36708ad5b081835c6ab206cdc5ec1a40618971f3/apps/client-business-services/client/services/products.ts) · [Xem API minh họa](https://github.com/nocobase/docs-examples-v3/blob/36708ad5b081835c6ab206cdc5ec1a40618971f3/apps/client-business-services/server/routes/demo-products.ts)

<a id="define-a-shared-token"></a>

### Khai báo Token dùng chung

Khai báo và xuất định danh dịch vụ trong `client/services/tokens.ts`:

```ts
import { createServiceToken } from '@nocobase/service-provider';
import type { ProductsService } from './products.js';
export const productsServiceToken =
  createServiceToken<ProductsService>('app.products');
```

Mã đăng ký và mã sử dụng phải import cùng một Token. Gọi lại `createServiceToken('app.products')` tạo định danh khác dù tên giống nhau.

[Xem Token](https://github.com/nocobase/docs-examples-v3/blob/36708ad5b081835c6ab206cdc5ec1a40618971f3/apps/client-business-services/client/services/tokens.ts)

<a id="register-a-serviceprovider-and-inject-dependencies"></a>

### Đăng ký ServiceProvider và tiêm dependency

Trong `client/providers/products.ts`, đăng ký hàm tạo lấy API Client sẵn có của ứng dụng:

```ts
import { apiClientToken, type ClientApplication } from '@nocobase/app-client';
import { ServiceProvider } from '@nocobase/service-provider';
import { ProductsService } from '../services/products.js';
import { productsServiceToken } from '../services/tokens.js';
export class ProductsServiceProvider extends ServiceProvider<ClientApplication> {
  readonly name = 'app.products';
  override register(): void {
    this.app.container.singleton(
      productsServiceToken,
      (services) => new ProductsService(services.resolve(apiClientToken)),
    );
  }
  override async shutdown(): Promise<void> {
    this.app.container.resolveIfCreated(productsServiceToken)?.dispose();
  }
}
```

`singleton()` tạo đối tượng khi có lần lấy đầu tiên rồi trả lại chính đối tượng đó cho các lần sau trong cùng container. Bước đăng ký chỉ khai báo dependency. Khởi động yêu cầu hoặc truy cập DOM sau khi thành phần cần dùng dịch vụ. Xem [Hủy đăng ký và giải phóng tài nguyên](#unsubscribe-and-release-resources) để dọn dẹp khi dừng ứng dụng.

Thêm Provider vào cuối mảng hiện có trong `client/service-provider.ts`:

```ts
import { ProductsServiceProvider } from './providers/products.js';

const serviceProviders: readonly ClientServiceProviderConstructor[] = [
  DefaultClientServiceProvider,
  ProductsServiceProvider,
];

export default serviceProviders;
```

Giữ các import kiểu, `DefaultClientServiceProvider` và Provider khác. Provider mặc định cũng cung cấp Toast và thiết lập tiêu đề tài liệu. `client/runtime.ts` của template đã nạp điểm vào tổng hợp này. Tổ chức mã trong `services/` và `providers/` rồi đăng ký tường minh trong điểm vào.

[Xem Provider](https://github.com/nocobase/docs-examples-v3/blob/36708ad5b081835c6ab206cdc5ec1a40618971f3/apps/client-business-services/client/providers/products.ts) · [Xem điểm vào đăng ký](https://github.com/nocobase/docs-examples-v3/blob/36708ad5b081835c6ab206cdc5ec1a40618971f3/apps/client-business-services/client/service-provider.ts)

<a id="call-the-service-from-a-page"></a>

## Gọi dịch vụ từ trang

<a id="submit-changes-and-handle-failure"></a>

### Gửi thay đổi và xử lý lỗi

Gọi `useService(productsServiceToken)` ở cấp cao nhất của thành phần hoặc hook tùy chỉnh. Sau đó gọi phương thức dịch vụ trong trình xử lý gửi biểu mẫu. Dùng lại đối tượng dịch vụ từ hook giữa các lần render.

Trình chỉnh sửa quản lý bản nháp, trạng thái đang gửi và phản hồi. Đoạn sau cho thấy trạng thái và logic gửi. `product` là bản ghi đã chọn, còn `mode` lấy từ **Response mode**. Phần tiếp theo xử lý khi thành phần được gắn hoặc gỡ:

```tsx
// Inside ProductEditor. Imports, validation and form markup are in the full source.
const products = useService(productsServiceToken);
const [name, setName] = useState(product.name);
const [pending, setPending] = useState(false);
const [feedback, setFeedback] = useState('');
const activeRef = useRef<AbortController | null>(null);
const mountedRef = useRef(false);

async function submit(event: FormEvent) {
  event.preventDefault();
  // Name validation is omitted here.
  if (activeRef.current) return;
  setFeedback('');
  setPending(true);
  const controller = new AbortController();
  activeRef.current = controller;
  try {
    const saved = await products.rename(product.id, name.trim(), {
      signal: controller.signal,
      mode,
    });
    if (mountedRef.current) {
      setName(saved.name);
      setFeedback('saved');
    }
  } catch {
    if (mountedRef.current)
      setFeedback(controller.signal.aborted ? 'cancelled' : 'failed');
  } finally {
    activeRef.current = null;
    if (mountedRef.current) setPending(false);
  }
}
```

Biểu mẫu đầy đủ kiểm tra tên, vô hiệu hóa các ô nhập và nút lưu trong lúc chờ, rồi dùng `activeRef` để tránh gửi trùng. Nếu thất bại, `name` giữ nguyên và trang dịch khóa phản hồi. Ứng dụng nghiệp vụ cũng cần phân biệt lỗi trường, lỗi quyền và lỗi API khác.

Mở `/service-products`, bấm **Edit** trên một hàng, đổi tên rồi bấm **Save changes**. Danh sách hiện tên mới và cả hai bộ đếm **Successful changes** cùng tăng.

![Danh sách và cả hai bộ đếm cập nhật sau khi lưu](/assets/core/client-services/saved.png)

Chọn **Fail** trong **Response mode** rồi lưu lại. Thông báo lỗi xuất hiện, bản nháp vẫn còn, danh sách và bộ đếm giữ nguyên.

![Yêu cầu thất bại giữ bản nháp và bộ đếm hiện tại](/assets/core/client-services/failed.png)

[Xem trình chỉnh sửa đầy đủ](https://github.com/nocobase/docs-examples-v3/blob/36708ad5b081835c6ab206cdc5ec1a40618971f3/apps/client-business-services/client/pages/service-products/editor.tsx)

<a id="cancel-page-owned-requests"></a>

### Hủy yêu cầu do trang khởi tạo

Trang quản lý các yêu cầu do mình khởi tạo. Truyền `AbortSignal` qua dịch vụ tới API Client, hủy khi gỡ thành phần và tránh cập nhật thành phần đã gỡ:

```tsx
// Inside ProductEditor, using the refs declared above.
useEffect(() => {
  mountedRef.current = true;
  return () => {
    mountedRef.current = false;
    activeRef.current?.abort();
  };
}, []);

// The cancel button in the form:
<Button
  variant="outline"
  type="button"
  onClick={() => activeRef.current?.abort()}
>
  {t('serviceProducts.cancel')}
</Button>
```

Chọn **Slow (3 seconds)** rồi lưu. Các ô nhập bị khóa và xuất hiện **Saving…** cùng **Cancel request**. Khi hủy, client ngừng chờ và bộ đếm giữ nguyên.

![Có thể hủy khi đang chờ phản hồi](/assets/core/client-services/pending.png)

Máy chủ có thể đã ghi dữ liệu trước khi client hủy chờ. Ví dụ cố tình cập nhật bản ghi trong bộ nhớ trước khi trì hoãn phản hồi. Sau khi hủy, bấm **Refresh list** để thấy tên máy chủ đã lưu. Hoàn tác thay đổi nghiệp vụ cần thao tác riêng trên máy chủ.

![Tải lại danh sách sau khi hủy cho thấy tên đã lưu trên máy chủ](/assets/core/client-services/cancelled.png)

[Xem cách hủy và dọn dẹp khi gỡ thành phần](https://github.com/nocobase/docs-examples-v3/blob/36708ad5b081835c6ab206cdc5ec1a40618971f3/apps/client-business-services/client/pages/service-products/editor.tsx)

<a id="update-multiple-views-when-a-service-changes"></a>

## Cập nhật nhiều vùng hiển thị khi dịch vụ thay đổi

<a id="subscribe-with-usesyncexternalstore"></a>

### Đăng ký theo dõi bằng useSyncExternalStore

`useService()` lấy đối tượng dịch vụ. Để render lại thành phần khi trạng thái dịch vụ đổi, kết nối đăng ký theo dõi và snapshot bằng `useSyncExternalStore`:

```ts
import { useService } from '@nocobase/app-client';
import { useSyncExternalStore } from 'react';
import { productsServiceToken } from '../services/tokens.js';
export function useProductRevision(): number {
  const products = useService(productsServiceToken);
  return useSyncExternalStore(products.subscribe, products.getSnapshot);
}
```

Cả hai thành phần `ChangeCounter` dùng hook này. Xem mã đầy đủ ở liên kết bên dưới để tra các import:

```tsx
function ChangeCounter({ title }: { title: string }) {
  const { t } = useTranslation();
  const count = useProductRevision();
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <p role="status">{t('serviceProducts.count', { count })}</p>
      </CardContent>
    </Card>
  );
}
```

Khi lưu, dịch vụ thông báo cho cả hai bên theo dõi. React đọc lại snapshot và cập nhật hai bộ đếm như trong [trạng thái sau khi lưu](#submit-changes-and-handle-failure). Khi gỡ một thành phần, React gọi hàm dọn dẹp do `subscribe()` trả về.

Snapshot phải giữ nguyên khi trạng thái chưa đổi. Ví dụ trả một số. Với snapshot là đối tượng, dùng lại đối tượng cũ khi dữ liệu vẫn như trước. Ví dụ render trong trình duyệt. Nếu render phía máy chủ, cung cấp thêm `getServerSnapshot` phù hợp. Xem [React useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore).

[Xem hook đăng ký](https://github.com/nocobase/docs-examples-v3/blob/36708ad5b081835c6ab206cdc5ec1a40618971f3/apps/client-business-services/client/hooks/use-product-revision.ts) · [Xem bộ đếm](https://github.com/nocobase/docs-examples-v3/blob/36708ad5b081835c6ab206cdc5ec1a40618971f3/apps/client-business-services/client/pages/service-products/index.tsx)

<a id="subscribe-to-notifications-and-reload-a-list"></a>

### Theo dõi thông báo và tải lại danh sách

Danh sách có thể đăng ký trực tiếp một thao tác tải lại và giữ dữ liệu trong trang. Ví dụ dùng `useListData` của template để xử lý lần tải đầu, hủy và bỏ qua phản hồi cũ:

```ts
import { useService } from '@nocobase/app-client';
import { useEffect } from 'react';
import { useListData } from './use-list-data.js';
import { productsServiceToken } from '../services/tokens.js';
import type { Product } from '../services/products.js';
export function useProducts() {
  const products = useService(productsServiceToken);
  const request = useListData<{ data: Product[] }>('clientServiceProducts');
  const { reload } = request;
  useEffect(() => products.subscribe(reload), [products, reload]);
  return {
    rows: request.data?.data ?? [],
    loading: request.loading,
    failed: Boolean(request.error),
    reload,
  };
}
```

Khi được gắn, danh sách tự tải và chỉ theo dõi thông báo mới. Khi bị gỡ, danh sách hủy đăng ký. Sau khi lưu, thông báo kích hoạt một lần tải lại duy nhất. Xem kết quả trong [trạng thái sau khi lưu](#submit-changes-and-handle-failure).

Thông báo chỉ bao gồm thay đổi thành công qua dịch vụ này. Để thấy thay đổi từ người dùng hoặc trình duyệt khác, tải lại thủ công hoặc tích hợp cập nhật thời gian thực.

[Xem cách danh sách đăng ký](https://github.com/nocobase/docs-examples-v3/blob/36708ad5b081835c6ab206cdc5ec1a40618971f3/apps/client-business-services/client/hooks/use-products.ts) · [Xem hook danh sách của template](https://github.com/nocobase/docs-examples-v3/blob/36708ad5b081835c6ab206cdc5ec1a40618971f3/apps/client-business-services/client/hooks/use-list-data.ts)

<a id="manage-service-lifecycle"></a>

## Quản lý vòng đời dịch vụ

<a id="understand-the-singleton-scope"></a>

### Phạm vi singleton

Singleton trong container thuộc phiên bản ứng dụng hiện tại trên trình duyệt. Các thành phần lấy cùng Token sẽ dùng chung dịch vụ. Khi tải lại trang, mở tab khác hoặc dùng container khác, mỗi nơi có đối tượng riêng.

Tải lại ví dụ đặt lại hai bộ đếm và vẫn đọc tên sản phẩm từ bộ nhớ máy chủ. Khởi động lại máy chủ khôi phục sản phẩm ban đầu. Vòng đời dịch vụ client độc lập với thời gian lưu dữ liệu trên máy chủ.

Mở tab thứ hai để thấy bộ đếm bắt đầu từ 0. Thay đổi thành công ở tab khác cần bấm **Refresh list** để đọc lại sản phẩm.

React Provider cung cấp ngữ cảnh cho cây thành phần qua `client/react-providers.ts`. ServiceProvider đăng ký dịch vụ container qua `client/service-provider.ts`. Dùng `useService()` với cấu hình sẵn có của ứng dụng. Nếu bổ sung bộ nhớ đệm phụ thuộc danh tính, xóa dữ liệu đệm và hủy yêu cầu đang chạy khi danh tính đổi.

<a id="unsubscribe-and-release-resources"></a>

### Hủy đăng ký và giải phóng tài nguyên

Trang dọn đăng ký và yêu cầu khi bị gỡ. Dịch vụ giải phóng tài nguyên do mình sở hữu. Khi dừng, Provider trong ví dụ gọi:

```ts
this.app.container.resolveIfCreated(productsServiceToken)?.dispose();
```

`resolveIfCreated()` chỉ trả về đối tượng đã được tạo để tránh khởi tạo dịch vụ chưa dùng trong lúc dừng. Ở đây, `dispose()` xóa hàm lắng nghe và ngăn yêu cầu đang chờ phát thông báo sau đó. API Client dùng chung tiếp tục do ứng dụng quản lý.

Bấm **Hide second view** để gỡ bộ đếm thứ hai rồi lưu một sản phẩm. Bộ đếm thứ nhất vẫn cập nhật. Bấm **Show second view** để gắn thành phần mới và đọc ngay snapshot hiện tại.

![Bộ đếm còn lại cập nhật sau khi vùng hiển thị thứ hai được gỡ](/assets/core/client-services/unmounted.png)

Nếu dịch vụ tạo kết nối, bộ định giờ hoặc yêu cầu nền, dịch vụ cũng phải đóng hoặc hủy chúng. Xem [Container dịch vụ](../framework/services/container.md) và [ServiceProvider và vòng đời dịch vụ](../extension-development/service-provider.md) về quy ước container và thứ tự thực thi.

[Xem cách dọn dẹp](https://github.com/nocobase/docs-examples-v3/blob/36708ad5b081835c6ab206cdc5ec1a40618971f3/apps/client-business-services/client/providers/products.ts) · [Xem kiểm thử singleton, hủy đăng ký và dừng ứng dụng](https://github.com/nocobase/docs-examples-v3/blob/36708ad5b081835c6ab206cdc5ec1a40618971f3/apps/client-business-services/tests/client/products-service.test.ts)

<a id="example-source-and-setup"></a>

## Mã nguồn và thiết lập ví dụ

[Ví dụ đầy đủ và README](https://github.com/nocobase/docs-examples-v3/blob/36708ad5b081835c6ab206cdc5ec1a40618971f3/apps/client-business-services/README.MD) yêu cầu Node.js 24 trở lên và pnpm 11. Phiên bản dependency được khóa trong `pnpm-lock.yaml`. Chạy trong thư mục riêng:

```bash
git clone https://github.com/nocobase/docs-examples-v3.git
cd docs-examples-v3
git checkout 36708ad5b081835c6ab206cdc5ec1a40618971f3
cd apps/client-business-services
pnpm install --frozen-lockfile
pnpm nocobase config init --dialect sqlite --json
pnpm nocobase config check --json
pnpm dev
```

Nối `service-products` vào URL ứng dụng in khi khởi động. Với URL cơ sở kết thúc bằng `/main/`, mở `/main/service-products`. Trang minh họa mở được khi chưa đăng nhập. SQLite hỗ trợ các tính năng của template trong ví dụ độc lập. Dịch vụ client hoạt động độc lập với dialect. Ứng dụng hiện có tiếp tục dùng cấu hình riêng.

Ví dụ dùng API Client và endpoint HTTP thật, với ba sản phẩm cố định lưu trong bộ nhớ máy chủ. API công khai của ví dụ đổi tên các sản phẩm mẫu. Khi áp dụng vào dữ liệu thật cần dùng cơ chế xác thực, phân quyền và truy cập cơ sở dữ liệu hiện có của ứng dụng.

Từ thư mục gốc của ứng dụng ví dụ, chạy kiểm thử dịch vụ, trang và API:

```bash
pnpm exec vitest run tests/client/products-service.test.ts tests/client/service-products.test.tsx tests/server/demo-products.test.ts
```

Xem README của ví dụ để biết chi tiết kiểm thử và lệnh tự động hóa trình duyệt.
