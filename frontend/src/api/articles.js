import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api").replace(/\/$/, "");
console.log("API_BASE:", API_BASE);
console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);

export const fetchArticles = async () => {
  const res = await axios.get(`${API_BASE}/articles`);
  const data = res.data;
  console.log("Articles response:", data);
  return Array.isArray(data) ? data : data?.articles;
};

export const fetchArticleById = async (id) => {
  const res = await axios.get(`${API_BASE}/articles/${id}`);
  return res.data;
};
