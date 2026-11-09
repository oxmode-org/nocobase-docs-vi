---
title: Chủ đề và kiểu hiển thị
description: Dùng token theo vai trò, tùy chỉnh bộ chủ đề, đổi giao diện bằng hook và cấu hình mặc định cho khách mới.
---

Xây dựng giao diện nghiệp vụ bằng thành phần shadcn có sẵn và token theo vai trò. Chỉnh màu, khoảng cách, phông chữ và độ bo góc trong tệp chủ đề để danh sách, biểu mẫu và hộp thoại thay đổi đồng bộ. Thành phần NocoBase UI Library và khối nghiệp vụ dùng chung quy ước này.

Ví dụ danh mục sản phẩm dùng template mặc định `1.0.0-beta.85`, gồm danh sách, hộp thoại chỉnh sửa và ba bộ chủ đề. Thay đổi sản phẩm chỉ lưu trong bộ nhớ và đặt lại khi tải lại trang. Tùy chọn giao diện dùng cơ chế lưu trên trình duyệt của template. Có thể [chạy ví dụ](#example-source-and-setup) trước khi thử từng tính năng.

<a id="color-modes-and-theme-presets"></a>

## Chế độ màu và bộ chủ đề

Hai cài đặt giao diện hoạt động độc lập:

- **Chế độ màu** chọn quy tắc sáng hoặc tối bằng `light`, `dark` hoặc `system`. `system` theo hệ điều hành.
- **Bộ chủ đề** quy định bảng màu, phông chữ, mật độ, độ bo góc và bóng đổ. Mỗi bộ hỗ trợ cả sáng và tối. Chế độ màu giữ nguyên khi đổi bộ chủ đề.

Template có `compact` (Compact) và `default` (Spacious). `default` là ID của bộ Spacious. Ví dụ còn đăng ký `brand` (Brand).

Có thể duy trì các tệp template sau trong ứng dụng:

| Tệp | Công dụng |
| --- | --- |
| `client/theme/themes/*.css` | Token và quy tắc sáng, tối của từng bộ chủ đề |
| `client/styles.css` | Import chủ đề và nối với lớp tiện ích Tailwind |
| `client/theme/theme-presets.ts` | ID bộ chủ đề và khóa dịch nhãn |
| `client/theme/theme-provider.tsx` | Trạng thái, lựa chọn đã lưu và đồng bộ giữa các tab |

`AppThemeProvider` đã được đăng ký tại gốc ứng dụng. Dùng trạng thái từ Provider này trong thành phần nghiệp vụ và tái sử dụng cấu hình shadcn hiện có.

<a id="build-components-with-theme-tokens"></a>

## Xây dựng thành phần bằng token chủ đề

<a id="colors-and-interaction-states"></a>

### Màu sắc và trạng thái tương tác

Chọn lớp theo vai trò để màu tự đổi theo chủ đề. Khung danh mục dùng `bg-card text-card-foreground` và văn bản phụ dùng `text-muted-foreground`:

```tsx
// client/pages/products/index.tsx: panel markup inside the component
<section className='overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm'>
  <div className='flex flex-col gap-2 border-b border-border p-6'>
    <h2 className='font-heading text-lg font-semibold'>{t('products.inventory')}</h2>
    <p className='text-sm text-muted-foreground'>{t('products.editHint')}</p>
  </div>
  <DataTable columns={columns} data={products} pagination={false} getRowId={(product) => product.id} />
</section>
```

`DataTable` là thành phần bảng sẵn có. Trang này định nghĩa `columns` và `products`. Xem [mã nguồn trang sản phẩm](https://github.com/nocobase/docs-examples-v3/blob/d2a4fc7ef80558996299c2475abeefe049aa6874/apps/themes-and-styles/client/pages/products/index.tsx) để tra import, cột và dữ liệu.

Chọn lớp nền và lớp nội dung theo cặp:

| Mục đích | Lớp |
| --- | --- |
| Trang | `bg-background text-foreground` |
| Thẻ và khung | `bg-card text-card-foreground` |
| Khung nổi | `bg-popover text-popover-foreground` |
| Thao tác chính | `bg-primary text-primary-foreground` |
| Văn bản phụ | `text-muted-foreground` |
| Đường phân cách và văn bản lỗi | `border-border`, `text-destructive` |

Dùng lại nút, ô nhập và hộp thoại có sẵn vì chúng đã xử lý trạng thái rê chuột, lấy tiêu điểm và vô hiệu hóa. Khi kiểm tra đầu vào thất bại, đặt `aria-invalid` và hiển thị thông báo lỗi để người dùng nhận ra vấn đề cả khi khó phân biệt màu. Xem [mã nguồn biểu mẫu chỉnh sửa](https://github.com/nocobase/docs-examples-v3/blob/d2a4fc7ef80558996299c2475abeefe049aa6874/apps/themes-and-styles/client/pages/products/edit.tsx).

Chọn **Light → Compact** để xem khung, bảng và nhãn trạng thái. Sau đó chọn **Dark** để các thành phần đó dùng token tối.

![Danh sách sản phẩm và màu theo vai trò trong chủ đề Compact](/assets/core/themes-and-styles/compact-light.png)

<a id="spacing-radii-and-fonts"></a>

### Khoảng cách, độ bo góc và phông chữ

Kích thước cũng dùng lớp tiện ích theo chủ đề. Trong ví dụ trên, `p-6` đọc `--spacing`, `rounded-lg` đọc `--radius` và `shadow-sm` đọc `--shadow-sm`. Dùng `font-heading` cho tiêu đề, `font-sans` cho nội dung và `font-mono` cho mã hoặc SKU.

```tsx
// client/pages/products/index.tsx: contents of the SKU column
<code className='text-sm text-muted-foreground'>{row.original.sku}</code>
```

`text-sm` dùng cả token cỡ chữ và chiều cao dòng. Khi chỉnh mật độ, kiểm tra ô nhập và nút vì chiều cao cố định có thể cắt chữ sau khi đổi cỡ.

Chọn **Spacious** để tăng khoảng cách trong bảng và khung mà vẫn giữ màu. **Brand** còn minh họa tiêu đề có chân và góc bo lớn hơn. Xem [Thêm bộ chủ đề thương hiệu](#add-a-brand-preset).

![Danh sách sản phẩm trong chủ đề Spacious](/assets/core/themes-and-styles/default-light.png)

<a id="customize-theme-presets"></a>

## Tùy chỉnh bộ chủ đề

<a id="change-an-existing-preset"></a>

### Sửa bộ chủ đề hiện có

Sửa trực tiếp tệp CSS tương ứng. Ví dụ đổi `--spacing` trong `compact.css` từ `0.225rem` của template xuống `0.21rem`:

```css
/* client/theme/themes/compact.css: a token in the existing rule */
:root[data-theme='compact'],
.theme-preview[data-theme='compact'] {
  /* Retain the other tokens. */
  --spacing: 0.21rem;
}
```

Chọn **Compact** để thu gọn khung sản phẩm, nút và bảng như trong [ảnh Compact](#colors-and-interaction-states). `.theme-preview` áp dụng cùng token cho ảnh xem trước trong bộ chọn giao diện.

Compact và Spacious dùng chung màu, phông chữ và bóng đổ, nhưng khác mật độ. Khi cập nhật bảng màu hoặc phông chữ chung, sửa cả hai tệp. Có thể thêm bộ riêng để giữ một kiểu hiển thị khác. Giữ ID hiện có vì tùy chọn trình duyệt và cấu hình tham chiếu chúng.

[Xem mã nguồn bộ Compact](https://github.com/nocobase/docs-examples-v3/blob/d2a4fc7ef80558996299c2475abeefe049aa6874/apps/themes-and-styles/client/theme/themes/compact.css)

<a id="add-a-brand-preset"></a>

### Thêm bộ chủ đề thương hiệu

Sao chép một bộ đầy đủ vào `client/theme/themes/brand.css` rồi đổi ID trong bộ chọn CSS thành `brand`. Giữ mọi token màu và token khác, sau đó chỉnh các giá trị cần thiết. Đoạn sau minh họa một số thay đổi. Xem [bộ Brand đầy đủ](https://github.com/nocobase/docs-examples-v3/blob/d2a4fc7ef80558996299c2475abeefe049aa6874/apps/themes-and-styles/client/theme/themes/brand.css) để tra các token còn lại.

```css
/* client/theme/themes/brand.css: excerpt */
:root[data-theme='brand'],
.theme-preview[data-theme='brand'] {
  /* Retain the remaining tokens from the complete preset. */
  --font-heading: var(--font-serif);
  --spacing: 0.25rem;
  --radius: 0.75rem;
  --primary: #0f766e;
  --primary-foreground: rgb(255 255 255);
  --accent: #f0fdfa;
  --accent-foreground: #115e59;
  --ring: var(--primary);
}

:root.dark[data-theme='brand'],
:root.dark .theme-preview[data-theme='brand'] {
  /* Retain the full set of dark color tokens. */
  --primary: #5eead4;
  --primary-foreground: #042f2e;
  --accent: #134e4a;
  --accent-foreground: #99f6e4;
  --ring: var(--primary);
}
```

Dùng giá trị màu CSS hoàn chỉnh như HEX, RGB hoặc OKLCH. Các giá trị này dùng trực tiếp, không cần bọc thêm `hsl()`. Chỉnh màu nền và nội dung cùng nhau cho bộ chọn sáng, tối và xem trước. Giới hạn quy tắc vào bộ chọn của chủ đề mới vì `:root` và `:root.dark` đứng riêng có thể ghi đè giá trị dự phòng của chủ đề khác.

Kết nối bộ chủ đề ở ba nơi:

1. Import sau các bộ hiện có trong `client/styles.css`, giữ `default.css` đầu tiên.

   ```css
   @import './theme/themes/default.css';
   @import './theme/themes/compact.css';
   @import './theme/themes/brand.css';
   ```

2. Thêm vào cuối danh sách trong `client/theme/theme-presets.ts`, giữ `compact` đầu tiên.

   ```ts
   export const themePresets = [
     { id: 'compact', labelKey: 'appearance.themes.compact' },
     { id: 'default', labelKey: 'appearance.themes.default' },
     { id: 'brand', labelKey: 'appearance.themes.brand' },
   ] as const;

   export type ThemePresetId = (typeof themePresets)[number]['id'];
   ```

3. Bổ sung vào tệp locale và giữ các bản dịch hiện có. Ví dụ tiếng Anh ở dưới. Mở rộng `systemZhCN.appearance` tương tự trong tệp tiếng Trung với `brand: '品牌'`. Xem [Bản địa hóa](localization.md).

   ```ts
   // client/locales/en-US.ts: a field in the enUS object
   appearance: {
     ...systemEnUS.appearance,
     themes: { ...systemEnUS.appearance.themes, brand: 'Brand' },
   },
   ```

Xem triển khai đầy đủ trong [điểm vào CSS](https://github.com/nocobase/docs-examples-v3/blob/d2a4fc7ef80558996299c2475abeefe049aa6874/apps/themes-and-styles/client/styles.css), [danh sách bộ chủ đề](https://github.com/nocobase/docs-examples-v3/blob/d2a4fc7ef80558996299c2475abeefe049aa6874/apps/themes-and-styles/client/theme/theme-presets.ts) và [tài nguyên ngôn ngữ](https://github.com/nocobase/docs-examples-v3/tree/d2a4fc7ef80558996299c2475abeefe049aa6874/apps/themes-and-styles/client/locales).

Bảng giao diện tự liệt kê bộ chủ đề mới. Chọn **Brand**, lần lượt chọn **Light** và **Dark** để xem màu chính, phông tiêu đề và độ bo góc đổi cùng nhau.

![Bộ Brand ở chế độ sáng](/assets/core/themes-and-styles/brand-light.png)

![Bộ Brand ở chế độ tối](/assets/core/themes-and-styles/brand-dark.png)

<a id="read-and-change-appearance"></a>

## Đọc và đổi giao diện

<a id="change-the-color-mode"></a>

### Đổi chế độ màu

Import `useTheme()` từ `next-themes`. `theme` là lựa chọn `light`, `dark` hoặc `system`. `resolvedTheme` là chế độ sáng hoặc tối đang áp dụng. Đổi lựa chọn bằng `setTheme()`.

```tsx
// client/pages/products/appearance-controls.tsx: ColorModeControls excerpt
import { useTheme } from 'next-themes';
import { Button } from '#components/ui/button';

// Inside the component; t comes from useTranslation().
const { theme, resolvedTheme, setTheme } = useTheme();

// Render the mode buttons.
{(['light', 'dark', 'system'] as const).map((mode) => (
  <Button
    key={mode}
    variant={theme === mode ? 'default' : 'outline'}
    aria-pressed={theme === mode}
    onClick={() => setTheme(mode)}
  >
    {t(`appearance.${mode}`)}
  </Button>
))}
```

Chọn **System**. Mục **Applied mode** trên trang đọc `resolvedTheme`. Đổi giao diện hệ điều hành để thấy chế độ áp dụng thay đổi trong khi lựa chọn vẫn là **System**. Khi cần xác định màu thực tế, đọc `resolvedTheme`.

![Chế độ System đang áp dụng giao diện sáng](/assets/core/themes-and-styles/system-light.png)

[Xem thành phần đổi chế độ màu](https://github.com/nocobase/docs-examples-v3/blob/d2a4fc7ef80558996299c2475abeefe049aa6874/apps/themes-and-styles/client/pages/products/appearance-controls.tsx)

<a id="change-the-theme-preset"></a>

### Đổi bộ chủ đề

`useThemePreset()` của template trả `preset` hiện tại và hàm `setPreset()`. Ví dụ tạo nút từ danh sách đăng ký để kiểu ID khớp với các bộ đã khai báo:

```tsx
// client/pages/products/appearance-controls.tsx: PresetControls excerpt
import { useThemePreset } from '../../theme/theme-context.js';
import { themePresets } from '../../theme/theme-presets.js';

// Inside the component; Button and t are the same as in the previous example.
const { preset, setPreset } = useThemePreset();

{themePresets.map(({ id, labelKey }) => (
  <Button
    key={id}
    variant={preset === id ? 'default' : 'outline'}
    aria-pressed={preset === id}
    onClick={() => setPreset(id)}
  >
    {t(labelKey)}
  </Button>
))}
```

Dùng cả hai hook trong `AppThemeProvider` hiện có. Để Provider quản lý khóa lưu trữ, thuộc tính `<html>` và trạng thái lựa chọn dùng chung.

Chọn một bộ trên trang sản phẩm rồi mở **Appearance** ở góc trên bên phải. Tùy chọn và ảnh xem trước tương ứng được đánh dấu. Khi đổi bộ tại đó, các nút trên trang cũng cập nhật. Tải lại hoặc mở tab khác của cùng ứng dụng vẫn giữ lựa chọn.

![Bảng Appearance hiển thị Brand và ảnh xem trước tối](/assets/core/themes-and-styles/appearance-preview.png)

[Xem thành phần chọn bộ chủ đề](https://github.com/nocobase/docs-examples-v3/blob/d2a4fc7ef80558996299c2475abeefe049aa6874/apps/themes-and-styles/client/pages/products/appearance-controls.tsx)

<a id="configure-appearance-defaults"></a>

## Cấu hình giao diện mặc định

<a id="set-the-default-mode-and-preset"></a>

### Đặt chế độ và bộ chủ đề mặc định

Chạy từ thư mục gốc ứng dụng để trình duyệt chưa lưu tùy chọn dùng Brand ở chế độ tối:

```bash
pnpm nocobase config set client.app.defaultColorScheme=dark client.app.defaultTheme=brand --json
```

Lệnh đặt các giá trị sau trong `config.yml`:

```yaml
client:
  app:
    defaultColorScheme: dark
    defaultTheme: brand
```

`defaultColorScheme` nhận `light`, `dark` hoặc `system`. `defaultTheme` phải là ID đã đăng ký. Chế độ phát triển khởi động lại server sau khi cấu hình đổi. Ở chế độ khác, khởi động lại server rồi tải lại trang. Đặt mặc định trong tệp để quá trình khởi động và khi React gắn thành phần dùng cùng giá trị.

Mở trang sản phẩm trong cửa sổ riêng tư mới. **Dark** và **Brand** cần được chọn. Đây là giá trị mặc định áp dụng khi trình duyệt chưa lưu lựa chọn tường minh.

![Trình duyệt mới dùng mặc định Dark và Brand](/assets/core/themes-and-styles/configured-defaults.png)

Khôi phục cấu hình ban đầu của ví dụ:

```bash
pnpm nocobase config set client.app.defaultColorScheme=system client.app.defaultTheme=compact --json
```

[Xem cấu hình ví dụ](https://github.com/nocobase/docs-examples-v3/blob/d2a4fc7ef80558996299c2475abeefe049aa6874/apps/themes-and-styles/config.example.yml)

<a id="defaults-and-saved-preferences"></a>

### Mặc định và tùy chọn đã lưu

Mỗi cài đặt chọn nguồn hợp lệ đầu tiên theo thứ tự: lựa chọn đã lưu trong trình duyệt, mặc định từ `config.yml`, rồi giá trị dự phòng tích hợp. Chế độ màu dự phòng là `system`. Bộ dự phòng là mục đầu tiên đã đăng ký, tức `compact` trong ví dụ. Chế độ sai và ID chưa đăng ký bị bỏ qua.

Để kiểm tra, chọn **Light → Spacious** trong một cửa sổ rồi đổi mặc định thành **Dark → Brand**. Tải lại cửa sổ ban đầu vẫn dùng Light và Spacious. Cửa sổ riêng tư mới dùng Dark và Brand. Nếu chỉ lưu chế độ màu, bộ chủ đề vẫn có thể dùng mặc định cấu hình, và ngược lại.

Tùy chọn được cô lập theo origin trình duyệt và đường dẫn triển khai. Chúng lưu cục bộ trên từng thiết bị. Nếu vùng lưu trữ không khả dụng, lựa chọn vẫn áp dụng trên trang hiện tại nhưng có thể mất khi tải lại.

[Xem mã nguồn xác định tùy chọn](https://github.com/nocobase/docs-examples-v3/blob/d2a4fc7ef80558996299c2475abeefe049aa6874/apps/themes-and-styles/client/theme/theme-preferences.ts)

<a id="check-the-theme-in-use"></a>

## Kiểm tra giao diện thực tế

Sau khi sửa bộ chủ đề, mở các trang thực tế ở chế độ sáng, tối và kích thước hẹp. Chú ý nội dung chính, văn bản phụ, nút chính, tiêu điểm bàn phím và hộp thoại. Kiểm tra độ tương phản giữa màu chữ và nền để xác nhận khả năng đọc sau khi CSS dựng thành công.

Chọn **Arc desk lamp**, xóa tên sản phẩm, nhập giá `-1` rồi chọn **Save**. Hộp thoại cần giữ đầu vào, hiển thị cả hai lỗi và đưa tiêu điểm về ô tên. Sửa rồi lưu để cập nhật danh sách. Tải lại trang sẽ khôi phục dữ liệu minh họa. Nhấn Escape để hủy và đưa tiêu điểm về liên kết sản phẩm đã mở hộp thoại.

![Lỗi kiểm tra và tiêu điểm trong bộ Brand sáng](/assets/core/themes-and-styles/brand-error-light.png)

![Lỗi kiểm tra và tiêu điểm trong bộ Brand tối](/assets/core/themes-and-styles/brand-error-dark.png)

Trên màn hình hẹp, các nút điều khiển giao diện xếp dọc. Bảng rộng cuộn trong vùng riêng để chiều rộng toàn trang giữ nguyên.

Chạy kiểm thử chủ đề, kiểm thử trang và kiểm tra kiểu từ thư mục gốc ứng dụng ví dụ:

```bash
pnpm exec vitest run tests/client/theme-tokens.test.ts tests/client/theme-preferences.test.ts tests/client/client-theme.test.tsx tests/client/app-locale-coverage.test.ts tests/client/products.test.tsx
pnpm exec tsc -p tsconfig.json --noEmit
```

Kiểm thử bao phủ độ đầy đủ của token, lựa chọn dự phòng, chuyển giao diện và tương tác biểu mẫu. README ghi lệnh kiểm thử trình duyệt. Dùng ảnh và kết quả tự động cùng kiểm tra khả năng đọc trực tiếp.

<a id="example-source-and-setup"></a>

## Mã nguồn và thiết lập ví dụ

[Ví dụ đầy đủ và README](https://github.com/nocobase/docs-examples-v3/tree/d2a4fc7ef80558996299c2475abeefe049aa6874/apps/themes-and-styles) yêu cầu Node.js 24 trở lên và pnpm 11. Phiên bản dependency được khóa trong `pnpm-lock.yaml`. Lấy mã nguồn vào thư mục riêng:

```bash
git clone https://github.com/nocobase/docs-examples-v3.git
cd docs-examples-v3
git checkout d2a4fc7ef80558996299c2475abeefe049aa6874
cd apps/themes-and-styles
pnpm install --frozen-lockfile
pnpm nocobase config init --dialect sqlite --json
pnpm nocobase config check --json
pnpm dev
```

Nối `products` vào URL được in khi khởi động. Ứng dụng gắn ở `/main/` phục vụ trang tại `/main/products`. Trang minh họa mở được khi chưa đăng nhập. Ví dụ độc lập dùng SQLite. Chủ đề hoạt động độc lập với cơ sở dữ liệu và dịch vụ ngoài. Khi áp dụng vào ứng dụng hiện có, dùng cấu hình đang chạy.

README chỉ vị trí mã cho từng cách dùng, cung cấp bước kiểm tra trình duyệt và ghi phạm vi kiểm chứng. Danh mục hiển thị dữ liệu minh họa tiếng Anh cố định ngay trên trang.
