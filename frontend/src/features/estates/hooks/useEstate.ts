import {
  useQuery,
  keepPreviousData,
  UseQueryResult,
  useQueryClient,
  useMutation,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import agent from "../../../app/api/agent";
import { PaginatedResponse } from "@/app/types/api";
import {
  AllBusinessData,
  AllPersonalEstatesData,
  AllResidentialData,
  IBusinessEstate,
  IResidentialEstate,
} from "../types";
import { useAppDispatch } from "@/app/store/hooks";
import { pushNotification } from "@/features/notifications/notificationSlice";
import { AxiosError } from "axios";
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
    queryKey: ["estates", type, queryObj, page, limit],
    queryFn: async () => fetchEstates(type, page, limit, searchParams),
    placeholderData: keepPreviousData, // da se ne prazni tabela dok prebacuje page
  });
}

export function useEstate(
  estateId: string,
  options?: Omit<
    UseQueryOptions<
      IResidentialEstate | IBusinessEstate,
      Error,
      IResidentialEstate | IBusinessEstate,
      [string, string]
    >,
    "queryKey" | "queryFn"
  >
): UseQueryResult<IResidentialEstate | IBusinessEstate> {
  return useQuery({
    queryKey: ["estate", estateId],
    queryFn: async () => {
      const response = await agent.Estates.getEstateById(estateId);
      return response.estate;
    },
    enabled: !!estateId,
    ...options,
  });
}

export function useEstateUnavailableDates(
  estateId: string,
  options?: Omit<
    UseQueryOptions<
      {
        type: "RESERVATION" | "LOCK";
        startDate: Date;
        endDate: Date;
      }[],
      Error,
      {
        type: "RESERVATION" | "LOCK";
        startDate: Date;
        endDate: Date;
      }[],
      [string, string, ...(string | undefined)[]]
    >,
    "queryKey" | "queryFn"
  >,
  params?: { reservationId?: string }
): UseQueryResult<
  {
    type: "RESERVATION" | "LOCK";
    startDate: Date;
    endDate: Date;
  }[]
> {
  return useQuery({
    queryKey: ["estateBlockedDates", estateId, params?.reservationId],
    queryFn: async () => {
      const dates = await agent.Reservation.unavailableDates(estateId, params);
      return dates;
    },
    ...options,
  });
}

export function usePersonalEstates(
  page: number,
  limit: number = 10,
  remainingSearchParams: URLSearchParams,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<AllPersonalEstatesData>,
      AxiosError,
      PaginatedResponse<AllPersonalEstatesData>,
      [string, string, Record<string, string>]
    >,
    "queryKey" | "queryFn"
  >
) {
  const searchParams = new URLSearchParams(remainingSearchParams);
  searchParams.set("page", page.toString());
  searchParams.set("limit", limit.toString());

  const queryObject = Object.fromEntries(searchParams);
  return useQuery({
    queryKey: ["me", "personal-estates", queryObject],
    queryFn: async (): Promise<PaginatedResponse<AllPersonalEstatesData>> => {
      return agent.Estates.getAllPersonalEstates(searchParams);
    },
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useCreateEstate() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({
      type,
      data,
      images,
    }: {
      type: "ResidentialEstate" | "BusinessEstate";
      data: any;
      images?: File[];
    }) => {
      if (type === "BusinessEstate") {
        const response = await agent.Estates.createBusinessEstate(data, images);
        return response;
      }
      const response = await agent.Estates.createResidentialEstate(
        data,
        images
      );
      return response;
    },
    onSuccess: () => {
      // const newEstate = data.estate;

      //treba maper ako zelim ovo
      // queryClient.setQueryData(["me", "personal-estates"], (oldData: any) => {
      //   if (!oldData) return oldData;
      //   return {
      //     ...oldData,
      //     data: [newEstate, ...oldData.data],
      //     totalCount: oldData.totalCount + 1,
      //   };
      // });

      // //treba mapper i ovdje jer estates ne cuva podatke oblika newEstate
      // queryClient.setQueryData(["estates"], (oldData: any) => {
      //   if (!oldData) return oldData;
      //   return {
      //     ...oldData,
      //     data: [newEstate, ...oldData.data],
      //     totalCount: oldData.totalCount + 1,
      //   };
      // });

      dispatch(
        pushNotification({
          type: "success",
          message: "Nekretnina je uspješno kreirana.",
        })
      );
    },
    onError: (error: any) => {
      dispatch(
        pushNotification({
          type: "error",
          message: error?.response?.data?.message || "Došlo je do greške.",
        })
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "personal-estates"] });
      //nece postojati u listi svih nekretnina odmah na pocetku, jer nije invalidiran kes za tu listu
    },
  });
}

