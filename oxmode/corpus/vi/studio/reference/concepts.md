---
title: Khái niệm cốt lõi
description: Dự án, đầu việc, phiên, agent, môi trường chạy, tri thức dùng chung và mối liên hệ giữa mã nguồn và phát hành.
---

Studio tổ chức đầu việc và mã theo dự án. Con người quyết định và nghiệm thu. Agent phát triển ứng dụng bằng Skill dùng chung, tài liệu nghiệp vụ và bộ nhớ dự án.

<figure class="map concept-map" aria-label="Dự án tổ chức đầu việc và mã, agent và môi trường chạy thực hiện công việc, còn tri thức dùng chung cung cấp bối cảnh">
<div class="row"><div class="box brand"><b>Dự án</b><span>Đầu việc, kho mã và tri thức liên quan của nhóm</span></div></div>
<div class="down">Đầu việc và mã thuộc cùng dự án</div>
<div class="row c2"><div class="box human"><b>Đầu việc</b><span>Yêu cầu, người phụ trách, tiến độ và bàn giao</span></div><div class="box"><b>Kho mã</b><span>Mã nguồn, pull request và phiên bản</span></div></div>
<div class="down">Nhóm agent thực hiện đầu việc và gửi thay đổi</div>
<div class="row c2"><div class="box agent"><b>Agent</b><span>Agent điều phối phân công, agent thực thi bàn giao</span></div><div class="box agent"><b>Môi trường chạy</b><span>Công cụ lập trình, mô hình và tài nguyên thực thi</span></div></div>
<div class="row"><div class="box knowledge"><b>Skill · Kho tri thức · Bộ nhớ dự án</b><span>Chuẩn phát triển, tài liệu nghiệp vụ và kinh nghiệm dự án</span></div></div>
</figure>

<a id="projects-and-repositories"></a>

## Dự án và kho mã

**Dự án** tập hợp đầu việc, thành viên, kho mã và tài liệu. Người phụ trách dự án quản lý cài đặt, tri thức dùng chung và phát hành.

**Kho mã** lưu mã ứng dụng. Một dự án có thể có nhiều kho. Mặc định, kho mới được khởi tạo bằng NocoBase Core. Có thể kết nối cả kho hiện có.

