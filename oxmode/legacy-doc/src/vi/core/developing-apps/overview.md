---
title: Tổng quan phát triển ứng dụng
description: Hiểu về mã ứng dụng, template và plugin, và theo dõi một tính năng từ trang, qua API và service, đến cơ sở dữ liệu.
---

Phát triển một ứng dụng NocoBase nghĩa là hiện thực các quy tắc nghiệp vụ dựa trên cấu trúc và năng lực sẵn có của nó: dữ liệu được lưu thế nào, ai được thao tác trên dữ liệu, và giao diện trình bày kết quả ra sao. Phần này giải thích các chủ đề đó để dùng trong quá trình phát triển. Để xây trọn một tính năng từ đầu đến cuối trước, hãy làm theo [hướng dẫn](../tutorials/build-your-first-feature.md).

Các phần sau dùng một ví dụ dự án và công việc riêng để giải thích từng trách nhiệm. Bảng, endpoint và cấu hình kiểm thử của nó khác với [ví dụ bắt đầu sử dụng](../tutorials/build-your-first-feature.md). Để chạy mã, hãy chuẩn bị mốc ban đầu qua [Mô hình dữ liệu và migration](data-models-and-migrations.md); chỉ đọc các khái niệm thì không cần chạy.

## Mã ứng dụng, template và plugin

Tạo một ứng dụng cho bạn mã nguồn mà bạn có thể thay đổi và duy trì độc lập. Template cung cấp cấu trúc ban đầu, các package Core cung cấp năng lực khi phát triển và khi chạy, còn plugin cung cấp các tính năng tái sử dụng được.

| Phần | Cung cấp gì | Cách bạn dùng |
| --- | --- | --- |
| Mã ứng dụng | Trang, API, mô hình dữ liệu, business service và test của bạn | Thay đổi trong repository của ứng dụng và phát hành cùng ứng dụng |
| Template ứng dụng | Điểm vào, layout, component, cấu hình và quy ước phát triển | Được tạo vào dự án khi tạo ứng dụng; merge thay đổi của template khi nâng cấp |
| Các package nền tảng của Core | Runtime client và server, truy cập dữ liệu, cấu hình và các năng lực liên quan | Dùng API công khai và quản lý phiên bản qua dependency của dự án |
| Plugin | Xác thực, người dùng, phân quyền, tệp và các năng lực tái sử dụng khác | Dùng giao diện công khai, component và cơ chế mở rộng của các plugin đã đăng ký |

Tên dự án và việc gán công việc là chuyện nghiệp vụ của ứng dụng; đăng nhập và quyền theo vai trò có thể dùng plugin sẵn có. Template mặc định đã có sẵn một số plugin. Hãy kiểm tra các năng lực có sẵn trước khi thêm tính năng; cài plugin không phải bước đầu tiên bắt buộc cho mọi thay đổi.

Một trang công việc không cần trở thành plugin. Hãy cân nhắc ranh giới đó khi bạn cần tái sử dụng giữa nhiều ứng dụng với việc phát hành và quản lý phiên bản độc lập. Đừng tùy biến ứng dụng bằng cách sửa phần triển khai của plugin trong `node_modules/`.

Layout và theme được tạo ra cũng thuộc mã nguồn của ứng dụng. Ưu tiên khai báo route, ghép component và cấu hình theme. Khi cần thay đổi cấu trúc framework, hãy ghi lại lý do để [nâng cấp NocoBase Core](upgrade-nocobase-core.md) giữ được phần tùy biến.

## Các phần của một tính năng

“Gán công việc cho một dự án” cần nhiều hơn một bộ chọn:

