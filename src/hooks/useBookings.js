import { useState, useEffect, useReducer } from "react";
import { getBookings, getBookingsByBarangay, getBookingsByServices } from "src/api";
import { toastMsg } from "src/helpers/toast";
import useLocalStorage from "./useLocalStorage";

const useBookings = () => {
  const [user] = useLocalStorage("user");

  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const initialState = {
    sort: "created_at",
    search: "",
    page: 1,
    limit: 10,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "sort":
        state.sort = action.payload;
        return { ...state };
      case "page":
        state.page = action.payload;
        return { ...state };
      case "search":
        state.search = action.payload;
        return { ...state };
      case "limit":
        state.limit = action.payload;
        return { ...state };
      case "reset":
        return { ...initialState };
      default:
        return state;
    }
  };

  const [filters, filtersDispatch] = useReducer(reducer, initialState);

  const initBookings = async () => {
    setIsLoading(true);
    const result = await getBookings(
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
      },
      {
        limit: filters.limit,
        page: filters.page,
        sort: filters.sort,
        search: filters.search,
      }
    );
    const data = result.data;

    setTimeout(() => {
      setPagination({ ...data, limit: filters.limit, page: filters.page });
      setBookings(data.data);
      setIsLoading(false);
    }, 200);
  };

  const initBarangayBookings = async () => {
    setIsLoading(true);
    const result = await getBookingsByBarangay(
      user.user.id,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
      },
      {
        limit: filters.limit,
        page: filters.page,
        sort: filters.sort,
        search: filters.search,
      }
    );
    const data = result.data;

    setTimeout(() => {
      setPagination({ ...data, limit: filters.limit, page: filters.page });
      setBookings(data.data);
      setIsLoading(false);
    }, 200);
  };

  const initServicesBookings = async () => {
    setIsLoading(true);
    const result = await getBookingsByServices(
      user.user.id,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
      },
      {
        limit: filters.limit,
        page: filters.page,
        sort: filters.sort,
        search: filters.search,
      }
    );
    const data = result.data;

    setTimeout(() => {
      setPagination({ ...data, limit: filters.limit, page: filters.page });
      setBookings(data.data);
      setIsLoading(false);
    }, 200);
  };
  useEffect(() => {
    const run = async () => {
      try {
        if (user.user.role === "ADMIN") {
          initBookings();
        } else if (user.user.role === "BARANGAY") {
          initBarangayBookings();
        } else if (user.user.role === "SERVICE") {
          initServicesBookings();
        }
      } catch (err) {
        toastMsg("error", err.message);
        setIsLoading(false);
      }
    };
    run();
  }, [filters]);

  return {
    filters,
    filtersDispatch,
    bookings,
    pagination,
    isLoading,
    setBookings,
    setPagination,
  };
};

export default useBookings;
