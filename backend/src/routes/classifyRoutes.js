import express from "express";
import { classify } from "../classify/classifyCommand.js";
import { getClient } from "../netpie/mqttClient.js";

const router = express.Router();

async function publishToNetpie(topic, message) {
  const client = getClient();
  if (!client || !client.connected) {
    console.warn("MQTT client not connected");
    return {ok: false, error: "MQTT client not connected"};
  }

  return new Promise((resolve) => {
    client.publish(topic, message, { qos: 1 }, (err) => {
      if (err) {
        console.warn("NETPIE publish error:", err);
        return resolve({ ok: false, error: err.message });
      }
      console.log(`Published to ${topic}: ${message}`);
      resolve({ ok: true });
    });
    // safety timeout
    setTimeout(() => resolve({ ok: false, error: "Publish timeout" }), 3000);
  })
}

router.post("/", async (req, res) => {
  const inputText = req.body?.text || "";
  inputText.trim();
  let noSpaces = inputText.replace(/\s+/g, '');
  let onlyLetters = noSpaces.replace(/[^a-zA-Z]/g, '');
  console.log("Received text for classification:", onlyLetters);
  const result = classify(onlyLetters);

  let published = false;
  if (result && result !== "unknown") {
    const topic = `@msg/voice-msg`;
    const payload = result;
    const pub = await publishToNetpie(topic, payload);
    published = !!pub.ok;
  }
  res.json({result});
});

export default router;