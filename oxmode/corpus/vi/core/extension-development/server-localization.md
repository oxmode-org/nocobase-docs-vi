---
title: Bản địa hóa phía server
description: Khai báo tài nguyên phía server của plugin và dùng đúng namespace, ngôn ngữ trong yêu cầu và tác vụ nền.
---

Plugin duy trì nội dung phía server trong `server/locales/` và đóng góp qua `locales` trong `server/plugin.ts`. Trang client dùng [tài nguyên client](localization.md) riêng. Đăng ký điểm vào Server để runtime nạp tài nguyên phía server.

## Cùng Agent

```text
Thêm bản dịch phía server cho phản hồi API và thông báo nền của plugin này.
Giữ mã lỗi ổn định và gắn tường minh tên package đầy đủ của plugin làm namespace.
Dịch phản hồi theo ngôn ngữ của từng yêu cầu và thông báo nền theo ngôn ngữ
của từng người nhận. Hoàn thiện tài nguyên được hỗ trợ và kiểm chứng hai ngôn ngữ
của yêu cầu cùng thông báo cho người nhận có lựa chọn ngôn ngữ khác nhau trong ứng dụng đích.
```

## Khai báo tài nguyên phía server

Chọn `server.locales` khi tạo plugin. Với plugin đang có, giữ phần triển khai rồi thêm tài nguyên, loader và khai báo phía server. Các đường dẫn tính từ gốc plugin.

```text
server/
├── locales/
│   ├── en-US.ts
│   ├── zh-CN.ts
│   ├── …
│   └── index.ts
└── plugin.ts
```

Tiếng Anh định nghĩa cấu trúc khóa. Các ngôn ngữ khác dùng kiểu tài nguyên đầy đủ. Loader import động từng ngôn ngữ. Dùng lại quy ước ở [Định nghĩa khóa bằng tiếng Anh](localization.md#define-keys-in-english), đặt tệp trong `server/locales/` và khai báo kiểu tài nguyên riêng cho phía server.

Giữ `packageName`, `baseDir` và các đóng góp hiện có trong `server/plugin.ts`. Gán tập loader xuất từ `server/locales/index.ts` vào `locales`. Đăng ký điểm vào Server trong ứng dụng để nạp các tài nguyên này. Xem [Khai báo và điểm xuất công khai của plugin](plugin-declarations.md#server).

<span id="server-copy-has-separate-resources"></span>

## Dịch nội dung theo yêu cầu

Ví dụ giả định điểm vào Server và tài nguyên đã được đăng ký. Xem [Route và HTTP API](server-apis.md) để tích hợp yêu cầu và [Tác vụ nền và executor](background-jobs.md) cho các điểm vào chạy nền.

Thêm `messages.ready` vào mọi ngôn ngữ phía server, rồi dùng trong handler do ứng dụng gắn.

```ts
import { getRequestTranslator } from '@nocobase/i18n/server';

// Inside a handler mounted by the App, with the plugin's Server locales registered:
const t = getRequestTranslator(context, '@nocobase/app-plugin-notice-i18n');
return context.json({ data: { message: t('messages.ready') } });
```

Ứng dụng xác định ngôn ngữ của yêu cầu từ tùy chọn phiên, `Accept-Language` và ngôn ngữ mặc định. Truyền tên package tường minh để Hono dùng đúng namespace của plugin.

Giữ `ApiError.reason` ổn định để chương trình xử lý lỗi. Truyền nội dung đã dịch cho người dùng qua `localizedMessage`.

Job, email và thông báo chạy ngoài ngữ cảnh yêu cầu hiện tại. Chọn locale của từng người nhận, gọi `i18n.ensureLocaleLoaded(locale)`, rồi gọi `i18n.getFixedT(namespace, locale)`. Khi có nhiều người nhận, chọn bản dịch theo tùy chọn riêng của từng người.

<h2 id="verify-integration">Kiểm chứng tích hợp</h2>

Dùng ứng dụng kiểm thử đã đăng ký plugin Server thật. Gọi cùng endpoint bằng các ngôn ngữ được hỗ trợ. Kiểm tra nội dung được dịch và mã lỗi cùng cấu trúc phản hồi giữ ổn định. Xem [Bản địa hóa phía server trong ứng dụng](../developing-apps/server-localization.md) để tích hợp và xem ví dụ chọn ngôn ngữ yêu cầu.

Chạy tác vụ nền cho những người nhận có tùy chọn ngôn ngữ khác nhau. Xác minh tài nguyên đã nạp trước khi sinh thông báo. Giữ locale trong phạm vi từng yêu cầu hoặc tác vụ để các luồng chạy đồng thời dùng đúng ngôn ngữ.

Chạy kiểm tra kiểu của plugin, kiểm thử Server liên quan và build ứng dụng. Kiểu tài nguyên xác nhận đủ khóa. Trong ứng dụng đích, kiểm tra thêm đăng ký điểm vào Server, yêu cầu thật, nội dung lỗi và thông báo nền. Xem [Bản địa hóa phía server trong ứng dụng](../developing-apps/server-localization.md) để cấu hình ngôn ngữ và ghi đè tài nguyên mô-đun.
