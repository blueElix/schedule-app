import Link from "next/link";
import { Container, Stack, Button } from "@mui/material";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withAdmin } from "../../helpers/auth";
import { users as _staffs } from "src/__mocks__/users";
import StaffsTable from "src/components/StaffsTable/StaffsTable";
import SearchForm from "src/components/SearchForm/SearchForm";
import Loader from "src/components/Loader/Loader";
import useStaffs from "src/hooks/useStaffs";
import Pagination from "src/components/Pagination/Pagination";

const Dashboard = (props) => {
  const { isLoading, setIsLoading, staffs, setStaffs, pagination, filtersDispatch } = useStaffs();

  const applySearch = (value) => {
    filtersDispatch({
      type: "search",
      payload: value,
    });
  };

  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Staffs</h1>

        <Stack direction="row" spacing={2}>
          <SearchForm
            onSearch={applySearch}
            resetSearch={() =>
              filtersDispatch({
                type: "reset",
              })
            }
          />
          <Link href="staffs/new">
            <Button variant="contained">Create staffs</Button>
          </Link>
        </Stack>
      </Stack>

      {isLoading || !staffs ? (
        <Loader />
      ) : (
        <>
          <StaffsTable staffs={staffs} setStaffs={setStaffs} />
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
        </>
      )}
    </Container>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: {},
  };
};

export const getServerSideProps = withAdmin(getProps);

export default Dashboard;
