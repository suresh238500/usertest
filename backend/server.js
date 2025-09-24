const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const BASE_URL = "https://jsonplaceholder.typicode.com/users";

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get user by ID
app.get("/api/users/:id", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/${req.params.id}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Add new user
app.post("/api/users", async (req, res) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to add user" });
  }
});

// Update user
app.put("/api/users/:id", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/${req.params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete user
app.delete("/api/users/:id", async (req, res) => {
  try {
    await fetch(`${BASE_URL}/${req.params.id}`, { method: "DELETE" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
