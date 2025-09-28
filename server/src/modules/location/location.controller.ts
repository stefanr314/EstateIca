import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { BadRequestError, CustomError } from "../../shared/errors";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_API_URL =
  "https://maps.googleapis.com/maps/api/place/autocomplete/json";
const GOOGLE_PLACE_DETAILS_URL =
  "https://maps.googleapis.com/maps/api/place/details/json";

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
        types: "(cities)", // ograničavamo na gradove search tab
        language: "sr-Latn",
      },
    });

    logging.info(response.data);

    const { status, error_message, predictions } = response.data;

    switch (status) {
      case "OK": {
        res.status(200).json(
          predictions.map((p: any) => ({
            description: p.description,
            place_id: p.place_id,
          }))
        );
        return;
      }

      case "ZERO_RESULTS": {
        // Nema rezultata, nije greška — samo vraćamo praznu listu
        res.status(200).json([]);
        return;
      }

      case "OVER_QUERY_LIMIT": {
        throw new CustomError(
          "Premašen broj dnevnih zahtjeva prema Google API-ju",
          429
        );
      }

      case "REQUEST_DENIED": {
        throw new CustomError(error_message || "Google API odbio zahtjev", 403);
      }

      case "INVALID_REQUEST": {
        throw new CustomError(
          error_message || "Nevažeći zahtjev prema Google API-ju",
          400
        );
      }

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

/**
 * Pretraga adresa (ulice, brojevi, naselja itd.)
 * GET /location/search-addresses?input=...
 */
export const searchAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const input = req.query.input as string;

  if (!input) {
    throw new BadRequestError("Missing input parameter");
  }

  try {
    const response = await axios.get(GOOGLE_PLACES_API_URL, {
      params: {
        input,
        key: GOOGLE_PLACES_API_KEY,
        types: "geocode", // ✨ samo adrese
        language: "sr-Latn",
      },
    });

    const { status, error_message, predictions } = response.data;

    switch (status) {
      case "OK": {
        res.status(200).json(
          predictions.map((p: any) => ({
            description: p.description, // npr. "Zmaja od Bosne 8, Sarajevo"
            place_id: p.place_id, // placeId za dohvatanje detalja
          }))
        );
        return;
      }

      case "ZERO_RESULTS": {
        res.status(200).json([]);
        return;
      }

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

/**
 * Dohvati detalje o lokaciji (adresa, koordinate) preko place_id
 */
export const getPlaceDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const placeId = req.query.placeId as string;

  if (!placeId) {
    throw new BadRequestError("PlaceId je obavezan");
  }

  try {
    const response = await axios.get(GOOGLE_PLACE_DETAILS_URL, {
      params: {
        place_id: placeId,
        key: GOOGLE_PLACES_API_KEY,
        language: "sr-Latn",
        fields: "formatted_address,address_component,geometry",
      },
    });

    const { status, error_message, result } = response.data;

    switch (status) {
      case "OK": {
        const street = result.address_components.find((c: any) =>
          c.types.includes("route")
        )?.long_name;
        const streetNumber = result.address_components.find((c: any) =>
          c.types.includes("street_number")
        )?.long_name;

        const address = {
          // description: result.formatted_address,
          placeId: placeId,
          country: result.address_components.find((c: any) =>
            c.types.includes("country")
          )?.long_name,
          countryCode: result.address_components.find((c: any) =>
            c.types.includes("country")
          )?.short_name,
          city: result.address_components.find((c: any) =>
            c.types.includes("locality")
          )?.long_name,
          postalCode: result.address_components.find((c: any) =>
            c.types.includes("postal_code")
          )?.long_name,
          street: [street, streetNumber].filter(Boolean).join(" "),
          suburb: result.address_components.find((c: any) =>
            c.types.includes("sublocality")
          )?.long_name,
          location: {
            type: "Point",
            coordinates: [
              result.geometry.location.lng,
              result.geometry.location.lat,
            ],
          },
        };

        res.status(200).json(address);
        return;
      }

      case "ZERO_RESULTS":
        res.status(200).json(null);
        return;

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
