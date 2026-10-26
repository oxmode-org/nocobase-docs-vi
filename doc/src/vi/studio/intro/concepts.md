---
title: Các khái niệm cốt lõi
description: Con người trong Studio, yêu cầu và issue, dự án và repository, Agent và runtime, Skill, cơ sở tri thức, bộ nhớ dự án, preview và môi trường triển khai, và cách chúng liên kết với nhau.
---

<figure class="map" aria-label="Các khái niệm cốt lõi của Studio và mối liên hệ giữa chúng">
<div class="row"><div class="box human"><b>Con người</b><span>Người phụ trách issue, trưởng dự án và quản trị viên: nêu yêu cầu, trả lời câu hỏi, nghiệm thu kết quả và duyệt phát hành</span></div></div>
<div class="down">Yêu cầu trở thành issue</div>
<div class="row"><div class="box brand"><b>Issue</b><span>Thuộc về một dự án, mã nguồn nằm trong repository của dự án</span></div></div>
<div class="down">Agent điều phối phân công</div>
<div class="row c2"><div class="box agent"><b>Đội Agent</b><span>Agent điều phối chia việc, các Agent thực thi thiết kế, xây dựng, kiểm thử và review</span></div><div class="box"><b>Runtime</b><span>Server của nhóm và máy của các thành viên, nơi Agent làm việc</span></div></div>
<div class="down">Đọc trước khi làm, ghi lại những gì học được</div>
<div class="row"><div class="box"><b>Skill · Cơ sở tri thức · Bộ nhớ dự án</b><span>Cách làm việc · Tài liệu nghiệp vụ · Những gì Agent đã học</span></div></div>
<div class="down">Triển khai sau khi merge</div>
<div class="row"><div class="box"><b>Môi trường triển khai</b><span>Preview · Staging · Production</span></div></div>
</figure>

## Con người

| Vai trò | Là ai | Làm gì |
| --- | --- | --- |
| Người phụ trách issue | Mỗi issue một người, mặc định là người nêu yêu cầu | Trả lời câu hỏi của Agent và nghiệm thu kết quả |
| Trưởng dự án | Mỗi dự án một người | Quản lý cài đặt, Skill và cơ sở tri thức của dự án, và thường cũng là người duyệt phát hành |
| Quản trị viên | Bất kỳ ai có vai trò hệ thống **Admin** hoặc **Owner** | Kết nối runtime dùng chung, bật Agent, quản lý thành viên, môi trường triển khai và cài đặt hệ thống |

Mỗi thành viên có một vai trò hệ thống, **Member**, **Admin** hoặc **Owner**, hoặc một vai trò tùy chỉnh. Xem [Thành viên và vai trò](../admin/members-and-roles.md). Người phụ trách issue và trưởng dự án không phải vai trò hệ thống, và bất kỳ thành viên nào trong nhóm cũng có thể đảm nhận.

## Yêu cầu và issue

Con người nêu yêu cầu. Bạn có thể trao đổi yêu cầu với một Agent trong **My sessions** trước rồi để Agent biến nó thành các issue, hoặc điền trực tiếp một issue. Issue nằm trong dự án và là đơn vị công việc trong Studio.

Mỗi issue có:

- **Người phụ trách**: người chịu trách nhiệm về kết quả. Agent tìm đến người phụ trách khi cần con người quyết định, và bàn giao công việc đã xong cho người phụ trách nghiệm thu.
- **Người thực hiện**: khi issue được bắt đầu, người thực hiện là Agent điều phối, Agent này giao cho các Agent thực thi làm. Một thành viên cũng có thể tự làm issue.
- **Dự án, độ ưu tiên, nhãn và hạn chót**: runtime nhận việc của các issue khẩn cấp trước.
- **Issue con và issue chặn**: một issue chưa bắt đầu cho đến khi các issue chặn nó xong, sau đó tự chạy tiếp.

Mỗi issue ở một trong sáu trạng thái sau:

