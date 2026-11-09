---
title: Quản lý plugin
description: Kiểm tra plugin đã đăng ký, tận dụng năng lực hiện có và quản lý đăng ký, cập nhật, gỡ bỏ cùng các điểm mở rộng.
---

Template mặc định đã có một số plugin. Khi phát triển ứng dụng, thường có thể dùng trực tiếp các năng lực xác thực, quản lý người dùng, phân quyền và tệp. Chỉ thêm plugin khi đã xác định còn thiếu năng lực cần thiết. Đặt tác vụ và dự án riêng của ứng dụng trong mã ứng dụng.

Bài này hướng dẫn quản lý plugin trong ứng dụng. Các lệnh được đối chiếu với CLI cài trong ứng dụng mẫu. Dùng `--help` để kiểm tra tùy chọn của phiên bản đang dùng.

Để phát triển plugin riêng, xem [Khi nào nên viết plugin](../extension-development/when-to-write-a-plugin.md), [Tạo plugin](../extension-development/create-plugin.md) và [Viết plugin đầu tiên](../extension-development/write-your-first-plugin.md).

Với plugin do nhóm phát hành, cấu hình registry riêng và quyền đọc trước khi cài và đăng ký. Xem [Build và phát hành](../extension-development/publish-plugin.md).

## Cùng Agent

```text
Kiểm kê năng lực plugin trong ứng dụng và xác định tính năng nghiệp vụ đang dùng chúng.
Đọc dependency đã cài, đăng ký thực tế và hướng dẫn liên quan trước.
Xác minh năng lực qua hợp đồng công khai và dùng lại phần có sẵn. Trong
lúc rà soát, giữ nguyên danh sách và phiên bản plugin.

Giải thích mỗi tính năng phụ thuộc plugin nào, dùng điểm vào công khai nào
và còn thiếu trang quản trị hoặc cấu hình gì. Nếu cần đổi dependency, ghi
lý do, phiên bản tương thích và tính năng bị ảnh hưởng rồi chuẩn bị thay đổi
để duyệt. Bảo toàn quyền người dùng và dữ liệu nghiệp vụ.
```

Khi cần thay đổi thực tế, xác định mục tiêu cụ thể. Ví dụ, cập nhật plugin lập lịch lên bản đã xác nhận tương thích và kiểm tra định nghĩa cùng lịch sử thực thi hiện có. Tách việc kiểm kê khỏi các thao tác đăng ký, cập nhật và gỡ bỏ.

## Thực hiện thủ công

### Kiểm tra cài đặt và đăng ký

Kiểm tra dependency `@nocobase/app-plugin-*` trong `package.json` và phiên bản đã phân giải trong lockfile. Sau đó xem ba điểm tổng hợp.

| Tệp | Phần đóng góp |
| --- | --- |
| `client/plugins.ts` | Plugin trình duyệt |
| `server/plugins.ts` | Provider, route và đóng góp phía server |
| `cli/plugins.ts` | Lệnh |

Kiểm tra từng danh sách để biết package nào thực sự đã đăng ký. Ví dụ, plugin chỉ cung cấp lệnh cần mục CLI. Thứ tự trong mảng ảnh hưởng thứ tự đóng góp. Giữ thứ tự có chủ đích khi chỉnh sửa.

Skill trong `.agents/skills/` có thể đến từ dependency trực tiếp. Dùng các điểm tổng hợp để xác định plugin đang hoạt động. Package plugin của ứng dụng thường thuộc `dependencies` để bản triển khai mang theo chúng, kể cả plugin Client cần khi chạy.

### Dùng năng lực hiện có

Đọc Skill đi kèm phiên bản plugin đã cài để tìm token dịch vụ, hook Client, component, route và tính năng quản trị công khai. Dùng các điểm xuất này để tương tác với plugin.

Ví dụ, tính năng dự án khai báo quyền xem, tạo và phân công qua plugin phân quyền, rồi dùng lại quản lý người dùng và vai trò. Ứng dụng nối các năng lực đó vào trang và API nghiệp vụ thực tế.

### Đăng ký plugin còn thiếu

Ví dụ dùng Scheduler. Bỏ qua nếu đã đăng ký. Khi chọn plugin khác, xác nhận package có sẵn, phiên bản yêu cầu và cấu hình cần thiết.

```bash
pnpm nocobase plugin register @nocobase/app-plugin-scheduler --dry-run
pnpm nocobase plugin register @nocobase/app-plugin-scheduler
```

Lệnh cài dependency, nối đóng góp được xuất và đồng bộ Skill. Kiểm tra `package.json`, lockfile và đăng ký Client, Server, CLI thực tế. Dùng `--version` để chọn phiên bản đã xác nhận tương thích.

