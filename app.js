const inventory = [
  { name: 'Studio Pro Headphones', sku: 'AUD-2041', location: 'Downtown store', stock: 4, reorder: 10, icon: '🎧', type: 'audio' },
  { name: 'iPhone 15 Pro · 256GB', sku: 'PHN-1588', location: 'Online warehouse', stock: 6, reorder: 12, icon: '📱', type: 'phone' },
  { name: 'Apple Watch Series 9', sku: 'WAT-0921', location: 'Westside store', stock: 3, reorder: 8, icon: '⌚', type: 'watch' },
  { name: 'iPad Air · 128GB', sku: 'TAB-3140', location: 'Airport store', stock: 0, reorder: 6, icon: '📟', type: 'tablet' },
  { name: 'Soundbar 700', sku: 'AUD-7002', location: 'Downtown store', stock: 800, reorder: 8, icon: '🔊', type: 'audio' },
  { name: 'Galaxy S24 · 256GB', sku: 'PHN-2401', location: 'Online warehouse', stock: 600, reorder: 10, icon: '📱', type: 'phone' },
  { name: 'Smart TV 55” OLED', sku: 'TV-5509', location: 'Westside store', stock: 600, reorder: 5, icon: '📺', type: 'tablet' },
  { name: 'Wireless Charging Stand', sku: 'ACC-1108', location: 'Airport store', stock: 425, reorder: 12, icon: '🔋', type: 'watch' },
];

const orders = [
  { id: '#ORD-2841', customer: 'Olivia Rhye', initials: 'OR', date: 'Oct 20, 2026', channel: 'Online shop', status: 'Processing', total: 1299 },
  { id: '#ORD-2840', customer: 'Phoenix Baker', initials: 'PB', date: 'Oct 20, 2026', channel: 'Downtown store', status: 'Ready to ship', total: 248 },
  { id: '#ORD-2839', customer: 'Lana Steiner', initials: 'LS', date: 'Oct 19, 2026', channel: 'Online shop', status: 'In transit', total: 879 },
  { id: '#ORD-2838', customer: 'Demi Wilkinson', initials: 'DW', date: 'Oct 19, 2026', channel: 'Westside store', status: 'Delivered', total: 149 },
  { id: '#ORD-2837', customer: 'Candice Wu', initials: 'CW', date: 'Oct 19, 2026', channel: 'Online shop', status: 'Processing', total: 2199 },
  { id: '#ORD-2836', customer: 'Natali Craig', initials: 'NC', date: 'Oct 18, 2026', channel: 'Airport store', status: 'Delivered', total: 329 },
  { id: '#ORD-2835', customer: 'Drew Cano', initials: 'DC', date: 'Oct 18, 2026', channel: 'Online shop', status: 'Ready to ship', total: 568 },
  { id: '#ORD-2834', customer: 'Andi Lane', initials: 'AL', date: 'Oct 18, 2026', channel: 'Downtown store', status: 'In transit', total: 749 },
];

const customers = [
  { name: 'Olivia Rhye', initials: 'OR', email: 'olivia.rhye@email.com', last: 'Oct 20, 2026', orders: 8, spend: 4289 },
  { name: 'Phoenix Baker', initials: 'PB', email: 'phoenix.baker@email.com', last: 'Oct 20, 2026', orders: 3, spend: 1248 },
  { name: 'Lana Steiner', initials: 'LS', email: 'lana.steiner@email.com', last: 'Oct 19, 2026', orders: 12, spend: 6879 },
  { name: 'Demi Wilkinson', initials: 'DW', email: 'demi.wilkinson@email.com', last: 'Oct 19, 2026', orders: 2, spend: 349 },
  { name: 'Candice Wu', initials: 'CW', email: 'candice.wu@email.com', last: 'Oct 19, 2026', orders: 6, spend: 5199 },
  { name: 'Natali Craig', initials: 'NC', email: 'natali.craig@email.com', last: 'Oct 18, 2026', orders: 4, spend: 1329 },
  { name: 'Drew Cano', initials: 'DC', email: 'drew.cano@email.com', last: 'Oct 18, 2026', orders: 5, spend: 2568 },
];

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const lowStockItems = () => inventory.filter((item) => item.stock > 0 && item.stock <= item.reorder);
const statusClass = (status) => ({
  'Processing': 'status-processing',
  'Ready to ship': 'status-ready',
  'In transit': 'status-transit',
  'Delivered': 'status-delivered',
}[status] || '');

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function stockStatus(item) {
  if (item.stock === 0) return '<span class="status-pill status-out">Out of stock</span>';
  return item.stock <= item.reorder
    ? '<span class="status-pill status-processing">Low stock</span>'
    : '<span class="status-pill status-delivered">In stock</span>';
}

