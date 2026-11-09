---
title: Kết nối và dialect cơ sở dữ liệu
---

Kết nối gắn các năng lực cơ sở dữ liệu logic với một cơ sở dữ liệu và namespace cụ thể. Một manager có thể quản lý nhiều kết nối, mỗi kết nối có dialect, transaction và cách phân giải mô hình riêng.

## Kết nối độc lập

```ts
import { createDatabaseManager } from '@nocobase/db';
import sqlite from '@nocobase/db-sqlite';

const db = createDatabaseManager({
  default: 'main',
  connections: { main: sqlite({ filename: ':memory:' }) },
});
try {
  await db.connect();
  const connection = db.connection('main');
  console.log(connection.dialect);
} finally {
  await db.destroy();
}
```

SQLite trong bộ nhớ phù hợp cho kiểm thử cô lập. Dữ liệu biến mất khi đóng kết nối. Trong production, phân giải manager sẵn có để tái sử dụng pool giữa các yêu cầu.

Khi dùng manager độc lập, cung cấp factory hoặc registry `drivers` tường minh. Runtime ứng dụng nạp bất đồng bộ các dialect chính thức đã cài và được cấu hình trước khi tạo manager.

## Cấu hình ứng dụng và nhiều kết nối

Dùng `database.default` và `database.connections.<name>`, với tài nguyên nằm trong `database/<name>/`. `db.connection('analytics')` và `db.repository('events', 'analytics')` chọn kết nối có tên. Khi bỏ tên, manager dùng kết nối mặc định.

Transaction của một kết nối chỉ commit nguyên tử các thao tác trên kết nối đó. Công việc qua nhiều kết nối cần cơ chế điều phối riêng.

## Cơ sở dữ liệu do ứng dụng quản lý và cơ sở dữ liệu ngoài

`schemaManagement: managed` cho phép framework quản lý schema. Chế độ `external` hạn chế DDL và migration của framework, đồng thời yêu cầu metadata bổ sung. Ứng dụng có thể quản lý metadata ở `database/<connection>/metadata/`. Quyền đọc ghi vẫn do thông tin xác thực cơ sở dữ liệu và policy nghiệp vụ quyết định.

## Khác biệt giữa dialect và chẩn đoán

Tùy dialect, cấu hình tên tệp SQLite, địa chỉ mạng, `serviceName` của Oracle, TLS và dependency native. Trước khi kiểm tra kết nối, xác minh driver đã cài, trường cấu hình và thứ tự ưu tiên biến môi trường. Khi đổi dialect, lập kế hoạch riêng để sửa hoặc chuyển dữ liệu hiện có.

`config check --no-connect` chỉ kiểm tra cấu hình. Kiểm tra kết nối là bước riêng với chạy migration. Xem [Cấu hình](../../reference/configuration.md) và [Hỗ trợ cơ sở dữ liệu](../../reference/compatibility.md).

Xem [Nhiều kết nối cơ sở dữ liệu](../../developing-apps/multiple-databases.md) để thêm kết nối và [Kết nối cơ sở dữ liệu có sẵn](../../developing-apps/existing-databases.md) để cấu hình chế độ ngoài, tệp metadata và các bước làm mới.

## Giao diện và phần triển khai

- [Tạo manager](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/db/docs/zh-CN/database/create-database-manager.md)
- [Cấu hình kết nối](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/database/types.ts)
