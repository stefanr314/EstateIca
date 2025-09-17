import Grid from "@mui/material/Grid";
import { useParams, useSearchParams } from "react-router-dom";
import EstateDetailsHeader from "./components/EstateDetailsHeader";
import EstateDetailsMain from "./components/EstateDetailsMain";
import EstateDetailsFooter from "./components/EstateDetailsFooter";
import { IResidentialEstate } from "./types";
import { useEstate, useEstateUnavailableDates } from "./hooks/useEstate";
import AppLoader from "@/shared/components/AppLoader";
import AppError from "@/shared/components/errors/AppError";
import QueryErrorHandler from "@/shared/components/QueryErrorHandler";

function EstateDetails() {
  const { id } = useParams<{ id: string }>();

  const {
    data: estate,
    isPending,
    isError,
    error,
    isFetching,
  } = useEstate(id!);

  const {
    data: unavailableDates,
    isPending: isUnavailableDatesPending,
    isError: isDatesError,
  } = useEstateUnavailableDates(id!);

  const [searchParams] = useSearchParams();

  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const adultsParam = searchParams.get("adults");
  const childrenParam = searchParams.get("children");

  const startDateDefault = startDateParam ? new Date(startDateParam) : null;
  const endDateDefault = endDateParam ? new Date(endDateParam) : null;
  const adultsCount = adultsParam ? Number(adultsParam) : null;
  const childrenCount = adultsParam ? Number(childrenParam) : null;

  if (isPending || isUnavailableDatesPending)
    return (
      <AppLoader
        loading={isPending || isUnavailableDatesPending}
        text="Podaci se učitavaju..."
      />
    );
  if (isDatesError) return <QueryErrorHandler error={error} />;
  if (isError) {
    return <QueryErrorHandler error={error} />;
  }
  return (
    <Grid container spacing={2} width="100%">
      <Grid display={"inline-block"} width={"100%"}>
        <EstateDetailsHeader title={estate.title} images={estate.images} />
      </Grid>
      <Grid display={"inline-block"} width={"100%"}>
        <EstateDetailsMain
          estate={estate}
          unavailableReservationDates={unavailableDates}
          startDateDefault={startDateDefault}
          endDateDefault={endDateDefault}
          guestCountDefault={adultsCount}
          childrenCountDefault={childrenCount}
        />
      </Grid>
      <Grid display={"inline-block"} width={"100%"}>
        <EstateDetailsFooter estate={estate} />
      </Grid>
    </Grid>
  );
}

export default EstateDetails;
