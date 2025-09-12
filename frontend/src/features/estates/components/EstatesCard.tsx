import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import StarIcon from "@mui/icons-material/Star";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import PoolIcon from "@mui/icons-material/Pool";
import KitchenIcon from "@mui/icons-material/Kitchen";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import PetsIcon from "@mui/icons-material/Pets";
import {
  AllBusinessData,
  AllResidentialData,
  IBusinessEstate,
  IResidentialEstate,
} from "../types";

interface EstatesCardProps {
  estate: AllResidentialData | AllBusinessData;
}

const amenityIcons: { [key: string]: React.ReactElement } = {
  wifi: <WifiIcon sx={{ fontSize: 16 }} />,
  parking: <LocalParkingIcon sx={{ fontSize: 16 }} />,
  pool: <PoolIcon sx={{ fontSize: 16 }} />,
  kitchen: <KitchenIcon sx={{ fontSize: 16 }} />,
  ac: <AcUnitIcon sx={{ fontSize: 16 }} />,
};

const typeLabels: { [key: string]: string } = {
  apartment: "Apartman",
  cabin: "Kabina",
  cottage: "Vikendica",
  house: "Kuća",
  room: "Soba",
  multi_unit: "Multi Unit",
  studio: "Studio",
};

export default function EstatesCard({ estate }: EstatesCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { images } = estate;
  const isResidential = estate.estateType === "ResidentialEstate";
  const isBusiness = estate.estateType === "BusinessEstate";

  // Mock slike - kasnije će doći iz backend-a
  // const images = [
  //   "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
  //   "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
  //   "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
  //   "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
  // ];

  const handleOpenInNewTab = () => {
    const url = `/estate/${estate._id}`;
    window.open(url, "_blank");
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement wishlist functionality
    console.log("Added to wishlist:", estate._id);
  };

  const showLeftArrow = isHovered && images.length > 1 && currentImageIndex > 0;
  const showRightArrow =
    isHovered && images.length > 1 && currentImageIndex < images.length - 1;

  return (
    <Card
      variant="outlined"
      onClick={handleOpenInNewTab}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: { xs: "100%", sm: 340, md: 360 },
        maxWidth: 360,
        position: "relative",
        overflow: "visible",
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.2s ease",
        border: "none",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
        },
      }}
    >
      {/* Image slider */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={images[currentImageIndex]?.url}
          alt={estate.title}
          sx={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            objectFit: "cover",
          }}
        />

        {/* Type badge */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.75rem",
            fontWeight: 500,
            backdropFilter: "blur(4px)",
          }}
        >
          {typeLabels[estate.rentalType] || estate.rentalType}
        </Box>

        {/* Pets badge */}
        {isResidential && (estate as AllResidentialData).petAllowance && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 48,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.75rem",
              fontWeight: 500,
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <PetsIcon sx={{ fontSize: 14 }} />
            Pets
          </Box>
        )}

        {/* Image navigation buttons - only show on hover */}
        {showLeftArrow && (
          <IconButton
            onClick={prevImage}
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              color: "text.primary",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
              width: 32,
              height: 32,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}

        {showRightArrow && (
          <IconButton
            onClick={nextImage}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              color: "text.primary",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
              width: 32,
              height: 32,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        )}

        {/* Image indicators */}
        {images.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 0.5,
            }}
          >
            {images.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor:
                    index === currentImageIndex
                      ? "white"
                      : "rgba(255, 255, 255, 0.6)",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </Box>
        )}

        {/* Like button */}
        <IconButton
          onClick={handleLikeClick}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 1)",
              color: "error.main",
            },
            width: 32,
            height: 32,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <FavoriteIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2, pb: 1 }}>
        {/* Title and location */}
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{
              mb: 0.5,
              fontSize: "1rem",
              lineHeight: 1.3,
              color: "text.primary",
            }}
          >
            {estate.title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.875rem" }}
            >
              {estate.address.city}, {estate.address.country}
            </Typography>
          </Box>
        </Box>

        {/* Description - more compact */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1.5,
            lineHeight: 1.1,
            fontSize: "0.875rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {estate.description}
        </Typography>

        {/* Amenities */}
        {estate.amenities && estate.amenities.length > 0 && (
          <Box sx={{ mb: 1.5 }}>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {estate.amenities.slice(0, 3).map((amenity) => (
                <Chip
                  key={amenity}
                  icon={amenityIcons[amenity]}
                  label={amenity}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: "0.7rem",
                    height: 24,
                    "& .MuiChip-icon": {
                      fontSize: 14,
                    },
                  }}
                />
              ))}
              {estate.amenities.length > 3 && (
                <Chip
                  label={`+${estate.amenities.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: "0.7rem",
                    height: 24,
                  }}
                />
              )}
            </Stack>
          </Box>
        )}

        {/* Rating and bed count */}
        {isResidential && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 16, color: "warning.main" }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.875rem" }}
              >
                {estate.averageRatingOverall}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <BedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.875rem" }}
              >
                {estate.beds} kreveta
              </Typography>
            </Box>
          </Box>
        )}

        {isBusiness && (
          <Box
            sx={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "space-between",
              mb: 0.5, // malo prostora dole da ne "zalijepi"
              gap: 0.5,
            }}
          >
            {/* Kvadratura */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 16, color: "warning.main" }} />
              <Typography variant="body2" color="text.secondary">
                {estate.area} m²
              </Typography>
            </Box>

            {/* Namjena */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <BedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                Namjena: {estate.intendedUse}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Price */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 0 }}
        >
          {estate.rentalType === "Short Term" ? "Po noćenju" : "Po mjesecu"}
        </Typography>
        <Typography
          variant="h6"
          fontWeight="600"
          color="text.primary"
          sx={{ fontSize: "1rem" }}
        >
          €
          {estate.rentalType === "Short Term"
            ? (estate as AllResidentialData).pricePerNight
            : estate.pricePerMonth}
        </Typography>
      </Box>
    </Card>
  );
}
