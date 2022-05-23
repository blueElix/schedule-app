import { Container, Breadcrumbs, Link as StyleLink } from "@mui/material";
import Link from "next/link";

import { DashboardLayout } from "../../../components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import { getService } from "src/api";
import Loader from "../../../components/Loader/Loader";

const ServicesDetails = ({ service }) => {
  return (
    <Container>
      <h1>Details</h1>
      <Breadcrumbs aria-label="breadcrumb" mb={2}>
        <Link href="/">Home</Link>
        <Link href="/services">Services</Link>
        <StyleLink underline="hover" color="text.primary" aria-current="page">
          Details
        </StyleLink>
      </Breadcrumbs>

      {!service ? (
        <Loader />
      ) : (
        <div>
          <h3>Name: {service.name}</h3>
          <h4>Details: {service.description}</h4>
        </div>
      )}
    </Container>
  );
};

ServicesDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const { data: _service } = await getService(ctx.query.serviceId);
  return {
    props: {
      service: _service[0],
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default ServicesDetails;
