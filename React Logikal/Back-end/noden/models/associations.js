import { User } from "./user.js";
import { Product } from "./product.js";
import { Order } from "./orders.js";

/*  
   USER ↔ ORDERS   (1 user has many orders)
*/
User.hasMany(Order, {
  foreignKey: "user_id"
});

Order.belongsTo(User, {
  foreignKey: "user_id"
});

/*
   PRODUCT ↔ ORDERS (1 product has many orders)
*/
Product.hasMany(Order, {
  foreignKey: "product_id"
});

Order.belongsTo(Product, {
  foreignKey: "product_id"
});

export { User, Product, Order };
