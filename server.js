const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

let activeOrders = [];
let paidHistory = [];

function getVietnamTime() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const vnTime = new Date(utc + (3600000 * 7));
    let timeStr = vnTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    let dateStr = vnTime.toISOString().split('T')[0];
    return { timeStr, dateStr };
}

// Định tuyến trang chủ trỏ thẳng vào index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/checkout', (req, res) => {
    const { tableName, items, totalAmount, staff } = req.body;
    let itemsText = items.map(i => `${i.name} (x${i.quantity})`).join(', ');
    let { timeStr, dateStr } = getVietnamTime();

    const newPaidOrder = {
        id: Date.now(),
        time: timeStr,
        tableName,
        itemsText,
        totalAmount,
        staff: staff || 'Nhân viên',
        date: dateStr
    };
    
    paidHistory.unshift(newPaidOrder);
    activeOrders = activeOrders.filter(o => o.tableName !== tableName);
    res.status(200).json({ success: true, order: newPaidOrder });
});

app.get('/api/orders', (req, res) => {
    res.json(activeOrders);
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng ${PORT}`);
});