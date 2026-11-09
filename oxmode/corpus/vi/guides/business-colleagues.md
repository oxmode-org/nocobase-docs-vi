---
title: Mời đồng nghiệp nghiệp vụ tham gia
description: Mời quản lý tài sản dùng Studio để trực tiếp gửi yêu cầu, ra quyết định và nghiệm thu.
---

Yêu cầu kiểm kê xuất phát từ quản lý tài sản, nhưng người khác đã truyền đạt, trả lời và nghiệm thu thay. Bài này mời Xu Ning, quản lý tài sản, tham gia trực tiếp dự án itam-lite. Xu Ning dùng giao diện web Studio để gửi yêu cầu, trả lời câu hỏi nghiệp vụ và nghiệm thu mà không cần viết mã hay cài agent.

<a id="1-invite-xu-ning"></a>

## 1. Mời Xu Ning

Mở **Settings › Members**, bấm **Invite members**, nhập email của Xu Ning, chọn itam-lite trong **Projects** rồi bấm **Send invitations**. Xem [Mời thành viên](../studio/setup/invite.md).

![Mời thành viên](https://static-docs.nocobase.com/20261030155133745.png)

Xu Ning mở liên kết mời, nhập tên và mật khẩu rồi bấm **Create account and join**. Xem [Đăng nhập và cài đặt cá nhân](../studio/join/sign-in.md).

Hoàn tất khi Xu Ning xuất hiện trong danh sách **Settings › Members**.

<a id="2-xu-ning-raises-a-request"></a>

## 2. Xu Ning gửi yêu cầu

Xu Ning muốn bổ sung chức năng thanh lý thiết bị. Trong Studio, Xu Ning mở **My sessions**, bấm **New session**, chọn chế độ **Runner Agent** rồi chọn dự án itam-lite.

Yêu cầu cho phép hỗ trợ CNTT gửi đề nghị thanh lý kèm lý do và ảnh khi thiết bị hỏng hoặc quá cũ. Khi quản lý tài sản duyệt, thiết bị chuyển sang Retired và biến mất khỏi danh sách có thể yêu cầu. Hồ sơ thanh lý giữ người đề nghị, người duyệt và lý do. Agent cần hỏi những điểm chưa rõ trước.

```prompt
When a device is broken or too old, it gets retired. Today we just delete it from the register, with no record. Here's what I want:
- When IT support finds a device that should be retired, they submit a retirement request with the reason and photos.
- The asset manager approves it. Once approved, the device's status changes to Retired, and it no longer appears among the devices available for request.
- For a retired device, we can see who requested it, who approved it and why.
Ask me about anything you're not sure of first.
```

Agent hỏi thêm. Xu Ning trả lời theo chính sách công ty. Máy tính xách tay có thể thanh lý sau bốn năm và màn hình sau năm năm. Nếu thanh lý sớm, cần mô tả hư hỏng. Thiết bị đang do nhân viên giữ phải được trả trước. Quản lý tài sản phê duyệt. Xu Ning yêu cầu tạo đầu việc rồi bấm **Start**. Vì Xu Ning là chủ đầu việc, các câu hỏi và yêu cầu nghiệm thu sau đó được gửi trực tiếp cho Xu Ning. Xem [Phiên làm việc của tôi](../studio/use/sessions.md).

<!-- TODO screenshot (English interface, browser width 1440): Xu Ning discussing device retirement in the Runner Agent mode of My sessions, with the created issue and Start listed on the right of the session -->

Hoàn tất khi itam-lite có đầu việc **Device retirement** do Xu Ning phụ trách và đang ở In progress.

<a id="3-xu-ning-answers-questions"></a>

## 3. Xu Ning trả lời câu hỏi

Trong lúc phát triển, agent hỏi thiết bị đã thanh lý có tiếp tục xuất hiện trong sổ hay không. Trong **My issues**, Xu Ning thấy đầu việc được đánh dấu **Needs your reply** và bấm **Reply**. Xu Ning yêu cầu mặc định ẩn thiết bị đã thanh lý và cho xem lại bằng bộ lọc trạng thái để phục vụ kiểm toán.

```text
Don't show retired devices in the register by default, but let people filter by status to see them. Audits need the history.
```

<!-- TODO screenshot (English interface, browser width 1440): Xu Ning's My issues, with the device retirement issue marked Needs your reply in the Waiting for you group -->

<a id="4-xu-ning-accepts-the-result"></a>

## 4. Xu Ning nghiệm thu kết quả

Khi đầu việc chuyển sang In review, Xu Ning đọc báo cáo và ảnh rồi dùng bản xem trước. Gửi đề nghị thanh lý cho thiết bị nhân viên vẫn giữ để kiểm tra bị chặn. Sau khi trả thiết bị, gửi lại, phê duyệt rồi xác nhận thiết bị đã biến mất khỏi danh sách có thể yêu cầu. Nếu đạt, Xu Ning bấm **Merge**. Xem [Nghiệm thu kết quả](../studio/use/accept.md).

Hoàn tất khi **Device retirement** ở Done và Xu Ning đã trực tiếp trả lời mọi câu hỏi nghiệp vụ.
