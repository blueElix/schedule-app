import axios from "axios";
const url = "http://localhost:8000/api";

// authentication
export const login = (userLogin) => axios.post(`${url}/auth/login`, userLogin);

export const register = (userRegister) => axios.post(`${url}/auth/register`, userRegister);

export const getUserDetails = (token) =>
  axios.get(`${url}/auth/getMe`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

// barangays
export const getBarangays = (header) => axios.get(`${url}/admin/barangays`, header);

export const getBarangay = (barangayId, header) =>
  axios.get(`${url}/admin/barangays/${barangayId}`, header);

export const createBarangay = (barangayPayload, header) =>
  axios.post(`${url}/admin/barangays`, barangayPayload, header);

export const updateBarangay = (barangayId, barangayPayload, header) =>
  axios.put(`${url}/admin/barangays/${barangayId}`, barangayPayload, header);

export const deleteBarangay = (barangayId, header) =>
  axios.delete(`${url}/admin/barangays/${barangayId}`, header);

// services
export const getServices = (header) => axios.get(`${url}/admin/services`, header);

export const getService = (serviceId, header) =>
  axios.get(`${url}/admin/services/${serviceId}`, header);

export const createService = (servicePayload, header) =>
  axios.post(`${url}/admin/services`, servicePayload, header);

export const updateService = (serviceId, servicePayload, header) =>
  axios.put(`${url}/admin/services/${serviceId}`, servicePayload, header);

export const deleteService = (serviceId, header) =>
  axios.delete(`${url}/admin/services/${serviceId}`, header);
