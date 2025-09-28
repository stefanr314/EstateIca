import { useAppSelector } from "@/app/store/hooks";
import { NavLink } from "react-router";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";

import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import VillaRoundedIcon from "@mui/icons-material/VillaRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";

import { mint } from "@/shared/ui/theme";
import { selectUser } from "@/features/auth/authSlice";
import { useMemo } from "react";

const mainListItems = [
  {
    text: "Pocetna",
    icon: <DashboardCustomizeRoundedIcon />,
    route: "/dashboard",
    roles: ["admin", "host", "guest"],
  },
  {
    text: "Vase nekretnine",
    icon: <VillaRoundedIcon />,
    route: "/dashboard/your-estates",
    roles: ["host"],
  },
  {
    text: "Vase rezervacije",
    icon: <EventAvailableRoundedIcon />,
    route: "/dashboard/reservations/mine",
    roles: ["host", "guest"],
  },
  {
    text: "Rezervacije vasih nekretnina",
    icon: <EventAvailableRoundedIcon />,
    route: "/dashboard/reservations/host",
    roles: ["host"],
  },
  {
    text: "Vase recenzije",
    icon: <RateReviewRoundedIcon />,
    route: "/dashboard/reviews/mine",
    roles: ["host", "guest"],
  },
  {
    text: "Recenzije vasih nekretnina",
    icon: <RateReviewRoundedIcon />,
    route: "/dashboard/reviews/host",
    roles: ["host"],
  },
  {
    text: "Domacin - zahtjevi",
    icon: <RateReviewRoundedIcon />,
    route: "/dashboard/host-requests",
    roles: ["admin"],
  },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon /> },
  { text: "About", icon: <InfoRoundedIcon /> },
  { text: "Feedback", icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {
  const user = useAppSelector(selectUser);

  if (!user) return null;

  const visibleListItems = useMemo(
    () => mainListItems.filter((item) => item.roles.includes(user.role)),
    [user.role]
  );

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List>
        {visibleListItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{
              display: "block",
            }}
          >
            <ListItemButton
              component={NavLink}
              to={item.route}
              end={item.route === "/dashboard"}
              sx={(theme) => ({
                "&.active": {
                  backgroundColor: mint[200],
                  color: theme.palette.text.primary,
                  borderRadius: 2,
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.text.primary,
                  },
                },
              })}
            >
              <ListItemIcon color={mint[600]}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Stack>
  );
}
