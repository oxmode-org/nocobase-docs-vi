---
title: Phát triển cùng Agent
description: Dùng AGENTS.md và các Skill của ứng dụng để mô tả yêu cầu, review phần hiện thực và kiểm chứng kết quả thực tế.
---

Khi phát triển cùng Agent, hãy giải thích người dùng cần làm được gì, các ràng buộc nghiệp vụ và cách bạn đánh giá là đã xong. Agent dùng quy ước của dự án để tìm mã, hiện thực thay đổi và kiểm chứng kết quả. Bạn không cần biết API nội bộ nào trước khi mô tả yêu cầu.

Hướng dẫn này giả định bạn đã có một ứng dụng. Nếu chưa, hãy bắt đầu với [Tạo ứng dụng](../getting-started/create-app.md). Ở đây, Agent nghĩa là coding agent giúp phát triển ứng dụng; các Agent mà người dùng nghiệp vụ dùng bên trong ứng dụng là một năng lực khác.

## Làm việc trong đúng dự án

Khởi động Agent ở thư mục gốc của ứng dụng để nó đọc được mã nguồn, `package.json`, `AGENTS.md` và `.agents/`. Với dự án đã có, hãy chỉ rõ thư mục làm việc và các tính năng hiện tại để nó không tạo thêm một ứng dụng khác.

Bạn có thể bắt đầu bằng:

```text
Hãy tiếp tục phát triển trong ứng dụng hiện tại. Trước hết đọc AGENTS.md và các Skill liên quan đến việc này.
Tìm hiểu phần hiện thực hiện có và các thay đổi chưa commit. Giữ nguyên các tính năng hiện có và thay đổi của tôi.
Ưu tiên plugin và component sẵn có khi chúng đáp ứng được yêu cầu.
```

Việc này tạo ngữ cảnh; bạn không cần nhắc lại toàn bộ yêu cầu cho mỗi chỉnh sửa nhỏ. Với triển khai, thay đổi cơ sở dữ liệu hay thao tác trên tài khoản, hãy chỉ rõ thêm môi trường đích và phạm vi được phép.

## AGENTS.md và Skill cung cấp gì

Ứng dụng mang theo quy ước phát triển của chính nó. Agent nên đọc hướng dẫn cho đúng phiên bản đã cài thay vì áp dụng quy tắc từ một dự án hay phiên bản khác.

| Vị trí | Nội dung | Duy trì |
| --- | --- | --- |
| `AGENTS.md` | Quy tắc đầu vào và mục lục dẫn đến các hướng dẫn khác | Duy trì cùng ứng dụng và giữ ngắn gọn |
| `.agents/rules/` | Cấu trúc riêng của ứng dụng, quy ước nghiệp vụ và ghi chú tùy biến | Cập nhật khi quy ước thay đổi và liên kết từ `AGENTS.md` |
| `.agents/skills/` | Hướng dẫn phát triển, nâng cấp, triển khai và năng lực do package và plugin cung cấp | Đồng bộ từ các dependency đã cài; đừng sửa các bản sao được tạo ra |

Template hiện tại đồng bộ Skill trong `postinstall`. Nếu script cài đặt bị bỏ qua hoặc thiếu thư mục, hãy chạy lệnh này từ thư mục gốc của ứng dụng:

```bash
pnpm nocobase skills sync
```

Khi phát triển tính năng, hãy bắt đầu với `nocobase-app-development` và đọc các tài liệu tham khảo liên quan đến việc đang làm. Đọc Skill của một plugin khi dùng năng lực của nó. Nâng cấp Core và triển khai có hướng dẫn riêng; khởi động môi trường phát triển không phải quy trình triển khai production.

**Quy tắc của ứng dụng thuộc về ứng dụng; quy tắc dùng chung được duy trì cùng package của chúng.** Ví dụ, hãy ghi múi giờ nghiệp vụ đã thống nhất vào `.agents/rules/`. Đừng để quy ước đó chỉ nằm trong một cuộc hội thoại, hay sửa các file trong `.agents/skills/` mà lần đồng bộ tiếp theo sẽ ghi đè.

## Mô tả yêu cầu bằng ngôn ngữ nghiệp vụ

Một yêu cầu làm được thường trả lời năm câu hỏi:

