---
title: Dữ liệu khởi tạo
description: Cài dữ liệu mặc định bằng defineSeed, xử lý bản ghi có sẵn, cấu hình, dữ liệu mẫu, lịch sử và thử lại.
---

Seed cài các bản ghi ban đầu mà ứng dụng hoặc plugin cần, chẳng hạn trạng thái và danh mục mặc định. Đổi schema và bổ sung dữ liệu khi nâng cấp bằng [migration](migrations.md). Dịch vụ nghiệp vụ xử lý bản ghi phát sinh hằng ngày, như đơn hàng người dùng tạo.

## Định nghĩa Seed

Ví dụ dùng `orderStatuses` từ [Bảng và trường](schema.md), với `code` là khóa chính và `title` là tên hiển thị. Lưu thành `202611040010_default_order_statuses.ts` trong thư mục Seed của ứng dụng hoặc plugin.

```ts
import { defineSeed } from '@nocobase/db';

export default defineSeed({
  name: '202611040010_default_order_statuses',
  async run(context) {
    const statuses = context.repository('orderStatuses');
    for (const values of [
      { code: 'draft', title: 'Draft' },
      { code: 'paid', title: 'Paid' },
    ]) {
      if (await statuses.findOne({ filter: { code: values.code } })) continue;
      await statuses.createOne({ values });
    }
  },
});
```

`defineSeed()` định nghĩa tác vụ. Trình chạy gọi `run(context)` khi thực thi. Xuất mặc định định nghĩa với `name` khớp tên tệp và duy nhất trên mọi nguồn Seed của cùng kết nối. Có thể đặt `transaction` và `sample`. Seed chỉ có điểm thực thi `run()`, không có `down()`, `shouldRun()` hay chế độ chạy lặp.

Sau lần chạy đầu, `draft` và `paid` tồn tại, đồng thời tên của các trạng thái đã có được giữ nguyên. Migration phải tạo schema cần thiết trước.

## Dùng Seed Context

`run()` nhận các thành phần sau.

| Thành phần | Công dụng |
| --- | --- |
| `repository(name)` | Cài bản ghi Collection, với codec trường và thao tác ghi quan hệ |
| `query` | Thực hiện thao tác Repository khó biểu đạt, như đọc bảng vật lý chưa có Collection |
| `connection` | Tên kết nối, dialect, khả năng và `client()` cấp thấp |
| `config` | Đọc cấu hình khởi tạo qua `get()` |
| `container` | Các dịch vụ trình chạy cho phép |

Seed dùng schema đã có. Tạo bảng hoặc trường trong migration trước. `repository()` và `query` dùng kết nối của tác vụ và tham gia transaction nếu được bật. Thực hiện ghi qua những giao diện này để giữ đúng phạm vi tác vụ.

