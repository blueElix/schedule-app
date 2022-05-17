import { useState } from "react";
import Link from "next/link";
import { Container, Stack, Button } from "@mui/material";

import { DashboardLayout } from "../../components/dashboard-layout";
import { withAdmin } from "../../helpers/auth";
import { services as _services } from "src/__mocks__/services";
import ServicesTable from "src/components/ServicesTable/ServicesTables";

const Dashboard = (props) => {
  const [services, setServices] = useState(props.services);

  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Services</h1>
        <Link href="services/new">
          <Button variant="contained">Create services</Button>
        </Link>
      </Stack>

      <ServicesTable services={services} setServices={setServices} />
    </Container>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: { services: _services },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default Dashboard;