Nếu cài riêng bằng `pnpm add`, thực hiện đăng ký runtime sau đó. Dùng `--no-install` khi dependency đã cài và phân giải được. `--disabled` cài package nhưng để đóng góp runtime tắt. Xem đầu ra để biết điểm tổng hợp nào đã được xử lý.

<h3 id="update-plugins">Cập nhật plugin</h3>

Xem trước rồi cập nhật một plugin.

```bash
pnpm nocobase plugin update @nocobase/app-plugin-scheduler --dry-run
pnpm nocobase plugin update @nocobase/app-plugin-scheduler
```

Truyền tên package dưới dạng đối số vị trí. Nếu bỏ tên, lệnh cập nhật mọi plugin đã đăng ký. Ghi rõ tên khi chỉ thay đổi một plugin.

pnpm tuân theo khoảng phiên bản đã khai báo. Nếu đã ghim phiên bản, có thể không có bản mới trong khoảng. Để chuyển ra ngoài khoảng đó, chọn đích tương thích, cập nhật khai báo và lockfile, đồng bộ Skill rồi kiểm tra kết quả. Thay đổi template thực hiện riêng theo [Nâng cấp NocoBase Core](upgrade-nocobase-core.md).

Rà thay đổi migration, cấu hình và API công khai. Kiểm chứng tính năng bị ảnh hưởng rồi build lại. Đưa dependency mới vào production qua bản triển khai mới.

### Tắt tính năng và gỡ plugin

Khi tạm bỏ tính năng khỏi giao diện, xác định cần ẩn mục điều hướng hay chặn sử dụng. Nếu cần chặn, áp dụng tại URL và API thực tế, đồng thời giữ mã và dữ liệu cần cho việc khôi phục.

Trước khi gỡ, tìm import, đăng ký Client/Server/CLI, route, cấu hình, dịch vụ, kiểm thử và tính năng phụ thuộc. Chuyển đổi hoặc gỡ các tham chiếu đó trước khi bỏ package.

Thay `<name>` bằng tên plugin đã xác nhận không còn được sử dụng.

```bash
pnpm nocobase plugin unregister '@nocobase/app-plugin-<name>' --dry-run
pnpm nocobase plugin unregister '@nocobase/app-plugin-<name>'
```

`pnpm nocobase package remove <full-package-name>` cũng gỡ dependency NocoBase trực tiếp và chuyển package plugin qua quy trình hủy đăng ký. Dùng quy trình này để xử lý cả đăng ký và tệp đồng bộ thay vì chỉ xóa dòng manifest.

Lập kế hoạch giữ, chuyển hoặc xóa dữ liệu lịch sử riêng. Thực hiện rollback cơ sở dữ liệu theo quy trình tương ứng nếu cần.

### Mở rộng giao diện plugin

| Nhu cầu | Cách dùng |
| --- | --- |
| Cấu hình plugin hiện có | Tùy chọn đăng ký công khai |
| Ghép component công khai | Import điểm xuất công khai rồi lắp ghép trong ứng dụng |
| Mã nguồn UI có thể chỉnh sửa | Cài component hoặc block từ [NocoBase UI Library](https://ui.nocobase.com/). Ứng dụng duy trì bản sao đã cài |
| Thay cách hiển thị trang plugin | Dùng `client/route-overrides.ts` được hỗ trợ hoặc điểm ghi đè do plugin cung cấp |
| Trang nghiệp vụ thuộc ứng dụng | Thêm mục trong `client/routes.ts` |

Ghi đè trang giữ định danh, đường dẫn và điều kiện truy cập của route, đồng thời thay component nạp theo nhu cầu theo hợp đồng. Giữ một khai báo cho mỗi đường dẫn và một ghi đè cho mỗi route. Trang đăng nhập và đăng ký hiện do ứng dụng quản lý, dù dùng plugin xác thực.

Đặt quy tắc ứng dụng trong `.agents/rules/`. Sửa lỗi plugin dùng chung tại repo nguồn rồi cập nhật package. Duy trì Skill ở nguồn để đồng bộ lại vào `.agents/skills/`.

## Kiểm chứng kết quả

Kiểm tra dependency, lockfile, ba điểm tổng hợp, Skill đã đồng bộ và bên sử dụng thực tế. Chạy kiểm tra kiểu, bài kiểm thử và build bị ảnh hưởng. Xác minh dữ liệu hiện có sau migration và tài liệu API sau khi đổi endpoint. Trong trình duyệt, kiểm tra truy cập thành công và giới hạn quyền của người dùng thông thường.

Nếu thao tác thủ công hoặc gián đoạn làm bản Skill lệch nhau, đồng bộ lại:

```bash
pnpm nocobase skills sync
```

Đồng bộ làm mới bản hướng dẫn. Rà riêng đăng ký plugin và mã ứng dụng. Xem [Tổng quan phát triển ứng dụng](overview.md) và [Kiểm thử](testing-and-acceptance.md).
