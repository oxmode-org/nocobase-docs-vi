---
title: Studio là gì
description: NocoBase Studio là nền tảng quản trị cho con người và Agent cùng xây dựng phần mềm. Nó đưa Claude Code, Codex và OpenCode vào một đội Agent tự đẩy các issue tiến lên. Tiến độ rõ ràng chỉ trong một cái nhìn, và con người đưa ra các quyết định then chốt.
---

Kết nối Claude Code, Codex và các Agent khác trên máy tính và server của nhóm, chúng sẽ tạo thành một đội Agent. Một Agent điều phối phân công thiết kế, phát triển, kiểm thử và review, và tự đẩy nhiều dự án tiến lên. Bạn nhìn là biết mỗi issue đang ở đâu và bước tiếp theo là gì. Phương pháp và kinh nghiệm được lưu lại trong Skill, cơ sở tri thức và bộ nhớ dự án, nên người mới hoặc Agent mới có thể tiếp tục từ chỗ người trước dừng lại. Ở mỗi điểm then chốt, Agent đính kèm báo cáo và ảnh chụp màn hình, và con người đưa ra quyết định.

## Vì sao cần Studio

Nhóm của bạn đã phát triển với AI hoặc vibe coding, và mã được viết rất nhanh. Nhưng khi nhóm có nhiều dự án và issue chạy cùng lúc, những vấn đề mới xuất hiện. Mọi người chuyển qua lại giữa các terminal và cửa sổ chat, còn Agent trả về ngày càng nhiều thay đổi. Nhiều đến mức không ai review hết, nhưng buông tay thì quá rủi ro. Bối cảnh yêu cầu, tài liệu nghiệp vụ và bài học kinh nghiệm nằm rải rác trong các phiên chat trên nhiều máy khác nhau, và khi đổi người hoặc đổi Agent thì rất khó tìm lại.

NocoBase Studio được xây dựng để quản trị cách con người và Agent cùng phát triển.

### Một đội Agent giữ cho công việc luôn chạy

Studio kết nối Agent trên nhiều máy và điều phối tập trung như một đội Agent, đẩy nhiều dự án và issue tiến lên song song, suốt ngày đêm. Claude Code, Codex, Gemini CLI, Cursor, OpenCode và các công cụ lập trình phổ biến khác đều có thể tham gia. Để xem Agent điều phối chia việc thế nào, đọc [Cách đội Agent làm việc](agent-team.md).

### Tiến độ rõ trong một cái nhìn

Trong Studio, bạn thấy mỗi issue đang ở đâu và bước tiếp theo là gì, cùng với tiến độ dự án, khối lượng việc của Agent và mức dùng model. Những gì đang chờ bạn luôn nằm trên cùng trong **My issues**. Xem [Theo dõi tiến độ](../use/follow-progress.md) và [Tiến độ dự án](../project/progress.md).

### Quyết định có bằng chứng

Trong Studio, nhiều Agent phối hợp thiết kế, phát triển, kiểm thử và review, và một thay đổi chỉ đến tay con người sau khi đã qua kiểm tra và review. Khi cần con người quyết định, Agent đính kèm báo cáo chi tiết, checklist, ảnh chụp màn hình và đề xuất, nên cả chuyên gia nghiệp vụ không viết mã cũng có thể quyết định. Xem [Nghiệm thu kết quả](../use/accept.md).

### Kinh nghiệm ở lại với nhóm

Skill lưu cách làm việc, cơ sở tri thức lưu tài liệu nghiệp vụ, và bộ nhớ dự án lưu những gì Agent tự học được. Khi đổi người hoặc đổi Agent, người tiếp theo làm tiếp từ chỗ người trước dừng lại. Xem [Skill](../project/skills.md), [Cơ sở tri thức](../project/knowledge-base.md) và [Bộ nhớ dự án](../project/project-memory.md).

## Con người và Agent chia việc thế nào

Agent viết mã và làm việc, con người đưa ra quyết định.

::figure roles | Vai trò của con người và Agent trong Studio

Con người quyết định ở ba điểm then chốt:

1. **Trả lời câu hỏi.** Khi phải cân nhắc giữa các hướng làm, cần chốt một quy tắc nghiệp vụ, hoặc gặp ngoại lệ, Agent điều phối nêu rõ điều cần quyết định và chuyển cho người phụ trách issue.
2. **Nghiệm thu kết quả.** Agent điều phối đính kèm báo cáo bàn giao, tiêu chí nghiệm thu, ảnh chụp màn hình, và một bản preview để bạn tự dùng thử khi có. Nếu mọi thứ ổn, người phụ trách issue merge. Nếu chưa, họ trả lại để sửa.
3. **Duyệt phát hành.** Triển khai lên một môi trường được bảo vệ, như production, cần người duyệt đồng ý. Nếu có sự cố, bạn có thể rollback về phiên bản trước.

Để theo một yêu cầu từ ý tưởng đến phát hành, đọc [Một yêu cầu được hoàn thành thế nào](how-a-request-gets-done.md).

## Studio liên quan thế nào đến NocoBase Core

Bên trên việc phát triển bằng AI, NocoBase bổ sung phần nền tảng và phần quản trị. Core là nền tảng ứng dụng, với các khối xây dựng và chuẩn phát triển mà mọi hệ thống nghiệp vụ đều dùng chung. Studio là nền tảng quản trị cho con người và Agent cùng xây dựng phần mềm.

<figure class="map" aria-label="Nhóm của bạn làm việc với đội Agent trong Studio để xây ứng dụng nghiệp vụ trên Core">
<div class="row"><div class="box human"><b>Nhóm của bạn</b><span>Nêu yêu cầu, theo dõi tiến độ và đưa ra các quyết định then chốt</span></div></div>
<div class="down">Yêu cầu</div>
<div class="row c2"><div class="box brand"><b>NocoBase Studio</b><span>Điều phối đội Agent, chạy kiểm tra và review, lưu giữ kinh nghiệm của nhóm</span></div><div class="box agent"><b>Đội Agent</b><span>Claude Code, Codex và các công cụ lập trình khác, cùng chia nhau thiết kế, phát triển, kiểm thử và review</span></div></div>
<div class="down">Phát triển</div>
<div class="row"><div class="box"><b>Ứng dụng nghiệp vụ của bạn · xây trên NocoBase Core</b><span>Dùng phân quyền, workflow, tệp và các khối xây dựng khác của Core, và tự vận hành sau khi phát hành</span></div></div>
</figure>

Một dự án mới trong Studio mặc định bắt đầu từ template ứng dụng NocoBase. Agent dùng các khối xây dựng Core đã có sẵn như phân quyền, workflow, tệp, và chỉ xây phần riêng của nghiệp vụ bạn. Lượng mã cần viết và kiểm tra ít hơn nhiều, và hệ thống phát triển ổn định trong nhiều năm trên một kiến trúc nhất quán. Sau khi phát hành, ứng dụng nghiệp vụ tự vận hành, và các yêu cầu nghiệp vụ hằng ngày không cần đi qua Studio.

## Tự host

Studio đi kèm các phiên bản thương mại của NocoBase, còn Core và các ứng dụng Solution như NocoCRM là miễn phí và mã nguồn mở. Studio và các ứng dụng nghiệp vụ chạy trên server của chính bạn, và mã nguồn cùng dữ liệu thuộc về bạn. Bạn tự chọn model và Agent, không bị khóa vào nhà cung cấp nào.
