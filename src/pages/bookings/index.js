import { useState } from "react";
import Link from "next/link";

import { Container, Stack, Button } from "@mui/material";

import { DashboardLayout } from "../../components/DashboadLayout";
import { withUser } from "../../helpers/auth";
import { bookings as _bookings } from "src/__mocks__/bookings";
import BookingsTable from "../../components/BookingsTable/BookingsTable";
import BookingsTableView from "../../components/BookingsTableView/BookingsTableView";
import SearchForm from "src/components/SearchForm/SearchForm";
import Loader from "src/components/Loader/Loader";
import useLocalStorage from "src/hooks/useLocalStorage";

const Bookings = (props) => {
  const [bookings, setBookings] = useState(props.bookings);
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useLocalStorage("user");

  const handleOnSearch = (value) => {
    setIsLoading(true);
    setBookings(bookings.filter(({ name }) => name.toLowerCase().startsWith(value.toLowerCase())));
    setIsLoading(false);
  };

  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Bookings</h1>
        <Stack direction="row" spacing={2}>
          <SearchForm onSearch={handleOnSearch} resetSearch={() => setBookings(props.bookings)} />
          {user &&
            (user.role === "superadmin" || user.role === "admin" || user.role === "user") &&
            user.type === "barangay-staff" && (
              <Link href="bookings/new">
                <Button variant="contained">Create booking</Button>
              </Link>
            )}
        </Stack>
      </Stack>

      {isLoading || !bookings ? (
        <Loader />
      ) : user &&
        (user.role === "superadmin" || user.role === "admin" || user.role === "user") &&
        user.type === "barangay-staff" ? (
        <BookingsTable bookings={bookings} setBookings={setBookings} />
      ) : (
        <BookingsTableView bookings={bookings} />
      )}
    </Container>
  );
};

Bookings.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  // get bookings for barangay staff (userType: 'barangay-staff', barangayId)
  // get bookings for service staff (userType: 'service-staff', servicesId)
  // get me
  return {
    props: {
      bookings: _bookings,
    },
  };
};

export const getServerSideProps = withUser(getProps);

export default Bookings;
