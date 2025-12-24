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
      username: "User",
      email: "user@bersenandung.com",
      password: "user123",
      role: "user"
    }
  ],

  defaultAlat: [
    { id: 1, nama: "Gitar Akustik Yamaha", kategori: "Gitar", stok: 5, harga_per_jam: 25000 },
    { id: 2, nama: "Gitar Elektrik Fender", kategori: "Gitar", stok: 3, harga_per_jam: 35000 },
    { id: 3, nama: "Drum Set Pearl", kategori: "Drum", stok: 2, harga_per_jam: 50000 },
    { id: 4, nama: "Keyboard Yamaha PSR", kategori: "Piano", stok: 4, harga_per_jam: 30000 },
    { id: 5, nama: "Bass Elektrik Ibanez", kategori: "Bass", stok: 3, harga_per_jam: 30000 },
    { id: 6, nama: "Sound System JBL", kategori: "Sound System", stok: 2, harga_per_jam: 75000 }
  ],

  // Initialize data - load defaults jika belum ada
  init() {
    if (!localStorage.getItem(this.KEYS.INITIALIZED)) {
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(this.defaultUsers));
      localStorage.setItem(this.KEYS.ALAT, JSON.stringify(this.defaultAlat));
      localStorage.setItem(this.KEYS.TRANSAKSI, JSON.stringify([]));
      localStorage.setItem(this.KEYS.INITIALIZED, 'true');
      console.log('DataManager: Data initialized');
    }
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
      role: 'user' // Default role adalah user
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
    return newTrx;
  },

  updateTransaksiStatus(id, status) {
    const trxList = this.getTransaksi();
    const index = trxList.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      trxList[index].status = status;
      localStorage.setItem(this.KEYS.TRANSAKSI, JSON.stringify(trxList));
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
