import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import medicationRoutes from "./routes/medicationRoutes";
import customerRoutes from "./routes/customerRoutes";

const app = express();

app.use(bodyParser.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/medication", medicationRoutes);
app.use("/api/v1/customer", customerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Pharmacy Server running on port ${PORT}`);
});
