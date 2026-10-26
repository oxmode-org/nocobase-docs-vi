---
title: Cấu hình ứng dụng và cài đặt hệ thống
description: Khai báo, kiểm tra và đọc cấu hình, phân biệt tham số khi chạy với cài đặt nghiệp vụ, và bàn giao các trang quản trị hoạt động thực sự.
---

Cấu hình ứng dụng mô tả cách một instance chạy. Cài đặt nghiệp vụ mô tả các quy tắc mà quản trị viên có thể điều chỉnh. Chúng có thể cùng ảnh hưởng đến một tính năng, nhưng khác nhau về nơi lưu, người sở hữu và cách cập nhật. Không phải giá trị cấu hình nào cũng cần một form, và các cài đặt nghiệp vụ dùng hằng ngày không nên bị cố định trong file triển khai.

Hướng dẫn này dùng các mục cấu hình và các trang cài đặt đã chuẩn bị sẵn của ứng dụng ví dụ. Về quy trình triển khai server, xem [Chọn cách triển khai](../deployment/choose-a-deployment-method.md).

## Xác định ai sở hữu giá trị

| Loại | Ví dụ | Vị trí phù hợp |
| --- | --- | --- |
| Tham số khi chạy | Cổng lắng nghe, kết nối cơ sở dữ liệu, origin công khai | `config.yml` hoặc biến môi trường đã khai báo |
| Giá trị mặc định trong mã | Kích thước trang mặc định của danh sách | Configuration factory, có thể ghi đè khi triển khai |
| Cài đặt nghiệp vụ | Múi giờ báo cáo, lịch làm việc, quy tắc đánh số | Dữ liệu của ứng dụng hoặc plugin, thay đổi qua API có phân quyền |
| Tùy chọn cá nhân | Ngôn ngữ, chế độ màu, theme | Cơ chế tùy chọn sẵn có |
| Dữ liệu gốc nghiệp vụ | Dự án, khách hàng, sản phẩm | Các module nghiệp vụ, thường nằm ngoài cài đặt hệ thống |

Hãy xác định ai được đổi một giá trị, khi nào nó có hiệu lực và có ảnh hưởng đến bản ghi cũ hay không. Múi giờ báo cáo có thể thay đổi cách trình bày hoặc ranh giới tổng hợp; các trang và job nền không nên tự đặt ra cách hiểu riêng.

## Cùng Agent

```text
Hãy rà soát cấu hình và các mục quản trị của ứng dụng này để người vận hành và quản trị viên nghiệp vụ quản lý được những gì họ cần.

Liệt kê cấu hình mà các tính năng hiện có thực sự dùng, người sở hữu, nơi lưu và khi nào thay đổi có hiệu lực.
Giữ kết nối cơ sở dữ liệu và khóa bí mật của server trong cấu hình triển khai, ngoài các trang thông thường và cấu hình trình duyệt.
Tái sử dụng phần quản trị người dùng và vai trò, không tạo mục trùng lặp hay tự động mở rộng quyền.

Ở chỗ quản trị viên cần thay đổi quy tắc nghiệp vụ, hãy dùng API đọc và lưu thật, và đảm bảo các thao tác sau đó dùng giá trị đã lưu.
Quản trị viên chỉ đọc được xem cài đặt; chỉ quản trị viên có quyền mới được lưu. Từ chối giá trị không hợp lệ và giữ lại dữ liệu đã nhập khi thất bại.
Không thêm trang cài đặt trống cho các năng lực chưa dùng.
Báo cáo phạm vi của từng cài đặt và kết quả sau khi làm mới, đăng nhập hoặc khởi động lại tùy trường hợp.
```

## Không dùng Agent

### Tìm các mục cấu hình

Giá trị mặc định phía server nằm trong `server/config/`, được ghép lại qua `defaultAppConfigs()` trong `server/config/index.ts`. Giá trị mặc định phía client nằm trong `client/config/`. Khi khởi động, ứng dụng nạp các file cấu hình và biến môi trường đã khai báo, rồi cung cấp cấu hình đã phân giải cho các service.

