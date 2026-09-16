/* ALUR PROGRAM DETAIL BUKU
   Pertama saya atur menu, mode terang/gelap, dan header saat halaman di-scroll.
   Setelah itu saya ambil id buku dari URL, lalu ambil semua data buku dari Firebase.
   Data yang id-nya sesuai ditampilkan sebagai detail buku.
   Dari halaman ini user bisa memasukkan buku ke keranjang atau langsung lanjut ke checkout.
*/

const tombolMenu = document.getElementById("tombolMenu");
const navigasi = document.getElementById("navigasi");
if (tombolMenu && navigasi) {
    tombolMenu.addEventListener("click", () => {
        navigasi.classList.toggle("aktif");
        tombolMenu.classList.toggle("aktif");
    });
}
/* TOMBOL MODE */
// Mode yang dipilih saya simpan di localStorage supaya saat pindah halaman, pilihan tema tetap sama.

const tombolMode = document.getElementById("tombolMode");
const body = document.body;
function terapkanMode() {
    const mode = localStorage.getItem("theme") || "dark";
    body.classList.remove("light-mode", "dark-mode");
    body.classList.add(mode === "light" ? "light-mode" : "dark-mode");
    if (tombolMode) {
        tombolMode.textContent = mode === "light" ? "☀" : "☾";
    }
}
terapkanMode();
if (tombolMode) {
    tombolMode.addEventListener("click", () => {
        const modeBaru = body.classList.contains("light-mode") ? "dark" : "light";
        localStorage.setItem("theme", modeBaru);
        terapkanMode();
    });
}
/* SINKRONISASI MODE DARI HALAMAN LAIN */
// Event ini dipakai supaya perubahan tema dari tab/halaman lain ikut terbaca.

window.addEventListener("storage", (event) => {
    if (event.key === "theme") {
        terapkanMode();
    }
});
/* HEADER SAAT SCROLL */
// Saat user scroll lebih dari 10px, class scrolled ditambahkan agar tampilan header bisa berubah lewat CSS.

const headerUtama = document.querySelector(".header");
function perbaruiHeaderScroll() {
    if (!headerUtama) return;
    headerUtama.classList.toggle("scrolled", window.scrollY > 10);
}
perbaruiHeaderScroll();
window.addEventListener("scroll", perbaruiHeaderScroll);
/* ALAMAT API */
// Alamat ini dipakai untuk mengambil seluruh data buku dari Firebase Realtime Database.

const alamatAPI = "https://api--bukuuu-default-rtdb.firebaseio.com/.json";
/* MENGAMBIL ID BUKU */
// Saya ambil parameter id dari URL, karena id inilah yang dipakai untuk menentukan buku mana yang harus ditampilkan.

