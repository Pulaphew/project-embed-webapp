import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import classifyRoutes from "./routes/classifyRoutes.js"; // Import classify routes
import netpieRoutes from "./routes/netpieRoutes.js";  
import { connectNetpie } from "./netpie/mqttClient.js";
import { initWebSocketServer } from "./ws/wsServer.js";

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
app.use("/api/netpie", netpieRoutes);

// Start the server
const port = process.env.PORT || 8000;
const backendUrl = process.env.BACKEND_URL || "http://localhost";
const server = http.createServer(app);
initWebSocketServer(server);

connectNetpie();

server.listen(port, () => {
  console.log(`Server running on ${backendUrl}:${port}`);
});