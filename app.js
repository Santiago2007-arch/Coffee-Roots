const products = [
  {
    id: 1,
    name: "Andean Sunrise",
    origin: "Huila, Colombia",
    notes: "Chocolate, caramel & orange zest",
    roast: "medium",
    size: "340 g · Whole bean",
    price: 39000,
    tag: "BEST SELLER",
    stock: true,
    bag: "#45614c",
    bag2: "#223d2b",
    ink: "#f4e9d5",
  },
  {
    id: 2,
    name: "Mountain Bloom",
    origin: "Nariño, Colombia",
    notes: "Floral, red berries & honey",
    roast: "light",
    size: "340 g · Whole bean",
    price: 45000,
    tag: "LIGHT & BRIGHT",
    stock: true,
    bag: "#ebd8b2",
    bag2: "#aa8d61",
    ink: "#36503b",
  },
  {
    id: 3,
    name: "Golden Harvest",
    origin: "Risaralda, Colombia",
    notes: "Brown sugar, nuts & cacao",
    roast: "medium",
    size: "340 g · Whole bean",
    price: 42000,
    tag: "LOCAL FAVORITE",
    stock: true,
    bag: "#a46a43",
    bag2: "#684329",
    ink: "#fff3da",
  },
  {
    id: 4,
    name: "Midnight Reserve",
    origin: "Sierra Nevada, Colombia",
    notes: "Dark cocoa, spice & toasted almond",
    roast: "dark",
    size: "340 g · Whole bean",
    price: 48000,
    tag: "SOLD OUT",
    stock: false,
    bag: "#343e37",
    bag2: "#1f2823",
    ink: "#dfc38c",
  },
];
const $ = (id) => document.getElementById(id),
  fmt = (n) => "$" + n.toLocaleString("en-US");
