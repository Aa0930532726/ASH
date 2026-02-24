const seed = {
  members: [
    { id: crypto.randomUUID(), name: "王小美", phone: "0912-123-456", birthday: "1994-03-18", tier: "金卡會員", points: 1200, balance: 1800 },
    { id: crypto.randomUUID(), name: "陳雅婷", phone: "0922-234-567", birthday: "1990-11-07", tier: "銀卡會員", points: 680, balance: 900 },
  ],
  services: [
    { id: crypto.randomUUID(), name: "精緻剪髮", price: 900, duration: 60 },
    { id: crypto.randomUUID(), name: "韓系染髮", price: 3200, duration: 180 },
    { id: crypto.randomUUID(), name: "深層護髮", price: 1500, duration: 50 },
  ],
  appointments: [],
  transactions: [],
  inventory: [
    { name: "染膏 A", quantity: 4, safety: 5 },
    { name: "護髮素 B", quantity: 12, safety: 6 },
    { name: "洗髮精 C", quantity: 3, safety: 4 },
  ],
};

const read = () => JSON.parse(localStorage.getItem("hairflowData") || "null") || structuredClone(seed);
let data = read();
const save = () => localStorage.setItem("hairflowData", JSON.stringify(data));

const memberTable = document.querySelector("#memberTable");
const serviceList = document.querySelector("#serviceList");
const appointmentList = document.querySelector("#appointmentList");
const transactionList = document.querySelector("#transactionList");
const inventoryList = document.querySelector("#inventoryList");
const reportBars = document.querySelector("#reportBars");

function renderSelects() {
  const memberOptions = data.members.map((m) => `<option value="${m.id}">${m.name}</option>`).join("");
  ["#appointmentMember", "#transactionMember"].forEach((id) => {
    document.querySelector(id).innerHTML = memberOptions;
  });
  document.querySelector("#appointmentService").innerHTML = data.services
    .map((s) => `<option value="${s.id}">${s.name}｜$${s.price}</option>`)
    .join("");
}

function renderDashboard() {
  const revenue = data.transactions.reduce((sum, t) => sum + t.amount, 0);
  const today = new Date().toISOString().slice(0, 10);
  const todayAppointments = data.appointments.filter((a) => a.date === today).length;
  const points = data.members.reduce((sum, m) => sum + m.points, 0);
  const cards = [
    ["會員總數", data.members.length],
    ["本月營收", `$${revenue.toLocaleString()}`],
    ["今日預約", todayAppointments],
    ["會員總點數", points.toLocaleString()],
  ];
  document.querySelector("#dashboardCards").innerHTML = cards
    .map(([k, v]) => `<article class="card"><small>${k}</small><strong>${v}</strong></article>`)
    .join("");
}

function renderMembers() {
  memberTable.innerHTML = data.members
    .map(
      (m) => `<tr>
      <td>${m.name}</td><td>${m.phone}</td><td>${m.birthday}</td>
      <td><span class="tag">${m.tier}</span></td><td>${m.points}</td><td>$${m.balance}</td>
    </tr>`
    )
    .join("");
}

function renderServices() {
  serviceList.innerHTML = data.services
    .map((s) => `<li><span>${s.name} (${s.duration} 分)</span><strong>$${s.price}</strong></li>`)
    .join("");
}

function renderAppointments() {
  appointmentList.innerHTML = data.appointments
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .map((a) => {
      const member = data.members.find((m) => m.id === a.memberId)?.name || "未知會員";
      const service = data.services.find((s) => s.id === a.serviceId)?.name || "未知服務";
      return `<li><span>${a.date} ${a.time}｜${member}｜${service}｜設計師 ${a.stylist}</span><span class="tag">${a.status}</span></li>`;
    })
    .join("");
}

function renderTransactions() {
  transactionList.innerHTML = data.transactions
    .slice()
    .reverse()
    .map((t) => {
      const member = data.members.find((m) => m.id === t.memberId)?.name || "未知會員";
      return `<li><span>${t.date}｜${member}｜${t.payment}</span><strong>$${t.amount}</strong></li>`;
    })
    .join("");
}

function renderInventory() {
  inventoryList.innerHTML = data.inventory
    .map((i) => {
      const low = i.quantity < i.safety;
      return `<li><span>${i.name}：${i.quantity}</span><span class="${low ? "low-stock" : "tag"}">${low ? "補貨" : "正常"}</span></li>`;
    })
    .join("");
}

function renderReports() {
  const grouped = {};
  data.transactions.forEach((t) => {
    const month = t.date.slice(0, 7);
    grouped[month] = (grouped[month] || 0) + t.amount;
  });
  const months = Object.keys(grouped).sort().slice(-6);
  const max = Math.max(...months.map((m) => grouped[m]), 1000);
  reportBars.innerHTML = months
    .map((m) => {
      const v = grouped[m];
      const h = Math.max(30, Math.round((v / max) * 140));
      return `<div class="bar" style="height:${h}px">${m}<br>$${v}</div>`;
    })
    .join("") || "<p>尚無交易資料，建立交易後即可查看營收趨勢。</p>";
}

function renderAll() {
  renderSelects();
  renderDashboard();
  renderMembers();
  renderServices();
  renderAppointments();
  renderTransactions();
  renderInventory();
  renderReports();
  save();
}

document.querySelector("#memberForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  data.members.push({
    id: crypto.randomUUID(),
    name: fd.get("name"),
    phone: fd.get("phone"),
    birthday: fd.get("birthday"),
    tier: fd.get("tier"),
    points: 0,
    balance: 0,
  });
  e.target.reset();
  renderAll();
});

document.querySelector("#serviceForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  data.services.push({
    id: crypto.randomUUID(),
    name: fd.get("name"),
    price: Number(fd.get("price")),
    duration: Number(fd.get("duration")),
  });
  e.target.reset();
  renderAll();
});

document.querySelector("#appointmentForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  data.appointments.push({
    id: crypto.randomUUID(),
    memberId: fd.get("memberId"),
    serviceId: fd.get("serviceId"),
    stylist: fd.get("stylist"),
    date: fd.get("date"),
    time: fd.get("time"),
    status: "已確認",
  });
  e.target.reset();
  renderAll();
});

document.querySelector("#transactionForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const amount = Number(fd.get("amount"));
  const member = data.members.find((m) => m.id === fd.get("memberId"));
  if (member) {
    member.points += Math.floor(amount / 20);
    if (fd.get("payment") === "儲值金") {
      member.balance = Math.max(0, member.balance - amount);
    }
  }
  data.transactions.push({
    id: crypto.randomUUID(),
    memberId: fd.get("memberId"),
    amount,
    payment: fd.get("payment"),
    date: new Date().toISOString().slice(0, 10),
  });
  e.target.reset();
  renderAll();
});

document.querySelector("#resetDemo").addEventListener("click", () => {
  data = structuredClone(seed);
  renderAll();
});

renderAll();
