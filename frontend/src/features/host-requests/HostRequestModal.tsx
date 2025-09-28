import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
  Box,
  Chip,
  Avatar,
  Divider,
  useTheme,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { HostRequest } from "./types";
import {
  useGetHostRequestDetails,
  useUpdateHostRequestStatus,
} from "./hook/useHostRequests";

interface Props {
  open: boolean;
  onClose: () => void;
  requestId: string | null;
}

const HostRequestModal: React.FC<Props> = ({ open, onClose, requestId }) => {
  if (!requestId) return null; // ne prikazuj ništa ako nema ID-a

  const theme = useTheme();

  // fetch detalja samo kad imamo ID
  const { data, isLoading, isError } = useGetHostRequestDetails(requestId);

  const hostRequest: HostRequest | undefined = data;

  const { mutate: updateRequestStatus, isPending: isUpdatingStatus } =
    useUpdateHostRequestStatus(requestId);

  const onApprove = () => {
    updateRequestStatus({ status: "approved" });
    onClose();
  };
  const onReject = () => {
    updateRequestStatus({ status: "rejected" });
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 2, maxHeight: "90vh" },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6">Detalji zahtjeva</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Typography color="error">
            Greška pri učitavanju podataka. Pokušajte ponovo.
          </Typography>
        )}

        {hostRequest && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* User info */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={hostRequest.user.profilePicture}
                alt={hostRequest.user.firstName}
                sx={{ width: 56, height: 56 }}
              />
              <Box>
                <Typography fontWeight={600}>
                  {hostRequest.user.firstName} {hostRequest.user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hostRequest.user.email}
                </Typography>
              </Box>
            </Box>

            {/* Status */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Status zahtjeva
              </Typography>
              <Chip
                label={hostRequest.status}
                color={
                  hostRequest.status === "pending"
                    ? "warning"
                    : hostRequest.status === "approved"
                    ? "success"
                    : "error"
                }
                size="small"
              />
            </Box>

            {/* Reason & Admin comment */}
            {hostRequest.reason && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Razlog
                </Typography>
                <Typography>{hostRequest.reason}</Typography>
              </Box>
            )}

            {hostRequest.adminComment && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Komentar administratora
                </Typography>
                <Typography>{hostRequest.adminComment}</Typography>
              </Box>
            )}

            {/* Dates */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Kreiran
                </Typography>
                <Typography>{hostRequest.createdAt}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Ažuriran
                </Typography>
                <Typography>{hostRequest.updatedAt}</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={onClose} variant="outlined" color="secondary">
          Zatvori
        </Button>
        <Box>
          <Button
            onClick={onApprove}
            variant="contained"
            color="primary"
            disabled={isUpdatingStatus}
          >
            Odobri
          </Button>
          <Button
            onClick={onReject}
            variant="contained"
            color="error"
            disabled={isUpdatingStatus}
          >
            Odbij
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default HostRequestModal;
