/* ALUR PROGRAM KERANJANG
   Data keranjang diambil dari localStorage supaya isi keranjang tetap ada walaupun halaman dibuka lagi.
   Setiap buku ditampilkan lengkap dengan jumlah, harga, checkbox pilihan, dan tombol aksi.
   User bisa menambah/mengurangi jumlah, menghapus buku tertentu, atau menghapus semua buku.
   Buku yang dipilih akan dihitung totalnya dan bisa diteruskan ke halaman checkout.
*/

const keranjangContainer = document.getElementById("daftarKeranjang");
const jumlahKeranjang = document.getElementById("jumlahKeranjang");
const jumlahDipilih = document.getElementById("jumlahDipilih");
const jumlahUnit = document.getElementById("jumlahUnit");
const totalHarga = document.getElementById("totalHarga");
const tombolPilihSemua = document.getElementById("pilihSemua");
const tombolHapusDipilih = document.getElementById("hapusDipilih");
const tombolHapusSemua = document.getElementById("hapusSemua");
const tombolCheckout = document.getElementById("tombolCheckout");
const keranjangKosong = document.getElementById("keranjangKosong");
let keranjang = JSON.parse(localStorage.getItem("keranjangBuku")) || [];
/* MENGAMBIL NILAI DATA */
// Fungsi ini mengambil nilai field yang tersedia, jadi data dengan property Indonesia atau Inggris tetap bisa dipakai.
function ambilNilai(buku, nama) {
    for (const key of nama) {
        if (buku[key] !== undefined && buku[key] !== null && buku[key] !== "") {
            return buku[key];
        }
    }
    return "";
}
/* FORMAT HARGA */
// Harga saya ubah menjadi format Rupiah supaya lebih enak dibaca.
function formatHarga(harga) {
    return "Rp " + Number(harga || 0).toLocaleString("id-ID");
}
/* MENYIMPAN KERANJANG */
// Setiap isi keranjang berubah, saya simpan lagi ke localStorage supaya datanya tidak hilang.
function simpanKeranjang() {
    localStorage.setItem("keranjangBuku", JSON.stringify(keranjang));
}
/* MENAMPILKAN KERANJANG */
// Fungsi utama ini membuat ulang tampilan semua buku yang ada di keranjang berdasarkan data terbaru.
function tampilkanKeranjang() {
    if (!keranjangContainer) return;
    keranjangContainer.textContent = "";
    if (keranjang.length === 0) {
        if (keranjangKosong) {
            keranjangKosong.style.display = "block";
        }
        if (tombolCheckout) {
            tombolCheckout.disabled = true;
        }
        if (tombolPilihSemua) {
            tombolPilihSemua.checked = false;
            tombolPilihSemua.disabled = true;
        }
        if (jumlahKeranjang) {
            jumlahKeranjang.textContent = "0";
        }
        hitungTotal();
        return;
    }
    if (keranjangKosong) {
        keranjangKosong.style.display = "none";
    }
    if (tombolPilihSemua) {
        tombolPilihSemua.disabled = false;
        tombolPilihSemua.checked = keranjang.every(
            buku => buku.dipilih === true
        );
    }
    keranjang.forEach((buku, index) => {
        const judul = ambilNilai(buku, ["judul", "title"]) || "Tanpa Judul";
        const penulis = ambilNilai(buku, ["penulis", "author"]) || "Tidak diketahui";
        const kategori = ambilNilai(buku, ["kategori", "category"]) || "Tanpa Kategori";
        const genre = ambilNilai(buku, ["genre"]) || "Tanpa Genre";
        const penerbit = ambilNilai(buku, ["penerbit", "publisher"]) || "Tidak diketahui";
        const tahun = ambilNilai(buku, ["tahun", "year"]) || "Tidak diketahui";
        const isbn = ambilNilai(buku, ["isbn", "ISBN"]) || "Tidak tersedia";
        const stok = Number(ambilNilai(buku, ["stok", "stock"]) || 0);
        const harga = Number(ambilNilai(buku, ["harga", "price"]) || 0);
        const rating = Number(buku.rating || 0);
        const cover = ambilNilai(buku, ["cover", "gambar", "image"]);
        const jumlah = Number(buku.jumlah || 1);
        const item = document.createElement("div");
        item.className = "itemKeranjang";
        /* CHECKBOX */
        const cek = document.createElement("input");
        cek.type = "checkbox";
        cek.className = "cekBuku";
        cek.checked = buku.dipilih === true;
        cek.addEventListener("change", function() {
            keranjang[index].dipilih = this.checked;
            simpanKeranjang();
            tampilkanKeranjang();
            hitungTotal();
        });
        /* GAMBAR */
        const gambarBox = document.createElement("div");
        gambarBox.className = "gambarKeranjang";
        if (cover) {
            const gambar = document.createElement("img");
            gambar.src = cover;
            gambar.alt = judul;
            gambar.loading = "lazy";
            gambar.onerror = function() {
                gambarBox.textContent = "📖";
            };
            gambarBox.appendChild(gambar);
        } else {
            gambarBox.textContent = "📖";
        }
        /* DETAIL */
        const detail = document.createElement("div");
        detail.className = "detailKeranjang";
        const kategoriElement = document.createElement("p");
        kategoriElement.className = "kategoriKeranjang";
        kategoriElement.textContent = kategori;
        const judulElement = document.createElement("h3");
        judulElement.className = "judulKeranjang";
        judulElement.textContent = judul;
        const penulisElement = document.createElement("p");
        penulisElement.className = "penulisKeranjang";
        penulisElement.textContent = penulis;
        /* INFO */
        const info = document.createElement("div");
        info.className = "infoKeranjang";
        const genreElement = document.createElement("span");
        genreElement.textContent = "Genre: " + genre;
        const penerbitElement = document.createElement("span");
        penerbitElement.textContent = "Penerbit: " + penerbit;
        const tahunElement = document.createElement("span");
        tahunElement.textContent = "Tahun: " + tahun;
        const isbnElement = document.createElement("span");
        isbnElement.textContent = "ISBN: " + isbn;
        const ratingElement = document.createElement("span");
        ratingElement.className = "ratingKeranjang";
        ratingElement.textContent = "★ " + rating;
        info.appendChild(genreElement);
        info.appendChild(penerbitElement);
        info.appendChild(tahunElement);
        info.appendChild(isbnElement);
        info.appendChild(ratingElement);
        /* HARGA */
        const hargaElement = document.createElement("strong");
        hargaElement.className = "hargaKeranjang";
        hargaElement.textContent = formatHarga(harga);
        /* KONTROL JUMLAH */
        const kontrol = document.createElement("div");
        kontrol.className = "kontrolKeranjang";
        const tombolKurang = document.createElement("button");
        tombolKurang.className = "tombolJumlah";
        tombolKurang.textContent = "−";
        const jumlahElement = document.createElement("span");
        jumlahElement.className = "jumlahBuku";
        jumlahElement.textContent = jumlah;
        const tombolTambah = document.createElement("button");
        tombolTambah.className = "tombolJumlah";
        tombolTambah.textContent = "+";
        /* KURANG */
        tombolKurang.addEventListener("click", function() {
            if (keranjang[index].jumlah > 1) {
                keranjang[index].jumlah--;
            } else {
                keranjang.splice(index, 1);
            }
            simpanKeranjang();
            tampilkanKeranjang();
            hitungTotal();
        });
        /* TAMBAH */
        tombolTambah.addEventListener("click", function() {
            if (stok > 0 && keranjang[index].jumlah < stok) {
                keranjang[index].jumlah++;
                simpanKeranjang();
                tampilkanKeranjang();
                hitungTotal();
            } else if (stok > 0) {
                alert("Jumlah buku sudah mencapai stok yang tersedia.");
            }
        });
        kontrol.appendChild(tombolKurang);
        kontrol.appendChild(jumlahElement);
        kontrol.appendChild(tombolTambah);
        /* HAPUS SATU */
        const tombolHapus = document.createElement("button");
        tombolHapus.className = "tombolHapus";
        tombolHapus.textContent = "Hapus";
        tombolHapus.addEventListener("click", function() {
            keranjang.splice(index, 1);
            simpanKeranjang();
            tampilkanKeranjang();
            hitungTotal();
        });
        /* BAGIAN KANAN */
        const bagianKanan = document.createElement("div");
        bagianKanan.className = "bagianKananKeranjang";
        bagianKanan.appendChild(hargaElement);
        bagianKanan.appendChild(kontrol);
        bagianKanan.appendChild(tombolHapus);
        /* SUSUN DETAIL */
        detail.appendChild(kategoriElement);
        detail.appendChild(judulElement);
        detail.appendChild(penulisElement);
        detail.appendChild(info);
        /* SUSUN ITEM */
        item.appendChild(cek);
        item.appendChild(gambarBox);
        item.appendChild(detail);
        item.appendChild(bagianKanan);
        keranjangContainer.appendChild(item);
    });
    hitungTotal();
}
/* MENGHITUNG TOTAL */
// Di sini saya hitung jumlah buku yang dipilih, total unit, dan total harga yang nantinya masuk ke checkout.
function hitungTotal() {
    let total = 0;
    let jumlahBarang = 0;
    let jumlahUnitSemua = 0;
    keranjang.forEach(buku => {
        const harga = Number(
            ambilNilai(buku, ["harga", "price"]) || 0
        );
        const jumlah = Number(buku.jumlah || 1);
        jumlahUnitSemua += jumlah;
        if (buku.dipilih === true) {
            total += harga * jumlah;
            jumlahBarang += jumlah;
        }
    });
    if (jumlahKeranjang) {
        jumlahKeranjang.textContent = jumlahUnitSemua;
    }
    if (jumlahDipilih) {
        jumlahDipilih.textContent = jumlahBarang;
    }
    if (jumlahUnit) {
        jumlahUnit.textContent = jumlahUnitSemua;
    }
    if (totalHarga) {
        totalHarga.textContent = formatHarga(total);
    }
    if (tombolCheckout) {
        tombolCheckout.disabled = jumlahBarang === 0;
    }
    if (tombolPilihSemua && keranjang.length > 0) {
        tombolPilihSemua.checked = keranjang.every(
            buku => buku.dipilih === true
        );
    }
}
/* PILIH SEMUA */
if (tombolPilihSemua) {
    tombolPilihSemua.addEventListener("change", function() {
        keranjang.forEach(buku => {
            buku.dipilih = this.checked;
        });
        simpanKeranjang();
        tampilkanKeranjang();
        hitungTotal();
    });
}
/* HAPUS DIPILIH */
if (tombolHapusDipilih) {
    tombolHapusDipilih.addEventListener("click", function() {
        const adaYangDipilih = keranjang.some(
            buku => buku.dipilih === true
        );
        if (!adaYangDipilih) {
            alert("Pilih buku yang ingin dihapus terlebih dahulu.");
            return;
        }
        const yakin = confirm(
            "Apakah kamu yakin ingin menghapus buku yang dipilih?"
        );
        if (!yakin) return;
        keranjang = keranjang.filter(
            buku => buku.dipilih !== true
        );
        simpanKeranjang();
        tampilkanKeranjang();
        hitungTotal();
    });
}
/* HAPUS SEMUA */
if (tombolHapusSemua) {
    tombolHapusSemua.addEventListener("click", function() {
        if (keranjang.length === 0) {
            alert("Keranjang sudah kosong.");
            return;
        }
        const yakin = confirm(
            "Apakah kamu yakin ingin menghapus semua buku dari keranjang?"
        );
        if (!yakin) return;
        keranjang = [];
        simpanKeranjang();
        tampilkanKeranjang();
        hitungTotal();
    });
}
/* CHECKOUT */
if (tombolCheckout) {
    tombolCheckout.addEventListener("click", function() {
        const bukuCheckout = keranjang.filter(
            buku => buku.dipilih === true
        );
        if (bukuCheckout.length === 0) {
            alert("Pilih buku yang ingin di-checkout terlebih dahulu.");
            return;
        }
        localStorage.setItem(
            "checkoutBuku",
            JSON.stringify(bukuCheckout)
        );
        window.location.href = "checkout.html";
    });
}
/* KEMBALI */
const tombolKembali = document.getElementById("tombolKembali");
if (tombolKembali) {
    tombolKembali.addEventListener("click", function() {
        window.history.back();
    });
}
/* MODE */
const tombolMode = document.getElementById("tombolMode");
const body = document.body;
if (localStorage.getItem("theme") === "light") {
    body.classList.add("light-mode");
    if (tombolMode) {
        tombolMode.textContent = "☀";
    }
} else {
    body.classList.add("dark-mode");
    if (tombolMode) {
        tombolMode.textContent = "☾";
    }
}
if (tombolMode) {
    tombolMode.addEventListener("click", function() {
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
/* MENAMPILKAN DATA */
tampilkanKeranjang();
hitungTotal();
