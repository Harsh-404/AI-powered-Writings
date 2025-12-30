const axios = require("axios");

async function googleSearch(title) {
  const apiKey = process.env.SERPER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "SERPER_API_KEY is not set. Please add it to your .env file."
    );
  }

  try {
    const res = await axios.post(
      "https://google.serper.dev/search",
      { q: title, num: 5 },
      {
        headers: {
          "X-API-KEY": apiKey,          // ✅ use X-API-KEY instead of Authorization
          "Content-Type": "application/json"
        },
        maxBodyLength: Infinity          // optional, matches Serper example
      }
    );

    if (!res.data.organic) {
      console.warn("No organic results returned by Serper API.");
      return [];
    }

    return res.data.organic.map(r => r.link);
  } catch (error) {
    console.error(
      "Error calling Serper API:",
      error.response?.data || error.message
    );
    return [];
  }
}

module.exports = googleSearch;
