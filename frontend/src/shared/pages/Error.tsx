import { Typography, Button } from "@mui/material";
function Error() {
  return (
    <div>
      <Typography variant="h6" color="error" gutterBottom>
        Error Broosku
      </Typography>
      <Button variant="outlined" onClick={() => window.history.back()}>
        Go back
      </Button>
    </div>
  );
}

export default Error;