`connection` chỉ cung cấp giao diện giới hạn. Dùng `context.repository()` và để trình chạy quản lý transaction. `config` và `container` có cùng ranh giới cấp ứng dụng như [Migration Context](migrations.md#read-configuration-and-permitted-services). Ghi qua Repository của context không phát sự kiện thay đổi runtime.

## Thêm bản ghi thiếu hoặc cập nhật bản ghi đã có

Xác định dữ liệu nào thuộc quyền quản lý của bước khởi tạo. Ví dụ đầu chỉ điền bản ghi còn thiếu và giữ chỉnh sửa của người dùng. Nếu ứng dụng yêu cầu khôi phục tên cố định của trạng thái hệ thống, dùng đoạn sau.

```ts
await context.repository('orderStatuses').upsertOne({
  filter: { code: 'draft' },
  create: { code: 'draft', title: 'Draft' },
  update: { title: 'Draft' },
});
```

`create` xử lý bản ghi còn thiếu. `update` xử lý bản ghi đã có. Cách này đặt lại tên thành `Draft`, nên chỉ dùng khi quản trị viên không được tùy chỉnh tên. Tạo Seed mới để đổi dữ liệu ở phiên bản sau. Giữ nguyên tệp đã chạy thành công.

Lịch sử thành công giúp lúc khởi động bỏ qua Seed đã chạy. Tính idempotent nghiệp vụ giúp dữ liệu không bị trùng nếu logic chạy lại. Duy trì cả hai cơ chế và bảo vệ khóa nghiệp vụ bằng ràng buộc duy nhất. Kiểm tra trước khi chèn vẫn có thể gặp tranh chấp khi chạy đồng thời. Để xung đột làm tác vụ thất bại, điều tra rồi thử lại.

## Đọc cấu hình khởi tạo

Đọc và kiểm tra mặc định có thể cấu hình trong `run(context)`. Đoạn sau thay tên cố định `Draft`.

```ts
const title = context.config.get<unknown>('orders.initialDraftTitle') ?? 'Draft';
if (typeof title !== 'string' || title.trim().length === 0 || title.length > 100) {
  throw new Error('orders.initialDraftTitle must be a non-empty string of up to 100 characters.');
}
const statuses = context.repository('orderStatuses');
if (!(await statuses.findOne({ filter: { code: 'draft' } }))) {
  await statuses.createOne({ values: { code: 'draft', title } });
}
```

`orders.initialDraftTitle` là khóa ví dụ do ứng dụng quản lý. Khai báo trong [cấu hình](../../developing-apps/configuration-and-settings.md) nếu cần. Khi không có giá trị, ví dụ dùng `Draft`. Tham số kiểu của `config.get<T>()` cần đi cùng bước kiểm tra giá trị thực tế.

Thay cấu hình sau khởi tạo có hiệu lực với những lần thực thi phù hợp. Seed đã thành công vẫn được bỏ qua và chỉnh sửa của người dùng được giữ. Với thiết lập cần tiếp tục chỉnh sửa, cung cấp điểm quản trị nghiệp vụ.

<h2 id="required-data-and-optional-samples">Dữ liệu bắt buộc và dữ liệu mẫu tùy chọn</h2>

Trạng thái mặc định là dữ liệu nghiệp vụ bắt buộc. Đánh dấu đơn hàng giả lập để khám phá bằng `sample: true`. Ví dụ dùng [bảng đơn hàng](schema.md). Lưu thành `202611040011_sample_order.ts`.

```ts
import { defineSeed } from '@nocobase/db';

export default defineSeed({
  name: '202611040011_sample_order',
  sample: true,
  async run(context) {
    const orders = context.repository('orders');
    if (await orders.findOne({ filter: { orderNo: 'SAMPLE-001' } })) return;
    await orders.createOne({
      values: {
        orderNo: 'SAMPLE-001',
        status: 'draft',
        amount: '12.50',
        customerId: null,
        createdAt: new Date('2026-10-01T00:00:00Z'),
      },
    });
  },
});
```

Seed thông thường vẫn chạy kể cả khi bản ghi trông giống dữ liệu mẫu. Ứng dụng tự chạy Seed mẫu khi `app.sampleData: true` và kết nối được cài mới. Kết nối được coi là mới nếu chưa có lịch sử migration hoặc Seed trước khi chạy, hoặc vừa được dựng lại qua reset schema do ứng dụng quản lý. Trường hợp khác được ghi `skipped`. Bật cấu hình sau đó cần nạp mẫu tường minh. Khi gọi Seeder cấp thấp trực tiếp, dùng `sample.enabled`.

Để nạp mẫu đã bị bỏ qua, chạy từ thư mục ứng dụng phát triển.

```bash
pnpm nocobase db sample
```

Lệnh xử lý Seed mẫu đã bỏ qua và dịch vụ dữ liệu mẫu đã đăng ký. Chạy lệnh từ mã nguồn phát triển vì bản triển khai từ chối lệnh này. Mẫu cần dịch vụ nghiệp vụ của plugin khác nên dùng `sampleDataToken` để sinh sau khi ứng dụng sẵn sàng. Xem [Tài nguyên cơ sở dữ liệu của plugin](../../extension-development/database-and-migrations.md#write-migrations-and-initial-data).

## Lịch sử, transaction và thử lại

Seed trên một kết nối chạy theo thứ tự tên, sau migration trong kế hoạch cơ sở dữ liệu. Mặc định `transaction: 'auto'` và `true` mở một transaction cho mỗi Seed, commit dữ liệu cùng lịch sử thành công. Ném lỗi để rollback transaction và cho phép lần chạy sau thử lại. Các Seed đã hoàn tất trước đó vẫn được giữ.

`transaction: false` có thể để lại dữ liệu ghi dở khi lỗi. Chỉ dùng khi cần và định nghĩa quy trình khôi phục. Trả về bình thường từ `run()`, kể cả `return` sớm, được ghi là thành công. Ném lỗi khi thiếu cấu hình bắt buộc hoặc điều kiện tiên quyết để có thể thử lại.

Seed không có điểm rollback. Rollback migration cũng giữ lịch sử Seed. Sửa tệp đã chạy thành công làm lệch checksum và Seed vẫn được bỏ qua. Xem [Migration](migrations.md#checksums-and-compiled-artifacts) để biết quy tắc lịch sử, checksum và khôi phục.

## Kiểm chứng khởi tạo

Dùng cơ sở dữ liệu thật cô lập để kiểm tra cài trên dữ liệu rỗng, khóa nghiệp vụ đã tồn tại, chỉnh sửa người dùng được giữ và thử lại. Gọi Seeder lần nữa để kiểm chứng việc bỏ qua theo lịch sử. Trong bài kiểm thử riêng, cố ý chạy lại logic `run()` để kiểm chứng tính idempotent nghiệp vụ.

Để kiểm tra lỗi, ném lỗi sau khi ghi rồi xác nhận cả bản ghi và lịch sử thành công đều chưa tồn tại. Bỏ điều kiện gây lỗi và kiểm tra lần chạy sau thành công. Kiểm thử dữ liệu mẫu khi bật, khi tắt và khi nạp sau. Xem [Kiểm thử cơ sở dữ liệu](../../developing-apps/testing-and-acceptance.md#database-data-and-migrations).

Xem [Giao diện Seed](https://github.com/nocobase/nocobase/blob/d04061ee252afbcc2f42cf1d69ab8888e72d604a/packages/libs/db/src/seed/types.ts), [Phần triển khai trình chạy](https://github.com/nocobase/nocobase/blob/d04061ee252afbcc2f42cf1d69ab8888e72d604a/packages/libs/db/src/seed/seeder.ts) và [Kiểm thử Seed](https://github.com/nocobase/nocobase/blob/d04061ee252afbcc2f42cf1d69ab8888e72d604a/packages/libs/db-testkit/tests/integration/seed/seeder.test.ts).