| Phần | Trả lời câu hỏi | Vị trí trong ví dụ |
| --- | --- | --- |
| Mô hình dữ liệu | Dự án được lưu thế nào, công việc cũ thì sao, và nếu dự án không tồn tại thì sao? | `database/main/migrations/` |
| Business service | Công việc này có được thay đổi không, dự án đích có hợp lệ không, và liên kết được lưu thế nào? | `server/providers/tutorial-project-service.ts` |
| HTTP API | Ai đang gọi, dữ liệu đầu vào có hợp lệ không, và trả về gì? | `server/routes/tutorial-projects.ts` |
| Khai báo quyền và đăng ký service | Có những action nghiệp vụ nào, và API lấy service thế nào? | `server/providers/tutorial-projects.ts` |
| Route trang và điều hướng | Người dùng vào từ đâu, và ai được mở trang? | `client/routes.ts` |
| Trang và tương tác | Dự án hiện tại, các lựa chọn có thể chọn, trạng thái tải và kết quả lưu được trình bày thế nào? | `client/pages/tasks/[taskId]/project.tsx` |
| Nội dung chữ | Nhãn, gợi ý field và thông báo lỗi bằng tiếng Anh và tiếng Trung là gì? | `client/locales/` |
| Kiểm chứng | Dữ liệu có được giữ nguyên, thao tác được phép có thành công, và thao tác không được phép có bị từ chối không? | `tests/` |

Đây là bản đồ trách nhiệm, không phải yêu cầu tạo tất cả các file này cho mọi thay đổi. Sửa chữ trên form không cần migration; thêm một field không cần xây lại phần đăng nhập. Hãy xác định yêu cầu thay đổi những gì, rồi sửa đúng các phần đó. Xem [Cấu trúc dự án](../getting-started/project-structure.md) để có hướng dẫn đầy đủ về các thư mục.

## Một lần lưu đi đến cơ sở dữ liệu thế nào

Khi người dùng chọn một dự án trong Change project và lưu, request đi theo đường sau:

1. **Trang thu thập dữ liệu đầu vào.** Nó dùng `useApiClient()` để gửi `PATCH tutorialTasks/:id/project` với ID dự án, hoặc `null` để bỏ liên kết. Đường dẫn phía client là tương đối so với API root của ứng dụng, không cố định địa chỉ server hay `/main`.
2. **Endpoint xử lý ranh giới request.** Nó kiểm tra xác thực, quyền gán, ID công việc và body của request, rồi lấy các policy quyền dữ liệu của thao tác cho cả công việc lẫn dự án.
3. **Service áp dụng quy tắc nghiệp vụ.** Endpoint gọi `TutorialProjectService.assignTask()`. Service đọc công việc và dự án đích qua các Repository đã gắn policy, rồi cập nhật liên kết. Ví dụ này gom các thao tác cơ sở dữ liệu đó vào một transaction.
4. **Cơ sở dữ liệu lưu kết quả.** Một migration đã tạo field và khóa ngoại từ trước, nên cơ sở dữ liệu từ chối liên kết với dự án không tồn tại. Migration thay đổi cấu trúc từ trước; chúng không chạy cho mỗi lần lưu.
5. **Kết quả trả về trang.** Endpoint trả về giá trị đã lưu, và trang cập nhật danh sách công việc cùng phản hồi cho người dùng. Khi thất bại, dữ liệu đã nhập được giữ lại và lỗi của field gắn với bộ chọn. Việc sửa dừng lại nếu công việc không còn tồn tại.

Service hiện thực quy tắc nghiệp vụ; Provider đăng ký service đó vào container của ứng dụng. Đó là hai trách nhiệm khác nhau. Endpoint phân giải service qua token của nó. Service không phụ thuộc vào một trang hay đọc HTTP Context. Một điểm vào khác có thể tái sử dụng các quy tắc đó, nhưng vẫn phải tự xác lập danh tính, quyền và kiểm tra dữ liệu đầu vào.

### Phân quyền áp dụng xuyên suốt đường đi

Quyền truy cập trang kiểm soát điều hướng, quyền nghiệp vụ kiểm soát thao tác, và phạm vi dữ liệu kiểm soát những bản ghi nào một thao tác có thể tác động. Ẩn một nút chỉ là phản hồi trên giao diện và không thay thế được kiểm tra phía server.

Đổi dự án của một công việc cần kiểm tra cả hai phía: người dùng phải được phép sửa công việc và gán nó vào dự án đích. Quyền xem một dự án không cấp quyền gán. Khóa ngoại chỉ xác lập rằng dự án tồn tại, không phải rằng người gọi được dùng nó.

