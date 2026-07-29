const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const mongoURI = process.env.MONGO_URI || 'mongodb://...'; // Giữ nguyên chuỗi kết nối hiện tại của bạn

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Đã kết nối thành công tới MongoDB Atlas!'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// ➕ THÊM API ĐĂNG NHẬP NÀY VÀO:
app.post('/api/login', (req, res) => {
  const { pin } = req.body;
  if (pin === '1234' || pin === '5555') {
    return res.json({ success: true, message: 'Đăng nhập thành công!' });
  } else {
    return res.status(400).json({ success: false, message: 'Sai mã PIN!' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});