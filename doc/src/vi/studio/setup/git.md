---
title: Kết nối Git
description: Kết nối GitHub, GitLab hoặc Gitee trong Settings › Integrations › Git để Studio tạo và đọc repository, và để Agent mở PR.
---

Studio truy cập nền tảng lưu trữ mã của bạn qua một kết nối Git. Nó dùng kết nối này để tạo repository, đọc repository, theo dõi PR và kết quả kiểm tra, và merge từ Studio. Bạn có thể tạo dự án mà không cần kết nối Git, nhưng sẽ không có PR, kiểm tra hay preview.

## Kết nối GitHub

Studio tạo giúp bạn một GitHub App trên GitHub, với mọi quyền cần thiết đã được điền sẵn. Bạn xác nhận trên GitHub, rồi cài App vào tài khoản hoặc tổ chức của mình.

1. Mở **Settings › Integrations › Git**, bấm **Add connection** và chọn **GitHub**.
2. Ở **Owner of the app**, chọn **My account** hoặc **An organization**. Với GitHub Enterprise Server tự host, hãy chọn mục đó và nhập địa chỉ server.
3. Đặt **Webhook**. Xem [Có nên bật webhook](#có-nên-bật-webhook) bên dưới.
4. Bấm **Create on GitHub**. Đặt tên App trên GitHub và xác nhận.
5. Sau đó cài App vào tài khoản hoặc tổ chức của bạn. Ở **Repository access**, chọn **All repositories** để Studio truy cập được các repository nó tạo ra.
6. Khi cài xong, quay lại Studio, kết nối sẽ xuất hiện trong **Settings › Integrations › Git**.

Nếu đã có GitHub App, bấm **Already have a GitHub App? Enter it manually**. Một App có thể cài vào nhiều tài khoản hoặc tổ chức. Bấm **Add installation** trong kết nối.

> [!NOTE] Chỉ cho App truy cập một số repository
> Nếu bạn chọn **Only select repositories** khi cài, App sẽ không truy cập được các repository Studio tạo ra, và khi tạo dự án sẽ báo "The repository was created, but the App could not confirm access." Hãy thêm repository mới vào cài đặt installation của App trên GitHub, rồi tạo lại dự án và chọn **Existing repository**.

## Kết nối GitLab

1. Trên GitLab, tạo một group access token cho group bạn muốn dùng, với scope `api` và vai trò Developer.
2. Trong **Settings › Integrations › Git**, bấm **Add connection**, chọn **GitLab**, rồi nhập địa chỉ instance (mặc định là gitlab.com) và token.

Khi lưu, Studio kiểm tra scope, ngày hết hạn, group và vai trò của token, và báo ngay nếu có gì sai. Với token Developer, Agent có thể push nhánh, mở merge request, xem và chạy lại pipeline trong mọi project của group, nhưng không thể đổi cài đặt project hay nhánh được bảo vệ. Để Studio tự tạo webhook trên các project, vai trò cần là Maintainer. Với Developer, Studio sẽ hỏi định kỳ thay vào đó.

Khi token hết hạn, mọi lượt chạy dùng kết nối này đều lỗi, nên hãy thay token trước thời điểm đó.

## Kết nối Gitee

Studio hỗ trợ gitee.com. Tạo một personal access token trên tài khoản cá nhân hoặc một tài khoản bot riêng, với các scope `user_info`, `projects`, `pull_requests` và `hook`. Tài khoản cũng cần quyền truy cập các repository và tổ chức liên quan. Trong **Settings › Integrations › Git**, bấm **Add connection**, chọn **Gitee** và nhập token.

Khi Studio merge một PR trên Gitee, nó luôn dùng squash.

## Có nên bật webhook

| Studio của bạn | Webhook | Chuyện gì xảy ra |
| --- | --- | --- |
| Có địa chỉ HTTPS truy cập được từ internet | Bật | Nền tảng lưu trữ mã đẩy PR và kết quả kiểm tra đến Studio ngay khi chúng xảy ra |
| Chỉ ở mạng nội bộ, hoặc bạn đang thử trên `localhost` | Tắt | Studio không tạo webhook và kiểm tra PR cùng kết quả kiểm tra mỗi phút một lần |

Nếu Studio chỉ ở mạng nội bộ, bạn phải tắt webhook. GitHub từ chối các địa chỉ webhook nó không truy cập được, và tạo App với webhook bật sẽ lỗi "Hook url is not supported because it isn't reachable over the public Internet". Bạn có thể bật lại sau khi Studio có địa chỉ công khai.

## Thành viên dùng tài khoản riêng

Mỗi thành viên có thể kết nối tài khoản nền tảng lưu trữ mã của riêng mình trong **Account settings › Git**. Khi đã kết nối, các PR mà Agent mở cho họ và các lần merge họ làm trong Studio đều mang tên của chính họ. Trước đó, kết nối Git này được dùng. Xem [Kết nối tài khoản Git của bạn](../join/sign-in.md#kết-nối-tài-khoản-git-của-bạn).

- Trên GitHub, thành viên có thể cấp quyền qua trình duyệt hoặc kết nối bằng mã. Kết nối bằng mã cần bật "Enable Device Flow" trong cài đặt của App trên GitHub.
- Mỗi kết nối có một thiết lập cho phép thành viên dùng personal token hay không, **Allow personal tokens**, mặc định bật.

## Kiểm tra kết nối

Kết nối xuất hiện trong **Settings › Integrations › Git** với trạng thái **Connected**, kèm số repository nó truy cập được và trạng thái webhook, như "webhooks off, Studio polls".

> [!NOTE] Bảo vệ nhánh mặc định
> Studio không bảo vệ nhánh thay bạn. Hãy bật quy tắc bảo vệ cho nhánh mặc định trên GitHub, GitLab hoặc Gitee, ví dụ yêu cầu kiểm tra phải đạt trước khi merge.

Tiếp theo, [kết nối runtime dùng chung](shared-runtimes.md).
