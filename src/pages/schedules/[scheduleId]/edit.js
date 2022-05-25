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

import { DashboardLayout } from "src/components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import { services } from "src/__mocks__/services";
import { schedules } from "src/__mocks__/schedules";
import Loader from "src/components/Loader/Loader";
import { toastMsg } from "src/helpers/toast";
import StyleLink from "src/components/StyleLink/StyleLink";
import PageNotFound from "src/components/PageNotFound/PageNotFound";

const EditSchedules = ({ schedule }) => {
  const [submitting, setSubmitting] = useState(false);

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
      try {
        const payload = {
          bookedDate: moment(values.bookedDate).format("M/D/YYYY"),
          bookedTime: values.bookedTime,
          services: values.services,
          isAvailable: values.isAvailable,
        };

        setSubmitting(true);
        console.log(payload);
        setSubmitting(false);
        toastMsg("success", "Successfully updated schedule.");
      } catch (error) {
        toastMsg("error", "Something went wrong.");
      }
    },
  });

  useEffect(() => {
    if (schedule) {
      formik.setFieldValue("services", schedule.services);
      formik.setFieldValue("bookedTime", schedule.bookedTime);
      formik.setFieldValue("bookedDate", schedule.bookedDate);
      formik.setFieldValue("isAvailable", schedule.isAvailable);
    } else {
      toastMsg("error", `Selected schedule didn't load.`);
    }
  }, []);

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

  if (!schedule) {
    return (
      <PageNotFound
        title="Schedule not found"
        linkLabel="Go back to Schedules List"
        link="/schedules"
      />
    );
  }

  return (
    <Container>
      <h1>Edit Schedules</h1>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/">
          <StyleLink>Home</StyleLink>
        </Link>
        <Link href="/schedules">
          <StyleLink>Schedules</StyleLink>
        </Link>
        <MuiLink
          color="text.primary"
          aria-current="page"
          sx={{
            textDecoration: "none",
          }}
        >
          Edit Schedules
        </MuiLink>
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
