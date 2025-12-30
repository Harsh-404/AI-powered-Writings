import { useState } from "react";

export default function ArticleTabs({ article }) {
  const [active, setActive] = useState("original");

  const originalHtml = article?.content ?? "";
  const updatedHtml = article?.updated_content ?? "";

  const processHtmlContent = (html) => {
    if (!html) return "<p>No content available</p>";
    
    // Clean and format the HTML content for better display
    let processedHtml = html;
    
    // Remove asterisks and clean up markdown-style formatting
    processedHtml = processedHtml.replace(/\*\*\*/g, '');
    processedHtml = processedHtml.replace(/\*\*/g, '');
    processedHtml = processedHtml.replace(/\*/g, '');
    
    // Convert markdown-style headings to proper HTML if needed
    processedHtml = processedHtml.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    processedHtml = processedHtml.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    processedHtml = processedHtml.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    processedHtml = processedHtml.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    processedHtml = processedHtml.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    processedHtml = processedHtml.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    
    // Convert double newlines to paragraph breaks
    processedHtml = processedHtml.replace(/\n\n/g, '</p><p>');
    processedHtml = processedHtml.replace(/^/, '<p>');
    processedHtml = processedHtml.replace(/$/, '</p>');
    
    // Add proper classes to all elements
    processedHtml = processedHtml.replace(/<h1([^>]*)>/g, '<h1$1 class="article-h1">');
    processedHtml = processedHtml.replace(/<h2([^>]*)>/g, '<h2$1 class="article-h2">');
    processedHtml = processedHtml.replace(/<h3([^>]*)>/g, '<h3$1 class="article-h3">');
    processedHtml = processedHtml.replace(/<h4([^>]*)>/g, '<h4$1 class="article-h4">');
    processedHtml = processedHtml.replace(/<h5([^>]*)>/g, '<h5$1 class="article-h5">');
    processedHtml = processedHtml.replace(/<h6([^>]*)>/g, '<h6$1 class="article-h6">');
    processedHtml = processedHtml.replace(/<p([^>]*)>/g, '<p$1 class="article-p">');
    processedHtml = processedHtml.replace(/<ul([^>]*)>/g, '<ul$1 class="article-ul">');
    processedHtml = processedHtml.replace(/<ol([^>]*)>/g, '<ol$1 class="article-ol">');
    processedHtml = processedHtml.replace(/<li([^>]*)>/g, '<li$1 class="article-li">');
    processedHtml = processedHtml.replace(/<blockquote([^>]*)>/g, '<blockquote$1 class="article-blockquote">');
    processedHtml = processedHtml.replace(/<pre([^>]*)>/g, '<pre$1 class="article-pre">');
    processedHtml = processedHtml.replace(/<code([^>]*)>/g, '<code$1 class="article-code">');
    processedHtml = processedHtml.replace(/<a([^>]*)>/g, '<a$1 class="article-a">');
    processedHtml = processedHtml.replace(/<strong([^>]*)>/g, '<strong$1 class="article-strong">');
    processedHtml = processedHtml.replace(/<em([^>]*)>/g, '<em$1 class="article-em">');
    
    // Wrap H2 sections in divs for better separation
    processedHtml = processedHtml.replace(/<h2/g, '<div class="article-section"><h2');
    processedHtml = processedHtml.replace(/<\/h2>/g, '</h2></div>');
    
    // Add horizontal rules where there are triple dashes
    processedHtml = processedHtml.replace(/---/g, '<hr class="article-hr">');
    
    // Clean up any double paragraphs
    processedHtml = processedHtml.replace(/<p><\/p>/g, '');
    processedHtml = processedHtml.replace(/<p>\s*<\/p>/g, '');
    
    return processedHtml;
  };

  return (
    <div>
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActive("original")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
              active === "original"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Original Version</span>
            </div>
          </button>

          {updatedHtml && (
            <button
              onClick={() => setActive("updated")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                active === "updated"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Updated Version</span>
              </div>
            </button>
          )}
        </nav>
      </div>

      <div className="prose prose-lg max-w-none article-content">
        <div
          dangerouslySetInnerHTML={{
            __html: processHtmlContent(
              active === "original"
                ? originalHtml
                : updatedHtml || "<p>No updated version yet</p>"
            )
          }}
        />
      </div>

      <style jsx>{`
        .article-content {
          line-height: 1.7;
          color: #374151;
          font-size: 1.125rem;
        }
        
        .article-section {
          margin: 3rem 0;
          padding: 2rem 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .article-section:first-child {
          margin-top: 0;
        }
        
        .article-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        
        .article-h1 {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 2rem 0;
          color: #111827;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 0.75rem;
        }
        
        .article-h2 {
          font-size: 2rem;
          font-weight: 600;
          line-height: 1.3;
          margin: 0 0 1.5rem 0;
          color: #111827;
          display: flex;
          align-items: center;
        }
        
        .article-h2::before {
          content: '';
          width: 5px;
          height: 1.75rem;
          background-color: #2563eb;
          margin-right: 1rem;
          border-radius: 3px;
        }
        
        .article-h3 {
          font-size: 1.625rem;
          font-weight: 600;
          line-height: 1.3;
          margin: 2rem 0 1rem 0;
          color: #1f2937;
          padding-left: 1.25rem;
        }
        
        .article-h4 {
          font-size: 1.375rem;
          font-weight: 600;
          line-height: 1.3;
          margin: 1.5rem 0 0.75rem 0;
          color: #374151;
          padding-left: 1.75rem;
        }
        
        .article-h5 {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.3;
          margin: 1.25rem 0 0.5rem 0;
          color: #4b5563;
          padding-left: 2.25rem;
        }
        
        .article-h6 {
          font-size: 1.125rem;
          font-weight: 600;
          line-height: 1.3;
          margin: 1rem 0 0.5rem 0;
          color: #6b7280;
          padding-left: 2.75rem;
        }
        
        .article-p {
          margin: 1.25rem 0;
          line-height: 1.8;
          color: #374151;
          text-align: left;
          font-size: 1.125rem;
        }
        
        .article-p:first-child {
          margin-top: 0;
        }
        
        .article-p:last-child {
          margin-bottom: 0;
        }
        
        .article-strong {
          font-weight: 700;
          color: #111827;
        }
        
        .article-em {
          font-style: italic;
          color: #4b5563;
        }
        
        .article-ul, .article-ol {
          margin: 1.25rem 0;
          padding-left: 2rem;
        }
        
        .article-li {
          margin: 0.75rem 0;
          line-height: 1.7;
          color: #374151;
          font-size: 1.125rem;
        }
        
        .article-blockquote {
          border-left: 5px solid #2563eb;
          padding: 1.5rem 2rem;
          margin: 2rem 0;
          background-color: #f8fafc;
          border-radius: 0 0.75rem 0.75rem 0;
          font-style: italic;
          color: #4b5563;
          font-size: 1.125rem;
        }
        
        .article-code {
          background-color: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #dc2626;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-weight: 500;
        }
        
        .article-pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 2rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 2rem 0;
          border: 1px solid #374151;
          font-size: 0.875rem;
        }
        
        .article-pre .article-code {
          background-color: transparent;
          color: inherit;
          padding: 0;
          font-size: inherit;
        }
        
        .article-a {
          color: #2563eb;
          text-decoration: underline;
          transition: color 0.2s;
          font-weight: 500;
        }
        
        .article-a:hover {
          color: #1d4ed8;
        }
        
        .article-hr {
          border: none;
          height: 2px;
          background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          margin: 3rem 0;
        }
        
        /* Table styling */
        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          background-color: white;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .article-content th {
          background-color: #f9fafb;
          padding: 1rem 1.5rem;
          text-align: left;
          font-weight: 600;
          color: #111827;
          border-bottom: 2px solid #e5e7eb;
          font-size: 1rem;
        }
        
        .article-content td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
          font-size: 1rem;
        }
        
        .article-content tr:last-child td {
          border-bottom: none;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .article-h1 {
            font-size: 2rem;
          }
          
          .article-h2 {
            font-size: 1.75rem;
          }
          
          .article-h3 {
            font-size: 1.5rem;
          }
          
          .article-p {
            font-size: 1rem;
          }
          
          .article-section {
            margin: 2rem 0;
            padding: 1.5rem 0;
          }
        }
      `}</style>
    </div>
  );
}
