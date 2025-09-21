import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAppDispatch } from "@/app/store/hooks";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { resetPasswordDto, ResetPasswordDto } from "./types";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";

import { pushNotification } from "../notifications/notificationSlice";
import { resetPassword } from "./authSlice";

function ResetPassword() {
  const { search } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordDto>({
    resolver: zodResolver(resetPasswordDto),
  });

  const token = new URLSearchParams(search).get("token");

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  async function onSubmit(data: ResetPasswordDto) {
    try {
      if (token) {
        const { message } = await dispatch(
          resetPassword({ ...data, resetToken: token })
        ).unwrap();
        dispatch(pushNotification({ type: "success", message }));
      }
    } catch (error: any) {
      dispatch(
        pushNotification({
          type: "error",
          message: error,
        })
      );
    } finally {
      navigate("/sign-in", { replace: true });
    }
  }

  return (
    <Stack
      height="100vh"
      sx={{
        justifyContent: "center",
        alignItems: "center",
        bgcolor: (theme) =>
          theme.palette.mode === "light"
            ? "grey.100"
            : theme.palette.background.default,
        px: 2,
      }}
    >
      <Card
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <CardHeader
          title="Postavi novu lozinku"
          sx={{ textAlign: "center", pb: 0 }}
        />
        <CardContent>
          <Stack spacing={3}>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nova lozinka"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Potvrdi lozinku"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••"
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button variant="contained" type="submit" fullWidth>
            Potvrdi
          </Button>
        </CardActions>
      </Card>
    </Stack>
  );
}

export default ResetPassword;
