    let accessToken = null;

    document.addEventListener("DOMContentLoaded", function(){
        const base_url = "https://competehub-website.et.r.appspot.com";
        const loginForm = document.getElementById("loginForm");
        const errorBox = document.getElementById("error-message");

        loginForm.addEventListener('submit', async function(event){
            event.preventDefault();

            const email = document.getElementById("inputEmail").value.trim().toLowerCase();
            const password = document.getElementById("inputPassword").value.trim();

            //reset error message
            errorBox.classList.add('d-none')
            errorBox.textContent = "";

            // validate the email and password must been filled
            if(!email || !password){
                showError("Please enter both email and password.");
                return;
            }

            try {
                const response = await fetch(`${base_url}/admin/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({email, password}),
                    credentials: 'include'
                });

                const data = await response.json();
                
                if(response.ok){
                    accessToken = data.token;
                    console.log("Received accessToken:", accessToken);

                    window.location.href = "dashboard.html"
                }else{
                    showError("Login failed.");
                }
            } catch (error) {
                console.error("login error: ", error);
                showError("Something went wrong. Please try again later.");
            }
        });

        function showError(message){
            errorBox.textContent = message;
            errorBox.classList.remove("d-none")
        }

    })
