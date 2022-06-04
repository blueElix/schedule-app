import { useEffect, useState } from "react";
import {
  Container,
  Breadcrumbs,
  Link as MuiLink,
  Box,
  Button,
  TextField,
  FormControl,
} from "@mui/material";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import InputMask from "react-input-mask";
import moment from "moment";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withUser } from "../../../helpers/auth";
import Loader from "src/components/Loader/Loader";
import { toastMsg } from "src/helpers/toast";
import StyleLink from "src/components/StyleLink/StyleLink";
import PageNotFound from "src/components/PageNotFound/PageNotFound";
import useLocalStorage from "src/hooks/useLocalStorage";
import useServices from "src/hooks/useServices";
import useSchedules from "src/hooks/useSchedules";
import { getBooking, updateBooking } from "src/api";

const selectStyles = {
  option: (provided, state) => ({
    ...provided,
    cursor: "pointer",
    zIndex: 1000,
  }),
  control: (base) => ({
    ...base,
    "*": {
      boxShadow: "none !important",
    },
  }),
};

const EditBookings = ({ booking, currentId }) => {
  const [submitting, setSubmitting] = useState(false);

  const { filtersDispatch: serviceDispatch, getServicesStaffs, servicesStaffs } = useServices();
  const { schedules, filtersDispatch: schedulesDispatch } = useSchedules();
  const [user] = useLocalStorage("user");

  useEffect(() => {
    serviceDispatch({
      type: "limit",
      payload: 1000,
    });
    schedulesDispatch({
      type: "limit",
      payload: 1000,
    });
    getServicesStaffs();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      services: { service_id: "", service_staff_id: "", label: "" },
      schedule: { value: "", label: "" },
      name: "",
      email: "",
      contact: "",
    },
    validationSchema: Yup.object({
      services: Yup.object().shape({
        service_id: Yup.string().required("Services is required."),
        service_staff_id: Yup.string(),
        label: Yup.string(),
      }),
      schedule: Yup.object().shape({
        value: Yup.string().required("Schedule is required."),
        label: Yup.string(),
      }),
      name: Yup.string().required("Client name is required."),
      contact: Yup.string().required("Client contact is required."),
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Client email is required."),
    }),

    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const payload = {
          serviceId: values.services.service_id,
          serviceStaffId: values.services.service_staff_id,
          barangayId: user.user.barangay_id,
          schedId: values.schedule.value,
          clientName: values.name,
          clientContact: values.contact,
          clientEmail: values.email,
        };

        if (user) {
          await updateBooking(currentId, payload, {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
              "Content-Type": "application/json",
            },
          });
          setTimeout(() => {
            setSubmitting(false);
            toastMsg("success", "Successfully updated booking.");
          }, 300);
        }
      } catch (error) {
        toastMsg("error", "Something went wrong.");
      }
    },
  });

  useEffect(() => {
    const currentServices =
      servicesStaffs.length > 0 ? servicesStaffs.find(({ id }) => id == booking.service_id) : null;
    const currentSchedule =
      schedules.length > 0 ? schedules.find(({ id }) => id == booking.sched_id) : null;
    if (currentSchedule && currentServices) {
      formik.setFieldValue("services", {
        service_id: booking.service_id,
        service_staff_id: booking.service_staff_id,
        label: `${currentServices.name} - ${currentServices.full_name}` || "",
      });

      formik.setFieldValue("schedule", {
        value: booking.sched_id,
        label:
          `${
            currentSchedule.sched_date ? moment(currentSchedule.sched_date).format("M/D/YYYY") : ""
          } (${
            currentSchedule.start_time
              ? moment(currentSchedule.start_time, "HH:mm:ss").format("HH:mm A")
              : ""
          } - ${
            currentSchedule.end_time
              ? moment(currentSchedule.end_time, "HH:mm:ss").format("HH:mm A")
              : ""
          })` || "",
      });

      formik.setFieldValue("name", booking.client_name);
      formik.setFieldValue("email", booking.client_email);
      formik.setFieldValue("contact", booking.client_contact);
    }
  }, [servicesStaffs, schedules]);

  const renderForm = () => {
    return (
      <form onSubmit={formik.handleSubmit} style={{ marginTop: "10px" }}>
        <span onMouseDown={(e) => e.stopPropagation()}>
          <h4 style={{ marginTop: "10px" }}>Select Services</h4>
          <FormControl fullWidth margin="normal">
            <Select
              isDisabled={true}
              styles={selectStyles}
              value={formik.values.services}
              label="Select services"
              onChange={(val) =>
                formik.setFieldValue("services", {
                  label: val.label,
                  service_id: val.value.service_id,
                  service_staff_id: val.value.service_staff_id,
                })
              }
              options={
                servicesStaffs.length > 0
                  ? servicesStaffs.map((service) => ({
                      value: { service_id: service.service_id, service_staff_id: service.id },
                      label: `${service.name} - ${service.full_name}`,
                    }))
                  : [
                      {
                        value: "",
                        label: "No services available",
                      },
                    ]
              }
            />
          </FormControl>

          <h4 style={{ marginTop: "10px" }}>Select Services</h4>
          <FormControl fullWidth margin="normal">
            <Select
              isDisabled={true}
              styles={selectStyles}
              value={formik.values.schedule}
              label="Select schedule"
              onChange={(val) => formik.setFieldValue("schedule", val)}
              options={
                schedules.length > 0
                  ? [
                      ...schedules,
                      {
                        value: "",
                        label: "Select Schedule",
                      },
                    ]
                      .filter(
                        ({ service_id, is_available }) =>
                          is_available == 1 && service_id == formik.values.services.service_id
                      )
                      .map((schedule) => {
                        return {
                          value: schedule.id,
                          label: `${
                            schedule.sched_date
                              ? moment(schedule.sched_date).format("M/D/YYYY")
                              : ""
                          } (${
                            schedule.start_time
                              ? moment(schedule.start_time, "HH:mm:ss").format("HH:mm A")
                              : ""
                          } - ${
                            schedule.end_time
                              ? moment(schedule.end_time, "HH:mm:ss").format("HH:mm A")
                              : ""
                          })`,
                        };
                      })
                  : [
                      {
                        value: "",
                        label: "No Schedule available",
                      },
                    ]
              }
            />
          </FormControl>
        </span>

        <h3 style={{ marginTop: "10px" }}>Client Details</h3>
        <TextField
          error={Boolean(formik.touched.name && formik.errors.name)}
          fullWidth
          helperText={formik.touched.name && formik.errors.name}
          label="Client Name"
          margin="normal"
          // name="name"
          onBlur={formik.handleBlur}
          onChange={(e) => formik.setFieldValue("name", e.target.value)}
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
              sx={{
                zIndex: 2,
              }}
              {...inputProps}
            />
          )}
        </InputMask>

        <Box sx={{ py: 2 }} textAlign="right">
          <Button color="primary" disabled={submitting} type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </form>
    );
  };

  if (!booking) {
    return (
      <PageNotFound
        title="Booking not found"
        linkLabel="Go back to Bookings List"
        link="/bookings"
      />
    );
  }

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
  const token = ctx.req.headers.cookie.split(";").find((c) => c.trim().startsWith(`token=`));
  const tokenValue = token.split("=")[1];

  const { data: _booking } = await getBooking(ctx.query.bookingId, {
    headers: {
      Authorization: `Bearer ${tokenValue}`,
      "Content-Type": "application/json",
    },
  });
  return {
    props: {
      booking: _booking.data || null,
      currentId: ctx.query.bookingId,
    },
  };
};

export const getServerSideProps = withUser(getProps);

export default EditBookings;
