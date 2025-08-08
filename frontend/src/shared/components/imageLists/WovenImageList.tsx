import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

interface ItemData {
  img: string;
  title: string;
}

export default function WovenImageList({ itemData }: { itemData: ItemData[] }) {
  return (
    <ImageList
      sx={{ width: "100%", height: "auto" }}
      variant="woven"
      cols={3}
      gap={10}
    >
      {itemData.map((item) => (
        <ImageListItem key={item.img}>
          <img
            srcSet={`${item.img}?w=600&fit=cover&auto=format&dpr=2 2x`}
            src={`${item.img}?w=600&fit=cover&auto=format`}
            alt={item.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
