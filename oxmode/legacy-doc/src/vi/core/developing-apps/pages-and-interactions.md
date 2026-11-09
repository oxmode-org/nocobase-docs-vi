---
title: UI component và tương tác
description: Chọn và ghép các component của template, quản lý trạng thái danh sách và form, và xử lý gọi API, trạng thái tải, lỗi cùng phản hồi.
---

Trang giúp người dùng thao tác với các năng lực nghiệp vụ. Ngoài hiển thị dữ liệu, trang cần có hành vi rõ ràng khi đang tải, khi kết quả trống, khi đang gửi, khi thất bại và khi thành công, đồng thời giữ cho bộ lọc, dữ liệu đã nhập và quyền luôn nhất quán.

Hướng dẫn này dùng danh sách dự án, việc tạo dự án và việc gán dự án cho công việc để giải thích cách ghép component, gọi API và trạng thái tương tác. Bạn có thể đọc thẳng chủ đề cần; chạy toàn bộ ví dụ cần các model và endpoint liệt kê bên dưới. Phần route ở đây chỉ nói về việc nối các giao diện này, không phải toàn bộ hệ thống layout và route lồng nhau.

## Ưu tiên component sẵn có

Xem `client/components/`, `client/components/ui/` và các trang hiện có trước khi thêm component. Các component trang, bảng và hộp thoại theo route của template đã xử lý một phần hành vi dùng chung; trang nghiệp vụ ghép chúng lại, cung cấp dữ liệu và nối phản hồi.

| Nhu cầu | Component hoặc cơ chế dùng ở đây | Trang nghiệp vụ vẫn phải lo |
| --- | --- | --- |
| Tiêu đề và layout trang | `PageContainer`, `PageHeader` | Tiêu đề, action và nội dung; tránh lồng page container |
| Danh sách và phân trang | `DataTable` | Cột, dữ liệu theo phạm vi, tổng số và phân trang phía server |
| Hộp thoại tạo hoặc sửa | `RouteDialog` | Form, gửi dữ liệu, chặn đóng và ngữ cảnh quay lại |
| Kiểm tra form | `react-hook-form` và `zodResolver` | Kiểm tra nghiệp vụ, lỗi field từ server và focus |
| Request API của ứng dụng | `useApiClient()` | Tham số, hủy request đã cũ và xử lý kết quả |
| Hiển thị action | `useCan()` | Kiểm soát điểm vào của action, vẫn giữ phân quyền độc lập phía server |

Import component qua các điểm vào của ứng dụng như `#components/...`. Thêm các thành phần cơ bản còn thiếu theo hướng dẫn của dự án, ưu tiên ghép và các prop sẵn có. Dùng style theme có ngữ nghĩa và nội dung đã dịch thay vì tạo ra một hệ thống hình ảnh riêng cho một tính năng.

## Tách ba loại trạng thái

**Trạng thái URL** ghi lại một góc nhìn có thể chia sẻ và khôi phục: tìm kiếm, sắp xếp, phân trang và hộp thoại theo route hiện tại. Đóng hộp thoại phải quay về ngữ cảnh danh sách đó.

**Trạng thái server** chứa bản ghi, lựa chọn, tổng số và kết quả quyền thao tác. Đọc lại khi tìm kiếm hoặc phân trang thay đổi; request cũ không được thay thế kết quả mới hơn. Server vẫn kiểm tra quyền khi lưu: quyền thấy được lúc mở hộp thoại không phải là sự cho phép vĩnh viễn.

**Bản nháp form** chứa dữ liệu chưa gửi, dự án đã chọn và lỗi của field. Chuyển trang lựa chọn, lỗi mạng và thử lại không được vô tình xóa chúng. Kết thúc việc sửa sau khi gửi thành công hoặc khi người dùng chủ động bỏ.

Các trạng thái này có mục đích khác nhau. Sao chép cả bản ghi danh sách vào hộp thoại rồi ghi lại toàn bộ có thể ghi đè thay đổi của người khác. Chỉ lưu lựa chọn trong trang lựa chọn hiện tại sẽ làm mất nó khi chuyển trang.

## Các giao diện ví dụ

Thêm một danh sách dự án và hai hộp thoại, dùng các component trang, bảng và form sẵn có của ứng dụng:

