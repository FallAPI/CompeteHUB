
document.addEventListener("DOMContentLoaded", async() => {
    const token = localStorage.getItem("token");
    const logoutBtn = document.getElementById("logoutBtn");
    if(logoutBtn){
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.href = "login.html"
        })
    }

    const base_url = "http://localhost:4000"

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