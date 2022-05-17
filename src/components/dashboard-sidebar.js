import { useEffect } from "react";
import PropTypes from "prop-types";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { Box, Drawer, useMediaQuery } from "@mui/material";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GroupIcon from "@mui/icons-material/Group";
import InsertChartIcon from "@mui/icons-material/InsertChart";

import { Logo } from "./logo";
import { NavItem } from "./nav-item";

const authLinks = [
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
    href: "/barangays-staff",
    icon: <GroupIcon fontSize="small" />,
    title: "Barangay Staffs",
  },
  // {
  //   href: "/settings",
  //   icon: <CogIcon fontSize="small" />,
  //   title: "Settings",
  // },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
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
            <NextLink href="/" passHref>
              <a>
                <Logo
                  sx={{
                    height: 42,
                    width: 42,
                  }}
                />
              </a>
            </NextLink>
          </Box>
        </div>
        <Box sx={{ flexGrow: 1 }}>
          {authLinks.map((item) => (
            <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
          ))}
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
