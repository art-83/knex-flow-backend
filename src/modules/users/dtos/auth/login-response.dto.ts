interface LoginResponseDTO {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export default LoginResponseDTO;
