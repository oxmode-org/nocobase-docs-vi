---
title: Tài liệu NocoBase 3
nav: Trang chủ
description: NocoBase là nền tảng mã nguồn mở để xây dựng, vận hành và phát triển hệ thống nghiệp vụ cùng AI. Agent viết mã nghiệp vụ, NocoBase cung cấp nền tảng và cơ chế quản trị, còn con người đặt mục tiêu và đưa ra quyết định.
---

## Bắt đầu từ đây

| Bạn muốn | Bắt đầu từ |
| --- | --- |
| Tìm hiểu về NocoBase 3 | [NocoBase 3 là gì](start/what-is-nocobase.md) |
| Tự xây ứng dụng trên Core với Agent của mình | [Core là gì](core/getting-started/what-is-core.md) → [Tạo ứng dụng](core/getting-started/create-app.md) |
| Dẫn dắt một đội Agent và đẩy nhiều dự án cùng lúc | [Studio là gì](studio/intro/what-is-studio.md) |
| Triển khai và vận hành ứng dụng | [Triển khai](core/deployment/choose-a-deployment-method.md) |
| Chuyển từ NocoBase 2 | [Chuyển từ NocoBase 2](start/from-v2.md) · [Quản lý plugin](core/developing-apps/manage-plugins.md) |

## Kiến trúc

<figure class="layers" aria-label="Studio là nơi con người và Agent cùng xây ứng dụng nghiệp vụ; các ứng dụng được xây trên Core">
<div class="ly-b st"><b>NocoBase Studio</b><span>Nền tảng quản trị để con người và Agent cùng xây dựng phần mềm</span></div>
<div class="ly-t"><b>Con người quyết định. Agent viết mã và làm việc</b><span>Claude Code, Codex và OpenCode hợp thành một đội Agent tự đẩy các yêu cầu tiến lên. Tiến độ rõ ràng chỉ trong một cái nhìn, còn con người đưa ra các quyết định quan trọng.</span></div>
<div class="ly-k down">Xây dựng · Bàn giao · Quản trị · Phát triển</div><div class="ly-gap"></div>
<div class="ly-b"><b>Ứng dụng nghiệp vụ</b><span>Các hệ thống nghiệp vụ của tổ chức bạn</span></div>
<div class="ly-t"><b>Agent xây ứng dụng. Bạn sở hữu chúng, và chúng tự chạy sau khi đưa vào sử dụng</b><span>Bạn cũng có thể bắt đầu từ một ứng dụng Solution có sẵn, chẳng hạn NocoCRM mã nguồn mở, rồi dùng nguyên trạng hoặc tiếp tục tùy biến.</span></div>
<div class="ly-k up">Khối dựng · Chuẩn mực</div><div class="ly-gap"></div>
<div class="ly-b co"><b>NocoBase Core</b><span>Nền tảng ứng dụng mã nguồn mở</span></div>
<div class="ly-t"><b>Hơn 20 khối dựng, một cấu trúc dự án và bộ chuẩn phát triển thống nhất</b><span>Dữ liệu, phân quyền, workflow và phê duyệt, tệp, thông báo, tích hợp AI và nhiều thứ khác đã sẵn sàng, nên Agent chỉ cần xây phần logic nghiệp vụ.</span></div>
</figure>

- **[Core](core/index.md)** là nền tảng mã nguồn mở để xây dựng và vận hành hệ thống nghiệp vụ. Chỉ với Core, bạn đã có thể để Agent của mình trực tiếp xây ứng dụng.
- **[Studio](studio/index.md)** là không gian làm việc nơi con người dẫn dắt một đội Agent xây ứng dụng, có trong các phiên bản thương mại. Những ứng dụng nó xây cũng được dựng trên Core.

## Về bộ tài liệu này

- Tài liệu gồm ba phần, chuyển qua lại ở thanh trên cùng: **Bắt đầu** (giới thiệu và thuật ngữ dùng chung cho cả trang), **Core** và **Studio**.
- Core dùng một ứng dụng quản lý công việc của nhóm để giải thích phát triển, kiểm thử và triển khai. Studio dùng kịch bản một nhóm mua hàng để giải thích cách con người dẫn dắt đội Agent.
- Tài liệu được viết theo giao diện tiếng Anh. Tên giao diện có sẵn trong sản phẩm được in **đậm** và đường dẫn được viết dạng **A › B**, ví dụ **System settings › User management**.
- Mọi gói NocoBase 3 hiện đều ở giai đoạn beta, nên API và giao diện vẫn có thể thay đổi. Sản phẩm là nguồn chính xác nhất.
- Các trang hiển thị màu nhạt ở menu bên trái là trang chưa được viết.
- Bản tiếng Việt do OXMODE biên dịch từ [tài liệu chính thức](https://docs.nocobase.com/). Toàn bộ các trang của NocoBase 3 đã được dịch sang tiếng Việt; tên giao diện trong sản phẩm vẫn giữ tiếng Anh như bản gốc.
