import { useState, useEffect, useReducer } from "react";
import { getServicesSchedules } from "src/api";
import { toastMsg } from "src/helpers/toast";
import useLocalStorage from "./useLocalStorage";

const useServicesSchedules = () => {
  const [user] = useLocalStorage("user");
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true);
        const result = await getServicesSchedules(user.user.id, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = result.data;
        console.log(data);
        setTimeout(() => {
          setSchedules(data.data);
          setIsLoading(false);
        }, 200);
      } catch (err) {
        toastMsg("error", err.message);
        setIsLoading(false);
      }
    };
    run();
  }, []);

  return {
    schedules,
    isLoading,
    setSchedules,
  };
};

export default useServicesSchedules;
