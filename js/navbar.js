const navbar = document.getElementById("navbar");
const role = localStorage.getItem("role");

let navHTML = `
<nav class="navbar">
  <div class="nav-logo">Bersenandung <span style="font-size:0.8rem">(${role === 'admin' ? 'Admin' : 'User'})</span></div>

  <div class="burger" onclick="toggleMenu()">
    ☰
  </div>

  <ul class="nav-menu" id="navMenu">
`;

if (role === "admin") {
  navHTML += `
    <li><a href="dashboard.html">Dashboard</a></li>
    <li><a href="alat.html">Kelola Alat</a></li>
    <li><a href="riwayat.html">Transaksi</a></li>
  `;
} else {
  navHTML += `
    <li><a href="dashboard.html">Beranda</a></li>
    <li><a href="alat.html">Sewa Alat</a></li>
    <li><a href="riwayat.html">Riwayat Saya</a></li>
  `;
}

navHTML += `
    <li><a href="#" id="logoutBtn">Logout</a></li>
  </ul>
</nav>
`;

navbar.innerHTML = navHTML;

/* toggle */
function toggleMenu() {
  document.getElementById("navMenu").classList.toggle("active");
}

// Re-attach logout listener since we overwrote innerHTML
document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.href = 'index.html';
});
