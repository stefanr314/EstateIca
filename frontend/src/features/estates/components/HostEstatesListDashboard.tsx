import { Box, Stack, Pagination } from "@mui/material";
import EstateItem from "./EstateItemDashboard";
import { usePersonalEstates } from "@/features/estates/hooks/useEstate";
import AppLoader from "@/shared/components/AppLoader";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const limit = 10;

interface HostEstatesListProps {
  navigateBasePath: string; // npr. "/dashboard/reservations/estates" ili "/dashboard/reviews/estates"
  overlayText?: string; // tekst za hover overlay
}

export default function HostEstatesList({
  navigateBasePath,
  overlayText = "Prikaži rezervaciju",
}: HostEstatesListProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const { data: response, isLoading } = usePersonalEstates(
    page,
    limit,
    searchParams,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <AppLoader loading />;

  const estates = response?.data || [];
  const totalCount = response?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <Box sx={{ px: 3, pb: 6, pt: 3 }}>
      <Stack spacing={2}>
        {estates.map((estate) => (
          <EstateItem
            key={estate._id}
            estate={estate}
            overlayText={overlayText}
            onClick={(estateId) => navigate(`${navigateBasePath}/${estateId}`)}
          />
        ))}
      </Stack>

      {totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
}
