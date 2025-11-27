import express from "express";
import { classify } from "../classify/classifyCommand.js";

const router = express.Router();

router.post("/", (req, res) => {
  const inputText = req.body?.text || "";
  inputText.trim();
  let noSpaces = inputText.replace(/\s+/g, '');
  let onlyLetters = noSpaces.replace(/[^a-zA-Z]/g, '');
  console.log("Received text for classification:", onlyLetters);
  const result = classify(onlyLetters);
  res.json({result});
});

export default router;