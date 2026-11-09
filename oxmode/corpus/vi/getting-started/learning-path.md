---
title: Lộ trình học
description: Bản đồ tài liệu và lộ trình đọc về phát triển ứng dụng, Studio, dự án hoàn chỉnh và triển khai.
---

<a id="documentation-map"></a>

## Bản đồ tài liệu

| Phần | Nội dung | Khi nào dùng |
| --- | --- | --- |
| [Bắt đầu](what-is-nocobase.md) | Khái niệm, ứng dụng đầu tiên, cộng tác trong Studio và lộ trình học | Lần đầu tìm hiểu NocoBase 3 |
| [Tài liệu Core](../core/index.md) | Phát triển ứng dụng, dùng và viết plugin, framework, triển khai và tham chiếu | Tra tính năng đang xây dựng hoặc bảo trì |
| [Tài liệu Studio](../studio/index.md) | Cài đặt, quyền thành viên, đầu việc, dự án, Agent, chất lượng, phát hành, quản trị và tham chiếu | Tra thao tác phù hợp với vai trò |
| [Hướng dẫn theo dự án](../guides/build-reliable-enterprise-apps.md) | Chọn môi trường và Agent, phát triển trên Core, cộng tác bằng Studio, thực hành và phụ lục | Theo dõi một dự án qua từng giai đoạn |
| [Câu hỏi thường gặp](../faq/from-v2.md) | Khác biệt giữa NocoBase 2 và 3, đối chiếu tính năng và chuyển đổi | Tìm hiểu quan hệ giữa các phiên bản |

<a id="complete-your-first-walkthrough"></a>

## Làm bài hướng dẫn đầu tiên

Đọc [NocoBase 3 là gì](what-is-nocobase.md) để hiểu nền tảng ứng dụng, quản trị phát triển và các ứng dụng nghiệp vụ.

- Nếu tự xây dựng, làm theo [Phát triển ứng dụng đầu tiên](develop-your-first-app.md) để tạo, chạy và phát triển chức năng quản lý khách hàng. Kiểm tra quyền theo vai trò trước khi hoàn thiện thêm.
- Nếu tham gia nhóm Studio, vào [Cộng tác bằng Studio](collaborate-with-studio.md). Nếu môi trường nhóm chưa sẵn sàng, quản trị viên bắt đầu từ [Cài đặt và cấu hình](../studio/setup/index.md).

Mỗi bài hướng dẫn ghi rõ điều kiện chuẩn bị để có thể bắt đầu ngay.

<a id="develop-and-extend-applications"></a>

## Phát triển và mở rộng ứng dụng

Khi ứng dụng đã chạy, đọc [Tổng quan phát triển ứng dụng](../core/developing-apps/overview.md) để hiểu các phần của một tính năng và [Cấu trúc dự án](../core/developing-apps/project-structure.md) để tìm tệp. Tài liệu phát triển bao gồm trang và tương tác, dịch vụ và API, dữ liệu và quyền, công việc nền, lệnh CLI và kiểm thử.

Với xác thực, tệp, thông báo và các tính năng thường gặp, xem [Sử dụng plugin](../core/using-plugins/overview.md). Để bảo trì tính năng riêng hoặc dùng lại giữa nhiều ứng dụng, xem [Phát triển plugin](../core/extension-development/when-to-write-a-plugin.md). Tra [Framework](../core/framework/overview.md) khi cần tìm hiểu môi trường chạy, container, HTTP hoặc cơ sở dữ liệu.

<a id="use-and-manage-studio"></a>

## Sử dụng và quản lý Studio

- Thành viên bắt đầu với [Gửi yêu cầu](../studio/use/raise-a-request.md) và [Phiên làm việc](../studio/use/sessions.md), rồi xem [Theo dõi tiến độ](../studio/use/follow-progress.md), [Trả lời câu hỏi](../studio/use/answer.md) và [Nghiệm thu](../studio/use/accept.md).
- Chủ dự án xem [Cài đặt](../studio/project/settings.md), [Kho tri thức](../studio/project/knowledge-base.md), [Bộ nhớ dự án](../studio/project/project-memory.md) và [Tiến độ](../studio/project/progress.md), sau đó xem [Kiểm tra và rà soát](../studio/project/checks-and-review.md) và [Phát hành](../studio/release/overview.md).
- Quản trị viên hoàn tất [Cài đặt](../studio/setup/index.md), rồi quản lý [Agent](../studio/configure/agents.md), [Môi trường chạy](../studio/configure/runtimes.md), [Skill](../studio/project/skills.md), [Mức sử dụng](../studio/project/usage.md), [Thành viên và vai trò](../studio/admin/members-and-roles.md) và [Nâng cấp và sao lưu](../studio/admin/upgrade-and-backup.md).

Phần tham chiếu Studio trình bày trạng thái, quyền, quy tắc thực thi của Agent, lệnh và cấu hình.

<a id="follow-a-complete-project"></a>

## Theo dõi một dự án hoàn chỉnh

[Xây dựng hệ thống nghiệp vụ đáng tin cậy](../guides/build-reliable-enterprise-apps.md) đi qua các bước làm ứng dụng quản lý tài sản, từ thiết lập môi trường, thiết kế và quản lý thiết bị đến yêu cầu, phê duyệt, vai trò, nghiệm thu và triển khai. Bài tiếp tục giới thiệu cộng tác trong Studio, chia sẻ tri thức và phát hành.

Dùng lộ trình này để thực hành qua toàn bộ dự án. Nếu đã xong phần bắt đầu nhanh, tiếp tục từ giai đoạn phù hợp với kinh nghiệm và tra từng cơ chế trong tài liệu tương ứng.

<a id="deploy-maintain-and-look-up-details"></a>

## Triển khai, bảo trì và tra cứu

Trước khi đưa ứng dụng đến người dùng, đọc [Chọn phương thức triển khai](../core/deployment/choose-a-deployment-method.md) và [Phát hành phiên bản ứng dụng](../core/deployment/publish-app-release.md). Về cơ sở dữ liệu, xem [Tương thích](../core/reference/compatibility.md) và [Cấu hình cơ sở dữ liệu](../core/reference/database-configuration.md).

Khi cần, tra [Lệnh CLI](../core/reference/cli.md) và [Cấu hình](../core/reference/configuration.md) của Core, hoặc [Lệnh CLI](../studio/reference/cli.md), [Lệnh Runner](../studio/reference/runner.md) và [Cấu hình](../studio/reference/config.md) của Studio.
