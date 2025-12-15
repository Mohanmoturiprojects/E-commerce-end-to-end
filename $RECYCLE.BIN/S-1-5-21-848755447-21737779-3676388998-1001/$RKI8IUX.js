import express from "express";
import { WmsProduct } from "./models/product.js";
import { Storage } from "./models/storage.js";
import { GateIn } from "./models/gatein.js";


const allocateRoute = express.Router();


allocateRoute.post("/allocate", async (req, res) => {
  try {
    const { productId, location } = req.body;

    if (!productId || !location) {
      return res.status(400).json({ message: "Product ID and Location required" });
    }

    // Check storage area
    const storage = await Storage.findOne({ where: { location } });

    if (!storage) {
      return res.status(404).json({ message: "Storage location not found" });
    }

    if (storage.status === "occupied") {
      return res.status(400).json({ message: "Storage area already occupied" });
    }

    // Update product
    const product = await WmsProduct.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update({ StorageArea: location });

    // Update storage
    await storage.update({ status: "occupied" });

    res.json({
      message: "Product allocated successfully",
      product,
      storage,
    });
  } catch (err) {
    res.status(500).json({
      message: "Allocation failed",
      error: err.message,
    });
  }
});


      allocateRoute.post("/free", async (req, res) => {
  try {
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ message: "Location required" });
    }

    // Reset storage
    const storage = await Storage.findOne({ where: { location } });

    if (!storage) {
      return res.status(404).json({ message: "Storage not found" });
    }

    // Remove from product
    const product = await WmsProduct.findOne({ where: { StorageArea: location } });

    if (product) {
      await product.update({ StorageArea: null });
    }

    await storage.update({ status: "free" });

    res.json({ message: "Storage freed successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Freeing storage failed",
      error: err.message,
    });
  }
});



     allocateRoute.post("/", async (req, res) => {
  try {
    const { Veihleno, dname, pname, quantity } = req.body;

    // Validate required fields
    if (!Veihleno || !dname || !pname || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new GateIn record
    const gateInRecord = await gate_in.create({
      Veihleno,
      dname,
      pname,
      quantity,
      // receivedAt will auto-generate
    });

    res.json({ message: "✅ GateIn record added successfully", gateInRecord });
  } catch (err) {
    res.status(500).json({
      message: "Failed to add GateIn record",
      error: err.message,
    });
  }
});

// GET: Fetch all GateIn records
allocateRoute.get("/", async (req, res) => {
  try {
    const records = await gate_in.findAll();
    res.json(records);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch GateIn records",
      error: err.message,
    });
  }
});
export default allocateRoute;
