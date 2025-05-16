const API_URL = "https://competehub-website.et.r.appspot.com"; 

// Jalankan kode setelah seluruh dokumen HTML selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form"); // Ambil elemen form
  const competitionSelect = document.getElementById("competition"); // Select dropdown kompetisi

  // Fungsi untuk mengambil daftar kompetisi dan menampilkan sebagai opsi dropdown
  async function loadCompetitionOptions(selectedId = null) {
    try {
      const response = await fetch(`${API_URL}/admin/api/participant/competition`);
      const { competitions } = await response.json(); // Ambil array kompetisi

      // Kosongkan isi <select> dan tambahkan opsi default
      competitionSelect.innerHTML = '<option value="">Pilih kompetisi…</option>';

      // Tambahkan setiap kompetisi ke dropdown sebagai <option>
      competitions.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id_competition;
        option.textContent = c.name;
        if (selectedId && Number(selectedId) === c.id_competition) option.selected = true;
        competitionSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Gagal memuat daftar kompetisi:", error);
      alert("Tidak dapat memuat daftar kompetisi.");
    }
  }

  // Panggil saat halaman siap
  loadCompetitionOptions();

  // Tambahkan event listener untuk saat form disubmit
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Mencegah form reload halaman

    // Ambil nilai dari form input
    const teamName = document.getElementById("teamName").value.trim();
    const captainEmail = document.getElementById("email").value.trim();
    const firstMember = document.getElementById("anggota1").value.trim();
    const secondMember = document.getElementById("anggota2").value.trim();
    const competitionId = competitionSelect.value;

    // Validasi untuk memastikan semua isian tidak kosong
    if (!teamName || !captainEmail || !firstMember || !secondMember || !competitionId) {
      alert("Harap isi semua data!");
      return;
    }

    // Susun data menjadi objek yang siap dikirim ke server
    const formData = {
          teamName,
          captainEmail,
          firstMember,
          secondMember,
          competitionId,
        };

    console.log("Data dikirim:", formData);
    console.log("typeof competition_id:", typeof formData.competitionId);  // harus 'number'

    try {
      // Kirim data ke server via POST
      const res = await fetch(`${API_URL}/admin/api/participant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),  // Konversi objek ke JSON string
      });

      const data = await res.json();  // Ambil respon dari server

      if (res.ok) {
        alert("Pendaftaran berhasil!");
        form.reset(); // Bersihkan form setelah berhasil
        loadCompetitionOptions(); // Refresh opsi kompetisi jika ada perubahan
      } else {
        alert("Gagal mendaftar: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan pada server");
    }
  });
});
