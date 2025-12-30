import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 leading-tight line-clamp-2">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="text-gray-600 mt-2 line-clamp-3">
              {article.excerpt}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {article.created_at && (
              <span>
                {new Date(article.created_at).toLocaleDateString()}
              </span>
            )}
            {article.category && (
              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                {article.category}
              </span>
            )}
          </div>
          
          <Link 
            to={`/article/${article.id}`}
            className="btn-primary text-sm px-4 py-2 inline-flex items-center"
          >
            Read More
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
