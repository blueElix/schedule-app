import { Container, Breadcrumbs, Link as MuiLink } from "@mui/material";
import Link from "next/link";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import Loader from "src/components/Loader/Loader";
import StyleLink from "src/components/StyleLink/StyleLink";
import { getBarangay } from "src/api";
import PageNotFound from "src/components/PageNotFound/PageNotFound";

const BarangaysDetails = ({ barangay }) => {
  if (!barangay) {
    return (
      <PageNotFound
        title="Barangay not found"
        linkLabel="Go back to Barangays List"
        link="/barangays"
      />
    );
  }
  return (
    <Container>
      <h1>Details</h1>
      <Breadcrumbs aria-label="breadcrumb" mb={2}>
        <Link href="/">
          <StyleLink>Home</StyleLink>
        </Link>
        <Link href="/barangays">
          <StyleLink> Barangays</StyleLink>
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
      barangay: _barangay.length > 0 ? _barangay[0] : null,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default BarangaysDetails;
