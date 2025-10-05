import agent from "@/app/api/agent";
import { useAppDispatch } from "@/app/store/hooks";
import { pushNotification } from "@/features/notifications/notificationSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateBusinessReservation,
  CreateResidentialReservation,
  IDetailedContract,
  IReservation,
  IReservationPopulated,
  PaginatedReservationsResponse,
  ReservationWithContract,
  UserReservationsRow,
} from "../types";
import { GridSortModel } from "@mui/x-data-grid";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { resetReservation } from "../reservationSlice";

// Generic useMutation body
type MutationFn<TBody> = (
  reservationId: string,
  body: TBody
) => Promise<{
  message: string;
  reservation: IReservation;
}>;

function useReservationMutation<TBody>(
  mutationFn: MutationFn<TBody>,
  successMessage: string
) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { reservationId: string; body: TBody }) => {
      return await mutationFn(variables.reservationId, variables.body);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reservation-details", variables.reservationId],
      });

      dispatch(
        pushNotification({
          type: "success",
          message: data.message || successMessage,
        })
      );
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      dispatch(
        pushNotification({
          type: "error",
          message:
            err.response?.data?.message ??
            "Došlo je do greške, akcija nije izvršena.",
        })
      );
    },
  });
}

export const useGetMyReservations = (
  page: number,
  limit: number = 10,
  remainingSearchParams: URLSearchParams,
  sortModel: GridSortModel
) => {
  const searchParams = new URLSearchParams(remainingSearchParams);
  searchParams.set("page", page.toString());
  searchParams.set("limit", limit.toString());

  const sortBy = sortModel.map((s) => `${s.field}:${s.sort}`).join(","); //u ovakvom formatu bekend prima ovo polje ime_polja:asc/desc
  if (sortBy) {
    searchParams.set("sortBy", sortBy);
  }

  const queryObject = Object.fromEntries(searchParams);

  return useQuery({
    queryKey: ["personal-reservations", queryObject],
    queryFn: async (): Promise<
      PaginatedReservationsResponse<UserReservationsRow>
    > => {
      const res = await agent.Reservation.myReservations(searchParams);
      return res;
    },
  });
};

export const useGetReservationDetails = (reservationId: string) => {
  return useQuery({
    queryKey: ["reservation-details", reservationId],
    queryFn: async (): Promise<IReservationPopulated> => {
      return await agent.Reservation.reservationById(reservationId);
    },
  });
};

export const useCreateReservation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: {
      type: "residential" | "business";
      estateId: string;
      body: CreateResidentialReservation | CreateBusinessReservation;
    }): Promise<IReservation> => {
      if (variables.type === "business")
        return await agent.Reservation.createBusiness(
          variables.estateId,
          variables.body as CreateBusinessReservation
        );
      const res = await agent.Reservation.createResidential(
        variables.estateId,
        variables.body as CreateResidentialReservation
      );
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personal-reservations"] });

      dispatch(resetReservation()); //resetovanje lokalnog globalnog stanja

      dispatch(
        pushNotification({
          type: "success",
          message:
            "Uspjesno ste kreirali vasu rezervaciju. Detalje pogledajte u svom kontrolnom panelu.",
        })
      );
    },
    onError: (err: AxiosError<{ message: string }>) => {
      dispatch(
        pushNotification({
          type: "error",
          message:
            err.response?.data.message ||
            "Doslo je do greske prilikom pokusaja vase akcije",
        })
      );
    },
  });
};

export const useLockDatesByHost = (estateId: string) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      startDate: Date;
      endDate: Date;
      note?: string;
    }) => {
      const response = await agent.Reservation.lockDates(estateId, {
        startDate: data.startDate,
        endDate: data.endDate,
        note: data.note,
      });
      return response;
    },
    onMutate: async (data) => {
      // Optimistic update with rollback

      await queryClient.cancelQueries({
        queryKey: ["estateBlockedDates", estateId],
      });
      const previousDates = queryClient.getQueryData([
        "estateBlockedDates",
        estateId,
      ]);
      queryClient.setQueryData(
        ["estateBlockedDates", estateId],
        (
          oldData: {
            type: "RESERVATION" | "LOCK";
            startDate: Date;
            endDate: Date;
          }[] = []
        ) => [
          ...oldData,
          {
            type: "LOCK",
            startDate: data.startDate,
            endDate: data.endDate,
          },
        ]
      );

      return { previousDates };
    },
    onSuccess: () => {
      dispatch(
        pushNotification({
          type: "success",
          message: "Datumi su uspješno zaključani.",
        })
      );
    },
    onError: (error: any, _, onMutateResults) => {
      if (onMutateResults?.previousDates) {
        queryClient.setQueryData(
          ["estateBlockedDates", estateId],
          onMutateResults.previousDates
        );
      }
      dispatch(
        pushNotification({
          type: "error",
          message:
            error?.response?.data?.message ||
            "Došlo je do greške prilikom zaključavanja datuma.",
        })
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["estateBlockedDates", estateId],
      });
    },
  });
};

export const useCancelReservation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (
      reservationId: string
    ): Promise<ReservationWithContract> => {
      return await agent.Reservation.cancel(reservationId);
    },
    onSuccess: (data, reservationId) => {
      //  queryClient.setQueryData(["reservation-details", reservationId], data.reservation);
      queryClient.invalidateQueries({
        queryKey: ["reservation-details", reservationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["personal-reservations"],
      });

      if (
        "contract" in data &&
        data.contract &&
        data.reservation.rentalType === "Long Term"
      ) {
        const detailedContract: IDetailedContract = {
          _id: data.contract._id,
          status: data.contract.status,
          signedByHost: data.contract.signedByHost,
          signedByTenant: data.contract.signedByTenant,
          validFrom: data.contract.validFrom,
          validTo: data.contract.validTo,
          contractFileUrl: data.contract.contractFileUrl,
          reservation: {
            _id: data.reservation._id,
            estateName: data.reservation.estateTitle,
            pricePerMonth: data.reservation.pricePerMonth!,
            hostName: data.reservation.hostName,
            guestName: data.reservation.guestName,
            lastRelatedContractId: data.reservation.lastRelatedContractId!,
          },
        };
        // localStorage.setItem("lastContractId", data.contract._id);
        navigate(`/dashboard/contract/${data.contract._id}`, {
          state: { contract: detailedContract },
        });
      }

      dispatch(
        pushNotification({
          type: "success",
          message: "Uspjesno ste ponistili vasu rezervaciju.",
        })
      );
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      dispatch(
        pushNotification({
          type: "error",
          message:
            err.response?.data?.message ??
            "Vasa rezervacija nije ispravno otkazana.",
        })
      );
    },
  });
};

export const useExtendReservation = () =>
  useReservationMutation<{ newEndDate: Date; note?: string }>(
    agent.Reservation.extend,
    "Uspjesno produzeno ceka se na vlasnika."
  );

export const useUpdateReservationDate = () =>
  useReservationMutation<{ startDate: Date; endDate: Date; note?: string }>(
    agent.Reservation.updateDates,
    "Uspjesna promjena ceka se na vlasnika."
  );

export const useUpdateBusinessReservationUnitCount = () =>
  useReservationMutation<{ unitCount: number; note?: string }>(
    agent.Reservation.updateBusinessUnitCount,
    "Uspjesna promjena ceka se na vlasnika."
  );

export const useUpdateResidentialGuestCount = () =>
  useReservationMutation<{
    guestCount?: number;
    childrenCount?: number;
    note?: string;
  }>(
    agent.Reservation.updateGuestCount,
    "Uspjesna promjena ceka se na vlasnika."
  );
