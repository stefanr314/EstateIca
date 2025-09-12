export enum CancellationPolicy {
  FLEXIBLE = "Flexible",
  MODERATE = "Moderate",
  STRICT = "Strict",
  NONE = "None",
}

export interface IAddress {
  country: string;
  city: string;
  postalCode?: string;
  suburb?: string;
  countryCode: string;
  street: string;
  placeId: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
}

export enum ResidentialType {
  APARTMENT = "Apartment",
  HOUSE = "House",
  ROOM = "Room",
  MULTI_UNIT = "Multi Unit",
  VILLA = "Villa",
  STUDIO = "Studio",
  CABIN = "Cabin",
  COTTAGE = "Cottage",
  PENTHOUSE = "Penthouse",
  OTHER = "Other",
}

export enum RoomType {
  SINGLE = "Single",
  DOUBLE = "Double",
  ENTIRE_ROOM = "Entire Room/Apartment",
  SHARED_ROOM = "Shared Room",
  LUXURY = "Luxury Room",
  OTHER = "Other",
}

export enum Amenities {
  AirConditioning = "Air conditioning",
  Heating = "Heating",
  Kitchen = "Kitchen",
  TV = "TV",
  Wifi = "Wifi",
  Parking = "Parking",
  Pool = "Pool",
  Gym = "Gym",
  Breakfast = "Breakfast",
  Laundry = "Laundry",
  SmokeFree = "Smoke free",
  FamilyFriendly = "Family friendly",
  HotTub = "Hot tub",
  Beachfront = "Beachfront",
  Balcony = "Balcony",
  Garden = "Garden",
  BBQ = "BBQ",
  Fireplace = "Fireplace",
  Elevator = "Elevator",
  Dishwasher = "Dishwasher",
  Microwave = "Microwave",
  ParkingSpace = "Parking space",
  KITCHENETTE = "KITCHENETTE",
  SECURITY = "SECURITY",
  CCTV = "CCTV",
  RECEPTION = "RECEPTION",
  ELEVATOR = "ELEVATOR",
  WHEELCHAIR_ACCESS = "WHEELCHAIR_ACCESS",
}

export interface IBaseEstate {
  _id: string;
  title: string;
  description: string;
  neighborhoodOverview?: string;
  notes?: string;
  houseRules?: string;
  transit?: string;
  access?: string;
  cancellationPolicy?: CancellationPolicy;

  images: { url: string; fileId: string; _id: string }[];

  securityDeposit?: number;

  host: {
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl?: string;
    estatesCount: number;
  }; // | USER
  address: IAddress;

  estateType: "ResidentialEstate" | "BusinessEstate"; //estateType field through discriminator key option
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IResidentialEstate extends IBaseEstate {
  rentalType: "Short Term" | "Long Term";
  bedrooms?: number;
  bathrooms?: number;
  beds: number;
  minimumStay: number;
  maximumStay?: number;
  pricePerNight?: number;
  pricePerMonth?: number; // Optional field for long-term rental price per month
  area?: number;
  amenities?: Amenities[];
  residentialType: ResidentialType;
  roomType?: RoomType;
  guestIncluded: number;
  extraPeople?: number;
  petAllowance?: boolean;
  averageRating: {
    overall: number;
    cleanliness: number;
    amenities: number;
    host: number;
    location: number;
  }; // prosjek ocjena
  reviewsCount: number; // broj recenzija
  unitsAvailable?: number; // Optional field to indicate the number of units available for long-term rental
}

export interface IBusinessEstate extends IBaseEstate {
  rentalType: "Long Term";
  pricePerMonth: number; // Required field for business estates
  unitsAvailable: number; // Optional field to indicate the number of units available for long-term rental - default 1
  area: number; // Required field for area in square meters
  intentedUse: "retail" | "office" | "warehouse" | "hospitality" | "other";
  floor?: number;
  hasElevator?: boolean;
  isGroundFloor?: boolean;
  ceilingHeight?: number;
  hasParking?: boolean;
  parkingSpaces?: number;
  hasRestroom?: boolean;
  minimumLeaseMonths?: number;
  maximumLeaseMonths?: number;
  airConditioning?: boolean;
  internetReady?: boolean;

  amenities?: Amenities[]; // Optional field for business amenities
}

export interface AllResidentialData {
  _id: string;
  title: string;
  description: string;
  images: { url: string; fileId: string; _id: string }[];
  rentalType: "Short Term" | "Long Term";
  beds: number;
  pricePerNight?: number;
  pricePerMonth?: number;
  amenities?: Amenities[];
  petAllowance?: boolean;
  averageRatingOverall: number;
  address: IAddress;
  estateType: "ResidentialEstate";
}

export interface AllBusinessData {
  _id: string;
  title: string;
  description: string;
  rentalType: "Long Term";
  images: { url: string; fileId: string; _id: string }[];
  pricePerMonth: number;
  area: number;
  unitsAvailable: number;
  intendedUse: "retail" | "office" | "warehouse" | "hospitality" | "other";
  amenities?: Amenities[];
  address: IAddress;
  estateType: "BusinessEstate";
}
