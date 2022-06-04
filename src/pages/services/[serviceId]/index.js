import { Container, Breadcrumbs, Link as MuiLink } from "@mui/material";
import Link from "next/link";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import { getService } from "src/api";
import Loader from "src/components/Loader/Loader";
import StyleLink from "src/components/StyleLink/StyleLink";
import PageNotFound from "src/components/PageNotFound/PageNotFound";

const ServicesDetails = ({ service }) => {
  if (!service) {
    return (
      <PageNotFound
        title="Services not found"
        linkLabel="Go back to Services List"
        link="/services"
      />
    );
  }

  return (
    <Container>
      <h1>Details</h1>
      <Breadcrumbs aria-label="breadcrumb" mb={2}>
        <Link href="/services">
          <a className="styleLink">Services</a>
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
  const token = ctx.req.headers.cookie.split(";").find((c) => c.trim().startsWith(`token=`));
  const tokenValue = token.split("=")[1];

  const { data: _service } = await getService(ctx.query.serviceId, {
    headers: {
      Authorization: `Bearer ${tokenValue}`,
      "Content-Type": "application/json",
    },
  });

  return {
    props: {
      service: _service.data || null,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default ServicesDetails;
