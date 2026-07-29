const express = require('express');
const path = require('path');
const app = express();

// Middleware đọc dữ liệu JSON từ request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cho phép truy cập các file tĩnh (HTML, CSS, JS frontend) trong thư mục
app.use(express.static(__dirname));

// Dữ liệu mẫu danh sách sản phẩm
let products = [
    { id: 1, name: 'Sản phẩm A', price: 100000, quantity: 10 },
    { id: 2, name: 'Sản phẩm B', price: 200000, quantity: 5 },
    { id: 3, name: 'Sản phẩm C', price: 150000, quantity: 20 }
];

// 1. Route Trang Chủ (Hiển thị khi truy cập đường link Render)
app.get('/', (req, res) => {
    // Nếu có file index.html trong thư mục thì gửi file đó
    if (require('fs').existsSync(path.join(__dirname, 'index.html'))) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        // Nếu chưa có file index.html, hiển thị giao diện thông báo đẹp mắt
        res.send(`
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Phần Mềm Quản Lý Bán Hàng</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; background: #f4f6f9; padding: 50px; }
                    .card { background: white; padding: 30px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
                    h1 { color: #2c3e50; }
                    p { color: #27ae60; font-size: 18px; font-weight: bold; }
                    .btn { display: inline-block; margin-top: 15px; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; }
                    .btn:hover { background: #2980b9; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>🚀 Server Quản Lý Bán Hàng</h1>
                    <p>✅ Ứng dụng đã hoạt động thành công trên Render!</p>
                    <a href="/api/products" class="btn">Xem API Danh Sách Sản Phẩm</a>
                </div>
            </body>
            </html>
        `);
    }
});

// 2. API Lấy danh sách sản phẩm
app.get('/api/products', (req, res) => {
    res.json({
        success: true,
        data: products
    });
});

// 3. API Thêm sản phẩm mới
app.post('/api/products', (req, res) => {
    const { name, price, quantity } = req.body;
    if (!name || !price) {
        return res.status(400).json({ success: false, message: 'Thừa thông tin tên hoặc giá sản phẩm!' });
    }
    const newProduct = {
        id: products.length + 1,
        name,
        price: Number(price),
        quantity: Number(quantity) || 0
    };
    products.push(newProduct);
    res.json({ success: true, message: 'Thêm sản phẩm thành công!', data: newProduct });
});

// Khởi chạy Server (sử dụng cổng động của Render hoặc cổng 3000 ở local)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});