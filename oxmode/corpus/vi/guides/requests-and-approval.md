---
title: Yêu cầu thiết bị và phê duyệt
description: Nhân viên gửi yêu cầu, quản lý tài sản duyệt khi cần và hỗ trợ CNTT cấp thiết bị qua quy trình và thông báo của Core.
---

Chương này thực hiện bước 2 của [tài liệu thiết kế](https://github.com/nocobase/docs-examples-v3/blob/main/apps/itam-lite/docs/design.md). Nhân viên gửi yêu cầu thiết bị. Yêu cầu máy tính xách tay, điện thoại hoặc yêu cầu của người đã đạt giới hạn thiết bị phải qua quản lý tài sản phê duyệt. Sau đó, hỗ trợ CNTT cấp thiết bị và sổ thiết bị tự ghi người sử dụng.

<a id="1-make-the-request"></a>

## 1. Gửi yêu cầu

Yêu cầu agent làm bước 2, gửi thông báo cho người liên quan ở mỗi bước và cho quản trị viên chỉnh danh mục cần duyệt cùng giới hạn thiết bị mỗi người. Tạo ba vai trò ngay, rồi thiết lập phạm vi bản ghi ở bước 3.

```prompt
Do step 2 of docs/design.md: device requests and approval. Notify the people involved at each step; administrators can adjust which categories need approval and the device limit per person.
Create the Employee, IT support and Asset manager roles now; who can see which records comes in step 3.
```

Kết quả agent xây dựng:

| Phần | Tính năng Core sử dụng |
| --- | --- |
| Luồng yêu cầu từ Draft qua Pending approval hoặc Ready to issue đến Issued, cùng Rejected và Withdrawn | Quy trình `@nocobase/lifecycle`. Trạng thái chỉ đổi theo chuyển tiếp đã khai báo. Mỗi bước ghi người thực hiện và thời điểm. Trang chưa cập nhật không thể ghi đè quyết định mới |
| Quy tắc duyệt theo danh mục và giới hạn thiết bị mỗi người | Tham số quy trình do quản trị viên chỉnh trong **System settings › Workflow management** và được đọc khi gửi yêu cầu |
| Thông báo trong ứng dụng khi cần duyệt, sẵn sàng cấp, đã duyệt, bị từ chối hoặc đã cấp | Plugin thông báo và tin nhắn trong ứng dụng. Quy trình gửi sau mỗi bước tương ứng và tự thử lại khi lỗi |
| Vai trò Employee, IT support và Asset manager | Plugin phân quyền. Mỗi thao tác có quyền nghiệp vụ riêng |
| Trang **Device requests**, mục **Inbox** ở thanh bên và trang **Workflow management** | Sơ đồ quy trình và thành phần quản lý quy trình đi kèm template |

Xem [NocoBase Core](../core/using-plugins/overview.md) để tra các khả năng, [Danh mục package Core và công cụ](../core/reference/packages.md) để tìm package quy trình, và [Thông báo](../core/using-plugins/notifications/notification.md) để biết cơ chế gửi. Nếu cần duyệt nhiều cấp, đồng phê duyệt hoặc ủy quyền và có giấy phép plugin thương mại, có thể dùng [Phê duyệt](../core/using-plugins/collaboration/approval.md).

<a id="2-prepare-three-accounts"></a>

## 2. Chuẩn bị ba tài khoản

Yêu cầu agent tạo ba tài khoản kiểm thử và cung cấp thông tin đăng nhập.

```prompt
Create three test users: Alice Wang is an employee, Ben Zhou is IT support, and Cathy Liu is an asset manager. Tell me their usernames and passwords.
```

| Người dùng | Vai trò |
| --- | --- |
| Alice Wang | Nhân viên |
| Ben Zhou | Hỗ trợ CNTT |
| Cathy Liu | Quản lý tài sản |

<a id="3-walk-through-the-workflow"></a>

## 3. Đi qua quy trình

Đăng nhập từng tài khoản trong trình duyệt hoặc cửa sổ riêng tư khác nhau:

1. **Alice** mở **Device requests › New request**, chọn máy tính xách tay, ghi mục đích rồi gửi. Yêu cầu chuyển sang **Pending approval**. Alice gửi tiếp yêu cầu màn hình và yêu cầu này đi thẳng tới **Ready to issue**.

   ![Gửi yêu cầu thiết bị](https://static-docs.nocobase.com/20261030-itam-lite-requests-new-request.webp)

2. **Cathy** mở **Inbox**, bấm thông báo để mở yêu cầu rồi chọn **Approve**.

   ![Quản lý tài sản nhận thông báo về yêu cầu cần duyệt](https://static-docs.nocobase.com/20261030-itam-lite-requests-inbox-approval.webp)

3. **Ben** mở thông báo sẵn sàng cấp trong **Inbox**, chọn **Issue** rồi chọn máy tính còn trong kho.

   ![Hỗ trợ CNTT chọn thiết bị để cấp](https://static-docs.nocobase.com/20261030-itam-lite-requests-issue-device.webp)

4. Mở **Devices**. Máy tính chuyển sang **In use** và được gán cho Alice. Alice nhận thông báo trong ứng dụng rằng thiết bị đã được cấp.

<a id="4-adjust-the-approval-rules"></a>

## 4. Điều chỉnh quy tắc phê duyệt

Quản trị viên mở **System settings › Workflow management** rồi chọn **Device requests**. Sơ đồ quy trình nằm bên trái và quy tắc duyệt nằm bên phải. Chọn máy tính để bàn và lưu để yêu cầu mới thuộc danh mục này chuyển sang Pending approval. Yêu cầu đã gửi giữ nguyên quy tắc áp dụng lúc gửi.

![Định nghĩa quy trình và quy tắc phê duyệt](https://static-docs.nocobase.com/20261030-itam-lite-requests-workflow-definition.webp)

**Executions** có một mục cho mỗi yêu cầu, hiển thị các bước đã qua, người thực hiện và trạng thái gửi từng thông báo.

![Bản ghi thực thi của một yêu cầu](https://static-docs.nocobase.com/20261030-itam-lite-requests-workflow-execution.webp)

Hoàn tất khi quản lý tài sản duyệt yêu cầu máy tính xách tay, hỗ trợ CNTT cấp máy và sổ thiết bị hiển thị In use cùng người yêu cầu. Yêu cầu màn hình đi thẳng tới Ready to issue. Cathy, Ben và Alice nhận đúng thông báo, còn **Workflow management** hiển thị sơ đồ, quy tắc và lịch sử thực thi.
