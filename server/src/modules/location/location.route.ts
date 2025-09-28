import { Router } from "express";
import {
  getPlaceDetails,
  searchAddresses,
  searchLocation,
} from "./location.controller";

const router = Router();

router.get("/search", searchLocation); // /api/location/search?input=...
router.get("/details", getPlaceDetails); // detalji (adresa + koordinate)
router.get("/search-addresses", searchAddresses);

export default router;
