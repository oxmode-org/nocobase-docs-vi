---
title: Tổng quan sử dụng plugin
description: Tìm plugin NocoBase theo chức năng và tìm hiểu mục đích, cách cấu hình và sử dụng.
---

NocoBase cung cấp plugin cho người dùng, xác thực, phân quyền, tệp, thông báo, Agent và các tính năng thường gặp khác. Phần này mô tả công dụng và cách cấu hình từng plugin, cùng cách dùng trang, component, API, dịch vụ hoặc Skill của plugin trong ứng dụng.

Tra cứu theo chức năng bên dưới. Xem [Quản lý plugin](../developing-apps/manage-plugins.md) để biết quy trình chung về cài đặt, đăng ký, cập nhật và gỡ bỏ.

## Tìm plugin theo chức năng

Phần này bao gồm 21 plugin. Các tính năng liên quan được nhóm theo chủ đề, các plugin khác có mục riêng. Mỗi hướng dẫn gồm bốn chương về năng lực, tình huống, triển khai và các ràng buộc khi phát triển với AI.

| Tính năng | Hướng dẫn | Công dụng chính |
| --- | --- | --- |
| Người dùng và xác thực | [Quản lý người dùng](authentication/users.md), [Xác thực](authentication/sign-in.md), [API key](authentication/api-keys.md) | Quản lý người dùng, đăng nhập và xác thực yêu cầu API |
| Phân quyền và truy cập dữ liệu | [Quản lý quyền](authorization/permissions.md), [Quyền truy cập dữ liệu mặc định](authorization/default-access.md), [Quy tắc chia sẻ](authorization/sharing-rules.md), [Quy tắc hạn chế](authorization/restriction-rules.md) | Kiểm soát thao tác và quyền truy cập bản ghi |
| Trình khám phá cơ sở dữ liệu | [Trình khám phá cơ sở dữ liệu](data-and-files/database-explorer.md) | Xem kết nối, bảng và trường |
| Tệp | [Tệp](data-and-files/file-management.md) | Tải lên, lưu trữ và truy cập tệp |
| Thông báo | [Thông báo](notifications/notification.md), [Nhà cung cấp thông báo](notifications/providers.md), [Thông báo trong ứng dụng](notifications/in-app.md), [Thông báo đẩy trên web](notifications/web-push.md) | Cấu hình kênh gửi và tích hợp hộp thư hoặc thông báo đẩy trên trình duyệt |
| Email | [Email](notifications/mail.md) | Gửi email, đồng bộ hộp thư và mở rộng dịch vụ email |
| Agent | [Agent](agents-and-knowledge/agents.md) | Cấu hình API mô hình hoặc kết nối Agent trên một máy để trò chuyện và thực thi tác vụ |
| Cơ sở tri thức | [Cơ sở tri thức](agents-and-knowledge/knowledge.md) | Quản lý không gian tài liệu, phiên bản, tìm kiếm và duyệt thay đổi |
| Phê duyệt (thương mại) | [Phê duyệt](collaboration/approval.md) | Cấu hình chính sách phê duyệt và xử lý kết quả |
| Tác vụ theo lịch | [Tác vụ theo lịch](automation/scheduler.md) | Khai báo lịch, xem lịch sử thực thi và bật hoặc tắt tác vụ |
| In theo mẫu | [In theo mẫu](automation/template-print.md) | Dùng Skill để triển khai in theo mẫu DOCX và PDF |
| Bản địa hóa | [Bản địa hóa](application-support/i18n.md) | Tích hợp bản địa hóa và chuyển ngôn ngữ ứng dụng |
| Nền tảng ứng dụng | [Nền tảng ứng dụng](application-support/foundation.md) | Xem các năng lực Core ứng dụng dùng và thông tin runtime tương ứng |

## Trước khi tích hợp

Kiểm tra plugin đã đăng ký và phiên bản thực tế trong ứng dụng. Sau khi cài đặt, đăng ký plugin để bật các phần cần dùng. Một số plugin cũng cần factory cấu hình hoặc dữ liệu, trang và quyền do ứng dụng quản lý.

Các đường dẫn như `/client` và `/server` chỉ điểm xuất công khai của package. Route trang và HTTP tính từ đường dẫn gắn ứng dụng. Nếu ứng dụng được gắn ở `/main`, route `/api/users` sẽ phục vụ tại `/main/api/users`. Xem `/api/swagger/docs` hoặc `/api/swagger` của ứng dụng đang chạy để biết đầy đủ hợp đồng yêu cầu, phản hồi và truy cập.

## Cách đọc hướng dẫn plugin

1. **Năng lực**. Vấn đề cần giải quyết, trang, component, API, dịch vụ hoặc Skill được cung cấp và trách nhiệm của ứng dụng.
2. **Tình huống và ví dụ**. Nhu cầu nghiệp vụ, prompt cho Coding Agent, các bước sử dụng và tiêu chí hoàn thành.
3. **Nguyên tắc và triển khai**. Phạm vi tích hợp, thay đổi mã, cấu hình và giao diện cùng các cơ chế quan trọng.
4. **Ràng buộc phát triển với AI và kiểm chứng**. Ranh giới riêng của plugin, lỗi thường gặp và yêu cầu nghiệm thu.

Prompt phát triển dành cho Coding Agent làm việc trong thư mục ứng dụng. Yêu cầu Agent đọc `AGENTS.md`, quy tắc ứng dụng và Skill liên quan đi kèm phiên bản đã cài. Nếu thiếu Skill phát triển, dựa vào giao diện công khai, kiểu dữ liệu và tài liệu. Chương bốn hướng dẫn tích hợp đáng tin cậy với sự hỗ trợ của AI, áp dụng cả cho plugin chỉ cung cấp chức năng thông thường. Xem [Tiếp tục phát triển ứng dụng](../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../developing-apps/testing-and-acceptance.md).

Mỗi plugin cung cấp năng lực theo cách khác nhau. In theo mẫu cung cấp hướng dẫn triển khai. Quản lý người dùng cung cấp API quản trị và trang mời, còn ứng dụng sở hữu giao diện quản trị. Cơ sở tri thức và Nền tảng ứng dụng cung cấp các trang có thể đăng ký. Xem từng hướng dẫn để biết bên nào quản lý trang, dữ liệu và logic nghiệp vụ.

Các hướng dẫn được đối chiếu ngày 28/10/2026 với mã nguồn chính tại [`015404ecd`](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins) và hợp đồng công khai của plugin phê duyệt thương mại. Bài [Agent](agents-and-knowledge/agents.md) có mốc ứng dụng đã kiểm chứng riêng, ảnh chụp màn hình và mã nguồn tải về. Phiên bản đã cài có thể khác. Các bước kiểm chứng dành cho ứng dụng tích hợp. Việc đối chiếu khi soạn tài liệu có phạm vi riêng tùy plugin.

## Tài liệu liên quan

- [Quản lý plugin](../developing-apps/manage-plugins.md) hướng dẫn cài đặt, đăng ký, cập nhật và gỡ bỏ.
- [Danh mục plugin](../reference/plugins.md) cung cấp tên package đầy đủ, repository và thông tin về plugin có sẵn trong template mặc định.
- [Phát triển plugin](../extension-development/when-to-write-a-plugin.md) giải thích khi nào và cách tạo plugin riêng.
