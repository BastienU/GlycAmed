export interface ResponseUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// AuthResponse contient le user safe et le token
export interface AuthResponse {
  user: ResponseUser;
  token: string;
}
