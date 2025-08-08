import React, { useState } from "react";
import {
  Box,
  Typography,
  Pagination,
  Stack,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EstatesCard from "./components/EstatesCard";
import FilterBar from "./components/FilterBar";

// Dummy data
const mockEstates = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  title: `Estate ${i + 1}`,
  image:
    "https://unsplash.com/photos/white-and-grey-concrete-building-near-swimming-pool-under-clear-sky-during-daytime-2d4lAQAlbDA",
  description: "Nice place to stay.",
  price: Math.floor(Math.random() * 400) + 50, // Random price between 50-450
  type: [
    "apartment",
    "cabin",
    "cottage",
    "house",
    "room",
    "multi_unit",
    "studio",
  ][Math.floor(Math.random() * 7)],
  amenities: ["wifi", "parking", "pool", "kitchen", "ac"].slice(
    0,
    Math.floor(Math.random() * 4) + 1
  ),
  petsAllowed: Math.random() > 0.5,
}));

const Estates: React.FC = () => {
  const [page, setPage] = useState(1);
  const estatesPerPage = 8;
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [stayType, setStayType] = useState<string>("any");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  const handleClearFilters = () => {
    setSelectedType(null);
    setStayType("any");
    setPage(1);
  };

  // Simple filtering logic
  const filteredEstates = mockEstates.filter((estate) => {
    // Type filter
    if (selectedType && estate.type !== selectedType) {
      return false;
    }

    // Stay type filter (for now just return all, since we don't have this data in mock)
    // In real app, this would filter based on stayType property
    return true;
  });

  const paginatedEstates = filteredEstates.slice(
    (page - 1) * estatesPerPage,
    page * estatesPerPage
  );

  const hasActiveFilters = selectedType !== null || stayType !== "any";

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{
            mb: 1,
            color: theme.palette.text.primary,
            textAlign: isMobile ? "center" : "left",
          }}
        >
          Smještaj
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            textAlign: isMobile ? "center" : "left",
            maxWidth: 600,
          }}
        >
          Pronađite savršen smještaj za vaš odmor. Filtrirajte po tipu i drugim
          kriterijumima.
        </Typography>
      </Box>

      {/* Simple Filter Bar */}
      <FilterBar
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        stayType={stayType}
        onStayTypeChange={setStayType}
      />

      {/* Results Summary */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 2 : 0,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="600"
          sx={{ color: theme.palette.text.primary }}
        >
          {filteredEstates.length} smještaj
          {filteredEstates.length !== 1 ? "a" : ""} pronađen
          {filteredEstates.length !== 1 ? "o" : ""}
        </Typography>
        {hasActiveFilters && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              backgroundColor: theme.palette.primary.main + "15",
              color: theme.palette.primary.main,
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontWeight: 500,
            }}
          >
            Aktivni filteri:{" "}
            {[selectedType && "Tip", stayType !== "any" && "Tip boravka"]
              .filter(Boolean)
              .join(", ")}
          </Typography>
        )}
      </Box>

      {/* Estates Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
          justifyContent: "center",
          mb: 6,
        }}
      >
        {paginatedEstates.map((estate) => (
          <Box
            key={estate.id}
            sx={{
              display: "flex",
              justifyContent: "center",
              minHeight: 400,
            }}
          >
            <EstatesCard estate={estate} />
          </Box>
        ))}
      </Box>

      {/* No Results */}
      {paginatedEstates.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: theme.palette.text.secondary,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Nema rezultata
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Pokušajte da promenite filtere ili pretražite drugačije.
          </Typography>
          {hasActiveFilters && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.primary.main,
                cursor: "pointer",
                textDecoration: "underline",
                "&:hover": {
                  textDecoration: "none",
                },
              }}
              onClick={handleClearFilters}
            >
              Očisti sve filtere
            </Typography>
          )}
        </Box>
      )}

      {/* Pagination */}
      {filteredEstates.length > estatesPerPage && (
        <Stack spacing={2} sx={{ mt: 6 }} alignItems="center">
          <Pagination
            count={Math.ceil(filteredEstates.length / estatesPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "medium" : "large"}
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: 2,
                fontWeight: 500,
              },
            }}
          />
        </Stack>
      )}
    </Container>
  );
};

export default Estates;