- **Danh sách dự án:** tìm theo tên, sắp xếp theo thời gian tạo và duyệt các trang phía server.
- **Dự án mới:** kiểm tra tên, lưu và quay về danh sách ban đầu.
- **Đổi dự án của công việc:** tải liên kết hiện tại, chọn một dự án được phép hoặc bỏ liên kết.

![Danh sách dự án với tìm theo tên, sắp xếp theo thời gian tạo và phân trang](/assets/core/developing-apps/pages-and-interactions/projects-list.png)

Chương này không thêm trang chi tiết dự án, xóa hay quy trình phê duyệt. Bảng Tasks giữ nguyên các cột hiện có. Action trên dòng mở Change project, nơi hiển thị liên kết hiện tại.

## Trước khi bắt đầu

Chạy ví dụ này cần các ví dụ trong [Mô hình dữ liệu và migration](data-models-and-migrations.md) và [Dịch vụ nghiệp vụ và HTTP API](apis-and-services.md), giữ nguyên migration, service, route và quyền của chúng. Ví dụ dùng `@nocobase/app-template-default@1.0.0-beta.78` và không cần plugin mới.

Gói tăng dần này nhắm đến ví dụ dự án lịch sử ở trên, không phải ứng dụng bắt đầu sử dụng hiện tại với bảng `tasks` và tiến độ ba giai đoạn.

Ở đây có nhiều file frontend phối hợp với nhau. Hãy tải [gói mã nguồn tăng dần](/assets/core/downloads/team-tasks-pages-and-interactions.zip) gồm các file được thêm và sửa, một bản patch và hướng dẫn. Nó bắt đầu từ trạng thái sau hai ví dụ kia và không chứa cấu hình, tài khoản, cơ sở dữ liệu hay dependency.

Các tag theo chương trong repository vẫn là tham chiếu cho các ví dụ đã phát hành. Mã nguồn của chương này được cung cấp cùng tài liệu mà không phụ thuộc vào một tag chưa phát hành. Nếu ứng dụng của bạn đã có thay đổi tùy chỉnh, hãy xem và merge bản patch thay vì ghi đè mã nghiệp vụ.

## Cùng Agent

Đưa chương này cho Agent làm ngữ cảnh từ thư mục ứng dụng, rồi mô tả yêu cầu dưới đây. Chi tiết về field, API và component nằm trong các bước thủ công; Agent nên theo chúng cùng với hướng dẫn của dự án.

```text
Hãy làm cho các tính năng dự án hiện có dùng được qua trang, theo phong cách giao diện của ứng dụng, với nội dung tiếng Anh và tiếng Trung.

Tôi cần một trang Projects có tìm theo tên, sắp xếp theo thời gian tạo và phân trang, cùng một hộp thoại New project.
Thêm Change project vào các action trên dòng công việc. Hộp thoại cần hiển thị dự án đang gán, cho tôi chọn một dự án hợp lệ, hoặc bỏ gán.
Tải thông tin hiện tại khi mở, và giữ lựa chọn của tôi khi chuyển trang danh sách dự án có thể chọn.
Chỉ đưa ra các dự án được phép cho thao tác gán này; chỉ có quyền xem không được cấp quyền gán.

Hiển thị tiến trình khi đang tải và giải thích khi không có dữ liệu hoặc tìm kiếm không có kết quả.
Đặt thông báo kiểm tra cạnh field tương ứng. Giữ dữ liệu đã nhập và cho phép thử lại nếu lưu thất bại.
Chống gửi trùng, cập nhật danh sách và xác nhận thành công sau khi lưu, và giữ bộ lọc cùng vị trí trang khi đóng hộp thoại.
Yêu cầu đăng nhập khi phiên hết hạn, giải thích khi thiếu quyền, và dừng sửa nếu công việc không còn tồn tại.

Theo hướng dẫn của dự án và giữ nguyên các quyền hiện có, không tự động gán vai trò.
Kiểm chứng việc tạo, gán, bỏ gán và các thao tác bị từ chối, cũng như dùng bàn phím, nhập tiếng Trung và màn hình hẹp.
Chưa thêm chi tiết dự án, xóa hay workflow. Báo cáo các thay đổi và kết quả kiểm chứng.
```

## Không dùng Agent

### Ánh xạ trang với API

Đường dẫn trang là tương đối so với điểm vào của ứng dụng. Đường dẫn API là tương đối so với API root. Đừng cố định `/main` hay địa chỉ server trong component.

