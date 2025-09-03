import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class AddEstateAverageRatingObject implements MigrationInterface {
  // Up metoda → dodaje polja
  async up(db: Db): Promise<void> {
    const result = await db.collection("baseestates").updateMany(
      { estateType: "ResidentialEstate" }, // filter po discriminator-u
      {
        $set: {
          averageRating: {
            overall: 0,
            cleanliness: 0,
            amenities: 0,
            host: 0,
            location: 0,
          },
        },
      }
    );

    console.log(`Updated ${result.modifiedCount} BaseEstate documents`);
  }

  // Down metoda → rollback
  async down(db: Db): Promise<void> {
    const result = await db.collection("baseestates").updateMany(
      { estateType: "ResidentialEstate" }, // filter po discriminator-u
      {
        $set: { averageRating: 0 }, // vraća reviews polje
      }
    );

    console.log(`Rolled back ${result.modifiedCount} BaseEstate documents`);
  }
}
