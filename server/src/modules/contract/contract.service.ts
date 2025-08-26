// services/contract.service.ts
import { Contract, ContractStatus } from "./contract.model";
import { businessContractTemplate } from "../../shared/templates/contracts/businessContractTemplate";
import { generateContractPDF } from "./contractPdf.service";
import mongoose from "mongoose";
import {
  Reservation,
  ReservationDocument,
} from "../reservation/reservation.model";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/errors";
import { BaseEstateDocument } from "../estate/estate.model";
import path from "path";
import fs from "fs";
import { RentalType } from "../../shared/types/rentalType.enum";
import { terminationNoticeTemplate } from "../../shared/templates/contracts/terminationNoticeTemplate";
import { residentialLongTermContractTemplateWithGuests } from "../../shared/templates/contracts/residentialLongTermContractTemplate";
import { hostname } from "os";

const CONTRACTS_DIR = path.resolve("uploads/");

export async function createContractFromReservation(
  reservation: ReservationDocument,
  type: "Business" | "Long-Term Residential"
) {
  if (reservation.rentalType === RentalType.SHORT_TERM)
    throw new BadRequestError(
      "Kratkotrajne rezervacije smjestaja nemaju ugovore o izdavanju."
    );
  let html: any;
  if (type === "Business") {
    html = businessContractTemplate({
      hostName: reservation.hostName,
      tenantName: reservation.guestName,
      estateName: reservation.estateReserved.toString(),
      checkIn: reservation.startDate.toLocaleDateString(),
      checkOut: reservation.endDate.toLocaleDateString(),
      pricePerMonth: reservation.pricePerMonth.toString(),
    });
  }
  if (type == "Long-Term Residential") {
    html = residentialLongTermContractTemplateWithGuests({
      hostName: reservation.hostName,
      tenantName: reservation.guestName,
      estateName: reservation.estateReserved.toString(),
      checkIn: reservation.startDate.toLocaleDateString(),
      checkOut: reservation.endDate.toLocaleDateString(),
      pricePerMonth: reservation.pricePerMonth.toString(),
      guestCount: reservation.guestCount,
      childrenCount: reservation.childrenCount,
      note: reservation.note,
    });
  }

  const pdfUrl = await generateContractPDF(
    html,
    `contract-${reservation._id}.pdf`
  );

  const contract = await Contract.create({
    reservationId: new mongoose.Types.ObjectId(reservation._id),
    contractFileUrl: pdfUrl,
    validFrom: reservation.startDate,
    validTo: reservation.endDate,
    signedByHost: false,
    signedByTenant: false,
    status: ContractStatus.DRAFT,
  });

  return contract;
}

export async function createCancellationContractFromReservation(
  reservation: ReservationDocument,
  terminationDate: Date,
  reason: string
) {
  if (reservation.rentalType === RentalType.SHORT_TERM)
    throw new BadRequestError(
      "Kratkotrajne rezervacije smjestaja nemaju ugovore o izdavanju."
    );

  const html = terminationNoticeTemplate({
    hostName: reservation.hostName,
    tenantName: reservation.guestName,
    estateName: reservation.estateReserved.toString(),
    terminationDate: terminationDate.toLocaleDateString(),
    reason,
  });

  const pdfUrl = await generateContractPDF(
    html,
    `contract-${reservation._id}.pdf`
  );

  const contract = await Contract.create({
    reservationId: new mongoose.Types.ObjectId(reservation._id),
    contractFileUrl: pdfUrl,
    validFrom: reservation.startDate,
    validTo: reservation.endDate,
    signedByHost: true,
    signedByTenant: true,
    status: ContractStatus.CANCELLED,
  });

  return contract;
}

export async function getContractForUser(contractId: string, userId: string) {
  const contract = await Contract.findById(contractId);
  if (!contract)
    throw new NotFoundError("Ugovor sa trazenim ID-om ne postoji.");

  const reservation = await Reservation.findById(
    contract.reservationId
  ).populate<{ estateReserved: BaseEstateDocument }>("estateReserved");

  if (!reservation) {
    throw new NotFoundError("Povezana rezervacija nije pronađena");
  }

  const isGuest = reservation.userOfReservation?.toString() === userId;
  const isHost = reservation.estateReserved?.host?.toString() === userId;

  if (!isGuest && !isHost) {
    throw new ForbiddenError("Nemate pravo pristupa ovom ugovoru");
  }

  const filePath = path.join(CONTRACTS_DIR, contract.contractFileUrl);

  logging.info(filePath);
  if (!fs.existsSync(filePath)) {
    throw new NotFoundError("Fajl nije pronađen");
  }

  return filePath;
}
