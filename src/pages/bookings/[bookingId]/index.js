import { useEffect, useRef } from "react";
import { Container, Breadcrumbs, Link as MuiLink, Button } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import Link from "next/link";
import moment from "moment";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withUser } from "../../../helpers/auth";
import Loader from "src/components/Loader/Loader";
import StyleLink from "src/components/StyleLink/StyleLink";
import PageNotFound from "src/components/PageNotFound/PageNotFound";
import useLocalStorage from "src/hooks/useLocalStorage";
import { getBooking } from "src/api";
import useSchedules from "src/hooks/useSchedules";
import useServices from "src/hooks/useServices";

const BookingsDetails = ({ booking }) => {
  const componentRef = useRef();
  const [user] = useLocalStorage("user");
  const { services, filtersDispatch: servicesDispatch } = useServices();
  const { schedules, filtersDispatch: scheduleDispatch } = useSchedules();

  useEffect(() => {
    servicesDispatch({
      type: "limit",
      payload: 1000,
    });
    scheduleDispatch({
      type: "limit",
      payload: 1000,
    });
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const renderCurrentSchedule = (currentSchedule) => {
    const currentSchedules = schedules.find(({ id }) => id == currentSchedule);

    if (currentSchedules) {
      return `${
        currentSchedules.sched_date ? moment(currentSchedules.sched_date).format("M/D/YYYY") : ""
      } (${
        currentSchedules.start_time
          ? moment(currentSchedules.start_time, "HH:mm:ss").format("HH:mm A")
          : ""
      } - ${
        currentSchedules.end_time
          ? moment(currentSchedules.end_time, "HH:mm:ss").format("HH:mm A")
          : ""
      })`;
    }
    return "No schedule available";
  };

  const renderCurrentService = (currentService) => {
    const currentServices = services.find(({ id }) => id == currentService);
    if (currentServices) {
      return currentServices.name;
    }
    return "No services available";
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
      <h1>Details</h1>
      <Breadcrumbs aria-label="breadcrumb" mb={2}>
        <Link href="/bookings">
          <a className="styleLink">Bookings </a>
        </Link>
        <MuiLink
          color="text.primary"
          aria-current="page"
          sx={{
            textDecoration: "none",
          }}
        >
          Details
        </MuiLink>
      </Breadcrumbs>

      {!booking ? (
        <Loader />
      ) : (
        <>
          <Container ref={componentRef} sx={{ marginTop: "10px" }}>
            <h4>Name: {booking.client_name}</h4>
            <h4>Email: {booking.client_email}</h4>
            <h4>Contact: {booking.client_contact}</h4>
            <h4>Schedule: {renderCurrentSchedule(booking.sched_id)}</h4>
            <h4>Services: {renderCurrentService(booking.service_id)}</h4>
          </Container>
          {user && (user.user.role === "ADMIN" || user.user.type === "BARANGAY_STAFF") && (
            <Button onClick={handlePrint} sx={{ margin: "10px" }}>
              Print this out!
            </Button>
          )}
        </>
      )}
    </Container>
  );
};

BookingsDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

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
    },
  };
};

export const getServerSideProps = withUser(getProps);

export default BookingsDetails;
