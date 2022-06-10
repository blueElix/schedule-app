import axios from "axios";

import { API } from "../../config";

// authentication
export const login = (userLogin) => axios.post(`${API}/auth/login`, userLogin);

export const register = (userRegister) => axios.post(`${API}/auth/register`, userRegister);

export const getUserDetails = (token) =>
  axios.get(`${API}/auth/getMe`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const changePassword = (userPayload, header) =>
  axios.put(`${API}/auth/update-password`, userPayload, header);

export const createUser = (userPayload, header) =>
  axios.post(`${API}/admin/users`, userPayload, header);

export const getStaffs = (header, { limit = 1, page = 1, sort = "createdAt", search = "" }) =>
  axios.get(`${API}/admin/users?limit=${limit}&page=${page}&sort=${sort}&search=${search}`, header);

export const getStaff = (staffId, header) => axios.get(`${API}/admin/users/${staffId}`, header);

export const updateStaff = (staffId, staffPayload, header) =>
  axios.put(`${API}/admin/users/${staffId}`, staffPayload, header);

export const deleteStaff = (staffId, header) =>
  axios.delete(`${API}/admin/users/${staffId}`, header);

// barangays
export const getBarangays = (header, { limit = 1, page = 1, sort = "createdAt", search = "" }) =>
  axios.get(
    `${API}/admin/barangays?limit=${limit}&page=${page}&sort=${sort}&search=${search}`,
    header
  );

export const getBarangay = (barangayId, header) =>
  axios.get(`${API}/admin/barangays/${barangayId}`, header);

export const createBarangay = (barangayPayload, header) =>
  axios.post(`${API}/admin/barangays`, barangayPayload, header);

export const updateBarangay = (barangayId, barangayPayload, header) =>
  axios.put(`${API}/admin/barangays/${barangayId}`, barangayPayload, header);

export const deleteBarangay = (barangayId, header) =>
  axios.delete(`${API}/admin/barangays/${barangayId}`, header);

// services
export const getServices = (header, { limit = 1, page = 1, sort = "createdAt", search = "" }) =>
  axios.get(
    `${API}/admin/services?limit=${limit}&page=${page}&sort=${sort}&search=${search}`,
    header
  );

export const getService = (serviceId, header) =>
  axios.get(`${API}/admin/services/${serviceId}`, header);

export const createService = (servicePayload, header) =>
  axios.post(`${API}/admin/services`, servicePayload, header);

export const updateService = (serviceId, servicePayload, header) =>
  axios.put(`${API}/admin/services/${serviceId}`, servicePayload, header);

export const deleteService = (serviceId, header) =>
  axios.delete(`${API}/admin/services/${serviceId}`, header);

export const getServicesUsers = (header) => axios.get(`${API}/barangays/services/users`, header);

// schedules
export const getSchedules = (header, { limit = 1, page = 1, sort = "createdAt", search = "" }) =>
  axios.get(
    `${API}/admin/schedules?limit=${limit}&page=${page}&sort=${sort}&search=${search}`,
    header
  );

export const getSchedule = (scheduleId, header) =>
  axios.get(`${API}/admin/schedules/${scheduleId}`, header);

export const createSchedule = (schedulePayload, header) =>
  axios.post(`${API}/admin/schedules`, schedulePayload, header);

export const updateSchedule = (scheduleId, schedulePayload, header) =>
  axios.put(`${API}/admin/schedules/${scheduleId}`, schedulePayload, header);

export const deleteSchedule = (scheduleId, header) =>
  axios.delete(`${API}/admin/schedules/${scheduleId}`, header);

// bookings
export const getBookings = (header, { limit = 1, page = 1, sort = "createdAt", search = "" }) =>
  axios.get(
    `${API}/barangays/bookings?limit=${limit}&page=${page}&sort=${sort}&search=${search}`,
    header
  );

export const getBookingsByBarangay = (
  staffId,
  header,
  { limit = 1, page = 1, sort = "createdAt", search = "" }
) =>
  axios.get(
    `${API}/barangays/bookings/barangay-staff/${staffId}?limit=${limit}&page=${page}&sort=${sort}&search=${search}`,
    header
  );

export const getBookingsByServices = (
  staffId,
  header,
  { limit = 1, page = 1, sort = "createdAt", search = "" }
) =>
  axios.get(
    `${API}/barangays/bookings/service-staff/${staffId}?limit=${limit}&page=${page}&sort=${sort}&search=${search}`,
    header
  );

export const getBooking = (bookingId, header) =>
  axios.get(`${API}/barangays/bookings/${bookingId}`, header);

export const createBooking = (bookingPayload, header) =>
  axios.post(`${API}/barangays/bookings`, bookingPayload, header);

export const updateBooking = (bookingId, bookingPayload, header) =>
  axios.put(`${API}/barangays/bookings/${bookingId}`, bookingPayload, header);

export const deleteBooking = (bookingId, header) =>
  axios.delete(`${API}/barangays/bookings/${bookingId}`, header);

export const getServicesSchedules = (staffId, header) =>
  axios.get(`${API}/services/${staffId}/schedules`, header);
