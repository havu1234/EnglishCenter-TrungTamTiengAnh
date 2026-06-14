# Requirements Document

## Introduction

Website quản lý học viên cho trung tâm Anh ngữ là một hệ thống web nội bộ giúp trung tâm quản lý toàn bộ hoạt động: từ hồ sơ học viên, lớp học, lịch học, đến học phí và báo cáo. Hệ thống hỗ trợ 4 vai trò người dùng với phân quyền rõ ràng: Admin, Giáo viên, Lễ tân và Kế toán. Mỗi vai trò chỉ được truy cập các chức năng phù hợp với nhiệm vụ của mình.

---

## Glossary

- **Hệ_Thống**: Ứng dụng web quản lý học viên trung tâm Anh ngữ.
- **Admin**: Quản trị viên hệ thống, có toàn quyền truy cập và cấu hình.
- **Giao_Vien**: Giáo viên của trung tâm, quản lý lớp học và điểm danh.
- **Le_Tan**: Nhân viên lễ tân, tiếp nhận và quản lý hồ sơ học viên.
- **Ke_Toan**: Nhân viên kế toán, quản lý học phí và tài chính.
- **Hoc_Vien**: Người học đang theo học tại trung tâm.
- **Lop_Hoc**: Một lớp học cụ thể với giáo viên, lịch học và danh sách học viên.
- **Hoc_Phi**: Khoản tiền học viên phải đóng theo kỳ hoặc khóa học.
- **Diem_Danh**: Ghi nhận sự có mặt của học viên trong buổi học.
- **Phan_Quyen**: Cơ chế kiểm soát quyền truy cập dựa trên vai trò người dùng.
- **JWT**: JSON Web Token, cơ chế xác thực không trạng thái dùng để bảo mật API.
- **RBAC**: Role-Based Access Control – kiểm soát truy cập dựa trên vai trò.

---

## Requirements

### Yêu Cầu 1: Xác Thực và Phân Quyền Người Dùng

**User Story:** Là một nhân viên trung tâm, tôi muốn đăng nhập bằng tài khoản riêng và chỉ thấy các chức năng phù hợp với vai trò của mình, để đảm bảo an toàn dữ liệu và tránh thao tác nhầm.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL cung cấp trang đăng nhập với hai trường bắt buộc: tên đăng nhập (tối đa 50 ký tự) và mật khẩu; nút "Đăng nhập" chỉ được kích hoạt khi cả hai trường không rỗng.
2. WHEN người dùng gửi thông tin đăng nhập hợp lệ, THE Hệ_Thống SHALL tạo JWT có thời hạn 8 giờ, lưu vào localStorage, và trả về thông tin vai trò của người dùng.
3. IF người dùng gửi thông tin đăng nhập không hợp lệ (sai tên đăng nhập hoặc sai mật khẩu), THEN THE Hệ_Thống SHALL trả về thông báo lỗi "Tên đăng nhập hoặc mật khẩu không đúng" mà không tiết lộ trường nào bị sai.
4. WHEN người dùng đăng nhập thành công, THE Hệ_Thống SHALL chuyển hướng đến trang dashboard tương ứng với vai trò: Admin → /admin/dashboard, Le_Tan → /receptionist/dashboard, Giao_Vien → /teacher/dashboard, Ke_Toan → /accountant/dashboard.
5. WHEN người dùng chưa đăng nhập (không có JWT hợp lệ) cố truy cập bất kỳ trang được bảo vệ nào, THE Hệ_Thống SHALL chuyển hướng về trang đăng nhập và lưu lại URL gốc để chuyển hướng lại sau khi đăng nhập thành công.
6. WHEN người dùng nhấn nút "Đăng xuất", THE Hệ_Thống SHALL xóa JWT khỏi localStorage, hủy phiên làm việc phía server, và chuyển hướng về trang đăng nhập trong vòng 1 giây.
7. THE Hệ_Thống SHALL áp dụng RBAC để kiểm soát quyền truy cập theo bảng phân quyền sau:
   - **Admin**: toàn quyền tất cả chức năng.
   - **Le_Tan**: xem/thêm/sửa hồ sơ học viên, xem lớp học.
   - **Giao_Vien**: xem danh sách học viên lớp mình, điểm danh, xem lịch dạy.
   - **Ke_Toan**: xem/cập nhật học phí, xem báo cáo tài chính.
