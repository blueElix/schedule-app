import { Container } from "@mui/material";
import { DashboardLayout } from "../components/DashboadLayout";
import { withAdmin } from "src/helpers/auth";
import { Budget } from "src/components/dashboard/budget";
import { Summary } from "src/components/dashboard/summary";

const Dashboard = () => {
  return (
    <Container>
      <h1>Welcome</h1>
      {/* <Budget /> */}
      <Summary />
    </Container>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: {},
  };
};

export const getServerSideProps = withAdmin(getProps);

export default Dashboard;
