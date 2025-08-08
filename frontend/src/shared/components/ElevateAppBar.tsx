// import React from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   useScrollTrigger,
//   Container,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import SearchIcon from "@mui/icons-material/Search";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// interface Props {
//   window?: () => Window;
//   children?: React.ReactElement<{ elevation?: number }>;
//   onMenuClick: () => void; // Dodajemo prop za otvaranje Drawer-a
// }

// function ElevationScroll(props: Props) {
//   const { children, window } = props;
//   const trigger = useScrollTrigger({
//     disableHysteresis: true,
//     threshold: 0,
//     target: window ? window() : undefined,
//   });

//   return children
//     ? React.cloneElement(children, {
//         elevation: trigger ? 4 : 0,
//       })
//     : null;
// }

// const ElevateAppBar: React.FC<Props> = (props: Props) => {
//   return (
//     <ElevationScroll {...props}>
//       <AppBar position="sticky" color="default">
//         <Container>
//           <Toolbar>
//             <IconButton
//               edge="start"
//               color="inherit"
//               aria-label="menu"
//               onClick={props.onMenuClick}
//             >
//               <MenuIcon />
//             </IconButton>
//             <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
//               My Application
//             </Typography>
//             <IconButton color="inherit" aria-label="search">
//               <SearchIcon />
//             </IconButton>
//             <IconButton color="inherit" aria-label="notifications">
//               <NotificationsIcon />
//             </IconButton>
//             <IconButton color="inherit" aria-label="account">
//               <AccountCircleIcon />
//             </IconButton>
//           </Toolbar>
//         </Container>
//       </AppBar>
//     </ElevationScroll>
//   );
// };

// export default ElevateAppBar;