Với các phần cấu hình server có ánh xạ biến môi trường, thứ tự ưu tiên là giá trị mặc định trong mã, rồi `config.yml`, rồi biến môi trường. Một tên biến nghe hợp lý sẽ không có tác dụng nếu không có ánh xạ. `${NAME}` trong `config.yml` không được thay giá trị.

### Khai báo và kiểm tra cấu hình

Với một kích thước trang mặc định cho dự án mà người vận hành có thể ghi đè, hãy tạo `server/config/project-defaults.ts`:

```ts
import {
  defineAppConfig,
  envInteger,
  type AppConfigFactory,
} from '@nocobase/app-server/config';

export interface ProjectDefaults {
  pageSize: number;
}

const projectDefaults: AppConfigFactory<ProjectDefaults> = defineAppConfig({
  defaults: { pageSize: 20 },
  env: {
    PROJECT_PAGE_SIZE: envInteger('pageSize', {
      description: 'The default project page size, from 1 to 100.',
    }),
  },
  public: ['pageSize'],
  validate(value, ctx) {
    const size = value.pageSize;
    if (
      typeof size !== 'number' ||
      !Number.isInteger(size) ||
      size < 1 ||
      size > 100
    ) {
      ctx.error('pageSize', 'Must be an integer from 1 to 100.');
    }
  },
});

export default projectDefaults;
```

Import nó trong `server/config/index.ts` và thêm `projectDefaults` vào `defaultAppConfigs({ ... })` hiện có. Nếu file đó khai báo rõ kiểu kết quả, hãy thêm cả `projectDefaults: ReturnType<typeof projectDefaults>`. Giữ nguyên các phần hiện có thay vì thay cả file bằng đoạn trích này.

Mô tả tùy chọn triển khai trong `config.example.yml`; một instance ghi đè nó trong `config.yml`:

```yaml
projectDefaults:
  pageSize: 20
```

Phần kiểm tra nhận giá trị cuối cùng đã gộp khi khởi động, khi nạp lại và khi kiểm tra cấu hình. Hãy báo giá trị không hợp lệ mà không ghi vào cơ sở dữ liệu, gửi request hay thay đổi trạng thái bên ngoài. `public: ['pageSize']` chỉ công khai đúng field lá đó; một trang cần cấu hình không phải lý do để công khai các giá trị khác của server.

### Đọc và dùng giá trị

Mã phía server đọc qua service cấu hình:

```ts
const defaults = app.config.get<ProjectDefaults>('projectDefaults');
```

Import `ProjectDefaults` từ file ở trên. Dùng `defaults.pageSize` khi bổ sung tham số phân trang còn thiếu; giá trị truyền rõ vẫn cần giới hạn `1–100`. **Khai báo cấu hình không tự động thay đổi danh sách.** Endpoint và frontend của ví dụ hiện tại có giá trị mặc định riêng, nên hãy cập nhật cả hai nơi dùng khi áp dụng ví dụ này.

Trình duyệt đọc các giá trị đã công khai qua `config.public.get('projectDefaults.pageSize')` trên service cấu hình của nó. Khai báo kiểu phía client:

```ts
declare module '@nocobase/app-client' {
  interface PublicAppConfig {
    projectDefaults: { pageSize?: number };
  }
}

export {};
```

Đặt khai báo trong một file `.d.ts` thuộc project TypeScript phía client. Với các phần cấu hình thuộc plugin, hãy ưu tiên configuration factory và hook của plugin để phần kiểm tra của chúng vẫn hoạt động. Cấu hình khi chạy trong `client` được gửi xuống trình duyệt và không được chứa khóa bí mật.

### Kiểm tra cấu hình và hành vi cập nhật

```bash
pnpm nocobase config env
pnpm nocobase config variables
pnpm nocobase config check
```

Hai lệnh đầu hiển thị ánh xạ biến môi trường và mô tả; lệnh cuối kiểm tra instance hiện tại. Đừng công bố cấu hình cục bộ hay chi tiết môi trường làm ví dụ trong tài liệu.