| Route trang | Cách trình bày | API |
| --- | --- | --- |
| `/projects` | Danh sách dự án | `GET /tutorialProjects` |
| `/projects/create` | Hộp thoại tạo | `POST /tutorialProjects` |
| `/tasks/:taskId/project` | Hộp thoại gán | `GET` và `PATCH /tutorialTasks/:id/project` |

Mở rộng endpoint danh sách trước đó với `q` và `order`: tìm tên có chứa chuỗi, và sắp xếp tăng hoặc giảm theo thời gian tạo, mặc định mới nhất trước. Phân xử timestamp bằng nhau bằng `id`. Áp dụng cùng bộ lọc và policy phân quyền cho các dòng và `total`.

Hộp thoại gán cũng cần một endpoint đọc. Đọc công việc qua policy công việc của `assignTask`, rồi tải các lựa chọn và tên dự án hiện tại qua policy dự án của action đó:

```ts
{
  data: {
    task: { id, title, projectId, projectName },
    options: [{ id, name, createdAt }],
  },
  meta: { page, pageSize, total },
}
```

`projectName` có thể là `null` khi dự án hiện tại giờ nằm ngoài phạm vi được phép. Hãy hiển thị Project unavailable mà không để lộ tên hay coi đó là liên kết chưa đặt. Khi lưu vẫn kiểm tra lại công việc và dự án đích; phản hồi trước đó của trình chỉnh sửa không phải là sự cho phép lâu dài.

Các thay đổi đầy đủ nằm trong `server/providers/tutorial-project-service.ts`, `tutorial-projects.ts` và `server/routes/tutorial-projects.ts` của gói. Endpoint GET mới khai báo `describeRoute()` và kiểm tra dữ liệu đầu vào bằng `apiValidator()`. Không cần migration mới.

### Khai báo trang, điều hướng và hộp thoại trong route

Thêm Projects vào `defineAppRoutes()` trong `client/routes.ts`, giữ nguyên các route Tasks, xác thực và cài đặt hiện có:

```tsx
{
  name: 'projects',
  path: '/projects',
  auth: 'required',
  authz: {
    resource: { type: 'page', id: 'projects' },
    action: 'access',
  },
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
}
```

Import `FolderKanban` từ `lucide-react`. Khai báo `navigation` tạo mục ở thanh bên. Mỗi module trang default export một React component, và route cha hiển thị `<Outlet />` cho các route con.

Thêm `:taskId/project` vào `tasks.children` hiện có, được bảo vệ bằng `tutorial.projects/assignTask`.

Giữ nguyên query của danh sách khi mở hộp thoại:

```tsx
<Button
  nativeButton={false}
  render={<Link to={{ pathname: 'create', search: location.search }} />}
>
  {t('projects.new')}
</Button>
```

Nhờ đó, đường dẫn được sao chép, việc làm mới và việc đóng đều có thể dự đoán. Ví dụ, `/projects/create?q=launch&page=2` mở ra trên danh sách dự án tương ứng và quay về đúng query đó khi đóng.

### Giữ trạng thái danh sách trong URL

`client/pages/projects/index.tsx` dùng `PageContainer`, `PageHeader` và `DataTable`. `useUrlSearch()` quản lý ô tìm kiếm và việc soạn bằng IME, còn `useTableUrlState()` quản lý số trang, kích thước trang và sắp xếp.

Tải dữ liệu qua `useApiClient()`:

```tsx
api.request({
  path: 'tutorialProjects',
  query: { q: search, order, page: pageIndex + 1, pageSize },
  signal: controller.signal,
});
```

Hủy request trong phần cleanup của effect và kiểm tra đã hủy chưa trước khi cập nhật trạng thái. Phản hồi của lần tìm kiếm cũ không được ghi đè kết quả mới hơn. Chỉ một kết quả đếm thành công cho query hiện tại mới được chuẩn hóa trang nằm ngoài phạm vi.

Bật `manualPagination` và `manualSorting`, cung cấp các dòng và tổng số từ server. Chỉ báo mặc định ở tiêu đề cột cũng phải hiển thị Created giảm dần; chỉ đặt mặc định ở server là chưa đủ.

