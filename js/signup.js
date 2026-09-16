/* ALUR PROGRAM SIGN UP
   Pertama saya atur mode terang/gelap dan fitur lihat/sembunyikan password.
   Semua input seperti nama, email, password, dan konfirmasi password divalidasi satu per satu.
   Kalau semua data benar, akun baru dicek dulu supaya email yang sama tidak dibuat lagi.
   Setelah berhasil, data akun disimpan ke Firebase lalu user diarahkan ke halaman Sign In.
*/

// MODE
// Tema terakhir dari localStorage saya pakai lagi supaya halaman daftar akun tetap mengikuti pilihan user.

const tombolMode = document.getElementById("tombolMode");
const body = document.body;
function aturMode() {
    const modeTersimpan = localStorage.getItem("theme");
    if (modeTersimpan === "light") {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        tombolMode.textContent = "☀";
    } else {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        tombolMode.textContent = "☾";
    }
}
aturMode();
tombolMode.addEventListener("click", () => {
    const modeSekarang =
        body.classList.contains("light-mode")
            ? "light"
            : "dark";
    const modeBaru =
        modeSekarang === "light"
            ? "dark"
            : "light";
    localStorage.setItem(
        "theme",
        modeBaru
    );
    aturMode();
});
// INPUT
// Semua input form dan tempat pesan error saya ambil dari HTML agar bisa saya kontrol lewat JavaScript.

const formSignup =
    document.getElementById("formSignup");
const nama =
    document.getElementById("nama");
const email =
    document.getElementById("email");
const password =
    document.getElementById("password");
const konfirmasiPassword =
    document.getElementById("konfirmasiPassword");
const errorNama =
    document.getElementById("errorNama");
const errorEmail =
    document.getElementById("errorEmail");
const errorPassword =
    document.getElementById("errorPassword");
const errorKonfirmasi =
    document.getElementById("errorKonfirmasi");
const pesanSignup =
    document.getElementById("pesanSignup");
const tombolPassword =
    document.getElementById("tombolPassword");
// LIHAT PASSWORD
// Tombol ini dipakai untuk melihat atau menyembunyikan isi password tanpa mengubah nilainya.

tombolPassword.addEventListener("click", () => {
    if (password.type === "password") {
        password.type = "text";
        tombolPassword.textContent =
            "Sembunyikan";
    } else {
        password.type = "password";
        tombolPassword.textContent =
            "Lihat";
    }
});
// VALIDASI NAMA
// Nama wajib diisi dan minimal 3 karakter supaya data akun tidak terlalu pendek.

function validasiNama() {
    const nilai =
        nama.value.trim();
    errorNama.textContent = "";
    nama.classList.remove(
        "inputSalah"
    );
    if (nilai === "") {
        errorNama.textContent =
            "Nama lengkap wajib diisi.";
        nama.classList.add(
            "inputSalah"
        );
        return false;
    }
    if (nilai.length < 3) {
        errorNama.textContent =
            "Nama minimal 3 karakter.";
        nama.classList.add(
            "inputSalah"
        );
        return false;
    }
    return true;
}
// VALIDASI EMAIL
// Email dicek dari kosong atau tidak, kemudian formatnya dicek memakai pola email.

function validasiEmail() {
    const nilai =
        email.value.trim();
    errorEmail.textContent = "";
    email.classList.remove(
        "inputSalah"
    );
    if (nilai === "") {
        errorEmail.textContent =
            "Email wajib diisi.";
        email.classList.add(
            "inputSalah"
        );
        return false;
    }
    const polaEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!polaEmail.test(nilai)) {
        errorEmail.textContent =
            "Format email tidak valid.";
        email.classList.add(
            "inputSalah"
        );
        return false;
    }
    return true;
}
// VALIDASI PASSWORD
// Password dicek satu per satu: panjangnya, huruf besar, huruf kecil, dan angka harus sesuai aturan.

