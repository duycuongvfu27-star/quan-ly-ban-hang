const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware đọc dữ liệu JSON và form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cho phép server đọc các file giao diện tĩnh trong thư mục gốc
app.use(express.static(__dirname));

// Lấy chuỗi kết nối từ Render, dùng chuỗi Standard dự phòng nếu chạy ở máy nhà
const mongoURI = process.env.MONGO_URI || 'mongodb://duycuongvfu27_db_user:ZuJ3gcVJLHTuzLTV@cluster0-shard-00-00.dt5kmd1.mongodb.net:27017,cluster0-shard-00-01.dt5kmd1.mongodb.net:27017,cluster0-shard-00-02.dt5kmd1.mongodb.net:27017/?ssl=true&replicaSet=atlas-xxx-shard-0&authSource=admin&retryWrites=true&w=majority';

// Kết nối MongoDB Atlas
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Đã kết nối thành công tới MongoDB Atlas!'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// API Xử lý đăng nhập mã PIN
app.post('/api/login', (req, res) => {
  const { pin } = req.body;
  if (pin === '1234' || pin === '5555') {
    return res.json({ success: true, message: 'Đăng nhập thành công!' });
  } else {
    return res.status(400).json({ success: false, message: 'Sai mã PIN!' });
  }
});

// Đường dẫn trang chủ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Cổng chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});