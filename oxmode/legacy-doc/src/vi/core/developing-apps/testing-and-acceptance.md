---
title: Kiểm thử và nghiệm thu
description: Chọn kiểu test cho cơ sở dữ liệu, API và trang, rồi kiểm chứng kết quả nghiệp vụ với quyền thật và luồng thao tác thật trên trình duyệt.
---

Test cần xác lập được hành vi nghiệp vụ: dữ liệu được lưu, dữ liệu đầu vào sai không được ghi, quyền không bị vượt qua, và người dùng có thể khôi phục sau khi thất bại. Kiểu dữ liệu và bản build chỉ chứng minh được một phần; chúng không thay thế được kiểm tra với cơ sở dữ liệu và tương tác thật.

Hướng dẫn này dùng ví dụ npm đã phát hành trong [Xây ứng dụng đầu tiên](../tutorials/build-your-first-feature.md): template mặc định `1.0.0-beta.81`, API `tasks` và cách bố trí test của nó. Các chương về ví dụ dự án lịch sử dùng bảng và cấu hình kiểm thử khác; hãy theo mốc ban đầu được ghi trong đó khi chạy các ví dụ ấy.

## Cùng Agent

```text
Hãy kiểm tra việc lưu công việc, quyền theo vai trò và tương tác trên trang, và bổ sung các test tự động còn thiếu.
Dùng dữ liệu kiểm thử riêng, giữ nguyên dữ liệu nghiệp vụ hiện có, sửa các vấn đề bạn phát hiện, và báo cáo những gì đã qua và những gì chưa kiểm chứng.
```

## Không dùng Agent

### Chọn tầng test theo hành vi

| Hành vi cần chứng minh | Test phù hợp | Thay thế không đủ |
| --- | --- | --- |
| Tính toán hoặc biến đổi thuần túy | Unit test | Khởi động cả ứng dụng mà không kiểm tra các trường hợp biên |
| Field, ràng buộc, quan hệ, transaction | Cơ sở dữ liệu kiểm thử thật | Mock giá trị trả về của Repository |
| Migration giữ nguyên dữ liệu và rollback có chủ đích | `describeMigration()` | Chỉ import file hoặc chỉ test trên cơ sở dữ liệu trống |
| Xác thực, phân quyền, kiểm tra dữ liệu, lưu trữ | Test endpoint thật của ứng dụng | Gọi một hàm bỏ qua middleware |
| Form, trạng thái tải, lỗi, thử lại | Component thật trong môi trường test của ứng dụng | Thay toàn bộ hook API, dịch và phân quyền |
| Lịch sử, focus, luồng qua nhiều trang | Test trên trình duyệt | Kiểm tra vị trí layout trong jsdom |

Dùng tầng nhỏ nhất chứng minh được hành vi. Phân quyền và lưu trữ cần service thật. Lỗi mạng có kiểm soát có thể dùng transport fixture trong test component, nhưng các test đó không chứng minh được phân quyền phía server.

### Tổ chức file và môi trường

Đặt test nghiệp vụ trong `tests/`, sắp theo phần mã mà chúng kiểm chứng:

```text
tests/
├── cli/          # Lệnh của ứng dụng (khi cần)
├── client/       # Trang, component và hành vi phía client
├── database/     # Repository và migration
├── fixtures/     # Dữ liệu kiểm thử và tài nguyên fixture
├── helpers/      # Helper dùng chung cho test
├── playwright/   # Luồng trên trình duyệt với ứng dụng đang chạy
├── project/      # Cấu hình, quy tắc mã nguồn và build
├── server/       # API, service và phân quyền
└── setup/        # Thiết lập môi trường test
```

Template hiện tại định nghĩa hai project trong `vitest.config.ts`: `node` tìm test trong `tests/{server,database,cli,project}/`, còn `client` tìm `tests/client/` với môi trường React/jsdom. `tests/playwright/` dùng cấu hình Playwright riêng. Giữ nguyên alias, setup và cơ chế tách biệt cơ sở dữ liệu; chỉ tạo thư mục thì không cấu hình được việc tìm test.

Chạy từ thư mục ứng dụng:

```bash
pnpm test
```

Lệnh này chạy các project Vitest, không chạy test trình duyệt. Ứng dụng cũ hơn có thể dùng `tests/logic/`, `tests/components/` hoặc `vitest.tutorial.config.ts`; hãy theo cấu hình của phiên bản đó và đối chiếu quy tắc tìm test khi nâng cấp template.

### Chọn fixture cơ sở dữ liệu và ứng dụng thật

Các điểm vào thường dùng của `@nocobase/app-testing` là `/server`, `/client` và `/cli`; không có export riêng cho `/database` hay `/playwright`.

