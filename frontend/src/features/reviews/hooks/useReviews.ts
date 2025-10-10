import agent from "@/app/api/agent";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CreateReviewDto,
  IDetailedReview,
  IReview,
  ReviewEstate,
} from "../types";
import { useAppDispatch } from "@/app/store/hooks";
import { pushNotification } from "@/features/notifications/notificationSlice";
import { AxiosError } from "axios";

export function getReviewsListInfiniteScroll(estateId: string) {
  return useInfiniteQuery({
    queryKey: ["reviews", estateId],
    queryFn: async ({
      pageParam = 1,
    }): Promise<{
      data: ReviewEstate[];
      totalCount: number;
      currentPage: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    }> => {
      const res = await agent.Reviews.getReviewsByEstate(
        estateId,
        new URLSearchParams({ page: pageParam.toString(), limit: "5" })
      );
      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.hasPrevious ? firstPage.currentPage - 1 : undefined;
    },
  });
}

// 🔹 Query za detalje pojedinačne recenzije
export const useGetReviewDetails = (selectedReviewId: string | null) => {
  return useQuery({
    queryKey: ["review", selectedReviewId],
    queryFn: (): Promise<IDetailedReview> =>
      agent.Reviews.getReviewById(selectedReviewId!),
    enabled: !!selectedReviewId,
  });
};

export const useCreateReviewForReservation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      reservationId: string;
      body: CreateReviewDto;
    }): Promise<IReview> => {
      return agent.Reviews.createReview(
        variables.reservationId,
        variables.body
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["completed-reservations"] });
      queryClient.invalidateQueries({
        queryKey: ["review", data._id],
      });

      dispatch(
        pushNotification({
          type: "success",
          message: "Uspjesno ste ostavili recenziju za vasu rezervaciju",
        })
      );
    },
    onError: (err: AxiosError<{ message: string }>) => {
      dispatch(
        pushNotification({
          type: "error",
          message: err.response?.data.message || "Doslo je do greske",
        })
      );
    },
  });
};