export function useUpdateEstate(estateId: string) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const response = await agent.Estates.updateEstate(estateId, data);
      return response;
    },
    onSuccess: () => {
      dispatch(
        pushNotification({
          type: "success",
          message: "Nekretnina je uspješno ažurirana.",
        })
      );
    },
    onError: (error: any) => {
      dispatch(
        pushNotification({
          type: "error",
          message: error.response?.data?.message || "Došlo je do greške.",
        })
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "personal-estates"] });
      queryClient.invalidateQueries({ queryKey: ["estate", estateId] });
      queryClient.invalidateQueries({
        queryKey: ["estateBlockedDates", estateId],
      });
      // queryClient.invalidateQueries({ queryKey: ["estates"] });
      // Estates feed se neće ažurirati ručno
      // Ako korisnik otvori pojedinačnu nekretninu → dobija svježe podatke preko ["estate", estateId]
    },
  });
}

export function useAddImagesToEstate(estateId: string) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (files: File[]) => {
      // const formData = new FormData();
      // files.forEach((file) => {
      //   formData.append("images", file);
      // });
      const response = await agent.EstatesImages.addImages(estateId, files);
      return response;
    },
    onSuccess: () => {
      dispatch(
        pushNotification({
          type: "success",
          message: "Slike su uspješno dodane.",
        })
      );
    },
    onError: (error: any) => {
      dispatch(
        pushNotification({
          type: "error",
          message: error?.response?.data?.message || "Došlo je do greške.",
        })
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "personal-estates"] });
      queryClient.invalidateQueries({ queryKey: ["estate", estateId] });
      // queryClient.invalidateQueries({
      //   queryKey: ["estateBlockedDates", estateId],
      // });
    },
  });
}

export function useRemoveImageFromEstate(estateId: string) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (fileId: string) => {
      return await agent.EstatesImages.deleteImage(estateId, fileId);
    },
    onMutate: async (fileId: string) => {
      await queryClient.cancelQueries({ queryKey: ["estate", estateId] });

      const previousEstate = queryClient.getQueryData(["estate", estateId]);

      queryClient.setQueryData(["estate", estateId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          images: oldData.images.filter(
            (image: any) => image.fileId !== fileId
          ),
        };
      });
      return { previousEstate };
    },
    onSuccess: () => {
      dispatch(
        pushNotification({
          type: "success",
          message: "Slika je uspješno obrisana.",
        })
      );
    },
    onError: (error: any, _, onMutateResults) => {
      if (onMutateResults?.previousEstate) {
        queryClient.setQueryData(
          ["estate", estateId],
          onMutateResults.previousEstate
        );
      }
      dispatch(
        pushNotification({
          type: "error",
          message: error?.response?.data?.message || "Došlo je do greške.",
        })
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "personal-estates"] });
      queryClient.invalidateQueries({ queryKey: ["estate", estateId] });
      // queryClient.invalidateQueries({
      //   queryKey: ["estateBlockedDates", estateId],
      // });
    },
  });
}

