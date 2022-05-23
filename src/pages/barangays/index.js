import { useState } from "react";
import Link from "next/link";
import { Container, Stack, Button } from "@mui/material";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withAdmin } from "../../helpers/auth";
import { barangays as _barangays } from "src/__mocks__/barangays";
import BarangaysTable from "src/components/BarangaysTable/BarangaysTable";
import SearchForm from "src/components/SearchForm/SearchForm";
import Loader from "src/components/Loader/Loader";
import { getBarangays } from "src/api";

const Dashboard = (props) => {
  const [barangays, setBarangays] = useState(props.barangays);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSearch = (value) => {
    setIsLoading(true);
    setBarangays(
      barangays.filter(({ name }) => name.toLowerCase().startsWith(value.toLowerCase()))
    );
    setIsLoading(false);
  };

  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Barangays</h1>
        <Stack direction="row" spacing={2}>
          <SearchForm onSearch={handleOnSearch} resetSearch={() => setBarangays(props.barangays)} />
          <Link href="barangays/new">
            <Button variant="contained">Create Barangay</Button>
          </Link>
        </Stack>
      </Stack>

      {isLoading || !barangays ? (
        <Loader />
      ) : (
        <BarangaysTable barangays={barangays} setBarangays={setBarangays} />
      )}
    </Container>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const { data: _barangays } = await getBarangays();
  return {
    props: { barangays: _barangays },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default Dashboard;
