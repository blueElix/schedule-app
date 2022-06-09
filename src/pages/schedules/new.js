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
import { useRouter } from "next/router";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withAdmin } from "../../helpers/auth";
import { toastMsg } from "src/helpers/toast";
import TimePicker from "src/components/TimePicker/TimePicker";
import useLocalStorage from "src/hooks/useLocalStorage";
import useServices from "src/hooks/useServices";
import { createSchedule } from "src/api";

const CreateSchedules = () => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const [user] = useLocalStorage("user");
  const { services, filtersDispatch } = useServices();

  useEffect(() => {
    filtersDispatch({
      type: "limit",
      payload: 1000,
    });
  }, []);

  const formik = useFormik({
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
      services: Yup.string().required("Services is required."),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          schedDate: moment(values.bookedDate).format("YYYY-M-D"),
          startTime: moment(values.bookedStartTime).format("HH:mm a"),
          endTime: moment(values.bookedEndTime).format("HH:mm a"),
          serviceId: values.services,
          userId: user.user.id,
        };

        setSubmitting(true);
        const res = await createSchedule(payload, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        setTimeout(() => {
          setSubmitting(false);
          router.push("/schedules");
          resetForm();
          toastMsg("success", "Successfully created schedule.");
        }, 300);
      } catch (error) {
        if (error.response.data.message) {
          toastMsg("error", error.response.data.message);
        } else {
          toastMsg("error", "Something went wrong.");
        }
      }
    },
  });

  // fix time
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
          Create Schedules
        </MuiLink>
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
