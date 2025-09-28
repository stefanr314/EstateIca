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
  Bathroom,
  BreakfastDining,
  Deck,
  FitnessCenter,
  SmokeFree,
  Yard,
} from "@mui/icons-material";
import { Amenities } from "@/features/estates/types";

export const amenitiesMap: Partial<
  Record<Amenities, { icon: React.ElementType; label: string }>
> = {
  [Amenities.Wifi]: { icon: Wifi, label: "WiFi" },
  [Amenities.Parking]: { icon: LocalParking, label: "Parking" },
  [Amenities.Kitchen]: { icon: Kitchen, label: "Kuhinja" },
  [Amenities.TV]: { icon: Tv, label: "TV" },
  [Amenities.Pool]: { icon: Pool, label: "Bazen" },
  [Amenities.Fireplace]: { icon: Fireplace, label: "Kamin" },
  [Amenities.HotTub]: { icon: HotTub, label: "Džakuzi" },
  [Amenities.AirConditioning]: { icon: AcUnit, label: "Klima" },
  [Amenities.Microwave]: { icon: Microwave, label: "Mikrovalna" },
  [Amenities.Elevator]: { icon: Elevator, label: "Lift" },
  [Amenities.FamilyFriendly]: { icon: FamilyRestroom, label: "Porodično" },
  [Amenities.Breakfast]: { icon: BreakfastDining, label: "Doručak" },
  [Amenities.Balcony]: { icon: Deck, label: "Balkon" },
  [Amenities.Gym]: { icon: FitnessCenter, label: "Teretana" },
  [Amenities.SmokeFree]: { icon: SmokeFree, label: "Zabranjeno pušenje" },
  [Amenities.Garden]: { icon: Yard, label: "Bašta" },
  [Amenities.Laundry]: { icon: Bathroom, label: "Veš mašina" }, // improv
  // dodaj šta koristiš, ostalo može ostati bez ikone
};

export type AmenityKey = keyof typeof amenitiesMap;
