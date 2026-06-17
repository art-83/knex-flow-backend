interface LoginResponseDTO {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}
export { LoginResponseDTO };
