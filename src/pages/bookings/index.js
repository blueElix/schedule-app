import Link from "next/link";
import { Container, Stack, Button } from "@mui/material";

import { DashboardLayout } from "../../components/DashboadLayout";
import { withUser } from "../../helpers/auth";
import BookingsTable from "../../components/BookingsTable/BookingsTable";
import BookingsTableView from "../../components/BookingsTableView/BookingsTableView";
import SearchForm from "src/components/SearchForm/SearchForm";
import Loader from "src/components/Loader/Loader";
import useLocalStorage from "src/hooks/useLocalStorage";
import useBookings from "src/hooks/useBookings";
import Pagination from "src/components/Pagination/Pagination";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Bookings = (props) => {
  const { bookings, setBookings, isLoading, pagination, filtersDispatch } = useBookings();
  const [user] = useLocalStorage("user");
  const router = useRouter();

  useEffect(() => {
    if (user.user.role === "ADMIN") {
      router.push("/");
    }
  }, [user]);

  const applySearch = (value) => {
    filtersDispatch({
      type: "search",
      payload: value,
    });
  };

  console.log(user.user.role);

  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Bookings</h1>
        <Stack direction="row" spacing={2}>
          <SearchForm
            onSearch={applySearch}
            resetSearch={() =>
              filtersDispatch({
                type: "reset",
              })
            }
          />
          {user && user.user.type === "BARANGAY_STAFF" && (
            <Link href="bookings/new">
              <Button variant="contained">Create booking</Button>
            </Link>
          )}
        </Stack>
      </Stack>

      {isLoading || !bookings ? (
        <Loader />
      ) : user && user.user.type === "BARANGAY_STAFF" ? (
        <BookingsTable bookings={bookings} setBookings={setBookings} />
      ) : (
        <BookingsTableView bookings={bookings} />
      )}
      <Pagination
        pagination={pagination}
        onPageClick={(page) => {
          filtersDispatch({
            type: "page",
            payload: page,
          });
        }}
        onLimitChange={(limit) => {
          filtersDispatch({
            type: "limit",
            payload: limit,
          });
        }}
      />
    </Container>
  );
};

Bookings.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: {},
  };
};

export const getServerSideProps = withUser(getProps);

export default Bookings;
