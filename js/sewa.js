const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

// Pre-fill user data
document.addEventListener('DOMContentLoaded', () => {
  const namaInput = document.getElementById('nama');
  const hpInput = document.getElementById('hp');

  if (namaInput) namaInput.value = user.username || '';
  if (hpInput) hpInput.focus();

  // Get Alat ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const alatId = urlParams.get('id');

  if (alatId) {
    const alat = DataManager.getAlatById(alatId);
    if (alat) {
      document.getElementById('namaAlat').textContent = alat.nama;
      document.getElementById('hargaAlat').textContent = alat.harga_per_jam.toLocaleString('id-ID');
      window.hargaPerJam = alat.harga_per_jam;
      window.alatId = alatId;

      // Setup auto-calculate total
      const durasiInput = document.getElementById('durasi');
      const totalInput = document.getElementById('total');

      if (durasiInput && totalInput) {
        durasiInput.addEventListener('input', () => {
          const durasi = parseInt(durasiInput.value) || 0;
          totalInput.value = "Rp " + (durasi * window.hargaPerJam).toLocaleString('id-ID');
        });
      }
    } else {
      alert("Alat tidak ditemukan");
      window.location.href = 'alat.html';
    }
  }
});

// Validasi Form & Submit
function kirimPenyewaan() {
  const durasi = document.getElementById('durasi').value;
  const hp = document.getElementById('hp').value;
  const nama = document.getElementById('nama').value;

  if (!durasi || !hp || !window.alatId) {
    alert("Mohon lengkapi data");
    return;
  }

  const total = parseInt(durasi) * window.hargaPerJam;

  try {
    DataManager.addTransaksi({
      userId: user.id,
      alatId: window.alatId,
      durasi: parseInt(durasi),
      total_harga: total,
      nama_penyewa: nama,
      no_hp: hp
    });

    alert("Penyewaan berhasil dikirim! Menunggu konfirmasi admin.");
    window.location.href = 'riwayat.html';
  } catch (err) {
    console.error(err);
    alert("Gagal mengirim penyewaan");
  }
}

// Modal QR functions
function openQR() {
  document.getElementById("qrModal").style.display = "flex";
}

function closeQR() {
  document.getElementById("qrModal").style.display = "none";
}

// Expose functions globally
window.kirimPenyewaan = kirimPenyewaan;
window.openQR = openQR;
window.closeQR = closeQR;
