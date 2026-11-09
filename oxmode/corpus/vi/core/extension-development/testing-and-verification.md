---
title: Kiểm thử và kiểm chứng plugin
description: Kiểm tra hành vi ở từng phạm vi, từ plugin đến tích hợp trong ứng dụng và đóng gói phát hành.
---

Một plugin có thể vượt qua bài kiểm thử riêng nhưng vẫn cần được đăng ký và kiểm chứng trong luồng người dùng của ứng dụng đích. Kiểm tra theo phạm vi thay đổi. Bắt đầu từ plugin, chạy luồng trong ứng dụng và kiểm tra nội dung gói nếu phát hành.

## Cùng Agent

```text
Thêm bài kiểm thử hành vi cho plugin, bao phủ trường hợp thành công, đầu vào sai và giới hạn quyền truy cập.
Dùng phần triển khai thực tế và khai báo plugin thật.
Tách kiểm tra component, API và ứng dụng. Chạy kiểm tra plugin và build ứng dụng,
rồi báo các luồng người dùng đã kiểm chứng và các luồng còn cần kiểm chứng.
```

## Vị trí bài kiểm thử

Công cụ tạo plugin sinh bài kiểm thử và cấu hình Vitest theo năng lực đã chọn. Giữ phạm vi môi trường Node và jsdom theo từng nhóm kiểm thử.

| Thư mục | Môi trường và công cụ | Phạm vi |
| --- | --- | --- |
| `tests/server/` | Node, `@nocobase/app-testing/server` | API, dịch vụ và tích hợp server |
| `tests/database/` | Node, cùng điểm vào kiểm thử server | Migration, metadata và thao tác trên cơ sở dữ liệu thật |
| `tests/client/` | jsdom, `@nocobase/app-testing/client` | Component, bản dịch, tương tác và hợp đồng yêu cầu |
| `tests/cli/` | Node, `@nocobase/app-testing/cli` | Đối số, đầu ra, lỗi và hành vi lệnh |
| Kiểm thử trình duyệt của ứng dụng | Cấu hình trình duyệt hiện có của ứng dụng | Đăng nhập, điều hướng, tải lại và tương tác API thật |

Khai báo `@nocobase/app-testing` trong `devDependencies`. Kiểm tra dependency đã sinh và các điểm xuất công khai của bản đã cài. Dùng điểm vào server cho bài kiểm thử cơ sở dữ liệu và dùng cấu hình trình duyệt của ứng dụng cho Playwright. Package hiện không xuất `/database` hoặc `/playwright`.

## Kiểm thử phần triển khai thực tế

[Route và HTTP API](server-apis.md) gọi `createRouter()` từ khai báo thực tế để kiểm tra thành công, đầu vào sai và tài liệu API. [Tài nguyên cơ sở dữ liệu và migration](database-and-migrations.md) dùng Migrator thật để áp dụng, rollback và áp dụng lại. [Mở rộng dòng lệnh](extend-command-line.md) dùng `bindAppCommand()` và `runAppCommand()` để kiểm chứng đầu ra.

Import route, dịch vụ và mô hình thật vào bài kiểm thử để các assertion chạy trên đúng phần triển khai ứng dụng sử dụng.

Nếu Provider chỉ dùng container, cho nó nhận giao diện hẹp và đầy đủ `{ container: ServiceContainer }`. Khi đó có thể cung cấp container thật trong fixture mà không cần ép kiểu một đối tượng thiếu thuộc tính thành toàn bộ ứng dụng. Với xác thực, cơ sở dữ liệu hoặc vòng đời, dùng fixture ứng dụng và đăng ký các plugin thực tế.

## Phạm vi kiểm thử client

