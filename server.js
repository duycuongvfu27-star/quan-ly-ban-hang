const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Phục vụ file tĩnh ngay từ thư mục gốc

const DATA_FILE = path.join(__dirname, 'data.json');

// Khởi tạo dữ liệu mặc định
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
    menuData: [
        {
            category: "CÁC COMBO NƯỚNG",
            items: [
                { name: "Combo Nướng Tuổi Trẻ", price: 299000 },
                { name: "Combo Bò Hàu Phô Mai", price: 259000 }
            ]
        },
        {
            category: "ĐỒ ĂN NHẸ",
            items: [
                { name: "Khoai Tây Chiên", price: 35000 },
                { name: "Chân Gà Sốt Thái", price: 65000 }
            ]
        },
        {
            category: "ĐỒ UỐNG",
            items: [
                { name: "Nước Lọc", price: 10000 },
                { name: "Coca Cola", price: 15000 },
                { name: "Bia Hà Nội", price: 18000 }
            ]
        }
    ],
    revenueHistory: []
};

// Đọc dữ liệu từ file data.json
function loadData() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            const raw = fs.readFileSync(DATA_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            if (!parsed.usersPin) parsed.usersPin = defaultData.usersPin;
            if (!parsed.tablesData) parsed.tablesData = defaultData.tablesData;
            if (!parsed.menuData) parsed.menuData = defaultData.menuData;
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

// Trả về trang chủ index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Lấy dữ liệu
app.get('/api/data', (req, res) => {
    db = loadData();
    res.json({
        tablesData: db.tablesData || defaultData.tablesData,
        menuData: db.menuData || defaultData.menuData,
        usersPin: db.usersPin || defaultData.usersPin
    });
});

// API Đăng nhập PIN
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

// API Cập nhật danh sách Nhân viên & PIN
app.post('/api/update-users', (req, res) => {
    const { usersPin } = req.body;
    db.usersPin = usersPin;
    saveData(db);
    res.json({ success: true, message: "Đã cập nhật danh sách thành công!" });
});

// API Cập nhật Order Bàn
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

// API Xác nhận món từ bếp
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

// API Chuyển Bàn
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

// API Cập nhật Menu
app.post('/api/update-menu', (req, res) => {
    const { menuData } = req.body;
    db.menuData = menuData;
    saveData(db);
    res.json({ success: true });
});

// API Thanh Toán Hóa Đơn
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

// API Lấy Lịch sử Doanh thu
app.get('/api/revenue', (req, res) => {
    db = loadData();
    res.json({ revenueHistory: db.revenueHistory || [] });
});

// API Xóa Doanh thu
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