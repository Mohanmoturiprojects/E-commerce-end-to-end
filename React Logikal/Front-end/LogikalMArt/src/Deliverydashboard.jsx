import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Delivery.css";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const baseURL = "http://localhost:8081/api/delivery";

  useEffect(() => {
    const firstLogin = sessionStorage.getItem("DeliveryFirstLogin");

    if (!firstLogin) {
      setToastMsg("🎉 Login Successful! Welcome Delivery.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      sessionStorage.setItem("DeliveryFirstLogin", "done");
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${baseURL}/orders`);
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch orders error:", err);
      toast.error("Failed to fetch orders", { autoClose: 2000 });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAccept = async (id) => {
    if (!window.confirm("Are you sure you want to accept this order?")) return;

    try {
      await axios.patch(`${baseURL}/orders/${id}/accept`);
      toast.success("Order Accepted & Marked as Shipped", { autoClose: 2000 });
      fetchOrders();
    } catch (err) {
      console.error("Accept order error:", err);
      toast.error("Failed to update status", { autoClose: 2000 });
    }
  };

  const handleDeliver = async (id) => {
    if (!window.confirm("Are you sure you want to deliver this order?")) return;

    try {
      await axios.patch(`${baseURL}/orders/${id}/deliver`);
      toast.success("Order Delivered Successfully", { autoClose: 3000 });
      fetchOrders();
    } catch (err) {
      console.error("Deliver order error:", err);
      toast.error("Failed to deliver order", { autoClose: 2000 });
    }
  };

  return (
    <div className="delivery-dashboard">
      <ToastContainer position="bottom-right" />
      {showToast && <div className="custom-toast">{toastMsg}</div>}

      <h2 className="title">📦 Delivery Dashboard</h2>

      {loading ? (
        <p className="loading">Loading orders...</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Placed At</th>
              <th>Customer Name</th>
              <th>Address</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Delivered At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{new Date(o.created_at).toLocaleString()}</td>
                <td>{o.user?.firstName || "N/A"}</td>
                <td>{o.user?.address || "N/A"}</td>
                <td>{o.product?.name || "N/A"}</td>
                <td>{o.quantity}</td>
                <td>₹{o.quantity * (o.product?.price || 0)}</td>
                <td
                  className={`status ${
                    o.status === "Pending"
                      ? "pending"
                      : o.status === "Shipped"
                      ? "shipped"
                      : "delivered"
                  }`}
                >
                  {o.status}
                </td>
                <td>
                  {o.delivered_at ? new Date(o.delivered_at).toLocaleString() : "-"}
                </td>
                <td>
                  {o.status === "Pending" && (
                    <button className="btn accept" onClick={() => handleAccept(o.id)}>
                      Accept
                    </button>
                  )}
                  {o.status === "Shipped" && (
                    <button className="btn deliver" onClick={() => handleDeliver(o.id)}>
                      Deliver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeliveryDashboard;
