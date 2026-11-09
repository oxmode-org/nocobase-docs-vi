---
title: Tạo dự án
description: Một dự án gom các issue và mã nguồn liên quan lại với nhau. Khi tạo dự án, bạn chọn repository cho nó. Repository mới mặc định được khởi tạo từ template ứng dụng NocoBase, cho bạn một ứng dụng xây trên Core, để Agent xây nghiệp vụ của bạn trên một kiến trúc nhất quán.
---

Bất kỳ thành viên nào trong nhóm cũng có thể tạo dự án, và người tạo mặc định trở thành trưởng dự án.

## Tạo dự án

1. Mở **Development › Projects** và bấm **New project**.
2. Nhập tên và mô tả, như "Supplier Management".
3. Chọn **Code location** (nơi đặt mã):

   | Nơi đặt mã | Phù hợp cho |
   | --- | --- |
   | New repository | Một hệ thống nghiệp vụ mới. Studio tạo repository qua một kết nối Git và khởi tạo nó |
   | Existing repository | Một repository nhóm đã có |
   | Add later | Tạo dự án bây giờ và thêm repository sau trong **Project settings › Code repositories**. Khi chưa có repository, Agent chỉ làm được các issue không liên quan đến mã |

4. Với **New repository**, chọn một kết nối Git và nhập tên repository. Thường nên giữ là **Private repository**. Kết nối Git quyết định chủ sở hữu, nên muốn tạo dưới tài khoản hoặc tổ chức khác thì dùng một kết nối Git khác. Với **Existing repository**, chọn một trong các repository mà kết nối Git truy cập được.
5. Chọn cách khởi tạo, như mô tả ở phần tiếp theo.
6. Bấm **Create project**.

## Chọn cách khởi tạo repository

Với repository mới:

| Cách khởi tạo | Kết quả |
| --- | --- |
| NocoBase app | Mặc định. Một Agent tạo ứng dụng từ template ứng dụng NocoBase trên một runtime và push lên nhánh mặc định làm commit đầu tiên. Mọi phát triển sau này diễn ra trong ứng dụng này |
| From a prompt | Một Agent tạo commit đầu tiên theo prompt bạn viết và push lên nhánh mặc định |
| Empty | Chỉ có commit ban đầu của nền tảng lưu trữ mã, không khởi tạo gì |

Với repository có sẵn, mặc định là **No initialization**, dùng nguyên repository như hiện tại. Bạn cũng có thể chọn:

- **NocoBase app**: một Agent tạo ứng dụng từ template đã chọn, giữ các file đã có trong repository, và gửi thay đổi qua một nhánh và PR.
- **From a prompt**: ví dụ "Đọc mã và thêm một AGENTS.md". Thay đổi cũng đi qua một nhánh và PR.

Khởi tạo bằng NocoBase app cần một runtime trực tuyến có Node.js 24 và pnpm. Nếu chưa có runtime nào trực tuyến, dự án vẫn được tạo ngay, và việc khởi tạo bắt đầu khi có runtime trực tuyến.

## Issue khởi tạo

Khi repository cần khởi tạo, Studio tạo một issue "Initialize project" và giao cho Agent điều phối. Agent điều phối giao bước cho một Agent phù hợp, nói rõ cần làm gì và khi nào xem là xong. Mọi issue tạo trong dự án sau đó đều chờ cho đến khi issue này xong.

Khởi tạo bằng NocoBase app sẽ cài dependency và thường mất mười đến hai mươi phút. Trong lúc đó, trang issue cho biết Agent nào đang làm, đã bao lâu và trên runtime nào.

- Repository mới: commit đầu tiên lên nhánh mặc định, và khi các kiểm tra đạt (hoặc nếu repository không có kiểm tra), issue tự hoàn thành.
- Repository có sẵn: thay đổi khởi tạo đến dưới dạng một PR, và issue xong khi bạn nghiệm thu và merge.

**Xong khi**: issue "Initialize project" ở trạng thái **Done** và nhánh mặc định có mã ứng dụng. Trên trang tổng quan dự án, mục "Finish the initialization" biến mất khỏi **Next steps**.

## Sau đó

- Để mỗi PR có preview và tự động triển khai sau khi merge, hãy [kết nối CI](ci.md). Mục **Next steps** trên trang tổng quan dự án sẽ nhắc bạn.
- Điều chỉnh trưởng dự án, thành viên, repository, biến và khóa bí mật, cùng các Skill mặc định trong cài đặt dự án. Xem [Cài đặt dự án](../project/settings.md).

> [!NOTE] "The App could not confirm access" khi tạo repository
> GitHub App được cài với quyền truy cập chỉ một số repository, nên nó không truy cập được repository Studio vừa tạo. Hãy thêm repository vào cài đặt installation của App trên GitHub, rồi tạo lại dự án và chọn **Existing repository**. Xem [Kết nối Git](git.md).

Tiếp theo, [kết nối CI](ci.md), hoặc đi thẳng đến [yêu cầu đầu tiên](first-request.md).
