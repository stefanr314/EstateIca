import { IResidentialEstate, IBusinessEstate } from "@/features/estates/types";
export function isResidentialEstate(
  estate: IResidentialEstate | IBusinessEstate
): estate is IResidentialEstate {
  return estate.estateType === "ResidentialEstate";
}

export function isBusinessEstate(
  estate: IResidentialEstate | IBusinessEstate
): estate is IBusinessEstate {
  return estate.estateType === "BusinessEstate";
}
