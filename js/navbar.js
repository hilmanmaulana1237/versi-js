// Navbar Module - menggunakan IIFE untuk menghindari konflik variabel global
(function () {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const userRole = localStorage.getItem("role");

  let navHTML = `
  <nav class="navbar">
    <div class="nav-logo">Bersenandung <span style="font-size:0.8rem">(${userRole === 'admin' ? 'Admin' : 'User'})</span></div>

    <div class="burger" onclick="toggleMenu()">
      ☰
    </div>

    <ul class="nav-menu" id="navMenu">
  `;

  if (userRole === "admin") {
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

  // Re-attach logout listener
  document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
  });
})();

// Toggle menu function (global)
function toggleMenu() {
  document.getElementById("navMenu").classList.toggle("active");
}
