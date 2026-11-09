---
title: Đăng ký và gắn React Provider
---

React Provider cung cấp Context cho cây trang, chẳng hạn biểu mẫu, theme hoặc trạng thái tương tác dùng chung. React Provider là component nhận `children`. ServiceProvider đảm nhiệm việc đăng ký dịch vụ ứng dụng.

## Khai báo Provider

Đặt mô-đun này ở điểm tổng hợp của ứng dụng hoặc đóng góp qua `reactProviders` của plugin.
```tsx
import { createContext, useState, type PropsWithChildren } from 'react';
import { defineClientReactProviders } from '@nocobase/app-client/plugins';

export const CompactContext = createContext({
  compact: false,
  setCompact: (_value: boolean) => {},
});

function CompactProvider({ children }: PropsWithChildren) {
  const [compact, setCompact] = useState(false);
  return <CompactContext.Provider value={{ compact, setCompact }}>
    {children}
  </CompactContext.Provider>;
}

export default defineClientReactProviders([
  { name: 'orders.compact', layer: 'extension', component: CompactProvider },
]);
```

Tùy chọn trong ví dụ chỉ tồn tại trong cây React này và trở về mặc định khi tải lại trang. Thêm bộ nhớ trình duyệt hoặc API nếu cần lưu lâu dài.

## Thứ tự và cách gắn

Runtime sắp xếp Provider từ ngoài vào trong theo `layer` và các ràng buộc `before` hoặc `after` đã khai báo. Khai báo thứ tự khi cần một Context khác và chọn tên ổn định, duy nhất.

Runtime phân giải khai báo trước. Provider chỉ mount khi host render `AppClientRoot` sau khi khởi động. Effect cần hủy đăng ký nhận và xử lý được việc mount lại trong chế độ phát triển của React.

## Làm việc với dịch vụ

ServiceProvider quản lý việc đăng ký và vòng đời dịch vụ ứng dụng. React Provider có thể phân giải các dịch vụ đó và chuyển trạng thái nhận được sang dạng component sử dụng được. Khởi tạo kết nối dùng chung ngoài bước render. Để nhận thay đổi từ đối tượng trả về bởi `useService()`, đăng ký theo dõi riêng.

Kiểm thử khả năng truy cập Context, render lại sau cập nhật và dọn dẹp khi unmount. Mở rộng điểm tổng hợp hiện có để Provider tham gia cùng cây trang.

Xem [Dịch vụ client](../services/integration.md#client-services) và [Component và style](../../extension-development/frontend-components.md).

## Giao diện và phần triển khai

- [Hợp đồng React Provider](https://github.com/nocobase/nocobase/blob/015404ecd0dbed33cc46831f73907329c577d375/packages/app/app-client/README.md)
