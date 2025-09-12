import { Reservation } from "./reservation.model";
import {
  CreateBusinessReservationDto,
  CreateReservationDto,
} from "./dtos/createReservation.dto";
import {
  ExtendReservationDto,
  UpdateBusinessReservationUnitCountDto,
  UpdateReservationDateDto,
  UpdateResidentialReservationGuestCountDto,
} from "./dtos/updateReservation.dto";
import { Status } from "../../shared/types/status.enum";
import mongoose from "mongoose";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../shared/errors";
import {
  GetPendingReservationQueryDto,
  GetReservationQueryDto,
} from "./dtos/getReservationQuery.dto";
import {
  BaseEstate,
  BusinessEstate,
  ResidentialEstate,
  ResidentialEstateDocument,
} from "../estate/estate.model";

import {
  differenceInDays,
  differenceInMonths,
  isAfter,
  startOfDay,
} from "date-fns";
import { RentalType } from "../../shared/types/rentalType.enum";
import { sendEmail } from "../../shared/utils/sendMail";
import { User, UserDocument } from "../user/user.model";
import { UpdateReservationStatusDto } from "./dtos/updateReservationStatusDto";
import {
  createCancellationContractFromReservation,
  createContractFromReservation,
} from "../contract/contract.service";
import { ContractDocument } from "../contract/contract.model";
import { LockDatesDto, UnlockDatesDto } from "./dtos/lockDates.dto";
import { LockDate } from "./lockDates.model";
import { utcMidnight } from "../../shared/utils/transformToUTCMidnight";
import { getSmartMonthCount } from "../../shared/utils/smartMonthCount";
import { reservationQueue } from "../../bullmq/queues/reservation.queue";

const EXTRA_FEE_PER_EXTRAGUEST = 5; //dodatna cijena po extra gostu koji je izvan maksimalnog broja gostiju u smjestaju
const CHILDREN_DISCOUNT = 4;
export class ReservationService {
  async checkAvailability(
    estateId: string,
    startDate: Date,
    endDate: Date,
    reservationId?: string // opcioni parametar
  ) {
    const overlapQuery = {
      $or: [{ startDate: { $lt: endDate }, endDate: { $gt: startDate } }],
    };
    const reservationQuery: any = {
      estateReserved: estateId,
      ...overlapQuery,
      status: { $in: [Status.PENDING, Status.CONFIRMED] },
    };
    if (reservationId) {
      reservationQuery._id = { $ne: reservationId };
    }

    const overlappingReservation = await Reservation.findOne(reservationQuery);

    const overlappingLock = await LockDate.findOne({
      estate: estateId,
      ...overlapQuery,
    });

    if (overlappingReservation || overlappingLock) {
      throw new ConflictError("Smještaj nije dostupan za odabrane datume");
    }
  }

  async getUnavailableDatesForEstate(estateId: string) {
    const [reservations, locks] = await Promise.all([
      Reservation.find({
        estateReserved: estateId,
        status: Status.CONFIRMED,
      }).select("startDate endDate -_id"),
      LockDate.find({ estate: estateId }).select("startDate endDate -_id"),
    ]);

    return [
      ...reservations.map((r) => ({
        type: "RESERVATION",
        startDate: r.startDate,
        endDate: r.endDate,
      })),
      ...locks.map((l) => ({
        type: "LOCK",
        startDate: l.startDate,
        endDate: l.endDate,
      })),
    ];
  }

