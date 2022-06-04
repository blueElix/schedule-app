import { useState, useEffect, useReducer } from "react";
import { getServices, getServicesUsers } from "src/api";
import { toastMsg } from "src/helpers/toast";
import useLocalStorage from "./useLocalStorage";

const useServices = () => {
  const [user] = useLocalStorage("user");

  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [servicesStaffs, setServicesStaffs] = useState([]);

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

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true);
        const result = await getServices(
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
          setServices(data.data);
          setIsLoading(false);
        }, 200);
      } catch (err) {
        toastMsg("error", err.message);
        setIsLoading(false);
      }
    };
    run();
  }, [filters]);

  const getServicesStaffs = async () => {
    try {
      setIsLoading(true);
      const { data: staffs } = await getServicesUsers({
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setServicesStaffs(staffs.data);
      setIsLoading(false);
    } catch (error) {
      toastMsg("error", error.message);
      setIsLoading(false);
    }
  };

  return {
    filters,
    filtersDispatch,
    services,
    pagination,
    isLoading,
    setServices,
    setPagination,
    getServicesStaffs,
    servicesStaffs,
  };
};

export default useServices;
