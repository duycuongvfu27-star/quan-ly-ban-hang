const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const mongoURI = process.env.MONGO_URI;
if (mongoURI) {
  mongoose.connect(mongoURI)
    .then(() => console.log('✅ Kết nối MongoDB Atlas thành công!'))
    .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));
}

const orderSchema = new mongoose.Schema({
  tableName: String,
  items: Array,
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

app.post('/api/login', (req, res) => {
  const { pin } = req.body;
  if (pin === '1234' || pin === '5555') {
    return res.json({ success: true });
  }
  res.status(400).json({ success: false, message: 'Sai mã PIN!' });
});

app.post('/api/checkout', async (req, res) => {
  try {
    const { tableName, items, totalAmount } = req.body;
    const newOrder = new Order({ tableName, items, totalAmount });
    await newOrder.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// API lấy lịch sử hóa đơn cho bảng Doanh Thu
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json([]);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy cổng ${PORT}`);
});