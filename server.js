const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Bộ nhớ lưu trữ đơn hàng tạm thời trên server
let activeOrders = [];

// API nhận order từ điện thoại khách hàng hoặc máy POS
app.post('/api/checkout', (req, res) => {
    const { tableName, items, totalAmount } = req.body;
    const newOrder = {
        id: Date.now(),
        tableName,
        items,
        totalAmount,
        time: new Date().toLocaleTimeString('vi-VN')
    };
    
    // Thêm vào đầu danh sách đơn hàng
    activeOrders.unshift(newOrder);
    res.status(200).json({ success: true, message: "Order thành công", order: newOrder });
});

// API trả về danh sách đơn hàng cho máy POS thu ngân
app.get('/api/orders', (req, res) => {
    res.json(activeOrders);
});

// Giao diện quản lý doanh thu
app.get('/api/orders/view', (req, res) => {
    let html = `<h2>Danh sách đơn hàng hôm nay</h2><ul>`;
    activeOrders.forEach(ord => {
        html += `<li><b>${ord.tableName}</b> - Tổng tiền: ${ord.totalAmount.toLocaleString()}đ lúc ${ord.time}</li>`;
    });
    html += `</ul><a href="/quanly.html">Quay lại POS</a>`;
    res.send(html);
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng ${PORT}`);
});