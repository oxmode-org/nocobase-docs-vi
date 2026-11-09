---
title: Giao thức và adapter WebSocket
---

`@nocobase/app-websocket` định nghĩa giao diện socket dùng chung giữa host và ứng dụng, đồng thời xử lý nâng cấp kết nối từ Node HTTP Server. Dùng [Topic thời gian thực](topics.md) để cập nhật trang. Dùng lớp này khi triển khai host hoặc giao thức khác.

## Trách nhiệm

| Lớp | Trách nhiệm |
| --- | --- |
| Adapter WebSocket | Nâng cấp HTTP, vòng đời kết nối, giới hạn thông điệp và ping/pong nguyên bản |
| Giao thức thời gian thực | Đăng ký topic, xác nhận, danh tính, quyền truy cập tài nguyên, giao thông điệp và khôi phục đăng ký |

Adapter Node dùng `ws` ở chế độ `noServer` để HTTP server hiện có quyết định có chấp nhận nâng cấp hay không. `AppWebSocketHandler` nhận `Request` rồi trả handler sự kiện, `Response` từ chối hoặc kết quả rỗng nếu bỏ qua yêu cầu.

## Giao diện kết nối

`AppWebSocket` cung cấp `url`, `protocol`, `readyState`, `bufferedAmount` tùy chọn và các phương thức `send()`, `close()`. Handler triển khai `onOpen`, `onMessage`, `onClose` và `onError`. Thông điệp là chuỗi hoặc `ArrayBuffer`.

Host nhận biết yêu cầu nâng cấp bằng `isWebSocketUpgrade()`, chuyển đổi qua `createWebSocketUpgradeRequest()`, rồi gọi `acceptWebSocketUpgrade()` hoặc `rejectWebSocketUpgrade()`. Ứng dụng và plugin thông thường dùng WebSocket server của host.

## Đường dẫn và proxy

Realtime dùng `/ws` bên trong ứng dụng. Đường dẫn công khai có thể thêm tiền tố gắn ứng dụng. Dùng cơ chế phân giải URL của host để thích ứng với đường dẫn triển khai. Yêu cầu HTTP thường đến đường dẫn này nhận phản hồi yêu cầu nâng cấp.

Reverse proxy phải chuyển tiếp nâng cấp, giữ đúng host và giao thức công khai, đồng thời cho phép thời gian chờ khi kết nối rảnh đủ dài. Adapter ứng dụng từ chối kết nối khác origin từ trình duyệt. Việc ghi lại origin hoặc giao thức sai có thể khiến bắt tay bị từ chối.

## Danh tính và dọn dẹp

Adapter ứng dụng xác định danh tính khi bắt tay, rồi kiểm tra lại hiệu lực phiên khi có hoạt động và trong các lần kiểm tra lúc rảnh. Xác thực danh tính bằng cơ chế phiên hoặc thông tin xác thực hợp lệ. Adapter tùy chỉnh chịu trách nhiệm kiểm tra origin, xác thực, giới hạn thông điệp và heartbeat.

Giải phóng đăng ký và listener khi đóng hoặc gặp lỗi. Chấm dứt kết nối khi tắt. Giới hạn bộ đệm gửi để dữ liệu không tích lũy vô hạn khi client chậm. Sau khi kết nối, giao thức tiếp tục kiểm tra quyền topic và tính hợp lệ của thông điệp.

## Giao diện và phần triển khai

- [Giao diện WebSocket và adapter Node](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-websocket/src/index.ts)
- [Lớp truyền tải Realtime](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-server/src/realtime/websocket.ts)
