---
title: Viết tài liệu thiết kế hệ thống trước
description: Thống nhất thiết kế ITAM với agent, lưu trong kho mã và mô tả các yêu cầu tiếp theo bằng ngôn ngữ nghiệp vụ.
---

Một câu như “Xây hệ thống quản lý tài sản CNTT” còn bỏ ngỏ nhiều quyết định nghiệp vụ và buộc agent tự suy đoán. Hãy trao đổi thiết kế trước, ghi vào tài liệu trong kho mã rồi dùng tài liệu đó làm cơ sở cho từng yêu cầu sau.

<a id="1-talk-through-the-design-with-the-agent"></a>

## 1. Trao đổi thiết kế với agent

Mở phiên mới trong thư mục `itam-lite`. Nêu ba vai trò và yêu cầu agent làm rõ từng nhóm quyết định trước khi viết mã:

```prompt
I want to build a lean IT asset management system. Don't write code yet; let's work out the design first.
Three roles: employees request devices, asset managers approve, and IT support issues them and records them in the register.
Ask me about anything I need to decide, one group of questions at a time, with your recommendation for each.
```

Agent hỏi từng nhóm. Hướng dẫn thống nhất các quyết định sau:

| Câu hỏi của agent | Quyết định |
| --- | --- |
| Thiết bị có trường nào? Mã tài sản và số sê-ri có duy nhất không? | Mã tài sản bắt buộc và duy nhất. Số sê-ri tùy chọn |
| Yêu cầu nào cần duyệt? | Máy tính xách tay, điện thoại và mọi yêu cầu của người đã dùng hai thiết bị. Quản trị viên có thể điều chỉnh cả hai quy tắc |
| Ai duyệt và ai cấp? | Quản lý tài sản duyệt yêu cầu của người khác. Hỗ trợ CNTT chọn thiết bị còn trong kho để cấp |
| Nhân viên thấy gì? | Yêu cầu của mình và thiết bị được giao cho mình |
| Phiên bản này giới hạn ở đâu? | Để mua sắm, sửa chữa, kiểm kê, thanh lý, trả thiết bị, duyệt nhiều cấp, nhập và xuất dữ liệu cho giai đoạn sau |
| Công ty có hệ thống thiết kế riêng không? | Dùng quy ước thiết kế tích hợp của NocoBase 3 |

Nếu công ty có hệ thống thiết kế riêng về màu sắc, phông chữ hoặc quy tắc thành phần, đưa các tệp vào kho mã và báo agent ở bước này.

<a id="2-write-it-up"></a>

## 2. Ghi thành tài liệu

Yêu cầu agent ghi thiết kế vào `docs/design.md` và bổ sung chỉ mục trong `AGENTS.md`:

```prompt
Write the decided design into docs/design.md: roles, data, workflows, pages, permissions, plus a step-by-step delivery plan with acceptance criteria for each step.
Register it in AGENTS.md: read it before any business change; when a request changes the design, update it first, then change the code.
```

Tài liệu ví dụ là [docs/design.md](https://github.com/nocobase/docs-examples-v3/blob/main/apps/itam-lite/docs/design.md). Phần cuối chia việc phát triển thành ba bước tương ứng với ba bài tiếp theo:

| Bước | Kết quả bàn giao | Điều kiện hoàn tất |
| --- | --- | --- |
| 1. Sổ thiết bị | Bảng, API và trang thiết bị | Tạo, sửa và tìm được thiết bị. Mã tài sản trùng hiện lỗi cạnh ô nhập. Dữ liệu còn sau khi tải lại |
| 2. Yêu cầu và phê duyệt | Yêu cầu, quy trình, thông báo và quản lý quy trình | Yêu cầu laptop được duyệt rồi cấp, thiết bị chuyển sang In use. Yêu cầu màn hình đi thẳng tới Ready to issue. Người liên quan nhận thông báo trong ứng dụng |
| 3. Vai trò và quyền | Ba vai trò và phạm vi dữ liệu | Đăng nhập từng tài khoản để xác nhận nội dung thấy được và thao tác khớp ma trận quyền. API ngoài quyền bị từ chối |

Đọc lại tài liệu và yêu cầu agent sửa phần chưa đúng.

Nếu cần quy trình chặt chẽ hơn, dùng [OpenSpec](https://github.com/Fission-AI/OpenSpec) để ghi đề xuất, thiết kế và đầu việc cho từng thay đổi, hoặc [superpowers](https://github.com/obra/superpowers) để trao đổi ý tưởng, lập kế hoạch rồi thực hiện.

<a id="3-cover-three-points-in-every-later-request"></a>

## 3. Nêu ba điểm trong mỗi yêu cầu sau

Tài liệu thiết kế bao quát cả hệ thống. Mỗi yêu cầu riêng cần nêu bằng ngôn ngữ nghiệp vụ:

- Ai sử dụng.
- Cần làm gì.
- Ai được làm gì và dữ liệu nào cần bảo toàn.

Ví dụ đầu chỉ đề nghị cho phép trả thiết bị:

```prompt
Devices should be returnable.
```

Ví dụ sau nêu rõ thao tác trả, vai trò được phép và điều kiện đổi trạng thái:

```prompt
Add "Return" to the device register.
IT support clicks Return on a device that is In use and fills in the return location; the device becomes In stock and its user is cleared.
Only IT support and asset managers can return devices, not employees. Devices that are In stock, In repair or Retired can't be returned.
```

Yêu cầu đầu để agent tự suy đoán ai được trả và trạng thái đổi ra sao. Yêu cầu sau cho agent đủ thông tin để lập kế hoạch.

Với thay đổi lớn, yêu cầu agent liệt kê phần bị ảnh hưởng, quyết định cần chốt và cách kiểm chứng, rồi chờ xác nhận trước khi sửa:

```prompt
Don't change code yet. List which parts this change touches, the questions I need to decide, and how you plan to verify it.
```

Xem [Tiếp tục phát triển ứng dụng](../getting-started/develop-your-first-app.md#refine-and-continue-developing) về cách viết yêu cầu và nghiệm thu kết quả.

Hoàn tất khi kho mã có `docs/design.md`, `AGENTS.md` trỏ tới tài liệu đó và cuối tài liệu có kế hoạch bàn giao cùng tiêu chí nghiệm thu từng bước.
