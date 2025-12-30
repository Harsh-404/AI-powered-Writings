require('dotenv').config();
const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function rewriteWithLLM(originalContent, ref1, ref2) {
  const prompt = `
You are a professional SEO content writer.

ORIGINAL ARTICLE:
${originalContent}

REFERENCE ARTICLE 1:
${ref1}

REFERENCE ARTICLE 2:
${ref2}

TASK:
Rewrite the original article so that:
- Its structure, formatting, and depth are similar to the reference articles
- The meaning is preserved
- The content is original and plagiarism-free
- SEO, clarity, and readability are improved
- Use proper headings and subheadings
- End with a "References" section
`;

  const completion = await client.chat.completions.create({
    model: "xiaomi/mimo-v2-flash:free",
    messages: [
      { role: "user", content: prompt },
    ],
  });

  return completion.choices[0].message.content;
}

module.exports = rewriteWithLLM;
