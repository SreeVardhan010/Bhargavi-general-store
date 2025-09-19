
// Bhargavi General Store - app.js (client-side demo)
// NOTE: Replace RAZORPAY_KEY with your Razorpay Test Key ID (starts with rzp_test_)
// For production you must create orders on server using your Key Secret.
// This demo uses client-only checkout for testing convenience.

const RAZORPAY_KEY = 'Q4m79AEX9knQew';

// Sample product catalog
const PRODUCTS = [
  { id: 'p1', title: 'Premium Rice 5kg', price: 450, img:'https://picsum.photos/seed/rice/400/300', desc: 'High quality rice.' },
  { id: 'p2', title: 'Cooking Oil 1L', price: 160, img:'https://picsum.photos/seed/oil/400/300', desc: 'Refined cooking oil.' },
  { id: 'p3', title: 'Dish Soap', price: 75, img:'https://picsum.photos/seed/soap/400/300', desc: 'Gentle and effective.' },
  { id: 'p4', title: 'Toothpaste', price: 120, img:'https://picsum.photos/seed/toothpaste/400/300', desc: 'Protects enamel.' },
  { id: 'p5', title: 'Handwash', price: 90, img:'https://picsum.photos/seed/handwash/400/300', desc: 'Kills germs.' },
  { id: 'p6', title: 'Masala Pack', price: 55, img:'https://picsum.photos/seed/masala/400/300', desc: 'Fresh spice mix.' }
];

