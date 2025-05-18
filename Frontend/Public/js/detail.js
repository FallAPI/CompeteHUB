// Menjalankan kode saat seluruh konten HTML telah dimuat
document.addEventListener("DOMContentLoaded", async () => {
  // URL dasar untuk API
  const API_URL = "https://competehub-website.et.r.appspot.com";
   // Mengambil parameter "id" dari URL (contoh: detail-kompetisi.html?id=123)
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  // Ambil elemen container dari HTML untuk menampilkan isi detail kompetisi
  const container = document.querySelector(".container");

  // Jika tidak ada ID di URL, tampilkan pesan error
  if (!id) {
    container.innerHTML = `<p class="text-danger">ID kompetisi tidak ditemukan di URL.</p>`;
    return; // Hentikan eksekusi jika tidak ada ID
  }

  try {
    // Mengambil data detail kompetisi dari API sesuai ID
    const res = await fetch(`${API_URL}/public/api/competition/${id}`);
    // Kalau responsenya tidak OK (gagal), lempar error
    if (!res.ok) throw new Error("Gagal mengambil detail kompetisi.");

     // Ambil data dari response JSON
    const data = await res.json();
    const competition = data.competition; // Ambil objek kompetisi dari response

    // Menampilkan data kompetisi ke halaman HTML
    container.innerHTML = `
      <h2>${competition.name}</h2>
    <p class="text-muted">Deadline: ${competition.endDate ? formatDate(competition.endDate) : "Tidak ditentukan"}</p>

      <div class="mb-4">
        <h5>Deskripsi</h5>
        <p>${competition.description}</p>
      </div>

      <a href="daftar.html" class="btn btn-success">Daftar Sekarang</a>
    `;
  } catch (err) {
    // Jika ada error saat fetch, tampilkan pesan error ke pengguna
    console.error(err);
    container.innerHTML = `<p class="text-danger">Terjadi kesalahan saat memuat detail kompetisi.</p>`;
  }

  // Fungsi bantu untuk mengubah format tanggal ISO menjadi format lokal Indonesia
  function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

});
