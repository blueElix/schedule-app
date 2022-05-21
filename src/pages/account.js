import { Container, Grid, Typography } from "@mui/material";
import { AccountProfile } from "../components/Account/AccountProfile";
import { AccountProfileDetails } from "../components/Account/AccountProfileDetails";
import { DashboardLayout } from "../components/DashboadLayout";

const Account = () => (
  <>
    <Container maxWidth="lg">
      <Typography sx={{ mb: 3 }} variant="h4">
        Account
      </Typography>
      <Grid container spacing={3}>
        <Grid item lg={4} md={6} xs={12}>
          <AccountProfile />
        </Grid>
        <Grid item lg={8} md={6} xs={12}>
          <AccountProfileDetails />
        </Grid>
      </Grid>
    </Container>
  </>
);

Account.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Account;
