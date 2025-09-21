import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./components/ForgotPassword";
import {
  GoogleIcon,
  FacebookIcon,
  SitemarkIcon,
} from "./components/CustomIcons";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { green } from "@mui/material/colors";
import { useAppDispatch } from "@/app/store/hooks";
import { loginUser } from "./authSlice";
import { NavLink, useNavigate } from "react-router";
import { pushNotification } from "../notifications/notificationSlice";

export const loginUserDto = z.object({
  email: z.email().min(1, "Email je obavezan"),
  password: z.string().min(1, "Lozinka je obavezna"),
  rememberMe: z.boolean().optional(),
});
export type LoginUserDto = z.infer<typeof loginUserDto>;

// ========== Styles ==========
const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100dvh",
  width: "100%",
  padding: theme.spacing(2),
  position: "relative",
  overflowY: "auto", // skrolaj ako je forma previsoka
  justifyContent: "center",
  alignItems: "center",
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
  margin: theme.spacing(2, "auto"),
  [theme.breakpoints.up("sm")]: {
    maxWidth: "500px",
    padding: theme.spacing(4),
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

// ========== Component ==========
export default function SignIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginUserDto>({
    resolver: zodResolver(loginUserDto),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginUserDto) => {
    try {
      const user = await dispatch(loginUser(data)).unwrap();

      console.log("Login success:", user);
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Login failed:", error);
      dispatch(
        pushNotification({
          type: "error",
          message: error || "Email ili lozinka nisu validini.",
        })
      );
    }
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        {/* <SitemarkIcon /> */}
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Prijavi se
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          {/* Email */}
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              id="email"
              type="email"
              placeholder="vas@email.com"
              autoComplete="email"
              autoFocus
              fullWidth
              variant="outlined"
            />
          </FormControl>

          {/* Password */}
          <FormControl>
            <FormLabel htmlFor="password">Lozinka</FormLabel>
            <TextField
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              fullWidth
              variant="outlined"
            />
          </FormControl>

          {/* Remember me */}
          <FormControlLabel
            control={<Checkbox {...register("rememberMe")} color="primary" />}
            label="Zapamti me"
          />

          <ForgotPassword open={open} handleClose={() => setOpen(false)} />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Prijavljivanje..." : "Prijavi se"}
          </Button>

          <Link
            component="button"
            type="button"
            onClick={() => setOpen(true)}
            variant="body2"
            sx={{ alignSelf: "center" }}
          >
            Zaboravili ste lozinku?
          </Link>
        </Box>

        <Divider>or</Divider>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* <Button
            fullWidth
            variant="outlined"
            onClick={() => alert("Sign in with Google")}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert("Sign in with Facebook")}
            startIcon={<FacebookIcon />}
          >
            Sign in with Facebook
          </Button> */}
          <Typography sx={{ textAlign: "center" }}>
            Nemate nalog? <NavLink to="/sign-up">Napravite nalog</NavLink>
          </Typography>
        </Box>
      </Card>
    </SignInContainer>
  );
}
