---
title: Bản địa hóa
description: Tổ chức bản dịch, định dạng dữ liệu theo ngôn ngữ, thêm ngôn ngữ và đặt locale mặc định.
---

Dùng `client/locales/` để tổ chức nội dung hiển thị và tái sử dụng cơ chế dịch, chuyển ngôn ngữ hiện có. Menu, biểu mẫu, trạng thái trống và thông báo lỗi cần dùng cùng locale. Về giao diện, xem [Chủ đề và kiểu hiển thị](themes-and-styles.md).

Hướng dẫn này dùng template mặc định `1.0.0-beta.81` của ví dụ nhập môn. Nhóm `projects` minh họa cách thêm nội dung cho tính năng nghiệp vụ. Ngôn ngữ mặc định áp dụng khi người dùng chưa lưu lựa chọn riêng.

<a id="with-an-agent"></a>

## Làm cùng agent

```text
Please complete English and Chinese copy for the project feature.

Cover menus, buttons, field hints, empty states and success and error feedback without visible translation keys.
Format numbers and dates for the current language without changing stored values or business time-zone rules.
Reuse the existing language controls, preserve saved user preferences and check default behavior in a fresh browser context.
Check both languages in the application and report anything unverified.
```

Yêu cầu trên đề nghị agent hoàn thiện nội dung tiếng Anh và tiếng Trung cho tính năng dự án, gồm menu, nút, gợi ý trường, trạng thái trống và phản hồi thành công hoặc lỗi. Agent cần kiểm tra để giao diện không lộ khóa dịch, định dạng số và ngày theo ngôn ngữ hiện hành, giữ giá trị đã lưu và quy tắc múi giờ nghiệp vụ, tái sử dụng bộ chuyển ngôn ngữ, giữ tùy chọn đã lưu, kiểm tra mặc định trong ngữ cảnh trình duyệt mới và báo rõ phần chưa kiểm chứng.

<a id="without-an-agent"></a>

## Làm thủ công

<a id="keep-copy-in-application-locale-files"></a>

### Lưu nội dung trong các tệp locale của ứng dụng

| Vị trí | Trách nhiệm |
| --- | --- |
| `client/locales/en-US.ts` | Nội dung tiếng Anh của ứng dụng và kiểu `AppResource` |
| `client/locales/zh-CN.ts` | Nội dung tiếng Trung tương ứng, dùng cùng cấu trúc tài nguyên |
| `client/locales/system/` | Nội dung của template, được duy trì cùng các lần nâng cấp template |
| `client/locales/index.ts` | Các locale của trình duyệt và trình nạp tương ứng |
| `server/locales/` | Nội dung do máy chủ tạo và trình nạp locale |

Thêm nội dung nghiệp vụ vào các tệp của ứng dụng, theo nhóm như `projects`. Dành `system/` cho nội dung của template. Khi mở rộng nhóm dùng chung như `navigation` hoặc `actions`, dùng cú pháp spread để giữ các khóa sẵn có của template.

Ví dụ, thêm nhóm `projects` với các thông điệp đếm sau vào cả hai tệp locale. Nếu nhóm đã tồn tại, thêm các khóa vào nội dung hiện có:

```ts
// client/locales/en-US.ts — inside projects
count_one: '{{count}} project',
count_other: '{{count}} projects',
```

```ts
// client/locales/zh-CN.ts — inside projects
count_one: '{{count}} 个项目',
count_other: '{{count}} 个项目',
```

Dùng hook dịch của ứng dụng:

```tsx
import { useTranslation } from '@nocobase/i18n/client';

export function ProjectCount({ count }: { count: number }) {
  const { t } = useTranslation();
  return <span>{t('projects.count', { count })}</span>;
}
```

