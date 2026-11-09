---
title: Hướng dẫn phát triển plugin (AGENTS.md)
description: Ghi trách nhiệm, quy ước thay đổi, yêu cầu tương thích và bước kiểm chứng cho Agent làm việc với mã nguồn plugin.
---

`AGENTS.md` của plugin hướng dẫn Agent bảo trì mã nguồn. Tệp mô tả phạm vi plugin phụ trách, các tệp cần sửa khi tính năng thay đổi và cách kiểm chứng kết quả. Giữ những quy ước có ích lâu dài cùng mã nguồn.

Bài này hướng dẫn viết quy ước bảo trì. Xem [Skill của plugin](write-plugin-skills.md) để hướng dẫn Agent của ứng dụng cách gọi, tích hợp và kết hợp các năng lực plugin. Hai tài liệu có thể nói về cùng năng lực nhưng phục vụ người đọc ở hai vai trò khác nhau.

## Vị trí hướng dẫn

Trong workspace ứng dụng, đặt hướng dẫn phát triển tại gốc plugin.

```tree
my-app/
├── AGENTS.md                       # Quy ước chung của ứng dụng
├── .agents/skills/                 # Hướng dẫn đồng bộ từ dependency
└── packages/
    └── app-plugin-notice-cli/
        ├── AGENTS.md              # Quy ước bảo trì mã nguồn plugin
        ├── CLAUDE.md              # Tham chiếu AGENTS.md cùng thư mục
        ├── README.md              # Mô tả và tích hợp plugin
        ├── cli/                   # Phần triển khai lệnh
        ├── tests/                 # Kiểm thử phần triển khai
        └── skills/                # Skill cho bên sử dụng, nếu có
```

Công cụ tạo plugin đã sinh `AGENTS.md` và `CLAUDE.md`. Thêm hướng dẫn vào plugin đang có. Trong template hiện tại, `CLAUDE.md` chứa:

```text
@AGENTS.md
```

Giữ tham chiếu này để duy trì quy ước tại một nguồn duy nhất là `AGENTS.md`. Trước khi sửa plugin, yêu cầu Agent đọc hướng dẫn ở gốc ứng dụng và gốc plugin, sau đó đọc phần mã liên quan.

Template còn trỏ tới `.agents/skills/nocobase-app-plugin-development/SKILL.md` từ các package đã cài trong ứng dụng. Skill phát triển chung này đến từ `@nocobase/app-skills`. Dùng `AGENTS.md` của plugin để bổ sung quy ước riêng và dẫn đến hướng dẫn chung.

`pnpm nocobase skills sync` đồng bộ các Skill do package cung cấp. Quy ước bảo trì mã nguồn nằm trong `AGENTS.md` của plugin, còn hướng dẫn cho bên sử dụng nằm trong `skills/` của plugin.

## Những quy ước cần ghi

Ưu tiên thông tin Agent cần khi sửa mã mà khó suy ra từ tên tệp.

| Chủ đề | Nội dung |
| --- | --- |
| Trách nhiệm và ranh giới | Năng lực đã triển khai. Dữ liệu, quyền và quy tắc nghiệp vụ thuộc ứng dụng hoặc plugin khác |
| Điểm vào chính | Tệp triển khai, khai báo, đăng ký hoặc công khai tính năng |
| Thay đổi liên quan | Khai báo, dependency, kiểm thử và tài liệu cần cập nhật cùng tính năng |
| Tương thích | Đường dẫn công khai, đối số, cấu trúc phản hồi, mã lỗi và token dịch vụ bên sử dụng phụ thuộc |
| Kiểm chứng | Thư mục chạy, lệnh, kết quả mong đợi và yêu cầu về ứng dụng đích |
| Quy ước riêng | Quy tắc trạng thái, ràng buộc migration, quyền sở hữu tài nguyên hoặc điều kiện của dịch vụ ngoài |

Nêu tệp và hành vi cụ thể. Ví dụ, khi đổi trường phản hồi của `preview`, yêu cầu Agent kiểm tra bài kiểm thử CLI và Skill của plugin.

