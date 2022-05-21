import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@mui/material";

const states = [
  {
    value: "alabama",
    label: "Alabama",
  },
  {
    value: "new-york",
    label: "New York",
  },
  {
    value: "san-francisco",
    label: "San Francisco",
  },
];

export const AccountProfileDetails = (props) => {
  const [values, setValues] = useState({
    firstName: "Katarina",
    lastName: "Smith",
    email: "demo@devias.io",
    phone: "",
    state: "Alabama",
    country: "USA",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form autoComplete="off" noValidate {...props}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                helperText="Please specify the full name"
                label="Full name"
                name="fullName"
                onChange={handleChange}
                required
                value={values.fullName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                onChange={handleChange}
                type="number"
                value={values.phone}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                onChange={handleChange}
                type="text"
                value={values.address}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button color="primary" variant="contained">
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};
