import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class AddEditCountToReviews implements MigrationInterface {
  // Up metoda → dodaje polja
  async up(db: Db): Promise<void> {
    const result = await db.collection("reviews").updateMany(
      {},
      {
        $set: {
          editCount: 0,
        },
      }
    );

    console.log(`Updated ${result.modifiedCount} Review documents`);
  }

  // Down metoda → rollback
  async down(db: Db): Promise<void> {
    const result = await db.collection("reviews").updateMany(
      {},
      {
        $unset: {
          editCount: "",
        },
      }
    );

    console.log(`Rolled back ${result.modifiedCount} Review documents`);
  }
}
