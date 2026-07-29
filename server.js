const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, 'data.json');

// THỰC ĐƠN CHUẨN ĐƯỢC CẤU HÌNH CỐ ĐỊNH TỪ MENU HÌNH ẢNH CỦA QUÁN NƯỚNG TUỔI TRẺ
const fullMenuData = [
    {
        category: "CÁC COMBO NƯỚNG",
        items: [
            { name: "Combo 1 (Dành cho 2-3 người)", price: 319000 },
            { name: "Combo 2 (Dành cho 3-4 người)", price: 459000 },
            { name: "Combo 3 (Dành cho 4-6 người)", price: 619000 },
            { name: "Combo 4 (Dành cho nhiều người)", price: 1199000 }
        ]
    },
    {
        category: "ĐỒ ĂN NHẸ",
        items: [
            { name: "Hoa quả thập Cẩm", price: 29000 },
            { name: "Ngô chiên", price: 35000 },
            { name: "Bánh mỹ nướng bơ", price: 19000 },
            { name: "Khoai tây chiên", price: 35000 },
            { name: "Salad rau tổng hợp (mới)", price: 29000 },
            { name: "Salad hoa quả (Hót)", price: 39000 },
            { name: "Kim chi Hàn Quốc", price: 29000 }
        ]
    },
    {
        category: "CÁC MÓN NƯỚNG",
        items: [
            { name: "Ba chỉ", price: 65000 },
            { name: "Sụn non ướp ngũ vị", price: 69000 },
            { name: "Nầm tươi ứa sữa (Hót)", price: 75000 },
            { name: "Bò cuộn nấm kim", price: 59000 },
            { name: "Thịt dải heo (mới)", price: 69000 },
            { name: "Má đào heo (Đỉnh)", price: 79000 },
            { name: "Nọng má tươi (giòn ngon)", price: 79000 },
            { name: "Chân gà rút xương (Best Seller)", price: 99000 },
            { name: "Chân gà rút xương (đĩa nhỏ)", price: 59000 },
            { name: "Lòng non (Best seller)", price: 59000 },
            { name: "Khấu đuôi giòn sần sật (Hót)", price: 69000 },
            { name: "Lòng già mĩm mĩm (Béo nhất quán)", price: 59000 },
            { name: "Dạ dày nướng xa tế", price: 69000 },
            { name: "Tôm tươi", price: 89000 },
            { name: "Mực trứng", price: 89000 },
            { name: "Bạch tuộc nướng xa tế", price: 79000 },
            { name: "Xúc xích ướp ngũ vị", price: 59000 },
            { name: "Dồi sụn ướp ngũ vị", price: 59000 },
            { name: "Lạp xưởng nướng thượng hạng", price: 59000 },
            { name: "Dải thăn bò nướng tảng (Best seller)", price: 79000 },
            { name: "Nạc vai nướng tảng (mới)", price: 69000 },
            { name: "Bò ăn dồi lăn (phải thử 1 lần)", price: 79000 },
            { name: "U bò nướng (Hót)", price: 89000 },
            { name: "Rẻ sườn nướng xa tế", price: 69000 },
            { name: "Bắp bò ướp ngũ vị", price: 79000 }
        ]
    },
    {
        category: "ĐỒ UỐNG",
        items: [
            { name: "Rượu ngô nếp, táo mèo, mơ, men lá", price: 40000 },
            { name: "Bia Sài Gòn, bia 333", price: 15000 },
            { name: "Bia Tiger", price: 22000 },
            { name: "Bò húc", price: 17000 },
            { name: "Nước lọc", price: 7000 },
            { name: "Trà đá (ca), thuốc lá", price: 20000 },
            { name: "Rượu dừa", price: 65000 },
            { name: "Nước ngọt các loại", price: 13000 }
        ]
    }
];

let defaultData = {
    usersPin: [
        { name: "Admin (Máy chủ)", pin: "1234", role: "admin" },
        { name: "Nhân viên 01", pin: "5555", role: "staff" }
    ],
    tablesData: {
        "Bàn 01": { order: [], status: "empty" },
        "Bàn 02": { order: [], status: "empty" },
        "Bàn 03": { order: [], status: "empty" },
        "Bàn 04": { order: [], status: "empty" },
        "Bàn 05": { order: [], status: "empty" },
        "Bàn 06": { order: [], status: "empty" },
        "Bàn 07": { order: [], status: "empty" },
        "Bàn 08": { order: [], status: "empty" },
        "Bàn 09": { order: [], status: "empty" },
        "Bàn 10": { order: [], status: "empty" }
    },
    menuData: fullMenuData,
    revenueHistory: []
};

