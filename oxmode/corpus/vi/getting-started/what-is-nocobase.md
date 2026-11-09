---
title: NocoBase 3 là gì
description: Nền tảng mã nguồn mở để xây dựng, vận hành và phát triển hệ thống nghiệp vụ cùng AI.
---

NocoBase 3 là nền tảng mã nguồn mở để xây dựng, vận hành và phát triển hệ thống nghiệp vụ cùng AI. Agent viết mã và thực hiện công việc, NocoBase cung cấp nền tảng và cơ chế quản trị, còn con người đưa ra quyết định.

<a id="why-nocobase"></a>

## Vì sao dùng NocoBase

Vibe coding giúp xây dựng phần mềm nhanh hơn. Hệ thống nghiệp vụ thường được dùng nhiều năm, trong đó tính năng được bổ sung, quy trình thay đổi và người phụ trách bàn giao công việc. NocoBase bổ sung nền tảng ứng dụng, chuẩn phát triển và cơ chế quản trị để đội ngũ tiếp tục làm việc với Claude Code, Codex và các công cụ lập trình khác.

<a id="reliable-building-blocks"></a>

### Các thành phần nền tảng có sẵn

Ngay cả khi AI viết mã, việc thiết kế phân quyền, bộ máy quy trình và phê duyệt từ đầu vẫn khó. Các chức năng này có nhiều trường hợp biên và cần nhiều công bảo trì.

Core cung cấp các thành phần sẵn dùng và NocoBase tiếp tục bảo trì, nâng cấp chúng. Chẳng hạn, khi bộ phận mua hàng cần hệ thống quản lý nhà cung cấp, agent tập trung viết hồ sơ nhà cung cấp, đơn mua hàng và quy tắc phê duyệt, đồng thời dùng các thành phần phân quyền và phê duyệt sẵn có của Core. Nhờ vậy, đội ngũ có ít mã phải viết và kiểm tra hơn.

<a id="consistent-development-standards"></a>

### Chuẩn phát triển nhất quán

Khi đổi người phát triển, mô hình hoặc phiên làm việc, AI có thể triển khai cùng một việc theo nhiều cách. Hệ thống dần khó bảo trì khi những cách triển khai đó tích tụ.

Core cung cấp cấu trúc dự án và chuẩn phát triển thống nhất. Agent viết mã theo các Skill phát triển đi kèm package để hệ thống tiếp tục phát triển trên cùng kiến trúc qua nhiều năm.

<a id="teamwork-and-shared-knowledge"></a>

### Phối hợp trong nhóm và chia sẻ tri thức

Đội ngũ phải theo dõi nhiều dự án và đầu việc, chuyển qua lại giữa terminal và các cuộc trò chuyện. Khi agent trả về ngày càng nhiều thay đổi, việc duyệt từng thay đổi mất nhiều công sức, còn bỏ qua kiểm tra làm tăng rủi ro.

Studio điều phối một nhóm agent làm đồng thời trên nhiều dự án và đầu việc, với tiến độ dễ theo dõi. Khi cần con người tham gia, agent đính kèm báo cáo, danh sách kiểm tra và ảnh chụp màn hình để người phụ trách có căn cứ quyết định.

Bối cảnh yêu cầu, tài liệu nghiệp vụ và kinh nghiệm có thể nằm rải rác trong nhiều phiên trò chuyện trên các máy khác nhau. Khi đổi người hoặc agent, việc tìm lại thông tin mất thời gian.

Studio lưu cách làm và kinh nghiệm trong Skill, kho tri thức và bộ nhớ dự án để người hoặc agent mới tiếp tục từ phần việc đang dở.

<a id="the-parts-of-nocobase-3"></a>

## Các phần của NocoBase 3

<figure class="layers" aria-label="Mẫu Solution tạo ứng dụng nghiệp vụ, Studio quản trị phát triển và Core cung cấp nền tảng">
<div class="ly-node ly-studio"><b>NocoBase Studio</b><strong>Con người và agent cùng xây dựng</strong><p>Con người quyết định, agent thực hiện. Điều phối phát triển, kiểm tra và bàn giao.</p></div>
<div class="ly-link ly-develop"><span>Phát triển và quản trị</span><i aria-hidden="true"></i></div>
<div class="ly-node ly-app"><b>Ứng dụng nghiệp vụ</b><strong>Hệ thống nghiệp vụ của tổ chức</strong><p>Tự sở hữu mã và dữ liệu. Vận hành độc lập sau khi phát hành.</p></div>
<div class="ly-link ly-generate"><span>Tạo ứng dụng</span><i aria-hidden="true"></i></div>
<div class="ly-node ly-solution"><b>Solution</b><strong>Mẫu ứng dụng nghiệp vụ</strong><p>Bắt đầu với ứng dụng có sẵn và tùy chỉnh theo nghiệp vụ.</p></div>
<div class="ly-foundation"><div><b>NocoBase Core</b><span>Nền tảng ứng dụng mã nguồn mở</span></div><p>Hơn 20 thành phần, gồm phân quyền, quy trình và tệp · Cấu trúc dự án và chuẩn phát triển nhất quán</p></div>
</figure>

