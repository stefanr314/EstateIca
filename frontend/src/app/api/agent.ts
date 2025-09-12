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
        const res = await axios.get("/auth/refresh", { withCredentials: true });
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
  hardDelete: <T>(url: string, body?: T) =>
    axios.delete(url, { data: body }).then(responseBody),
  formPost: (
    url: string,
    body: Record<string, any>,
    files?: File[],
    fileKey = "images"
  ): Promise<any> => {
    const formData = new FormData();

    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });

    files?.forEach((file) => formData.append(fileKey, file));

    return axios.post(url, formData).then(responseBody);
  },
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
  //POST
  createResidentialEstate: (body: any, images?: File[]) =>
    requests.formPost("/estates/residential", body, images),

  createBusinessEstate: (body: any, images?: File[]) =>
    requests.formPost("/estates/business", body, images),

  //GET
  getAllResidentialEstates: (params?: URLSearchParams) =>
    requests.get("/estates/residential/all", params),

  getAllBusinessEstates: (params?: URLSearchParams) =>
    requests.get("/estates/business/all", params),

  getEstateById: (estateId: string) => requests.get(`/estates/${estateId}`),

  getAllPersonalEstates: (params?: URLSearchParams) =>
    requests.get("/estates/me", params),

  //PATCH
  updateEstate: (estateId: string, body: any) =>
    requests.patch(`/estates/${estateId}`, body),

  updateResidentialAmenities: (estateId: string, body: any) =>
    requests.patch(`/estates/${estateId}/update-amenities`, body),

  updateBusinessAmenities: (estateId: string, body: any) =>
    requests.patch(`/estates/${estateId}/update-business-amenities`, body),

  toggleEstateVisibility: (estateId: string) =>
    requests.patch(`/estates/visibility/${estateId}`),

  deleteEstate: (estateId: string) => requests.delete(`/estates/${estateId}`),

  //HARD DELETE
  hardDeleteEstate: (estateId: string, body: { userPassword: string }) =>
    requests.hardDelete(`/estates/hardDelete/${estateId}`, body),
};

const EstatesImages = {
  addImages: (estateId: string, body: Record<string, any>, files?: File[]) =>
    requests.formPost(`/estates/${estateId}/images`, body, files),
  deleteImage: (estateId: string, fileId: string) =>
    requests.hardDelete(`/estates/${estateId}/images/${fileId}`),
};

const Location = {
  search: (input: string) =>
    requests.get("/location/search", new URLSearchParams({ input })),
};

const Reservation = {
  estateReservations: (estateId: string, params?: URLSearchParams) =>
    requests.get(`/reservations/estate/${estateId}`, params),
  myReservations: (params?: URLSearchParams) =>
    requests.get("/reservations/my", params),

  reservationById: (reservationId: string) =>
    requests.get(`/reservations/${reservationId}/preview`),

  hostReservations: (params?: URLSearchParams) =>
    requests.get("/reservations/complete-host-reservations", params),

  pendingHostReservations: (params?: URLSearchParams) =>
    requests.get("/reservations/pending-host-reservations", params),

  unavailableDates: (estateId: string) =>
    requests.get(`/reservations/estate/${estateId}/unavailable-dates`),

  // POST
  lockDates: (estateId: string, body: any) =>
    requests.post(`/reservations/estate/${estateId}/lock-dates`, body),

  createResidential: (estateId: string, body: any) =>
    requests.post(`/reservations/create-reservation/${estateId}`, body),

  createBusiness: (estateId: string, body: any) =>
    requests.post(
      `/reservations/create-business-reservation/${estateId}`,
      body
    ),

  // PATCH
  updateStatus: (reservationId: string, body: any) =>
    requests.patch(`/reservations/${reservationId}/status`, body),

  updateDates: (reservationId: string, body: any) =>
    requests.patch(`/reservations/${reservationId}/update-dates`, body),

  updateGuestCount: (reservationId: string, body: any) =>
    requests.patch(`/reservations/${reservationId}/update-guest-count`, body),

  updateBusinessUnitCount: (reservationId: string, body: any) =>
    requests.patch(
      `/reservations/${reservationId}/update-business-unitCount`,
      body
    ),

  extend: (reservationId: string, body: any) =>
    requests.patch(`/reservations/${reservationId}/extend-reservation`, body),

  approvePending: (reservationId: string) =>
    requests.patch(
      `/reservations/${reservationId}/approve-pending-reservation`
    ),

  denyPending: (reservationId: string) =>
    requests.patch(`/reservations/${reservationId}/deny-pending-reservation`),

  approveBusinessUnitCount: (reservationId: string) =>
    requests.patch(`/reservations/${reservationId}/approve-business-unitCount`),

  denyBusinessUnitCount: (reservationId: string) =>
    requests.patch(`/reservations/${reservationId}/deny-business-unitCount`),

  confirmLongTermResidential: (reservationId: string) =>
    requests.patch(
      `/reservations/${reservationId}/confirm-longterm-residential`
    ),

  confirmBusiness: (reservationId: string) =>
    requests.patch(`/reservations/${reservationId}/confirm-business`),

  cancel: (reservationId: string) =>
    requests.patch(`/reservations/${reservationId}/cancel`),

  denyByHost: (reservationId: string) =>
    requests.patch(`/reservations/${reservationId}/deny`),

  complete: (reservationId: string) =>
    requests.patch(`/reservations/${reservationId}/complete`),

  //HARD DELETE
  unlockDates: (
    estateId: string,
    body: { startDate: string; endDate: string }
  ) =>
    requests.hardDelete(`/reservations/estate/${estateId}/unlock-dates`, body),
};

const Reviews = {
  getReviewsByEstate: (estateId: string, params?: URLSearchParams) =>
    requests.get(`/reviews/for-estate/${estateId}`, params),

  getReviewById: (reviewId: string) =>
    requests.get(`/reviews/${reviewId}/preview`),

  createReview: (
    reservationId: string,
    body: {
      rating: {
        overall: number;
        cleanliness: number;
        amenities: number;
        host: number;
        location: number;
      };
      comment?: string;
    }
  ) => requests.post(`/reviews/create-from-reservation/${reservationId}`, body),

  updateReview: (
    reviewId: string,
    body: {
      rating: {
        overall: number;
        cleanliness: number;
        amenities: number;
        host: number;
        location: number;
      };
      comment?: string;
    }
  ) => requests.put(`/reviews/${reviewId}/update`, body),
};

const Contract = {
  getContract: (contractId: string) => {
    requests.get(`/contract/${contractId}`);
  },
};

const Wishlist = {
  getWishlist: (params?: URLSearchParams) =>
    requests.get("/wishlist/preview", params),

  addToWishlist: (estateId: string) =>
    requests.patch(`/wishlist/add-estate/${estateId}`),

  removeFromWishlist: (estateId: string) =>
    requests.hardDelete(`/wishlist/remove-estate/${estateId}`),

  clearWishlist: () => requests.hardDelete("/wishlist/clear"),
};

const agent = {
  Auth,
  Users,
  HostRequest,
  Estates,
  EstatesImages,
  Location,
  Reservation,
  Reviews,
  Wishlist,
  Contract,
};

export default agent;
