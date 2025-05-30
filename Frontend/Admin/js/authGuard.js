import { getToken, setToken, clearToken } from "./tokenMemory.js";

const base_url = "https://competehub-website.et.r.appspot.com";

export async function ensureAuthenticated() {
    let token = getToken();
    
    //if there no token try refersh
    if(!token){
        try {                                                          
            const refershResponse = await fetch(`${base_url}/admin/refresh-token`, {
                method: "POST",
                credentials: "include"
            });

            if(refershResponse.ok){
                const data = await refershResponse.json();
                token = data.accessToken;
               
                setToken(token);
            }else{
                throw new error("refersh failed");
            }

        } catch (error) {
            console.warn("Authentication failed:", error);
            clearToken();
            window.location.href = "401.html"
            return null;
        }
    }

    return token;
    
}