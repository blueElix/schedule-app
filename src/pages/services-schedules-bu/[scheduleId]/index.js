import { useEffect } from "react";
import { useRouter } from "next/router";
import { Container, Breadcrumbs, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import moment from "moment";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withUser } from "../../../helpers/auth";
import Loader from "src/components/Loader/Loader";
import PageNotFound from "src/components/PageNotFound/PageNotFound";
import { getSchedule } from "src/api";
import useServices from "src/hooks/useServices";
import useLocalStorage from "src/hooks/useLocalStorage";

const SchedulesDetails = ({ schedule }) => {
  const { services, filtersDispatch, isLoading } = useServices();
  const router = useRouter();
  const [user] = useLocalStorage("user");

  useEffect(() => {
    if (user.user.role !== "SERVICE") router.push("/");

    filtersDispatch({
      type: "limit",
      payload: 1000,
    });
  }, []);

  const renderServices = (serviceId) => {
    if (services.length > 0 && serviceId) {
      const currentScheduleServices = services.find(
        ({ id }) => id.toString() === serviceId.toString()
      );
      return currentScheduleServices ? currentScheduleServices.name : "";
    }
  };

  if (!schedule) {
    return (
      <PageNotFound
        title="Schedule not found"
        linkLabel="Go back to Services Schedules List"
        link="/services-schedules"
      />
    );
  }

  return (
    <Container>
      <h1>Details</h1>
      <Breadcrumbs aria-label="breadcrumb" mb={2}>
        <Link href="/services-schedules">
          <a className="styleLink">Services Schedules</a>
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

      {!schedule || isLoading ? (
        <Loader />
      ) : (
        <div>
          <h3>Services: {renderServices(schedule.service_id)}</h3>
          <h4>Date: {schedule.sched_date ? moment(schedule.sched_date).format("M/D/YYYY") : ""}</h4>
          <h4>
            Time:{" "}
            {schedule.start_time ? moment(schedule.start_time, "HH:mm:ss").format("HH:mm A") : ""}
          </h4>
          <h4>
            Time: {schedule.end_time ? moment(schedule.end_time, "HH:mm:ss").format("HH:mm A") : ""}
          </h4>
          <h4>Availability: {schedule.is_available ? "Available" : "Not Available"}</h4>
        </div>
      )}
    </Container>
  );
};

SchedulesDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const token = ctx.req.headers.cookie.split(";").find((c) => c.trim().startsWith(`token=`));
  const tokenValue = token.split("=")[1];

  const { data: _schedule } = await getSchedule(ctx.query.scheduleId, {
    headers: {
      Authorization: `Bearer ${tokenValue}`,
      "Content-Type": "application/json",
    },
  });

  return {
    props: {
      schedule: _schedule.data || null,
    },
  };
};

export const getServerSideProps = withUser(getProps);

export default SchedulesDetails;
