const express = require("express");
const session = require("express-session");
const path = require("path");

const { seedAdminUser, seedEmployees } = require("./db");
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Seed initial data on startup ----
seedAdminUser();
seedEmployees();

// ---- Middleware ----
app.use(express.json());
app.use(
  session({
    secret: "ems-task2-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 hours
  })
);
app.use(express.static(path.join(__dirname, "public")));

// ---- Routes ----
app.use("/api", authRoutes);
app.use("/api/employees", employeeRoutes);

// Fallback -> serve login page for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.listen(PORT, () => {
  console.log(`\nEmployee Management System running at http://localhost:${PORT}`);
  console.log("Default login -> username: admin | password: admin123\n");
});
