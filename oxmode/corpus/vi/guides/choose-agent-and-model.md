---
title: Chọn agent và mô hình
description: Chọn công cụ lập trình và mô hình phù hợp với từng loại công việc.
---

<a id="choose-a-coding-tool"></a>

## Chọn công cụ lập trình

Có thể dùng một agent lập trình phổ biến như Codex, Claude Code hoặc OpenCode. Các prompt trong hướng dẫn dùng được với cả ba. Cài đặt và đăng nhập theo hướng dẫn chính thức của công cụ đã chọn.

<a id="choose-a-model"></a>

## Chọn mô hình

Tài liệu gốc đưa ra các lựa chọn sau cho thời điểm cuối năm 2026:

| Mô hình | Thế mạnh |
| --- | --- |
| Claude Opus | Thiết kế trang đẹp hơn và có năng lực tốt trên nhiều loại công việc |
| GPT Astra/Sol | Có thể xây dựng cả hệ thống khi tài liệu thiết kế đủ chi tiết |
| DeepSeek | Nhanh và chi phí thấp. Có thể dùng trong OpenCode hoặc kết nối với Claude Code theo hướng dẫn của DeepSeek |

Khi viết tài liệu thiết kế hoặc làm tính năng mới, dùng mô hình mạnh với mức suy luận cao hơn. Với thay đổi nhỏ như chỉnh văn bản hoặc kiểu hiển thị, chuyển sang mô hình nhanh hơn và chi phí thấp hơn.

Khi rà soát mã, mô hình từ nhà cung cấp khác có thể dễ phát hiện vấn đề hơn. Ví dụ, nếu Codex đã dùng GPT để xây dựng tính năng, mở phiên Claude Code và giao Opus rà soát các thay đổi chưa commit theo quy ước trong `AGENTS.md`. Yêu cầu liệt kê vấn đề theo mức độ nghiêm trọng và giữ nguyên mã:

```prompt
Review the uncommitted changes. Look for problems against the conventions in AGENTS.md, list them by severity, and don't change any code.
```
