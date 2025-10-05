import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useAppDispatch } from "@/app/store/hooks";
import { pushNotification } from "@/features/notifications/notificationSlice";
import { AxiosError } from "axios";
import {
  ReservationWithContract,
  IReservation,
  PaginatedReservationsResponse,
  HostReservationRow,
  IDetailedContract,
} from "../types";
import agent from "@/app/api/agent";
import { useNavigate } from "react-router";
import { GridSortModel } from "@mui/x-data-grid";

// Generic mutation factory for host actions
function useHostReservationMutation<T>(
  mutationFn: (reservationId: string) => Promise<T>,
  successMessage: string = "Uspjesno ste izvrsili akciju."
) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn,
    onSuccess: (data: any, reservationId) => {
      queryClient.invalidateQueries({
        queryKey: ["reservation-details", reservationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["estate-reservations"],
      });

      if ("contract" in data && data.contract) {
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
            pricePerMonth: data.reservation.pricePerMonth,
            hostName: data.reservation.hostName,
            guestName: data.reservation.guestName,
            lastRelatedContractId: data.reservation.lastRelatedContractId,
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
          message: successMessage,
        })
      );
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      dispatch(
        pushNotification({
          type: "error",
          message: err.response?.data?.message || "Neuspješna akcija.",
        })
      );
    },
  });
}

export const useGetEstateReservations = (
  estateId: string,
  page: number,
  limit: number = 10,
  remainingSearchParams: URLSearchParams,
  sortModel: GridSortModel,
  options?: Omit<
    UseQueryOptions<
      PaginatedReservationsResponse<HostReservationRow>,
      AxiosError,
      PaginatedReservationsResponse<HostReservationRow>
    >,
    "queryFn" | "queryKey"
  >
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
    queryKey: ["estate-reservations", estateId, queryObject],
    queryFn: async () => {
      return await agent.Reservation.estateReservations(estateId, searchParams);
      // // Prefetch najnovijih 2–3 rezervacije (primjer)
      // for (const r of res.data.slice(0, 3)) {
      //   queryClient.prefetchQuery({
      //     queryKey: ["reservation-details", r.id],
      //     queryFn: () => agent.Reservation.details(r.id),
      //     staleTime: 1000 * 60 * 5, // 5 minuta
      //   });
      // }
    },
    enabled: !!estateId,
    ...options,
  });
};

export const useApproveExtendUpdateDateReservations = () =>
  useHostReservationMutation<ReservationWithContract>(
    agent.Reservation.approvePending,
    "Uspješno ste potvrdili izmjene."
  );

export const useApproveBusinessUnitCountUpdate = () =>
  useHostReservationMutation<ReservationWithContract>(
    agent.Reservation.approveBusinessUnitCount,
    "Uspješno ste potvrdili izmjene."
  );

export const useConfirmBusinessReservation = () =>
  useHostReservationMutation<ReservationWithContract>(
    agent.Reservation.confirmBusiness,
    "Uspješno ste potvrdili rezervaciju."
  );

export const useDenyBusinessUnitCountUpdate = () =>
  useHostReservationMutation<IReservation>(
    agent.Reservation.denyBusinessUnitCount,
    "Rezervacija je ispravno odbijena."
  );

export const useDenyExtendUpdateDateReservation = () =>
  useHostReservationMutation<IReservation>(
    agent.Reservation.denyPending,
    "Rezervacija je ispravno odbijena."
  );

export const useConfirmLongTermResidentialReservation = () =>
  useHostReservationMutation<ReservationWithContract>(
    agent.Reservation.confirmLongTermResidential,
    "Uspješno ste potvrdili izmjene."
  );

export const useDenyLongTermReservation = () =>
  useHostReservationMutation<ReservationWithContract>(
    agent.Reservation.denyByHost,
    "Uspješno ste poništili rezervaciju."
  );
