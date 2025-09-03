import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class AddEditDeadlineToReviews implements MigrationInterface {
  // Up metoda → dodaje polja
  async up(db: Db): Promise<void> {
    const result = await db.collection("reviews").updateMany(
      {},
      {
        $set: {
          editDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 sata
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
          editDeadline: "",
        },
      }
    );

    console.log(`Rolled back ${result.modifiedCount} Review documents`);
  }
}