function renderStockWatch() {
  const items = lowStockItems().slice(0, 3);
  document.querySelector('#stockWatchList').innerHTML = items.map((item) => `
    <div class="stock-item">
      <span class="product-thumb ${item.type}">${item.icon}</span>
      <span class="stock-product"><strong>${item.name}</strong><small>${item.location}</small></span>
      <span class="stock-quantity"><strong>${item.stock} left</strong><small>Reorder at ${item.reorder}</small></span>
    </div>`).join('');
  const count = lowStockItems().length;
  document.querySelector('#lowStockCount').textContent = count;
  document.querySelector('#inventoryLowCount').textContent = count;
  document.querySelector('#lowFilterCount').textContent = count;
  document.querySelector('#outOfStockCount').textContent = inventory.filter((item) => item.stock === 0).length;
}

function renderInventory() {
  const search = document.querySelector('#inventorySearch').value.trim().toLowerCase();
  const filter = document.querySelector('[data-stock-filter].selected').dataset.stockFilter;
  const rows = inventory.filter((item) => {
    const matches = `${item.name} ${item.sku} ${item.location}`.toLowerCase().includes(search);
    return matches && (filter === 'all' || (item.stock > 0 && item.stock <= item.reorder));
  });
  document.querySelector('#inventoryBody').innerHTML = rows.length ? rows.map((item) => `
    <tr>
      <td><span class="customer-cell"><span class="product-thumb ${item.type}">${item.icon}</span>${item.name}</span></td>
      <td>${item.sku}</td><td><span class="location-tag">${item.location}</span></td>
      <td><span class="stock-level ${item.stock <= item.reorder ? 'low' : ''}"><strong>${item.stock} units</strong><small><i style="width:${Math.min(item.stock / item.reorder * 100, 100)}%"></i></small></span></td>
      <td>${item.reorder} units</td><td>${stockStatus(item)}</td>
      <td><button class="action-link" data-receive="${item.sku}">Receive</button></td>
    </tr>`).join('') : '<tr><td colspan="7" class="table-empty">No products match your search.</td></tr>';
  document.querySelector('#inventoryUnits').textContent = inventory.reduce((total, item) => total + item.stock, 0).toLocaleString();
}

function customerCell(name, initials) {
  return `<span class="customer-cell"><span class="mini-avatar">${initials}</span>${name}</span>`;
}

function orderRows(order, includeAction = false) {
  const nextAction = order.status === 'Processing' ? 'Pack order'
    : order.status === 'Ready to ship' ? 'Dispatch'
      : order.status === 'In transit' ? 'Mark delivered' : '';
  return `<tr>
    <td><span class="order-id">${order.id}</span></td>
    <td>${customerCell(order.customer, order.initials)}</td>
    <td>${order.date}</td><td><span class="channel-tag">${order.channel}</span></td>
    <td><span class="status-pill ${statusClass(order.status)}">${order.status}</span></td>
    <td class="align-right">${money.format(order.total)}</td>
    ${includeAction ? `<td>${nextAction ? `<button class="action-link" data-order-action="${order.id}">${nextAction}</button>` : '<span class="channel-tag">—</span>'}</td>` : ''}
  </tr>`;
}

function renderOrders() {
  const search = document.querySelector('#orderSearch').value.trim().toLowerCase();
  const filter = document.querySelector('[data-order-filter].selected').dataset.orderFilter;
  const rows = orders.filter((order) => {
    return `${order.id} ${order.customer} ${order.channel}`.toLowerCase().includes(search)
      && (filter === 'all' || order.status === filter);
  });
  document.querySelector('#ordersBody').innerHTML = rows.length
    ? rows.map((order) => orderRows(order, true)).join('')
    : '<tr><td colspan="7" class="table-empty">No orders match your search.</td></tr>';
  const recent = orders.slice(0, 4);
  document.querySelector('#recentOrdersBody').innerHTML = recent.map((order) => orderRows(order)).join('');
  document.querySelector('#toFulfilCount').textContent = orders.filter((order) => ['Processing', 'Ready to ship'].includes(order.status)).length + 6;
}

