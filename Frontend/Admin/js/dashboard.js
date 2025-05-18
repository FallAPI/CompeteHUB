import { ensureAuthenticated } from './authGuard.js';

document.addEventListener("DOMContentLoaded", async() => {
    const token =  await ensureAuthenticated();
    const base_url = "https://competehub-website.et.r.appspot.com"
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


        const countResponse = await fetch(`${base_url}/admin/api/competition/total`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },

        })
        
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
        
        const participantCount = await fetch(`${base_url}/admin/api/participant/total`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if(participantCount){
            const data = await participantCount.json();
            const total = data.total;

            const countElement = document.getElementById("participantCount");
            if(countElement){
                countElement.textContent = `${total} Participant`
            }
        }else{
            console.warn("Failed to fetch participant count.");
        }

        const onGoingCount = await fetch(`${base_url}/admin/api/competition/ongoing`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        )
        if(onGoingCount){
            const data = await onGoingCount.json();
            const total = data.total;

            const countElement = document.getElementById("OnGoingCount");
            if(countElement){
                countElement.textContent = `${total} On-Going Competition`
            }
        }else{
            console.warn("Failed to fetch competition count.");
        }

        const finishedCount = await fetch(`${base_url}/admin/api/competition/finish`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        )
        if(finishedCount){
            const data = await finishedCount.json();
            const total = data.total;

            const countElement = document.getElementById("FinishedCount");
            if(countElement){
                countElement.textContent = `${total} Finished Competition`
            }
        }else{
            console.warn("Failed to fetch competition count.");
        }


    } catch (error) {
        console.error("Error loading dashboard:", error);
        window.location.href = "500.html";
    }
})