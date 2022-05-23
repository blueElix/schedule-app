import { useEffect, useState } from "react";
import {
  Container,
  Breadcrumbs,
  Link as MuiLink,
  Box,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import InputMask from "react-input-mask";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import { services } from "src/__mocks__/services";
import { schedules } from "src/__mocks__/schedules";
import { bookings } from "src/__mocks__/bookings";
import Loader from "src/components/Loader/Loader";
import { toastMsg } from "src/helpers/toast";
import StyleLink from "src/components/StyleLink/StyleLink";

const EditBookings = ({ booking }) => {
  const [submitting, setSubmitting] = useState(false);

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
        .required("Client email is required"),
      address: Yup.string(),
    }),
    onSubmit: (values) => {
      try {
        setSubmitting(true);
        console.log(values);
        setSubmitting(false);
        toastMsg("success", "Successfully updated booking.");
      } catch (error) {
        toastMsg("error", "Something went wrong.");
      }
    },
  });

  useEffect(() => {
    if (booking) {
      formik.setFieldValue("schedule", booking.schedule);
      formik.setFieldValue("services", booking.services);
      formik.setFieldValue("name", booking.name);
      formik.setFieldValue("address", booking.address);
      formik.setFieldValue("email", booking.email);
      formik.setFieldValue("contact", booking.contact);
    } else {
      toastMsg("error", `Selected booking didn't load.`);
    }
  }, []);

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
          <Button color="primary" disabled={submitting} type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </form>
    );
  };

  return (
    <Container>
      <h1>Edit Booking</h1>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/">
          <StyleLink>Home</StyleLink>
        </Link>
        <Link href="/bookings">
          <StyleLink>Bookings</StyleLink>
        </Link>
        <MuiLink
          color="text.primary"
          aria-current="page"
          sx={{
            textDecoration: "none",
          }}
        >
          Edit Booking
        </MuiLink>
      </Breadcrumbs>
      {!booking ? <Loader /> : renderForm()}
    </Container>
  );
};

EditBookings.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const _booking = bookings.find(({ id }) => id == ctx.query.bookingId);
  return {
    props: {
      booking: _booking,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default EditBookings;
