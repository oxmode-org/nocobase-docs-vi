---
title: Quản lý plugin
description: Xem các plugin đã đăng ký, dùng các năng lực sẵn có, và quản lý việc đăng ký, cập nhật, gỡ bỏ cùng các điểm mở rộng.
---

Template mặc định đã có sẵn một số plugin. Phát triển ứng dụng thường dùng trực tiếp các năng lực xác thực, người dùng, phân quyền và tệp của chúng. Chỉ thêm plugin sau khi xác nhận năng lực cần dùng thực sự còn thiếu. Công việc và dự án riêng của ứng dụng nên nằm trong mã ứng dụng, không cần trở thành plugin trước.

Hướng dẫn này nói về quản lý plugin trong một ứng dụng, không phải phát triển plugin hay một danh mục sản phẩm đầy đủ. Các lệnh đã được kiểm tra với CLI đã cài của ứng dụng ví dụ; hãy dùng `--help` để xác nhận tùy chọn trong phiên bản của bạn.

## Cùng Agent

```text
Hãy xem các năng lực plugin có trong ứng dụng này và xác định những tính năng nghiệp vụ hiện có nào đang dùng chúng.

Đọc các dependency đã cài, các đăng ký thực tế và hướng dẫn liên quan trước. Đừng suy ra năng lực từ tên gọi hay xây lại thứ đã có sẵn.
Không thêm, nâng cấp hay gỡ plugin nào trong lần rà soát này.

Giải thích mỗi tính năng phụ thuộc vào plugin nào, dùng những điểm vào công khai nào, và còn thiếu trang quản trị hay cấu hình bắt buộc nào.
Nếu cần thay đổi dependency, hãy giải thích lý do, phiên bản tương thích và các tính năng bị ảnh hưởng, rồi chuẩn bị một đề xuất thay đổi có thể review.
Giữ nguyên quyền của người dùng và dữ liệu nghiệp vụ.
```

Khi thay đổi thật, hãy nêu rõ mục tiêu, chẳng hạn cập nhật plugin lập lịch lên một phiên bản đã xác nhận tương thích và kiểm tra các định nghĩa cùng việc thực thi hiện có. Việc đăng ký, cập nhật và gỡ bỏ nên đúng với nhiệm vụ, thay vì xảy ra tiện tay trong lúc kiểm kê.

## Không dùng Agent

### Kiểm tra cài đặt và đăng ký

Xem các dependency `@nocobase/app-plugin-*` trong `package.json` và phiên bản đã phân giải trong lockfile. Sau đó xem ba composition root:

| File                | Đóng góp                                            |
| ------------------- | --------------------------------------------------- |
| `client/plugins.ts` | Plugin trình duyệt                                  |
| `server/plugins.ts` | Provider phía server, route và các đóng góp liên quan |
| `cli/plugins.ts`    | Lệnh                                                |

Một package đã cài chưa chắc đã được đăng ký. Ba danh sách không cần giống nhau: một plugin chỉ có lệnh chỉ cần điểm vào CLI. Thứ tự trong mảng ảnh hưởng đến thứ tự đóng góp; đừng sắp xếp lại chỉ để trông theo thứ tự chữ cái.

Một Skill trong `.agents/skills/` cũng không chứng minh plugin đang hoạt động, vì các dependency trực tiếp có thể cung cấp Skill. Composition root mới là nguồn xác thực. Package plugin của ứng dụng thường nằm trong `dependencies` để bản triển khai có chúng; plugin phía client không tự động là dependency chỉ dùng khi phát triển.

### Dùng năng lực sẵn có

Đọc Skill của plugin đã cài để biết các service token công khai, hook phía client, component, route và năng lực quản lý. Dùng các export công khai thay vì ghi vào bảng nội bộ của plugin hay import đường dẫn mã nguồn nội bộ.

Ví dụ, tính năng dự án khai báo quyền xem, tạo và giao việc qua plugin phân quyền, và tái sử dụng phần quản lý người dùng và vai trò. Nó không cần thêm package phân quyền hay nơi lưu vai trò nào khác. Ứng dụng vẫn phải nối các năng lực đó với trang và API thực tế; chỉ cài đặt thôi không tạo ra một tính năng nghiệp vụ.

### Đăng ký plugin còn thiếu

Các lệnh này lấy Scheduler làm ví dụ. Bỏ qua bước đăng ký nếu nó đã được đăng ký. Trước khi thay bằng plugin khác, hãy xác nhận tính sẵn có, yêu cầu phiên bản và cấu hình của nó:

```bash
pnpm nocobase plugin register @nocobase/app-plugin-scheduler --dry-run
pnpm nocobase plugin register @nocobase/app-plugin-scheduler
```

Lệnh cài dependency, nối các đóng góp được export và đồng bộ Skill. Hãy xem `package.json`, lockfile và các đăng ký Client, Server và CLI thực tế. Dùng `--version` cho một phiên bản đã xác nhận tương thích; phiên bản mặc định của một package mới không tự động tương thích với mọi ứng dụng.

