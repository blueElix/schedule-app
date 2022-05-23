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
import { schedules } from "src/__mocks__/schedules";
import { services } from "src/__mocks__/services";
import StyleLink from "../StyleLink/StyleLink";

const BookingsTableView = ({ bookings }) => {
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookingsTableView;
