const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, 'data.json');

const tablesCount = 16;
let defaultTables = {};
for (let i = 1; i <= tablesCount; i++) {
    defaultTables[`Bàn ${i < 10 ? '0' + i : i}`] = { order: [], status: 'empty' };
}

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

function loadDatabase() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            const raw = fs.readFileSync(DATA_FILE, 'utf8');
            let data = JSON.parse(raw);
            if (data.tablesData) {
                Object.keys(data.tablesData).forEach(k => {
                    if (Array.isArray(data.tablesData[k])) {
                        let oldOrder = data.tablesData[k];
                        data.tablesData[k] = {
                            order: oldOrder,
                            status: oldOrder.length > 0 ? 'confirmed' : 'empty'
                        };
                    }
                });
            }
            return data;
        } catch (e) {
            console.error("Lỗi đọc file data.json");
        }
    }
    return { tablesData: defaultTables, menuData: defaultMenu, revenueHistory: [] };
}

function saveDatabase(db) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf8');
}

let db = loadDatabase();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/data', (req, res) => {
    res.json({ tablesData: db.tablesData, menuData: db.menuData });
});

app.post('/api/update-order', (req, res) => {
    const { tableName, order, status } = req.body;
    if (db.tablesData[tableName]) {
        db.tablesData[tableName].order = order;
        if (status) db.tablesData[tableName].status = status;
        else if (order.length === 0) db.tablesData[tableName].status = 'empty';
        saveDatabase(db);
    }
    res.json({ success: true });
});

app.post('/api/confirm-table', (req, res) => {
    const { tableName, order } = req.body;
    if (db.tablesData[tableName]) {
        db.tablesData[tableName].status = 'confirmed';
        if (order) db.tablesData[tableName].order = order;
        saveDatabase(db);
    }
    res.json({ success: true, tablesData: db.tablesData });
});

app.post('/api/update-menu', (req, res) => {
    if (req.body.menuData && req.body.menuData.length > 0) {
        db.menuData = req.body.menuData;
        saveDatabase(db);
    }
    res.json({ success: true });
});

app.post('/api/transfer-table', (req, res) => {
    const { fromTable, toTable } = req.body;
    if (db.tablesData[fromTable] && db.tablesData[toTable]) {
        db.tablesData[toTable].order = db.tablesData[toTable].order.concat(db.tablesData[fromTable].order);
        db.tablesData[toTable].status = 'confirmed';
        
        db.tablesData[fromTable].order = [];
        db.tablesData[fromTable].status = 'empty';
        saveDatabase(db);
    }
    res.json({ success: true, tablesData: db.tablesData });
});

app.post('/api/checkout', (req, res) => {
    const { tableName, items, total } = req.body;
    const now = new Date();
    const vnDate = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    const dateStr = vnDate.toISOString().split('T')[0];
    const timeStr = vnDate.toISOString().split('T')[1].substring(0, 5);

    const newRecord = {
        id: Date.now(),
        tableName,
        items,
        total: Number(total),
        dateStr,
        timeStr
    };

    if (!db.revenueHistory) db.revenueHistory = [];
    db.revenueHistory.push(newRecord);
    
    db.tablesData[tableName] = { order: [], status: 'empty' };

    saveDatabase(db);
    res.json({ success: true, record: newRecord });
});

app.post('/api/delete-revenue', (req, res) => {
    const { id } = req.body;
    if (db.revenueHistory) {
        db.revenueHistory = db.revenueHistory.filter(item => item.id !== id);
        saveDatabase(db);
    }
    res.json({ success: true });
});

app.get('/api/revenue', (req, res) => {
    res.json({ revenueHistory: db.revenueHistory || [] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Quan Nuong Tuoi Tre running on port ${PORT}`);
});