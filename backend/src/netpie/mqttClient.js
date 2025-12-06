// ...existing code...
import mqtt from 'mqtt';
import { logToGoogleSheet } from '../services/googleSheets.js'; 

let client = null;

export function connectNetpie() {
    if (client) return client; // Return existing client if already connected

    // Load env vars
    const brokerUrl = process.env.NETPIE_BROKER_URL || 'mqtt://mqtt.netpie.io:1883';
    const clientId = process.env.NETPIE_CLIENT_ID || `backend-${Math.random().toString(16).slice(2, 8)}`;
    // Preferred fields for mqtt.js: username and password
    const username = process.env.NETPIE_USERNAME || process.env.NETPIE_TOKEN;
    const password = process.env.NETPIE_PASSWORD || process.env.NETPIE_SECRET;

    // Debug output to help diagnose "Not authorized"
    console.log('NETPIE broker:', brokerUrl);
    console.log('NETPIE clientId:', clientId);
    console.log('NETPIE username present:', !!username);
    console.log('NETPIE password present:', !!password);

    const options = {
        clientId,
        username,   // mqtt.js expects username/password
        password,
        keepalive: 30, // Keepalive interval in seconds
        reconnectPeriod: 1000, // Reconnect after 1 second
        connectTimeout: 30 * 1000,
        // protocolVersion: 4, // uncomment if you need to force MQTT v3.1.1
    };

    if (!username || !password) {
        console.warn('NETPIE MQTT: credentials missing. Check NETPIE_USERNAME/NETPIE_PASSWORD or NETPIE_TOKEN/NETPIE_SECRET env vars.');
    }

    client = mqtt.connect(brokerUrl, options);

    client.on('connect',() => {
        console.log("MQTT connected to ", brokerUrl, " clientId: ", clientId);
        
        // SUBSCRIBE to the topic sending sensor data
        // Replace '@msg/sensors' with your actual sensor topic
        client.subscribe('@msg/sensors', (err) => {
            if(!err) console.log("Subscribed to sensor data");
        });
    });

    client.on('connect',() => {
        console.log("MQTT connected to ", brokerUrl, " clientId: ", clientId);
    });

    client.on("reconnect",() => console.log("MQTT reconnecting..."));
    client.on("close",() => console.log("MQTT disconnected"));
    client.on("offline",() => console.log("MQTT offline"));
    client.on("error",(err) => console.log("MQTT error: ", err));
    client.on("message",(topic,message) => {
        console.log("MQTT message received on topic ", topic, ": ", message.toString());
    });

    client.on("message", async (topic, message) => {
        const msgString = message.toString();
        console.log("MQTT message received on topic ", topic, ": ", msgString);

        //Check if the topic matches your sensor data topic
        if (topic === '@msg/sensors') {
            try {
                // Parse the JSON data from NETPIE
                // Example Payload: {"temperature": 32, "humidity": 60}
                const data = JSON.parse(msgString);
                
                // Send to Google Sheets
                await logToGoogleSheet(data);
                
            } catch (e) {
                console.error("Failed to parse JSON or save to sheet", e);
            }
        }
    });

    return client;
}

export function getClient(){
    return client;
}
// ...existing code...