import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Link,
} from "@mui/material";
import {
  useGetHostRequestDetails,
  useGetMyHostRequest,
} from "./hook/useHostRequests";
import QueryErrorHandler from "@/shared/components/QueryErrorHandler";
import AppLoader from "@/shared/components/AppLoader";

export default function GuestHostRequestDetailsPage() {
  const { data, isLoading, error } = useGetMyHostRequest();

  if (isLoading) {
    return (
      <AppLoader loading={isLoading} text="Učitavanje detalja zahtjeva..." />
    );
  }

  if (error) {
    return <QueryErrorHandler error={error} />;
  }

  if (!data) {
    return (
      <Typography sx={{ mt: 3 }}>
        Zahtjev nije pronađen ili nemate pristup.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", mx: "auto", mt: 4 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Detalji zahtjeva za domaćina
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            <Typography>
              <strong>ID:</strong> {data._id}
            </Typography>
            <Typography>
              <strong>Status:</strong> {data.status}
            </Typography>
            <Typography>
              <strong>Tip zahtjeva:</strong> {data.requestedType}
            </Typography>
            {data.reason && (
              <Typography>
                <strong>Razlog:</strong> {data.reason}
              </Typography>
            )}
            {data.businessName && (
              <Typography>
                <strong>Firma:</strong> {data.businessName}
              </Typography>
            )}
            {data.businessIdNumber && (
              <Typography>
                <strong>Matični broj:</strong> {data.businessIdNumber}
              </Typography>
            )}
            {data.businessAddress && (
              <Typography>
                <strong>Adresa firme:</strong> {data.businessAddress}
              </Typography>
            )}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack direction={"row"} spacing={1} alignItems="center">
            {data.status === "approved" && (
              <Typography color="success.main" sx={{ fontWeight: 600 }}>
                Zahtjev odobren ✅
              </Typography>
            )}
            {data.status === "rejected" && (
              <Typography color="error.main" sx={{ fontWeight: 600 }}>
                Zahtjev odbijen ❌
              </Typography>
            )}
            {data.adminComment && (
              <Typography>
                <strong>Komentar administratora:</strong> {data.adminComment}
              </Typography>
            )}
          </Stack>

          <Link component={RouterLink} to="/dashboard">
            ← Nazad na Dashboard
          </Link>
        </CardContent>
      </Card>
    </Box>
  );
}
