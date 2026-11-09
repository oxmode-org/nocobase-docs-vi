---
title: Trang, route và điều hướng
description: Đăng ký trang, dùng tham số, ngăn trượt, hộp thoại, tab, menu, breadcrumb, quyền truy cập và ghi đè thành phần.
---

Dùng `defineAppRoutes()` để khai báo địa chỉ, thành phần, điều hướng và quy tắc truy cập. Xem [Môi trường và khởi động](#environment-and-startup) để chạy [ứng dụng ví dụ][app] và chuẩn bị tài khoản.

<a id="register-pages"></a>

## Đăng ký trang

<a id="declare-routes-and-connect-them-to-the-runtime"></a>

### Khai báo route và kết nối với môi trường chạy

Khai báo trang trong [client/pages/projects/routes.ts][routes] rồi tập hợp cho môi trường chạy trong [client/routes.ts][collection]. Đoạn sau chỉ giữ khai báo danh sách dự án. Xem mã đầy đủ để tra nhóm ngoài và route con:

```ts
// client/pages/projects/routes.ts (excerpt: outer group and child routes omitted)
import { FolderKanban } from 'lucide-react';
import { defineAppRoutes } from '@nocobase/app-client/plugins';

export const projectRoutes = defineAppRoutes([
  {
    name: 'projects',
    path: '/projects',
    auth: 'required',
    authz: { resource: { type: 'page', id: 'projects' }, action: 'access' },
    navigation: { title: 'demo.projects', icon: FolderKanban },
    componentLoader: () => import('./index.js'),
  },
]);
```

```ts
// client/routes.ts
import { projectRoutes, appendedRoutes } from './pages/projects/routes.js';
// Retain the template appRoutes and systemSettingsRoutes.
export default [appRoutes, appendedRoutes, projectRoutes, systemSettingsRoutes];
```

`defineAppRoutes()` nhận mảng khai báo chỉ đọc và trả đối tượng đóng góp bất biến `{ parent: 'app', routes: [...] }`. Thành phần được nạp khi cần. Trường `routes` của môi trường chạy nhận một đóng góp hoặc một mảng phẳng các đóng góp. Template đã import tệp trong `client/runtime.ts`. Để đăng ký, nối tệp vào điểm vào đó. Giữ nguyên đối tượng trả về và truyền mảng đóng góp trực tiếp cho runtime.

Mở **Project list** từ trang chủ ví dụ để xem trang và mục điều hướng. `authz` yêu cầu quyền truy cập dự án, quyền mà quản trị viên ví dụ đã có.

![Trang dự án tĩnh với export mặc định và mục điều hướng](/assets/core/developing-apps/pages-routes-and-navigation/projects.png)

[Xem mã nguồn][routes]

<a id="load-page-components"></a>

### Nạp thành phần trang

`componentLoader` phải trả `Promise<{ default: Component }>`. Danh sách dùng `import('./index.js')` để nạp export mặc định từ [index.tsx][list]. Trang dùng lại `PageContainer`, `PageHeader` và `DataTable` của template.

Mô-đun cũng có thể export theo tên. Route độc lập lấy `ProjectPage` từ [workspace.tsx][workspace] rồi chuyển sang cấu trúc cần thiết:

```ts
// client/pages/projects/routes.ts
componentLoader: () =>
  import('./workspace.js').then((module) => ({ default: module.ProjectPage })),
```

Chọn **Open as a full page** trong ngăn dự án để mở tại `/project-pages/p100`.

Loader chỉ nạp thành phần. Đọc tham số trong thành phần và thực hiện lấy dữ liệu theo [Yêu cầu dữ liệu và quản lý trạng thái](data-requests-and-state.md). Trả về thành phần theo cấu trúc trên, tránh trả JSX đã tạo.

![Trang độc lập nạp thành phần từ export theo tên](/assets/core/developing-apps/pages-routes-and-navigation/standalone.png)

[Xem mã nguồn][workspace]

<a id="path-parameters-and-page-navigation"></a>

## Tham số đường dẫn và điều hướng trang

<a id="static-paths-and-dynamic-parameters"></a>

### Đường dẫn tĩnh và tham số động

`path` tương đối với ứng dụng. Với tiền tố triển khai mặc định `/main`, trình duyệt hiển thị `/main/projects` cho khai báo `/projects`. Để runtime thêm tiền tố triển khai.

[Route ví dụ][routes] dùng cả đường dẫn tĩnh và tham số động:

| Đường dẫn ứng dụng | Công dụng |
| --- | --- |
| `/projects` | Danh sách dự án |
| `/projects/new` | Biểu mẫu nháp. Đoạn tĩnh `new` được ưu tiên trước `:projectId` |
| `/projects/:projectId` | Mở chi tiết theo ID dự án |
| `/projects/:projectId/tasks/:taskId` | Xác định cả dự án và nhiệm vụ |

[detail.tsx][detail] dùng [`useParams()` của React Router](https://reactrouter.com/api/hooks/useParams) để đọc tham số và tìm bản ghi mẫu:

```tsx
import { useParams } from 'react-router';
import { projects } from './data.js';

// Inside the ProjectDetail component
const { projectId } = useParams();
const project = projects.find((item) => item.id === projectId);
```

Tham số là chuỗi và trang con đọc được tham số cha. `/projects/p100` mở Harbor launch, còn `/projects/missing` hiển thị thông báo thiếu bản ghi. Template khớp route, còn trang thực hiện tra cứu và xử lý bản ghi thiếu.

![Dự án không tồn tại hiển thị thông báo thiếu bản ghi](/assets/core/developing-apps/pages-routes-and-navigation/missing.png)

[Xem mã nguồn][detail]

<a id="query-parameters-and-navigation"></a>

### Tham số truy vấn và điều hướng

Nhập `Harbor` vào **Search projects**. Địa chỉ thành `/projects?q=Harbor`. Chọn **Harbor launch** để mở `/projects/p100?q=Harbor`. [index.tsx][list] cập nhật truy vấn bằng [`useSearchParams()`](https://reactrouter.com/api/hooks/useSearchParams) của React Router. Đoạn trích tập trung vào truy vấn:

```tsx
// client/pages/projects/index.tsx
const location = useLocation();
const [search, setSearch] = useSearchParams();
const query = search.get('q') ?? '';

<Input
  value={query}
  onChange={(event) => {
    const next = new URLSearchParams(search);
    if (event.target.value) next.set('q', event.target.value);
    else next.delete('q');
    setSearch(next, { replace: true });
  }}
/>

// Inside the DataTable name cell
<RecordLink to={{ pathname: row.original.id, search: location.search }}>
  {row.original.name}
</RecordLink>
```

`RecordLink` bọc [`Link`](https://reactrouter.com/api/components/Link) của React Router. Đường dẫn tương đối `p100` nối vào đường dẫn danh sách. Truyền truy vấn tường minh để giữ khi chuyển vào trang con. Danh sách lọc dữ liệu mẫu theo `q`. `setSearch(next, { replace: true })` thay mục lịch sử hiện tại khi sửa truy vấn.

![Tham số q lọc danh sách và đi cùng liên kết chi tiết](/assets/core/developing-apps/pages-routes-and-navigation/filtered.png)

[Xem mã nguồn][list]

<a id="nested-routes-and-page-presentation"></a>

## Route lồng nhau và cách hiển thị trang

<a id="standalone-pages-and-child-routes"></a>

### Trang độc lập và route con

| Khai báo | Địa chỉ ví dụ | Vị trí nội dung |
| --- | --- | --- |
| Ngang cấp danh sách | `/project-pages/p100` | Trang độc lập bên ngoài outlet danh sách |
| Trong `children` của danh sách | `/projects/p100` | `Outlet` của danh sách |

Trang độc lập trong [routes.ts][routes] ngang cấp với danh sách và dùng lại `ProjectPage`:

```ts
// A sibling route of projects
{
  name: 'projectStandalone',
  path: '/project-pages/:projectId',
  authz: { resource: { type: 'page', id: 'projects' }, action: 'access' },
  breadcrumb: { title: 'demo.projectPage' },
  componentLoader: () =>
    import('./workspace.js').then((module) => ({ default: module.ProjectPage })),
}
```

Xem ảnh ở [Nạp thành phần trang](#load-page-components). Chọn **Open as a full page** để mở trang này. Để hiển thị chi tiết bên trong danh sách, khai báo cây qua `children`:

```ts
// Children of the projects page (excerpt)
children: [
  {
    name: 'projectDetail',
    path: ':projectId',
    componentLoader: () => import('./detail.js'),
    children: [
      {
        name: 'projectTask',
        path: 'tasks/:taskId',
        componentLoader: () => import('./task.js'),
      },
    ],
  },
],
```

Cha phải render [`Outlet`](https://reactrouter.com/api/components/Outlet) của React Router. Danh sách còn truyền truy vấn qua `context` để chi tiết đọc bằng `useOutletContext()`:

```tsx
// client/pages/projects/index.tsx
const context = useMemo(() => ({ listSearch: location.search }), [location.search]);

<Outlet context={context} />
```

`children` xác định cây, còn `Outlet` đặt vị trí render. Thành phần trang quyết định hiển thị nội tuyến, phủ cha, mở ngăn trượt hoặc hộp thoại.

[Xem mã nguồn][routes]

<a id="embedded-child-pages-and-default-tabs"></a>

### Trang con nội tuyến và tab mặc định

Mở **Project reports**. `/reports` chuyển sang `/reports/summary`. **Owners** chuyển sang `/reports/owners`. [reports/index.tsx][reports] chỉ chuyển hướng khi địa chỉ khớp chính xác với cha:

```tsx
// client/pages/reports/index.tsx (excerpt)
const location = useLocation();
const parent = useResolvedPath('.');
if (matchPath({ path: parent.pathname, end: true }, location.pathname)) {
  return <Navigate replace to={{ pathname: 'summary', search: location.search }} />;
}

// These elements go in the navigation and content returned by the component.
<NavLink to={{ pathname: 'owners', search: location.search }}>
  {t('demo.owners')}
</NavLink>
<Outlet />
```

`Navigate replace` thay mục cha trong lịch sử. `end: true` giữ tab Owners khi mở trực tiếp. `NavLink` đánh dấu tab đang mở và `Outlet` render nội dung. Cả hai trang con kế thừa quyền của trang báo cáo.

![Địa chỉ cha mở Summary mặc định](/assets/core/developing-apps/pages-routes-and-navigation/summary.png)
![Mở trực tiếp Owners giữ tab và điều hướng của cha](/assets/core/developing-apps/pages-routes-and-navigation/owners.png)

[Xem mã nguồn][reports]

<a id="child-pages-that-cover-parent-content"></a>

### Trang con phủ nội dung cha

Chọn **Open workspace** để mở `/projects/workspace/p100?q=Harbor`. [workspace.tsx][workspace] dùng `RouteChildPage` để phủ nội dung cha và giữ điều hướng ứng dụng:

```tsx
// Another child of the projects page
{
  name: 'projectWorkspace',
  path: 'workspace/:projectId',
  breadcrumb: { title: 'demo.workspace' },
  componentLoader: () => import('./workspace.js'),
}

// client/pages/projects/workspace.tsx
export default function ProjectWorkspace() {
  return <RouteChildPage><ProjectPage /></RouteChildPage>;
}
```

Workspace vẫn render qua outlet của danh sách. Tiêu đề và breadcrumb dùng tên dự án. Xem [Breadcrumb tĩnh và động](#static-and-dynamic-breadcrumbs).

![RouteChildPage phủ danh sách và giữ điều hướng](/assets/core/developing-apps/pages-routes-and-navigation/workspace.png)

[Xem mã nguồn][workspace]

<a id="route-drawers-and-nested-dialogs"></a>

### Ngăn trượt theo route và hộp thoại lồng nhau

[detail.tsx][detail] dùng `RouteDrawer` để hiển thị dự án. Đoạn trích tập trung vào ngăn trượt:

```tsx
// client/pages/projects/detail.tsx (excerpt)
const { projectId } = useParams();
const { listSearch } = useOutletContext<{ listSearch: string }>();

<RouteDrawer title={project.name} footer={<CloseButton />}>
  <RecordLink to={{ pathname: `tasks/${task.id}`, search: listSearch }}>
    {task.name}
  </RecordLink>
  <Outlet />
</RouteDrawer>
```

Chọn dự án để mở ngăn trên danh sách đã lọc. Mở trực tiếp hoặc tải lại `/projects/p100?q=Harbor` khôi phục trạng thái này.

![Ngăn chi tiết giữ danh sách đã lọc ở phía sau](/assets/core/developing-apps/pages-routes-and-navigation/drawer.png)

Chọn **Prepare launch checklist** để mở `/projects/p100/tasks/t200?q=Harbor`. [task.tsx][task] đọc tham số của nó và của cha rồi render `RouteDialog`:

```tsx
// client/pages/projects/task.tsx (excerpt)
const { projectId, taskId } = useParams();

<RouteDialog title={task.name} footer={<CloseTask />}>
  <p>{t('demo.taskPath', { projectId, taskId })}</p>
</RouteDialog>
```

Giữ `Outlet` thứ hai trong ngăn chi tiết để render hộp thoại nhiệm vụ. **Back to project** chỉ đóng hộp thoại trong. Đóng ngăn sau đó sẽ về danh sách.

![Hộp thoại nhiệm vụ trên ngăn dự án đọc cả hai tham số](/assets/core/developing-apps/pages-routes-and-navigation/task.png)

[Xem chi tiết][detail] · [Xem nhiệm vụ][task]

<a id="return-navigation-and-leave-confirmation"></a>

## Điều hướng quay lại và xác nhận khi rời trang

<a id="return-to-the-parent-and-preserve-query-parameters"></a>

### Về trang cha và giữ tham số truy vấn

Từ `/projects?q=Harbor`, **New draft** mở `/projects/new?q=Harbor`. Nhập tên, chọn **Preview draft** rồi **Finish preview** để về danh sách và giữ tìm kiếm. Luồng này chỉ xem trước bản nháp.

![Route con tĩnh new mở biểu mẫu nháp](/assets/core/developing-apps/pages-routes-and-navigation/draft.png)
![Xem trước nháp với thao tác đóng hộp thoại](/assets/core/developing-apps/pages-routes-and-navigation/draft-preview.png)

[Biểu mẫu đầy đủ][draft] lấy `close()` từ `useRouteOverlay()` bên trong thành phần được render trong hộp thoại:

```tsx
// Call this inside a button component rendered within RouteDialog.
const { close } = useRouteOverlay();

<Button onClick={() => {
  onFinish(); // Clear the draft dirty flag in this example.
  void close();
}}>
  {t('demo.finishPreview')}
</Button>
```

`close()` về route cha đã khớp và giữ truy vấn. Biểu tượng đóng, Escape và nền phía sau dùng cùng luồng. Với điều hướng bằng mã thông thường, xem [`useNavigate()` của React Router](https://reactrouter.com/api/hooks/useNavigate).

[Xem mã nguồn][draft]

<a id="confirm-before-leaving-unsaved-changes"></a>

### Xác nhận trước khi bỏ thay đổi chưa lưu

Sau khi nhập tên, chọn Close. **Discard this unsaved draft?** cho phép tiếp tục sửa hoặc bỏ bản nháp và về danh sách:

```tsx
// client/pages/projects/new.tsx (excerpt)
const dirtyRef = useRef(false);
const pendingDecisionRef = useRef<{
  promise: Promise<boolean>;
  resolve: (allowed: boolean) => void;
} | null>(null);
const [confirmOpen, setConfirmOpen] = useState(false);

const canLeave = useCallback((): boolean | Promise<boolean> => {
  if (!dirtyRef.current) return true;
  if (!pendingDecisionRef.current) {
    let resolve!: (allowed: boolean) => void;
    const promise = new Promise<boolean>((done) => { resolve = done; });
    pendingDecisionRef.current = { promise, resolve };
    setConfirmOpen(true);
  }
  return pendingDecisionRef.current.promise;
}, []);

useNavigationGuard(canLeave);
// RouteDialog also receives canLeave as beforeClose.
// AlertDialog buttons call decide(false) or decide(true).
const decide = (allowed: boolean) => {
  setConfirmOpen(false);
  if (allowed) dirtyRef.current = false;
  pendingDecisionRef.current?.resolve(allowed);
  pendingDecisionRef.current = null;
};
useEffect(() => () => pendingDecisionRef.current?.resolve(false), []);
```

Truyền cùng quyết định bất đồng bộ vào `RouteDialog.beforeClose` và `useNavigationGuard()` để xử lý đóng lớp phủ và điều hướng, kể cả lịch sử trình duyệt. Template đặt `NavigationGuardProvider` ngoài các route. `false` chặn rời trang, `true` cho phép và Promise chờ lựa chọn.

Khi xác nhận đang mở, các yêu cầu chồng lấn dùng chung Promise để một lựa chọn giải quyết tất cả. Khi gỡ thành phần, giải quyết yêu cầu còn chờ bằng `false`. Xóa cờ thay đổi chưa lưu khi cho phép rời để tránh xác nhận lần hai trong lúc điều hướng.

Triển khai đầy đủ còn xử lý `beforeunload` khi tải lại hoặc rời website. Trình duyệt cung cấp nội dung xác nhận gốc cho trường hợp này.

![Bộ chặn điều hướng bất đồng bộ chờ quyết định bỏ bản nháp](/assets/core/developing-apps/pages-routes-and-navigation/guard.png)

[Xem mã nguồn][draft]

<a id="navigation-menus-and-breadcrumbs"></a>

## Menu điều hướng và breadcrumb

<a id="menu-configuration-groups-and-selection"></a>

### Cấu hình menu, nhóm và mục đang chọn

`navigation` tạo mục menu. Nhóm **Projects** không có đường dẫn và tổ chức danh sách:

```ts
{
  name: 'business',
  navigation: { title: 'demo.business', order: 10 },
  children: [
    // Place the projects page declaration here.
  ],
}
```

Reports dùng nhóm **Insights** với tiền tố `/reports`. Nhóm tổ chức con trực tiếp, không cần thành phần hay `Outlet` riêng:

```ts
{
  name: 'reportsGroup',
  path: '/reports',
  navigation: { title: 'demo.insights', order: 20 },
  children: [
    {
      name: 'reports',
      path: '/',
      authz: 'skip',
      navigation: { title: 'demo.reports', icon: ChartColumn },
      componentLoader: () => import('../reports/index.js'),
      children: [
        { name: 'reportSummary', path: 'summary',
          componentLoader: () => import('../reports/summary.js') },
        { name: 'reportOwners', path: 'owners',
          componentLoader: () => import('../reports/owners.js') },
      ],
    },
  ],
}
```

`path: '/'` của con dùng địa chỉ nhóm `/reports`. Địa chỉ trang thuộc về con. Chỉ khai báo `navigation` cho mục cần xuất hiện trong menu. Trang chi tiết và nhiệm vụ mở từ liên kết bản ghi.

`title` là văn bản hoặc khóa dịch. `icon` là thành phần React như biểu tượng Lucide. `order` là số hữu hạn, mặc định `0`, và sắp xếp mục ngang cấp tăng dần. Tiêu đề nhóm hiển thị dạng chữ. Khi mở nhiệm vụ con, Project list vẫn được chọn. Phân quyền ẩn trang không truy cập được và nhóm rỗng.

![Nhóm không có đường dẫn và nhóm có tiền tố, với các trang dưới Insights](/assets/core/developing-apps/pages-routes-and-navigation/navigation.png)

[Xem mã nguồn][routes]

<a id="static-and-dynamic-breadcrumbs"></a>

### Breadcrumb tĩnh và động

`breadcrumb` và `usePageBreadcrumb()` nối metadata route và nội dung trang với breadcrumb của template.

`breadcrumb: { title: 'demo.workspace' }` cung cấp tiêu đề tĩnh. Khi đã có dự án, `usePageBreadcrumb()` thay bằng tên dự án:

```tsx
// client/pages/projects/workspace.tsx (excerpt)
usePageBreadcrumb(
  project
    ? [
        {
          label: t('demo.projects'),
          to: { pathname: '/projects', search: location.search },
        },
        { label: project.name },
      ]
    : undefined,
);
```

`label` là văn bản hiển thị và `to` là đích tùy chọn. Mục cuối hiển thị dạng chữ. Truyền `undefined` hoặc `null` để dùng breadcrumb mặc định của route. Khai báo sâu nhất đang hoạt động được ưu tiên. Khi gỡ nó, khai báo ngoài được khôi phục.

Ảnh ở [Trang con phủ nội dung cha](#child-pages-that-cover-parent-content) hiện **Project list → Harbor launch**. Bấm **Project list** để về với `q=Harbor`. Template nhớ truy vấn của các trang tổ tiên đã ghé trong cây hiện tại. Mở liên kết sâu hoặc tải lại có thể thiếu lịch sử này. Khai báo `to` tường minh nếu cần giữ truy vấn cả khi đó.

[Xem mã nguồn][workspace]

<a id="authentication-and-page-permissions"></a>

## Xác thực và quyền vào trang

<a id="sign-in-requirements-and-page-layouts"></a>

### Yêu cầu đăng nhập và bố cục trang

[Khai báo route][routes] minh họa ba giá trị `auth` trong các cây riêng:

```ts
// Three independent routes, not a parent/child tree.
{ name: 'projects', path: '/projects', auth: 'required', /* ... */ }
{ name: 'welcome', path: '/welcome', auth: 'guest', authz: 'skip', /* ... */ }
{ name: 'publicProjects', path: '/public-projects', auth: 'optional', authz: 'skip', /* ... */ }
```

| Giá trị | Thao tác | Hành vi template mặc định |
| --- | --- | --- |
| `required` | Mở `/projects` khi đã đăng xuất | Chuyển sang `/login`. Sau đăng nhập, trang dùng bố cục ứng dụng có thanh bên |
| `guest` | Mở `/welcome` khi đã đăng xuất | Hiện trang chào khách. Người đã đăng nhập được chuyển đi |
| `optional` | Mở `/public-projects` khi đã hoặc chưa đăng nhập | Cả hai đều dùng bố cục độc lập |

![Route bắt buộc đăng nhập chuyển khách tới trang đăng nhập](/assets/core/developing-apps/pages-routes-and-navigation/login.png)
![Route khách hiện trang chào trước khi đăng nhập](/assets/core/developing-apps/pages-routes-and-navigation/guest.png)
![Route tùy chọn mở cho khách và dùng bố cục độc lập](/assets/core/developing-apps/pages-routes-and-navigation/public.png)

Route gốc mặc định `required`. Các cấp dưới kế thừa cùng `auth`. Sau xác thực vẫn cần kiểm tra quyền trang.

Template hiện tại đưa khách tới `/login` và không tự mang theo đích ban đầu. Khi người đã đăng nhập mở trang guest, template dùng truy vấn `redirect` an toàn trong ứng dụng hoặc đưa về trang chủ. Ví dụ `/welcome?redirect=%2Freports%2Fowners` đưa họ tới Owners. Kiểm tra luồng quay về nếu cần hỗ trợ liên kết sâu.

[Xem mã nguồn][routes]

<a id="permission-declarations-inheritance-and-denied-access"></a>

### Khai báo quyền, kế thừa và từ chối truy cập

[Route đầy đủ][routes] dùng các khai báo phân quyền sau:

```ts
// Project list and children without their own authorization declaration
 authz: { resource: { type: 'page', id: 'projects' }, action: 'access' }
// The draft page requires another page grant
 authz: { resource: { type: 'page', id: 'project-drafts' }, action: 'access' }
// Reports skip their own page authorization check but still require sign-in
 authz: 'skip'
// Administrator notes require an unrestricted identity
 authz: 'unrestricted'
```

Trong **System settings → Permission management → Roles and permissions**, tạo vai trò `Project viewer` chỉ cấp quyền vào trang dự án. Tạo người dùng mẫu trong **Users** rồi gán vai trò. Đăng nhập bằng phiên trình duyệt khác và kiểm tra theo [README][readme]:

- Mở được danh sách, chi tiết, nhiệm vụ và workspace. Trang con bỏ qua `authz` sẽ kế thừa giá trị hiệu lực của trang tổ tiên gần nhất.
- **New draft** bị ẩn và `/projects/new` bị từ chối. Trang con có quyền riêng vẫn phải qua kiểm tra của cha.
- Báo cáo truy cập được qua `skip` sau khi đăng nhập.
- Menu quản trị bị ẩn và `/admin-notes/child` bị từ chối. Yêu cầu `unrestricted` của cha vẫn áp dụng khi con khai báo `skip`.

![Người xem dự án dùng được danh sách với các thao tác theo quyền](/assets/core/developing-apps/pages-routes-and-navigation/viewer.png)
![Quyền dự án chưa đủ để mở bản nháp mới](/assets/core/developing-apps/pages-routes-and-navigation/draft-denied.png)
![Route con skip vẫn phải qua kiểm tra unrestricted của cha](/assets/core/developing-apps/pages-routes-and-navigation/admin-denied.png)

Quản trị viên có thể mở **Administrator notes → Open child page**. `unrestricted` yêu cầu danh tính có quyền không giới hạn.

![Tài khoản không bị giới hạn mở được trang quản trị cha và con](/assets/core/developing-apps/pages-routes-and-navigation/admin.png)

Khi thiếu trang tổ tiên để kế thừa, `authz` mặc định là `unrestricted` với `required` hoặc `skip` với `guest` và `optional`. Khai báo tường minh trên trang đầu mỗi cây. Chỉ trang có thể khai báo `authz`.

`resource.type`, `resource.id` và `action` phải là chuỗi không rỗng. Quyền vai trò đã lưu tham chiếu ID tài nguyên, độc lập với tên route. Trang thiếu tiêu đề điều hướng hoặc breadcrumb cần tên dễ đọc trong [page-permission-titles.ts][permission-titles], như `projectCreate: 'demo.newDraft'`. `useCan()` điều khiển nút theo cùng quyền. Bảo vệ API và dữ liệu tại máy chủ. Dữ liệu dự án trong ví dụ là dữ liệu giả công khai. Xem [Xác thực, quyền và phạm vi dữ liệu](authentication-and-permissions.md).

[Xem mã nguồn][routes]

<a id="route-composition-attachment-and-overrides"></a>

## Ghép route, gắn vào nhóm và ghi đè

<a id="attach-within-and-across-packages"></a>

### Gắn trong cùng package và xuyên package

Mở **Export instructions** dưới **Insights** tại `/reports/exports`. Một đóng góp riêng gắn nó qua `parent: 'reportsGroup'`:

```ts
export const appendedRoutes = defineAppRoutes([
  {
    parent: 'reportsGroup',
    name: 'reportExports',
    path: 'exports',
    authz: 'skip',
    navigation: { title: 'demo.exports', order: 10 },
    componentLoader: () => import('../examples/exports.js'),
  },
]);
```

[client/routes.ts][collection] cố ý đặt `appendedRoutes` trước `projectRoutes` để minh họa đích có thể khai báo sau. Trong ứng dụng lớn, tách các đóng góp thành tệp rồi tập hợp thành mảng phẳng.

![Đóng góp riêng trong cùng package xuất hiện dưới Insights](/assets/core/developing-apps/pages-routes-and-navigation/exports.png)

[reporting-plugin.ts][plugin] là hàm tạo đóng góp client trong ứng dụng. `@example/project-reporting` minh họa namespace plugin ngay trong mã ví dụ. Dùng `package:group` để gắn xuyên package:

```ts
// client/reporting-plugin.ts
{
  parent: 'pages-routes-navigation:reportsGroup',
  name: 'snapshot',
  path: 'snapshot',
  authz: 'skip',
  navigation: { title: 'demo.snapshot', order: 20 },
  componentLoader: () => import('./pages/examples/plugin-original.js'),
}
```

Gắn vào `reportsGroup` của ứng dụng tạo `/reports/snapshot`. Route và namespace dịch vẫn thuộc plugin, vốn đăng ký cả hai locale. Cấu hình mẫu bật [ghi đè thành phần](#replace-page-components). Tạm đặt mảng trong `client/route-overrides.ts` thành rỗng để xem trang gốc, rồi khôi phục.

![Đóng góp báo cáo gốc khi tạm tắt ghi đè thành phần](/assets/core/developing-apps/pages-routes-and-navigation/plugin-original.png)

Chỉ mục gốc của đóng góp được khai báo `parent` và phải trỏ đến nhóm. Đích thiếu, vòng tham chiếu và `parent` bên trong `children` đều bị từ chối. Thêm trang con qua `children`. Các mục ngang cấp sắp theo `navigation.order`. Khi bằng nhau, con hiện có đứng trước, rồi đến các đóng góp theo thứ tự đăng ký.

[Xem route ứng dụng][routes] · [Xem đóng góp plugin][plugin]

<a id="enable-routes-through-plugin-options"></a>

### Bật route qua tùy chọn plugin

`routes` của plugin có thể là hàm đồng bộ nhận tùy chọn đăng ký. [reporting-plugin.ts][plugin] dùng `enabled` để quyết định có đóng góp trang:

```ts
// client/reporting-plugin.ts (excerpt)
export default defineClientPlugin<{ enabled?: boolean }>({
  packageName: '@example/project-reporting',
  // The complete file also registers en-US and zh-CN locales.
  routes: (options) => defineAppRoutes(options.enabled === false ? [] : [
    {
      parent: 'pages-routes-navigation:reportsGroup',
      name: 'snapshot',
      path: 'snapshot',
      authz: 'skip',
      navigation: { title: 'demo.snapshot', order: 20 },
      componentLoader: () => import('./pages/examples/plugin-original.js'),
    },
  ]),
});

// Inside the defineClientPlugins array in client/plugins.ts
reportingPlugin({ enabled: true }),
```

`routes(options)` chạy đồng bộ khi đăng ký và trả một đóng góp hoặc mảng phẳng. Thay đổi trạng thái React hoặc người dùng không chạy lại hàm. Để thử tắt đóng góp, đặt `enabled: false` và đặt mảng [ghi đè thành phần](#replace-page-components) thành `[]` vì route đích đã vắng. Khôi phục cả hai sau đó. Một bài kiểm thử cô lập cũng bao phủ tùy chọn này.

![Tắt đóng góp báo cáo sẽ bỏ Reporting snapshot khỏi Insights](/assets/core/developing-apps/pages-routes-and-navigation/plugin-disabled.png)

[Xem mã nguồn][plugin]

<a id="replace-page-components"></a>

### Thay thành phần trang

Ví dụ mặc định hiển thị **Reporting snapshot** tùy chỉnh. Dùng ID `package:route` để thay thành phần:

```ts
// client/route-overrides.ts
import { defineClientRouteComponentOverrides } from '@nocobase/app-client/plugins';

export default defineClientRouteComponentOverrides([
  {
    routeId: '@example/project-reporting:snapshot',
    componentEntry: './client/pages/examples/plugin-custom',
    componentLoader: () => import('./pages/examples/plugin-custom.js'),
  },
]);

// client/runtime.ts (excerpt)
import routeComponentOverrides from './route-overrides.js';
const appRuntime = defineAppRuntime({
  // Retain createAppConfig, locales, routes, plugins and other existing options.
  routeComponentOverrides,
});
```

Truyền `route-overrides.ts` tường minh vào `defineAppRuntime()`. Ghi đè giữ đường dẫn, quyền, điều hướng, package sở hữu và trang con. Thành phần chạy trong namespace dịch của package gốc. `componentEntry` ghi điểm vào nguồn và `componentLoader` nạp thành phần.

![Thành phần báo cáo tùy chỉnh giữ URL và mục menu gốc](/assets/core/developing-apps/pages-routes-and-navigation/plugin-custom.png)

Tạm dùng mảng rỗng để xem thành phần gốc rồi khôi phục. Đích phải là trang đã đăng ký. Mỗi ID chỉ được ghi đè một lần. Dùng cơ chế ghi đè để giữ một đăng ký cho mỗi đường dẫn.

[Xem cấu hình ghi đè][overrides] · [Xem đăng ký runtime][runtime]

<a id="loading-states-and-error-handling"></a>

## Trạng thái tải và xử lý lỗi

<a id="page-loading-and-failures"></a>

### Tải trang và lỗi

**Try a slow page** mở `/route-status/loading`. [Loader minh họa][routes] chờ 1,2 giây để thấy trạng thái tải của template:

```ts
{
  name: 'slowPage',
  path: '/route-status/loading',
  authz: 'skip',
  componentLoader: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return import('../examples/loaded.js');
  },
}
```

![Trạng thái đang nạp thành phần route](/assets/core/developing-apps/pages-routes-and-navigation/loading.png)
![Nội dung sau khi thành phần đã nạp](/assets/core/developing-apps/pages-routes-and-navigation/loaded.png)

**Try a page error** mở `/route-status/error`. Thành phần cố ý ném lỗi để minh họa giao diện của [ClientRoute][client-route]. Giữ ngoại lệ minh họa trong môi trường thử. Sau khi sửa lỗi thành phần hoặc mạng, tải lại. Promise loader bị từ chối cũng đi tới giao diện lỗi này.

![Ngoại lệ thành phần hiển thị lỗi và thao tác thử lại](/assets/core/developing-apps/pages-routes-and-navigation/error.png)

[Xem loader][routes] · [Xem xử lý lỗi của template][client-route]

<a id="handle-unmatched-addresses"></a>

### Xử lý địa chỉ không khớp

**Try an unknown address** mở `/unknown-example`. [app-router.tsx][app-router] hiện chuyển địa chỉ này về trang chủ. Cấu hình fallback thuộc template ứng dụng. `defineAppRoutes()` chỉ nhận mẫu đường dẫn được hỗ trợ bên dưới.

![Template chuyển địa chỉ lạ về trang chủ ví dụ](/assets/core/developing-apps/pages-routes-and-navigation/unknown.png)

[Xem mã nguồn][app-router]

<a id="route-configuration-reference"></a>

## Tham chiếu cấu hình route

<a id="configuration-fields-and-defaults"></a>

### Trường và giá trị mặc định

| Trường | Trang | Nhóm thuần |
| --- | --- | --- |
| `name` | Bắt buộc, duy nhất trong package | Bắt buộc, duy nhất trong package |
| `path` | Bắt buộc | Tiền tố tùy chọn cho con |
| `componentLoader` | Bắt buộc | Không được khai báo |
| `children` | Tùy chọn | Bắt buộc, có thể rỗng |
| `navigation` | Tùy chọn, `{ title, icon?, order? }` | Bắt buộc |
| `breadcrumb` | Tùy chọn, `{ title }` | Tùy chọn |
| `auth` | Tùy chọn, gốc mặc định `required`, con kế thừa | Tùy chọn, truyền cho con |
| `authz` | Tùy chọn, khai báo rõ ở trang đầu | Không được khai báo |
| `parent` | Tùy chọn, chỉ mục gốc của đóng góp | Tùy chọn, chỉ mục gốc của đóng góp |

Tên bắt đầu bằng chữ hoặc số, sau đó có thể có chữ, số, dấu chấm, gạch dưới và gạch nối. Tiêu đề là chuỗi và biểu tượng là thành phần. Các trường `index`, `element`, `loader`, `action` và `errorElement` thuộc API React Router.

[Xem mã nguồn][routes]

<a id="path-rules-and-conflict-checks"></a>

### Quy tắc đường dẫn và kiểm tra xung đột

- Đường dẫn trang cấp cao bắt đầu bằng `/`. Đường dẫn con nối vào cha, kể cả `new` và `/new`. Dấu gạch chéo lặp và ở cuối được chuẩn hóa.
- Giữ truy vấn và fragment ngoài `path`. Mẫu đường dẫn loại wildcard `*`, tham số tùy chọn `?`, gạch chéo ngược và đoạn `.` hoặc `..`.
- Địa chỉ trang phải duy nhất trong ứng dụng và plugin. Khi tìm xung đột, bỏ qua hoa thường của đoạn tĩnh và tên tham số. `/Projects` xung đột với `/projects`, còn `/:id` xung đột với `/:projectId`. Đoạn tĩnh `new` có thể cùng tồn tại với `:projectId`.
- Tên duy nhất trong package trên mọi tệp, nhóm và cấp. Hai package có thể dùng cùng tên với địa chỉ riêng.
- Chỉ ứng dụng được đóng góp `/`. `/login`, `/register`, `/forgot-password` và `/reset-password` phải dùng `auth: 'guest'`.

Khai báo sai bị từ chối trước khi chạy. [routing-contract.test.ts][contract-tests] tái hiện các trường hợp bị từ chối trong môi trường cô lập.

<a id="example-source-and-setup"></a>

## Mã nguồn và thiết lập ví dụ

<a id="environment-and-startup"></a>

### Môi trường và khởi động

[Ứng dụng ví dụ][app] dùng template mặc định `1.0.0-beta.85` và ghim `@nocobase/app-client` ở `4.0.0-beta.5`. Cần Node.js 24 và pnpm 11.7.0.

```bash
git clone https://github.com/nocobase/docs-examples-v3.git
cd docs-examples-v3
git checkout 2700e75f5ed0d927c0c37b53e4ffdf105961cc52
cd apps/pages-routes-navigation
pnpm install --frozen-lockfile
pnpm nocobase config init --dialect sqlite
pnpm nocobase config check
pnpm dev
```

Ví dụ dùng SQLite để minh họa và kiểm chứng mà không cần dịch vụ cơ sở dữ liệu riêng. Để mở từ thiết bị khác, đặt địa chỉ lắng nghe và `app.publicOrigin` theo [README][readme], rồi mở `/main/` trên địa chỉ đó. `config.yml` cục bộ khai báo tài khoản ban đầu trong `users.initialAdmin`.

Trang chủ liên kết từng phần minh họa. Dự án và nhiệm vụ dùng dữ liệu giả công khai. **New draft** minh họa định tuyến và trạng thái biểu mẫu. Người dùng, vai trò và xác thực dùng cơ sở dữ liệu SQLite thật của ứng dụng.

![Trang chủ ví dụ liên kết từng phần minh họa định tuyến](/assets/core/developing-apps/pages-routes-and-navigation/home.png)

<a id="verify-the-example"></a>

### Kiểm chứng ví dụ

Chạy từ thư mục ví dụ:

```bash
pnpm typecheck
pnpm exec vitest run tests/client/client-routes.test.ts tests/client/routing-contract.test.ts tests/client/routing-behavior.test.tsx tests/client/app-locale-coverage.test.ts tests/client/page-permission-titles.test.ts
pnpm build
```

Kiểm thử client dùng phản hồi phân quyền có kiểm soát để kiểm tra đóng lớp phủ lồng, giữ truy vấn, tab mặc định, từ chối truy cập và xác nhận bản nháp. Dùng thêm tài khoản thật để kiểm tra quyền. [README][readme] ghi kiểm chứng trình duyệt, lệnh tạo lại ảnh và môi trường đã thử.

[app]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation
[readme]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation/README.MD
[routes]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation/client/pages/projects/routes.ts
[collection]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation/client/routes.ts
[list]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation/client/pages/projects/index.tsx
[detail]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation/client/pages/projects/detail.tsx
[task]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation/client/pages/projects/task.tsx
[workspace]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation/client/pages/projects/workspace.tsx
[draft]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation/client/pages/projects/new.tsx
[reports]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation/client/pages/reports/index.tsx
[permission-titles]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation/client/pages/settings/page-permission-titles.ts
[plugin]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation/client/reporting-plugin.ts
[client-route]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation/client/routing/client-route.tsx
[app-router]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation/client/routing/app-router.tsx
[contract-tests]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation/tests/client/routing-contract.test.ts
[overrides]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation/client/route-overrides.ts
[runtime]: https://github.com/nocobase/docs-examples-v3/tree/2700e75f5ed0d927c0c37b53e4ffdf105961cc52/apps/pages-routes-navigation/client/runtime.ts
