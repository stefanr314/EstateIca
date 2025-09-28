import { useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import HostRequestCreationModal from "@/features/host-requests/HostRequestCreation";
import { useAppSelector } from "@/app/store/hooks";
import { selectUser } from "@/features/auth/authSlice";
import { useGetMyHostRequest } from "@/features/host-requests/hook/useHostRequests";

export default function CardAlert() {
  const user = useAppSelector(selectUser);
  const { data: myRequest } = useGetMyHostRequest();
  const [open, setOpen] = useState(false);

  // Ako je već host → ne prikazuj
  if (!user || user.role !== "guest" || !user.isVerified) return null;
  // Ako već ima podnesen zahtjev (bilo koji status) → ne prikazuj
  if (myRequest) return null;

  return (
    <>
      <Card variant="outlined" sx={{ m: 1.5, flexShrink: 0 }}>
        <CardContent>
          <AutoAwesomeRoundedIcon fontSize="small" />
          <Typography gutterBottom sx={{ fontWeight: 600, p: 0.3 }}>
            Podnesi zahtjev za vlasnika smještaja
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            Da li želite postati vlasnik smještaja i početi zarađivati?
          </Typography>
          <Button
            variant="contained"
            size="medium"
            fullWidth
            onClick={() => setOpen(true)}
          >
            Postani vlasnik smještaja
          </Button>
        </CardContent>
      </Card>

      <HostRequestCreationModal
        open={open}
        handleClose={() => setOpen(false)}
      />
    </>
  );
}
