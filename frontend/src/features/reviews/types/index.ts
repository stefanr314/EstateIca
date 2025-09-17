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
  createdAt?: Date;
  updatedAt?: Date;
}
