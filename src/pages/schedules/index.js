import { useState } from "react";
import Link from "next/link";
import { Container, Stack, Button } from "@mui/material";

import { DashboardLayout } from "../../components/dashboard-layout";
import { withAdmin } from "../../helpers/auth";
import { schedules as _schedules } from "src/__mocks__/schedules";
import SchedulesTable from "src/components/SchedulesTable/SchedulesTable";

const Dashboard = (props) => {
  const [schedules, setSchedules] = useState(props.schedules);
  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Schedules</h1>
        <Link href="schedules/new">
          <Button variant="contained">Create schedule</Button>
        </Link>
      </Stack>

      <SchedulesTable schedules={schedules} setSchedules={setSchedules} />
    </Container>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: { schedules: _schedules },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default Dashboard;