| Cần giải thích | Ví dụ |
| --- | --- |
| Ai dùng và dùng ở đâu | Thành viên nhóm xem và thay đổi công việc trong danh sách công việc |
| Kết quả mong muốn | Một công việc mới có thể có một người được giao hoặc chưa giao cho ai |
| Quy tắc và ranh giới | Chỉ chọn người dùng đang hoạt động đã có; giữ nguyên công việc cũ và quyền |
| Hành vi khi thất bại | Nếu người dùng chuyển sang không hoạt động, giữ lại tiêu đề công việc và yêu cầu chọn người khác |
| Kết quả nghiệm thu | Người được giao vẫn còn sau khi làm mới; người dùng bị từ chối không thao tác được qua trang lẫn API |

Hãy nói rõ những quyết định nghiệp vụ chưa có. “Chúng tôi chưa quyết định có gán người cho công việc cũ không” tốt hơn là để Agent tự đặt ra một người dùng mặc định. Vị trí file, tên component và phương thức nội bộ có thể lấy từ hướng dẫn của dự án.

### Một yêu cầu bạn có thể dùng

Yêu cầu này áp dụng cho một ứng dụng đã có danh sách công việc và form tạo, trước khi thêm hỗ trợ người được giao:

```text
Hãy thêm người được giao vào ứng dụng công việc hiện có.

Khi tạo công việc, tôi có thể chọn một người dùng đang hoạt động đã có hoặc để chưa giao.
Hiển thị người được giao trong danh sách công việc, hoặc “Chưa giao” khi không có ai.
Giữ nguyên công việc cũ, không tự động gán người, và không thay đổi vai trò hay quyền của bất kỳ ai.

Nếu người dùng đã chọn chuyển sang không hoạt động trước khi lưu, giữ lại tiêu đề công việc tôi đã nhập và yêu cầu tôi chọn lại.
Sau khi lưu và làm mới, người được giao đúng phải vẫn hiển thị.
Theo phong cách giao diện hiện tại của ứng dụng và cung cấp nội dung tiếng Anh và tiếng Trung.

Hiện thực theo hướng dẫn của dự án. Dùng dữ liệu kiểm thử tách biệt để kiểm chứng việc tạo, công việc chưa giao, người dùng không hoạt động và truy cập bị từ chối.
Không thêm việc giao lại, thông báo hay “Công việc của tôi” ở bước này.
Báo cáo những gì đã thay đổi, những gì đã kiểm chứng và những gì chưa kiểm chứng.
```

Yêu cầu này mô tả hành vi mà người dùng hiểu được. Hãy để Agent theo quy ước của ứng dụng về field, quan hệ, policy quyền và bộ chọn. Nếu một hợp đồng API cố định hay thiết kế hiện có là quan trọng, hãy cung cấp tài liệu đó làm ngữ cảnh thay vì chép mọi chi tiết hiện thực vào prompt.

## Chia yêu cầu lớn thành các thay đổi kiểm chứng được

“Xây một hệ thống quản lý dự án hoàn chỉnh” để lại quá nhiều câu hỏi nghiệp vụ chưa trả lời. Hãy bàn giao một kết quả nhỏ và trọn vẹn trước khi mở rộng sang năng lực tiếp theo.

Với việc gán dự án cho công việc, một trình tự có thể là:

1. **Dữ liệu:** định nghĩa quan hệ dự án, cách giữ nguyên công việc cũ và các ràng buộc; kiểm chứng bằng test cơ sở dữ liệu.
2. **API nghiệp vụ:** truy vấn và tạo dự án, thay đổi việc gán công việc; kiểm chứng dữ liệu đầu vào và quyền dữ liệu ở cả hai phía.
3. **Tương tác:** thêm danh sách dự án, hộp thoại tạo và bộ chọn dự án cho công việc; kiểm chứng trạng thái tải, lưu, thất bại và thao tác bằng bàn phím.

Nêu rõ phạm vi và tiêu chí hoàn thành ở mỗi bước. Nếu mới chỉ xong tầng dữ liệu, hãy nói rằng giao diện chưa dùng được. Qua test migration không có nghĩa là người dùng đã quản lý được dự án. Một tính năng nhỏ cũng có thể bàn giao tất cả các phần này cùng lúc; bạn không cần một yêu cầu riêng cho từng file.

## Review phần hiện thực

Kiểm tra hành vi quan sát được trước, rồi đến việc tuân theo quy ước của dự án. Yêu cầu một mô tả thay đổi ngắn kèm tham chiếu file liên quan, bao gồm:

