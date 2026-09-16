/* ALUR PROGRAM HOME
   Di halaman home saya atur menu responsive, mode terang/gelap, dan header saat scroll.
   Setelah itu data buku diambil dari Firebase dan diubah ke bentuk array supaya gampang diproses.
   Data kemudian dipilih berdasarkan judul atau kategori untuk mengisi bagian buku pilihan dan slider.
   Setiap buku dibuat menjadi kartu yang bisa dibuka ke halaman detail.
*/

// Tombol menu
const tombolMenu = document.getElementById("tombolMenu");
const navigasi = document.getElementById("navigasi");
tombolMenu.addEventListener("click", () => {
    navigasi.classList.toggle("aktif");
    tombolMenu.classList.toggle("aktif");
    const menuTerbuka = navigasi.classList.contains("aktif");
    tombolMenu.setAttribute("aria-expanded", menuTerbuka ? "true" : "false");
});
// Menutup menu setelah memilih halaman
const semuaLinkMenu = navigasi.querySelectorAll("a");
semuaLinkMenu.forEach((link) => {
    link.addEventListener("click", () => {
        navigasi.classList.remove("aktif");
        tombolMenu.classList.remove("aktif");
        tombolMenu.setAttribute("aria-expanded", "false");
    });
});
// Menutup menu jika klik di luar navbar
document.addEventListener("click", (event) => {
    if (!event.target.closest(".header")) {
        navigasi.classList.remove("aktif");
        tombolMenu.classList.remove("aktif");
        tombolMenu.setAttribute("aria-expanded", "false");
    }
});
// Menutup menu saat kembali ke ukuran layar besar
window.addEventListener("resize", () => {
    if (window.innerWidth > 1000) {
        navigasi.classList.remove("aktif");
        tombolMenu.classList.remove("aktif");
        tombolMenu.setAttribute("aria-expanded", "false");
    }
});
// Tombol mode
const tombolMode = document.getElementById("tombolMode");
const body = document.body;
if (localStorage.getItem("theme") === "light") {
    body.classList.add("light-mode");
    tombolMode.textContent = "☀";
} else {
    body.classList.add("dark-mode");
    tombolMode.textContent = "☾";
}
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
// Header saat scroll
const header = document.querySelector(".header");
window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});
// Data buku
const alamatAPI = "https://api--bukuuu-default-rtdb.firebaseio.com/.json";
const elemenHero = {
    judul: document.getElementById("judulHero"),
    deskripsi: document.getElementById("deskripsiHero"),
    penulis: document.getElementById("penulisHero"),
    genre: document.getElementById("genreHero"),
    rating: document.getElementById("ratingHero"),
    cover: document.getElementById("coverHero"),
    lapisanSatu: document.getElementById("lapisanSatu"),
    lapisanDua: document.getElementById("lapisanDua"),
    tombolDetail: document.getElementById("tombolDetailHero")
};
let semuaBuku = [];
// Buku untuk baris "Buku Pilihan Untukmu"
const bukuPilihan = [
    "spy x family",
    "atlas of the heart",
    "django for beginners",
    "jujutsu kaisen vol 6",
    "chainsaw man vol 5",
    "encyclopedia of space",
    "atomic habits",
    "sirkus pohon",
    "laut bercerita",
    "sapiens"
];
// Baris slider berdasarkan kategori
const daftarKategoriSlider = [
    {
        id: "daftarBukuNovel",
        kataKunci: ["novel", "fiksi", "fiction"]
    },
    {
        id: "daftarBukuPendidikan",
        kataKunci: [
            "pendidikan",
            "edukasi",
            "education",
            "pengetahuan",
            "knowledge",
            "belajar",
            "akademik",
            "referensi",
            "textbook"
        ]
    },
    {
        id: "daftarBukuTeknologi",
        kataKunci: [
            "teknologi",
            "technology",
            "programming",
            "coding",
            "developer",
            "software",
            "komputer",
            "computer",
            "tech"
        ]
    },
    {
        id: "daftarBukuSains",
        kataKunci: [
            "sains",
            "science",
            "fisika",
            "physics",
            "kimia",
            "chemistry",
            "biologi",
            "biology",
            "astronomi",
            "astronomy",
            "space",
            "matematika",
            "math"
        ]
    },
    {
        id: "daftarBukuKomik",
        kataKunci: [
            "komik",
            "manga",
            "comic",
            "graphic novel"
        ]
    }
];
// Mengosongkan sebuah elemen tanpa innerHTML
// Fungsi ini membersihkan isi elemen sebelum saya memasukkan data atau tampilan baru.
function kosongkanElemen(elemen) {
    while (elemen.firstChild) {
        elemen.removeChild(elemen.firstChild);
    }
}
// Mengambil nilai data
// Fungsi ini mencari field yang tersedia agar data dengan nama property berbeda tetap bisa dipakai.
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
// Mengubah data Firebase menjadi array
// Data dari Firebase saya ubah menjadi array supaya proses pencarian dan pemilihan buku lebih mudah.
function ambilData(data) {
    if (!data) return [];
    if (Array.isArray(data)) {
        return data.map((buku, index) => ({
            ...buku,
            id:
                buku.id !== undefined && buku.id !== null
                    ? buku.id
                    : index
        }));
    }
    return Object.keys(data).map((id) => ({
        ...data[id],
        id
    }));
}
// Mencari buku berdasarkan judul
// Fungsi ini mencari satu buku berdasarkan nama/judul yang paling sesuai dari data yang tersedia.
function cariBuku(data, nama) {
    return data.find((buku) => {
        const judul = ambilNilai(buku, ["judul", "title"])
            .toString()
            .toLowerCase();
        return judul.includes(nama.toLowerCase());
    });
}
// Mencari buku pilihan Spy x Family untuk hero
// Di sini saya menentukan buku utama yang akan dipakai untuk bagian hero/detail unggulan di home.
function cariBukuUtama(data) {
    return cariBuku(data, "spy x family");
}
// Menampilkan buku pilihan di hero
// Fungsi ini menampilkan satu buku pilihan beserta informasi dan efek background yang dipakai di bagian tersebut.
function tampilkanBukuPilihan(buku) {
    const el = elemenHero;
    kosongkanElemen(el.cover);
    if (!buku) {
        el.judul.textContent = "Buku tidak ditemukan";
        el.deskripsi.textContent = "Data buku pilihan tidak tersedia.";
        el.penulis.textContent = "-";
        el.genre.textContent = "-";
        el.rating.textContent = "-";
        const ikonKosong = document.createElement("span");
        ikonKosong.textContent = "📖";
        el.cover.appendChild(ikonKosong);
        el.lapisanSatu.style.backgroundImage = "";
        el.lapisanDua.style.backgroundImage = "";
        return;
    }
    const judul =
        ambilNilai(buku, ["judul", "title"]) || "Tanpa Judul";
    const penulis =
        ambilNilai(buku, ["penulis", "author"]) || "Tidak diketahui";
    const genre =
        ambilNilai(buku, ["genre"]) || "Tidak ada genre";
    const rating =
        Number(ambilNilai(buku, ["rating"]) || 0);
    const cover =
        ambilNilai(buku, ["cover", "gambar", "image"]);
    const deskripsi =
        ambilNilai(buku, ["deskripsi", "description"]) ||
        "Temukan buku menarik untuk menemani waktu membacamu.";
    el.judul.textContent = judul;
    el.deskripsi.textContent = deskripsi;
    el.penulis.textContent = penulis;
    el.genre.textContent = genre;
    el.rating.textContent = rating;
    el.tombolDetail.href = "detail.html?id=" + buku.id;
    if (cover) {
        const gambar = document.createElement("img");
        gambar.src = cover;
        gambar.alt = judul;
        gambar.onload = () => {
            el.lapisanSatu.style.backgroundImage =
                "url('" + cover + "')";
            el.lapisanDua.style.backgroundImage =
                "url('" + cover + "')";
            document.documentElement.style.setProperty(
                "--gambarHero",
                "url('" + cover + "')"
            );
        };
        gambar.onerror = () => {
            kosongkanElemen(el.cover);
            const ikon = document.createElement("span");
            ikon.textContent = "📖";
            el.cover.appendChild(ikon);
            el.lapisanSatu.style.backgroundImage = "";
            el.lapisanDua.style.backgroundImage = "";
            document.documentElement.style.setProperty(
                "--gambarHero",
                "none"
            );
        };
        el.cover.appendChild(gambar);
        el.lapisanSatu.style.backgroundImage =
            "url('" + cover + "')";
        el.lapisanDua.style.backgroundImage =
            "url('" + cover + "')";
        document.documentElement.style.setProperty(
            "--gambarHero",
            "url('" + cover + "')"
        );
    } else {
        const ikon = document.createElement("span");
        ikon.textContent = "📖";
        el.cover.appendChild(ikon);
        el.lapisanSatu.style.backgroundImage = "";
        el.lapisanDua.style.backgroundImage = "";
        document.documentElement.style.setProperty(
            "--gambarHero",
            "none"
        );
    }
}
// Membuat satu kartu buku
// Setiap data buku dibuat menjadi satu kartu HTML agar bisa ditampilkan di slider/katalog home.
function buatKartuBuku(buku) {
    const judul =
        ambilNilai(buku, ["judul", "title"]) || "Tanpa Judul";
    const penulis =
        ambilNilai(buku, ["penulis", "author"]) || "Tidak diketahui";
    const kategori =
        ambilNilai(buku, ["kategori", "category"]) ||
        "Tidak ada kategori";
    const cover =
        ambilNilai(buku, ["cover", "gambar", "image"]);
    const harga =
        Number(ambilNilai(buku, ["harga", "price"]) || 0);
    const rating =
        Number(ambilNilai(buku, ["rating"]) || 0);
    if (!cover) return null;
    const kartu = document.createElement("div");
    kartu.className = "kartuBuku";
    const gambarBuku = document.createElement("div");
    gambarBuku.className = "gambarBuku";
    const gambar = document.createElement("img");
    gambar.src = cover;
    gambar.alt = judul;
    gambar.draggable = false;
    gambar.onerror = () => {
        kartu.remove();
    };
    gambarBuku.appendChild(gambar);
    const infoBuku = document.createElement("div");
    infoBuku.className = "infoBuku";
    const teksKategori = document.createElement("p");
    teksKategori.className = "kategoriBuku";
    teksKategori.textContent = kategori;
    const namaBuku = document.createElement("h3");
    namaBuku.className = "namaBuku";
    namaBuku.textContent = judul;
    const teksPenulis = document.createElement("p");
    teksPenulis.className = "penulisBuku";
    teksPenulis.textContent = penulis;
    const teksRating = document.createElement("p");
    teksRating.className = "ratingBuku";
    teksRating.textContent = "★ " + rating;
    const teksHarga = document.createElement("p");
    teksHarga.className = "hargaBuku";
    teksHarga.textContent =
        "Rp " + harga.toLocaleString("id-ID");
    const tombolDetail = document.createElement("a");
    tombolDetail.className = "tombolDetail";
    tombolDetail.href = "detail.html?id=" + buku.id;
    tombolDetail.textContent = "Lihat Detail";
    infoBuku.appendChild(teksKategori);
    infoBuku.appendChild(namaBuku);
    infoBuku.appendChild(teksPenulis);
    infoBuku.appendChild(teksRating);
    infoBuku.appendChild(teksHarga);
    infoBuku.appendChild(tombolDetail);
    kartu.appendChild(gambarBuku);
    kartu.appendChild(infoBuku);
    return kartu;
}
// Memilih buku berdasarkan daftar judul
// Saya pilih buku berdasarkan daftar judul yang sudah ditentukan supaya isi slider sesuai kategori yang saya inginkan.
function pilihBukuBerdasarkanJudul(data, daftarJudul) {
    const pilihan = [];
    daftarJudul.forEach((nama) => {
        const buku = cariBuku(data, nama);
        if (!buku) return;
        const sudahAda = pilihan.some(
            (item) => item.id === buku.id
        );
        const cover =
            ambilNilai(buku, ["cover", "gambar", "image"]);
        if (!sudahAda && cover) {
            pilihan.push(buku);
        }
    });
    return pilihan;
}
// Mengecek kata kunci
function cocokKataKunci(buku, daftarKataKunci) {
    const teksBuku = [
        ambilNilai(buku, ["kategori", "category"]),
        ambilNilai(buku, ["genre"]),
        ambilNilai(buku, ["judul", "title"])
    ]
        .join(" ")
        .toString()
        .toLowerCase();
    return daftarKataKunci.some((kata) =>
        teksBuku.includes(kata.toLowerCase())
    );
}
// Memilih buku berdasarkan kategori
// Kalau pencarian berdasarkan judul tidak dipakai, saya bisa memilih buku berdasarkan kata kunci kategori atau genre.
function pilihBukuBerdasarkanKategori(data, daftarKataKunci) {
    return data
        .filter((buku) => {
            const cover =
                ambilNilai(buku, ["cover", "gambar", "image"]);
            return (
                cover &&
                cocokKataKunci(buku, daftarKataKunci)
            );
        })
        .slice(0, 10);
}
// Menambahkan satu set kartu buku
// Fungsi ini memasukkan satu set kartu ke container slider.
function tambahSetKartu(container, pilihan) {
    pilihan.forEach((buku) => {
        const kartu = buatKartuBuku(buku);
        if (kartu) {
            container.appendChild(kartu);
        }
    });
}
// Menampilkan slider
// Fungsi ini menyiapkan isi slider dan menjalankan pengaturan slider untuk daftar buku yang dipilih.
function tampilkanSliderBuku(container, pilihan) {
    if (!container) return;
    kosongkanElemen(container);
    if (pilihan.length === 0) {
        const pesan = document.createElement("p");
        pesan.className = "pesan";
        pesan.textContent = "Buku tidak tersedia.";
        container.appendChild(pesan);
        return;
    }
    tambahSetKartu(container, pilihan);
    tambahSetKartu(container, pilihan);
    aktifkanSlider(container, pilihan);
}
// Mengaktifkan slider
// Di sini saya atur logika geser slider, tombol berikutnya/sebelumnya, dan gerakan pointer di layar.
function aktifkanSlider(container, pilihan) {
    const state = {
        posisi: 0,
        sedangGeser: false,
        posisiAwal: 0,
        posisiTerakhir: 0,
        lebarSatuSet: 0,
        lebarPutaran: 0,
        waktuTerakhir: 0
    };
    let jumlahSet = 2;
    function hitungLebarPutaran() {
        const kartu =
            container.querySelector(".kartuBuku");
        if (!kartu) return;
        const jarak = 22;
        state.lebarSatuSet =
            (kartu.offsetWidth + jarak) *
            pilihan.length;
        state.lebarPutaran =
            state.lebarSatuSet;
        if (state.lebarSatuSet <= 0) return;
        const wadah = container.parentElement;
        const lebarWadah =
            wadah
                ? wadah.clientWidth
                : window.innerWidth;
        while (
            jumlahSet * state.lebarSatuSet <
            lebarWadah + state.lebarSatuSet
        ) {
            tambahSetKartu(container, pilihan);
            jumlahSet++;
        }
    }
    function jalankanSlider(waktu) {
        const selisihWaktu =
            waktu - state.waktuTerakhir;
        state.waktuTerakhir = waktu;
        if (
            !state.sedangGeser &&
            state.lebarPutaran > 0
        ) {
            state.posisi -=
                selisihWaktu * 0.035;
            if (
                Math.abs(state.posisi) >=
                state.lebarPutaran
            ) {
                state.posisi +=
                    state.lebarPutaran;
            }
        }
        container.style.transform =
            "translateX(" +
            state.posisi +
            "px)";
        requestAnimationFrame(jalankanSlider);
    }
    requestAnimationFrame(() => {
        hitungLebarPutaran();
        state.waktuTerakhir =
            performance.now();
        requestAnimationFrame(jalankanSlider);
    });
    window.addEventListener(
        "resize",
        hitungLebarPutaran
    );
    const AMBANG_GESER = 6;
    let pointerAktif = false;
    let sudahGeser = false;
    let blokKlikBerikutnya = false;
    container.addEventListener(
        "pointerdown",
        (event) => {
            pointerAktif = true;
            sudahGeser = false;
            state.posisiAwal =
                event.clientX;
            state.posisiTerakhir =
                state.posisi;
        }
    );
    container.addEventListener(
        "pointermove",
        (event) => {
            if (!pointerAktif) return;
            const jarak =
                event.clientX -
                state.posisiAwal;
            if (!sudahGeser) {
                if (
                    Math.abs(jarak) <
                    AMBANG_GESER
                ) {
                    return;
                }
                sudahGeser = true;
                state.sedangGeser = true;
                container.classList.add(
                    "sedangGeser"
                );
                try {
                    container.setPointerCapture(
                        event.pointerId
                    );
                } catch (error) {
                }
            }
            state.posisi =
                state.posisiTerakhir +
                jarak;
            if (state.lebarPutaran > 0) {
                while (
                    state.posisi > 0
                ) {
                    state.posisi -=
                        state.lebarPutaran;
                    state.posisiTerakhir -=
                        state.lebarPutaran;
                }
                while (
                    state.posisi <
                    -state.lebarPutaran
                ) {
                    state.posisi +=
                        state.lebarPutaran;
                    state.posisiTerakhir +=
                        state.lebarPutaran;
                }
            }
            container.style.transform =
                "translateX(" +
                state.posisi +
                "px)";
        }
    );
    function selesaiGeser(event) {
        pointerAktif = false;
        if (sudahGeser) {
            blokKlikBerikutnya = true;
        }
        sudahGeser = false;
        state.sedangGeser = false;
        container.classList.remove(
            "sedangGeser"
        );
        if (
            event.pointerId !== undefined
        ) {
            try {
                container.releasePointerCapture(
                    event.pointerId
                );
            } catch (error) {
            }
        }
        state.posisiTerakhir =
            state.posisi;
        state.waktuTerakhir =
            performance.now();
    }
    container.addEventListener(
        "pointerup",
        selesaiGeser
    );
    container.addEventListener(
        "pointercancel",
        selesaiGeser
    );
    container.addEventListener(
        "click",
        (event) => {
            if (blokKlikBerikutnya) {
                event.preventDefault();
                event.stopPropagation();
                blokKlikBerikutnya = false;
            }
        },
        true
    );
    container.addEventListener(
        "dragstart",
        (event) => {
            event.preventDefault();
        }
    );
}
// Menampilkan seluruh slider
// Fungsi ini mengatur semua bagian slider di home berdasarkan data buku dari Firebase.
function tampilkanSemuaSlider(data) {
    const containerUtama =
        document.getElementById("daftarBuku");
    const pilihanUtama =
        pilihBukuBerdasarkanJudul(
            data,
            bukuPilihan
        );
    tampilkanSliderBuku(
        containerUtama,
        pilihanUtama
    );
    daftarKategoriSlider.forEach((item) => {
        const container =
            document.getElementById(item.id);
        const pilihanKategori =
            pilihBukuBerdasarkanKategori(
                data,
                item.kataKunci
            );
        tampilkanSliderBuku(
            container,
            pilihanKategori
        );
    });
}
// Menampilkan pesan gagal
// Kalau data Firebase gagal diambil, saya tampilkan pesan yang memberi tahu user bahwa data belum berhasil dimuat.
function tampilkanGagalMuat() {
    const semuaContainer = [
        document.getElementById("daftarBuku"),
        ...daftarKategoriSlider.map(
            (item) =>
                document.getElementById(item.id)
        )
    ];
    semuaContainer.forEach((container) => {
        if (!container) return;
        kosongkanElemen(container);
        const pesan =
            document.createElement("p");
        pesan.className = "pesan";
        pesan.textContent =
            "Data buku gagal dimuat.";
        container.appendChild(pesan);
    });
}
// Mengambil data Firebase
fetch(alamatAPI)
    .then((respon) => respon.json())
    .then((data) => {
        semuaBuku = ambilData(data);
        const bukuUtama =
            cariBukuUtama(semuaBuku);
        tampilkanBukuPilihan(
            bukuUtama
        );
        tampilkanSemuaSlider(
            semuaBuku
        );
    })
    .catch((error) => {
        console.error(
            "Gagal mengambil data:",
            error
        );
        elemenHero.judul.textContent =
            "Buku gagal dimuat";
        elemenHero.deskripsi.textContent =
            "Data buku tidak dapat diambil dari server.";
        elemenHero.penulis.textContent = "-";
        elemenHero.genre.textContent = "-";
        elemenHero.rating.textContent = "-";
        tampilkanGagalMuat();
    });
