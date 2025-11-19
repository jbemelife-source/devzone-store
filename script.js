const shopProducts = JSON.parse(localStorage.getItem('shopProducts') || "null") || [
    { id: 1, name: "Tech Earbuds", price: 24, image: "https://ibb.co/TxByy64v", cat: "tech", desc: "Wireless, noise-cancelling, sweatproof." },
    { id: 2, name: "Eco Polo Shirt", price: 18, image: "https://m.media-amazon.com/images/I/81lDAWWsWML._AC_SY675_.jpg", cat: "clothes", desc: "Breathable eco cotton, classic fit." },
    { id: 3, name: "Tablet Stand", price: 12, image: "https://m.media-amazon.com/images/I/515SOBkP4NL._AC_SY679_.jpg", cat: "accessories", desc: "Universal, anti-slip, ultra durable." },
    { id: 4, name: "Green Smartwatch", price: 29, image: "https://m.media-amazon.com/images/I/71p-tHQgl-L._AC_SY679_.jpg", cat: "tech", desc: "Fitness, calls, messages, step tracker." }
];
function setProducts(arr) { localStorage.setItem('shopProducts', JSON.stringify(arr)); }
let cart = JSON.parse(localStorage.getItem('cartv2') || "[]");
function saveCart() { localStorage.setItem('cartv2', JSON.stringify(cart)); }
function getOrders() { return JSON.parse(localStorage.getItem('ordersv2') || "[]"); }
function saveOrders(o) { localStorage.setItem('ordersv2', JSON.stringify(o)); }

function renderProducts(cat = "all") {
    let grid = document.getElementById('productGrid');
    let prod = JSON.parse(localStorage.getItem('shopProducts') || "null") || shopProducts;
    let filtered = prod.filter(p => cat === "all" || p.cat === cat);
    grid.innerHTML = '';
    filtered.forEach(p => {
        let card = document.createElement('div');
        card.className = "product-card";
        card.innerHTML = `
      <span class="prod-cat">${p.cat.toUpperCase()}</span>
      <img src="https://ibb.co/TxByy64v" class="prod-img"/>
      <h4>${p.name}</h4>
      <div class="prod-price">$${p.price.toFixed(2)}</div>
      <div class="card-btns">
        <button class="prod-btn" onclick="addToCart(${p.id});event.stopPropagation();">Add</button>
        <button class="prod-btn" onclick="showProductModal(${p.id});event.stopPropagation();">Details</button>
      </div>
    `;
        card.onclick = () => showProductModal(p.id);
        grid.appendChild(card);
    });
}

window.addToCart = function (id) {
    let idx = cart.findIndex(c => c.id === id);
    if (idx > -1) cart[idx].qty++; else cart.push({ id, qty: 1 });
    saveCart(); updateCart();
};
function updateCart() {
    document.getElementById('cartQuantity').textContent = cart.reduce((a, b) => a + b.qty, 0);
}
updateCart();

function showCartModal() {
    let modal = document.getElementById('cartModal');
    let items = document.getElementById('cartItems');
    let prod = JSON.parse(localStorage.getItem('shopProducts') || "null") || shopProducts;
    if (!cart.length) { items.innerHTML = `<div>Cart empty.</div>`; }
    else {
        let html = '';
        cart.forEach(item => {
            let product = prod.find(p => p.id === item.id);
            if (product)
                html += `<div><span>${product.name} x${item.qty}</span>
        <span>$${(product.price * item.qty).toFixed(2)}
        <button class="prod-btn" style="background:var(--green);color:var(--ash);" onclick="removeCart(${product.id});event.stopPropagation();">x</button>
        </span></div>`;
        });
        items.innerHTML = html;
    }
    modal.classList.add('open');
}
window.removeCart = function (id) {
    cart = cart.filter(i => i.id !== id);
    saveCart(); updateCart(); showCartModal();
}
document.getElementById('cartBtn').onclick = showCartModal;
document.getElementById('closeCart').onclick = () => document.getElementById('cartModal').classList.remove('open');
document.getElementById('cartModal').onclick = function (e) { if (e.target === this) this.classList.remove('open'); };

function showProductModal(id) {
    let p = (JSON.parse(localStorage.getItem('shopProducts') || "null") || shopProducts).find(x => x.id === id); if (!p) return;
    document.getElementById('prodModalContent').innerHTML = `
    <span class="close" onclick="closeProdModal()">&times;</span>
    <img src="https://ibb.co/TxByy64v" style="width:90px;border-radius:7px;">
    <h4>${p.name}</h4>
    <div style="color:var(--accent);font-weight:600;">$${p.price.toFixed(2)}</div>
    <div style="margin:7px 0 12px 0; color:var(--ash2);">${p.desc}</div>
    <button class="prod-btn" onclick="addToCart(${p.id});closeProdModal();">Add to Cart</button>`;
    document.getElementById('productModal').classList.add('open');
}
window.showProductModal = showProductModal;
function closeProdModal() { document.getElementById('productModal').classList.remove('open'); }
document.getElementById('productModal').onclick = function (e) { if (e.target === this) closeProdModal(); };

document.getElementById('cartOrderBtn').onclick = function () {
    if (!cart.length) return;
    let prod = JSON.parse(localStorage.getItem('shopProducts') || "null") || shopProducts;
    let orders = getOrders();
    let orderItems = cart.map(c => ({ ...prod.find(p => p.id === c.id), qty: c.qty }));
    orders.push({ items: orderItems, date: new Date().toLocaleString() });
    saveOrders(orders);
    cart = []; saveCart(); updateCart();
    document.getElementById('cartModal').classList.remove('open');
    alert("Order placed! (Just a demo)");
};

document.getElementById('catSelect').onchange = function () {
    renderProducts(this.value);
};

document.getElementById('orderBtn').onclick = function () {
    let orders = getOrders();
    let box = document.getElementById('pastOrders');
    if (!orders.length) box.innerHTML = `<div>No orders placed yet.</div>`;
    else box.innerHTML = orders.slice().reverse().map(o => `
    <div style="margin-bottom:11px;border-bottom:1px solid #eee;padding-bottom:7px;">
      <div style="font-size:.98em;color:var(--green);"><b>${o.date}</b></div>
      <ul style="margin:0;padding-left:18px;">
        ${o.items.map(i => `<li>${i.name} x${i.qty}</li>`).join('')}
      </ul>
    </div>
  `).join('');
    document.getElementById('ordersModal').classList.add('open');
};
document.getElementById('closeOrders').onclick = () => document.getElementById('ordersModal').classList.remove('open');
document.getElementById('ordersModal').onclick = function (e) { if (e.target === this) this.classList.remove('open'); };

renderProducts();