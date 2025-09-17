export interface LoginUserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  isHost?: boolean;
  phoneNumber?: string;
  role: "guest" | "host" | "admin";
  isVerified: boolean;
  isActive: boolean;
  hostType?: "regular" | "business" | "both";
}

export interface AuthState {
  user: LoginUserData | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "failed";
}
