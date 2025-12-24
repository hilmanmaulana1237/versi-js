// Helper to get element values
const getValue = (id) => document.getElementById(id)?.value;

document.addEventListener('DOMContentLoaded', () => {
  // Handling Register
  const registerBtn = document.getElementById('registerBtn');
  if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = getValue('name');
      const email = getValue('email');
      const password = getValue('password');

      if (!name || !email || !password) {
        alert('Mohon isi semua field');
        return;
      }

      // Cek apakah email sudah terdaftar
      const existingUser = DataManager.findUserByEmail(email);
      if (existingUser) {
        alert('Email sudah terdaftar! Silakan login.');
        return;
      }

      // Tambah user baru
      const newUser = DataManager.addUser({
        username: name,
        email: email,
        password: password
      });

      alert('Registrasi berhasil! Silakan login.');
      window.location.href = 'index.html';
    });
  }

  // Handling Login
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = getValue('email');
      const password = getValue('password');

      if (!email || !password) {
        alert('Mohon isi email dan password');
        return;
      }

      // Cari user di DataManager
      const user = DataManager.findUserByEmail(email);

      if (user && user.password === password) {
        // Login berhasil
        localStorage.setItem('token', 'local-token-' + user.id);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', user.role);
        localStorage.setItem('isLoggedIn', 'true');
        alert('Login berhasil!');
        window.location.href = 'dashboard.html';
      } else {
        alert('Login gagal: Email atau password salah');
      }
    });
  }

  // Handling Logout (Event Delegation for dynamic elements or direct ID)
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('isLoggedIn');
      window.location.href = 'index.html';
    });
  } else {
    // Fallback for delegation if script order is tricky
    document.body.addEventListener('click', (e) => {
      if (e.target.id === 'logoutBtn') {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
      }
    });
  }

  // Global Auth Guard
  const protectedPages = ["dashboard.html", "alat.html", "sewa.html", "riwayat.html"];
  const currentPage = window.location.pathname.split("/").pop();
  const token = localStorage.getItem('token');

  if (protectedPages.includes(currentPage) && !token) {
    alert('Anda harus login terlebih dahulu.');
    window.location.href = "index.html";
  }
});

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}