  async createResidentialReservation(
    userId: string,
    estateId: string,
    dto: CreateReservationDto
  ) {
    const { endDate, startDate, guestCount, childrenCount } = dto;

    if (startDate >= endDate) {
      throw new BadRequestError(
        "Datum početka mora biti prije datuma završetka"
      );
    }

    await this.checkAvailability(estateId, dto.startDate, dto.endDate);

    logging.info("Start: " + startDate);
    logging.info("End: " + endDate);
    //normalizacija podataka: stavljanje datuma na ponoc radi ispravnog racunanja i to UTC jer je na toj zoni server
    const normalizedStart = utcMidnight(startDate);
    const normalizedEnd = utcMidnight(endDate);

    const totalNights = differenceInDays(normalizedEnd, normalizedStart);
    const totalMonths = getSmartMonthCount(normalizedStart, normalizedEnd); // zaokruzujemo na veci broj mjeseci ako je npr. 1.5 mjeseci, na frontu ce korisnici moci samo cijele mjesece da biraju

    logging.info(normalizedStart);
    logging.info("Norma end: " + normalizedEnd);
    logging.info(totalNights);
    logging.info(totalMonths);

    const estateToBeReserved = await ResidentialEstate.findById(
      estateId
    ).populate<{ host: UserDocument }>("host");

    if (!estateToBeReserved)
      throw new NotFoundError(
        `Estate sa id-om: ${estateId} koji se pokusava rezervisati ne postoji u bazi.`
      );

    if (estateToBeReserved.hidden)
      throw new ForbiddenError(
        "Ne mozes rezervisati smjestaj kojem nemas pristup."
      );
    if (estateToBeReserved.host._id.toString() === userId)
      throw new BadRequestError("Ne mozete rezervisati svoj smjestaj.");

    // if (
    //   guestCount === undefined &&
    //   estateToBeReserved.rentalType === RentalType.SHORT_TERM
    // )
    //   throw new BadRequestError(
    //     "Rezervacija ovakvog tipa smjestaja mora da ima odredjen broj gostiju u rezervaciji."
    //   );

    const guest = await User.findById(userId);

    if (!guest) throw new NotFoundError("Korisnik sa ovim ID-om ne postoji.");

    const guestEmail = guest.email;
    const guestFullName = `${guest.firstName} ${guest.lastName}`;

    const {
      minimumStay,
      maximumStay,
      rentalType,
      securityDeposit,
      pricePerNight,
      pricePerMonth,
      guestIncluded,
      extraPeople,
      cancellationPolicy,
      title,
      address,
    } = estateToBeReserved;

    const hostEmail = estateToBeReserved.host?.email;
    const hostFullName = `${estateToBeReserved.host?.firstName} ${estateToBeReserved.host?.lastName}`;
    const hostId = estateToBeReserved.host?._id;

    const maxGuests = guestIncluded + (extraPeople ?? 0);
    const totalGuests = guestCount + (childrenCount ?? 0);

    let totalPrice = 0;
    let extraPeopleFee: number | undefined;
    let childrenDiscount: number | undefined;
    const stayDuration =
      rentalType === RentalType.SHORT_TERM ? totalNights : totalMonths;

    if (totalGuests > maxGuests) {
      throw new BadRequestError(
        "Premašen maksimalan broj dozvoljenih gostiju."
      );
    }
    if (stayDuration < minimumStay)
      throw new BadRequestError(
        "Izabrana dužina boravka je kraća od minimalne dozvoljene."
      );

    if (maximumStay && stayDuration > maximumStay)
      throw new BadRequestError(
        "Izabrana dužina boravka prelazi maksimalnu dozvoljenu."
      );

    if (pricePerNight && rentalType === RentalType.SHORT_TERM) {
      totalPrice += totalNights * pricePerNight;
    }

    if (pricePerMonth && rentalType === RentalType.LONG_TERM)
      totalPrice += pricePerMonth * totalMonths;

    if (
      extraPeople &&
      totalGuests > guestIncluded &&
      totalGuests - guestIncluded <= extraPeople
    ) {
      extraPeopleFee = EXTRA_FEE_PER_EXTRAGUEST * (totalGuests - guestIncluded);
      totalPrice += extraPeopleFee;
    }
    //Ovaj dio se moze dodatno korigovati u buducim verzijama sto bi i trebalo uciniti
    // if (guestCount > 2) {
    //   extraPeopleFee = EXTRA_FEE_PER_EXTRAGUEST;
    //   totalPrice += EXTRA_FEE_PER_EXTRAGUEST;
    // }
    if (childrenCount && childrenCount > 0) {
      childrenDiscount = CHILDREN_DISCOUNT;
      totalPrice -= childrenDiscount;
    }

    const reservationStatus =
      rentalType === RentalType.SHORT_TERM ? Status.CONFIRMED : Status.PENDING;

    const priceField =
      rentalType === RentalType.SHORT_TERM
        ? { pricePerNight }
        : { pricePerMonth };
    const isContractRequired =
      rentalType === RentalType.SHORT_TERM ? false : true;
    //Sto se cijene tice moze se i dodati posebno za djecu i odrasle ako se racuna ukupna cijena u zavisonosti od broja gostiju sto je slucaj u hotelima, hostelima i sl. Trenutno je ostavljeno samo informativno da se vidi koliko je odraslih a koliko djece u smjestaju
    const reservation = new Reservation({
      ...dto,
      startDate: normalizedStart,
      endDate: normalizedEnd,
      estateReserved: estateId,
      userOfReservation: new mongoose.Types.ObjectId(userId),
      hostOfReservedEstate: hostId,
      totalPrice,
      hostName: hostFullName,
      guestName: guestFullName,
      estateTitle: title,
      rentalType,
      ...priceField,
      status: reservationStatus,
      isContractRequired: isContractRequired,
      childrenDiscount: childrenDiscount,
      extraPeopleFee: extraPeopleFee,
      pendingContractChange: undefined,
      pendingChange: undefined,
    });

    await reservation.save();

    const delay = new Date(normalizedEnd).getTime() - Date.now();
    if (delay > 0 && reservation.rentalType === RentalType.SHORT_TERM) {
      await reservationQueue.add(
        "completeReservation",
        { reservationId: reservation._id.toString() },
        {
          delay,
          removeOnComplete: true,
          removeOnFail: { age: 3600 }, // obriši failane nakon sat vremena
          jobId: `reservation:${reservation._id.toString()}`, // VAŽNO – da bi se mogli naci jobovi i obrisati ako se promijeni endDate
        }
      );
    }
    await sendEmail({
      to: guestEmail,
      subject: "Kreirali ste novu rezervaciju",
      templateName: "reservationCreatedForGuestTemplate",
      placeholders: {
        hostName: hostFullName,
        guestName: guestFullName,
        estateName: estateToBeReserved.title,
        checkIn: startDate.toLocaleDateString(),
        checkOut: endDate.toLocaleDateString(),
        totalPrice: totalPrice.toString() + "€",
        reservationLink: `http://localhost:3030/api/reservations/${reservation.id}/preview`,
      },
    });

    await sendEmail({
      to: hostEmail,
      subject: "Nova rezervacija za vas smjestaj",
      templateName: "reservationCreatedForHost",
      placeholders: {
        hostName: hostFullName,
        guestName: guestFullName,
        estateName: estateToBeReserved.title,
        checkIn: startDate.toLocaleDateString(),
        checkOut: endDate.toLocaleDateString(),
        totalPrice: totalPrice.toString() + "€",
        reservationLink: `http://localhost:3030/api/reservations/${reservation.id}/preview`,
      },
    });
    return { reservation, securityDeposit, cancellationPolicy, address };
  }

  //####################################################################################
  async createBusinessReservation(
    userId: string,
    estateId: string,
    dto: CreateBusinessReservationDto
  ) {
    const { endDate, startDate } = dto;

    if (startDate >= endDate) {
      throw new BadRequestError(
        "Datum početka mora biti prije datuma završetka"
      );
    }

    await this.checkAvailability(estateId, dto.startDate, dto.endDate);

    const normalizedStart = utcMidnight(startDate);
    const normalizedEnd = utcMidnight(endDate);

    const totalMonths = getSmartMonthCount(normalizedStart, normalizedEnd); // zaokruzujemo na veci broj mjeseci ako je npr. 1.5 mjeseci, na frontu ce korisnici moci samo cijele mjesece da biraju

    logging.info(totalMonths);

    const estateToBeReserved = await BusinessEstate.findById(
      estateId
    ).populate<{ host: UserDocument }>("host");

    if (!estateToBeReserved)
      throw new NotFoundError(
        `Estate sa id-om: ${estateId} koji se pokusava rezervisati ne postoji u bazi.`
      );

    if (estateToBeReserved.hidden)
      throw new ForbiddenError(
        "Ne mozes rezervisati smjestaj kojem nemas pristup."
      );

    const guest = await User.findById(userId);

    if (!guest) throw new NotFoundError("Korisnik sa ovim ID-om ne postoji.");

    const guestEmail = guest.email;
    const guestFullName = `${guest.firstName} ${guest.lastName}`;
    const hostEmail = estateToBeReserved.host?.email;
    const hostFullName = `${estateToBeReserved.host?.firstName} ${estateToBeReserved.host?.lastName}`;
    const hostId = estateToBeReserved.host?._id;
    const {
      pricePerMonth,
      cancellationPolicy,
      address,
      securityDeposit,
      minimumLeaseMonths,
      maximumLeaseMonths,
    } = estateToBeReserved;

    if (minimumLeaseMonths && totalMonths < minimumLeaseMonths)
      throw new BadRequestError(
        "Ovaj smjestaj mora biti rezervisan za vise mjeseci od izabranog broja mjeseci."
      );

    if (maximumLeaseMonths && totalMonths > maximumLeaseMonths)
      throw new BadRequestError(
        "Premasili ste dozvoljeni maksimalni broj mjeseci koji se moze izdati."
      );

    const totalPrice = pricePerMonth * totalMonths;

    const reservation = new Reservation({
      ...dto,
      startDate: normalizedStart,
      endDate: normalizedEnd,
      estateReserved: estateId,
      userOfReservation: new mongoose.Types.ObjectId(userId),
      hostOfReservedEstate: hostId,
      totalPrice,
      rentalType: RentalType.LONG_TERM,
      pricePerMonth,
      hostName: hostFullName,
      guestName: guestFullName,
      estateTitle: estateToBeReserved.title,
      status: Status.PENDING,
      isContractRequired: true,
      pendingContractChange: undefined,
      pendingChange: undefined,
    });

    await reservation.save();

    await sendEmail({
      to: guestEmail,
      subject: "Kreirali ste novu rezervaciju",
      templateName: "reservationCreatedForGuestTemplate",
      placeholders: {
        hostName: hostFullName,
        guestName: guestFullName,
        estateName: estateToBeReserved.title,
        checkIn: startDate.toLocaleDateString(),
        checkOut: endDate.toLocaleDateString(),
        totalPrice: totalPrice.toString() + "€",
        reservationLink: `http://localhost:3030/api/reservations/${reservation.id}/preview`,
      },
    });

    await sendEmail({
      to: hostEmail,
      subject: "Nova rezervacija za vas smjestaj",
      templateName: "reservationCreatedForHost",
      placeholders: {
        hostName: hostFullName,
        guestName: guestFullName,
        estateName: estateToBeReserved.title,
        checkIn: startDate.toLocaleDateString(),
        checkOut: endDate.toLocaleDateString(),
        totalPrice: totalPrice.toString() + "€",
        reservationLink: `http://localhost:3030/api/reservations/${reservation.id}/preview`,
      },
    });

    return { reservation, cancellationPolicy, address, securityDeposit };
  }

