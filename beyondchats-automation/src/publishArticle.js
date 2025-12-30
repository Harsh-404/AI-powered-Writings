const axios = require("axios");

async function publishArticle(id, title, content, references) {
    
    console.log(`Publishing article with ID: ${id}, Title: ${title}`);
    
  try {
    await axios.put(`${process.env.BACKEND_API}/articles/${id}`, {
      title: `${title}`,
      updated_content: content,
      isUpdated: true,
      references
    });
    console.log(`✅ Successfully published updated article: ${title}`);
  } catch (error) {
    console.error(`Error publishing updated article:`, error.message);
    throw error;
  }
}

module.exports = publishArticle;
