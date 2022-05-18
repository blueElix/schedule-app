import { Container, Breadcrumbs, Link as StyleLink } from "@mui/material";
import Link from "next/link";

import { DashboardLayout } from "../../../components/dashboard-layout";
import { withAdmin } from "../../../helpers/auth";
import { barangays } from "src/__mocks__/barangays";

const BarangaysDetails = ({ barangay }) => {
  return (
    <Container>
      <h1>Details</h1>
      <Breadcrumbs aria-label="breadcrumb" mb={2}>
        <Link href="/">
          <StyleLink underline="hover" color="inherit">
            Home
          </StyleLink>
        </Link>
        <Link href="/barangays">
          <StyleLink underline="hover" color="inherit">
            Barangays
          </StyleLink>
        </Link>
        <StyleLink underline="hover" color="text.primary" aria-current="page">
          Details
        </StyleLink>
      </Breadcrumbs>

      <div>
        <h3>Name: {barangay.name}</h3>
        <h4>Address: {barangay.address}</h4>
      </div>
    </Container>
  );
};

BarangaysDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const _barangay = barangays.find(({ id }) => id == ctx.query.barangayId);
  return {
    props: {
      barangay: _barangay,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default BarangaysDetails;
