---
title: Thực hành tốt
description: Kinh nghiệm xây dựng hệ thống nghiệp vụ với NocoBase Core và Studio.
---

<a id="in-studio-talk-the-request-through-before-creating-issues"></a>

## Trao đổi yêu cầu trong Studio trước khi tạo đầu việc

Trao đổi với agent trong **My sessions** về nội dung cần xây dựng, quy tắc, phạm vi và cách nghiệm thu. Khi đã thống nhất, giao agent tạo và bắt đầu các đầu việc.

Làm rõ trước giúp nhóm agent hỏi lại ít hơn và giảm việc phải làm lại. Mô tả đầu việc giữ đầy đủ quy tắc và tiêu chí nghiệm thu.

```prompt
<The request, in two or three sentences>
Ask me about anything unclear first. Once we've settled it, write the rules and acceptance criteria into the issue description and create the issue.
```

![Mô tả yêu cầu trong My sessions để agent chia thành các đầu việc có thể thực hiện](https://static-docs.nocobase.com/20261029151954700.png)

<a id="ask-studio-when-you-have-questions-about-a-project"></a>

## Hỏi Studio về dự án

Đồng nghiệp nghiệp vụ và nhà phát triển đều có thể hỏi agent về logic dự án hoặc hành vi của tính năng. Bấm **Ask agent** trên trang dự án hoặc đầu việc để mở phiên có sẵn ngữ cảnh của trang hiện tại:

```prompt
When does a device request need approval from the asset manager? After it is approved, how do the device's status and user change?
```

![Ask agent trên trang dự án dùng dự án hiện tại làm ngữ cảnh](https://static-docs.nocobase.com/20261030-studio-ask-agent.webp)

Cũng có thể hỏi trực tiếp trong **My sessions** và chọn dự án liên quan:

![Đặt câu hỏi trong My sessions](https://static-docs.nocobase.com/20261029151954700.png)

<a id="other-teams-should-also-write-requests-with-an-agent-first"></a>

## Để các nhóm khác soạn yêu cầu cùng agent trước

Khi nhóm hành chính, tài chính hoặc nhóm khác gửi yêu cầu, nhờ họ dùng agent của mình để ghi rõ ai sử dụng, cần làm gì và quy tắc áp dụng. Nếu khó mô tả các trang, đính kèm bản demo HTML.

```prompt
I want to send the IT department a request: <one sentence>. Ask me a few questions first, write it up as a requirements document, then make a single-file HTML demo of the main pages.
```

Khi nhận yêu cầu, nhà phát triển cùng agent cập nhật thiết kế dựa trên tài liệu thiết kế hiện có, rồi triển khai.
