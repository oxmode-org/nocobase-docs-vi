---
title: Nâng cấp NocoBase Core
description: Hợp nhất template mới bằng agent hoặc thủ công, bảo toàn mã nghiệp vụ và kiểm tra dữ liệu cùng quyền truy cập.
---

Hướng dẫn này nâng cấp framework NocoBase Core và các dependency của ứng dụng. Làm việc trong dự án mã nguồn, kiểm tra kết quả rồi [triển khai ứng dụng](../deployment/choose-a-deployment-method.md) theo phương thức hiện có.

<a id="what-an-upgrade-changes"></a>

## Bản nâng cấp thay đổi những gì

Dự án tạo bằng create-app gồm dependency NocoBase và mã framework được chép từ template, như điểm vào, route, bố cục, cấu hình và công cụ kiểm thử. Nâng cấp là hợp nhất thay đổi từ template mới, đồng thời bảo toàn tính năng đã xây dựng.

Ngoài cập nhật dependency `@nocobase/*`, cần hợp nhất từng thay đổi mã nguồn của template vào dự án hiện có. Các package có phiên bản độc lập, nên dùng tổ hợp dependency do template đích khai báo.

`package.json` có metadata tương tự:

```json
{
  "nocobase": {
    "templateKind": "app",
    "templatePackage": "@nocobase/app-template-default",
    "defaultTemplateVersion": "1.0.0-beta.81"
  }
}
```

`templatePackage` xác định template nguồn. `defaultTemplateVersion` ghi phiên bản template đã hợp nhất. `version` là phiên bản phát hành riêng của ứng dụng nghiệp vụ. Cập nhật metadata sau khi hợp nhất thay đổi thực tế.

<a id="before-you-begin"></a>

## Chuẩn bị

- Rà soát và commit thay đổi hiện có, ghi lại commit hiện tại và nâng cấp trên nhánh riêng.
- Xác định bản đích và đọc ghi chú phát hành, gồm yêu cầu tương thích của Node.js, trình quản lý package, cơ sở dữ liệu và plugin tùy chỉnh.
- Chuẩn bị bản sao lưu cơ sở dữ liệu có thể khôi phục. Lưu cấu hình chạy, bí mật, tệp lưu trữ và bản dựng cũ tương ứng.
- Diễn tập trong môi trường kiểm chứng cô lập. Khôi phục bản sao cơ sở dữ liệu và tệp tại đó để kiểm tra dữ liệu cũ. Cô lập môi trường khỏi cơ sở dữ liệu production và chặn gửi thông báo nghiệp vụ thực.

Bản mới có thể tự áp dụng migration lúc khởi động. Hoàn tất sao lưu, kiểm tra migration và chuẩn bị dữ liệu trước lần khởi động đầu tiên.

Chọn một trong hai cách dưới đây rồi thực hiện các bước kiểm chứng và triển khai chung.

<a id="with-an-agent"></a>

## Làm cùng agent

Mở agent lập trình tại thư mục gốc ứng dụng. Hướng dẫn nâng cấp nằm trong `.agents/skills/nocobase-app-upgrade/SKILL.md` và được đồng bộ khi cài dependency. Xác nhận agent đọc được tệp này và `AGENTS.md`. Yêu cầu có thể tập trung vào bản đích, tính năng cần giữ và cách kiểm tra.

Nếu thiếu Skill, cài dependency theo lockfile của dự án. Nếu script cài đặt đã bị tắt, chạy:

```bash
pnpm nocobase skills sync
```

Dùng prompt sau và thay bản đích bằng phiên bản cụ thể nếu cần:

```text
Please upgrade the NocoBase Core used by this application to the newer release on its current release channel.

First inspect the project and give me a concrete plan without editing it:
- State the current and target versions. If already at the target, say no upgrade is needed; do not downgrade.
- Explain affected features, dependencies, configuration and plugins, and which changes need my decision.
- Explain how existing business features, themes, permissions and data will be preserved, and how to recover if something goes wrong.
- Identify irreversible data changes or historical records that need repair, explaining their cause and impact.

After I confirm the plan, follow the project's upgrade guidance and make changes on a separate branch.
Do not overwrite the application, clear the database or treat a version-number change alone as a completed upgrade.
Verify old data, sign-in, ordinary-user permissions and task operations in a separate test environment.
Report the before-and-after versions, adjustments, verification results and remaining work.
This task prepares and verifies the upgraded project; confirm production deployment separately.
```

Prompt yêu cầu agent lập kế hoạch trước khi sửa, xác định phiên bản hiện tại và bản đích, nêu ảnh hưởng và quyết định cần duyệt, mô tả cách giữ tính năng, giao diện, quyền và dữ liệu, cùng phương án khôi phục. Sau khi kế hoạch được xác nhận, agent làm trên nhánh riêng, kiểm tra dữ liệu cũ, đăng nhập, quyền người dùng thường và các thao tác nhiệm vụ trong môi trường cô lập, rồi báo kết quả. Bước đưa lên production cần xác nhận riêng.

