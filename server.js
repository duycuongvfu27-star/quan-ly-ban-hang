const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

let activeOrders = [];
let paidHistory = [];

// Hàm lấy thời gian chuẩn Việt Nam (HH:mm và YYYY-MM-DD)
function getVietnamTime() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    // Múi giờ Việt Nam UTC+7
    const vnTime = new Date(utc + (3600000 * 7));
    
    let timeStr = vnTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    let dateStr = vnTime.toISOString().split('T')[0];
    return { timeStr, dateStr };
}

// API nhận order hoặc thanh toán từ POS / Khách hàng
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

// API trả về danh sách đơn đang hoạt động
app.get('/api/orders', (req, res) => {
    res.json(activeOrders);
});

// GIAO DIỆN QUẢN LÝ DOANH THU THEO NGÀY
app.get('/api/orders/view', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <title>Quản Lý Doanh Thu - Quán Nướng Tuổi Trẻ</title>
            <style>
                body { background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, sans-serif; margin: 0; padding: 15px; color: #333; }
                header { background: #b71c1c; color: white; padding: 12px 20px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
                header h1 { margin: 0; font-size: 18px; }
                header button { background: #ffa000; border: none; padding: 6px 14px; font-weight: bold; color: #fff; border-radius: 4px; cursor: pointer; }
                
                .filter-box { background: white; padding: 12px 20px; border-radius: 6px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 10px; font-weight: bold; font-size: 13px; }
                .filter-box input { padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; }

                .revenue-cards { display: flex; gap: 15px; margin-bottom: 15px; }
                .card { background: white; padding: 15px 20px; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); flex: 1; border-left: 5px solid #4caf50; }
                .card h3 { margin: 0 0 5px 0; font-size: 12px; color: #666; text-transform: uppercase; }
                .card p { margin: 0; font-size: 22px; font-weight: bold; color: #2e7d32; }

                .table-container { background: white; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); overflow: hidden; }
                .table-container h2 { margin: 0; background: #37474f; color: white; padding: 10px 15px; font-size: 13px; text-transform: uppercase; }
                table { width: 100%; border-collapse: collapse; font-size: 13px; }
                th, td { padding: 10px 15px; text-align: left; border-bottom: 1px solid #eee; }
                th { background: #f8f9fa; color: #333; font-weight: bold; }
                tr:hover { background: #fdfdfd; }
                .btn-del { background: #d32f2f; color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-weight: bold; }
            </style>
        </head>
        <body>
            <header>
                <h1>📊 QUÁN NƯỚNG TUỔI TRẺ - QUẢN LÝ DOANH THU</h1>
                <button onclick="window.location.href='/quanly.html'">⬅ Quay lại màn hình POS</button>
            </header>

            <div class="filter-box">
                <span>Chọn ngày xem:</span>
                <input type="date" id="filterDate" onchange="filterData()">
            </div>

            <div class="revenue-cards">
                <div class="card">
                    <h3>Tổng Doanh Thu</h3>
                    <p id="sumRev">0 VNĐ</p>
                </div>
                <div class="card" style="border-left-color: #0288d1;">
                    <h3>Số Lượt Đơn / Bàn</h3>
                    <p id="sumCount" style="color: #0288d1;">0 đơn</p>
                </div>
            </div>

            <div class="table-container">
                <h2>Danh Sách Hóa Đơn Đã Thanh Toán</h2>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 70px;">Giờ</th>
                            <th style="width: 80px;">Bàn</th>
                            <th>Chi Tiết Món Mua</th>
                            <th style="width: 110px;">Thu Ngân</th>
                            <th style="width: 130px; text-align: right;">Tổng Tiền</th>
                            <th style="width: 70px; text-align: center;">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody id="orderTableBody"></tbody>
                </table>
            </div>

            <script>
                let data = ${JSON.stringify(paidHistory)};
                
                const nowUtc = new Date();
                const nowVn = new Date(nowUtc.getTime() + (nowUtc.getTimezoneOffset() * 60000) + (3600000 * 7));
                document.getElementById('filterDate').value = nowVn.toISOString().split('T')[0];

                function filterData() {
                    let selectedDate = document.getElementById('filterDate').value;
                    let filtered = data.filter(o => o.date === selectedDate);
                    
                    let tbody = document.getElementById('orderTableBody');
                    tbody.innerHTML = '';
                    let totalRev = 0;

                    if(filtered.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#888; padding:30px;">Không có dữ liệu doanh thu trong ngày này</td></tr>';
                    }

                    filtered.forEach(ord => {
                        totalRev += ord.totalAmount;
                        tbody.innerHTML += \`
                            <tr>
                                <td>\${ord.time}</td>
                                <td><b>\${ord.tableName}</b></td>
                                <td>\${ord.itemsText}</td>
                                <td><span style="background:#e0f2f1; color:#00695c; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:11px;">\${ord.staff}</span></td>
                                <td style="text-align: right; font-weight: bold; color: #d32f2f;">\${ord.totalAmount.toLocaleString()} đ</td>
                                <td style="text-align: center;"><button class="btn-del" onclick="deleteOrder(\${ord.id})">Xóa</button></td>
                            </tr>
                        \`;
                    });

                    document.getElementById('sumRev').innerText = totalRev.toLocaleString() + ' VNĐ';
                    document.getElementById('sumCount').innerText = filtered.length + ' đơn';
                }

                function deleteOrder(id) {
                    if(confirm('Bạn có chắc muốn xóa hóa đơn này không?')) {
                        data = data.filter(o => o.id !== id);
                        filterData();
                    }
                }

                filterData();
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng ${PORT}`);
});