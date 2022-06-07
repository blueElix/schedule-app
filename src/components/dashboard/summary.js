import { Avatar, Box, Card, CardContent, Grid, Typography, Container } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import MoneyIcon from "@mui/icons-material/Money";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useEffect, useState } from "react";
import useServices from "src/hooks/useServices";
import useStaffs from "src/hooks/useStaffs";
import useSchedules from "src/hooks/useSchedules";
import useBarangay from "src/hooks/useBarangays";

const summary = [
  {
    icon: <FactCheckIcon fontSize="small" />,
    title: "Services",
    slug: "services",
    color: "success.main",
  },
  {
    icon: <AccountBoxIcon fontSize="small" />,
    title: "Staffs",
    slug: "staffs",
    color: "info.main",
  },
  {
    icon: <EventNoteIcon fontSize="small" />,
    title: "Schedules",
    slug: "schedules",
    color: "primary.main",
  },
  {
    icon: <AccountBalanceIcon fontSize="small" />,
    title: "Barangays",
    slug: "barangays",
    color: "error.main",
  },
];

export const Summary = (props) => {
  const { pagination: totalServices } = useServices();
  const { pagination: totalStaffs } = useStaffs();
  const { pagination: totalSchedules } = useSchedules();
  const { pagination: totalBarangays } = useBarangay();

  return (
    <Container>
      <Grid container spacing={2}>
        {summary.map((summ) => (
          <Grid item xs={6} md={6}>
            <Card sx={{ height: "100%" }} {...props}>
              <CardContent>
                <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
                  <Grid item>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      {summ.title}
                    </Typography>
                    <Typography color="textPrimary" variant="h4">
                      {summ.slug === "services" && totalServices
                        ? totalServices.total
                        : summ.slug === "staffs" && totalStaffs
                        ? totalStaffs.total
                        : summ.slug === "schedules" && totalSchedules
                        ? totalSchedules.total
                        : summ.slug === "barangays" && totalBarangays
                        ? totalBarangays.total
                        : ""}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar
                      sx={{
                        backgroundColor: summ.color,
                        height: 56,
                        width: 56,
                      }}
                    >
                      {summ.icon}
                    </Avatar>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
