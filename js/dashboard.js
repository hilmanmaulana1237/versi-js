const role = localStorage.getItem('role');
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

document.addEventListener('DOMContentLoaded', () => {
  // Greeting
  const greeting = document.querySelector('.dash-hero-content h1');
  if (greeting && user.username) {
    greeting.innerHTML = `Selamat Datang, <span>${user.username}</span>`;
  }

  // Role Based View
  const userDash = document.getElementById("userDashboard");
  const adminDash = document.getElementById("adminDashboard");

  // Reset first (safety)
  if (userDash) userDash.classList.remove('active');
  if (adminDash) adminDash.classList.remove('active');

  if (role === "admin") {
    if (adminDash) adminDash.classList.add('active');
  } else {
    // User Role (or undefined)
    if (userDash) userDash.classList.add('active');
  }

  // Fetch Data from localStorage
  fetchDashboardData();
});

function fetchDashboardData() {
  try {
    const stats = DataManager.getStats(role, user.id);
    updateStats(stats.totalAlat, stats.activeTrx, stats.totalTrx);
  } catch (err) {
    console.log("Dashboard fetch error", err);
  }
}

function updateStats(alat, active, total) {
  // Select elements based on role view
  const scope = role === 'admin' ? '.admin-stats' : '.stats-grid:not(.admin-stats)';
  const container = document.querySelector(scope);

  if (!container) return;

  // This depends on fixed HTML structure.
  // Assuming stat-number elements are in order: Total Alat, Sewa Aktif, Total Riwayat
  const numbers = container.querySelectorAll('.stat-number');
  if (numbers.length >= 3) {
    numbers[0].textContent = alat;
    numbers[1].textContent = active;
    numbers[2].textContent = total;
  }
}