let cart = JSON.parse(localStorage.getItem("coffee-roots-cart") || "{}");
let toastTimer;
let lastFocus = null;
function displayProducts() {
  let filter = $("filter").value;
  let list = products.filter((p) => filter === "all" || p.roast === filter);
  $("productGrid").innerHTML = list
    .map(
      (p) =>
        `<article class="product-card"><div class="product-image"><span class="tag ${p.stock ? "" : "out"}">${p.tag}</span><div class="bag-art" style="--bag:${p.bag};--bag2:${p.bag2};--ink:${p.ink}" role="img" aria-label="Illustration of ${p.name} coffee bag"><span class="bag-symbol">✳</span>ROOTS<small>COFFEE</small></div></div><div class="product-meta"><small>${p.origin}</small><span>${p.size}</span></div><h3>${p.name}</h3><p>${p.notes} · ${p.roast.charAt(0).toUpperCase() + p.roast.slice(1)} roast</p><div class="card-action"><b>${fmt(p.price)} COP</b><button class="${p.stock ? "" : "alternative"}" data-id="${p.id}">${p.stock ? "Add to bag ↗" : "See alternative ↗"}</button></div></article>`,
    )
    .join("");
  $("stockInfo").textContent =
    `Showing ${list.length} coffees · Prices in Colombian pesos (COP) · No real payments.`;
}
function save() {
  localStorage.setItem("coffee-roots-cart", JSON.stringify(cart));
  updateCart();
}
function add(id) {
  let p = products.find((x) => x.id === id);
  if (!p.stock) {
    showAlternative(p);
    return;
  }
  cart[id] = (cart[id] || 0) + 1;
  save();
  notify(`${p.name} added to your bag`);
}
function change(id, d) {
  cart[id] = Math.max(0, (cart[id] || 0) + d);
  if (!cart[id]) delete cart[id];
  save();
}
function count() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}
function subtotal() {
  return products.reduce((n, p) => n + p.price * (cart[p.id] || 0), 0);
}
function delivery() {
  return subtotal() === 0 ? 0 : subtotal() >= 120000 ? 0 : 8000;
}
function updateCart() {
  $("cartCount").textContent = count();
  $("drawerCount").textContent = `(${count()})`;
  let picked = products.filter((p) => cart[p.id]);
  $("cartItems").innerHTML = picked.length
    ? picked
        .map(
          (p) =>
            `<div class="cart-row"><div class="mini-bag">✳</div><div class="cart-desc"><strong>${p.name}</strong><small>${p.size}</small><b>${fmt(p.price)} COP</b><div class="quantity"><button aria-label="Remove one ${p.name}" data-action="decrease" data-id="${p.id}">−</button><span>${cart[p.id]}</span><button aria-label="Add one ${p.name}" data-action="increase" data-id="${p.id}">+</button><button class="remove" data-action="remove" data-id="${p.id}">Remove</button></div></div></div>`,
        )
        .join("")
    : `<div class="empty-cart"><span class="empty-art">☕</span><h3>Your bag is feeling empty.</h3><p>Good coffee is just one click away.</p><button class="btn btn-dark" id="continueShopping">Explore coffees ↗</button></div>`;
  $("subtotal").textContent = fmt(subtotal()) + " COP";
  $("shipping").textContent =
    subtotal() === 0
      ? "—"
      : delivery() === 0
        ? "FREE"
        : fmt(delivery()) + " COP";
  $("total").textContent = fmt(subtotal() + delivery()) + " COP";
  $("shippingNote").textContent =
    subtotal() === 0
      ? "Add your favorite coffee to get started."
      : delivery() === 0
        ? "Wonderful! Your order qualifies for free shipping."
        : `Add ${fmt(120000 - subtotal())} COP more for free shipping.`;
  $("reviewBtn").disabled = count() === 0;
}
function notify(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2500);
}
function openDrawer() {
  lastFocus = document.activeElement;
  $("overlay").hidden = false;
  $("drawer").classList.add("open");
  $("drawer").setAttribute("aria-hidden", "false");
  document.body.classList.add("lock");
  $("cartClose").focus();
}
function closeDrawer() {
  $("drawer").classList.remove("open");
  $("drawer").setAttribute("aria-hidden", "true");
  $("overlay").hidden = true;
  if ($("modalBack").hidden) document.body.classList.remove("lock");
  lastFocus?.focus();
}
function openModal(html) {
  lastFocus = document.activeElement;
  $("modalContent").innerHTML = html;
  $("modalBack").hidden = false;
  document.body.classList.add("lock");
  $("modalClose").focus();
}
function closeModal() {
  $("modalBack").hidden = true;
  if (!$("drawer").classList.contains("open"))
    document.body.classList.remove("lock");
  lastFocus?.focus();
}
function showAlternative(p) {
  let recommendation =
    products.find((x) => x.stock && x.roast === p.roast) || products[0];
  openModal(
    `<span class="eyebrow">TEMPORARILY UNAVAILABLE</span><h2>${p.name} is sold out.</h2><p>Sorry! This coffee is currently unavailable. You can still enjoy a delicious Colombian coffee with a similar comforting character.</p><div class="review-item"><span><strong>We recommend: ${recommendation.name}</strong><br>${recommendation.notes}</span><strong>${fmt(recommendation.price)}</strong></div><p>Our recommended alternative is in stock and ready to add to your bag.</p><button class="btn btn-dark full" id="addAlternative" data-id="${recommendation.id}">Add ${recommendation.name} ↗</button><button class="btn full" id="browseAlternative">Browse all coffees</button>`,
  );
}
function review() {
  if (!count()) return;
  closeDrawer();
  let items = products.filter((p) => cart[p.id]);
  openModal(
    `<span class="eyebrow">03 / ORDER SUMMARY</span><h2>One step closer to great coffee.</h2><p>Review your selections below. This is a demo checkout; no real payment will be made.</p>${items.map((p) => `<div class="review-item"><span>${p.name} × ${cart[p.id]}</span><strong>${fmt(p.price * cart[p.id])} COP</strong></div>`).join("")}<div class="review-item"><span>Delivery</span><strong>${delivery() === 0 ? "FREE" : fmt(delivery()) + " COP"}</strong></div><div class="review-total"><span>Total</span><span>${fmt(subtotal() + delivery())} COP</span></div><button id="confirmOrder" class="btn btn-dark full">Place demo order ↗</button><p style="text-align:center">Demo only — no payment or personal details required.</p>`,
  );
}
function confirmOrder() {
  let n = "CR-" + Math.floor(10000 + Math.random() * 90000);
  cart = {};
  save();
  openModal(
    `<div class="success"><div class="success-mark">✓</div><span class="eyebrow" style="margin-top:20px">ORDER CONFIRMED</span><h2>Great taste is on its way!</h2><p>Your demo order <strong>${n}</strong> has been placed successfully.</p><p>Thanks for supporting Colombian coffee! This is an educational prototype, so nothing has been charged or shipped.</p><button class="btn btn-dark full" id="backToShop">Continue shopping ↗</button></div>`,
  );
}
$("productGrid").addEventListener("click", (e) => {
  let b = e.target.closest("button[data-id]");
  if (b) add(+b.dataset.id);
});
$("cartItems").addEventListener("click", (e) => {
  let b = e.target.closest("[data-action]");
  if (b) {
    let id = +b.dataset.id;
    if (b.dataset.action === "remove") {
      delete cart[id];
      save();
    } else change(id, b.dataset.action === "increase" ? 1 : -1);
  }
  if (e.target.closest("#continueShopping")) {
    closeDrawer();
    $("products").scrollIntoView();
  }
});
$("filter").addEventListener("change", displayProducts);
$("cartOpen").addEventListener("click", openDrawer);
$("cartClose").addEventListener("click", closeDrawer);
$("overlay").addEventListener("click", closeDrawer);
$("reviewBtn").addEventListener("click", review);
$("modalClose").addEventListener("click", closeModal);
$("modalBack").addEventListener("click", (e) => {
  if (e.target === $("modalBack")) closeModal();
});
$("modalContent").addEventListener("click", (e) => {
  let b = e.target.closest("button");
  if (!b) return;
  if (b.id === "addAlternative") {
    let id = +b.dataset.id;
    closeModal();
    add(id);
    openDrawer();
  }
  if (b.id === "browseAlternative") {
    closeModal();
    $("products").scrollIntoView();
  }
  if (b.id === "confirmOrder") confirmOrder();
  if (b.id === "backToShop") {
    closeModal();
    $("products").scrollIntoView();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!$("modalBack").hidden) closeModal();
    else if ($("drawer").classList.contains("open")) closeDrawer();
  }
});
displayProducts();
updateCart();
