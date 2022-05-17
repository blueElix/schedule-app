import * as React from "react";
import { Box, Button, Typography, Modal, Stack } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function DeletingModal({
  show,
  onClose,
  confirmDelete,
  title = "",
  content = "",
  deleting = false,
}) {
  return (
    <div>
      <Modal
        open={show}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {content}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={confirmDelete} variant="error">
              Delete
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
