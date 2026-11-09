---
title: Xây dựng ứng dụng doanh nghiệp đáng tin cậy với NocoBase 3
description: Dùng NocoBase Core làm nền tảng mã nguồn mở cho hệ thống nghiệp vụ và dùng Studio để điều phối phát triển cùng agent.
---

<a id="introduction"></a>

## Giới thiệu

Khi giao một hệ thống nghiệp vụ cho agent làm theo cách vibe coding, phiên bản đầu thường có rất nhanh. Sau đó, các vấn đề sau dễ xuất hiện:

1. Đội ngũ phải tự xây dựng phân quyền, quy trình, phê duyệt và các tính năng nền tảng. Những phần này có thể thiếu ổn định hoặc dễ hỏng khi thay đổi.
2. Khi đổi mô hình, người phụ trách hoặc phiên làm việc, cách viết mã lại đổi và kiến trúc dần khó kiểm soát.
3. Khi nhiều đầu việc chạy song song, đội ngũ khó theo kịp các tin nhắn và thay đổi cần xác nhận.
4. Bối cảnh yêu cầu, quy tắc nghiệp vụ và kinh nghiệm nằm rải rác qua nhiều phiên, dễ thất lạc khi đổi người hoặc agent.

NocoBase 3 cung cấp [NocoBase Core](https://www.nocobase.com/core/) và [NocoBase Studio](https://www.nocobase.com/studio/) để doanh nghiệp phát triển nhanh ứng dụng riêng cùng agent và xử lý các vấn đề trên. Hướng dẫn dùng quản lý tài sản CNTT làm ví dụ xuyên suốt.

<a id="core-the-open-source-foundation-for-developing-and-running-business-systems-with-ai"></a>

## Core, nền tảng mã nguồn mở để phát triển và vận hành hệ thống nghiệp vụ cùng AI

**Các tính năng chung có sẵn.** Hơn 20 tính năng có thể dùng ngay, gồm người dùng và phân quyền, dữ liệu và tệp, quy trình và phê duyệt, nhắn tin, AI và agent. NocoBase tiếp tục bảo trì và nâng cấp các thành phần này. Xem danh sách trong [NocoBase Core](../core/using-plugins/overview.md).

**Kiến trúc và quy ước thống nhất.** Ứng dụng mới có cấu trúc rõ cho trang, API, migration và kiểm thử. `AGENTS.md` và các Skill đi kèm package chỉ nơi đặt mã nghiệp vụ và tính năng nào có thể dùng nguyên trạng. Agent theo cùng quy ước dù đổi người, mô hình hay phiên. Xem [Cấu trúc dự án](../core/developing-apps/project-structure.md).

Xem các tính năng Core ứng dụng đang dùng trong **System settings › App foundation**. Xem [Nền tảng ứng dụng](../core/using-plugins/application-support/foundation.md).

![Nền tảng ứng dụng hiển thị các tính năng Core đang dùng](https://static-docs.nocobase.com/20261030-itam-lite-ego-preview-foundation-2x.webp)

<a id="studio-the-governance-platform-where-people-and-agents-develop-together"></a>

## Studio, nền tảng quản trị để con người và agent cùng phát triển

**Nhóm agent chủ động thực hiện công việc.** Claude Code, Codex và các công cụ lập trình khác tham gia cùng một nhóm trong Studio. Agent điều phối phân công thiết kế, phát triển, kiểm thử và rà soát theo thế mạnh từng agent. Nhiều đầu việc có thể tiến hành trên các nhánh riêng. Mỗi đầu việc hiển thị tiến độ, người hoặc agent đang phụ trách và bước tiếp theo.

**Con người đưa ra quyết định quan trọng.** Công việc đến người nghiệm thu sau khi qua kiểm thử và rà soát. Người nghiệm thu đọc báo cáo, xem ảnh và bản xem trước rồi chấp nhận hoặc gửi lại. Chuyên gia nghiệp vụ có thể trực tiếp gửi yêu cầu, quyết định và nghiệm thu.

**Cách làm và kinh nghiệm được lưu cho cả nhóm.** Skill lưu quy trình làm việc, kho tri thức lưu tài liệu nghiệp vụ và bộ nhớ dự án lưu điều agent học được. Người hoặc agent mới có thể dùng lại thông tin khi tiếp quản. Xem [Studio là gì](../studio/index.md).

Có thể phát triển và phát hành ứng dụng hoàn chỉnh chỉ với Core. Dùng thêm Studio khi đội ngũ chạy nhiều dự án đồng thời hoặc đồng nghiệp nghiệp vụ muốn trực tiếp tham gia.

> [!NOTE] Phiên bản có Studio
> Studio có trong các phiên bản NocoBase Professional và Enterprise. Xem [Bảng giá](https://www.nocobase.com/pricing/).

<a id="the-tutorials-example-it-asset-management"></a>

## Ví dụ xuyên suốt về quản lý tài sản CNTT

Hướng dẫn gọi hệ thống này là ITAM. Công ty cấp máy tính xách tay và màn hình cho nhân viên. Công ty cần biết từng thiết bị ở đâu, ai đang giữ và tình trạng ra sao. Yêu cầu cấp thiết bị cần được phê duyệt. Hệ thống có ba vai trò:

| Vai trò | Công việc trong hệ thống |
| --- | --- |
| Nhân viên | Xem thiết bị được giao và gửi yêu cầu thiết bị |
| Hỗ trợ CNTT | Xử lý yêu cầu, cấp và thu hồi thiết bị, cập nhật trạng thái |
| Quản lý tài sản | Duy trì sổ thiết bị, duyệt yêu cầu và tổ chức kiểm kê |

Phần 1 xây dựng sổ thiết bị, quy trình yêu cầu và phê duyệt, cùng quyền cho ba vai trò. Phần 2 giao nhóm agent xây chức năng kiểm kê và mời quản lý tài sản trực tiếp tham gia.

Mã ví dụ nằm trong [nocobase/docs-examples-v3](https://github.com/nocobase/docs-examples-v3/tree/main/apps/itam-lite). Xem [bản demo NocoITAM](https://solutions.nocobase.com/itam/) để trải nghiệm hệ thống quản lý tài sản CNTT đầy đủ hơn.

<a id="tutorial-roadmap"></a>

## Lộ trình hướng dẫn

<a id="getting-started"></a>

### Bắt đầu

1. [Xây dựng ứng dụng doanh nghiệp đáng tin cậy với NocoBase 3](build-reliable-enterprise-apps.md) giới thiệu lộ trình ở trang này.
2. [Chuẩn bị môi trường phát triển](prepare-environment.md) để cài Node.js, pnpm và Git.
3. [Chọn agent và mô hình](choose-agent-and-model.md) phù hợp với công việc lập trình.

<a id="part-1-build-an-app-with-core"></a>

### Phần 1. Xây dựng ứng dụng với Core

4. [Tạo ứng dụng](create-app.md) cùng agent, khởi động, đăng nhập và tạo commit đầu tiên.
5. [Viết tài liệu thiết kế hệ thống trước](write-a-design-doc.md) bằng cách thảo luận với agent về yêu cầu ITAM và ghi lại thiết kế.
6. [Tính năng đầu tiên, sổ thiết bị](first-feature-devices.md) để nhập, tìm kiếm và theo dõi trạng thái thiết bị.
7. [Yêu cầu thiết bị và phê duyệt](requests-and-approval.md) để nhân viên gửi yêu cầu và nhận thiết bị sau khi duyệt.
8. [Vai trò và quyền](roles-and-permissions.md) xác định mỗi vai trò được xem và làm gì.
9. [Nghiệm thu công việc của agent](accept-agent-work.md) bằng cách kiểm tra kết quả và yêu cầu chỉnh sửa khi cần.
10. [Triển khai ứng dụng](deploy.md) lên máy chủ.

<a id="part-2-use-studio-in-a-team"></a>

### Phần 2. Dùng Studio trong nhóm

11. [Đưa dự án vào Studio](bring-into-studio.md) bằng cách kết nối kho mã ITAM với dự án Studio.
12. [Giao yêu cầu cho nhóm agent](agent-team-request.md) để xây chức năng kiểm kê thiết bị.
13. [Mời đồng nghiệp nghiệp vụ tham gia](business-colleagues.md) để quản lý tài sản gửi yêu cầu, trả lời câu hỏi và nghiệm thu.
14. [Lưu cách làm và kinh nghiệm](capture-knowledge.md) trong Skill, kho tri thức và bộ nhớ dự án.
15. [Phát hành lên production](release.md) qua môi trường kiểm thử, tag phát hành và máy chủ của tổ chức.

<a id="best-practices"></a>

### Thực hành tốt

- [Thực hành tốt](best-practices.md) tập hợp kinh nghiệm và cách làm khi phát triển với Core và Studio.

<a id="appendix"></a>

### Phụ lục

- [Prompt thường dùng](prompts.md) tập hợp các prompt của hướng dẫn.
- [Nâng cấp NocoBase Core](upgrade-core.md) hướng dẫn dùng Skill nâng cấp để đưa Core lên phiên bản mới nhất.