<a id="core-the-open-source-app-foundation"></a>

### Core, nền tảng ứng dụng mã nguồn mở

**[Core](../core/index.md)** là nền tảng mã nguồn mở cho các hệ thống nghiệp vụ được xây dựng và vận hành cùng AI. Core cung cấp thành phần dùng chung và chuẩn phát triển.

Cá nhân hoặc nhóm nhỏ phụ trách một vài ứng dụng có thể mở Claude Code, Codex hoặc công cụ lập trình khác ngay trong thư mục ứng dụng để làm việc cùng agent. Nhóm tự tổ chức kiểm thử, rà soát và triển khai bằng công cụ và hướng dẫn của Core. Có thể dùng Core độc lập với Studio.

<a id="studio-collaboration-and-governance"></a>

### Studio, nơi cộng tác và quản trị

**[Studio](../studio/index.md)** là nền tảng quản trị để con người và agent cùng xây dựng phần mềm. Studio tập hợp Claude Code, Codex và OpenCode vào một nhóm agent.

Dùng Studio khi nhóm xử lý đồng thời nhiều dự án và đầu việc, hoặc khi chuyên gia nghiệp vụ cần trực tiếp nêu yêu cầu và ra quyết định. Agent điều phối phân công thiết kế, phát triển, kiểm thử và rà soát. Công việc đến người nghiệm thu sau khi qua kiểm tra và rà soát. Triển khai vào môi trường được bảo vệ cần người có thẩm quyền duyệt.

Studio có trong phiên bản thương mại.

<a id="solution-ready-made-business-apps"></a>

### Solution, các ứng dụng nghiệp vụ có sẵn

**Solution** là dòng ứng dụng nghiệp vụ vận hành cùng agent và xây dựng trên Core, chẳng hạn NocoCRM và NocoITAM. Agent làm phần lớn công việc, còn con người đưa ra quyết định quan trọng. Có thể cài và dùng ngay hoặc nhờ agent tùy chỉnh theo nghiệp vụ.

<a id="from-development-to-daily-operations"></a>

## Từ phát triển đến vận hành hằng ngày

<a id="development-and-delivery"></a>

### Phát triển và bàn giao

Với hệ thống quản lý nhà cung cấp, đội ngũ quyết định thông tin cần lưu, quy trình duyệt đơn mua hàng và dữ liệu từng vai trò được xem hoặc sửa. Agent dùng Core để xây dựng trang, cấu trúc dữ liệu và quy tắc nghiệp vụ. Mã ứng dụng nằm trong kho riêng của tổ chức. Đội ngũ kiểm tra luồng nghiệp vụ, quyền và kết quả kiểm thử rồi phát hành cho người dùng khi ứng dụng đáp ứng yêu cầu.

<a id="ongoing-development"></a>

### Tiếp tục phát triển

Sau khi đưa vào sử dụng, bộ phận mua hàng có thể cần xếp hạng nhà cung cấp hoặc đổi quy tắc phê duyệt đơn mua. Tiếp tục làm việc với agent để sửa ứng dụng hiện có và kiểm tra ảnh hưởng tới dữ liệu và quy trình đang dùng.

<a id="agents-in-daily-operations"></a>

### Agent trong vận hành hằng ngày

Khi ứng dụng đã hoạt động, agent có thể làm việc nghiệp vụ ngay trong đó, chẳng hạn tìm hiểu khách hàng, soạn email, đối soát hồ sơ tài sản và xử lý yêu cầu hỗ trợ. Plugin Agents của Core kết nối các agent nghiệp vụ với ứng dụng. Agent tuân theo cùng cơ chế phân quyền như con người. Khi cần quyết định, agent chuyển công việc cùng bằng chứng cho người chịu trách nhiệm. Mỗi ứng dụng Solution có sẵn agent nghiệp vụ. Có thể bổ sung agent vào ứng dụng riêng khi cần.

<a id="full-control"></a>

## Toàn quyền kiểm soát

<a id="self-hosting-and-independent-operation"></a>

### Tự lưu trữ và vận hành độc lập

Core, Solution và Studio đều chạy trên máy chủ của tổ chức. Mã và dữ liệu thuộc về tổ chức. Sau khi phát hành, ứng dụng nghiệp vụ chạy độc lập và xử lý yêu cầu hằng ngày trực tiếp.

<a id="choose-your-models-and-agents"></a>

### Tự chọn mô hình và agent

Đội ngũ tự chọn mô hình và agent, có thể dùng Claude Code, Codex hoặc công cụ lập trình khác cùng nhiều mô hình.

<a id="get-started"></a>

## Bắt đầu

- Tự xây dựng ứng dụng với [Phát triển ứng dụng đầu tiên](develop-your-first-app.md).
- Trải nghiệm bàn giao theo nhóm cùng agent với [Cộng tác bằng Studio](collaborate-with-studio.md).
- Nếu đã dùng NocoBase 2, xem [NocoBase 2 và NocoBase 3](../faq/from-v2.md).
