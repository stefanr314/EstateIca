import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import agent from "@/app/api/agent";

interface PlacePrediction {
  description: string;
  place_id: string;
}

interface LocationAddressProps {
  onSelect: (place: PlacePrediction) => void;
  defaultValue?: PlacePrediction | null;
}

const LocationAddress: React.FC<LocationAddressProps> = ({
  onSelect,
  defaultValue = null,
}) => {
  const [inputValue, setInputValue] = useState<string>(
    defaultValue?.description || ""
  );
  const [options, setOptions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<PlacePrediction | null>(
    defaultValue
  );

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue);
      setInputValue(defaultValue.description);
    }
  }, [defaultValue]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!inputValue) return;
      setLoading(true);

      try {
        const data = await agent.Location.searchAddresses(inputValue);

        setOptions(data.length ? data : []);
      } catch (err) {
        console.error("Failed to fetch places", err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(debounce);
  }, [inputValue]);

  return (
    <Autocomplete
      fullWidth
      options={options}
      value={selected}
      inputValue={inputValue}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      loading={loading}
      onInputChange={(event, value) => setInputValue(value)}
      onChange={(event, value) => {
        if (value && typeof value !== "string") {
          setSelected(value);
          onSelect(value);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={"Pretraži adresu"}
          placeholder={"Unesite adresu (ulica, broj...)"}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default LocationAddress;
