/**
 * Data Management Layer untuk Bersenandung
 * Menggunakan localStorage sebagai penyimpanan data lokal
 */

const DataManager = {
  // Keys untuk localStorage
  KEYS: {
    USERS: 'bersenandung_users',
    ALAT: 'bersenandung_alat',
    TRANSAKSI: 'bersenandung_transaksi',
    INITIALIZED: 'bersenandung_initialized'
  },

  // Default data (akan di-load dari JSON saat init)
  defaultUsers: [
    {
      id: 1,
      username: "Admin",
      email: "admin@bersenandung.com",
      password: "admin123",
      role: "admin"
    },
    {
      id: 2,
      username: "User Demo",
      email: "user@bersenandung.com",
      password: "user123",
      role: "user"
    },
    {
      id: 3,
      username: "Nazwa Aulia",
      email: "nazwa@gmail.com",
      password: "nazwa123",
      role: "user"
    },
    {
      id: 4,
      username: "Rizky Pratama",
      email: "rizky@gmail.com",
      password: "rizky123",
      role: "user"
    },
    {
      id: 5,
      username: "Siti Nurhaliza",
      email: "siti@gmail.com",
      password: "siti123",
      role: "user"
    }
  ],

  defaultAlat: [
    { id: 1, nama: "Gitar Akustik Yamaha F310", kategori: "Gitar", stok: 5, harga_per_jam: 25000 },
    { id: 2, nama: "Gitar Elektrik Fender Stratocaster", kategori: "Gitar", stok: 3, harga_per_jam: 35000 },
    { id: 3, nama: "Gitar Bass Ibanez SR300", kategori: "Bass", stok: 3, harga_per_jam: 30000 },
    { id: 4, nama: "Drum Set Pearl Export", kategori: "Drum", stok: 2, harga_per_jam: 50000 },
    { id: 5, nama: "Drum Elektrik Roland TD-17", kategori: "Drum", stok: 2, harga_per_jam: 60000 },
    { id: 6, nama: "Keyboard Yamaha PSR-E463", kategori: "Piano", stok: 4, harga_per_jam: 30000 },
    { id: 7, nama: "Piano Digital Casio CDP-S350", kategori: "Piano", stok: 2, harga_per_jam: 45000 },
    { id: 8, nama: "Sound System JBL EON615", kategori: "Sound System", stok: 2, harga_per_jam: 75000 },
    { id: 9, nama: "Mixer Yamaha MG12XU", kategori: "Sound System", stok: 3, harga_per_jam: 40000 },
    { id: 10, nama: "Microphone Shure SM58", kategori: "Microphone", stok: 8, harga_per_jam: 15000 },
    { id: 11, nama: "Saxophone Alto Yamaha YAS-280", kategori: "Tiup", stok: 2, harga_per_jam: 50000 },
    { id: 12, nama: "Biola Cremona SV-75", kategori: "String", stok: 3, harga_per_jam: 35000 }
  ],

  defaultTransaksi: [
    {
      id: 1,
      userId: 3,
      alatId: 1,
      alat: { nama: "Gitar Akustik Yamaha F310" },
      nama_penyewa: "Nazwa Aulia",
      no_hp: "085712345678",
      durasi: 3,
      total_harga: 75000,
      bukti_pembayaran: null,
      status: "pending",
      createdAt: "2025-12-24T10:00:00.000Z"
    },
    {
      id: 2,
      userId: 4,
      alatId: 4,
      alat: { nama: "Drum Set Pearl Export" },
      nama_penyewa: "Rizky Pratama",
      no_hp: "081298765432",
      durasi: 2,
      total_harga: 100000,
      bukti_pembayaran: "ada",
      status: "lunas",
      createdAt: "2025-12-23T14:30:00.000Z"
    },
    {
      id: 3,
      userId: 5,
      alatId: 6,
      alat: { nama: "Keyboard Yamaha PSR-E463" },
      nama_penyewa: "Siti Nurhaliza",
      no_hp: "087812341234",
      durasi: 4,
      total_harga: 120000,
      bukti_pembayaran: "ada",
      status: "selesai",
      createdAt: "2025-12-22T09:00:00.000Z"
    },
    {
      id: 4,
      userId: 3,
      alatId: 8,
      alat: { nama: "Sound System JBL EON615" },
      nama_penyewa: "Nazwa Aulia",
      no_hp: "085712345678",
      durasi: 5,
      total_harga: 375000,
      bukti_pembayaran: "ada",
      status: "selesai",
      createdAt: "2025-12-20T13:00:00.000Z"
    },
    {
      id: 5,
      userId: 4,
      alatId: 2,
      alat: { nama: "Gitar Elektrik Fender Stratocaster" },
      nama_penyewa: "Rizky Pratama",
      no_hp: "081298765432",
      durasi: 3,
      total_harga: 105000,
      bukti_pembayaran: null,
      status: "pending",
      createdAt: "2025-12-24T08:00:00.000Z"
    },
    {
      id: 6,
      userId: 2,
      alatId: 10,
      alat: { nama: "Microphone Shure SM58" },
      nama_penyewa: "User Demo",
      no_hp: "089912341234",
      durasi: 2,
      total_harga: 30000,
      bukti_pembayaran: "ada",
      status: "lunas",
      createdAt: "2025-12-23T16:00:00.000Z"
    }
  ],

  // Initialize data - load defaults jika belum ada
  init() {
    if (!localStorage.getItem(this.KEYS.INITIALIZED)) {
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(this.defaultUsers));
      localStorage.setItem(this.KEYS.ALAT, JSON.stringify(this.defaultAlat));
      localStorage.setItem(this.KEYS.TRANSAKSI, JSON.stringify(this.defaultTransaksi));
      localStorage.setItem(this.KEYS.INITIALIZED, 'true');
      console.log('DataManager: Data initialized with dummy data');
    }
  },

  // Force reset - untuk mengupdate dengan data baru
  forceReset() {
    localStorage.removeItem(this.KEYS.INITIALIZED);
    localStorage.removeItem(this.KEYS.USERS);
    localStorage.removeItem(this.KEYS.ALAT);
    localStorage.removeItem(this.KEYS.TRANSAKSI);
    this.init();
    console.log('DataManager: Data force reset completed');
  },

  // ==================== USERS ====================
  getUsers() {
    this.init();
    return JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]');
  },

  findUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById(id) {
    return this.getUsers().find(u => u.id === id);
  },

  addUser(userData) {
    const users = this.getUsers();
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: 'user'
    };
    users.push(newUser);
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  // ==================== ALAT ====================
  getAlat() {
    this.init();
    return JSON.parse(localStorage.getItem(this.KEYS.ALAT) || '[]');
  },

  getAlatById(id) {
    return this.getAlat().find(a => a.id === parseInt(id));
  },

  addAlat(alatData) {
    const alatList = this.getAlat();
    const newId = alatList.length > 0 ? Math.max(...alatList.map(a => a.id)) + 1 : 1;
    const newAlat = {
      id: newId,
      nama: alatData.nama,
      kategori: alatData.kategori || 'Lainnya',
      stok: parseInt(alatData.stok) || 1,
      harga_per_jam: parseInt(alatData.harga_per_jam) || 0
    };
    alatList.push(newAlat);
    localStorage.setItem(this.KEYS.ALAT, JSON.stringify(alatList));
    console.log('DataManager: Alat added', newAlat);
    return newAlat;
  },

  updateAlat(id, alatData) {
    const alatList = this.getAlat();
    const index = alatList.findIndex(a => a.id === parseInt(id));
    if (index !== -1) {
      alatList[index] = { ...alatList[index], ...alatData };
      localStorage.setItem(this.KEYS.ALAT, JSON.stringify(alatList));
      return alatList[index];
    }
    return null;
  },

  deleteAlat(id) {
    const alatList = this.getAlat();
    const filtered = alatList.filter(a => a.id !== parseInt(id));
    localStorage.setItem(this.KEYS.ALAT, JSON.stringify(filtered));
    console.log('DataManager: Alat deleted', id);
    return true;
  },

  // ==================== TRANSAKSI ====================
  getTransaksi() {
    this.init();
    return JSON.parse(localStorage.getItem(this.KEYS.TRANSAKSI) || '[]');
  },

  getTransaksiByUserId(userId) {
    return this.getTransaksi().filter(t => t.userId === parseInt(userId));
  },

  addTransaksi(trxData) {
    const trxList = this.getTransaksi();
    const newId = trxList.length > 0 ? Math.max(...trxList.map(t => t.id)) + 1 : 1;

    const alat = this.getAlatById(trxData.alatId);

    const newTrx = {
      id: newId,
      userId: trxData.userId,
      alatId: parseInt(trxData.alatId),
      alat: alat ? { nama: alat.nama } : { nama: 'Unknown' },
      nama_penyewa: trxData.nama_penyewa,
      no_hp: trxData.no_hp,
      durasi: parseInt(trxData.durasi),
      total_harga: parseInt(trxData.total_harga),
      bukti_pembayaran: trxData.bukti_pembayaran || null,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    trxList.push(newTrx);
    localStorage.setItem(this.KEYS.TRANSAKSI, JSON.stringify(trxList));
    console.log('DataManager: Transaksi added', newTrx);
    return newTrx;
  },

  updateTransaksiStatus(id, status) {
    const trxList = this.getTransaksi();
    const index = trxList.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      trxList[index].status = status;
      localStorage.setItem(this.KEYS.TRANSAKSI, JSON.stringify(trxList));
      console.log('DataManager: Transaksi status updated', id, status);
      return trxList[index];
    }
    return null;
  },

  // ==================== STATS ====================
  getStats(role, userId) {
    const alat = this.getAlat();
    const transaksi = role === 'admin'
      ? this.getTransaksi()
      : this.getTransaksiByUserId(userId);

    const activeStatuses = ['pending', 'lunas'];
    const activeTrx = transaksi.filter(t => activeStatuses.includes(t.status));

    return {
      totalAlat: alat.length,
      activeTrx: activeTrx.length,
      totalTrx: transaksi.length
    };
  },

  // Reset semua data ke default
  resetData() {
    localStorage.removeItem(this.KEYS.INITIALIZED);
    this.init();
  }
};

// Auto-initialize saat script di-load
DataManager.init();

// Expose untuk debugging di console
window.DataManager = DataManager;
