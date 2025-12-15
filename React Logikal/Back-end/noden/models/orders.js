// models/orders.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Order = sequelize.define(
  "orders",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    oprice: {
        type: DataTypes.DECIMAL(10, 2),
         allowNull: true
    },
    status: {
      type: DataTypes.ENUM("Pending", "Shipped", "Delivered"),
      defaultValue: "Pending",
    },
    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
  
);

