import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Link from "next/link";
import moment from "moment";

import useServices from "src/hooks/useServices";
import Loader from "../Loader/Loader";

const ServicesScheduleTableView = ({ schedules }) => {
  const { services, filtersDispatch, isLoading } = useServices();

  useEffect(() => {
    filtersDispatch({
      type: "limit",
      payload: 1000,
    });
  }, []);

  if (!Array.isArray(schedules)) {
    return null;
  }

  const renderServices = (serviceId) => {
    if (services.length > 0 && serviceId) {
      const currentScheduleServices = services.find(
        ({ id }) => id.toString() === serviceId.toString()
      );
      return currentScheduleServices ? currentScheduleServices.name : "";
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Services</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Availability</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule, index) => (
              <TableRow
                key={schedule.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th">{index + 1}</TableCell>
                <TableCell scope="row">
                  <Link href={{ pathname: `/services-schedules/${schedule.id}` }}>
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <a className="styleLink">{renderServices(schedule.service_id)}</a>
                    )}
                  </Link>
                </TableCell>
                <TableCell>
                  {schedule.sched_date ? moment(schedule.sched_date).format("M/D/YYYY") : ""}
                </TableCell>
                <TableCell>
                  {schedule.start_time
                    ? moment(schedule.start_time, "HH:mm:ss").format("HH:mm A")
                    : ""}
                </TableCell>
                <TableCell>
                  {schedule.end_time ? moment(schedule.end_time, "HH:mm:ss").format("HH:mm A") : ""}
                </TableCell>
                <TableCell>{schedule.is_available ? "Available" : "Not available"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ServicesScheduleTableView;
