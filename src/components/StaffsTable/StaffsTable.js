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
import StyleLink from "../StyleLink/StyleLink";
import useLocalStorage from "src/hooks/useLocalStorage";
import { deleteStaff } from "src/api";
import { toastMsg } from "src/helpers/toast";

const StaffsTable = ({ staffs, setStaffs }) => {
  const { show, handleClose, handleShow } = useModalState();
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [user] = useLocalStorage("user");

  if (!Array.isArray(staffs)) {
    return null;
  }

  const handleDeleteStaff = async () => {
    try {
      setIsDeleting(true);
      if (user) {
        await deleteStaff(selectedId, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setTimeout(() => {
          setSelectedId(null);
          setStaffs(staffs.filter((staff) => staff.id !== selectedId));
          setIsDeleting(false);
          handleClose();
          toastMsg("success", "Successfully deleted staff.");
        }, 300);
      }
    } catch (error) {
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
        confirmDelete={handleDeleteStaff}
        title="Delete Staff"
        content="Are you sure you want to delete this staff?"
        deleting={isDeleting}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Type</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffs.map((staff, index) => (
              <TableRow key={staff.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th">{index + 1}</TableCell>
                <TableCell scope="row">
                  <Link href={`staffs/${staff.id}`}>
                    <StyleLink>{staff.full_name}</StyleLink>
                  </Link>
                </TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.contact}</TableCell>
                <TableCell>
                  {staff.type === "BARANGAY_STAFF"
                    ? "Barangay Staff"
                    : staff.type === "SERVICE_STAFF"
                    ? "Services Staff"
                    : "Staff"}
                </TableCell>
                <TableCell width="150px">
                  <IconButton
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      handleShow();
                      setSelectedId(staff.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Link href={`staffs/${staff.id}/edit`}>
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

export default StaffsTable;
