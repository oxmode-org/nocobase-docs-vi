---
title: Migration cơ sở dữ liệu
description: Định nghĩa migration, đổi schema và dữ liệu cũ qua Migration Context, quản lý thứ tự, transaction, rollback và checksum.
---

Migration ghi lại một thay đổi cố định về schema hoặc dữ liệu cũ. Ứng dụng và plugin dùng chung API `defineMigration()`. Xem [Tạo bảng và khởi tạo dữ liệu](../../developing-apps/data-models-and-migrations.md) và [Tài nguyên cơ sở dữ liệu của plugin](../../extension-development/database-and-migrations.md) để biết vị trí tệp và cách tích hợp.

## Định nghĩa migration

Lưu migration thêm ghi chú vào Collection `orders` thành `202611040010_add_order_note.ts`.

```ts
import { defineMigration } from '@nocobase/db';

export default defineMigration({
  name: '202611040010_add_order_note',
  async up({ builder }) {
    await builder.alterCollection('orders', (c) => {
      c.text('note').nullable();
    });
  },
  async down({ builder }) {
    await builder.dropField('orders', 'note');
  },
});
```

`defineMigration()` đánh dấu và trả về định nghĩa. Trình chạy thực thi định nghĩa sau. Trình nạp yêu cầu xuất mặc định đúng giá trị trả về, với `name` khớp tên tệp bỏ phần mở rộng. Đặt `up` và `down` trong định nghĩa này.

| Tùy chọn | Công dụng |
| --- | --- |
| `name` | Duy nhất trên mọi nguồn migration của kết nối và quyết định thứ tự |
| `up(context)` | Phần triển khai thay đổi bắt buộc |
| `down(context)` | Đảo thao tác. Xóa trường hoặc bảng cũng xóa dữ liệu tương ứng |
| `irreversible` | Đặt `true` khi không thể đảo an toàn. Chọn tùy chọn này hoặc `down` |
| `transaction` | `true`, `false` hoặc mặc định `'auto'` |
| `shouldRun(context)` | Trả boolean để kiểm tra có cần chạy migration đang chờ hay không |

Cung cấp `down()` hoặc `irreversible: true`. Giữ migration độc lập với các mô hình, dịch vụ và schema dùng chung có thể thay đổi. Khai báo trường, index và ràng buộc cố định ngay trong migration.

## Dùng Migration Context

`up()`, `down()` và `shouldRun()` nhận `MigrationContext`. Lấy những thành phần tác vụ cần.

| Thành phần | Công dụng và phạm vi |
| --- | --- |
| `builder` | Đổi schema và metadata mô hình. Xem [Bảng và trường](schema.md) |
| `query` | Đọc dòng và sửa dữ liệu theo tập hợp. Đây là công cụ dữ liệu thông thường của migration |
| `repository(name)` | Dùng codec, tùy chỉnh tên Collection và thao tác ghi quan hệ |
| `connection` | `name`, `driver`, `dialect`, `capabilities` và `client()` cấp thấp |
| `config` | Đọc cấu hình qua `get()` |
| `container` | Trình phân giải dịch vụ giới hạn do bên sở hữu tác vụ cung cấp |
| `configuration`, `parameters` | Thiết lập áp dụng tùy chọn và tham số đích cố định từ nguồn |

`connection` trong context chỉ cung cấp giao diện giới hạn. Dùng `repository()`, `builder` và `query` ở cấp cao nhất của context để trình chạy gắn chúng với kết nối và transaction của tác vụ. Repository từ DatabaseManager bên ngoài có thể ghi ngoài transaction đó.

`repository()` trong migration phân giải mô hình tại thời điểm chạy. Chỉ dùng khi Query không diễn đạt đúng thao tác và ghi rõ lý do trong chú thích mã. Với `down()` và cập nhật cả bảng, dùng thao tác schema hoặc truy vấn theo tập hợp phù hợp. Ghi qua Repository của context trong migration và Seed không phát sự kiện ghi runtime. Hoàn thiện dữ liệu cần thiết ngay trong quy trình cài đặt.

<h2 id="backfill-and-transform-historical-data">Bổ sung và chuyển đổi dữ liệu cũ</h2>

Sửa giá trị cũ bằng migration mới. Ví dụ chỉ đổi cách viết trạng thái cũ và giữ các trạng thái khác.

```ts
import { defineMigration } from '@nocobase/db';

export default defineMigration({
  name: '202611040011_normalize_order_status',
  irreversible: true,
  async up({ query }) {
    await query.updateTable('orders')
      .set({ status: 'draft' })
      .where('status', '=', 'DRAFT')
      .execute();
  },
});
```

