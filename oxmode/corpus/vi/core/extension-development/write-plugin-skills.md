---
title: Skill của plugin
description: Mô tả năng lực công khai cho Agent của ứng dụng, đồng thời duy trì, đồng bộ và kiểm chứng Skill.
---

Skill của plugin cho Agent của ứng dụng biết những năng lực đã triển khai, điểm vào công khai cần gọi, bên sở hữu dữ liệu và cách kiểm chứng kết quả. Triển khai tính năng và đăng ký plugin là các bước riêng.

Bài này hướng dẫn viết tài liệu sử dụng thuộc plugin. Hướng dẫn phát triển chung `nocobase-app-plugin-development` do `@nocobase/app-skills` cung cấp. Chọn tên thuộc package nghiệp vụ của mình và tham chiếu hướng dẫn chung tại nguồn.

Xem [Hướng dẫn phát triển plugin (AGENTS.md)](plugin-development-guidance.md) để viết chỉ dẫn sửa và bảo trì mã nguồn. Bài này dành cho Agent sử dụng năng lực plugin, từ cách gọi đến phân phối, đồng bộ và kiểm chứng.

## Cùng Agent

```text
Viết Skill cho notice-cli để Agent của ứng dụng có thể xem trước nội dung thông báo.
Mô tả lệnh preview đã triển khai, gồm đầu vào, đầu ra, lỗi và điều kiện đăng ký.
Duy trì Skill trong mã nguồn plugin. Kiểm tra đồng bộ và chạy lệnh từ ứng dụng đích.
```

## Khi nào plugin cần Skill

Skill hữu ích khi Agent thường gọi API, kết hợp component công khai, dùng dịch vụ hoặc chẩn đoán cấu hình. Với plugin chỉ có trang thông thường, chỉ thêm Skill nếu có quy trình tích hợp cần giải thích.

Ví dụ ghi lại cách dùng `notice-cli` từ [Mở rộng dòng lệnh](extend-command-line.md). Thêm `skills/` vào plugin đang có. Khi tạo mới, `--with skills` sinh bản nháp để điền theo hành vi đã triển khai.

## Duy trì nguồn trong plugin

Cấu trúc trong ứng dụng:

```text
packages/app-plugin-notice-cli/
├── cli/
├── skills/
│   └── nocobase-app-plugin-notice-cli/
│       └── SKILL.md
└── package.json
```

Đặt tên theo package sở hữu. `@nocobase/app-plugin-notice-cli` dùng `nocobase-app-plugin-notice-cli`. Với scope riêng, giữ tên tổ chức, chẳng hạn `@acme/app-plugin-notice-cli` dùng `acme-app-plugin-notice-cli`. Tác vụ độc lập có thể thêm hậu tố vào tiền tố của package.

Thêm `skills` vào danh sách `files` trong `package.json` của plugin, đồng thời giữ `dist`, README và mục hiện có. Đưa Skill vào package phát hành dưới dạng tệp nguồn.

## Skill có thể làm theo

Tạo `skills/nocobase-app-plugin-notice-cli/SKILL.md`.

````markdown
---
name: nocobase-app-plugin-notice-cli
description: Xem trước nội dung thông báo bằng plugin notice-cli khi kiểm tra khoảng trắng hoặc số ký tự. Thao tác chỉ tạo kết quả xem trước.
---

# Xem trước nội dung thông báo

Làm việc từ gốc ứng dụng đích. Dùng CLI công khai của plugin đã cài.

## Điều kiện tiên quyết

Ứng dụng khai báo dependency `@nocobase/app-plugin-notice-cli` và đăng ký điểm xuất
`./cli` trong `cli/plugins.ts`. Nếu lệnh chưa có, kiểm tra điểm xuất của package
đã cài và đăng ký trước khi thử lại.

## Xem trước

Chạy:

```bash
pnpm nocobase notice-cli preview --text "Hello" --json
```

Lệnh cắt khoảng trắng đầu cuối và nhận từ 1 đến 200 đơn vị mã UTF-16 sau khi cắt.
Kết quả có `result.text` và `result.length`, trong đó độ dài đếm theo điểm mã
Unicode. Lệnh xử lý văn bản tại chỗ. Trong bản triển khai, dùng điểm vào CLI đã build.

