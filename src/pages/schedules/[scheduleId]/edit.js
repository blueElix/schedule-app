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
  FormHelperText,
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
import Loader from "src/components/Loader/Loader";
import { toastMsg } from "src/helpers/toast";
import PageNotFound from "src/components/PageNotFound/PageNotFound";
import TimePicker from "src/components/TimePicker/TimePicker";
import { getSchedule, updateSchedule } from "src/api";
import useServices from "src/hooks/useServices";
import useLocalStorage from "src/hooks/useLocalStorage";

const EditSchedules = ({ schedule, currentId }) => {
  const [submitting, setSubmitting] = useState(false);
  const [user] = useLocalStorage("user");
  const { services, filtersDispatch } = useServices();

  useEffect(() => {
    filtersDispatch({
      type: "limit",
      payload: 1000,
    });
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      bookedDate: "",
      bookedStartTime: "",
      bookedEndTime: "",
      services: "",
    },
    validationSchema: Yup.object({
      bookedDate: Yup.string().required("Schedule date is required."),
      bookedStartTime: Yup.string().required("Schedule start time is required."),
      bookedEndTime: Yup.string().required("Schedule end time is required."),
      services: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          schedDate: moment(values.bookedDate).format("YYYY-M-D"),
          startTime: moment(values.bookedStartTime).format("HH:mm a"),
          endTime: moment(values.bookedEndTime).format("HH:mm a"),
        };

        setSubmitting(true);
        const res = await updateSchedule(currentId, payload, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        setTimeout(() => {
          setSubmitting(false);
          toastMsg("success", "Successfully updated schedule.");
        }, 300);
      } catch (error) {
        toastMsg("error", "Something went wrong.");
      }
    },
  });

  useEffect(() => {
    if (schedule) {
      const date = moment(schedule.sched_date).format("YYYY-M-D");
      formik.setFieldValue("services", schedule.service_id);
      formik.setFieldValue("bookedStartTime", new Date(moment(date + " " + schedule.start_time)));
      formik.setFieldValue("bookedEndTime", new Date(moment(date + " " + schedule.end_time)));
      formik.setFieldValue("bookedDate", schedule.sched_date);
    }
  }, []);

  // const renderTimeSelect = () => {
  //   const formattedDate = moment(formik.values.bookedDate).format("YYYY-MM-DD");
  //   const startDate = moment(formattedDate + " " + "08:00");
  //   const endDate = moment(formattedDate + " " + "16:45");
  //   const datesBetween = [];

  //   const startingMoment = startDate;

  //   while (startingMoment <= endDate) {
  //     datesBetween.push(startingMoment.clone()); // clone to add new object
  //     startingMoment.add(15, "minutes").format("hh:mm A");
  //   }

  //   return (
  //     <FormControl fullWidth margin="normal">
  //       <InputLabel id="selectTimeslot">Select booking time</InputLabel>
  //       <Select
  //         labelId="selectTimeslot"
  //         id="demo-simple-select"
  //         value={formik.values.bookedTime}
  //         label="Select bookedTime"
  //         name="bookedTime"
  //         onChange={formik.handleChange}
  //       >
  //         {datesBetween.length > 0 ? (
  //           datesBetween.map((date, index) => {
  //             let timeSlot =
  //               moment(date).format("hh:mm A") +
  //               " - " +
  //               moment(date).add(15, "minutes").format("hh:mm A");
  //             return (
  //               <MenuItem value={timeSlot} key={index.toString()}>
  //                 {timeSlot}
  //               </MenuItem>
  //             );
  //           })
  //         ) : (
  //           <MenuItem value="">No time available</MenuItem>
  //         )}
  //       </Select>
  //     </FormControl>
  //   );
  // };

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
            disabled
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
          <FormHelperText>{formik.touched.services && formik.errors.services}</FormHelperText>
        </FormControl>

        <Stack direction="row" spacing={2} alignItems="center" mb={2} mt={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
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
          </LocalizationProvider>

          <TimePicker
            label="Booking Start Time"
            inputProps={{
              value: formik.values.bookedStartTime,
              onChange: (newValue) => formik.setFieldValue("bookedStartTime", newValue),
            }}
            error={Boolean(formik.touched.bookedStartTime && formik.errors.bookedStartTime)}
          />
          <TimePicker
            label="Booking End Time"
            inputProps={{
              value: formik.values.bookedEndTime,
              onChange: (newValue) => formik.setFieldValue("bookedEndTime", newValue),
            }}
            error={Boolean(formik.touched.bookedEndTime && formik.errors.bookedEndTime)}
          />
        </Stack>
        {/* 
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
        </FormGroup> */}

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
        <Link href="/schedules">
          <a className="styleLink">Schedules</a>
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
  const token = ctx.req.headers.cookie.split(";").find((c) => c.trim().startsWith(`token=`));
  const tokenValue = token.split("=")[1];

  const { data: _schedule } = await getSchedule(ctx.query.scheduleId, {
    headers: {
      Authorization: `Bearer ${tokenValue}`,
      "Content-Type": "application/json",
    },
  });

  return {
    props: {
      schedule: _schedule.data || null,
      currentId: ctx.query.scheduleId,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default EditSchedules;
