---
title: Triển khai lên Studio
description: Tải một gói ứng dụng lên Studio hiện có và kiểm tra ứng dụng đã triển khai.
---

Hướng dẫn này dùng ứng dụng quản lý công việc làm ví dụ minh họa và cũng áp dụng cho các ứng dụng NocoBase Core của riêng bạn. Xác nhận môi trường đích qua [Chọn cách triển khai](../deployment/choose-a-deployment-method.md). Với dự án của bạn, hãy thay tên ứng dụng, đường dẫn và các bước nghiệm thu nghiệp vụ trong ví dụ.

Một NocoBase Studio có sẵn sẽ quản lý bản phát hành, môi trường, cấu hình và tiến trình của ứng dụng. Máy phát triển build ra gói. Hãy chắc chắn ứng dụng đã qua kiểm thử và bạn có quyền tạo, tải lên, cấu hình và triển khai ứng dụng trong Studio đích.

Hướng dẫn này dùng một môi trường chấp nhận gói Linux x64, Node.js 24, với một ứng dụng hướng dẫn độc lập và cơ sở dữ liệu mới.

## Cùng Agent

Từ thư mục mã nguồn của ứng dụng, thay URL Studio, tên ứng dụng và môi trường bên dưới. Chọn một ID ứng dụng mới nếu ID ví dụ đã tồn tại:

```text
Hãy tạo một ứng dụng hướng dẫn riêng trong Studio này và triển khai ứng dụng công việc hiện tại.

URL Studio: <địa chỉ đầy đủ kèm đường dẫn>
ID ứng dụng mới: tasks-tutorial
Tên hiển thị: Tasks tutorial
Môi trường triển khai: <tên hoặc ID môi trường tôi chọn>
Dùng cơ sở dữ liệu mới, không nhập dữ liệu phát triển hay thêm công việc mẫu.

Làm theo hướng dẫn triển khai lên Studio của dự án. Kiểm tra tài khoản đang đăng nhập, môi trường đích và ứng dụng mới trước khi thay đổi; không động đến các ứng dụng hiện có.
Chuẩn bị và phát hành phiên bản ứng dụng, thiết lập đăng nhập quản trị viên và giữ lại các khóa bí mật do Studio tạo.
Nếu tôi cần đăng nhập qua trình duyệt hay cung cấp thông tin xác thực, hãy cho tôi biết làm ở đâu và không đưa mật khẩu vào báo cáo.

Kiểm tra đăng nhập, các thao tác với công việc và quyền của người đọc.
Chỉ khởi động lại ứng dụng mới này và xác nhận các công việc của nó vẫn còn.
Báo cáo URL thực tế, kết quả kiểm tra và phần việc còn lại.
```

Nếu chưa có `nb-studio`, hãy lấy lệnh cài đặt từ mục **Use Studio in your agent** của Studio đích, rồi chạy `nb-studio skills install`. CLI cần Node.js 24 trở lên. Thông tin xác thực để tải bản cài và thông tin đăng nhập Studio phục vụ hai mục đích khác nhau.

```bash
nb-studio --profile tutorial login --server https://studio.example.com/main
nb-studio --profile tutorial whoami
```

Xác nhận mã thiết bị trên trình duyệt và dùng lại phiên đăng nhập đúng nếu đã có. Hãy để Agent làm theo hướng dẫn riêng của Studio để chọn cách phát hành được hỗ trợ. Một ứng dụng cục bộ chưa liên kết repository cần quy trình tải lên qua trang web bên dưới; yêu cầu không cần liệt kê các lệnh CLI.

## Không dùng Agent

### 1. Chọn môi trường và tạo ứng dụng

Trong phần quản lý phát hành của Studio, xem các môi trường triển khai. Xác nhận môi trường hỗ trợ gói nén, nền tảng, quy tắc URL và chính sách duyệt. Tạo một ứng dụng độc lập với ID duy nhất như `tasks-tutorial`. Buổi diễn tập dùng một môi trường preview có sẵn; hãy chọn môi trường phù hợp cho lần triển khai thực tế của bạn.

Việc này tạo một đích triển khai. Bạn không chạy lại create-app trên server Studio.

### 2. Build và tải lên

```bash
pnpm build --target linux-x64 --node-version 24 --tar
```

Mở trang **Deployments** của ứng dụng, chọn **Upload a release**, và chọn `storage/exports/dist.tar.gz`.

![Chọn gói ứng dụng trong Studio.](/assets/core/tutorials/deployment/studio-upload.png)

Nếu có, hãy cung cấp commit nguồn thật tương ứng; nếu không, để trống trường commit tùy chọn. Tải lên sẽ tạo một bản phát hành với phiên bản, loại gói, checksum và kích thước. Nó không bắt đầu triển khai.

### 3. Cấu hình biến

Trang **Variables** của ứng dụng hiển thị các biến mà bản phát hành đã tải lên khai báo, kèm cờ khóa bí mật và cờ chỉ áp dụng ở lần khởi động đầu.

