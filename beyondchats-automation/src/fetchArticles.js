

const axios = require('axios');

async function fetchArticles(options = {}) {
  const {
    backendUrl = process.env.BACKEND_API || 'http://localhost:8000/api',
    limit = 10,
    status = 'pending'
  } = options;
  
  try {
    console.log(`Fetching articles from ${backendUrl}/articles`);
    
    const response = await axios.get(`${backendUrl}/articles`, {
      params: {
        limit,
        status,
        sort: 'created_at',
        order: 'desc'
      },
      timeout: 30000
    });
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response format from backend');
    }
    
    const articles = response.data.filter(article => article.isUpdated === false);
    
    console.log(`Successfully fetched ${articles.length} articles`);
 console.log("Successfully fetched articles:", articles);

    return articles;
    
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(`Backend error ${status}: ${data.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('Network error: Unable to reach backend');
    } else {
      throw new Error(`Fetch error: ${error.message}`);
    }
  }
}

module.exports = fetchArticles;
