import { Container, Breadcrumbs, Link as StyleLink } from "@mui/material";
import Link from "next/link";

import { DashboardLayout } from "../../../components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import Loader from "../../../components/Loader/Loader";
import { getBarangay } from "src/api";

const BarangaysDetails = ({ barangay }) => {
  return (
    <Container>
      <h1>Details</h1>
      <Breadcrumbs aria-label="breadcrumb" mb={2}>
        <Link href="/">Home</Link>
        <Link href="/barangays">Barangays</Link>
        <StyleLink underline="hover" color="text.primary" aria-current="page">
          Details
        </StyleLink>
      </Breadcrumbs>
      {!barangay ? (
        <Loader />
      ) : (
        <div>
          <h3>Name: {barangay.name}</h3>
          <h4>Address: {barangay.address}</h4>
        </div>
      )}
    </Container>
  );
};

BarangaysDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const { data: _barangay } = await getBarangay(ctx.query.barangayId);
  return {
    props: {
      barangay: _barangay[0],
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default BarangaysDetails;
