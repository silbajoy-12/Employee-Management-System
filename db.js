// Simple JSON-file based data layer.
// (No external database needed - great for learning CRUD concepts clearly.)
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const EMPLOYEES_FILE = path.join(__dirname, "data", "employees.json");
const USERS_FILE = path.join(__dirname, "data", "users.json");

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, "utf-8").trim();
  return raw ? JSON.parse(raw) : [];
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ---------- Seed default admin user on first run ----------
function seedAdminUser() {
  const users = readJSON(USERS_FILE);
  if (users.length === 0) {
    const hashedPassword = bcrypt.hashSync("admin123", 10);
    users.push({ id: 1, username: "admin", password: hashedPassword });
    writeJSON(USERS_FILE, users);
    console.log("Seeded default admin user -> username: admin | password: admin123");
  }
}

// ---------- Seed a couple of sample employees ----------
function seedEmployees() {
  const employees = readJSON(EMPLOYEES_FILE);
  if (employees.length === 0) {
    const sample = [
      {
        id: 1,
        name: "Arun Kumar",
        email: "arun.kumar@example.com",
        phone: "9876543210",
        department: "Engineering",
        position: "Software Developer",
        salary: 45000,
        joiningDate: "2023-06-15"
      },
      {
        id: 2,
        name: "Divya Sree",
        email: "divya.sree@example.com",
        phone: "9876501234",
        department: "Human Resources",
        position: "HR Executive",
        salary: 35000,
        joiningDate: "2022-11-01"
      }
    ];
    writeJSON(EMPLOYEES_FILE, sample);
  }
}

// ---------- Employee CRUD helpers ----------
const Employees = {
  getAll() {
    return readJSON(EMPLOYEES_FILE);
  },
  getById(id) {
    return readJSON(EMPLOYEES_FILE).find((e) => e.id === Number(id));
  },
  create(employee) {
    const employees = readJSON(EMPLOYEES_FILE);
    const newId =
      employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1;
    const newEmployee = { id: newId, ...employee };
    employees.push(newEmployee);
    writeJSON(EMPLOYEES_FILE, employees);
    return newEmployee;
  },
  update(id, updatedFields) {
    const employees = readJSON(EMPLOYEES_FILE);
    const index = employees.findIndex((e) => e.id === Number(id));
    if (index === -1) return null;
    employees[index] = { ...employees[index], ...updatedFields, id: Number(id) };
    writeJSON(EMPLOYEES_FILE, employees);
    return employees[index];
  },
  delete(id) {
    const employees = readJSON(EMPLOYEES_FILE);
    const filtered = employees.filter((e) => e.id !== Number(id));
    const changed = filtered.length !== employees.length;
    writeJSON(EMPLOYEES_FILE, filtered);
    return changed;
  }
};

// ---------- User helpers (for authentication) ----------
const Users = {
  findByUsername(username) {
    return readJSON(USERS_FILE).find((u) => u.username === username);
  }
};

module.exports = { seedAdminUser, seedEmployees, Employees, Users };