### File phải được đăng ký

Nối các file mới qua các điểm vào sẵn có của ứng dụng:

- `client/routes.ts` khai báo trang và điều hướng; component trang nằm trong `client/pages/`.
- `server/routes/index.ts` gom các endpoint của ứng dụng.
- `server/providers/index.ts` gom các Provider của service.
- `client/runtime.ts` và `server/runtime.ts` ghép route, plugin, cấu hình và service của từng phía.

Thêm một tính năng nghiệp vụ thường cần cập nhật các điểm đăng ký này thay vì viết lại phần khởi động client hay server. Một file tồn tại không có nghĩa là phần đóng góp của nó đã được đăng ký.

## Chia nhỏ một thay đổi nghiệp vụ

Trước hết hãy mô tả kết quả bằng ngôn ngữ nghiệp vụ: “Người dùng có thể gán công việc vào một dự án hợp lệ, công việc cũ không thay đổi, và lần lưu thất bại giữ lại dữ liệu đã nhập.” Sau đó trả lời:

1. **Dữ liệu thay đổi thế nào?** Field mới có được để trống không, bản ghi cũ được xử lý thế nào, và quy tắc nào cần ràng buộc ở cơ sở dữ liệu?
2. **Thao tác được phân quyền thế nào?** Ai được mở trang và gọi endpoint, và họ được thao tác trên những công việc và dự án nào?
3. **Hợp đồng API là gì?** Đầu vào, đầu ra và các trường hợp thất bại là gì, và quy tắc nào cần tái sử dụng?
4. **Trang phản hồi ra sao?** Điều gì xảy ra khi đang tải, khi kết quả trống, khi bị từ chối quyền, khi thành công và khi thất bại?
5. **Kiểm chứng thế nào?** Kiểm tra đường thành công và đường bị từ chối, cùng hành vi hiện có, bằng dữ liệu kiểm thử tách biệt.

Cách này cũng dùng được với Agent. Bạn đưa ra các quyết định nghiệp vụ; Agent có thể đọc quy ước của dự án, hiện thực và kiểm chứng kết quả. Xem [Phát triển cùng Agent](develop-with-an-agent.md).

## Tiếp tục với câu hỏi hiện tại của bạn

| Việc đang làm | Hướng dẫn |
| --- | --- |
| Thêm field, quan hệ hoặc ràng buộc cho dữ liệu hiện có | [Mô hình dữ liệu và migration](data-models-and-migrations.md) |
| Kiểm tra request, tái sử dụng quy tắc nghiệp vụ, thực thi quyền và khai báo API | [Dịch vụ nghiệp vụ và HTTP API](apis-and-services.md) |
| Xây danh sách, form và hộp thoại có phản hồi khi tải và khi lỗi | [UI component và tương tác](pages-and-interactions.md) |
| Viết truy vấn, thao tác hàng loạt và transaction | [Truy vấn và thao tác dữ liệu](querying-data.md) |
| Tổ chức trang, menu và điều kiện truy cập | [Trang, route và điều hướng](pages-routes-and-navigation.md) |
| Cấu hình tham số khi chạy và phần quản trị | [Cấu hình ứng dụng và cài đặt hệ thống](configuration-and-settings.md) |
| Điều chỉnh ngôn ngữ và giao diện | [Đa ngôn ngữ và theme](localization-and-themes.md) |
| Xem, cập nhật hoặc mở rộng các năng lực đã đăng ký | [Quản lý plugin](manage-plugins.md) |
| Chọn cách kiểm chứng và hoàn tất nghiệm thu | [Kiểm thử và nghiệm thu](testing-and-acceptance.md) |
| Hoàn thành một tính năng chạy được trước | [Xây ứng dụng đầu tiên](../tutorials/build-your-first-feature.md) |

Các hướng dẫn theo chủ đề dùng chung một ví dụ dự án để bạn so sánh quy ước giữa chúng. Hãy đọc thẳng chủ đề bạn cần; để chạy mã của nó, hãy chuẩn bị model, endpoint và quyền được liệt kê trong phần điều kiện cần của hướng dẫn đó.
