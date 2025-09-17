import agent from "@/app/api/agent";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ReviewEstate } from "../types";

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
//   return useQuery({
//     queryKey: ["review", selectedReviewId],
//     queryFn: () => Reviews.getReviewById(selectedReviewId!),
//     enabled: !!selectedReviewId,
//   });
