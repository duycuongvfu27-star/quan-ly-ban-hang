const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware đọc dữ liệu JSON và form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cho phép server đọc các file giao diện tĩnh (HTML, CSS, JS) trong thư mục gốc
app.use(express.static(__dirname));

// Lấy chuỗi kết nối an toàn từ Render hoặc dùng chuỗi dự phòng
const mongoURI = process.env.MONGO_URI;

if (mongoURI) {
  mongoose.connect(mongoURI)
    .then(() => console.log('✅ Đã kết nối thành công tới MongoDB Atlas!'))
    .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));
} else {
  console.log('⚠️ Không tìm thấy biến MONGO_URI.');
}

// 1. Schema và Model lưu hóa đơn vào MongoDB
const orderSchema = new mongoose.Schema({
  tableName: String,
  items: Array,
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// 2. API Xử lý đăng nhập mã PIN
app.post('/api/login', (req, res) => {
  const { pin } = req.body;
  if (pin === '1234' || pin === '5555') {
    return res.json({ success: true, message: 'Đăng nhập thành công!' });
  } else {
    return res.status(400).json({ success: false, message: 'Sai mã PIN!' });
  }
});

// 3. API nhận dữ liệu thanh toán từ bàn ăn và lưu vào Database
app.post('/api/checkout', async (req, res) => {
  try {
    const { tableName, items, totalAmount } = req.body;
    const newOrder = new Order({ tableName, items, totalAmount });
    await newOrder.save();
    res.json({ success: true, message: 'Đã lưu hóa đơn thành công!' });
  } catch (err) {
    console.error('Lỗi lưu hóa đơn:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi lưu hóa đơn' });
  }
});

// 4. Đường dẫn trang chủ (Trang đăng nhập)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Cổng chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});