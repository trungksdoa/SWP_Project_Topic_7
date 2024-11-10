 Koi Care System at Home - Phần mềm quản lý chăm sóc cá Koi tại nhà
 **Website:** [Link](https://swp-project-topic-7.vercel.app/)
 
 **Host server:** [Link](https://koi-controls-e5hxekcpd0cmgjg2.eastasia-01.azurewebsites.net/)

 **Role:**
 Member
 Admin,
 Contributer,
 Staff

**Feature:**
 - Chức năng cho phép quản lý thông tin hồ cá Koi (tên, hình ảnh, kích thước, độ sâu, thể tích, số lượng cống thoát, công suất máy bơm, ...).
 - Quản lý thông tin chi tiết cá Koi (tên, hình ảnh, vóc dáng, tuổi, kích thước, trọng lượng, giới tính, giống, nguồn gốc xuất xứ, giá bán, hồ đang ở, ...), chức năng cập nhật thông tin phát triển cá Koi theo từng thời điểm, biểu đồ thống kê xu hướng phát triển cá Koi.
 - Quản lý thông số nước của từng hồ theo từng thời điểm đo (nhiệt độ, muối, PH, O2, NO2, NO3, PO4, ...), đề xuất các thông số nước không đạt chuẩn.
 - Chức năng tính toán lượng thức ăn cần thiết cho từng cá Koi theo từng thời kỳ phát triển.
 - Chức năng tính toán lượng muối cần thiết cho từng hồ cá để đạt chuẩn nuôi cá Koi.
 - Chức năng cho phép đặt mua các sản phẩm để cải thiện các thông số nước và sản phẩm điều trị sức khỏe cá Koi.
 - Trang tin tức, blog chia sẽ, ...
 - Dashboard & Report.

 **Link tham khảo:** https://Koicontrol.com

# Software Requirements Specification
**Bảng tiếng Anh**
[another.docx](https://github.com/user-attachments/files/17564894/another.docx)


**Bảng tiếng Việt**

 **I. Yêu cầu chức năng (Functional Requirements):**
   1. Quản lý hồ cá:
   - Thêm, sửa, xóa thông tin hồ cá
   - Lưu trữ thông tin: tên, hình ảnh, kích thước, độ sâu, thể tích, số lượng cống thoát, công suất máy bơm

   2. Quản lý cá Koi:
   - CRUD (Create, Read, Update, Delete) thông tin cá Koi
   - Thông tin: tên, hình ảnh, vóc dáng, tuổi, kích thước, trọng lượng, giới tính, giống, nguồn gốc, giá bán, hồ hiện tại
   - Cập nhật thông tin phát triển theo thời gian
   - Hiển thị biểu đồ xu hướng phát triển (optional)
     
     a. Tăng trưởng kích thước: Chiều dài của cá theo thời gian, Trọng lượng của cá theo thời gian

     b. Màu sắc và hoa văn: Sự thay đổi trong màu sắc và độ sắc nét của hoa văn trên cơ thể cá

     c. Sức khỏe: Tần suất bệnh tật hoặc các vấn đề sức khỏe, Chỉ số sức khỏe tổng quát (nếu có)

     d. Chất lượng nước: Mối tương quan giữa các thông số nước và sự phát triển của cá

     e. Thói quen ăn uống: Lượng thức ăn tiêu thụ theo thời gian, Hiệu quả chuyển đổi thức ăn (tỷ lệ giữa lượng thức ăn và tăng trưởng)

     f. Giá trị: Sự thay đổi trong giá trị ước tính của cá theo thời gian

     g. Đặc điểm sinh sản: Số lần sinh sản (nếu áp dụng), Chất lượng và số lượng con non

     h.Hoạt động và hành vi: Mức độ hoạt động, Thay đổi trong hành vi xã hội (tương tác với cá khác)

   3. Quản lý thông số nước:
   - Ghi nhận thông số nước theo thời gian cho từng hồ
   - Lưu trữ: nhiệt độ, độ muối, PH, O2, NO2, NO3, PO4
   - Phân tích và đề xuất khi thông số không đạt chuẩn

   4. Tính toán thức ăn:
   - Tính lượng thức ăn cần thiết cho từng cá Koi dựa trên giai đoạn phát triển

   5. Tính toán lượng muối:
   - Tính lượng muối cần thiết cho từng hồ để đạt chuẩn

   6. Đặt mua sản phẩm:
   - Hiển thị danh sách sản phẩm cải thiện nước và điều trị sức khỏe cá
   - Cho phép đặt hàng và thanh toán

   7. Tin tức và blog:
   - Hiển thị và quản lý bài viết, tin tức

   8. Quản lý người dùng:
   - Phân quyền: Member, Shop Admin
   - Đăng ký, đăng nhập, quản lý thông tin cá nhân

**II. Yêu cầu phi chức năng (Non-functional Requirements):**
   1. Giao diện người dùng:
   - Thân thiện, dễ sử dụng
   - Responsive design cho các thiết bị khác nhau

   2. Khả năng tương thích:
   - Hoạt động trên các trình duyệt phổ biến (Chrome, Firefox, Safari, Edge)

**III. Yêu cầu kỹ thuật:**
   - Nền tảng web-based
   - Cơ sở dữ liệu quan hệ MySQL Workbench
   - API RESTful cho tương tác giữa frontend và backend
   - Sử dụng framework frontend Vite và React
   - Backend sử dụng ngôn ngữ server-side Java Spring Boot
