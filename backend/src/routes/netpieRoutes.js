import express from 'express';
import { connectNetpie, getClient } from '../netpie/mqttClient.js';

const router = express.Router();

connectNetpie();

/**
 * POST /api/netpie/publish
 * body : {topic: string, payload: string|object}
 * Publish a message to the specified topic
 */

router.post('/publlish', (req, res) => {
    const {topic, payload} = req.body || {};
    if (!topic) return res.status(400).json({error: "Topic is required"});

    const client = getClient();
    if (!client || !client.connected) {
        return res.status(500).json({error: "MQTT client not connected"});
    }

    const message = typeof payload === 'string' ? payload : JSON.stringify(payload); // Convert payload to string if it's not
    client.publish(topic, message, (err) => {
        if (err) return res.status(500).json({error: err.message});
        res.json({ok: true});
    })
})

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
    })
})

export default router;