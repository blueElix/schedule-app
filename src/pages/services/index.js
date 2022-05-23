import { useState } from "react";
import Link from "next/link";
import { Container, Stack, Button } from "@mui/material";

import { DashboardLayout } from "../../components/DashboadLayout";
import { withAdmin } from "../../helpers/auth";
import ServicesTable from "src/components/ServicesTable/ServicesTables";
import SearchForm from "src/components/SearchForm/SearchForm";
import Loader from "src/components/Loader/Loader";
import { getServices } from "src/api";

const Dashboard = (props) => {
  const [services, setServices] = useState(props.services);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSearch = (value) => {
    setIsLoading(true);
    setServices(services.filter(({ name }) => name.toLowerCase().startsWith(value.toLowerCase())));
    setIsLoading(false);
  };

  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Services</h1>

        <Stack direction="row" spacing={2}>
          <SearchForm onSearch={handleOnSearch} resetSearch={() => setServices(props.services)} />
          <Link href="services/new">
            <Button variant="contained">Create services</Button>
          </Link>
        </Stack>
      </Stack>

      {isLoading || !services ? (
        <Loader />
      ) : (
        <ServicesTable services={services} setServices={setServices} />
      )}
    </Container>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const { data: _services } = await getServices();
  return {
    props: { services: _services },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default Dashboard;
