/* ALUR PROGRAM SIGN IN
   Pertama saya atur mode terang/gelap dan fitur lihat/sembunyikan password.
   Saat user mengisi form, email dan password divalidasi supaya data yang masuk sesuai aturan.
   Setelah valid, data akun dicek ke Firebase.
   Kalau email dan password cocok, data user disimpan ke localStorage sebagai tanda bahwa user sudah login lalu diarahkan ke home.
*/

// MODE
// Saya ambil tema terakhir dari localStorage lalu menerapkannya ke body supaya tampilan login mengikuti pilihan user.

const tombolMode =
    document.getElementById("tombolMode");
const body =
    document.body;
function aturMode() {
    const modeTersimpan =
        localStorage.getItem("theme");
    if (modeTersimpan === "light") {
        body.classList.remove(
            "dark-mode"
        );
        body.classList.add(
            "light-mode"
        );
        tombolMode.textContent =
            "☀";
    } else {
        body.classList.remove(
            "light-mode"
        );
        body.classList.add(
            "dark-mode"
        );
        tombolMode.textContent =
            "☾";
    }
}
aturMode();
tombolMode.addEventListener(
    "click",
    () => {
        const modeSekarang =
            body.classList.contains(
                "light-mode"
            )
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
    }
);
// INPUT
// Semua input dan elemen pesan saya ambil dari HTML supaya bisa divalidasi dan diberi pesan kesalahan lewat JavaScript.

const formSignin =
    document.getElementById(
        "formSignin"
    );
const email =
    document.getElementById(
        "email"
    );
const password =
    document.getElementById(
        "password"
    );
const errorEmail =
    document.getElementById(
        "errorEmail"
    );
const errorPassword =
    document.getElementById(
        "errorPassword"
    );
const pesanSignin =
    document.getElementById(
        "pesanSignin"
    );
const tombolPassword =
    document.getElementById(
        "tombolPassword"
    );
// LIHAT PASSWORD
// Tombol ini hanya mengganti tipe input password dari tersembunyi menjadi teks, atau sebaliknya.

tombolPassword.addEventListener(
    "click",
    () => {
        if (
            password.type === "password"
        ) {
            password.type = "text";
            tombolPassword.textContent =
                "Sembunyikan";
        } else {
            password.type = "password";
            tombolPassword.textContent =
                "Lihat";
        }
    }
);
// VALIDASI EMAIL
// Email dicek mulai dari kosong atau tidak, lalu formatnya dicek memakai pola email sederhana.

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
// Password dicek supaya tidak kosong dan memenuhi panjang minimum yang sudah ditentukan.

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
    return true;
}
// VALIDASI SAAT DIKETIK
email.addEventListener(
    "input",
    validasiEmail
);
password.addEventListener(
    "input",
    validasiPassword
);
// SIGN IN
formSignin.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
        pesanSignin.textContent = "";
        const emailValid =
            validasiEmail();
        const passwordValid =
            validasiPassword();
        if (
            !emailValid ||
            !passwordValid
        ) {
            return;
        }
        // Mengambil akun hasil Sign Up
        const daftarAkun =
            JSON.parse(
                localStorage.getItem(
                    "akunBukaBuku"
                )
            ) || [];
        // Mengambil email yang digunakan untuk login
        const emailMasuk =
            email.value
                .trim()
                .toLowerCase();
        // Mencari akun berdasarkan email
        const akun =
            daftarAkun.find(
                (data) =>
                    data.email.toLowerCase() ===
                    emailMasuk
            );
        // Jika email belum terdaftar
        if (!akun) {
            pesanSignin.textContent =
                "Email belum terdaftar.";
            return;
        }
        // Mengecek password
        if (
            akun.password !==
            password.value
        ) {
            pesanSignin.textContent =
                "Password yang kamu masukkan salah.";
            return;
        }
        // Menyimpan data pengguna yang sedang login
        const penggunaLogin = {
            nama:
                akun.nama,
            email:
                akun.email
        };
        localStorage.setItem(
            "penggunaLogin",
            JSON.stringify(
                penggunaLogin
            )
        );
        // Login berhasil
        alert(
            "Sign In berhasil! Selamat datang, " +
            akun.nama +
            "."
        );
        // Masuk ke Home
        window.location.href =
            "index.html";
    }
);