Dùng nội suy trong câu hoàn chỉnh, chẳng hạn thông báo xác nhận đã tạo dự án, để bản dịch có thể sắp xếp từ theo ngữ pháp từng ngôn ngữ. Tái sử dụng khóa chung cho nút Lưu và Hủy. Đặt thông báo thành công và lỗi riêng trong nhóm tính năng để thay đổi nội dung ở một trang không ảnh hưởng các trang khác.

Kiểu locale giúp kiểm tra cấu trúc tài nguyên, nhưng TypeScript có thể bỏ sót lỗi gõ như `t('projects.titel')`. Chạy kiểm thử độ bao phủ bản dịch và kiểm tra trực tiếp trong trình duyệt.

<a id="format-data-and-handle-server-copy"></a>

### Định dạng dữ liệu và xử lý nội dung phía máy chủ

Đọc ngôn ngữ hiện tại bằng `useLocale()`, rồi dùng `Intl.NumberFormat` và `Intl.DateTimeFormat` để định dạng giá trị hiển thị. Locale quyết định cách trình bày, còn nghiệp vụ quyết định múi giờ. Giữ nguyên ngày đã lưu khi đổi ngôn ngữ và tránh vô tình chuyển giá trị chỉ có ngày thành dấu thời gian phụ thuộc múi giờ.

Ánh xạ trạng thái API và giá trị `reason` ổn định sang nội dung hiển thị. Gắn lỗi của từng trường với ô nhập tương ứng. Dùng thông điệp dành cho người dùng khi xử lý phản hồi `message` tùy ý từ máy chủ. Lưu thông báo, email và các nội dung do máy chủ tạo trong `server/locales/`. Tác vụ nền dùng ngôn ngữ của người nhận.

Để đổi cách diễn đạt của plugin, dùng `overrides` trong namespace của plugin ở tài nguyên locale của ứng dụng. Tra quy ước bản địa hóa do plugin công bố để chọn khóa được hỗ trợ và giữ nguyên package đã cài.

<a id="add-locales-and-set-the-default"></a>

### Thêm locale và đặt mặc định

Thêm tệp tài nguyên và trình nạp động trong `locales/index.ts` tương ứng. Để ngôn ngữ xuất hiện trong bộ chọn của ứng dụng, khai báo ngôn ngữ ở ứng dụng kể cả khi plugin đã có bản dịch.

Danh sách locale của client và server độc lập. Thêm tài nguyên máy chủ khi nội dung do máy chủ tạo cần ngôn ngữ đó, rồi chạy:

```bash
pnpm nocobase locales check
```

Lệnh đối chiếu hai danh sách ngôn ngữ. Kiểm tra độ đầy đủ của bản dịch riêng. Locale chỉ có ở client vẫn có thể hoạt động nếu server dùng ngôn ngữ dự phòng, nhưng lệnh sẽ báo chênh lệch.

Đặt mặc định trong `config.yml`:

```yaml
i18n:
  defaultLocale: zh-CN
```

Lựa chọn đã lưu trên trình duyệt được ưu tiên. Kiểm tra mặc định trong ngữ cảnh trình duyệt mới để giữ tùy chọn của người dùng hiện có. Duy trì `useSyncServerLocale()` để phiên máy chủ đồng bộ với lựa chọn trình duyệt khi locale đó được hỗ trợ.

<a id="verify-results"></a>

## Kiểm tra kết quả

Chạy kiểm thử độ bao phủ locale và kiểm tra kiểu cho ví dụ:

```bash
pnpm exec vitest run tests/client/app-locale-coverage.test.ts
pnpm exec tsc -p tsconfig.json --noEmit
```

Kiểm tra cả hai ngôn ngữ trong trình duyệt, gồm menu, trạng thái trống, lỗi trường, cách hiển thị số ít và số nhiều, cùng định dạng ngày. Xác nhận giá trị mặc định trong ngữ cảnh trình duyệt mới và kiểm tra lựa chọn đã lưu vẫn có hiệu lực. Đọc nội dung hiển thị trực tiếp sau khi chạy kiểm tra kiểu.
