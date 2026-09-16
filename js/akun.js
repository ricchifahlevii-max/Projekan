/* ALUR PROGRAM AKUN
   Di bagian ini saya cek apakah user sudah login dari localStorage.
   Kalau sudah login, tombol Sign In/Sign Up diganti jadi info nama user + tombol Keluar.
   Saat tombol Keluar ditekan, data login dihapus lalu halaman di-refresh supaya tampilannya kembali seperti sebelum login.
*/

const tombolAkun = document.querySelector(".tombolAkun");

function tampilkanStatusAkun() {
    if (!tombolAkun) return;

    const penggunaLogin =
        JSON.parse(localStorage.getItem("penggunaLogin"));

    if (!penggunaLogin) return;

    /* Membuat pembungkus akun yang sudah login */
    const akunLogin = document.createElement("div");
    akunLogin.className = "akunLogin";

    /* Membuat ikon akun */
    const ikonAkun = document.createElement("span");
    ikonAkun.className = "ikonAkun";
    ikonAkun.textContent = "👤";

    /* Membuat nama pengguna */
    const namaPengguna = document.createElement("span");
    namaPengguna.className = "namaPengguna";
    namaPengguna.textContent = penggunaLogin.nama;

    /* Membuat tombol logout */
    const tombolLogout = document.createElement("button");
    tombolLogout.type = "button";
    tombolLogout.id = "tombolLogout";
    tombolLogout.textContent = "Keluar";

    /* Memasukkan semua elemen ke dalam akunLogin */
    akunLogin.appendChild(ikonAkun);
    akunLogin.appendChild(namaPengguna);
    akunLogin.appendChild(tombolLogout);

    /* Menghapus tampilan Sign In dan Sign Up */
    tombolAkun.replaceChildren();

    /* Menampilkan tampilan akun yang sudah login */
    tombolAkun.appendChild(akunLogin);

    /* Menjalankan proses logout saat tombol Keluar ditekan */
    tombolLogout.addEventListener("click", () => {
        localStorage.removeItem("penggunaLogin");
        window.location.reload();
    });
}

tampilkanStatusAkun();