`renderWithApp()` đăng ký plugin client thật và cung cấp dịch vụ, API Client, router và bản địa hóa. Dùng router của helper để tránh lồng thêm `MemoryRouter`. Khi kiểm thử cây route, render component lấy từ khai báo thật. Xem [Trang, route và menu](pages-and-menus.md#5-test-navigation).

Dùng `answerApi()` để thay phản hồi ở ranh giới mạng. Khớp cả phương thức lẫn đường dẫn tương đối với API. Trả lỗi cho yêu cầu ngoài dự kiến để phát hiện đường dẫn sai hoặc lời gọi thừa.

Đây là mẫu kiểm thử cho trang hiện có. Thay `Page` và factory plugin bằng các mô-đun thật.

```tsx
const calls: { method: string; path: string }[] = [];
await renderWithApp(<Page />, {
  plugins: [plugin()],
  locale: 'zh-CN',
  fetch: answerApi((call) => {
    calls.push({ method: call.method, path: call.path });
    if (call.method === 'GET' && call.path === 'announcements') {
      return { data: [], meta: { total: 0 } };
    }
    return new Response(null, { status: 404 });
  }),
});
expect(await screen.findByText('暂无公告。')).toBeInTheDocument();
expect(calls).toEqual([{ method: 'GET', path: 'announcements' }]);
```

`answerApi()` chuyển ngoại lệ trong handler thành phản hồi HTTP 500. Đặt assertion ngoài handler để lỗi assertion hiện trực tiếp trong kết quả kiểm thử. Dùng `findBy...` hoặc `waitFor()` để đợi UI bất đồng bộ. Thực hiện tương tác bên ngoài callback có thể chạy lại của `waitFor()`. Chủ động điều khiển thời điểm phản hồi hoàn tất để kiểm tra trạng thái tải.

## Truy cập và dọn dẹp

Kiểm tra riêng người chưa đăng nhập, người đã đăng nhập nhưng bị từ chối, và người có quyền. Với tính năng giới hạn theo tenant hoặc bản ghi, kiểm tra thêm truy cập chéo người dùng và chéo bản ghi. Kiểm tra quyền ghi ở server kể cả khi nút tương ứng đã ẩn ở client.

Fixture cần dọn cơ sở dữ liệu, thư mục tạm, lượt đăng ký và instance ứng dụng do nó sở hữu. Dùng `finally` cho tài nguyên tạo trực tiếp. Dùng cơ sở dữ liệu kiểm thử riêng và giữ các bước kiểm tra lỗi khi sửa bộ kiểm thử.

## Chạy đúng phạm vi

Với `notice-api`, chạy từ gốc ứng dụng.

```bash
pnpm --filter @nocobase/app-plugin-notice-api exec vitest run tests/server/routes.test.ts
pnpm --filter @nocobase/app-plugin-notice-api check
pnpm build
```

Chạy bài kiểm thử tập trung trước, rồi chạy `check` của plugin và các bước kiểm tra ứng dụng bị ảnh hưởng. Khi đổi migration, chạy tuần tự các bộ kiểm thử tích hợp cơ sở dữ liệu. Với thay đổi chỉ ở nội dung chữ, chọn kiểm tra theo phạm vi ảnh hưởng.

Nếu đã tạo plugin bằng `--no-install`, cài dependency trước. Khi dùng `--passWithNoTests`, kiểm tra danh sách tệp và ca thực tế đã chạy để xác nhận phạm vi bao phủ.

## Trước khi bàn giao

| Thay đổi | Kiểm chứng bổ sung |
| --- | --- |
| Trang client | Truy cập sau đăng nhập, URL trực tiếp, tải lại và lịch sử trình duyệt |
| API server | Tiền tố gắn ứng dụng, xác thực, phân quyền, lỗi và tài liệu API |
| Migration | Cài mới, nâng cấp dữ liệu cũ và checksum của sản phẩm biên dịch |
| CLI | Lệnh đã đăng ký trong ứng dụng và lệnh trong bản triển khai |
| Điểm xuất công khai hoặc phát hành | Dùng qua điểm vào công khai. Kiểm tra dist, tài nguyên và Skill trong gói tarball |

Báo lệnh chính xác, kết quả và phạm vi còn lại. Ví dụ, bài kiểm thử component và router đã đạt, build ứng dụng thành công, còn luồng đăng nhập trên trình duyệt cần chạy. Dùng `plugin inspect` để xem đăng ký tĩnh và chạy riêng các luồng cần kiểm chứng hành vi.
