import express from 'express';
import { connectNetpie, getClient } from '../netpie/mqttClient.js';

const router = express.Router();

connectNetpie();

/**
 * POST /api/netpie/publish
 * body : {topic: string, payload: string|object}
 * Publish a message to the specified topic
 */

router.post('/publish', (req, res) => {
    const { topic, payload, qos = 1, retain = false } = req.body || {};

    if (!topic) return res.status(400).json({ error: "Topic is required" });

    const client = getClient();
    if (!client || !client.connected) {
        return res.status(500).json({ error: "MQTT client not connected" });
    }

    // Correct NETPIE namespace
    const mqttTopic = topic.startsWith('@') ? topic : `@msg/${topic}`;

    // Force string payload
    const message = typeof payload === 'string' ? payload : JSON.stringify(payload);

    client.publish(mqttTopic, message, { qos, retain }, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        console.log(`Published to ${mqttTopic}: ${message}`);
        res.json({ ok: true, topic: mqttTopic });
    });
});


/**
 * POST /api/netpie/subscribe
 * body : {topic: string}
 * Subscribe this backend to the topic (messages will be logged to console)
 */

router.post('/subscribe',(req,res) => {
    const {topic} = req.body || {};
    if (!topic) return res.status(400).json({error: "Topic is required"});

    const client = getClient();
    if (!client || !client.connected) {
        return res.status(500).json({error: "MQTT client not connected"});
    }

    client.subscribe(topic, {qos:1},(err, granted) => {
        if (err) return res.status(500).json({error: err.message});
        res.json({ok: true, granted});
        console.log(`Subscribed to ${topic}:`, granted);
    })
})

export default router;