- Dữ liệu cũ và hành vi hiện có còn nguyên không, với migration mới cho thay đổi schema.
- Quyền truy cập trang, action nghiệp vụ và phạm vi dữ liệu có được xử lý riêng không, không cấp quyền ngoài ý muốn.
- Plugin và component sẵn có có được dùng không, và layout, theme hay tính năng không liên quan có bị thay đổi không.
- Lỗi của field có hiển thị cạnh đúng ô nhập không, và lần lưu thất bại có giữ lại dữ liệu đã nhập không.
- Endpoint mới có xuất hiện trong tài liệu API của ứng dụng không, và cả hai ngôn ngữ đã được bao quát chưa.

Một ảnh chụp thành công là không đủ. Một nút bị ẩn không chứng minh endpoint từ chối các lần gọi trái phép; một thông báo thành công không chứng minh cơ sở dữ liệu đã lưu thay đổi.

## Kiểm chứng kết quả thực tế

Yêu cầu Agent phân biệt kiểm tra tự động với tương tác thật trên ứng dụng. Bao quát thay đổi và các hành vi hiện có bị ảnh hưởng, mà không coi việc chạy toàn bộ bộ test không liên quan là bước bắt buộc sau mỗi chỉnh sửa.

| Tầng kiểm chứng | Xác lập được gì |
| --- | --- |
| Kiểm tra tĩnh | Mã đã thay đổi tuân theo format, kiểu dữ liệu và quy ước của dự án |
| Test cơ sở dữ liệu và endpoint | Dữ liệu tách biệt kiểm chứng việc lưu, migration, kiểm tra dữ liệu, phân quyền và trạng thái sau khi thất bại |
| Test trang và component | Form, trạng thái tải, phản hồi và dữ liệu người dùng nhập hoạt động như mong đợi |
| Tương tác trên trình duyệt | Thao tác chạy được trong ứng dụng đang chạy, còn nguyên sau khi làm mới, và thực thi đúng quyền của người dùng thông thường |

Khi có thể, hãy dùng ứng dụng, cơ sở dữ liệu và service phân quyền thật cho quy tắc nghiệp vụ. Chỉ dùng thay thế ở các ranh giới cần thiết như transport bên ngoài hay năng lực trình duyệt còn thiếu trong môi trường test, và giải thích đã thay thế những gì. Đừng mock chính hành vi nghiệp vụ đang được kiểm chứng.

Kiểm chứng trên trình duyệt nên dùng URL điểm vào thực tế mà ứng dụng in ra và các tài khoản kiểm thử riêng. Test cơ sở dữ liệu nên dùng dữ liệu tách biệt; không được xóa dữ liệu nghiệp vụ hiện tại chỉ để qua test. Xem [Xây ứng dụng đầu tiên](../tutorials/build-your-first-feature.md) để có ví dụ cụ thể.

Khi báo lỗi, hãy cung cấp cách tái hiện và kết quả mong đợi:

```text
Sau khi đăng nhập bằng một thành viên chỉ đọc, danh sách công việc ẩn New task, nhưng một request tạo trực tiếp vẫn thành công.
Thành viên chỉ đọc phải không tạo được công việc qua cả trang lẫn API.
Hãy kiểm tra phân quyền phía server, sửa lỗi, và kiểm chứng bằng chính tài khoản thông thường đó. Xác nhận quản trị viên vẫn tạo được công việc.
```

Nếu Agent thiếu môi trường hay tài khoản để kiểm chứng một bước, nó nên nói rõ thiếu gì và đã kiểm tra những gì. Đọc mã không thay thế được việc báo cáo kết quả kiểm chứng thực tế.

## Những gì cần để lại

Một thay đổi hoàn tất nên để lại mã có thể review và bằng chứng kiểm chứng. Yêu cầu một báo cáo ngắn gọn về các thay đổi, các kiểm tra đã qua, các trường hợp chưa kiểm chứng và cách chạy hoặc xem kết quả. Ghi các quy ước mới của ứng dụng vào `.agents/rules/`, và duy trì test cùng với mã nghiệp vụ.

Commit mã, phát hành phiên bản và triển khai lên một môi trường là các hành động khác nhau. Hãy theo phạm vi đã thống nhất cho nhiệm vụ; qua test cục bộ không có nghĩa là ứng dụng đã được triển khai. Để bàn giao lên production, tiếp tục với [Chọn cách triển khai](../deployment/choose-a-deployment-method.md).

Các quy ước về dữ liệu, API, giao diện và nghiệm thu như trên cũng áp dụng khi phát triển thủ công. Phần Không dùng Agent của mỗi chủ đề cung cấp mã và các bước tương ứng.
