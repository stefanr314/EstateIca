import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import EstateDetailsHeader from "./components/EstateDetailsHeader";
import EstateDetailsMain from "./components/EstateDetailsMain";
import EstateDetailsFooter from "./components/EstateDetailsFooter";

function EstateDetails() {
  const { id } = useParams<{ id: string }>();
  console.log(`Estate ID: ${id}`);
  return (
    <Grid container spacing={2} width="100%">
      <Grid display={"inline-block"} width={"100%"}>
        <EstateDetailsHeader />
      </Grid>
      <Grid display={"inline-block"} width={"100%"}>
        <EstateDetailsMain />
      </Grid>
      <Grid display={"inline-block"} width={"100%"}>
        <EstateDetailsFooter />
      </Grid>
    </Grid>
  );
}

export default EstateDetails;