Sau khi chạy, `DRAFT` thành `draft`. Các bản ghi khác giữ nguyên. Ví dụ được đánh dấu không thể đảo vì sau khi đổi, các bản ghi `draft` cũ và mới giống nhau. Nếu cần khôi phục, lưu đủ dữ liệu gốc khi thiết kế thay đổi.

Query dùng quy tắc đặt tên của kết nối. Dùng Query cho cập nhật có điều kiện thông thường, và dùng Repository của context khi cần codec Collection hoặc ghi quan hệ. `updateTable()` và `deleteFrom()` yêu cầu điều kiện. Chỉ đặt `allowAllRows()` khi chủ đích thao tác cả bảng.

Với trường bắt buộc mới, trước hết cho phép null, bổ sung giá trị theo quy tắc rõ ràng, kiểm chứng rồi siết thành khác null. Cơ sở dữ liệu rỗng cần đạt cùng schema. Nếu cần dữ liệu trong migration, chuẩn bị ngay trong luồng migration vì Seed của cùng lần chạy diễn ra sau đó.

<h2 id="read-configuration-and-permitted-services">Đọc cấu hình và dịch vụ được phép</h2>

`config.get<T>(key)` đọc cấu hình do trình chạy cấp, trả `undefined` nếu thiếu khóa. Kiểm tra kiểu và giá trị thực tế khi cần. Ví dụ đọc tên quản trị viên ban đầu.

```ts
const username = config.get<string>('users.initialAdmin.username');
```

Khởi động ứng dụng và lệnh cơ sở dữ liệu cung cấp snapshot cấu hình. Trình chạy độc lập mặc định có bộ đọc rỗng nếu chưa được cấu hình. Định danh migration độc lập với cấu hình. Rollback nhận cấu hình ở thời điểm rollback. Giữ định nghĩa schema và thao tác đảo ổn định trước thay đổi cấu hình.

`container` cấp ứng dụng hiện chỉ cho phép `idGeneratorToken` để thao tác dữ liệu có thể sinh ID mới.

```ts
import { idGeneratorToken } from '@nocobase/app-server/id-generator';

// Inside a callback that receives container:
const id = container.resolve(idGeneratorToken).generateString();
```

Giao diện giới hạn này chỉ phân giải dịch vụ được phép. Dùng công cụ của context để truy cập dữ liệu. Bên gọi độc lập tự cấp dịch vụ cần thiết. Vẫn giữ khóa nghiệp vụ ổn định để Seed nhận diện bản ghi cũ.

## Thực thi có điều kiện

Dùng `shouldRun()` khi migration chỉ áp dụng với Collection tùy chọn. Đây là biến thể của ví dụ chuẩn hóa trạng thái. Chọn phiên bản phù hợp với ứng dụng.

```ts
import { defineMigration } from '@nocobase/db';

export default defineMigration({
  name: '202611040012_normalize_optional_order_status',
  irreversible: true,
  async shouldRun({ builder }) {
    return builder.hasCollection('orders');
  },
  async up({ query }) {
    await query.updateTable('orders')
      .set({ status: 'draft' })
      .where('status', '=', 'DRAFT')
      .execute();
  },
});
```

Điều kiện chạy dưới khóa migration, trước transaction của tác vụ, và chỉ nên đọc trạng thái. Trả `false` để bỏ qua mà chưa ghi lịch sử thành công, nên lần sau sẽ kiểm tra lại. Trả `true` cho phép chạy `up()`. Ném lỗi hoặc trả kiểu khác boolean làm lần chạy thất bại. Khi đã có lịch sử thành công, trình chạy bỏ qua mà không đánh giá lại điều kiện.

Khai báo schema bắt buộc tường minh. `db apply --dry-run` chỉ liệt kê tác vụ và không gọi điều kiện, nên migration xuất hiện trong bản xem trước có thể được bỏ qua khi chạy thật.

