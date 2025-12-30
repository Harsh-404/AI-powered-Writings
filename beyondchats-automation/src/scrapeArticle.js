

const axios = require("axios");
const cheerio = require("cheerio");

function clean(text) {
  return text.replace(/\s+/g, " ").trim();
}

async function scrapeArticle(urls) {
  const results = [];
  
  for (const item of urls) {
    try {
      const res = await axios.get(item.link);
      const $ = cheerio.load(res.data);

      let content = '';
      
      // Try different selectors for better content extraction
      if (item.link.includes('beyondchats.com')) {
        // Specific selectors for beyondchats.com
        content = $('.entry-content, .post-content, article .content, .blog-content, main article').text() ||
                  $('article').text() ||
                  $('.content').text() ||
                  $('body').text();
      } else {
        // General selectors for other websites
        content = $('article').text() ||
                  $('.entry-content, .post-content, .content-area, main').text() ||
                  $('body').text();
      }

      console.log(`🔍 Scraped ${item.link}: ${content.substring(0, 200)}...`); // Debug log
      
      results.push({
        link: item.link,
        content: clean(content)
      });
    } catch (error) {
      console.error(`Error scraping ${item.link}:`, error.message);
      results.push({
        link: item.link,
        content: ''
      });
    }
  }
  
  return results;
}

module.exports = { scrapeArticle };
