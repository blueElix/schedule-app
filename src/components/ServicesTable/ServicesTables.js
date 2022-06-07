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
import useLocalStorage from "src/hooks/useLocalStorage";
import { toastMsg } from "src/helpers/toast";
import { deleteService } from "src/api";

const ServicesTable = ({ services, setServices }) => {
  const { show, handleClose, handleShow } = useModalState();
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [user] = useLocalStorage("user");

  if (!Array.isArray(services)) {
    return null;
  }

  const handleDeleteService = async () => {
    try {
      setIsDeleting(true);
      if (user) {
        await deleteService(selectedId, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setTimeout(() => {
          setSelectedId(null);
          setServices(services.filter((service) => service.id !== selectedId));
          setIsDeleting(false);
          handleClose();
          toastMsg("success", "Successfully deleted service.");
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
        confirmDelete={handleDeleteService}
        title="Delete Service"
        content="Are you sure you want to delete this service?"
        deleting={isDeleting}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service, index) => (
              <TableRow
                key={service.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th">{index + 1}</TableCell>
                <TableCell scope="row">
                  <Link href={{ pathname: `/services/${service.id}` }}>
                    <a className="styleLink">{service.name}</a>
                  </Link>
                </TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell width="150px">
                  <IconButton
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      handleShow();
                      setSelectedId(service.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Link href={`services/${service.id}/edit`}>
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

export default ServicesTable;
