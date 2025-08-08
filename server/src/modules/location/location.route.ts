import { Router } from "express";
import { searchLocation } from "./location.controller";

const router = Router();

router.get("/search", searchLocation); // /api/location/search?input=...

export default router;