| Trạng thái | Cách trình bày |
| --- | --- |
| Tải lần đầu | Skeleton; chưa hiển thị nút tạo |
| Làm mới | Giữ các dòng hiện có kèm chỉ báo đang tải |
| Chưa có dự án | Trạng thái trống với action tạo duy nhất khi được phép |
| Tìm kiếm không khớp | Thông báo không có kết quả, action tạo ở tiêu đề và Clear filters |
| Tìm kiếm có kết quả | Vẫn giữ Clear filters |
| Request thất bại | Giải thích lỗi; cho phép thử lại với lỗi mạng/server |
| Phiên hết hạn hoặc bị từ chối quyền | Ẩn dữ liệu cũ và đưa ra hướng dẫn đăng nhập hoặc liên hệ quản trị viên |

### Xây form tạo

`client/pages/projects/create.tsx` dùng `RouteDialog` với `sm:max-w-md` cho form một field. `react-hook-form` quản lý form, còn `zodResolver` yêu cầu tên đã cắt khoảng trắng dài 1–120 ký tự.

![Hộp thoại New project trên danh sách dự án](/assets/core/developing-apps/pages-and-interactions/create-project.png)

Xử lý rõ ràng vòng đời gửi form:

1. Kiểm tra khi gửi. Gắn lỗi của tên với `aria-invalid` và `aria-describedby`.
2. Vô hiệu hóa Submit và Cancel khi đang gửi, đặt ô nhập ở chế độ chỉ đọc, và dùng một ref để chống request trùng và tranh chấp khi đóng.
3. Ánh xạ lỗi vi phạm về tên từ server trở lại field, giữ nguyên giá trị và focus vào đó. Hiển thị các lỗi khác trong một alert của form.
4. Cập nhật danh sách bằng dự án được trả về, hiển thị thông báo thành công kèm tên và đóng hộp thoại.

Chặn nút đóng, Cancel và Escape của hộp thoại bằng `beforeClose` của template:

```tsx
<RouteDialog
  title={t('projects.new')}
  className="sm:max-w-md"
  beforeClose={() => !pendingRef.current}
  footer={<Footer pending={pending} />}
>
  <ProjectForm />
</RouteDialog>
```

Khi đang lưu cũng phải chặn nút Back của trình duyệt và điều hướng trong ứng dụng. `usePendingNavigation` của gói mã nguồn gọi `useNavigationGuard` từ `@nocobase/app-client`, kiểm tra cùng ref đang gửi đó. Nó chỉ đăng ký `beforeunload` trong lúc lưu để trình duyệt cảnh báo khi tải lại hoặc đóng tab. Chỉ `beforeClose` không bao quát được các đường điều hướng này.

Ví dụ này minh họa quan hệ giữa các component. Trong mã nguồn đầy đủ, form đồng bộ trạng thái đang gửi với component cha, và thuộc tính `form` của footer nối nút gửi với form. Hãy giữ các kết nối đó khi dùng gói mã nguồn.

Một dòng vừa tạo có thể thuộc về chỗ nằm ngoài trang đang hiển thị: chẳng hạn danh sách sắp cũ nhất trước, một trang sau hoặc một tìm kiếm không khớp. Chỉ chèn ngay khi đang ở trang đầu khớp và sắp giảm dần. Các trường hợp khác, hãy giữ ngữ cảnh, xác nhận dự án đã lưu theo tên và đưa ra Show latest projects.

### Mở hộp thoại gán từ một công việc

Khi cả hoàn thành/mở lại và gán dự án đều khả dụng, hãy đặt chúng trong một menu của dòng. Khi chỉ có một action, hiển thị một nút duy nhất. Mỗi action dùng kết quả `useCan()` riêng.

![Change project trong menu dòng của công việc](/assets/core/developing-apps/pages-and-interactions/task-actions.png)

`client/pages/tasks/[taskId]/project.tsx` tải công việc mới nhất và các dự án được phép khi mở. Các lựa chọn được phân trang theo nhóm 20 với Previous và Next; trang đầu tiên không được trình bày như danh sách đầy đủ.

![Đổi dự án của công việc với các lựa chọn giới hạn theo action gán](/assets/core/developing-apps/pages-and-interactions/change-project.png)

**Phân trang lựa chọn và bản nháp form là hai trạng thái riêng.** Chỉ khởi tạo lựa chọn từ phản hồi đầu tiên. Các trang lựa chọn sau phải giữ nguyên bản nháp và nhãn của nó, kể cả khi dự án đã chọn nằm ở trang khác. Thử lại một lần tải thất bại không được đặt lại dữ liệu đã nhập.

Lưu ID đã chọn, hoặc `null` cho No project:

