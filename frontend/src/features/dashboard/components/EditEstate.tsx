import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  useEstate,
  useEstateUnavailableDates,
  useUpdateEstate,
} from "@/features/estates/hooks/useEstate";

import EditResidentialEstateInfo, {
  ResidentialFormValues,
} from "./EditResidentialEstateInfo";
import EditBusinessEstateInfo, {
  BusinessFormValues,
} from "./EditBusinessEstateInfo";
import { IResidentialEstate, IBusinessEstate } from "@/features/estates/types";
import AppLoader from "@/shared/components/AppLoader";
import EstateImagesGrid from "./EstateImagesGrid";
import EstateSettingsTab from "./EstatesSettingsTab";
import { ArrowBack } from "@mui/icons-material";

export default function EditEstatePage() {
  const navigate = useNavigate();
  const { estateId } = useParams();

  const { data: estate, isPending } = useEstate(estateId!, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const { data: blockedDates, isPending: isBlockedDatesPending } =
    useEstateUnavailableDates(estateId!, {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });
  const { mutate: updateEstate, isPending: isUpdatingEstate } = useUpdateEstate(
    estateId!
  );

  const [tab, setTab] = useState(0);

  // RHF za oba tipa – drži odvojeno za jasnoću (može se i unificirati)
  const residentialForm = useForm<ResidentialFormValues>();
  const businessForm = useForm<BusinessFormValues>();

  // kad stigne estate → reset default values
  useEffect(() => {
    if (!estate) return;
    if (estate.estateType === "ResidentialEstate") {
      const e = estate as IResidentialEstate;
      residentialForm.reset({
        title: e.title,
        description: e.description,
        neighborhoodOverview: e.neighborhoodOverview ?? undefined,
        notes: e.notes ?? undefined,
        houseRules: e.houseRules ?? undefined,
        transit: e.transit ?? undefined,
        access: e.access ?? undefined,
        cancellationPolicy: e.cancellationPolicy ?? undefined,
        securityDeposit: e.securityDeposit ?? undefined,
        bedrooms: e.bedrooms ?? undefined,
        bathrooms: e.bathrooms ?? undefined,
        beds: e.beds,
        minimumStay: e.minimumStay,
        maximumStay: e.maximumStay ?? undefined,
        pricePerNight:
          e.rentalType === "Short Term"
            ? e.pricePerNight ?? undefined
            : undefined,
        pricePerMonth:
          e.rentalType === "Long Term"
            ? e.pricePerMonth ?? undefined
            : undefined,
        area: e.area ?? undefined,
        residentialType: e.residentialType as any,
        roomType: e.roomType as any,
        guestIncluded: e.guestIncluded,
        extraPeople: e.extraPeople ?? undefined,
        petAllowance: e.petAllowance ?? false,
        unitsAvailable: e.unitsAvailable ?? undefined,
        amenities: e.amenities ?? [],
      });
    } else {
      const e = estate as IBusinessEstate;
      businessForm.reset({
        title: e.title,
        description: e.description,
        pricePerMonth: e.pricePerMonth,
        area: e.area,
        unitsAvailable: e.unitsAvailable ?? undefined,
        intentedUse: e.intentedUse ?? undefined,
        floor: e.floor ?? undefined,
        hasElevator: e.hasElevator ?? undefined,
        isGroundFloor: e.isGroundFloor ?? undefined,
        ceilingHeight: e.ceilingHeight ?? undefined,
        hasParking: e.hasParking ?? undefined,
        parkingSpaces: e.parkingSpaces ?? undefined,
        hasRestroom: e.hasRestroom ?? undefined,
        minimumLeaseMonths: e.minimumLeaseMonths ?? undefined,
        maximumLeaseMonths: e.maximumLeaseMonths ?? undefined,
        airConditioning: e.airConditioning ?? undefined,
        internetReady: e.internetReady ?? undefined,

        amenities: e.amenities ?? [], // Optional field for business amenities
      });
    }
  }, [estate, residentialForm, businessForm]);

  const handleSave = async () => {
    if (!estate) return;

    const values =
      estate.estateType === "ResidentialEstate"
        ? residentialForm.getValues()
        : businessForm.getValues();

    console.log(values);

    // // očisti prazne stringove
    // Object.keys(values).forEach((key) => {
    //   if ((values as any)[key] === "") {
    //     (values as any)[key] = undefined;
    //   }
    // });
    // console.log(values);
    updateEstate(values);
  };
  if (!estateId) return <div>Nothing to show, go back please.</div>;

  if (isPending) return <AppLoader loading={isPending} />;
  if (!estate)
    return <Typography>Nije pronadjen smjestaj. Vratite se nazad.</Typography>;

  return (
    <Box sx={{ p: 2, mx: "auto", mt: 0, width: "100%" }}>
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ alignSelf: "flex-start" }}
        >
          Nazad
        </Button>
        <Typography variant="h5">Uredi nekretninu</Typography>
      </Stack>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Detalji" />
        <Tab label="Slike" />
        <Tab label="Podešavanja" />
      </Tabs>

      {tab === 0 && (
        <Card>
          <CardContent sx={{ maxHeight: "80vh", overflowY: "auto" }}>
            {estate.estateType === "ResidentialEstate" ? (
              <EditResidentialEstateInfo
                estate={estate as IResidentialEstate}
                register={residentialForm.register}
                control={residentialForm.control}
                errors={residentialForm.formState.errors}
              />
            ) : (
              <EditBusinessEstateInfo
                estate={estate as IBusinessEstate}
                register={businessForm.register}
                control={businessForm.control}
                errors={businessForm.formState.errors}
              />
            )}
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Card>
          <CardContent>
            <EstateImagesGrid estateId={estate._id} images={estate.images} />
          </CardContent>
        </Card>
      )}

      {tab === 2 && (
        <EstateSettingsTab
          estateId={estate._id}
          hidden={estate.hidden}
          rentalType={estate.rentalType}
          blockedDates={blockedDates}
        />
      )}

      {tab === 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={
              (estate.estateType === "ResidentialEstate"
                ? !residentialForm.formState.isDirty &&
                  !residentialForm.formState.isValid
                : !businessForm.formState.isDirty &&
                  !businessForm.formState.isValid) || isUpdatingEstate
            }
          >
            Sačuvaj promjene
          </Button>
        </Box>
      )}
    </Box>
  );
}