![Supplier Management tóm tắt tiến độ và mở đường tới tri thức, thành viên và phát hành](https://static-docs.nocobase.com/studio-en-project-overview-20261030.png)

Xem [Tạo dự án đầu tiên](../setup/new-project.md) và [Cài đặt dự án](../project/settings.md).

<a id="tasks-and-owners"></a>

## Đầu việc và người phụ trách

**Đầu việc** ghi yêu cầu, tiêu chí nghiệm thu, thảo luận và kết quả bàn giao, chẳng hạn chấm điểm và phân hạng nhà cung cấp. Đầu việc con chia nhỏ công việc, còn đầu việc tiền nhiệm biểu thị quan hệ phụ thuộc.

Mỗi đầu việc có **người phụ trách** trả lời câu hỏi, quyết định khi có đánh đổi và nghiệm thu. Agent điều phối tổ chức thực hiện. Kết quả thiết kế, phát triển và rà soát được lưu cùng đầu việc.

Đầu việc có sáu trạng thái. Các chuyển tiếp thường gặp:

<div class="states" aria-label="Từ Backlog sang In progress, có thể chuyển qua lại với In review, rồi đến Done"><span class="st-pill"><span class="si backlog"></span>Backlog</span><span class="arrow">→</span><span class="st-pill"><span class="si progress"></span>In progress</span><span class="arrow">⇄</span><span class="st-pill"><span class="si review"></span>In review</span><span class="arrow">→</span><span class="st-pill"><span class="si done"></span>Done</span></div>
<div class="states" aria-label="Có thể chuyển qua lại giữa In progress và Blocked, hoặc hủy đầu việc chưa hoàn tất"><span class="st-pill"><span class="si progress"></span>In progress</span><span class="arrow">⇄</span><span class="st-pill"><span class="si blocked"></span>Blocked</span><span class="arrow">·</span><span>Đầu việc chưa hoàn tất</span><span class="arrow">→</span><span class="st-pill"><span class="si cancel"></span>Canceled</span></div>

**Blocked** cần quyết định. **In review** đang chờ nghiệm thu. Các mục này được ưu tiên trong **My issues**.

![Người phụ trách đọc báo cáo bàn giao và nghiệm thu trong My issues](https://static-docs.nocobase.com/studio-en-req-accept-20261030.png)

Phụ trách đầu việc là trách nhiệm gắn với công việc cụ thể. Agent hoạt động trong phạm vi quyền của người yêu cầu. Xem [Trạng thái và quyền của đầu việc](statuses-and-permissions.md).

<a id="sessions"></a>

## Phiên làm việc

**Phiên làm việc** là cuộc trò chuyện với agent để trao đổi yêu cầu, tạo đầu việc và theo dõi kết quả. Một phiên có thể liên kết nhiều đầu việc. Tiến độ của chúng được gửi về cuộc trò chuyện.

Chỉ người tạo thấy phiên. Đầu việc được chia sẻ theo quyền dự án.

![Agent chuyển quy tắc đã thống nhất thành đầu việc, với tiến độ hiển thị cạnh cuộc trò chuyện](https://static-docs.nocobase.com/studio-en-req-session-20261030.png)

Xem [Phiên làm việc của tôi](../use/sessions.md).

<a id="agents-and-runtimes"></a>

## Agent và môi trường chạy

| Khái niệm | Trách nhiệm |
| --- | --- |
| Agent điều phối | Phân công từng bước, đọc kết quả, hỏi người phụ trách và đưa công việc đi nghiệm thu |
| Agent thực thi | Cặp công cụ lập trình và mô hình dùng để thiết kế, phát triển, kiểm thử hoặc rà soát |
| Môi trường chạy | Cung cấp máy, công cụ và mô hình để agent thực hiện công việc |

![Cấu hình agent theo thế mạnh và chọn mô hình chính, dự phòng cho agent điều phối](https://static-docs.nocobase.com/studio-en-agent-team-20261030.png)

Một môi trường chạy có thể cung cấp nhiều agent. Cùng một agent có thể chạy trên nhiều máy. Môi trường dùng chung phục vụ cả nhóm. Môi trường cá nhân chỉ phục vụ các đầu việc do chủ sở hữu bắt đầu.

![Runtimes liệt kê máy, công cụ lập trình khả dụng và phạm vi chia sẻ](https://static-docs.nocobase.com/studio-en-shared-runtimes-20261030.png)

Mỗi lượt thực thi tạo **bản ghi thực thi** gồm quá trình, kết quả và mức sử dụng. Một đầu việc thường gồm nhiều lượt chạy.

Xem [Cách nhóm agent làm việc](agent-execution.md) và [Kết nối môi trường chạy](../setup/shared-runtimes.md).

<a id="skills-knowledge-base-and-project-memory"></a>

## Skill, kho tri thức và bộ nhớ dự án

| Khái niệm | Nội dung lưu | Ví dụ |
| --- | --- | --- |
| [Skill](../project/skills.md) | Cách phát triển và yêu cầu thực thi | Các bước thiết kế, tiêu chí rà soát, mẫu báo cáo bàn giao |
| [Kho tri thức](../project/knowledge-base.md) | Tài liệu nghiệp vụ do nhóm viết hoặc tải lên | Bảng chấm điểm nhà cung cấp, chính sách mua hàng |
| [Bộ nhớ dự án](../project/project-memory.md) | Quy tắc đã xác nhận, kinh nghiệm và lý do quyết định | Mọi đơn hàng từ nhà cung cấp hạng C đều cần duyệt, bất kể giá trị |

Skill có thể áp dụng toàn cục, theo dự án hoặc kho mã. Agent duy trì bộ nhớ dự án. Thay đổi bộ nhớ được rà soát và hợp nhất cùng PR để đầu việc sau dùng lại.

![Bộ nhớ dự án lưu quy tắc đã xác nhận cùng nguồn](https://static-docs.nocobase.com/studio-en-project-memory-20261030.png)

<a id="prs-environments-and-versions"></a>

## PR, môi trường và phiên bản

**PR** (pull request) liên kết đầu việc với thay đổi mã. Agent gửi mã và hoàn tất kiểm tra, rà soát. Người phụ trách nghiệm thu và hợp nhất.

Ứng dụng trong **môi trường xem trước và kiểm thử** có thể chạy dưới dạng tiến trình con của Studio để kiểm chứng thay đổi.

| Môi trường | Mục đích |
| --- | --- |
| Bản xem trước PR | CI tạo để kiểm chứng thay đổi trước khi hợp nhất |
| Môi trường kiểm thử | Chạy mã đã hợp nhất để kiểm chứng các thay đổi cùng nhau |

Với **production**, dựng image và triển khai trên hạ tầng riêng của đội ngũ. Studio ghi nhận phiên bản production sau khi đội ngũ triển khai.

**Phiên bản** là bản phát hành tương ứng với một tag trong kho khớp dòng phát hành. Studio liên kết phiên bản với đầu việc và gói đầu ra.

![Releases liên kết phiên bản và đầu việc với trạng thái kiểm thử và production](https://static-docs.nocobase.com/studio-en-releases-20261030.png)

Sau khi hoàn tất đầu việc, xem phiên bản và bản ghi triển khai để biết thay đổi đã lên production chưa. Xem [Tổng quan phát hành](../release/overview.md).
