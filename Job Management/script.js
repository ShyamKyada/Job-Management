let jobList = JSON.parse(localStorage.getItem('jobList') || '[]');

displayItems();

function saveJobs() {
  localStorage.setItem('jobList', JSON.stringify(jobList))
}

function deleteJob(i) {
  jobList.splice(i,1);
  saveJobs();
  displayItems();
}

function addjob() {
  let pNameElement = document.querySelector("#party-name");
  let JNameElement = document.querySelector("#job-name");
  let dateElement = document.querySelector("#job-date");
  let stsElement = document.querySelector("#job-sts");

  let partydetail = pNameElement.value;
  let jobdetail = JNameElement.value;
  let datedetail = dateElement.value;
  let stsdetail = stsElement.value;
  if (!partydetail || !jobdetail || !datedetail || !stsdetail) {
    alert("Please fill in all fields before adding a job.");
    return;
  }
  jobList.push({
    partyName: partydetail,
    jobName: jobdetail,
    date: datedetail,
    job_sts: stsdetail,
  });
  saveJobs();
  pNameElement.value = "";
  JNameElement.value = "";
  dateElement.value = "";
  stsElement.value = "";
  displayItems();
}

function displayItems() {
  let containerElement = document.querySelector(".job-container");
  let newHtml = "";
  for (let i = 0; i < jobList.length; i++) {
    let { partyName, jobName, date, job_sts } = jobList[i];
    newHtml += `
    <div>
      <span>${partyName}</span>                     
      <span>${jobName}</span>
      <span>${date}</span>
      <span>${job_sts}</span>
      <button class='btn-delete' onclick="deleteJob(${i})">Delete</button>
    </div>`;
  }
  containerElement.innerHTML = newHtml;
}
