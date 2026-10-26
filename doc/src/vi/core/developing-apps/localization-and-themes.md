---
title: Đa ngôn ngữ và theme
description: Tổ chức bản dịch và locale, cấu hình ngôn ngữ và giao diện mặc định, và giữ giao diện nhất quán bằng theme token.
---

Đa ngôn ngữ và theme định hình toàn bộ ứng dụng. Các trang nghiệp vụ mới nên dùng cơ chế dịch, chuyển ngôn ngữ và giao diện sẵn có để menu, form, thông báo lỗi và chế độ màu luôn nhất quán.

Hướng dẫn này theo template mặc định `1.0.0-beta.81`, được dùng trong ví dụ bắt đầu sử dụng hiện tại. `projects` là ví dụ về nội dung chữ nghiệp vụ mới. Hãy phân biệt giá trị mặc định cho ngôn ngữ, chế độ màu và theme với các tùy chọn mà người dùng đã lưu.

## Cùng Agent

```text
Hãy rà soát tính nhất quán về đa ngôn ngữ và theme cho tính năng dự án.

Menu, nút, gợi ý của field, trạng thái trống và phản hồi thành công hay lỗi cần có đủ nội dung tiếng Anh và tiếng Trung, không để lộ translation key.
Đổi ngôn ngữ phải định dạng số và ngày theo ngôn ngữ đó mà không thay đổi giá trị đã lưu hay quy tắc múi giờ nghiệp vụ.
Bảng, hộp thoại, ô nhập, thông báo lỗi và focus bàn phím phải dễ đọc ở cả chế độ sáng lẫn tối.

Tái sử dụng các điều khiển ngôn ngữ và giao diện sẵn có, và giữ nguyên tùy chọn người dùng đã lưu.
Nếu cần thay đổi theme, hãy thay đổi style dùng chung một cách nhất quán thay vì chỉ tô màu lại Projects.
Kiểm tra cả hai ngôn ngữ và cả hai chế độ màu trong ứng dụng, và báo lại những gì chưa kiểm chứng.
```

## Không dùng Agent

### Giữ nội dung chữ trong file locale của ứng dụng

| Vị trí | Trách nhiệm |
| --- | --- |
| `client/locales/en-US.ts` | Nội dung tiếng Anh của ứng dụng và kiểu `AppResource` |
| `client/locales/zh-CN.ts` | Nội dung tiếng Trung tương ứng, cùng cấu trúc resource |
| `client/locales/system/` | Nội dung của template, được duy trì cùng các lần nâng cấp template |
| `client/locales/index.ts` | Các locale của trình duyệt và loader của chúng |
| `server/locales/` | Văn bản do server tạo và loader locale |

Thêm nội dung nghiệp vụ vào file của ứng dụng, theo nhóm như `projects`. Đừng đặt vào `system/`. Spread các nhóm dùng chung sẵn có như `navigation` hay `actions` trước khi mở rộng, để các key của template vẫn dùng được.

Ví dụ, thêm một nhóm `projects` với các thông điệp đếm sau vào cả hai file locale. Nếu nhóm đã tồn tại, hãy thêm các key này vào mà không thay nội dung khác của nhóm:

```ts
// client/locales/en-US.ts — bên trong projects
count_one: '{{count}} project',
count_other: '{{count}} projects',
```

```ts
// client/locales/zh-CN.ts — bên trong projects
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

Dùng nội suy cho các câu hoàn chỉnh như xác nhận đã tạo, thay vì ghép từng từ. Tái sử dụng các key Save và Cancel dùng chung; giữ các thông báo thành công và lỗi riêng của tính năng trong nhóm của tính năng đó để thay đổi không ảnh hưởng đến trang khác.

Kiểu locale kiểm tra cấu trúc resource, nhưng TypeScript có thể không bắt được `t('projects.titel')`. Hãy chạy test độ phủ nội dung và kiểm tra cả trên trình duyệt.

### Định dạng dữ liệu và xử lý nội dung từ server

Đọc ngôn ngữ hiện tại bằng `useLocale()` và định dạng giá trị hiển thị bằng `Intl.NumberFormat` và `Intl.DateTimeFormat`. Định dạng theo locale và múi giờ nghiệp vụ là hai chuyện khác nhau. Đổi ngôn ngữ không được sửa ngày đã lưu, và giá trị chỉ có ngày không nên vô tình trở thành timestamp xuyên múi giờ.

Ánh xạ trạng thái API và các giá trị `reason` ổn định sang nội dung trên trang, gắn lỗi của field với ô nhập tương ứng. Đừng hiển thị trực tiếp một giá trị `message` bất kỳ từ server làm nội dung cuối cùng cho người dùng. Thông báo, thư và các văn bản khác do server tạo thuộc về `server/locales/`. Nội dung chạy nền theo ngôn ngữ của người nhận, không theo quản trị viên đã kích hoạt nó.

Để sửa câu chữ của plugin, hãy dùng `overrides` của namespace plugin trong resource locale của ứng dụng thay vì sửa package đã cài. Xem hợp đồng locale của plugin sở hữu thay vì phụ thuộc vào key nội bộ.

### Thêm locale và đặt mặc định

Thêm một file resource và loader động trong `locales/index.ts` liên quan. Chỉ thêm bản dịch vào một plugin không thêm ngôn ngữ vào bộ chọn của ứng dụng.

Danh sách locale của client và server độc lập với nhau. Thêm resource phía server khi văn bản do server tạo cần ngôn ngữ đó, rồi chạy:

```bash
pnpm nocobase locales check
```

Lệnh này kiểm tra danh sách ngôn ngữ có khớp nhau không, không kiểm tra bản dịch đã đầy đủ chưa. Một locale chỉ có ở client vẫn hoạt động nhờ cơ chế dự phòng phía server, nhưng lệnh kiểm tra sẽ báo chỗ không khớp.

Đặt mặc định trong `config.yml`:

```yaml
i18n:
  defaultLocale: zh-CN
