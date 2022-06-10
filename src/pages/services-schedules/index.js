import { useEffect } from "react";
import { useRouter } from "next/router";
import { Container, Stack } from "@mui/material";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withUser } from "../../helpers/auth";
import Loader from "src/components/Loader/Loader";
import useServicesSchedules from "src/hooks/useServicesSchedules";
import ServicesScheduleTableView from "src/components/ServicesScheduleTableView/ServicesScheduleTableView";
import useLocalStorage from "src/hooks/useLocalStorage";

const ServicesSchedules = (props) => {
  const { schedules, isLoading } = useServicesSchedules();
  const router = useRouter();
  const [user] = useLocalStorage("user");

  useEffect(() => {
    if (user.user.role !== "SERVICE") router.push("/");
  }, []);

  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Services Schedules</h1>
      </Stack>
      {isLoading || !schedules ? (
        <Loader />
      ) : (
        <>
          <ServicesScheduleTableView schedules={schedules} />
        </>
      )}
    </Container>
  );
};

ServicesSchedules.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: {},
  };
};

export const getServerSideProps = withUser(getProps);

export default ServicesSchedules;
