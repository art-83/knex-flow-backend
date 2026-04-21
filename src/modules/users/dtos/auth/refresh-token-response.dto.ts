interface RefreshTokenResponseDTO {
  message: string;
  data: {
    accessToken: string;
  };
}

export default RefreshTokenResponseDTO;