Chỉ dùng `parameters` của nguồn khi áp dụng cùng một nguồn migration cho các đích cố định khác nhau. Mỗi bộ tham số tạo định danh lịch sử riêng. `configuration` không ảnh hưởng định danh. Migration ứng dụng hoặc plugin thông thường có thể bỏ cả hai. Xem giao diện [MigrationSource](https://github.com/nocobase/nocobase/blob/d04061ee252afbcc2f42cf1d69ab8888e72d604a/packages/libs/db/src/migration/types.ts).

<h2 id="execution-order-history-and-transactions">Thứ tự thực thi, lịch sử và transaction</h2>

Migration ứng dụng và plugin trên cùng kết nối được hợp nhất, kiểm tra trùng tên và sắp theo tên. Chỉ migration chưa có lịch sử thành công mới chạy. Các migration áp dụng trong một lượt có chung số batch. Transaction có phạm vi từng tác vụ.

Hiện cả `transaction: 'auto'` và `true` đều mở transaction trên kết nối, bao gồm `up()` và ghi lịch sử thành công. Với `false`, khi lỗi có thể còn thao tác dở mà chưa có lịch sử thành công. Kiểm tra dialect đích để xác định DDL nào có thể rollback.

Khi có lỗi, trình chạy dừng và giữ migration đã hoàn tất. Lần sau bỏ qua phần đã xong và thử lại phần chưa hoàn tất. Khóa migration tuần tự hóa các trình chạy dùng cùng giao thức khóa. Tính nguyên tử qua nhiều kết nối và tính duy nhất nghiệp vụ cần cơ chế riêng. Xem [Tham chiếu CLI](../../reference/cli.md) để chọn kết nối và cờ.

<h2 id="rollback-and-irreversible-changes">Rollback và thay đổi không thể đảo</h2>

`db rollback` xử lý toàn bộ batch mới nhất, gọi `down()` theo thứ tự ngược rồi xóa lịch sử migration tương ứng. Batch có thể gồm migration ứng dụng và plugin. Trình chạy kiểm tra cả batch trước. Chỉ một migration không thể đảo cũng ngăn rollback bắt đầu.

Xem trước trên cơ sở dữ liệu cô lập nơi cho phép rollback.

```bash
pnpm nocobase db rollback --dry-run
```

Sau khi xác minh phạm vi, chạy bỏ `--dry-run`. Terminal tương tác hỏi xác nhận. Khi chạy không tương tác, cần đặt `--force` tường minh. Rollback dùng transaction theo từng tác vụ.

Rollback migration giữ lịch sử Seed. `db redo` rollback rồi áp dụng migration và Seed đang chờ. Nếu bảng được tạo lại, Seed từng thành công vẫn có thể bị bỏ qua. `db reset` xóa schema do ứng dụng quản lý và lịch sử, rồi cài từ đầu mà không gọi `down()`. Chỉ dùng reset với dữ liệu có thể bỏ. Kiểm thử nâng cấp và khôi phục bản sao lưu theo quy trình riêng.

<h2 id="checksums-and-compiled-artifacts">Checksum và sản phẩm biên dịch</h2>

Khi đã merge hoặc phát hành, giữ nguyên nội dung, tên migration và tên tệp. Đổi định dạng hoặc chú thích cũng làm đổi checksum. Sửa tiếp bằng migration mới sắp sau migration cũ.

Tệp đã chạy mà thay đổi sẽ phát cảnh báo mặc định. `onChecksumMismatch: 'error'` có thể chặn thực thi. `db repair` chỉ cập nhật checksum đã ghi theo tệp hiện tại. Chỉ cân nhắc khi cơ sở dữ liệu đã khớp ngữ nghĩa của mã nguồn. Dùng `db redo` khi phát triển migration chưa merge. Thay đổi đã phát hành cần migration mới.

Quy trình build chuẩn tạo `.manifest.json` sau khi biên dịch migration và Seed để giữ checksum nguồn và kiểm tra sản phẩm sinh ra. Giữ các bước build và manifest hiện có. Nếu thiếu hoặc sai sản phẩm, build lại để đồng bộ. Xem [Build và bàn giao tài nguyên cơ sở dữ liệu](../../extension-development/database-and-migrations.md#build-and-deliver-database-resources) cho plugin.

## Kiểm chứng migration

Ứng dụng và plugin import `describeMigration()` từ `@nocobase/app-testing/server` và cung cấp nguồn migration thật. Chuẩn bị dữ liệu cũ trong `before`, kiểm tra schema và bản ghi sau thay đổi trong `up`, rồi kiểm tra dữ liệu sau đảo trong `down`. Đặt `reversible: false` cho migration không thể đảo.

Helper kiểm tra sự nhất quán giữa schema vật lý và metadata, cùng rollback và áp dụng lại nếu có thể đảo. Tự viết assertion nghiệp vụ, nhất là bảo toàn bản ghi cũ, điều kiện bổ sung dữ liệu, tham chiếu sai và tác động khi xóa. Xem [Kiểm thử cơ sở dữ liệu](../../developing-apps/testing-and-acceptance.md#database-data-and-migrations).

Xem [Phần triển khai trình chạy](https://github.com/nocobase/nocobase/blob/d04061ee252afbcc2f42cf1d69ab8888e72d604a/packages/libs/db/src/migration/migrator.ts) và [Kiểm thử migration](https://github.com/nocobase/nocobase/blob/d04061ee252afbcc2f42cf1d69ab8888e72d604a/packages/libs/db-testkit/tests/integration/migration/migrator.test.ts).
