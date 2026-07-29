const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// CHUỖI KẾT NỐI MONGODB ATLAS CỦA BẠN:
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://duycuongvfu27_db_user:ZuJ3gcVJLHTuzLTV@cluster0.dt5kmd1.mongodb.net/nuongtuoitre?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Đã kết nối thành công tới MongoDB Atlas!'))
    .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

const AppDataSchema = new mongoose.Schema({
    idKey: { type: String, default: "main_data", unique: true },
    usersPin: Array,
    tablesData: Object,
    revenueHistory: Array
});

const AppData = mongoose.model('AppData', AppDataSchema);

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

const full16Tables = {};
for (let i = 1; i <= 16; i++) {
    let tableName = `Bàn ${i < 10 ? '0' + i : i}`;
    full16Tables[tableName] = { order: [], status: "empty" };
}

const defaultUsersPin = [
    { name: "Admin (Máy chủ)", pin: "1234", role: "admin" },
    { name: "Nhân viên 01", pin: "5555", role: "staff" }
];

async function getDBData() {
    let doc = await AppData.findOne({ idKey: "main_data" });
    if (!doc) {
        doc = await AppData.create({
            idKey: "main_data",
            usersPin: defaultUsersPin,
            tablesData: full16Tables,
            revenueHistory: []
        });
    }
    return doc;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/data', async (req, res) => {
    try {
        const db = await getDBData();
        res.json({
            tablesData: db.tablesData || full16Tables,
            menuData: fullMenuData,
            usersPin: db.usersPin || defaultUsersPin
        });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/login-pin', async (req, res) => {
    const { pin } = req.body;
    const db = await getDBData();
    const userList = db.usersPin || defaultUsersPin;
    const foundUser = userList.find(u => u.pin === pin);
    if (foundUser) {
        res.json({ success: true, user: foundUser });
    } else {
        res.json({ success: false, message: "Mã PIN không chính xác!" });
    }
});

app.post('/api/update-users', async (req, res) => {
    const { usersPin } = req.body;
    const db = await getDBData();
    db.usersPin = usersPin;
    db.markModified('usersPin');
    await db.save();
    res.json({ success: true });
});

app.post('/api/update-order', async (req, res) => {
    const { tableName, order, status } = req.body;
    const db = await getDBData();
    if (!db.tablesData) db.tablesData = full16Tables;
    
    if (db.tablesData[tableName]) {
        db.tablesData[tableName].order = order;
        db.tablesData[tableName].status = status;
        db.markModified('tablesData');
        await db.save();
    }
    res.json({ success: true });
});

app.post('/api/confirm-table', async (req, res) => {
    const { tableName, order } = req.body;
    const db = await getDBData();
    if (db.tablesData && db.tablesData[tableName]) {
        db.tablesData[tableName].order = order;
        db.tablesData[tableName].status = 'confirmed';
        db.markModified('tablesData');
        await db.save();
    }
    res.json({ success: true });
});

app.post('/api/transfer-table', async (req, res) => {
    const { fromTable, toTable } = req.body;
    const db = await getDBData();
    if (db.tablesData[fromTable] && db.tablesData[toTable]) {
        db.tablesData[toTable].order = db.tablesData[toTable].order.concat(db.tablesData[fromTable].order);
        db.tablesData[toTable].status = 'confirmed';
        db.tablesData[fromTable].order = [];
        db.tablesData[fromTable].status = 'empty';
        db.markModified('tablesData');
        await db.save();
    }
    res.json({ success: true, tablesData: db.tablesData });
});

app.post('/api/checkout', async (req, res) => {
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

    const db = await getDBData();
    if (!db.revenueHistory) db.revenueHistory = [];
    db.revenueHistory.unshift(newRecord);

    if (db.tablesData && db.tablesData[tableName]) {
        db.tablesData[tableName].order = [];
        db.tablesData[tableName].status = 'empty';
        db.tablesData[tableName].lastBill = newRecord;
        db.markModified('tablesData');
    }

    db.markModified('revenueHistory');
    await db.save();
    res.json({ success: true });
});

app.get('/api/revenue', async (req, res) => {
    const db = await getDBData();
    res.json({ revenueHistory: db.revenueHistory || [] });
});

app.post('/api/delete-revenue', async (req, res) => {
    const { id } = req.body;
    const db = await getDBData();
    if (db.revenueHistory) {
        db.revenueHistory = db.revenueHistory.filter(item => item.id !== id);
        db.markModified('revenueHistory');
        await db.save();
    }
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server Quán Nướng Tuổi Trẻ running on port ${PORT}`);
});