import { useAppSelector } from "@/app/store/hooks";
import { selectUser } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  Stack,
} from "@mui/material";

import HomeWorkIcon from "@mui/icons-material/HomeWork";
import ReviewsIcon from "@mui/icons-material/Reviews";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

const cardData = [
  {
    title: "Vaše nekretnine",
    description: "Pregledaj i uređuj tvoje objavljene nekretnine.",
    icon: <HomeWorkIcon fontSize="large" />,
    route: "/dashboard/your-estates",
    roles: ["host"],
  },
  {
    title: "Vaše rezervacije",
    description:
      "Pregled i upravljanje rezervacijama koje ste dosad napravili.",
    icon: <CalendarMonthIcon fontSize="large" />,
    route: "/dashboard/reservations/mine",
    roles: ["host", "guest"],
  },
  {
    title: "Rezervacije vaših nekretnina",
    description: "Upravljaj rezervacijama vaših smještajnih jedinica.",
    icon: <CalendarMonthIcon fontSize="large" />,
    route: "/dashboard/reservations/host",
    roles: ["host"],
  },
  {
    title: "Vaše recenzije",
    description: "Pogledaj recenzije koje ste dosad ostavili.",
    icon: <ReviewsIcon fontSize="large" />,
    route: "/dashboard/reviews/mine",
    roles: ["host", "guest"],
  },
  {
    title: "Recenzije vaših nekretnina",
    description: "Pogledaj šta drugi misle o tvojim smeštajima.",
    icon: <ReviewsIcon fontSize="large" />,
    route: "/dashboard/reviews/host",
    roles: ["host"],
  },
  {
    title: "Domaćin - zahtjevi",
    description:
      "Pregledaj pristigle zahjteve za proces postajanja domaćina u aplikaciji.",
    icon: <AssignmentTurnedInIcon fontSize="large" />,
    route: "/dashboard/host-requests",
    roles: ["admin"],
  },
  {
    title: "Vaš profil",
    description: "Pregledaj svoj profil.",
    icon: <AccountBoxIcon fontSize="large" />,
    route: "/dashboard/profile",
    roles: ["admin", "host", "guest"],
  },
];

export default function HomePageContent() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const theme = useTheme();

  if (!user) return null;

  const visibleCards = cardData.filter((card) =>
    card.roles.includes(user.role)
  );

  return (
    <Stack sx={{ width: "100%", px: 3, pb: 6, pt: 3 }}>
      <Grid container spacing={4}>
        {visibleCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6 }} key={index}>
            <Card
              elevation={3}
              sx={{
                height: 280,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.light}05 100%)`,
                border: `1px solid ${theme.palette.primary.main}15`,
                display: card.roles.includes(user.role) ? "flex" : "none",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: theme.shadows[8],
                  transform: "translateY(-8px)",
                  borderColor: theme.palette.primary.main,
                },
              }}
              onClick={() => navigate(card.route)}
            >
              <CardContent
                sx={{
                  p: 4,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "space-between",
                }}
              >
                {/* Icon */}
                <Stack alignItems="center" sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      fontSize: "3rem",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {card.icon}
                  </Typography>
                </Stack>

                {/* Content */}
                <Stack
                  spacing={2}
                  sx={{
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ color: theme.palette.primary.main }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.6,
                    }}
                  >
                    {card.description}
                  </Typography>
                </Stack>

                {/* Button */}
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    py: 1.5,
                    fontSize: "1rem",
                    boxShadow: theme.shadows[2],
                    "&:hover": {
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  Otvori
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
