// import { Typography, Button } from "@mui/material";
// import { useRouteError } from "react-router";
// function Error() {
//   const error = useRouteError();
//   return (
//     <div>
//       <Typography variant="h6" color="error" gutterBottom>
//         Error: {error?.message || "Unknown error"}
//       </Typography>
//       <Button variant="outlined" onClick={() => window.history.back()}>
//         Go back
//       </Button>
//     </div>
//   );
// }

// export default Error;
import Typography from "@mui/material/Typography";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

function Error() {
  const error = useRouteError() as unknown;

  if (isRouteErrorResponse(error)) {
    // This is a RouteErrorResponse (e.g., from a loader/action)
    return (
      <div>
        <h1>Oops! {error.status}</h1>
        <Typography variant="h6" color="error" gutterBottom>
          {error.statusText}
        </Typography>
        {error.data && <Typography variant="body1">{error.data}</Typography>}
      </div>
    );
  } else if (error && typeof error === "object" && "message" in error) {
    // This is a standard JavaScript Error object or similar
    return (
      <div>
        <h1>Error</h1>
        <Typography variant="body1">
          {(error as { message: string }).message}
        </Typography>
        {
          ("stack" in error && error.stack && (
            <pre>{(error as { stack?: string }).stack}</pre>
          )) as React.ReactNode
        }
      </div>
    );
  } else {
    // Handle other unknown error types
    return (
      <div>
        <h1>An unexpected error occurred</h1>
      </div>
    );
  }
}
export default Error;
