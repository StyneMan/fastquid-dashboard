import axios from "axios";

export const baseURL =  "https://fast-quid-api-service.vercel.app";  // "http://192.168.1.29:8080"; // "https://server.fastquid.ng" // "http://13.48.5.110:8080"; //

const axiosInstance = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (req) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }
    return req;
  } catch (error) {
    // console.log('request: ', error.response.status)
    return Promise.reject(error);
  }
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;
    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        // console.info('expired');

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const refreshResponse = await axiosInstance.post("/auth/token", {
            refreshToken,
          });
          if (refreshResponse?.data) {
            localStorage.setItem(
              "accessToken",
              refreshResponse?.data.accessToken
            );
            refreshResponse.config.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          }
          return axiosInstance(originalConfig);
        } catch (_error) {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data);
          }
          return Promise.reject(_error);
        }
      }
      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data);
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;

//  rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' \
//  -e "ssh -i ~/.ssh/fqwid-web-test.pem" \
//  . ubuntu@ec2-13-60-84-32.eu-north-1.compute.amazonaws.com:~/app