Khi rà soát kế hoạch, kiểm tra các tính năng được bảo toàn, plugin bị gỡ thực sự đã hết nhu cầu sử dụng và cơ sở dữ liệu có thể khôi phục. Xem thay đổi và kết quả kiểm thử trước khi triển khai.

<a id="migrate-the-old-global-plugin-development-skill"></a>

## Chuyển Skill phát triển plugin cũ từ bản cài toàn cục

Nếu trước đây đã cài `nocobase-app-plugin-development` toàn cục, đưa việc chuyển đổi vào kế hoạch. Bản đích cần có Skill trong dự án và lệnh đồng bộ tương thích. Kiểm tra Skill mà agent thực sự nạp nếu có hai bản cùng tên.

1. Nâng cấp dependency theo template đích và chạy `pnpm nocobase skills sync`.
2. Xác nhận `.agents/skills/nocobase-app-plugin-development/` có đủ hướng dẫn và tài nguyên được tham chiếu.
3. Kiểm tra các vị trí toàn cục mà agent đang dùng. Sao lưu nội dung tùy chỉnh bên ngoài thư mục dò Skill, rồi gỡ đúng bản cài cũ và liên kết dò tìm của nó. Nếu mục toàn cục là liên kết, chỉ gỡ liên kết và giữ dự án hoặc checkout nguồn mà nó trỏ đến.
4. Mở phiên agent mới và xác nhận agent dùng tệp trong dự án.

Giữ bản toàn cục đầy đủ nếu chưa có bản thay thế trong dự án hoặc đồng bộ thất bại. Xử lý các điều kiện đó trước. Git của ứng dụng không quản lý tệp toàn cục, nên ghi riêng cách sao lưu và khôi phục. Việc gỡ các tệp này là bước thủ công sau khi cài dependency và đồng bộ. Ứng dụng đã nâng cấp có thể dọn phần còn sót ở phiên bản hiện tại.

<a id="without-an-agent"></a>

## Làm thủ công

<a id="1-identify-the-baseline-and-target"></a>

### 1. Xác định bản nền và bản đích

Chạy từ thư mục gốc mã nguồn. Các lệnh sau dùng biến trong cùng phiên Bash:

```bash
git status --short
git rev-parse HEAD
node -p "JSON.stringify(require('./package.json').nocobase, null, 2)"

TEMPLATE=$(node -p "require('./package.json').nocobase.templatePackage")
BASE=$(node -p "require('./package.json').nocobase.defaultTemplateVersion")
npm view "$TEMPLATE" dist-tags --json
```

Rà soát và commit thay đổi còn dở trước. Nếu thiếu thông tin template nguồn hoặc bản nền, xác định từ lịch sử dự án. `templateKind: app` dùng chung cho Default và Examples, nên cần thêm bằng chứng để xác định template.

Ứng dụng beta thường theo `beta` và ứng dụng ổn định thường theo `latest`. Kiểm tra phiên bản thực tế của `latest` vì tag này có thể trỏ tới bản cũ hơn `beta` hoặc bản chưa ổn định. Xác nhận riêng từng kênh phát hành thử khác.

Với ứng dụng beta, tra đích một lần và giữ nguyên phiên bản đã xác định:

```bash
TARGET=$(npm view "$TEMPLATE@beta" version)
printf 'Template: %s\nBase: %s\nTarget: %s\n' "$TEMPLATE" "$BASE" "$TARGET"
```

Nếu chọn một bản cụ thể, gán phiên bản đầy đủ đã xác nhận cho `TARGET`. So sánh theo SemVer. Nếu bằng nhau thì đã ở bản đích. Nếu đích cũ hơn thì dừng để tránh hạ cấp. Khi xác nhận đích mới hơn, tạo nhánh:

```bash
git switch -c "chore/upgrade-core-$TARGET"
```

<a id="2-fetch-both-template-releases"></a>

### 2. Tải hai phiên bản template

Tải vào thư mục tạm bên ngoài mã nguồn ứng dụng:

```bash
WORK=$(mktemp -d)

for VERSION in "$BASE" "$TARGET"; do
  ARCHIVE=$(npm pack "$TEMPLATE@$VERSION" --silent --pack-destination "$WORK")
  mkdir -p "$WORK/$VERSION"
  tar -xzf "$WORK/$ARCHIVE" -C "$WORK/$VERSION" --strip-components=1
done

diff -rq "$WORK/$BASE" "$WORK/$TARGET"
```

