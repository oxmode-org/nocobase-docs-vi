---
title: Ghi log
---

`@nocobase/logging` cung cấp bản ghi có cấu trúc, nhãn nguồn, đích ghi và luân chuyển log. Trong ứng dụng, phân giải `loggingToken` từ `@nocobase/app-server/logging`.

## Ngữ cảnh nghiệp vụ

```ts
import { loggingToken } from '@nocobase/app-server/logging';
import type { ServiceResolver } from '@nocobase/service-provider';

export function orderLogger(container: ServiceResolver) {
  return container.resolve(loggingToken).getLogger('@example/orders');
}
```

Dùng logger trả về, chẳng hạn `logger.info({ orderId }, 'Order submitted')` hoặc `logger.error({ err: error, orderId }, 'Order submission failed')`. Đặt các trường cần tìm kiếm trong đối tượng để có thể lọc riêng từng trường.

Nguồn truyền vào `getLogger(source)` trở thành trường `logger`. Muốn ghi ra tệp riêng, cấu hình đích riêng cho nguồn. Khi bỏ đối số, nguồn thường là `system`, còn tên gốc tệp mặc định vẫn là `app`.

## Dùng chung log trong ứng dụng và plugin

Truyền `app.container` vào `orderLogger()` từ Provider của ứng dụng hoặc plugin rồi tiêm logger vào dịch vụ nghiệp vụ. Dùng tên package hoặc mô-đun ổn định để lọc theo trường `logger`. Ứng dụng quản lý đích, mức và luân chuyển log, đồng thời đóng dịch vụ dùng chung khi tắt. Plugin dùng dịch vụ theo cấu hình của ứng dụng.

Yêu cầu, tác vụ và lịch có thể có ngữ cảnh khác nhau. Truyền mã nghiệp vụ và mã tương quan khi cần, vì tác vụ nền có vòng đời ngữ cảnh riêng. Kiểm thử nghiệp vụ có thể tiêm logger thay thế ghi lại dữ liệu để kiểm tra trường và nhánh lỗi. Kiểm tra luân chuyển tệp trong bài kiểm thử tích hợp đích ghi.

## Đích ghi

```yaml
logging:
  level: info
  file:
    enabled: true
    name: app
    retentionDays: 7
    maxFileSizeMB: 10
    maxTotalSizeMB: 500
  console:
    enabled: true
    pretty: false
  loggers:
    request:
      file:
        name: request
```

Tệp luôn chứa JSON Lines. `console.pretty` chỉ tác động đến đầu ra terminal. Log ứng dụng nằm trong `storage/logs/` bền vững và dùng chung thư mục cho các nguồn. Ví dụ này ghi yêu cầu vào tệp riêng. Các nguồn khác dùng chung tệp app.

Tệp được luân chuyển khi sang ngày mới theo UTC hoặc chạm giới hạn phân đoạn. Số ngày lưu và tổng dung lượng áp dụng cho các tệp log trong thư mục. Giao mỗi thư mục cho một tiến trình vì trạng thái luân chuyển có phạm vi từng tiến trình. Với ứng dụng do App Host quản lý, chính sách đích ghi và cấu hình gắn danh tính của host được ưu tiên.

## Chẩn đoán và xử lý dữ liệu

Giữ mã tương quan, mã bản ghi nghiệp vụ, nguồn và đối tượng lỗi để lần theo yêu cầu đến tác vụ. Tạm bật debug khi cần chi tiết khởi động hoặc thời điểm bắt đầu yêu cầu, rồi trả về mức phù hợp.

Loại mật khẩu, cookie, token, hồ sơ cá nhân đầy đủ và nội dung tệp khỏi log. Chọn trường cần ghi trước khi cơ chế che dữ liệu tích hợp xử lý bản ghi. Đặt chính sách lưu giữ cho log chẩn đoán và duy trì bản ghi kiểm toán nghiệp vụ lâu dài ở nơi phù hợp.

Host đợi dọn dẹp khi tắt. Mã độc lập tự quản lý vòng đời. Giữ thư mục log trong quá trình triển khai và theo dõi dung lượng đĩa.

## Giao diện và phần triển khai

- [Cấu hình và hành vi ghi log](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/logging/README.md)
- [Hợp đồng dịch vụ của host](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/app/app-server/src/logging/token.ts)
