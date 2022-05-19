import { Container } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import { withAdmin } from "src/helpers/auth";
import { customers } from "src/__mocks__/customers";

const Dashboard = () => (
  <Container>
    <h1>Welcome</h1>
  </Container>
);

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: {},
  };
};

export const getServerSideProps = withAdmin(getProps);

export default Dashboard;