function getCart(){
  return JSON.parse(localStorage.getItem('bgs_cart') || '[]');
}
function saveCart(cart){
  localStorage.setItem('bgs_cart', JSON.stringify(cart));
  updateCartUI();
}
function addToCart(productId, qty=1){
  const cart = getCart();
  const found = cart.find(i=>i.id===productId);
  if(found) found.qty += qty;
  else{
    const p = PRODUCTS.find(x=>x.id===productId);
    cart.push({ id:p.id, title:p.title, price:p.price, img:p.img, qty: qty });
  }
  saveCart(cart);
  alert('Added to cart');
}
function removeFromCart(productId){
  let cart = getCart().filter(i=>i.id!==productId);
  saveCart(cart);
}
function updateQty(productId, qty){
  const cart = getCart();
  const it = cart.find(i=>i.id===productId);
  if(!it) return;
  it.qty = Math.max(1, qty);
  saveCart(cart);
}
function cartTotal(){
  return getCart().reduce((s,i)=> s + i.price * i.qty, 0);
}
function updateCartUI(){
  const count = getCart().reduce((s,i)=> s + i.qty, 0);
  const el = document.getElementById('cartCount');
  if(el) el.innerText = count;
  // drawer
  const drawer = document.getElementById('drawerItems');
  if(drawer){
    const cart = getCart();
    drawer.innerHTML = '';
    let total = 0;
    cart.forEach(it=>{
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${it.img}" alt="">
        <div style="flex:1">
          <div style="font-weight:600">${it.title}</div>
          <div>₹${it.price} x ${it.qty}</div>
        </div>
        <div style="text-align:right">
          <div class="qty">
            <button class="ghost" onclick="updateQtyFromBtn('${it.id}', -1)">-</button>
            <div style="padding:6px 8px">${it.qty}</div>
            <button class="ghost" onclick="updateQtyFromBtn('${it.id}', 1)">+</button>
          </div>
          <div style="margin-top:6px"><button class="ghost" onclick="removeFromCartAndRefresh('${it.id}')">Remove</button></div>
        </div>
      `;
      drawer.appendChild(div);
      total += it.price * it.qty;
    });
    const totalEl = document.getElementById('drawerTotal');
    if(totalEl) totalEl.innerText = total;
  }

  // user area render (if on pages without renderUserArea call)
  renderUserArea();
}

function updateQtyFromBtn(id, delta){
  const cart = getCart();
  const it = cart.find(x=>x.id===id);
  if(!it) return;
  it.qty = Math.max(1, it.qty + delta);
  saveCart(cart);
}
function removeFromCartAndRefresh(id){
  removeFromCart(id);
  renderCartPage();
  updateCartUI();
}

function renderProducts(query){
  const grid = document.getElementById('productGrid');
  if(!grid) return;
  grid.innerHTML = '';
  const q = (query || '').toLowerCase();
  const list = PRODUCTS.filter(p=> !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  list.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div style="font-weight:600">${p.title}</div>
      <div class="info">
        <div class="price">₹${p.price}</div>
        <div>
          <button class="ghost" onclick="location.href='product.html?id=${p.id}'">View</button>
          <button class="btn" onclick="addToCart('${p.id}',1)">Add</button>
        </div>
      </div>
    `;
    // clicking image opens product detail (we don't have product.html file in this demo — use a simple modal)
    grid.appendChild(card);
  });
}

// Simple product detail modal fallback (if product.html not created)
function showProductDetail(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return alert('Product not found');
  alert(p.title + "\n\n" + p.desc + "\n\nPrice: ₹" + p.price);
}

// Cart page render
function renderCartPage(){
  const area = document.getElementById('cartArea');
  if(!area) return;
  const cart = getCart();
  if(cart.length===0){
    area.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  let html = '<div style="display:flex;flex-direction:column;gap:10px">';
  cart.forEach(it=>{
    html += `<div class="card" style="display:flex;gap:12px;align-items:center">
      <img src="${it.img}" style="width:120px;height:90px;object-fit:cover">
      <div style="flex:1">
        <div style="font-weight:600">${it.title}</div>
        <div>₹${it.price} x 
          <input type="number" value="${it.qty}" min="1" style="width:60px" onchange="updateQtyFromInput('${it.id}', this.value)">
        </div>
      </div>
      <div>
        <div style="font-weight:700">₹${it.price * it.qty}</div>
        <div style="margin-top:8px"><button class="ghost" onclick="removeFromCartAndRefresh('${it.id}')">Remove</button></div>
      </div>
    </div>`;
  });
  html += `</div><div style="margin-top:12px"><strong>Total: ₹${cartTotal()}</strong></div>`;
  area.innerHTML = html;
}

function updateQtyFromInput(id, val){
  const q = parseInt(val) || 1;
  updateQty(id, q);
  renderCartPage();
}

// Drawer functions
function openCart(){
  document.getElementById('cartDrawer').classList.add('open');
}
function closeCart(){
  document.getElementById('cartDrawer').classList.remove('open');
}

// User session
function renderUserArea(){
  const userArea = document.getElementById('userArea');
  const user = JSON.parse(localStorage.getItem('bgs_user') || 'null');
  if(!user){
    if(userArea) userArea.innerHTML = '<a href="login.html" class="ghost">Sign in</a>';
  } else {
    if(userArea) userArea.innerHTML = `<div class="user-menu" id="uMenu">
        <button class="icon-btn" onclick="toggleUserMenu()">${user.name} ▾</button>
        <div class="menu" id="userMenuPanel">
          <a href="profile.html">Profile</a>
          <a href="cart.html">Cart</a>
          <a href="#">Wishlist</a>
          <a href="#">Orders</a>
          <a href="#">Support</a>
          <a href="#" onclick="logout()">Logout</a>
        </div>
      </div>`;
  }
}

function toggleUserMenu(){
  const m = document.getElementById('uMenu');
  if(!m) return;
  m.classList.toggle('open');
}
function logout(){
  localStorage.removeItem('bgs_user');
  renderUserArea();
  window.location.href = 'index.html';
}

// Profile page render
function renderProfile(){
  const p = JSON.parse(localStorage.getItem('bgs_user') || 'null');
  const info = document.getElementById('profileInfo');
  if(!p){
    info.innerHTML = '<p>Please <a href="login.html">login</a>.</p>';
  } else {
    info.innerHTML = `<p><strong>Name:</strong> ${p.name || ''}<br/><strong>Email:</strong> ${p.email || '-'}<br/></p>`;
  }
}

// Checkout summary
function renderCheckoutSummary(){
  const el = document.getElementById('checkoutSummary');
  const cart = getCart();
  if(!el) return;
  if(cart.length===0){
    el.innerHTML = '<p>Your cart is empty. Please add items before checkout.</p>';
    document.getElementById('payBtn').disabled = true;
    return;
  }
  let html = '<div style="display:flex;flex-direction:column;gap:8px">';
  cart.forEach(it=>{
    html += `<div style="display:flex;justify-content:space-between"><div>${it.title} x ${it.qty}</div><div>₹${it.price * it.qty}</div></div>`;
  });
  html += `<hr/><div style="display:flex;justify-content:space-between"><strong>Total</strong><strong>₹${cartTotal()}</strong></div></div>`;
  el.innerHTML = html;
  document.getElementById('payBtn').disabled = false;
}

// Start Razorpay payment (client-only flow for testing)
function startRazorpayPayment(){
  const cart = getCart();
  if(cart.length===0) return alert('Cart empty');
  const amount = cartTotal();
  if(!RAZORPAY_KEY || RAZORPAY_KEY.includes('replace_me')) return alert('Please set RAZORPAY_KEY in js/app.js to your rzp_test_ key id.');

  const options = {
    key: RAZORPAY_KEY,
    amount: amount * 100, // paise
    currency: 'INR',
    name: 'Bhargavi General Store',
    description: 'Test transaction',
    handler: function(response){
      // response.razorpay_payment_id available
      alert('Payment successful! Payment ID: ' + (response.razorpay_payment_id || 'N/A'));
      localStorage.removeItem('bgs_cart');
      window.location.href = 'index.html';
    },
    prefill: {
      name: (JSON.parse(localStorage.getItem('bgs_user')||'null')||{name:'Guest'}).name,
      email: (JSON.parse(localStorage.getItem('bgs_user')||'null')||{email:''}).email,
      contact: ''
    },
    theme: { color: '#ff9900' }
  };
  const rzp = new Razorpay(options);
  rzp.open();
}

// small helpers
function renderProductsInlineForTest(){ /* optional */ }
// Wishlist
function addToWishlist(product) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (!wishlist.find(item => item.id === product.id)) {
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Added to wishlist!");
  }
}

function loadWishlist() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let container = document.getElementById("wishlistItems");
  if (!container) return;
  container.innerHTML = wishlist.map(item => `
    <div class="card">
      <img src="${item.image}" alt="${item.name}">
      <div class="info">
        <span>${item.name}</span>
        <button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
      </div>
    </div>
  `).join("");
}

