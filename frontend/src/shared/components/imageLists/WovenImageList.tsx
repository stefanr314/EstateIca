import { Box, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

interface ItemData {
  url: string;
  fileId: string;
  _id: string;
}

function getIKUrl(url: string, w: number, h?: number, q = 90) {
  if (!url) return "";
  let transform = `tr=w-${w},fo-auto,q-${q},e-sharpen,c-at_max`;
  if (h) transform += `,h-${h}`;
  return `${url}?${transform}`;
}

export default function WovenImageList({
  itemData = [],
  isPending,
}: {
  itemData?: ItemData[];
  isPending: boolean;
}) {
  const theme = useTheme();
  // Media queries
  const isXs = useMediaQuery(theme.breakpoints.down("sm")); // mobilni
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md")); // tablet
  const isMdUp = useMediaQuery(theme.breakpoints.up("md")); // desktop

  // Odredi cols
  let cols = 3;
  if (isXs) cols = 1;
  else if (isSm) cols = 2;

  if (isPending) {
    return (
      <Box sx={{ width: "100%", height: "100%" }}>
        <ImageList
          variant="woven"
          cols={cols}
          gap={10}
          sx={{ width: "100%", height: "100%" }}
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <ImageListItem key={idx}>
              <Skeleton
                variant="rectangular"
                sx={{
                  width: "100%",
                  height: "100%",
                  aspectRatio: "4 / 3", // isto kao slike
                  borderRadius: 2,
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    );
  }

  if (!itemData.length) {
    // Ako je niz prazan i nije pending
    return <div>Nema slika za prikaz</div>;
  }

  return (
    <ImageList
      sx={{ width: "100%", height: "auto" }}
      variant="woven"
      cols={cols}
      gap={10}
    >
      {itemData.map((item) => (
        <ImageListItem key={item._id}>
          <img
            src={getIKUrl(item.url, 600, 400)}
            srcSet={`${getIKUrl(item.url, 600, 400)} 1x, ${getIKUrl(
              item.url,
              1200,
              800
            )} 2x`}
            alt={item.fileId}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
