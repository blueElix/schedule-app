import { useState } from "react";
import Link from "next/link";

import { Container, Stack, Button } from "@mui/material";

import { DashboardLayout } from "../../components/dashboard-layout";
import { withUser } from "../../helpers/auth";
import { bookings as _bookings } from "src/__mocks__/bookings";
import BookingsTable from "../../components/BookingsTable/BookingsTable";
import SearchForm from "src/components/SearchForm/SearchForm";
import Loader from "src/components/Loader/Loader";

const Bookings = (props) => {
  const [bookings, setBookings] = useState(props.bookings);
  const [isLoading, setIsLoading] = useState(false);

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
          <Link href="bookings/new">
            <Button variant="contained">Create booking</Button>
          </Link>
        </Stack>
      </Stack>

      {isLoading || !bookings ? (
        <Loader />
      ) : (
        <BookingsTable bookings={bookings} setBookings={setBookings} />
      )}
    </Container>
  );
};

Bookings.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: { bookings: _bookings },
  };
};

export const getServerSideProps = withUser(getProps);

export default Bookings;
