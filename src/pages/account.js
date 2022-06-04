import { Container, Grid, Typography } from "@mui/material";
import { AccountProfileDetails } from "../components/Account/AccountProfileDetails";
import { DashboardLayout } from "../components/DashboadLayout";
import { withUser } from "src/helpers/auth";

const Account = () => {
  return (
    <>
      <Container maxWidth="lg">
        <Typography sx={{ mb: 3 }} variant="h4">
          Account
        </Typography>
        <Grid container spacing={3}>
          <Grid item lg={8} md={6} xs={12}>
            <AccountProfileDetails />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

Account.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: {},
  };
};

export const getServerSideProps = withUser(getProps);
export default Account;
