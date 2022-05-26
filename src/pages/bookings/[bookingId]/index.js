import { useRef } from "react";
import { Container, Breadcrumbs, Link as MuiLink, Button } from "@mui/material";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withUser } from "../../../helpers/auth";
import { bookings } from "src/__mocks__/bookings";
import { schedules as _schedules } from "src/__mocks__/schedules";
import { services as _services } from "src/__mocks__/services";
import Loader from "src/components/Loader/Loader";
import StyleLink from "src/components/StyleLink/StyleLink";
import PageNotFound from "src/components/PageNotFound/PageNotFound";
import useLocalStorage from "src/hooks/useLocalStorage";

const BookingsDetails = ({ booking }) => {
  const schedule = _schedules.find(({ id }) => id == booking.schedule);
  const componentRef = useRef();
  const [user] = useLocalStorage("user");

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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
        <Link href="/">
          <StyleLink>Home</StyleLink>
        </Link>
        <Link href="/bookings">
          <StyleLink>Bookings </StyleLink>
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
            <h3>Name: {booking.name}</h3>
            <h4>Email: {booking.email}</h4>
            <h4>Contact: +63{booking.contact}</h4>
            <h4>Address: {booking.address}</h4>
            <h4>
              Schedule: {schedule.bookedDate} - {schedule.bookedTime}
            </h4>
            <h4>Services: {_services.find(({ id }) => id == booking.services).name}</h4>
          </Container>
          {user && (user.user.role === "admin" || user.user.role === "superAdmin") && (
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
  const _booking = bookings.find(({ id }) => id == ctx.query.bookingId);
  return {
    props: {
      booking: _booking,
    },
  };
};

export const getServerSideProps = withUser(getProps);

export default BookingsDetails;
