---
title: Câu hỏi thường gặp về Core
description: Giải đáp về ứng dụng, plugin, mã nguồn UI, cấu hình, CLI, cơ sở dữ liệu, nâng cấp và triển khai.
---

## Nên đặt tính năng trong ứng dụng hay plugin?

Đặt mã riêng của nghiệp vụ hiện tại trong `client/`, `server/`, `database/` hoặc `cli/` của ứng dụng. Cân nhắc `packages/app-plugin-<name>/` khi cần bảo trì độc lập, có điểm mở rộng rõ hoặc tích hợp vào nhiều ứng dụng. Plugin cục bộ build và bàn giao cùng ứng dụng. Xem [Khi nào nên viết plugin](../extension-development/when-to-write-a-plugin.md).

## Vì sao đã cài plugin mà chưa có trang hoặc tính năng?

Kiểm tra riêng dependency đã cài, điểm vào runtime đã đăng ký và trang đã tích hợp. Xem plugin cung cấp điểm vào Client, Server hay CLI nào rồi đối chiếu tệp `plugins.ts` tương ứng. Một số plugin chỉ cung cấp dịch vụ hoặc Skill và để ứng dụng tự ghép trang. Tài nguyên cơ sở dữ liệu cần áp dụng migration. Xem [Sử dụng plugin](../using-plugins/overview.md) và [Danh mục plugin](plugins.md).

## Component cần theo cấu trúc cố định không?

