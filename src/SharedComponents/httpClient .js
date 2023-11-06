import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const httpClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const get = (url) => {
  return httpClient.get(url);
};

export const post = (url, data) => {
  return httpClient.post(url, data);
};

export const put = (url, data) => {
  return httpClient.put(url, data);
};

export const remove = (url) => {
  return httpClient.delete(url);
};
