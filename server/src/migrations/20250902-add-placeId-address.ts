import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";
import axios from "axios";

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export class AddPlaceIdToEstateAddress implements MigrationInterface {
  async up(db: Db): Promise<void> {
    const estates = await db
      .collection("baseestates")
      .find({ "address.placeId": { $exists: false } })
      .toArray();

    for (const estate of estates) {
      const [lng, lat] = estate.address.location.coordinates;

      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
          {
            params: {
              key: GOOGLE_API_KEY,
              location: `${lat},${lng}`,
              radius: 500, // radius u metrima da traži najbliži place
            },
          }
        );

        const place = response.data.results?.[0];
        if (place && place.place_id) {
          await db
            .collection("baseestates")
            .updateOne(
              { _id: estate._id },
              { $set: { "address.placeId": place.place_id } }
            );
          console.log(
            `✅ Estate ${estate._id} updated with placeId ${place.place_id}`
          );
        } else {
          await db
            .collection("baseestates")
            .updateOne(
              { _id: estate._id },
              { $set: { "address.placeId": null } }
            );
          console.warn(
            `⚠️ No placeId found for estate ${estate._id}, set to null`
          );
        }
      } catch (err) {
        console.error(`Failed to fetch placeId for estate ${estate._id}`, err);
      }
    }
  }

  async down(db: Db): Promise<void> {
    const result = await db
      .collection("baseestates")
      .updateMany(
        { "address.placeId": { $exists: true } },
        { $unset: { "address.placeId": "" } }
      );

    console.log(
      `Down migration: Removed placeId from ${result.modifiedCount} BaseEstate documents`
    );
  }
}