Hỗ trợ nạp lại cấu hình không có nghĩa mọi service hiện có đều được khởi tạo lại. Service chỉ đọc một lần khi khởi động cần khởi động lại; service hỗ trợ cập nhật động nên đăng ký nhận thay đổi theo hợp đồng của nó. Làm mới trang sau khi đổi giá trị mặc định phía client, và kiểm tra bằng một phiên mới chưa có tùy chọn đã lưu thay vì chỉ quan sát lựa chọn sẵn có của trình duyệt.

### Nối các cài đặt hệ thống sẵn có

Template mặc định có các trang quản trị người dùng và phân quyền tái sử dụng được. Khi phát triển tính năng nghiệp vụ, thêm `systemSettingsRoutes` từ `./pages/settings/routes.js` một lần vào mảng đóng góp hiện có trong `client/routes.ts`. Ví dụ ứng dụng công việc đã đăng ký sẵn; đừng thêm trùng.

Một nhóm điều hướng chỉ sắp xếp các trang chứ không cấp quyền truy cập. Giữ nguyên các khai báo quyền, API thật và hành vi gán vai trò hiện có. Kiểm tra phần quản trị mà các tính năng nghiệp vụ thực sự cần, thay vì thêm trang trống chỉ vì một dependency đã được cài.

### Thêm cài đặt nghiệp vụ thuộc ứng dụng

“Quản trị viên có thể đổi múi giờ báo cáo” nên là một tính năng nghiệp vụ thật, không phải nút Save trên web ghi vào `config.yml`:

1. Chọn cách lưu trữ và giá trị ban đầu. Ưu tiên service cài đặt công khai của plugin sở hữu; dùng migration cho phần lưu trữ thuộc ứng dụng.
2. Khai báo resource và action cài đặt phía server như `read` và `update`, với API đọc/ghi có xác thực, phân quyền và kiểm tra dữ liệu.
3. Thêm trang quản lý vào nhóm cài đặt hiện có. Chặn truy cập bằng quyền đọc cài đặt và chặn lưu bằng quyền cập nhật.
4. Cho người dùng chỉ đọc xem giá trị, giữ bản nháp khi thất bại và hiển thị giá trị thực sự đã lưu sau khi thành công. Phân quyền độc lập cho mọi thao tác ghi phía server.
5. Cho báo cáo và job nền dùng cài đặt, với hành vi rõ ràng về cache, nạp lại và bản ghi lịch sử.

Trang cài đặt thường kiểm tra resource `settings` thay vì `page/access` thông thường. Đăng ký ID resource và các action ở phía server, không chỉ trong khai báo frontend. Làm theo Skill của plugin phân quyền đã cài để có khai báo chính xác.

Đây là mô tả cách triển khai cài đặt thuộc ứng dụng; nó không ngụ ý template có sẵn bảng hay API cho múi giờ báo cáo. Kết nối cơ sở dữ liệu, thông tin xác thực lưu trữ, sao lưu và các thao tác tương tự vẫn thuộc về công cụ triển khai. Một trang có thể hiển thị trạng thái được phép xem và đường dẫn đến các thao tác vận hành hiện có, nhưng không nên có nút Save mà không có tác dụng.

## Kiểm tra kết quả

Kiểm tra giá trị mặc định, ghi đè bằng file, ghi đè bằng biến môi trường và việc từ chối giá trị không hợp lệ. Cấu hình công khai chỉ được chứa các field an toàn cho trình duyệt. Với cài đặt nghiệp vụ, hãy kiểm tra dữ liệu còn sau khi khởi động lại, quyền đọc so với quyền cập nhật và hành vi thực tế của nơi sử dụng sau khi thay đổi.

Tiếp tục với [Trang, route và điều hướng](pages-routes-and-navigation.md), [Đa ngôn ngữ và theme](localization-and-themes.md) và [Kiểm thử và nghiệm thu](testing-and-acceptance.md).