| Công cụ | Dùng cho | Lưu ý |
| --- | --- | --- |
| `createDatabaseTest()` | Repository và transaction mà không khởi động ứng dụng | Cung cấp migration; Provider của plugin không được tự động ghép vào |
| `describeMigration()` | Áp dụng, rollback và áp dụng lại | Kiểm tra dữ liệu cũ; đừng sửa migration đã merge |
| `createAppTest()` | Route, plugin, đăng nhập và phân quyền thật | Lưu trữ tách biệt; thường mỗi file test một ứng dụng |
| `createTestApp()` | Vòng đời ứng dụng điều khiển thủ công | Đóng trong `finally` |
| `renderWithApp()` | Component dùng các service client thật của ứng dụng | Giữ hook, định tuyến và bản dịch thật; chỉ kiểm soát các ranh giới transport cần thiết |

Fixture cơ sở dữ liệu chọn dialect qua `NOCOBASE_TEST_DB_DIALECT`, mặc định là SQLite. Đừng cố định `:memory:` hay một driver để bỏ qua fixture. Dùng `expectCollection()` để kiểm tra schema thay vì các bảng nội bộ riêng của từng dialect.

Với ràng buộc, truy vấn hay hiệu năng của cơ sở dữ liệu production, hãy test trên cơ sở dữ liệu đích với khối lượng dữ liệu đại diện. Các ca nhỏ trên SQLite không xác lập được kế hoạch thực thi hay hiệu năng trên cơ sở dữ liệu khác.

### Kiểm chứng việc lưu qua API thật

Ví dụ tối giản này có thể đặt trong `tests/server/tasks-persistence.test.ts` khi đã có endpoint công việc. Nó khởi động ứng dụng, đăng nhập qua route thật, tạo một công việc và đọc lại thay vì mock kết quả từ cơ sở dữ liệu:

```ts
import { randomUUID } from 'node:crypto';
import { expect } from 'vitest';
import { createAppTest } from '@nocobase/app-testing/server';
import {
  DEFAULT_ADMIN_CREDENTIALS,
  signIn,
} from '@nocobase/app-plugin-authentication/testing';
import { createStandaloneServer } from '../../server/standalone.js';

const test = createAppTest({
  createServer: createStandaloneServer,
  connections: ['main'],
  config: {
    app: { publicOrigin: 'http://localhost' },
    auth: {
      secret: 'tutorial-test-secret-at-least-32-characters',
      advanced: { disableOriginCheck: false, disableCSRFCheck: false },
    },
    users: { initialAdmin: DEFAULT_ADMIN_CREDENTIALS },
    logging: { enabled: false },
  },
});

test('persists a task through the real API', async ({ testApp }) => {
  expect((await testApp.request('/tasks')).status).toBe(401);
  const admin = await signIn(testApp, DEFAULT_ADMIN_CREDENTIALS);
  const title = `Persistence ${randomUUID()}`;
  const created = await admin.fetch('/tasks', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'http://localhost' },
    body: JSON.stringify({ title }),
  });
  expect(created.status).toBe(201);
  const { data: task } = (await created.json()) as { data: { id: string } };

  const list = await admin.fetch(`/tasks?q=${encodeURIComponent(title)}`);
  expect(list.status).toBe(200);
  expect(await list.json()).toMatchObject({
    data: expect.arrayContaining([
      expect.objectContaining({ id: task.id, title }),
    ]),
  });
});
```

Khóa bí mật cố định và thông tin đăng nhập quản trị viên chỉ thuộc về cấu hình kiểm thử tách biệt này. Fixture xử lý request ngay trong tiến trình mà không mở cổng nào cho trình duyệt truy cập. Nếu `tests/server/tasks.test.ts` đã bao quát hành vi này, hãy mở rộng nó thay vì sao chép ví dụ.

Ví dụ này xác lập việc từ chối khi chưa đăng nhập và việc lưu của quản trị viên, chưa phải phạm vi dữ liệu của người dùng thông thường. Hãy tạo người dùng riêng và vai trò rõ ràng, đăng nhập qua service thật, thử các request được phép và bị từ chối, và xem trạng thái cơ sở dữ liệu sau khi thất bại.

### Kiểm chứng migration và transaction

Áp dụng các migration lịch sử và chèn một công việc cũ trước khi test migration mới. Kiểm tra các field được giữ nguyên, giá trị mặc định và ràng buộc, rồi rollback và áp dụng lại như thiết kế. Xem [Mô hình dữ liệu và migration](data-models-and-migrations.md) để có mã đầy đủ. Dữ liệu bị `down()` bỏ đi không tự khôi phục; hãy kiểm chứng rõ phần dữ liệu mất đi có chủ đích.

Với transaction, ghi trước, gây ra một lỗi ở bước sau, rồi đọc lại bên ngoài transaction để chứng minh các lần ghi trước đã được rollback. Chỉ kiểm tra có exception không xác lập được rằng không có dữ liệu dở dang nào được lưu.

### Kiểm chứng component và tương tác

