import { ensureAuthenticated } from './authGuard.js';

document.addEventListener("DOMContentLoaded", async () => {
  const token = await ensureAuthenticated();
  const API_URL = "https://competehub-website.et.r.appspot.com";
  let dataTable = null;
  const tableBody = document.querySelector("#competitionTable tbody");
  
  // Use event delegation for button clicks
  document.addEventListener("click", (e) => {
    // Handle delete buttons
    if (e.target.classList.contains("delete-btn")) {
      handleDelete(e);
    }
    
    // Handle update buttons
    if (e.target.classList.contains("update-btn")) {
      const button = e.target;
      document.getElementById("updateCompetitionId").value = button.dataset.id;
      document.getElementById("updateCompetitionName").value = button.dataset.name;
      document.getElementById("updateDescription").value = button.dataset.description;
      document.getElementById("updateStartDate").value = formatDateTimeLocal(button.dataset.start);
      document.getElementById("updateEndDate").value = formatDateTimeLocal(button.dataset.end);

      const updateModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("updateModal"));
      updateModal.show();
    }
  });

  async function fetchData() {
    try {
      const res = await fetch(`${API_URL}/admin/api/competition` ,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
    

      if (Array.isArray(data.competetions)) {
        renderTable(data.competetions);
        if (!dataTable) initializeDataTable();
        else dataTable.refresh();
      } else {
        console.error("Competetions data is not an array:", data);
        tableBody.innerHTML = `<tr><td colspan="6" class="text-danger text-center">No competitions found</td></tr>`;
      }
    } catch (error) {
      console.error("Error:", error);
      tableBody.innerHTML = `<tr><td colspan="6" class="text-danger text-center">Error loading data</td></tr>`;
    }
  }

  function renderTable(competitions) {
    tableBody.textContent = "";
    competitions.forEach(item => {
      const startDate = new Date(item.startDate).toLocaleDateString() || "N/A";
      const endDate = new Date(item.endDate).toLocaleDateString() || "N/A";

      tableBody.insertAdjacentHTML("beforeend", `
        <tr>
          <td>${item.name}</td>
          <td>${item.description}</td>
          <td>${startDate}</td>
          <td>${endDate}</td>
          <td>
            <button class="btn btn-sm btn-warning update-btn" data-id="${item.id_competition}" data-name="${item.name}" data-description="${item.description}" data-start="${item.startDate}" data-end="${item.endDate}">Update</button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${item.id_competition}">Delete</button>
          </td>
        </tr>
      `);
    });
    
    // No need to attach event listeners here anymore since we're using event delegation
  }

  async function handleDelete(event) {
    const competitionId = event.target.dataset.id;
    if (!competitionId || !confirm('Are you sure you want to delete this competition?')) return;

    try {
      const response = await fetch(`${API_URL}/admin/api/competition/${competitionId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
      });

      if (response.ok) {
        alert('Competition deleted successfully!');
        fetchData();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete competition');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Error deleting competition: ${error.message}`);
    }
  }

  function initializeDataTable() {
    try {
      dataTable = new simpleDatatables.DataTable("#competitionTable", {
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

  function formatDateTimeLocal(dateString) {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  }

  document.getElementById("addcompetitionBTN").addEventListener("click", async () => {
    const name = document.getElementById("competitionName").value.trim();
    const description = document.getElementById("Description").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    console.log("Form Data:", { name, description, startDate, endDate });

    try {
      const response = await fetch(`${API_URL}/admin/api/competition`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
        body: JSON.stringify({ name, description, startDate, endDate })
      });

      const data = await response.json();
      if (response.ok) {
        alert("Competition created!");
        bootstrap.Modal.getOrCreateInstance(document.getElementById("createModal")).hide();
        fetchData();

        // Reset form
        document.getElementById("competitionName").value = "";
        document.getElementById("Description").value = "";
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
      } else {
        throw new Error(data.message || "Creation failed");
      }

    } catch (error) {
      console.error("Error: ", error);
      alert("Server error");
      window.location.href = "500.html";
    }
  });

  document.getElementById("saveUpdateBTN").addEventListener("click", async () => {
    const id = document.getElementById("updateCompetitionId").value;
    const name = document.getElementById("updateCompetitionName").value.trim();
    const description = document.getElementById("updateDescription").value.trim();
    const startDate = document.getElementById("updateStartDate").value;
    const endDate = document.getElementById("updateEndDate").value;

    try {
      const response = await fetch(`${API_URL}/admin/api/competition/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
        body: JSON.stringify({ name, description, startDate, endDate }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Competition updated successfully!");
        bootstrap.Modal.getOrCreateInstance(document.getElementById("updateModal")).hide();
        fetchData();
      } else {
        throw new Error(result.message || "Update failed");
      }

    } catch (error) {
      console.error("Update error:", error);
      alert(`Error updating competition: ${error.message}`);
    }
  });

  fetchData(); // Initial call
});