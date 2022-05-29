import * as React from "react";
import { Stack, ButtonGroup, Box, Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export default function Pagination({ pagination, onPageClick = (pageNumber) => {} }) {
  if (!pagination) {
    return null;
  }

  const { limit = 10, page = 1, results = 0, total = 0 } = pagination;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit + (results > 0 ? 1 : 0);
  const end = start + results - (results > 0 ? 1 : 0);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": {
          m: 1,
        },
      }}
    >
      {/* <Stack Stack direction="row" spacing={2} justifyContent="space-between">
        <Box>
          Showing: {start} of {end}
        </Box>
        <Box>Total: {total}</Box>
      </Stack> */}
      <ButtonGroup size="small" aria-label="small button group">
        <Button
          onClick={() => {
            if (page <= 1) {
              return;
            }
            onPageClick(page - 1);
          }}
          variant={page <= 1 ? "outlined" : "contained"}
        >
          <ArrowBackIosIcon />
        </Button>
        {Array.from(Array(totalPages).keys()).map((index) => {
          const pageNumber = index + 1;
          return (
            <Button
              key={pageNumber}
              onClick={() => {
                if (pageNumber === page) {
                  return;
                }
                onPageClick(pageNumber);
              }}
              variant={pageNumber === page ? "contained" : "outlined"}
            >
              {pageNumber}
            </Button>
          );
        })}
        <Button
          onClick={() => {
            if (page >= totalPages) {
              return;
            }
            onPageClick(page + 1);
          }}
          variant={page >= total ? "outlined" : "contained"}
        >
          <ArrowForwardIosIcon />
        </Button>
      </ButtonGroup>
    </Box>
  );
}
