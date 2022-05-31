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

import useModalState from "src/hooks/useModalState";
import DeletingModal from "../Modal/DeletingModal";
import StyleLink from "../StyleLink/StyleLink";
import useServices from "src/hooks/useServices";
import { deleteSchedule } from "src/api";
import useLocalStorage from "src/hooks/useLocalStorage";
import { toastMsg } from "src/helpers/toast";
import Loader from "../Loader/Loader";

const SchedulesTable = ({ schedules, setSchedules }) => {
  const { show, handleClose, handleShow } = useModalState();
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [user] = useLocalStorage("user");

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

  const handleDeleteSchedule = async () => {
    try {
      setIsDeleting(true);
      if (user) {
        await deleteSchedule(selectedId, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setTimeout(() => {
          setSelectedId(null);
          setSchedules(schedules.filter((schedule) => schedule.id !== selectedId));
          setIsDeleting(false);
          handleClose();
          toastMsg("success", "Successfully deleted schedule.");
        }, 300);
      }
    } catch (error) {
      toastMsg("error", "Something went wrong on deleting.");
    }
  };

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
      <DeletingModal
        show={show}
        onClose={() => {
          handleClose();
          setSelectedId(null);
        }}
        confirmDelete={handleDeleteSchedule}
        title="Delete Schedule"
        content="Are you sure you want to delete this schedule?"
        deleting={isDeleting}
      />

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
              <TableCell></TableCell>
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
                  <Link href={{ pathname: `/schedules/${schedule.id}` }}>
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <StyleLink>{renderServices(schedule.service_id)}</StyleLink>
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