Kết quả thành công có `ok: true`, `result.text: "Hello"` và `result.length: 5`.
Văn bản rỗng hoặc quá dài trả `error.code: "INVALID_TEXT"` và mã thoát khác 0.
Báo lỗi rồi sửa đầu vào trước khi thử lại.

Lưu, phát hành và gửi thông báo là các thao tác riêng. Chỉ thực hiện khi đã có
năng lực tương ứng và người dùng yêu cầu.
````

`description` cho biết khi nào dùng năng lực. Phần thân mô tả quy trình và kết quả mong đợi. Đặt chi tiết thiết kế ở tài liệu khác. Với schema API hoặc bảng xử lý lỗi dài, liên kết tới tệp trong `references/` cạnh Skill.

## Điểm vào công khai và ranh giới

| Nội dung cần giải thích | Cách hướng dẫn Agent |
| --- | --- |
| Điểm xuất package, API và lệnh CLI | Dùng giao diện công khai |
| Xác thực, quyền tài nguyên và thao tác, phạm vi dữ liệu | Kiểm tra quyền ở server |
| Điều kiện, cấu hình và đăng ký do ứng dụng quản lý | Xác minh năng lực đã được đăng ký trước khi gọi |
| Mã lỗi và kết quả ổn định | Đọc phản hồi theo hợp đồng |
| Hành vi được hỗ trợ | Chỉ gọi tính năng đã triển khai |

Đăng ký factory Client riêng khi dùng component công khai cần tài nguyên plugin. Bên sử dụng ở server import token gốc qua điểm vào công khai. Ghi các điều kiện tích hợp này trong Skill.

## Mô tả tài nguyên mã nguồn UI

Nếu plugin cung cấp mã nguồn qua shadcn UI Registry, ghi cách build cục bộ và đường dẫn tài nguyên hoặc URL đã phát hành. Mô tả cách cài vào ứng dụng hay plugin, đầu vào, dependency và cách kết hợp với năng lực công khai. Có thể cài trực tiếp tài nguyên cục bộ. Đưa ví dụ đổi bố cục hoặc tương tác cùng bước kiểm chứng để Agent ghép kết quả vào dự án đích.

Ghi rõ điều kiện đăng ký plugin backend, bản dịch và route khi cần. Dự án đích duy trì bản sao nguồn đã cài và cập nhật nó theo quy trình riêng khi nâng cấp plugin. Xem [Viết hướng dẫn sử dụng cho Agent](frontend-components.md#write-agent-usage-instructions).

## Đồng bộ vào ứng dụng

Chạy từ gốc ứng dụng.

```bash
pnpm nocobase skills sync --package @nocobase/app-plugin-notice-cli
```

Đăng ký plugin mặc định cũng đồng bộ các Skill đi kèm. Bản trong `.agents/skills/` được sinh lại khi đồng bộ. Chỉnh nguồn trong plugin để thay đổi được giữ. Tùy client, Agent đang chạy có thể cần phiên mới để nạp bản đã cập nhật.

## Kiểm chứng phân phối và hành vi

Kiểm tra bản đồng bộ tồn tại. Yêu cầu Agent làm theo Skill và chạy `preview --text Hello --json`. Mong đợi văn bản `Hello` và độ dài 5. Kiểm tra văn bản rỗng trả lỗi đã mô tả và Agent báo đúng rằng thao tác chỉ xem trước.

Kiểm tra cả việc phân phối lẫn hành vi thực tế. Trước khi phát hành, xem kết quả `pnpm --filter @nocobase/app-plugin-notice-cli pack` để xác nhận có `skills/` và các điểm vào runtime công khai. Xem [Build và phát hành](publish-plugin.md) để cài trong ứng dụng khác.

Khi đổi lệnh công khai, đối số, quyền hoặc phản hồi, cập nhật mã nguồn, kiểm thử và Skill cùng nhau. Ứng dụng nhận hướng dẫn mới qua nâng cấp package và đồng bộ lại.
