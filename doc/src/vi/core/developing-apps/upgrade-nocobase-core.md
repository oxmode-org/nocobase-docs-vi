---
title: Nâng cấp NocoBase Core
description: Nâng cấp NocoBase Core cùng Agent hoặc thủ công bằng cách merge một template mới hơn, giữ nguyên mã nghiệp vụ, và kiểm chứng dữ liệu cùng quyền.
---

Hướng dẫn này giải thích cách nâng cấp framework NocoBase Core và các dependency liên quan mà ứng dụng của bạn dùng. Làm việc trong project mã nguồn của ứng dụng, kiểm chứng kết quả, rồi [triển khai ứng dụng](../deployment/choose-a-deployment-method.md) bằng cách triển khai hiện có.

## Nâng cấp thay đổi những gì

Một dự án tạo bằng create-app chứa cả các dependency package NocoBase lẫn mã nguồn framework được sao chép vào dự án, như điểm vào của ứng dụng, định tuyến, layout, cấu hình và công cụ kiểm thử. Nâng cấp là merge các thay đổi từ một template mới hơn trong khi giữ nguyên các tính năng bạn đã xây.

Chỉ cập nhật mọi package `@nocobase/*` là không đủ, và một ứng dụng mới tạo không được ghi đè lên dự án hiện có. Các package có phiên bản độc lập; hãy dùng tổ hợp dependency mà template đích khai báo.

`package.json` của ứng dụng chứa metadata tương tự như sau:

```json
{
  "nocobase": {
    "templateKind": "app",
    "templatePackage": "@nocobase/app-template-default",
    "defaultTemplateVersion": "1.0.0-beta.81"
  }
}
```

`templatePackage` xác định template nguồn. `defaultTemplateVersion` ghi lại bản phát hành template đã được merge vào ứng dụng. `version` riêng của ứng dụng xác định bản phát hành của ứng dụng nghiệp vụ, không phải phiên bản Core. Chỉ đổi metadata không thực hiện được việc nâng cấp.

## Trước khi bắt đầu

- Review và commit các thay đổi hiện có vào Git, ghi lại commit hiện tại, và thực hiện nâng cấp trên một nhánh riêng.
- Xác định bản phát hành đích và đọc ghi chú phát hành của nó, bao gồm yêu cầu tương thích với Node.js, trình quản lý package, cơ sở dữ liệu và plugin tùy chỉnh.
- Chuẩn bị một bản sao lưu cơ sở dữ liệu khôi phục được. Giữ lại cấu hình khi chạy, khóa bí mật, nơi lưu trữ tệp và bản build ứng dụng trước đó tương ứng.
- Diễn tập trong một môi trường kiểm chứng tách biệt. Để test với dữ liệu thật đã giữ lại, hãy khôi phục bản sao lưu cơ sở dữ liệu và tệp vào đó, và đảm bảo môi trường này không kết nối được với cơ sở dữ liệu production hay gửi thông báo nghiệp vụ thật.

Khởi động ứng dụng mới có thể tự động áp dụng migration. Hãy hoàn tất sao lưu, kiểm tra migration và chuẩn bị dữ liệu cần thiết trước lần khởi động đầu tiên.

Chọn một trong hai cách sau, rồi hoàn tất các bước kiểm chứng và triển khai chung.

## Cùng Agent

Mở coding agent ở thư mục gốc của ứng dụng. Ứng dụng mang theo hướng dẫn nâng cấp trong `.agents/skills/nocobase-app-upgrade/SKILL.md`, được đồng bộ khi cài dependency. Kiểm tra rằng Agent đọc được file này và `AGENTS.md`; bản thân yêu cầu có thể tập trung vào mục tiêu nâng cấp, các tính năng cần giữ và cách kiểm chứng.

Nếu thiếu Skill, hãy cài dependency theo lockfile của dự án. Nếu script cài đặt đã bị tắt, hãy chạy:

```bash
pnpm nocobase skills sync
```

Dùng prompt này, thay mục tiêu bằng một phiên bản cụ thể nếu cần:

