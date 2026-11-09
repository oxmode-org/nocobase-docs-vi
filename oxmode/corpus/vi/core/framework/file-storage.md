---
title: Lưu trữ tệp và driver
---

`@nocobase/drive` cung cấp các driver lưu trữ. Host cung cấp manager qua `driveManagerToken` từ `@nocobase/app-server/drive`. Plugin tệp bổ sung bản ghi, tải lên, tải xuống và kiểm soát truy cập.

## Cấu hình ổ lưu trữ

```ts
// server/config/drive.ts
import { defineAppConfig } from '@nocobase/app-server/config';
import type { AppDriveConfig } from '@nocobase/drive';

export default defineAppConfig<AppDriveConfig>(({ paths }) => ({
  default: 'local',
  disks: {
    local: {
      driver: 'fs',
      location: paths.storage('files'),
      visibility: 'private',
    },
  },
}));
```

`default` chọn ổ mặc định. `disks` khai báo các ổ có thể dùng. Phân giải manager, chọn `drive.use('local')` rồi gọi phương thức thao tác tệp trên ổ. Cấu hình nghiệp vụ có thể tham chiếu tên ổ, nên cập nhật các tham chiếu khi đổi tên.

| Driver | Thiết lập chính | Công dụng |
| --- | --- | --- |
| `fs` | `location`, `visibility`, `url` tùy chọn | Hệ thống tệp cục bộ hoặc hệ thống tệp dùng chung đã gắn |
| `s3` | Bucket, vùng, thông tin xác thực, endpoint tùy chọn | S3 và dịch vụ tương thích |
| `oss` | Bucket, vùng, thông tin xác thực | Alibaba Cloud OSS, gồm cấu hình RAM Role được hỗ trợ |

Cung cấp thông tin xác thực qua cấu hình server và biến môi trường. Tạo và kiểm tra khóa tệp ở lớp nghiệp vụ. Chỉ chấp nhận đường dẫn do server xác định cho thao tác trên hệ thống tệp.

## Thao tác tệp trong ứng dụng và plugin

Ứng dụng cung cấp cấu hình ổ. Ứng dụng và plugin phân giải cùng token của manager. Hàm sau ghi văn bản nghiệp vụ vào ổ mặc định.

```ts
import { driveManagerToken } from '@nocobase/app-server/drive';
import type { ServiceResolver } from '@nocobase/service-provider';

export async function writeOrderExport(
  container: ServiceResolver,
  key: string,
  content: string,
): Promise<string> {
  const disk = container.resolve(driveManagerToken).use();
  await disk.put(key, content);
  return key;
}
```

Sinh `key` ở server, ví dụ `exports/orders/<id>.csv`, rồi giữ tên ổ và khóa tệp để tra cứu sau. `get(key)` đọc nội dung và `delete(key)` xóa tệp. Kiểm tra quyền nghiệp vụ trước khi tạo bản xuất.

Hàm này chỉ ghi đối tượng lưu trữ. Dùng plugin tệp để tạo bản ghi và xử lý trọn quy trình tải lên và truy cập. Nếu cần URL công khai, cấu hình riêng cách cung cấp URL. Plugin dùng lại cấu hình ổ của host cho các yêu cầu.

## Lưu trữ và truy cập

`visibility: 'private'` là thiết lập của driver. Cấu hình quyền hệ điều hành và bảo vệ thư mục HTTP ở các lớp tương ứng. `url` dùng để dựng URL. Muốn tải xuống qua HTTP, cung cấp endpoint riêng. Driver hệ thống tệp mặc định chưa cung cấp URL ký sẵn để tải lên hoặc tải xuống.

Với tệp riêng tư, dùng API tải xuống có phân quyền của plugin tệp hoặc kiểm tra danh tính và quyền tài nguyên trong route của ứng dụng. Khả năng ký URL cho kho đối tượng phụ thuộc driver.

## Triển khai và kiểm thử

Host chuẩn bị thư mục hệ thống tệp đã cấu hình khi khởi động. Mã độc lập tự chuẩn bị nơi lưu trữ. Nhiều instance cần volume dùng chung hoặc kho đối tượng.

`storage/files` là dữ liệu nghiệp vụ. Sao lưu cùng metadata tệp trong cơ sở dữ liệu. Xóa metadata và xóa đối tượng là hai thao tác riêng. Lập kế hoạch thử lại và dọn đối tượng mồ côi. Kiểm thử bằng ổ tạm hoặc đối tượng giả. Xem [Sử dụng plugin](../using-plugins/overview.md) về tính năng cấp ứng dụng.

## Giao diện và phần triển khai

- [Cấu hình ổ](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/drive/src/types.ts)
- [Tích hợp hệ thống tệp](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/libs/drive/skills/nocobase-drive/references/fs.md)
- [Drive Provider của host](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/drive/provider.ts)
- [Hợp đồng dịch vụ host](https://github.com/nocobase/nocobase/blob/7fb8311d89fb59468d9fac3d6263c3379c8c6083/packages/app/app-server/src/drive/token.ts)
