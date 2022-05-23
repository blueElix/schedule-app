import { Container } from "@mui/material";
import { DashboardLayout } from "../components/DashboadLayout";
import { withAdmin } from "src/helpers/auth";

const Dashboard = () => {
  return (
    <Container>
      <h1>Welcome</h1>
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
