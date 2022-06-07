import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";

import useSchedules from "src/hooks/useSchedules";
import useModalState from "src/hooks/useModalState";
import DeletingModal from "../Modal/DeletingModal";
import useServices from "src/hooks/useServices";
import { deleteBooking } from "src/api";
import { toastMsg } from "src/helpers/toast";
import useLocalStorage from "src/hooks/useLocalStorage";

const BookingsTable = ({ bookings, setBookings }) => {
  const { show, handleClose, handleShow } = useModalState();
  const [selectedId, setSelectedId] = useState(null);
  const { services, filtersDispatch: servicesDispatch } = useServices();
  const { schedules, filtersDispatch } = useSchedules();
  const [isDeleting, setIsDeleting] = useState(false);
  const [user] = useLocalStorage("user");

  useEffect(() => {
    servicesDispatch({
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

  const handleDeleteBooking = async () => {
    try {
      setIsDeleting(true);
      if (user) {
        await deleteBooking(selectedId, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setTimeout(() => {
          setSelectedId(null);
          setBookings(bookings.filter((booking) => booking.id !== selectedId));
          setIsDeleting(false);
          handleClose();
          toastMsg("success", "Successfully deleted booking.");
        }, 300);
      }
    } catch (error) {
      console.log(error);
      toastMsg("error", "Something went wrong on deleting.");
    }
  };

  return (
    <>
      <DeletingModal
        show={show}
        onClose={() => {
          handleClose();
          setSelectedId(null);
        }}
        confirmDelete={handleDeleteBooking}
        title="Delete Booking"
        content="Are you sure you want to delete this booking?"
        deleting={isDeleting}
      />

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
              <TableCell></TableCell>
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
                    <TableCell>{currentService ? currentService.name : ""}</TableCell>
                    <TableCell width="150px">
                      <IconButton
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          handleShow();
                          setSelectedId(booking.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Link href={`bookings/${booking.id}/edit`}>
                        <IconButton variant="outlined" color="secondary">
                          <EditIcon />
                        </IconButton>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7}> No Bookings available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BookingsTable;
