export interface AuthenticateUseCaseRequestDTO {
  email: string;
  password: string;
}

export interface AuthenticateUseCaseResponseDTO {
  role: string;
  userId: string;
}