```tsx
const { data } = await api.request({
  path: `tutorialTasks/${encodeURIComponent(taskId)}/project`,
  method: 'PATCH',
  json: { projectId },
});
```

Phản hồi chỉ chứa `id`, `projectId` và `updatedAt`. Gộp các field đó vào công việc hiện có, rồi làm mới danh sách. Đừng ghi đè tiêu đề, người được giao hay trạng thái hoàn thành bằng một đối tượng cũ của trình chỉnh sửa. Mở lại sẽ đọc liên kết từ server lần nữa.

### Cho mỗi thất bại một bước tiếp theo hữu ích

| Tình huống | Hành vi |
| --- | --- |
| Form không thay đổi | Vô hiệu hóa Save và giải thích là không có thay đổi |
| Dự án đích không khả dụng | Gắn lỗi với Project, focus vào nút mở và giữ bản nháp |
| Công việc không tồn tại hoặc ngoài phạm vi | Kết thúc việc sửa và quay về danh sách đã làm mới |
| Phiên hết hạn | Đưa ra đăng nhập |
| Quyền action bị thu hồi | Giải thích việc từ chối, không có nút Retry vô tác dụng |
| Lỗi mạng hoặc server | Giữ dữ liệu đã nhập và cho phép thử lại |

![Một lần API từ chối thật hiển thị dưới field Project](/assets/core/developing-apps/pages-and-interactions/project-validation.png)

Hành vi bàn phím cũng quan trọng: xác nhận một ứng viên IME không được gửi form; đang lưu thì không được gửi hai lần; khi đóng, focus quay về nút đã mở, hoặc về tiêu đề của trang cha khi nút đó không còn hay hộp thoại được mở từ đường dẫn trực tiếp.

### Cấu hình quyền và kiểm chứng

Dùng System settings → Permission management để cấu hình các vai trò rõ ràng:

- Quyền truy cập trang Projects và các action xem/tạo cần thiết.
- Quyền truy cập trang Tasks và Change task project.
- Phạm vi công việc và dự án riêng cho việc gán.

Giao vai trò cho từng người cụ thể qua phần quản lý người dùng. Quyền truy cập trang không cấp quyền truy cập dữ liệu hay quyền tạo. Xem được một dự án không nhất thiết được gán công việc vào nó. Nút bị ẩn chỉ là phản hồi; server kiểm tra độc lập mọi request.

Gói có kèm test API thật, test component và một test trình duyệt:

```bash
pnpm exec vitest run --config vitest.tutorial.config.ts tests/server/tutorial-tasks-project-api.test.ts
pnpm exec vitest run tests/components/tutorial-projects.test.tsx
pnpm exec vitest run tests/logic/client-routes.test.ts tests/logic/page-permission-titles.test.ts tests/logic/app-locale-coverage.test.ts tests/logic/authorization-assignment-safety.test.ts
pnpm typecheck
```

Chạy test trình duyệt với một ứng dụng kiểm thử cục bộ riêng: chúng sẽ tạo dự án và công việc. Đặt `APP_URL` thành điểm vào đầy đủ của ứng dụng mà `pnpm dev` in ra, và dùng một tài khoản kiểm thử cục bộ:

```bash
APP_URL=http://127.0.0.1:13321/main/ pnpm exec playwright test tests/playwright/tutorial-projects.test.ts
```

Đặt `TUTORIAL_USERNAME` và `TUTORIAL_PASSWORD` khi cần; giữ thông tin đăng nhập production ngoài script. Việc tạo, gán, bỏ gán và phạm vi đều dùng cơ sở dữ liệu thật. Test component chỉ thay thế các ranh giới cần thiết về phiên, transport và năng lực trình duyệt của jsdom.

## Tái sử dụng ở các trang khác

Model, API nghiệp vụ và tương tác trang giờ đã phối hợp với nhau. Với một trang nghiệp vụ khác, hãy theo cùng trình tự: xác lập dữ liệu và quyền, khai báo route và component, rồi hoàn thiện trạng thái tải, thất bại, phản hồi khi lưu và kiểm chứng.

Ví dụ vẫn dùng cơ chế lần ghi thành công cuối cùng thắng, không có kiểm tra phiên bản cho ghi đồng thời. Tìm kiếm khớp tên theo kiểu chứa chuỗi; sắp xếp theo thời gian tạo, không hỗ trợ sắp theo pinyin tiếng Trung.