```text
Hãy nâng cấp NocoBase Core mà ứng dụng này dùng lên bản phát hành mới hơn trên kênh phát hành hiện tại.

Trước hết hãy xem xét dự án và cho tôi một kế hoạch cụ thể mà chưa sửa gì:
- Nêu phiên bản hiện tại và phiên bản đích. Nếu đã ở phiên bản đích, hãy nói không cần nâng cấp; không hạ cấp.
- Giải thích các tính năng, dependency, cấu hình và plugin bị ảnh hưởng, và những thay đổi nào cần tôi quyết định.
- Giải thích cách giữ nguyên các tính năng nghiệp vụ, theme, quyền và dữ liệu hiện có, và cách khôi phục nếu có sự cố.
- Chỉ ra các thay đổi dữ liệu không đảo ngược được hoặc bản ghi lịch sử cần sửa, giải thích nguyên nhân và ảnh hưởng.

Sau khi tôi xác nhận kế hoạch, hãy làm theo hướng dẫn nâng cấp của dự án và thay đổi trên một nhánh riêng.
Không ghi đè ứng dụng, xóa cơ sở dữ liệu hay coi riêng việc đổi số phiên bản là đã nâng cấp xong.
Kiểm chứng dữ liệu cũ, đăng nhập, quyền của người dùng thông thường và các thao tác với công việc trong một môi trường kiểm thử riêng.
Báo cáo phiên bản trước và sau, các điều chỉnh, kết quả kiểm chứng và phần việc còn lại.
Nhiệm vụ này chuẩn bị và kiểm chứng dự án đã nâng cấp; việc triển khai production cần xác nhận riêng.
```

Khi review kế hoạch, hãy kiểm tra các tính năng của bạn được giữ nguyên, các plugin bị bỏ thực sự không còn cần, và cơ sở dữ liệu có thể khôi phục. Review các thay đổi thực tế và kết quả kiểm chứng trước khi triển khai.

## Không dùng Agent

### 1. Xác định mốc ban đầu và phiên bản đích

Chạy các lệnh này ở thư mục gốc mã nguồn của ứng dụng. Các lệnh sau dùng biến trong cùng phiên Bash:

```bash
git status --short
git rev-parse HEAD
node -p "JSON.stringify(require('./package.json').nocobase, null, 2)"

TEMPLATE=$(node -p "require('./package.json').nocobase.templatePackage")
BASE=$(node -p "require('./package.json').nocobase.defaultTemplateVersion")
npm view "$TEMPLATE" dist-tags --json
```

Review và commit các thay đổi còn dở trước. Nếu thiếu nguồn template hoặc mốc ban đầu, hãy xác lập từ lịch sử dự án trước khi tiếp tục. Riêng `templateKind: app` không phân biệt được Default với Examples; đừng đoán mốc ban đầu.

Ứng dụng beta thường ở lại kênh `beta`; ứng dụng stable thường dùng `latest`. Tag `latest` không chắc mới hơn `beta` và cũng không chắc trỏ đến một bản stable. Hãy xác nhận riêng các kênh prerelease khác.

Với ứng dụng beta, phân giải phiên bản đích một lần và giữ nguyên phiên bản chính xác đó:

```bash
TARGET=$(npm view "$TEMPLATE@beta" version)
printf 'Template: %s\nBase: %s\nTarget: %s\n' "$TEMPLATE" "$BASE" "$TARGET"
```

Với một bản phát hành cụ thể, hãy gán phiên bản đầy đủ đã xác nhận của nó cho `TARGET`. So sánh phiên bản theo thứ tự semantic version: nếu bằng nhau, không cần nâng cấp; nếu cũ hơn, hãy dừng lại thay vì ngầm hạ cấp. Khi đã xác nhận phiên bản đích mới hơn, tạo một nhánh:

```bash
git switch -c "chore/upgrade-core-$TARGET"
```

### 2. Lấy cả hai bản phát hành template

Tải về một thư mục tạm, bên ngoài mã nguồn ứng dụng:

```bash
WORK=$(mktemp -d)

for VERSION in "$BASE" "$TARGET"; do
  ARCHIVE=$(npm pack "$TEMPLATE@$VERSION" --silent --pack-destination "$WORK")
  mkdir -p "$WORK/$VERSION"
  tar -xzf "$WORK/$ARCHIVE" -C "$WORK/$VERSION" --strip-components=1
done

diff -rq "$WORK/$BASE" "$WORK/$TARGET"
```

Mã thoát `1` từ `diff` nghĩa là tìm thấy khác biệt và là điều bình thường. Hãy so sánh hai template đã phát hành trước: so sánh trực tiếp ứng dụng với template mới không phân biệt được thay đổi nghiệp vụ của bạn với thay đổi từ upstream.

### 3. Merge mã nguồn và dependency từng phần

Với mỗi file đã thay đổi, hãy đọc phiên bản mốc ban đầu, phiên bản đích và phiên bản của ứng dụng. Ví dụ, xem thay đổi route bằng:

```bash
diff -u "$WORK/$BASE/client/routes.ts" "$WORK/$TARGET/client/routes.ts"
diff -u "$WORK/$BASE/client/routes.ts" client/routes.ts
```

