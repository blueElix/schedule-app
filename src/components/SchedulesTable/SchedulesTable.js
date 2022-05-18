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
import { useState } from "react";
import { services } from "src/__mocks__/services";

const SchedulesTable = ({ schedules, setSchedules }) => {
  const { show, handleClose, handleShow } = useModalState();
  const [selectedId, setSelectedId] = useState(null);

  if (!Array.isArray(schedules)) {
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
          setSchedules(schedules.filter((schedule) => schedule.id !== selectedId));
          handleClose();
          setSelectedId(null);
        }}
        title="Delete Schedule"
        content="Are you sure you want to delete this schedule?"
        deleting={false}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Services</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules
              .filter(({ role }) => role !== "superadmin")
              .map((schedule, index) => (
                <TableRow
                  key={schedule.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th">{index + 1}</TableCell>
                  <TableCell scope="row">
                    <Link href={`schedules/${schedule.id}`}>
                      {services.find(({ id }) => id === schedule.services).name}
                    </Link>
                  </TableCell>
                  <TableCell>{schedule.bookedDate}</TableCell>
                  <TableCell>{schedule.bookedTime}</TableCell>
                  <TableCell>{schedule.isAvailable ? "Available" : "Not available"}</TableCell>
                  <TableCell width="150px">
                    <IconButton
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        handleShow();
                        setSelectedId(schedule.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Link href={`schedules/${schedule.id}/edit`}>
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

export default SchedulesTable;
