import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { IBusinessEstate, IResidentialEstate } from "../types";
import EstatesMap from "./EstatesMap";
import ReviewSection from "@/features/reviews/components/ReviewSection";
import HostInfo from "@/features/user/components/HostInfo";
import {
  isResidentialEstate,
  isBusinessEstate,
} from "@/shared/helper/determineEstateType";
import { Item } from "./EstateDetailsMain";
interface EstateDetailsFooterProps {
  estate: IResidentialEstate | IBusinessEstate;
}

function EstateDetailsFooter({ estate }: EstateDetailsFooterProps) {
  const { host, address } = estate;

  return (
    <Stack spacing={2} justifyContent="center" alignItems="stretch">
      {isResidentialEstate(estate) && (
        <ReviewSection
          estateId={estate._id}
          averageRating={estate.averageRating}
          reviewsCount={estate.reviewsCount}
        />
      )}

      {/* <Grid
        container
        spacing={2}
        width="100%"
        sx={{ height: { xs: 300, sm: 420, md: 600 } }}
      >
        <EstatesMap
          coordinates={[
            address.location.coordinates[0],
            address.location.coordinates[1],
          ]}
        />
      </Grid> */}

      <HostInfo
        host={host}
        averageHostRating={
          isResidentialEstate(estate) ? estate.averageRating.host : 0
        }
      />
    </Stack>
  );
}

export default EstateDetailsFooter;
