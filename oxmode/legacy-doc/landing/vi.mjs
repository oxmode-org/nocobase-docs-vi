// OXMODE edition: the Vietnamese home page as a landing page (full width, no menu), in the style of the
// earlier NocoBase 3 docs home. Every fact comes from the website-v3 doc/ pages it links to:
// core/getting-started/create-app, core/tutorials/build-your-first-feature,
// core/developing-apps/develop-with-an-agent, core/reference/plugins and the docs home (index.md).
// `docHtml` is the rendered index.md (Start here, Architecture, About), placed after the landing sections.

const GH = 'https://github.com/nocobase/nocobase/tree/db419f1d4828a88236860f2e69a9442e2f2c5f9c/packages/plugins';

const capabilities = [
  { icon: 'key-round', title: 'Xác thực', text: 'Đăng nhập, phiên và tích hợp xác thực; request API được xác thực bằng API key.', pkgs: ['authentication', 'api-keys'], page: 'core/developing-apps/apis-and-services' },
  { icon: 'shield-check', title: 'Phân quyền', text: 'Khai báo quyền nghiệp vụ, phạm vi truy cập dữ liệu mặc định, quy tắc chia sẻ và quy tắc giới hạn, áp dụng cho cả trang lẫn API.', pkgs: ['authorization', 'authz-default-access', 'authz-sharing-rules', 'authz-restriction-rules'], page: 'core/developing-apps/overview', hash: 'phân-quyền-áp-dụng-xuyên-suốt-đường-đi' },
  { icon: 'database', title: 'Dữ liệu và cơ sở dữ liệu', text: 'Collection, field, quan hệ và migration; tám dialect gồm SQLite, PostgreSQL, MySQL, SQL Server, Oracle; xem kết nối và field trong một trình duyệt.', pkgs: ['database-explorer'], page: 'core/developing-apps/data-models-and-migrations' },
  { icon: 'users', title: 'Người dùng', text: 'API và trang quản trị người dùng cho ứng dụng.', pkgs: ['users'], page: 'core/reference/plugins' },
  { icon: 'paperclip', title: 'Tệp', text: 'Kho tệp, API tải lên và nội dung, cùng các component tệp thuộc ứng dụng.', pkgs: ['file'], page: 'core/reference/plugins' },
  { icon: 'bell', title: 'Thông báo', text: 'Lưu trữ thông báo, runtime gửi và log; kênh trong ứng dụng, các nhà cung cấp có sẵn và thông báo đẩy của trình duyệt.', pkgs: ['notification', 'notification-in-app', 'notification-providers', 'notification-web-push'], page: 'core/reference/plugins' },
  { icon: 'mail', title: 'Email', text: 'Gửi thư, đồng bộ hộp thư có thể tiếp tục và mở rộng nhà cung cấp.', pkgs: ['mail'], page: 'core/reference/plugins' },
  { icon: 'calendar-clock', title: 'Tác vụ định kỳ', text: 'Khai báo lịch chạy trong mã, kèm bản ghi thực thi và API bật/tắt.', pkgs: ['scheduler'], page: 'core/reference/plugins' },
  { icon: 'printer', title: 'In theo mẫu', text: 'Agent Skill để triển khai in theo mẫu DOCX và PDF.', pkgs: ['template-print'], page: 'core/reference/plugins' },
  { icon: 'languages', title: 'Đa ngôn ngữ và theme', text: 'Tích hợp đa ngôn ngữ, chuyển ngôn ngữ ứng dụng và tùy chỉnh giao diện bằng theme token.', pkgs: ['i18n'], page: 'core/developing-apps/localization-and-themes' },
  { icon: 'bot', title: 'Agent trong ứng dụng', text: 'Quản lý Agent, dịch vụ model, lượt chạy, hội thoại và runner; kết nối coding agent cục bộ và hội thoại trên trình duyệt.', pkgs: ['agents', 'agent-sessions'], page: 'core/reference/plugins' },
  { icon: 'book-open', title: 'Cơ sở tri thức', text: 'Quản lý không gian Markdown, phiên bản, tìm kiếm, đề xuất và duyệt.', pkgs: ['knowledge'], page: 'core/reference/plugins' },
  { icon: 'badge-check', title: 'Phê duyệt', text: 'Gắn các tác vụ phê duyệt của con người với vòng đời bản ghi, kèm chính sách và kết quả.', pkgs: ['approval'], commercial: true, page: 'core/reference/plugins', hash: 'plugin-trong-repository-thương-mại' },
  { icon: 'list-checks', title: 'Trung tâm công việc', text: 'Lập chỉ mục tác vụ cá nhân từ nhiều nguồn nghiệp vụ, kèm API truy vấn và giao diện tái sử dụng được.', pkgs: ['task-center'], commercial: true, page: 'core/reference/plugins', hash: 'plugin-trong-repository-thương-mại' },
  { icon: 'layout-template', title: 'UI component và trang', text: 'Trang, route, điều hướng và các component sẵn có để xây giao diện nghiệp vụ cùng Agent.', pkgs: [], page: 'core/developing-apps/pages-and-interactions' },
];

