---
title: Prompt thường dùng
description: Mẫu yêu cầu để tạo ứng dụng, thiết kế, lập kế hoạch, nghiệm thu, bàn giao, nâng cấp, triển khai và rà soát.
---

Thay các phần trong dấu ngoặc góc bằng thông tin của dự án. Mỗi mục có bản tiếng Việt và prompt tiếng Anh từ tài liệu gốc.

<a id="create-an-app"></a>

## Tạo ứng dụng

> Tạo một ứng dụng NocoBase 3 trong thư mục hiện tại với cơ sở dữ liệu SQLite. Sau khi chạy được, gửi tôi URL và tài khoản đăng nhập.

```prompt
Create a NocoBase 3 app in the current directory, using SQLite as the database. Once it's running, tell me the URL and the login account.
```

<a id="discuss-the-design"></a>

## Thảo luận thiết kế

> Tôi muốn xây dựng hệ thống sau. Hãy trao đổi thiết kế với tôi trước khi viết mã.
> <Mô tả hệ thống, các vai trò và luồng chính trong hai hoặc ba câu>
> Hỏi lần lượt từng nhóm quyết định cần tôi chốt và đề xuất phương án cho mỗi nhóm.

```prompt
I want to build <a system>. Don't write code yet; work out the design with me first.
<Roles and main flows, in two or three sentences>
Ask me about anything I need to decide, one group of questions at a time, with your recommendation for each.
```

<a id="write-the-design-doc"></a>

## Viết tài liệu thiết kế

> Ghi thiết kế đã thống nhất vào docs/design.md, gồm vai trò, dữ liệu, luồng, trang, quyền, kế hoạch bàn giao từng bước và tiêu chí nghiệm thu từng bước.
> Đưa tài liệu vào chỉ mục AGENTS.md để agent đọc trước mọi thay đổi nghiệp vụ. Nếu yêu cầu làm đổi thiết kế, cập nhật tài liệu trước khi sửa mã.

```prompt
Write the agreed design into docs/design.md: roles, data, flows, pages, permissions, plus a step-by-step delivery plan with acceptance criteria for each step.
Register it in AGENTS.md: read it before any business change; when a request changes the design, update it before changing the code.
```

<a id="raise-a-request"></a>

## Nêu yêu cầu

> <Ai sử dụng và cần làm gì>
> <Quy tắc về ai được làm gì và dữ liệu nào cần bảo toàn>

```prompt
<Who uses it, and what to do>
<The rules: who can do what, and which data must not be touched>
```

<a id="plan-first"></a>

## Lập kế hoạch trước

> Trước khi sửa mã, liệt kê những phần bị ảnh hưởng, các quyết định cần tôi chốt và cách bạn sẽ kiểm chứng thay đổi.

```prompt
Don't change any code yet. List which parts this change touches, the questions I need to decide, and how you plan to verify it.
```

<a id="send-back"></a>

## Gửi lại để sửa

> <Tính năng> có vấn đề. Với <tài khoản>, khi thực hiện <các bước>, tôi thấy <kết quả thực tế>. Kết quả mong đợi là <kết quả đúng>. Sau khi sửa, kiểm tra lại bằng cùng tài khoản và đính kèm ảnh.

```prompt
<Feature> has a problem: with <account>, <steps>, I see <actual result>; it should be <expected result>. After fixing it, check again with the same account and attach screenshots.
```

<a id="review"></a>

## Rà soát

Mở phiên với mô hình từ nhà cung cấp khác:

> Rà soát các thay đổi chưa commit theo quy ước trong AGENTS.md. Liệt kê vấn đề theo mức độ nghiêm trọng và giữ nguyên mã.

```prompt
Review the uncommitted changes. Look for problems against the conventions in AGENTS.md, list them by severity, and don't change any code.
```

<a id="hand-over-to-a-new-session"></a>

## Bàn giao sang phiên mới

> Đọc AGENTS.md, docs/design.md và các commit gần đây. Báo tiến độ hiện tại và phần còn thiếu. Sau đó thực hiện yêu cầu sau.
> <Yêu cầu>

```prompt
First read AGENTS.md, docs/design.md and the recent commits, and tell me how far this app has got and what is still missing. Then do: <request>.
```

<a id="turn-a-convention-into-a-rule"></a>

## Lưu quy ước thành quy tắc

> Ghi quy ước dưới đây vào .agents/rules/<chủ đề>.md và đưa vào chỉ mục trong AGENTS.md. Nêu khi nào cần đọc quy tắc.
> <Quy ước>

```prompt
Record this convention in .agents/rules/<topic>.md and register it in the index in AGENTS.md, saying when to read it:
<convention>
```

<a id="upgrade-nocobase-core"></a>

## Nâng cấp NocoBase Core

> Lập kế hoạch nâng NocoBase lên phiên bản mới nhất và chờ tôi xác nhận trước khi sửa. Sau đó chạy toàn bộ kiểm thử và xác nhận dữ liệu nghiệp vụ vẫn đầy đủ.

```prompt
Upgrade NocoBase to the latest version. Give me an upgrade plan first and change things only after I confirm; afterwards run all tests and confirm all business data is still there.
```

<a id="deploy"></a>

## Triển khai

> Triển khai ứng dụng bằng Docker lên <người dùng>@<địa chỉ máy chủ>, trong thư mục <đường dẫn>, tại https://<tên miền>/<đường dẫn>/, với cơ sở dữ liệu mới và rỗng.
> Lưu cấu hình và dữ liệu trong thư mục triển khai để chúng còn sau khi tạo lại container. Tôi sẽ gửi mật khẩu quản trị riêng. Giữ mật khẩu ngoài mã và báo cáo.
> Sau khi triển khai, đăng nhập, tạo bản ghi, tạo lại container và xác nhận dữ liệu còn. Ghi rõ các mục chưa cấu hình, chẳng hạn HTTPS.

```prompt
Deploy this app with Docker to the server <user>@<server address>, in the directory <path>, served at https://<domain>/<path>/, with a new empty database.
Keep the configuration and data in the deployment directory so recreating the container doesn't lose them. I'll give you the admin password separately; don't put it in the code or the report.
After deploying, log in, create a record, recreate the container, and confirm the data is still there. Finally, tell me what is still not configured, such as HTTPS.
```

<a id="requests-from-other-teams"></a>

## Yêu cầu từ nhóm khác

> Tôi muốn gửi nhóm phát triển yêu cầu sau. <Một câu mô tả yêu cầu>. Hỏi tôi vài câu trước, soạn tài liệu yêu cầu rồi làm bản demo HTML một tệp cho các trang chính.

```prompt
I want to send the development team a request: <one sentence>. Ask me a few questions first, write it up as a requirements document, then make a single-file HTML demo of the main pages.
```
