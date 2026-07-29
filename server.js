const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Lấy trực tiếp chuỗi kết nối MongoDB Atlas
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://duycuongvfu27_db_user:ZuJ3gcVJLHTuzLTV@cluster0.dt5kmd1.mongodb.net/nuongtuoitre?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Đã kết nối thành công tới MongoDB Atlas!'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});