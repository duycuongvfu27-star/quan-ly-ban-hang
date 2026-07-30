const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

let globalActiveOrders = [];
let globalPaidHistory = [];
let globalTableStatus = {}; 

let globalStaffList = [
    { name: "Quản Lý 1", pin: "1234", role: "manager" },
    { name: "Quản Lý 2", pin: "8888", role: "manager" },
    { name: "Nhân Viên 1", pin: "1111", role: "staff" },
    { name: "Nhân Viên 2", pin: "2222", role: "staff" }
];

function getVietnamTime() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const vnTime = new Date(utc + (3600000 * 7));
    let timeStr = vnTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    let dateStr = vnTime.toISOString().split('T')[0];
    return { timeStr, dateStr };
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/staff', (req, res) => {
    res.json(globalStaffList);
});

app.post('/api/staff/add', (req, res) => {
    const { name, pin, role } = req.body;
    if (name && pin) {
        let existing = globalStaffList.find(s => s.name === name);
        if (existing) {
            existing.pin = pin;
            if (role) existing.role = role;
        } else {
            globalStaffList.push({ name, pin, role: role || 'staff' });
        }
    }
    res.json({ success: true, staff: globalStaffList });
});

app.post('/api/staff/remove', (req, res) => {
    const { name } = req.body;
    if (globalStaffList.length > 1) {
        globalStaffList = globalStaffList.filter(s => s.name !== name);
    }
    res.json({ success: true, staff: globalStaffList });
});

app.post('/api/checkout', (req, res) => {
    const { tableName, items, totalAmount, discount, voucherCode, staff, tableStatus } = req.body;
    let { timeStr, dateStr } = getVietnamTime();
    let itemsText = items.map(i => `${i.name} (x${i.quantity})`).join(', ');

    if (tableStatus) {
        globalTableStatus[tableName] = tableStatus;
    }

    if (staff === 'Khách tự order') {
        let existing = globalActiveOrders.find(o => o.tableName === tableName);
        if (existing) {
            items.forEach(newItem => {
                let foundItem = existing.items.find(i => i.name === newItem.name);
                if (foundItem) {
                    foundItem.quantity += newItem.quantity;
                } else {
                    existing.items.push(newItem);
                }
            });
            existing.totalAmount += totalAmount;
        } else {
            globalActiveOrders.unshift({
                id: Date.now(),
                time: timeStr,
                tableName,
                items,
                totalAmount
            });
        }
    } else if (totalAmount === 0 && tableStatus === 'busy') {
        // Trường hợp báo bếp
        let existing = globalActiveOrders.find(o => o.tableName === tableName);
        if (existing) {
            existing.items = items;
        }
    } else {
        let discountText = discount > 0 ? ` (Giảm: -${discount.toLocaleString()}đ [${voucherCode}])` : '';
        const newPaidOrder = {
            id: Date.now(),
            time: timeStr,
            tableName,
            itemsText: itemsText + discountText,
            totalAmount,
            staff: staff || 'Nhân viên',
            date: dateStr
        };
        globalPaidHistory.unshift(newPaidOrder);
        globalActiveOrders = globalActiveOrders.filter(o => o.tableName !== tableName);
        delete globalTableStatus[tableName]; 
    }

    res.status(200).json({ success: true, activeOrders: globalActiveOrders, tableStatus: globalTableStatus });
});

app.get('/api/orders', (req, res) => {
    res.json({ activeOrders: globalActiveOrders, tableStatus: globalTableStatus });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng ${PORT}`);
});