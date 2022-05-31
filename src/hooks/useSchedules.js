import { useState, useEffect, useReducer } from "react";
import { getSchedules } from "src/api";
import { toastMsg } from "src/helpers/toast";
import useLocalStorage from "./useLocalStorage";

const useSchedules = () => {
  const [user] = useLocalStorage("user");

  const [schedules, setSchedules] = useState([]);
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

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true);
        const result = await getSchedules(
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
          setSchedules(data.data);
          setIsLoading(false);
        }, 200);
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
    schedules,
    pagination,
    isLoading,
    setSchedules,
    setPagination,
  };
};

export default useSchedules;
