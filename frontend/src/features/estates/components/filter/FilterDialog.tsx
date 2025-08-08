import * as React from "react";
import { useSearchParams } from "react-router";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useMediaQuery } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import ToggleButtonsType from "./ToggleButtonsType";
import PriceRangeSlider from "./PriceRangeSlider";
import BadBathCounter from "./BadBathCounter";
import AmenitiesChipArray from "./AmenitiesChipArray";
import { AmenityKey } from "@/shared/constants/amenitiesMap";
import CancelPolicyToggleGroup from "./CancelPolicyToggleGroup";
import ToggleButtonsStayLength from "./ToggleButtonsStayLength";

export default function FilterDialog() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [type, setType] = React.useState<string | null>("any");
  const [stayLength, setStayLength] = React.useState<string>("any");
  const [price, setPrice] = React.useState<[number, number]>([0, 500]); //mjesto 500 moze biti max cijena
  const [beds, setBeds] = React.useState(0);
  const [baths, setBaths] = React.useState(0);
  const [selectedAmenities, setSelectedAmenities] = React.useState<
    AmenityKey[]
  >([]);
  const [cancelPolicy, setCancelPolicy] = React.useState<string | null>("any");
  const [petsAllowed, setPetsAllowed] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReset = () => {
    setType("any");
    setStayLength("any");
    setPrice([0, 500]);
    setBeds(1);
    setBaths(1);
    setSelectedAmenities([]);
    setCancelPolicy("any");
    setPetsAllowed(false);
  };

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams();

    if (type && type !== "any") newParams.set("type", type); // npr: 'apartment'
    if (stayLength !== "any") newParams.set("rentalType", stayLength);
    if (beds > 0) newParams.set("beds", beds.toString());
    if (baths > 0) newParams.set("baths", baths.toString());
    if (price[0] !== 0) newParams.set("minPrice", price[0].toString());
    if (price[1] !== 500) newParams.set("maxPrice", price[1].toString());
    if (selectedAmenities.length !== 0)
      newParams.set("amenities", selectedAmenities.toString());
    if (cancelPolicy && cancelPolicy !== "any")
      newParams.set("cancelationPolicy", cancelPolicy);
    if (petsAllowed) newParams.set("pets", "true"); // samo ako je čekirano

    setSearchParams(newParams);
    handleClose(); // zatvori dijalog
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        sx={{ borderRadius: 4 }}
        onClick={handleClickOpen}
      >
        Filteri
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        fullScreen={fullScreen}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        sx={{ borderRadius: 10 }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
            },
          },
        }}
      >
        <DialogTitle
          id="scroll-dialog-title"
          sx={{ position: "relative", textAlign: "center" }}
        >
          Filteri
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers={true}>
          <Stack spacing={2} divider={<Divider flexItem />}>
            <Box>
              <Typography variant="h6" component="div" gutterBottom>
                Tip nekretnine
              </Typography>
              <ToggleButtonsType type={type} setType={setType} />
            </Box>
            <Box>
              <Typography variant="h6" component="div" gutterBottom>
                Duzina boravka
              </Typography>
              <ToggleButtonsStayLength
                stayLength={stayLength}
                setStayLength={setStayLength}
              />
            </Box>
            <Box>
              <Typography variant="h6" component="div" gutterBottom>
                Raspon cijena
              </Typography>
              <PriceRangeSlider value={price} setValue={setPrice} />
            </Box>
            <Box>
              <Typography variant="h6" component="div" gutterBottom>
                Broj kreveta i kupatila
              </Typography>
              <BadBathCounter
                beds={beds}
                setBeds={setBeds}
                baths={baths}
                setBaths={setBaths}
              />
            </Box>
            <Box>
              <Typography variant="h6" component="div" gutterBottom>
                Sadržaj
              </Typography>
              <AmenitiesChipArray
                selectedAmenities={selectedAmenities}
                setSelectedAmenities={setSelectedAmenities}
              />
            </Box>
            <Box>
              <Typography variant="h6" component="div" gutterBottom>
                Politika otkazivanja
              </Typography>
              <CancelPolicyToggleGroup
                value={cancelPolicy}
                onChange={setCancelPolicy}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="h6"
                component="div"
                display={"inline"}
                gutterBottom
              >
                Kućni ljubimci
              </Typography>
              <FormControl component="fieldset" variant="standard">
                <FormControlLabel
                  control={
                    <Switch
                      checked={petsAllowed}
                      onChange={(e) => setPetsAllowed(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={petsAllowed ? "Dozvoljeni" : "Nebitno"}
                />
                <FormHelperText>
                  Prikaži samo smještaje sa dozvoljenim kućnim ljubimcima
                </FormHelperText>
              </FormControl>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={handleReset}>Obrisi sve</Button>
          <Button
            variant="contained"
            onClick={handleApplyFilters}
            sx={{ borderRadius: 4 }}
          >
            Pretraži
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
