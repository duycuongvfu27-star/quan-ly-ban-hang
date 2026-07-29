const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// Khởi tạo 16 bàn
const tablesCount = 16;
let tablesData = {};
for (let i = 1; i <= tablesCount; i++) {
    tablesData[`Bàn ${i < 10 ? '0' + i : i}`] = [];
}

// Lịch sử doanh thu các đơn hàng
let revenueHistory = [];

// Menu chuẩn mặc định của QUÁN NƯỚNG TUỔI TRẺ
let defaultMenu = [
    { category: "CÁC COMBO NƯỚNG", items: [
        { name: "Combo 1 (Dành cho 2-3 người)", price: 319000 },
        { name: "Combo 2 (Dành cho 3-4 người)", price: 459000 },
        { name: "Combo 3 (Dành cho 4-6 người)", price: 619000 },
        { name: "Combo 4 (Dành cho nhiều người)", price: 1199000 }
    ]},
    { category: "ĐỒ ĂN NHẸ", items: [
        { name: "Hoa quả thập cẩm", price: 29000 },
        { name: "Ngô chiên", price: 35000 },
        { name: "Bánh mỳ nướng bơ", price: 19000 },
        { name: "Khoai tây chiên", price: 35000 },
        { name: "Salad rau tổng hợp", price: 29000 },
        { name: "Salad hoa quả", price: 39000 },
        { name: "Kim chi Hàn Quốc", price: 29000 }
    ]},
    { category: "CÁC MÓN NƯỚNG", items: [
        { name: "Ba chỉ", price: 65000 },
        { name: "Sụn non ướp ngũ vị", price: 69000 },
        { name: "Nầm tươi ứa sữa", price: 75000 },
        { name: "Bò cuộn nấm kim", price: 59000 },
        { name: "Thịt dải heo", price: 69000 },
        { name: "Má đào heo", price: 79000 },
        { name: "Nọng má tươi", price: 79000 },
        { name: "Chân gà rút xương (Lớn)", price: 99000 },
        { name: "Chân gà rút xương (Đĩa nhỏ)", price: 59000 },
        { name: "Lòng non", price: 59000 },
        { name: "Khấu đuôi giòn sần sật", price: 69000 },
        { name: "Lòng già mềm mềm", price: 59000 },
        { name: "Dạ dày nướng xa tế", price: 69000 },
        { name: "Tôm tươi", price: 89000 },
        { name: "Mực rụng trứng", price: 89000 },
        { name: "Bạch tuộc nướng xa tế", price: 79000 },
        { name: "Xúc xích ướp ngũ vị", price: 59000 },
        { name: "Dồi sụn ướp ngũ vị", price: 59000 },
        { name: "Lạp xưởng nướng thượng hạng", price: 59000 },
        { name: "Dải thăn bò nướng tảng", price: 79000 },
        { name: "Nạc vai nướng tảng", price: 69000 },
        { name: "Bò ăn dồi lăn", price: 79000 },
        { name: "U bò nướng", price: 89000 },
        { name: "Dẻ sườn nướng xa tế", price: 69000 },
        { name: "Bắp bò ướp ngũ vị", price: 79000 }
    ]},
    { category: "ĐỒ UỐNG", items: [
        { name: "Rượu ngô, táo mèo, mơ, men lá", price: 40000 },
        { name: "Bia Sài Gòn / Bia 333", price: 15000 },
        { name: "Bia Tiger", price: 22000 },
        { name: "Bò húc", price: 17000 },
        { name: "Nước lọc", price: 7000 },
        { name: "Trà đá (ca) / Thuốc lá", price: 20000 },
        { name: "Rượu dừa", price: 65000 },
        { name: "Nước ngọt các loại", price: 13000 }
    ]}
];

let menuData = defaultMenu;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/data', (req, res) => {
    if (!menuData || menuData.length === 0) {
        menuData = defaultMenu;
    }
    res.json({ tablesData, menuData });
});

app.post('/api/update-order', (req, res) => {
    const { tableName, order } = req.body;
    tablesData[tableName] = order;
    res.json({ success: true });
});

app.post('/api/update-menu', (req, res) => {
    if (req.body.menuData && req.body.menuData.length > 0) {
        menuData = req.body.menuData;
    }
    res.json({ success: true });
});

// API Lưu Hóa Đơn Khi Thanh Toán
app.post('/api/checkout', (req, res) => {
    const { tableName, items, total } = req.body;
    
    // Tính ngày theo múi giờ Việt Nam (UTC+7)
    const now = new Date();
    const vnDate = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    const dateStr = vnDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = vnDate.toISOString().split('T')[1].substring(0, 5); // HH:mm

    const newRecord = {
        id: Date.now(),
        tableName,
        items,
        total: Number(total),
        dateStr,
        timeStr
    };

    revenueHistory.push(newRecord);
    
    // Xóa đơn của bàn đã thanh toán
    tablesData[tableName] = [];

    res.json({ success: true, record: newRecord });
});

// API Lấy danh sách doanh thu
app.get('/api/revenue', (req, res) => {
    res.json({ revenueHistory });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Quan Nuong Tuoi Tre running on port ${PORT}`);
});