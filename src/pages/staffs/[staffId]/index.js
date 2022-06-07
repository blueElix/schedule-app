import { Container, Breadcrumbs, Link as MuiLink } from "@mui/material";
import Link from "next/link";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import Loader from "src/components/Loader/Loader";
import { getStaff } from "src/api";

const StaffsDetails = ({ staff }) => {
  return (
    <Container>
      <h1>Details</h1>
      <Breadcrumbs aria-label="breadcrumb" mb={2}>
        <Link href="/staffs">
          <a className="styleLink">Staffs</a>
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

      {!staff ? (
        <Loader />
      ) : (
        <div>
          <h3>Name: {staff.full_name}</h3>
          <h4>Email: {staff.email}</h4>
          <h4>Contact: {staff.contact}</h4>
          <h4>Type: {staff.type}</h4>
        </div>
      )}
    </Container>
  );
};

StaffsDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const token = ctx.req.headers.cookie.split(";").find((c) => c.trim().startsWith(`token=`));
  const tokenValue = token.split("=")[1];

  const { data: _staff } = await getStaff(ctx.query.staffId, {
    headers: {
      Authorization: `Bearer ${tokenValue}`,
      "Content-Type": "application/json",
    },
  });

  return {
    props: {
      staff: _staff.data || null,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default StaffsDetails;