Lần so sánh đầu cho thấy thay đổi của template; lần thứ hai cho thấy các tùy biến hiện có của bạn. Hãy tích hợp hành vi mới của template trong khi giữ nguyên route công việc, các mục cài đặt, khai báo quyền và mã nghiệp vụ khác.

| Nội dung | Cách merge |
| --- | --- |
| File framework thông thường | Dùng bản đích cho các file chưa tùy biến; đối chiếu từng file mà cả hai phía đều đã thay đổi |
| `package.json` | Merge dependency và script của bản đích, giữ nguyên tên ứng dụng, phiên bản nghiệp vụ, dependency và script tùy chỉnh; không bao giờ thay cả file |
| Đăng ký plugin | Review cùng lúc `client/plugins.ts`, `server/plugins.ts` và `cli/plugins.ts`; giữ lại các plugin ứng dụng đang dùng |
| Cấu hình và theme | Merge các ví dụ cấu hình và thay đổi của framework trong khi giữ thiết lập khi chạy, khóa bí mật, định danh ứng dụng và theme tùy chỉnh |
| Migration và seed | Giữ nguyên các file đã chạy ở đúng đường dẫn và nội dung ban đầu; dùng migration mới để sửa |
| Hướng dẫn cho Agent | Merge các tùy biến của ứng dụng trong `AGENTS.md` và `.agents/rules/`; tạo lại `.agents/skills/` bằng lệnh đồng bộ |

Trước khi bỏ một file hay dependency mà bản đích đã loại, hãy kiểm tra mã nghiệp vụ, cấu hình và test xem có dùng không. Với việc gỡ một package NocoBase đã được duyệt, hãy chạy `pnpm nocobase package remove <package-name>` khi dependency vẫn còn được khai báo, để dependency, Skill và đăng ký plugin được dọn cùng lúc. Bạn vẫn phải tự xử lý các tham chiếu trong mã nghiệp vụ. Nếu CLI cũ chưa có lệnh này, hãy theo quy trình tương thích trong Skill nâng cấp của dự án.

Cập nhật package cũng có thể mang theo migration của plugin mà không thay đổi file migration của ứng dụng. Hãy đọc ghi chú nâng cấp của các package bị ảnh hưởng để biết điều kiện về dữ liệu, thay đổi API và các thay thế cho năng lực đã bị bỏ.

### 4. Cài dependency và đồng bộ Skill

Sau khi merge xong mã nguồn, đặt `nocobase.defaultTemplateVersion` thành phiên bản đích đã cố định, rồi chạy:

```bash
pnpm install
pnpm dedupe
pnpm nocobase skills sync
```

Review và giữ lại các thay đổi trong lockfile. `pnpm dedupe` gộp các kết quả phân giải dependency tương thích. Dùng `pnpm why <package-name>` để điều tra xung đột, rồi đối chiếu ràng buộc của template đích với các dependency tùy chỉnh. Đừng né xung đột bằng cách xóa lockfile hay nâng mọi dependency lên bản mới nhất.

### 5. Kiểm tra và áp dụng migration cơ sở dữ liệu

Trước hết hoàn tất các kiểm tra tĩnh và test tự động ở phần tiếp theo. Xác nhận cấu hình đang trỏ đến môi trường kiểm chứng tách biệt, rồi chạy cả hai kiểm tra chỉ đọc bằng CLI của phiên bản đích trước khi khởi động phiên bản mới:

```bash
pnpm nocobase db apply --dry-run --json
pnpm nocobase db repair --dry-run --json
```

Lệnh đầu liệt kê các migration và seed đang chờ. Lệnh thứ hai kiểm tra thay đổi checksum của các tác vụ đã chạy. Bản xem trước của apply không chạy phần thân migration và không kiểm tra checksum, nên hai kiểm tra này không thay thế nhau. Cả hai dùng kết nối mặc định trừ khi chỉ định khác. Với nhiều kết nối, hãy thêm `--connection <name>` cho từng kết nối liên quan và giữ phạm vi nhất quán ở các bước chạy sau.

Nếu bản xem trước checksum đề xuất thay đổi, hãy đối chiếu từng thay đổi với ghi chú phát hành trước khi tiếp tục. Chạy `db repair` thật không phải bước nâng cấp thông thường: nó cập nhật mọi checksum đã ghi không khớp trong kết nối đã chọn, mà không chạy lại migration hay sửa dữ liệu nghiệp vụ. Hãy dừng lại khi có thay đổi không giải thích được và theo hướng dẫn về cơ sở dữ liệu trong Skill nâng cấp. Đừng sửa file lịch sử, reset cơ sở dữ liệu hay bỏ qua lỗi.