function validasiPassword() {
    const nilai =
        password.value;
    errorPassword.textContent = "";
    password.classList.remove(
        "inputSalah"
    );
    if (nilai === "") {
        errorPassword.textContent =
            "Password wajib diisi.";
        password.classList.add(
            "inputSalah"
        );
        return false;
    }
    if (nilai.length < 8) {
        errorPassword.textContent =
            "Password minimal 8 karakter.";
        password.classList.add(
            "inputSalah"
        );
        return false;
    }
    if (!/[A-Z]/.test(nilai)) {
        errorPassword.textContent =
            "Password harus memiliki huruf besar.";
        password.classList.add(
            "inputSalah"
        );
        return false;
    }
    if (!/[a-z]/.test(nilai)) {
        errorPassword.textContent =
            "Password harus memiliki huruf kecil.";
        password.classList.add(
            "inputSalah"
        );
        return false;
    }
    if (!/[0-9]/.test(nilai)) {
        errorPassword.textContent =
            "Password harus memiliki angka.";
        password.classList.add(
            "inputSalah"
        );
        return false;
    }
    return true;
}
// VALIDASI KONFIRMASI PASSWORD
// Saya bandingkan password dan konfirmasi password supaya keduanya benar-benar sama sebelum akun dibuat.

function validasiKonfirmasi() {
    const nilai =
        konfirmasiPassword.value;
    errorKonfirmasi.textContent = "";
    konfirmasiPassword.classList.remove(
        "inputSalah"
    );
    if (nilai === "") {
        errorKonfirmasi.textContent =
            "Konfirmasi password wajib diisi.";
        konfirmasiPassword.classList.add(
            "inputSalah"
        );
        return false;
    }
    if (nilai !== password.value) {
        errorKonfirmasi.textContent =
            "Password tidak sama.";
        konfirmasiPassword.classList.add(
            "inputSalah"
        );
        return false;
    }
    return true;
}
// VALIDASI SAAT DIKETIK
nama.addEventListener(
    "input",
    validasiNama
);
email.addEventListener(
    "input",
    validasiEmail
);
password.addEventListener(
    "input",
    () => {
        validasiPassword();
        if (
            konfirmasiPassword.value !== ""
        ) {
            validasiKonfirmasi();
        }
    }
);
konfirmasiPassword.addEventListener(
    "input",
    validasiKonfirmasi
);
// SIGN UP
formSignup.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
        pesanSignup.textContent = "";
        const namaValid =
            validasiNama();
        const emailValid =
            validasiEmail();
        const passwordValid =
            validasiPassword();
        const konfirmasiValid =
            validasiKonfirmasi();
        if (
            !namaValid ||
            !emailValid ||
            !passwordValid ||
            !konfirmasiValid
        ) {
            return;
        }
        // Mengambil akun yang sudah tersimpan
        const daftarAkun =
            JSON.parse(
                localStorage.getItem(
                    "akunBukaBuku"
                )
            ) || [];
        // Mengambil email baru
        const emailBaru =
            email.value
                .trim()
                .toLowerCase();
        // Mengecek apakah email sudah digunakan
        const akunSudahAda =
            daftarAkun.some(
                (data) =>
                    data.email.toLowerCase() ===
                    emailBaru
            );
        if (akunSudahAda) {
            errorEmail.textContent =
                "Email sudah terdaftar.";
            email.classList.add(
                "inputSalah"
            );
            return;
        }
        // Membuat akun baru
        const akunBaru = {
            nama:
                nama.value.trim(),
            email:
                emailBaru,
            password:
                password.value
        };
        // Menambahkan akun ke daftar
        daftarAkun.push(
            akunBaru
        );
        // Menyimpan semua akun
        localStorage.setItem(
            "akunBukaBuku",
            JSON.stringify(
                daftarAkun
            )
        );
        // Berhasil daftar
        alert(
            "Akun berhasil dibuat! Silakan Sign In."
        );
        // Pindah ke halaman Sign In
        window.location.href =
            "signin.html";
    }
);
