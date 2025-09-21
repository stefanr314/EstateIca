import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  Typography,
  Stack,
  Checkbox,
  Link,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Phone,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { RegisterUserDto, registerUserDto } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { green } from "@mui/material/colors";
import { NavLink, useNavigate } from "react-router";
import { useAppDispatch } from "@/app/store/hooks";
import { registerUser } from "./authSlice";
import { pushNotification } from "../notifications/notificationSlice";
import { useState } from "react";

// === Styles ===
const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100dvh",
  width: "100%",
  padding: theme.spacing(2),
  position: "relative",
  overflowY: "auto", // omogućava skrol kad forma ne stane
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },

  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    zIndex: 0,
    ...(theme.palette.mode === "light" && {
      background: `
        radial-gradient(circle at 50% 50%, rgba(173, 235, 179, 0.7) 0%, rgba(144,238,144,0.8) 100%),
        radial-gradient(circle at 20% 30%, rgba(174, 234, 0, 0.5) 0%, transparent 60%),
        radial-gradient(circle at 80% 25%, rgba(77, 208, 225, 0.4) 0%, transparent 55%),
        radial-gradient(circle at 30% 75%, rgba(240, 249, 192, 0.45) 0%, transparent 50%),
        radial-gradient(circle at 70% 80%, rgba(0, 200, 83, 0.35) 0%, transparent 45%)
      `,
      filter: "blur(120px)",
      backgroundBlendMode: "screen",
    }),
    ...theme.applyStyles("dark", {
      top: "45%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "80%",
      height: "70%",
      borderRadius: "50%",
      background: `radial-gradient(circle, ${green[600]} 0%, ${green[800]} 30%, transparent 80%)`,
      filter: "blur(180px)",
      opacity: 0.5,
    }),
  },
}));

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
    maxWidth: "600px", // bolje za mobilni
  },
  [theme.breakpoints.up("md")]: {
    maxWidth: "900px",
  },
  borderRadius: Number(theme.shape.borderRadius) * 2,
  boxShadow: theme.shadows[6],
  zIndex: 1,

  ...(theme.palette.mode === "light" && {
    backgroundColor: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.3)",
  }),
  ...(theme.palette.mode === "dark" && {
    backgroundColor: theme.palette.background.paper,
  }),
}));

// === Component ===
export default function SignUp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterUserDto>({
    resolver: zodResolver(registerUserDto),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: RegisterUserDto) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      dispatch(
        pushNotification({
          type: "success",
          message: "Registracija uspješna. Uspješno ste napravili profil.",
        })
      );
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      if (error.includes("already exists")) {
        setError("email", {
          type: "manual",
          message: "Korisnik sa ovim emailom već postoji",
        });
      } else {
        dispatch(
          pushNotification({
            type: "error",
            message: error ?? "Registracija nije uspjela.",
          })
        );
      }
    }
  };

  // console.log("Errors", errors);

  return (
    <SignUpContainer direction="column" justifyContent="center">
      <Card variant="outlined">
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontSize: "clamp(2rem, 6vw, 2.15rem)", textAlign: "center" }}
          >
            Napravi nalog
          </Typography>

          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth>
                <FormLabel htmlFor="firstName">Ime</FormLabel>
                <TextField
                  {...register("firstName")}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  id="firstName"
                  placeholder="Petar"
                />
              </FormControl>

              <FormControl fullWidth>
                <FormLabel htmlFor="lastName">Prezime</FormLabel>
                <TextField
                  {...register("lastName")}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  id="lastName"
                  placeholder="Petrović"
                />
              </FormControl>
            </Stack>

            <FormControl fullWidth>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                id="email"
                type="email"
                placeholder="vas@email.com"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel htmlFor="phoneNumber">Telefon (opciono)</FormLabel>
              <TextField
                {...register("phoneNumber")}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                id="phoneNumber"
                placeholder="+387..."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </FormControl>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth>
                <FormLabel htmlFor="password">Lozinka</FormLabel>
                <TextField
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                            sx={{
                              background: "transparent",
                              border: "none",
                              // "&:hover": {
                              //   background: "transparent",
                              // },
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </FormControl>

              <FormControl fullWidth>
                <FormLabel htmlFor="confirmPassword">Potvrdi lozinku</FormLabel>
                <TextField
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            edge="end"
                            sx={{
                              background: "transparent",
                              border: "none",
                              // "&:hover": {
                              //   background: "transparent",
                              // },
                            }}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </FormControl>
            </Stack>

            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Želim primati obavijesti putem emaila"
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? "Kreiranje naloga..." : "Registruj se"}
            </Button>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ textAlign: "center" }}>
            Već imate nalog?{" "}
            <Link component={NavLink} to="/sign-in" variant="body2">
              Prijavite se
            </Link>
          </Typography>
        </Box>
      </Card>
    </SignUpContainer>
  );
}
