import { DataTypes } from "sequelize";
import sequelize from "./db.js";
import express from "express";

const router = express.Router();

const models = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  availability: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

router.post("/products", async (req, res) => {
  try {
    const { name, category, price, description, availability } = req.body;
    const newProduct = await Product.create({
      name,
      category,
      price,
      description,
      availability,
    });
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default models;
