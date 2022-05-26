import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker as Clock } from "@mui/x-date-pickers";

const TimePicker = ({ label = "", inputProps = {}, error = null }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Clock
        label={label}
        {...inputProps}
        renderInput={(params) => <TextField {...params} fullWidth error={error} />}
      />
    </LocalizationProvider>
  );
};

export default TimePicker;