Khi bản sao lưu đã khôi phục được, kiểm tra checksum đã xong và dữ liệu cần thiết đã chuẩn bị, hãy áp dụng migration trong môi trường kiểm chứng tách biệt:

```bash
pnpm nocobase db apply --json
```

Migration trên production thuộc về quy trình triển khai. Đừng trỏ một bản checkout phát triển vào production để chạy các lệnh này.

## Kiểm chứng việc nâng cấp

Nâng cấp Core có thể ảnh hưởng đến toàn bộ ứng dụng. Với ví dụ này, hãy xem các script hiện có của dự án và bao gồm bộ test công việc mô tả trong [Xây ứng dụng đầu tiên](../tutorials/build-your-first-feature.md):

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

Chạy các lệnh này trong project mã nguồn, với test dùng cơ sở dữ liệu tách biệt. Nếu cấu hình test hiện có cần điều chỉnh cho công cụ mới hơn, hãy sửa trong khi giữ nguyên độ bao phủ; bỏ qua test thất bại không phải là kết quả đạt.

Sau khi chuẩn bị cơ sở dữ liệu, chạy `pnpm dev` và dùng URL `Local:` mà nó in ra để kiểm chứng:

- Quản trị viên đăng nhập được; trang công việc và cài đặt hệ thống hoạt động; ngôn ngữ và theme tùy chỉnh hoạt động như mong đợi.
- Công việc hiện có giữ nguyên tiêu đề, người được giao, trạng thái hoàn thành và hạn hoàn thành. Tạo mới, hoàn thành/mở lại, lọc và phân trang vẫn hoạt động.
- Người dùng thông thường chỉ truy cập được các trang và bản ghi được phép. Người dùng chỉ đọc vẫn không ghi được, kể cả qua gọi API trực tiếp.
- Dữ liệu còn nguyên qua các lần làm mới và khởi động lại. Các tính năng plugin, job nền và tích hợp bị ảnh hưởng đều qua các kiểm tra tương ứng.

Hãy kiểm chứng những tính năng mà ứng dụng của bạn thực sự có. Cấu hình một ứng dụng kiểm thử và thông tin đăng nhập riêng, rồi chạy `pnpm test:e2e` cho test trình duyệt; xem [Xây ứng dụng đầu tiên](../tutorials/build-your-first-feature.md) để biết cách thiết lập. `pnpm test` không bao gồm test trình duyệt.

## Triển khai và khôi phục

Commit các thay đổi mã nguồn và lockfile sau khi kiểm chứng. Ghi lại mốc ban đầu, phiên bản đích, các quyết định khi merge và kết quả kiểm chứng. Build lại và phát hành bằng cách triển khai hiện có:

- [Triển khai bằng Docker](../tutorials/deploy-with-docker.md#phát-hành-bản-mới)
- [Triển khai bằng app-installer](../tutorials/deploy-with-app-installer.md#phát-hành-bản-mới)
- [Triển khai lên Studio](../tutorials/deploy-to-studio.md#phát-hành-bản-mới)

Giữ lại bản sao lưu cấu hình và dữ liệu tương ứng với bản build trước. Rollback mã không hoàn tác migration cơ sở dữ liệu. Nếu runtime trước không dùng được schema đã nâng cấp, hãy khôi phục bản sao lưu cơ sở dữ liệu và tệp tương ứng, và tính đến các dữ liệu nghiệp vụ đã ghi từ sau các bản sao lưu đó.

Nếu ghi chú phát hành yêu cầu sửa checksum lịch sử, hãy phối hợp sao lưu, sửa, migration và khôi phục khi thất bại trong cùng một quy trình bảo trì. Với app-installer, đừng chạy `db repair` riêng trước khi dựa vào cơ chế khôi phục tự động của một lần nâng cấp bình thường: bản sao lưu sau đó của installer có thể đã chứa checksum mới, mà runtime trước có thể từ chối. Cơ sở dữ liệu bên ngoài cũng cần sắp xếp sao lưu và khôi phục riêng.

## Phạm vi kiểm chứng

Hướng dẫn này giải thích việc merge template và các kiểm tra khi nâng cấp. Ví dụ bắt đầu sử dụng hiện tại đã được đối chiếu với các dependency của template `1.0.0-beta.81` phát hành trên npmjs.org và đã qua test cùng build. Điều này không xác lập một đường nâng cấp từ mọi phiên bản cũ hơn. Với mỗi lần nâng cấp thực tế, hãy kiểm chứng các thay đổi riêng của bản phát hành, dữ liệu hiện có, quyền và khả năng khôi phục trong một môi trường tách biệt.