Mã thoát `1` của `diff` báo có khác biệt và là kết quả dự kiến. So sánh hai template đã phát hành trước để xác định phần thay đổi từ upstream, rồi đối chiếu với tùy chỉnh của ứng dụng.

<a id="3-merge-source-and-dependencies-individually"></a>

### 3. Hợp nhất mã nguồn và dependency theo từng tệp

Với mỗi tệp đã đổi, đọc bản nền, bản đích và bản ứng dụng. Ví dụ, kiểm tra thay đổi route:

```bash
diff -u "$WORK/$BASE/client/routes.ts" "$WORK/$TARGET/client/routes.ts"
diff -u "$WORK/$BASE/client/routes.ts" client/routes.ts
```

Lệnh đầu cho thấy thay đổi của template, lệnh sau cho thấy tùy chỉnh hiện có. Hợp nhất hành vi mới và bảo toàn route nhiệm vụ, mục cài đặt, khai báo quyền và mã nghiệp vụ khác.

| Nội dung | Cách hợp nhất |
| --- | --- |
| Tệp framework thông thường | Dùng bản đích cho tệp chưa tùy chỉnh. Hợp nhất từng tệp được cả hai bên chỉnh sửa |
| `package.json` | Hợp nhất dependency và script từ bản đích, giữ tên, phiên bản nghiệp vụ, dependency và script riêng của ứng dụng |
| Đăng ký plugin | Rà soát cùng lúc `client/plugins.ts`, `server/plugins.ts` và `cli/plugins.ts`. Giữ plugin ứng dụng đang dùng |
| Cấu hình và chủ đề | Hợp nhất cấu hình mẫu và thay đổi framework, giữ cài đặt chạy, bí mật, định danh ứng dụng và chủ đề tùy chỉnh |
| Migration và Seed | Giữ nguyên đường dẫn và nội dung của tệp đã chạy. Dùng migration mới để sửa |
| Hướng dẫn agent | Hợp nhất tùy chỉnh trong `AGENTS.md` và `.agents/rules/`. Tạo lại `.agents/skills/` bằng lệnh đồng bộ |

Trước khi gỡ tệp hoặc dependency đã bị loại ở bản đích, tìm chỗ dùng trong mã nghiệp vụ, cấu hình và kiểm thử. Khi việc gỡ package NocoBase đã được duyệt, chạy `pnpm nocobase package remove <package-name>` trong lúc dependency còn được khai báo để dọn dependency, Skill và đăng ký plugin cùng nhau. Xử lý riêng các tham chiếu nghiệp vụ. Nếu CLI cũ thiếu lệnh này, dùng quy trình tương thích trong Skill nâng cấp của dự án.

Bản cập nhật package có thể bổ sung migration của plugin dù tệp migration của ứng dụng giữ nguyên. Đọc ghi chú nâng cấp của package liên quan để biết điều kiện dữ liệu, thay đổi API và phương án thay thế tính năng đã bỏ.

<a id="4-install-dependencies-and-synchronize-skills"></a>

### 4. Cài dependency và đồng bộ Skill

Sau khi hợp nhất mã nguồn, đặt `nocobase.defaultTemplateVersion` thành phiên bản đích đã chốt rồi chạy:

```bash
pnpm install
pnpm dedupe
pnpm nocobase skills sync
```

Rà soát và giữ thay đổi lockfile. `pnpm dedupe` hợp nhất các bản phân giải dependency tương thích. Dùng `pnpm why <package-name>` để tìm nguyên nhân xung đột rồi dung hòa ràng buộc của template với dependency tùy chỉnh. Giữ lockfile và xử lý từng xung đột thay vì cập nhật hàng loạt.

<a id="5-check-and-apply-database-migrations"></a>

### 5. Kiểm tra và áp dụng migration cơ sở dữ liệu

Trước hết, hoàn tất kiểm tra tĩnh và kiểm thử tự động ở mục tiếp theo. Xác nhận cấu hình trỏ vào môi trường kiểm chứng cô lập, rồi dùng CLI bản đích chạy hai bước chỉ đọc trước khi khởi động bản mới:

```bash
pnpm nocobase db apply --dry-run --json
pnpm nocobase db repair --dry-run --json
```

Lệnh đầu liệt kê migration và Seed đang chờ. Lệnh thứ hai đối chiếu checksum của tác vụ đã chạy. Bản xem trước của `db apply` chỉ liệt kê kế hoạch, nên cần chạy cả bước đối chiếu checksum. Cả hai dùng kết nối mặc định nếu không chỉ định. Với nhiều kết nối, thêm `--connection <name>` cho từng kết nối liên quan và giữ nhất quán phạm vi khi chạy thật.

