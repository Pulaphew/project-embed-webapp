// ...existing code...
export type SubscribeResponse = {
    ok?: boolean;
    granted?: any;
    error?: string;
    [k: string]: any;
};

/**
 * Request backend to subscribe to a NETPIE topic.
 * Backend will log/forward messages per its implementation.
 */
export const subscribeToNetpie = async (topic: string): Promise<SubscribeResponse> => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost';
    const backendPort = process.env.REACT_APP_BACKEND_PORT || '8000';
    const apiUrl = `${backendUrl}:${backendPort}/api/netpie/subscribe`;

    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic }),
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err || res.statusText);
        }

        console.log("response" , await res.json());

        return await res.json();
    } catch (error) {
        console.error('subscribeToNetpie error:', error);
        return { ok: false, error: (error as Error).message };
    }
};
// ...existing code...