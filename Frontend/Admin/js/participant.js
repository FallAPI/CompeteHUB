const API_URL = "http://localhost:4000";
let dataTable = null;

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#ParticipantTable tbody");

    document.addEventListener("click", async (e) =>{
        if(e.target.classList.contains("delete-btn")){
            handleDelete(e)
        }

        //catch the value
        if(e.target.classList.contains("update-btn")){
            const button = e.target;

            const id = button.dataset.id;
            const teamName = button.dataset.name;
            const email = button.dataset.email;
            const first = button.dataset.first;
            const second = button.dataset.second;
            const competitionId = button.dataset.competitionId;
            const competitionName = button.dataset.competitionName;

            //isi data yg ditangkap ke modal
            document.getElementById("updateParticipanId").value = id;
            document.getElementById("updateTeamName").value = teamName;
            document.getElementById("updateEmail").value = email;
            document.getElementById("updatefirstMember").value = first;
            document.getElementById("updateSecondMember").value = second;
            
            await loadCompetetionOptions(competitionId);

            const updateModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("updateModal"));
            updateModal.show();
        }
    });


    async function fetchData() {
        try {
            const res = await fetch(`${API_URL}/admin/api/participant`);
            if(!res) throw new Error("Failed to fetch data");

            const data = await res.json();
            console.log(data);

            if(Array.isArray(data.participant)){
               renderTable(data.participant);
               if(!dataTable) initializeDataTable();
               else dataTable.refresh();
            }else{
                console.error("Competetions data is not an array:", data);
                tableBody.innerHTML = `<tr><td colspan="6" class="text-danger text-center">No competitions found</td></tr>`;
            }
        } catch (error) {
            console.error("Error:", error);
            tableBody.innerHTML = `<tr><td colspan="6" class="text-danger text-center">Error loading data</td></tr>`;
        }
    };

    function renderTable(participant){
        tableBody.textContent = "";
        participant.forEach(item => {
            tableBody.insertAdjacentHTML("beforeend", `
            <tr>
                <td>${item.team_name}</td>
                <td>${item.captain_email}</td>
                <td>${item.first_member}</td>
                <td>${item.second_member}</td>
                <td>${item.competition_name}</td>
                <td>
                   <button class="btn btn-sm btn-warning update-btn"
                    data-id="${item.participant_id}"
                    data-name="${item.team_name}"
                    data-email="${item.captain_email}"
                    data-first="${item.first_member}"
                    data-second="${item.second_member}"
                    data-competition-id="${item.competition_id}"
                    data-competition-name="${item.competition_name}">
                        Update
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${item.participant_id}">Delete</button>
                </td>
            </tr>
            `)
        })
    }

    async function handleDelete(event){
        const participantId= event.target.dataset.id;
        if(!participantId || !confirm("Are you sure want to delete this participants")) return;

        try {
            const response = await fetch(`${API_URL}/admin/api/participant/${participantId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if(response.ok){
                alert("Participant deleted successfully");
                fetchData();
            }else{
                const errorData = await response.json();
                throw new Error(errorData.meessage || "Failed to delete participant");
            }
        } catch (error) {
            console.error("Delete error: ", error);
            alert(`Error deleting participant: ${error.message}`);
        }
    }

    async function loadCompetetionOptions(selectedId = null) {
        const response = await fetch(`${API_URL}/admin/api/participant/competition`);
        const {competitions} = await response.json();
    
        const select = document.getElementById("updateCompetition");
        select.textContent = '<option value="">Select competition…</option>';
    
        competitions.forEach(c => {
            const option = document.createElement("option")
            option.value = c.id_competition
            option.textContent = c.name;

            if(selectedId && Number(selectedId) === c.id_competition) option.selected = true;
            select.appendChild(option);
        })
    }

    function initializeDataTable(){
        try {
            dataTable = new simpleDatatables.DataTable("#ParticipantTable", {
              paging: true,
              perPage: 5,
              hidePageSize: true,
              labels: {
                placeholder: "Search...",
                perPage: "items per page",
                noRows: "No competitions found",
                info: "Showing {start} to {end} of {rows} entries"
              }
            });
          } catch (error) {
            console.error("Error initializing DataTable:", error);
          }
    }

    document.getElementById("saveUpdateBTN").addEventListener("click", async () =>{
        const participant_id = document.getElementById("updateParticipanId").value;
        const teamName = document.getElementById("updateTeamName").value;
        const captainEmail = document.getElementById("updateEmail").value;
        const firstMember = document.getElementById("updatefirstMember").value;
        const secondMember = document.getElementById("updateSecondMember").value;
        const competitionId = Number(document.getElementById("updateCompetition").value);
        
        const updatedData = {
          teamName,
          captainEmail,
          firstMember,
          secondMember,
          competitionId,
        };

        if (!updatedData.teamName || !updatedData.captainEmail || !updatedData.firstMember || !updatedData.secondMember || !updatedData.competitionId) {
            return alert("All fields are required");
          };

          try {
            const response = await fetch(`${API_URL}/admin/api/participant/${participant_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body:  JSON.stringify(updatedData),
            });

            if(response.ok){
                alert("Participant update successfuly")
                bootstrap.Modal.getOrCreateInstance(document.getElementById("updateModal")).hide();
                fetchData();
            }else{
            throw new Error(result.message || "Failed to update participant");
            }

          } catch (error) {
            console.error("Update error:", error);
            alert(`Error updating competition: ${error.message}`);
          }
    })


    fetchData();  
});


