/* ALUR PROGRAM KATALOG
   Data buku diambil dari Firebase lalu disimpan ke semuaBuku.
   User bisa mencari buku, memilih filter kategori/genre, dan mengurutkan hasilnya.
   Setelah hasil diproses, kartu buku ditampilkan ke halaman katalog.
   Buku juga bisa dimasukkan ke keranjang dan jumlah tampilannya bisa ditambah dengan tombol Lihat Lebih Banyak.
*/

const alamatAPI = "https://api--bukuuu-default-rtdb.firebaseio.com/.json";
const daftarBuku = document.getElementById("daftarBuku");
const jumlahBuku = document.getElementById("jumlahBuku");
const judulHasil = document.getElementById("judulHasil");
const pencarian = document.getElementById("pencarian");
const filterKategori = document.getElementById("filterKategori");
const filterGenre = document.getElementById("filterGenre");
const urutanBuku = document.getElementById("urutanBuku");
const hapusFilter = document.getElementById("hapusFilter");
const tombolLihatLebihBanyak = document.getElementById("tombolLihatLebihBanyak");
const bukuTidakDitemukan = document.getElementById("bukuTidakDitemukan");
const tombolResetKosong = document.getElementById("tombolResetKosong");
const tombolTampilkanSemua = document.getElementById("tombolTampilkanSemua");
const tombolMenu = document.getElementById("tombolMenu");
const navigasi = document.getElementById("navigasi");
const tombolMode = document.getElementById("tombolMode");
const body = document.body;
let semuaBuku = [];
let bukuTampil = [];
let jumlahTampil = 12;
/* TOMBOL MENU */
if (tombolMenu && navigasi) {
    tombolMenu.addEventListener("click", () => {
        navigasi.classList.toggle("aktif");
        tombolMenu.classList.toggle("aktif");
    });
}
/* TOMBOL MODE */
if (localStorage.getItem("theme") === "light") {
    body.classList.add("light-mode");
    if (tombolMode) tombolMode.textContent = "☀";
} else {
    body.classList.add("dark-mode");
    if (tombolMode) tombolMode.textContent = "☾";
}
if (tombolMode) {
    tombolMode.addEventListener("click", () => {
        body.classList.toggle("light-mode");
        body.classList.toggle("dark-mode");
        if (body.classList.contains("light-mode")) {
            tombolMode.textContent = "☀";
            localStorage.setItem("theme", "light");
        } else {
            tombolMode.textContent = "☾";
            localStorage.setItem("theme", "dark");
        }
    });
}
/* MENGAMBIL NILAI DATA */
// Fungsi ini mengecek beberapa kemungkinan nama field agar data buku tetap terbaca walaupun property API berbeda.
function ambilNilai(buku,nama) {
    for (const key of nama) {
        if (buku[key] !== undefined && buku[key] !== null && buku[key] !== "") {
            return buku[key];
        }
    }
    return "";
}
/* MENGUBAH DATA FIREBASE */
// Data Firebase saya ubah ke array agar bisa diproses dengan filter, pencarian, dan sorting.
function ambilData(data) {
    if (!data) return [];
    if (Array.isArray(data)) {
        return data.map((buku,index) => ({
            id: buku.id !== undefined ? buku.id : index,
            ...buku
        }));
    }
    return Object.keys(data).map(id => ({
        id:id,
        ...data[id]
    }));
}
/* FORMAT HARGA */
// Angka harga saya ubah ke format Rupiah sebelum ditampilkan di kartu buku.
function formatHarga(harga) {
    return "Rp " + Number(harga || 0).toLocaleString("id-ID");
}
/* MEMBUAT DAFTAR FILTER */
// Saya kumpulkan kategori dan genre yang unik dari semua buku, lalu saya masukkan ke pilihan filter.
// Catatan: option "Semua Kategori" / "Semua Genre" dan setiap pilihan lain dibuat dengan createElement,
// bukan innerHTML, supaya tidak ada string HTML yang di-inject ke DOM.
function buatFilter() {
    const kategori = [];
    const genre = [];
    semuaBuku.forEach(buku => {
        const namaKategori = ambilNilai(buku,["kategori","category"]);
        const namaGenre = ambilNilai(buku,["genre"]);
        if (namaKategori && !kategori.includes(namaKategori)) kategori.push(namaKategori);
        if (namaGenre && !genre.includes(namaGenre)) genre.push(namaGenre);
    });
    kategori.sort();
    genre.sort();

    // Kosongkan isi lama tanpa innerHTML.
    filterKategori.textContent = "";
    filterGenre.textContent = "";

    const optionSemuaKategori = document.createElement("option");
    optionSemuaKategori.value = "semua";
    optionSemuaKategori.textContent = "Semua Kategori";
    filterKategori.appendChild(optionSemuaKategori);

    const optionSemuaGenre = document.createElement("option");
    optionSemuaGenre.value = "semua";
    optionSemuaGenre.textContent = "Semua Genre";
    filterGenre.appendChild(optionSemuaGenre);

    kategori.forEach(nama => {
        const option = document.createElement("option");
        option.value = nama;
        option.textContent = nama;
        filterKategori.appendChild(option);
    });
    genre.forEach(nama => {
        const option = document.createElement("option");
        option.value = nama;
        option.textContent = nama;
        filterGenre.appendChild(option);
    });
}
/* TAMBAH KE KERANJANG */
// Saat tombol keranjang diklik, buku dimasukkan ke localStorage. Kalau sudah ada, jumlahnya ditambah selama stok masih tersedia.
function tambahKeKeranjang(buku) {
    let keranjang = JSON.parse(localStorage.getItem("keranjangBuku")) || [];
    const stok = Number(ambilNilai(buku,["stok","stock"]) || 0);
    if (stok <= 0) {
        alert("Maaf, buku ini sedang habis.");
        return;
    }
    const bukuAda = keranjang.find(item => String(item.id) === String(buku.id));
    if (bukuAda) {
        const jumlah = Number(bukuAda.jumlah || 1);
        if (jumlah >= stok) {
            alert("Jumlah buku sudah mencapai stok yang tersedia.");
            return;
        }
        bukuAda.jumlah = jumlah + 1;
    } else {
        keranjang.push({
            ...buku,
            jumlah:1,
            dipilih:false
        });
    }
    localStorage.setItem("keranjangBuku",JSON.stringify(keranjang));
    alert("Buku berhasil dimasukkan ke keranjang.");
}
/* MEMBUAT KARTU BUKU */
// Fungsi ini membuat satu kartu buku lengkap dengan gambar, informasi, dan tombol Detail serta Keranjang.
function buatKartuBuku(buku) {
    const judul = ambilNilai(buku,["judul","title"]) || "Tanpa Judul";
    const penulis = ambilNilai(buku,["penulis","author"]) || "Tidak diketahui";
    const kategori = ambilNilai(buku,["kategori","category"]) || "Tanpa Kategori";
    const genre = ambilNilai(buku,["genre"]) || "Tanpa Genre";
    const harga = Number(ambilNilai(buku,["harga","price"]) || 0);
    const rating = Number(buku.rating || 0);
    const cover = ambilNilai(buku,["cover","gambar","image"]);
    if (!cover || String(cover).trim() === "") return null;
    const kartu = document.createElement("article");
    kartu.className = "kartuBuku";
    const bagianGambar = document.createElement("div");
    bagianGambar.className = "bagianGambar";
    const gambar = document.createElement("img");
    gambar.src = cover;
    gambar.alt = judul;
    gambar.loading = "lazy";
    gambar.onerror = function() {
        kartu.remove();
        setTimeout(() => perbaruiJumlahKartu(),0);
    };
    bagianGambar.appendChild(gambar);
    const info = document.createElement("div");
    info.className = "infoBuku";
    const namaKategori = document.createElement("p");
    namaKategori.className = "kategoriBuku";
    namaKategori.textContent = kategori;
    const namaJudul = document.createElement("h3");
    namaJudul.className = "namaBuku";
    namaJudul.textContent = judul;
    const namaPenulis = document.createElement("p");
    namaPenulis.className = "penulisBuku";
    namaPenulis.textContent = penulis;
    const namaGenre = document.createElement("p");
    namaGenre.className = "genreBuku";
    namaGenre.textContent = genre;
    const bagianBawah = document.createElement("div");
    bagianBawah.className = "bagianBawahBuku";
    const bagianHarga = document.createElement("div");
    bagianHarga.className = "bagianHarga";
    const namaRating = document.createElement("span");
    namaRating.className = "ratingBuku";
    namaRating.textContent = "★ " + rating;
    const namaHarga = document.createElement("strong");
    namaHarga.className = "hargaBuku";
    namaHarga.textContent = formatHarga(harga);
    bagianHarga.appendChild(namaRating);
    bagianHarga.appendChild(namaHarga);
    const tombolDetail = document.createElement("a");
    tombolDetail.className = "tombolDetail";
    tombolDetail.href = "detail.html?id=" + encodeURIComponent(buku.id);
    tombolDetail.textContent = "Lihat Detail";
    const tombolKeranjang = document.createElement("button");
    tombolKeranjang.className = "tombolKeranjang";
    tombolKeranjang.textContent = "+ Keranjang";
    tombolKeranjang.addEventListener("click",() => {
        tambahKeKeranjang(buku);
    });
    bagianBawah.appendChild(bagianHarga);
    bagianBawah.appendChild(tombolDetail);
    bagianBawah.appendChild(tombolKeranjang);
    info.appendChild(namaKategori);
    info.appendChild(namaJudul);
    info.appendChild(namaPenulis);
    info.appendChild(namaGenre);
    info.appendChild(bagianBawah);
    kartu.appendChild(bagianGambar);
    kartu.appendChild(info);
    return kartu;
}
/* MENAMPILKAN BUKU */
// Hasil pencarian/filter ditampilkan di sini. Jumlah kartu dibatasi sesuai jumlahTampil supaya halaman tidak terlalu penuh.
function tampilkanBuku(data) {
    daftarBuku.textContent = "";
    if (data.length === 0) {
        bukuTidakDitemukan.style.display = "block";
        jumlahBuku.textContent = "0 buku";
        tombolLihatLebihBanyak.style.display = "none";
        return;
    }
    bukuTidakDitemukan.style.display = "none";
    const dataYangDitampilkan = data.slice(0,jumlahTampil);
    dataYangDitampilkan.forEach(buku => {
        const kartu = buatKartuBuku(buku);
        if (kartu) daftarBuku.appendChild(kartu);
    });
    perbaruiJumlahKartu();
    if (data.length > jumlahTampil) {
        tombolLihatLebihBanyak.style.display = "inline-block";
    } else {
        tombolLihatLebihBanyak.style.display = "none";
    }
}
/* MENGHITUNG KARTU YANG TAMPIL */
// Saya perbarui angka jumlah buku yang tampil agar user tahu berapa hasil yang sedang ditampilkan.
function perbaruiJumlahKartu() {
    const jumlah = daftarBuku.querySelectorAll(".kartuBuku").length;
    jumlahBuku.textContent = jumlah + " buku";
    if (jumlah === 0 && bukuTampil.length > 0) {
        bukuTidakDitemukan.style.display = "block";
    }
}
/* FILTER DAN PENCARIAN */
// Ini fungsi utama katalog: data disaring berdasarkan pencarian dan filter, lalu diurutkan sesuai pilihan user.
function prosesBuku() {
    const kataCari = pencarian.value.toLowerCase().trim();
    const kategori = filterKategori.value;
    const genre = filterGenre.value;
    const urutan = urutanBuku.value;
    bukuTampil = semuaBuku.filter(buku => {
        const judul = String(ambilNilai(buku,["judul","title"])).toLowerCase();
        const penulis = String(ambilNilai(buku,["penulis","author"])).toLowerCase();
        const kategoriBuku = String(ambilNilai(buku,["kategori","category"]));
        const genreBuku = String(ambilNilai(buku,["genre"]));
        const isbn = String(ambilNilai(buku,["isbn","ISBN"])).toLowerCase();
        const cocokCari = !kataCari ||
            judul.includes(kataCari) ||
            penulis.includes(kataCari) ||
            kategoriBuku.toLowerCase().includes(kataCari) ||
            genreBuku.toLowerCase().includes(kataCari) ||
            isbn.includes(kataCari);
        const cocokKategori = kategori === "semua" || kategoriBuku === kategori;
        const cocokGenre = genre === "semua" || genreBuku === genre;
        return cocokCari && cocokKategori && cocokGenre;
    });
    if (urutan === "terbaru") {
        bukuTampil.sort((a,b) =>
            Number(ambilNilai(b,["tahun","year"]) || 0) -
            Number(ambilNilai(a,["tahun","year"]) || 0)
        );
    }
    if (urutan === "termurah") {
        bukuTampil.sort((a,b) =>
            Number(ambilNilai(a,["harga","price"]) || 0) -
            Number(ambilNilai(b,["harga","price"]) || 0)
        );
    }
    if (urutan === "termahal") {
        bukuTampil.sort((a,b) =>
            Number(ambilNilai(b,["harga","price"]) || 0) -
            Number(ambilNilai(a,["harga","price"]) || 0)
        );
    }
    if (urutan === "rating") {
        bukuTampil.sort((a,b) =>
            Number(b.rating || 0) -
            Number(a.rating || 0)
        );
    }
    if (urutan === "nama") {
        bukuTampil.sort((a,b) =>
            String(ambilNilai(a,["judul","title"]) || "")
            .localeCompare(String(ambilNilai(b,["judul","title"]) || ""))
        );
    }
    jumlahTampil = 12;
    if (kataCari) {
        judulHasil.textContent = "Hasil Pencarian";
    } else if (kategori !== "semua") {
        judulHasil.textContent = kategori;
    } else if (genre !== "semua") {
        judulHasil.textContent = genre;
    } else {
        judulHasil.textContent = "Semua Buku";
    }
    tampilkanBuku(bukuTampil);
}
/* SEARCH */
if (pencarian) pencarian.addEventListener("input",prosesBuku);
/* FILTER KATEGORI */
if (filterKategori) filterKategori.addEventListener("change",prosesBuku);
/* FILTER GENRE */
if (filterGenre) filterGenre.addEventListener("change",prosesBuku);
/* URUTKAN */
if (urutanBuku) urutanBuku.addEventListener("change",prosesBuku);
/* LIHAT LEBIH BANYAK */
if (tombolLihatLebihBanyak) {
    tombolLihatLebihBanyak.addEventListener("click",() => {
        jumlahTampil += 12;
        tampilkanBuku(bukuTampil);
    });
}
/* RESET FILTER */
// Tombol reset mengembalikan pencarian, filter, sorting, dan jumlah tampilan ke kondisi awal.
function resetFilter() {
    pencarian.value = "";
    filterKategori.value = "semua";
    filterGenre.value = "semua";
    urutanBuku.value = "terbaru";
    jumlahTampil = 12;
    judulHasil.textContent = "Semua Buku";
    prosesBuku();
}
if (hapusFilter) hapusFilter.addEventListener("click",resetFilter);
if (tombolResetKosong) tombolResetKosong.addEventListener("click",resetFilter);
if (tombolTampilkanSemua) tombolTampilkanSemua.addEventListener("click",resetFilter);
/* MENGAMBIL DATA FIREBASE */
fetch(alamatAPI)
    .then(respon => {
        if (!respon.ok) throw new Error("Gagal mengambil data Firebase.");
        return respon.json();
    })
    .then(data => {
        semuaBuku = ambilData(data);
        buatFilter();
        prosesBuku();
    })
    .catch(error => {
        console.error("Gagal mengambil data:",error);
        // Ganti daftarBuku.innerHTML dengan createElement supaya tidak ada string HTML yang di-inject.
        daftarBuku.textContent = "";
        const pesanError = document.createElement("p");
        pesanError.className = "pesan";
        pesanError.textContent = "Gagal mengambil data buku.";
        daftarBuku.appendChild(pesanError);
        jumlahBuku.textContent = "0 buku";
        tombolLihatLebihBanyak.style.display = "none";
    });
/* HEADER SAAT SCROLL */
const header = document.querySelector(".header");
window.addEventListener("scroll",() => {
    if (window.scrollY > 30) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});