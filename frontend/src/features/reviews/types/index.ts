import { z } from "zod/v4";
export interface ReviewEstate {
  _id: string;
  user: {
    _id: string;
    email: string;
    profilePictureUrl?: string;
  };
  userFullName: string;
  rating: {
    overall: number;
    cleanliness: number;
    amenities: number;
    host: number;
    location: number;
  };
  comment?: string | null;
  createdAt?: Date; //correct it
  updatedAt?: Date;
}

export interface IReview {
  _id: string;
  user: string;
  estate: string;
  reservation: string;
  userFullName: string;
  rating: {
    overall: number;
    cleanliness: number;
    amenities: number;
    host: number;
    location: number;
  };
  comment?: string;
  editCount: number;
  editDeadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDetailedReview
  extends Omit<IReview, "user" | "estate" | "reservation"> {
  user: { firstName: string; lastName: string };
  estate: { title: string };
  reservation: { startDate: string; endDate: string };
}

export const createReviewDto = z.object({
  comment: z.string().optional(),
  rating: z.object({
    overall: z.number().min(1).max(10),
    cleanliness: z.number().min(1).max(10),
    amenities: z.number().min(1).max(10),
    host: z.number().min(1).max(10),
    location: z.number().min(1).max(10),
  }),
});

export type CreateReviewDto = z.infer<typeof createReviewDto>;
