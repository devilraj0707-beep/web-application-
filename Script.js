const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const data = {
  visits: [120, 150, 90, 180, 140, 200, 110],
  signups: [20, 35, 15, 50, 30, 55, 18],
  split: { Mobile: 55, Desktop: 33, Tablet: 12 }
};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ---------- Charts ----------
const lineChart = new Chart(document.getElementById("lineChart"), {
  type: "line",
  data: {
    labels: days,
    datasets: [
      { label: "Visits", data: data.visits, borderColor: "#4f46e5", backgroundColor: "rgba(79,70,229,.15)", fill: true, tension: 0.3 },
      { label: "Signups", data: data.signups, borderColor: "#10b981", tension: 0.3 }
    ]
  },
  options: { responsive: true }
});

const doughnutChart = new Chart(document.getElementById("doughnutChart"), {
  type: "doughnut",
  data: {
    labels: Object.keys(data.split),
    datasets: [{ data: Object.values(data.split), backgroundColor: ["#4f46e5", "#10b981", "#f59e0b"] }]
  },
  options: { responsive: true }
});

const barChart = new Chart(document.getElementById("barChart"), {
  type: "bar",
  data: {
    labels: days,
    datasets: [
      { label: "Visits", data: data.visits, backgroundColor: "#4f46e5" },
      { label: "Signups", data: data.signups, backgroundColor: "#10b981" }
    ]
  },
  options: { responsive: true }
});

// ---------- Update UI ----------
function updateStats() {
  const tv = data.visits.reduce((a, b) => a + b, 0);
  const ts = data.signups.reduce((a, b) => a + b, 0);
  document.getElementById("totalVisits").textContent = tv;
  document.getElementById("totalSignups").textContent = ts;
  document.getElementById("conversion").textContent = tv ? ((ts / tv) * 100).toFixed(1) + "%" : "0%";
  document.getElementById("updated").textContent = "Last updated: " + new Date().toLocaleTimeString();
}

function refreshCharts() {
  doughnutChart.data.datasets[0].data = Object.values(data.split);
  lineChart.update();
  doughnutChart.update();
  barChart.update();
  updateStats();
}

function randomizeData() {
  for (let i = 0; i < days.length; i++) {
    data.visits[i] = rand(50, 200);
    data.signups[i] = rand(5, 60);
  }
  const mobile = rand(40, 70);
  const desktop = rand(20, 100 - mobile - 5);
  data.split = { Mobile: mobile, Desktop: desktop, Tablet: 100 - mobile - desktop };
  refreshCharts();
}

// ---------- Form ----------
document.getElementById("dataForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const i = days.indexOf(document.getElementById("day").value);
  data.visits[i] = Number(document.getElementById("visits").value);
  data.signups[i] = Number(document.getElementById("signups").value);
  refreshCharts();
  e.target.reset();
});

// ---------- Auto refresh ----------
let timer = setInterval(randomizeData, 5000);
const toggleBtn = document.getElementById("toggleBtn");

toggleBtn.addEventListener("click", () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
    toggleBtn.textContent = "Resume Auto-Refresh";
  } else {
    timer = setInterval(randomizeData, 5000);
    toggleBtn.textContent = "Pause Auto-Refresh";
  }
});

document.getElementById("randomBtn").addEventListener("click", randomizeData);

updateStats();
