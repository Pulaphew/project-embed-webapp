import type { NextConfig } from "next";
import dotenv from "dotenv";

dotenv.config();

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
    REACT_APP_BACKEND_PORT: process.env.REACT_APP_BACKEND_PORT,
  }
};

export default nextConfig;
