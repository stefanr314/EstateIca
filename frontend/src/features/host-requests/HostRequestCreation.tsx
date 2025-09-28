import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { HostType } from "./types";

import {
  createHostRequestDto,
  CreateHostRequestDto,
} from "@/features/host-requests/types/index";

import { useCreateHostRequest } from "./hook/useHostRequests";
import { useNavigate } from "react-router";

interface Props {
  open: boolean;
  handleClose: () => void;
}

export default function HostRequestCreationModal({ open, handleClose }: Props) {
  const navigate = useNavigate();
  const { mutateAsync: createHostRequest, isPending: isCreating } =
    useCreateHostRequest();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateHostRequestDto>({
    resolver: zodResolver(createHostRequestDto),
    defaultValues: {
      requestedType: HostType.REGULAR,
      reason: "",
    },
  });

  const selectedType = watch("requestedType");

  const onSubmit = async (data: CreateHostRequestDto) => {
    console.log("Form submit:", data);
    try {
      const { id } = await createHostRequest(data);
      handleClose();
      navigate(`/dashboard/your-host-requests/me`, { replace: true });
    } catch (error) {
      console.error("Greska: ", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Zahtjev za postajanje vlasnikom</DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          id="host-request-form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={2}
          sx={{ mt: 1 }}
        >
          {/* Tip hosta */}
          <TextField
            select
            label="Tip vlasnika"
            defaultValue={HostType.REGULAR}
            {...register("requestedType")}
            error={!!errors.requestedType}
            helperText={errors.requestedType?.message}
          >
            <MenuItem value={HostType.REGULAR}>Obični domaćin</MenuItem>
            <MenuItem value={HostType.BUSINESS}>Poslovni</MenuItem>
            <MenuItem value={HostType.BOTH}>Oba tipa</MenuItem>
          </TextField>

          {/* Reason */}
          <TextField
            label="Razlog"
            fullWidth
            multiline
            minRows={2}
            {...register("reason", { required: true })}
            error={!!errors.reason}
            helperText={errors.reason?.message}
          />

          {/* Business polja samo ako treba */}
          {(selectedType === HostType.BUSINESS ||
            selectedType === HostType.BOTH) && (
            <>
              <TextField
                label="Naziv firme"
                fullWidth
                {...register("businessName")}
                error={!!errors.businessName}
                helperText={errors.businessName?.message}
              />
              <TextField
                label="ID broj firme"
                fullWidth
                {...register("businessIdNumber")}
                error={!!errors.businessIdNumber}
                helperText={errors.businessIdNumber?.message}
              />
              <TextField
                label="Adresa firme"
                fullWidth
                {...register("businessAddress")}
                error={!!errors.businessAddress}
                helperText={errors.businessAddress?.message}
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Otkaži</Button>
        <Button
          type="submit"
          form="host-request-form"
          variant="contained"
          disabled={isCreating}
        >
          Pošalji
        </Button>
      </DialogActions>
    </Dialog>
  );
}
