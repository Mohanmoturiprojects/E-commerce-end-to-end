import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Manager.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie,} from "recharts";

const Managerdashboard = () => {
  const [view, setView] = useState("products");
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);

  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("1");

  const [formData, setFormData] = useState({
    name: "",
    catagory: "",
    price: "",
    description: "",
    availability: "",
  });

  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    if (view !== "summary") {
      fetchData(view);
    }
  }, [view]);

  useEffect(() => {
    const firstLogin = sessionStorage.getItem("managerFirstLogin");

    if (!firstLogin) {
      setToastMsg("🎉 Login Successful! Welcome Manager.");
      setShowToast(true);

      setTimeout(() => setShowToast(false), 3000);
      sessionStorage.setItem("managerFirstLogin", "done");
    }
  }, []);

  const fetchData = async (type) => {
    let endpoint = "";
    if (type === "products") endpoint = "/api/manager/products";
    else if (type === "users") endpoint = "/api/manager/users";
    else if (type === "orders") endpoint = "/api/manager/orders";

    try {
      const res = await axios.get(`http://localhost:8081${endpoint}`);
      setData(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching:", err);
      setData([]);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/api/orders/full-dashboard-summary/${year}/${month}`
      );
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setSummary(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      await axios.post("http://localhost:8081/api/manager/products", formData);
      alert("✅ Product added successfully!");
      resetForm();
      fetchData("products");
    } catch (err) {
      console.error(err);
      alert("❌ Error adding product");
    }
  };

  const handleEdit = (id) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setFormData(item);
      setEditId(id);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8081/api/manager/products/${editId}`,
        formData
      );
      alert("✅ Product updated successfully!");
      resetForm();
      fetchData("products");
    } catch (err) {
      console.error(err);
      alert("❌ Error updating product");
    }
  };

  const handleSetOprice = async (id) => {
    const oprice = prompt("Enter O-Price:");
    if (!oprice || isNaN(oprice)) {
      alert("Please enter a valid number");
      return;
    }
    try {
      await axios.patch(
        `http://localhost:8081/api/orders/set-oprice/${id}`,
        { oprice: Number(oprice) }
      );
      alert("O-Price updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update O-Price!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`http://localhost:8081/api/manager/products/${id}`);
      alert("🗑️ Product deleted successfully!");
      fetchData("products");
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting product");
    }
  };

  const handleAddUser = () => navigate("/register");

  const handleRemoveUser = async (id) => {
    if (!window.confirm("Remove this user?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/manager/users/${id}`);
      alert("✅ User removed successfully!");
      fetchData("users");
    } catch (err) {
      console.error(err);
      alert("❌ Error removing user");
    }
  };

  const handleUpdateRole = async (userId) => {
    const newRole = prompt("Enter new role:");
    if (!newRole) return;

    try {
      await axios.put(
        `http://localhost:8081/api/manager/users/${userId}/role`,
        { newRole }
      );
      alert("✅ Role updated successfully!");
      fetchData("users");
    } catch (err) {
      console.error("❌ Error updating role:", err);
      alert("❌ Error updating role");
    }
  };

  const handleUpdateOrder = async (id) => {
    const newStatus = prompt("Enter new status (Pending, Shipped, Delivered):");
    if (!newStatus) return;

    try {
      await axios.put(`http://localhost:8081/api/manager/orders/${id}`, {
        status: newStatus,
        delivered_at:
          newStatus.toLowerCase() === "delivered"
            ? new Date().toISOString()
            : null,
      });
      alert("✅ Order status updated!");
      fetchData("orders");
    } catch (err) {
      console.error(err);
      alert("❌ Error updating order status");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      catagory: "",
      price: "",
      description: "",
      availability: "",
    });
    setEditId(null);
  };

  const Toast = () =>
    showToast ? <div className="toast-message">{toastMsg}</div> : null;

  
  // TOTAL CALCULATIONS
 
  const totalQuantity = summary
    ? Object.values(summary.quantityByCatagory).reduce((a, b) => a + b, 0)
    : 0;

  const totalProfit = summary
    ? Object.values(summary.profitByCatagory).reduce((a, b) => a + b, 0)
    : 0;

  const totalLoss = summary
    ? Object.values(summary.lossByCatagory).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="manager-container">
      <Toast />

      <h2>🧑‍💼 Manager Dashboard</h2>

      <select
        className="dropdown"
        value={view}
        onChange={(e) => setView(e.target.value)}
      >
        <option value="products">Products</option>
        <option value="orders">Orders</option>
        <option value="users">Users</option>
        <option value="summary">Monthly Summary</option>
      </select>

      {view === "summary" && (
        <div className="summary-box">
          <h3>📊 Monthly Summary Dashboard</h3>

          <div className="summary-inputs">
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year"
            />
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="Month"
              min="1"
              max="12"
            />
            <button onClick={fetchSummary} className="add-btn">
              🔍 Load Summary
            </button>
          </div>

          {!summary && <p>No summary loaded</p>}

          {summary && (
            <>
              {/* 📦 QUANTITY CHART */}
              <div className="chart-card">
                <h4>📦 Orders by Category (Quantity)</h4>

                <div className="chart-wrapper">
                  <BarChart
                    width={900}
                    height={400}
                    data={Object.entries(
                      summary.quantityByCatagory
                    ).map(([category, qty]) => ({
                      category,
                      quantity: qty,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#3498db" />
                  </BarChart>

                  <div className="total-box">
                    <b>Total Products Sold</b>
                    <div style={{ fontSize: "32px", marginTop: "10px" }}>
                      {totalQuantity}
                    </div>
                  </div>
                </div>
              </div>

              {/* 💰 PROFIT CHART */}
              <div className="chart-card">
                <h4>💰 Profit by Category</h4>

                <div className="chart-wrapper">
                  <BarChart
                    width={900}
                    height={400}
                    data={Object.entries(
                      summary.profitByCatagory
                    ).map(([category, val]) => ({
                      category,
                      profit: val,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="profit" fill="#2ecc71" />
                  </BarChart>

                  <div className="total-box">
                    <b>Total Profit</b>
                    <div style={{ fontSize: "32px", marginTop: "10px" }}>
                      ₹{totalProfit}
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔻 LOSS CHART */}
              <div className="chart-card">
                <h4>🔻 Loss by Category</h4>

                <div className="chart-wrapper">
                  <BarChart
                    width={900}
                    height={400}
                    data={Object.entries(
                      summary.lossByCatagory
                    ).map(([category, val]) => ({
                      category,
                      loss: val,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="loss" fill="#e74c3c" />
                  </BarChart>

                  <div className="total-box">
                    <b>Total Loss</b>
                    <div style={{ fontSize: "32px", marginTop: "10px" }}>
                      ₹{totalLoss}
                    </div>
                  </div>
                </div>
              </div>

              {/* PIE CHARTS */}
              <div className="chart-card">
                <h4>🛒 Sub-Category Distribution</h4>

                <div className="pie-grid">
                  {Object.entries(summary.pieChartByCatagory).map(
                    ([category, subcats]) => (
                      <div key={category} className="single-pie-card">
                        <h5>{category}</h5>

                        <PieChart width={300} height={300}>
                          <Pie
                            data={Object.entries(subcats).map(
                              ([subcat, count]) => ({
                                name: subcat,
                                value: count,
                              })
                            )}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={100}
                            fill="#22a8d1ff"
                            label
                          />
                          <Tooltip />
                        </PieChart>
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {view === "products" && (
        <div className="product-form">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="catagory"
            placeholder="Category"
            value={formData.catagory}
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="text"
            name="availability"
            placeholder="Availability"
            value={formData.availability}
            onChange={handleChange}
          />

          {editId ? (
            <button className="update-btn" onClick={handleUpdate}>
              🔄 Update Product
            </button>
          ) : (
            <button className="add-btn" onClick={handleAdd}>
              ➕ Add Product
            </button>
          )}
        </div>
      )}

      {view === "users" && (
        <div className="user-controls">
          <button className="add-btn" onClick={handleAddUser}>
            ➕ Add User
          </button>
        </div>
      )}

      {(view === "products" || view === "orders" || view === "users") && (
        <div className="manager-table">
          {data.length > 0 ? (
            <table>
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    {Object.values(item).map((val, i) => (
                      <td key={i}>
                        {typeof val === "object" && val !== null
                          ? JSON.stringify(val)
                          : val}
                      </td>
                    ))}

                    {view === "products" && (
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(item.id)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(item.id)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    )}

                    {view === "orders" && (
                      <td>
                        <button
                          className="update-btn"
                          onClick={() => handleUpdateOrder(item.id)}
                        >
                          🔄 Update Status
                        </button>

                        <button
                          className="update-btn"
                          style={{ marginLeft: "10px" }}
                          onClick={() => handleSetOprice(item.id)}
                        >
                          💰 Set O-Price
                        </button>
                      </td>
                    )}

                    {view === "users" && (
                      <td>
                        <button
                          className="update-btn"
                          onClick={() => handleUpdateRole(item.id)}
                        >
                          🧩 Update Role
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleRemoveUser(item.id)}
                        >
                          ❌ Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No records found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Managerdashboard;