function loadData() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            const raw = fs.readFileSync(DATA_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            parsed.menuData = fullMenuData; // Luôn ưu tiên đồng bộ menu mới nhất từ hình ảnh
            if (!parsed.usersPin) parsed.usersPin = defaultData.usersPin;
            if (!parsed.tablesData) parsed.tablesData = defaultData.tablesData;
            return parsed;
        } catch (e) {
            return defaultData;
        }
    } else {
        try {
            fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
        } catch(err) {}
        return defaultData;
    }
}

function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch(err) {
        console.error("Lỗi ghi file:", err);
    }
}

let db = loadData();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/data', (req, res) => {
    db = loadData();
    res.json({
        tablesData: db.tablesData || defaultData.tablesData,
        menuData: fullMenuData,
        usersPin: db.usersPin || defaultData.usersPin
    });
});

app.post('/api/login-pin', (req, res) => {
    const { pin } = req.body;
    db = loadData();
    const userList = db.usersPin || defaultData.usersPin;
    const foundUser = userList.find(u => u.pin === pin);
    if (foundUser) {
        res.json({ success: true, user: foundUser });
    } else {
        res.json({ success: false, message: "Mã PIN không chính xác!" });
    }
});

app.post('/api/update-order', (req, res) => {
    const { tableName, order, status } = req.body;
    if (!db.tablesData) db.tablesData = defaultData.tablesData;
    if (db.tablesData[tableName]) {
        db.tablesData[tableName].order = order;
        db.tablesData[tableName].status = status;
        saveData(db);
    }
    res.json({ success: true });
});

app.post('/api/confirm-table', (req, res) => {
    const { tableName, order } = req.body;
    if (!db.tablesData) db.tablesData = defaultData.tablesData;
    if (db.tablesData[tableName]) {
        db.tablesData[tableName].order = order;
        db.tablesData[tableName].status = 'confirmed';
        saveData(db);
    }
    res.json({ success: true });
});

app.post('/api/transfer-table', (req, res) => {
    const { fromTable, toTable } = req.body;
    if (!db.tablesData) db.tablesData = defaultData.tablesData;
    if (db.tablesData[fromTable] && db.tablesData[toTable]) {
        db.tablesData[toTable].order = db.tablesData[toTable].order.concat(db.tablesData[fromTable].order);
        db.tablesData[toTable].status = 'confirmed';
        db.tablesData[fromTable].order = [];
        db.tablesData[fromTable].status = 'empty';
        saveData(db);
    }
    res.json({ success: true, tablesData: db.tablesData });
});

app.post('/api/update-menu', (req, res) => {
    res.json({ success: true });
});

app.post('/api/checkout', (req, res) => {
    const { tableName, items, total, payType, staffName } = req.body;
    
    const now = new Date(new Date().getTime() + (7 * 60 * 60 * 1000));
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

    const newRecord = {
        id: Date.now(),
        dateStr,
        timeStr,
        tableName,
        items,
        total,
        payType,
        staffName: staffName || "Khách/Thu ngân"
    };

    if (!db.revenueHistory) db.revenueHistory = [];
    db.revenueHistory.unshift(newRecord);

    if (db.tablesData && db.tablesData[tableName]) {
        db.tablesData[tableName].order = [];
        db.tablesData[tableName].status = 'empty';
        db.tablesData[tableName].lastBill = newRecord;
    }

    saveData(db);
    res.json({ success: true });
});

app.get('/api/revenue', (req, res) => {
    db = loadData();
    res.json({ revenueHistory: db.revenueHistory || [] });
});

app.post('/api/delete-revenue', (req, res) => {
    const { id } = req.body;
    if (db.revenueHistory) {
        db.revenueHistory = db.revenueHistory.filter(item => item.id !== id);
        saveData(db);
    }
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server Quán Nướng Tuổi Trẻ running on port ${PORT}`);
});