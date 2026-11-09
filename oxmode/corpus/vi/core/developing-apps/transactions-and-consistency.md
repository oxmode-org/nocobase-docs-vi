---
title: Transaction và tính nhất quán dữ liệu
description: Xác định ranh giới transaction của dịch vụ và kiểm chứng rollback, xử lý đồng thời cùng tác động ngoài kết nối.
---

Transaction commit hoặc rollback một nhóm thao tác trên cùng kết nối cơ sở dữ liệu. Xác định phạm vi theo một kết quả nghiệp vụ, chẳng hạn kiểm tra tác vụ và dự án đích có đủ điều kiện trước khi lưu việc phân công.

Hướng dẫn này dùng mô hình `tutorialTasks` và `tutorialProjects` cùng điều kiện trong [bài thiết lập dữ liệu dự án phiên bản trước](https://github.com/nocobase/website-v3/blob/e7f20aeea2f9e63d396cb99a4e3775902823f3cb/doc/content/core/developing-apps/data-models-and-migrations.md). Bài nhập môn hiện tại dùng mô hình `tasks`. Xem [mã nguồn dịch vụ dự án phiên bản trước](https://github.com/nocobase/website-v3/blob/963e7d7570b6f4b0a4bb37ba48af54bff2f219e6/doc/content/core/developing-apps/server-business-services.md) để đọc toàn bộ dịch vụ.

## Dùng kết nối transaction trong dịch vụ

Đặt các thao tác cần thành công hoặc thất bại cùng nhau trong một transaction. Thực hiện từng thao tác từ `connection` nhận được trong callback.

```ts
await database.transaction(async (connection) => {
  const tasks = connection.repository('tutorialTasks').withPolicy(taskPolicy);
  const projects = connection
    .repository('tutorialProjects')
    .withPolicy(projectPolicy);

  const task = await tasks.findOne({ filter: { id: taskId } });
  if (!task) throw new Error('Task unavailable.');
  const project = await projects.findOne({ filter: { id: projectId } });
  if (!project) throw new Error('Project unavailable.');

  await tasks.updateOne({
    filter: { id: taskId },
    values: { projectId, updatedAt: new Date() },
  });
});
```

Ví dụ minh họa cấu trúc transaction. Trong production, dùng lỗi nghiệp vụ có thể phân biệt để route chuyển thành lỗi API tương ứng. Xem [Route HTTP và API](apis-and-services.md). Lời gọi `database.repository()` ở bên ngoài chạy ngoài transaction này. Nếu bắt lỗi rồi trả về bình thường, transaction có thể commit phần đã thực hiện.

Để kiểm soát ghi đè đồng thời, thêm điều kiện phiên bản hoặc cơ chế tương đương nếu nghiệp vụ yêu cầu. Chỉ kích hoạt tác động bên ngoài như gửi thông báo sau khi commit. `connection.afterCommit()` giúp xác định ranh giới này. Khi tác động bên ngoài thất bại, dữ liệu đã commit vẫn được giữ và thông điệp có thể chưa được giao.

## Truyền kết nối cho các phương thức phối hợp

Truyền kết nối transaction vào các hàm hỗ trợ để toàn bộ thao tác dùng cùng kết nối. Chỉ giữ kết nối trong vòng đời transaction. Tránh đặt nó trên singleton hoặc truyền sang tác vụ nền chạy sau khi transaction kết thúc.

Với kết nối có tên, dùng `database.connection('analytics').transaction(...)`. Transaction trên kết nối mặc định chỉ bao phủ thao tác trên kết nối đó. Cần cơ chế riêng để điều phối transaction phân tán. Xem [Nhiều kết nối cơ sở dữ liệu](multiple-databases.md).

## Áp dụng các ràng buộc nghiệp vụ

| Yêu cầu | Cơ chế bổ sung |
| --- | --- |
| Khóa nghiệp vụ phải duy nhất | Ràng buộc duy nhất ở cơ sở dữ liệu và xử lý xung đột |
| Tham chiếu phải trỏ đến bản ghi có thật | Khóa ngoại và quy tắc xóa phù hợp |
| Bảo toàn thay đổi gần đây của người dùng khác | Điều kiện phiên bản hoặc cơ chế kiểm soát đồng thời khác |
| Chỉ sửa bản ghi được phép | Policy phân quyền gắn với Repository trong transaction |

Việc đọc rồi mới cập nhật vẫn có thể làm mất lượt ghi khi có thao tác đồng thời. Nếu cần khóa lạc quan, bổ sung trường và điều kiện phiên bản rồi kiểm thử trên hệ cơ sở dữ liệu đích.

## Bảo đảm tác động bên ngoài sau commit

Callback của `connection.afterCommit()` chạy sau commit và bị hủy khi rollback. Nếu callback lỗi, dữ liệu vẫn được commit và Promise của transaction vẫn hoàn tất. `onTransactionCallbackError` xử lý lỗi, mặc định ghi cảnh báo. Xem [Cơ chế transaction](../framework/database/transactions.md) để biết quy tắc chờ và transaction lồng nhau.

Email, lời gọi HTTP và thao tác gửi job có vòng đời riêng ngoài rollback cơ sở dữ liệu. Để giao thông điệp sau commit, ghi bản ghi chờ gửi trong cùng transaction, rồi xử lý bằng tiến trình nền có thể khôi phục với khóa idempotency theo nghiệp vụ. Xem [Tác vụ nền và thực thi theo lịch](background-tasks.md).

## Kiểm chứng dữ liệu đã lưu

Dùng cơ sở dữ liệu cô lập để kiểm tra commit thành công, lỗi sau lượt ghi đầu tiên và lỗi trong callback sau commit. Đọc lại dữ liệu sau lỗi để xác nhận rollback.

Kiểm thử thêm tranh chấp khóa duy nhất, xung đột phiên bản, phạm vi phân quyền và tính cô lập giữa các kết nối. SQLite kiểm chứng được các quy tắc cơ bản. Hãy dùng đúng hệ cơ sở dữ liệu đích để kiểm chứng cách cô lập, khóa hoặc thực thi DDL của hệ đó. Bài [API dự án phiên bản trước](https://github.com/nocobase/website-v3/blob/963e7d7570b6f4b0a4bb37ba48af54bff2f219e6/doc/content/core/developing-apps/apis-and-services.md) có liên kết đến các bài kiểm thử endpoint. Xem [Kiểm thử](testing-and-acceptance.md) để tổ chức bài kiểm thử.
