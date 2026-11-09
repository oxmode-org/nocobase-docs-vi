---
title: Lưu cách làm và kinh nghiệm
description: Lưu chính sách quản lý tài sản trong kho tri thức, viết checklist ITAM thành Skill và xem bộ nhớ dự án.
---

Các quyết định của Xu Ning về tuổi thanh lý và việc xác nhận sai lệch kiểm kê đang nằm rải rác trong phiên làm việc và bình luận của hai đầu việc. Studio lưu chúng ở ba nơi:

| Nơi lưu | Nội dung | Người viết |
| --- | --- | --- |
| Kho tri thức | Chính sách, quy tắc và quyết định nghiệp vụ | Con người |
| Skill | Cách làm việc, chuẩn phát triển và danh sách kiểm tra | Con người |
| Bộ nhớ dự án | Cách làm đã được góp ý và các vấn đề agent từng gặp | Agent |

<a id="1-put-the-asset-management-policies-in-the-knowledge-base"></a>

## 1. Đưa chính sách quản lý tài sản vào kho tri thức

Mở **Development › Knowledge**, chọn không gian dự án itam-lite, tạo thư mục “Asset management policies” rồi tải tệp chính sách lên hoặc tạo bài viết. Ví dụ dưới đây ghi thiết bị cấp tiêu chuẩn, điều kiện thanh lý, lịch kiểm kê và cách xác nhận sai lệch:

```markdown
# Device request, retirement and stocktake rules

## Standard equipment
- New employees get a laptop and a monitor.
- Requests beyond the standard need the department head to give a reason in the device request, and the asset manager approves them.

## Retirement rules
- Laptops can be retired after 4 years and monitors after 5. Before that, describe the damage and attach photos.
- A device an employee still has can't be retired directly. It has to be returned first.
- Retired devices are hidden from the register by default and can be shown by filtering on status. Audits must be able to see who requested, who approved and why.

## Stocktake schedule
- A stocktake every quarter, in batches by location, and a full stocktake every December.
- Discrepancies found in a stocktake don't update the register automatically. The asset manager confirms each one before it's updated.
```

Chỉ ghi quy tắc và quyết định khó suy ra từ mã. Để Xu Ning trực tiếp cập nhật, cấp quyền **Edit** trên thư mục. Xem [Kho tri thức](../studio/project/knowledge-base.md) về không gian, quyền và cách agent đọc.

![Kho tri thức có không gian và thư mục bên trái, tài liệu bên phải](https://static-docs.nocobase.com/20261028205037978.png)

Hoàn tất khi hỏi trong phiên “Máy tính xách tay dùng bao nhiêu năm thì được thanh lý?”, agent trả lời bốn năm và dẫn đúng bài viết này.

<a id="2-write-a-skill-the-itam-checklist"></a>

## 2. Viết Skill checklist ITAM

Mỗi lần nghiệm thu, dùng tài khoản thuộc các vai trò khác nhau để kiểm tra quyền và dấu vết thay đổi sổ thiết bị. Đưa các bước vào Skill để agent phát triển và rà soát cùng đối chiếu.

Trước hết, nhờ agent lập trình cục bộ đọc mã itam-lite và báo cáo bàn giao của đầu việc kiểm kê, thanh lý, rồi viết bản nháp `itam-checklist` chỉ gồm quy ước của dự án:

```prompt
Read the itam-lite code and the delivery reports of the device stocktake and device retirement issues, and draft a skill called itam-checklist: the permission and audit-trail requirements every change to this system must be checked against. Write only conventions specific to this project.
```

Bản nháp minh họa cách thử ba vai trò, xác minh người và thời điểm thay đổi thiết bị, và tra quy tắc nghiệp vụ trong kho tri thức:

```markdown
---
name: itam-checklist
description: Read when developing, self-testing or reviewing any change in itam-lite that involves devices, device requests, retirement or stocktakes. Lists the permission and audit-trail requirements this system must be checked against.
---

# ITAM checklist

## Try all three roles
- Employee: sees only the devices assigned to them, and can't see stocktakes or retirements.
- IT support: handles device requests, fills in stocktake check results and submits retirement requests, but can't approve.
- Asset manager: approves device requests and retirements, starts and ends stocktakes, and confirms stocktake discrepancies.
- For each acceptance scenario, sign in as at least two of the affected roles and attach screenshots to the delivery report.

## Register changes leave a trail
- When a device's status, location or assignee changes, it must be possible to see who changed it, when, and which request caused it.
- Device records must never be deleted directly. Retiring a device changes its status; it doesn't delete it.

## The knowledge base sets the business rules
- Standard equipment, retirement ages and the stocktake schedule follow "Device request, retirement and stocktake rules" in the knowledge base. Don't guess and hard-code them.
```

Sau khi rà soát nội dung, yêu cầu agent dùng `nb-studio` để tạo Skill trong Studio và áp dụng vào itam-lite:

```prompt
Use nb-studio to create itam-checklist as a Studio skill and apply it to the itam-lite project.
```

Skill xuất hiện ở **Agent management › Skills** và trong **Project settings › Default skills** của itam-lite.

![Danh sách Skill tích hợp và Skill của nhóm](https://static-docs.nocobase.com/20261028210018195.png)

Có thể gắn Skill ở cấp toàn cục, dự án hoặc kho mã. Xem [Skill](../studio/project/skills.md).

![Gắn toàn cục và tự động gắn vào dự án mới trong chi tiết Skill](https://static-docs.nocobase.com/20261028210517252.png)

![Skill mặc định trong cài đặt dự án](https://static-docs.nocobase.com/20261029152525192.png)

![Skill mặc định có thể áp dụng cho một kho mã riêng](https://static-docs.nocobase.com/20261029152621517.png)

Hoàn tất khi ở đầu việc tiếp theo liên quan đến thiết bị, agent rà soát kiểm tra quyền theo vai trò và dấu vết thay đổi theo checklist, còn báo cáo có ảnh từ các vai trò khác nhau.

<a id="3-look-at-project-memory"></a>

## 3. Xem bộ nhớ dự án

Agent tự ghi bộ nhớ trong `.nb-studio/memory/` của kho mã. Bộ nhớ được commit và rà soát cùng PR, Claude và Codex cùng đọc một bản. Xem trong **Development › Project memory**:

| Loại | Ví dụ |
| --- | --- |
| Phản hồi | Chỉ cập nhật sổ thiết bị sau khi quản lý tài sản xác nhận sai lệch kiểm kê |
| Dự án | Thanh lý đổi trạng thái và giữ bản ghi để phục vụ kiểm toán |
| Tham chiếu | Tuổi thanh lý và lịch kiểm kê theo bài “Device request, retirement and stocktake rules” trong kho tri thức |

![Xem bộ nhớ theo dự án và kho mã, lọc theo loại](https://static-docs.nocobase.com/20261028205613068.png)

Để agent ghi nhớ một quy tắc, nêu trực tiếp trong đầu việc. Xem [Bộ nhớ dự án](../studio/project/project-memory.md).

Hoàn tất khi chính sách quản lý tài sản đã nằm trong kho tri thức và `itam-checklist` đã được gắn với itam-lite.
