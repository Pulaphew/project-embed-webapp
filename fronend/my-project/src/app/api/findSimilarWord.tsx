export const findSimilarWord = async (text: string): Promise<string> => {
  try {
    // Construct the API URL using environment variables
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const backendPort = process.env.REACT_APP_BACKEND_PORT;
    const apiUrl = `${backendUrl}:${backendPort}/api/classify`;

    console.log('API URL:', apiUrl);

    // Make the API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Failed to fetch similar word: ${response.statusText}`);
    }

    // Parse and return the response data
    const data = await response.json();
    return data.result; // Assuming the API returns { result: "similar_word" }
  } catch (error) {
    console.error('Error in findSimilarWord API:', error);
    throw error; // Re-throw the error to handle it in the component
  }
};