<div class="states" aria-label="Trạng thái issue"><span class="st-pill"><span class="si backlog"></span>Backlog</span><span class="arrow">→</span><span class="st-pill"><span class="si progress"></span>In progress</span><span class="arrow">⇄</span><span class="st-pill"><span class="si blocked"></span>Blocked</span><span class="arrow">·</span><span class="st-pill"><span class="si review"></span>In review</span><span class="arrow">→</span><span class="st-pill"><span class="si done"></span>Done</span><span class="st-pill"><span class="si cancel"></span>Cancelled</span></div>

| Trạng thái | Ý nghĩa |
| --- | --- |
| Backlog | Chưa bắt đầu. Agent không động vào |
| In progress | Đội Agent đang làm |
| Blocked | Đang chờ người phụ trách issue quyết định điều gì đó |
| In review | Đã bàn giao, đang chờ người phụ trách issue nghiệm thu |
| Done | Đã nghiệm thu. Issue tự chuyển sang Done khi tất cả PR liên kết đã được merge |
| Cancelled | Không còn cần nữa |

Con người có thể chuyển issue sang bất kỳ trạng thái nào. Agent điều phối chỉ chuyển issue giữa In progress, Blocked và In review, còn Agent thực thi không bao giờ đổi trạng thái.

## Dự án và repository

Một dự án gom các issue và mã nguồn liên quan lại với nhau. Khi tạo dự án, bạn có thể tạo repository mới, chọn một repository có sẵn, hoặc thêm sau. Repository mới mặc định được khởi tạo từ template ứng dụng NocoBase, cho bạn một ứng dụng xây trên Core. Bạn cũng có thể khởi tạo từ một prompt, hoặc để trống.

- Issue đầu tiên của dự án mới là "Initialize project", và các issue khác của dự án chờ cho đến khi nó xong.
- Studio truy cập repository trên GitHub, GitLab hoặc Gitee qua các kết nối Git mà quản trị viên thêm vào. Khi thành viên đã kết nối tài khoản Git của riêng mình, các PR mà Agent mở cho họ và các lần merge họ làm trong Studio đều mang tên của chính họ.
- Agent thực thi mặc định dùng nhánh tên `agent/<issue key>`, và PR từ các nhánh này tự động được liên kết với issue tương ứng.

> [!NOTE] Bảo vệ nhánh trên nền tảng lưu trữ mã
> Studio không bảo vệ nhánh thay bạn. Hãy bật quy tắc bảo vệ cho nhánh mặc định trên GitHub, GitLab hoặc Gitee.

## Agent và runtime

Runtime là máy nơi Agent làm việc: server của nhóm, máy ảo, hoặc máy riêng của một thành viên. Runtime báo cáo các công cụ lập trình và model đã cài và đã đăng nhập trên đó, và mỗi cặp công cụ lập trình với model là một Agent, như Claude · Opus 5.5. Khi quản trị viên ghi phần **Good at** (thế mạnh) và bật nó lên, Agent đó tham gia đội Agent với vai trò Agent thực thi. Agent điều phối có sẵn trong Studio, và quản trị viên chọn một trong các Agent đã bật để nó chạy trên đó.

| | Runtime dùng chung | Runtime cá nhân |
| --- | --- | --- |
| Ai kết nối | Quản trị viên | Bất kỳ thành viên nào |
| Chạy việc của ai | Của mọi người | Chỉ việc do chủ của nó bắt đầu |
| Phù hợp cho | Server của nhóm, trực tuyến cả ngày | Máy riêng của thành viên, với công cụ lập trình và gói thuê bao của chính họ |

Để xem đội Agent chia việc và đẩy nhiều issue cùng lúc ra sao, đọc [Cách đội Agent làm việc](agent-team.md).

> [!WARNING] Runtime không phải ranh giới bảo mật
> Trên một runtime, Agent làm việc dưới quyền user hệ thống chạy `nocobase-runner` và có thể đọc, ghi mọi thứ user đó truy cập được. Hãy chạy nó dưới một user hệ thống riêng, trong container, hoặc trong máy ảo.

