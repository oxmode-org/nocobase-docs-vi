---
title: Vai trò và quyền
description: Đối chiếu ba tài khoản với ma trận quyền, kiểm tra phạm vi dữ liệu, nút thao tác và từ chối tại API.
---

Chương này lần lượt đổi tài khoản để đối chiếu từng mục với ma trận quyền trong mục 6 của [tài liệu thiết kế](https://github.com/nocobase/docs-examples-v3/blob/main/apps/itam-lite/docs/design.md), rồi giao agent sửa các vấn đề phát hiện được.

<a id="1-check-with-each-account"></a>

## 1. Kiểm tra từng tài khoản

Lần lượt đăng nhập bằng Alice (Nhân viên), Ben (Hỗ trợ CNTT) và Cathy (Quản lý tài sản), rồi đối chiếu:

| Kiểm tra | Mong đợi | Thực tế |
| --- | --- | --- |
| Alice mở **Device requests** | Chỉ thấy yêu cầu của Alice | Thấy yêu cầu của mọi người |
| Alice mở **Devices** | Chỉ thấy thiết bị được gán cho Alice | Thấy mọi thiết bị |
| Ben mở yêu cầu chờ duyệt | Ẩn **Approve** và **Reject** | Có **Approve**. Bấm nút thì báo Ben thiếu quyền |
| Cathy mở yêu cầu sẵn sàng cấp | Ẩn **Issue** | Có **Issue**. Bấm nút thì báo Cathy thiếu quyền |
| Quản trị viên mở vai trò Employee trong **Permission management** | Thấy mọi thao tác nghiệp vụ và phạm vi dữ liệu | Chỉ thấy quyền vào trang |

![Hỗ trợ CNTT thấy Approve nhưng bị từ chối khi bấm](https://static-docs.nocobase.com/20261030-itam-lite-roles-it-support-approve-denied.webp)

Khi Ben bấm **Approve**, máy chủ từ chối đúng. Phần cần sửa ở đây là cách giao diện hiển thị thao tác.

<a id="2-ask-for-changes"></a>

## 2. Yêu cầu chỉnh sửa

Yêu cầu agent áp dụng ma trận trong `docs/design.md`. Giới hạn nhân viên vào yêu cầu của mình và thiết bị được giao. Chỉ hiển thị thao tác được phép và đưa mọi quyền nghiệp vụ cùng phạm vi dữ liệu vào trang quản lý quyền.

```prompt
Fix permissions according to the permission matrix in docs/design.md:
1. Employees can see and withdraw only their own requests, and see only the devices assigned to them in the register.
2. Request details show only the actions the current role can take.
3. Every action and data scope for devices and device requests can be configured in Permission management.
```

Agent sửa như sau:

| Vấn đề | Cách sửa |
| --- | --- |
| Nhân viên thấy mọi dữ liệu | Seed mới đổi phạm vi xem và rút yêu cầu của Employee thành “Requests I submitted”, còn thiết bị thành “Devices assigned to me”. Chỉ cập nhật nếu vai trò vẫn giữ cấu hình ban đầu |
| Nút hiển thị sai theo vai trò | API chi tiết trả các thao tác vai trò hiện tại được phép thực hiện. Trang chỉ hiện nút mà cả quy trình và vai trò đều cho phép |
| Thiếu thao tác trong Permission management | Đăng ký hai nhóm thao tác nghiệp vụ và cài đặt quản lý quy trình trong trình chỉnh sửa quyền |
| API có thể bị gọi ngoài quyền | Thêm kiểm thử gọi trực tiếp API bằng ba tài khoản thường, bao phủ các tiêu chí nghiệm thu ở trên |

Agent áp dụng Seed vào cơ sở dữ liệu đang dùng bằng `pnpm nocobase db apply`.

<a id="3-check-again"></a>

## 3. Kiểm tra lại

Alice chỉ thấy ba yêu cầu mình đã gửi và hai thiết bị được giao. Khi Ben mở yêu cầu chờ duyệt, trang báo hiện không có thao tác nào dành cho Ben. Alice gọi trực tiếp API duyệt và vẫn bị từ chối.

![Nhân viên chỉ thấy yêu cầu của mình](https://static-docs.nocobase.com/20261030-itam-lite-roles-employee-own-requests.webp)

Khi quản trị viên sửa vai trò Employee trong **System settings › Permission management**, **Business operations** liệt kê từng thao tác và phạm vi dữ liệu. Từ đây có thể điều chỉnh ngay tại trang này.

![Thao tác nghiệp vụ và phạm vi dữ liệu của một vai trò](https://static-docs.nocobase.com/20261030-itam-lite-roles-business-operations.webp)

Xem [Xác thực, quyền và phạm vi dữ liệu](../core/developing-apps/authentication-and-permissions.md) về khai báo, kiểm tra và kiểm chứng quyền, và [Quản lý quyền](../core/using-plugins/authorization/permissions.md) về trang cấu hình.

Hoàn tất khi cả ba tài khoản thấy đúng dữ liệu và thực hiện đúng thao tác theo ma trận. Các bài kiểm thử phải xác nhận API từ chối mọi lượt gọi ngoài quyền của tài khoản thường. **Permission management** phải hiển thị và cho chỉnh mọi thao tác nghiệp vụ cùng phạm vi dữ liệu.
