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

import useSchedules from "src/hooks/useSchedules";
import useServices from "src/hooks/useServices";
import StyleLink from "../StyleLink/StyleLink";

const BookingsTableView = ({ bookings }) => {
  const { services, filtersDispatch: serviceDispatch } = useServices();
  const { schedules, filtersDispatch } = useSchedules();

  useEffect(() => {
    serviceDispatch({
      type: "limit",
      payload: 1000,
    });
    filtersDispatch({
      type: "limit",
      payload: 1000,
    });
  }, []);
  if (!Array.isArray(bookings)) {
    return null;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Contact #</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Schedule</TableCell>
            <TableCell>Services</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {services.length > 0 &&
          schedules.length > 0 &&
          Array.isArray(bookings) &&
          bookings.length > 0 ? (
            bookings.map((booking, index) => {
              const currentSched = schedules.find(({ id }) => id == booking.sched_id);
              const currentService = services.find(({ id }) => id == booking.service_id);
              return (
                <TableRow
                  key={booking.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th">{index + 1}</TableCell>
                  <TableCell scope="row">
                    <Link href={{ pathname: `/bookings/${booking.id}` }}>
                      <a className="styleLink">{booking.client_name}</a>
                    </Link>
                  </TableCell>
                  <TableCell>{booking.client_contact}</TableCell>
                  <TableCell>{booking.client_email}</TableCell>
                  <TableCell>
                    {currentSched.sched_date
                      ? moment(currentSched.sched_date).format("M/D/YYYY")
                      : ""}{" "}
                    - (
                    {currentSched.start_time
                      ? moment(currentSched.start_time, "HH:mm:ss").format("HH:mm A")
                      : ""}{" "}
                    -{" "}
                    {currentSched.end_time
                      ? moment(currentSched.end_time, "HH:mm:ss").format("HH:mm A")
                      : ""}
                    )
                  </TableCell>
                  <TableCell>
                    <TableCell>{currentService ? currentService.name : ""}</TableCell>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6}> No Bookings available.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookingsTableView;