function renderCustomers() {
  const search = document.querySelector('#customerSearch').value.trim().toLowerCase();
  const rows = customers.filter((customer) => `${customer.name} ${customer.email}`.toLowerCase().includes(search));
  document.querySelector('#customersBody').innerHTML = rows.length ? rows.map((customer) => `
    <tr><td>${customerCell(customer.name, customer.initials)}</td><td>${customer.email}</td><td>${customer.last}</td><td>${customer.orders}</td><td class="align-right">${money.format(customer.spend)}</td></tr>
  `).join('') : '<tr><td colspan="5" class="table-empty">No customers match your search.</td></tr>';
}

function openStockDialog(sku) {
  const productSelect = document.querySelector('#stockProduct');
  productSelect.innerHTML = inventory.map((item) => `<option value="${item.sku}" ${item.sku === sku ? 'selected' : ''}>${item.name} (${item.stock} in stock)</option>`).join('');
  document.querySelector('#stockQuantity').value = '';
  document.querySelector('#stockDialog').showModal();
}

function exportCsv(filename, rows) {
  const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast(`${filename} downloaded`);
}

document.querySelectorAll('.nav-link, [data-view-link]').forEach((button) => {
  button.addEventListener('click', () => {
    const view = button.dataset.view || button.dataset.viewLink;
    document.querySelectorAll('.nav-link').forEach((link) => link.classList.toggle('active', link.dataset.view === view));
    document.querySelectorAll('.view').forEach((section) => section.classList.toggle('active', section.id === `view-${view}`));
    document.querySelector('#breadcrumbCurrent').textContent = view === 'reports' ? 'Reports' : view[0].toUpperCase() + view.slice(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

document.querySelector('#inventorySearch').addEventListener('input', renderInventory);
document.querySelector('#orderSearch').addEventListener('input', renderOrders);
document.querySelector('#customerSearch').addEventListener('input', renderCustomers);

document.querySelectorAll('[data-stock-filter]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-stock-filter]').forEach((chip) => chip.classList.toggle('selected', chip === button));
  renderInventory();
}));
document.querySelectorAll('[data-order-filter]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-order-filter]').forEach((chip) => chip.classList.toggle('selected', chip === button));
  renderOrders();
}));

document.querySelector('#inventoryBody').addEventListener('click', (event) => {
  const button = event.target.closest('[data-receive]');
  if (button) openStockDialog(button.dataset.receive);
});
document.querySelector('#addStockButton').addEventListener('click', () => openStockDialog());
document.querySelector('#stockForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const sku = document.querySelector('#stockProduct').value;
  const location = document.querySelector('#stockLocation').value;
  const quantity = Number(document.querySelector('#stockQuantity').value);
  const product = inventory.find((item) => item.sku === sku);
  if (!product || !Number.isInteger(quantity) || quantity < 1) {
    showToast('Enter a valid product and quantity.');
    return;
  }
  product.stock += quantity;
  product.location = location;
  renderStockWatch();
  renderInventory();
  document.querySelector('#stockDialog').close();
  showToast(`${quantity} units added to ${product.name}`);
});

document.querySelector('#ordersBody').addEventListener('click', (event) => {
  const button = event.target.closest('[data-order-action]');
  if (!button) return;
  const order = orders.find((item) => item.id === button.dataset.orderAction);
  const nextStatus = { Processing: 'Ready to ship', 'Ready to ship': 'In transit', 'In transit': 'Delivered' };
  if (!order || !nextStatus[order.status]) return;
  order.status = nextStatus[order.status];
  renderOrders();
  showToast(`${order.id} updated to ${order.status}`);
});

document.querySelector('#exportOrdersButton').addEventListener('click', () => {
  exportCsv('abcretail-orders.csv', [['Order', 'Customer', 'Date', 'Channel', 'Status', 'Total'], ...orders.map((order) => [order.id, order.customer, order.date, order.channel, order.status, order.total])]);
});
document.querySelector('#exportCustomersButton').addEventListener('click', () => {
  exportCsv('abcretail-customers.csv', [['Name', 'Email', 'Last order', 'Orders', 'Lifetime spend'], ...customers.map((customer) => [customer.name, customer.email, customer.last, customer.orders, customer.spend])]);
});
document.querySelector('#salesPeriod').addEventListener('change', (event) => showToast(`Sales view updated: ${event.target.value.toLowerCase()}`));
document.querySelector('#reportPeriod').addEventListener('change', (event) => showToast(`Report period set to ${event.target.value.toLowerCase()}`));

document.querySelector('#todayLabel').textContent = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());
renderStockWatch();
renderInventory();
renderOrders();
renderCustomers();
