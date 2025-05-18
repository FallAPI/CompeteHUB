const max_items = 6;
const API_URL = "https://competehub-website.et.r.appspot.com"; 
const item_per_slide = 3;

async function fetchData() {
    try {
        const response = await fetch(`${API_URL}/public/api/competition`);
        const data = await response.json();
        const limitedData = data.competetions.slice(0, max_items);

        const carouselContainer = document.getElementById("kompetisiCarouselInner");
        carouselContainer.textContent = ""; // Clear existing content
        for (let i = 0; i < limitedData.length; i += item_per_slide) {
            const competitionGroup = limitedData.slice(i, i + item_per_slide);
            const isActive = i === 0 ? "active" : "";
            const rowHTML = competitionGroup.map(comp => `
                <div class="col-md-4">
                  <div class="card h-100">
                    <div class="card-body">
                      <h5 class="card-title">${comp.name}</h5>
                      <p class="card-text">${comp.description}</p>
                      <a href="detail-kompetisi.html?id=${comp.id_competition}" class="btn btn-primary">Lihat Detail</a>
                    </div>
                  </div>
                </div>
              `).join('');
            
              const slideHTML = `
                <div class="carousel-item ${isActive}">
                  <div class="row">
                    ${rowHTML}
                  </div>
                </div>
              `;

              carouselContainer.insertAdjacentHTML("beforeend", slideHTML);
        }
    } catch (error) {
        console.error('Failed to load competitions:', error);
    }
}

 async function fetchStatistik() {
    try {
        const [responseKompetisi, responseTeam] = await Promise.all([
            fetch(`${API_URL}/public/api/competition/total`),
            fetch(`${API_URL}/public/api/participant/total`)
        ]);

        const dataKompetisi = await responseKompetisi.json();
        const dataTeam = await responseTeam.json();


        document.getElementById("stat-kompetisi").textContent = dataKompetisi.total;
        document.getElementById("stat-team").textContent = dataTeam.total;
    } catch (error) {
        console.error('Gagal mengambil data statistics:', error);
    }
    
 }

document.addEventListener('DOMContentLoaded', fetchStatistik);
document.addEventListener('DOMContentLoaded', fetchData);