import { Container, Breadcrumbs, Link as MuiLink } from "@mui/material";
import Link from "next/link";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import { getService } from "src/api";
import Loader from "src/components/Loader/Loader";
import StyleLink from "src/components/StyleLink/StyleLink";

const ServicesDetails = ({ service }) => {
  return (
    <Container>
      <h1>Details</h1>
      <Breadcrumbs aria-label="breadcrumb" mb={2}>
        <Link href="/">
          <StyleLink>Home</StyleLink>
        </Link>
        <Link href="/services">
          <StyleLink>Services</StyleLink>
        </Link>
        <MuiLink
          color="text.primary"
          aria-current="page"
          sx={{
            textDecoration: "none",
          }}
        >
          Details
        </MuiLink>
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
