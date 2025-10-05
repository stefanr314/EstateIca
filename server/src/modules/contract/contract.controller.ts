import { Request, Response, NextFunction } from "express";
import { NotFoundError, UnauthorizedError } from "../../shared/errors";
import {
  getContractDetailsForUser,
  getContractForUser,
} from "./contract.service";

export const getContract = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user)
    throw new UnauthorizedError(
      "Korisnik nije prijavljen da bi mogao da uradi ovu akciju."
    );
  const { contractId } = req.params;
  const userId = req.user.id;

  try {
    const filePathForContract = await getContractForUser(contractId, userId);

    res.download(filePathForContract, `contract-${contractId}.pdf`, (err) => {
      if (err) {
        logging.error("Greška pri slanju fajla:", err);
        next(new NotFoundError("Fajl nije moguće poslati (možda je obrisan)."));
      }
    });
    // res.type("application/pdf");
    // res.setHeader("Content-Disposition", "inline; filename=contract.pdf");
    // res.sendFile(filePathForContract);
  } catch (err) {
    next(err);
  }
};

export const getContractDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      throw new UnauthorizedError(
        "Morate biti prijavljeni da biste vidjeli ugovor."
      );

    const { contractId } = req.params;
    const userId = req.user.id;

    const details = await getContractDetailsForUser(contractId, userId);
    res.status(200).json(details);
  } catch (error) {
    next(error);
  }
};
