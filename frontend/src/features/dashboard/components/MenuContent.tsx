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
    route: "/dashboard/reservations",
    roles: ["host", "guest"],
  },
  {
    text: "Rezervacije vasih nekretnina",
    icon: <EventAvailableRoundedIcon />,
    route: "/dashboard/reservations",
    roles: ["host"],
  },
  {
    text: "Vase recenzije",
    icon: <RateReviewRoundedIcon />,
    route: "/dashboard/reviews",
    roles: ["host", "guest"],
  },
  {
    text: "Recenzije vasih nekretnina",
    icon: <RateReviewRoundedIcon />,
    route: "/dashboard/reviews",
    roles: ["host"],
  },
  {
    text: "Domacin - zahtjevi",
    icon: <RateReviewRoundedIcon />,
    route: "/dashboard/reviews",
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

  const currentUserRole = user.role;
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List>
        {mainListItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{
              display: item.roles.includes(currentUserRole) ? "block" : "none",
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
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
