// Alat Module - menggunakan IIFE untuk menghindari konflik variabel global
(function () {
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  // Load Data
  document.addEventListener('DOMContentLoaded', () => {
    // === STRICT VIEW SEPARATION ===
    const userSection = document.getElementById("userDashboard");
    const adminSection = document.getElementById("adminDashboard");

    // Reset
    if (userSection) userSection.classList.remove('active');
    if (adminSection) adminSection.classList.remove('active');

    // Debug Role
    console.log("Alat Page - Current Role:", userRole);

    if (userRole === 'admin') {
      if (adminSection) adminSection.classList.add('active');
      renderAdminTable();
    } else {
      // Default to User if not admin
      if (userSection) userSection.classList.add('active');
      renderUserTable();
    }
  });

  function renderAdminTable() {
    const data = DataManager.getAlat();
    const tbody = document.getElementById("tabelAlat");
    if (!tbody) return;

    tbody.innerHTML = "";
    data.forEach(alat => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${alat.nama}</td>
        <td>${alat.kategori}</td>
        <td>${alat.stok}</td>
        <td>Rp ${alat.harga_per_jam.toLocaleString('id-ID')}</td>
        <td>
          <button class="btn-danger" data-delete="${alat.id}">Hapus</button>
          <button class="btn-secondary" data-edit="${alat.id}">Edit</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // Attach event listeners
    tbody.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', function () {
        deleteAlat(parseInt(this.dataset.delete));
      });
    });

    tbody.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', function () {
        editAlat(parseInt(this.dataset.edit));
      });
    });
  }

  function renderUserTable() {
    const data = DataManager.getAlat();
    const tbody = document.getElementById("userAlatTable");
    if (!tbody) return;

    tbody.innerHTML = "";
    data.forEach(alat => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${alat.nama}</td>
        <td>${alat.kategori}</td>
        <td>${alat.stok}</td>
        <td>Rp ${alat.harga_per_jam.toLocaleString('id-ID')}</td>
        <td>
          <button class="btn-primary" data-sewa="${alat.id}">Sewa</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // Attach event listeners
    tbody.querySelectorAll('[data-sewa]').forEach(btn => {
      btn.addEventListener('click', function () {
        sewaAlat(parseInt(this.dataset.sewa));
      });
    });
  }

  function sewaAlat(id) {
    window.location.href = `sewa.html?id=${id}`;
  }

  // Admin Functions
  function tambahAlat() {
    const nama = document.getElementById('nama').value;
    const kategori = document.getElementById('kategori').value;
    const stok = document.getElementById('stok').value;
    const harga = document.getElementById('harga').value;

    if (!nama || !harga) {
      alert("Nama dan Harga wajib diisi");
      return;
    }

    try {
      const result = DataManager.addAlat({
        nama: nama,
        kategori: kategori || 'Lainnya',
        stok: parseInt(stok) || 1,
        harga_per_jam: parseInt(harga)
      });

      console.log('Alat added:', result);
      alert('Alat berhasil ditambahkan!');

      // Clear form
      document.getElementById('nama').value = '';
      document.getElementById('kategori').value = '';
      document.getElementById('stok').value = '';
      document.getElementById('harga').value = '';

      // Reload table without full page reload
      renderAdminTable();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem: " + err.message);
    }
  }

  function deleteAlat(id) {
    if (!confirm("Yakin hapus alat ini?")) return;

    try {
      DataManager.deleteAlat(id);
      alert('Alat berhasil dihapus!');
      renderAdminTable();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus alat");
    }
  }

  function editAlat(id) {
    const alat = DataManager.getAlatById(id);
    if (!alat) {
      alert("Alat tidak ditemukan");
      return;
    }

    // Isi form dengan data alat
    document.getElementById('nama').value = alat.nama;
    document.getElementById('kategori').value = alat.kategori;
    document.getElementById('stok').value = alat.stok;
    document.getElementById('harga').value = alat.harga_per_jam;

    // Hapus alat lama (user akan simpan ulang)
    if (confirm("Data akan diisi di form. Setelah edit, klik Simpan untuk menyimpan perubahan.")) {
      DataManager.deleteAlat(id);
      renderAdminTable();
    }
  }

  // Expose functions globally
  window.tambahAlat = tambahAlat;
  window.deleteAlat = deleteAlat;
  window.editAlat = editAlat;
  window.sewaAlat = sewaAlat;
  window.renderAdminTable = renderAdminTable;
  window.renderUserTable = renderUserTable;
})();
