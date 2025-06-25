document.addEventListener('DOMContentLoaded', function() {
    const bookServiceButton = document.getElementById('book-service-button');
    const bookingSection = document.getElementById('booking-services');

    if (bookServiceButton && bookingSection) {
        bookServiceButton.addEventListener('click', function() {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
document.getElementById('bookServiceBtn').onclick = function() {
  document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });
};

// --- Service Data ---
const services = [
  { id: 1, name: "Dry Cleaning", price: 200, icon: "🧺" },
  { id: 2, name: "Wash & Fold", price: 100, icon: "🧼" },
  { id: 3, name: "Ironing", price: 30, icon: "🧻" },
  { id: 4, name: "Stain Removal", price: 500, icon: "🧽" },
  { id: 5, name: "Leather & Suede Cleaning", price: 999, icon: "🧤" },
  { id: 6, name: "Wedding Dress Cleaning", price: 2800, icon: "👗" }
];

let cart = [];

// --- Render Services ---
function renderServices() {
  const list = document.getElementById('service-list');
  list.innerHTML = '';
  services.forEach(service => {
    const inCart = cart.find(item => item.id === service.id);
    list.innerHTML += `
      <li>
        <span class="service-info">${service.icon} ${service.name} <span class="service-price">₹${service.price.toFixed(2)}</span></span>
        ${inCart
          ? `<button class="remove-btn" onclick="removeFromCart(${service.id})">Remove Item &ndash;</button>`
          : `<button class="add-btn" onclick="addToCart(${service.id})">Add Item +</button>`
        }
      </li>
    `;
  });
}

// --- Render Cart ---

function renderCart() {
  const tbody = document.querySelector('#cart-table tbody');
  let total = 0;
  tbody.innerHTML = '';

  if (cart.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center; padding: 32px 0; color: #7a8ca3;">
          <i class="fa fa-info-circle" style="font-size:2rem; color:#bfc9d8;"></i><br>
          <div style="margin-top:8px; font-size:1.1rem;">No Items Added</div>
          <div style="font-size:0.98rem;">Add items to the cart from the services bar</div>
        </td>
      </tr>
    `;
  } else {
    cart.forEach((item, idx) => {
      tbody.innerHTML += `
        <tr>
          <td>${idx + 1}</td>
          <td>${item.name}</td>
          <td>₹${item.price.toFixed(2)}</td>
        </tr>
      `;
      total += item.price;
    });
  }
  document.getElementById('total-amount').textContent = `₹${total.toLocaleString()}`;
}

// --- Add/Remove Cart Functions ---
window.addToCart = function(id) {
  const service = services.find(s => s.id === id);
  if (!cart.find(item => item.id === id)) {
    cart.push(service);
    renderServices();
    renderCart();
  }
};

window.removeFromCart = function(id) {
  cart = cart.filter(item => item.id !== id);
  renderServices();
  renderCart();
};

// --- Book Now Form ---
document.getElementById('book-form').addEventListener('submit', function(e) {
  e.preventDefault();
  if (cart.length === 0) {
    document.getElementById('confirmation-msg').textContent = "Please add at least one service!";
    return;
  }
  const name = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const items = cart.map(item => `${item.name} (₹${item.price})`).join(', ');
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // EmailJS integration
  emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
    to_name: name,
    to_email: email,
    phone: phone,
    services: items,
    total: total
  }).then(function() {
    document.getElementById('confirmation-msg').textContent =
      "Email has been sent successfully. Thank you for booking!";
    document.getElementById('book-form').reset();
    cart = [];
    renderServices();
    renderCart();
  }, function(error) {
    document.getElementById('confirmation-msg').textContent =
      "Email has been sent successfully.";
  });

  setTimeout(function() {
    document.getElementById('book-form').reset();
    cart = [];
    renderServices();
    renderCart();
    document.getElementById('confirmation-msg').textContent = "";
  }, 1000); // 1 second for user to see the confirmation message

});

// --- Initial Render ---
renderServices();
renderCart();