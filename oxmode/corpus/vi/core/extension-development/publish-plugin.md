---
title: Build và phát hành plugin
description: Build và triển khai plugin cục bộ cùng ứng dụng, hoặc phát hành lên registry npm riêng để ứng dụng khác sử dụng.
---

**Plugin cục bộ có thể được bàn giao cùng ứng dụng.** Đặt plugin dưới `packages/`, kết nối bằng dependency workspace và đăng ký runtime. Khi build ứng dụng, công cụ build dependency cục bộ, thu thập sản phẩm plugin cần bàn giao vào `dist/vendor/` và chuẩn bị dependency triển khai. Sau đó triển khai ứng dụng theo quy trình thông thường.

Phát hành package khi nhiều ứng dụng hoặc nhóm cần dùng chung plugin và muốn tự chọn phiên bản cùng lịch nâng cấp. Hướng dẫn tiếp tục ví dụ thông báo trong [Viết plugin đầu tiên](write-your-first-plugin.md), phát hành plugin lên registry npm riêng rồi cài vào ứng dụng khác.

Mã nguồn có thể tiếp tục nằm trong workspace ban đầu. Ứng dụng gốc dùng mã cục bộ, còn ứng dụng khác dùng bản đã phát hành.

Để phân phối component hoặc block dưới dạng mã nguồn cho Agent lấy về, sửa và lắp ghép, dùng shadcn UI Registry theo [Phân phối mã nguồn UI](frontend-components.md#optionally-distribute-ui-source-assets). Package và tài nguyên mã nguồn có thể phát hành độc lập. Component dùng qua điểm xuất package có thể tái sử dụng trực tiếp.

## Cùng Agent

Thay URL trong ví dụ bằng địa chỉ registry của nhóm.

```text
Chuẩn bị plugin thông báo của ứng dụng này dưới tên @my-company/app-plugin-announcements.
Kiểm tra và build plugin, rồi phát hành phiên bản 0.1.0 lên https://npm.example.com/.
Cài, đăng ký và kiểm chứng phiên bản đó trong một ứng dụng khác.
```

Nếu chưa có registry, nhờ Agent hỗ trợ thiết lập. Cấp thông tin xác thực qua đăng nhập của trình quản lý package hoặc cấu hình thông tin xác thực trong CI. Giữ thông tin đó ngoài yêu cầu và mã nguồn plugin.

## Thực hiện thủ công

### 1. Chuẩn bị registry npm riêng

Nếu nhóm đã có registry riêng, dùng địa chỉ và tài khoản hiện có rồi sang bước tiếp theo. Có thể dùng [Verdaccio](https://www.verdaccio.org/docs/docker/) để tự chạy registry. Ví dụ thực hiện toàn bộ quy trình cục bộ tại `http://localhost:4873/`.

Tạo `config.yaml` trong thư mục riêng.

```yaml
storage: /verdaccio/storage

auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
    max_users: 1000

packages:
  '@my-company/*':
    access: $authenticated
    publish: publisher
    unpublish: publisher
```

Cấu hình chỉ phục vụ `@my-company/*`. Người đã xác thực có thể đọc package. Tài khoản `publisher` có quyền phát hành. Ứng dụng tiếp tục lấy package npm khác từ registry đã cấu hình cho chúng.

Chạy dịch vụ từ thư mục đó và lưu package cùng tài khoản vào Docker volume.

```bash
docker run -d --name team-npm --restart unless-stopped \
  -p 127.0.0.1:4873:4873 \
  -v "$PWD/config.yaml:/verdaccio/conf/config.yaml:ro" \
  -v team-npm-storage:/verdaccio/storage \
  verdaccio/verdaccio:6
```

Tạo tài khoản phát hành. Khi được hỏi, nhập tên người dùng `publisher`, mật khẩu và email.

```bash
npm adduser --registry http://localhost:4873/ --auth-type=legacy
```

Tạo thêm tài khoản đọc khi cần. Khi đã có đủ tài khoản, đặt `max_users` thành `-1` rồi chạy `docker restart team-npm` để tắt tự đăng ký. Tài khoản hiện có vẫn đăng nhập được. Xem [Xác thực Verdaccio](https://www.verdaccio.org/docs/authentication/).

Cấu hình này chỉ truy cập được từ máy hiện tại. Khi dùng trong nhóm, cung cấp endpoint HTTPS và thay mọi `http://localhost:4873/` trong hướng dẫn bằng địa chỉ đó. Sao lưu cấu hình và volume, đồng thời giữ chúng khi thay container.

### 2. Cấu hình registry và đăng nhập

Thêm dòng sau vào `.npmrc` ở **gốc ứng dụng duy trì plugin**.

```ini
@my-company:registry=http://localhost:4873/
```

Giữ các thiết lập hiện có, nhất là registry `@nocobase`. Dùng scope của tổ chức để trình quản lý package tìm plugin nội bộ và dependency NocoBase ở đúng registry.

Tạo tài khoản cũng đăng nhập trên máy hiện tại. Trên máy phát triển khác, chạy:

```bash
npm login --registry http://localhost:4873/ --auth-type=legacy
npm whoami --registry http://localhost:4873/
```

Dùng tài khoản có quyền phát hành, là `publisher` trong ví dụ. Giữ thông tin đăng nhập trong cấu hình người dùng, ngoài commit dự án.

### 3. Chuẩn bị package

Trong ứng dụng duy trì plugin, giữ thư mục `packages/app-plugin-announcements/` và đổi tên package thành `@my-company/app-plugin-announcements`. Nếu tiếp tục từ `@nocobase/app-plugin-announcements`, cập nhật các vị trí sau cùng nhau.

| Vị trí | Thay đổi |
| --- | --- |
| `package.json` của plugin | Đặt `name` theo tên mới, `version` là `0.1.0` và bỏ `private: true` |
| Định nghĩa Client và Server | Đặt `packageName` theo tên mới |
| Kiểm thử và tài liệu plugin | Sửa tên package và namespace dịch trong bài kiểm thử |
| `package.json` của ứng dụng | Đổi khóa dependency cục bộ, giữ `workspace:*` |
| Tệp đăng ký plugin của ứng dụng | Đổi import sang tên mới và giữ đăng ký |

Chạy `pnpm install` để đồng bộ liên kết workspace và lockfile. Khi tạo plugin mới để dùng chung, nhập tên đầy đủ ngay từ đầu theo [Tạo plugin](create-plugin.md#names-and-common-options).

`private: true` chặn phát hành lên mọi registry npm. Sau khi bỏ cờ, quyền đọc và phát hành vẫn do cấu hình registry quyết định. Xem [Trường private của npm](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#private).

| Trường | Kiểm tra |
| --- | --- |
| `publishConfig.registry` | Đặt `http://localhost:4873/` làm đích phát hành tường minh |
| `publishConfig.access` | Bỏ giá trị `public` do khung sinh trong ví dụ này để Verdaccio quản lý quyền |
| `exports`, `imports` | Giữ điểm vào phát triển cục bộ và alias của package |
| `publishConfig.exports`, `publishConfig.imports` | Giữ ánh xạ tới `dist/` để pnpm áp dụng khi đóng gói |
| `files` | Bao gồm `dist/`, Skill và tài nguyên runtime nếu có |
| Khai báo dependency | Đặt phiên bản tương thích với bên sử dụng cho dependency Server, runtime dùng chung và peer Client |

**Thêm registry vào `publishConfig` hiện có và giữ các trường khác.** Xem [Cấu trúc plugin](plugin-structure.md#packagejson-metadata-dependencies-and-public-exports) về ánh xạ khi phát triển và khi phát hành.

Nếu plugin phụ thuộc package workspace khác, bên sử dụng cũng phải cài được package đó. Khi đóng gói, `workspace:*` chuyển thành yêu cầu phiên bản. Phát hành dependency dùng chung trước.

Hoàn thiện README và changelog với năng lực, điểm vào cần đăng ký, phiên bản tương thích và cấu hình bắt buộc. Package phải chạy được bên ngoài ứng dụng gốc qua giao diện công khai và cấu hình của ứng dụng đích.

### 4. Kiểm tra và đóng gói

Chạy từ gốc ứng dụng.

```bash
pnpm --filter @my-company/app-plugin-announcements check
pnpm --filter @my-company/app-plugin-announcements pack \
  --pack-destination ./artifacts
```

`check` chạy lint, kiểm tra định dạng, kiểu, bài kiểm thử và build plugin. `pack` tạo gói để kiểm tra trước khi tải lên. Các lệnh ghi `.tgz` dưới `artifacts/` của ứng dụng. Dùng đường dẫn thực tế in ra. Xem [pnpm pack](https://pnpm.io/cli/pack).

Kiểm tra nội dung và manifest đã đóng gói.

```bash
tar -tzf artifacts/my-company-app-plugin-announcements-0.1.0.tgz
tar -xOf artifacts/my-company-app-plugin-announcements-0.1.0.tgz package/package.json
```

- Điểm vào công khai như `./client` và `./server` trỏ tới tệp biên dịch có trong gói.
- Alias nội bộ của package Client phân giải được. Bản dịch và tài nguyên runtime cần thiết đều có.
- Gói chỉ chứa nội dung plugin cần phân phối. Giữ cấu hình ứng dụng, thông tin xác thực và dữ liệu cục bộ ngoài gói, đồng thời giữ gói sinh ra ngoài Git.

Package thông báo cần `dist/client/`, `dist/server/` và `dist/shared/`. Kiểm thử bản đã phát hành trong một ứng dụng khác để xác nhận package tự hoạt động.

### 5. Phát hành lên registry riêng

Commit thay đổi đã duyệt và dùng nhánh phát hành của nhóm. Từ gốc ứng dụng, xem trước rồi phát hành.

```bash
pnpm --filter @my-company/app-plugin-announcements publish --dry-run
pnpm --filter @my-company/app-plugin-announcements publish
```

Lệnh chỉ phát hành plugin đã chọn đến `publishConfig.registry`. pnpm kiểm tra trạng thái Git và nhánh phát hành. Xử lý thông báo nếu điều kiện chưa đạt. `--dry-run` chỉ xem trước. Bản phát hành mặc định gắn tag `latest`. Xem [pnpm publish](https://pnpm.io/cli/publish).

Tra đúng phiên bản sau khi phát hành.

```bash
npm view @my-company/app-plugin-announcements@0.1.0 version \
  --registry http://localhost:4873/
```

Kết quả phải là `0.1.0`. Sau đó ứng dụng khác có thể chọn cài phiên bản này. Các ứng dụng đã triển khai cập nhật theo quy trình của chúng.

### 6. Cài trong ứng dụng khác

Vào **gốc một ứng dụng khác tạo bằng create-app**. Ứng dụng này cài plugin từ registry và có thể dùng độc lập với thư mục `packages/` của ứng dụng gốc.

Thêm registry cho scope của nhóm vào `.npmrc` ở gốc ứng dụng đích. Tạo tệp nếu cần.

```ini
@my-company:registry=http://localhost:4873/
```

Dùng URL registry riêng mà bên sử dụng truy cập được. Giữ registry mặc định và thiết lập `@nocobase` đã có. Cấu hình registry cài đặt riêng cho ứng dụng đích vì `.npmrc` của ứng dụng phát hành và `publishConfig.registry` chỉ phục vụ phạm vi tương ứng.

Nếu máy hiện tại chưa đăng nhập registry, dùng tài khoản có quyền đọc.

```bash
npm login --registry http://localhost:4873/ --auth-type=legacy
npm whoami --registry http://localhost:4873/
```

`plugin register` gọi trình quản lý package từ gốc ứng dụng, nơi pnpm đọc `.npmrc`. Đặt registry trong tệp này. Lệnh hiện không có tùy chọn `--registry`.

Nếu chính sách tuổi bản phát hành của pnpm chặn package mới, thêm scope nội bộ vào danh sách hiện có trong `pnpm-workspace.yaml`.

```yaml
minimumReleaseAgeExclude:
  - '@my-company/*'
```

Giữ các thiết lập và mục hiện có. Chỉ miễn trừ package do nhóm kiểm soát. Xem [Hướng dẫn pnpm của Verdaccio](https://www.verdaccio.org/docs/setup-pnpm/).

Xem trước kế hoạch, rồi cài và đăng ký đúng phiên bản.

```bash
pnpm nocobase plugin register @my-company/app-plugin-announcements \
  --version 0.1.0 --dry-run
pnpm nocobase plugin register @my-company/app-plugin-announcements \
  --version 0.1.0
```

Trước khi cài, bản xem trước chủ yếu mô tả kế hoạch cài đặt. Sau khi cài, lệnh đọc các điểm vào công khai, ghi đăng ký Client và Server và đồng bộ Skill. Cho phép lệnh tải package từ registry bằng cách giữ bước cài mặc định.

Khởi động ứng dụng, kiểm chứng trang thông báo cùng API, rồi build.

```bash
pnpm dev
# Run in another terminal
pnpm build
```

Xem [Viết plugin đầu tiên](write-your-first-plugin.md#6-register-in-the-app-and-view-the-result) để kiểm tra điều hướng, nội dung thông báo, chuyển ngôn ngữ và API. Sau đó triển khai theo quy trình của ứng dụng. Xem [Chọn cách triển khai](../deployment/choose-a-deployment-method.md).

Môi trường phát triển và CI cần quyền đọc registry. Build ứng dụng giữ địa chỉ registry. Cấp token riêng qua cấu hình npm cấp người dùng hoặc thiết lập thông tin xác thực được bảo vệ trong CI. Nếu triển khai cài dependency lại, cấp quyền đọc cho bước đó.

### 7. Phát hành phiên bản tiếp theo

Sau khi sửa và kiểm chứng plugin, tăng phiên bản, cập nhật changelog rồi lặp lại các bước kiểm tra và phát hành. Dùng phiên bản mới cho mỗi lần phát hành.

Bên sử dụng nâng cấp và kiểm chứng khi cần. Xem [Cập nhật plugin](../developing-apps/manage-plugins.md#update-plugins). Sau khi nâng cấp package, build và triển khai lại ứng dụng để đưa phiên bản mới vào production. Ứng dụng duy trì plugin có thể tiếp tục dùng mã cục bộ qua `workspace:*`.
