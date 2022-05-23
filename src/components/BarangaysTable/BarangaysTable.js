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
import { deleteBarangay } from "src/api";
import useLocalStorage from "src/hooks/useLocalStorage";
import { toastMsg } from "src/helpers/toast";

const BarangaysTable = ({ barangays, setBarangays }) => {
  const { show, handleClose, handleShow } = useModalState();
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [user] = useLocalStorage("user");

  if (!Array.isArray(barangays)) {
    return null;
  }

  const handleDeleteBarangay = async () => {
    try {
      setIsDeleting(true);
      if (user) {
        await deleteBarangay(selectedId, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setTimeout(() => {
          setSelectedId(null);
          setBarangays(barangays.filter((barangay) => barangay.id !== selectedId));
          setIsDeleting(false);
          handleClose();
          toastMsg("success", "Successfully deleted barangay.");
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
        confirmDelete={handleDeleteBarangay}
        title="Delete Barangay"
        content="Are you sure you want to delete this barangay?"
        deleting={isDeleting}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Barangay</TableCell>
              <TableCell>Address</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {barangays
              .filter(({ role }) => role !== "superadmin")
              .map((barangay, index) => (
                <TableRow
                  key={barangay.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th">{index + 1}</TableCell>
                  <TableCell scope="row">
                    <Link href={{ pathname: `/barangays/${barangay.id}` }}>{barangay.name}</Link>
                  </TableCell>
                  <TableCell>{barangay.address}</TableCell>
                  <TableCell width="150px">
                    <IconButton
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        handleShow();
                        setSelectedId(barangay.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Link href={`barangays/${barangay.id}/edit`}>
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

export default BarangaysTable;
