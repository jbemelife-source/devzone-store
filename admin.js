const ADMIN_PASSWORD = "jbadmin2025";
function getProducts() {
    return JSON.parse(localStorage.getItem('shopProducts') || "null") || [
        { id: 1, name: "Tech Earbuds", price: 24, image: "https://m.media-amazon.com/images/I/51B+oM7CNYL._AC_SX679_.jpg", cat: "tech", desc: "Wireless, noise-cancelling, sweatproof." },
        { id: 2, name: "Eco Polo Shirt", price: 18, image: "https://m.media-amazon.com/images/I/81lDAWWsWML._AC_SY675_.jpg", cat: "clothes", desc: "Breathable eco cotton, classic fit." },
        { id: 3, name: "Tablet Stand", price: 12, image: "https://m.media-amazon.com/images/I/515SOBkP4NL._AC_SY679_.jpg", cat: "accessories", desc: "Universal, anti-slip, ultra durable." },
        { id: 4, name: "Green Smartwatch", price: 29, image: "https://m.media-amazon.com/images/I/71p-tHQgl-L._AC_SY679_.jpg", cat: "tech", desc: "Fitness, calls, messages, step tracker." }
    ];
}
function saveProducts(arr) { localStorage.setItem('shopProducts', JSON.stringify(arr)); }
function getOrders() { return JSON.parse(localStorage.getItem('ordersv2') || "[]"); }

function adminLogin() {
    if (document.getElementById('adminPass').value === ADMIN_PASSWORD) {
        document.getElementById('adminLogin').style.display = "none";
        document.getElementById('adminPanel').style.display = "";
        showAdminTab('products');
    } else {
        document.getElementById('adminError').textContent = "Wrong password!";
    }
}
function logoutAdmin() {
    document.getElementById('adminPanel').style.display = "none";
    document.getElementById('adminLogin').style.display = "";
    document.getElementById('adminPass').value = "";
    document.getElementById('adminError').textContent = "";
}

function showAdminTab(tab) {
    document.getElementById('admin-products').style.display = tab === 'products' ? '' : 'none';
    document.getElementById('admin-orders').style.display = tab === 'orders' ? '' : 'none';
    if (tab === 'products') renderProductAdmin();
    if (tab === 'orders') renderOrdersAdmin();
}

function renderProductAdmin() {
    let products = getProducts();
    let out = `<h3>Products</h3>
    <button onclick="renderAddProduct()" class="prod-btn wide">+ Add Product</button>
    <table><tr><th>Name</th><th>Price</th><th>Cat</th><th></th></tr>`;
    products.forEach((p, i) => {
        out += `<tr>
      <td>${p.name}</td>
      <td>$${p.price}</td>
      <td>${p.cat}</td>
      <td><button onclick="deleteProd(${i})" style="background:#e51010;color:#fff;border-radius:7px;">Delete</button></td>
    </tr>`;
    });
    out += `</table>`;
    document.getElementById('admin-products').innerHTML = out;
}

function renderAddProduct() {
    document.getElementById('admin-products').innerHTML = `
    <h3>Add Product</h3>
    <form id="addPForm" autocomplete="off">
      <input id="pname" required placeholder="Name"/>
      <input id="pprice" type="number" required placeholder="Price"/>
      <select id="pcat" required>
        <option value="tech">Tech</option>
        <option value="clothes">Clothes</option>
        <option value="accessories">Accessories</option>
      </select>
      <input id="pimg" required placeholder="Image URL"/>
      <textarea id="pdesc" required placeholder="Description"></textarea>
      <button type="submit" class="prod-btn">Save</button>
      <button onclick="renderProductAdmin();return false;" style="background:#ddd;color:#122;">Cancel</button>
      <div class="form-error" id="pformErr"></div>
    </form>
  `;
    document.getElementById('addPForm').onsubmit = function (e) {
        e.preventDefault();
        let prods = getProducts();
        let name = document.getElementById('pname').value.trim(),
            price = parseFloat(document.getElementById('pprice').value || 0),
            cat = document.getElementById('pcat').value,
            image = document.getElementById('pimg').value.trim(),
            desc = document.getElementById('pdesc').value.trim();
        if (!name || !price || !image || !desc) { document.getElementById('pformErr').textContent = "Fill all fields."; return; }
        prods.push({ id: prods.length ? prods[prods.length - 1].id + 1 : 1, name, price, image, cat, desc });
        saveProducts(prods);
        showToast("Product added!");
        renderProductAdmin();
    }
}

function deleteProd(idx) {
    let prods = getProducts();
    prods.splice(idx, 1); saveProducts(prods);
    showToast("Deleted!"); renderProductAdmin();
}
function renderOrdersAdmin() {
    let orders = getOrders();
    let out = `<h3>Orders</h3>`;
    if (!orders.length) out += "<div>No orders yet.</div>";
    else orders.slice().reverse().forEach(o => {
        out += `<div style="padding:8px 0;border-bottom:1px solid #184;">
      <b>${o.date}</b>
      <ul style="list-style:none;margin:5px 0 0 0;padding:0;">
      ${o.items.map(i => `<li>${i.name} x${i.qty}</li>`).join('')}
      </ul></div>`;
    });
    document.getElementById('admin-orders').innerHTML = out;
}
function showToast(msg) {
    let x = document.getElementById('adminToast'); x.textContent = msg; x.style.display = 'block';
    setTimeout(() => { x.style.display = 'none'; }, 1350);
}
// Attach to window for onclick handlers in HTML
window.adminLogin = adminLogin;
window.renderAddProduct = renderAddProduct;
window.deleteProd = deleteProd;
window.logoutAdmin = logoutAdmin;
window.showAdminTab = showAdminTab;