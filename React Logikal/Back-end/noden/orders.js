// routes/orders.js
import express from "express";
import { Order } from "./models/orders.js";
import { User } from "./models/user.js";
import { Product } from "./models/product.js";
import { Sequelize, Op } from "sequelize";

export const ordersRoute = express.Router();

// Add one or multiple orders 

ordersRoute.post("/add", async (req, res) => {
  const { username, items } = req.body;

  if (!username || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Invalid order data" });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create one record per item
    const orders = items.map((item) => ({
      user_id: user.id,
      product_id: item.product_id,
      quantity: item.quantity,
      total_price: item.total_price,
      status: "Pending",
    }));

    await Order.bulkCreate(orders);

    res.json({
      success: true,
      message: "✅ Orders placed successfully",
      count: orders.length,
    });
  } catch (err) {
    console.error("❌ Error creating orders:", err);
    res.status(500).json({ message: "Error creating orders", error: err.message });
  }
});


   //Fetch all orders for a specific user

ordersRoute.get("/user/:username", async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const orders = await Order.findAll({
      where: { user_id: user.id },
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price", "catagory", "description"],
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      username: req.params.username,
      orderCount: orders.length,
      orders,
    });
  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});


   // Fetch all orders 

ordersRoute.get("/", async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ["username"] },
        { model: Product, attributes: ["name", "price", "catagory"] },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (err) {
    console.error("❌ Error fetching all orders:", err);
    res.status(500).json({ message: "Error fetching all orders", error: err.message });
  }
});


   // Update order status

  ordersRoute.patch("/update-status/:id", async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    order.status = status;
    order.delivered_at = status === "Delivered" ? new Date() : null;
    await order.save();

    res.json({ success: true, message: `✅ Order #${order.id} updated to ${status}` });
  } catch (err) {
    console.error("❌ Error updating order:", err);
    res.status(500).json({ message: "Error updating order", error: err.message });
  }
});
   ordersRoute.patch("/set-oprice/:id", async (req, res) => {
      try {
             const { id } = req.params;
              const { oprice } = req.body;

              if (!oprice) {
               return res.status(400).json({ message: "Oprice is required" });
            }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update only the oprice column
    order.oprice = oprice;
    await order.save();

    return res.json({ message: "Oprice updated successfully", order });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});



ordersRoute.get("/full-dashboard-summary/:year/:month", async (req, res) => {
  try {
    console.log("===== Dashboard Summary Request =====");

    const { year, month } = req.params;
    console.log("Received params:", { year, month });

    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      console.log("Invalid year or month");
      return res.status(400).json({ message: "Invalid year or month" });
    }
    console.log("Parsed year and month:", { yearNum, monthNum });


    // Fetch orders for the requested month/year
    
    const orders = await Order.findAll({
      where: {
        [Op.and]: [
          Sequelize.where(Sequelize.fn("YEAR", Sequelize.col("created_at")), yearNum),
          Sequelize.where(Sequelize.fn("MONTH", Sequelize.col("created_at")), monthNum)
        ]
      },
      include: [
        {
          model: Product,
          attributes: ["categoryparent", "catagory", "price"], 
        }
      ]
    });

    console.log("Orders fetched:", orders.length);
    if (orders.length === 0) {
      console.log("No orders found for this month/year");
    } else {
      console.log("First order fetched:", orders[0].toJSON());
      if (!orders[0].Product) console.log("Warning: First order has no associated Product");
    }

    let dashboard = {
      profitByCatagory: {},
      lossByCatagory: {},
      quantityByCatagory: {},
      pieChartByCatagory: {},
    };

    orders.forEach((order, index) => {
       const product = order.product; 
      if (!product) {
        console.log(`Skipping order at index ${index}: No associated Product`);
        return;
      }

      const parent = product.categoryparent || "Unknown";
      const sub = product.catagory || "Others";

      const qty = Number(order.quantity) || 0;
      const selling = Number(product.price) || 0; // read from Product table
      const original = Number(order.oprice) || 0;
      const profit = (selling - original) * qty;

      // Initialize categories
      if (!dashboard.profitByCatagory[parent]) dashboard.profitByCatagory[parent] = 0;
      if (!dashboard.lossByCatagory[parent]) dashboard.lossByCatagory[parent] = 0;
      if (!dashboard.quantityByCatagory[parent]) dashboard.quantityByCatagory[parent] = 0;
      if (!dashboard.pieChartByCatagory[parent]) dashboard.pieChartByCatagory[parent] = {};

      // Quantity
      dashboard.quantityByCatagory[parent] += qty;

      // Profit / Loss
      if (profit >= 0) dashboard.profitByCatagory[parent] += profit;
      else dashboard.lossByCatagory[parent] += Math.abs(profit);

      // Pie chart by subcategory
      if (!dashboard.pieChartByCatagory[parent][sub]) dashboard.pieChartByCatagory[parent][sub] = 0;
      dashboard.pieChartByCatagory[parent][sub] += qty;
    });

    console.log("Dashboard prepared successfully:", dashboard);

    res.json(dashboard);
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

