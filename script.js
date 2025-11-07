let jobList = JSON.parse(localStorage.getItem('jobList') || '[]');

const partyInput = document.getElementById('party-name');
const jobInput = document.getElementById('job-name');
const dateInput = document.getElementById('job-date');
const statusInput = document.getElementById('job-status');
const jobTableBody = document.getElementById('job-list');
const deliveredTableBody = document.getElementById('delivered-list');
const addJobBtn = document.getElementById('add-job-btn');
const toast = document.getElementById('toast');

addJobBtn.addEventListener('click', addJob);
renderJobs();

function addJob() {
  const party = partyInput.value.trim();
  const job = jobInput.value.trim();
  const date = dateInput.value;
  const status = statusInput.value;

  if (!party || !job || !date || !status) {
    showToast("Please fill in all fields ❗");
    return;
  }

  jobList.push({ party, job, date, status });
  saveJobs();
  renderJobs();
  clearForm();
  showToast("Job added ✅");
}

function deleteJob(index, isDelivered = false) {
  if (isDelivered) {
    const deliveredJobs = jobList.filter(job => job.status === "delivered");
    const activeJobs = jobList.filter(job => job.status !== "delivered");
    jobList = [...activeJobs, ...deliveredJobs.filter((_, i) => i !== index)];
  } else {
    jobList.splice(index, 1);
  }
  saveJobs();
  renderJobs();
  showToast("Job deleted 🗑️");
}

function renderJobs() {
  const activeJobs = jobList.filter(job => job.status !== "delivered");
  const deliveredJobs = jobList.filter(job => job.status === "delivered");

  // Render Active Jobs
  jobTableBody.innerHTML = activeJobs.map((item, index) => `
    <tr>
      <td>${item.party}</td>
      <td>${item.job}</td>
      <td>${item.date}</td>
      <td>
        <select class="status-select" data-index="${index}">
          <option value="incomplete" ${item.status === "incomplete" ? "selected" : ""}>Incomplete</option>
          <option value="inprocess" ${item.status === "inprocess" ? "selected" : ""}>In Process</option>
          <option value="completed" ${item.status === "completed" ? "selected" : ""}>Completed</option>
          <option value="delivered" ${item.status === "delivered" ? "selected" : ""}>Delivered</option>
        </select>
      </td>
      <td><button class="btn-delete" onclick="deleteJob(${index})">Delete</button></td>
    </tr>
  `).join("");

  document.querySelectorAll(".status-select").forEach(select => {
    select.addEventListener("change", (e) => {
      const i = e.target.getAttribute("data-index");
      jobList[i].status = e.target.value;
      saveJobs();
      showToast("Status updated ✅");
      renderJobs();
    });
  });

  // Render Delivered Jobs
  if (deliveredJobs.length === 0) {
    deliveredTableBody.innerHTML = `
      <tr class="placeholder-row">
        <td colspan="5">No delivered jobs yet.</td>
      </tr>
    `;
  } else {
    deliveredTableBody.innerHTML = deliveredJobs.map((item, index) => `
      <tr>
        <td>${item.party}</td>
        <td>${item.job}</td>
        <td>${item.date}</td>
        <td><span class="status-badge delivered">Delivered</span></td>
        <td><button class="btn-delete" onclick="deleteJob(${index}, true)">Delete</button></td>
      </tr>
    `).join("");
  }
}

function saveJobs() {
  localStorage.setItem('jobList', JSON.stringify(jobList));
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
  setTimeout(() => {
    toast.style.opacity = 0;
  }, 2000);
}
