
document.getElementById("logoutBtn").addEventListener("click", async function (){
    const base_url = "http://localhost:4000";
    try {
        const response = await fetch(`${base_url}/admin/logout`, {
            method: "POST",
            credentials: "include" // required to send the cookie
        });

        if(response.ok){
            accessToken = null;
            window.location.href = "login.html"
        }else{
            console.error("Logout failed");
        }

    } catch (error) {
        console.error("Logout error", error);
    }
    
})