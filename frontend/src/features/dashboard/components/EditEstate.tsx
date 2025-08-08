import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

export default function EditEstatePage() {
  const [formData, setFormData] = React.useState<{
    title: string;
    description: string;
    type: string;
    pricePerNight: string;
    location: string;
    petFriendly: boolean;
    amenities: string[]; // <-- fix
    images: string[]; // <-- fix
  }>({
    title: "",
    description: "",
    type: "",
    pricePerNight: "",
    location: "",
    petFriendly: false,
    amenities: [],
    images: [],
  });
  const [tab, setTab] = React.useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData((prev) => ({ ...prev, type: e.target.value as string }));
  };

  const handleSubmit = () => {
    console.log("Estate updated:", formData);
    // TODO: Send to backend
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          ...files.map((file) => URL.createObjectURL(file)),
        ],
      }));
    }
  };

  const amenitiesList = ["WiFi", "Parking", "Air Conditioning", "Pool", "Gym"];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Edit Estate
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Details" />
        <Tab label="Images" />
        <Tab label="Settings" />
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={3}>
          <Grid sx={{ width: { xs: "100%", md: "50%" } }}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>

          <Grid sx={{ width: { xs: "100%", md: "50%" } }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={handleSelectChange}
                label="Type"
              >
                <MenuItem value="apartment">Apartment</MenuItem>
                <MenuItem value="house">House</MenuItem>
                <MenuItem value="villa">Villa</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid sx={{ width: "100%" }}>
            <TextField
              label="Description"
              name="description"
              multiline
              minRows={4}
              fullWidth
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid sx={{ width: { xs: "100%", md: "50%" } }}>
            <TextField
              label="Location"
              name="location"
              fullWidth
              value={formData.location}
              onChange={handleChange}
            />
          </Grid>

          <Grid sx={{ width: { xs: "100%", md: "50%" } }}>
            <TextField
              label="Price per night (€)"
              name="pricePerNight"
              type="number"
              fullWidth
              value={formData.pricePerNight}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <Box>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
            >
              Upload Images
              <input
                hidden
                multiple
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
              />
            </Button>
          </Stack>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            {formData.images.map((img, index) => (
              <Box
                key={index}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <img
                  src={img}
                  alt={`img-${index}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {tab === 2 && (
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.petFriendly}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    petFriendly: e.target.checked,
                  }))
                }
              />
            }
            label="Pet Friendly"
          />

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Amenities:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {amenitiesList.map((amenity) => (
              <Chip
                key={amenity}
                label={amenity}
                clickable
                color={
                  formData.amenities.includes(amenity) ? "primary" : "default"
                }
                onClick={() => handleAmenityToggle(amenity)}
              />
            ))}
          </Stack>
        </Box>
      )}

      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
        <Button variant="outlined" color="error">
          Delete Estate
        </Button>
      </Box>
    </Box>
  );
}
