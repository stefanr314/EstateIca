import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class AddLastRelatedContractIdToReservations
  implements MigrationInterface
{
  async up(db: Db): Promise<void> {
    const reservationCollection = db.collection("reservations");
    const contractCollection = db.collection("contracts");

    const reservations = await reservationCollection.find({}).toArray();

    for (const r of reservations) {
      const lastContract = await contractCollection
        .find({ reservationId: r._id })
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray();

      const lastRelatedContractId = lastContract[0]?._id || null;

      await reservationCollection.updateOne(
        { _id: r._id },
        { $set: { lastRelatedContractId } }
      );
    }

    console.log("✅ lastRelatedContractId added to reservations.");
  }

  async down(db: Db): Promise<void> {
    await db
      .collection("reservations")
      .updateMany({}, { $unset: { lastRelatedContractId: "" } });

    console.log("❌ lastRelatedContractId removed from reservations.");
  }
}
