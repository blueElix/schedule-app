import { useEffect } from "react";
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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker, DatePicker } from "@mui/x-date-pickers";

import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import moment from "moment";

import { DashboardLayout } from "../../../components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import { services } from "src/__mocks__/services";
import { schedules } from "src/__mocks__/schedules";
import Loader from "../../../components/Loader/Loader";

const EditSchedules = ({ schedule }) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      bookedDate: "",
      bookedTime: "",
      services: "",
      isAvailable: false,
    },
    validationSchema: Yup.object({
      bookedDate: Yup.string().required("Schedule date is required."),
      bookedTime: Yup.string().required("Schedule time is required."),
      services: Yup.string().required("Services is required."),
      isAvailable: Yup.boolean(),
    }),
    onSubmit: (values) => {
      const payload = {
        bookedDate: moment(values.bookedDate).format("M/D/YYYY"),
        bookedTime: moment(values.bookedTime).format("HH:mm a"),
        services: values.services,
        isAvailable: values.isAvailable,
      };
      console.log(payload);
    },
  });

  useEffect(() => {
    if (schedule) {
      formik.setFieldValue("services", schedule.services);
      formik.setFieldValue(
        "bookedTime",
        new Date(moment(schedule.bookedDate + " " + schedule.bookedTime))
      );
      formik.setFieldValue("bookedDate", schedule.bookedDate);
      formik.setFieldValue("isAvailable", schedule.isAvailable);
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

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack direction="row" spacing={2} alignItems="center" mb={2} mt={2}>
            <DatePicker
              label="Booking date"
              value={formik.values.bookedDate}
              onChange={(newValue) => formik.setFieldValue("bookedDate", newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(formik.touched.bookedDate && formik.errors.bookedDate)}
                  fullWidth
                />
              )}
            />
            <TimePicker
              label="Booking time"
              value={formik.values.bookedTime}
              onChange={(newValue) => {
                formik.setFieldValue("bookedTime", newValue);
                console.log(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={Boolean(formik.touched.bookedTime && formik.errors.bookedTime)}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                name="isAvailable"
                checked={formik.values.isAvailable}
                onChange={(e) => formik.setFieldValue("isAvailable", !formik.values.isAvailable)}
              />
            }
            label="Available"
          />
        </FormGroup>

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
      <h1>Edit Schedules</h1>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/">
          <StyleLink underline="hover" color="inherit">
            Home
          </StyleLink>
        </Link>
        <Link href="/schedules">
          <StyleLink underline="hover" color="inherit">
            Schedules
          </StyleLink>
        </Link>
        <StyleLink underline="hover" color="text.primary" aria-current="page">
          Edit Schedules
        </StyleLink>
      </Breadcrumbs>
      {!schedule ? <Loader /> : renderForm()}
    </Container>
  );
};

EditSchedules.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const _schedule = schedules.find(({ id }) => id == ctx.query.scheduleId);
  return {
    props: {
      schedule: _schedule,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default EditSchedules;
