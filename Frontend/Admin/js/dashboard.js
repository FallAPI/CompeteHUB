import { ensureAuthenticated } from './authGuard.js';

document.addEventListener("DOMContentLoaded", async() => {
    const token =  await ensureAuthenticated();
    const base_url = "http://localhost:4000"
    if(!token) return;

    document.body.classList.remove('hidden');

    try {
        const response = await fetch(`${base_url}/admin/dashboard`, {
            headers: {
                  Authorization: `Bearer ${token}`,
            },
        });

        if(!response.ok){
            window.location.href = "401.html";
            return;
        };


        const countResponse = await fetch(`${base_url}/admin/api/competition/total`)
        
        if(countResponse.ok){
            const data = await countResponse.json();
            const total = data.total;

            const countElement = document.getElementById("competitionCount");
            if(countElement){
                countElement.textContent = `${total} Competition`
            }
        }else{
             console.warn("Failed to fetch competition count.");
        }
        

    } catch (error) {
        console.error("Error loading dashboard:", error);
        window.location.href = "500.html";
    }
})