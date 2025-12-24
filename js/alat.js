const role = localStorage.getItem('role');
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
  console.log("Current Role:", role);

  if (role === 'admin') {
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
    tbody.innerHTML += `
      <tr>
        <td>${alat.nama}</td>
        <td>${alat.kategori}</td>
        <td>${alat.stok}</td>
        <td>Rp ${alat.harga_per_jam.toLocaleString('id-ID')}</td>
        <td>
          <button class="btn-danger" onclick="deleteAlat(${alat.id})">Hapus</button>
          <button class="btn-secondary" onclick="editAlat(${alat.id})">Edit</button>
        </td>
      </tr>
    `;
  });
}

function renderUserTable() {
  const data = DataManager.getAlat();
  const tbody = document.getElementById("userAlatTable");
  if (!tbody) return;

  tbody.innerHTML = "";
  data.forEach(alat => {
    tbody.innerHTML += `
      <tr>
        <td>${alat.nama}</td>
        <td>${alat.kategori}</td>
        <td>${alat.stok}</td>
        <td>Rp ${alat.harga_per_jam.toLocaleString('id-ID')}</td>
        <td>
          <button class="btn-primary" onclick="sewaAlat(${alat.id})">Sewa</button>
        </td>
      </tr>
    `;
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
    DataManager.addAlat({
      nama: nama,
      kategori: kategori || 'Lainnya',
      stok: parseInt(stok) || 1,
      harga_per_jam: parseInt(harga)
    });

    alert('Alat berhasil ditambahkan!');
    location.reload();
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan sistem: " + err.message);
  }
}

function deleteAlat(id) {
  if (!confirm("Yakin hapus?")) return;

  DataManager.deleteAlat(id);
  location.reload();
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
  }
}

// Expose functions globally
window.tambahAlat = tambahAlat;
window.deleteAlat = deleteAlat;
window.editAlat = editAlat;
window.sewaAlat = sewaAlat;
