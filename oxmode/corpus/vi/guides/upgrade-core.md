---
title: Nâng cấp NocoBase Core
description: Dùng Skill nâng cấp có sẵn để lập kế hoạch, hợp nhất template, chạy kiểm thử và kiểm tra dữ liệu.
---

Ứng dụng có sẵn Skill `nocobase-app-upgrade`. Skill đối chiếu phiên bản template cũ và mới, rồi hợp nhất thay đổi theo từng tệp để bảo toàn mã nghiệp vụ.

```prompt
Upgrade NocoBase Core to the latest version. Give me an upgrade plan first and change things only after I confirm.
```

Kế hoạch liệt kê tệp template đã đổi, cách hợp nhất tệp mà ứng dụng cũng đã chỉnh, và thay đổi dependency cùng migration. Sau khi xác nhận, agent hợp nhất trên nhánh mới, cài dependency, đồng bộ Skill, chạy kiểm thử và build, kiểm tra dữ liệu rồi hợp nhất trở lại nhánh chính.

Xem [Nâng cấp NocoBase Core](../core/developing-apps/upgrade-nocobase-core.md) để tra các bước thủ công và danh sách kiểm chứng. Phát hành sau nâng cấp theo quy trình thường dùng. Dựng image mới, sao lưu thư mục triển khai rồi thay image. Xem [Triển khai phiên bản mới](../core/tutorials/deploy-with-docker.md#deploy-a-new-version-manually).

Hoàn tất khi `nocobase.defaultTemplateVersion` trong `package.json` ghi phiên bản mới, kiểm thử và build đều đạt, và dữ liệu trước nâng cấp vẫn đầy đủ.
