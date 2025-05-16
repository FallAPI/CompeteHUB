// Menunggu hingga seluruh konten HTML telah dimuat sebelum menjalankan fungsi di dalamnya
document.addEventListener("DOMContentLoaded", async function () {
  // URL dari API yang menyediakan data kompetisi
  const API_URL = "https://competehub-website.et.r.appspot.com"; 
  // Mengambil elemen HTML dengan id "kompetisi-container", tempat menampilkan data kompetisi
  const container = document.getElementById("kompetisi-container");

  try {
    // Mengambil data kompetisi dari endpoint API secara asynchronous menggunakan fetch
    const res = await fetch(`${API_URL}/admin/api/competition`);
    // Jika response dari fetch tidak OK (misalnya 404, 500), maka lempar error
    if (!res.ok) throw new Error("Gagal mengambil data kompetisi.");

     // Mengambil data kompetisi dari JSON response API
    const { competetions } = await res.json(); // pastikan ini sesuai struktur response API

     // Loop untuk setiap item kompetisi dalam array
    competetions.forEach((item, index) => {
       // Membuat elemen div baru sebagai card kompetisi
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";
       // Mengisi konten HTML dari card yang menampilkan nama, deskripsi, dan tombol detail
      card.innerHTML = `
        <div class="card h-100 shadow-sm" style="background-color: ${index % 2 === 0 ? "#eaf4fc" : "#ffffff"};">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">${item.description}</p>
            <a href="detail-kompetisi.html?id=${item.id_competition}" class="btn btn-primary">Lihat Detail</a>
          </div>
        </div>
      `;
        // Menambahkan card ke dalam container di halaman
      container.appendChild(card);
    });

  } catch (err) {
     // Jika terjadi error, tampilkan pesan kesalahan ke user
    container.innerHTML = `<p class="text-danger">Terjadi kesalahan saat memuat data kompetisi.</p>`;
    console.error(err); // Log error ke konsol untuk debugging
  }
});
