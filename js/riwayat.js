const role = localStorage.getItem('role');
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

document.addEventListener('DOMContentLoaded', () => {
  fetchRiwayat();
  setupAdminView();
});

function setupAdminView() {
  const adminSection = document.getElementById('adminDashboard');
  const adminStats = document.querySelector('.admin-stats');

  if (role === 'admin') {
    if (adminSection) adminSection.classList.remove('hidden');
    // Update stats
    updateRiwayatStats();
  } else {
    // User view - hide admin specific elements
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
    if (role === 'admin') {
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
    let aksi = '';
    if (role === 'admin') {
      if (trx.status === 'pending') {
        aksi = `<button class="btn-primary" onclick="updateStatus(${trx.id}, 'lunas')">Konfirmasi</button>`;
      } else if (trx.status === 'lunas') {
        aksi = `<button class="btn-secondary" onclick="updateStatus(${trx.id}, 'selesai')">Selesai</button>`;
      } else {
        aksi = '-';
      }
    } else {
      aksi = `<span class="link-more">-</span>`;
    }

    const badgeClass = trx.status === 'pending' ? 'pending' : (trx.status === 'selesai' ? 'selesai' : 'aktif');
    const formattedDate = new Date(trx.createdAt).toLocaleDateString('id-ID');

    tbody.innerHTML += `
      <tr>
        <td>${trx.nama_penyewa || 'User'}</td>
        <td>${trx.no_hp || '-'}</td>
        <td>${trx.alat?.nama || 'Alat'}</td>
        <td>${trx.durasi} Jam</td>
        <td>Rp ${trx.total_harga?.toLocaleString('id-ID')}</td>
        <td>${trx.bukti_pembayaran ? 'Ada' : '-'}</td>
        <td><span class="badge ${badgeClass}">${trx.status}</span></td>
        <td>${aksi}</td>
      </tr>
    `;
  });
}

function updateStatus(id, status) {
  if (!confirm(`Ubah status menjadi ${status}?`)) return;

  try {
    DataManager.updateTransaksiStatus(id, status);
    alert('Status berhasil diupdate');
    fetchRiwayat();
    updateRiwayatStats();
  } catch (err) {
    console.error(err);
    alert('Gagal update status');
  }
}

// Expose function globally
window.updateStatus = updateStatus;
