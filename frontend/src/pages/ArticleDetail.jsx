import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchArticleById } from "../api/articles";
import ArticleTabs from "../components/ArticleTabs";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No article ID provided");
      setTimeout(() => navigate("/"), 2000);
      return;
    }
    
    fetchArticleById(id)
      .then(setArticle)
      .catch(err => {
        console.error("Failed to fetch article:", err);
        setError("Failed to load article");
        setTimeout(() => navigate("/"), 2000);
      });
  }, [id, navigate]);

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to home...</p>
        </div>
      </div>
    </div>
  );

  if (!article) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading article...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Articles
        </button>

        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {article.created_at && (
                <span>
                  Published on {new Date(article.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
              {article.category && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                  {article.category}
                </span>
              )}
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <ArticleTabs article={article} />
          </div>
        </article>
      </div>
    </div>
  );
}
