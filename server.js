const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware xử lý dữ liệu JSON và form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình để server phục vụ các file giao diện (HTML, CSS, JS, hình ảnh)
// Nếu các file html của bạn nằm trong thư mục gốc (cùng cấp với server.js):
app.use(express.static(__dirname));

// Hoặc nếu bạn có thư mục public riêng, hãy dùng dòng này (bỏ comment nếu cần):
// app.use(express.static(path.join(__dirname, 'public')));

// Lấy chuỗi kết nối từ biến môi trường trên Render hoặc dùng mặc định
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://duycuongvfu27_db_user:ZuJ3gcVJLHTuzLTV@cluster0.dt5kmd1.mongodb.net/nuongtuoitre?retryWrites=true&w=majority';

// Kết nối MongoDB Atlas
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('✅ Đã kết nối thành công tới MongoDB Atlas!'))
  .catch(err => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
  });

// Định nghĩa đường dẫn trang chủ để render file index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// (Tùy chọn) Thêm các API hoặc routes quản lý quán nướng của bạn ở đây...

// Khởi động server (Hỗ trợ cổng của Render hoặc chạy ở máy tính port 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server Quán Nướng Tuổi Trẻ đang chạy trên port ${PORT}`);
});