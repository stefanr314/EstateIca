import {
  AcUnit,
  LocalParking,
  Wifi,
  Tv,
  Kitchen,
  Pool,
  Fireplace,
  HotTub,
  Elevator,
  FamilyRestroom,
  Microwave,
  Security,
  Bathroom,
  BreakfastDining,
  Deck,
  FitnessCenter,
  SmokeFree,
  Yard,
} from "@mui/icons-material";

export const amenitiesMap = {
  Wifi: {
    icon: Wifi,
    label: "WiFi",
  },
  Parking: {
    icon: LocalParking,
    label: "Parking",
  },
  Bathroom: {
    icon: Bathroom,
    label: "Kupatilo",
  },
  Kitchen: {
    icon: Kitchen,
    label: "Kuhinja",
  },
  TV: {
    icon: Tv,
    label: "TV",
  },
  Pool: {
    icon: Pool,
    label: "Bazen",
  },
  Fireplace: {
    icon: Fireplace,
    label: "Kamin",
  },
  HotTub: {
    icon: HotTub,
    label: "Džakuzi",
  },
  AirConditioning: {
    icon: AcUnit,
    label: "Klima",
  },
  Microwave: {
    icon: Microwave,
    label: "Mikrovalna",
  },
  Elevator: {
    icon: Elevator,
    label: "Lift",
  },
  FamilyFriendly: {
    icon: FamilyRestroom,
    label: "Porodično",
  },
  CCTV: {
    icon: Security,
    label: "Video nadzor",
  },
  Breakfast: {
    icon: BreakfastDining,
    label: "Doručak",
  },
  Balcony: {
    icon: Deck,
    label: "Balkon",
  },
  Gym: {
    icon: FitnessCenter,
    label: "Teretana",
  },
  SmokeFree: {
    icon: SmokeFree,
    label: "Zabranjeno pušenje",
  },
  Garden: {
    icon: Yard,
    label: "Bašta",
  },
  // ... dodaj šta koristiš, ostalo ignoriši
} as const;

export type AmenityKey = keyof typeof amenitiesMap;
