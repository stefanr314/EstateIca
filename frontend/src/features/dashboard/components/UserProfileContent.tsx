import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/features/auth/authSlice";
import {
  useUpdateUserProfile,
  useUpdateUserProfilePicture,
} from "@/features/user/hooks/useUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import EditIcon from "@mui/icons-material/Edit";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import { UpdateUserDto, updateUserDto } from "@/features/user/types";

export default function UserProfileContent() {
  const theme = useTheme();
  const user = useSelector(selectUser);
  if (!user) return null;

  const { register, handleSubmit, reset } = useForm<UpdateUserDto>({
    resolver: zodResolver(updateUserDto),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phoneNumber,
    }, // puni iz Reduxa
  });

  const { mutate: updateProfileMutation } = useUpdateUserProfile();
  const { mutate: updatePictureMutation } = useUpdateUserProfilePicture();
  const {
    firstName,
    lastName,
    role,
    isActive,
    isVerified,
    profilePicture,
    email,
  } = user;
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phoneNumber,
      });
    }
  }, [user, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      updatePictureMutation({ userId: user.id, file: e.target.files[0] });
    }
  };

  const handleSave = (data: UpdateUserDto) => {
    console.log("Saving", data);
    updateProfileMutation({ userId: user.id, body: data });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // setFormData(originalData);
    reset(user);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        px: 3,
        pb: 6,
        pt: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
        }}
      >
        {/* Header Card */}
        <Card
          elevation={2}
          sx={{
            mb: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.light}10 100%)`,
            border: `1px solid ${theme.palette.primary.main}20`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 3,
              }}
            >
              <Typography variant="h3" fontWeight="bold" color="primary">
                Profil korisnika
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* User Role Chip */}
                <Chip
                  icon={<PersonIcon />}
                  label={role}
                  variant="filled"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    height: 32,
                  }}
                />

                {/* Verification Badge */}
                {isVerified && (
                  <Box
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "#fff",
                      borderRadius: "50%",
                      p: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: theme.shadows[2],
                    }}
                    title="Verifikovan korisnik"
                  >
                    <VerifiedUserIcon fontSize="medium" />
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 4,
          }}
        >
          {/* Profile Image Card */}
          <Box sx={{ flex: { lg: "0 0 35%" } }}>
            <Card elevation={3} sx={{ height: "fit-content" }}>
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Avatar
                    src={profilePicture || undefined}
                    sx={{
                      width: 180,
                      height: 180,
                      bgcolor: theme.palette.primary.main,
                      fontSize: 60,
                      border: `6px solid ${theme.palette.background.paper}`,
                      boxShadow: theme.shadows[6],
                    }}
                  >
                    {!profilePicture && firstName}
                  </Avatar>

                  <IconButton
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      bgcolor: theme.palette.primary.main,
                      color: "#fff",
                      width: 48,
                      height: 48,
                      "&:hover": {
                        bgcolor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    <PhotoCameraIcon fontSize="medium" />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </IconButton>
                </Box>

                <Typography variant="h4" sx={{ mt: 3, fontWeight: 600 }}>
                  {firstName} {lastName}
                </Typography>
                {isVerified && (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Verifikovan korisnik
                  </Typography>
                )}

                {/* Edit Profile Button moved here */}
                {!isEditing && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    sx={{
                      mt: 3,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Uredi profil
                  </Button>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Form Card */}
          <Box sx={{ flex: { lg: "0 0 65%" } }}>
            <Card
              component={"form"}
              onSubmit={handleSubmit(handleSave)}
              elevation={3}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
                  Lični podaci
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 3,
                    }}
                  >
                    <TextField
                      label="Ime"
                      fullWidth
                      {...register("firstName")}
                      disabled={!isEditing}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          fontSize: "1.1rem",
                        },
                      }}
                    />
                    <TextField
                      label="Prezime"
                      fullWidth
                      {...register("lastName")}
                      disabled={!isEditing}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          fontSize: "1.1rem",
                        },
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 3,
                    }}
                  >
                    <TextField
                      label="Telefon"
                      fullWidth
                      {...register("phone")}
                      disabled={!isEditing}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          fontSize: "1.1rem",
                        },
                      }}
                    />
                    <TextField
                      label="Email"
                      value={email}
                      fullWidth
                      disabled={!isEditing}
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          fontSize: "1.1rem",
                        },
                      }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                  }}
                >
                  {isEditing && (
                    <>
                      <Button
                        variant="contained"
                        type="submit"
                        startIcon={<SaveIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          fontSize: "1rem",
                        }}
                      >
                        Sačuvaj promene
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                        startIcon={<CancelIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          fontSize: "1rem",
                        }}
                      >
                        Otkaži
                      </Button>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
