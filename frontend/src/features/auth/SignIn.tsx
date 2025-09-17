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
import { alpha, styled } from "@mui/material/styles";
import ForgotPassword from "./components/ForgotPassword";
import {
  GoogleIcon,
  FacebookIcon,
  SitemarkIcon,
} from "./components/CustomIcons";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { gray, mint } from "@/shared/ui/theme";
import { green } from "@mui/material/colors";
import { useAppDispatch } from "@/app/store/hooks";
import { loginUser } from "./authSlice";
import { useNavigate } from "react-router";

export const loginUserDto = z.object({
  email: z.email().min(1, "Email je obavezan"),
  password: z.string().min(1, "Lozinka je obavezna"),
  rememberMe: z.boolean().optional(),
});
export type LoginUserDto = z.infer<typeof loginUserDto>;

// ========== Styles ==========
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  backgroundColor: theme.palette.background.paper,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  boxShadow: theme.shadows[6],
  position: "relative",
  zIndex: 1,
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },

  "&::before": {
    content: '""',
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%", // širi glow
    height: "70%", // malo spljošten oval
    borderRadius: "50%",
    background: `radial-gradient(circle, ${green[500]} 0%, ${green[700]} 30%, transparent 80%)`,
    filter: "blur(120px)", // veći blur = mekši glow
    opacity: 0.45, // jače prisutan
    zIndex: 0,
    ...theme.applyStyles("dark", {
      background: `radial-gradient(circle, ${green[600]} 0%, ${green[800]} 30%, transparent 80%)`,
      filter: "blur(140px)",
      opacity: 0.35,
    }),
  },
}));

// ========== Component ==========
export default function SignIn(props: { disableCustomTheme?: boolean }) {
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

      // ✅ ovde ide redirect
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Login failed:", error);
      // 👉 ovde možeš da prikažeš toast, alert ili error state
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
            Nemate nalog?{" "}
            <Link href="/sign-up" variant="body2" sx={{ alignSelf: "center" }}>
              Napravite nalog
            </Link>
          </Typography>
        </Box>
      </Card>
    </SignInContainer>
  );
}
