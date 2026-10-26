# Bảng thuật ngữ — Tài liệu NocoBase 3 tiếng Việt (OXMODE)

Áp dụng cho toàn bộ `doc/src/vi/` (69 trang: Bắt đầu, Core, Studio). Nguồn: `nocobase/website-v3` thư mục `doc/`.

## Quy ước chung

- **Tên giao diện giữ nguyên tiếng Anh** và in đậm, đúng như sản phẩm: **My issues**, **Needs you**, **Merge anyway**, **Settings › Members**. Khi cần, thêm giải thích tiếng Việt ở lần xuất hiện đầu.
- **Trạng thái issue giữ tiếng Anh**: Backlog, In progress, Blocked, In review, Done, Cancelled.
- **Mã, lệnh, tên file, biến môi trường, khóa cấu hình, tên package** giữ nguyên. Chú thích trong YAML/shell/cây thư mục được dịch.
- **Prompt mẫu** (khối `text`) được dịch sang tiếng Việt; tên trang tài liệu gốc được nhắc trong prompt (ví dụ “Done when”, “Prepare a machine”) giữ tiếng Anh.
- **Mô phỏng giao diện (figures)**: nhãn/nút của giao diện giữ tiếng Anh, nội dung (tiêu đề issue, tin nhắn của Agent, mô tả) dịch sang tiếng Việt.
- Ví dụ giữ nguyên tên người (Zhou Hang, Lin Yue, Li Na), tên dự án *Supplier Management*, tên tài liệu *Purchase Approval Policy*. Số tiền viết kiểu Việt Nam: ¥50.000.
- Anchor tiếng Việt được tạo từ tiêu đề (ví dụ `#chuẩn-bị-máy`); khi đổi tiêu đề phải cập nhật các liên kết trỏ tới.

## Thuật ngữ

| Tiếng Anh | Tiếng Việt |
| --- | --- |
| agent | Agent |
| coordinator agent | Agent điều phối |
| worker agent | Agent thực thi |
| agent team | đội Agent |
| my agent / your agent | Agent của tôi / Agent của bạn |
| coding agent | coding agent |
| coding tool | công cụ lập trình |
| issue owner | người phụ trách issue |
| executor | người thực hiện |
| project lead | trưởng dự án |
| admin / owner / member (vai trò) | quản trị viên; vai trò giữ tên Admin / Owner / Member |
| approver | người duyệt |
| runtime (shared / personal) | runtime (dùng chung / cá nhân) |
| runner | runner |
| code host | nền tảng lưu trữ mã |
| knowledge base | cơ sở tri thức |
| project memory | bộ nhớ dự án |
| delivery report | báo cáo bàn giao |
| accept / acceptance | nghiệm thu |
| acceptance criteria | tiêu chí nghiệm thu |
| checks | kiểm tra |
| review, merge, PR, preview, staging, production, rollback | giữ nguyên |
| deploy environment | môi trường triển khai |
| protected environment | môi trường được bảo vệ |
| deployment request | yêu cầu triển khai |
| release (danh từ) | bản phát hành |
| publish a release | phát hành bản mới |
| secret | khóa bí mật |
| encryption key | khóa mã hóa |
| credential | thông tin xác thực |
| run | lượt chạy |
| session | phiên |
| queue | hàng đợi |
| sub-issue | issue con |
| blocker | issue chặn |
| Good at | thế mạnh |
| approach | hướng làm |
| plan | kế hoạch |
| Done when | **Xong khi** |
| foundation library / package | thư viện / package nền tảng |
| capability | năng lực |
| permission / authorization | quyền / phân quyền |
| authentication | xác thực |
| permission set | bộ quyền |
| data scope / record scope | phạm vi dữ liệu / phạm vi bản ghi |
| policy (RepositoryPolicy) | policy |
| business service | business service |
| endpoint, route, Provider, Repository, Collection, field, migration, seed, template, plugin, Skill, hook, component | giữ nguyên |
| relation | quan hệ |
| constraint / foreign key / index | ràng buộc / khóa ngoại / index |
| transaction | transaction |
| input validation | kiểm tra dữ liệu đầu vào |
| test / testing | test / kiểm thử |
| verify / verification | kiểm chứng |
| baseline | mốc ban đầu |
| runtime configuration | cấu hình khi chạy |
| business settings | cài đặt nghiệp vụ |
| localization / locale | đa ngôn ngữ / locale |
| theme / preset / token | theme / preset / token |
| dialog / drawer | hộp thoại / drawer |
| pending (submission) | đang gửi / đang lưu |
| draft | bản nháp |
| lazy-load | tải lười |
| backfill | bổ sung dữ liệu |
| deployment archive | gói triển khai / gói nén |
| health check | health check |
| dormant (app) | ngủ |
| usage / workload | mức sử dụng / khối lượng việc |
| inbox / reminder / push notification | hộp thư / nhắc nhở / thông báo đẩy |
| With an agent / Without an agent | Cùng Agent / Không dùng Agent |
| Next step | Bước tiếp theo |
| Troubleshooting | Xử lý sự cố |
| Prerequisites | Điều kiện cần |
| Verify results | Kiểm tra kết quả |
