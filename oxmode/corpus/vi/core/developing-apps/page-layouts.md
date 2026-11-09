---
title: Bố cục trang
description: Ghép vùng chứa, cột thích ứng, khung ứng dụng và trang con qua ví dụ danh mục sản phẩm.
---

Trang nghiệp vụ kết hợp các vùng chứa, tiêu đề và vùng nội dung có sẵn. Khung ứng dụng quản lý thương hiệu, điều hướng và thao tác toàn cục. Các thành phần này nằm trong mã nguồn của ứng dụng và dùng quy ước shadcn cho thành phần tương tác. Xem [Thành phần giao diện và tương tác](pages-and-interactions.md) để thêm thành phần.

Ví dụ danh mục sản phẩm dùng template mặc định `1.0.0-beta.85`, giao diện tiếng Anh và dữ liệu mẫu cố định. Ví dụ chỉ đọc dữ liệu mẫu trong bộ nhớ. Trạng thái tìm kiếm và công tắc tiêu đề dài nằm trong trang cha, được đặt lại khi rời danh mục hoặc tải lại. Xem [Mã nguồn và thiết lập ví dụ](#example-source-and-setup) để chạy.

<a id="choose-where-to-change-the-layout"></a>

## Chọn nơi sửa bố cục

| Thay đổi | Vị trí |
| --- | --- |
| Bộ lọc, bảng và biểu mẫu trên trang nghiệp vụ | Trang và thành phần riêng dưới `client/pages/` |
| Khoảng đệm trang, khoảng cách giữa mục, tiêu đề và thao tác | `client/components/page-container.tsx` và `page-header.tsx` |
| Thương hiệu, chân thanh bên và thao tác ở đầu trang toàn cục | `client/layouts/components/` |
| Cách bố trí thanh bên, đầu trang và nội dung | `client/layouts/app-layout.tsx` |
| Trang con nội tuyến, hộp thoại, ngăn trượt hoặc trang phủ | `Outlet` của cha và thành phần bố cục của con |
| Khung dùng chung cho đăng nhập và trang độc lập | `client/routing/standalone-page-layout.tsx` |

Thêm mục menu qua khai báo `navigation` của route để giữ cơ chế đánh dấu mục đang chọn và lọc theo quyền. Xem [Trang, route và điều hướng](pages-routes-and-navigation.md).

<a id="compose-a-business-page"></a>

## Ghép bố cục trang nghiệp vụ

<a id="page-container-heading-and-actions"></a>

### Vùng chứa, tiêu đề và thao tác

Một trang thông thường dùng một `PageContainer` và một `PageHeader` cho tiêu đề, mô tả và thao tác cấp trang. Danh mục đưa bố cục này vào `ProductPageFrame`. Trang quản lý bộ lọc và nội dung bảng:

```tsx
import { PageContainer } from '#components/page-container';
import { PageHeader } from '#components/page-header';

// Outer structure of ProductPageFrame; the next section adds its columns.
<PageContainer>
  <PageHeader title={title} description={description} actions={actions} />
  {children}
</PageContainer>
```

`PageContainer` cung cấp `w-full space-y-6 p-6 md:p-8` và nhận các thuộc tính của `section`. `PageHeader` nhận nút React qua `title`, `description` và `actions`, rồi hiển thị tiêu đề bằng `h1`. Khi dùng `ProductPageFrame`, trang dùng luôn vùng chứa của khung đó.

Đăng nhập và mở **Product catalog** từ thanh bên. Bấm **Long heading** để xem tiêu đề xuống dòng cạnh vùng thao tác. Trên màn hình hẹp, thao tác chuyển xuống dưới tiêu đề.

![Tiêu đề, vùng thao tác và nội dung hai cột của danh mục](/assets/core/developing-apps/page-layouts/catalog.png)

[Xem cách ghép trang][catalog] · [Xem thành phần bố cục][frame]

<a id="responsive-filters-and-list"></a>

### Bộ lọc và danh sách thích ứng theo màn hình

Truyền bộ lọc và danh sách vào các vị trí của bố cục. Giữ dữ liệu và xử lý sự kiện trong trang:

```tsx
// Inside ProductPageFrame, after PageHeader.
<div className="grid min-w-0 gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
  <aside aria-label={filterLabel} className="flex min-w-0 flex-col gap-4">
    {filters}
  </aside>
  <div className="min-w-0">{children}</div>
</div>
```

Từ breakpoint `lg` trở lên, cột bộ lọc rộng `14rem` và danh sách dùng phần còn lại. Ở kích thước nhỏ hơn, bộ lọc nằm trên danh sách. `minmax(0,1fr)` và `min-w-0` cho phép cột nội dung co lại để bảng rộng không kéo giãn ứng dụng. Dịch `filterLabel` để công nghệ hỗ trợ nhận biết vùng lọc.

Nhập `lamp` vào **Search products** để xem sản phẩm chiếu sáng. Nhập tên không có trong dữ liệu để thử trạng thái không tìm thấy. Thu hẹp cửa sổ để thấy bộ lọc chuyển lên trên bảng.

![Bộ lọc ở trên danh sách khi màn hình hẹp và bảng có vùng cuộn ngang riêng](/assets/core/developing-apps/page-layouts/mobile.png)

[Xem thành phần bố cục][frame]. Giữ khung riêng trong thư mục trang. Chuyển vào `client/components/` khi nhiều trang cùng dùng.

<a id="long-content-and-scrolling"></a>

### Nội dung dài và cuộn trang

Khung ứng dụng quản lý cuộn dọc. Bảng quản lý cuộn ngang. Ví dụ dùng lại `DataTable`, vốn có `overflow-x-auto` trong vùng chứa bảng:

```tsx
import { DataTable } from '#components/data-table';

// The catalog page defines columns and the filter state.
<DataTable
  columns={columns}
  data={products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()),
  )}
  pagination={false}
  emptyMessage={t('layouts.empty')}
/>
```

Ví dụ hiển thị cùng lúc 48 bản ghi để dễ quan sát khi cuộn. Trên màn hình hẹp, cuộn ngang trong bảng và kiểm tra ứng dụng vẫn giữ chiều rộng. Khi cuộn xuống, đầu trang ứng dụng đứng yên. Bộ lọc và danh sách dùng vùng cuộn dọc của khung.

[Xem mã nguồn danh sách][catalog]. Xem [Chủ đề và kiểu hiển thị](themes-and-styles.md) về màu và khoảng cách.

<a id="customize-the-application-shell"></a>

## Tùy chỉnh khung ứng dụng

<a id="branding-sidebar-and-header-actions"></a>

### Thương hiệu, thanh bên và thao tác đầu trang

`AppLayout` ghép thanh bên, đầu trang và vùng nội dung. Để sửa cục bộ, chỉnh thành phần tương ứng. `AppBrand` hiển thị **Northstar Supply** khi thanh bên mở rộng và giữ biểu tượng khi thu gọn. `HeaderActions` thêm **Catalog guide** bên cạnh điều khiển chủ đề và tài khoản:

```tsx
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '#components/ui/button';

// Inside HeaderActions, before the existing ThemeSettings and UserMenu.
<Button
  variant="ghost"
  size="icon"
  aria-label={t('layouts.guide')}
  title={t('layouts.guide')}
  render={<Link to="/catalog-guide" />}
>
  <BookOpen />
</Button>
```

Thành phần Base UI trong template ghép với nhau qua `render`. Bấm biểu tượng quyển sách để mở hướng dẫn. Thương hiệu và nút mở hướng dẫn xuất hiện trong [ảnh danh mục](#page-container-heading-and-actions).

[Xem thành phần thương hiệu][brand] · [Xem thao tác đầu trang][header]

Sửa `app-layout.tsx` khi bố trí lại toàn bộ các vùng. Giữ `RouteTreeProvider`, `PageBreadcrumbProvider`, bộ lọc quyền, `useSyncServerLocale()` và cách menu tài khoản xử lý phiên. Các phần này phục vụ điều hướng quay lại, breadcrumb, hiển thị menu, đồng bộ ngôn ngữ và đăng xuất.

<a id="sidebar-collapse-and-mobile-navigation"></a>

### Thu gọn thanh bên và điều hướng trên di động

Dùng lại `AppSidebarProvider`, `AppSidebar` và `AppSidebarToggle` để giữ hành vi máy tính và di động của template:

```tsx
// AppLayout excerpt; the full source also provides route context and the header.
<AppSidebarProvider>
  <AppSidebar label={navigationLabel} footer={<AppSidebarFooter />}>
    <NavigationMenu
      items={menuItems}
      label={navigationLabel}
      selectedKey={selectedKey}
    />
  </AppSidebar>
  {/* Header and main content column */}
</AppSidebarProvider>
```

Trên máy tính, nút ở đầu trang thu thanh điều hướng về biểu tượng và giữ lựa chọn sau khi tải lại. Trên di động, nút này mở bảng điều hướng. Trạng thái mở trên di động độc lập với trạng thái thu gọn trên máy tính. Dùng Provider làm nguồn trạng thái duy nhất.

![Nút đầu trang mở điều hướng trên di động](/assets/core/developing-apps/page-layouts/mobile-navigation.png)

[Xem khung ứng dụng][shell] · [Xem thành phần thanh bên][sidebar]

<a id="organize-child-pages"></a>

## Tổ chức trang con

<a id="tabs-and-inline-child-routes"></a>

### Tab và route con nội tuyến

Trang con nội tuyến hiển thị tại vị trí cha chọn. Hai mục **Overview** và **Handling notes** của trang chi tiết dùng chung tiêu đề, liên kết quay lại và vùng chứa. Trang cha đặt `Outlet` sau thanh tab:

```tsx
import { Outlet } from 'react-router';

// Inside the detail PageContainer, after PageHeader and tab navigation.
<Outlet />
```

`overview.tsx` hiển thị thông tin sản phẩm, còn `handling.tsx` thêm ghi chú xử lý. Cả hai dùng `PageContainer` và tiêu đề chính của cha. Mở **Details** từ danh sách để vào **Overview**, rồi chọn **Handling notes**. URL và nội dung cùng đổi. Truy cập trực tiếp hoặc tải lại vẫn ở mục đó.

![Nội dung nội tuyến dùng chung tiêu đề, tab và vùng chứa của trang chi tiết](/assets/core/developing-apps/page-layouts/inline-tabs.png)

[Xem trang chi tiết cha][detail] · [Xem mục nội tuyến][handling]. Xem [Trang, route và điều hướng](pages-routes-and-navigation.md) để đăng ký route con và chuyển hướng đến mục mặc định.

<a id="dialogs-drawers-and-covering-child-pages"></a>

### Hộp thoại, ngăn trượt và trang con phủ nội dung

Thành phần bố cục quyết định cách trang con hiển thị. Khai báo route con trong `routes.ts`, rồi đặt `Outlet` ngang cấp và ngay sau vùng chứa của cha:

```tsx
<>
  <ProductPageFrame {...frameProps}>{/* Product list */}</ProductPageFrame>
  <Outlet />
</>
```

Nhờ vậy, `RouteChildPage` phủ trang cha và tạm vô hiệu hóa điều khiển của cha trong khi danh sách vẫn nằm trong DOM. Trang con dùng chung `AppLayout` và `BrowserRouter` hiện có.

**Summary** mở hộp thoại thông tin sản phẩm rút gọn:

```tsx
import { RouteDialog } from '#components/route-dialog';

<RouteDialog
  title={t('layouts.summaryTitle')}
  description={t('layouts.readOnly')}
  className="sm:max-w-md"
  footer={<CloseProduct />}
>
  <ProductInfo />
</RouteDialog>
```

![Thông tin sản phẩm rút gọn trong hộp thoại của route](/assets/core/developing-apps/page-layouts/dialog.png)

Bấm tên sản phẩm để mở ngăn trượt chứa nội dung dài hơn:

```tsx
import { RouteDrawer } from '#components/route-drawer';

<RouteDrawer
  title={t('layouts.drawerTitle')}
  description={t('layouts.readOnly')}
  footer={<CloseProduct />}
>
  <ProductInfo extended />
</RouteDrawer>
```

![Nội dung ngăn trượt cuộn giữa tiêu đề và chân cố định](/assets/core/developing-apps/page-layouts/drawer.png)

Hộp thoại và ngăn trượt có khoảng đệm, thân cuộn và chân cố định riêng. Dùng bố cục có sẵn của chúng. Truyền nút trực tiếp vào `footer`. Thành phần đóng gọi `useRouteOverlay()` từ bên trong lớp phủ:

```tsx
import { useRouteOverlay } from '#components/use-route-overlay';
import { Button } from '#components/ui/button';
import { useTranslation } from '@nocobase/i18n/client';

function CloseProduct() {
  const { close } = useRouteOverlay();
  const { t } = useTranslation();
  return <Button onClick={() => void close()}>{t('layouts.done')}</Button>;
}
```

**Details** dùng `RouteChildPage` để phủ vùng nội dung ứng dụng, trong khi thanh bên và đầu trang vẫn dùng được. Trang có vùng chứa riêng:

```tsx
import { RouteChildPage } from '#components/route-child-page';

<RouteChildPage>
  <PageContainer>
    <BackButton>{t('layouts.back')}</BackButton>
    <PageHeader title={product?.name ?? t('layouts.missing')} />
    {/* Tab navigation and inline Outlet */}
  </PageContainer>
</RouteChildPage>
```

![Trang con phủ vùng nội dung và giữ điều hướng khả dụng](/assets/core/developing-apps/page-layouts/child-page.png)

Trang phủ cho phép tiếp tục dùng điều hướng bên ngoài và giữ nguyên khi nhấn Esc. Ví dụ dùng **Back to catalog** để quay lại. Nếu breadcrumb đã có đường quay lại phù hợp, dùng breadcrumb làm điểm quay lại.

[Xem hộp thoại][dialog] · [Xem ngăn trượt][drawer] · [Xem trang phủ][detail] · [Xem khai báo route][routes]

<a id="preserve-parent-state-and-scroll-position"></a>

### Giữ trạng thái và vị trí cuộn của trang cha

Khung mặc định tách vùng định vị khỏi vùng cuộn:

```tsx
// Main content structure from AppLayout.
<main className="app-brand-surface relative isolate min-w-0 flex-1 overflow-hidden">
  {/* Brand watermark */}
  <div className="h-full overflow-y-auto">
    <Outlet />
  </div>
</main>
```

`main` là vùng định vị của trang phủ. `div` bên trong cuộn nội dung trang theo chiều dọc. `RouteChildPage` cũng định vị phần tử ngoài và cuộn phần bên trong. Bề mặt trang phủ vì thế giữ vị trí khi danh sách cha cuộn và có chiều cao riêng.

Tìm `lamp`, cuộn xuống và mở **Summary** hoặc **Details**, rồi đóng hoặc quay lại. Trang cha vẫn được gắn, giữ bộ lọc và vị trí cuộn. Hộp thoại và ngăn trượt trả tiêu điểm về nút hoặc liên kết đã mở chúng. Tải lại toàn bộ trang sẽ tạo lại trạng thái trong bộ nhớ. Để lưu bộ lọc trong URL và xử lý chỉnh sửa, xem [Trang, route và điều hướng](pages-routes-and-navigation.md) và [Yêu cầu dữ liệu và trạng thái](data-requests-and-state.md).

[Xem khung ứng dụng][shell] · [Xem cách ghép trang cha và con][catalog]

<a id="sign-in-and-standalone-layouts"></a>

## Bố cục đăng nhập và trang độc lập

`AppRouter` chọn bố cục theo `auth`. Trang `required` dùng `AppLayout` sau khi xác thực và chuẩn bị phiên. Trang `guest` và `optional` dùng `StandalonePageLayout` theo quy tắc xác thực tương ứng.

**Catalog guide** là trang hướng dẫn tĩnh công khai, khai báo xác thực tùy chọn:

```tsx
{
  name: 'catalogGuide',
  path: '/catalog-guide',
  auth: 'optional',
  authz: 'skip',
  componentLoader: () => import('./guide.js'),
}
```

`PageContainer` dùng `className="mx-auto max-w-3xl pt-24"` để giới hạn chiều rộng và chừa chỗ cho điều khiển phía trên. Người đã đăng nhập và khách đều mở được hướng dẫn. **Open product catalog** đưa khách chưa xác thực đến trang đăng nhập.

![Hướng dẫn độc lập dùng lại vùng chứa trang và có bố cục riêng](/assets/core/developing-apps/page-layouts/standalone.png)

`auth` xác định điều kiện truy cập. Chuyển trang được bảo vệ thành công khai để bỏ thanh bên cũng mở quyền truy cập cho khách. Để dùng khung khác cho trang có xác thực, tùy chỉnh cách ghép route và giữ xác thực, chuẩn bị phiên cùng phân quyền. Nối khung mới vào logic ghép route của ứng dụng.

[Xem trang hướng dẫn][guide] · [Xem cách chọn bố cục][router] · [Xem khung độc lập][standalone]

<a id="check-the-layout"></a>

## Kiểm tra bố cục

Thử các thao tác sau trong ví dụ đang chạy:

- Bật tắt tiêu đề dài ở kích thước máy tính và ở 375px. Kiểm tra tiêu đề, thao tác, bộ lọc và bảng. Cuộn ngang chỉ xuất hiện trong bảng.
- Thu gọn điều hướng rồi tải lại. Mở điều hướng di động và kiểm tra các mục vẫn sử dụng được.
- Từ danh sách đã lọc và cuộn, mở từng kiểu trang con. Quay lại và kiểm tra trạng thái cùng tiêu điểm bàn phím.
- Cuộn nội dung dài của ngăn trượt trong khi vẫn truy cập được tiêu đề và **Done**. Cuộn trang phủ và kiểm tra điều hướng ứng dụng vẫn khả dụng.
- Mở trực tiếp URL trang con, tải lại rồi dùng nút Quay lại và Tiến của trình duyệt. Kiểm tra cách hiển thị và đích quay lại.
- Tìm tên không tồn tại hoặc thay ID sản phẩm trong URL chi tiết bằng `missing`, rồi kiểm tra thông báo trạng thái.
- Chuyển giữa tiếng Anh và tiếng Trung, chế độ sáng và tối. Kiểm tra xuống dòng, đường viền và điều khiển. Mở lại danh mục sau khi đăng xuất và xác nhận được chuyển đến trang đăng nhập.

<a id="example-source-and-setup"></a>

## Mã nguồn và thiết lập ví dụ

[Ứng dụng ví dụ đầy đủ][app] dùng Node.js 24 và pnpm 11. Sản phẩm là dữ liệu mẫu. Tài khoản, phiên và cài đặt của template vẫn cần cơ sở dữ liệu. Cấu hình SQLite dưới đây đã được kiểm chứng. Với cơ sở dữ liệu khác, cài driver và cấu hình kết nối theo [Tạo ứng dụng](../../getting-started/develop-your-first-app.md#create-and-start-the-application).

```bash
git clone https://github.com/nocobase/docs-examples-v3.git
cd docs-examples-v3
git checkout 929240c07561b2fa02afbe82a3a104a6f0a908b0
cd apps/page-layouts
pnpm install --frozen-lockfile
pnpm nocobase config init --dialect sqlite
pnpm nocobase config check
pnpm dev
```

Mở địa chỉ ứng dụng in khi khởi động, gồm cả đường dẫn cơ sở. Đăng ký tài khoản minh họa từ trang đăng nhập, đăng nhập rồi chọn **Product catalog**. Với tiền tố mặc định `/main/`, danh mục ở `/main/layouts` và hướng dẫn công khai ở `/main/catalog-guide`. Mọi người dùng đã đăng nhập đều xem được danh mục mẫu. Các mục quản trị vẫn dùng kiểm tra quyền thực của template.

[README][readme] chỉ vị trí mã và ảnh cho từng cách dùng, đồng thời cung cấp lệnh kiểm thử thành phần và trình duyệt. Kiểm thử trình duyệt tạo tài khoản riêng trong cơ sở dữ liệu cục bộ của ví dụ. Phạm vi minh họa tập trung vào bố cục, dùng dữ liệu sản phẩm cố định và quyền đăng nhập của template.

[app]: https://github.com/nocobase/docs-examples-v3/tree/929240c07561b2fa02afbe82a3a104a6f0a908b0/apps/page-layouts
[readme]: https://github.com/nocobase/docs-examples-v3/blob/929240c07561b2fa02afbe82a3a104a6f0a908b0/apps/page-layouts/README.MD
[catalog]: https://github.com/nocobase/docs-examples-v3/blob/929240c07561b2fa02afbe82a3a104a6f0a908b0/apps/page-layouts/client/pages/layouts/index.tsx
[frame]: https://github.com/nocobase/docs-examples-v3/blob/929240c07561b2fa02afbe82a3a104a6f0a908b0/apps/page-layouts/client/pages/layouts/product-page-frame.tsx
[brand]: https://github.com/nocobase/docs-examples-v3/blob/929240c07561b2fa02afbe82a3a104a6f0a908b0/apps/page-layouts/client/layouts/components/app-brand.tsx
[header]: https://github.com/nocobase/docs-examples-v3/blob/929240c07561b2fa02afbe82a3a104a6f0a908b0/apps/page-layouts/client/layouts/components/header-actions.tsx
[shell]: https://github.com/nocobase/docs-examples-v3/blob/929240c07561b2fa02afbe82a3a104a6f0a908b0/apps/page-layouts/client/layouts/app-layout.tsx
[sidebar]: https://github.com/nocobase/docs-examples-v3/blob/929240c07561b2fa02afbe82a3a104a6f0a908b0/apps/page-layouts/client/layouts/components/app-sidebar.tsx
[detail]: https://github.com/nocobase/docs-examples-v3/blob/929240c07561b2fa02afbe82a3a104a6f0a908b0/apps/page-layouts/client/pages/layouts/detail.tsx
[handling]: https://github.com/nocobase/docs-examples-v3/blob/929240c07561b2fa02afbe82a3a104a6f0a908b0/apps/page-layouts/client/pages/layouts/handling.tsx
[dialog]: https://github.com/nocobase/docs-examples-v3/blob/929240c07561b2fa02afbe82a3a104a6f0a908b0/apps/page-layouts/client/pages/layouts/summary.tsx
[drawer]: https://github.com/nocobase/docs-examples-v3/blob/929240c07561b2fa02afbe82a3a104a6f0a908b0/apps/page-layouts/client/pages/layouts/drawer.tsx
[routes]: https://github.com/nocobase/docs-examples-v3/blob/929240c07561b2fa02afbe82a3a104a6f0a908b0/apps/page-layouts/client/pages/layouts/routes.ts
[guide]: https://github.com/nocobase/docs-examples-v3/blob/929240c07561b2fa02afbe82a3a104a6f0a908b0/apps/page-layouts/client/pages/layouts/guide.tsx
[router]: https://github.com/nocobase/docs-examples-v3/blob/929240c07561b2fa02afbe82a3a104a6f0a908b0/apps/page-layouts/client/routing/app-router.tsx
[standalone]: https://github.com/nocobase/docs-examples-v3/blob/929240c07561b2fa02afbe82a3a104a6f0a908b0/apps/page-layouts/client/routing/standalone-page-layout.tsx
