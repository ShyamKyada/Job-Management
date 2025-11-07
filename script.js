let jobList = JSON.parse(localStorage.getItem("jobList") || "[]");

const partyInput = document.getElementById("party-name");
const jobInput = document.getElementById("job-name");
const dateInput = document.getElementById("job-date");
const statusInput = document.getElementById("job-status");
const jobTableBody = document.getElementById("job-list");
const deliveredTableBody = document.getElementById("delivered-list");
const addJobBtn = document.getElementById("add-job-btn");
const toast = document.getElementById("toast");

addJobBtn.addEventListener("click", addJob);
renderJobs();

function addJob() {
  const party = partyInput.value.trim();
  const job = jobInput.value.trim();
  const date = dateInput.value;
  const status = statusInput.value;

  if (!party || !job || !date || !status) {
    return showToast("Please fill in all fields ❗");
  }

  jobList.push({ party, job, date, status });
  saveJobs();
  renderJobs();
  clearForm();
  showToast("Job added ✅");
}

function deleteJob(realIndex) {
  jobList.splice(realIndex, 1);
  saveJobs();
  renderJobs();
  showToast("Job deleted 🗑️");
}

/* ──────────────────────────────────────────────
   ✅ Render Jobs + Delivered Section
   (Handles mapping + status change)
────────────────────────────────────────────── */
function renderJobs() {
  const activeJobs = jobList
    .map((job, i) => ({ ...job, index: i }))
    .filter((job) => job.status !== "delivered");

  const deliveredJobs = jobList
    .map((job, i) => ({ ...job, index: i }))
    .filter((job) => job.status === "delivered");

  jobTableBody.innerHTML = activeJobs
    .map(
      (item) => `
    <tr>
      <td>${item.party}</td>
      <td>${item.job}</td>
      <td>${item.date}</td>
      <td>
        <select class="status-select" data-index="${item.index}">
          <option value="incomplete" ${item.status === "incomplete" ? "selected" : ""}>Incomplete</option>
          <option value="inprocess" ${item.status === "inprocess" ? "selected" : ""}>In Process</option>
          <option value="completed" ${item.status === "completed" ? "selected" : ""}>Completed</option>
          <option value="delivered" ${item.status === "delivered" ? "selected" : ""}>Delivered</option>
        </select>
      </td>
      <td><button class="btn-delete" onclick="deleteJob(${item.index})">Delete</button></td>
    </tr>`
    )
    .join("");

  if (deliveredJobs.length === 0) {
    deliveredTableBody.innerHTML = `
    <tr class="placeholder-row">
      <td colspan="5">No delivered jobs yet.</td>
    </tr>`;
  } else {
    deliveredTableBody.innerHTML = deliveredJobs
      .map(
        (item) => `
      <tr>
        <td>${item.party}</td>
        <td>${item.job}</td>
        <td>${item.date}</td>
        <td><span class="status-badge delivered">Delivered</span></td>
        <td><button class="btn-delete" onclick="deleteJob(${item.index})">Delete</button></td>
      </tr>`
      )
      .join("");
  }

  document.querySelectorAll(".status-select").forEach((select) => {
    select.addEventListener("change", handleStatusChange);
  });
}


function handleStatusChange(e) {
  const index = e.target.getAttribute("data-index");
  const newStatus = e.target.value;

  jobList[index].status = newStatus;
  saveJobs();

  if (newStatus === "delivered") {
    showToast("Moved to Delivered ✅");
  } else {
    showToast("Status updated ✅");
  }

  renderJobs();
}


function saveJobs() {
  localStorage.setItem("jobList", JSON.stringify(jobList));
}

function clearForm() {
  partyInput.value = "";
  jobInput.value = "";
  dateInput.value = "";
  statusInput.value = "";
}

function showToast(message) {
  toast.textContent = message;
  toast.style.opacity = 1;
  setTimeout(() => (toast.style.opacity = 0), 2000);
}