Xem [Cấu trúc plugin](plugin-structure.md) về thư mục và [Khai báo và điểm xuất công khai](plugin-declarations.md) về điểm vào và hợp đồng. Dẫn đến giải thích đã có, rồi bổ sung phần đặc thù của plugin hiện tại. Với UI, giữ quy ước dùng các thành phần cơ bản của shadcn và tra NocoBase UI Library trước. Xem [Component và style](frontend-components.md) để tổ chức tài nguyên mã nguồn.

## Ví dụ hướng dẫn bảo trì notice-cli

Ví dụ dùng plugin `notice-cli` hoàn chỉnh từ [Mở rộng dòng lệnh](extend-command-line.md). Lệnh `preview` chuẩn hóa nội dung thông báo và trả số ký tự. Xem Skill cho bên sử dụng trong [Skill của plugin](write-plugin-skills.md).

Thêm phần dưới đây vào `AGENTS.md` hiện có, giữ tham chiếu Skill chung và các quy ước còn hiệu lực. Đường dẫn tệp tính từ gốc plugin. Chạy lệnh từ gốc ứng dụng.

````markdown
## Bảo trì notice-cli

### Trách nhiệm

Plugin xem trước văn bản qua `notice-cli preview`. Lệnh chỉ xử lý bản xem
trước, không lưu, phát hành, gửi thông báo hoặc khởi chạy dịch vụ ứng dụng.

### Triển khai và hợp đồng công khai

- `cli/preview.ts` triển khai lệnh.
- `cli/index.ts` khai báo các lệnh. Giữ lệnh `info` do công cụ sinh khi thêm lệnh.
- `package.json` công khai `./cli` cho bên dùng mã nguồn và mã biên dịch. Giữ cả hai ánh xạ hợp lệ.
- Giữ `preview --text ... --json` tương thích với các cách gọi đã được tài liệu hóa.
- Sau khi cắt khoảng trắng đầu và cuối, đầu vào phải có 1–200 đơn vị mã UTF-16.
- `result.text` là giá trị đã cắt khoảng trắng. `result.length` đếm điểm mã Unicode.
- Chuỗi rỗng hoặc quá dài trả `INVALID_TEXT` với mã thoát 2.

### Thay đổi và kiểm chứng

Khi đổi hành vi lệnh, cập nhật `tests/cli/preview.test.ts`, README và
`skills/nocobase-app-plugin-notice-cli/SKILL.md` ở những phần bị ảnh hưởng.
Giữ ví dụ đúng với hành vi lệnh và duy trì Skill tại package nguồn.

Chạy từ gốc ứng dụng chứa plugin.

```bash
pnpm --filter @nocobase/app-plugin-notice-cli test tests/cli/preview.test.ts
pnpm --filter @nocobase/app-plugin-notice-cli typecheck
pnpm --filter @nocobase/app-plugin-notice-cli build
```

Sau khi đăng ký plugin trong `cli/plugins.ts` của ứng dụng, kiểm chứng:

```bash
pnpm nocobase notice-cli preview --text " Hello " --json
```

Kết quả mong đợi gồm `ok: true`, `result.text: "Hello"` và `result.length: 5`.
Khi đổi điểm xuất, dependency hoặc tích hợp CLI, build cả ứng dụng chứa
plugin rồi kiểm chứng qua điểm vào CLI đã build.
````

Ví dụ phân biệt hai phép đếm dễ nhầm. Giới hạn đầu vào dùng đơn vị mã UTF-16, còn độ dài trả về dùng điểm mã Unicode. Hướng dẫn cũng chỉ rõ tệp bị ảnh hưởng khi đổi hành vi và tách việc build plugin khỏi việc chạy lệnh trong ứng dụng.

Tệp kiểm thử và Skill đến từ các bài đã liên kết. Nếu plugin chưa có chúng, hãy bổ sung hoặc dùng đường dẫn thực tế. Khi thêm năng lực Client, Server hoặc cơ sở dữ liệu, ghi thêm yêu cầu bảo trì. Gỡ tham chiếu tới những điểm vào đã bỏ.

