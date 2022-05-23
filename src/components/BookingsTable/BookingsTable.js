import { useState } from "react";
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
import useModalState from "src/hooks/useModalState";
import DeletingModal from "../Modal/DeletingModal";
import { schedules } from "src/__mocks__/schedules";
import { services } from "src/__mocks__/services";
import StyleLink from "../StyleLink/StyleLink";

const BookingsTable = ({ bookings, setBookings }) => {
  const { show, handleClose, handleShow } = useModalState();
  const [selectedId, setSelectedId] = useState(null);

  if (!Array.isArray(bookings)) {
    return null;
  }

  return (
    <>
      <DeletingModal
        show={show}
        onClose={() => {
          handleClose();
          setSelectedId(null);
        }}
        confirmDelete={() => {
          setBookings(bookings.filter((booking) => booking.id !== selectedId));
          handleClose();
          setSelectedId(null);
        }}
        title="Delete Booking"
        content="Are you sure you want to delete this booking?"
        deleting={false}
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
            {bookings.map((booking, index) => (
              <TableRow key={booking.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th">{index + 1}</TableCell>
                <TableCell scope="row">
                  <Link href={{ pathname: `/bookings/${booking.id}` }}>
                    <StyleLink>{booking.name}</StyleLink>
                  </Link>
                </TableCell>
                <TableCell>+63{booking.contact}</TableCell>
                <TableCell>{booking.email}</TableCell>
                <TableCell>
                  {schedules.find(({ id }) => id === booking.schedule).bookedDate} -{" "}
                  {schedules.find(({ id }) => id === booking.schedule).bookedTime}
                </TableCell>
                <TableCell>{services.find(({ id }) => id === booking.services).name}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BookingsTable;
