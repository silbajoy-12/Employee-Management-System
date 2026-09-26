const tableBody = document.getElementById("tableBody");
const emptyState = document.getElementById("emptyState");
const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const employeeForm = document.getElementById("employeeForm");
const formErrorBox = document.getElementById("formErrorBox");
const toast = document.getElementById("toast");

// ---------- Auth guard: redirect to login if not authenticated ----------
async function checkAuth() {
  const res = await fetch("/api/session");
  const data = await res.json();
  if (!data.loggedIn) {
    window.location.href = "/login.html";
  } else {
    document.getElementById("whoAmI").textContent = `Signed in as ${data.username}`;
  }
}

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST" });
  window.location.href = "/login.html";
});

// ---------- Toast helper ----------
function showToast(message, isError = false) {
  toast.textContent = message;
  toast.classList.toggle("error", isError);
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// ---------- Fetch & render employees ----------
async function loadEmployees() {
  const res = await fetch("/api/employees");
  if (res.status === 401) {
    window.location.href = "/login.html";
    return;
  }
  const employees = await res.json();
  renderTable(employees);
}

function renderTable(employees) {
  tableBody.innerHTML = "";
  emptyState.style.display = employees.length === 0 ? "block" : "none";

  employees.forEach((emp) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td data-label="Name">${escapeHTML(emp.name)}</td>
      <td data-label="Email">${escapeHTML(emp.email)}</td>
      <td data-label="Phone">${escapeHTML(emp.phone)}</td>
      <td data-label="Department">${escapeHTML(emp.department)}</td>
      <td data-label="Position">${escapeHTML(emp.position)}</td>
      <td data-label="Salary">₹${Number(emp.salary).toLocaleString("en-IN")}</td>
      <td data-label="Joined">${emp.joiningDate}</td>
      <td>
        <div class="row-actions">
          <button class="edit-btn" data-id="${emp.id}">Edit</button>
          <button class="delete-btn" data-id="${emp.id}">Delete</button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  document.querySelectorAll(".edit-btn").forEach((btn) =>
    btn.addEventListener("click", () => openEditModal(btn.dataset.id))
  );
  document.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", () => deleteEmployee(btn.dataset.id))
  );
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Modal open/close ----------
function openAddModal() {
  modalTitle.textContent = "Add employee";
  employeeForm.reset();
  document.getElementById("employeeId").value = "";
  formErrorBox.classList.remove("show");
  modalOverlay.classList.add("show");
}

async function openEditModal(id) {
  const res = await fetch(`/api/employees/${id}`);
  if (!res.ok) return showToast("Could not load employee.", true);
  const emp = await res.json();

  modalTitle.textContent = "Edit employee";
  document.getElementById("employeeId").value = emp.id;
  document.getElementById("name").value = emp.name;
  document.getElementById("email").value = emp.email;
  document.getElementById("phone").value = emp.phone;
  document.getElementById("department").value = emp.department;
  document.getElementById("position").value = emp.position;
  document.getElementById("salary").value = emp.salary;
  document.getElementById("joiningDate").value = emp.joiningDate;
  formErrorBox.classList.remove("show");
  modalOverlay.classList.add("show");
}

function closeModal() {
  modalOverlay.classList.remove("show");
}

document.getElementById("addBtn").addEventListener("click", openAddModal);
document.getElementById("cancelBtn").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// ---------- Create / Update ----------
employeeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formErrorBox.classList.remove("show");

  const id = document.getElementById("employeeId").value;
  const payload = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    department: document.getElementById("department").value.trim(),
    position: document.getElementById("position").value.trim(),
    salary: Number(document.getElementById("salary").value),
    joiningDate: document.getElementById("joiningDate").value
  };

  const url = id ? `/api/employees/${id}` : "/api/employees";
  const method = id ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) {
      formErrorBox.textContent = (data.errors || [data.error]).join(" ");
      formErrorBox.classList.add("show");
      return;
    }

    closeModal();
    showToast(id ? "Employee updated." : "Employee added.");
    loadEmployees();
  } catch (err) {
    formErrorBox.textContent = "Network error. Please try again.";
    formErrorBox.classList.add("show");
  }
});

// ---------- Delete ----------
async function deleteEmployee(id) {
  if (!confirm("Delete this employee record? This cannot be undone.")) return;
  const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
  if (!res.ok) {
    showToast("Could not delete employee.", true);
    return;
  }
  showToast("Employee deleted.");
  loadEmployees();
}

// ---------- Init ----------
checkAuth().then(loadEmployees);
