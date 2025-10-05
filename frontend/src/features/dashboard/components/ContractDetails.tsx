import agent from "@/app/api/agent";
import { useAppDispatch } from "@/app/store/hooks";
import { pushNotification } from "@/features/notifications/notificationSlice";
import {
  ContractStatus,
  IDetailedContract,
} from "@/features/reservations/types";
import AppLoader from "@/shared/components/AppLoader";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { grey } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { GridDownloadIcon } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";

export default function ContractDetails() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { contractId } = useParams();

  const stateContract = location.state?.contract as
    | IDetailedContract
    | undefined;

  const { data: contract, isPending } = useQuery({
    queryKey: ["contract-details", contractId],
    queryFn: async (): Promise<IDetailedContract> => {
      if (!contractId) throw new Error("Missing contractId"); // sigurnosna zaštita
      return agent.Contract.getContractDetails(contractId!);
    },
    enabled: !!contractId, // samo pokreće query ako postoji ID i nema kontrakta
    initialData: stateContract,
  });

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!contract) return;
    try {
      setDownloading(true);
      const res = await agent.Contract.downloadContract(contract._id);

      // Blob i privremeni URL
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // simulacija <a download>
      const link = document.createElement("a");
      link.href = url;
      link.download = `contract-${contract._id}.pdf`; // ime fajla
      document.body.appendChild(link);
      link.click();

      // cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Greška pri preuzimanju ugovora:", err);

      let message = "Došlo je do greške prilikom preuzimanja ugovora.";

      if (isAxiosError(err)) {
        message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Greška na serveru.";
      } else if (err instanceof Error) {
        message = err.message;
      }

      dispatch(pushNotification({ type: "error", message }));
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isPending)
    return <AppLoader loading={isPending} text="Sadrzaj se ucitava..." />;

  if (!contract) {
    return (
      <Paper sx={{ p: 4, width: "100%", textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Ugovor nije pronađen ili je istekao pristup. Pokušajte ponovo.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 4 },
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        my: 4,
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={600}
        sx={{ color: "primary.main", mb: 3 }}
      >
        Detalji ugovora
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: grey[200],
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography variant="subtitle1" fontWeight={500}>
              Broj ugovora:{" "}
              <Typography component="span" fontWeight={700}>
                #{contract._id.slice(-6)}
              </Typography>
            </Typography>
            <Chip
              label={contract.status}
              color={
                contract.status === ContractStatus.SIGNED
                  ? "success"
                  : contract.status === ContractStatus.EXPIRED
                  ? "default"
                  : contract.status === ContractStatus.CANCELLED
                  ? "error"
                  : "warning"
              }
              variant="outlined"
            />
          </Stack>

          <Divider />

          <Typography variant="body2" color="text.secondary">
            Datum kreiranja:{" "}
            <Typography component="span" fontWeight={500}>
              {contract.createdAt
                ? new Date(contract.createdAt).toLocaleDateString("sr-Latn-RS")
                : "Nepoznato"}
            </Typography>
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Poslednje ažuriranje:{" "}
            <Typography component="span" fontWeight={500}>
              {contract.updatedAt
                ? new Date(contract.updatedAt).toLocaleDateString("sr-Latn-RS")
                : "—"}
            </Typography>
          </Typography>
        </Stack>
      </Paper>

      <Stack spacing={3}>
        {/* Validnost */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Period važenja
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Od:{" "}
              <Typography component="span" fontWeight={500}>
                {new Date(contract.validFrom).toLocaleDateString("sr-Latn-RS")}
              </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Do:{" "}
              <Typography component="span" fontWeight={500}>
                {new Date(contract.validTo).toLocaleDateString("sr-Latn-RS")}
              </Typography>
            </Typography>
          </CardContent>
        </Card>

        {/* Potpisanost */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Potpisivanje
            </Typography>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Potpisao vlasnik (Host):{" "}
                <Typography
                  component="span"
                  fontWeight={600}
                  color={contract.signedByHost ? "success.main" : "error.main"}
                >
                  {contract.signedByHost ? "DA" : "NE"}
                </Typography>
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Potpisao zakupac (Gost):{" "}
                <Typography
                  component="span"
                  fontWeight={600}
                  color={
                    contract.signedByTenant ? "success.main" : "error.main"
                  }
                >
                  {contract.signedByTenant ? "DA" : "NE"}
                </Typography>
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* 🔽 Sekcija o rezervaciji */}
        {contract.reservation && (
          <Card variant="outlined" sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informacije o rezervaciji
              </Typography>

              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Naziv nekretnine:{" "}
                  <Typography component="span" fontWeight={600}>
                    {contract.reservation.estateName}
                  </Typography>
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Vlasnik (Host):{" "}
                  <Typography component="span" fontWeight={600}>
                    {contract.reservation.hostName}
                  </Typography>
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Gost (Tenant):{" "}
                  <Typography component="span" fontWeight={600}>
                    {contract.reservation.guestName}
                  </Typography>
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Cena po mesecu:{" "}
                  <Typography component="span" fontWeight={600}>
                    {contract.reservation.pricePerMonth} €
                  </Typography>
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Preuzimanje */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<GridDownloadIcon />}
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? "Preuzimanje..." : "Preuzmi PDF ugovora"}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
