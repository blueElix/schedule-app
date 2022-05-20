import { useState } from "react";
import Link from "next/link";
import { Container, Stack, Button } from "@mui/material";

import { DashboardLayout } from "../../components/DashboadLayout";
import { withAdmin } from "../../helpers/auth";
import { schedules as _schedules } from "src/__mocks__/schedules";
import SchedulesTable from "src/components/SchedulesTable/SchedulesTable";
import SearchForm from "src/components/SearchForm/SearchForm";
import Loader from "src/components/Loader/Loader";

const Schedules = (props) => {
  const [schedules, setSchedules] = useState(props.schedules);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSearch = (value) => {
    setIsLoading(true);
    setSchedules(
      schedules.filter(({ bookedDate }) => bookedDate.toLowerCase().startsWith(value.toLowerCase()))
    );
    setIsLoading(false);
  };

  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Schedules</h1>

        <Stack direction="row" spacing={2}>
          <SearchForm onSearch={handleOnSearch} resetSearch={() => setSchedules(props.schedules)} />
          <Link href="schedules/new">
            <Button variant="contained">Create schedule</Button>
          </Link>
        </Stack>
      </Stack>
      {isLoading || !schedules ? (
        <Loader />
      ) : (
        <SchedulesTable schedules={schedules} setSchedules={setSchedules} />
      )}
    </Container>
  );
};

Schedules.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: { schedules: _schedules },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default Schedules;