export function useToggleEstateVisibility(estateId: string) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
      const response = await agent.Estates.toggleEstateVisibility(estateId);
      return response;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["me", "personal-estates"] });
      await queryClient.cancelQueries({ queryKey: ["estate", estateId] });

      const previousEstates = queryClient.getQueryData([
        "me",
        "personal-estates",
      ]);
      const prevEstate = queryClient.getQueryData(["estate", estateId]);

      //rucno azuriranje cache-a kako bi se izbjeglo treptanje i skupo refetch-anje
      queryClient.setQueryData(["me", "personal-estates"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((estate: any) =>
            estate.id === estateId
              ? { ...estate, hidden: !estate.hidden }
              : estate
          ),
        };
      });
      queryClient.setQueryData(["estate", estateId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          hidden: !oldData.hidden,
        };
      });
      return { previousEstates, prevEstate };
    },
    onSuccess: () => {
      // const updatedEstate = data.estate;

      // //ne moze bez mappera
      // queryClient.setQueryData(["estates"], (oldData: any) => {
      //   if (!oldData) return oldData;
      //   return {
      //     ...oldData,
      //     data: oldData.data.map((estate: any) =>
      //       estate.id === estateId ? updatedEstate : estate
      //     ),
      //   };
      // });
      dispatch(
        pushNotification({
          type: "success",
          message: "Vidljivost nekretnine je uspješno promijenjena.",
        })
      );
    },
    onError: (error: any, _, onMutateResults) => {
      if (onMutateResults?.previousEstates) {
        queryClient.setQueryData(
          ["me", "personal-estates"],
          onMutateResults.previousEstates
        );
      }
      if (onMutateResults?.prevEstate) {
        queryClient.setQueryData(
          ["estate", estateId],
          onMutateResults.prevEstate
        );
      }
      dispatch(
        pushNotification({
          type: "error",
          message: error?.response?.data?.message || "Došlo je do greške.",
        })
      );
      console.log("error:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "personal-estates"] });
      queryClient.invalidateQueries({ queryKey: ["estate", estateId] });
      queryClient.invalidateQueries({
        queryKey: ["estateBlockedDates", estateId],
      });
      queryClient.invalidateQueries({ queryKey: ["estates"] }); //u realnom scenariju ovo se ne bi radilo na ovaj nacin jer moze biti puno podataka odnosno preskup poziv
    },
  });
}

export function useDeleteEstate(estateId: string) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (password: string) => {
      const response = await agent.Estates.hardDeleteEstate(estateId, {
        userPassword: password,
      });
      return response;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["me", "personal-estates"] });
      await queryClient.cancelQueries({ queryKey: ["estates"] });

      const previousEstates = queryClient.getQueryData([
        "me",
        "personal-estates",
      ]);
      const prevGlobal = queryClient.getQueryData(["estates"]);

      //rucno azuriranje cache-a kako bi se izbjeglo treptanje i skupo refetch-anje
      queryClient.setQueryData(["me", "personal-estates"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((estate: any) => estate.id !== estateId),
          totalCount: oldData.totalCount - 1,
        };
      });
      queryClient.setQueryData(["estates"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((estate: any) => estate.id !== estateId),
          totalCount: oldData.totalCount - 1,
        };
      });

      //vracanje povratnih vrijednosti u slucaju greske
      return { previousEstates, prevGlobal };
    },
    onSuccess: () => {
      dispatch(
        pushNotification({
          type: "success",
          message: "Nekretnina je uspješno obrisana.",
        })
      );
    },
    onError: (error: any, _, onMutateResults) => {
      if (onMutateResults?.previousEstates) {
        queryClient.setQueryData(
          ["me", "personal-estates"],
          onMutateResults.previousEstates
        );
      }
      if (onMutateResults?.prevGlobal) {
        queryClient.setQueryData(["estates"], onMutateResults.prevGlobal);
      }
      dispatch(
        pushNotification({
          type: "error",
          message: error?.response?.data?.message || "Došlo je do greške.",
        })
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "personal-estates"] });
      // queryClient.invalidateQueries({ queryKey: ["estates"] });

      // queryClient.invalidateQueries({ queryKey: ["estate", estateId] });
      // queryClient.invalidateQueries({
      //   queryKey: ["estateBlockedDates", estateId],
      // });

      //brisemo cache da ne zauzima memoriju jer vise nema smisla
      queryClient.removeQueries({
        queryKey: ["estate", estateId],
        exact: true,
      });
      queryClient.removeQueries({
        queryKey: ["estateBlockedDates", estateId],
        exact: true,
      });
    },
  });
}
