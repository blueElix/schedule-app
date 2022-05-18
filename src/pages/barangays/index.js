import { useState } from "react";
import Link from "next/link";
import { Container, Stack, Button } from "@mui/material";

import { DashboardLayout } from "../../components/dashboard-layout";
import { withAdmin } from "../../helpers/auth";
import { barangays as _barangays } from "src/__mocks__/barangays";
import BarangaysTable from "src/components/BarangaysTable/BarangaysTable";

const Dashboard = (props) => {
  const [barangays, setBarangays] = useState(props.barangays);

  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Barangays</h1>
        <Link href="barangays/new">
          <Button variant="contained">Create Barangay</Button>
        </Link>
      </Stack>

      <BarangaysTable barangays={barangays} setBarangays={setBarangays} />
    </Container>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: { barangays: _barangays },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default Dashboard;
