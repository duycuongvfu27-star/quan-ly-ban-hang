<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QUÁN NƯỚNG TUỔI TRẺ - Quản Lý Bán Hàng</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    
    /* Phông nền trang web */
    body {
      background-color: #f0f2f5;
      background-image: linear-gradient(rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), 
                        url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1350&q=80');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      min-height: 100vh;
    }
    
    /* Header thanh tiêu đề */
    .header {
      background-color: #1a73e8;
      color: white;
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .header-title { font-size: 22px; font-weight: bold; }
    .header-sub { font-size: 14px; opacity: 0.9; }

    .container {
      display: flex;
      padding: 20px;
      gap: 20px;
      max-width: 1450px;
      margin: 0 auto;
    }
    
    /* Cột trái: Sơ đồ 16 bàn */
    .table-section {
      flex: 1.6;
      background: rgba(255, 255, 255, 0.95);
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      backdrop-filter: blur(5px);
    }

    .table-section h2 {
      margin-bottom: 20px;
      color: #333;
      border-bottom: 2px solid #1a73e8;
      padding-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .grid-tables {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
    }

    /* 1. TRẠNG THÁI MẶC ĐỊNH: BÀN TRỐNG (MÀU TRẮNG) */
    .table-card {
      background-color: #ffffff !important;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      padding: 18px 10px;
      text-align: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      cursor: pointer;
      transition: all 0.25s ease;
      position: relative;
      user-select: none;
    }

    .table-card .table-name {
      font-size: 18px;
      font-weight: bold;
      color: #333333;
      margin-bottom: 4px;
    }

    .table-card .table-status {
      font-size: 13px;
      color: #777777;
    }

    .table-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 12px rgba(0,0,0,0.15);
    }

    /* 2. TRẠNG THÁI: BÀN ĐÃ ORDER / CÓ KHÁCH (MÀU XANH, CHỮ TRẮNG) */
    .table-card.has-customer {
      background-color: #1a73e8 !important;
      border-color: #1557b0;
      box-shadow: 0 4px 10px rgba(26, 115, 232, 0.3);
    }

    .table-card.has-customer .table-name,
    .table-card.has-customer .table-status {
      color: #ffffff !important;
      font-weight: bold;
    }

    /* Nút Trả bàn nhanh đỏ trên ô bàn */
    .btn-quick-clear {
      margin-top: 8px;
      background: #dc3545;
      color: white;
      border: none;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      transition: 0.2s;
    }
    .btn-quick-clear:hover { background: #bd2130; }

    /* 3. BÀN ĐANG CHỌN (Viền cam nổi bật) */
    .table-card.active {
      border: 3px solid #ff9800 !important;
      transform: scale(1.02);
    }

    /* Cột phải: Đặt món & Thanh toán */
    .order-section {
      flex: 1.4;
      background: rgba(255, 255, 255, 0.95);
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      backdrop-filter: blur(5px);
    }

    .order-section h3 {
      font-size: 20px;
      color: #1a73e8;
      margin-bottom: 12px;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 10px;
    }

    .section-title {
      font-size: 15px;
      font-weight: bold;
      color: #444;
      margin: 12px 0 6px 0;
    }

    /* Thực đơn chọn món */
    .menu-list {
      max-height: 280px;
      overflow-y: auto;
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 6px;
      background: #fafafa;
    }

    .category-header {
      background: #e8f0fe;
      color: #1a73e8;
      font-weight: bold;
      padding: 6px 10px;
      font-size: 13px;
      border-radius: 4px;
      margin: 6px 0 4px 0;
    }

    .menu-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 10px;
      border-bottom: 1px solid #eee;
      font-size: 14px;
    }
    .menu-item:last-child { border-bottom: none; }

    .btn-add {
      background: #28a745;
      color: white;
      border: none;
      padding: 5px 12px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      font-size: 13px;
      transition: 0.2s;
    }
    .btn-add:hover { background: #218838; }

    /* Món đã gọi */
    .order-list {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 6px;
      background: #fafafa;
      min-height: 100px;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 10px;
      border-bottom: 1px solid #eee;
      font-size: 14px;
    }

    .qty-controls {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-qty {
      background: #e0e0e0;
      border: none;
      width: 26px;
      height: 26px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 4px;
      font-size: 15px;
    }
    .btn-qty:hover { background: #ccc; }

    .total-price {
      font-size: 20px;
      font-weight: bold;
      color: #d32f2f;
      margin-top: 15px;
      text-align: right;
    }

    .btn-checkout {
      width: 100%;
      background: #1a73e8;
      color: white;
      border: none;
      padding: 14px;
      font-size: 17px;
      border-radius: 8px;
      margin-top: 12px;
      cursor: pointer;
      font-weight: bold;
      transition: 0.2s;
    }
    .btn-checkout:hover { background: #1557b0; }
  </style>
</head>
<body>

  <div class="header">
    <span class="header-title">🔥 QUÁN NƯỚNG TUỔI TRẺ</span>
    <span class="header-sub">📞 Hotline: 0842.163.333 | Hệ thống 16 bàn</span>
  </div>

  <div class="container">
    <!-- Cột trái: Sơ đồ 16 bàn -->
    <div class="table-section">
      <h2>
        <span>Sơ đồ bàn</span>
        <span style="font-size: 13px; font-weight: normal; color: #666;">
          ⚪ Trống | 🔵 Có Khách
        </span>
      </h2>
      <div class="grid-tables" id="gridTables"></div>
    </div>

    <!-- Cột phải: Đặt món & Thanh toán -->
    <div class="order-section">
      <h3 id="selectedTableTitle">📌 Vui lòng chọn một bàn</h3>

      <!-- Thực đơn chọn món -->
      <div class="section-title">📋 Thực đơn (Bấm +Thêm để gọi món):</div>
      <div class="menu-list" id="menuList"></div>

      <!-- Danh sách món đã gọi của bàn -->
      <div class="section-title">🛒 Món đã chọn của bàn:</div>
      <div class="order-list" id="orderList">
        <p style="color: #888; font-size: 14px; text-align: center; padding-top: 35px;">
          Vui lòng bấm chọn một bàn để xem/thêm món
        </p>
      </div>

      <div class="total-price" id="totalPrice">Tổng tiền: 0 đ</div>
      <button class="btn-checkout" onclick="checkout()">Thanh toán / Trả bàn</button>
    </div>
  </div>

  <script>
    // 1. MENU CHÍNH XÁC TỪ THỰC ĐƠN QUÁN NƯỚNG TUỔI TRẺ
    const menuData = [
      // ĐỒ ĂN NHẸ
      { id: 1, category: "ĐỒ ĂN NHẸ", name: "Hoa quả thập cẩm", price: 29000 },
      { id: 2, category: "ĐỒ ĂN NHẸ", name: "Ngô chiên", price: 35000 },
      { id: 3, category: "ĐỒ ĂN NHẸ", name: "Bánh mỹ nướng bơ", price: 19000 },
      { id: 4, category: "ĐỒ ĂN NHẸ", name: "Khoai tây chiên", price: 35000 },
      { id: 5, category: "ĐỒ ĂN NHẸ", name: "Salad rau tổng hợp (mới)", price: 29000 },
      { id: 6, category: "ĐỒ ĂN NHẸ", name: "Salad hoa quả (Hót)", price: 39000 },
      { id: 7, category: "ĐỒ ĂN NHẸ", name: "Kim chi Hàn Quốc", price: 29000 },

      // CÁC MÓN NƯỚNG
      { id: 8, category: "CÁC MÓN NƯỚNG", name: "Ba chỉ", price: 65000 },
      { id: 9, category: "CÁC MÓN NƯỚNG", name: "Sụn non ướp ngũ vị", price: 69000 },
      { id: 10, category: "CÁC MÓN NƯỚNG", name: "Nầm tươi ứa sữa (Hót)", price: 75000 },
      { id: 11, category: "CÁC MÓN NƯỚNG", name: "Bò cuộn nấm kim", price: 59000 },
      { id: 12, category: "CÁC MÓN NƯỚNG", name: "Thịt dải heo (mới)", price: 69000 },
      { id: 13, category: "CÁC MÓN NƯỚNG", name: "Má đào heo (Đỉnh)", price: 79000 },
      { id: 14, category: "CÁC MÓN NƯỚNG", name: "Nọng má tươi (giòn ngon)", price: 79000 },
      { id: 15, category: "CÁC MÓN NƯỚNG", name: "Chân gà rút xương (Best Seller)", price: 99000 },
      { id: 16, category: "CÁC MÓN NƯỚNG", name: "Chân gà rút xương (đĩa nhỏ)", price: 59000 },
      { id: 17, category: "CÁC MÓN NƯỚNG", name: "Lòng non (Best seller)", price: 59000 },
      { id: 18, category: "CÁC MÓN NƯỚNG", name: "Khấu đuôi giòn sần sật (Hót)", price: 69000 },
      { id: 19, category: "CÁC MÓN NƯỚNG", name: "Lòng già mềm mĩm (Béo nhất quán)", price: 59000 },
      { id: 20, category: "CÁC MÓN NƯỚNG", name: "Dạ dày nướng xa tế", price: 69000 },
      { id: 21, category: "CÁC MÓN NƯỚNG", name: "Tôm tươi", price: 89000 },
      { id: 22, category: "CÁC MÓN NƯỚNG", name: "Mực rụng trứng", price: 89000 },
      { id: 23, category: "CÁC MÓN NƯỚNG", name: "Bạch tuộc nướng xa tế", price: 79000 },
      { id: 24, category: "CÁC MÓN NƯỚNG", name: "Xúc xích ướp ngũ vị", price: 59000 },
      { id: 25, category: "CÁC MÓN NƯỚNG", name: "Dồi sụn ướp ngũ vị", price: 59000 },
      { id: 26, category: "CÁC MÓN NƯỚNG", name: "Lạp xưởng nướng thượng hạng", price: 59000 },
      { id: 27, category: "CÁC MÓN NƯỚNG", name: "Dải thăn bò nướng tảng (Best seller)", price: 79000 },
      { id: 28, category: "CÁC MÓN NƯỚNG", name: "Nạc vai nướng tảng (mới)", price: 69000 },
      { id: 29, category: "CÁC MÓN NƯỚNG", name: "Bò ăn dỗi lăn (phải thử 1 lần)", price: 79000 },
      { id: 30, category: "CÁC MÓN NƯỚNG", name: "U bò nướng (Hót)", price: 89000 },
      { id: 31, category: "CÁC MÓN NƯỚNG", name: "Rẻ sườn nướng xa tế", price: 69000 },
      { id: 32, category: "CÁC MÓN NƯỚNG", name: "Bắp bò ướp ngũ vị", price: 79000 },

      // ĐỒ ÚONG
      { id: 33, category: "ĐỒ ƯỐNG", name: "Rượu ngô ngon, táo mèo, mơ, men lá", price: 40000 },
      { id: 34, category: "ĐỒ ƯỐNG", name: "Bia Sài Gòn, bia 333", price: 15000 },
      { id: 35, category: "ĐỒ ƯỐNG", name: "Bia Tiger", price: 22000 },
      { id: 36, category: "ĐỒ ƯỐNG", name: "Bò húc", price: 17000 },
      { id: 37, category: "ĐỒ ƯỐNG", name: "Nước lọc", price: 7000 },
      { id: 38, category: "ĐỒ ƯỐNG", name: "Trà đá (ca), thuốc lá", price: 20000 },
      { id: 39, category: "ĐỒ ƯỐNG", name: "Rượu dừa", price: 65000 },
      { id: 40, category: "ĐỒ ƯỐNG", name: "Nước ngọt các loại", price: 13000 }
    ];

    // 2. Khởi tạo 16 bàn
    const tables = [];
    for (let i = 1; i <= 16; i++) {
      tables.push({ id: i, name: `Bàn ${i}`, orders: [] });
    }

    let currentTableId = null;

    // Render sơ đồ 16 bàn (Trắng = Trống, Xanh = Có Khách)
    function renderTables() {
      const grid = document.getElementById('gridTables');
      grid.innerHTML = '';
      tables.forEach(t => {
        const isOrdered = t.orders && t.orders.length > 0;
        const isActive = t.id === currentTableId;

        grid.innerHTML += `
          <div class="table-card ${isOrdered ? 'has-customer' : ''} ${isActive ? 'active' : ''}" onclick="selectTable(${t.id})">
            <div class="table-name">${t.name}</div>
            <div class="table-status">${isOrdered ? 'Đã Order' : 'Trống'}</div>
            ${isOrdered ? `<button class="btn-quick-clear" onclick="event.stopPropagation(); clearTable(${t.id})">Trả bàn</button>` : ''}
          </div>
        `;
      });
    }

    // Render danh sách menu món ăn
    function renderMenu() {
      const menuDiv = document.getElementById('menuList');
      menuDiv.innerHTML = '';
      
      let currentCategory = "";
      menuData.forEach(item => {
        if (item.category !== currentCategory) {
          currentCategory = item.category;
          menuDiv.innerHTML += `<div class="category-header">🔹 ${currentCategory}</div>`;
        }

        menuDiv.innerHTML += `
          <div class="menu-item">
            <span><b>${item.name}</b> - <span style="color: #d32f2f;">${item.price.toLocaleString()}đ</span></span>
            <button class="btn-add" onclick="addFood(${item.id})">+ Thêm</button>
          </div>
        `;
      });
    }

    // Chọn bàn
    function selectTable(id) {
      currentTableId = id;
      document.getElementById('selectedTableTitle').innerText = `📌 Chi tiết - Bàn ${id}`;
      renderTables();
      renderOrders();
    }

    // Thêm món vào bàn
    function addFood(foodId) {
      if (!currentTableId) {
        alert("Vui lòng click chọn một bàn ở sơ đồ bên trái trước!");
        return;
      }
      const table = tables.find(t => t.id === currentTableId);
      const food = menuData.find(m => m.id === foodId);

      const existingOrder = table.orders.find(o => o.id === foodId);
      if (existingOrder) {
        existingOrder.quantity += 1;
      } else {
        table.orders.push({ ...food, quantity: 1 });
      }

      renderTables();
      renderOrders();
    }

    // Tăng / giảm số lượng món
    function changeQty(foodId, delta) {
      const table = tables.find(t => t.id === currentTableId);
      const order = table.orders.find(o => o.id === foodId);
      if (order) {
        order.quantity += delta;
        if (order.quantity <= 0) {
          table.orders = table.orders.filter(o => o.id !== foodId);
        }
      }
      renderTables();
      renderOrders();
    }

    // Nút Trả bàn nhanh trực tiếp trên ô bàn
    function clearTable(tableId) {
      if (confirm(`Xác nhận trả Bàn ${tableId} về trạng thái TRỐNG?`)) {
        const table = tables.find(t => t.id === tableId);
        if (table) table.orders = [];
        renderTables();
        renderOrders();
      }
    }

    // Render món đã gọi & tổng tiền
    function renderOrders() {
      const orderDiv = document.getElementById('orderList');
      const totalDiv = document.getElementById('totalPrice');

      if (!currentTableId) {
        orderDiv.innerHTML = '<p style="color: #888; font-size: 14px; text-align: center; padding-top: 35px;">Chưa chọn bàn</p>';
        totalDiv.innerText = 'Tổng tiền: 0 đ';
        return;
      }

      const table = tables.find(t => t.id === currentTableId);
      if (table.orders.length === 0) {
        orderDiv.innerHTML = '<p style="color: #888; font-size: 14px; text-align: center; padding-top: 35px;">Bàn đang trống (chưa có món)</p>';
        totalDiv.innerText = 'Tổng tiền: 0 đ';
        return;
      }

      let html = '';
      let total = 0;
      table.orders.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
          <div class="order-item">
            <div>
              <b>${item.name}</b><br>
              <small style="color: #666;">${item.price.toLocaleString()}đ x ${item.quantity}</small>
            </div>
            <div class="qty-controls">
              <button class="btn-qty" onclick="changeQty(${item.id}, -1)">-</button>
              <span style="min-width: 20px; text-align: center; font-weight: bold;">${item.quantity}</span>
              <button class="btn-qty" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
          </div>
        `;
      });

      orderDiv.innerHTML = html;
      totalDiv.innerText = `Tổng tiền: ${total.toLocaleString()} đ`;
    }

    // Thanh toán / Trả bàn
    function checkout() {
      if (!currentTableId) {
        alert("Vui lòng chọn bàn cần thanh toán!");
        return;
      }
      const table = tables.find(t => t.id === currentTableId);
      if (table.orders.length === 0) {
        alert("Bàn này đang trống!");
        return;
      }
      
      let total = table.orders.reduce((sum, item) => sum + item.price * item.quantity, 0);
      if (confirm(`Thanh toán cho Bàn ${currentTableId}?\nTổng tiền: ${total.toLocaleString()} đ`)) {
        table.orders = [];
        renderTables();
        renderOrders();
        alert(`Thanh toán thành công Bàn ${currentTableId}! Bàn đã quay về màu trắng.`);
      }
    }

    // Khởi chạy ban đầu
    renderTables();
    renderMenu();
  </script>
</body>
</html>