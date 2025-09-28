import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  useAddImagesToEstate,
  useRemoveImageFromEstate,
} from "@/features/estates/hooks/useEstate";
import { useAppDispatch } from "@/app/store/hooks";
import { pushNotification } from "@/features/notifications/notificationSlice";

export type EstateImage = {
  url: string;
  fileId: string;
  _id: string;
};

type Props = {
  estateId: string;
  images: EstateImage[];
};

export default function EstateImagesGrid({ estateId, images }: Props) {
  const dispatch = useAppDispatch();
  const { mutate: addImages, isPending: isAddingImages } =
    useAddImagesToEstate(estateId);
  const { mutate: deleteImage, isPending: isDeletingImage } =
    useRemoveImageFromEstate(estateId);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const existingImages = images ?? [];

      if (existingImages.length + files.length > 30) {
        dispatch(
          pushNotification({
            message: "Maksimalno 30 slika po prostoru.",
            type: "warning",
          })
        );
        return;
      }
      addImages(files);
    }
  };

  const handleDeleteImage = (fileId: string) => {
    deleteImage(fileId);
  };

  if (!images || images.length === 0) {
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
          Nemate slika — dodajte prve fotografije vašeg prostora
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddPhotoAlternateIcon />}
          component="label"
          disabled={isAddingImages}
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
    <Stack spacing={2}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
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

      <ImageList variant="woven" cols={3} gap={12} sx={{ width: "100%", m: 0 }}>
        {images.map((img) => (
          <ImageListItem
            key={img._id}
            sx={{
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              "&:hover .delete-btn": { opacity: 1 },
            }}
          >
            <img
              src={img.url}
              alt={`estate-${img._id}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            <IconButton
              size="small"
              color="error"
              className="delete-btn"
              disabled={isDeletingImage}
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                bgcolor: "rgba(0,0,0,0.4)",
                color: "white",
                opacity: 0,
                transition: "opacity 0.2s",
                "&:hover": { bgcolor: "rgba(255,0,0,0.7)" },
              }}
              onClick={() => handleDeleteImage(img.fileId)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ImageListItem>
        ))}
      </ImageList>
    </Stack>
  );
}
