import { useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import useLocalStorage from "src/hooks/useLocalStorage";
import { logout } from "src/helpers/auth";

import { Logo } from "./logo";
import { NavItem } from "./nav-item";

const adminLinks = [
  {
    href: "/",
    icon: <InsertChartIcon fontSize="small" />,
    title: "Dashboard",
  },
  {
    href: "/services",
    icon: <FactCheckIcon fontSize="small" />,
    title: "Services",
  },
  {
    href: "/staffs",
    icon: <AccountBoxIcon fontSize="small" />,
    title: "Staffs",
  },
  {
    href: "/schedules",
    icon: <EventNoteIcon fontSize="small" />,
    title: "Schedules",
  },
  {
    href: "/barangays",
    icon: <AccountBalanceIcon fontSize="small" />,
    title: "Barangays",
  },
  {
    href: "/bookings",
    icon: <MenuBookIcon fontSize="small" />,
    title: "Bookings",
  },
  {
    href: "/account",
    icon: <AccountCircleIcon fontSize="small" />,
    title: "Profile",
  },
];

const staffLinks = [
  {
    href: "/bookings",
    icon: <MenuBookIcon fontSize="small" />,
    title: "Bookings",
  },
  {
    href: "/account",
    icon: <AccountCircleIcon fontSize="small" />,
    title: "Profile",
  },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const [user] = useLocalStorage("user");
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <Link href="/">
              <a>
                <Logo
                  sx={{
                    height: 42,
                    width: 42,
                  }}
                />
              </a>
            </Link>
          </Box>
        </div>
        <Box sx={{ flexGrow: 1 }}>
          {user &&
            (user.user.role === "superadmin" || user.user.role === "admin") &&
            adminLinks.map((item) => (
              <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
            ))}

          {user &&
            user.user.role == "user" &&
            (user.user.type === "barangay-staff" || user.user.type === "service-staff") &&
            staffLinks.map((item) => (
              <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
            ))}
          <NavItem
            icon={<ExitToAppIcon fontSize="small" />}
            title="Logout"
            href="/login"
            onClick={logout}
          />
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