Tổ chức component theo nhu cầu và dùng shadcn cho thành phần cơ bản. Tra [NocoBase UI Library](https://ui.nocobase.com/) trước khi lắp ghép UI theo mô-đun. Plugin có thể cung cấp component runtime hoặc chỉ cung cấp dịch vụ, hợp đồng và ví dụ. Xem [Component và style](../extension-development/frontend-components.md).

## Khi nào cần phát hành UI Registry?

Dùng Registry khi muốn Agent lấy mã nguồn component hoặc block để chỉnh sửa và lắp ghép. Để tái sử dụng mã thông thường, dùng mô-đun, package dùng chung hoặc plugin runtime.

Duy trì tài nguyên phân phối trong package riêng như `packages/announcements-ui/`, cạnh plugin runtime. Dùng giao diện công khai và alias mà bên nhận có thể phân giải. Các tệp phân phối cùng nhau có thể import tương đối nếu giữ nguyên vị trí tương đối sau khi cài. Xem [Phân phối mã nguồn UI](../extension-development/frontend-components.md#optionally-distribute-ui-source-assets).

## Cài mã nguồn UI cục bộ bằng cách nào?

Build JSON của mục rồi truyền đường dẫn vào `shadcn add`. Dùng đường dẫn tuyệt đối khi `pnpm --filter` chạy trong package con. Nếu cần phân phối qua URL giữa các máy, dùng hosting tĩnh hiện có. Xem [Cài mã nguồn UI cục bộ](../extension-development/frontend-components.md#install-and-modify-it-in-the-target-project).

## ServiceProvider dùng ở đâu?

Client và server đều dùng ServiceProvider để đăng ký dịch vụ và thực hiện hook vòng đời. Mỗi runtime có container và instance riêng. React Provider cung cấp Context cho cây component React. Xem [ServiceProvider](../extension-development/service-provider.md) và [Tham chiếu API](api.md).

## Vì sao sửa config.yml mà cấu hình chưa đổi?

Kiểm tra biến môi trường ghi đè và xem `APP_CONFIG_FILE` có chọn tệp khác hay không. YAML giữ nguyên chuỗi `${NAME}`. Tùy chọn đã lưu trên trình duyệt có thể ghi đè mặc định theme mới. Một số dịch vụ đọc cấu hình khi khởi động, nên cần khởi động lại hoặc hỗ trợ nạp lại tường minh. Xem [Tham chiếu cấu hình](configuration.md).

## Vì sao đổi mật khẩu quản trị viên ban đầu mà tài khoản vẫn giữ mật khẩu cũ?

`users.initialAdmin` chỉ khởi tạo khi cơ sở dữ liệu người dùng còn rỗng. Với tài khoản đã có, dùng quản lý tài khoản hoặc luồng khôi phục mật khẩu của ứng dụng.

## Vì sao lệnh khác hướng dẫn khác?

Xác nhận hướng dẫn dành cho NocoBase 3, thư mục làm việc là ứng dụng cần dùng và CLI thuộc ứng dụng đó. Trong mã nguồn dùng `pnpm nocobase`. Trong bản triển khai dùng `node dist/cli/index.js`. Xem `commands --json` và `--help` của từng lệnh. Lệnh phát triển và đăng ký plugin có thể chỉ khả dụng trong mã nguồn. Xem [Tham chiếu dòng lệnh](cli.md).

## Ứng dụng có sẵn plugin nào?

Dependency của template cho biết package nào đi kèm. Tệp đăng ký quyết định điểm vào nào thực sự được nạp. Cả hai có thể đổi theo phiên bản. Kiểm tra `package.json`, lockfile và đăng ký Client, Server, CLI rồi đối chiếu mốc trong [Danh mục plugin](plugins.md).

## Tạo bảng xong thì mở API bằng cách nào?

Khai báo endpoint cho Collection, kiểm tra đầu vào, xác thực danh tính và áp dụng quyền. Repository client từ xa cũng cần endpoint tương ứng trên server. Xem [Route HTTP và API](../developing-apps/apis-and-services.md).

## Vì sao migration báo lệch checksum?

Tệp migration đã áp dụng khác mã hiện tại. Kiểm tra thay đổi lịch sử, nhánh và bản triển khai. Thông thường, thêm migration cho thay đổi mới. Chỉ cân nhắc `db repair` sau khi xác nhận chỉnh sửa không đổi ngữ nghĩa schema đã triển khai. Xem [Migration cơ sở dữ liệu](../framework/database/migrations.md).

## Đổi dialect có chuyển dữ liệu không?

Đổi dialect chỉ thay kết nối. Lập kế hoạch chuyển và kiểm chứng dữ liệu riêng. Trên hệ đích, kiểm tra kiểu trường, index, ràng buộc, truy vấn, transaction và hành vi plugin. Phiên bản dùng trong kiểm thử driver là một mốc để đối chiếu. Xem [Hỗ trợ cơ sở dữ liệu và tương thích phiên bản](compatibility.md).

## Các package @nocobase có dùng chung số phiên bản không?

Runtime, thư viện, plugin và công cụ tạo khung có phiên bản độc lập. Tuân theo dependency của template và khoảng peer dependency, đồng thời giữ lockfile. Khi nâng cấp, kiểm tra thay đổi template, migration và plugin cục bộ. Xem [Nâng cấp NocoBase Core](../developing-apps/upgrade-nocobase-core.md).

## Thư mục nào có thể tạo lại?

Có thể tạo lại `node_modules/` và `dist/` từ mã nguồn và lockfile. Skill đồng bộ cũng có nguồn được duy trì. `storage/` do runtime tạo có thể chứa cơ sở dữ liệu SQLite, tệp tải lên và log. Lập kế hoạch lưu bền vững và sao lưu theo cấu hình thật. Xem [Quy ước thư mục và tệp](project-conventions.md).

## Xem trước trong phát triển và triển khai production khác nhau thế nào?

Dùng lệnh phát triển trên máy cục bộ. Với preview Studio, xem tài liệu Studio. Để triển khai production độc lập, dùng sản phẩm build với Docker hoặc PM2 kết hợp app-installer và bảo toàn dữ liệu runtime. Xem [Chọn cách triển khai](../deployment/choose-a-deployment-method.md).

## Báo lỗi cần những gì?

Cung cấp bước tái hiện tối thiểu, kết quả thực tế và mong đợi, hệ điều hành, kiến trúc, phiên bản Node và pnpm cùng phiên bản package liên quan. Ghi rõ lỗi xảy ra khi phát triển, build hay triển khai. Với cơ sở dữ liệu, thêm dialect và phiên bản server. Chia sẻ lệnh và lỗi đã che mật khẩu, khóa, phiên và dữ liệu cấu hình nhạy cảm.
