// yours
// export const API_URL = "http://localhost:5524/";
//nine
export const API_URL =import.meta.env.DEV?"http://localhost:5524/api/" : "https://b15-junsiang.mak3r.dev/api/"

// ✅ 新增：给图片用的 base URL（去掉 /api/ 那段）
export const BASE_URL = API_URL.replace("api/", "");