8. IF người dùng đã đăng nhập cố truy cập route hoặc gọi API ngoài quyền hạn của vai trò mình, THEN THE Hệ_Thống SHALL trả về HTTP 403 kèm thông báo "Bạn không có quyền thực hiện thao tác này" mà không tiết lộ thông tin về tài nguyên bị từ chối.
9. THE Hệ_Thống SHALL mã hóa mật khẩu bằng bcrypt với cost factor tối thiểu là 10 trước khi lưu vào cơ sở dữ liệu; mật khẩu dạng plaintext không được lưu ở bất kỳ đâu.
10. IF người dùng đăng nhập sai mật khẩu 5 lần liên tiếp trong vòng 15 phút, THEN THE Hệ_Thống SHALL khóa tài khoản tạm thời trong 15 phút và hiển thị thông báo "Tài khoản bị khóa tạm thời, vui lòng thử lại sau 15 phút".

---

### Yêu Cầu 2: Quản Lý Hồ Sơ Học Viên

**User Story:** Là nhân viên lễ tân, tôi muốn thêm, tìm kiếm, xem, sửa và xóa hồ sơ học viên, để duy trì thông tin học viên chính xác và cập nhật.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL lưu trữ hồ sơ học viên bao gồm các trường: họ tên (bắt buộc, tối đa 100 ký tự), ngày sinh, giới tính (Nam/Nữ/Khác), số điện thoại (bắt buộc, đúng định dạng 10 chữ số Việt Nam), email (tùy chọn, đúng định dạng email), địa chỉ, ngày nhập học, lớp học (bắt buộc), và trạng thái (Đang học / Bảo lưu / Đã nghỉ / Hoàn thành).
2. WHEN Le_Tan hoặc Admin nhập thông tin học viên mới và nhấn "Lưu", THE Hệ_Thống SHALL kiểm tra đồng thời tất cả các trường bắt buộc (họ tên, số điện thoại, lớp học) và định dạng dữ liệu trước khi gửi lên server.
3. IF bất kỳ trường bắt buộc nào bị thiếu hoặc dữ liệu không hợp lệ khi thêm học viên, THEN THE Hệ_Thống SHALL hiển thị thông báo lỗi ngay bên dưới từng trường bị lỗi (ví dụ: "Số điện thoại phải có đúng 10 chữ số") và không gửi dữ liệu lên server.
4. WHEN Le_Tan hoặc Admin nhập từ khóa vào ô tìm kiếm (tối thiểu 1 ký tự), THE Hệ_Thống SHALL lọc danh sách học viên theo họ tên (khớp một phần, không phân biệt hoa thường) hoặc số điện thoại (khớp chính xác từ đầu) và hiển thị kết quả trong vòng 500ms.
5. WHEN Le_Tan hoặc Admin chỉnh sửa thông tin học viên với dữ liệu hợp lệ và nhấn "Lưu", THE Hệ_Thống SHALL cập nhật dữ liệu trên server và hiển thị thông báo "Cập nhật thành công" trong 3 giây rồi tự ẩn.
6. WHEN Admin nhấn nút "Xóa" trên hồ sơ học viên, THE Hệ_Thống SHALL hiển thị hộp thoại xác nhận với nội dung "Bạn có chắc muốn xóa học viên [Họ tên]? Thao tác này không thể hoàn tác." trước khi thực hiện xóa.
7. IF Admin xác nhận xóa học viên, THEN THE Hệ_Thống SHALL xóa hồ sơ khỏi cơ sở dữ liệu, cập nhật danh sách hiển thị, và hiển thị thông báo "Xóa thành công" trong 3 giây.
8. THE Hệ_Thống SHALL hiển thị danh sách học viên dạng bảng với phân trang, mỗi trang tối đa 20 học viên, kèm thông tin tổng số học viên và số trang hiện tại.
9. WHILE Le_Tan đang đăng nhập, THE Hệ_Thống SHALL ẩn hoàn toàn nút "Xóa học viên" khỏi giao diện và từ chối yêu cầu xóa từ phía API nếu có.
10. IF không có học viên nào khớp với từ khóa tìm kiếm, THEN THE Hệ_Thống SHALL hiển thị thông báo "Không tìm thấy học viên phù hợp" thay vì bảng trống.

---

### Yêu Cầu 3: Quản Lý Lớp Học