// Orders
function addOrder(order) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
}

function loadOrders() {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let container = document.getElementById("orderList");
  if (!container) return;
  container.innerHTML = orders.map(o => `
    <div class="order">
      <h3>Order #${o.id}</h3>
      <p><strong>Date:</strong> ${o.date}</p>
      <p><strong>Total:</strong> ₹${o.total}</p>
      <p class="status">${o.status}</p>
    </div>
  `).join("");
}
window.onload = function() {
  loadWishlist();
  loadOrders();
};
// ===== LOGIN =====
function handleLogin(e) {
  e.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (email && password) {
    localStorage.setItem("user", JSON.stringify({ email: email }));
    alert("Login successful!");
    window.location.href = "index.html"; // redirect to homepage
  } else {
    alert("Invalid credentials!");
  }
}

// ===== SIGNUP =====
function handleSignup(e) {
  e.preventDefault();
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (name && email && password) {
    localStorage.setItem("user", JSON.stringify({ name: name, email: email }));
    alert("Account created!");
    window.location.href = "index.html";
  } else {
    alert("Please fill all fields");
  }
}

// ===== NAVBAR USER DISPLAY =====
function loadUser() {
  let user = JSON.parse(localStorage.getItem("user"));
  let navUser = document.getElementById("navUser");
  if (user && navUser) {
    navUser.innerHTML = `
      <div class="user-menu">
        <span onclick="toggleUserMenu()">${user.name || user.email}</span>
        <div class="menu">
          <a href="profile.html">Profile</a>
          <a href="orders.html">Order History</a>
          <a href="wishlist.html">Wishlist</a>
          <a href="support.html">Customer Support</a>
          <a href="#" onclick="logout()">Logout</a>
        </div>
      </div>`;
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// ===== On page load =====
window.onload = function () {
  loadUser();
  // also call loadWishlist() or loadOrders() here if those pages are open
};

