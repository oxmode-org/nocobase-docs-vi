---
title: Trang, route và điều hướng
description: Đăng ký trang và menu, tổ chức route lồng nhau và breadcrumb, và định nghĩa yêu cầu đăng nhập cùng quyền truy cập trang.
---

Component trang hiển thị nội dung. Khai báo route nối chúng vào ứng dụng và mô tả địa chỉ, menu, breadcrumb và điều kiện truy cập. Thanh bên được tạo ra từ route, nên thêm một mục nghiệp vụ thường không cần sửa layout.

Hướng dẫn này dùng các trang dự án của ứng dụng công việc để giải thích cách định tuyến. Bảng, form và trạng thái request được trình bày trong [UI component và tương tác](pages-and-interactions.md). Các đoạn trích dùng một ứng dụng tạo từ template mặc định `1.0.0-beta.78`; hãy giữ nguyên các route hiện có khi tích hợp. Model `tutorialTasks`/`tutorialProjects` thuộc về ví dụ dự án lịch sử riêng, không phải model `tasks` của phần bắt đầu sử dụng hiện tại. Xác nhận mốc ban đầu trong [Mô hình dữ liệu và migration](data-models-and-migrations.md) trước khi chạy.

## Cùng Agent

```text
Hãy thêm danh sách dự án hiện có vào điều hướng của ứng dụng và hiển thị việc tạo dự án dưới dạng hộp thoại trên danh sách đó.

Chỉ thành viên có quyền truy cập trang mới được vào Projects. Xem được dự án không có nghĩa là được tạo dự án.
Đường dẫn tạo trực tiếp, làm mới trang và lịch sử trình duyệt phải giữ đúng trạng thái trang và hộp thoại.
Đóng hộp thoại phải quay về danh sách dự án ban đầu, giữ nguyên tìm kiếm và vị trí trang.

Cung cấp tiêu đề menu và trang bằng tiếng Anh và tiếng Trung, tránh menu trùng lặp và giữ nguyên các quyền đã cấp.
Kiểm tra người dùng chưa đăng nhập, người dùng không có quyền truy cập trang, người dùng chỉ đọc và người dùng được phép tạo.
Server vẫn phải phân quyền độc lập cho từng request.
```

## Không dùng Agent

### Đăng ký trang và menu

Thêm route dự án vào `defineAppRoutes([...])` hiện có trong `client/routes.ts`, gộp các import. Nếu đã có, hãy sửa mục đó thay vì đăng ký hai lần:

```ts
import { FolderKanban } from 'lucide-react';
import type { AppClientRouteDefinition } from '@nocobase/app-client/plugins';

const projectRoute: AppClientRouteDefinition = {
  name: 'projects',
  path: '/projects',
  auth: 'required',
  authz: { resource: { type: 'page', id: 'projects' }, action: 'access' },
  navigation: { title: 'projects.title', icon: FolderKanban },
  breadcrumb: { title: 'projects.title' },
  componentLoader: () => import('./pages/projects/index.js'),
  children: [
    {
      name: 'projectCreate',
      path: 'create',
      authz: {
        resource: { type: 'composite', id: 'tutorial.projects' },
        action: 'create',
      },
      breadcrumb: { title: 'projects.new' },
      componentLoader: () => import('./pages/projects/create.js'),
    },
  ],
};
```

Đưa `projectRoute` vào mảng route hiện có; chỉ khai báo biến thì không đăng ký gì cả. [Ví dụ dự án](pages-and-interactions.md) cung cấp các component và resource phân quyền này. Một ứng dụng trống phải tự triển khai chúng trước.

| Khai báo | Mục đích |
| --- | --- |
| `name` | Định danh route ổn định, duy nhất, dùng để tham chiếu và override |
| `path` | Địa chỉ nội bộ trong ứng dụng; đường dẫn con như `create` là tương đối so với route cha |
| `componentLoader` | Tải lười một module có default export là React component |
| `navigation` | Tiêu đề menu, biểu tượng và thứ tự giữa các mục cùng cấp; bỏ đi nếu không cần mục menu |
| `breadcrumb` | Tiêu đề cho cấp route này, thường là một translation key |
| `children` | Các route lồng nhau, hiển thị qua `Outlet` của route cha |

Đường dẫn không bao gồm base path của bản triển khai. Với điểm vào ở `/main/`, `/projects` trở thành `/main/projects` trên trình duyệt. Đừng cố định `/main` trong mã. Các dynamic import của template dùng `.js` ngay cả khi file nguồn là `.tsx`.

### Ghép trang và route con

Trang danh sách thường dùng `PageContainer` và `PageHeader`, giữ một `<Outlet />` cho route con. Ví dụ này chỉ cho thấy layout, không có request danh sách hay phần triển khai form:

```tsx
import { Outlet } from 'react-router';
import { useTranslation } from '@nocobase/i18n/client';
import { PageContainer } from '#components/page-container';
import { PageHeader } from '#components/page-header';

export default function ProjectsPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageContainer>
        <PageHeader title={t('projects.title')} />
        {/* Hiển thị danh sách dự án ở đây. */}
      </PageContainer>
      <Outlet />
    </>
  );
}
```

Route con không nhất thiết là một trang đầy đủ. Chọn cách trình bày theo nội dung của nó:

