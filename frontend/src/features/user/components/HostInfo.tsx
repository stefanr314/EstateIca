import { Avatar, Box, Card, Divider, Stack, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import StarIcon from "@mui/icons-material/Star";
import { mint, green, gray } from "@/shared/ui/theme";

interface Props {
  host: {
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl?: string;
    estatesCount: number;
  };
  averageHostRating: number;
}

export default function HostInfoCard({ host, averageHostRating }: Props) {
  return (
    <Card
      sx={{
        width: "100%",
        overflow: "hidden",
        boxShadow: 6,
        border: "2px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: 300,
        }}
      >
        {/* LEFT SIDE */}
        <Box
          sx={{
            width: { xs: "100%", md: "40%" },
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "inline-flex", // da se shrinka oko avatara
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* blur krug */}
            <Box
              sx={(theme) => ({
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${green[100]}, ${mint[100]})`,
                filter: "blur(30px)",
                opacity: 0.5,
                zIndex: 0,
                ...theme.applyStyles("dark", {
                  background: `linear-gradient(135deg, ${gray[700]}, ${gray[700]})`,
                }),
              })}
            />

            <Avatar
              src={host.profilePictureUrl}
              sx={{
                width: 112,
                height: 112,
                boxShadow: 6,
                border: "4px solid white",
                zIndex: 1,
              }}
            >
              {host.firstName[0]}
              {host.lastName[0]}
            </Avatar>
          </Box>
          <Stack spacing={1} textAlign="center">
            <Typography variant="h5" fontWeight="bold">
              {host.firstName} {host.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {host.email}
            </Typography>
            <Box
              sx={(theme) => ({
                display: "inline-flex",
                alignItems: "center",
                px: 1.5,
                py: 0.5,
                borderRadius: "999px",
                fontSize: 12,
                fontWeight: 600,
                bgcolor: "success.light",
                color: "text.primary",
                border: `1px solid ${green[200]}`,
                ...theme.applyStyles("dark", {
                  backgroundColor: "success.dark",
                  borderColor: green[600],
                }),
              })}
            >
              Verified Host
            </Box>
          </Stack>
        </Box>

        {/* Divider (desktop only) */}
        <Divider
          orientation="vertical"
          flexItem
          sx={(theme) => ({
            display: { xs: "none", md: "block" },
            color: theme.palette.divider,
          })}
        />

        {/* RIGHT SIDE */}
        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            p: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            gap: 3,
            bgcolor: "background.paper",
          }}
        >
          {/* Estates */}
          <Box
            sx={(theme) => ({
              flex: 1,
              minHeight: 220,
              border: "1px solid",
              borderColor: mint[50],
              borderRadius: 3,
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              backgroundColor: "background.paper",
              position: "relative",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: theme.shadows,
              "&:hover": {
                transform: "scale(1.05) translateY(-4px)",
                boxShadow: 8,
              },
              ...theme.applyStyles("dark", {
                border: 0,
                boxShadow:
                  "0px 6px 20px rgba(0,0,0,0.7), 0px 2px 8px rgba(0,0,0,0.6)",
              }),
            })}
          >
            <Box
              sx={(theme) => ({
                p: 2.5,
                borderRadius: "50%",
                backgroundColor: green[100],
                boxShadow: 4,
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.1)" },
                ...theme.applyStyles("dark", {
                  backgroundColor: green[800],
                }),
              })}
            >
              <HomeIcon
                sx={(theme) => ({
                  fontSize: 40,
                  color: green[600],
                  ...theme.applyStyles("dark", {
                    color: green[50],
                  }),
                })}
              />
            </Box>
            <Typography variant="h4" fontWeight="bold" color={"text.secondary"}>
              {host.estatesCount}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              color={"text.secondary"}
            >
              Properties Listed
            </Typography>
          </Box>

          {/* Rating */}
          <Box
            sx={(theme) => ({
              flex: 1,
              minHeight: 220,

              borderRadius: 3,
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              backgroundColor: "background.paper",
              position: "relative",
              cursor: "pointer",
              boxShadow: theme.shadows,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05) translateY(-4px)",
                boxShadow: 8,
              },
              ...theme.applyStyles("dark", {
                border: 0,
                boxShadow:
                  "0px 6px 20px rgba(0,0,0,0.7), 0px 2px 8px rgba(0,0,0,0.6)",
              }),
            })}
          >
            <Box
              sx={{
                p: 2.5,
                borderRadius: "50%",
                backgroundColor: mint[100],
                boxShadow: 4,
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              <StarIcon sx={{ fontSize: 40, color: green[600] }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" color={"text.secondary"}>
              {averageHostRating.toFixed(1)}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              color={"text.secondary"}
            >
              Average Rating
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
