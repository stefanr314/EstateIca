import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  useScrollTrigger,
  Container,
  Tabs,
  Tab,
  Grid,
  Link as MuiLink,
  Box,
} from "@mui/material";

import { styled } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";

import StyledSearchBar from "./StyledSearchBar";
import { Link } from "react-router";
import FilterDialog from "@/features/estates/components/filter/FilterDialog";
import ToggleThemeColor from "./ToggleThemeColor";
import { useAppDispatch } from "@/app/store/hooks";
import { pushNotification } from "@/features/notifications/notificationSlice";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#f7f9f7",
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  height: "8rem",
  color: theme.palette.secondary.main,
  transition: theme.transitions.create(
    ["height", "background-color", "opacity", "transform"],
    {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.easeIn,
    }
  ),
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
  color: theme.palette.primary.main,
}));

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const CustomAppBar: React.FC<{ onMenuClick: () => void }> = ({
  onMenuClick,
}) => {
  const [overrideFullAppBar, setOverrideFullAppBar] = React.useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);
  const fullAppBarRef = React.useRef<HTMLDivElement>(null);
  const popperRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  const showFullAppBar = !trigger || overrideFullAppBar;
  const showCompactAppBar = trigger && !overrideFullAppBar;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedInsideAppBar =
        fullAppBarRef.current?.contains(target) ?? false;
      const clickedInsidePopper = popperRef.current?.contains(target) ?? false;

      if (overrideFullAppBar && !clickedInsideAppBar && !clickedInsidePopper) {
        setOverrideFullAppBar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [overrideFullAppBar]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOverrideFullAppBar(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* CompactAppBar - uvek u DOM-u, samo se sakriva */}
      <AppBarScrolled
        position="fixed"
        sx={{
          top: 0,
          zIndex: 1200,
          opacity: showCompactAppBar ? 1 : 0,
          transform: showCompactAppBar ? "translateY(0)" : "translateY(-100%)",
          pointerEvents: showCompactAppBar ? "auto" : "none",
          transition: (theme) =>
            theme.transitions.create(["opacity", "transform"], {
              duration: theme.transitions.duration.enteringScreen,
              easing: theme.transitions.easing.easeIn,
            }),
        }}
      >
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
              <Title variant="h5">EstateIca</Title>
            </Box>
            <Box>
              <IconButtonStyled
                aria-label="search"
                onClick={() => setOverrideFullAppBar(true)}
              >
                <SearchIcon />
              </IconButtonStyled>
            </Box>
            <div>
              <IconButtonStyled
                aria-label="notifications"
                onClick={() =>
                  dispatch(
                    pushNotification({
                      type: "warning",
                      message:
                        "You've entered a matrix system welcome, and take your seat please :)",
                    })
                  )
                }
              >
                <NotificationsIcon />
              </IconButtonStyled>
              <IconButtonStyled aria-label="account">
                <AccountCircleIcon />
              </IconButtonStyled>
              <ButtonStyled variant="outlined">Login</ButtonStyled>
            </div>
            <div>
              <FilterDialog />
              <ToggleThemeColor />
            </div>
          </ToolbarStyled>
        </Container>
      </AppBarScrolled>

      {/* FullAppBar - uvek u DOM-u, samo se sakriva */}
      <StyledAppBar
        position="fixed"
        ref={fullAppBarRef}
        sx={{
          top: trigger && !overrideFullAppBar ? 76 : 0,
          zIndex: 1100,
          height: "fit-content",
          opacity: showFullAppBar ? 1 : 0,
          transform: showFullAppBar ? "translateY(0)" : "translateY(-100%)",
          pointerEvents: showFullAppBar ? "auto" : "none",
          transition: (theme) =>
            theme.transitions.create(["top", "opacity", "transform"], {
              duration: theme.transitions.duration.enteringScreen,
              easing: theme.transitions.easing.easeIn,
            }),
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            direction="column"
            alignItems="strech"
            justifyContent="center"
            width="100%"
            gap={1}
          >
            <Grid>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  mt: 1,
                }}
              >
                <div>
                  <IconButtonStyled
                    edge="start"
                    aria-label="menu"
                    onClick={onMenuClick}
                  >
                    <MenuIcon />
                  </IconButtonStyled>
                  <Title variant="h5" display={"inline"}>
                    <MuiLink
                      component={Link}
                      to="/"
                      underline="none"
                      color="inherit"
                    >
                      EstateIca
                    </MuiLink>
                  </Title>
                </div>

                <Tabs
                  value={tabIndex}
                  onChange={(_, newValue) => setTabIndex(newValue)}
                  sx={{
                    minHeight: 36,
                    height: 36,
                    ".MuiTab-root": {
                      minHeight: 36,
                      height: 36,
                      paddingY: 0,
                    },
                  }}
                >
                  <Tab
                    value={0}
                    icon={<HomeIcon fontSize="medium" />}
                    iconPosition="start"
                    label="Smještaj"
                    component={Link}
                    to="/estates"
                    wrapped
                    sx={{
                      pb: 0,
                      pt: 0,
                    }}
                    aria-label="residential"
                  />
                  <Tab
                    value={1}
                    icon={<BusinessIcon fontSize="medium" />}
                    iconPosition="start"
                    label="Nekretnine"
                    component={Link}
                    to="/businesses"
                    wrapped
                    sx={{
                      pb: 0,
                      pt: 0,
                    }}
                    aria-label="residential"
                  />
                </Tabs>

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
            <Grid sx={{ pb: 2 }}>
              <StyledSearchBar ref={popperRef} />
            </Grid>
          </Grid>
        </Container>
      </StyledAppBar>
    </>
  );
};

export default CustomAppBar;
