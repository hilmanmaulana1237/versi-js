// Dashboard Module - menggunakan IIFE untuk menghindari konflik variabel global
(function () {
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard loaded. Role:', userRole);

    // Role Based View
    const userDash = document.getElementById("userDashboard");
    const adminDash = document.getElementById("adminDashboard");

    // Hide all first
    if (userDash) userDash.classList.remove('active');
    if (adminDash) adminDash.classList.remove('active');

    if (userRole === "admin") {
      console.log('Showing admin dashboard');
      if (adminDash) adminDash.classList.add('active');
      loadAdminDashboard();
    } else {
      console.log('Showing user dashboard');
      if (userDash) userDash.classList.add('active');
      loadUserDashboard();
    }
  });

  function loadUserDashboard() {
    // Update greeting
    const greeting = document.querySelector('#userDashboard .dash-hero-content h1');
    if (greeting && user.username) {
      greeting.innerHTML = `Selamat Datang, <span>${user.username}</span>`;
    }

    // Get stats
    const stats = DataManager.getStats('user', user.id);

    // Update stat numbers
    const totalAlat = document.getElementById('userTotalAlat');
    const sewaAktif = document.getElementById('userSewaAktif');
    const totalSewa = document.getElementById('userTotalSewa');

    if (totalAlat) totalAlat.textContent = stats.totalAlat;
    if (sewaAktif) sewaAktif.textContent = stats.activeTrx;
    if (totalSewa) totalSewa.textContent = stats.totalTrx;
  }

  function loadAdminDashboard() {
    // Get stats
    const stats = DataManager.getStats('admin', null);

    // Update stat numbers
    const totalAlat = document.getElementById('adminTotalAlat');
    const sewaAktif = document.getElementById('adminSewaAktif');
    const totalTrx = document.getElementById('adminTotalTrx');

    if (totalAlat) totalAlat.textContent = stats.totalAlat;
    if (sewaAktif) sewaAktif.textContent = stats.activeTrx;
    if (totalTrx) totalTrx.textContent = stats.totalTrx;

    // Load recent transactions
    loadRecentTransactions();
  }

  function loadRecentTransactions() {
    const tbody = document.getElementById('recentTransactions');
    if (!tbody) return;

    const transactions = DataManager.getTransaksi();
    // Get last 5 transactions
    const recent = transactions.slice(-5).reverse();

    if (recent.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Belum ada transaksi</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    recent.forEach(trx => {
      const badgeClass = trx.status === 'pending' ? 'pending' : (trx.status === 'selesai' ? 'selesai' : 'aktif');
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${trx.nama_penyewa || 'User'}</td>
        <td>${trx.alat?.nama || 'Alat'}</td>
        <td>${trx.durasi} Jam</td>
        <td>Rp ${trx.total_harga?.toLocaleString('id-ID')}</td>
        <td><span class="badge ${badgeClass}">${trx.status}</span></td>
      `;
      tbody.appendChild(row);
    });
  }
})();
