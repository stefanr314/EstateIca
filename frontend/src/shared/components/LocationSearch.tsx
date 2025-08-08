import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import agent from "@/app/api/agent";

interface PlacePrediction {
  description: string;
  place_id: string;
}

interface LocationSearchProps {
  onSelect: (place: PlacePrediction) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onSelect }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [options, setOptions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!inputValue) return;

      setLoading(true);
      try {
        const data = await agent.Location.search(inputValue);

        console.log(data);
        if (data.lenght === 0) {
          setOptions(data);
        } else {
          setOptions([]);
          console.warn("Google Places API error:", data.status);
        }
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
      freeSolo
      fullWidth
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      loading={loading}
      onInputChange={(event, value) => setInputValue(value)}
      onChange={(event, value) => {
        if (value && typeof value !== "string") {
          onSelect(value);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Pretraži lokaciju"
          placeholder="Npr. Sarajevo, Zagreb, Beograd..."
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

export default LocationSearch;
