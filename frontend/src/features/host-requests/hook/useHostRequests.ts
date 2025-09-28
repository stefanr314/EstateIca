import agent from "@/app/api/agent";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { HostRequest, HostRequestRow, PaginatedHRResponse } from "../types";
import { useAppDispatch } from "@/app/store/hooks";
import { pushNotification } from "@/features/notifications/notificationSlice";

export const useGetAllHostRequests = (
  page: number,
  limit: number,
  partialSearchParams: URLSearchParams
) => {
  const searchParams = new URLSearchParams(partialSearchParams);
  searchParams.set("page", page.toString());
  searchParams.set("limit", limit.toString());

  const queryObj = Object.fromEntries(searchParams);

  return useQuery({
    queryKey: ["host-requests", queryObj],
    queryFn: async (): Promise<PaginatedHRResponse<HostRequestRow>> => {
      return agent.HostRequest.getAllHostRequests(searchParams);
    },
    placeholderData: keepPreviousData,
  });
};

export const useGetHostRequestDetails = (requestId: string) => {
  return useQuery({
    queryKey: ["host-request details", requestId],
    queryFn: async (): Promise<HostRequest> => {
      const res = await agent.HostRequest.getHostRequestById(requestId);
      return res.hostRequest;
    },
    enabled: !!requestId,
  });
};

export const useGetMyHostRequest = () => {
  return useQuery({
    queryKey: ["my-host-request"],
    queryFn: async (): Promise<HostRequest> => {
      const res = await agent.HostRequest.getMeHostRequests();
      return res.hostRequest;
    },
  });
};

export const useUpdateHostRequestStatus = (requestId: string) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: async (body: {
      status: "rejected" | "approved";
      adminComment?: string;
    }) => {
      const res = await agent.HostRequest.updateHostRequestStatus(
        requestId,
        body
      );
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host-requests"] });

      //invalidiranje detalja ako se ponovno klikne na njij bice povuceni ispravni podaci
      queryClient.invalidateQueries({
        queryKey: ["host-request details", requestId],
      });

      dispatch(
        pushNotification({
          type: "success",
          message: "Status zahteva je uspešno ažuriran.",
        })
      );
    },
    onError: () => {
      dispatch(
        pushNotification({
          type: "error",
          message: "Došlo je do greške prilikom ažuriranja statusa zahteva.",
        })
      );
    },
  });
};

export const useCreateHostRequest = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (
      body: any
    ): Promise<{ message: string; id: string; status: string }> => {
      const res = await agent.HostRequest.createHostRequest(body);
      return res;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["host-requests"] });
      dispatch(
        pushNotification({
          type: "success",
          message: response.message || "Zahtjev uspješno poslat!",
        })
      );
    },
    onError: (err: any) => {
      dispatch(
        pushNotification({
          type: "error",
          message:
            err.response?.data?.message ||
            "Došlo je do greške prilikom slanja zahtjeva.",
        })
      );
    },
  });
};
