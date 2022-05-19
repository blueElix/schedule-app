import React, { useState, useRef } from "react";
import { Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchForm({ onSearch, resetSearch }) {
  const [searchParams, setSearchParams] = useState("");

  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search"
        inputProps={{ "aria-label": "search" }}
        value={searchParams}
        type="search"
        onChange={(e) => {
          if (e.target.value == "") resetSearch();
          setSearchParams(e.target.value);
        }}
      />
      <IconButton onClick={() => onSearch(searchParams)} sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
