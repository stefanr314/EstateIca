import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Popper from "@mui/material/Popper";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";

import LocationSearch from "./LocationSearch";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import GuestsCounter from "./GuestsCounter";
import RangeCalendar from "./calendar/RangeCalendar";
import { ClearIcon } from "@mui/x-date-pickers";

import {
  DateInput,
  StyledBox,
  StyledPaper,
} from "./searchBar/styledComponents";
import { useSearchParams } from "react-router";

interface SearchData {
  placeId: string;
  city: string;
  country: string;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  adults: number;
  children: number;
}

const StyledSearchBar = React.forwardRef<HTMLDivElement, {}>((_, ref) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [popoverContent, setPopoverContent] = useState<
    "location" | "guests" | "date" | null
  >(null);
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchData, setSearchData] = useState<SearchData>({
    placeId: "",
    city: "",
    country: "",
    selectedStartDate: null,
    selectedEndDate: null,
    adults: 0,
    children: 0,
  });

  const updateSearchData = <K extends keyof typeof searchData>(
    key: K,
    value: (typeof searchData)[K]
  ) => {
    setSearchData((prev) => ({ ...prev, [key]: value }));
  };

  const [activeInput, setActiveInput] = useState<"start" | "end" | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const openPopover = Boolean(anchorEl);
  const isOpening = useRef(false);
  const id = openPopover ? "simple-popover" : undefined;

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState(false);

  const handleClickPopover = (
    event: React.MouseEvent<HTMLElement>,
    content: "location" | "guests" | "date"
  ) => {
    setPopoverContent(content);
    setAnchorEl(event.currentTarget);
    isOpening.current = true;
  };

  const handleOnSelectLocation = (location: {
    description: string;
    place_id: string;
  }) => {
    console.log("Izabrana lokacija:", location.description, location.place_id);
    const [city, country] = location.description.split(", ");
    setSearchData((prev) => ({
      ...prev,
      placeId: location.place_id,
      city,
      country,
    }));
    // opcionalno: možeš odmah zatražiti lat/lng iz place_id
  };

  const handleSendSearchData = () => {
    console.log("Slanje podataka za pretragu:", searchData);
    const params = new URLSearchParams(searchParams);
    const {
      placeId,
      city,
      country,
      selectedStartDate,
      selectedEndDate,
      adults,
      children,
    } = searchData;
    if (placeId) {
      params.set("placeId", placeId);
    }
    if (city) {
      params.set("city", city);
    }
    if (country) {
      params.set("country", country);
    }
    if (selectedStartDate) {
      params.set("startDate", selectedStartDate.toISOString().split("T")[0]);
    }
    if (selectedEndDate) {
      params.set("endDate", selectedEndDate.toISOString().split("T")[0]);
    }
    if (adults) {
      params.set("adults", adults.toString());
    }
    if (children) {
      params.set("children", children.toString());
    }
    setSearchParams(params);
    if (isMobile) {
      setOpenDialog(false);
    }
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setPopoverContent(null);
  };

  const handleClickAway = () => {
    if (isOpening.current) {
      isOpening.current = false;
      return;
    }
    handleClosePopover();
  };

  useEffect(() => {
    if (searchData.selectedStartDate) {
      setActiveInput("end");
    }
  }, [searchData.selectedStartDate]);

  useEffect(() => {
    !isMobile && setOpenDialog(false);
  }, [isMobile]);

  return (
    <Box>
      {isMobile ? (
        <Box display="flex" justifyContent="center">
          <IconButton
            onClick={() => setOpenDialog(true)}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
              width: 56,
              height: 56,
              mt: 2,
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>
      ) : (
        <StyledPaper elevation={4} square={false} sx={{ maxWidth: "900px" }}>
          <StyledBox
            sx={{ flex: 2 }}
            // onClick={(e) => handleClickPopover(e, "location")}
          >
            <Box>Gdje</Box>
            <FormControl variant="standard" size="small" fullWidth>
              <LocationSearch onSelect={handleOnSelectLocation} />
              {/* <Input
                  placeholder="Pretraži..."
                  value={searchData.location}
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  disableUnderline
                  inputRef={inputRef}
                  sx={{ borderRadius: 13 }}
                  endAdornment={
                    searchData.location.length !== 0 && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setSearchData((prev) => ({
                              ...prev,
                              location: "",
                            }));
                          }}
                          size="small"
                          sx={{ margin: 0, padding: 0.1 }}
                        >
                          <ClearIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                /> */}
            </FormControl>
          </StyledBox>

          <DateInput
            label="Dolazak"
            date={searchData?.selectedStartDate}
            onClick={(e) => {
              handleClickPopover(e, "date");
              setActiveInput("start");
            }}
            onClear={() => {
              setSearchData((prev) => ({
                ...prev,
                selectedStartDate: null,
                selectedEndDate: null,
              }));
            }}
          />

          <DateInput
            label="Odlazak"
            date={searchData?.selectedEndDate}
            onClick={(e) => {
              handleClickPopover(e, "date");
              setActiveInput("end");
            }}
            onClear={() => {
              setSearchData((prev) => ({
                ...prev,
                selectedStartDate: null,
                selectedEndDate: null,
              }));
            }}
          />

          <StyledBox
            sx={{
              flex: 2,
              flexDirection: "row",
              alignItems: "center",

              justifyContent: "space-around",
              "& > :first-of-type": {
                color: "text.primary",
              },
            }}
          >
            <Box
              onClick={(e) => handleClickPopover(e, "guests")}
              sx={{
                "&>:first-of-type": {
                  fontSize: "0.95rem",
                  fontWeight: 500,
                },
                "&>:nth-of-type(2)": {
                  fontSize: "0.85rem",
                  fontWeight: 300,
                },
              }}
            >
              <Box>Ko</Box>
              <Input
                id="guests-input"
                aria-label="Unos broja gostiju"
                readOnly
                value={
                  searchData.adults && !searchData.children
                    ? `${searchData.adults} odraslih`
                    : searchData.adults && searchData.children
                    ? `${searchData.adults} odraslih, ${searchData.children} djece`
                    : !searchData.adults && searchData.children
                    ? `${searchData.children} djece`
                    : ""
                }
                placeholder="Unesi goste"
                disableUnderline
                endAdornment={
                  (searchData.adults !== 0 || searchData.children !== 0) && (
                    <InputAdornment position="end">
                      <Tooltip title="Obriši unos" arrow>
                        <IconButton
                          onClick={() => {
                            // setAdults(0);
                            // setChildren(0);
                            setSearchData((prev) => ({
                              ...prev,
                              adults: 0,
                              children: 0,
                            }));
                          }}
                          size="small"
                          aria-label="Obriši unos"
                          sx={{ fontSize: 17, margin: 1, padding: 0.5 }}
                        >
                          <ClearIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }
                sx={{
                  input: {
                    cursor: "pointer",
                    color: "text.primary",
                    "&:focus": {
                      caretColor: "transparent",
                    },
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                textAlign: "center",
              }}
            >
              <IconButton
                aria-label="search"
                edge="end"
                onClick={handleSendSearchData}
                sx={{
                  backgroundColor: "primary.main", // Pozadina u primarnoj boji
                  color: "white", // Ikona bela
                  "&:hover": {
                    backgroundColor: "primary.dark", // Tamnija pozadina na hover
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            </Box>
          </StyledBox>
        </StyledPaper>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullScreen={isMobile}
        fullWidth
        maxWidth="sm"
        ref={ref}
      >
        {/* AppBar sa X dugmetom */}
        {isMobile && (
          <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
            <Toolbar>
              <Typography sx={{ flexGrow: 1 }} variant="h6" color="inherit">
                Pretraga
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setOpenDialog(false)}
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        )}

        {/* Sadržaj dijaloga */}
        <DialogContent>
          <Stack spacing={2} mt={2}>
            {/* Gdje */}
            <FormControl variant="standard" fullWidth>
              <Typography variant="subtitle2">Gdje</Typography>
              <Input
                placeholder="Pretraži destinaciju"
                value={searchData.placeId}
                onChange={(e) =>
                  setSearchData((prev) => ({
                    ...prev,
                    placeId: e.target.value,
                  }))
                }
                disableUnderline
                fullWidth
              />
            </FormControl>

            {/* Dolazak i Odlazak */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {searchData.selectedStartDate && searchData.selectedEndDate
                  ? `${searchData.selectedStartDate.toLocaleDateString()} - ${searchData.selectedEndDate.toLocaleDateString()}`
                  : "Izaberi datume"}
              </Typography>
              <RangeCalendar
                startDate={searchData?.selectedStartDate}
                endDate={searchData?.selectedEndDate}
                setStartDate={(date) => {
                  updateSearchData("selectedStartDate", date);
                }}
                setEndDate={(date) => updateSearchData("selectedEndDate", date)}
                activeInput={activeInput}
              />
            </Box>

            {/* Gosti */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {searchData.adults && !searchData.children
                  ? `${searchData.adults} odraslih`
                  : searchData.adults && searchData.children
                  ? `${searchData.adults} odraslih, ${searchData.children} djece`
                  : !searchData.adults && searchData.children
                  ? `${searchData.children} djece`
                  : "Izaberi goste"}
              </Typography>
              <GuestsCounter
                adults={searchData.adults}
                children={searchData.children}
                onAdultsChange={(adults) => {
                  updateSearchData("adults", adults);
                }}
                onChildrenChange={(children) => {
                  updateSearchData("children", children);
                }}
                size="medium"
              />
            </Box>
          </Stack>
        </DialogContent>

        {/* Dugme Pretraži */}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              // logika za pretragu
              setOpenDialog(false);
            }}
            variant="contained"
            fullWidth
            size="large"
            startIcon={<SearchIcon />}
          >
            Pretraži
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popper za sve prikaze */}
      <ClickAwayListener onClickAway={handleClickAway}>
        <Popper
          id={id}
          open={openPopover}
          anchorEl={anchorEl}
          placement="bottom-start"
          ref={ref}
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            maxWidth: "none",
            width: "auto",
            zIndex: 1300,
            bgcolor: "background.paper",
            color: "text.primary",
          }}
        >
          <Paper
            sx={{
              p: 2,
              boxShadow: 3,
              borderRadius: 1,
              bgcolor: "background.paper",
              width: "auto",
            }}
          >
            {popoverContent === "date" ? (
              <RangeCalendar
                startDate={searchData?.selectedStartDate}
                endDate={searchData?.selectedEndDate ?? null}
                setStartDate={(date) => {
                  updateSearchData("selectedStartDate", date);
                }}
                setEndDate={(date) => {
                  updateSearchData("selectedEndDate", date);
                }}
                activeInput={activeInput}
              />
            ) : popoverContent === "guests" ? (
              <GuestsCounter
                adults={searchData.adults}
                children={searchData.children}
                onAdultsChange={(adults) => {
                  updateSearchData("adults", adults);
                }}
                onChildrenChange={(children) => {
                  updateSearchData("children", children);
                }}
                size="medium"
              />
            ) : (
              <Typography>{popoverContent}</Typography>
            )}
          </Paper>
        </Popper>
      </ClickAwayListener>
    </Box>
  );
});

export default StyledSearchBar;
