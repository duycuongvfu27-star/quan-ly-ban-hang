const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Lấy chuỗi kết nối từ biến môi trường trên Render hoặc dùng mặc định khi chạy ở máy tính
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://duycuongvfu27_db_user:ZuJ3gcVJLHTuzLTV@cluster0.dt5kmd1.mongodb.net/nuongtuoitre?retryWrites=true&w=majority';

// Kết nối MongoDB Atlas với các tùy chọn mới nhất
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000 // Timeout sau 5 giây nếu không kết nối được để tránh bị treo
})
  .then(() => console.log('✅ Đã kết nối thành công tới MongoDB Atlas!'))
  .catch(err => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
  });

// Middleware xử lý dữ liệu JSON gửi lên
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Định nghĩa cổng chạy server (ưu tiên cổng của Render cung cấp, nếu chạy ở máy tính thì dùng cổng 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server Quán Nướng Tuổi Trẻ đang chạy trên port ${PORT}`);
});