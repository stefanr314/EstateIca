import agent from "@/app/api/agent";
import { useAppDispatch } from "@/app/store/hooks";
import { pushNotification } from "@/features/notifications/notificationSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
