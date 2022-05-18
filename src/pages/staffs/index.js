import { useState } from "react";
import Link from "next/link";
import { Container, Stack, Button } from "@mui/material";

import { DashboardLayout } from "../../components/dashboard-layout";
import { withAdmin } from "../../helpers/auth";
import { users as _staffs } from "src/__mocks__/users";
import StaffsTable from "src/components/StaffsTable/StaffsTable";

const Dashboard = (props) => {
  const [staffs, setStaffs] = useState(props.staffs);
  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Staffs</h1>
        <Link href="staffs/new">
          <Button variant="contained">Create staffs</Button>
        </Link>
      </Stack>

      <StaffsTable staffs={staffs} setStaffs={setStaffs} />
    </Container>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: { staffs: _staffs },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default Dashboard;
