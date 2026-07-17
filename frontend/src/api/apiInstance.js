import axios from "axios"

const apiInstance = axios.create({
    baseURL : 'http://localhost:3000/api'
})

apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default apiInstance;
