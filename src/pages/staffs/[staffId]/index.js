import { Container, Breadcrumbs, Link as StyleLink } from "@mui/material";
import Link from "next/link";

import { DashboardLayout } from "../../../components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import { users } from "src/__mocks__/users";
import Loader from "../../../components/Loader/Loader";

const StaffsDetails = ({ staff }) => {
  return (
    <Container>
      <h1>Details</h1>
      <Breadcrumbs aria-label="breadcrumb" mb={2}>
        <Link href="/">
          <StyleLink underline="hover" color="inherit">
            Home
          </StyleLink>
        </Link>
        <Link href="/staffs">
          <StyleLink underline="hover" color="inherit">
            Staffs
          </StyleLink>
        </Link>
        <StyleLink underline="hover" color="text.primary" aria-current="page">
          Details
        </StyleLink>
      </Breadcrumbs>

      {!staff ? (
        <Loader />
      ) : (
        <div>
          <h3>Name: {staff.name}</h3>
          <h4>Role: {staff.role}</h4>
          <h4>Email: {staff.email}</h4>
          <h4>Contact: +60{staff.contact}</h4>
          <h4>Type: {staff.type}</h4>
        </div>
      )}
    </Container>
  );
};

StaffsDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const _staff = users.find(({ id }) => id == ctx.query.staffId);
  return {
    props: {
      staff: _staff,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default StaffsDetails;
