import Link from "next/link";
import { Container, Stack, Button } from "@mui/material";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withAdmin } from "../../helpers/auth";
import { barangays as _barangays } from "src/__mocks__/barangays";
import BarangaysTable from "src/components/BarangaysTable/BarangaysTable";
import SearchForm from "src/components/SearchForm/SearchForm";
import Loader from "src/components/Loader/Loader";
import Pagination from "src/components/Pagination/Pagination";
import useBarangay from "src/hooks/useBarangays";

const Barangays = () => {
  const { pagination, isLoading, barangays, setBarangays, filtersDispatch } = useBarangay();

  const applySearch = (value) => {
    filtersDispatch({
      type: "search",
      payload: value,
    });
  };

  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Barangays</h1>
        <Stack direction="row" spacing={2}>
          <SearchForm
            onSearch={applySearch}
            resetSearch={() =>
              filtersDispatch({
                type: "reset",
              })
            }
          />
          <Link href="barangays/new">
            <Button variant="contained">Create Barangay</Button>
          </Link>
        </Stack>
      </Stack>

      {isLoading || !barangays ? (
        <Loader />
      ) : (
        <>
          <BarangaysTable barangays={barangays} setBarangays={setBarangays} />
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

Barangays.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: {},
  };
};

export const getServerSideProps = withAdmin(getProps);

export default Barangays;