Import trang hoặc component thật và cung cấp các service client bằng `renderWithApp()`. Giữ nguyên bản dịch, API client, định tuyến và hook phân quyền. Trong ví dụ hiện tại, `tests/client/tasks.test.tsx` dùng `tests/helpers/authenticated-client.tsx` để kết nối với một ứng dụng kiểm thử, cơ sở dữ liệu và phiên đăng nhập thật. `tests/client/page-harness.test.tsx` của template minh họa các helper chung để test trang.

Dùng `answerApi()` khi request đang chờ, lỗi mạng hay thử lại cần phản hồi HTTP có kiểm soát. Bổ sung các năng lực jsdom còn thiếu như `ResizeObserver` tại ranh giới đó, nhưng kiểm chứng layout trên trình duyệt thật. Đừng thay thế chính hành vi nghiệp vụ đang được test.

Kiểm tra các hành vi người dùng nhìn thấy: lỗi của field và focus, giữ lại dữ liệu đã nhập, chống gửi trùng, thử lại và cập nhật danh sách sau khi thành công. Chỉ dựa vào số lần gọi nội bộ và snapshot toàn trang là tiêu chí nghiệm thu kém.

### Kiểm chứng luồng trên trình duyệt và phân quyền

Khởi động một ứng dụng kiểm thử riêng và dùng tài khoản quản trị viên kiểm thử của riêng nó:

```bash
pnpm exec playwright install chromium
TUTORIAL_ORIGIN=http://127.0.0.1:13000 \
TUTORIAL_USERNAME='your-test-admin' TUTORIAL_PASSWORD='your-test-password' \
pnpm test:e2e
```

`tests/playwright/tasks.test.ts` hiện tại dùng giao diện tiếng Anh. `TUTORIAL_ORIGIN` chỉ chứa scheme, host và cổng thực tế; script tự thêm `/main`. Nó khác với `APP_URL` của ví dụ dự án lịch sử. Nếu bạn đổi base path của ứng dụng, hãy cập nhật cả script test. Chỉ cần cài Chromium trước lần chạy đầu tiên.

Test sẽ tạo người dùng và công việc, và một số tài khoản còn lại sau đó. Đừng chạy nhắm vào production hay đưa thông tin đăng nhập vào mã nguồn, ảnh chụp màn hình hay báo cáo.

Nghiệm thu bao gồm:

- Các thao tác được phép vẫn cho kết quả đúng sau khi làm mới hoặc đọc lại.
- Chỉ có quyền truy cập trang không cấp quyền gọi API nghiệp vụ.
- Chỉ có quyền action nghiệp vụ không cấp quyền vào trang; kết quả gọi API trực tiếp theo quyền nghiệp vụ.
- Công việc và dự án ngoài phạm vi không bị lộ, kể cả qua tổng số của danh sách.
- Các quyền cấp trực tiếp và kế thừa của tài khoản thông thường được xem xét, để một vai trò khác không che giấu lỗi từ chối quyền.
- Đang gửi form, lỗi mạng, bản ghi đã bị xóa, quyền đã bị thu hồi và nút Back của trình duyệt đều có hành vi phù hợp.

Khi thay đổi phần khởi tạo quyền, hãy chạy thêm `tests/server/authorization-assignment-safety.test.ts` với các quyền thực tế đã khởi tạo của ứng dụng tách biệt. Nó không thay thế test phân quyền cho từng thao tác.

## Giới hạn phạm vi kiểm tra theo thay đổi

Với thay đổi endpoint công việc, hãy bắt đầu bằng test phía server. Với thay đổi tương tác trên trang, thêm test client và trình duyệt:

```bash
pnpm test --project node tests/server/tasks.test.ts
pnpm test --project client tests/client/tasks.test.tsx
```

Format và lint các file đã thay đổi và chọn project TypeScript sở hữu chúng. Kiểm tra đầu ra build và đường dẫn khi chạy khi thay đổi việc đóng gói, migration hay triển khai. Đừng máy móc chạy `pnpm check` cho toàn ứng dụng sau mỗi chỉnh sửa nhỏ, hay báo không có test, test bị bỏ qua hoặc thiếu môi trường là đã qua.

## Ghi lại bằng chứng nghiệm thu

Ghi lại phạm vi, lệnh và kết quả, các vai trò và quy trình thực sự đã thử, và các trường hợp chưa kiểm chứng kèm lý do. Ảnh chụp màn hình giải thích giao diện; assertion xác lập hành vi. Test thường xuyên không nên chỉ lưu ảnh chụp mà không đánh giá kết quả.

Chỉnh sửa tài liệu thường chỉ cần format, kiểm tra đường dẫn và build trang tài liệu. Khi mã ứng dụng không đổi, chạy lại mọi test nghiệp vụ không thêm bằng chứng nào. Hãy mở rộng kiểm chứng khi có thay đổi mới, thất bại hoặc mối lo cụ thể chưa được bao quát.
