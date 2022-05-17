import { Container, Breadcrumbs, Link as StyleLink } from "@mui/material";
import Link from "next/link";

import { DashboardLayout } from "../../../components/dashboard-layout";
import { withAdmin } from "../../../helpers/auth";
import { services } from "src/__mocks__/services";

const ServicesDetails = ({ service }) => {
  return (
    <Container>
      <h1>Details</h1>
      <Breadcrumbs aria-label="breadcrumb" mb={2}>
        <Link href="/">
          <StyleLink underline="hover" color="inherit">
            Home
          </StyleLink>
        </Link>
        <Link href="/services">
          <StyleLink underline="hover" color="inherit">
            Services
          </StyleLink>
        </Link>
        <StyleLink underline="hover" color="text.primary" aria-current="page">
          Details
        </StyleLink>
      </Breadcrumbs>

      <div>
        <h3>Name: {service.name}</h3>
        <h4>Details: {service.description}</h4>
      </div>
    </Container>
  );
};

ServicesDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const _service = services.find(({ id }) => id == ctx.query.serviceId);
  return {
    props: {
      service: _service,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default ServicesDetails;
