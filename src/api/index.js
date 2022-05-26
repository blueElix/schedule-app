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
export const getBarangays = () => axios.get(`${url}/admin/barangay`);

export const getBarangay = (barangayId) => axios.get(`${url}/admin/barangay/${barangayId}`);

export const createBarangay = (barangayPayload, header) =>
  axios.post(`${url}/admin/barangay`, barangayPayload, header);

export const updateBarangay = (barangayId, barangayPayload, header) =>
  axios.put(`${url}/admin/barangay/${barangayId}`, barangayPayload, header);

export const deleteBarangay = (barangayId, header) =>
  axios.delete(`${url}/admin/barangay/${barangayId}`, header);

// services
export const getServices = () => axios.get(`${url}/admin/services`);

export const getService = (serviceId) => axios.get(`${url}/admin/services/${serviceId}`);

export const createService = (servicePayload, header) =>
  axios.post(`${url}/admin/services`, servicePayload, header);

export const updateService = (serviceId, servicePayload, header) =>
  axios.put(`${url}/admin/services/${serviceId}`, servicePayload, header);

export const deleteService = (serviceId, header) =>
  axios.delete(`${url}/admin/services/${serviceId}`, header);
