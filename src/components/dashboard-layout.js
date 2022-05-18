import Head from "next/head";
import { useState, useEffect } from "react";
import Router from "next/router";
import NProgress from "nprogress";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";
import "nprogress/nprogress.css";

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 64,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 280,
  },
}));

export const DashboardLayout = (props) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(localStorage.getItem("user"));
    }
  }, []);

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Head>
            <title>Schedule App</title>
          </Head>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 8,
            }}
          >
            {children}
          </Box>
        </Box>
      </DashboardLayoutRoot>
      {user && <DashboardNavbar user={user} onSidebarOpen={() => setSidebarOpen(true)} />}
      {user && user.role !== "user" && (
        <DashboardSidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen} />
      )}
    </>
  );
};
