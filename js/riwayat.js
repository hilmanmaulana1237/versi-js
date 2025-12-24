// Riwayat Module - menggunakan IIFE untuk menghindari konflik variabel global
(function () {
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  document.addEventListener('DOMContentLoaded', () => {
    console.log('Riwayat page loaded. Role:', userRole);

    const userSection = document.getElementById("userDashboard");
    const adminSection = document.getElementById("adminDashboard");

    // Hide all first
    if (userSection) userSection.classList.remove('active');
    if (adminSection) adminSection.classList.remove('active');

    if (userRole === 'admin') {
      console.log('Showing admin riwayat');
      if (adminSection) adminSection.classList.add('active');
      loadAdminRiwayat();
    } else {
      console.log('Showing user riwayat');
      if (userSection) userSection.classList.add('active');
      loadUserRiwayat();
    }
  });

  function loadAdminRiwayat() {
    updateStats();
    renderAdminTable();
  }

  function loadUserRiwayat() {
    renderUserTable();
  }

  function updateStats() {
    const transaksi = DataManager.getTransaksi();
    const pending = transaksi.filter(t => t.status === 'pending').length;
    const selesai = transaksi.filter(t => t.status === 'selesai').length;

    const statTotal = document.getElementById('statTotalTrx');
    const statPending = document.getElementById('statPending');
    const statSelesai = document.getElementById('statSelesai');

    if (statTotal) statTotal.textContent = transaksi.length;
    if (statPending) statPending.textContent = pending;
    if (statSelesai) statSelesai.textContent = selesai;
  }

  function renderAdminTable() {
    const tbody = document.getElementById('adminRiwayatTable');
    if (!tbody) return;

    const data = DataManager.getTransaksi();
    console.log('Admin riwayat data:', data.length, 'items');

    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Belum ada riwayat transaksi.</td></tr>';
      return;
    }

    data.forEach(trx => {
      const row = document.createElement('tr');

      let aksiHtml = '';
      if (trx.status === 'pending') {
        aksiHtml = `<button class="btn-primary" data-konfirmasi="${trx.id}">Konfirmasi</button>`;
      } else if (trx.status === 'lunas') {
        aksiHtml = `<button class="btn-secondary" data-selesai="${trx.id}">Selesai</button>`;
      } else {
        aksiHtml = '<span>-</span>';
      }

      const badgeClass = trx.status === 'pending' ? 'pending' : (trx.status === 'selesai' ? 'selesai' : 'aktif');

      row.innerHTML = `
        <td>${trx.nama_penyewa || 'User'}</td>
        <td>${trx.no_hp || '-'}</td>
        <td>${trx.alat?.nama || 'Alat'}</td>
        <td>${trx.durasi} Jam</td>
        <td>Rp ${trx.total_harga?.toLocaleString('id-ID')}</td>
        <td>${trx.bukti_pembayaran ? 'Ada' : '-'}</td>
        <td><span class="badge ${badgeClass}">${trx.status}</span></td>
        <td>${aksiHtml}</td>
      `;
      tbody.appendChild(row);
    });

    // Attach event listeners for action buttons
    tbody.querySelectorAll('[data-konfirmasi]').forEach(btn => {
      btn.addEventListener('click', function () {
        updateTransaksiStatus(parseInt(this.dataset.konfirmasi), 'lunas');
      });
    });

    tbody.querySelectorAll('[data-selesai]').forEach(btn => {
      btn.addEventListener('click', function () {
        updateTransaksiStatus(parseInt(this.dataset.selesai), 'selesai');
      });
    });
  }

  function renderUserTable() {
    const tbody = document.getElementById('userRiwayatTable');
    if (!tbody) return;

    const data = DataManager.getTransaksiByUserId(user.id);
    console.log('User riwayat data:', data.length, 'items');

    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Anda belum memiliki riwayat penyewaan.</td></tr>';
      return;
    }

    data.forEach(trx => {
      const badgeClass = trx.status === 'pending' ? 'pending' : (trx.status === 'selesai' ? 'selesai' : 'aktif');
      const formattedDate = new Date(trx.createdAt).toLocaleDateString('id-ID');

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${trx.alat?.nama || 'Alat'}</td>
        <td>${trx.durasi} Jam</td>
        <td>Rp ${trx.total_harga?.toLocaleString('id-ID')}</td>
        <td>${formattedDate}</td>
        <td><span class="badge ${badgeClass}">${trx.status}</span></td>
      `;
      tbody.appendChild(row);
    });
  }

  function updateTransaksiStatus(id, status) {
    if (!confirm(`Ubah status menjadi ${status}?`)) return;

    try {
      const result = DataManager.updateTransaksiStatus(id, status);
      if (result) {
        alert('Status berhasil diupdate!');
        loadAdminRiwayat();
      } else {
        alert('Transaksi tidak ditemukan');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal update status');
    }
  }

  // Expose functions globally
  window.updateTransaksiStatus = updateTransaksiStatus;
})();
