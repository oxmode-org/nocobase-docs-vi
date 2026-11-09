---
title: Agent
description: Tích hợp chat AI, Skill nghiệp vụ và coding agent trên máy, kèm hướng dẫn cấu hình và kiểm chứng.
---

`@nocobase/app-plugin-agents` cung cấp chat AI, cấu hình mô hình, Skill nghiệp vụ và Agent chạy trên máy. Có thể đặt chat cạnh trang nghiệp vụ, dùng quy tắc viết của nhóm hoặc kết nối công cụ lập trình để thực thi tác vụ.

## Năng lực

| Năng lực | Plugin cung cấp | Ứng dụng cần làm |
| --- | --- | --- |
| Dịch vụ mô hình | Cấu hình dịch vụ, danh sách mô hình và kiểm tra kết nối | Thêm trang **Models** và cấu hình dịch vụ cùng khóa |
| Chat AI | Phản hồi theo luồng, dừng sinh và lịch sử hội thoại | Ghép giao diện bằng component chat |
| Skill nghiệp vụ | Hướng dẫn, tệp kèm theo, nhập và phiên bản | Duy trì quy tắc trong Skill rồi chọn cho hội thoại hoặc tác vụ |
| Công cụ nghiệp vụ | Đăng ký và chạy công cụ | Tích hợp công cụ hoặc lệnh CLI nghiệp vụ và kiểm tra quyền |
| Agent trên máy | Kết nối máy, chọn công cụ và mô hình, trạng thái thực thi | Thêm trang **Runtimes**, **Machine agents** và điểm gửi tác vụ |
| Quản lý mức sử dụng | Trang mức sử dụng và giá | Thêm **Usage** vào điều hướng |

Plugin cung cấp trang và component. Ứng dụng đặt menu, ghép chat và kiểm soát dữ liệu có thể truy cập. Sau khi đăng ký plugin, nối các giao diện cần dùng vào ứng dụng.

### Hai cách kết nối Agent

| | API mô hình | Agent trên máy |
| --- | --- | --- |
| Tác vụ điển hình | Chat, soạn nội dung và thao tác nghiệp vụ qua công cụ | Đọc và sửa mã, chạy build và kiểm thử |
| Điều kiện | Endpoint dịch vụ, khóa và mô hình | Công cụ lập trình đã cài và đăng nhập, cùng kết nối Runner |
| Thực thi | NocoBase gọi mô hình và chạy công cụ đã chọn | Công cụ lập trình chạy trên máy đã kết nối |
| Tài nguyên truy cập | Skill đã chọn, tệp ảo và công cụ nghiệp vụ đã tích hợp | Dự án, tệp và lệnh được policy của máy và công cụ cho phép |

Có thể dùng cả hai cách. Hai kịch bản đầu dùng API mô hình. Kịch bản thứ ba kết nối máy. Hội thoại qua API mô hình dùng tài nguyên ảo và công cụ đã tích hợp. Để đọc mã nguồn của host hoặc chạy kiểm thử dự án, dùng môi trường thực thi phù hợp.

## Tình huống và ví dụ

