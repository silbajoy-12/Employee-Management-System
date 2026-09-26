const express = require("express");
const { Employees } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// All employee routes require the admin to be logged in
router.use(requireAuth);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;

// ---- Validation helper ----
function validateEmployee(data, isUpdate = false) {
  const errors = [];
  const { name, email, phone, department, position, salary, joiningDate } = data;

  if (!isUpdate || name !== undefined) {
    if (!name || name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long.");
    }
  }
  if (!isUpdate || email !== undefined) {
    if (!email || !EMAIL_REGEX.test(email)) {
      errors.push("A valid email address is required.");
    }
  }
  if (!isUpdate || phone !== undefined) {
    if (!phone || !PHONE_REGEX.test(String(phone))) {
      errors.push("Phone number must be exactly 10 digits.");
    }
  }
  if (!isUpdate || department !== undefined) {
    if (!department || department.trim().length === 0) {
      errors.push("Department is required.");
    }
  }
  if (!isUpdate || position !== undefined) {
    if (!position || position.trim().length === 0) {
      errors.push("Position is required.");
    }
  }
  if (!isUpdate || salary !== undefined) {
    if (salary === undefined || salary === null || isNaN(salary) || Number(salary) <= 0) {
      errors.push("Salary must be a positive number.");
    }
  }
  if (!isUpdate || joiningDate !== undefined) {
    if (!joiningDate || isNaN(Date.parse(joiningDate))) {
      errors.push("A valid joining date is required.");
    }
  }

  return errors;
}

// GET /api/employees -> list all employees
router.get("/", (req, res) => {
  res.json(Employees.getAll());
});

// GET /api/employees/:id -> get single employee
router.get("/:id", (req, res) => {
  const employee = Employees.getById(req.params.id);
  if (!employee) return res.status(404).json({ error: "Employee not found." });
  res.json(employee);
});

// POST /api/employees -> create employee
router.post("/", (req, res) => {
  const errors = validateEmployee(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  const { name, email, phone, department, position, salary, joiningDate } = req.body;
  const newEmployee = Employees.create({
    name: name.trim(),
    email: email.trim(),
    phone: String(phone),
    department: department.trim(),
    position: position.trim(),
    salary: Number(salary),
    joiningDate
  });
  res.status(201).json(newEmployee);
});

// PUT /api/employees/:id -> update employee
router.put("/:id", (req, res) => {
  const existing = Employees.getById(req.params.id);
  if (!existing) return res.status(404).json({ error: "Employee not found." });

  const errors = validateEmployee(req.body, true);
  if (errors.length > 0) return res.status(400).json({ errors });

  const updated = Employees.update(req.params.id, req.body);
  res.json(updated);
});

// DELETE /api/employees/:id -> delete employee
router.delete("/:id", (req, res) => {
  const deleted = Employees.delete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Employee not found." });
  res.json({ message: "Employee deleted successfully." });
});

module.exports = router;