```

Lựa chọn đã lưu trên trình duyệt được ưu tiên. Hãy kiểm tra giá trị mặc định trong một ngữ cảnh trình duyệt mới thay vì xóa tùy chọn của mọi người dùng. Giữ lại `useSyncServerLocale()` để phiên phía server theo đúng lựa chọn được hỗ trợ trên trình duyệt.

### Dùng theme token có ngữ nghĩa

Dùng các class có ngữ nghĩa như `bg-background`, `text-foreground`, `text-muted-foreground` và `border-border`. Theme cung cấp màu và kích thước. Tránh cố định nền sáng rồi sửa riêng cho chế độ tối trong từng component.

Ví dụ hiện tại tổ chức theme như sau:

| File | Trách nhiệm |
| --- | --- |
| `client/theme/themes/compact.css` | Compact, preset mặc định |
| `client/theme/themes/default.css` | Spacious, với ID `default` |
| `client/theme/theme-presets.ts` | Các preset có sẵn và key nhãn |
| `client/styles.css` | Import preset và nối token với Tailwind |
| `client/theme/theme-provider.tsx` | Trạng thái theme sẵn có; đừng thêm Provider khác |

Chế độ màu và preset là hai lựa chọn độc lập. Một preset định nghĩa quy tắc cho cả sáng và tối, thay vì ép một chế độ. Hãy quản lý mật độ, kiểu chữ, bo góc và đổ bóng qua token.

### Thay đổi hoặc thêm theme

Với preset sẵn có, sửa file theme của nó và kiểm tra mọi trang bị ảnh hưởng. Để thêm một preset thương hiệu độc lập:

1. Sao chép một preset đầy đủ thành `client/theme/themes/brand.css`, giữ lại mọi token màu và không phải màu.
2. Đổi các selector sáng, tối và `.theme-preview` thành `data-theme='brand'`, rồi điều chỉnh màu trong từng quy tắc. Chỉ ghi đè một phần `--primary` không phải là một preset đầy đủ.
3. Import file từ `client/styles.css`, giữ nguyên các preset hiện có và thứ tự import.
4. Thêm `{ id: 'brand', labelKey: 'appearance.themes.brand' }` vào cuối `theme-presets.ts`, giữ nguyên thứ tự dự phòng hiện có và dịch nhãn sang cả hai ngôn ngữ.
5. Kiểm tra độ dễ đọc, focus và các chế độ màu trên trang và bản xem trước thực tế, rồi chạy test theme.

Đây là hướng dẫn tạo preset; ví dụ không kèm sẵn một theme `brand` hoàn chỉnh. Đừng chạy lại `shadcn init`, thêm một Provider `next-themes` khác hay bỏ qua preset bằng ghi đè `:root` toàn cục.

### Đặt giao diện mặc định

Với các preset sẵn có, cấu hình `config.yml`:

```yaml
client:
  app:
    defaultColorScheme: system
    defaultTheme: compact
```

`defaultColorScheme` nhận `light`, `dark` hoặc `system`; `defaultTheme` là tên một preset đã đăng ký. Lựa chọn hợp lệ đã lưu trên trình duyệt được ưu tiên, sau đó đến giá trị mặc định đã cấu hình và giá trị dự phòng có sẵn. `default` là ID của preset Spacious, không phải chỉ dẫn đặc biệt để tự động chọn.

Nạp lại cấu hình server và làm mới trang sau khi thay đổi. Mã đọc hay thay đổi giao diện qua các hook sẵn có `useTheme()` và `useThemePreset()`, không thao tác trực tiếp với storage key hay thuộc tính của `<html>`.

## Kiểm tra kết quả

Khi sửa nội dung chữ, chạy các kiểm tra locale và kiểu liên quan. Thêm test theme khi thay đổi theme:

```bash
pnpm exec vitest run tests/client/app-locale-coverage.test.ts
pnpm exec tsc -p tsconfig.json --noEmit
pnpm exec vitest run tests/client/theme-tokens.test.ts tests/client/theme-preferences.test.ts tests/client/client-theme.test.tsx
```

Kiểm tra cả hai ngôn ngữ, chế độ sáng và tối, màn hình hẹp, focus bàn phím, trạng thái trống và lỗi của field trên trình duyệt. Kiểm tra giá trị mặc định tách riêng với tùy chọn đã lưu. Kiểu dữ liệu và việc biên dịch CSS không xác lập được độ dễ đọc về mặt thị giác.
