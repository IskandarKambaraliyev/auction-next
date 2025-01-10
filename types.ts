export type User = {
  userId: string;
  userEmail: string;
  userRole: "ADMIN" | "USER";
  userName: string;
} | null;
