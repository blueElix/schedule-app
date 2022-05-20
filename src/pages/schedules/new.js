import { useState } from "react";
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
import { DatePicker } from "@mui/x-date-pickers";

import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";

import { DashboardLayout } from "../../components/DashboadLayout";
import { withAdmin } from "../../helpers/auth";
import { services } from "src/__mocks__/services";
import { toastMsg } from "../../helpers/toast";

const CreateSchedules = () => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const formik = useFormik({
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
    onSubmit: (values, { resetForm }) => {
      try {
        const payload = {
          bookedDate: moment(values.bookedDate).format("M/D/YYYY"),
          bookedTime: values.bookedTime,
          services: values.services,
          isAvailable: values.isAvailable,
        };
        setSubmitting(true);
        console.log(payload);

        setTimeout(() => {
          setSubmitting(false);
          router.push("/schedules");
          resetForm();
          toastMsg("success", "Successfully created schedule.");
        }, 300);
      } catch (error) {
        toastMsg("error", "Something went wrong.");
      }
    },
  });

  const renderTimeSelect = () => {
    const formattedDate = moment(formik.values.bookedDate).format("YYYY-MM-DD");
    const startDate = moment(formattedDate + " " + "08:00");
    const endDate = moment(formattedDate + " " + "16:45");
    const datesBetween = [];

    const startingMoment = startDate;

    while (startingMoment <= endDate) {
      datesBetween.push(startingMoment.clone()); // clone to add new object
      startingMoment.add(15, "minutes").format("hh:mm A");
    }

    return (
      <FormControl fullWidth margin="normal">
        <InputLabel id="selectTimeslot">Select booking time</InputLabel>
        <Select
          labelId="selectTimeslot"
          id="demo-simple-select"
          value={formik.values.bookedTime}
          label="Select bookedTime"
          name="bookedTime"
          onChange={formik.handleChange}
        >
          {datesBetween.length > 0 ? (
            datesBetween.map((date, index) => {
              let timeSlot =
                moment(date).format("hh:mm A") +
                " - " +
                moment(date).add(15, "minutes").format("hh:mm A");
              return (
                <MenuItem value={timeSlot} key={index.toString()}>
                  {timeSlot}
                </MenuItem>
              );
            })
          ) : (
            <MenuItem value="">No time available</MenuItem>
          )}
        </Select>
      </FormControl>
    );
  };

  const renderForm = () => {
    return (
      <form onSubmit={formik.handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="selectServices">Select Services</InputLabel>
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
            {renderTimeSelect()}
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
          <Button color="primary" disabled={submitting} type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </form>
    );
  };

  return (
    <Container>
      <h1>Create Schedules</h1>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/">Home </Link>
        <Link href="/schedules">Schedules </Link>
        <StyleLink underline="hover" color="text.primary" aria-current="page">
          Create Schedules
        </StyleLink>
      </Breadcrumbs>
      {renderForm()}
    </Container>
  );
};

CreateSchedules.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: {},
  };
};

export const getServerSideProps = withAdmin(getProps);

export default CreateSchedules;