**User Story:** Là Admin, tôi muốn tạo và quản lý các lớp học, để tổ chức việc giảng dạy và phân công giáo viên hợp lý.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL lưu trữ thông tin lớp học bao gồm: mã lớp (duy nhất), tên lớp (bắt buộc, tối đa 100 ký tự), loại khóa học (IELTS/TOEIC/Giao tiếp), giáo viên phụ trách, lịch học (ngày trong tuần + giờ bắt đầu/kết thúc), sĩ số tối đa (1–100), sĩ số hiện tại, và trạng thái lớp (Đang mở / Đã kết thúc / Tạm dừng).
2. WHEN Admin tạo lớp học mới, THE Hệ_Thống SHALL tự động sinh mã lớp theo định dạng `[LOAI]-[4 chữ số ngẫu nhiên]` (ví dụ: IELTS-4821); nếu mã trùng với mã đã tồn tại, hệ thống SHALL tự động sinh lại cho đến khi có mã duy nhất.
3. IF sĩ số hiện tại của lớp đạt sĩ số tối đa, THEN THE Hệ_Thống SHALL hiển thị nhãn "Lớp đã đầy" trên thẻ lớp học và vô hiệu hóa nút "Thêm học viên" cho lớp đó.
4. WHEN Admin hoặc Le_Tan nhập từ khóa vào ô tìm kiếm lớp học, THE Hệ_Thống SHALL lọc theo tên lớp hoặc mã lớp (khớp một phần, không phân biệt hoa thường) và hiển thị kết quả; IF không có kết quả, THEN hiển thị thông báo "Không tìm thấy lớp học phù hợp".
5. WHEN Admin cập nhật thông tin lớp học với dữ liệu hợp lệ và nhấn "Lưu", THE Hệ_Thống SHALL lưu thay đổi và hiển thị thông báo "Cập nhật thành công".
6. IF Admin cố cập nhật sĩ số tối đa xuống thấp hơn sĩ số hiện tại, THEN THE Hệ_Thống SHALL từ chối lưu và hiển thị thông báo "Sĩ số tối đa không được nhỏ hơn sĩ số hiện tại ([sĩ số hiện tại] học viên)".
7. WHEN Admin xác nhận xóa lớp học không còn học viên đang học, THE Hệ_Thống SHALL xóa lớp khỏi cơ sở dữ liệu và hiển thị thông báo "Xóa lớp học thành công".
8. IF Admin cố xóa lớp học vẫn còn học viên có trạng thái "Đang học", THEN THE Hệ_Thống SHALL từ chối xóa và hiển thị thông báo "Không thể xóa lớp đang có [số lượng] học viên đang học".
9. WHEN Admin hoặc Giao_Vien nhấn "Xem chi tiết" trên một lớp học, THE Hệ_Thống SHALL hiển thị danh sách đầy đủ học viên của lớp đó kèm trạng thái từng học viên.

---

### Yêu Cầu 4: Điểm Danh Học Viên

**User Story:** Là giáo viên, tôi muốn điểm danh học viên theo từng buổi học, để theo dõi chuyên cần và báo cáo cho trung tâm.

#### Tiêu Chí Chấp Nhận

1. WHEN Giao_Vien truy cập trang điểm danh, THE Hệ_Thống SHALL chỉ hiển thị danh sách các lớp học mà Giao_Vien đó đang phụ trách.
2. WHEN Giao_Vien chọn một lớp và một buổi học để điểm danh, THE Hệ_Thống SHALL hiển thị danh sách học viên của lớp và cho phép chọn trạng thái từng học viên: Có mặt / Vắng có phép / Vắng không phép; sau khi lưu, THE Hệ_Thống SHALL ghi nhận bản ghi điểm danh với ngày giờ thực hiện.
3. IF Giao_Vien cố gọi API điểm danh cho lớp không thuộc quyền phụ trách, THEN THE Hệ_Thống SHALL trả về HTTP 403 và hiển thị thông báo "Bạn không có quyền điểm danh lớp này".
4. WHEN Giao_Vien xem lịch sử điểm danh của một lớp, THE Hệ_Thống SHALL hiển thị danh sách các buổi đã điểm danh (từ buổi đầu tiên đến hiện tại) kèm tỷ lệ chuyên cần của từng học viên tính đến thời điểm xem.
5. THE Hệ_Thống SHALL tính tỷ lệ chuyên cần của mỗi học viên theo công thức: (số buổi có trạng thái "Có mặt" / tổng số buổi đã có bản ghi điểm danh của lớp) × 100%, làm tròn đến 1 chữ số thập phân.
6. IF Giao_Vien cố điểm danh lại cho một buổi học đã có bản ghi điểm danh, THEN THE Hệ_Thống SHALL hiển thị dữ liệu điểm danh cũ ở chế độ chỉnh sửa và cho phép cập nhật; sau khi lưu, ghi đè bản ghi cũ và ghi nhận thời gian chỉnh sửa.

