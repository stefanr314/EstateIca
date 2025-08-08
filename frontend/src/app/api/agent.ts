import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = "http://localhost:3030/api";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
  const token =
    //   store.getState().account.user?.token ||
    localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Ako je 401 i nismo već pokušali refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Pozivaj endpoint koji koristi refresh token iz cookie-ja
        const res = await axios.post(
          "/auth/refresh",
          {},
          { withCredentials: true }
        );
        const newAccessToken = res.data.accessToken;

        localStorage.setItem("token", newAccessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axios(originalRequest); // retry original request
      } catch (err) {
        // Refresh token fail → logout user
        localStorage.removeItem("token");
        window.location.href = "/login";
        // return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body?: {}) => axios.put(url, body).then(responseBody),
  patch: (url: string, body?: {}) => axios.patch(url, body).then(responseBody),
  delete: (url: string) => axios.patch(url).then(responseBody),
  hardDelete: (url: string) => axios.delete(url).then(responseBody),
};

const Auth = {
  login: (email: string, password: string) =>
    requests.post("/auth/login", { email, password }),
  register: (body: any) => requests.post("/auth/register", body),
  logout: () => requests.post("/auth/logout", {}),
  refresh: () => requests.get("/auth/refresh"),
  verifyAccount: (email: string) => requests.post("/auth/verifyAcc", { email }),
  onVerifyAccount: (token: string) =>
    requests.patch("/auth/onVerifyAcc", { token }),
  forgotPassword: (email: string) =>
    requests.post("/auth/forgotPassword", { email }),
  resetPassword: (body: any) => requests.post("/auth/resetPassword", body),
};

const Users = {
  getAllUsers: (params?: URLSearchParams) =>
    requests.get("/user/getAll", params),
  getUserById: (userId: string) => requests.get(`/user/${userId}`),
  updateUser: (userId: string, body: any) =>
    requests.put(`/user/${userId}`, body),
  toggleActivity: (userId: string) =>
    requests.patch(`/user/toggle-activity/${userId}`),
  deleteUser: (userId: string) => requests.delete(`/user/deactivate/${userId}`),
};

const HostRequest = {
  createHostRequest: (body: any) => requests.post("/host-request/", body),
  getAllHostRequests: (params?: URLSearchParams) =>
    requests.get("/host-request/all-requests", params),
  getHostRequestById: (requestId: string) =>
    requests.get(`/host-request/${requestId}`),
  updateHostRequestStatus: (requestId: string, body: any) =>
    requests.put(`/host-request/${requestId}/status`, body),
  deleteHostRequest: (requestId: string) =>
    requests.delete(`/host-request/${requestId}/archive`),
};

const Estates = {
  createResidentialEstate: (body: any) =>
    requests.post("/estate/residential", body),
  createBusinessEstate: (body: any) => requests.post("/estate/business", body),
  getAllResidentialEstates: (params?: URLSearchParams) =>
    requests.get("/estate/residential/all", params),
  getAllBusinessEstates: (params?: URLSearchParams) =>
    requests.get("/estate/business/all", params),
  getEstateById: (estateId: string) => requests.get(`/estate/${estateId}`),
  getAllPersonalEstates: (params?: URLSearchParams) =>
    requests.get("/estate/me", params),
  updateEstate: (estateId: string, body: any) =>
    requests.patch(`/estate/${estateId}`, body),
  toggleEstateVisibility: (estateId: string) =>
    requests.patch(`/estate/visibility/${estateId}`),
  deleteEstate: (estateId: string) => requests.delete(`/estate/${estateId}`), //needs to be implemented on backend
};

const Location = {
  search: (input: string) =>
    requests.get("/location/search", new URLSearchParams({ input })),
};

const agent = {
  Auth,
  Users,
  HostRequest,
  Estates,
  Location,
};

export default agent;