## My issues và My sessions

Mỗi thành viên có hai cách theo dõi công việc:

| | My issues | My sessions |
| --- | --- | --- |
| Tổ chức theo | Issue | Phiên |
| Có gì trong đó | Các issue bạn phụ trách, đang làm hoặc theo dõi, những gì đang chờ bạn nằm trên cùng | Các cuộc trò chuyện của bạn với Agent, các issue được tạo trong mỗi phiên và tiến độ của chúng |
| Phù hợp cho | Xử lý các quyết định đang chờ bạn mỗi ngày: trả lời câu hỏi và nghiệm thu kết quả | Trao đổi một yêu cầu khi nó còn chưa rõ, và theo dõi các issue từ một phiên ở cùng một chỗ |

::figure my-tasks-list+sessions-list pair | Trái: My issues, tổ chức theo issue. Phải: My sessions, tổ chức theo phiên

Trong một phiên, bạn có thể trò chuyện với Agent của riêng bạn hoặc với một Agent trong đội Agent. Xem [My sessions](../use/sessions.md). Chỉ bạn thấy được các phiên của mình. Dù bạn trò chuyện với ai, Agent trong phiên đều thao tác trong Studio bằng danh tính và quyền của bạn, ví dụ khi nó tạo issue hoặc đăng bình luận.

## Skill, cơ sở tri thức và bộ nhớ dự án

Skill, cơ sở tri thức và bộ nhớ dự án giữ phương pháp và kinh nghiệm lại với nhóm. Agent đọc chúng trước khi bắt đầu, nên người mới hoặc Agent mới có thể tiếp tục từ chỗ người trước dừng lại, và bạn không phải giải thích lại bối cảnh cho mỗi yêu cầu mới.

| | Chứa gì | Ai viết | Ở đâu |
| --- | --- | --- | --- |
| Skill | Cách làm việc: chia việc thành các bước, viết kế hoạch, xây dựng, review và viết báo cáo bàn giao | Studio có sẵn một vài Skill, và nhóm có thể thêm Skill riêng, cho mọi thứ, cho một dự án, hoặc cho một thư mục làm việc | **Agent management › Skills** |
| Cơ sở tri thức | Tài liệu nghiệp vụ: quy tắc nghiệp vụ, ghi chú sản phẩm, quy ước kỹ thuật | Con người viết và tải lên. Agent chỉ đọc | **Development › Knowledge** |
| Bộ nhớ dự án | Những gì Agent học được khi làm việc: hướng làm đã được con người sửa hoặc xác nhận, các cạm bẫy, những quyết định mà mã nguồn không giải thích | Agent tự viết, và nó được review, merge cùng PR của issue | **Development › Project memory**, lưu trong repository tại `.nb-studio/memory/` |

## Preview và môi trường triển khai

Khi CI của repository đã kết nối với Studio:

- Mỗi PR có một bản preview với dữ liệu mẫu và một tài khoản quản trị được tạo sẵn, để bạn tự dùng thử thay đổi khi nghiệm thu.
- Sau khi merge, CI triển khai thay đổi lên staging, và issue cho biết thay đổi đã đến những môi trường nào.
- Mỗi lần triển khai lên môi trường được bảo vệ, thường là production, cần người duyệt đồng ý. Nếu có sự cố, bạn có thể rollback về phiên bản trước.

Xem [Kết nối CI](../setup/ci.md) và [Môi trường triển khai](../admin/environments.md).

## Phân quyền

Một thành viên làm được gì tùy vào vai trò của họ. Agent làm việc thay mặt người đã bắt đầu công việc và không bao giờ có nhiều quyền hơn người đó. Agent điều phối và mọi bước nó sắp xếp đều thay mặt người phụ trách issue. Chỉ con người mới được merge PR, duyệt triển khai lên môi trường được bảo vệ, và quản lý thành viên. Xem [Trạng thái issue và phân quyền](../reference/statuses-and-permissions.md).
