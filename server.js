const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

let activeOrders = [];

// API nhận order từ khách hàng hoặc POS
app.post('/api/checkout', (req, res) => {
    const { tableName, items, totalAmount } = req.body;
    const newOrder = {
        id: Date.now(),
        tableName,
        items,
        totalAmount,
        time: new Date().toLocaleTimeString('vi-VN')
    };
    activeOrders.unshift(newOrder);
    res.status(200).json({ success: true, order: newOrder });
});

// API trả về danh sách đơn hàng cho POS
app.get('/api/orders', (req, res) => {
    res.json(activeOrders);
});

// Trang xem doanh thu nội bộ (chỉ dành cho thu ngân)
app.get('/api/orders/view', (req, res) => {
    let html = `<h2>Danh sách đơn hàng hôm nay</h2><ul>`;
    activeOrders.forEach(ord => {
        html += `<li><b>${ord.tableName}</b> - ${ord.totalAmount.toLocaleString()}đ lúc ${ord.time}</li>`;
    });
    html += `</ul><a href="/quanly.html">Quay lại POS</a>`;
    res.send(html);
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng ${PORT}`);
});