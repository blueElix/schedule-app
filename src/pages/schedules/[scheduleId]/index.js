import { Container, Breadcrumbs, Link as MuiLink } from "@mui/material";
import Link from "next/link";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import { schedules } from "src/__mocks__/schedules";
import { services } from "src/__mocks__/services";
import Loader from "src/components/Loader/Loader";
import StyleLink from "src/components/StyleLink/StyleLink";

const SchedulesDetails = ({ schedule }) => {
  return (
    <Container>
      <h1>Details</h1>
      <Breadcrumbs aria-label="breadcrumb" mb={2}>
        <Link href="/">
          <StyleLink>Home</StyleLink>
        </Link>
        <Link href="/schedules">
          <StyleLink>Schedules</StyleLink>
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

      {!schedule ? (
        <Loader />
      ) : (
        <div>
          <h3>Services: {services.find(({ id }) => id === schedule.services).name}</h3>
          <h4>Date: {schedule.bookedDate}</h4>
          <h4>Time: {schedule.bookedTime}</h4>
          <h4>Availability: {schedule.isAvailable ? "Available" : "Not Available"}</h4>
        </div>
      )}
    </Container>
  );
};

SchedulesDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const _schedule = schedules.find(({ id }) => id == ctx.query.scheduleId);
  return {
    props: {
      schedule: _schedule,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default SchedulesDetails;
