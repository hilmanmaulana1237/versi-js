// Riwayat Module - menggunakan IIFE untuk menghindari konflik variabel global
(function () {
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  document.addEventListener('DOMContentLoaded', () => {
    fetchRiwayat();
    setupAdminView();
  });

  function setupAdminView() {
    const adminSection = document.getElementById('adminDashboard');
    const adminStats = document.querySelector('.admin-stats');

    if (userRole === 'admin') {
      if (adminSection) adminSection.classList.remove('hidden');
      updateRiwayatStats();
    } else {
      if (adminStats) adminStats.style.display = 'none';
    }
  }

  function updateRiwayatStats() {
    const transaksi = DataManager.getTransaksi();
    const pending = transaksi.filter(t => t.status === 'pending').length;
    const selesai = transaksi.filter(t => t.status === 'selesai').length;

    const numbers = document.querySelectorAll('.admin-stats .stat-number');
    if (numbers.length >= 3) {
      numbers[0].textContent = transaksi.length;
      numbers[1].textContent = pending;
      numbers[2].textContent = selesai;
    }
  }

  function fetchRiwayat() {
    try {
      let data;
      if (userRole === 'admin') {
        data = DataManager.getTransaksi();
      } else {
        data = DataManager.getTransaksiByUserId(user.id);
      }
      renderTable(data);
    } catch (error) {
      console.error('Error fetching riwayat:', error);
    }
  }

  function renderTable(data) {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Belum ada riwayat transaksi.</td></tr>';
      return;
    }

    data.forEach(trx => {
      const row = document.createElement('tr');

      let aksiHtml = '';
      if (userRole === 'admin') {
        if (trx.status === 'pending') {
          aksiHtml = `<button class="btn-primary" data-konfirmasi="${trx.id}">Konfirmasi</button>`;
        } else if (trx.status === 'lunas') {
          aksiHtml = `<button class="btn-secondary" data-selesai="${trx.id}">Selesai</button>`;
        } else {
          aksiHtml = '<span>-</span>';
        }
      } else {
        aksiHtml = '<span>-</span>';
      }

      const badgeClass = trx.status === 'pending' ? 'pending' : (trx.status === 'selesai' ? 'selesai' : 'aktif');
      const formattedDate = new Date(trx.createdAt).toLocaleDateString('id-ID');

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
        updateStatus(parseInt(this.dataset.konfirmasi), 'lunas');
      });
    });

    tbody.querySelectorAll('[data-selesai]').forEach(btn => {
      btn.addEventListener('click', function () {
        updateStatus(parseInt(this.dataset.selesai), 'selesai');
      });
    });
  }

  function updateStatus(id, status) {
    if (!confirm(`Ubah status menjadi ${status}?`)) return;

    try {
      const result = DataManager.updateTransaksiStatus(id, status);
      if (result) {
        alert('Status berhasil diupdate!');
        fetchRiwayat();
        updateRiwayatStats();
      } else {
        alert('Transaksi tidak ditemukan');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal update status');
    }
  }

  // Expose function globally
  window.updateStatus = updateStatus;
  window.fetchRiwayat = fetchRiwayat;
})();
