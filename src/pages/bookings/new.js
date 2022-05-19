import {
  Container,
  Breadcrumbs,
  Link as StyleLink,
  Box,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";

import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import InputMask from "react-input-mask";

import { DashboardLayout } from "../../components/dashboard-layout";
import { withAdmin } from "../../helpers/auth";
import { services } from "src/__mocks__/services";
import { schedules } from "src/__mocks__/schedules";

const CreateBookings = () => {
  const formik = useFormik({
    initialValues: {
      services: "",
      schedule: "",
      name: "",
      email: "",
      contact: "",
      address: "",
    },
    validationSchema: Yup.object({
      services: Yup.string().required("Services is required."),
      schedule: Yup.string().required("Schedule is required."),
      name: Yup.string().required("Client name is required."),
      contact: Yup.string(),
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Staff email is required"),
      address: Yup.string(),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const renderForm = () => {
    return (
      <form onSubmit={formik.handleSubmit} style={{ marginTop: "10px" }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="selectServices">Select services</InputLabel>
          <Select
            labelId="selectServices"
            id="demo-simple-select"
            value={formik.values.services}
            label="Select services"
            name="services"
            onChange={formik.handleChange}
          >
            {Array.isArray(services) && services.length > 0 ? (
              services.map((service) => (
                <MenuItem value={service.id} key={service.id}>
                  {service.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">No services available</MenuItem>
            )}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" disabled={formik.values.services === ""}>
          <InputLabel id="selectSchedule">Select schedule</InputLabel>
          <Select
            labelId="selectSchedule"
            id="demo-simple-select"
            value={formik.values.schedule}
            label="Select schedule"
            name="schedule"
            onChange={formik.handleChange}
          >
            {Array.isArray(schedules) && schedules.length > 0 ? (
              schedules
                .filter(
                  ({ services, isAvailable }) => services === formik.values.services && isAvailable
                )
                .map((schedule) => (
                  <MenuItem value={schedule.id} key={schedule.id}>
                    {schedule.bookedDate} - {schedule.bookedTime}
                  </MenuItem>
                ))
            ) : (
              <MenuItem value="">No schedule available</MenuItem>
            )}
          </Select>
        </FormControl>
        <h3 style={{ marginTop: "10px" }}>Client Details</h3>
        <TextField
          error={Boolean(formik.touched.name && formik.errors.name)}
          fullWidth
          helperText={formik.touched.name && formik.errors.name}
          label="Client Name"
          margin="normal"
          name="name"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          value={formik.values.name}
          variant="outlined"
        />
        <TextField
          error={Boolean(formik.touched.email && formik.errors.email)}
          fullWidth
          helperText={formik.touched.email && formik.errors.email}
          label="Email Address"
          margin="normal"
          name="email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="email"
          value={formik.values.email}
          variant="outlined"
        />

        <InputMask
          mask="(+63) 999 999 9999"
          value={formik.values.contact}
          onChange={(e) => formik.setFieldValue("contact", e.target.value)}
        >
          {(inputProps) => (
            <TextField
              error={Boolean(formik.touched.contact && formik.errors.contact)}
              fullWidth
              helperText={formik.touched.contact && formik.errors.contact}
              label="Client Contact"
              margin="normal"
              name="contact"
              type="text"
              variant="outlined"
              {...inputProps}
            />
          )}
        </InputMask>

        <TextField
          error={Boolean(formik.touched.address && formik.errors.address)}
          fullWidth
          helperText={formik.touched.address && formik.errors.address}
          label="Client Address"
          margin="normal"
          name="address"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          value={formik.values.address}
          variant="outlined"
        />

        <Box sx={{ py: 2 }} textAlign="right">
          <Button color="primary" disabled={formik.isSubmitting} type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </form>
    );
  };

  return (
    <Container>
      <h1>Create Booking</h1>
      <Breadcrumbs aria-label="breadcrumb">
        <StyleLink underline="hover" color="inherit">
          <Link href="/">Home</Link>
        </StyleLink>

        <StyleLink underline="hover" color="inherit">
          <Link href="/bookings">Bookings</Link>
        </StyleLink>

        <StyleLink underline="hover" color="text.primary" aria-current="page">
          Create Booking
        </StyleLink>
      </Breadcrumbs>
      {renderForm()}
    </Container>
  );
};

CreateBookings.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: {},
  };
};

export const getServerSideProps = withAdmin(getProps);

export default CreateBookings;
