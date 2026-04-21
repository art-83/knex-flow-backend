interface LoginResponseDTO {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
    };
  };
}

export default LoginResponseDTO;
