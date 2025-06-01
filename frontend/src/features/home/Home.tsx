import { Button } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";

function Home() {
  console.log("Home page");

  return (
    <>
      <div>Home</div>
      <Button variant="contained" color="primary">
        Primary
      </Button>
      <Button variant="outlined" startIcon={<HomeIcon />}>
        Home
      </Button>
    </>
  );
}

export default Home;
