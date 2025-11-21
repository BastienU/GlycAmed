export interface ResponseUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: ResponseUser;
  token: string;
}
