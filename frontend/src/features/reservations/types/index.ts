type ResidentialEstateInfoForReservation = {
  _id: string;
  estateType: "ResidentialEstate";
  address: { city: string; country: string };
  minimumStay: number;
  maximumStay?: number;
  guestIncluded: number;
  extraPeople: number;
};

type BusinessEstateInfoForReservation = {
  _id: string;
  estateType: "BusinessEstate";
  address: { city: string; country: string };
  unitsAvailable: number;
};

export type EstateReservedInfo =
  | ResidentialEstateInfoForReservation
  | BusinessEstateInfoForReservation;

export interface IReservation {
  _id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  guestCount: number;
  childrenCount?: number;
  estateReserved: string;
  userOfReservation:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
      };
  hostOfReservedEstate:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
      };
  status: ReservationStatus;
  pendingChange?: {
    type: "EXTEND" | "UPDATE_DATE";
    newStartDate?: string;
    newEndDate?: string;
    extraPrice?: number;
    totalPrice: number;
    note?: string;
  };
  pendingContractChange?: {
    newUnitCount: number;
    note?: string;
  };
  rentalType: "Long Term" | "Short Term";
  hostName: string;
  guestName: string;
  estateTitle: string;
  pricePerNight?: number;
  pricePerMonth?: number;
  extraPeopleFee?: number;
  childrenDiscount?: number;
  unitCount?: number; // Optional field for long-term rental unit count
  note?: string; // Optional field for additional notes
  isContractRequired?: boolean; // Optional field to indicate if a contract is required
  lastRelatedContractId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IReservationPopulated
  extends Omit<IReservation, "estateReserved"> {
  estateReserved: EstateReservedInfo; // uvijek objekat
}

export interface UserReservationsRow {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  guestCount: number;
  childrenCount: number;
  status: ReservationStatus;
  rentalType: "Long Term" | "Short Term";
  hostName: string;
  estateTitle: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface HostReservationRow
  extends Omit<UserReservationsRow, "hostName"> {
  guestName: string;
}

export enum ReservationStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELED = "canceled",
  COMPLETED = "completed",
}

export interface PaginatedReservationsResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export enum ContractStatus {
  DRAFT = "draft",
  SIGNED = "signed",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

export interface IContract {
  _id: string;
  reservationId: string;
  contractFileUrl: string;
  validFrom: string;
  validTo: string;
  signedByHost: boolean;
  signedByTenant: boolean;
  status: ContractStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDetailedContract extends Omit<IContract, "reservationId"> {
  reservation: {
    _id: string;
    estateName: string;
    pricePerMonth: number;
    hostName: string;
    guestName: string;
    lastRelatedContractId: string;
  };
}
export interface CompletedReservationWithReviewRow {
  id: string;
  estateId: string;
  estateTitle: string;
  estateType: "ResidentialEstate" | "BusinessEstate";
  rentalType: "Long Term" | "Short Term";
  totalPrice: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  hasReview: boolean;
  reviewId: string | null;
}

export interface ReservationWithContract {
  reservation: IReservation;
  contract?: IContract;
}

export interface CreateResidentialReservation {
  startDate: Date;
  endDate: Date;
  guestCount: number;
  childrenCount?: number;
  note?: string;
}

export interface CreateBusinessReservation {
  startDate: Date;
  endDate: Date;
  unitCount: number;
  note?: string;
}
