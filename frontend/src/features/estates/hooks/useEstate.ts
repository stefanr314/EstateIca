import {
  useQuery,
  keepPreviousData,
  UseQueryResult,
} from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import agent from "../../../app/api/agent";
import { PaginatedResponse } from "@/app/types/api";
import {
  AllBusinessData,
  AllResidentialData,
  IBusinessEstate,
  IResidentialEstate,
} from "../types";
type EstateType = "residential" | "business";

interface UseEstatesOptions {
  type: EstateType;
  page: number;
  limit?: number; // možeš zakucati default
}

export function fetchEstates(
  type: EstateType,
  page: number,
  limit: number,
  searchParams: URLSearchParams
): Promise<PaginatedResponse<AllResidentialData | AllBusinessData>> {
  const params = new URLSearchParams(searchParams);
  params.set("page", page.toString());
  params.set("limit", limit.toString());

  if (type === "residential") {
    return agent.Estates.getAllResidentialEstates(params);
  }
  return agent.Estates.getAllBusinessEstates(params);
}

export function useEstates({ type, page, limit = 10 }: UseEstatesOptions) {
  const [searchParams] = useSearchParams();

  // prebacujemo search params u objekat (npr. { city: "Sarajevo", adults: "2" })
  const queryObj = Object.fromEntries(searchParams);

  return useQuery({
    queryKey: [type, queryObj, page, limit],
    queryFn: async () => fetchEstates(type, page, limit, searchParams),
    placeholderData: keepPreviousData, // da se ne prazni tabela dok prebacuje page
  });
}

export function useEstate(
  estateId: string
): UseQueryResult<IResidentialEstate | IBusinessEstate> {
  return useQuery({
    queryKey: ["estate", estateId],
    queryFn: async () => {
      const response = await agent.Estates.getEstateById(estateId);
      return response.estate;
    },
  });
}

export function useEstateUnavailableDates(estateId: string): UseQueryResult<
  {
    type: "RESERVATION" | "LOCK";
    startDate: Date;
    endDate: Date;
  }[]
> {
  return useQuery({
    queryKey: ["estateBlockedDates", estateId],
    queryFn: async () => {
      const dates = await agent.Reservation.unavailableDates(estateId);
      return dates;
    },
  });
}
