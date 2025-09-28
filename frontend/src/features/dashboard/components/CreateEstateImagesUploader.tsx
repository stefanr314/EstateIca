import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  IconButton,
  Typography,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

type Props = {
  onChange: (files: File[]) => void;
  images?: File[];
};

export default function EstateImagesUploader({ onChange, images }: Props) {
  const [files, setFiles] = useState<File[]>(images || []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = [...files, ...Array.from(e.target.files)].slice(0, 30); // max 30
      setFiles(newFiles);
      onChange(newFiles);
    }
  };

  const handleDelete = (idx: number) => {
    const newFiles = files.filter((_, i) => i !== idx);
    setFiles(newFiles);
    onChange(newFiles);
  };

  if (files.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 250,
          border: "2px dashed",
          borderColor: "grey.400",
          borderRadius: 2,
          p: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="body1" sx={{ mb: 2 }}>
          Dodajte prve fotografije vašeg prostora
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddPhotoAlternateIcon />}
          component="label"
        >
          Dodaj slike
          <input
            hidden
            multiple
            accept="image/*"
            type="file"
            onChange={handleFileSelect}
          />
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<AddPhotoAlternateIcon />}
        component="label"
        sx={{ mb: 2 }}
      >
        Dodaj slike
        <input
          hidden
          multiple
          accept="image/*"
          type="file"
          onChange={handleFileSelect}
        />
      </Button>

      <ImageList variant="masonry" cols={3} gap={12}>
        {files.map((file, idx) => (
          <ImageListItem key={idx}>
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              loading="lazy"
            />
            <IconButton
              size="small"
              color="error"
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                bgcolor: "rgba(0,0,0,0.4)",
                color: "white",
                "&:hover": { bgcolor: "rgba(255,0,0,0.7)" },
              }}
              onClick={() => handleDelete(idx)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}