Nếu bản xem trước checksum đề xuất thay đổi, đối chiếu từng mục với ghi chú phát hành. `db repair` thực tế cập nhật mọi checksum đã ghi bị lệch trong kết nối được chọn. Migration và dữ liệu nghiệp vụ cần được xử lý riêng. Nếu chưa giải thích được chênh lệch, dừng và làm theo hướng dẫn cơ sở dữ liệu trong Skill nâng cấp. Giữ nguyên tệp lịch sử và dữ liệu để xử lý nguyên nhân.

Sau khi xác nhận có thể khôi phục bản sao lưu, kiểm tra xong checksum và chuẩn bị đủ dữ liệu, áp dụng migration tại môi trường kiểm chứng:

```bash
pnpm nocobase db apply --json
```

Chạy migration production theo quy trình triển khai. Giữ checkout phát triển tách khỏi cơ sở dữ liệu production.

<a id="verify-the-upgrade"></a>

## Kiểm chứng bản nâng cấp

Nâng cấp Core có thể ảnh hưởng toàn ứng dụng. Với ví dụ này, rà soát script dự án và thêm kiểm thử cô lập cho tính năng nhiệm vụ theo [Kiểm thử](testing-and-acceptance.md):

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

Chạy tại dự án mã nguồn và dùng cơ sở dữ liệu cô lập cho kiểm thử. Nếu công cụ mới yêu cầu điều chỉnh cấu hình kiểm thử, cập nhật cấu hình và giữ độ bao phủ. Sửa lỗi kiểm thử trước khi xác nhận đạt.

Sau khi chuẩn bị cơ sở dữ liệu, chạy `pnpm dev` và mở URL in ở dòng `Local:` để kiểm tra:

- Quản trị viên đăng nhập được. Trang nhiệm vụ, cài đặt hệ thống, ngôn ngữ và chủ đề tùy chỉnh hoạt động đúng.
- Nhiệm vụ cũ giữ tiêu đề, người phụ trách, trạng thái hoàn thành và hạn chót. Tạo, hoàn thành, mở lại, lọc và phân trang vẫn hoạt động.
- Người dùng thường chỉ truy cập trang và bản ghi được phép. Tài khoản chỉ đọc bị từ chối khi ghi, kể cả qua API trực tiếp.
- Dữ liệu còn sau khi tải lại và khởi động lại. Tính năng plugin, tác vụ nền và tích hợp bị ảnh hưởng vượt qua các kiểm tra tương ứng.

Kiểm tra các tính năng ứng dụng thực sự có. Cấu hình ứng dụng và thông tin đăng nhập kiểm thử riêng, rồi chạy `pnpm test:e2e` để kiểm thử trình duyệt. Xem [Kiểm thử](testing-and-acceptance.md) để thiết lập. `pnpm test` chạy bộ kiểm thử ngoài trình duyệt.

<a id="deploy-and-recover"></a>

## Triển khai và khôi phục

Commit mã nguồn và lockfile sau khi kiểm chứng. Ghi bản nền, bản đích, các quyết định khi hợp nhất và kết quả kiểm tra. Dựng và phát hành theo phương thức hiện có:

- [Triển khai bằng Docker](../tutorials/deploy-with-docker.md#deploy-a-new-version-manually)
- [Triển khai bằng PM2 với app-installer](../tutorials/deploy-with-app-installer.md#deploy-a-new-version-manually)

Giữ bản sao lưu cấu hình và dữ liệu tương ứng với bản dựng trước. Rollback mã giữ nguyên các migration đã áp dụng. Nếu bản cũ không dùng được schema mới, khôi phục cơ sở dữ liệu và tệp tương ứng rồi xử lý các phát sinh nghiệp vụ kể từ thời điểm sao lưu.

Nếu ghi chú phát hành yêu cầu sửa checksum lịch sử, phối hợp sao lưu, sửa checksum, migration và khôi phục lỗi trong cùng quy trình bảo trì. Với app-installer, chạy `db repair` theo quy trình có bản sao lưu phù hợp trước khi checksum đổi. Nếu sửa riêng rồi mới để trình cài đặt sao lưu, bản sao có thể đã chứa checksum mới mà runtime cũ từ chối. Cơ sở dữ liệu ngoài cũng cần phương án sao lưu và khôi phục riêng.

<a id="verification-scope"></a>

## Phạm vi kiểm chứng

Hướng dẫn mô tả cách hợp nhất template và kiểm tra nâng cấp. Ví dụ nhập môn hiện tại đã được đối chiếu với dependency của template `1.0.0-beta.81` phát hành trên npmjs.org và đã vượt qua kiểm thử cùng bước dựng. Với mỗi lần nâng cấp thực tế, kiểm tra thay đổi riêng của bản phát hành, dữ liệu cũ, quyền và khả năng khôi phục trong môi trường cô lập.
