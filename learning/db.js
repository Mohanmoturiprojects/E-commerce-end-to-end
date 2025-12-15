import { Sequelize } from "sequelize";

const sequelize = new Sequelize("mohan", "root", "Mohan@234", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Error connecting DB:", err));

export default sequelize;
