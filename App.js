import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/users";

function App() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [form, setForm] = useState({ id: "", firstName: "", lastName: "", email: "", department: "" });
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await fetch(API_URL);
    let data = await res.json();
    data = data.map(u => ({
      id: u.id,
      firstName: u.name.split(" ")[0],
      lastName: u.name.split(" ")[1] || "",
      email: u.email,
      department: u.company?.name || "General"
    }));
    setUsers(data);
    setFiltered(data);
  }

  // Search
  useEffect(() => {
    let f = users.filter(u =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(f);
    setPage(1);
  }, [search, users]);

  // Sorting
  function sortBy(key) {
    const asc = key === sortKey ? !sortAsc : true;
    setSortKey(key);
    setSortAsc(asc);

    const sorted = [...filtered].sort((a, b) => {
      if (a[key] < b[key]) return asc ? -1 : 1;
      if (a[key] > b[key]) return asc ? 1 : -1;
      return 0;
    });
    setFiltered(sorted);
  }

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();
    const user = {
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      company: { name: form.department }
    };

    if (form.id) {
      await fetch(`${API_URL}/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
    }
    setForm({ id: "", firstName: "", lastName: "", email: "", department: "" });
    fetchUsers();
  }

  // Edit user
  async function editUser(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const u = await res.json();
    setForm({
      id: u.id,
      firstName: u.name.split(" ")[0],
      lastName: u.name.split(" ")[1] || "",
      email: u.email,
      department: u.company?.name || "General"
    });
  }

  // Delete user
  async function deleteUser(id) {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchUsers();
  }

  // Pagination
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);
  const totalPages = Math.ceil(filtered.length / limit);

  return (
    <div className="App">
      <h1>User Management</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="First Name"
          value={form.firstName}
          onChange={e => setForm({ ...form, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={form.lastName}
          onChange={e => setForm({ ...form, lastName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Department"
          value={form.department}
          onChange={e => setForm({ ...form, department: e.target.value })}
          required
        />
        <button type="submit">{form.id ? "Update" : "Add"} User</button>
      </form>

      {/* User Table */}
      <table border="1" cellPadding="8" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th onClick={() => sortBy("id")}>ID</th>
            <th onClick={() => sortBy("firstName")}>First Name</th>
            <th onClick={() => sortBy("lastName")}>Last Name</th>
            <th onClick={() => sortBy("email")}>Email</th>
            <th onClick={() => sortBy("department")}>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.firstName}</td>
              <td>{u.lastName}</td>
              <td>{u.email}</td>
              <td>{u.department}</td>
              <td>
                <button onClick={() => editUser(u.id)}>Edit</button>
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {paginated.length === 0 && (
            <tr>
              <td colSpan="6">No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "10px" }}>
        <label>
          Show
          <select value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          per page
        </label>
        <div>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          <span> Page {page} of {totalPages} </span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default App;
