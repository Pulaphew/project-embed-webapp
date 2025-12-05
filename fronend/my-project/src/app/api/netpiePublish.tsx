// ...existing code...
export type PublishResponse = {
    ok?: boolean;
    error?: string;
    [k: string]: any;
};

/**
 * Publish a message to NETPIE via backend.
 * @param topic MQTT topic string
 * @param payload any JSON-serializable payload
 */
export const publishToNetpie = async (topic: string, payload: any): Promise<PublishResponse> => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost';
    const backendPort = process.env.REACT_APP_BACKEND_PORT || '8000';
    const apiUrl = `${backendUrl}:${backendPort}/api/netpie/publish`;

    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic, payload }),
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err || res.statusText);
        }

        // console.log('Publish to NETPIE successful:', topic, payload);
        console.log("response" , res);

        return await res.json();
    } catch (error) {
        console.error('publishToNetpie error:', error);
        return { ok: false, error: (error as Error).message };
    }
};
// ...existing code...