const parameter = new URLSearchParams(window.location.search);
const idBuku = parameter.get("id");
/* ELEMENT HALAMAN */
const detailBuku = document.getElementById("detailBuku");
const bukuTidakDitemukan = document.getElementById("bukuTidakDitemukan");
const tombolKeranjang = document.getElementById("tombolKeranjang");
const tombolCheckout = document.getElementById("tombolCheckout");
let bukuSekarang = null;
/* MENGAMBIL NILAI DATA */
// Fungsi ini menyesuaikan nama field dari data buku supaya kode tetap jalan walaupun API memakai nama Indonesia atau Inggris.
function ambilNilai(buku, nama) {
    for (const key of nama) {
        if (
            buku[key] !== undefined &&
            buku[key] !== null &&
            buku[key] !== ""
        ) {
            return buku[key];
        }
    }
    return "";
}
/* MENGUBAH DATA FIREBASE */
// Data Firebase bisa berbentuk object atau array. Di sini saya ubah semuanya menjadi array supaya lebih gampang dicari.
function ambilData(data) {
    if (!data) return [];
    if (Array.isArray(data)) {
        return data.map((buku, index) => ({
            ...buku,
            id: buku.id !== undefined && buku.id !== null ? buku.id : index
        }));
    }
    return Object.keys(data).map((id) => ({
        ...data[id],
        id: id
    }));
}
/* FORMAT HARGA */
// Harga diubah ke format Rupiah sebelum ditampilkan ke user.
function formatHarga(harga) {
    return "Rp " + Number(harga || 0).toLocaleString("id-ID");
}
/* MENAMPILKAN DETAIL BUKU */
// Fungsi ini mengisi semua informasi buku ke elemen HTML berdasarkan data buku yang ditemukan.
function tampilkanDetail(buku) {
    bukuSekarang = buku;
    const judul = ambilNilai(buku, ["judul", "title"]) || "Tanpa Judul";
    const penulis = ambilNilai(buku, ["penulis", "author"]) || "Tidak diketahui";
    const kategori = ambilNilai(buku, ["kategori", "category"]) || "Tidak ada kategori";
    const genre = ambilNilai(buku, ["genre"]) || "Tidak ada genre";
    const penerbit = ambilNilai(buku, ["penerbit", "publisher"]) || "Tidak diketahui";
    const tahun = ambilNilai(buku, ["tahun", "year"]) || "Tidak diketahui";
    const isbn = ambilNilai(buku, ["isbn", "ISBN"]) || "Tidak tersedia";
    const cover = ambilNilai(buku, ["cover", "gambar", "image"]);
    const harga = Number(ambilNilai(buku, ["harga", "price"]) || 0);
    const stok = Number(ambilNilai(buku, ["stok", "stock"]) || 0);
    const rating = Number(buku.rating || 0);
    const deskripsi = ambilNilai(buku, ["deskripsi", "description"]) || "Belum ada deskripsi buku.";
    document.getElementById("judulBuku").textContent = judul;
    document.getElementById("penulisBuku").textContent = penulis;
    document.getElementById("kategoriBuku").textContent = kategori;
    document.getElementById("genreBuku").textContent = genre;
    document.getElementById("penerbitBuku").textContent = penerbit;
    document.getElementById("tahunBuku").textContent = tahun;
    document.getElementById("isbnBuku").textContent = isbn;
    document.getElementById("ratingBuku").textContent = "★ " + rating;
    document.getElementById("hargaBuku").textContent = formatHarga(harga);
    document.getElementById("stokBuku").textContent = stok + " tersedia";
    document.getElementById("deskripsiBuku").textContent = deskripsi;
    const gambarElement = document.getElementById("gambarBuku");
    gambarElement.textContent = "";
    if (cover && String(cover).trim() !== "") {
        const gambar = document.createElement("img");
        gambar.src = cover;
        gambar.alt = judul;
        gambar.onerror = () => {
            gambarElement.textContent = "";
            const tanpaGambar = document.createElement("div");
            tanpaGambar.className = "tanpaGambar";
            tanpaGambar.textContent = "📖";
            gambarElement.appendChild(tanpaGambar);
        };
        gambarElement.appendChild(gambar);
    } else {
        const tanpaGambar = document.createElement("div");
        tanpaGambar.className = "tanpaGambar";
        tanpaGambar.textContent = "📖";
        gambarElement.appendChild(tanpaGambar);
    }
    document.title = judul + " - BukaBuku";
}
/* BUKU TIDAK DITEMUKAN */
// Kalau id dari URL tidak menemukan buku yang sesuai, saya tampilkan pesan bahwa bukunya tidak ditemukan.
function tampilkanTidakDitemukan() {
    if (detailBuku) {
        detailBuku.style.display = "none";
    }
    if (bukuTidakDitemukan) {
        bukuTidakDitemukan.style.display = "block";
    }
}
/* MEMBUAT DATA BUKU */
// Fungsi ini mengambil data penting dari buku lalu membuat object yang formatnya cocok untuk disimpan ke keranjang.
function buatDataBuku(buku) {
    const stok = Number(ambilNilai(buku, ["stok", "stock"]) || 0);
    return {
        ...buku,
        id: buku.id,
        judul: ambilNilai(buku, ["judul", "title"]),
        title: ambilNilai(buku, ["title", "judul"]),
        penulis: ambilNilai(buku, ["penulis", "author"]),
        author: ambilNilai(buku, ["author", "penulis"]),
        kategori: ambilNilai(buku, ["kategori", "category"]),
        category: ambilNilai(buku, ["category", "kategori"]),
        genre: ambilNilai(buku, ["genre"]),
        penerbit: ambilNilai(buku, ["penerbit", "publisher"]),
        publisher: ambilNilai(buku, ["publisher", "penerbit"]),
        tahun: ambilNilai(buku, ["tahun", "year"]),
        year: ambilNilai(buku, ["year", "tahun"]),
        isbn: ambilNilai(buku, ["isbn", "ISBN"]),
        harga: Number(ambilNilai(buku, ["harga", "price"]) || 0),
        price: Number(ambilNilai(buku, ["price", "harga"]) || 0),
        stok: stok,
        stock: stok,
        rating: Number(buku.rating || 0),
        cover: ambilNilai(buku, ["cover", "gambar", "image"]),
        gambar: ambilNilai(buku, ["gambar", "cover", "image"]),
        deskripsi: ambilNilai(buku, ["deskripsi", "description"]),
        jumlah: 1
    };
}
/* TAMBAH KE KERANJANG */
// Saat tombol keranjang ditekan, saya cek stok dulu lalu menambah buku baru atau menaikkan jumlah buku yang sudah ada.
function tambahKeKeranjang() {
    if (!bukuSekarang) return;
    const stok = Number(ambilNilai(bukuSekarang, ["stok", "stock"]) || 0);
    if (stok <= 0) {
        alert("Maaf, buku ini sedang habis.");
        return;
    }
    let keranjang = JSON.parse(localStorage.getItem("keranjangBuku")) || [];
    const bukuAda = keranjang.find(
        (item) => String(item.id) === String(bukuSekarang.id)
    );
    if (bukuAda) {
        const jumlah = Number(bukuAda.jumlah || 1);
        if (jumlah >= stok) {
            alert("Jumlah buku sudah mencapai stok yang tersedia.");
            return;
        }
        bukuAda.jumlah = jumlah + 1;
    } else {
        keranjang.push({
            ...buatDataBuku(bukuSekarang),
            dipilih: false
        });
    }
    localStorage.setItem("keranjangBuku", JSON.stringify(keranjang));
    alert("Buku berhasil dimasukkan ke keranjang.");
}
/* LANGSUNG CHECKOUT */
// Tombol checkout langsung memasukkan buku ini ke data checkout lalu pindah ke halaman checkout.
function langsungCheckout() {
    if (!bukuSekarang) return;
    const stok = Number(ambilNilai(bukuSekarang, ["stok", "stock"]) || 0);
    if (stok <= 0) {
        alert("Maaf, buku ini sedang habis.");
        return;
    }
    const bukuCheckout = {
        ...buatDataBuku(bukuSekarang),
        jumlah: 1
    };
    localStorage.setItem(
        "checkoutBuku",
        JSON.stringify([bukuCheckout])
    );
    window.location.href = "checkout.html";
}
/* TOMBOL KERANJANG */
if (tombolKeranjang) {
    tombolKeranjang.addEventListener("click", tambahKeKeranjang);
}
/* TOMBOL CHECKOUT */
if (tombolCheckout) {
    tombolCheckout.addEventListener("click", langsungCheckout);
}
/* MENGAMBIL DATA FIREBASE */
fetch(alamatAPI)
    .then((respon) => {
        if (!respon.ok) {
            throw new Error("Gagal mengambil data Firebase.");
        }
        return respon.json();
    })
    .then((data) => {
        const semuaBuku = ambilData(data);
        if (!idBuku) {
            tampilkanTidakDitemukan();
            return;
        }
        const buku = semuaBuku.find(
            (item) => String(item.id) === String(idBuku)
        );
        if (!buku) {
            tampilkanTidakDitemukan();
            return;
        }
        tampilkanDetail(buku);
    })
    .catch((error) => {
        console.error("Gagal mengambil data:", error);
        tampilkanTidakDitemukan();
    });
