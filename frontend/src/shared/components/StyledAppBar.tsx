import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  useScrollTrigger,
  Slide,
  Container,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import { Box, Grid, styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StyledSearchBar from "./StyledSearchBar";
import { mainTheme } from "../ui/theme";

const StyledAppBar = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  backgroundColor: "#f7f9f7",
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  height: 104,
  color: theme.palette.secondary.main,
  transition: theme.transitions.create(["height", "background-color"], {
    duration: theme.transitions.duration.enteringScreen,
    easing: theme.transitions.easing.easeIn,
  }),
}));

const AppBarScrolled = styled(StyledAppBar)(() => ({
  backgroundColor: "#f8f8f8",
  height: 76,
}));

const ToolbarStyled = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Title = styled(Typography)(({ theme }) => ({
  // flexGrow: 1,

  color: theme.palette.primary.main,
}));

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  color: theme.palette.primary.main,
}));

interface HideOnScrollProps {
  children: React.ReactElement;
}

function HideOnScroll(props: HideOnScrollProps) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger} easing={"ease-in"}>
      {children}
    </Slide>
  );
}

const CustomAppBar: React.FC<{ onMenuClick: () => void }> = ({
  onMenuClick,
}) => {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  return (
    <HideOnScroll>
      {trigger ? (
        <AppBarScrolled position="sticky" theme={mainTheme}>
          <Container maxWidth="xl">
            <ToolbarStyled>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButtonStyled
                  edge="start"
                  aria-label="menu"
                  onClick={onMenuClick}
                >
                  <MenuIcon />
                </IconButtonStyled>
                <Title variant="h6">My Header</Title>
              </Box>
              <Box>
                <IconButtonStyled aria-label="search">
                  <SearchIcon />
                </IconButtonStyled>
              </Box>
              <div>
                <IconButtonStyled aria-label="notifications">
                  <NotificationsIcon />
                </IconButtonStyled>
                <IconButtonStyled aria-label="account">
                  <AccountCircleIcon />
                </IconButtonStyled>
                <ButtonStyled variant="outlined">Login</ButtonStyled>
              </div>
            </ToolbarStyled>
          </Container>
        </AppBarScrolled>
      ) : (
        <StyledAppBar position="sticky" theme={mainTheme}>
          <Container maxWidth="xl">
            <ToolbarStyled>
              <Grid
                container
                direction="column"
                alignItems="strech"
                justifyContent="center"
                width="100%"
              >
                <Grid>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <IconButtonStyled
                      edge="start"
                      aria-label="menu"
                      onClick={onMenuClick}
                    >
                      <MenuIcon />
                    </IconButtonStyled>
                    <Title variant="h6">My Custom Header</Title>
                    <div>
                      <IconButtonStyled aria-label="notifications">
                        <NotificationsIcon />
                      </IconButtonStyled>
                      <IconButtonStyled aria-label="account">
                        <AccountCircleIcon />
                      </IconButtonStyled>
                      <ButtonStyled variant="outlined">Login</ButtonStyled>
                    </div>
                  </Box>
                </Grid>
                <Grid>
                  <StyledSearchBar />
                </Grid>
              </Grid>
            </ToolbarStyled>
          </Container>
        </StyledAppBar>
      )}
    </HideOnScroll>
  );
};

export default CustomAppBar;