const conversation = [
  { label: 'Mô tả nghiệp vụ', text: 'Hãy xây cho tôi một ứng dụng quản lý công việc nhóm, nơi chúng tôi có thể giao việc cho người, đặt hạn hoàn thành và theo dõi tiến độ. Chạy nó lên để tôi dùng thử.' },
  { label: 'Dùng thử và tinh chỉnh', text: 'Khi tôi bấm vào tiêu đề thì mở chi tiết công việc, rồi cho tôi chọn có sửa hay không.' },
  { label: 'Thêm tính năng', text: 'Hãy thêm người được giao vào ứng dụng công việc hiện có. Hiển thị người được giao trong danh sách công việc, hoặc “Chưa giao” khi không có ai.' },
  { label: 'Kiểm chứng phân quyền', text: 'Thành viên chỉ đọc phải không tạo được công việc qua cả trang lẫn API. Hãy kiểm tra phân quyền phía server, sửa lỗi, và kiểm chứng bằng chính tài khoản thông thường đó.' },
];

export function landingVi({ href, escape, copyButton, docHtml }) {
  const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  const codeBox = (kind, label, code, wrap) => `<div class="code-block lp-box lp-${kind}${wrap ? ' wrap' : ''}"><div class="code-toolbar"><span class="lp-box-label">${icon(kind === 'term' ? 'terminal' : 'message-square-text')}${escape(label)}</span>${copyButton(kind === 'term' ? 'Sao chép' : 'Sao chép prompt')}</div><pre tabindex="0"><code>${escape(code)}</code></pre></div>`;
  const card = (c) => `<article class="lp-cap" data-search="${escape(`${c.title} ${c.text} ${c.pkgs.join(' ')}`.toLowerCase())}">
<span class="lp-cap-icon">${icon(c.icon)}</span><h3>${escape(c.title)}</h3><p>${escape(c.text)}</p>
${c.pkgs.length ? `<p class="lp-pkgs">${c.pkgs.map((p) => c.commercial ? `<code>${escape(p)}</code>` : `<a href="${GH}/app-plugin-${p}" target="_blank" rel="noopener"><code>${escape(p)}</code></a>`).join('')}</p>` : ''}
<footer><span class="tag ${c.commercial ? 'pro' : 'ok'}">${c.commercial ? 'Bản thương mại' : c.pkgs.length ? 'Tích hợp sẵn' : 'Core'}</span><a href="${href(c.page, c.hash)}">Tài liệu ${icon('arrow-right')}</a></footer></article>`;

  return `<div class="lp">
<section class="lp-frame" aria-labelledby="lp-title">
<div class="lp-quick">
<header class="lp-quickhead">
<div><p class="lp-eyebrow"><span>NocoBase 3</span><span>Bắt đầu nhanh</span></p>
<h1 id="lp-title">Khởi động ứng dụng của bạn bằng một cuộc hội thoại.</h1>
<p class="lp-lede">Cài Skill, rồi để coding agent tạo, cấu hình và khởi động một ứng dụng NocoBase 3 cục bộ. Sau đó tiếp tục xây tính năng trong cùng cuộc hội thoại.</p>
<p class="lp-links"><a href="${href('start/from-v2')}">So sánh NocoBase 2 và 3 ${icon('arrow-right')}</a><a href="${href('core/getting-started/create-app')}">Hướng dẫn tạo ứng dụng ${icon('arrow-right')}</a></p></div>
<ul class="lp-req" aria-label="Điều kiện cần">
<li><span>Môi trường cục bộ</span><b>Node.js 24+ · pnpm 11</b></li>
<li><span>Coding agent</span><b>Có hỗ trợ Skill, chẳng hạn Claude Code hoặc Codex</b></li>
<li><span>Windows</span><b>Dùng WSL</b></li>
</ul>
</header>
<div class="lp-steps">
<div class="lp-step">
<h2 class="lp-stephead"><span class="lp-num">01</span>Cài Skill</h2>
<p>Chạy trong terminal cục bộ để Agent của bạn biết cách tạo ứng dụng NocoBase 3.</p>
${codeBox('term', 'Terminal cục bộ', 'npx skills@latest add nocobase/skills-v3 --skill nocobase-create-app -g')}
<p class="lp-note">Chọn Agent của bạn khi được hỏi, rồi <b>mở một phiên mới</b> để nó nạp Skill.</p>
<details class="lp-more"><summary>Những gì được cài đặt? Cập nhật thế nào?</summary>
<p><code>nocobase/skills-v3</code> cung cấp các Skill cho NocoBase 3. Lệnh trên cài Skill toàn cục <code>nocobase-create-app</code>, dùng để tạo ứng dụng.</p>
<p>Ứng dụng được tạo mang theo <code>AGENTS.md</code> và <code>.agents/skills/</code> khớp với phiên bản đã cài. Nếu thiếu Skill trong ứng dụng, chạy <code>pnpm nocobase skills sync</code> trong thư mục ứng dụng rồi mở phiên Agent mới.</p></details>
</div>
<div class="lp-step">
<h2 class="lp-stephead"><span class="lp-num">02</span>Tạo và khởi động ứng dụng</h2>
<p>Mở Agent trong một thư mục trống, ví dụ <code>mkdir my-app &amp;&amp; cd my-app</code>, rồi gửi:</p>
${codeBox('prompt', 'Gửi cho Agent của bạn', 'Hãy tạo một ứng dụng NocoBase 3 để phát triển cục bộ trong thư mục trống này.\nDùng template mặc định và SQLite, theo hướng dẫn tạo ứng dụng.\nHoàn tất cài đặt và kiểm tra, khởi động ứng dụng, rồi cho tôi biết cần mở URL nào và đăng nhập lần đầu thế nào.', true)}
<p class="lp-note">Agent gọi công cụ tạo ứng dụng, cài dependency, khởi tạo cấu hình và khởi động ứng dụng, rồi đưa bạn URL và thông tin đăng nhập. Mặc định cục bộ là <code>nocobase</code> / <code>admin123</code>; hãy đổi mật khẩu sau lần đăng nhập đầu.</p>
<details class="lp-more"><summary>Không dùng Agent?</summary>
<p>Từ thư mục cha nơi bạn để các dự án, chạy lệnh sau, rồi làm tiếp theo <a href="${href('core/getting-started/create-app', 'không-dùng-agent')}">Tạo ứng dụng › Không dùng Agent</a>:</p>
${codeBox('term', 'Terminal cục bộ', 'PNPM_CONFIG_MINIMUM_RELEASE_AGE=0 pnpm create @nocobase/app@beta my-app --template-tag=beta')}</details>
</div>
</div>
</div>
</section>

<section class="lp-frame lp-dev" aria-labelledby="lp-dev">
<div class="lp-devgrid">
<div class="lp-devtext">
<p class="lp-eyebrow lp-eyebrow-icon">${icon('sparkles')}<span>Phát triển cùng Agent</span></p>
<h2 id="lp-dev" class="lp-h2">Từ yêu cầu đầu tiên đến tính năng nghiệp vụ chạy được</h2>
<p class="lp-lede">Mở Agent trong thư mục ứng dụng và giải thích người dùng cần làm được gì, các ràng buộc nghiệp vụ và cách bạn đánh giá là đã xong. Agent làm theo <code>AGENTS.md</code> và các Skill của dự án để xây schema, API, trang, phân quyền và các kiểm tra.</p>
<ol class="lp-mini">
<li><b>Mô tả bằng ngôn ngữ nghiệp vụ</b><span>Bạn không cần biết API nội bộ nào trước khi mô tả yêu cầu.</span></li>
<li><b>Dùng thử và tinh chỉnh</b><span>Tạo một bản ghi, thay đổi nó, tải lại trang, rồi mô tả các tinh chỉnh một cách tự nhiên.</span></li>
<li><b>Chia nhỏ và kiểm chứng</b><span>Chia yêu cầu lớn thành các thay đổi kiểm chứng được, review phần hiện thực và kiểm chứng kết quả thực tế.</span></li>
</ol>
<p class="lp-links"><a href="${href('core/tutorials/build-your-first-feature')}">Xây ứng dụng đầu tiên ${icon('arrow-right')}</a><a href="${href('core/developing-apps/develop-with-an-agent')}">Phát triển cùng Agent ${icon('arrow-right')}</a></p>
</div>
<div class="lp-chat">
<div class="lp-chathead"><b>Một cuộc hội thoại liên tục với Agent</b><span>Ứng dụng công việc nhóm trong tutorial</span></div>
<ol>${conversation.map((m, i) => `<li><span class="lp-num">${String(i + 1).padStart(2, '0')}</span><div><small>${escape(m.label)}</small><p>${escape(m.text)}</p></div></li>`).join('')}</ol>
<p class="lp-chatfoot">Cùng một yêu cầu có thể cho ra layout và mã khác nhau; chi tiết hiện thực không cần trở thành một prompt dài.</p>
</div>
</div>
<p class="lp-deploy">${icon('rocket')}<span>Khi ứng dụng đã được xây và qua test, hãy triển khai cho nhóm của bạn bằng Docker, app-installer hoặc NocoBase Studio.</span><a href="${href('core/deployment/choose-a-deployment-method')}">Xem hướng dẫn triển khai ${icon('arrow-right')}</a></p>
</section>

<section class="lp-caps" aria-labelledby="lp-caps">
<div class="lp-capshead"><div><p class="lp-eyebrow"><span>Năng lực ứng dụng</span><span>Dùng khi cần</span></p>
<h2 id="lp-caps" class="lp-h2">Nền tảng đã sẵn sàng. Hãy tập trung vào nghiệp vụ của bạn.</h2>
<p class="lp-lede">Dữ liệu, phân quyền, workflow và phê duyệt, tệp, thông báo, tích hợp AI và nhiều thứ khác đã sẵn sàng, nên Agent chỉ cần xây phần logic nghiệp vụ. Danh sách đầy đủ ở <a href="${href('core/reference/plugins')}">Tổng quan plugin</a>.</p></div>
<label class="lp-filter">${icon('search')}<input type="search" placeholder="Lọc năng lực…" aria-label="Lọc năng lực ứng dụng" autocomplete="off"></label></div>
<div class="lp-capgrid">${capabilities.map(card).join('')}</div>
<p class="lp-empty" hidden>Không có năng lực nào khớp. Thử <a href="${href('core/reference/plugins')}">Tổng quan plugin</a>.</p>
</section>

<section class="lp-doc" aria-labelledby="lp-doc">
<div class="lp-dochead"><p class="lp-eyebrow"><span>Tài liệu NocoBase 3</span><span>Bản tiếng Việt</span></p>
<h2 id="lp-doc" class="lp-h2">Tìm đúng phần tài liệu</h2>
<p class="lp-lede">NocoBase là nền tảng mã nguồn mở để xây dựng, vận hành và phát triển hệ thống nghiệp vụ cùng AI. Agent viết mã nghiệp vụ, NocoBase cung cấp nền tảng và cơ chế quản trị, còn con người đặt mục tiêu và đưa ra quyết định.</p></div>
<div class="prose lp-prose">
${docHtml}
</div>
</section>

<footer class="lp-foot"><span>NocoBase 3 · Tài liệu tiếng Việt, do OXMODE biên dịch</span><span>Mã nguồn mở · Tự host · Tự chọn model và Agent</span></footer>
</div>`;
}
