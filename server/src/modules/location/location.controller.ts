import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { BadRequestError, CustomError } from "../../shared/errors";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_API_URL =
  "https://maps.googleapis.com/maps/api/place/autocomplete/json";

export const searchLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const input = req.query.input as string;
  logging.info(input);
  if (!input) {
    throw new BadRequestError("Missing input parameter");
  }

  try {
    const response = await axios.get(GOOGLE_PLACES_API_URL, {
      params: {
        input,
        key: GOOGLE_PLACES_API_KEY,
        types: "(cities)", // ili "geocode" ako hoćeš i adrese
        language: "sr-Latn",
      },
    });

    logging.info(response.data);

    const { status, error_message, predictions } = response.data;

    switch (status) {
      case "OK":
        res.status(200).json(
          predictions.map((p: any) => ({
            description: p.description,
            place_id: p.place_id,
          }))
        );

      case "ZERO_RESULTS":
        // Nema rezultata, nije greška — samo vraćamo praznu listu
        res.status(200).json([]);

      case "OVER_QUERY_LIMIT":
        throw new CustomError(
          "Premašen broj dnevnih zahtjeva prema Google API-ju",
          429
        );

      case "REQUEST_DENIED":
        throw new CustomError(error_message || "Google API odbio zahtjev", 403);

      case "INVALID_REQUEST":
        throw new CustomError(
          error_message || "Nevažeći zahtjev prema Google API-ju",
          400
        );

      case "UNKNOWN_ERROR":
        throw new CustomError("Nepoznata greška sa Google API-ja", 502);

      default:
        throw new CustomError(
          error_message || "Neočekivana greška sa Google API-ja",
          500
        );
    }
  } catch (error) {
    next(error);
  }
};
