
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


<---------->

cấu trúc và giải thích luồng chạy của router, controller, service
##########################
1. Router (Tuyến Đường)
Mô Tả:

Router là nơi bạn định nghĩa các tuyến đường (routes) của ứng dụng, tức là các đường dẫn URL mà ứng dụng của bạn sẽ lắng nghe và xử lý.
Trong file router, bạn ánh xạ các URL đến các hàm xử lý cụ thể (thường là các hàm trong controller)

2. Controller (Điều Khiển)
Mô Tả:

Controller là nơi bạn xử lý logic của ứng dụng liên quan đến yêu cầu (requests) từ người dùng.
Controllers nhận yêu cầu từ router, xử lý các yêu cầu đó, và thường gọi các hàm trong service để thực hiện các thao tác cụ thể (như truy vấn cơ sở dữ liệu, xử lý nghiệp vụ).

3. Service (Dịch Vụ)
Mô Tả:

Service là nơi bạn thực hiện các thao tác nghiệp vụ cụ thể và tương tác với cơ sở dữ liệu hoặc các dịch vụ bên ngoài.
Services thường bao gồm logic phức tạp hơn, như truy vấn cơ sở dữ liệu, mã hóa mật khẩu, hoặc gọi các API bên ngoài.

##########################
Luồng Chạy Cơ Bản
Nhận Yêu Cầu:

Khi một yêu cầu (request) được gửi đến máy chủ, Express sẽ kiểm tra các tuyến đường (routes) đã định nghĩa trong file router.
Gọi Controller:

Router ánh xạ yêu cầu đến một hàm trong controller tương ứng.
Controller xử lý yêu cầu và gọi các phương thức trong service để thực hiện các thao tác cần thiết.
Xử Lý Nghiệp Vụ:

Service thực hiện các thao tác nghiệp vụ, chẳng hạn như tương tác với cơ sở dữ liệu, mã hóa dữ liệu, và xử lý logic nghiệp vụ.
Gửi Phản Hồi:

Sau khi service trả về kết quả, controller sẽ nhận kết quả đó và gửi phản hồi (response) đến client.


<-------->