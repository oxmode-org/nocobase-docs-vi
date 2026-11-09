---
title: Thành phần giao diện và tương tác
description: Dùng quy ước shadcn để tích hợp mã nguồn NocoBase UI Library, khối nghiệp vụ, hộp thoại theo route và ngữ cảnh ứng dụng.
---

Ứng dụng NocoBase dùng quy ước shadcn cho giao diện. Mã nguồn thành phần nằm trong ứng dụng. Trang nối thành phần với dữ liệu và thao tác, còn ứng dụng duy trì cách hiển thị và tương tác.

Ví dụ danh mục dùng dữ liệu mẫu cho sản phẩm, người dùng và lịch sử duyệt. Chỉnh sửa sản phẩm còn đến khi tải lại toàn trang. Ghi chú duyệt đặt lại khi rời trang. Xem [Mã nguồn và thiết lập ví dụ](#example-source-and-setup) để tải và chạy.

<a id="component-conventions"></a>

## Quy ước thành phần

<a id="follow-shadcn-conventions-throughout"></a>

### Dùng nhất quán quy ước shadcn

Dùng nút, ô nhập, biểu mẫu và hộp thoại xác nhận shadcn hiện có để giữ chủ đề, tương tác và hỗ trợ tiếp cận. [NocoBase UI Library](https://ui.nocobase.com/) phân phối thành phần và khối nghiệp vụ qua shadcn Registry theo cùng quy ước.

Ví dụ dùng thành phần Base UI của template `1.0.0-beta.85`. Theo API ghép thành phần của mã đã cài. Chẳng hạn, các thành phần này nhận `render` để ghép phần tử. API `asChild` thuộc triển khai khác. Xem [tài liệu shadcn](https://ui.shadcn.com/docs) về cách dùng chung.

<a id="reuse-existing-application-components-first"></a>

### Ưu tiên dùng lại thành phần có sẵn

Kiểm tra `client/components/` và các trang hiện có. Template mặc định đã có `PageContainer`, `PageHeader`, `DataTable` và lớp phủ theo route. Thành phần cơ sở nằm trong `client/components/ui/`. Dùng shadcn CLI của dự án để thêm thành phần còn thiếu.

Danh mục dùng lại `DataTable`, `Input` và menu thao tác hàng, cùng `StockBadge` dùng chung cho trạng thái tồn kho:

```tsx
import { PageHeader } from '#components/page-header';
import { DataTable } from '#components/data-table';
import { Input } from '#components/ui/input';

// Composition inside CatalogPage; see the full source for filtering, columns and state.
<PageHeader title={t('catalog.title')} description={t('catalog.description')} />
<DataTable
  data={products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))}
  columns={columns}
  pagination={false}
  toolbar={() => (
    <Input
      aria-label={t('catalog.search')}
      placeholder={t('catalog.search')}
      value={query}
      onChange={(event) => setQuery(event.target.value)}
    />
  )}
/>
```

Mở **Product catalog**, tìm sản phẩm hoặc chọn **Edit** trong menu hàng. [Xem mã nguồn danh mục](https://github.com/nocobase/docs-examples-v3/blob/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components/client/pages/ui-components/catalog.tsx).

![Danh mục dùng lại đầu trang, bảng, ô tìm kiếm và menu hàng](/assets/core/developing-apps/pages-and-interactions/catalog.png)

<a id="use-the-nocobase-ui-library"></a>

## Dùng NocoBase UI Library

<a id="configure-the-registry-and-add-components"></a>

### Cấu hình Registry và thêm thành phần

Template mặc định đã cấu hình NocoBase Registry trong `components.json`. Nếu ứng dụng còn thiếu, bổ sung mục sau vào cấu hình hiện có:

```json
{
  "registries": {
    "@nocobase": "https://ui.nocobase.com/r/{name}.json"
  }
}
```

Chạy CLI đã cài của dự án từ thư mục gốc. Ví dụ thêm đầu trang hoặc khối trình bày phê duyệt:

```bash
pnpm exec shadcn add @nocobase/page-header
pnpm exec shadcn add @nocobase/approval-ui
```

Dùng trực tiếp thành phần đã có. Nếu CLI hỏi ghi đè, giữ bản hiện tại rồi xem khác biệt trước. Khi thêm khối, chỉ thay thành phần cơ sở nếu đã kiểm tra tác động.

Cài `approval-ui` thêm 13 tệp vào ví dụ. Các vị trí chính gồm:

```text
client/components/page-header.tsx
client/extensions/nocobase-approval-ui/
  index.ts
  types.ts
  approval-progress.tsx
  approval-timeline.tsx
  approval-action-bar.tsx
  approval-ui-provider.tsx
  locales/
  ...
```

[Xem cấu hình Registry](https://github.com/nocobase/docs-examples-v3/blob/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components/components.json) · [Xem khối đã cài](https://github.com/nocobase/docs-examples-v3/tree/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components/client/extensions/nocobase-approval-ui).

<a id="use-components-and-business-blocks"></a>

### Dùng thành phần và khối nghiệp vụ

Import từ đường dẫn mã nguồn ứng dụng. Thành phần riêng thường nằm ở `client/components/`. Khối gồm nhiều thành phần, kiểu và tài nguyên ngôn ngữ, thường ở `client/extensions/nocobase-<name>/`.

Trang **Review block** kết hợp tiến độ, lịch sử và thanh thao tác:

```tsx
import {
  ApprovalProgress,
  ApprovalTimeline,
  ApprovalActionBar,
} from '#extensions/nocobase-approval-ui/index';

// Composition inside ReviewPage; the page supplies steps, lines and actions.
<ApprovalProgress steps={steps} />
<ApprovalTimeline lines={lines} />
<ApprovalActionBar actions={actions} />
```

Mở **Review block** để xem thông tin sản phẩm đã gửi và lượt duyệt nội dung đang thực hiện. [Xem cách ghép khối](https://github.com/nocobase/docs-examples-v3/blob/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components/client/pages/ui-components/review.tsx).

![Tiến độ, lịch sử và thao tác trên trang duyệt sản phẩm](/assets/core/developing-apps/pages-and-interactions/review-block.png)

<a id="check-dependencies-and-source-locations"></a>

### Kiểm tra dependency và vị trí mã nguồn

Registry cài mã nguồn và dependency đã khai báo. Đọc hướng dẫn của tài nguyên, tệp sinh ra, `package.json` và lockfile để biết cần dữ liệu, callback, Provider, tài nguyên ngôn ngữ và plugin nào cho tích hợp nghiệp vụ.

`approval-ui` trình bày giao diện và chạy độc lập với plugin phê duyệt. Ví dụ truyền dữ liệu duyệt mẫu và cập nhật ghi chú cục bộ qua callback. Quy trình phê duyệt thật cần tích hợp xử lý nghiệp vụ và kiểm tra quyền trên máy chủ.

shadcn CLI có thể thêm dependency frontend vào `dependencies`. Theo quy ước ứng dụng, package chỉ dùng ở client thuộc `devDependencies`, còn package dùng cả ở server giữ trong `dependencies`. Alias import lấy từ `imports` trong `package.json` và `components.json`. Dùng chung các alias đó với Vite và TypeScript.

Để phân phối mã thành phần riêng, xem [Mở rộng frontend](../extension-development/frontend-components.md). Xem [shadcn Registry](https://ui.shadcn.com/docs/registry) về cơ chế phân phối chung.

<a id="connect-application-interactions"></a>

## Nối tương tác của ứng dụng

<a id="connect-a-block-to-data-and-actions"></a>

### Nối khối với dữ liệu và thao tác

Khối xác định đầu vào và cách tương tác. Trang ánh xạ dữ liệu nghiệp vụ sang đầu vào rồi quyết định cập nhật gì sau thao tác. `ApprovalActionBar` dùng `form` cho nhập và kiểm tra dữ liệu, dùng `run` để thực thi. Trả `false` giữ biểu mẫu mở. Các kết quả thành công khác đóng biểu mẫu.

Thao tác **Add review note** dùng cấu hình dưới đây. Xem [mã tích hợp thao tác](https://github.com/nocobase/docs-examples-v3/blob/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components/client/pages/ui-components/review.tsx) để tra phần render đầu vào và khai báo trạng thái:

```tsx
{
  key: 'note',
  label: t('catalog.review.addNote'),
  primary: true,
  form: {
    initialValues: { note: '' },
    validate: (values) => noteText(values.note).trim() ? [] : ['note'],
    // render draws the form using the supplied values, setValues, invalid and busy.
  },
  run: async (values) => {
    setError('');
    await new Promise((resolve) => setTimeout(resolve, 700));
    if (rejectNext) {
      setRejectNext(false);
      setError(t('catalog.review.refused'));
      return false;
    }
    setComment(noteText(values.note).trim());
  },
}
```

Bấm **Add review note**. Biểu mẫu yêu cầu có ghi chú trước khi gửi. Khi gửi nội dung, lịch sử cập nhật và biểu mẫu đóng. Độ trễ giúp quan sát trạng thái đang chạy. Trong ứng dụng thật, gọi API nghiệp vụ và xử lý lỗi trong callback.

![Biểu mẫu ghi chú duyệt với kiểm tra trường bắt buộc](/assets/core/developing-apps/pages-and-interactions/review-note.png)

Bấm **Refuse the next note** trước khi gửi để thử trường hợp `run` trả `false`. Trang giải thích lỗi và giữ đầu vào. Gửi lại để thành công. Hiển thị phản hồi rõ ràng khi có ngoại lệ. Xem [Yêu cầu dữ liệu và trạng thái](data-requests-and-state.md) để xử lý yêu cầu thật và tải lại.

![Thao tác bị từ chối giữ nguyên ghi chú và biểu mẫu](/assets/core/developing-apps/pages-and-interactions/review-refused.png)

<a id="use-route-dialogs-and-close-guards"></a>

### Dùng hộp thoại theo route và chặn đóng khi cần

Dùng route con cho trình sửa bản ghi hoặc lớp phủ chi tiết. Cha render `<Outlet />`, còn trang con bọc biểu mẫu bằng `RouteDialog`. URL quyết định trạng thái mở. Trong ví dụ, `catalog/edit/:productId` là route con của danh mục:

```tsx
// The catalog route under /ui-components in client/routes.ts.
{
  name: 'uiCatalog',
  path: 'catalog',
  componentLoader: () => import('./pages/ui-components/catalog.js'),
  children: [{
    name: 'uiProductEdit',
    path: 'edit/:productId',
    componentLoader: () => import('./pages/ui-components/edit.js'),
  }],
}
```

Bấm **Arc desk lamp** để mở trình sửa. Truy cập trực tiếp cùng URL cũng mở hộp thoại. Xem [Trang, route và điều hướng](pages-routes-and-navigation.md) về khai báo và lồng route, cùng [mã nguồn trình sửa](https://github.com/nocobase/docs-examples-v3/blob/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components/client/pages/ui-components/edit.tsx).

![Route con mở hộp thoại sửa sản phẩm](/assets/core/developing-apps/pages-and-interactions/edit-product.png)

Gọi `useRouteOverlay()` trong thành phần con của `RouteDialog`, chẳng hạn thành phần truyền vào `footer`. `close()` gọi `beforeClose`, rồi về route cha khi được phép và mặc định giữ tham số truy vấn. Đặt hook bên trong ngữ cảnh hộp thoại.

```tsx
function EditorFooter({ pending, disabled }: { pending: boolean; disabled: boolean }) {
  const { t } = useTranslation();
  const { close, isClosing } = useRouteOverlay();
  return <>
    <Button variant="outline" disabled={pending || isClosing}
      onClick={() => void close()}>{t('catalog.cancel')}</Button>
    <Button type="submit" form="product-edit"
      disabled={pending || isClosing || disabled}>{t('catalog.save')}</Button>
  </>;
}
```

Ví dụ chặn rời trang trong lúc gửi. Khi có thay đổi chưa lưu, bộ chặn trả Promise chờ xác nhận. **Keep editing** giữ đầu vào, còn **Discard** cho phép điều hướng. Các yêu cầu đóng đồng thời dùng chung Promise đang chờ để chỉ hiện một xác nhận.

```tsx
// Core checks in useEditorLeave; see the source for the confirmation and Promise management.
function guard() {
  if (allowedRef.current) return true;
  if (flagsRef.current.pending) return false;
  if (!flagsRef.current.dirty) return true;
  if (!requestRef.current) {
    let resolve!: (allow: boolean) => void;
    const promise = new Promise<boolean>((done) => { resolve = done; });
    requestRef.current = { promise, resolve };
    setOpen(true);
  }
  return requestRef.current.promise;
}
useNavigationGuard(guard);

// The editor passes the same check to the overlay.
<RouteDialog beforeClose={leave.guard} footer={<EditorFooter pending={pending} disabled={!product} />}>
  {/* Form and confirmation dialog */}
</RouteDialog>
```

Đoạn trích minh họa các điểm tích hợp. Xem [mã bộ chặn đóng](https://github.com/nocobase/docs-examples-v3/blob/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components/client/pages/ui-components/use-editor-leave.tsx) để chạy triển khai đầy đủ. Cập nhật trạng thái và ref cùng nhau khi gửi. Sau khi lưu thành công, nhả bộ chặn trước khi đóng để trạng thái cũ không cản thao tác.

![Xác nhận bỏ thay đổi chưa lưu hiện trên trình sửa](/assets/core/developing-apps/pages-and-interactions/discard-changes.png)

Xử lý riêng ba cách rời trang:

| Cách rời trang | Cơ chế trong ví dụ |
| --- | --- |
| Nút đóng, Esc, nền phía sau hoặc `close()` | `beforeClose` |
| Lịch sử trình duyệt hoặc điều hướng route | `useNavigationGuard` |
| Tải lại trình duyệt hoặc đóng tab | `beforeunload`, hiển thị xác nhận của trình duyệt |

Bật **Simulate save failure** và lưu. Trình sửa vẫn mở và giữ đầu vào. Tắt tùy chọn để thử lại. Thao tác lưu chỉ cập nhật dữ liệu trong phiên trang hiện tại.

![Lưu thất bại giữ hộp thoại và đầu vào](/assets/core/developing-apps/pages-and-interactions/save-failure.png)

<a id="supply-application-context-for-a-block"></a>

### Cung cấp ngữ cảnh ứng dụng cho khối

Khối có thể cần tên, ảnh đại diện hoặc định dạng ngày riêng của ứng dụng. Ví dụ cung cấp hàm tra người và định dạng ngày cho `ApprovalUiProvider`. Nếu thiếu `personName`, khối mặc định hiển thị ID.

Cấu hình chính trong `CatalogApprovalProvider` ở dưới. Xem [mã Provider](https://github.com/nocobase/docs-examples-v3/blob/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components/client/pages/ui-components/approval-provider.tsx) về ghép ảnh đại diện và triển khai đầy đủ:

```tsx
<ApprovalUiProvider
  personName={(id) => people[id] ?? id}
  formatDateTime={(iso) =>
    new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC',
    }).format(new Date(iso)) + ' UTC'
  }
>
  {children}
</ApprovalUiProvider>
```

Ví dụ dùng UTC để kết quả nhất quán. Trong nghiệp vụ, dùng múi giờ theo yêu cầu ứng dụng. Khi nhiều trang cần chung ngữ cảnh, đăng ký Provider ở lớp `application` trong `client/react-providers.ts`:

```tsx
// Add to the existing defineClientReactProviders([...]); retain other registrations.
{
  name: 'catalog-approval-ui',
  layer: 'application',
  component: CatalogApprovalProvider,
}
```

Hợp nhất tài nguyên ngôn ngữ của khối vào tệp locale tương ứng, như `...approvalUi` trong `client/locales/en-US.ts`. React Provider cung cấp ngữ cảnh render. ServiceProvider trong `client/service-provider.ts` quản lý dịch vụ và khởi động. Xem [React Provider](../framework/runtime/react-providers.md).

Sau khi gửi ghi chú trong **Review block**, kiểm tra tên, ảnh đại diện và ngày UTC. [Xem đăng ký ứng dụng](https://github.com/nocobase/docs-examples-v3/blob/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components/client/react-providers.ts) · [Xem tài nguyên ngôn ngữ](https://github.com/nocobase/docs-examples-v3/tree/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components/client/locales).

![Ngữ cảnh dùng chung cung cấp tên, ảnh đại diện và ngày đã định dạng cho tiến độ và lịch sử](/assets/core/developing-apps/pages-and-interactions/review-updated.png)

<a id="customize-and-maintain-components"></a>

## Tùy chỉnh và duy trì thành phần

<a id="organize-component-source"></a>

### Tổ chức mã nguồn thành phần

Đặt mã theo phạm vi tái sử dụng. Giữ logic riêng trong thư mục trang:

| Vị trí | Nội dung trong ví dụ |
| --- | --- |
| `client/pages/ui-components/` | Trang, biểu mẫu riêng, dữ liệu mẫu và hook tương tác |
| `client/components/stock-badge.tsx` | Nhãn tồn kho dùng chung cho bảng và thẻ |
| `client/components/ui/` | Thành phần cơ sở cài bằng shadcn CLI |
| `client/extensions/nocobase-approval-ui/` | Khối đầy đủ từ Registry |
| `client/react-providers.ts` | Đăng ký React Provider |
| `client/locales/` | Văn bản ứng dụng và tài nguyên ngôn ngữ của khối |

[Xem thư mục mã nguồn](https://github.com/nocobase/docs-examples-v3/tree/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components/client). Xem [Bố cục trang](page-layouts.md) về vùng chứa và quy ước bố cục.

<a id="adapt-components-to-business-needs"></a>

### Điều chỉnh thành phần theo nghiệp vụ

Dùng props, biến thể và cách ghép có sẵn để thể hiện ý nghĩa nghiệp vụ. `StockBadge` quản lý quy tắc tồn kho và dùng lại `Badge` để bảng và thẻ hiển thị nhất quán:

```tsx
export function StockBadge({ stock }: { stock: number }) {
  const { t } = useTranslation();
  const state = stock === 0 ? 'out' : stock < 5 ? 'low' : 'available';
  return (
    <Badge variant={state === 'out' ? 'outline' : state === 'low' ? 'secondary' : 'default'}>
      {t(`catalog.stock.${state}`)}
    </Badge>
  );
}
```

Mở **Component variants**. Ba thẻ hiển thị còn hàng, sắp hết và hết hàng. Bảng danh mục dùng cùng thành phần. [Xem StockBadge](https://github.com/nocobase/docs-examples-v3/blob/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components/client/components/stock-badge.tsx) · [Xem ví dụ thẻ](https://github.com/nocobase/docs-examples-v3/blob/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components/client/pages/ui-components/customize.tsx).

![Cùng một thành phần nhãn tồn kho biểu diễn ba trạng thái nghiệp vụ](/assets/core/developing-apps/pages-and-interactions/stock-variants.png)

Dùng token theo vai trò như `bg-muted` và `text-muted-foreground`, rồi theo quy ước `client/theme/` khi sửa chủ đề. Khi sửa mã khối đã sao chép, ưu tiên giữ tùy chỉnh nghiệp vụ trong thành phần bao ngoài và ghi lại thay đổi cần giữ khi cập nhật. Dùng biến thể hoặc ghép thành phần cho nhu cầu riêng của từng trang.

<a id="update-components-without-losing-business-changes"></a>

### Cập nhật thành phần và giữ thay đổi nghiệp vụ

Mã đã sao chép cần được cập nhật riêng với package npm. Commit mã hiện tại, xem thay đổi Registry rồi hợp nhất phần cần dùng. Ví dụ, kiểm tra `PageHeader`:

```bash
pnpm exec shadcn add @nocobase/page-header --diff client/components/page-header.tsx
```

Nếu giống nhau, lệnh in `No changes.`. Nếu có khác biệt, xem cả dependency, đường dẫn import và quy ước bên gọi. Hợp nhất từng phần rồi kiểm tra lại biến thể nghiệp vụ, callback và thao tác đóng lớp phủ.

Nội dung Registry có thể thay đổi. Bài này ghim một commit ví dụ. [Thông tin nguồn](https://github.com/nocobase/docs-examples-v3/blob/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components/docs/registry-sources.json) ghi phiên bản template và checksum của khối để đối chiếu sau này.

<a id="verify-interactions"></a>

## Kiểm chứng tương tác

<a id="check-each-usage-and-its-key-states"></a>

### Kiểm tra từng cách dùng và trạng thái chính

Sau khi khởi động, thử:

| Điểm vào | Thao tác và kết quả mong đợi |
| --- | --- |
| **Product catalog** | Tìm kiếm lọc sản phẩm. Tìm tên không khớp cho kết quả rỗng |
| **Edit product** | Tên rỗng bị từ chối. Lưu thành công cập nhật danh sách. Tải lại khôi phục dữ liệu mẫu |
| Đóng trình sửa | Cancel hoặc Back sau khi sửa yêu cầu xác nhận. Tiếp tục sửa giữ bản nháp. Mở trực tiếp trình sửa vẫn quay về danh mục được |
| **Simulate save failure** | Chặn đóng trong khi gửi. Lỗi giữ đầu vào và cho thử lại |
| **Review block** | Ghi chú rỗng bị từ chối. Thao tác bị từ chối giữ biểu mẫu. Thử lại cập nhật lịch sử |
| **Component variants** | Mỗi trạng thái tồn kho có nhãn chữ. Điều khiển dễ đọc và dùng được ở chế độ tối và cửa sổ hẹp |

Dùng ảnh để so sánh trạng thái và thử trực tiếp việc đóng, điều hướng. [Kiểm thử trình duyệt](https://github.com/nocobase/docs-examples-v3/blob/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components/tests/playwright/ui-components.test.ts) bao phủ các luồng này, việc giữ truy vấn, xác nhận khi tải lại và kích thước lớp phủ trên di động.

<a id="run-tests-and-build"></a>

### Chạy kiểm thử và dựng

Từ thư mục ứng dụng ví dụ:

```bash
pnpm typecheck
pnpm exec vitest run tests/client/ui-components.test.tsx tests/client/client-routes.test.ts tests/client/page-permission-titles.test.ts tests/client/route-overlay.test.tsx tests/project/agents-md.test.ts
pnpm build
```

Khởi động ứng dụng rồi truyền URL điểm vào thực tế, gồm tiền tố triển khai, cho kiểm thử trình duyệt:

```bash
pnpm exec playwright install chromium
APP_URL=http://<host>:<port>/main/ pnpm exec playwright test tests/playwright/ui-components.test.ts
```

Bỏ `APP_URL` sẽ bỏ qua kiểm thử trình duyệt. Phạm vi ví dụ là giao diện. Kiểm tra lưu dữ liệu nghiệp vụ, thực thi phê duyệt và phân quyền vai trò riêng khi tích hợp thật.

<a id="example-source-and-setup"></a>

## Mã nguồn và thiết lập ví dụ

<a id="complete-example-application"></a>

### Ứng dụng ví dụ đầy đủ

[Xem ví dụ đầy đủ](https://github.com/nocobase/docs-examples-v3/tree/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components) · [Đọc README](https://github.com/nocobase/docs-examples-v3/blob/c8670ab1f784d76c4fef61936bdc3462fe1c1d89/apps/ui-components/README.MD).

Ứng dụng chạy độc lập với ví dụ ở các chương khác. README chỉ điểm vào, tệp nguồn, ảnh và cách kiểm chứng cho mỗi cách dùng.

<a id="prepare-the-environment-and-start"></a>

### Chuẩn bị môi trường và khởi động

Dùng Node.js 24 và pnpm 11. Ví dụ dựa trên template `1.0.0-beta.85`, với `@nocobase/app-client@4.0.0-beta.5` trong lockfile. Các lệnh dùng SQLite cho dữ liệu hệ thống của template. Dữ liệu giao diện mẫu ở trong bộ nhớ và chạy độc lập với dịch vụ ngoài.

```bash
git clone https://github.com/nocobase/docs-examples-v3.git
cd docs-examples-v3
git checkout c8670ab1f784d76c4fef61936bdc3462fe1c1d89
cd apps/ui-components
pnpm install --frozen-lockfile
pnpm nocobase config init --dialect sqlite
pnpm nocobase config check
pnpm dev
```

Mở điểm vào in trong log và nối `ui-components/catalog` sau tiền tố triển khai. Với điểm vào kết thúc bằng `/main/`, danh mục ở `/main/ui-components/catalog`. Ba trang minh họa mở được khi chưa đăng nhập. Giữ `config.yml` và cơ sở dữ liệu cục bộ ngoài Git. Xem README về cấu hình cơ sở dữ liệu khác, truy cập LAN và tạo ảnh.
