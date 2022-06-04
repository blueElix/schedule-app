import Link from "next/link";
import { Container, Stack, Button } from "@mui/material";

import { DashboardLayout } from "../../components/DashboadLayout";
import { withAdmin } from "../../helpers/auth";
import ServicesTable from "src/components/ServicesTable/ServicesTables";
import SearchForm from "src/components/SearchForm/SearchForm";
import Loader from "src/components/Loader/Loader";
import useServices from "src/hooks/useServices";
import Pagination from "src/components/Pagination/Pagination";

const Dashboard = () => {
  const { isLoading, services, setServices, filtersDispatch, pagination } = useServices();

  const applySearch = (value) => {
    filtersDispatch({
      type: "search",
      payload: value,
    });
  };

  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Services</h1>

        <Stack direction="row" spacing={2}>
          <SearchForm
            onSearch={applySearch}
            resetSearch={() =>
              filtersDispatch({
                type: "reset",
              })
            }
          />
          <Link href="services/new">
            <Button variant="contained">Create services</Button>
          </Link>
        </Stack>
      </Stack>

      {isLoading || !services ? (
        <Loader />
      ) : (
        <>
          <ServicesTable services={services} setServices={setServices} />

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
