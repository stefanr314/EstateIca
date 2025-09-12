import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import EstateDetailsHeader from "./components/EstateDetailsHeader";
import EstateDetailsMain from "./components/EstateDetailsMain";
import EstateDetailsFooter from "./components/EstateDetailsFooter";
import { IResidentialEstate } from "./types";
import { useEstate } from "./hooks/useEstate";

function EstateDetails() {
  const { id } = useParams<{ id: string }>();
  console.log(`Estate ID: ${id}`);
  const {
    data: estate,
    isPending,
    isError,
    error,
    isFetching,
  } = useEstate(id!);

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }
  return (
    <Grid container spacing={2} width="100%">
      <Grid display={"inline-block"} width={"100%"}>
        <EstateDetailsHeader title={estate.title} images={estate.images} />
      </Grid>
      <Grid display={"inline-block"} width={"100%"}>
        <EstateDetailsMain estate={estate} />
      </Grid>
      {/* <Grid display={"inline-block"} width={"100%"}>
        <EstateDetailsFooter estate={estate} />
      </Grid> */}
    </Grid>
  );
}

export default EstateDetails;
