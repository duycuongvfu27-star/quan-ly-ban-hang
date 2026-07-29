// Tạo Schema lưu hóa đơn vào MongoDB
const orderSchema = new mongoose.Schema({
  tableName: String,
  items: Array,
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// API nhận dữ liệu thanh toán và lưu vào Database
app.post('/api/checkout', async (req, res) => {
  try {
    const { tableName, items, totalAmount } = req.body;
    const newOrder = new Order({ tableName, items, totalAmount });
    await newOrder.save();
    res.json({ success: true, message: 'Đã lưu hóa đơn thành công!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server khi lưu hóa đơn' });
  }
});