/* ALUR PROGRAM CHECKOUT
   Data buku yang mau dibayar diambil dari localStorage dengan nama checkoutBuku.
   Data tersebut ditampilkan ke halaman checkout, lalu jumlah buku, subtotal, ongkir, dan total pembayaran dihitung.
   User juga bisa mengurangi, menambah, atau menghapus buku sebelum mengisi form checkout.
   Setelah form dikirim, pesanan disimpan sebagai data checkout dan keranjang checkout dikosongkan.
*/

const daftarCheckout = document.getElementById("daftarCheckout");
const jumlahPesanan = document.getElementById("jumlahPesanan");
const subtotal = document.getElementById("subtotal");
const pengiriman = document.getElementById("pengiriman");
const totalPembayaran = document.getElementById("totalPembayaran");
const formCheckout = document.getElementById("formCheckout");
const pesananBerhasil = document.getElementById("pesananBerhasil");
const BIAYA_PENGIRIMAN = 10000;
/* DATA KHUSUS CHECKOUT */
// Data checkout saya ambil dari localStorage. Kalau belum ada data, saya pakai array kosong supaya program tetap aman dijalankan.

let keranjang = JSON.parse(localStorage.getItem("checkoutBuku")) || [];
/* MENGAMBIL NILAI DATA */
// Fungsi ini mencari nama field yang tersedia. Jadi kalau data API memakai "judul" atau "title", keduanya tetap bisa dipakai.
function ambilNilai(buku,nama) {
    for (const key of nama) {
        if (buku[key] !== undefined && buku[key] !== null && buku[key] !== "") {
            return buku[key];
        }
    }
    return "";
}
/* FORMAT HARGA */
// Fungsi ini mengubah angka harga menjadi format Rupiah agar tampilannya lebih mudah dibaca user.
function formatHarga(harga) {
    return "Rp " + Number(harga || 0).toLocaleString("id-ID");
}
/* SIMPAN DATA CHECKOUT */
// Setiap ada perubahan jumlah atau isi checkout, data disimpan lagi supaya perubahan tidak hilang saat halaman dimuat ulang.
function simpanCheckout() {
    localStorage.setItem("checkoutBuku",JSON.stringify(keranjang));
}
/* MENAMPILKAN PESAN KOSONG */
// Kalau belum ada buku yang dipilih, bagian checkout dikosongkan dan semua nilai pembayaran dikembalikan ke Rp 0.
function tampilkanKosong() {
    daftarCheckout.textContent = "";
    const pesan = document.createElement("p");
    pesan.className = "pesanCheckout";
    pesan.textContent = "Belum ada buku yang dipilih.";
    daftarCheckout.appendChild(pesan);
    jumlahPesanan.textContent = "0 buku";
    subtotal.textContent = "Rp 0";
    pengiriman.textContent = "Rp 0";
    totalPembayaran.textContent = "Rp 0";
}
/* MEMBUAT ITEM CHECKOUT */
// Fungsi ini membuat satu tampilan buku checkout sekaligus memasang tombol kurang, tambah, dan hapus.
function buatItemCheckout(buku,index) {
    const judul = ambilNilai(buku,["judul","title"]) || "Tanpa Judul";
    const penulis = ambilNilai(buku,["penulis","author"]) || "Tidak diketahui";
    const cover = ambilNilai(buku,["cover","gambar","image"]);
    const harga = Number(ambilNilai(buku,["harga","price"]) || 0);
    const stok = Number(ambilNilai(buku,["stok","stock"]) || 0);
    const jumlah = Number(buku.jumlah) || 1;
    const item = document.createElement("div");
    item.className = "itemCheckout";
    /* GAMBAR */
    const gambarCheckout = document.createElement("div");
    gambarCheckout.className = "gambarCheckout";
    if (cover) {
        const gambar = document.createElement("img");
        gambar.src = cover;
        gambar.alt = judul;
        gambar.onerror = function() {
            gambarCheckout.textContent = "📖";
            gambarCheckout.classList.add("tanpaGambar");
        };
        gambarCheckout.appendChild(gambar);
    } else {
        const tanpaGambar = document.createElement("div");
        tanpaGambar.className = "tanpaGambar";
        tanpaGambar.textContent = "📖";
        gambarCheckout.appendChild(tanpaGambar);
    }
    /* INFORMASI */
    const info = document.createElement("div");
    info.className = "infoCheckout";
    const namaBuku = document.createElement("h3");
    namaBuku.textContent = judul;
    const namaPenulis = document.createElement("p");
    namaPenulis.textContent = penulis;
    const hargaBuku = document.createElement("p");
    hargaBuku.className = "hargaCheckout";
    hargaBuku.textContent = formatHarga(harga);
    /* JUMLAH */
    const jumlahBuku = document.createElement("div");
    jumlahBuku.className = "jumlahBuku";
    const tombolKurang = document.createElement("button");
    tombolKurang.type = "button";
    tombolKurang.textContent = "−";
    const angkaJumlah = document.createElement("span");
    angkaJumlah.textContent = jumlah;
    const tombolTambah = document.createElement("button");
    tombolTambah.type = "button";
    tombolTambah.textContent = "+";
    const tombolHapus = document.createElement("button");
    tombolHapus.type = "button";
    tombolHapus.className = "tombolHapus";
    tombolHapus.textContent = "Hapus";
    /* KURANG */
    tombolKurang.addEventListener("click",() => {
        const jumlahSekarang = Number(buku.jumlah) || 1;
        if (jumlahSekarang > 1) {
            buku.jumlah = jumlahSekarang - 1;
        } else {
            keranjang.splice(index,1);
        }
        simpanCheckout();
        tampilkanCheckout();
    });
    /* TAMBAH */
    tombolTambah.addEventListener("click",() => {
        const jumlahSekarang = Number(buku.jumlah) || 1;
        if (stok > 0 && jumlahSekarang >= stok) {
            alert("Jumlah buku sudah mencapai stok yang tersedia.");
            return;
        }
        buku.jumlah = jumlahSekarang + 1;
        simpanCheckout();
        tampilkanCheckout();
    });
    /* HAPUS */
    tombolHapus.addEventListener("click",() => {
        keranjang.splice(index,1);
        simpanCheckout();
        tampilkanCheckout();
    });
    /* SUSUN JUMLAH */
    jumlahBuku.appendChild(tombolKurang);
    jumlahBuku.appendChild(angkaJumlah);
    jumlahBuku.appendChild(tombolTambah);
    jumlahBuku.appendChild(tombolHapus);
    /* SUSUN INFORMASI */
    info.appendChild(namaBuku);
    info.appendChild(namaPenulis);
    info.appendChild(hargaBuku);
    info.appendChild(jumlahBuku);
    /* SUSUN ITEM */
    item.appendChild(gambarCheckout);
    item.appendChild(info);
    return item;
}
/* MENAMPILKAN CHECKOUT */
// Fungsi utama checkout: saya hitung jumlah buku dan total harga, lalu hasilnya saya tampilkan ke halaman.
function tampilkanCheckout() {
    if (keranjang.length === 0) {
        tampilkanKosong();
        return;
    }
    daftarCheckout.textContent = "";
    let jumlahSemua = 0;
    let totalHarga = 0;
    keranjang.forEach((buku,index) => {
        const jumlah = Number(buku.jumlah) || 1;
        const harga = Number(ambilNilai(buku,["harga","price"]) || 0);
        jumlahSemua += jumlah;
        totalHarga += harga * jumlah;
        const item = buatItemCheckout(buku,index);
        daftarCheckout.appendChild(item);
    });
    jumlahPesanan.textContent = jumlahSemua + " buku";
    subtotal.textContent = formatHarga(totalHarga);
    if (totalHarga > 0) {
        pengiriman.textContent = formatHarga(BIAYA_PENGIRIMAN);
        totalPembayaran.textContent = formatHarga(totalHarga + BIAYA_PENGIRIMAN);
    } else {
        pengiriman.textContent = "Rp 0";
        totalPembayaran.textContent = "Rp 0";
    }
}
/* SUBMIT PEMESANAN */
// Form checkout diproses di sini. Saya pastikan keranjang tidak kosong dan data pengiriman/pembayaran sudah diisi sebelum pesanan dianggap berhasil.
if (formCheckout) {
    formCheckout.addEventListener("submit",event => {
        event.preventDefault();
        if (keranjang.length === 0) {
            alert("Belum ada buku yang dipilih.");
            return;
        }
        const nama = document.getElementById("nama").value.trim();
        const email = document.getElementById("email").value.trim();
        const telepon = document.getElementById("telepon").value.trim();
        const alamat = document.getElementById("alamat").value.trim();
        const pembayaran = document.getElementById("pembayaran").value;
        if (!nama || !email || !telepon || !alamat || !pembayaran) {
            alert("Lengkapi data pemesanan terlebih dahulu.");
            return;
        }
        const pesanan = {
            nama:nama,
            email:email,
            telepon:telepon,
            alamat:alamat,
            pembayaran:pembayaran,
            buku:keranjang,
            tanggal:new Date().toISOString()
        };
        localStorage.setItem("pesananTerakhir",JSON.stringify(pesanan));
        /* HAPUS BUKU YANG SUDAH DIPESAN DARI KERANJANG UTAMA */
        // Supaya buku yang sudah checkout tidak lagi nyangkut/tercentang di halaman Keranjang.
        const idBukuDipesan = keranjang.map(buku => String(buku.id));
        let keranjangUtama = JSON.parse(localStorage.getItem("keranjangBuku")) || [];
        keranjangUtama = keranjangUtama.filter(
            buku => !idBukuDipesan.includes(String(buku.id))
        );
        localStorage.setItem("keranjangBuku",JSON.stringify(keranjangUtama));
        /* HAPUS DATA CHECKOUT */
        localStorage.removeItem("checkoutBuku");
        keranjang = [];
        if (pesananBerhasil) {
            pesananBerhasil.style.display = "flex";
        }
    });
}
/* MODE TAMPILAN */
const body = document.body;
const tombolMode = document.getElementById("tombolMode");
if (localStorage.getItem("theme") === "light") {
    body.classList.add("light-mode");
    if (tombolMode) tombolMode.textContent = "☀";
} else {
    body.classList.add("dark-mode");
    if (tombolMode) tombolMode.textContent = "☾";
}
if (tombolMode) {
    tombolMode.addEventListener("click",() => {
        body.classList.toggle("light-mode");
        body.classList.toggle("dark-mode");
        if (body.classList.contains("light-mode")) {
            tombolMode.textContent = "☀";
            localStorage.setItem("theme","light");
        } else {
            tombolMode.textContent = "☾";
            localStorage.setItem("theme","dark");
        }
    });
}
/* MENAMPILKAN DATA */
tampilkanCheckout();
