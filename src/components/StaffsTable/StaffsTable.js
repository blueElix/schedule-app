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

const StaffsTable = ({ staffs, setStaffs }) => {
  const { show, handleClose, handleShow } = useModalState();
  const [selectedId, setSelectedId] = useState(null);

  if (!Array.isArray(staffs)) {
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
          setStaffs(staffs.filter((staff) => staff.id !== selectedId));
          handleClose();
          setSelectedId(null);
        }}
        title="Delete Staff"
        content="Are you sure you want to delete this staff?"
        deleting={false}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Type</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffs
              .filter(({ role }) => role !== "superadmin")
              .map((staff, index) => (
                <TableRow key={staff.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th">{index + 1}</TableCell>
                  <TableCell scope="row">
                    <Link href={`staffs/${staff.id}`}>
                      <StyleLink>{staff.name}</StyleLink>
                    </Link>
                  </TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>+63{staff.contact}</TableCell>
                  <TableCell>
                    {staff.type === "barangay-staff" ? "Barangay Staff" : "Staff"}
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
