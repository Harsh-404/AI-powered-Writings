

require('dotenv').config();

const fetchArticles = require('./fetchArticles.js');
const googleSearch = require('./googleSearch.js');
const { scrapeArticle } = require('./scrapeArticle.js');
const rewriteWithLLM = require('./rewriteWithLLM.js');
const publishArticle = require('./publishArticle.js');

async function run() {
  const articles = await fetchArticles();

  for (const article of articles) {
    console.log(`🔍 Processing: ${article.title}`);

    const allLinks = await googleSearch(article.title);
    console.log(`🔗 Found ${allLinks.length} total links:`, allLinks);
    
    // Filter out the original source URL to get external references only
    const filteredLinks = allLinks.filter(link => 
      link !== article.source_url && 
      !link.includes('beyondchats.com') // Exclude any beyondchats.com URLs
    );
    
    console.log(`✅ Filtered to ${filteredLinks.length} external links:`, filteredLinks);
    
    if (filteredLinks.length < 2) {
      console.log(`⚠️  Not enough external references found for: ${article.title}`);
      continue;
    }

    const ref1 = await scrapeArticle([{ link: filteredLinks[0] }]);
    const ref2 = await scrapeArticle([{ link: filteredLinks[1] }]);

    // Truncate content to avoid token limit issues
    const maxContentLength = 8000; // characters
    const originalContent = article.content.substring(0, maxContentLength);
    const ref1Content = (ref1[0]?.content || '').substring(0, maxContentLength);
    const ref2Content = (ref2[0]?.content || '').substring(0, maxContentLength);

    const updatedContent = await rewriteWithLLM(
      originalContent,
      ref1Content,
      ref2Content
    );

    // Capture the URLs that were scraped as references
    const scrapedReferences = [
      { url: filteredLinks[0], title: ref1[0]?.title || 'Reference 1' },
      { url: filteredLinks[1], title: ref2[0]?.title || 'Reference 2' }
    ];

    await publishArticle(
      article.id,           // the existing article's ID
      article.title,
      updatedContent,
      scrapedReferences
    );

    console.log(`✅ Published updated article for: ${article.title}`);
  }

  console.log("🎉 Phase 2 completed");
}

run().catch(console.error);
