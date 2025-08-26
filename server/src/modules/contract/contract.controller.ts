import { Request, Response, NextFunction } from "express";
import { NotFoundError, UnauthorizedError } from "../../shared/errors";
import { getContractForUser } from "./contract.service";

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

  const filePathForContract = await getContractForUser(contractId, userId);

  res.sendFile(filePathForContract, (err) => {
    if (err) {
      logging.error("Greška pri slanju fajla:", err);
      next(new NotFoundError("Fajl nije moguće poslati (možda je obrisan)."));
    }
  });
  //   res.download(filePathForContract);
};
