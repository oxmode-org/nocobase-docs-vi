---
title: Thuật ngữ
description: Các thuật ngữ dùng trên toàn bộ trang. Tài liệu, website, giao diện sản phẩm và phần trợ giúp dòng lệnh đều theo danh sách này.
---

Bản tiếng Việt giữ nguyên các tên riêng và thuật ngữ xuất hiện trong giao diện, mã nguồn và dòng lệnh (Agent, Skill, Studio, migration…), để bạn dễ đối chiếu với sản phẩm.

## Sản phẩm và vai trò

| Thuật ngữ | Ý nghĩa |
| --- | --- |
| NocoBase Core | Nền tảng mã nguồn mở để xây dựng và vận hành hệ thống nghiệp vụ, là một bộ gói npm |
| NocoBase Studio | Không gian làm việc nơi con người dẫn dắt một đội Agent xây ứng dụng, có trong các phiên bản thương mại |
| NocoBase Solution | Dòng ứng dụng nghiệp vụ mã nguồn mở xây trên NocoBase, như NocoCRM và NocoITAM. Từng ứng dụng được gọi là ứng dụng Solution |
| Agent | Tên gọi chung cho một "nhân công" AI: một công cụ lập trình cộng một model, ví dụ "Claude · Opus 5.5". Trong bản tiếng Anh viết thường khi nằm trong câu |
| Công cụ lập trình (coding tool) | Claude Code, Codex, OpenCode, Cursor, v.v. |
| Agent nghiệp vụ (business agent) | Agent xử lý công việc nghiệp vụ bên trong ứng dụng, trong phạm vi quyền của nó. Kết nối qua plugin Agents. Trong NocoBase 2 gọi là "AI employee" |
| Agent phát triển (development agent) | Agent viết mã cho ứng dụng. Chỉ dùng khi cần phân biệt với Agent nghiệp vụ. Ở mọi chỗ khác, chỉ cần nói Agent |

## Core

| Thuật ngữ | Ý nghĩa |
| --- | --- |
| Ứng dụng (app) | Một repository mã nguồn tạo từ template của NocoBase. Khi được triển khai, nó là một hệ thống nghiệp vụ. Bạn sở hữu nó |
| Template | Điểm xuất phát để tạo ứng dụng: template mặc định và template ví dụ |
| Plugin | Gói `@nocobase/app-plugin-*` được đăng ký trong ứng dụng. Nó mang vào năng lực phía server, trang, UI component, Skill hoặc lệnh |
| Danh sách plugin (plugin lists) | Ba file trong ứng dụng nơi plugin được đăng ký: `server/plugins.ts`, `client/plugins.ts` và `cli/plugins.ts` |
| Thư viện nền tảng (foundation library) | Gói mà ứng dụng dùng trực tiếp không cần đăng ký, như record lifecycle hay cơ sở dữ liệu |
| Thư viện UI (UI library) | Các component nghiệp vụ NocoBase phát hành. Cài một component nghĩa là sao chép nó vào mã nguồn ứng dụng, và từ đó nó thuộc về ứng dụng. Mỗi mục gọi là một component hoặc một block |
| Skill | Hướng dẫn (`SKILL.md`) dạy Agent cách làm một việc. Skill đi kèm các gói được đồng bộ vào `.agents/skills/` của ứng dụng |
| Năng lực (capability) | Một loại chức năng Core cung cấp, được nhóm thành 13 hạng mục của **App foundation** |
| System settings | Lối vào quản trị trong ứng dụng: quản lý người dùng, vai trò và phân quyền, quản lý workflow, app foundation, v.v. |
| App foundation | Trang có sẵn trong template mặc định. Nó cho biết ứng dụng dùng những năng lực Core nào và gói nào cung cấp chúng |
| Record lifecycle | Trạng thái của một bản ghi được lưu trong chính trường của nó, và việc chuyển giữa các trạng thái được khai báo trong mã. Mọi workflow của NocoBase 3 đều xây trên nó |
| Tham số workflow (workflow parameter) | Giá trị quản trị viên có thể chỉnh trong **Workflow management**, như người phê duyệt hoặc ngưỡng số tiền |
| Bộ quyền (permission set) | Một gói các quyền trên trang, thao tác và phạm vi dữ liệu, gán cho một vai trò hoặc một người. Trên giao diện hiển thị là "role" |
| Phạm vi dữ liệu (data scope) | Những bản ghi mà một thao tác có thể áp dụng, ví dụ "các đơn hàng người dùng phụ trách" |
| Migration | File mã thay đổi cấu trúc cơ sở dữ liệu. Migration chạy theo thứ tự, và migration đã chạy thì không bao giờ sửa lại |
| `config.yml` | Cấu hình triển khai của ứng dụng: cơ sở dữ liệu, lưu trữ, khóa bí mật, tác vụ nền, v.v. File này không được commit vào repository |

## Studio

| Thuật ngữ | Ý nghĩa |
| --- | --- |
| Issue | Đơn vị cơ bản của công việc được bàn giao trong Studio. Không gọi là "ticket" hay "phiếu yêu cầu" |
| Người phụ trách issue (issue owner) | Người chịu trách nhiệm về kết quả của một issue. Luôn là con người |
| Agent điều phối (coordinator agent) | Agent hệ thống duy nhất, chia công việc thành các bước, phân công, đặt câu hỏi và chuyển giao để nghiệm thu. Nó không viết mã. |
| Agent thực thi (worker agent) | Agent trong đội Agent thực hiện các bước mà Agent điều phối giao |
| Agent của tôi (my agent) | Công cụ lập trình của riêng bạn, như Claude Code hoặc Codex. Khi đã kết nối với Studio, nó trao đổi yêu cầu với bạn trong My sessions |
| Đội Agent (agent team) | Tất cả các Agent mà nhóm đã bật |
| Runtime | Một máy chạy `nocobase-runner`, có thể là runtime dùng chung hoặc runtime cá nhân |
| My issues, My sessions | Hai cách theo dõi công việc: theo issue và theo phiên |
| Bộ nhớ dự án (project memory) | Những gì Agent ghi lại khi làm việc. Nó được lưu trong repository mã nguồn, và Agent tự đọc, tự ghi |
| Cơ sở tri thức (knowledge base) | Tài liệu do con người viết và tải lên. Agent chỉ được đọc |
| Báo cáo bàn giao (delivery report) | Những gì Agent điều phối nộp khi một issue chuyển sang In review |
| Backlog / In progress / Blocked / In review / Done / Cancelled | Sáu trạng thái cố định của issue. In review nghĩa là đã bàn giao và đang chờ người phụ trách issue nghiệm thu |

Xem toàn bộ thuật ngữ của Studio ở [Các khái niệm cốt lõi](../studio/intro/concepts.md).

## Quy ước

- Tên, nút và menu trên giao diện được in **đậm**, đúng như trên giao diện tiếng Anh. Đường dẫn được viết dạng **A › B**.
- Tên trong mã (tên gói, tên file, lệnh) dùng định dạng code và chỉ xuất hiện khi cần.
