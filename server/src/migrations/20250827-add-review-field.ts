import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class AddEstateRating implements MigrationInterface {
  // Up metoda → dodaje polja
  async up(db: Db): Promise<void> {
    const result = await db.collection("baseestates").updateMany(
      { estateType: "ResidentialEstate" }, // filter po discriminator-u
      {
        $unset: { reviews: "" }, // uklanja polje reviews
        $set: {
          averageRating: 0,
          reviewsCount: 0,
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
        $unset: {
          averageRating: "",
          reviewsCount: "",
        },
        $set: { reviews: [] }, // vraća reviews polje
      }
    );

    console.log(`Rolled back ${result.modifiedCount} BaseEstate documents`);
  }
}