| Cách trình bày | Dùng cho | Quan hệ với route cha |
| --- | --- | --- |
| Nội dung inline | Tab và các phần của trang | Hiển thị tại Outlet và dùng chung container của route cha |
| `RouteDialog` | Form tạo hoặc sửa ngắn | Hộp thoại phủ lên route cha |
| `RouteDrawer` | Chi tiết bản ghi hoặc sửa ở bên cạnh | Drawer phủ lên route cha |
| `RouteChildPage` | Form dài hoặc trang con phức tạp | Phủ vùng nội dung, giữ nguyên trạng thái của route cha và điều hướng của ứng dụng |

Tab inline không nên thêm một `PageContainer` đầy đủ khác. Dùng `RouteChildPage` để phủ vùng nội dung; hiển thị container thứ hai sau container cha sẽ tạo ra các trang xếp chồng theo chiều dọc.

### Giữ ngữ cảnh điều hướng

Mang theo query parameter hiện tại khi mở một hộp thoại theo route:

```tsx
<Link to={{ pathname: 'create', search: location.search }}>
  {t('projects.new')}
</Link>
```

`Link` và `useLocation` đến từ `react-router`; lấy `location` bằng `useLocation()` của trang. Khi đóng phải quay về route cha cùng tìm kiếm, sắp xếp và phân trang của nó. Đừng chỉ dựa vào nút Back của trình duyệt: người dùng có thể mở URL trực tiếp.

Biểu diễn các tab có thể chia sẻ dưới dạng route con. Chỉ chuyển hướng đến tab mặc định truy cập được khi ở chính địa chỉ của route cha, không phải từ một URL con cụ thể. Bấm tab dùng điều hướng thông thường; chuyển hướng mặc định thay thế lịch sử để tránh vòng lặp khi quay lại.

Xem [UI component và tương tác](pages-and-interactions.md) về chặn đóng khi đang lưu, nút Back của trình duyệt và khôi phục focus, những thứ phải dùng chung cùng một trạng thái gửi form.

### Nhóm menu và breadcrumb

Một nhóm chỉ dùng cho điều hướng khai báo `name`, `navigation` và `children`, không có `componentLoader` hay `authz`. Nếu có `path`, nó góp vào tiền tố của các route con cháu. Đừng thay đổi địa chỉ trang hiện có chỉ để đổi tên nhóm.

Giá trị `navigation.order` nhỏ hơn đứng trước; khi bằng nhau thì giữ thứ tự đăng ký. Trang chi tiết, hộp thoại và tab thường không có menu riêng. Đường dẫn có tham số không thể làm đích cố định cho menu. Ẩn menu không tắt tính năng; URL trực tiếp vẫn cần kiểm tra ở route.

Các trang thường dùng `breadcrumb.title`, nếu không có thì dùng `navigation.title` của trang. Với tên bản ghi hoặc đường dẫn quay lại mang theo bộ lọc danh sách, trang có thể cung cấp breadcrumb động bằng `usePageBreadcrumb()`. Giữ breadcrumb tĩnh trong lúc tải. Tránh thêm nút Back trùng lặp khi breadcrumb đã có cùng đường quay lại.

### Tách đăng nhập khỏi phân quyền trang

| Cấu hình | Kiểm soát |
| --- | --- |
| `auth: 'required'` | Bắt buộc đăng nhập; route con kế thừa yêu cầu của điểm vào |
| `auth: 'guest'` | Trang cho khách như đăng nhập và đăng ký |
| `auth: 'optional'` | Dùng được cả trước và sau khi đăng nhập; nội dung thay đổi theo danh tính |
| `authz: { resource, action }` | Kiểm tra một resource và action, như `access` của trang hay một action tạo |
| `authz: 'skip'` | Bỏ qua kiểm tra phân quyền riêng của trang này, vẫn giữ kiểm tra đăng nhập và của route tổ tiên |
| `authz: 'unrestricted'` | Giới hạn truy cập cho các danh tính không bị hạn chế; không có nghĩa là mọi người |

Khai báo rõ `authz` trên trang đầu tiên của mỗi đường dẫn. Route con không khai báo sẽ kế thừa giá trị của trang tổ tiên gần nhất. Tự khai báo kiểm tra riêng không bỏ qua được route cha. Vì vậy Projects cần `projects/access`, còn hộp thoại tạo của nó kiểm tra thêm `tutorial.projects/create`.

ID resource của trang được lưu trong các quyền đã cấp cho vai trò. Đổi tên chúng cần chuyển đổi các quyền đó; đừng đổi ID chỉ để sửa chữ hiển thị. Tiêu đề dùng bản dịch. Các trang không có điều hướng hay breadcrumb có thể cung cấp nhãn quyền qua `client/pages/settings/page-permission-titles.ts`.

Các kiểm tra này chạy trên trình duyệt. API vẫn cần xác thực, phân quyền nghiệp vụ và phạm vi bản ghi độc lập; xem [Dịch vụ nghiệp vụ và HTTP API](apis-and-services.md).

## Kiểm tra kết quả

Chạy các kiểm tra route và nhãn quyền của dự án thực tế:

```bash
pnpm exec vitest run tests/logic/client-routes.test.ts tests/logic/page-permission-titles.test.ts
```

Sau đó kiểm tra trên trình duyệt: mục menu, đường dẫn con trực tiếp, làm mới trang, lịch sử, đóng hộp thoại và giữ query parameter. Dùng người dùng thông thường không có quyền truy cập trang, chỉ có quyền đọc và có quyền tạo. Kiểm tra cả request API trực tiếp; một quản trị viên xem được trang là chưa đủ bằng chứng nghiệm thu.