Bắt đầu bằng [Tạo ứng dụng](../../../getting-started/develop-your-first-app.md#create-and-start-the-application) hoặc chạy [ví dụ đầy đủ](https://github.com/nocobase/docs-examples-v3/tree/b91adc8bcd89a238c84f9e62026f250b4833615a/apps/agents-guide). Giữ cấu hình cơ sở dữ liệu đang dùng. Ví dụ dùng dịch vụ DeepSeek và giao diện tiếng Anh. Chạy lệnh ví dụ từ `apps/agents-guide`.

Gửi **prompt phát triển** cho Coding Agent trong dự án. Nhập **prompt hội thoại** vào chat trong ứng dụng. Các prompt dưới đây được rút gọn để dễ đọc. Ảnh chụp thuộc hội thoại gốc đã kiểm chứng. Xem phạm vi ở cuối bài.

### Kịch bản 1. Thêm hội thoại AI

```prompt
Thêm bảng chat AI ở cạnh phải, mở bằng nút ở đầu trang. Cho phép chọn mô hình,
gửi tin, dừng phản hồi và tiếp tục hội thoại sau. Mỗi người chỉ thấy chat của mình.
```

Sau khi tích hợp trang, thêm dịch vụ tại **Models → Add service**.

| Trường | Giá trị ví dụ |
| --- | --- |
| Provider type | `DeepSeek` |
| Name | `DeepSeek` |
| Base URL | `https://api.deepseek.com/v1` |
| API key | Khóa của bạn, chỉ nhập vào trường thông tin xác thực |
| Model ID | `deepseek-flash`, do dịch vụ trả về trong lần kiểm chứng gốc |
| Model kind | `chat` |
| Enabled | Bật |

Bấm **Fetch models** và chọn mô hình `chat` khả dụng với tài khoản. `embedding` và `rerank` phục vụ tác vụ khác. Chạy **Test connection** rồi lưu khi đạt. Khi mở lại dịch vụ, để trống trường khóa để giữ khóa đã lưu. Xem [Tài liệu DeepSeek](https://api-docs.deepseek.com/en/).

![Cấu hình DeepSeek và kết quả kiểm tra kết nối](/assets/core/agents/model-configuration.png)

![Dịch vụ mô hình đã lưu và bật](/assets/core/agents/models.png)

Bấm **Agent chat** ở đầu trang, chọn mô hình rồi thử:

```prompt
Viết một câu giới thiệu tính năng chat với AI trong ứng dụng và tiếp tục
hội thoại khi quay lại.
```

![Chat cạnh trang nghiệp vụ với phản hồi của mô hình](/assets/core/agents/chat.png)

**Xong khi** nhận được phản hồi và đọc lại được lịch sử khi mở hội thoại từ **Conversations**.

Hội thoại qua API mô hình dùng dịch vụ cấu hình trong **Models**. Để truy vấn đơn hàng hoặc xử lý phê duyệt, tích hợp công cụ nghiệp vụ và phân quyền tương ứng.

### Kịch bản 2. Soạn ghi chú phát hành bằng Skill nghiệp vụ

Lưu quy tắc viết của nhóm thành Skill nghiệp vụ để dùng lại trong hội thoại chuyên biệt.

```prompt
Thêm nút “Draft release notes”. Dùng mẫu của nhóm để soạn bản nháp từ thay đổi
và kết quả kiểm thử tôi cung cấp. Giữ phần thiếu ở trạng thái chưa xác nhận
và để tôi duyệt bản nháp.
```

Skill `release-notes` đọc hướng dẫn văn phong rồi tạo các mục **Summary**, **Changes** và **Verification**. Khi thiếu kết quả kiểm thử, nó ghi `Verification not provided`. Tác vụ chỉ soạn nội dung.

1. [Tải Skill ví dụ](/assets/core/downloads/release-notes-skill.zip), nhập qua **Skills → Import** và xác nhận slug `release-notes`.
2. Xem `SKILL.md` và tệp kèm theo `references/style.md`.
3. Bấm biểu tượng tệp **Draft release notes** ở đầu trang để mở hội thoại dùng Skill.

![Quy tắc ghi chú phát hành và tệp kèm theo](/assets/core/agents/skill.png)

Điểm vào chọn mô hình `chat` đầu tiên của các dịch vụ đã bật. Có thể đổi trước khi gửi. Mỗi lần bấm tạo hội thoại mới. Dùng **Conversations** để tiếp tục bản nháp đã có. Nút **Agent chat** thông thường mở hội thoại với lựa chọn mặc định riêng.

```prompt
Viết ghi chú phát hành tiếng Anh theo quy tắc của nhóm. Đợt này thêm cấu hình
mô hình và bảng chat, sửa lỗi thiếu mục Skills và có 17 bài kiểm thử liên quan đạt.
```

Thay thay đổi và số liệu minh họa bằng kết quả thật của dự án. Đọc báo cáo kiểm thử thực tế để xác nhận số liệu dùng trong bản nháp.

![Bản nháp sau khi đọc Skill](/assets/core/agents/skill-chat.png)

**Xong khi** bản nháp đúng mẫu, chỉ dùng dữ kiện đã cấp, và bản ghi công cụ xác nhận đã đọc Skill cùng tệp kèm theo.

Nếu không mở được, kiểm tra mô hình khả dụng, slug Skill và đăng ký Provider phía server. Phản hồi lỗi và thử lại nằm trong `client/components/release-notes-button.tsx`.

### Kịch bản 3. Gọi công cụ lập trình trên máy

Kết nối công cụ trên máy tính hoặc server để gửi tác vụ và xem tiến độ, kết quả từ ứng dụng.

```prompt
Kết nối công cụ lập trình trên máy của tôi để tôi có thể chọn Agent khả dụng,
gửi tác vụ và xem tiến độ cùng kết quả từ ứng dụng.
```

**Chuẩn bị gói phân phối.** Ví dụ đã khai báo dependency và cấu hình cho CLI ứng dụng cùng Runner. Chạy từ thư mục ví dụ.

```bash
pnpm nocobase cli build --universal
pnpm nocobase cli build --runner --universal
```

Các lệnh cần truy cập npm. Máy đích cần Node.js 24. Gói được ghi vào `storage/runners/dist`. Khởi động lại ứng dụng sau thiết lập ban đầu. Build production là bước riêng.

<details>
<summary>Chuẩn bị CLI và Runner trong ứng dụng của bạn</summary>

Để bổ sung CLI ứng dụng và gói Runner có thể tải cho template Default:

- Cài phiên bản tương thích của `@nocobase/app-cli-client` và `@nocobase/agent-runner`.
- Khai báo `nocobase.cli.bin` trong `package.json`. Ví dụ dùng `agents-guide`.
- Định nghĩa `cli.name: 'agents-guide'` và `cli.package: { kind: 'served' }` trong `server/config/agents.ts`, rồi đăng ký trong `server/config/index.ts`. Tên CLI phải khớp gói.

Khi thiếu gói Runner, bước cài từ trang kết nối trả 404. Khi thiếu CLI ứng dụng, tác vụ có thể lỗi `cliUnavailable` kể cả lúc máy online. Đăng ký phần cấu hình trước khi đặt `agents.cli.name` để tránh `UNKNOWN_KEY`.

</details>

**Kết nối máy.**

1. Cài và đăng nhập công cụ lập trình trên máy đích. Xác nhận công cụ tự chạy được.
2. Tạo kết nối cá nhân hoặc dùng chung trong **Runtimes** rồi chọn công cụ được phép.
3. Làm theo hướng dẫn cài và đăng ký Runner. Đợi báo cáo công cụ, đăng nhập và mô hình.
4. Thêm và bật tổ hợp công cụ cùng mô hình khả dụng trong **Machine agents**. Kiểm tra trạng thái bật của Agent riêng với trạng thái online của máy.
5. Mở **Agent chat → Switch to runner agents** rồi chọn Agent.

![Chọn mục đích kết nối và công cụ lập trình](/assets/core/agents/runner-connection.png)

![Runner cá nhân đã kết nối và nhận diện Codex](/assets/core/agents/runner-online.png)

Agent trên máy dùng thông tin xác thực mô hình của công cụ lập trình, riêng với khóa trong **Models**. Nếu tác vụ không khởi động, kiểm tra đăng nhập công cụ, mô hình, trạng thái bật, số chỗ thực thi và policy cục bộ.

```prompt
Cho tôi biết thư mục làm việc hiện tại và những tệp có trong đó. Chỉ kiểm tra ở chế độ đọc.
```

![Lệnh và kết quả thật của Agent trên máy](/assets/core/agents/runner-chat.png)

**Xong khi** bản ghi có lệnh đã chạy, thư mục làm việc và đầu ra, cùng trạng thái `completed`.

Hội thoại Runner thông thường dùng workspace riêng. Với dự án nghiệp vụ, ứng dụng cung cấp thư mục được server cho phép. Xác định đường dẫn ở server để tránh dùng đường dẫn host tùy ý từ chat. Sau khi tích hợp, thử tác vụ nhỏ:

```prompt
Thêm tooltip tiếng Anh và tiếng Trung cho nút chat của dự án này.
Giữ hành vi hiện có của nút.
```

Với tác vụ dự án, rà diff và kết quả kiểm tra. Ví dụ này chỉ kiểm chứng thao tác đọc trong workspace hội thoại. Việc sửa dự án và build cần kiểm chứng riêng.

## Nguyên tắc và triển khai

### Tệp tương ứng với giao diện

| Tệp hoặc thư mục | Công dụng |
| --- | --- |
| `client/plugins.ts`, `server/plugins.ts`, `cli/plugins.ts` | Đăng ký ba đóng góp của plugin |
| `client/routes.ts` | Ghép trang quản lý và giữ trang chủ, đăng nhập, cài đặt hệ thống |
| `client/extensions/nocobase-agent-chat/` | Mã nguồn giao diện chat cài từ Registry |
| `client/components/agents-provider.tsx` | Quản lý trạng thái chat của tài khoản hiện tại |
| `client/layouts/app-layout.tsx`, `client/layouts/components/header-actions.tsx` | Gắn bảng chat và các điểm mở |
| `client/components/release-notes-button.tsx` | Tạo hội thoại ghi chú phát hành và xử lý bấm lặp, thử lại, đổi tài khoản |
| `server/providers/agents.ts`, `server/providers/index.ts` | Đăng ký cấu hình hội thoại ghi chú phát hành |
| `examples/release-notes/` | Skill nghiệp vụ và tệp kèm theo |
| `package.json`, `server/config/agents.ts`, `server/config/index.ts` | Cấu hình tên và phân phối CLI ứng dụng |
| `client/locales/`, `client/pages/settings/page-permission-titles.ts` | Nội dung tiếng Anh, tiếng Trung và nhãn quyền |
| `tests/client/` | Kiểm thử trang, locale, nhãn quyền và điểm vào nghiệp vụ |

Thiết lập mô hình, Skill đã nhập và lịch sử chat là dữ liệu runtime. Cấu hình mô hình và nhập Skill sau khi chạy ví dụ.

### Đăng ký plugin và trang quản lý

Template Default của ví dụ đã có dependency Agents. Chạy các lệnh sau để đăng ký, rồi xem trước và áp dụng thay đổi cơ sở dữ liệu.

```bash
pnpm nocobase plugin register agents --dry-run --json
pnpm nocobase plugin register agents --json
pnpm nocobase db apply --dry-run --json
pnpm nocobase db apply --json
```

Đăng ký cập nhật ba danh sách plugin. Các lệnh cơ sở dữ liệu áp dụng migration và Seed. Xem [Quản lý plugin](../../developing-apps/manage-plugins.md).

Ghép trang quản lý trong `client/routes.ts`.

| Điểm xuất | Đường dẫn mặc định | Công dụng |
| --- | --- | --- |
| `modelsRoute` | `/models` | Dịch vụ mô hình và kiểm tra kết nối |
| `agentsRoute` | `/agents` | Tổ hợp công cụ lập trình và mô hình trên máy |
| `runtimesRoute` | `/runtimes` | Kết nối máy |
| `skillsRoute` | `/skills` | Skill nghiệp vụ và phiên bản |
| `usageRoute` | `/usage` | Mức sử dụng và giá |

Ví dụ thêm nhãn và biểu tượng vào Models.

```ts
import { BrainCircuit } from 'lucide-react';
import { modelsRoute } from '@nocobase/app-plugin-agents/client/routes';

// Use this entry inside the application's existing defineAppRoutes contribution.
const modelsPage = {
  ...modelsRoute,
  navigation: { title: 'agentDemo.models', icon: BrainCircuit },
};
```

Dùng spread `modelsRoute` để giữ component, yêu cầu đăng nhập, phân quyền và route con. Ghép các trang còn lại tương tự, rồi xuất cùng `appRoutes` gốc. Runtime tự thêm tiền tố triển khai như `/main`. Nếu thiếu menu, kiểm tra đăng ký route và quyền người dùng. Models dùng quyền `settings:agents.services`.

### Component chat và trạng thái tài khoản

Ví dụ cài UI chat qua Registry.

```bash
pnpm exec shadcn add @nocobase/agent-chat
```

> [!NOTE]
> Rà thay đổi dependency sau khi cài. Trong ví dụ, Registry hạ Agents xuống `0.1.0-beta.14`. Nhóm phải đưa về `1.0.0-beta.29` tương thích template rồi đồng bộ Skill. Các lệnh sau áp dụng cho ví dụ. Kiểm tra phiên bản của template bạn dùng.

```bash
pnpm add @nocobase/app-plugin-agents@1.0.0-beta.29 --save-exact
pnpm nocobase skills sync --dry-run --json
pnpm nocobase skills sync --json
```

`client/chat` cung cấp trạng thái hội thoại và hook. Component Registry hiển thị chúng. Đoạn sau chỉ minh họa phần bố cục liên quan.

```tsx
<AgentsProvider>
  {/* Preserve the application's existing layout and route providers. */}
  <header><ChatHeaderButton /></header>
  <div className="relative flex min-h-0 flex-1">
    <main className="relative min-w-0 flex-1 overflow-hidden">
      <Outlet />
    </main>
    <ChatPanel />
  </div>
  <ChatFloatingButton />
</AgentsProvider>
```

`ChatPanel` nằm cạnh `main`. Nút đầu trang và nút trên di động dùng chung trạng thái hội thoại.

`AgentsProvider` của ví dụ bọc `ChatProvider` của plugin. Nó dùng ID người đã đăng nhập làm React `key` và `memoryScope`. Khi đổi danh tính, nó xóa cache truy vấn và trạng thái bảng chat. Server vẫn kiểm tra chủ sở hữu hội thoại và quyền truy cập.

### Chọn Skill cho hội thoại nghiệp vụ

Skill trong `.agents/skills/` hướng dẫn công cụ lập trình tích hợp plugin. Skill nghiệp vụ trong **Skills** của ứng dụng hướng dẫn tác vụ runtime. Hai nhóm được quản lý riêng.

Skill ghi chú phát hành gồm `SKILL.md` và `references/style.md`. Sau khi nhập, `server/providers/agents.ts` chọn Skill qua phạm vi có tên. `server/providers/index.ts` nạp Provider.

```ts
const agents = this.app.container.resolve(agentsToken);
agents.onlineAgent.configurator.registerOnlineAgentScope(
  'release-notes',
  async () => {
    const skill = (await agents.skills.list()).find(
      (item) => item.slug === 'release-notes',
    );
    if (!skill)
      throw new Error('Create the release-notes Skill before using this scope.');
    return {
      agentId: 'online',
      tool: ['bash', 'skill'],
      skill: [skill.id],
      systemPromptTemplate:
        'Help write release notes from the supplied facts. Use the release-notes Skill and its supporting style guide when the user requests release notes. Never claim an unperformed check succeeded.',
    };
  },
);
```

`agentsToken` là điểm vào dịch vụ công khai. Server chọn một Skill theo slug và các công cụ `skill`, `bash` cần để đọc nó. `systemPromptTemplate` thêm quy tắc ghi chú phát hành. Kiểm tra quyền nghiệp vụ riêng với phạm vi năng lực.

`ReleaseNotesButton` dùng API Client đã xác thực để gửi body sau tới `POST /api/agents/conversations`.

```json
{
  "agentId": "online",
  "title": "Draft release notes",
  "config": { "scope": ["release-notes"] },
  "selectedModel": { "modelService": "deepseek", "model": "deepseek-flash" }
}
```

Sau khi tạo, nút gọi `panel.openChat({ conversationId })`. `modelService` định danh dịch vụ và `model` phải được bật trong dịch vụ đó. Để chọn Skill cho hội thoại này, đặt phạm vi `release-notes`.

**Global attachment** trên trang Skills ghép Skill vào tác vụ Runner tiếp theo. Với hội thoại API mô hình, chọn Skill bằng phạm vi phía server như trên.

### Thực thi và truy cập công cụ

`agentId: 'online'` chọn backend API mô hình `native`. Tác vụ trên máy dùng ID Agent cụ thể và backend `runner`. Cả hai dùng dịch vụ hội thoại `agentsToken.onlineAgent`. Backend mô hình còn hỗ trợ chạy nền có cấu trúc theo JSON Schema. Runner dùng hàng đợi tác vụ riêng.

Shell ảo của backend mô hình đọc `/skills` và ghi `/tmp`. Để truy cập hệ thống tệp host hoặc chạy Node, Python, build hay kiểm thử dự án, dùng môi trường thực thi có quyền phù hợp. Thao tác nghiệp vụ cần công cụ đã đăng ký hoặc lệnh CLI được phép, cùng kiểm tra danh tính, đầu vào và quyền dữ liệu phía server. Thêm [Cơ sở tri thức](knowledge.md) khi tác vụ cần truy xuất tài liệu.

## Ràng buộc phát triển với AI và kiểm chứng

### Kiểm tra khi tích hợp

Coding Agent đọc `.agents/skills/nocobase-app-plugin-agents/SKILL.md` và tham chiếu liên quan. Sau khi cài hoặc nâng cấp, chạy `pnpm nocobase skills sync` rồi kiểm tra điểm xuất công khai và kiểu. Nếu hướng dẫn lệch với phần triển khai, xác minh giao diện trước khi dùng.

| Kiểm tra | Hành vi cần xác nhận |
| --- | --- |
| Phân quyền trang | Route giữ phân quyền và API trực tiếp cũng từ chối người thiếu quyền |
| Đổi tài khoản | Chat, cache và yêu cầu đang chờ của tài khoản trước được cách ly |
| Skill nghiệp vụ | Hội thoại chọn đúng Skill, bản ghi công cụ xác nhận đã đọc hướng dẫn và tệp kèm theo |
| Công cụ mới | Server kiểm tra danh tính, đầu vào, quyền thao tác và quyền dữ liệu |
| Tác vụ trên máy | Máy và thư mục được phép là đúng. Đầu ra lệnh, diff và kết quả thuộc đúng tác vụ |

Quyền Runner phụ thuộc policy của máy và công cụ lập trình. Nếu cần cách ly hệ thống tệp, cấu hình ở môi trường thực thi. Duy trì kiểm tra quyền trong mã và kiểm chứng runtime ngay cả khi prompt và Skill đã mô tả giới hạn.

### Kiểm tra tích hợp

```prompt
Kiểm tra chat có nhận phản hồi và giữ lịch sử khi mở lại. Đổi tài khoản rồi
xác minh tài khoản mới chỉ thấy hội thoại của mình.
```

Nếu đã thêm Skill nghiệp vụ hoặc tác vụ trên máy, kiểm tra các mục tương ứng. Đối chiếu trạng thái kết nối, bản ghi công cụ và kết quả thật.

Chạy kiểm thử tự động liên quan từ thư mục ứng dụng ví dụ.

```bash
pnpm exec vitest run tests/client/client-routes.test.ts tests/client/app-locale-coverage.test.ts tests/client/page-permission-titles.test.ts tests/client/release-notes-button.test.tsx
```

Trước khi bàn giao, chạy `pnpm check` theo dự án, gồm kiểm tra package, lint, định dạng, kiểu, kiểm thử và build. Xem các ca thực sự được chạy cùng kết quả. Xem [Kiểm thử](../../developing-apps/testing-and-acceptance.md).

### Phạm vi kiểm chứng ví dụ

Kết quả ghi ngày 29/10/2026 với template Default `1.0.0-beta.84`, Agents `1.0.0-beta.29`, SQLite, DeepSeek `deepseek-flash`, Runner `0.1.0-beta.20` và Codex `0.165.0`.

| Đã kiểm chứng | Kết quả |
| --- | --- |
| Kiểu, lint theo phạm vi và định dạng | Client, Server và công cụ đều đạt |
| Trang và điểm vào nghiệp vụ | 4 tệp và 23 ca đạt, bao phủ route, locale, nhãn quyền, tạo và thử lại, bấm lặp, đổi tài khoản |
| Chat mô hình | Kết nối thành công, nhận phản hồi thật và giữ lịch sử khi mở lại |
| Skill nghiệp vụ | Bản ghi công cụ gốc xác nhận đọc Skill và `references/style.md` |
| Runner | Sau khi cấp CLI ứng dụng, `pwd` và `ls -A1` chạy trong workspace hội thoại rỗng, lần chạy hoàn tất |
| Truy cập ẩn danh | API dịch vụ mô hình và Skills trả 401 |

Cần kiểm chứng thêm `pnpm check` đầy đủ, build và triển khai production, nghiệm thu trình duyệt nhiều tài khoản, toàn bộ vai trò, thao tác ghi nghiệp vụ, phân tích tệp đính kèm và sửa hoặc build dự án. Màn hình hẹp và giao diện tối chỉ được kiểm tra giới hạn. Bộ gõ tiếng Trung, ma trận ngôn ngữ và di động cùng thao tác dừng phản hồi cũng cần kiểm tra thêm. Ảnh và kết quả thuộc hội thoại gốc. Các prompt rút gọn chưa được chạy lại.

### Mã nguồn ví dụ

- [Ví dụ đầy đủ](https://github.com/nocobase/docs-examples-v3/tree/b91adc8bcd89a238c84f9e62026f250b4833615a/apps/agents-guide) ở commit `b91adc8`, chứa mã tích hợp ba kịch bản.
- [Thiết lập và kiểm chứng](https://github.com/nocobase/docs-examples-v3/blob/b91adc8bcd89a238c84f9e62026f250b4833615a/apps/agents-guide/README.md) ghi phiên bản, cài đặt, khởi động, kiểm thử và giới hạn.
- [Tải mã nguồn ZIP](/assets/core/downloads/agents-doc-demo.zip) tương ứng commit trên, gồm mã nguồn cần thiết và lược thông tin bí mật, dữ liệu runtime cùng dependency.