  async updateStatus(
    reservationId: string,
    currentUserId: string,
    dto: UpdateReservationStatusDto
  ) {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      throw new NotFoundError("Rezervacija nije pronadjena");
    }
    if (reservation.status === Status.CANCELED)
      throw new BadRequestError("Otkazane rezervacije se ne mogu mijenjati.");
    if (
      currentUserId !== reservation.hostOfReservedEstate.toString() &&
      currentUserId !== reservation.userOfReservation.toString()
    )
      throw new ForbiddenError("Nemate pravo pristupa ovoj rezervaciji.");

    if (dto.status === undefined) {
      throw new BadRequestError("Status mora biti definisan");
    }
    reservation.status = dto.status;
    await reservation.save();
    return reservation;
  }

  async updateResidentialGuestCount(
    reservationId: string,
    currentUserId: string,
    dto: UpdateResidentialReservationGuestCountDto
  ) {
    if (!Object.keys(dto).length)
      throw new BadRequestError("No update data provided");

    const reservation = await Reservation.findById(reservationId).populate<{
      estateReserved: ResidentialEstateDocument;
    }>("estateReserved");

    if (!reservation) {
      throw new NotFoundError(
        "Rezervacija nije pronađena ili za nju nije moguce mijenjati broj gostiju u rezervaciji."
      );
    }
    if (reservation.rentalType === RentalType.LONG_TERM)
      throw new BadRequestError(
        "Rezervacije smjestaja na duze staze nije moguce mijenjati kroz navedenu logiku."
      );
    if (reservation.status === Status.CANCELED)
      throw new BadRequestError("Otkazane rezervacije se ne mogu mijenjati.");
    if (reservation.status === Status.COMPLETED)
      throw new BadRequestError("Završene rezervacije se ne mogu mijenjati.");
    if (
      // currentUserId !== reservation.hostOfReservedEstate.toString() &&
      currentUserId !== reservation.userOfReservation.toString()
    ) {
      throw new ForbiddenError("Nemate pravo da ažurirate ovu rezervaciju.");
    }
    if (reservation.estateReserved.estateType !== "ResidentialEstate")
      throw new BadRequestError(
        "Ovu akciju je moguce uraditi samo za smjestaje koji zavise od broja gostiju"
      );
    if (reservation.status === Status.PENDING) {
      throw new BadRequestError(
        "Nije moguće mijenjati broj gostiju dok je zahtjev za promjenu datuma na čekanju."
      );
    }

    const { note, guestCount, childrenCount } = dto;

    const { guestIncluded, extraPeople, pricePerNight, pricePerMonth } =
      reservation.estateReserved;

    const totalGuests =
      (guestCount !== undefined ? guestCount : reservation.guestCount) +
      (childrenCount !== undefined
        ? childrenCount
        : reservation.childrenCount ?? 0);

    const maxGuests = guestIncluded + (extraPeople ?? 0);

    if (totalGuests > maxGuests) {
      throw new BadRequestError(
        "Premašen maksimalan broj dozvoljenih gostiju."
      );
    }
    let basePrice: number = 0;
    let extraFee = 0;
    let discount = 0;
    if (reservation.rentalType === RentalType.SHORT_TERM && pricePerNight) {
      const nights = differenceInDays(
        reservation.endDate,
        reservation.startDate
      );

      basePrice = nights * pricePerNight;
    }
    // if (reservation.rentalType === RentalType.LONG_TERM && pricePerMonth) {
    //   const months = differenceInMonths(
    //     reservation.endDate,
    //     reservation.startDate
    //   );

    //   basePrice = months * pricePerMonth;
    // }

    // extra guest fee
    if (
      guestCount &&
      extraPeople &&
      totalGuests > guestIncluded &&
      totalGuests - guestIncluded <= extraPeople
    ) {
      extraFee = EXTRA_FEE_PER_EXTRAGUEST * (totalGuests - guestIncluded);
    }

    // children discount
    if (childrenCount && childrenCount > 0) {
      discount = CHILDREN_DISCOUNT * childrenCount;
    }

    reservation.extraPeopleFee = extraFee;
    reservation.childrenDiscount = discount;
    reservation.totalPrice =
      basePrice === 0
        ? reservation.totalPrice
        : basePrice + extraFee - discount;

    // Object.assign(reservation, cleanDto);
    if (note !== undefined) reservation.note = note;
    if (guestCount !== undefined) reservation.guestCount = guestCount;
    if (childrenCount !== undefined) reservation.childrenCount = childrenCount;

    await reservation.save();

    return reservation;
  }

  async updateBusinessReservationUnitCount(
    reservationId: string,
    currentUserId: string,
    dto: UpdateBusinessReservationUnitCountDto
  ) {
    const reservation = await Reservation.findById(reservationId).populate<{
      estateReserved: {
        unitsAvailable: number;
        estateType: "ResidentialEstate" | "BusinessEstate";
      };
    }>("estateReserved", ["unitsAvailable", "estateType"]);

    if (!reservation) throw new NotFoundError("Rezervacija ne postoji");
    if (reservation.userOfReservation.toString() !== currentUserId)
      throw new ForbiddenError("Nemate pravo pristupa ovoj rezervaciji.");
    if (reservation.rentalType !== RentalType.LONG_TERM)
      throw new BadRequestError(
        "Ne mozete izvrisiti ovu akciju za trazenu rezervaciju."
      );
    if (reservation.status === Status.CANCELED)
      throw new BadRequestError(
        "Ne mozete izvrsiti trazenu akciju za otakazanu rezervacjiu."
      );
    if (reservation.status === Status.COMPLETED)
      throw new BadRequestError(
        "Ne mozete izvrsiti trazenu akciju za zavrsenu rezervacjiu."
      );
    if (reservation.estateReserved.estateType === "ResidentialEstate")
      throw new BadRequestError(
        "Ne mozete izvrsiti trazenu akciju za nekretnine koje nude usluge smjestaja/stanovanja."
      );
    if (dto.unitCount > reservation.estateReserved.unitsAvailable)
      throw new BadRequestError(
        "Premasili ste dozvoljeni broj jedinica koje mozete iznajmiti"
      );

    reservation.pendingContractChange = {
      newUnitCount: dto.unitCount,
      note: dto.note,
    };

    await reservation.save();

    return reservation;
  }

  async updateReservationDate(
    reservationId: string,
    currentUserId: string,
    dto: UpdateReservationDateDto
  ) {
    if (!Object.keys(dto).length)
      throw new BadRequestError("No update data provided");

    const reservation = await Reservation.findById(reservationId).populate<{
      estateReserved: ResidentialEstateDocument;
      hostOfReservedEstate: UserDocument;
    }>(["estateReserved", "hostOfReservedEstate"]);

    if (!reservation) {
      throw new NotFoundError("Rezervacija nije pronađena");
    }

    if (reservation.status === Status.CANCELED)
      throw new BadRequestError("Otkazane rezervacije se ne mogu mijenjati.");
    if (reservation.status === Status.COMPLETED)
      throw new BadRequestError(
        "Kompletirane rezervacije se ne mogu mijenjati."
      );
    if (
      // currentUserId !== reservation.hostOfReservedEstate.toString() &&
      currentUserId !== reservation.userOfReservation.toString()
    ) {
      throw new ForbiddenError("Nemate pravo da ažurirate ovu rezervaciju.");
    }
    if (reservation.estateReserved.estateType !== "ResidentialEstate")
      throw new BadRequestError(
        "Ovu akciju je moguce uraditi samo za smjestaje koji se izdaju za stanovanje."
      );
    if (
      reservation.rentalType === RentalType.LONG_TERM &&
      reservation.status === Status.PENDING
    ) {
      throw new BadRequestError(
        "Dugotrajne rezervacije u statusu 'na čekanju' se ne mogu mijenjati."
      );
    }
    const { startDate, endDate, note } = dto;

    const { minimumStay, maximumStay, pricePerNight, pricePerMonth } =
      reservation.estateReserved;

    if (new Date() >= reservation.startDate) {
      throw new BadRequestError(
        "Rezervaciju nije moguće izmijeniti nakon što je već započela."
      );
    }

    await this.checkAvailability(
      reservation.estateReserved._id.toString(),
      startDate,
      endDate,
      reservation._id.toString()
    );
    const normalizedStart = utcMidnight(startDate);
    const normalizedEnd = utcMidnight(endDate);
    logging.info("Normalized start date:", normalizedStart);
    logging.info("Normalized end date:", normalizedEnd);
    const totalNights = differenceInDays(normalizedEnd, normalizedStart);
    const totalMonths = getSmartMonthCount(normalizedStart, normalizedEnd);
    const stayDuration =
      reservation.rentalType === RentalType.SHORT_TERM
        ? totalNights
        : totalMonths;

    if (stayDuration < minimumStay)
      throw new BadRequestError(
        `Broj ${
          reservation.rentalType === RentalType.SHORT_TERM ? "noci" : "mjeseci"
        } koji ste odabrali u rezervaciji mora biti veci od minimalnog broja ${
          reservation.rentalType === RentalType.SHORT_TERM ? "noci" : "mjeseci"
        } (${minimumStay}) koji se mogu rezervisati za izabrani smjestaj.`
      );

    if (maximumStay && stayDuration > maximumStay)
      throw new BadRequestError(
        `Izabrani broj ${
          reservation.rentalType === RentalType.SHORT_TERM ? "noci" : "mjeseci"
        } premasuje dozvoljeni maksimalni broj ${
          reservation.rentalType === RentalType.SHORT_TERM ? "noci" : "mjeseci"
        }  (${maximumStay}) koji se moze rezervisati u izabranom smjestaju.`
      );

    let basePrice: number = 0;
    if (pricePerNight && reservation.rentalType === RentalType.SHORT_TERM)
      basePrice = pricePerNight * totalNights;
    if (pricePerMonth && reservation.rentalType === RentalType.LONG_TERM) {
      basePrice = pricePerMonth * totalMonths;
    }

    // update radimo na nivou opcionog polja kako bismo u glavnom dijelu rezervacije ostavili stare podatke u slucaju da vlasnik odbije zahtjev za promjenu datuma
    reservation.pendingChange = {
      type: "UPDATE_DATE",
      newStartDate: normalizedStart,
      newEndDate: normalizedEnd,
      totalPrice:
        basePrice === 0
          ? reservation.totalPrice
          : basePrice +
            (reservation.extraPeopleFee ?? 0) -
            (reservation.childrenDiscount ?? 0),
      note,
    };
    // reservation.totalPrice =
    //   basePrice === 0
    //     ? reservation.totalPrice
    //     : basePrice +
    //       (reservation.extraPeopleFee ?? 0) -
    //       (reservation.childrenDiscount ?? 0);
    // reservation.startDate = normalizedStart;
    // reservation.endDate = normalizedEnd;
    // if (note !== undefined) reservation.note = note;

    reservation.status = Status.PENDING;

    await reservation.save();

    const hostEmail = reservation.hostOfReservedEstate.email;
    const hostFullName = reservation.hostName;
    const guestFullName = reservation.guestName;
    const estateName = reservation.estateReserved.title;

    await sendEmail({
      to: hostEmail,
      subject: "Nova rezervacija za vas smjestaj",
      templateName: "reservationDateUpdatedForHost",
      placeholders: {
        hostName: hostFullName,
        guestName: guestFullName,
        estateName,
        startDate: normalizedStart.toLocaleDateString(),
        endDate: normalizedEnd.toLocaleDateString(),
        totalPrice: reservation.pendingChange.totalPrice.toString() + "€",
        reservationApprovalLink: `http://localhost:3030/api/reservations/${reservation.id}/preview`,
      },
    });

    return reservation;
  }

  async extendReservation(
    reservationId: string,
    currentUserId: string,
    dto: ExtendReservationDto
  ) {
    if (!dto.newEndDate) {
      throw new BadRequestError("Morate navesti novi datum odlaska.");
    }

    const reservation = await Reservation.findById(reservationId).populate<{
      estateReserved: ResidentialEstateDocument;
      hostOfReservedEstate: UserDocument;
    }>(["estateReserved", "hostOfReservedEstate"]);

    if (!reservation) throw new NotFoundError("Rezervacija nije pronađena");

    if (reservation.status === Status.CANCELED)
      throw new BadRequestError("Otkazane rezervacije se ne mogu mijenjati.");

    if (reservation.status === Status.COMPLETED)
      throw new BadRequestError(
        "Kompletirane rezervacije se ne mogu mijenjati."
      );
    if (reservation.rentalType === RentalType.LONG_TERM)
      throw new BadRequestError(
        "Nije moguce izvrisiti trazenu akciju jer smjestaj nema mogucnost azuriranja datuma zbog ugovora koji se."
      );
    if (currentUserId !== reservation.userOfReservation.toString()) {
      throw new ForbiddenError("Nemate pravo da ažurirate ovu rezervaciju.");
    }
    if (reservation.estateReserved.estateType !== "ResidentialEstate")
      throw new BadRequestError(
        "Ovu akciju je moguce uraditi samo za smjestaje koji zavise od broja gostiju"
      );

    // Guard: možeš produžiti samo dok boravak traje
    const now = new Date();
    if (now < reservation.startDate) {
      throw new BadRequestError(
        "Rezervacija još nije počela. Koristite updateReservationDate."
      );
    }
    if (now >= reservation.endDate) {
      throw new BadRequestError(
        "Rezervacija je već završena. Nije moguće produženje."
      );
    }

    const normalizedNewEnd = utcMidnight(dto.newEndDate);
    logging.info("Normalized new end date:", normalizedNewEnd);

    if (normalizedNewEnd <= reservation.endDate) {
      throw new BadRequestError(
        "Novi datum odlaska mora biti nakon trenutnog."
      );
    }

    // Provjera dostupnosti od starog endDate do novog
    await this.checkAvailability(
      reservation.estateReserved._id.toString(),
      reservation.endDate,
      normalizedNewEnd,
      reservation._id.toString()
    );

    const { minimumStay, maximumStay, pricePerNight, pricePerMonth } =
      reservation.estateReserved;

    // izračunamo koliko boravak traje nakon produženja
    const totalNights = differenceInDays(
      normalizedNewEnd,
      reservation.startDate
    );
    // const totalMonths = differenceInMonths(
    //   normalizedNewEnd,
    //   reservation.startDate
    // );

    const stayDuration = totalNights;

    if (stayDuration < minimumStay)
      throw new BadRequestError(
        "Produženjem rezervacije ispod minimuma - nevažeće."
      );

    if (maximumStay && stayDuration > maximumStay)
      throw new BadRequestError(
        "Produženjem prelazite maksimalno dozvoljeni boravak."
      );

    // Izračunaj dodatnu cijenu samo za dane/mjesece koji su dodani
    let extraPrice = 0;
    if (pricePerNight && reservation.rentalType === RentalType.SHORT_TERM) {
      const addedNights = differenceInDays(
        normalizedNewEnd,
        reservation.endDate
      );
      extraPrice = pricePerNight * addedNights;
    }
    // if (pricePerMonth && reservation.rentalType === RentalType.LONG_TERM) {
    //   const addedMonths = differenceInMonths(
    //     normalizedNewEnd,
    //     reservation.endDate
    //   );
    //   extraPrice = pricePerMonth * addedMonths;
    // }

    // update radimo na nivou opcionog polja kako bismo u glavnom dijelu rezervacije ostavili stare podatke u slucaju da vlasnik odbije zahtjev za promjenu datuma
    reservation.pendingChange = {
      type: "EXTEND",
      newEndDate: normalizedNewEnd,
      extraPrice,
      totalPrice: reservation.totalPrice,
      note: dto.note,
    };
    // reservation.endDate = normalizedNewEnd;
    // reservation.totalPrice += extraPrice;
    // if (dto.note !== undefined) reservation.note = dto.note;

    reservation.status = Status.PENDING; // host mora da odobri

    await reservation.save();

    // ✉️ Pošalji mejl hostu za odobrenje
    await sendEmail({
      to: reservation.hostOfReservedEstate.email,
      subject: "Zahtjev za produženje rezervacije",
      templateName: "extendReservation",
      placeholders: {
        hostName: reservation.hostName,
        guestName: reservation.guestName,
        estateName: reservation.estateReserved.title,
        oldEndDate: reservation.endDate.toLocaleDateString(),
        newEndDate: normalizedNewEnd.toLocaleDateString(),
        extraPrice: extraPrice.toString() + "€",
        totalPrice: reservation.totalPrice.toString() + "€",
        reservationApprovalLink: `http://localhost:3030/api/reservations/${reservation.id}`,
      },
    });

    return reservation;
  }

  async lockDates(hostId: string, estateId: string, dto: LockDatesDto) {
    const estateToBeLocked = await ResidentialEstate.findById(estateId);
    if (!estateToBeLocked)
      throw new NotFoundError("Trazeni smjestaj ne postoji");
    if (estateToBeLocked.host.toString() !== hostId)
      throw new ForbiddenError("Nemate pravo upravljanja tudjim smjestajem.");
    if (estateToBeLocked.hidden)
      throw new BadRequestError(
        "Trazena akcija nije moguca za sakriveni smjestaj."
      );

    const { startDate, endDate, note } = dto;
    const normalizedStart = utcMidnight(startDate);
    const normalizedEnd = utcMidnight(endDate);

    await this.checkAvailability(estateId, normalizedStart, normalizedEnd);

    const lockDates = await LockDate.create({
      startDate: normalizedStart,
      endDate: normalizedEnd,
      estate: estateId,
      owner: hostId,
      note: note ?? "",
    });

    return lockDates;
  }

  async unlockDates(hostId: string, estateId: string, dto: UnlockDatesDto) {
    const estate = await ResidentialEstate.findById(estateId);
    if (!estate) {
      throw new NotFoundError("Smještaj ne postoji");
    }

    if (estate.host.toString() !== hostId.toString()) {
      throw new ForbiddenError("Niste vlasnik ovog smještaja");
    }

    const result = await LockDate.deleteMany({
      estate: estateId,
      owner: hostId,
      startDate: { $lt: dto.endDate },
      endDate: { $gt: dto.startDate },
    });

    return { deleted: result.deletedCount };
  }

  async approvePendingReservation(
    currentUserId: string,
    reservationId: string
  ) {
    const reservation = await Reservation.findById(reservationId)
      .populate<{
        userOfReservation: { email: string };
      }>("userOfReservation", "email")
      .populate<{ estateReserved: { title: string } }>(
        "estateReserved",
        "title"
      );

    if (!reservation)
      throw new NotFoundError("Trazena rezervacija ne postoji.");
    if (currentUserId !== reservation.hostOfReservedEstate.toString())
      throw new ForbiddenError("Nemate pravo pristupa ovoj rezervaciji.");
    if (reservation.status === Status.CANCELED)
      throw new BadRequestError("Otkazane rezervacije nije moguce potvrditi.");
    if (reservation.status === Status.CONFIRMED)
      throw new BadRequestError(
        "Nije moguce potvrditi vec potvrdjenu rezervaciju."
      );
    if (reservation.status === Status.COMPLETED)
      throw new BadRequestError(
        "Nije moguce potvrditi vec zavrsenu rezervaciju."
      );
    if (!reservation.pendingChange)
      throw new BadRequestError("Nema promjena koje treba odobriti.");

    let contract: ContractDocument | undefined;
    if (reservation.pendingChange) {
      const changeType = reservation.pendingChange.type;
      const oldEndDate = reservation.endDate;
      const extraPrice = reservation.pendingChange.extraPrice ?? 0;
      let contractToBeGenerated = false;

      if (reservation.pendingChange.type === "UPDATE_DATE") {
        reservation.startDate =
          reservation.pendingChange.newStartDate ?? reservation.startDate;
        reservation.totalPrice = reservation.pendingChange.totalPrice;

        reservation.rentalType === RentalType.LONG_TERM &&
          (contractToBeGenerated = true);
      } else if (reservation.pendingChange.type === "EXTEND") {
        reservation.totalPrice =
          reservation.pendingChange.totalPrice +
          (reservation.pendingChange.extraPrice ?? 0);
      }

      reservation.endDate =
        reservation.pendingChange.newEndDate ?? reservation.endDate;

      reservation.note = reservation.pendingChange.note ?? reservation.note;
      reservation.status = Status.CONFIRMED;
      reservation.pendingChange = undefined;
      await reservation.save();

      const oldJob = await reservationQueue.getJob(
        `reservation:${reservationId}`
      );
      if (oldJob) {
        await oldJob.remove();
      }

      const delay = new Date(reservation.endDate).getTime() - Date.now();
      if (delay > 0) {
        await reservationQueue.add(
          "completeReservation",
          { reservationId },
          {
            delay,
            removeOnComplete: true,
            removeOnFail: { age: 3600 },
            jobId: `reservation:${reservationId}`, // isti id za ovu rezervaciju
          }
        );
      }

      await sendEmail({
        to: reservation.userOfReservation.email,
        subject: "Vas zahtjev za izmjenu rezervacije je prihvacen",
        templateName: "reservationUpdateApproved",
        placeholders: {
          guestName: reservation.guestName,
          changeType,
          estateName: reservation.estateReserved.title,
          startDate: reservation.startDate.toLocaleDateString(),
          oldEndDate: oldEndDate.toLocaleDateString(),
          newEndDate: reservation.endDate.toLocaleDateString(),
          extraPrice: extraPrice.toString() + "€",
          totalPrice: reservation.totalPrice.toString() + "€",
          reservationLink: `http://localhost:3030/api/reservations/${reservation.id}`,
        },
      });

      if (contractToBeGenerated)
        contract = await createContractFromReservation(
          reservation
            .depopulate("userOfReservation")
            .depopulate("estateReserved"),
          "Long-Term Residential"
        );
    }

    return { reservation, contract };
  }

  async approveBusinessUnitCountUpdate(reservationId: string, userId: string) {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      throw new NotFoundError("Rezervacija nije prodnadjena");
    }
    if (reservation.hostOfReservedEstate.toString() !== userId) {
      throw new ForbiddenError("Nemate pravo pristupa ovoj rezervaciji");
    }
    if (!reservation.pendingContractChange) {
      throw new BadRequestError(
        "Nema promjene u rezervaciji koja ceka na potvrdu"
      );
    }
    if (reservation.status === Status.CANCELED)
      throw new BadRequestError("Otkazane rezervacije nije moguce pregledati.");
    if (reservation.status === Status.COMPLETED)
      throw new BadRequestError(
        "Nije moguce pregledati vec zavrsenu rezervaciju."
      );
    // Ažuriraj stvarne podatke iz pending-a
    reservation.unitCount = reservation.pendingContractChange.newUnitCount;
    reservation.note = reservation.pendingContractChange.note;
    reservation.pendingContractChange = undefined; // očisti pending
    reservation.status = Status.CONFIRMED;

    // Generiši ugovor na osnovu novih podataka
    const contractFile = await createContractFromReservation(
      reservation,
      "Business"
    );

    await reservation.save();

    return { reservation, contract: contractFile };
  }

  async denyBusinessUnitCountUpdate(
    reservationId: string,
    userId: string,
    reason?: string
  ) {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      throw new NotFoundError("Rezervacija nije pronađena");
    }
    if (reservation.hostOfReservedEstate.toString() !== userId) {
      throw new ForbiddenError("Nemate pravo pristupa ovoj rezervaciji");
    }
    if (!reservation.pendingContractChange) {
      throw new BadRequestError(
        "Nema promjene u rezervaciji koja čeka na pregled"
      );
    }
    if (reservation.status === Status.CANCELED)
      throw new BadRequestError("Otkazane rezervacije nije moguće pregledati.");
    if (reservation.status === Status.COMPLETED)
      throw new BadRequestError(
        "Nije moguće pregledati već završenu rezervaciju."
      );

    // Odbaci pending promjene
    reservation.pendingContractChange = undefined;

    // Status ostaje nepromijenjen ako je bila vec pending onda ce se morati potvrditi ili odbiti stara rezervacija
    // reservation.status = Status.CONFIRMED;
    if (reason) reservation.note = reason;

    await reservation.save();

    return { reservation, message: "Promjena je odbijena" };
  }

  async denyPendingReservation(currentUserId: string, reservationId: string) {
    const reservation = await Reservation.findById(reservationId)
      .populate<{
        userOfReservation: { email: string };
      }>("userOfReservation", "email")
      .populate<{ estateReserved: { title: string } }>(
        "estateReserved",
        "title"
      );

    if (!reservation)
      throw new NotFoundError("Tražena rezervacija ne postoji.");

    if (currentUserId !== reservation.hostOfReservedEstate.toString())
      throw new ForbiddenError("Nemate pravo pristupa ovoj rezervaciji.");

    if (reservation.status === Status.CANCELED)
      throw new BadRequestError("Otkazane rezervacije nije moguće odbiti.");

    if (reservation.status === Status.COMPLETED)
      throw new BadRequestError("Završene rezervacije nije moguće odbiti.");
    if (!reservation.pendingChange)
      throw new BadRequestError("Nema promjene koja treba da se odbije");

    // Odbacujemo pending change
    reservation.pendingChange = undefined;
    reservation.status = Status.CONFIRMED; //stavljamo i jednu i drugu na confirmed jer se u ovo stanje moze doci jedino ako su i long term i short term bile prethodno confirmed (short term su automatski potvrdjene pri uspjesnom kreiranju)

    await reservation.save();

    await sendEmail({
      to: reservation.userOfReservation.email,
      subject: "Vas zahtjev za izmjenu rezervacije je odbijen",
      templateName: "reservationUpdateDenied",
      placeholders: {
        guestName: reservation.guestName,
        hostName: reservation.hostName,
        estateName: reservation.estateReserved.title,
        startDate: reservation.startDate.toLocaleDateString(),
        endDate: reservation.endDate.toLocaleDateString(),
        totalPrice: reservation.totalPrice.toString() + "€",
        reservationLink: `http://localhost:3030/api/reservations/${reservation.id}`,
      },
    });

    return reservation;
  }

  async confirmLongTermResidentialReservation(
    currentUserId: string,
    reservationId: string
  ) {
    const reservation = await Reservation.findById(reservationId).populate<{
      estateReserved: { estateType: "ResidentialEstate" | "BusinessEstate" };
    }>("estateReserved", "estateType");

    if (!reservation)
      throw new NotFoundError("Trazena rezervacija ne postoji.");
    if (currentUserId !== reservation.hostOfReservedEstate.toString())
      throw new ForbiddenError("Nemate pravo pristupa ovoj rezervaciji.");
    if (reservation.status === Status.CANCELED)
      throw new BadRequestError("Otkazane rezervacije nije moguce potvrditi.");
    if (reservation.status === Status.CONFIRMED)
      throw new BadRequestError(
        "Nije moguce potvrditi vec potvrdjenu rezervaciju."
      );
    if (reservation.status === Status.COMPLETED)
      throw new BadRequestError(
        "Nije moguce potvrditi vec zavrsenu rezervaciju."
      );
    if (reservation.rentalType !== RentalType.LONG_TERM)
      throw new BadRequestError(
        "Nije moguce potvrditi rezervaciju ovakve vrste smjestaja na ovaj nacin."
      );
    if (reservation.estateReserved.estateType !== "ResidentialEstate")
      throw new BadRequestError(
        "Na ovaj nacin se mogu rezervisati samo long term residential rezervacije."
      );
    //iako ove rezervacije nikada nece imati ovo polje
    if (reservation.pendingContractChange)
      throw new BadRequestError(
        "Ovakve rezervacije se ne mogu potvrditi na ovaj nacin"
      );

    reservation.status = Status.CONFIRMED;
    await reservation.save();

    const delay = new Date(reservation.endDate).getTime() - Date.now();
    if (delay > 0) {
      await reservationQueue.add(
        "completeReservation",
        { reservationId: reservation._id.toString() },
        {
          delay,
          removeOnComplete: true,
          removeOnFail: { age: 3600 }, // obriši failane nakon sat vremena
          jobId: `reservation:${reservation._id.toString()}`, // VAŽNO – da bi se mogli naci jobovi i obrisati ako se promijeni endDate
        }
      );
    }
    let contract: ContractDocument;

    contract = await createContractFromReservation(
      reservation.depopulate("estateReserved"),
      "Long-Term Residential"
    );

    return { contract, reservation };
  }

  async confirmBusinessReservation(
    currentUserId: string,
    reservationId: string
  ) {
    const reservation = await Reservation.findById(reservationId).populate<{
      estateReserved: { estateType: "ResidentialEstate" | "BusinessEstate" };
    }>("estateReserved", "estateType");

    if (!reservation)
      throw new NotFoundError("Trazena rezervacija ne postoji.");
    if (currentUserId !== reservation.hostOfReservedEstate.toString())
      throw new ForbiddenError("Nemate pravo pristupa ovoj rezervaciji.");
    if (reservation.status === Status.CANCELED)
      throw new BadRequestError("Otkazane rezervacije nije moguce potvrditi.");
    if (reservation.status === Status.CONFIRMED)
      throw new BadRequestError(
        "Nije moguce potvrditi vec potvrdjenu rezervaciju."
      );
    if (reservation.status === Status.COMPLETED)
      throw new BadRequestError(
        "Nije moguce potvrditi vec zavrsenu rezervaciju."
      );
    if (reservation.rentalType !== RentalType.LONG_TERM)
      throw new BadRequestError(
        "Nije moguce potvrditi rezervaciju ovakve vrste smjestaja na ovaj nacin."
      );
    if (reservation.estateReserved.estateType !== "BusinessEstate")
      throw new BadRequestError(
        "Na ovaj nacin se mogu rezervisati samo business rezervacije."
      );
    if (reservation.pendingContractChange)
      throw new BadRequestError(
        "Ovakve rezervacije se ne mogu potvrditi na ovaj nacin"
      );

    reservation.status = Status.CONFIRMED;
    await reservation.save();

    const delay = new Date(reservation.endDate).getTime() - Date.now();
    if (delay > 0) {
      await reservationQueue.add(
        "completeReservation",
        { reservationId: reservation._id.toString() },
        {
          delay,
          removeOnComplete: true,
          removeOnFail: { age: 3600 }, // obriši failane nakon sat vremena
          jobId: `reservation:${reservation._id.toString()}`, // VAŽNO – da bi se mogli naci jobovi i obrisati ako se promijeni endDate
        }
      );
    }

    let contract: ContractDocument;

    contract = await createContractFromReservation(
      reservation.depopulate("estateReserved"),
      "Business"
    );

    return { contract, reservation };
  }

  //Najblize brisanju rezervacije posto ta opcija nece postojati
  async cancelReservation(currentUserId: string, reservationId: string) {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation)
      throw new NotFoundError("Trazena rezervacija ne postoji.");
    if (currentUserId !== reservation.userOfReservation.toString())
      throw new ForbiddenError("Nemate pravo pristupa ovoj rezervaciji.");
    if (reservation.status === Status.CANCELED)
      throw new BadRequestError("Rezervacije je vec otkazana.");
    if (reservation.status === Status.COMPLETED)
      throw new BadRequestError(
        "Nije moguce otkazati vec zavrsenu rezervaciju."
      );

    reservation.status = Status.CANCELED;
    await reservation.save();

    const job = await reservationQueue.getJob(`reservation:${reservationId}`);
    if (job) {
      await job.remove();
    }

    let contract: ContractDocument | undefined;

    if (reservation.rentalType === RentalType.LONG_TERM) {
      contract = await createCancellationContractFromReservation(
        reservation,
        new Date(),
        "Razlog otkazivanja je postignut na obostrano prihvatanje otkazivanja rezervacije i prekidanja ugovora."
      );
    }
    return { reservation, contract };
  }

  async denyReservationByHost(hostId: string, reservationId: string) {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation)
      throw new NotFoundError("Trazena rezervacija ne postoji.");
    if (hostId !== reservation.hostOfReservedEstate.toString())
      throw new ForbiddenError("Nemate pravo pristupa ovoj rezervaciji.");
    if (reservation.status === Status.CANCELED)
      throw new BadRequestError("Rezervacije je vec otkazana.");
    if (reservation.status === Status.CONFIRMED)
      throw new BadRequestError("Potvrdjenu rezervaciju nije moguce odbiti.");
    if (reservation.status === Status.COMPLETED)
      throw new BadRequestError(
        "Nije moguce otkazati vec zavrsenu rezervaciju."
      );
    if (reservation.rentalType !== RentalType.LONG_TERM)
      throw new BadRequestError(
        "Navedena rezervacija se ne moze tretirati na ovaj nacin"
      );

    reservation.status = Status.CANCELED;
    await reservation.save();

    const job = await reservationQueue.getJob(`reservation:${reservationId}`);
    if (job) {
      await job.remove();
    }

    let contract: ContractDocument;

    contract = await createCancellationContractFromReservation(
      reservation,
      new Date(),
      "Razlog otkazivanja je postignut na obostrano prihvatanje otkazivanja rezervacije i prekidanja ugovora."
    );

    return { reservation, contract };
  }

  async completeReservation(currentUserId: string, reservationId: string) {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation)
      throw new NotFoundError("Trazena rezervacija ne postoji.");
    if (currentUserId !== reservation.userOfReservation.toString())
      throw new ForbiddenError("Nemate pravo pristupa ovoj rezervaciji.");
    if (reservation.status === Status.CANCELED)
      throw new BadRequestError(
        "Rezervacije je otkazana i nije ju moguce oznaciti kao zavrsenu."
      );
    if (reservation.status === Status.PENDING)
      throw new BadRequestError(
        "Nije moguce zavrsiti rezervaciju koja je u stanju cekanja."
      );

    // Provjera da li je endDate prošao
    if (isAfter(startOfDay(reservation.endDate), startOfDay(new Date())))
      throw new BadRequestError(
        "Ne može se označiti kao završena rezervacija koja još nije prošla."
      );

    reservation.status = Status.COMPLETED;
    await reservation.save();

    return reservation;
  }

  async getReservationById(reservationId: string, userId: string) {
    const reservation = await Reservation.findById(reservationId);
    // .populate("estateReserved")
    // .populate("userOfReservation");

    if (!reservation) throw new NotFoundError("Rezervacija nije pronađena.");
    if (
      reservation.userOfReservation.toString() !== userId &&
      reservation.hostOfReservedEstate.toString() !== userId
    )
      throw new ForbiddenError("Nemate pravo pristupa ovoj rezervaciji.");

    return reservation;
  }

  async getReservationsForHost(userId: string, dto: GetReservationQueryDto) {
    const { page, limit, startDate, endDate, status, sortBy } = dto;
    const skip = (page - 1) * limit;

    const estates = await BaseEstate.find({ host: userId }).select("_id");
    if (!estates)
      throw new NotFoundError("Ne postoje smjestaji za trazenog korisnika.");

    const estateIds = estates.map((e) => e._id);

    const filter: any = { estateReserved: { $in: estateIds } };
    if (status) filter.status = status;
    if (startDate) {
      filter.startDate = { $gte: startDate };
    }
    if (endDate) {
      filter.endDate = { $lte: endDate };
    }

    const query = Reservation.find(filter);
    if (sortBy) {
      const sortObject: Record<string, 1 | -1> = {};
      const sortFields = sortBy.split(",");

      for (const field of sortFields) {
        const [key, order] = field.split(":");
        sortObject[key] = order === "desc" ? -1 : 1; // 1 for ascending, -1 for descending
      }
      query.sort(sortObject);
    }
    const reservations = await query
      .populate("estateReserved")
      .populate("userOfReservation")
      .skip(skip)
      .limit(limit);

    const total = await Reservation.countDocuments(filter);

    return {
      data: reservations,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPendingReservationsForHost(
    hostId: string,
    dto: GetPendingReservationQueryDto
  ) {
    const { page, limit, startDate, endDate, type, sortBy } = dto;
    const skip = (page - 1) * limit;

    const filter: any = { hostOfReservedEstate: hostId };
    if (startDate) {
      filter.startDate = { $gte: startDate };
    }
    if (endDate) {
      filter.endDate = { $lte: endDate };
    }

    if (type === "Business") {
      filter.pendingContractChange = { $exists: true, $ne: null };
    } else if (type === "Residential") {
      filter.pendingChange = { $exists: true, $ne: null };
    } else {
      // Ako nije specificiran type, uzmi oba slučaja
      filter.$or = [
        { pendingChange: { $exists: true, $ne: null } },
        { pendingContractChange: { $exists: true, $ne: null } },
      ];
    }
    const query = Reservation.find(filter);

    if (sortBy) {
      const sortObject: Record<string, 1 | -1> = {};
      const sortFields = sortBy.split(",");

      for (const field of sortFields) {
        const [key, order] = field.split(":");
        sortObject[key] = order === "desc" ? -1 : 1; // 1 for ascending, -1 for descending
      }
      query.sort(sortObject);
    }

    const reservations = await query
      .skip(skip)
      .limit(limit)
      .populate("estateReserved")
      .populate("userOfReservation");

    const total = await Reservation.countDocuments(filter);
    return {
      data: reservations,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getReservationsForEstate(
    estateId: string,
    hostId: string,
    dto: GetReservationQueryDto
  ) {
    const estate = await BaseEstate.findById(estateId);
    if (!estate)
      throw new NotFoundError(
        "Ne postoji trazeni smjestaj za koji zelite da vidite rezervacije."
      );
    if (estate.host.toString() !== hostId)
      throw new ForbiddenError(
        "Nemate prava da vidite rezervacije za trazeni smjestaj."
      );

    const { page, limit, startDate, endDate, status, sortBy } = dto;
    const skip = (page - 1) * limit;

    const filter: any = { estateReserved: estateId };
    if (status !== undefined) filter.status = status;
    if (startDate) {
      filter.startDate = { $gte: startDate };
    }
    if (endDate) {
      filter.endDate = { $lte: endDate };
    }
    const query = Reservation.find(filter);

    if (sortBy) {
      const sortObject: Record<string, 1 | -1> = {};
      const sortFields = sortBy.split(",");

      for (const field of sortFields) {
        const [key, order] = field.split(":");
        sortObject[key] = order === "desc" ? -1 : 1; // 1 for ascending, -1 for descending
      }
      query.sort(sortObject);
    }

    const reservations = await query
      .skip(skip)
      .limit(limit)
      .populate("estateReserved")
      .populate("userOfReservation");

    const total = await Reservation.countDocuments(filter);
    return {
      data: reservations,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserReservations(userId: string, dto: GetReservationQueryDto) {
    const { page, limit, startDate, endDate, status, sortBy } = dto;
    const skip = (page - 1) * limit;

    const filter: any = { userOfReservation: userId };
    if (status !== undefined) filter.status = status;
    if (startDate) {
      filter.startDate = { $gte: startDate };
    }
    if (endDate) {
      filter.endDate = { $lte: endDate };
    }
    const query = Reservation.find(filter);

    if (sortBy) {
      const sortObject: Record<string, 1 | -1> = {};
      const sortFields = sortBy.split(",");

      for (const field of sortFields) {
        const [key, order] = field.split(":");
        sortObject[key] = order === "desc" ? -1 : 1; // 1 for ascending, -1 for descending
      }
      query.sort(sortObject);
    }

    const reservations = await query
      .skip(skip)
      .limit(limit)
      .populate("estateReserved")
      .populate("userOfReservation");

    const total = await Reservation.countDocuments(filter);
    return {
      data: reservations,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const reservationService = new ReservationService();
