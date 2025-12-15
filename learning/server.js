import express from "express";
import sequelize from "./db.js";
import models from "./models.js";

const app = express();
app.use(express.json());

// ✅ Sync models
sequelize.sync({ force: false }).then(() => {
  console.log("✅ Tables synced with database");
});

app.use("/api", models);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});