---

### Yêu Cầu 5: Quản Lý Học Phí

**User Story:** Là kế toán, tôi muốn theo dõi và cập nhật trạng thái đóng học phí của từng học viên, để đảm bảo thu đúng và đủ học phí.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL lưu trữ thông tin học phí bao gồm: học viên, lớp học, tổng số tiền phải đóng, số tiền đã đóng, kỳ đóng (tháng/năm), ngày đến hạn, ngày đóng thực tế, và trạng thái được tính tự động (Đã đóng: số tiền đã đóng = tổng số tiền; Đóng một phần: 0 < số tiền đã đóng < tổng số tiền; Chưa đóng: số tiền đã đóng = 0).
2. WHEN Ke_Toan cập nhật số tiền đã đóng của học viên và nhấn "Lưu", THE Hệ_Thống SHALL tính lại trạng thái học phí tự động, lưu thay đổi, và ghi nhận ngày giờ cập nhật cùng tên người thực hiện.
3. WHEN Ke_Toan hoặc Admin xem danh sách học phí, THE Hệ_Thống SHALL hỗ trợ lọc theo trạng thái (Đã đóng / Chưa đóng / Đóng một phần) và theo lớp học; các bộ lọc có thể kết hợp đồng thời.
4. WHEN Ke_Toan hoặc Admin truy cập dashboard, THE Hệ_Thống SHALL hiển thị tổng số học viên có trạng thái "Chưa đóng" hoặc "Đóng một phần" trong kỳ hiện tại.
5. IF học viên có trạng thái học phí "Chưa đóng" và ngày hiện tại vượt quá ngày đến hạn hơn 30 ngày, THEN THE Hệ_Thống SHALL hiển thị nhãn cảnh báo màu đỏ "Quá hạn" bên cạnh tên học viên trong danh sách học phí.
6. WHEN Ke_Toan nhập từ khóa vào ô tìm kiếm học phí, THE Hệ_Thống SHALL lọc theo họ tên học viên (khớp một phần, không phân biệt hoa thường) hoặc tên lớp học và hiển thị kết quả trong vòng 500ms.
7. IF Ke_Toan nhập số tiền đã đóng lớn hơn tổng số tiền phải đóng, THEN THE Hệ_Thống SHALL từ chối lưu và hiển thị thông báo "Số tiền đã đóng không được vượt quá tổng học phí".

---

### Yêu Cầu 6: Dashboard và Thống Kê

**User Story:** Là Admin, tôi muốn xem tổng quan về hoạt động của trung tâm trên một màn hình, để nắm bắt nhanh tình hình và đưa ra quyết định kịp thời.

#### Tiêu Chí Chấp Nhận

1. WHEN Admin truy cập trang dashboard, THE Hệ_Thống SHALL hiển thị 4 thẻ chỉ số: (a) tổng số học viên có trạng thái "Đang học", (b) tổng số lớp có trạng thái "Đang mở", (c) số học viên có học phí "Chưa đóng" hoặc "Đóng một phần" trong kỳ hiện tại, (d) tổng doanh thu (tổng số tiền đã đóng) trong tháng hiện tại.
2. WHEN Admin truy cập dashboard, THE Hệ_Thống SHALL tải và hiển thị đầy đủ dữ liệu thống kê trong vòng 2 giây kể từ khi trang bắt đầu tải.
3. THE Hệ_Thống SHALL hiển thị biểu đồ cột thể hiện số lượng học viên nhập học (ngày nhập học) theo từng tháng trong 12 tháng gần nhất tính từ tháng hiện tại.
4. THE Hệ_Thống SHALL hiển thị dashboard rút gọn phù hợp với từng vai trò: Giao_Vien thấy danh sách lớp đang phụ trách và lịch dạy trong tuần; Ke_Toan thấy tổng quan học phí (số chưa đóng, tổng thu tháng này); Le_Tan thấy danh sách 10 học viên nhập học gần nhất.

