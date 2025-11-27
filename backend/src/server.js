import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import classifyRoutes from "./routes/classifyRoutes.js"; // Import classify routes

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}`,
    methods: ["POST", "GET"],
  })
);

// Use classify routes
app.use("/api/classify", classifyRoutes);

// Start the server
const port = process.env.PORT || 8000;
const backendUrl = process.env.BACKEND_URL || "http://localhost";
app.listen(port, () => {
  console.log(`Server running on ${backendUrl}:${port}`);
});