`pnpm add` cài package nhưng không thay thế việc đăng ký runtime. `--no-install` cần một dependency đã cài và phân giải được. `--disabled` cài mà không bật các đóng góp runtime và không làm năng lực dùng được. Hãy xem đầu ra để biết những root nào thực sự đã được xử lý.

### Cập nhật plugin

Xem trước và áp dụng cập nhật cho một plugin:

```bash
pnpm nocobase plugin update @nocobase/app-plugin-scheduler --dry-run
pnpm nocobase plugin update @nocobase/app-plugin-scheduler
```

Tên là tham số vị trí, không phải `--plugin`. Bỏ trống tên sẽ cập nhật mọi plugin đã đăng ký, nên hãy nêu tên package khi chỉ thay đổi một năng lực.

pnpm tuân theo phạm vi phiên bản đã khai báo; một phạm vi cố định có thể không cho ra phiên bản mới hơn. Với thay đổi nằm ngoài phạm vi đó, hãy xác định một phiên bản đích tương thích, cập nhật khai báo và lockfile, đồng bộ Skill và kiểm tra kết quả. Cập nhật plugin không merge thay đổi của template và không thay thế [Nâng cấp NocoBase Core](upgrade-nocobase-core.md).

Kiểm tra thay đổi về migration, cấu hình và API công khai, kiểm tra các tính năng bị ảnh hưởng và build lại. Cập nhật dependency khi phát triển không thay đổi một gói đã triển khai.

### Phân biệt tắt tính năng với gỡ plugin

Khi tạm thời bỏ một thứ khỏi giao diện, hãy xác định yêu cầu là ẩn một điểm vào hay ngăn sử dụng. Ẩn menu không chặn được URL trực tiếp hay request API. Hãy thực thi hành vi bị tắt ở các điểm vào thực tế, đồng thời giữ lại mã và dữ liệu cần để khôi phục.

Trước khi gỡ cài đặt, hãy tìm các import, đăng ký Client/Server/CLI, route, cấu hình, service, test và các năng lực phụ thuộc. Chuyển đổi hoặc bỏ các tham chiếu đó trước khi gỡ package.

`<name>` dưới đây là chỗ giữ chỗ cho một plugin đã được xác nhận không còn dùng. Đừng chạy nó cho một plugin vẫn đang phục vụ tính năng nghiệp vụ:

```bash
pnpm nocobase plugin unregister '@nocobase/app-plugin-<name>' --dry-run
pnpm nocobase plugin unregister '@nocobase/app-plugin-<name>'
```

`pnpm nocobase package remove <full-package-name>` cũng gỡ các dependency NocoBase trực tiếp, và chuyển việc gỡ package plugin cho bước hủy đăng ký. Chỉ xóa một dòng trong manifest có thể bỏ sót các đăng ký và file đã đồng bộ.

Hủy đăng ký không quyết định cách xử lý dữ liệu nghiệp vụ lịch sử và không phải kế hoạch rollback cơ sở dữ liệu. Hãy thiết kế việc giữ lại, chuyển đổi hay xóa riêng, thay vì xóa thư mục hay bảng của plugin như một bước dọn dẹp tiện tay.

### Mở rộng giao diện của plugin

| Nhu cầu | Nên dùng |
| --- | --- |
| Cấu hình plugin sẵn có | Tùy chọn đăng ký công khai |
| Component ghép được hoặc điểm mở rộng ở mã nguồn | Component hoặc các đóng góp `client/extensions/` có tài liệu |
| Thay cách trình bày trang của plugin | `client/route-overrides.ts` được hỗ trợ hoặc override do plugin cung cấp |
| Trang nghiệp vụ thuộc ứng dụng | Mục mới trong `client/routes.ts` |

Override trang giữ nguyên định danh route, đường dẫn và điều kiện truy cập, chỉ thay một component tải lười theo hợp đồng. Đừng khai báo lại cùng đường dẫn hay kết hợp nhiều override cho một route. Các trang đăng nhập và đăng ký hiện tại thuộc ứng dụng dù chúng dùng plugin xác thực.

Đừng sửa nội dung package trong `node_modules/` hay `.agents/skills/`. Đặt quy tắc của ứng dụng trong `.agents/rules/`; sửa lỗi của plugin dùng chung trong repository nguồn của nó.

## Kiểm tra kết quả

Xem dependency, lockfile, cả ba root, các Skill đã đồng bộ và nơi thực sự sử dụng. Chạy kiểm tra kiểu, test và build bị ảnh hưởng. Kiểm tra dữ liệu hiện có sau migration và tài liệu API sau khi thay đổi endpoint. Kiểm tra truy cập thành công và ranh giới quyền của người dùng thông thường trên trình duyệt.

Nếu thay đổi thủ công hoặc gián đoạn khiến Skill không nhất quán, hãy đồng bộ lại:

```bash
pnpm nocobase skills sync
```

Đồng bộ chỉ sửa các bản sao hướng dẫn, không sửa đăng ký plugin hay mã ứng dụng. Tiếp tục với [Tổng quan phát triển ứng dụng](overview.md) và [Kiểm thử và nghiệm thu](testing-and-acceptance.md).