---

### Yêu Cầu 7: Quản Lý Tài Khoản Người Dùng (Admin)

**User Story:** Là Admin, tôi muốn tạo, sửa và vô hiệu hóa tài khoản nhân viên, để kiểm soát quyền truy cập hệ thống.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL cho phép Admin tạo tài khoản mới với các thông tin bắt buộc: tên đăng nhập (tối đa 50 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới), mật khẩu tạm thời, họ tên (tối đa 100 ký tự), vai trò (Admin/Giao_Vien/Le_Tan/Ke_Toan).
2. IF Admin nhập mật khẩu không đáp ứng yêu cầu (độ dài tối thiểu 8 ký tự, tối đa 72 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số), THEN THE Hệ_Thống SHALL hiển thị thông báo lỗi cụ thể và không tạo tài khoản.
3. IF tên đăng nhập đã tồn tại trong hệ thống, THEN THE Hệ_Thống SHALL từ chối tạo tài khoản và hiển thị thông báo "Tên đăng nhập đã được sử dụng".
4. WHEN Admin vô hiệu hóa tài khoản nhân viên, THE Hệ_Thống SHALL đặt trạng thái tài khoản thành "Vô hiệu" và ngăn tài khoản đó đăng nhập mà không xóa dữ liệu liên quan; IF tài khoản đang có phiên đăng nhập hoạt động, THE Hệ_Thống SHALL hủy phiên đó ngay lập tức.
5. IF tài khoản bị vô hiệu hóa cố đăng nhập, THEN THE Hệ_Thống SHALL trả về thông báo "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ Admin."
6. WHEN người dùng đăng nhập thành công, THE Hệ_Thống SHALL ghi lại bản ghi lịch sử đăng nhập bao gồm: tên đăng nhập, thời gian đăng nhập, và địa chỉ IP của thiết bị.
7. WHEN Admin chỉnh sửa thông tin tài khoản nhân viên (họ tên, vai trò) với dữ liệu hợp lệ và nhấn "Lưu", THE Hệ_Thống SHALL cập nhật thông tin và hiển thị thông báo "Cập nhật tài khoản thành công".

---

### Yêu Cầu 8: Giao Diện và Trải Nghiệm Người Dùng

**User Story:** Là nhân viên trung tâm, tôi muốn sử dụng giao diện trực quan và dễ dùng, để thao tác nhanh chóng mà không cần đào tạo phức tạp.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL hiển thị đúng trên phiên bản ổn định mới nhất của Chrome, Firefox và Edge tại thời điểm kiểm thử; "hiển thị đúng" được định nghĩa là: không có lỗi layout, tất cả nút/liên kết hoạt động, và không có lỗi JavaScript trong console.
2. THE Hệ_Thống SHALL có giao diện responsive, hiển thị đúng trên màn hình có độ rộng từ 768px trở lên; các bảng dữ liệu SHALL có thanh cuộn ngang khi nội dung vượt quá chiều rộng màn hình.
3. WHEN người dùng thực hiện thao tác thêm/sửa/xóa thành công, THE Hệ_Thống SHALL hiển thị thông báo phản hồi (toast notification) trong vòng 1 giây kể từ khi server trả về kết quả; thông báo SHALL tự động ẩn sau 3 giây.
4. THE Hệ_Thống SHALL hiển thị thanh điều hướng (sidebar) chỉ chứa các mục menu mà vai trò đang đăng nhập có quyền truy cập; các mục menu không có quyền SHALL không hiển thị (không chỉ bị ẩn bằng CSS).
5. WHEN dữ liệu đang được tải từ server (thời gian tải > 200ms), THE Hệ_Thống SHALL hiển thị spinner hoặc thanh tiến trình ở vùng nội dung đang tải để người dùng biết hệ thống đang xử lý.
6. IF xảy ra lỗi kết nối server hoặc lỗi HTTP 5xx, THEN THE Hệ_Thống SHALL hiển thị thông báo lỗi thân thiện bằng tiếng Việt (ví dụ: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.") mà không hiển thị mã lỗi kỹ thuật hoặc stack trace cho người dùng.
