import Link from "next/link";
import { Container, Stack, Button } from "@mui/material";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withAdmin } from "../../helpers/auth";
import { schedules as _schedules } from "src/__mocks__/schedules";
import SchedulesTable from "src/components/SchedulesTable/SchedulesTable";
import SearchForm from "src/components/SearchForm/SearchForm";
import Loader from "src/components/Loader/Loader";
import useSchedules from "src/hooks/useSchedules";
import Pagination from "src/components/Pagination/Pagination";

const Schedules = (props) => {
  const { setSchedules, schedules, isLoading, pagination, filtersDispatch } = useSchedules();

  const applySearch = (value) => {
    filtersDispatch({
      type: "search",
      payload: value,
    });
  };

  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Schedules</h1>

        <Stack direction="row" spacing={2}>
          <SearchForm
            onSearch={applySearch}
            resetSearch={() =>
              filtersDispatch({
                type: "reset",
              })
            }
          />
          <Link href="schedules/new">
            <Button variant="contained">Create schedule</Button>
          </Link>
        </Stack>
      </Stack>
      {isLoading || !schedules ? (
        <Loader />
      ) : (
        <>
          <SchedulesTable schedules={schedules} setSchedules={setSchedules} />
          <Pagination
            pagination={pagination}
            onPageClick={(page) => {
              filtersDispatch({
                type: "page",
                payload: page,
              });
            }}
          />
        </>
      )}
    </Container>
  );
};

Schedules.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: {},
  };
};

export const getServerSideProps = withAdmin(getProps);

export default Schedules;
