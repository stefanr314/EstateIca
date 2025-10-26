import React from "react";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WovenImageList from "../../shared/components/imageLists/WovenImageList";
import { useNavigate, useParams } from "react-router-dom";
import ScrollToTopFab from "../../shared/components/ScrollToTopFab";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "@/app/api/agent";
import { IBusinessEstate, IResidentialEstate } from "./types";

const Album: React.FC = () => {
  const navigate = useNavigate();
  const id = useParams<{ id: string }>().id;
  const queryClient = useQueryClient();

  const { data: estate, isPending } = useQuery<
    IResidentialEstate | IBusinessEstate
  >({
    queryKey: ["estate", id],
    queryFn: async () => {
      const response = await agent.Estates.getEstateById(id!);
      return response.estate;
    },
    initialData: () => queryClient.getQueryData(["estate", id]),
  });

  return (
    <React.Fragment>
      <AppBar
        position="fixed"
        elevation={2}
        sx={{ bgcolor: "background.default" }}
      >
        <Toolbar>
          <ArrowBackIcon
            sx={{ mr: 2, color: "text.primary", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          <Typography variant="h6" color="text.primary" noWrap>
            Album
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box sx={{ bgcolor: "background.paper", pt: 10 }}>
          <Box sx={{ maxWidth: 600, mx: "auto", pb: 2 }}>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Album slika
            </Typography>
          </Box>
        </Box>

        <Container sx={{ py: 8 }} maxWidth="xl">
          <WovenImageList isPending={isPending} itemData={estate?.images} />
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Slike nekretnine
        </Typography>
      </Box>
      {/* End footer */}
      <ScrollToTopFab />
    </React.Fragment>
  );
};

export default Album;
