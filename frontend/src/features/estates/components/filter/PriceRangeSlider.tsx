import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

export default function PriceRangeSlider({
  value,
  setValue,
}: {
  value: [number, number];
  setValue: (value: [number, number]) => void;
}) {
  const [inputs, setInputs] = useState<[string, string]>(() => [
    value[0].toString(),
    value[1].toString(),
  ]);

  useEffect(() => {
    // Update inputs when value changes
    setInputs([value[0].toString(), value[1].toString()]);
  }, [value]);

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const val = newValue as [number, number];
    setValue(val);
    setInputs([val[0].toString(), val[1].toString()]);
  };

  const handleInputChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newInputs = [...inputs] as [string, string];
      newInputs[index] = e.target.value;
      setInputs(newInputs);
    };

  const handleBlur = (index: number) => () => {
    const parsed = parseInt(inputs[index], 10);

    // Ako nije broj – resetuj na prethodnu validnu vrijednost
    if (isNaN(parsed)) {
      setInputs([value[0].toString(), value[1].toString()]);
      return;
    }

    // Kreiraj predloženu novu vrijednost
    const proposedValue = [...value] as [number, number];
    proposedValue[index] = parsed;

    // Provjeri validnost: min < max i granice
    const isValid =
      proposedValue[0] >= 0 &&
      proposedValue[1] <= 500 &&
      proposedValue[0] < proposedValue[1];

    if (!isValid) {
      // Ako nije validno – vrati stara prikazana polja
      setInputs([value[0].toString(), value[1].toString()]);
      return;
    }

    // Ako je sve OK – postavi novu vrijednost
    setValue(proposedValue);
    setInputs([proposedValue[0].toString(), proposedValue[1].toString()]);
  };

  return (
    <Box>
      <Slider
        value={value}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        max={500}
        disableSwap
      />

      <Box display="flex" justifyContent="space-between" gap={2} mt={2}>
        <TextField
          label="Min"
          value={inputs[0]}
          onChange={handleInputChange(0)}
          onBlur={handleBlur(0)}
          inputMode="numeric"
          type="text"
          sx={{ width: "20%" }}
        />
        <TextField
          label="Max"
          value={inputs[1]}
          onChange={handleInputChange(1)}
          onBlur={handleBlur(1)}
          inputMode="numeric"
          type="text"
          sx={{ width: "20%" }}
        />
      </Box>
    </Box>
  );
}
