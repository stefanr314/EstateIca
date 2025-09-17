import { AxiosError } from "axios";
import { Navigate } from "react-router-dom";
import AppError from "../components/errors/AppError";
import NotFoundBlock from "../components/errors/NotFoundBlock";
import BadRequestBlock from "../components/errors/BadRequestBlock";

interface ErrorHandlerProps {
  error: unknown;
}

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
}

function QueryErrorHandler({ error }: ErrorHandlerProps) {
  if (!error) {
    return <AppError message="Nepoznata greška." />;
  }
  if (isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 404) {
      return <NotFoundBlock message="Ova nekretnina nije pronađena." />;
    }

    if (status === 400) {
      return <BadRequestBlock message="Neispravan zahtjev. Provjerite unos." />;
    }

    if (status === 401 || status === 403) {
      return <Navigate to="/login" replace />;
    }

    return <AppError message={error.message} />;
  }

  // fallback za sve što nije AxiosError
  const message =
    error instanceof Error ? error.message : "Dogodila se greška.";
  return <AppError message={message} />;
}

export default QueryErrorHandler;
