import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Container,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WovenImageList from "../components/imageLists/WovenImageList";
import { useNavigate } from "react-router-dom";
import ScrollToTopFab from "../components/ScrollToTopFab";

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1549388604-817d15aa0110",
    title: "Bed",
  },
  {
    img: "https://unsplash.com/photos/a-large-building-with-a-clock-on-the-top-of-it-SjNe0bwcuyw?utm_content=creditShareLink&utm_medium=referral&utm_source=unsplash",
    title: "Clock Tower",
  },
  {
    img: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3",
    title: "Kitchen",
  },
  {
    img: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
    title: "Sink",
  },
  {
    img: "https://images.unsplash.com/photo-1525097487452-6278ff080c31",
    title: "Books",
  },
  {
    img: "https://images.unsplash.com/photo-1574180045827-681f8a1a9622",
    title: "Chairs",
  },
  {
    img: "https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62",
    title: "Candle",
  },
  {
    img: "https://images.unsplash.com/photo-1530731141654-5993c3016c77",
    title: "Laptop",
  },
  {
    img: "https://images.unsplash.com/photo-1481277542470-605612bd2d61",
    title: "Doors",
  },
  {
    img: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7",
    title: "Coffee",
  },
  {
    img: "https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee",
    title: "Storage",
  },
  {
    img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
    title: "Coffee table",
  },
  {
    img: "https://images.unsplash.com/photo-1588436706487-9d55d73a39e3",
    title: "Blinds",
  },
];

const Album: React.FC = () => {
  const navigate = useNavigate();
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
        <Box sx={{ bgcolor: "background.paper", py: 8 }}>
          <Box sx={{ maxWidth: 600, mx: "auto", pb: 6 }}>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Album layout
            </Typography>
            <Typography variant="h6" align="center" color="textSecondary">
              Something short and leading about the collection below—its
              contents, the creator, etc. Make it short and sweet, but not too
              short so folks don&apos;t simply skip over it entirely.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid>
                  <Button variant="contained" color="primary">
                    Main call to action
                  </Button>
                </Grid>
                <Grid>
                  <Button variant="outlined" color="primary">
                    Secondary action
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>

        <Container sx={{ py: 8 }} maxWidth="xl">
          {/* End hero unit */}

          <WovenImageList itemData={itemData} />
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
          Something here to give the footer a purpose!
        </Typography>
      </Box>
      {/* End footer */}
      <ScrollToTopFab />
    </React.Fragment>
  );
};

export default Album;
