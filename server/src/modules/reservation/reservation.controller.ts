import { Request, Response, NextFunction } from "express";
import { reservationService } from "./reservation.service";
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
import { UnauthorizedError } from "../../shared/errors";
import {
  GetPendingReservationQueryDto,
  GetReservationQueryDto,
} from "./dtos/getReservationQuery.dto";
import { UpdateReservationStatusDto } from "./dtos/updateReservationStatusDto";
import { LockDatesDto, UnlockDatesDto } from "./dtos/lockDates.dto";

export const createResidentialReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = req.body as CreateReservationDto;

    if (!req.user || !req.user.id) {
      throw new UnauthorizedError(
        "Korisnik nije prijavljen da bi mogao da uradi ovu akciju."
      );
    }

    const { estateId } = req.params;
    const reservation = await reservationService.createResidentialReservation(
      req.user.id,
      estateId,
      dto
    );
    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
};

export const createBusinessReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = req.body as CreateBusinessReservationDto;

    if (!req.user || !req.user.id) {
      throw new UnauthorizedError(
        "Korisnik nije prijavljen da bi mogao da uradi ovu akciju."
      );
    }
    const { estateId } = req.params;

    const reservation = await reservationService.createBusinessReservation(
      req.user.id,
      estateId,
      dto
    );
    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
};

export const updateReservationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = req.body as UpdateReservationStatusDto;
    const userId = req.user?.id;
    if (userId === undefined)
      throw new UnauthorizedError(
        "Korisnik nije ulogovan kako bi uradio ovu akciju."
      );
    const reservation = await reservationService.updateStatus(
      req.params.reservationId,
      userId,
      dto
    );
    res.json(reservation);
  } catch (error) {
    next(error);
  }
};

export const updateResidentialGuestCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new UnauthorizedError("Korisnik nije prijavljen.");
    const currentUserId = req.user.id;
    const { reservationId } = req.params;
    const dto = req.body as UpdateResidentialReservationGuestCountDto;

    const result = await reservationService.updateResidentialGuestCount(
      reservationId,
      currentUserId,
      dto
    );
    res.json({
      message: "Broj gostiju na vasoj rezervaciji je uspjesno izmjenjen.",
      reservation: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBusinessReservationUnitCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new UnauthorizedError("Korisnik nije prijavljen.");
    const currentUserId = req.user.id;
    const { reservationId } = req.params;
    const dto = req.body as UpdateBusinessReservationUnitCountDto;

    const result = await reservationService.updateBusinessReservationUnitCount(
      reservationId,
      currentUserId,
      dto
    );
    res.json({
      message: "Broj jedinica je izmjenjen i ceka na potvrdu vlasnika.",
      reservation: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReservationDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new UnauthorizedError("Korisnik nije prijavljen.");
    const currentUserId = req.user.id;
    const { reservationId } = req.params;
    const dto = req.body as UpdateReservationDateDto;

    const result = await reservationService.updateReservationDate(
      reservationId,
      currentUserId,
      dto
    );
    res.json({
      message:
        "Datumi za vasu rezervaciju su izmjenjeni i cekaju na potvrdu od korisnika.",
      reservation: result,
    });
  } catch (error) {
    next(error);
  }
};

export const extendReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new UnauthorizedError("Korisnik nije prijavljen.");
    const currentUserId = req.user.id;
    const { reservationId } = req.params;
    const dto = req.body as ExtendReservationDto;

    const result = await reservationService.extendReservation(
      reservationId,
      currentUserId,
      dto
    );
    res.json({
      message: "Vasa rezervacija je produzena i ceka na potvrdu vlasnika.",
      reservation: result,
    });
  } catch (error) {
    next(error);
  }
};

export const approvePendingReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new UnauthorizedError("Korisnik nije prijavljen.");
    const currentUserId = req.user.id;
    const { reservationId } = req.params;

    const result = await reservationService.approvePendingReservation(
      currentUserId,
      reservationId
    );
    res.json({
      reservation: result,
    });
  } catch (error) {
    next(error);
  }
};

export const approveBusinessUnitCountUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new UnauthorizedError("Korisnik nije prijavljen.");
    const currentUserId = req.user.id;
    const { reservationId } = req.params;

    const result = await reservationService.approveBusinessUnitCountUpdate(
      reservationId,
      currentUserId
    );
    res.json({
      reservation: result,
    });
  } catch (error) {
    next(error);
  }
};

export const denyPendingReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new UnauthorizedError("Korisnik nije prijavljen.");
    const currentUserId = req.user.id;
    const { reservationId } = req.params;

    const result = await reservationService.denyPendingReservation(
      currentUserId,
      reservationId
    );
    res.json({
      reservation: result,
    });
  } catch (error) {
    next(error);
  }
};

