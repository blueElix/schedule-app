import { Container, Breadcrumbs, Link as StyleLink } from "@mui/material";
import Link from "next/link";

import { DashboardLayout } from "../../../components/dashboard-layout";
import { withAdmin } from "../../../helpers/auth";
import { bookings } from "src/__mocks__/bookings";
import { schedules as _schedules } from "src/__mocks__/schedules";
import { services as _services } from "src/__mocks__/services";

const BookingsDetails = ({ booking }) => {
  const schedule = _schedules.find(({ id }) => id == booking.schedule);

  return (
    <Container>
      <h1>Details</h1>
      <Breadcrumbs aria-label="breadcrumb" mb={2}>
        <StyleLink underline="hover" color="inherit">
          <Link href="/">Home </Link>
        </StyleLink>
        <StyleLink underline="hover" color="inherit">
          <Link href="/bookings">Bookings </Link>
        </StyleLink>
        <StyleLink underline="hover" color="text.primary" aria-current="page">
          Details
        </StyleLink>
      </Breadcrumbs>

      <div>
        <h3>Name: {booking.name}</h3>
        <h4>Email: {booking.email}</h4>
        <h4>Contact: +63{booking.contact}</h4>
        <h4>Address: {booking.address}</h4>
        <h4>
          Schedule: {schedule.bookedDate} - {schedule.bookedTime}
        </h4>
        <h4>Services: {_services.find(({ id }) => id == booking.services).name}</h4>
      </div>
    </Container>
  );
};

BookingsDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const _booking = bookings.find(({ id }) => id == ctx.query.bookingId);
  return {
    props: {
      booking: _booking,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default BookingsDetails;