| Biến | Cần đặt hoặc kiểm tra |
| --- | --- |
| `INITIAL_ADMIN_USERNAME` | Quản trị viên ban đầu của ứng dụng mới |
| `INITIAL_ADMIN_PASSWORD` | Mật khẩu của bạn, lưu dưới dạng Secret trước lần khởi động đầu |
| `APP_SAMPLE_DATA` | `false` |
| `DB_DIALECT` và các biến kết nối | Ở đây là một cơ sở dữ liệu SQLite mới, hoặc cơ sở dữ liệu bên ngoài thực tế của bạn |
| `APP_PUBLIC_ORIGIN` | Origin bên ngoài do Studio tạo, không kèm đường dẫn ứng dụng |
| `SECRETS_KEYS` | Giữ nguyên giá trị do Studio tạo qua các lần khởi động lại và cập nhật |

Studio quản lý đường dẫn runtime, cổng và lưu trữ. Đừng áp dụng các thiết lập pm2 hay Compose dành cho triển khai độc lập. Các thiết lập chỉ áp dụng ở lần khởi động đầu sẽ không đặt lại tài khoản hiện có khi bị thay đổi về sau.

Để cấu hình bằng CLI, xem `nb-studio docs app env set`. Ví dụ:

```bash
nb-studio --profile tutorial app env set tasks-tutorial APP_SAMPLE_DATA false
```

Với mật khẩu, hãy dùng trường Secret hoặc tùy chọn `--from-env` được hỗ trợ, không dùng tham số lệnh thông thường.

### 4. Triển khai bản phát hành

Chọn thao tác triển khai của bản phát hành và chờ bản ghi triển khai thành công. Xem trạng thái runtime và log. Môi trường được bảo vệ có thể cần duyệt; một yêu cầu đã gửi chưa phải là một lần triển khai thành công.

![Bản phát hành trong Studio và lịch sử triển khai thành công.](/assets/core/tutorials/deployment/studio-release.png)

Với môi trường không được bảo vệ, một bản phát hành có sẵn cũng có thể được triển khai qua CLI:

```bash
nb-studio --profile tutorial app deploy tasks-tutorial \
  --release <release-id> --wait true --json
nb-studio --profile tutorial app get tasks-tutorial --json
```

Dùng ID của bản phát hành đã tải lên, không phải chuỗi phiên bản. Nếu chờ quá thời gian, hãy xem bản ghi triển khai trước khi gửi yêu cầu khác.

### 5. Mở và kiểm tra ứng dụng

Dùng URL truy cập thực tế trên trang tổng quan của ứng dụng. Trang quản lý của Studio và ứng dụng đã triển khai có đường dẫn vào riêng, ví dụ `/main/` và `/tasks-tutorial/`. Đăng nhập bằng quản trị viên riêng của ứng dụng mới. Với cơ sở dữ liệu mới, danh sách công việc trống là bình thường. Ví dụ bắt đầu sử dụng hiện tại khởi tạo các vai trò cho công việc qua seed bắt buộc; người dùng của nhóm phát triển và việc gán vai trò không được sao chép theo bản phát hành.

Tạo, hoàn thành và mở lại một công việc; làm mới trang. Cấu hình một thành viên chỉ đọc thông thường và kiểm tra rằng thao tác ghi bị từ chối. Chỉ khởi động lại ứng dụng này trong Studio, rồi kiểm tra bản ghi đó vẫn còn. Lệnh CLI tương đương là `nb-studio --profile tutorial app restart tasks-tutorial`.

## Khi repository đã được liên kết

Nếu Studio xác minh được repository và commit nguồn đầy đủ, Agent hoặc CI có thể tải lên và triển khai bằng:

```bash
nb-studio --profile tutorial deploy \
  --app tasks-tutorial \
  --repository nocobase/app-tutorials \
  --sha <full-source-commit> \
  --file storage/exports/dist.tar.gz \
  --json
```

Repository này là private: tích hợp của Studio cần quyền truy cập. Tạo repository GitHub này không tự động liên kết hay ủy quyền nó trong Studio. Buổi diễn tập được ghi lại dùng cách tải lên qua trang web; đừng bịa ra commit cho mã chưa commit.

## Phát hành bản mới

Kiểm thử và build tính năng mới, tải lên **cùng ứng dụng**, rồi triển khai lên môi trường hiện có. Giữ nguyên cơ sở dữ liệu, tệp và các khóa bí mật cố định. Xem lại bản sao lưu, khả năng tương thích của migration và cách khôi phục trước khi phát hành; xem [Phát hành phiên bản ứng dụng](../deployment/publish-app-release.md) để có cái nhìn tổng quan. Sau đó kiểm tra dữ liệu công việc cũ, vai trò và hành vi mới.

Với Agent, hãy cung cấp App ID ban đầu, môi trường và đường dẫn gói nén mới, và yêu cầu các kiểm tra tương tự. Chuyển bản phát hành không đảo ngược dữ liệu nghiệp vụ đã ghi và không thay thế việc khôi phục dữ liệu.

Buổi diễn tập `.77` ban đầu đã tạo một ứng dụng Studio độc lập, tải lên qua giao diện, cấu hình biến, triển khai, kiểm tra đăng nhập/quyền với công việc thực tế và kiểm tra dữ liệu còn nguyên sau khởi động lại. Duyệt cho môi trường được bảo vệ, migration cơ sở dữ liệu bên ngoài và rollback giữa các phiên bản chưa được thực hiện. Các ảnh chụp Studio này cho thấy lần triển khai đó; chúng không cho thấy một lần triển khai mới của ví dụ npm `.81` hiện tại.