export const denyBusinessUnitCountUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new UnauthorizedError("Korisnik nije prijavljen.");
    const currentUserId = req.user.id;
    const { reservationId } = req.params;
    const { reason }: { reason: string | undefined } = req.body;

    const result = await reservationService.denyBusinessUnitCountUpdate(
      reservationId,
      currentUserId,
      reason
    );
    res.json({
      reservation: result,
    });
  } catch (error) {
    next(error);
  }
};

export const lockDates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      throw new UnauthorizedError(
        "Korisnik mora biti ulogovan da izvrsi ovu akciju."
      );
    const hostId = req.user.id;
    const { estateId } = req.params;
    const dto = req.body as LockDatesDto;

    const result = await reservationService.lockDates(hostId, estateId, dto);

    res.json({ message: "Datumi zakljucani", lockDates: result });
  } catch (error) {
    next(error);
  }
};

export const unlockDates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      throw new UnauthorizedError(
        "Korisnik mora biti ulogovan da izvrsi ovu akciju."
      );
    const hostId = req.user.id;
    const { estateId } = req.params;
    const dto = req.body as UnlockDatesDto;

    const result = await reservationService.unlockDates(hostId, estateId, dto);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const confirmLongTermResidentialReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (userId === undefined)
      throw new UnauthorizedError(
        "Korisnik nije ulogovan kako bi uradio ovu akciju."
      );
    const { reservationId } = req.params;
    const reservationAndContract =
      await reservationService.confirmLongTermResidentialReservation(
        userId,
        reservationId
      );
    res.json(reservationAndContract);
  } catch (error) {
    next(error);
  }
};

export const confirmBusinessReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (userId === undefined)
      throw new UnauthorizedError(
        "Korisnik nije ulogovan kako bi uradio ovu akciju."
      );
    const { reservationId } = req.params;
    const reservationAndContract =
      await reservationService.confirmBusinessReservation(
        userId,
        reservationId
      );
    res.json(reservationAndContract);
  } catch (error) {
    next(error);
  }
};

export const cancelReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (userId === undefined)
      throw new UnauthorizedError(
        "Korisnik nije ulogovan kako bi uradio ovu akciju."
      );
    const { reservationId } = req.params;
    const reservationAndContract = await reservationService.cancelReservation(
      userId,
      reservationId
    );
    res.json(reservationAndContract);
  } catch (error) {
    next(error);
  }
};

export const denyReservationByHost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hostId = req.user?.id;
    if (hostId === undefined)
      throw new UnauthorizedError(
        "Korisnik nije ulogovan kako bi uradio ovu akciju."
      );
    const { reservationId } = req.params;
    const reservationAndContract =
      await reservationService.denyReservationByHost(hostId, reservationId);
    res.json(reservationAndContract);
  } catch (error) {
    next(error);
  }
};

export const completeReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (userId === undefined)
      throw new UnauthorizedError(
        "Korisnik nije ulogovan kako bi uradio ovu akciju."
      );
    const { reservationId } = req.params;
    const reservation = await reservationService.completeReservation(
      userId,
      reservationId
    );
    res.json(reservation);
  } catch (error) {
    next(error);
  }
};

export const getReservationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      throw new UnauthorizedError(
        "Korisnik nije prijavljen da bi mogao da uradi ovu akciju."
      );

    const userId = req.user.id;
    const { reservationId } = req.params;

    const reservation = await reservationService.getReservationById(
      reservationId,
      userId
    );
    res.json(reservation);
  } catch (err) {
    next(err);
  }
};

export const getEstateReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      throw new UnauthorizedError("Niste ulogovani da uradite ovu akciju.");
    const dto = req.query as unknown as GetReservationQueryDto;
    const hostId = req.user?.id;
    const reservations = await reservationService.getReservationsForEstate(
      req.params.estateId,
      hostId,
      dto
    );
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

export const getHostReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      throw new UnauthorizedError(
        "Korisnik nije prijavljen da bi mogao da uradi ovu akciju."
      );

    const hostId = req.user.id;
    const query = req.query as unknown as GetReservationQueryDto;

    const result = await reservationService.getReservationsForHost(
      hostId,
      query
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getPendingReservationsForHost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      throw new UnauthorizedError(
        "Korisnik nije prijavljen da bi mogao da uradi ovu akciju."
      );

    const hostId = req.user.id;
    const query = req.query as unknown as GetPendingReservationQueryDto;

    const result = await reservationService.getPendingReservationsForHost(
      hostId,
      query
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getUnavailableDatesForEstate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { estateId } = req.params;
    const dates = await reservationService.getUnavailableDatesForEstate(
      estateId
    );
    res.json(dates);
  } catch (err) {
    next(err);
  }
};

export const getUserReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedError(
        "Korisnik nije prijavljen da bi mogao da uradi ovu akciju."
      );
    }
    const dto = req.query as unknown as GetReservationQueryDto;
    const reservations = await reservationService.getUserReservations(
      req.user.id,
      dto
    );
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};
