// models/product.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Product = sequelize.define(
  "products",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    catagory: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
     categoryparent: {     
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    availability: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    
    options: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "products", 
  }
);