## Giao việc cho Agent theo hướng dẫn

Yêu cầu tác vụ mô tả công việc hiện tại. `AGENTS.md` cung cấp quy ước bảo trì lâu dài. Dùng cả hai, ví dụ:

```prompt
Kiểm tra các bài kiểm thử điều kiện biên của lệnh preview trong
packages/app-plugin-notice-cli của ứng dụng này.

Đọc AGENTS.md của ứng dụng và plugin, cùng Skill phát triển plugin đã
đồng bộ. Kiểm tra phần triển khai và các thay đổi chưa commit.

Rà trường hợp khoảng trắng đầu cuối, văn bản rỗng, giới hạn độ dài và cách
đếm ký tự Unicode. Dùng lại bài kiểm thử đã có và thêm trường hợp còn thiếu.
Giữ tương thích đối số lệnh và cấu trúc phản hồi. Đối chiếu README và Skill
của plugin với phần triển khai, rồi sửa hướng dẫn đã lỗi thời.

Chạy các bài kiểm thử bị ảnh hưởng và bước kiểm tra cần thiết. Báo kết quả
và phạm vi chưa kiểm chứng.
```

Người bảo trì cần vị trí mã, điểm đăng ký và yêu cầu tương thích. Bên sử dụng cần điều kiện tiên quyết, lệnh công khai và kết quả. Ghi nhóm đầu vào `AGENTS.md` và nhóm sau vào Skill của plugin.

## Kiểm chứng hướng dẫn

Dùng tác vụ bảo trì thật để kiểm tra hướng dẫn.

- Đường dẫn được nhắc đến tồn tại và vẫn đảm nhiệm đúng vai trò.
- Lệnh khớp script hiện tại trong `package.json` và ghi rõ thư mục chạy.
- Hệ thống tìm và chạy bài kiểm thử được nêu. Kết quả khớp kỳ vọng.
- Khi đổi tính năng, hướng dẫn dẫn Agent kiểm tra khai báo, điểm xuất, dependency và ví dụ sử dụng liên quan.
- Kiểm thử plugin và kiểm chứng trong ứng dụng đích được ghi riêng. Ghi rõ phần chưa kiểm chứng.

Dùng các lệnh có sẵn trong plugin và ứng dụng hiện tại. Các bước chỉ chạy được trong repo nguồn NocoBase thuộc hướng dẫn của repo đó. Xem [Kiểm thử và kiểm chứng](testing-and-verification.md) cho plugin và [Kiểm thử](../developing-apps/testing-and-acceptance.md) để nghiệm thu ứng dụng.

Với chỉnh sửa chỉ liên quan hướng dẫn, kiểm tra đường dẫn, lệnh và mô tả. Chạy kiểm tra mã khi cần xác minh tính năng hoặc tích hợp bị ảnh hưởng.

## Duy trì hướng dẫn cùng tính năng

Khi đổi lệnh công khai, API, dịch vụ hoặc cấu trúc tài nguyên, rà cùng lúc hướng dẫn phát triển, README, kiểm thử và Skill của plugin. Hướng dẫn phát triển mô tả tổ chức và ràng buộc bảo trì. README và Skill mô tả cách dùng hiện hành. Ghi thay đổi tương thích theo quy ước phiên bản và phát hành của dự án. Xem [Build và phát hành](publish-plugin.md).

Giữ quyết định nghiệp vụ và quy ước bảo trì có giá trị lâu dài. Dọn ghi chép xử lý lỗi tạm thời, nhật ký từng tác vụ và bước đã lỗi thời. Dẫn tới giải thích dài hơn được duy trì trong plugin để `AGENTS.md` vẫn dễ tra cứu.

**Xong khi** Agent tiếp quản có thể tìm phần cần sửa, giữ hợp đồng công khai, kiểm chứng thay đổi và biết hướng dẫn nào cần cập nhật.
