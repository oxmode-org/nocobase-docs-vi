---
title: Tác vụ theo lịch
description: Khai báo lịch nghiệp vụ, xem từng lượt kích hoạt và điều khiển thực thi.
---

## Năng lực

`@nocobase/app-plugin-scheduler` khai báo lịch trong mã, giao việc thực thi cho Jobs của host và ghi lại từng lượt kích hoạt. Dùng cho đồng bộ, báo cáo và kiểm tra nghiệp vụ định kỳ.

Khai báo lịch và đích thực thi trong mã. Ứng dụng xây giao diện quản lý cho những lịch đã khai báo.

## Tình huống và ví dụ

### Báo cáo nghiệp vụ hằng ngày

Tạo báo cáo lúc 02:00 UTC. Triển khai đích, khai báo lịch rồi cho quản trị viên xem từng lượt kích hoạt và tắt lịch khi cần.

**Prompt phát triển** cho Coding Agent trong thư mục ứng dụng.

```text
Dùng Scheduler để tạo báo cáo nghiệp vụ hằng ngày lúc 02:00 UTC. Triển khai
và đăng ký app.daily-report trước, rồi khai báo khóa lịch ổn định và tích hợp
Jobs của host. Thêm danh sách, lịch sử kích hoạt và nút bật tắt có kiểm tra quyền.
Giới hạn giao diện ở các thao tác này để người dùng chỉ chạy tác vụ đã đăng ký.
Kiểm tra múi giờ, kết quả nghiệp vụ, lỗi và thao tác tắt bằng dữ liệu cô lập
và khoảng chạy ngắn. Với tác vụ bất đồng bộ, bổ sung cách tra trạng thái.
Chỉ finalize khi manifest triển khai đầy đủ.
```

**Xong khi** lịch tạo báo cáo thật theo múi giờ đã khai báo và ngừng tạo công việc mới sau khi bị tắt.

## Nguyên tắc và triển khai

Áp dụng theo cấu trúc tệp thực tế của ứng dụng.

| Phạm vi tích hợp | Thay đổi mã hoặc cấu hình | Kết quả |
| --- | --- | --- |
| Provider Server và đích | Đăng ký đích, kiểm tra đầu vào và khóa ổn định | Đồng bộ khi khởi động nhận diện lịch nghiệp vụ |
| Cấu hình Jobs và bước tắt | Chọn executor và giữ dependency tới khi dọn xong | Điều phối lập lịch và tắt ứng dụng |
| Giao diện quản lý | Đọc lịch và lượt kích hoạt, bảo vệ nút điều khiển | Quản trị viên kiểm tra và điều khiển các lượt chạy sau |

### Tích hợp

Đăng ký Server, Client và điểm vào CLI cần thiết, áp dụng migration rồi ghép `JobExecutorServiceProvider`. Ứng dụng xây trang quản lý dựa trên `/api/scheduler`.

Lịch dùng `jobs.default` hoặc cấu hình được chọn qua `scheduler.jobs` hay `SCHEDULER_JOBS`. Backend bộ nhớ phục vụ một tiến trình. Dùng Redis để điều phối nhiều instance. Giữ `attempts` của cấu hình ở `1` để đích nghiệp vụ quản lý việc khôi phục lỗi.

### Khai báo lịch

Trong `register()` hoặc `boot()` của Provider, phân giải `schedulerServiceToken` từ `/server/tokens`.

1. Gọi `registerTarget()` với loại đích, bước kiểm tra và cách khởi chạy.
2. Gọi `defineSchedule()` với khóa ổn định trên toàn ứng dụng, quy tắc và đích.
3. Với công việc bất đồng bộ, cung cấp cách tra trạng thái và báo kết quả cuối qua handle của đích.

Sau khi đăng ký `app.daily-report`, đặt lịch hằng ngày lúc 02:00 UTC.

```ts
scheduler.defineSchedule({
  key: 'daily-report',
  title: 'Daily report',
  schedule: { cron: '0 0 2 * * *', timezone: 'UTC' },
  target: { type: 'app.daily-report', config: {} },
});
```

`scheduler` là dịch vụ đã phân giải. Ứng dụng triển khai đích. Đồng bộ khi khởi động đọc các khai báo trong mã.

### Xem và điều khiển

| Thao tác | Endpoint |
| --- | --- |
| Liệt kê | `GET /api/scheduler/schedules` |
| Chi tiết | `GET /api/scheduler/schedules/:id` |
| Các lượt kích hoạt | `GET /api/scheduler/schedules/:id/occurrences` |
| Bật hoặc tắt | `POST /api/scheduler/schedules/:id/enable` hoặc `/disable` |

Mọi endpoint yêu cầu `page:scheduler.schedules/access`. Giao diện quản lý chỉ xem lịch đã khai báo và bật hoặc tắt chúng. Cấu hình đích thô được giữ ở server.

Sau khi đăng ký CLI, chạy `pnpm nocobase scheduler sync` để đồng bộ khai báo. Chỉ dùng `--finalize` với manifest triển khai đầy đủ vì cờ này tắt định nghĩa vắng mặt.

## Ràng buộc phát triển với AI và kiểm chứng

- Kiểm tra đăng ký, kiểm tra đầu vào và kết quả thật của đích nghiệp vụ sau khi khai báo lịch.
- Dùng backend Jobs phù hợp với số instance. Kiểm thử riêng phối hợp phân tán nếu triển khai nhiều tiến trình.
- Kiểm tra tra trạng thái khi mất callback hoàn tất. Chỉ finalize manifest đầy đủ để giữ các lịch hợp lệ.

### Kiểm chứng

Dùng khoảng chạy thử ngắn để kiểm tra múi giờ, lần chạy tiếp theo, từng lượt kích hoạt và kết quả nghiệp vụ, rồi kiểm tra thao tác tắt. Nếu mất thông báo hoàn tất, đích bất đồng bộ cần phục hồi trạng thái bằng cơ chế tra cứu.

Khi tắt, giữ dependency hoạt động tới khi `drain()` của Scheduler hoàn tất. Theo dõi riêng công việc bên ngoài hoặc bước chờ con người. Xem [Tác vụ nền](../../framework/background/jobs.md), [Lập lịch](../../framework/background/scheduling.md) và [Quản lý plugin](../../developing-apps/manage-plugins.md).

Yêu cầu Agent báo thay đổi, bước kiểm tra đã chạy và mục chưa xác minh. Xem [Tiếp tục phát triển ứng dụng](../../../getting-started/develop-your-first-app.md#refine-and-continue-developing) và [Kiểm thử](../../developing-apps/testing-and-acceptance.md).

[Nguồn và các điểm xuất công khai của plugin](https://github.com/nocobase/nocobase/tree/015404ecd0dbed33cc46831f73907329c577d375/packages/plugins/app-plugin-scheduler)
